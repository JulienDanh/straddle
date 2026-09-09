# AGENTS.md — Building Learning Content from Source Transcripts

This repo contains poker training transcripts (`transcripts/Simple Poker Systems/*.txt` and `transcripts/Bubble Mastery/*.txt`) converted into
a React + Vite study guide (`poker-app/`). Follow these principles when extending or revising content.

## Source material handling

The source files are verbatim speech-to-text dumps — conversational, repetitive, and
sometimes garbled. Treat them as raw data, not polished prose.

- **Read the full transcript before structuring.** Every system file, end to end,
  before writing any output. The system rules are often stated early, refined in the
  middle, and only fully clear by the end.
- **Extract structure, not narration.** The transcripts narrate hand-by-hand. Your
  job is to distill the *repeating rules* (buckets, risk factors, sizing) from the
  anecdotal examples. The rules are the lesson; the hands are the evidence.
- **Flag garbled specifics.** Some exact range edges or combo counts are
  speech-to-text artifacts (e.g. "King 8 suited and 5s plus"). Encode them faithfully
  but add a note in the output if a number seems ambiguous. Never silently "fix" a
  number you're unsure about.
- **Don't copy the speaker's voice.** The transcripts use filler, hedging, and
  repetition. The output should be terse, declarative, and scannable.

## Content structure (per system)

Every system page follows the same template. Consistency makes the study guide
navigable; variety makes it harder to learn.

1. **Title section** — system name, one-sentence scenario (who opened, who called,
   what decision we're making), and a short intro paragraph.
2. **BoardTable** — a table where each row shows visual board types (rendered with
   `RandomBoard` or `BoardType`) + the action to take (`Action` badge) + a note.
   Group rows by action/frequency (e.g. all "C-bet 100%" boards in one row, all
   "Mix" boards in another). This replaces the old Decision Matrix as the visual
   summary — it's more concrete and shows actual board textures.
3. **Callouts** — 2-3 high-impact points: the key insight, the counter-intuitive
   rule, and the critical distinction.
4. **Risk factor details** — brief text for factors that don't fit in the BoardTable
   (e.g. stack depth, blocker nuances). Keep this short — the BoardTable already
   shows the boards and actions.
5. **Sizing** — one line. Cite the transcript's actual sizing (e.g. "~40% pot" for
   System 1, "1/4 to 1/3 pot" for System 2). Don't mix sizings across systems.
6. **Hand examples** — 4-7 real examples from the transcript. Use `HandExampleCard`
   with `board` and `holeCards` as card-string props (e.g. `board: "Ah9h5h"`,
   `holeCards: "QdJc"`). The component renders them with visual `Board` and
   `HoleCards` components automatically.
7. **Flashcards** — 8-12 Q&A pairs for active recall. Front: the question. Back:
   the answer, one sentence. These test the *rules*, not the anecdotes.
8. **Quiz** — 5-6 multiple-choice questions applying the system to new spots.
   Each has a one-sentence explanation linking back to the rule.

### Anti-duplication rules

- **Each rule lives in exactly one place.** The BoardTable shows the boards and
  actions. The callouts show the key insights. The risk factor details show what
  doesn't fit in the table. Never repeat the same information across sections.
- **No separate Decision Matrix section.** The BoardTable replaces it. Don't add
  a Decision Matrix that restates what the BoardTable already shows.
- **No separate Risk Factors section.** Risk factors are integrated into the
  BoardTable (as the "Mix" rows) with a brief details section for nuance. Don't
  duplicate them as a standalone section.

## Component library

All components live in `poker-app/src/components/ui.tsx` (custom) and
`poker-app/src/components/ui-shadcn/` (shadcn/ui). Import custom components from
`../components/ui` and shadcn components from `@/components/ui-shadcn/`.

### Poker-specific components

- **`Board`** — renders 3-5 community cards as visual card faces. Prop: `cards`
  as a string (e.g. `"AsKd5c"`), optional `size` (`'sm' | 'md' | 'lg'`).
- **`HoleCards`** — renders two hole cards as visual card faces. Prop: `cards`
  as a 4-char string (e.g. `"AsKd"`), optional `size`.
- **`PlayingCard`** — single card face. Props: `card` (e.g. `"As"`), `size`.
- **`BoardType`** — a pill showing a visual board + a texture label. Props:
  `cards?`, `label`, `variant` (`'default' | 'green' | 'orange' | 'red'`),
  `size`.
- **`RandomBoard`** — generates a random flop matching constraints and renders
  it as a `BoardType`. Props: `high` (`'A' | 'K' | 'Q' | 'J' | 'T' | '9'`),
  `suit` (`'monotone' | 'two-tone' | 'rainbow'`), `paired`, `connected`,
  `lowCard` (rank index), `akx`, `label?`, `variant?`, `size?`.
- **`BoardTable`** — a table with `boards` (array of `ReactNode`), `action`
  (`ReactNode`), and `note` (`ReactNode`) per row. Use `RandomBoard` for
  board examples and `Action` badges for the action column.
- **`Action`** — inline colored badge for poker actions. Props: `variant`
  (`'fold' | 'call' | 'raise' | 'allIn' | 'check' | 'bet'`), children = label text.
- **`HandExampleCard`** — renders a hand example with visual board, hole cards,
  tag, verdict, system/solver text. Props: `board` and `holeCards` as card-string
  props (NOT JSX). The component handles rendering internally.
- **Suit components** `S`, `H`, `D`, `C` — colored suit symbols for inline text
  use (e.g. in prose, not in examples — examples use `Board`/`HoleCards`).

### Card string format

All card-related props use a consistent string format:
- Rank: `A K Q J T 9 8 7 6 5 4 3 2` (case-insensitive, normalized to uppercase)
- Suit: `s h d c` (spades, hearts, diamonds, clubs — lowercase)
- Board: `"AsKd5c"` (3-5 cards concatenated, 2 chars each)
- Hole cards: `"QdJc"` (4 chars, two cards)
- Single card: `"As"` (2 chars)

### shadcn/ui components

- **`Button`** — `@/components/ui-shadcn/button`, variants: `default`, `secondary`,
  `outline`, `destructive`, `ghost`, `link`.
- **`Card`** — `@/components/ui-shadcn/card`, exports `Card`, `CardHeader`,
  `CardTitle`, `CardContent`, `CardFooter`.
- **`Accordion`** — `@/components/ui-shadcn/accordion`, used in Sidebar for
  course navigation.
- **`Progress`** — `@/components/ui-shadcn/progress`, used in Quiz.
- Add more: `npx shadcn@latest add <component>` — they land in
  `src/components/ui-shadcn/`. Fix the `cn` import: change `from "cn"` to
  `from "@/lib/utils"`.

## Writing for learning

- **Buckets before nuance.** Lead with the 2-3 categories the system uses. Put
  exceptions and risk factors *after* the default rule. A learner who only remembers
  the buckets will get most decisions right; the nuance is for edge cases.
- **Name the heuristic, then explain it.** "Bet top, bet bottom, check middle" is
  stickier than "polarize your range by betting strong and weak hands while checking
  medium-strength holdings." The short phrase is the memory hook.
- **Contrast pairs explicitly.** "High-high-low is NOT a risk factor; high-low-low
  (paired low under high) IS." The distinction is the lesson. Don't state one without
  the other.
- **State the counter-intuitive rule boldly.** "Bet MORE when shallow, not less."
  Most players get this wrong — that's why it's a system. Call out the leak it
  corrects.
- **Use callouts for the highest-impact points.** Green for insights, orange for
  warnings/leaks, red for critical distinctions. Don't overuse them — reserve for
  the 2-3 things per system that a student must not miss.
- **Hand examples prove the system works.** Each example should show: the board, what
  the system says, what the solver says, and whether they agree. Disagreements are
  fine and should be noted honestly ("solver mixes here; author would pure-call").
- **Flashcards test rules, not trivia.** "What are the two flop buckets?" not "What
  did the solver say on the K83 board?" The rules transfer; the anecdotes don't.
- **Quiz questions apply, don't recite.** Give a new board/hand and ask for the
  action. The student has to run the system, not remember a slide.

## Build conventions

- **React + Vite + TypeScript + Tailwind v4 + shadcn/ui.** The app lives in
  `poker-app/`. No `global.css` — all styling is in `src/styles/tailwind.css`
  (Tailwind utilities + `@theme` tokens + `@layer base` for element styles).
- **Page content** lives in `poker-app/src/pages/*.tsx`. Each page is a React
  component that imports from `../components/ui` and renders sections inline.
- **Routing:** hash-based router in `App.tsx` (`#s1`, `#bm1`, etc.). No
  react-router. Pages are mapped in a `PAGES` record.
- **Sidebar nav:** `src/components/Sidebar.tsx` — uses shadcn `Accordion` for
  course navigation. Also exports `Flashcards` and `Quiz` components.
- **Range Viewer:** `src/pages/RangeViewer.tsx` + `src/pages/solutionParser.ts`
  — a solver-data browser (not a product priority, user has GTO Wizard).
  `src/components/RangeGrid.tsx` is a reusable range grid component.
- **Design System page:** `src/pages/DesignSystem.tsx` — demos all components.
  Visit `#sandbox` to see every component in action.
- **Path alias:** `@/*` maps to `src/*` (configured in `tsconfig.app.json` and
  `vite.config.ts`).
- **Deploy:** GitHub Actions builds `poker-app/` and deploys `dist/` to Pages.
  Base path is `/straddle/` (set in `vite.config.ts`).
- **Develop locally:** `cd poker-app && npm run dev`.
- **Build:** `cd poker-app && npm run build` (runs `tsc -b && vite build`).
- **Lint:** `cd poker-app && npm run lint` (uses `oxlint`).

## What to avoid

- **No solver-output memorization.** The source explicitly warns against treating
  solver outputs as "answers at the back of the book." The systems are human-
  executable heuristics, not solver replicas. Frame them as such.
- **No filler prose.** If a sentence doesn't carry a rule, a distinction, or a
  reason, cut it. The study guide is for scanning and recall, not reading cover to
  cover.
- **No unsourced claims.** Every rule should trace to a statement in a transcript.
  If you're inferring a rule, say so or leave it out.
- **No emoji or decorative styling.** The tags, callouts, and action badges carry
  the visual hierarchy. Adding icons or color beyond the defined palette makes it
  harder to scan, not easier.
- **No mixing sizings across systems.** System 1 is ~40% pot. System 2 is 1/4 to
  1/3 pot. Don't generalize — cite the transcript.
- **No JSX in example data.** `HandExample` takes `board` and `holeCards` as
  card strings (e.g. `"Ah9h5h"`, `"QdJc"`), not JSX elements. The
  `HandExampleCard` component renders them with `Board` and `HoleCards`.
- **No standalone Decision Matrix or Risk Factors sections.** Use `BoardTable`
  instead — it's more visual and groups by action.
