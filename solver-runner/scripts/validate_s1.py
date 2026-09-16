#!/usr/bin/env python3
"""Run every stored S1 board through the single-bucket play and tabulate.

For each postflop child on utg/rfi 40bb cEV: classify the board (stored
sizing wins), build the spot with the matching single-size course tree,
solve, and compare against the stored Wizard solution. Prints one line per
board while running and a final table.

    python3 scripts/validate_s1.py [--boards k83,ak2,...] [--out results.json]
"""

import argparse
import json
import re
import subprocess
import sys
import time
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
STORE = REPO / "packages" / "ranges" / "data"
HERE = Path(__file__).resolve().parent
RUNNER = HERE.parent
SOLVER = RUNNER / "target" / "release" / "solver-runner"
PYTHON = sys.executable


def stored_s1_boards() -> list[dict]:
    data = json.loads((STORE / "utg/rfi.json").read_text())
    entry = [s for s in data["stacks"] if s["stack"] == 40 and s["type"] == "cEV"][0]
    return entry.get("postflop", [])


def run_solver_and_compare(board: str, child_id: str, bet_bb: float, out_dir: Path) -> dict:
    bucket = "polar" if bet_bb >= 2.5 else "range"
    tree = f"course-{'polar' if bucket == 'polar' else 'rangebet'}-ip"
    action = f"Bet({bet_bb:g})"
    spot = out_dir / f"{child_id}-spot.json"
    result = out_dir / f"{child_id}-result.json"

    build = subprocess.run(
        [PYTHON, str(HERE / "board_bucket.py"), "--board", board,
         "--pot", "5.5", "--effective-stack", "38",
         "--oop", "bb/vs-utg:40:cEV:call", "--ip", "utg/rfi:40:cEV:raise",
         "--out", str(spot)],
        capture_output=True, text=True)
    if build.returncode != 0:
        return {"board": board, "error": build.stderr.strip() or build.stdout.strip()}

    solve = subprocess.run(
        [str(SOLVER), "--config", str(spot), "--out", str(result), "--walk", "check"],
        capture_output=True, text=True)
    if solve.returncode != 0:
        return {"board": board, "error": solve.stderr.strip()[-300:]}

    compare = subprocess.run(
        [PYTHON, str(HERE / "compare_wizard.py"), "--result", str(result),
         "--child", f"utg/rfi:40:cEV:{child_id}", "--action", "bet",
         "--solver-action", action, "--top", "0"],
        capture_output=True, text=True)
    text = compare.stdout
    if compare.returncode != 0:
        return {"board": board, "error": (compare.stderr or text).strip()[-300:]}

    def grab(pattern: str) -> float:
        m = re.search(pattern, text)
        return float(m.group(1)) if m else float("nan")

    return {
        "board": board,
        "tree": tree,
        "wizard_bet_pct": grab(r"Weighted bet share of range: Wizard ([\d.]+)%"),
        "solver_bet_pct": grab(r"\| solver ([\d.]+)%"),
        "mean_abs_diff": grab(r"mean \|diff\| ([\d.]+)"),
        "pearson_r": grab(r"Pearson r (-?[\d.]+)"),
        "exploitability_pct_pot": grab(r"\(([\d.]+)% of pot\)"),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--boards", default="", help="comma-separated child ids (default: all stored)")
    parser.add_argument("--out", default="", help="write results JSON here")
    args = parser.parse_args()

    children = stored_s1_boards()
    if args.boards:
        wanted = {c.strip() for c in args.boards.split(",")}
        children = [c for c in children if c["id"] in wanted]

    out_dir = Path("/tmp/s1-validate")
    out_dir.mkdir(exist_ok=True)

    rows = []
    for child in children:
        bet = child["sizings"]["bet"]
        print(f"[{child['id']}] {child['label']} @ {bet}bb ...", flush=True)
        t0 = time.time()
        row = run_solver_and_compare(child["label"], child["id"], bet, out_dir)
        row["bet_bb"] = bet
        row["seconds"] = round(time.time() - t0, 1)
        rows.append(row)
        if "error" in row:
            print(f"  ERROR: {row['error']}", flush=True)
        else:
            print(f"  wizard {row['wizard_bet_pct']:.1f}% | solver {row['solver_bet_pct']:.1f}% "
                  f"| mean|d| {row['mean_abs_diff']:.4f} | r {row['pearson_r']:.2f} "
                  f"| {row['exploitability_pct_pot']}% pot ({row['seconds']}s)", flush=True)

    print()
    print(f"{'board':<9}{'size':>5}{'bucket':>8}{'wiz%':>8}{'solver%':>9}{'mean|d|':>9}{'r':>7}")
    for r in rows:
        if "error" in r:
            print(f"{r['board']:<9}  ERROR")
            continue
        bucket = "polar" if r["bet_bb"] >= 2.5 else "range"
        print(f"{r['board']:<9}{r['bet_bb']:>5}{bucket:>8}"
              f"{r['wizard_bet_pct']:>8.1f}{r['solver_bet_pct']:>9.1f}"
              f"{r['mean_abs_diff']:>9.4f}{r['pearson_r']:>7.2f}")

    if args.out:
        Path(args.out).write_text(json.dumps(rows, indent=2) + "\n")
        print(f"\nWrote {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
