# solver-runner

Run the [postflop-solver](../postflop-solver) submodule on a spot from a JSON
config, and dump the solved root strategy in the range store's class:freq
format.

## Setup (this WSL distro)

The distro has no system compiler and no rust on PATH. One-time:

```sh
curl -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal   # rustup
~/.local/bin/micromamba create -y -p ~/micromamba/envs/rust -c conda-forge gcc_linux-64
```

Then always build through the wrapper (it sets `PATH`/`CC`/linker):

```sh
scripts/run.sh build --release
```

## Usage

```sh
./target/release/solver-runner --config <spot.json> [--out <result.json>] [--save <game.bin>] [--walk check] [--info]
```

- `--info` prints the tree's memory usage and exits without solving. Run it
  first: flop-start trees with geometric/all-in sizes at high SPR can need
  tens of GB; turn/river spots are small.
- `--walk` plays a comma-separated sequence of exact action labels from the
  root (e.g. `--walk check` to reach the c-bet node after the BB checks) and
  dumps the node reached instead of the root. Cannot deal turn/river cards.
- `--save` writes the solved game tree (bincode) for later inspection with
  the crate's `load_data_from_file`.
- Threading: set `RAYON_NUM_THREADS` to bound CPU usage.

## Spot config

| Field | Meaning |
|---|---|
| `board` | Cards, 2 chars each — 3 = flop, 4 = turn, 5 = river |
| `pot` / `effective_stack` | Pot and remaining stack at the initial street, in bb (fractional fine — amounts are internally rescaled; output is always in bb) |
| `ranges.oop` / `ranges.ip` | PioSOLVER-style range strings, weights allowed (`AA:0.5`); the store's combo:freq strings parse directly |
| `bet_sizes.<street>.{oop,ip}` | `[first-bet sizes, raise sizes]`, e.g. `["33%, 60%, e, a", "2.5x"]` (`e` = geometric, `a` = all-in) |
| `donk_sizes.turn` / `.river` | Donk bet sizes, omitted = solver default |
| `solve.max_iterations` | Cap on CFR iterations |
| `solve.target_exploitability_pct_pot` | Early stop once exploitability drops below this % of pot |
| `solve.compressed` | 16-bit integer storage (less memory, slower) |

The tree fields `add_allin_threshold`, `force_allin_threshold`,
`merging_threshold` and `rake` default to the crate's recommended values.

## Output

JSON with the exploitability (bb and % of pot), the dumped node's actions in
bb, and — per action — a class:freq string (`"AKs:0.25,..."`) averaged over
the combos present, the same format the RangeGrid copy button and the range
store use. Also includes per-hand strategy for the acting player and
equity/EV for both players at that node.

## Comparing against a stored GTO Wizard solution

`scripts/compare_wizard.py` divides a store child's open-weight-scaled paste
into conditional frequencies and compares them to a solver node:

```sh
# solve UTG-vs-BB K83 with the Wizard tree sizes (archive-derived):
python3 scripts/spot_from_store.py --tree s1-utg-bb-40-cbet-20 \
    --board Kh8h3c --out spot.json
./target/release/solver-runner --config spot.json --out result.json --walk check
python3 scripts/compare_wizard.py --result result.json \
    --child "utg/rfi:40:cEV:k83" --action bet --solver-action "Bet(1.1)"
```

Verified there: Wizard c-bets 99.97% of the open range at 1.1bb, solver
100.0% (0.22% of pot exploitability), mean per-combo |diff| 0.008 — the only
class-level divergence is K7s, an indifference-boundary hand that mixes
(Wizard 100%, solver ~34%) while everything else is pure.

## Scenario trees

`trees/` stores one bet-size tree per scenario (`trees/index.json` lists them;
`scripts/make_trees.py` regenerates them). Flop sizes and donk sizings come
from the archived GTO Wizard captures cited in each tree's `_sources`. The
turn/river sizings follow the course's own bet-size tree (the Sizing page):
OOP leads the 33% block (S10) and check-raises to pot or jams (S6), IP
barrels geometric (S5/S8 — the solver's `e`), river is 67% default / 130%
overbet vs capped (S4/S10/S11), with jams added by the all-in threshold.
Anything approximated is flagged in `_notes`. A tree carries the full
scenario: default pot/stack, default ranges, bet sizes per street, donk
sizes — only the board is missing.

```sh
python3 scripts/spot_from_store.py --list-trees        # what exists
python3 scripts/spot_from_store.py --tree s1-utg-bb-40-cbet-20 --board Kh8h3c --out spot.json
```

Covered: S1's two c-bet buckets at 40bb (1.1bb / 4bb), the UTG-BB ladder at
20/100bb, S2's BTN-BB buckets at 40/50bb, the SB-BB battle leads (1.4 / 4.4),
and UTG-vs-CO-3bet pots. Trees whose default range is not in the store
(100bb BB call, UTG call-vs-3bet) say so in `_notes` — pass `--oop` with a
store spec or a literal Pio-style range.

**The course strategy trees.** `course-cbet-ip` / `course-cbet-oop` carry the
course strategy as a bet-size tree. Flop: both course buckets offered (20%
range bet, 73% polar), OOP x-raise to 5.18x the small bet or jam (S6), the
c-bettor never min-raises the x-raise back — jam or fold (S7); turn/river:
the course ladder (S4/S5/S6/S8/S10/S11). Pot-relative, so any depth works.
Given both buckets the solver MIXES near-EV sizes on range-bet boards
(Kh8h3c: ~44% at 1.1 / ~53% at 4) while choosing the polar bucket cleanly
on AsKh2c (81.9% at 4bb vs Wizard's 78.8%, r = 0.83) — read mixes as
"either works"; the Wizard sims only ever offer one size per board.

**Playing S1 as taught: one size per board.** The system's own play is a
PURE flop size per board — the bucket is the first decision. Classify the
board, then play the matching single-bucket tree:

```sh
python3 scripts/board_bucket.py --board Kh8h3c \
    --pot 5.5 --effective-stack 38 \
    --oop "bb/vs-utg:40:cEV:call" --ip "utg/rfi:40:cEV:raise" --out spot.json
```

`board_bucket.py` applies the taught rules (T-high+ clean -> 20% range bet;
AKx · 9-high & below · 3+ straights -> 73% polar; monotone and high-low-low
are soft risk factors that stay at 20%) and builds the spot with
`course-rangebet-*` or `course-polar-*`. Where the board has a stored S1/S2
solution, the stored sizing WINS over the rules and disagreements are
printed (e.g. 5h4h3c and KdJh2c sit outside the simple rules). Verified:
the pure range-bet tree on Kh8h3c c-bets 100.0% of range at 1.1bb —
Wizard's exact pure strategy.

`course-cbet-*` (both buckets offered) remains for exploration; the
single-bucket trees are the way to replicate a system's play.

## Building a spot from the range store

`scripts/spot_from_store.py` fills `ranges` from `packages/ranges/data` and
takes the tree settings from a template (`examples/template.json` by default):

```sh
python3 scripts/spot_from_store.py \
    --board Kh8h3c --pot 5.5 --effective-stack 38 \
    --oop "bb/vs-utg:40:cEV:call" \
    --ip "utg/rfi:40:cEV:raise" \
    --out spot.json
./target/release/solver-runner --config spot.json --out result.json
```

Range spec: `<position>/<line>:<stack>:<type>:<action>[+<action>...]`; merged
actions sum combo frequencies (capped at 1), so `call+raise` is the full
continue range. CLI range flags without a `/` are literal Pio-style ranges.

## Examples

- `examples/turn-spot.json` — the crate's own `basic.rs` spot (turn, pot 200),
  usable as a regression check: node actions should be
  `Check, Bet(120), Bet(216.25), AllIn(900)`.
