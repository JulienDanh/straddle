#!/usr/bin/env python3
"""Validate a postflop-solver strategy dump from packages/gto.

Usage: python3 validate.py <file> [file ...]

Checks per section (a section = a `# Player (OOP|IP): [...]` header and its
action lines):
  - combo format: two cards, rank [AKQJT2-9] + suit [cdhs], e.g. 4c3c
  - frequency is a float in [0, 1]
  - no duplicate combos within an action line
  - no combo shares a card with the board (pass --board to check; optional)
  - every combo's frequencies sum to 1.0 across actions (tolerance 0.002
    for 4-decimal rounding)
  - the combo set is identical across actions in a section

Exit code 0 = all checks passed, 1 = any failure (errors listed on stdout).
"""

import re
import sys

COMBO_RE = re.compile(r"^([AKQJT2-9][cdhs])([AKQJT2-9][cdhs])$")
FLOAT_RE = re.compile(r"^\d+(\.\d+)?$")


def parse_line(line):
    """Parse `action combo:freq,combo:freq,...` -> (action, {combo: freq})."""
    parts = line.split(None, 1)
    if len(parts) != 2:
        raise ValueError(f"line has no action prefix: {line[:40]!r}")
    action, body = parts
    combos = {}
    for entry in body.split(","):
        if ":" not in entry:
            raise ValueError(f"entry missing ':': {entry!r}")
        combo, freq = entry.split(":", 1)
        if not COMBO_RE.match(combo):
            raise ValueError(f"bad combo format: {combo!r}")
        if not FLOAT_RE.match(freq):
            raise ValueError(f"bad frequency: {freq!r}")
        value = float(freq)
        if not 0.0 <= value <= 1.0:
            raise ValueError(f"frequency out of [0,1]: {freq!r}")
        if combo in combos:
            raise ValueError(f"duplicate combo {combo} in {action} line")
        combos[combo] = value
    return action, combos


def parse_file(path):
    """Split a dump into sections: [(header, {action: {combo: freq}})]."""
    sections = []
    header = None
    actions = None
    with open(path) as f:
        for raw in f:
            line = raw.strip()
            if not line:
                continue
            if line.startswith("#"):
                if header is not None:
                    sections.append((header, actions))
                header, actions = line, {}
            else:
                if header is None:
                    raise ValueError(f"action line before any header: {line[:40]!r}")
                action, combos = parse_line(line)
                actions[action] = combos
    if header is not None:
        sections.append((header, actions))
    return sections


def validate(path, board_cards=None):
    errors = []
    sections = parse_file(path)
    if not sections:
        return [f"{path}: no sections found"]
    for header, actions in sections:
        where = f"{path} [{header[:60]}]"
        if not actions:
            errors.append(f"{where}: no action lines")
            continue
        name, sets = next(iter(actions.items())), [set(a) for a in actions.values()]
        combo_set = sets[0]
        for other in sets[1:]:
            if other != combo_set:
                only_here = combo_set - other
                only_there = other - combo_set
                errors.append(
                    f"{where}: combo sets differ across actions "
                    f"(missing in others: {sorted(only_here)[:5]}, "
                    f"extra in others: {sorted(only_there)[:5]})"
                )
                break
        for combo in combo_set:
            total = sum(a[combo] for a in actions.values())
            if abs(total - 1.0) > 0.002:
                errors.append(f"{where}: {combo} frequencies sum to {total:.4f}")
        if board_cards:
            board = {board_cards[i : i + 2] for i in range(0, len(board_cards), 2)}
            blocked = sorted(
                c
                for c in combo_set
                if c[0:2] in board or c[2:4] in board
            )
            if blocked:
                errors.append(f"{where}: combos use board cards: {blocked[:5]}")
    return errors


def main():
    argv = sys.argv[1:]
    args = []
    board = None
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--board":
            i += 1
            board = argv[i]
        else:
            args.append(a)
        i += 1
    if not args:
        print(__doc__)
        sys.exit(1)
    all_errors = []
    for path in args:
        try:
            all_errors.extend(validate(path, board))
        except (OSError, ValueError) as e:
            all_errors.append(f"{path}: {e}")
    for e in all_errors:
        print(f"FAIL {e}")
    if all_errors:
        print(f"{len(all_errors)} validation error(s)")
        sys.exit(1)
    print(f"OK: {len(args)} file(s) valid")
    sys.exit(0)


if __name__ == "__main__":
    main()
