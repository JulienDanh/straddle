#!/usr/bin/env python3
"""Build a solver-runner spot config from ranges in the range store.

Range specs point at a preflop line in packages/ranges/data:

    <position>/<line>:<stack>:<type>:<action>[+<action>...]

For example "bb/vs-utg:40:cEV:call" is the 40bb ChipEV BB-vs-UTG calling
range. Multiple actions are merged by summing each combo's frequency,
capped at 1 (call+raise = the whole continue range). The store's
combo:freq strings are passed through as-is; the solver's Range parser
accepts them directly.

Scenarios: --tree <name> loads trees/<name>.json (see trees/index.json) —
a full tree config with archive-derived bet sizes, default pot/stack and
default ranges. Flags override the tree's values.

Example:

    python3 scripts/spot_from_store.py --tree s1-utg-bb-40-cbet-20 \
        --board Kh8h3c --out spot.json
    ./target/release/solver-runner --config spot.json --out result.json --walk check
"""

import argparse
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
STORE = REPO / "packages" / "ranges" / "data"
RUNNER = Path(__file__).resolve().parent.parent
DEFAULT_TEMPLATE = RUNNER / "examples" / "template.json"
TREES = RUNNER / "trees"


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
    parser.add_argument("--board", required=True, help="board cards, e.g. Kh8h3c (flop/turn/river by length)")
    parser.add_argument("--tree", default=None, help="scenario tree name under trees/ (see trees/index.json)")
    parser.add_argument("--template", default=None, help="raw template config path (ignored with --tree)")
    parser.add_argument("--pot", type=float, default=None, help="pot at the initial street, in bb (default: tree)")
    parser.add_argument("--effective-stack", type=float, default=None, help="effective stack behind, in bb (default: tree)")
    parser.add_argument("--oop", default=None, help="OOP range spec (default: tree)")
    parser.add_argument("--ip", default=None, help="IP range spec (default: tree)")
    parser.add_argument("--out", default="-", help="output path, or - for stdout")
    parser.add_argument("--list-trees", action="store_true", help="print trees/index.json and exit")
    args = parser.parse_args()

    if args.list_trees:
        print((TREES / "index.json").read_text())
        return 0

    if args.tree:
        tree_path = TREES / f"{args.tree}.json"
        if not tree_path.is_file():
            available = sorted(p.stem for p in TREES.glob("*.json") if p.name != "index.json")
            raise SystemExit(f"No tree {args.tree!r}; available: {available}")
        config = json.loads(tree_path.read_text())
    elif args.template:
        config = json.loads(Path(args.template).read_text())
    else:
        config = json.loads(DEFAULT_TEMPLATE.read_text())

    if args.pot is not None:
        config["pot"] = args.pot
    if args.effective_stack is not None:
        config["effective_stack"] = args.effective_stack

    ranges = config.get("ranges", {})
    if args.oop:
        ranges["oop"] = args.oop
    if args.ip:
        ranges["ip"] = args.ip
    config["ranges"] = ranges

    missing = [k for k in ("pot", "effective_stack") if config.get(k) is None]
    missing += [k for k in ("oop", "ip") if not ranges.get(k)]
    if missing:
        raise SystemExit(f"Missing {missing}; pass them as flags or use --tree with defaults")

    config["board"] = args.board
    # strip tree metadata; the runner ignores it, but keep configs clean
    config = {k: v for k, v in config.items() if not k.startswith("_")}

    def resolve(spec: str) -> str:
        # CLI flags accept a literal Pio-style range ("QQ+,AKs") — anything
        # without "/" is treated as literal; store specs always contain "/".
        return parse_store_range(spec) if "/" in spec else spec

    config["ranges"] = {
        "oop": resolve(ranges["oop"]),
        "ip": resolve(ranges["ip"]),
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
