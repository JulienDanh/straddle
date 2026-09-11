---
name: generate-flashcards
description: >
  Load when generating flashcards from extracted poker study content.
  Reads .md files from extracted/ and outputs a single flashcards.txt file
  with question;answer pairs. Use when the user asks to generate, create,
  or build flashcards from the extracted transcripts.
---

# Generate Flashcards

Convert the structured `.md` files in `extracted/` into a single
`flashcards.txt` file using `question;answer` format (semicolon separator).

## Source

The extracted `.md` files in `extracted/` — frontmatter + structured
sections (Buckets, Decision Rules, Risk Factors, Sizing, Common Leaks,
Hand Examples, Heuristics, Quiz Spots, Rules Q&A, Key Concepts, etc.).

## Output

A single file at `flashcards.txt` in the repo root.

## Format

Each line is one flashcard:

```
question;answer
```

- **Semicolon (`;`) is the separator.** Exactly one per line.
- **No header, no metadata, no system numbers.** Just lines of `q;a`.
- **One card per line.** No multi-line cards.
- **No empty lines between cards.**

## Question style — poker situations, not system references

Every question must embed the full poker context so the card stands alone.
A learner reading the question should know the situation without needing
to know which system it came from.

**Never reference system numbers** (no "In System 1...", no "According to
S5..."). The question describes a poker situation; the answer gives the
correct play and reasoning.

### Good question examples

```
UTG opens, BB calls, BB checks. Flop is T-high rainbow, no risk factors. What's your c-bet strategy?;C-bet 100% with your entire range. Small sizing (~40% pot). T-high+ clean boards have no checking range.
```

```
You c-bet the flop and face a check-raise to 4bb on JJ3 (BTN, 50bb). MDF says fold 38%. What's the actual fold percentage and why?;~18% — lower than MDF because villain's bluffs have real equity. You must defend more than basic MDF to make equity-containing bluffs indifferent.
```

```
BTN opens, BB calls. Flop is 543 two-tone — no card 8 or higher. BTN's offsuit range starts at 8s. What should BTN do?;Check a lot. BTN misses this board badly — not enough value to bet range. Bet top (66+, 87s), check middle (A8, KQ, pairs), bet some bottom with backdoor draws.
```

```
Hero flops top pair from BB at 25bb effective, facing a 1/3 pot c-bet from HJ. What's the correct play?;Check-raise. Below 35bb, top pair check-raises for value protection. Two pair and better trap (check-call) — SPR is low enough to shove river without raising.
```

```
River, you have AQo on J97 → T → 9. Villain checked back the turn (no Jx, sets, two pair). River blanks. What's your play and why?;Bet pot or overbet. Villain's check back on the turn is an inflection point — they're capped. Your AQ is near the relative nuts. Bet large to get stacks in.
```

### Bad question examples (don't do this)

```
What does System 1 say about T-high boards?;C-bet 100%
```
→ No context. Which position? What stack depth? What action?

```
According to System 10, what is relative hand strength?;How strong your hand is vs villain's current range
```
→ References system number. Should describe the situation.

```
What is the pyramid principle?;Bet top, bet bottom, check middle
```
→ Too abstract. Should frame as a poker situation.

## What to extract from each .md section

Turn each section's content into situation-based flashcards:

### Buckets / Decision Rules
Each bucket or rule becomes a card where the question describes the
situation (position, board texture, stack, action) and the answer gives
the correct play + one-sentence reasoning.

### Risk Factors
Each risk factor becomes a card: question describes the board + situation,
answer gives the adjustment and why.

### Sizing
Each sizing rule becomes a card: question describes the situation, answer
gives the size and why.

### Common Leaks
Each leak becomes a card: question describes the situation + the common
mistake, answer gives the correct play.

### Hand Examples
Each hand example becomes a card: question is the spot description +
"what's the correct play?", answer is the action + reasoning.

### Heuristics
Each heuristic becomes a card: question describes a situation where the
heuristic applies, answer is the heuristic + brief explanation.

### Quiz Spots
Each quiz spot becomes a card directly: question is the board/scenario,
answer is the correct action + explanation.

### Rules Q&A
Each Q&A becomes a card, reworded to embed context and remove system
references.

### Key Concepts (primers)
Each concept becomes a card: question describes the concept in a poker
context, answer gives the definition + application.

## Volume

Aim for 8-15 cards per system .md file. With 28 extracted files, the
total should be roughly 250-350 cards.

## Guidelines

1. **Read each .md file fully** before generating cards from it.
2. **Every question must stand alone** — no "this system", no "as
   mentioned above", no system numbers.
3. **Embed the situation** — position, board texture, stack depth,
   street, action so far. The learner should picture the spot.
4. **Answers are concise** — one sentence, maybe two. The reasoning
   should fit on the back of a mental flashcard.
5. **Vary the question framing** — don't start every question with
   "What should you do when...". Use "You have...", "Villain...",
   "Flop is...", "You're in BB facing...".
6. **Cover all system types** — board-texture, hand-strength,
   preflop-icm, postflop-icm, primer, conclusion.
7. **Include contrast pairs** — if a distinction is the lesson (e.g.
   "KK3 is NOT a risk factor; K33 IS"), make a card that tests it.
8. **Include counter-intuitive rules** — the leaks that most players
   get wrong are the most important cards.
9. **Don't duplicate** — if two systems teach the same concept (e.g.
   "bet top, bet bottom, check middle" appears in S1, S2, S5), generate
   the card once with the broadest context.
10. **Semicolons in content** — if the question or answer itself
    contains a semicolon, replace it with a comma or colon. The `;`
    separator must be unambiguous.

## Example output (first 10 lines)

```
UTG opens, BB calls, BB checks. Flop is T-high rainbow, no risk factors. What's your c-bet strategy?;C-bet 100% with your entire range. Small sizing (~40% pot). T-high+ clean boards have no checking range.
UTG opens, BB calls. Flop is A-high monotone. What's your c-bet strategy?;Mix — bet strong (flushes, sets) + weak (trash), check medium (underpairs without the suit, weak aces). Ace-monotone is a risk factor.
UTG opens, BB calls. Flop is KK3 rainbow (high-high-low). Is this a risk factor for c-betting 100%?;No — KK3 is high-high-low, NOT high-low-low. Only paired low under high (K33, J66, T55) is a risk factor. C-bet 100%.
UTG opens, BB calls, BB checks. Flop is J66 (high-low-low, paired). What's the c-bet strategy?;Mix ~50%. Bet trips (6x) + trash, check underpairs (TT-77) and medium aces (AT, AK). Paired low under high is a risk factor.
You're 20bb effective, UTG opens, BB calls. How does stack depth affect c-betting?;Bet MORE when shallow, not less. Overpair asymmetry is amplified at shallow depth. Most players do the opposite — correct the leak.
BTN opens, BB calls, BB checks. Flop is ace-high, 100bb. What's the c-bet strategy?;C-bet 100% but with more checking than at shallow stacks. Deeper stacks = more checking on ace-high. Risk factors: monotone, paired.
BTN opens, BB calls. Flop is KJ2 (king-high with deuce). Solver shows 14% check. What should you do?;C-bet 100%. Simplifying to 100% when the solver checks <15% costs approximately 0% EV. Just bet range.
BTN opens, BB calls. Flop is 543 two-tone — no card 8 or higher. What should BTN do?;Check a lot. BTN misses this board — offsuit range starts at 8s. Not enough value to bet range. Bet top, check middle, bet some bottom.
SB limps, BB checks. Flop is K72 two-tone, SB stabs 1bb into 3bb. How do you defend?;Defend ~75%, fold ~25%. Key card = K (paired 7 is unusable — if villain has trips, you're dead). High card defending: all ace highs first, then queen highs, etc.
SB limps, BB checks. Flop is A42 two-tone, SB stabs. What hands are pure calls?;All gut shots (3x, 5x) are pure calls. Three-to-a-straight never folds blind vs blind. Worst hands contain a 7 (97, T7) — fold those.
```

## Process

1. Read all `.md` files in `extracted/` (there are 28).
2. For each file, generate 8-15 flashcards from its sections.
3. Deduplicate across files — keep the broadest context version.
4. Write all cards to `flashcards.txt` in the repo root.
5. Report the total card count.
