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
navigable; variety makes it harder to learn. The page is ordered so the visual
summary comes first, then the detail, then the practice.

1. **Title section** — system name, one-sentence scenario (who opened, who called,
   what decision we're making), and a short intro paragraph.
2. **Decision Matrix** — a color-coded grid at the top. Rows = categories (flop
   types, hand types, stack depths). Columns = conditions (default / with risk
   factor, or with draws / without). Cells are color-coded: green = do it,
   orange = mix/caution, red = fold/don't. Each cell has a bold action label
   and a short sub. This is the visual summary the student sees first — find
   your row, scan across, know the action. Do NOT repeat the matrix content in
   callouts or prose below; it lives here once.
3. **Core rules / buckets** — the primary decision framework as tables. This is
   the canonical source for the rules. If the matrix says "see risk factors
   below," this is where the detail lives.
4. **Risk factors / exceptions** — what overrides the default rule, as a table.
   Always separate "primary" from "secondary" if the source does.
5. **Sizing** — a short paragraph or table. Include the default and the
   reasoning.
6. **Hand examples** — 4-7 real examples from the transcript. Each shows the
   board, the system's recommendation, and the solver's verdict. Tag each with
   the decision type (default / risk / fold / call) using colored pills.
7. **Flashcards** — 8-12 Q&A pairs for active recall. Front: the question. Back:
   the answer, one sentence. These test the *rules*, not the anecdotes.
8. **Quiz** — 5-6 multiple-choice questions applying the system to new spots.
   Each has a one-sentence explanation linking back to the rule. The quiz
   requires *applying* the system, not reciting it.

### Anti-duplication rules

- **Each rule lives in exactly one place.** The canonical section (table, list,
  or opening callout) owns the full statement. The matrix shows the decision;
  the detail lives in the rules section. Never copy-paste a table row into a
  matrix cell — use a short pointer like "See risk factors below" instead.
- **No closing callouts under the matrix.** Do not add a callout after the
  decision matrix that restates the opening thesis. The thesis is already
  stated in the title section or the core rules. The matrix ends clean.

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

- **React + Vite + TypeScript.** The app lives in `poker-app/`. Page content
  (sections, tables, matrices, examples) lives in `poker-app/src/pages/*.html`
  and is loaded at build time via Vite's `import.meta.glob` raw imports.
- **Flashcard and quiz data** live in `poker-app/src/data/content.ts` as typed
  exports (`flashcards`, `quizzes`, `navTitles`).
- **Components:** `Sidebar` (nav), `Flashcards` (flip cards), `Quiz` (scored
  quiz), `SystemPage` (loads HTML content + injects React components for
  flashcards/quiz).
- **Styles:** `poker-app/src/styles/global.css` — all CSS in one file, ported
  from the original vanilla version.
- **Deploy:** GitHub Actions builds `poker-app/` and deploys `dist/` to Pages.
  Base path is `/straddle/` (set in `vite.config.ts`).
- **Develop locally:** `cd poker-app && npm run dev`.

## What to avoid

- **No solver-output memorization.** The source explicitly warns against treating
  solver outputs as "answers at the back of the book." The systems are human-
  executable heuristics, not solver replicas. Frame them as such.
- **No filler prose.** If a sentence doesn't carry a rule, a distinction, or a
  reason, cut it. The study guide is for scanning and recall, not reading cover to
  cover.
- **No unsourced claims.** Every rule should trace to a statement in a transcript.
  If you're inferring a rule, say so or leave it out.
- **No emoji or decorative styling.** The tags and callouts carry the visual
  hierarchy. Adding icons or color beyond the defined palette makes it harder to
  scan, not easier.
