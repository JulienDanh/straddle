#!/usr/bin/env python3
"""Classify a flop into its S1 c-bet bucket and build the matching spot.

The S1 decision (packages/study-app/src/pages/S1.tsx + the Sizing page):
  - T-high+ clean boards        -> range bet, 100% of range at 20% pot
  - AKx · 9-high & below · 3+ straights -> polar, strong+weak at ~73% pot
  - soft risk factors (monotone, paired low under high) -> still 20%, check more
  - high-high-low is NOT a risk factor; high-low-low IS

Where the board matches a stored S1/S2 solution (utg/rfi, btn/rfi postflop
children), the stored sizing is authoritative and wins over the rules —
disagreements are reported, not hidden.

With --pot/--effective-stack/--oop/--ip/--out it then builds the spot config
via the matching single-bucket course tree.

Example:
    python3 scripts/board_bucket.py --board Kh8h3c \
        --pot 5.5 --effective-stack 38 \
        --oop "bb/vs-utg:40:cEV:call" --ip "utg/rfi:40:cEV:raise" \
        --out spot.json
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
STORE = REPO / "packages" / "ranges" / "data"
HERE = Path(__file__).resolve().parent
RANKS = "23456789TJQKA"
STRAIGHTS = []  # 5-rank windows, wheel to broadway
for hi in range(4, 14):  # index into "A23456789TJQKA" order below
    pass
# build straights as rank sets (T=8...A=12 in RANKS indexing)
RANK_INDEX = {r: i for i, r in enumerate(RANKS)}
for top in range(12, 3, -1):  # A-high down to 5-high (5,4,3,2,A = wheel)
    window = [(top - i) % 13 if top - i >= 0 else top - i + 13 for i in range(4, -1, -1)]
    # top-i from 4 down to 0: five consecutive ranks ending at top; wheel wraps A
    STRAIGHTS.append(frozenset(window))


def parse_board(board: str) -> list[tuple[str, str]]:
    board = board.strip()
    if len(board) != 6:
        raise SystemExit(f"S1 classification needs a 3-card flop, got {board!r}")
    cards = [(board[i].upper(), board[i + 1].lower()) for i in range(0, 6, 2)]
    if len({c[0] + c[1] for c in cards}) != 3:
        raise SystemExit("board cards must be unique")
    return cards


def classify(board: str) -> dict:
    cards = parse_board(board)
    ranks = [RANK_INDEX[c[0]] for c in cards]  # 2=0 ... A=12
    suits = {c[1] for c in cards}
    high = max(ranks)
    board_ranks = set(ranks)
    pair_rank = next((r for r in ranks if ranks.count(r) == 2), None)
    trips = any(ranks.count(r) == 3 for r in ranks)

    akx = RANK_INDEX["A"] in board_ranks and RANK_INDEX["K"] in board_ranks
    monotone = len(suits) == 1
    paired_low_under_high = pair_rank is not None and pair_rank < high
    high_low_low = paired_low_under_high and pair_rank is not None
    straight_count = sum(1 for s in STRAIGHTS if len(s & board_ranks) >= 2)

    fired = []
    if high >= RANK_INDEX["T"]:
        if akx:
            fired.append("AKx -> polar")
        elif straight_count >= 3:
            fired.append(f"{straight_count}+ straights -> polar")
        elif monotone:
            fired.append("monotone -> soft risk factor, still 20% (check more)")
        elif high_low_low:
            fired.append("high-low-low -> soft risk factor, still 20% (check more)")
        else:
            fired.append("T-high+ clean -> range bet")
        bucket = "polar" if (akx or straight_count >= 3) else "range"
    else:
        fired.append("9-high & below -> polar (mix ~70/30)")
        bucket = "polar"
    return {
        "bucket": bucket,
        "size": "73% (4bb)" if bucket == "polar" else "20% (1.1bb)",
        "rules": fired,
        "detail": {
            "high": RANKS[high], "akx": akx, "monotone": monotone,
            "paired_low_under_high": paired_low_under_high,
            "straights_with_2plus_board_cards": straight_count, "trips": trips,
        },
    }


def stored_sizing(board: str) -> dict | None:
    """Look the board up in the stored S1/S2 postflop children."""
    child_id = "".join(c[0] for c in parse_board(board)).lower()
    for line in ("utg/rfi", "btn/rfi"):
        data = json.loads((STORE / f"{line}.json").read_text())
        for entry in (s for s in data["stacks"] if s["stack"] == 40 and s["type"] == "cEV"):
            for child in entry.get("postflop", []):
                if child["id"] == child_id:
                    return {
                        "line": line, "label": child["label"],
                        "bet_bb": child.get("sizings", {}).get("bet"),
                        "board_matches": child["label"].lower() == board.lower(),
                    }
    return None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--board", required=True, help="3-card flop, e.g. Kh8h3c")
    parser.add_argument("--aggressor", choices=["ip", "oop"], default="ip", help="which side opened (default: ip)")
    parser.add_argument("--force", choices=["range", "polar"], default=None, help="override the bucket")
    # spot building (optional): forwarded to spot_from_store.py
    parser.add_argument("--pot", type=float, default=None)
    parser.add_argument("--effective-stack", type=float, default=None)
    parser.add_argument("--oop", default=None)
    parser.add_argument("--ip", default=None)
    parser.add_argument("--out", default=None)
    args = parser.parse_args()

    result = classify(args.board)
    stored = stored_sizing(args.board)
    bucket = args.force or result["bucket"]

    print(f"Board {args.board}")
    for rule in result["rules"]:
        print(f"  rule:  {rule}")
    if result["detail"]["straights_with_2plus_board_cards"]:
        print(f"  (straight count: {result['detail']['straights_with_2plus_board_cards']})")
    if stored:
        stored_bucket = "polar" if stored["bet_bb"] and stored["bet_bb"] >= 2.5 else "range"
        print(f"  stored: {stored['line']} {stored['label']} -> bet {stored['bet_bb']}bb ({stored_bucket})")
        if not args.force:
            if stored_bucket != bucket:
                print(f"  NOTE: taught rules say {bucket}, the stored solution says {stored_bucket} — stored wins.")
                bucket = stored_bucket
    print(f"  bucket: {bucket} -> course-{'rangebet' if bucket == 'range' else 'polar'}-{args.aggressor}")

    if args.out:
        if not (args.pot and args.effective_stack and args.oop and args.ip):
            raise SystemExit("--out needs --pot --effective-stack --oop --ip")
        tree = f"course-{'rangebet' if bucket == 'range' else 'polar'}-{args.aggressor}"
        cmd = [
            sys.executable, str(HERE / "spot_from_store.py"), "--tree", tree,
            "--board", args.board, "--pot", str(args.pot),
            "--effective-stack", str(args.effective_stack),
            "--oop", args.oop, "--ip", args.ip, "--out", args.out,
        ]
        print(f"  building: {' '.join(cmd[1:])}")
        raise SystemExit(subprocess.run(cmd).returncode)
    return 0


if __name__ == "__main__":
    sys.exit(main())
