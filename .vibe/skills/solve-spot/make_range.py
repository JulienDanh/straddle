#!/usr/bin/env python3
"""Convert a postflop-solver strategy dump into app StoredRange action lines.

Usage: python3 make_range.py <file> [--last | --section <n>]
                              [--min-freq <value>]

Merges the chosen section's action lines into the `data/ranges` combo
format (one line per action, `check 4c3c:0.0009,...`):

  - all `bet*` and `allIn` lines are summed into a single `bet` line
  - `raise*` lines are summed into a single `raise` line
  - `check`, `call`, `fold` are kept as-is
  - combos whose frequency for that action is below --min-freq are dropped
    (default 0.00005, i.e. anything that displays as 0.0001 or more)

--last selects the last section (UTG's c-bet strategy in s1-cbet output);
--section <n> selects the 1-based section instead. Prints paste-ready
lines to stdout.
"""

import sys

from validate import parse_file


def merge_section(actions, min_freq):
    """Sum action groups into {action: {combo: freq}} in display order."""
    order = ["check", "bet", "raise", "call", "fold"]
    groups = {
        "check": ["check"],
        "bet": None,  # collected below (all bet* and allIn)
        "raise": None,  # collected below (all raise*)
        "call": ["call"],
        "fold": ["fold"],
    }
    out = {}
    for group in order:
        if group == "bet":
            sources = [a for a in actions if a.startswith("bet") or a == "allIn"]
        elif group == "raise":
            sources = [a for a in actions if a.startswith("raise")]
        else:
            sources = groups[group]
        if not any(a in actions for a in sources):
            continue
        merged = {}
        for action in sources:
            for combo, freq in actions[action].items():
                merged[combo] = merged.get(combo, 0.0) + freq
        kept = {c: f for c, f in merged.items() if f >= min_freq}
        if kept:
            out[group] = kept
    return out


def main():
    args = []
    section = None
    want_last = False
    min_freq = 0.00005
    argv = sys.argv[1:]
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--last":
            want_last = True
        elif a == "--section":
            i += 1
            section = int(argv[i])
        elif a == "--min-freq":
            i += 1
            min_freq = float(argv[i])
        else:
            args.append(a)
        i += 1
    if len(args) != 1:
        print(__doc__)
        sys.exit(1)

    sections = parse_file(args[0])
    if not sections:
        print("no sections found", file=sys.stderr)
        sys.exit(1)
    if want_last or section is None:
        section = len(sections)
    header, actions = sections[section - 1]

    merged = merge_section(actions, min_freq)
    print(f"# {header}")
    for action, combos in merged.items():
        body = ",".join(f"{c}:{f:.4f}" for c, f in combos.items())
        print(f"{action} {body}")


if __name__ == "__main__":
    main()
