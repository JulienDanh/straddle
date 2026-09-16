#!/usr/bin/env python3
"""Compare a solver-runner result against a stored GTO Wizard postflop child.

The store child's action pastes are open-weight-scaled (paste = open weight x
conditional strategy); this script divides out the parent open weights, then
compares the conditional strategy against the solver's per-hand frequencies
at the walked node — per combo, per class, and as the weighted aggregate the
BoardExample badges render (sum(weight x conditional) / sum(weight)).

Example:

    python3 scripts/compare_wizard.py \
        --result /tmp/k83-result.json \
        --child "utg/rfi:40:cEV:k83" \
        --action bet \
        --solver-action "Bet"
"""

import argparse
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
STORE = REPO / "packages" / "ranges" / "data"
RANKS = "23456789TJQKA"


def norm_combo(combo: str) -> str:
    """Canonical key for a 4-char combo, order-insensitive."""
    if len(combo) != 4:
        raise ValueError(f"bad combo {combo!r}")
    return "".join(sorted([combo[:2], combo[2:]]))


def class_of(combo: str) -> str:
    a, b = combo[:2], combo[2:]
    ra, rb = RANKS.index(a[0]), RANKS.index(b[0])
    hi, lo = max(ra, rb), min(ra, rb)
    if hi == lo:
        return f"{RANKS[hi]}{RANKS[hi]}"
    suited = "s" if a[1] == b[1] else "o"
    return f"{RANKS[hi]}{RANKS[lo]}{suited}"


def expand_class(item: str) -> list[str]:
    """Expand a 2-3 char hand class to its combos."""
    if len(item) == 2:  # pair
        r = item
        return [r + "c" + r + "d", r + "c" + r + "h", r + "c" + r + "s",
                r + "d" + r + "h", r + "d" + r + "s", r + "h" + r + "s"]
    hi, lo, t = item[0], item[1], item[2]
    suits = "cdhs"
    if t == "s":
        return [hi + s + lo + s for s in suits]
    return [hi + s1 + lo + s2 for s1 in suits for s2 in suits if s1 != s2]


def parse_freq_list(text: str) -> dict[str, float]:
    """combo:freq (or class:freq) list -> per-combo weights."""
    out: dict[str, float] = {}
    for item in text.split(","):
        item = item.strip()
        if not item:
            continue
        combo, _, freq = item.partition(":")
        freq = float(freq) if freq else 1.0
        if len(combo) in (2, 3) and not (len(combo) == 4):
            for c in expand_class(combo):
                out[norm_combo(c)] = freq
        else:
            out[norm_combo(combo)] = freq
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--result", required=True, help="solver-runner result JSON (use --walk to reach the node)")
    parser.add_argument("--child", required=True, help="<position>/<line>:<stack>:<type>:<child-id>, e.g. utg/rfi:40:cEV:k83")
    parser.add_argument("--action", default=None, help="child action to compare (default: first stored action)")
    parser.add_argument("--solver-action", default="Bet", help="solver action label substring (default: Bet)")
    parser.add_argument("--top", type=int, default=15, help="rows of the per-class diff table")
    args = parser.parse_args()

    parts = args.child.split(":")
    if len(parts) != 4:
        raise SystemExit("--child must be <position>/<line>:<stack>:<type>:<child-id>")
    line, stack, rtype, child_id = parts
    data = json.loads((STORE / f"{line}.json").read_text())
    entry = [s for s in data["stacks"] if s["stack"] == int(stack) and s["type"] == rtype]
    if not entry:
        raise SystemExit(f"No {rtype} {stack}bb entry in {line}.json")
    entry = entry[0]
    child = [p for p in entry.get("postflop", []) if p["id"] == child_id]
    if not child:
        raise SystemExit(f"No postflop child {child_id!r} in {line}:{stack}:{rtype}")
    child = child[0]
    wizard_action = args.action or next(iter(child["actions"]))
    if wizard_action not in child["actions"]:
        raise SystemExit(f"No {wizard_action!r} in child actions {list(child['actions'])}")

    parent_w = parse_freq_list(entry["actions"]["raise"])
    paste = parse_freq_list(child["actions"][wizard_action])

    result = json.loads(Path(args.result).read_text())
    node = result["node"]
    board = result["board"]
    board_cards = {board[i:i + 2] for i in range(0, len(board), 2)}

    # Find the solver action (bet/check at this node).
    labels = [a for a in node["actions"] if args.solver_action.lower() in a.lower()]
    if len(labels) != 1:
        raise SystemExit(f"Solver action {args.solver_action!r} matched {labels}; pass --solver-action")
    action_label = labels[0]
    ai = node["actions"].index(action_label)

    hands = node["hands"]
    strategy = node["strategy"]
    n = len(hands)
    solver = {norm_combo(h): strategy[i + ai * n] for i, h in enumerate(hands)}

    # Block board combos from the parent open range, then intersect.
    def blocked(combo):
        c1, c2 = combo[:2], combo[2:]
        return c1 in board_cards or c2 in board_cards

    combos = [c for c in parent_w if not blocked(c)]
    missing = [c for c in combos if c not in solver]
    if missing:
        raise SystemExit(f"{len(missing)} combos unblocked in Wizard but absent from solver result, e.g. {missing[:5]}")

    # Conditional Wizard strategy: paste / open weight (toConditional rules).
    wizard_cond = {}
    for c in combos:
        w = parent_w[c]
        p = paste.get(c, 0.0)
        cond = p / w if w > 0 else 0.0
        wizard_cond[c] = 1.0 if cond >= 0.9995 else min(cond, 1.0)

    # Weighted aggregates (the badge formula from add-range).
    wsum = sum(parent_w[c] for c in combos)
    wiz_share = sum(parent_w[c] * wizard_cond[c] for c in combos) / wsum
    sol_share = sum(parent_w[c] * solver[c] for c in combos) / wsum

    # Per-class averages.
    by_class: dict[str, list[float, float, int]] = {}
    for c in combos:
        acc = by_class.setdefault(class_of(c[:2] + c[2:]), [0.0, 0.0, 0])
        acc[0] += wizard_cond[c]
        acc[1] += solver[c]
        acc[2] += 1
    rows = sorted(
        ((cls, w / cnt, s / cnt, cnt) for cls, (w, s, cnt) in by_class.items()),
        key=lambda r: -abs(r[1] - r[2]),
    )

    diffs = [abs(wizard_cond[c] - solver[c]) for c in combos]
    mean_abs = sum(diffs) / len(diffs)
    wz = [wizard_cond[c] for c in combos]
    sz = [solver[c] for c in combos]
    n_ = len(combos)
    corr = (sum(a * b for a, b in zip(wz, sz)) - n_ * (sum(wz) / n_) * (sum(sz) / n_)) / (
        (sum((v - sum(wz) / n_) ** 2 for v in wz) * sum((v - sum(sz) / n_) ** 2 for v in sz)) ** 0.5
    )

    print(f"Spot: {child['label']} {child['line']} (child {child_id!r}, {line}:{stack}bb {rtype})")
    print(f"Solver node: {result['board']} | exploitability {result['exploitability']:.4f}bb ({result['exploitability_pct_pot']:.3f}% of pot)")
    print(f"Action: Wizard {wizard_action!r} vs solver {action_label!r} ({len(combos)} combos)")
    print()
    print(f"Weighted {wizard_action} share of range: Wizard {100 * wiz_share:.1f}% | solver {100 * sol_share:.1f}% | diff {100 * (sol_share - wiz_share):+.1f}pp")
    print(f"Per-combo: mean |diff| {mean_abs:.4f} | Pearson r {corr:.4f}")
    print()
    print(f"{'class':<6}{'wizard':>8}{'solver':>8}{'diff':>8}  combos")
    for cls, w, s, cnt in rows[:args.top]:
        print(f"{cls:<6}{w:>8.3f}{s:>8.3f}{s - w:>+8.3f}  {cnt}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
