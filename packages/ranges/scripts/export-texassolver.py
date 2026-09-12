#!/usr/bin/env python3
"""Export the shared range store into TexasSolver GPU's native data format.

Generates (into packages/ranges/imports/texassolver/):

  ranges/straddle/<OPEN>/<size>bb/BB/Call/<POS>_range.txt   class-notation ranges
  quick_start/straddle.jsonl                               spot catalog entries
  parameters/parameter_straddle_<board>.json               full predefined trees:
    sizing template + exact-combo 1326-arrays + board, one per solved board.
    The board list comes from the store (utg/cbet-vs-bb.json), so newly
    solved boards flow in automatically.

Range conversion note: the class-notation range files average suit-specific
weights within each of the 169 classes; the parameter files use the app's
1326-combo arrays and keep full exact-combo fidelity (no averaging).

The sizing template (packages/ranges/texassolver-template.json, committed)
was captured from one GUI session; re-save in the app if sizings ever change.

Usage:
  python3 packages/ranges/scripts/export-texassolver.py            # generate
  python3 packages/ranges/scripts/export-texassolver.py --deploy   # + scp to
    the desktop app install (host via GTO_DESKTOP, default
    danhj@100.76.177.7, path via GTO_DESKTOP_DIR)
"""

import glob
import json
import os
import re
import subprocess
import sys

RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]
SUITS = ["c", "d", "h", "s"]
OUT = "packages/ranges/imports/texassolver"
TEMPLATE = "packages/ranges/texassolver-template.json"

RANGE_STORE = "packages/ranges/data"

DESKTOP_HOST = os.environ.get("GTO_DESKTOP", "danhj@100.76.177.7")
DESKTOP_DIR = os.environ.get(
    "GTO_DESKTOP_DIR", "Downloads/TexasSolverGpu-v0.2.0-windows-x64"
)

# TexasSolver GPU order: cards 2c,2d,2h,2s,3c,...,As (ascending rank, cdhs),
# all unordered pairs (i,j) with i<j sorted by i then j.
CARD_ORDER = [r + s for r in reversed(RANKS) for s in SUITS]
PAIR_ORDER = [
    (CARD_ORDER[i], CARD_ORDER[j])
    for i in range(len(CARD_ORDER))
    for j in range(i + 1, len(CARD_ORDER))
]
assert len(PAIR_ORDER) == 1326


def to_range_array(combo_freq):
    """Exact-combo {combo: freq} -> the app's 1326-float array."""
    array = []
    for a, b in PAIR_ORDER:
        combo = a + b
        # store pair combos use descending suit order (AdAc); try both orders
        if combo in combo_freq:
            array.append(combo_freq[combo])
        elif b + a in combo_freq:
            array.append(combo_freq[b + a])
        else:
            array.append(0.0)
    return array


def class_combos(cls):
    """All exact combos of a 169-class like 'AA', 'AKs', 'AKo'."""
    hi, lo = cls[0], cls[1]
    if hi == lo:  # pair — store convention is descending suit index (e.g. AdAc)
        return [hi + b + hi + a for i, a in enumerate(SUITS) for b in SUITS[i + 1:]]
    suited = cls[2] == "s"
    return [
        hi + s1 + lo + s2
        for s1 in SUITS
        for s2 in SUITS
        if (s1 == s2) == suited
    ]


def all_classes():
    """169 classes in canonical order: pairs, suited (hi>lo), offsuit (hi>lo)."""
    classes = [r + r for r in RANKS]
    classes += [hi + lo + "s" for i, hi in enumerate(RANKS) for lo in RANKS[i + 1:]]
    classes += [hi + lo + "o" for i, hi in enumerate(RANKS) for lo in RANKS[i + 1:]]
    return classes


def to_class_notation(combo_freq):
    """Exact-combo {combo: freq} -> class-notation string 'AA:1.0,AKs:0.98,...'"""
    parts = []
    for cls in all_classes():
        freqs = [combo_freq.get(c, 0.0) for c in class_combos(cls)]
        w = sum(freqs) / len(freqs)
        if w > 0:
            parts.append(f"{cls}:{w:.4f}")
    return ",".join(parts)


def load_action(path, stack, action):
    entries = json.load(open(path))
    entry = next(e for e in entries if e["stack"] == stack)
    s = entry["actions"][action]
    return {c.split(":")[0]: float(c.split(":")[1]) for c in s.split(",")}


def write_range_file(relpath, combos):
    path = os.path.join(OUT, "ranges", relpath)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(to_class_notation(combos))


def solved_boards():
    """Boards from the store's utg/cbet-vs-bb.json — (id, cards) pairs."""
    entries = json.load(open(f"{RANGE_STORE}/utg/cbet-vs-bb.json"))
    boards = []
    for e in entries:
        m = re.search(r"\(((?:[AKQJT2-9][cdhs]){3})\)", e["subtitle"])
        boards.append((e["id"], m.group(1)))
    return boards


def validate_parameter(cfg, board):
    assert len(cfg["ipRange"]) == len(cfg["oopRange"]) == 1326, "range arrays"
    assert cfg["boardText"].split() == [
        board[i:i + 2] for i in range(0, 6, 2)
    ] or sorted(cfg["boardText"].split()) == sorted(
        board[i:i + 2] for i in range(0, 6, 2)
    ), f"board mismatch: {cfg['boardText']}"
    for key in ("startingPot", "effectiveStack", "ipFlopBet", "oopFlopBet",
                "maxRaiseNumber"):
        assert key in cfg, f"missing sizing key {key}"
    for name in ("ipRange", "oopRange"):
        arr = cfg[name]
        assert all(0.0 <= x <= 1.0 for x in arr), f"{name} out of [0,1]"


def main():
    deploy = "--deploy" in sys.argv

    spots = [
        {  # System 1: UTG opens 2bb, BB calls; UTG is IP postflop
            "open": "UTG",
            "open_range": load_action(f"{RANGE_STORE}/utg/rfi.json", 40, "raise"),
            "bb_range": load_action(f"{RANGE_STORE}/bb/vs-utg.json", 40, "call"),
        },
        {  # System 2: BTN opens 2bb, BB calls
            "open": "BTN",
            "open_range": load_action(f"{RANGE_STORE}/btn/rfi.json", 40, "raise"),
            "bb_range": load_action(f"{RANGE_STORE}/bb/vs-btn.json", 40, "call"),
        },
    ]

    catalog = []
    for spot in spots:
        open_pos = spot["open"]
        rel = f"straddle/{open_pos}/2.0bb/BB/Call"
        write_range_file(f"{rel}/{open_pos}_range.txt", spot["open_range"])
        write_range_file(f"{rel}/BB_range.txt", spot["bb_range"])
        catalog.append({
            "scenario_id": f"{open_pos}/2.0bb/BB/Call|{open_pos}-BB",
            "rel_leaf_path": f"{open_pos}/2.0bb/BB/Call",
            "open_pos": open_pos,
            "open_size_bb": 2.0,
            "actions": [{"actor": "BB", "raw_action": "Call"}],
            "players": [open_pos, "BB"],
            "oop_pos": "BB",
            "ip_pos": open_pos,
            "vs_pos": "BB",
            "action_class": "CALL",
            "range_files": {
                open_pos: f"{rel}/{open_pos}_range.txt",
                "BB": f"{rel}/BB_range.txt",
            },
            "computed_flop_pot": 4.5,
            "computed_flop_eff_stack": 38,
            "flop_playable": True,
            "calc_note": "",
            "game": {"players": 6, "sb": 0.5, "bb": 1, "ante": 0, "straddle": 0, "stack": 40},
        })

    os.makedirs(f"{OUT}/quick_start", exist_ok=True)
    with open(f"{OUT}/quick_start/straddle.jsonl", "w") as f:
        for entry in catalog:
            f.write(json.dumps(entry) + "\n")
    print(f"spots: {[e['scenario_id'] for e in catalog]}")

    # Parameter files — the full predefined trees.
    if not os.path.exists(TEMPLATE):
        sys.exit(f"sizing template missing: {TEMPLATE}\n"
                 "re-save one config from the app's GUI and copy its config "
                 "(without boardText/ranges) to that path")
    template = json.load(open(TEMPLATE))["config"]

    boards = solved_boards()
    ip = load_action(f"{RANGE_STORE}/utg/rfi.json", 40, "raise")
    oop = load_action(f"{RANGE_STORE}/bb/vs-utg.json", 40, "call")
    ip_array = to_range_array(ip)
    oop_array = to_range_array(oop)

    os.makedirs(f"{OUT}/parameters", exist_ok=True)
    for board_id, board in boards:
        cfg = dict(template)
        cfg["boardText"] = " ".join(
            board[i:i + 2] for i in range(0, 6, 2)
        )
        cfg["ipRange"] = ip_array
        cfg["oopRange"] = oop_array
        validate_parameter(cfg, board)
        path = f"{OUT}/parameters/parameter_straddle_{board_id}.json"
        with open(path, "w") as f:
            json.dump({"config": cfg}, f)
        print(f"  parameter_straddle_{board_id}.json ({cfg['boardText']})")

    if deploy:
        run = lambda *cmd: subprocess.run(list(cmd), check=True)
        print(f"deploying to {DESKTOP_HOST}:{DESKTOP_DIR} ...")
        run("scp", "-o", "BatchMode=yes", "-r",
            f"{OUT}/ranges/straddle", f"{DESKTOP_HOST}:{DESKTOP_DIR}/ranges/")
        run("scp", "-o", "BatchMode=yes",
            f"{OUT}/quick_start/straddle.jsonl", f"{DESKTOP_HOST}:{DESKTOP_DIR}/quick_start/")
        params = sorted(glob.glob(f"{OUT}/parameters/parameter_straddle_*.json"))
        run("scp", "-o", "BatchMode=yes", *params,
            f"{DESKTOP_HOST}:{DESKTOP_DIR}/parameters/")
        print(f"deployed {len(params)} parameter files")


if __name__ == "__main__":
    main()
