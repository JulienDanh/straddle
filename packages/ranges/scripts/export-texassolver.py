#!/usr/bin/env python3
"""Export the shared range store into TexasSolver GPU's native data format.

Generates (into packages/ranges/imports/texassolver/, for scp to the app's
install folder on the desktop):

  ranges/straddle/<OPEN>/<size>bb/BB/Call/<POS>_range.txt   class-notation ranges
  quick_start/straddle.jsonl                               spot catalog entries

Range conversion: the store holds exact combos (AsKh:0.99); TexasSolver's
shipped range files use 169-class notation (AKs:1.0). Each class's weight is
the average of its combos' weights — a small fidelity loss (suit-specific
nuances average out) that only shows in 4th-decimal weights.

Spots covered: the two solved flop spots — UTG 2bb open / BB call (S1) and
BTN 2bb open / BB call (S2), both at 40bb.
"""

import json
import os

RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]
SUITS = ["c", "d", "h", "s"]
OUT = "packages/ranges/imports/texassolver"

RANGE_STORE = "packages/ranges/data"

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


def main():
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

    # Parameter files: the full predefined tree — sizing template + our
    # exact-combo ranges (1326-arrays) + one file per solved S1 board.
    # The sizing template is the GUI-saved config (copied here once);
    # only boardText varies between files.
    template_path = f"{OUT}/parameter_template.json"
    if os.path.exists(template_path):
        template = json.load(open(template_path))["config"]
        boards = [
            ("k83", "Kh8h3c"), ("kk3", "KdKh3c"), ("monotone", "AhJh5h"),
            ("j66", "Jh6d6s"), ("ak2", "AsKh2c"),
        ]
        os.makedirs(f"{OUT}/parameters", exist_ok=True)
        ip = load_action(f"{RANGE_STORE}/utg/rfi.json", 40, "raise")
        oop = load_action(f"{RANGE_STORE}/bb/vs-utg.json", 40, "call")
        ip_array = to_range_array(ip)
        oop_array = to_range_array(oop)
        for board_id, board in boards:
            cfg = dict(template)
            cfg["boardText"] = " ".join(
                sorted((board[i:i + 2] for i in range(0, 6, 2)),
                       key=lambda c: RANKS.index(c[0]))
            )
            cfg["ipRange"] = ip_array
            cfg["oopRange"] = oop_array
            path = f"{OUT}/parameters/parameter_straddle_{board_id}.json"
            with open(path, "w") as f:
                json.dump({"config": cfg}, f)
            print(f"  parameter_straddle_{board_id}.json ({cfg['boardText']})")

    print(f"generated {len(catalog)} spots:")
    for entry in catalog:
        print(f"  {entry['scenario_id']}")


if __name__ == "__main__":
    main()
