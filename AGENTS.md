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
│       │   │   └── cards.tsx       — H, HoleCards, Board, BoardType, RandomBoard, BoardTable
│       │   ├── ui-shadcn/          — shadcn/ui components (button, card, accordion)
│       │   ├── StrategyQuiz.tsx   — board-spot practice (show board, ask action, verify)
│       │   ├── StrategyQuestions.tsx — rule Q&A quiz (multiple choice with explanation)
│       │   ├── quiz-shared.ts      — shared helpers for quiz components
│       │   ├── RangeGrid.tsx       — 13x13 combo grid (GTO Wizard format)
│       │   ├── RangePreview.tsx    — RangeBadge component (manual poker notation)
│       │   ├── hand-notation.ts    — poker notation parser (used by RangeBadge)
│       │   └── solutionParser.ts   — parses GTO Wizard JSON solution files
│       ├── styles/tailwind.css     — Tailwind v4 theme tokens + base styles
│       └── stories/               — Storybook stories for all components
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

## Source material handling

The source files are verbatim speech-to-text dumps — conversational, repetitive, and sometimes garbled. Treat them as raw data, not polished prose.

- **Read the full transcript before structuring.** Every system file, end to end, before writing any output. The system rules are often stated early, refined in the middle, and only fully clear by the end.
- **Extract structure, not narration.** The transcripts narrate hand-by-hand. Your job is to distill the *repeating rules* (buckets, risk factors, sizing) from the anecdotal examples. The rules are the lesson; the hands are the evidence.
- **Flag garbled specifics.** Some exact range edges or combo counts are speech-to-text artifacts (e.g. "King 8 suited and 5s plus"). Encode them faithfully but add a note in the output if a number seems ambiguous. Never silently "fix" a number you're unsure about.
- **Don't copy the speaker's voice.** The transcripts use filler, hedging, and repetition. The output should be terse, declarative, and scannable.

## Content structure (per system)

Every system page follows the same template. Consistency makes the study guide navigable; variety makes it harder to learn.

1. **Title section** — system name, one-sentence scenario (who opened, who called, what decision we're making), and a short intro paragraph.
2. **BoardTable** — a table where each row shows visual board types (rendered with `RandomBoard` or `BoardType`) + the action to take (`Action` badge) + a note. Group rows by action/frequency (e.g. all "C-bet 100%" boards in one row, all "Mix" boards in another). This replaces the old Decision Matrix as the visual summary — it's more concrete and shows actual board textures.
3. **Callouts** — 2-3 high-impact points: the key insight, the counter-intuitive rule, and the critical distinction.
4. **Risk factor details** — brief text for factors that don't fit in the BoardTable (e.g. stack depth, blocker nuances). Keep this short — the BoardTable already shows the boards and actions.
5. **Sizing** — one line. Cite the transcript's actual sizing (e.g. "~40% pot" for System 1, "1/4 to 1/3 pot" for System 2). Don't mix sizings across systems.
6. **StrategyQuiz** — board-spot practice: shows a random board, asks the user to pick the correct action, verifies and explains. Uses `RandomBoardProps` scenarios. Replaces the old Hand Examples section.
7. **StrategyQuestions** — rule Q&A: multiple-choice questions with explanations. Tests the *rules*, not the anecdotes. Replaces the old Flashcards and Quiz sections.

### Anti-duplication rules

- **Each rule lives in exactly one place.** The BoardTable shows the boards and actions. The callouts show the key insights. The risk factor details show what doesn't fit in the table. Never repeat the same information across sections.
- **No separate Decision Matrix section.** The BoardTable replaces it. Don't add a Decision Matrix that restates what the BoardTable already shows.
- **No separate Risk Factors section.** Risk factors are integrated into the BoardTable (as the "Mix" rows) with a brief details section for nuance. Don't duplicate them as a standalone section.
- **No closing callouts under the BoardTable.** The thesis is stated in the title section or callouts. The BoardTable ends clean.

## Component library

Import components from `@poker/design-system/src/components/ui` (the barrel) or directly from submodules. In `study-app`, the alias `@poker/design-system/src` maps to `packages/design-system/src` (configured in `vite.config.ts`).

### Poker-specific components

- **`Board`** — renders 3-5 community cards as visual card faces. Prop: `cards` as a string (e.g. `"AsKd5c"`), optional `size` (`'sm' | 'md' | 'lg'`).
- **`HoleCards`** — renders two hole cards as visual card faces. Prop: `cards` as a 4-char string (e.g. `"AsKd"`), optional `size`.
- **`PlayingCard`** — single card face. Props: `card` (e.g. `"As"`), `size`.
- **`BoardType`** — a pill showing a visual board + a texture label. Props: `cards?`, `label`, `variant` (`'default' | 'green' | 'orange' | 'red'`), `size`.
- **`RandomBoard`** — generates a random flop matching constraints and renders it as a `BoardType`. Props: `high` (`'A' | 'K' | 'Q' | 'J' | 'T' | '9'`), `suit` (`'monotone' | 'two-tone' | 'rainbow'`), `paired`, `connected`, `lowCard` (rank index), `akx`, `straightPossible` (1/2/3), `label?`, `variant?`, `size?`.
- **`BoardTable`** — a table with `boards` (array of `ReactNode`), `action` (`ReactNode`), and `note` (`ReactNode`) per row. Use `RandomBoard` for board examples and `Action` badges for the action column.
- **`Action`** — inline colored badge for poker actions. Props: `variant` (`'fold' | 'call' | 'raise' | 'allIn' | 'check' | 'bet'`), children = label text.
- **`H`** — colored heart suit symbol for inline text (e.g. `A<H>♥</H>`). Only `H` exists; no `S`/`D`/`C` suit components.

### Quiz components

- **`StrategyQuiz`** — board-spot practice. Props: `title?`, `scenarios` (array of `{ board: RandomBoardProps, correct: { label, variant }, explanation }`), `options` (array of `{ label, variant }` shared across scenarios). Shows a random board, user picks an action, gets feedback + explanation.
- **`StrategyQuestions`** — rule Q&A quiz. Props: `title?`, `questions` (array of `{ question, options: string[], correct: number, explanation }`). Shuffles order, scores answers, shows explanation after each pick.

### Range components (for future use in courses)

- **`RangeGrid`** — 13x13 combo grid rendered from GTO Wizard action data. Props: `title`, `subtitle`, `fold`, `call`, `raise`, `allIn`, `check` (comma-separated combo strings), `compact`.
- **`RangeBadge`** — compact range display from `RangePreview.tsx`. Takes manual poker notation strings. Click to expand full grid.
- **`solutionParser.ts`** — parses GTO Wizard JSON solution exports into `RangeGrid`-compatible combo data. Exports `parseComboData()`, `RANKS`, `HAND_GRID`, and types.

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
- **No standalone Decision Matrix or Risk Factors sections.** Use `BoardTable` instead — it's more visual and groups by action.
