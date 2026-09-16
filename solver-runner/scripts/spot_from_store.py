#!/usr/bin/env python3
"""Build a solver-runner spot config from ranges in the range store.

Range specs point at a preflop line in packages/ranges/data:

    <position>/<line>:<stack>:<type>:<action>[+<action>...]

For example "bb/vs-utg:40:cEV:call" is the 40bb ChipEV BB-vs-UTG calling
range. Multiple actions are merged by summing each combo's frequency,
capped at 1 (call+raise = the whole continue range). The store's
combo:freq strings are passed through as-is; the solver's Range parser
accepts them directly.

Example:

    python3 scripts/spot_from_store.py \
        --board Td9d6h --pot 5.5 --effective-stack 37 \
        --oop "utg/rfi:40:cEV:raise" \
        --ip "bb/vs-utg:40:cEV:call" \
        --out spot.json
    cargo run --release -- --config spot.json --out result.json
"""

import argparse
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
STORE = REPO / "packages" / "ranges" / "data"
DEFAULT_TEMPLATE = Path(__file__).resolve().parent.parent / "examples" / "template.json"


def parse_store_range(spec: str) -> str:
    parts = spec.split(":")
    if len(parts) != 4:
        raise ValueError(
            f"Range spec must be <position>/<line>:<stack>:<type>:<action>[+...], got {spec!r}"
        )
    line, stack, rtype, actions = parts
    path = STORE / f"{line}.json"
    if not path.is_file():
        raise FileNotFoundError(f"No such range line: {path}")
    data = json.loads(path.read_text())

    matches = [s for s in data["stacks"] if s["stack"] == int(stack) and s["type"] == rtype]
    if not matches:
        available = sorted({(s["stack"], s["type"]) for s in data["stacks"]})
        raise KeyError(
            f"No {rtype} {stack}bb entry in {line}.json; available (stack, type): {available}"
        )
    entry = matches[0]

    weights: dict[str, float] = {}
    for action in actions.split("+"):
        if action not in entry["actions"]:
            raise KeyError(
                f"No {action!r} action in {line}:{stack}:{rtype}; "
                f"available: {sorted(entry['actions'])}"
            )
        for item in entry["actions"][action].split(","):
            combo, _, freq = item.partition(":")
            freq = float(freq) if freq else 1.0
            weights[combo] = min(1.0, weights.get(combo, 0.0) + freq)

    merged = ",".join(f"{c}:{w:.4f}" for c, w in sorted(weights.items()) if w > 0)
    if not merged:
        raise ValueError(f"Empty range for {spec!r}")
    return merged


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--board", required=True, help="board cards, e.g. Td9d6h (flop/turn/river by length)")
    parser.add_argument("--pot", type=float, required=True, help="pot at the initial street, in bb")
    parser.add_argument("--effective-stack", type=float, required=True, help="effective stack behind, in bb")
    parser.add_argument("--oop", required=True, help="OOP range spec (see module docstring)")
    parser.add_argument("--ip", required=True, help="IP range spec (see module docstring)")
    parser.add_argument("--template", default=str(DEFAULT_TEMPLATE), help="template config carrying bet_sizes/solve settings")
    parser.add_argument("--out", default="-", help="output path, or - for stdout")
    args = parser.parse_args()

    config = json.loads(Path(args.template).read_text())
    config["board"] = args.board
    config["pot"] = args.pot
    config["effective_stack"] = args.effective_stack
    config["ranges"] = {
        "oop": parse_store_range(args.oop),
        "ip": parse_store_range(args.ip),
    }

    text = json.dumps(config, indent=2)
    if args.out == "-":
        print(text)
    else:
        Path(args.out).write_text(text + "\n")
        print(f"Wrote {args.out}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
