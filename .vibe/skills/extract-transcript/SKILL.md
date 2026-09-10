---
name: extract-transcript
description: >
  Load when extracting a poker training transcript (.txt, raw speech-to-text
  monologue from transcripts/Simple Poker Systems/ or transcripts/Bubble Mastery/)
  into a structured .md file with defined sections. Use when the user asks to
  extract, parse, structure, or convert a transcript into study content.
  Also use when defining or reviewing the extraction format.
---

# Extract Transcript

Convert a raw poker training transcript (speech-to-text monologue) into a
structured `.md` file that can later feed into building study-app pages.

## Source material

Transcripts live under `transcripts/Simple Poker Systems/` and
`transcripts/Bubble Mastery/`. They are raw, unpunctuated, single-paragraph
speech-to-text. One transcript file may cover one system, part of a system
(split across files), a primer, an intro, a takeaways summary, or a conclusion.

## Output

One `.md` file per transcript (or per logical system if multiple transcript
files cover the same system — merge them). Write to a destination the user
specifies, or default to `extracted/` at the repo root.

## Frontmatter

Every output file starts with YAML frontmatter:

```yaml
---
system: S1                              # system ID: S1-S12, BM1-BM17, Primer, Intro, Conclusion, Takeaways
title: UTG vs BB C-bet                   # display title
type: board-texture                      # see Type values below
course: No-Limit Systems                 # No-Limit Systems | Bubble Mastery
scenario: UTG opens, BB calls, BB checks. Hero decides flop c-bet.
source_files:                            # list of source transcript files merged
  - transcripts/Simple Poker Systems/Simple_Poker_Systems_03_System_1_UTG_vs_BB_Call_–_C-betting_Flops.txt
stack_depth: 20-150bb                    # relevant stack depth range (omit if N/A)
positions: [UTG, BB]                     # hero/villain positions (omit if N/A)
street: flop                             # preflop | flop | turn | river (omit if N/A)
---
```

### Type values

| type | Description | Examples |
|------|-------------|----------|
| `intro` | Course intro/foreword — philosophy, approach | SPS 01, BM 01 |
| `primer` | Conceptual foundations — RFI ranges, ICM model, FGS | SPS 02, BM 02-04 |
| `board-texture` | Board classification → action system | S1, S2, S3, S7, S9, S12 |
| `hand-strength` | Hand tier hierarchy → action system | S5, S6, S8, S10, S11 |
| `preflop-icm` | Stack-depth range system for ICM bubble play | BM 05-09, BM 17 |
| `postflop-icm` | C-bet/defense with ICM pressure (hybrid) | BM 11-16 |
| `takeaways` | Summary of key points from preceding content | BM Takeaways files |
| `conclusion` | Cross-system principles | SPS 15 |

## Sections

Include only the sections relevant to the transcript `type` (see mapping
below). If a section has no content in the transcript, omit it — do not write
empty headings.

### Universal sections (all types)

**`# {title}`** — H1 matching frontmatter title.

**`## Overview`** — One-sentence scenario (from frontmatter) plus a 2-3
sentence intro. What situation does this system cover? What is the core skill?

### System sections (board-texture, hand-strength, preflop-icm, postflop-icm)

**`## Buckets`** — The core classification. 2-3 categories the system divides
spots into. Each bucket has a name and a one-line criterion. This is the
single most important section — a learner who only remembers the buckets
will get most decisions right.

```markdown
## Buckets
- **T-high+**: highest card is T or higher → c-bet 100%
- **9-high & below**: highest card is 9 or lower → mix ~70/30
```

For preflop-icm types, "Buckets" may be stack-depth tiers or position-based
categories instead of board textures.

**`## Decision Rules`** — For each bucket, the specific action and reasoning.
This expands the buckets into executable decisions.

```markdown
## Decision Rules
- T-high+ clean (no risk factors): c-bet 100%, small size
- T-high+ with risk factors: mix — bet strong + weak, check medium
- 9-high & below: mix ~70/30, no 100% exists
```

**`## Risk Factors`** — Conditions that modify the default rule. Use a table
with factor + effect. Always include contrast pairs when the transcript
draws a distinction — the distinction is the lesson.

```markdown
## Risk Factors
| Factor | Effect |
|--------|--------|
| Monotone | Bet strong + weak, check medium |
| AKx family (AK2/AK3/AK4) | Slow down — not 100% |
| High-low-low (paired low under high, e.g. T55) | Bet trips + weak, check underpairs |
| High-high-low (e.g. KK3) | NOT a risk factor — c-bet 100% |
```

**`## Sizing`** — Specific bet sizings cited in the transcript. Cite the
system, do not generalize across systems. If the transcript doesn't
prescribe a size, say so.

```markdown
## Sizing
- Default: ~40% pot
- The transcript does not prescribe a specific size for this system.
```

**`## Blocker Effects`** — Which cards matter and why. Only include if the
transcript discusses blockers. Describe both what to block and what to
unblock.

```markdown
## Blocker Effects
- Avoid clubs when bluffing on 3-flush boards — blocks calls, unblocks folds
- Low card in hand matters more than high card for bluffing (System 1 bluffs)
```

**`## Common Leaks`** — What mistakes the system corrects. Frame as the
leak, then the correction.

```markdown
## Common Leaks
- Most players bet LESS when shallow — should bet MORE (overpair asymmetry amplified)
- Overfolding the bottom of the RFI range — "death by a thousand cuts"
```

**`## Hand Examples`** — Specific hands discussed in the transcript. Each
example: the spot (board/position/stack), the decision, the reasoning. Keep
to 2-4 sentences per example. These are not quiz questions — they are
walkthroughs that illustrate the system.

```markdown
## Hand Examples
- **AJJ (paired, ace-high, 40bb)**: Check more — paired board is a risk factor. Bet strong (Jx) + weak (trash), check medium (kings, queens).
- **KJ2 (king-high, deuce present, 60bb)**: C-bet 100%. Solver shows 14% check — simplification to 100% costs ~0% EV.
```

**`## Heuristics`** — Memorable phrases from the transcript. These become
the memory hooks a learner carries to the table. One per line.

```markdown
## Heuristics
- "Bet top, bet bottom, check middle"
- "One pip higher per position" (BTN → CO → HJ)
- "Bet MORE when shallow, not less"
```

**`## Quiz Spots`** — Board-spot scenarios for the PracticeFlow quiz. Each
entry: board constraints (not the actual cards — the constraints that
generate a RandomBoard), the correct action, and a one-line explanation.
Only include for board-texture and hand-strength types (postflop systems
with boards to show). Preflop-icm systems skip this section.

```markdown
## Quiz Spots
- Board: T-high, clean → C-bet 100% (no risk factor)
- Board: A-high, monotone → Mix (ace-monotone risk factor)
- Board: 9-high → Mix ~70/30 (no 100% exists)
```

**`## Rules Q&A`** — Questions with options, correct answer index, and
explanation. Write 5-8 questions. Questions should apply the system to a new
spot, not recite definitions.

```markdown
## Rules Q&A
- Q: What are the two flop buckets for System 1?
  Options: [T-high+ and 9-high & below, Ace-high and everything else, Paired and unpaired, Wet and dry]
  Correct: 0
  Explanation: Bucket 1: T-high+ → c-bet 100%. Bucket 2: 9-high & below → mix ~70/30.
```

### Primer sections

**`## Key Concepts`** — The conceptual foundations taught. For RFI primers:
range perimeters per position. For ICM primers: model descriptions, pitfalls,
hierarchy.

**`## Decision Rules`** — The specific ranges or thresholds (RFI perimeters,
BB defense perimeters, ICM vs ChipEV sizing).

**`## Sizing`** — Bet sizings, open sizes, 3-bet sizes cited.

**`## Heuristics`** — Memory hooks.

**`## Rules Q&A`** — Questions testing the foundation knowledge.

### Intro / Conclusion sections

**`## Key Concepts`** — The philosophy or cross-system principles.

**`## Cross-System Principles`** (conclusion only) — The recurring themes
across all systems, as a numbered list.

### Takeaways sections

**`## Summary`** — 3-5 bullet points distilling the key takeaways.

### All types (always include last)

**`## Source Quotes`** — Verbatim quotes from the transcript backing each
rule. 3-8 quotes. This is for traceability — every rule in the extracted
content should be backed by a quote here. Use the exact wording from the
transcript, even if ungrammatical.

```markdown
## Source Quotes
- "we're going to see that 100% of the raise first in range on ace high boards"
- "deeper stacks will tend to require more checking relative to shorter stacks"
- "betting the really strong hands, betting the really weak hands, checking more of the medium strength hands"
```

**`## Cross-References`** — Links to related systems or pages. Format as
system ID + title.

```markdown
## Cross-References
- S2: BTN vs BB C-bet (same concept, different position)
- S7: C-bet Folding Flops (what to do when you can't c-bet 100%)
- S5: Barreling Med Hands (the pyramid principle on the turn)
```

## Section → Type mapping

| Section | intro | primer | board-texture | hand-strength | preflop-icm | postflop-icm | takeaways | conclusion |
|---------|:----:|:------:|:------------:|:-------------:|:------------:|:------------:|:---------:|:----------:|
| Overview | Y | Y | Y | Y | Y | Y | Y | Y |
| Buckets | - | - | Y | Y | Y | Y | - | - |
| Decision Rules | - | Y | Y | Y | Y | Y | - | - |
| Key Concepts | Y | Y | - | - | - | - | - | Y |
| Risk Factors | - | - | Y | Y | Y | Y | - | - |
| Sizing | - | Y | Y | Y | Y | Y | - | - |
| Blocker Effects | - | - | if applicable | if applicable | if applicable | if applicable | - | - |
| Common Leaks | - | - | Y | Y | Y | Y | - | - |
| Hand Examples | - | - | Y | Y | Y | Y | - | - |
| Heuristics | - | Y | Y | Y | Y | Y | - | - |
| Quiz Spots | - | - | Y | Y | - | Y | - | - |
| Rules Q&A | - | Y | Y | Y | Y | Y | - | - |
| Summary | - | - | - | - | - | - | Y | - |
| Cross-System Principles | - | - | - | - | - | - | - | Y |
| Source Quotes | Y | Y | Y | Y | Y | Y | Y | Y |
| Cross-References | Y | Y | Y | Y | Y | Y | Y | Y |

## Extraction guidelines

1. **Read the full transcript first.** These are dense monologues. The system
   definition is usually in the first 1-3 paragraphs. Hand examples follow.
   Sizing and nuances are interspersed throughout.

2. **Buckets before nuance.** Lead with the 2-3 categories. Put exceptions and
   risk factors after the default rule. A learner who only remembers the
   buckets will get most decisions right.

3. **Name the heuristic, then explain it.** If the transcript uses a sticky
   phrase ("bet top, bet bottom, check middle"), put it in Heuristics
   verbatim. The short phrase is the memory hook.

4. **Contrast pairs explicitly.** If the transcript distinguishes "high-low-low
   IS a risk factor; high-high-low is NOT," include both. The distinction is
   the lesson.

5. **State the counter-intuitive rule boldly.** If the system corrects a
   common leak ("bet MORE when shallow, not less"), put it in Common Leaks and
   Key Insights. Most players get this wrong — that's why it's a system.

6. **Quiz questions apply, don't recite.** Give a new board/hand and ask for
   the action. The student has to run the system, not remember a slide.

7. **No solver-output memorization.** The transcript explicitly warns against
   treating solver outputs as answers. Frame rules as human-executable
   heuristics. If the transcript validates a heuristic against a solver, note
   the EV cost of simplification (e.g., "simplification to 100% costs ~0% EV").

8. **No unsourced claims.** Every rule should trace to a quote in Source
   Quotes. If you're inferring a rule, say so or leave it out.

9. **No filler prose.** If a sentence doesn't carry a rule, a distinction, or
   a reason, cut it. The .md is for scanning and recall, not reading cover
   to cover.

10. **Merge split files.** Some systems span multiple transcript files (e.g.,
    System 4 has intro+BB hands, BB vs EP, BB vs SB as separate files). Merge
    them into one .md with all source files listed in frontmatter.

11. **Preserve system-specific sizing.** System 1 is ~40% pot. System 2 is
    1/4 to 1/3 pot. Don't generalize — cite the transcript.

## Example output

```markdown
---
system: S1
title: UTG vs BB C-bet
type: board-texture
course: No-Limit Systems
scenario: UTG opens, BB calls, BB checks. Hero decides flop c-bet.
source_files:
  - transcripts/Simple Poker Systems/Simple_Poker_Systems_03_System_1_UTG_vs_BB_Call_–_C-betting_Flops.txt
stack_depth: 20-150bb
positions: [UTG, BB]
street: flop
---

# System 1 — UTG vs BB C-bet

## Overview
UTG opens, BB calls, BB checks. We decide our flop c-bet. The core skill: see
a board, classify it into a bucket, check for risk factors, execute.

## Buckets
- **T-high+**: highest card is T or higher → c-bet 100%
- **9-high & below**: highest card is 9 or lower → mix ~70/30

## Decision Rules
- T-high+ clean (no risk factors): c-bet 100%, small size
- T-high+ with risk factors: mix — bet strong + weak, check medium
- 9-high & below: always mix (~70/30 bet/check), no 100% exists

## Risk Factors
| Factor | Effect |
|--------|--------|
| Monotone (ace-high) | Bet strong + weak, check medium |
| AKx family (AK2/AK3/AK4) | Slow down — not 100% |
| High-low-low (paired low under high, e.g. T55) | Bet trips + weak, check underpairs |
| High-high-low (e.g. KK3) | NOT a risk factor — c-bet 100% |
| 3+ straights possible | Slow down heavily |
| Stack depth (deeper → 150bb) | More caution; shallower → 20bb leans into 100% |

## Sizing
- Default: ~40% pot
- The transcript does not prescribe a specific size for this system.

## Common Leaks
- Most players bet LESS when shallow — should bet MORE (overpair asymmetry amplified at shallow depth)
- Overfolding the bottom of the RFI range

## Hand Examples
- **AJJ (paired, ace-high, 40bb)**: Check more — paired board is a risk factor. Bet Jx + trash, check kings/queens.
- **KJ2 (king-high, deuce, 60bb)**: C-bet 100%. Solver shows 14% check — simplification costs ~0% EV.

## Heuristics
- "Bet top, bet bottom, check middle"
- "Bet MORE when shallow, not less"
- "High-low-low IS a risk factor; high-high-low is NOT"

## Quiz Spots
- Board: T-high, clean → C-bet 100%
- Board: A-high, monotone → Mix (ace-monotone risk factor)
- Board: J-high, paired low (J66) → Mix (high-low-low)
- Board: AKx (AK2/AK3/AK4) → Mix (AKx family)
- Board: 9-high → Mix ~70/30

## Rules Q&A
- Q: What are the two flop buckets for System 1?
  Options: [T-high+ and 9-high & below, Ace-high and everything else, Paired and unpaired, Wet and dry]
  Correct: 0
  Explanation: Bucket 1: T-high+ → c-bet 100%. Bucket 2: 9-high & below → mix ~70/30.
- Q: Is KK3 (high-high-low) a risk factor?
  Options: [No — only paired low under high counts, Yes — two high cards, Sometimes, Only if monotone]
  Correct: 0
  Explanation: KK3 is high-high-low, NOT high-low-low. Only paired low under high (K33, J66, T55) is a risk factor.
- Q: What adaptation when shallow (20bb)?
  Options: [C-bet more — overpair asymmetry amplified, C-bet less — less risk, No change, Check everything]
  Correct: 0
  Explanation: Shallow amplifies overpair advantage. Bet MORE, not less. Most players do the opposite — correct the leak.

## Source Quotes
- "we're going to see that 100% of the raise first in range on ace high boards"
- "deeper stacks will tend to require more checking relative to shorter stacks"
- "betting the really strong hands, betting the really weak hands, checking more of the medium strength hands"
- "monotone boards will require substantially more checking than rainbow or two-tone boards"

## Cross-References
- S2: BTN vs BB C-bet (same concept, different position)
- S7: C-bet Folding Flops (what to do when you can't c-bet 100%)
- S5: Barreling Med Hands (the pyramid principle on the turn)
```
