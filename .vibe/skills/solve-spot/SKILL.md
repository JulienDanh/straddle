---
name: solve-spot
description: Load when solving a poker spot with the postflop-solver wrapper (packages/gto) — running the s1-cbet or solve binaries, validating strategy output, and wiring solved ranges into the study app data and pages. Also when reviewing or extending the solve workflow itself.
---

# Solve Spot

Run the postflop-solver wrapper in `packages/gto`, validate the strategy
output, and wire the result into the study app as a `StoredRange`.

## Binaries

Build first — debug builds are unusably slow (`--release` is mandatory):

```
cargo build --release -p gto
```

Two binaries (run from `packages/gto/target/release/`):

- `s1-cbet` — the System 1 spot, with the stored app ranges already embedded
  via `include_str!`. Args: `[iterations] [--board <cards>] [--out <path>]
  [--compressed]`. Dumps the BB flop strategy first, then UTG's c-bet
  strategy after BB checks. The UTG section (second one) is what goes in the
  app. Default 1000 iterations; 140-200 already reached ~0.5% of pot
  exploitability on the solved example boards.
- `solve` — any postflop spot: `--board <3-5 cards> --pot <chips> --stack
  <chips> --oop-range "..." --ip-range "..."`, optional `--bet-sizes
  "40%,e,a"`, `--raise-sizes "2.5x"`, `--max-iterations`, `--target`,
  `--compressed`, `--out <path>`. Ranges accept Pio-style groups or
  weighted per-combo strings (`AsAh:0.5`).

Conventions for the S1 spot (constants inside `s1-cbet.rs`): UTG opens 2bb,
SB folds, BB calls, BB checks. Pot 450, stack 3800 behind (chips = bb*100),
c-bet 40% pot (180 chips), bet sizes `"40%,a"`, raise sizes `"2.5x"`.

## Running

- Real-range trees are multi-GB. On a 16GB machine pass `--compressed`
  (16-bit storage, ~half the memory, slightly slower per iteration).
- Long solves: start in the background (`tools.process.start`), keep the
  process id and cursor, poll with `tools.process.output`. Never launch
  long solvers as a foreground blocking call.
- Always use `--out target/<name>.txt` so the output is kept.
- Exploitability target is 0.005 of pot (set in `solve_game`). Check the
  `Exploitability:` line in the solver log before trusting a solve.

Output format: per acting player a `# <name> (OOP|IP): [...]` header, then
one line per action — `check 4c3c:0.0009,...` / `bet180 ...` / `allIn ...`.
Frequencies are 4-decimal and sum to 1 per combo across actions.

## Validate

Every solve gets validated before use. The approval system blocks python
heredocs — run the support script directly:

```
python3 .vibe/skills/solve-spot/validate.py packages/gto/target/<name>.txt
```

Checks: combo format, no duplicates per line, no combos using board cards,
per-combo frequencies sum to 1 (tolerance 0.002 for 4-decimal rounding),
same combo set across actions in a section.

## Merge into app format

The app `StoredRange` wants one `check` line and one `bet` line per spot.
Generate them from the solve file (default: last section = UTG c-bet in
`s1-cbet` output):

```
python3 .vibe/skills/solve-spot/make_range.py packages/gto/target/<name>.txt --last
```

Merges all `bet*` and `allIn` lines into `bet`, keeps `check`/`call`/`fold`
as-is, sums `raise*` into `raise`. Prints paste-ready `check` / `bet`
lines.

## Wire into the app

1. Add a `StoredRange` constant in
   `packages/design-system/src/data/ranges/s1-flops.ts` (or a new data file
   for other spots, re-exported from `data/ranges/index.ts`):
   `title: 'UTG c-bet vs BB check'`, `subtitle: '<texture> (<cards>) ·
   solver'`, `stack: 40`, `position: 'UTG'`, `actions: { check, bet }`,
   `sizings: { bet: 1.8 }`. Add a comment header: board, exploitability,
   iteration count, and the one-line takeaway.
2. Reference it in the page component (S1 `BoardExample` cards live in
   `packages/study-app/src/pages/S1.tsx`).
3. Verify: `npx tsc --noEmit` in `packages/design-system` and
   `packages/study-app`, then `npm run build` from the repo root.

## Gotchas

- Solver is postflop-only. Preflop spots (BB-vs-UTG depth charts) need flop
  enumeration and are out of scope for these binaries.
- The embedded ranges are read directly from the shared range store
  (`packages/ranges/data/*.json`) — `s1-cbet` embeds the files via
  `include_str!` and picks the (stack, action) string at runtime. JSON
  edits go live on the next `cargo build`.
- Money is integer chips: bb*100 keeps blind fractions integral (40bb =
  4000, 4.5bb pot = 450).
- Bet size args like `"40%,e,a"`: `e` = geometric, `a` = all-in. S1 dropped
  `e` — the 3-size tree was ~7GB and converged too slowly.
- Solver strategies include every combo of the private-card range (minus
  board-blocked ones); zero-frequency entries are dropped by
  `make_range.py`, which is why app lines are shorter than raw solver lines.
