# AGENTS.md — Building Learning Content from Source Transcripts

This repo contains poker training transcripts (`transcripts/Simple Poker Systems/*.txt` and `transcripts/Bubble Mastery/*.txt`) converted into a React + Vite study guide built as a monorepo under `packages/`. Follow these principles when extending or revising content.

## Monorepo structure

```
packages/
├── design-system/   — UI components, Storybook, styles (npm workspace: @poker/design-system)
│   └── src/
│       ├── components/
│       │   ├── ui.tsx              — barrel re-export (import from here)
│       │   ├── ui-parts/
│       │   │   ├── primitives.tsx   — Section, Callout, Tag, Action, Small, Code
│       │   │   ├── cards.tsx        — H, HoleCards, Board, BoardType, RandomBoard
│       │   │   ├── tabs.tsx         — Study/Practice tab switcher
│       │   │   ├── collapsible.tsx  — Collapsible detail sections
│       │   │   ├── pyramid.tsx      — Hand-strength pyramid visual
│       │   │   ├── stack-matrix.tsx — Preflop ICM stack-depth grid
│       │   │   ├── data-table.tsx   — Styled table component
│       │   │   └── decision-tree.tsx— React Flow decision tree (with dagre layout)
│       │   ├── ui-shadcn/          — shadcn/ui components (button, card, accordion)
│       │   ├── PracticeFlow.tsx   — unified quiz + Q&A with mode toggle
│       │   ├── quiz-shared.ts      — shared helpers for quiz components
│       │   ├── RangeGrid.tsx       — 13x13 combo grid (GTO Wizard format)
│       │   └── solutionParser.ts   — parses GTO Wizard JSON solution files
│       ├── styles/tailwind.css     — Tailwind v4 theme tokens + base styles
│       └── stories/               — Storybook stories for all components
├── ranges/          — the shared range store (not an npm workspace; data only)
│   ├── data/<position>/       — one folder per hero position (utg/, btn/, bb/, s1/), one JSON per spot
│                                inside it: utg/rfi.json, btn/rfi.json, bb/vs-utg.json, bb/vs-btn.json,
│                                utg/cbet-vs-bb.json. StoredRange-shaped entries (title, subtitle,
│                                type: 'cEV'|'ICM', stack, position, actions) with per-action combo:freq
│                                strings; ICM entries land in the same file. Neutral home read by both
│                                the app and the solver (s1-cbet embeds it via include_str!). Edit here.
│   └── imports/                — raw pastes / fetches (gitignored: licensed data)
├── gto/             — Rust solver scripts (cargo package, not an npm workspace)
│   ├── Cargo.toml            — postflop-solver git dependency, serde_json (parses the shared range store)
│   ├── src/lib.rs            — SpotConfig + solve/dump helpers shared by the scripts
│   ├── src/bin/              — solve.rs (generic spot CLI), s1-cbet.rs (System 1 spot)
│   ├── spots.json             — recompute manifest for every solved spot (the solver recipe is the storage; outputs are regenerated, not committed)
│   └── scripts/               — replay-spots.py (re-solve every spot in spots.json)
└── study-app/       — pages, App, Sidebar (npm workspace: @poker/study-app)
    └── src/
        ├── App.tsx                — hash-based router, PAGES record
        ├── pages/                  — one .tsx per system page (S1–S12, BM1–BM11, etc.)
        ├── components/Sidebar.tsx  — accordion nav
        └── styles/tailwind.css     — @source directive scans design-system classes
```

- **Run locally:** `npm run dev` (from repo root — serves study-app at localhost:5173)
- **Build:** `npm run build` (builds study-app) or `npm run build-all` (storybook + app)
- **Storybook:** `npm run storybook` (localhost:6006)
- **Deploy:** GitHub Actions builds both, deploys app to `github.io/JulienDanh/straddle/` and storybook to `/straddle/storybook/`. Base path is `/straddle/`.

## Three system types

Not all poker systems are the same. The transcript teaches three different kinds, and each needs a different Study tab layout. Don't force every system into the same template.

### 1. Board-texture systems (S1-S4, S6, S7, S9, S12, BM8-BM11)

The core skill: see a board → classify into a bucket → check risk factors → execute action.

- **Study tab:** `DecisionTree` (React Flow canvas, left-to-right flow, dagre auto-layout). The tree shows the classification *process*, not just the answers. Each leaf has collapsible example boards. Key callouts visible below the tree. Risk factor details, sizing in `Collapsible`.
- **Practice tab:** `PracticeFlow` with both board-spot quiz (visual board → action) and rule Q&A.

### 2. Hand-strength systems (S5, S8, S10, S11)

The core skill: know your hand's tier in a hierarchy → bet/check/raise based on tier.

- **Study tab:** `Pyramid` (for S5 — vertical tier diagram, medium highlighted) or visible `DataTable` (for S8, S10, S11 — sizing/blocker tables). Key callouts visible. Details in `Collapsible`.
- **Practice tab:** `PracticeFlow` with both quiz + Q&A (S5, S8, S11 have board-spot quizzes; S10 is Q&A only).

### 3. Preflop ICM systems (BM1-BM7)

The core skill: know your stack vs their stack → adjust open/defend range.

- **Study tab:** `StackMatrix` (color-coded grid: your stack × opponent stack, cells show VPIP% + action). Key callouts visible. Details in `Collapsible`.
- **Practice tab:** `PracticeFlow` with Q&A only (no board-spot quiz — these are preflop decisions with no board to show).

## Content structure (per system)

Every system page follows the same template, with the Study tab varying by system type.

1. **Title + intro paragraph** — system name, one-sentence scenario, short intro. **Always before the Tabs** so it's visible without clicking.
2. **Tabs** — Study / Practice tab switcher.
3. **Study tab:**
   - Core visual (DecisionTree / Pyramid / StackMatrix / DataTable) — **always visible, never in Collapsible**
   - 1-2 key callouts — **always visible**
   - Detail sections (risk factors, sizing, exceptions) — **in Collapsible**
4. **Practice tab:** `PracticeFlow` with quiz (if board-dependent) and/or questions.

### Anti-duplication rules

- **Each rule lives in exactly one place.** The visual shows the decision; callouts show the key insight; Collapsibles show the detail. Never repeat the same information across sections.
- **Core concept is never in Collapsible.** The DecisionTree/Pyramid/StackMatrix is the system — it must be visible when the Study tab opens. Only detail goes in Collapsible.
- **No standalone Decision Matrix or Risk Factors sections.** The visual replaces them.

## Component library

Import components from `@poker/design-system/src/components/ui` (the barrel) or directly from submodules. In `study-app`, the alias `@poker/design-system/src` maps to `packages/design-system/src` (configured in `vite.config.ts`).

### Page structure components

- **`Section`** — wraps a page. Props: `title`, `children`.
- **`Tabs`** — Study/Practice tab switcher. Props: `tabs` (array of `{ label, content }`), `defaultIndex`.
- **`Collapsible`** — expandable detail section. Props: `title`, `children`, `defaultOpen`. Use for risk factors, sizing, exceptions — anything that's detail, not core.
- **`Callout`** — high-impact highlight. Props: `variant` (`'default' | 'warn' | 'bad' | 'good'`), `children`.
- **`DataTable`** — styled table. Props: `columns` (array of `{ header, width? }`), `rows` (array of `ReactNode[]`), `compact?`.
- **`HandExample`** — a single hand walkthrough with visual structure. Props: `spot` (board/position/stack description), `action` (label text), `actionVariant` (`'bet' | 'check' | 'fold' | 'call' | 'raise' | 'allIn'`), `children` (reasoning). Use inside a `Collapsible title="Hand Examples"` to show 3-4 real hand walkthroughs per system.

### Visual system components

- **`DecisionTree`** — React Flow canvas showing the classification process. Uses dagre for auto-layout (left-to-right). Props: `root` (nested `DecisionNode` with `question`, `hint?`, `yes?`/`no?` leading to either sub-nodes or `DecisionLeaf` with `action`, `actionVariant`, `reason`, `boards?`). Each leaf has collapsible example boards. Includes MiniMap, dot background, arrow markers. No zoom (auto-fit on load).
- **`Pyramid`** — vertical tier diagram for hand-strength systems. Props: `tiers` (array of `{ label, action, why, variant }`), `highlight?` (index of highlighted tier).
- **`StackMatrix`** — color-coded grid for preflop ICM. Props: `rows` (array of `{ label, cells }` where each cell has `content` and `variant?`), `colLabels`, `rowAxisLabel?`, `colAxisLabel?`.

### Poker-specific components

- **`Board`** — renders 3-5 community cards as visual card faces. Prop: `cards` as a string (e.g. `"AsKd5c"`), optional `size` (`'sm' | 'md' | 'lg'`).
- **`HoleCards`** — renders two hole cards as visual card faces. Prop: `cards` as a 4-char string (e.g. `"AsKd"`), optional `size`.
- **`PlayingCard`** — single card face. Props: `card` (e.g. `"As"`), `size`.
- **`BoardType`** — a pill showing a visual board + a texture label. Props: `cards?`, `label`, `variant` (`'default' | 'green' | 'orange' | 'red'`), `size`.
- **`RandomBoard`** — generates a random flop matching constraints and renders it as a `BoardType`. Props: `high` (`'A' | 'K' | 'Q' | 'J' | 'T' | '9'`), `suit` (`'monotone' | 'two-tone' | 'rainbow'`), `paired`, `connected`, `lowCard` (rank index), `akx`, `label?`, `variant?`, `size?`, `streets?` (3/4/5).
- **`Action`** — inline colored badge for poker actions. Props: `variant` (`'fold' | 'call' | 'raise' | 'allIn' | 'check' | 'bet'`), children = label text.
- **`H`** — colored heart suit symbol for inline text. Only `H` exists; no `S`/`D`/`C` suit components.

### Practice component

- **`PracticeFlow`** — unified quiz + Q&A with mode toggle. Props: `title?`, `quiz?` (with `options` and `scenarios`), `questions?` (array of `{ question, options, correct, explanation }`). When both quiz and questions are provided, a toggle lets the user switch between "Board spots" and "Rules Q&A". Single score counter shared across both modes. When only questions are provided, no toggle shows.

### Range components (for future use in courses)

- **`RangeBrowser`** — the standard way to display stored ranges, single stack or many. Props: `ranges` (array of `StoredRange`), `defaultStack?`. Renders a bordered chart panel: header strip with spot name and a stack selector (hidden when there's only one range), range grid inside. Pass grouped constants from `data/ranges.ts` (e.g. `UTG_RFI_CEV`).
- **`RangeGrid`** — 13x13 combo grid underneath RangeBrowser. Use directly only for compact inline grids or multi-action demos; props: `title`, `subtitle`, `fold`, `call`, `raise`, `allIn`, `check`, `bet` (comma-separated combo strings), `compact`.
- **`packages/ranges/data/`** — the single machine-readable range store (the neutral home: read by both the app and the solver). one JSON per spot (e.g. `utg/rfi.json`, `bb/vs-btn.json`, `utg/cbet-vs-bb.json`) holds that spot's stored ranges as `StoredRange`-shaped entries — per-action combo:freq strings preserved (raise/call/allIn separately). Edit these files; new stack depths are new entries in the JSON arrays.
- **`data/ranges/*.ts` (design-system)** — thin typed loaders over the store, re-exporting the same constants as before (`UTG_RFI_CEV`, `BB_VS_UTG_CEV`, `S1_FLOP_*`); the barrel is `data/ranges/index.ts`. Don't put range data here. The solver reads the store directly — `s1-cbet` embeds it with `include_str!` and pulls the (stack, action) string at runtime, so JSON edits are live on the next `cargo build`.
- **`solutionParser.ts`** — parses GTO Wizard JSON solution exports into `RangeGrid`-compatible combo data. Exports `parseComboData()`, `RANKS`, `HAND_GRID`, and types.

### Solver scripts (`packages/gto`)

Rust crate wrapping [postflop-solver](https://github.com/b-inary/postflop-solver) (Discounted CFR, no abstraction). Not an npm workspace — build with cargo from the repo root:

- `cargo run --release -p gto --bin solve -- --board Kh9s5c --pot 550 --stack 3750 --oop-range "..." --ip-range "..."` — solve any spot (3-5 card board) and dump the root player's strategy. Optional: `--bet-sizes "40%,e,a"`, `--raise-sizes "2.5x"`, `--max-iterations`, `--target` (pot fraction), `--compressed` (halve memory, 16-bit storage), `--out <path>` (write the strategy to a file instead of stdout).
- `cargo run --release -p gto --bin s1-cbet` — System 1 spot (UTG opens 2.5bb, BB calls, BB checks): dumps the BB flop strategy, then UTG's c-bet strategy after a check. Optional iteration count argument and `--out <path>`. Ranges are placeholder constants at the top of the file — replace with the stored `data/ranges` exports when solving for real.

Money amounts are integer chips; use bb*100 so blind fractions stay integral (40bb stack = 4000, 5.5bb pot = 550). Strategy output is one paste-ready line per action in the `data/ranges` combo format (`check 4c3c:0.0009,...`), with bet/raise sizes suffixed (`bet220`). The solver is postflop-only — preflop spots (the BB-vs-UTG stack-depth data) need flop enumeration and are not covered by these scripts.

### Card string format

All card-related props use a consistent string format:
- Rank: `A K Q J T 9 8 7 6 5 4 3 2` (case-insensitive, normalized to uppercase)
- Suit: `s h d c` (spades, hearts, diamonds, clubs — lowercase)
- Board: `"AsKd5c"` (3-5 cards concatenated, 2 chars each)
- Hole cards: `"QdJc"` (4 chars, two cards)
- Single card: `"As"` (2 chars)

### shadcn/ui components

- **`Button`** — `ui-shadcn/button`, variants: `default`, `secondary`, `outline`, `destructive`, `ghost`, `link`.
- **`Card`** — `ui-shadcn/card`, exports `Card`, `CardHeader`, `CardTitle`, `CardContent` (plus `CardFooter`, `CardDescription`, `CardAction` available but unused).
- **`Accordion`** — `ui-shadcn/accordion`, used in Sidebar for course navigation.
- Add more: `npx shadcn@latest add <component>` — they land in `src/components/ui-shadcn/`. The `cn` import is `from "../../lib/utils"` (local `clsx` + `tailwind-merge` wrapper).

## Decision tree guidelines

When building a `DecisionTree` for a board-texture system:

- **Root question must be yes/no.** Not "What is the high card?" but "Is the high card T or higher?"
- **Every branch must lead to a leaf.** No dead-end paths. If a node has `yes`, it must have `no` (or vice versa, but both is better).
- **Example boards must match their leaf's condition.** A leaf reached via "no 3-flush" must not show a monotone board.
- **Keep trees to 3 levels max.** Deeper trees are hard to read. Collapse intermediate questions if needed.
- **Risk factors go in the hint, not as separate question nodes.** E.g. hint: "Monotone · AKx · Paired low under high"

## Writing for learning

- **Buckets before nuance.** Lead with the 2-3 categories the system uses. Put exceptions and risk factors *after* the default rule. A learner who only remembers the buckets will get most decisions right; the nuance is for edge cases.
- **Name the heuristic, then explain it.** "Bet top, bet bottom, check middle" is stickier than "polarize your range by betting strong and weak hands while checking medium-strength holdings." The short phrase is the memory hook.
- **Contrast pairs explicitly.** "High-high-low is NOT a risk factor; high-low-low (paired low under high) IS." The distinction is the lesson. Don't state one without the other.
- **State the counter-intuitive rule boldly.** "Bet MORE when shallow, not less." Most players get this wrong — that's why it's a system. Call out the leak it corrects.
- **Use callouts for the highest-impact points.** Green for insights, orange for warnings/leaks, red for critical distinctions. Don't overuse them — reserve for the 2-3 things per system that a student must not miss.
- **Quiz questions apply, don't recite.** Give a new board/hand and ask for the action. The student has to run the system, not remember a slide.

## What to avoid

- **No solver-output memorization.** The source explicitly warns against treating solver outputs as "answers at the back of the book." The systems are human-executable heuristics, not solver replicas. Frame them as such.
- **No filler prose.** If a sentence doesn't carry a rule, a distinction, or a reason, cut it. The study guide is for scanning and recall, not reading cover to cover.
- **No unsourced claims.** Every rule should trace to a statement in a transcript. If you're inferring a rule, say so or leave it out.
- **No emoji or decorative styling.** The tags, callouts, and action badges carry the visual hierarchy. Adding icons or color beyond the defined palette makes it harder to scan, not easier.
- **No mixing sizings across systems.** System 1 is ~40% pot. System 2 is 1/4 to 1/3 pot. Don't generalize — cite the transcript.
