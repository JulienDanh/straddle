#!/usr/bin/env python3
"""Import a GTO Wizard range paste into the shared range store.

Usage:
  python3 scripts/import-wizard.py <paste-file> --board <cards> [options]

Takes a `combo: freq, ...` copy from the GTO Wizard range view (one action
per line, labeled `bet`/`check`/..., or a single unlabeled line with
--action), converts it to the store's conditional strategy format, validates
it, and — with --id — updates the store entry in place.

Format detection (--format, default auto):
  weighted     Wizard's range view copies are open-proportion-scaled
               (open weight x conditional strategy). Multi-action pastes
               are detected by per-combo sums matching the stored opening
               weight; converted by dividing each value by it.
  conditional  Raw strategy frequencies (check + bet sum to 1 per combo).
  auto         Multi-action: weighted if sums match the open weight,
               conditional if they sum to 1. Single-action: weighted if no
               value exceeds its open weight and ratios are near-constant;
               otherwise conditional.

Validation: combo format, no duplicates, no combos using board cards, full
coverage of the preflop range minus board-blocked combos, per-combo
conditional frequencies summing to 1 (0.0002 rounding tolerance), entries
below 0.00005 dropped per the store convention.

With --id the entry in data/utg/cbet-vs-bb.json is updated in place
(actions + sizings); the update is refused unless coverage is exact.
Prints the weighted betPct/checkPct for the page regardless.

Options:
  --board <cards>      Board cards, e.g. Kh8h3c (required)
  --id <store-id>      Store entry id to update, e.g. kk3
  --sizing <bb>        Bet size in bb recorded in sizings (with --id)
  --action <name>      Action name for an unlabeled single-line paste
  --format <fmt>       weighted | conditional | auto
  --pure               Clamp conditionals >= 0.999 to 1.0 and drop the
                      other action (pure strategies where the solver's
                      sub-0.1% noise rounds the display)
  --preflop <file>     Preflop range file (default utg/rfi.json)
  --stack <n>          Preflop stack (default 40)
  --preflop-action <a> Preflop action key (default raise)
"""

import argparse
import json
import pathlib
import re
import sys

RANGE_STORE = pathlib.Path(__file__).resolve().parent.parent / "data"
COMBO_RE = re.compile(r"([AKQJT2-9][shdc][AKQJT2-9][shdc]):\s*([0-9.eE+-]+)")
ACTIONS = ("check", "bet", "raise", "call", "fold", "allIn")
MIN_FREQ = 0.00005


def parse_paste(text, default_action):
    """Return {action: {combo: freq}} from the paste text."""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    sections = {}
    current = None
    for line in lines:
        first = line.split(" ")[0].lower().rstrip(":")
        if first in ACTIONS and not COMBO_RE.fullmatch(line.split(" ", 1)[-1] or ""):
            current = "allIn" if first == "allin" else first
            sections.setdefault(current, {})
            body = line.split(" ", 1)[1] if " " in line else ""
        else:
            body = line
            if current is None:
                if default_action is None:
                    sys.exit("unlabeled paste: pass --action <name>")
                current = default_action
                sections.setdefault(current, {})
        for m in COMBO_RE.finditer(body):
            combo, freq = m.group(1), float(m.group(2))
            if combo in sections[current]:
                sys.exit(f"duplicate combo {combo} in action {current}")
            sections[current][combo] = freq
    if not sections:
        sys.exit("no combos found in paste")
    return sections


def parse_store_line(s):
    return {i.split(":")[0]: float(i.split(":")[1]) for i in s.split(",")}


def load_open_weights(preflop, stack, action):
    data = json.load(open(RANGE_STORE / preflop))
    entry = next(
        (e for e in data if e.get("stack") == stack and action in e.get("actions", {})),
        None,
    )
    if entry is None:
        sys.exit(f"no stack-{stack} entry with action '{action}' in {preflop}")
    return parse_store_line(entry["actions"][action])


def detect_format(sections, weights):
    """Decide weighted vs conditional from per-combo sums."""
    combos = set.intersection(*(set(s) for s in sections.values()))
    sums = {c: sum(sections[a][c] for a in sections) for c in combos}
    close_weight = all(abs(sums[c] - weights[c]) <= 0.002 for c in combos if c in weights)
    close_one = all(abs(sums[c] - 1.0) <= 0.002 for c in combos)
    if close_weight and close_one:
        return "weighted"  # weight-1.0 combos only: ambiguous, Wizard copies are weighted
    if close_weight:
        return "weighted"
    if close_one:
        return "conditional"
    if len(sections) > 1:
        sys.exit("per-combo sums match neither the open weight nor 1 — "
                 "not a Wizard weighted paste or a conditional strategy")
    # single action: weighted requires every value <= its open weight
    if any(c not in weights or sections[a][c] > weights[c] + 0.0002
           for a in sections for c in sections[a]):
        return "conditional"
    return "weighted"


def main():
    ap = argparse.ArgumentParser(add_help=False)
    ap.add_argument("paste")
    ap.add_argument("--board", required=True)
    ap.add_argument("--id")
    ap.add_argument("--sizing", type=float)
    ap.add_argument("--action")
    ap.add_argument("--format", choices=("auto", "weighted", "conditional"), default="auto")
    ap.add_argument("--pure", action="store_true")
    ap.add_argument("--preflop", default="utg/rfi.json")
    ap.add_argument("--stack", type=int, default=40)
    ap.add_argument("--preflop-action", default="raise")
    args = ap.parse_args()

    board_cards = {args.board[i:i + 2] for i in range(0, len(args.board), 2)}
    weights = load_open_weights(args.preflop, args.stack, args.preflop_action)
    expected = [c for c in weights
                if c[:2] not in board_cards and c[2:] not in board_cards]
    expected_set = set(expected)

    sections = parse_paste(open(args.paste).read(), args.action)
    combos = set.union(*(set(s) for s in sections.values()))
    blocked = [c for c in combos if c[:2] in board_cards or c[2:] in board_cards]
    if blocked:
        sys.exit(f"combos using board cards: {sorted(blocked)}")
    missing = sorted(expected_set - combos)
    extra = sorted(combos - expected_set)
    if missing or extra:
        print(f"coverage mismatch vs {args.preflop} stack {args.stack} "
              f"minus board: {len(missing)} missing, {len(extra)} extra")
        if extra:
            print(f"  extra: {extra[:10]}{' ...' if len(extra) > 10 else ''}")
            print("  (extra combos suggest a paste from a different node, "
                  "e.g. the BB's flop decision)")
        if missing:
            print(f"  missing: {missing[:10]}{' ...' if len(missing) > 10 else ''}")
        if args.id:
            sys.exit("refusing store update: coverage is not exact")

    fmt = args.format
    if fmt == "auto":
        fmt = detect_format(sections, weights)
    print(f"format: {fmt} · {len(combos)} combos")

    if fmt == "weighted":
        cond = {a: {} for a in sections}
        for a, freqs in sections.items():
            for c, v in freqs.items():
                cond[a][c] = v / weights[c]
    else:
        cond = {a: dict(freqs) for a, freqs in sections.items()}

    if args.pure:
        for a in list(cond):
            cond[a] = {c: (1.0 if f >= 0.999 else f) for c, f in cond[a].items()}
        main_action = max(cond, key=lambda a: sum(cond[a].values()))
        other = [a for a in cond if a != main_action]
        if all(f >= 0.999 for f in cond[main_action].values()):
            for a in other:
                del cond[a]
            print(f"pure strategy: clamped to 1.0 and dropped {', '.join(other)}")

    # validate conditional sums, apply min-freq convention
    for a in list(cond):
        cond[a] = {c: f for c, f in cond[a].items() if f >= MIN_FREQ}
    actions = list(cond)
    for c in combos:
        total = sum(cond[a].get(c, 0.0) for a in actions)
        if abs(total - 1.0) > 0.0002:
            sys.exit(f"{c}: conditional frequencies sum to {total:.4f}, not 1")

    lines = {a: ",".join(f"{c}:{f:.4f}" for c, f in freqs.items()) for a, freqs in cond.items()}
    for a, line in lines.items():
        print(f"\n{a} {line}")

    bet = cond.get("bet", {})
    check = cond.get("check", {})
    betpct = sum(weights[c] * bet.get(c, 0.0) for c in combos)
    tot = sum(weights[c] for c in combos)
    checkpct = sum(weights[c] * check.get(c, 0.0) for c in combos)
    print(f"\nweighted: bet {100 * betpct / tot:.1f}% · check {100 * checkpct / tot:.1f}%")

    if args.id:
        path = RANGE_STORE / "utg" / "cbet-vs-bb.json"
        store = json.loads(open(path).read())
        entry = next((e for e in store if e.get("id") == args.id), None)
        if entry is None:
            sys.exit(f"no entry with id {args.id} in {path}")
        if args.sizing is None:
            sys.exit("--sizing <bb> is required with --id")
        entry["actions"] = {a: lines[a] for a in lines}
        entry["sizings"] = {"bet": args.sizing}
        with open(path, "w") as f:
            f.write(json.dumps(store, indent=2, ensure_ascii=True) + "\n")
        print(f"updated {args.id} in {path}")


if __name__ == "__main__":
    main()
