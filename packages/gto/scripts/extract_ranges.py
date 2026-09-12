#!/usr/bin/env python3
"""Extract weighted combo range strings from the JSON range store into flat
text files the gto solver scripts feed to Range::from_str. Run from the repo
root.

The JSON files (design-system/src/data/ranges/data/) are the single source of
truth for all stored ranges; the .txt files here are derived solver input —
one weighted combo:freq line per player, re-run this whenever the JSON
changes. JSON keeps per-action frequencies (raise/call/allIn separately);
the solver gets a single flattened weight per combo, so a spot's input is one
chosen action's string (e.g. BB 3-bet range = the raise line).
"""
import json
import sys

DATA = "packages/design-system/src/data/ranges/data"

# (json file, stack, action, destination)
EXTRACTS = [
    ("utg-rfi-cev.json", 40, "raise", "packages/gto/ranges/utg-40bb-open.txt"),
    ("bb-vs-utg-cev.json", 40, "raise", "packages/gto/ranges/bb-40bb-3bet.txt"),
    ("bb-vs-utg-cev.json", 40, "call", "packages/gto/ranges/bb-40bb-call.txt"),
]


def main():
    for filename, stack, action, dest in EXTRACTS:
        with open(f"{DATA}/{filename}") as f:
            entries = json.load(f)
        entry = next((e for e in entries if e["stack"] == stack), None)
        if entry is None:
            sys.exit(f"no stack {stack} in {filename}")
        text = entry["actions"].get(action)
        if not text:
            sys.exit(f"no {action} action at stack {stack} in {filename}")
        with open(dest, "w") as f:
            f.write(text)
        combos = [c for c in text.split(",") if ":" in c]
        total = sum(float(c.split(":")[1]) for c in combos)
        print(f"{dest}: {len(combos)} combos, weighted sum {total:.1f}")


if __name__ == "__main__":
    main()
