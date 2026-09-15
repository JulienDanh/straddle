# AGENTS.md — Building Learning Content from Source Transcripts

The course transcripts and their structured extracts (licensed, **private** — they live in the nested `straddle-solutions` submodule: `straddle-solutions/transcripts/` for the raw files, `straddle-solutions/extracted/` for the structured .md) are converted into a React + Vite study guide built as a monorepo under `packages/`. Follow these principles when extending or revising content.

## Monorepo structure

```
packages/
├── design-system/   — UI components, Storybook, styles (npm workspace: @poker/design-system)
│   └── src/
│       ├── components/
│       │   ├── ui.tsx              — barrel re-export (import from here)
│       │   ├── ui-parts/
│       │   │   ├── primitives.tsx   — Section, Callout, Tag, Action, Small, Code
│       │   │   ├── cards.tsx        — H, HoleCards, Board, BoardType
│       │   │   ├── tabs.tsx         — tab switcher (Study / Examples / range panels)
│       │   │   ├── pyramid.tsx      — Hand-strength pyramid visual
│       │   │   ├── stack-matrix.tsx — Preflop ICM stack-depth grid
│       │   │   ├── data-table.tsx   — Styled table component
│       │   │   ├── hand-example.tsx — Walkthrough example card
│       │   │   ├── board-example.tsx— Walkthrough card wired to a solved postflop range
│       │   │   └── decision-tree.tsx— React Flow decision tree (with dagre layout)
│       │   ├── ui-shadcn/          — shadcn/ui components (button, card, accordion)
│       │   ├── RangeGrid.tsx       — 13x13 combo grid (GTO Wizard format); owns the RANKS/HAND_GRID layout constants
│       │   ├── styles/tailwind.css     — Tailwind v4 theme tokens + base styles
│       └── stories/               — Storybook stories for all components
├── ranges/          — the shared range store (not an npm workspace; data only)
│   ├── data/<position>/       — one folder per hero position (utg/, utg1/, lj/, hj/, co/, btn/, sb/, bb/),
│                                one JSON per preflop line (rfi.json, vs-utg.json, vs-btn.json).
│                                Shared title/position at the top of the file; `stacks` holds one entry
│                                per depth (type, subtitle, stack, actions, sizings) — cEV, ICM and the
│                                asymmetric ICM-covered/ICM-covering entries all live here
│                                (loaders split and combine them by type); postflop nest
│                                under the preflop entry they derive from as its `postflop` array —
│                                minimal children (id, label, line, actions, sizings), with
│                                title/subtitle/type/stack/position and the GTO Wizard link
│                                derived at load (the S1 c-bet spots
│                                sit on the 40bb UTG RFI entry). Neutral home read by the app. Edit here.
│   └── see below (SUBMODULE) — the private straddle-solutions submodule lives at the repo root:

`straddle-solutions/` (root, gitlink pinned in this repo, never committed here): raw solution captures in solutions/, the retrieval pipeline in scripts/ (fetch_browser/gw_to_store/gw_order/gw_catalog — see add-range skill), and the course transcripts in transcripts/ (licensed)
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

Not all poker systems are the same. The transcript teaches three different kinds, and each needs a different Study layout. Don't force every system into the same template.

### 1. Board-texture systems (S1-S4, S6, S7, S9, S12, BM8-BM11)

The core skill: see a board → classify into a bucket → check risk factors → execute action.

- **Board-texture systems (S1-S4, S6, S7, S9, S12, BM8-BM11)** — `DecisionTree` (React Flow canvas, left-to-right flow, dagre auto-layout). The tree shows the classification *process*, not just the answers; each leaf carries a boards toggle — the selected leaf's example boards render in a strip below the tree (never a popover: the scroll-clipped canvas would crop it). The canvas sizes itself to the tree. Key callouts visible below the tree. Risk factor details, sizing as visible compact sections (`Subhead` + tight prose or a `DataTable`) — no dropdowns.

### 2. Hand-strength systems (S5, S8, S10, S11)

The core skill: know your hand's tier in a hierarchy → bet/check/raise based on tier.

- **Hand-strength systems (S5, S8, S10, S11)** — `Pyramid` (for S5 — vertical tier diagram, medium highlighted) or visible `DataTable` (for S8, S10, S11 — sizing/blocker tables). Key callouts visible. Details as visible compact sections (`Subhead` + tight prose or a `DataTable`) — no dropdowns.

### 3. Preflop ICM systems (BM1-BM7)

The core skill: know your stack vs their stack → adjust open/defend range.

- **Preflop ICM systems (BM1-BM7)** — `StackMatrix` (color-coded grid: your stack × opponent stack, cells show VPIP% + action). Key callouts visible. Details as visible compact sections (`Subhead` + tight prose or a `DataTable`) — no dropdowns.

## Content structure (per system)

Every system page is a single continuous page (no Study/Examples tabs) — study material and worked examples read as one experience.

1. **Title + intro paragraph** — system name, one-sentence scenario, short intro. **Always visible.** Immediately followed by the `Leak` panel — the mistakes the system corrects frame the page before the visual does.
2. **Study content:**
   - Core visual (DecisionTree / Pyramid / StackMatrix / DataTable) — **always visible**
   - 1-2 key callouts — **always visible**
   - Detail sections (heuristics, risk factors, sizing, exceptions) — **visible compact sections**: small `Subhead` + tight prose or a `DataTable`; **no dropdowns**
3. **`<Subhead>Examples</Subhead>` + `ExampleBrowser`** — the worked examples, master-detail (left list of boards, selected card on the right). Cards are `BoardExample` (side-by-side example/solution columns) or `HandExample` walkthroughs.
4. **`<Subhead>Ranges</Subhead>` + `Tabs`** (S1/S2 only) — the preflop range browsers behind a small tab switcher. `Tabs` is for reference panels, never for Study/Examples.

### Anti-duplication rules

- **Each rule lives in exactly one place.** The visual shows the decision; callouts show the key insight; compact sections show the detail. Never repeat the same information across sections.
- **No standalone Decision Matrix or Risk Factors sections.** The visual replaces them.

## Component library

Import components from `@poker/design-system/src/components/ui` (the barrel) or directly from submodules. In `study-app`, the alias `@poker/design-system/src` maps to `packages/design-system/src` (configured in `vite.config.ts`).

### Page structure components

- **`Section`** — wraps a page. Props: `title`, `children`.
- **`Tabs`** — tab switcher for multi-panel pages (Examples, range browsers). Props: `tabs` (array of `{ label, content }`), `defaultIndex`.
- **`Callout`** — high-impact highlight. Props: `variant` (`'default' | 'warn' | 'bad' | 'good'`), `children`.
- **`Leak`** — the "most players do X, should do Y" panel: red accent, one row per leak with the correction in green after an arrow. Props: `title?` (default "Common leaks"), `items` (`[leak, fix?][]` — the mistake, then the correction). Use it for every common-leaks list; reserve `Callout` for insights.
- **`DataTable`** — styled table. Props: `columns` (array of `{ header, width? }`), `rows` (array of `ReactNode[]`), `compact?`.
- **`HandExample`** — a single hand walkthrough with visual structure. Props: `spot` (board/position/stack description), `action` (label text), `actionVariant` (`'bet' | 'check' | 'fold' | 'call' | 'raise' | 'allIn'`), `children` (reasoning). Use for walkthrough-only examples — buckets with no solved board in the store, or spots without a board to render.
- **`BoardExample`** — a hand walkthrough connected to its solved postflop strategy, stacked: the **Example** header on top (spot, `ActionTrail` — the preflop line that led to the spot as chips: position-labelled `Action` badges, muted arrows — SYSTEM action badge, reasoning) and, when solved, the **Solution** section below it at full card width (GTO action shares of the parent open computed from the stored range at render — never hardcoded numbers — the GTO Wizard link, and the full strategy grid weighted by the open). No prose restating solver numbers — the badges and grid ARE the solver's description. The board is NOT rendered in the card — `ExampleBrowser` shows it in its list; the `board` prop exists for the browser to read. Use it for every example board that has a solved spot in the range store.
- **`ActionTrail`** — the preflop line leading to a spot, as chips. Props: `steps` (`TrailStep[]` from a `SolvedFlop.trail`): `{ pos, act, variant }` where `variant` is an `Action` color. Trails carry only the preflop actions (e.g. "UTG Raise 2bb → BB Call"); the depth lives in the spot label, flop sizings in the GTO badges.
- **`ExampleBrowser`** — the master-detail wrapper for a system's Examples tab. Takes `BoardExample`/`HandExample` cards as `children` and renders a left-hand list (mini board + spot label + `Solved`/`Walk` tag) with the selected card on the right; below `lg` the list becomes a horizontal scroll strip above the card. Only the selected card renders, so a page of examples no longer stacks a wall of grids. Non-card children are ignored — keep intro/caveat paragraphs outside the wrapper.

### Visual system components

- **`DecisionTree`** — React Flow canvas showing the classification process. Uses dagre for auto-layout (left-to-right). Props: `root` (nested `DecisionNode` with `question`, `hint?`, `yes?`/`no?` leading to either sub-nodes or `DecisionLeaf` with `action`, `actionVariant`, `reason`, `boards?`). Each leaf has a boards toggle; the boards render in a strip below the canvas. Includes MiniMap, dot background, arrow markers. No zoom (auto-fit on load).
- **`Pyramid`** — vertical tier diagram for hand-strength systems. Props: `tiers` (array of `{ label, action, why, variant }`), `highlight?` (index of highlighted tier).
- **`StackMatrix`** — color-coded grid for preflop ICM. Props: `rows` (array of `{ label, cells }` where each cell has `content` and `variant?`), `colLabels`, `rowAxisLabel?`, `colAxisLabel?`.

### Poker-specific components

- **`Board`** — renders 3-5 community cards as visual card faces. Prop: `cards` as a string (e.g. `"AsKd5c"`), optional `size` (`'sm' | 'md' | 'lg'`).
- **`HoleCards`** — renders two hole cards as visual card faces. Prop: `cards` as a 4-char string (e.g. `"AsKd"`), optional `size`.
- **`PlayingCard`** — single card face. Props: `card` (e.g. `"As"`), `size`.
- **`BoardType`** — a pill showing a visual board + a texture label. Props: `cards?`, `label`, `variant` (`'default' | 'green' | 'orange' | 'red'`), `size`.
- **`Action`** — inline colored badge for poker actions. Props: `variant` (`'fold' | 'call' | 'raise' | 'allIn' | 'check' | 'bet'`), children = label text.
- **`H`** — colored heart suit symbol for inline text. Only `H` exists; no `S`/`D`/`C` suit components.

### Range components (for future use in courses)

- **`RangeBrowser`** — the standard way to display stored ranges, single stack or many. Props: `ranges` (array of `StoredRange`), `defaultStack?`, `defaultType?` (the scenario a teaching page opens on when passed the full line). Renders a bordered chart panel: header strip with spot name and a depth ladder, range grid inside. Multiple solution types render as scenario groups — `Equal stacks` (ChipEV/ICM/final table), `You cover them`, `They cover you (deep)`/`(similar)` — the group label carries the direction, the pill the model; with a single group it collapses to the plain pill row. The depth ladder shows only the active scenario's depths (every pill live, no cross-type support map); switching scenario snaps to the nearest solved depth. Entries with `postflop` children get a board selector under the header (preflop open plus the solved flops grouped by the child's `line`, e.g. "Cbet vs BB call", switching the grid to that child's strategy). Pass grouped constants from `data/ranges.ts` — **curated per page**: chip-EV system pages pass the `_CEV` slices; BM pages pass the scenario they teach (`_EQUAL` = cEV + ICM equal-stacks, `_COVERED`/`_COVERING`, `_BUBBLE` = bubble solutions incl. asymmetric, no final table). The FULL lines (`UTG_RFI`, `SB_RFI`, …) belong to the Range Library page, not system pages.
- **`RangeGrid`** — 13x13 combo grid underneath RangeBrowser. Use directly only for compact inline grids or multi-action demos; props: `title`, `subtitle`, `fold`, `call`, `raise`, `allIn`, `check`, `bet` (comma-separated combo strings), `base`, `compact`. `base` (combo:freq line of the parent open) makes legend percentages weighted shares of that range instead of all 1326 combos — used for postflop children.
- **`packages/ranges/data/`** — the single machine-readable range store (the neutral home: read by the app). One JSON per preflop line (e.g. `utg/rfi.json`, `bb/vs-btn.json`): shared `title`/`position` at the top, `stacks` with one entry per depth — per-action combo:freq strings preserved (raise/call/allIn separately). Postflop solutions are minimal children nested under the preflop entry they derive from (`postflop` array, matched by `id`); the loaders materialize the full `StoredRange` display shape (`materializeLine`/`materializeChild` in design-system `data/ranges/types.ts`). Edit these files; new stack depths are new `stacks` entries.
- **`data/ranges/*.ts` (design-system)** — thin loaders that materialize the store into `StoredRange`s (injecting the shared title/position and converting postflop pastes to conditional), re-exporting the constants (`UTG_RFI_CEV`, `BB_VS_UTG_CEV`); solved flops are bundled as `SolvedFlop`s (`solvedFlop` in `data/ranges/types.ts`: child + parent reach line + action trail) for the `BoardExample` cards — one loader file per system (`s1-flops.ts` ... `s12-flops.ts`), with per-board provenance comments carrying the weighted shares. The barrel is `data/ranges/index.ts`. Don't put range data here.
- **`RangeGrid.tsx`** — also owns the 13x13 hand-grid layout constants (`RANKS`, `HAND_GRID`) used to map combo strings onto grid cells. Every legend action carries two copy buttons: `copy` (class:freq — PioViewer paste format) and `upi` (1326 space-separated weights in PioSOLVER's canonical hand order, for `set_range` over the Universal Poker Interface) — see "Range text formats" below.

### Range store updates

Postflop children store the **raw GTO Wizard range-view copy verbatim** — no math at import time. The app converts to conditional strategies at load (`toConditional` in design-system `data/ranges/types.ts`): divides out the parent open weights, rounds to 4dp, clamps >= 0.9995 to 1, and synthesizes the missing bet/check complement, so a bet-only paste still displays the checks. Children are minimal (`id`, `label`, `line`, `wizardUrl`, `actions`, `sizings`) — the context (title/subtitle/type/stack/position) is derived at load by `materializeChild`.

Adding or updating solved spots (flops, preflop stack entries) is the `add-range` skill's job (`.vibe/skills/add-range/`) — it carries the validation procedure (coverage vs the open range minus board-blocked combos, weighted-format check), the metadata derivation (id/label/subtitle), and the weighted-% formula used to verify the shares the card badges render. Load it whenever a Wizard paste needs storing.

Raw pastes live in `straddle-solutions/imports/` (private submodule, licensed data). BB-facing-bet flop nodes (defend lines) are now a supported store line: `Defend vs {OP} c-bet`, `Defend vs SB stab`, `Defend vs {OP} 3-bet c-bet`, `vs BB check-raise` — children weighted by the parent's call/check line, carrying the villain's bet in `node` (the flop history, e.g. "X-R1.5"), materialized via the line context map (`lineContext` in `data/ranges/types.ts`). Wizard links are NOT stored — the loaders build them from the entry's own data (`preflopUrl`/`flopUrl` in design-system `data/ranges/types.ts`: stack+0.125 depth, the line's preflop actions and node index, and for flops the board texture picking the report tab). Rendered by RangeBrowser's header and the `BoardExample` solved cards.

### Card string format

All card-related props use a consistent string format:
- Rank: `A K Q J T 9 8 7 6 5 4 3 2` (case-insensitive, normalized to uppercase)
- Suit: `s h d c` (spades, hearts, diamonds, clubs — lowercase)
- Board: `"AsKd5c"` (3-5 cards concatenated, 2 chars each)
- Hole cards: `"QdJc"` (4 chars, two cards)
- Single card: `"As"` (2 chars)

### Range text formats (solver interchange)

Every rendered range can leave the app in two canonical text formats — the `copy` / `upi` buttons on each RangeGrid legend action:

| Format | Shape | Where it's used |
|---|---|---|
| class:freq | `AA:1,AKs:0.35,KQo:0.25` — 169 hand classes, 0-1 weights, per-class averaged over combos | PioViewer's paste-range box; also the shape BBZ's own pioData strings use |
| UPI weights | 1326 space-separated floats `0 0.2692 1 ...` | PioSOLVER `set_range <IP|OOP>` over the Universal Poker Interface (stdin/stdout protocol, UPI docs at piosolver.com/docs/upi/) |

The UPI order is fixed: deck order (ranks `2..A`, suits `c d h s`), later card first in each pair — Pio documents it as `"2d2c 2h2c 2h2d ..."`. This is the SAME order as `combo_order()` in `straddle-solutions/scripts/gw_order.py`, so all three (store combo:freq strings, the RangeGrid `upi` button, and the scripts) share one mapping. Scripts driving a solver should still assert once against the solver's own `show_hand_order` output before mass-solving.

The **GTO Solver page** (`study-app/src/pages/Solver.tsx` + `pages/solver/` — Setup and Solution views, sidebar "GTO Solver") is a workbench against a UPI bridge. Setup configures board / ranges / stacks / per-street-per-position sizings (with localStorage presets); Solution shows the table visualizer, the street action tree (click a node row to show its strategy, click an action badge to walk to that action's node), the strategy matrix and a client-side made-hand category breakdown. With no bridge connected, CALCULATE renders a demo solution. The bridge is a local HTTP wrapper; the reference implementation is **`cuda-poker-solver/python/upi_bridge.py`** (submodule) driving the pps GPU postflop solver — run it with the env that has the built `pps` native module (stdlib HTTP server, no web-framework deps). Sizes are sent as `set_bet_sizes <street> <OOP|IP> bets=<csv> raises=<csv>` (percent-of-pot, keyed because a bare csv cannot be split into bets/raises); the bridge builds the tree from the FLOP OOP sizes (the pps engine takes a single bet config for the whole tree — bet fracs are %/100, a raise % becomes a multiple of the first bet size, min 2). Assumed contract — `POST {url}/upi` with `{"commands": string[]}` returning `{"responses": string[]}` (sequential, same solver state, `ERROR` lines preserved; bridge must answer CORS preflights; `show_children_actions` normalized to one action token per line, `show_strategy` to one 1326-float line per child in child order). Node ids are action paths: `r:0` is the root, a child is `<parent>:<token>`; chance deals are transparent — the bridge follows one representative runout per deal, so `show_node` reports the node's actual board. Default endpoint `http://127.0.0.1:8500`, persisted in localStorage. https pages may call http://localhost (potentially-trustworthy origin), so the deployed site can drive a local bridge.

Batch conversion (no UI needed): `straddle-solutions/scripts/store_to_upi.py` — reads any wizard-schema line JSON (`straddle-solutions/bbz/store/` or `packages/ranges/data/`) and emits UPI weight arrays per action per stack entry (`--json` for a dump, `--type`/`--stack`/`--action` filters). Reading solver output back: `show_strategy`/`show_range` return the same 1326-float shape — on boards, board-blocked combos read back as 0 and ingestion should skip them, not treat them as "never plays".

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

## What to avoid

- **No solver-output memorization.** The source explicitly warns against treating solver outputs as "answers at the back of the book." The systems are human-executable heuristics, not solver replicas. Frame them as such.
- **No filler prose.** If a sentence doesn't carry a rule, a distinction, or a reason, cut it. The study guide is for scanning and recall, not reading cover to cover.
- **No unsourced claims.** Every rule should trace to a statement in a transcript. If you're inferring a rule, say so or leave it out.
- **No emoji or decorative styling.** The tags, callouts, and action badges carry the visual hierarchy. Adding icons or color beyond the defined palette makes it harder to scan, not easier.
- **No mixing sizings across systems.** System 1 is ~40% pot. System 2 is 1/4 to 1/3 pot. Don't generalize — cite the transcript.
