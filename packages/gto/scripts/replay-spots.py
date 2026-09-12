#!/usr/bin/env python3
"""Replay every spot in spots.json with the release binaries.

Usage: python3 scripts/replay-spots.py   (from packages/gto, after
       cargo build --release)

Each board is solved with --out target/solves/<spot>-<board>.txt, skipping
solves whose output already exists (delete the file to force a re-run).
The spot parameters live in the binaries as constants; spots.json is the
record of what they are (and what produced the app's stored range data).
"""

import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "target" / "solves"


def main():
    with open(ROOT / "spots.json") as f:
        manifest = json.load(f)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    failures = []
    for spot in manifest["spots"]:
        binary = ROOT / "target" / "release" / spot["bin"]
        if not binary.exists():
            sys.exit(f"binary not found: {binary} (run cargo build --release)")
        for board in spot["boards"]:
            out = OUT_DIR / f"{spot['id']}-{board['id']}.txt"
            if out.exists():
                print(f"skip {out.name} (exists)")
                continue
            cmd = [
                str(binary),
                str(spot["iterations"]),
                "--board",
                board["board"],
            ]
            if spot.get("compressed"):
                cmd.append("--compressed")
            cmd += ["--out", str(out)]
            print(f"solving {board['board']} -> {out}")
            result = subprocess.run(cmd)
            if result.returncode != 0:
                failures.append(board["board"])
    if failures:
        sys.exit(f"failed boards: {failures}")
    print(f"all spots solved; outputs in {OUT_DIR}")


if __name__ == "__main__":
    main()
