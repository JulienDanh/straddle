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
./target/release/solver-runner --config <spot.json> [--out <result.json>] [--save <game.bin>] [--info]
```

- `--info` prints the tree's memory usage and exits without solving. Run it
  first: flop-start trees with geometric/all-in sizes at high SPR can need
  tens of GB; turn/river spots are small.
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

JSON with the exploitability (bb and % of pot), the root actions in bb, and —
per action — a class:freq string (`"AKs:0.25,..."`) averaged over the combos
present, the same format the RangeGrid copy button and the range store use.
Also includes per-hand strategy, equity and EV for both players.

## Building a spot from the range store

`scripts/spot_from_store.py` fills `ranges` from `packages/ranges/data`:

```sh
python3 scripts/spot_from_store.py \
    --board Ks8c3dTh --pot 8.1 --effective-stack 36.2 \
    --oop "utg/rfi:40:cEV:raise" \
    --ip "bb/vs-utg:40:cEV:call" \
    --out spot.json
./target/release/solver-runner --config spot.json --out result.json
```

(the example: UTG 40bb 2bb open vs BB call, Ks8c3d 40%-pot c-bet called, Th
turn — solves to 0.43% of pot in seconds on 12 threads)

Range spec: `<position>/<line>:<stack>:<type>:<action>[+<action>...]`; merged
actions sum combo frequencies (capped at 1), so `call+raise` is the full
continue range. Bet sizes and solve settings come from
`examples/template.json`.

## Examples

- `examples/turn-spot.json` — the crate's own `basic.rs` spot (turn, pot 200),
  usable as a regression check: root actions should be
  `Check, Bet(120), Bet(216.25), AllIn(900)`.
