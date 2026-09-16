#!/usr/bin/env python3
"""Generate the scenario tree settings under trees/.

Every tree is a full solver-runner spot config minus `board`, plus `_`-prefixed
metadata (line, sources, approximation notes). Bet sizes are taken from the
GTO Wizard captures archived under straddle-solutions/solutions/ — each tree
cites its sources; sizes not present in any capture are approximations and are
flagged in `_notes`.

Turn/river sizings are mostly unarchived; the shared approximation is
33%/66% bets with 2.5x raises (the archived turn/river nodes that do exist —
K83's 113% donk, QcTd6c's 63% turn, the 100bb 25% turn / 100% river — inform
the donk ladders per tree where known).

Run: python3 scripts/make_trees.py   (writes trees/*.json and trees/index.json)
"""

import json
from pathlib import Path

TREES = Path(__file__).resolve().parent.parent / "trees"
SOL = "straddle-solutions/solutions/cev"

# Turn/river approximation shared by lines without archived deep nodes.
TURN_APPROX = ["33%, 66%", "2.5x"]
RIVER_APPROX = ["33%, 66%, a", "2.5x"]

S1_LINE = f"{SOL}/40/flops/r2-f-f-f-f-f-f-c"
S1_TURN_100 = f"{SOL}/100/flops/r2.1-f-f-f-f-f-f-c"
S2_LINE_40 = f"{SOL}/40/flops/f-f-f-f-f-r2.1-f-c"
S2_LINE_50 = f"{SOL}/50/flops/f-f-f-f-f-r2.1-f-c"
SB_BB_LINE = f"{SOL}/40/flops/f-f-f-f-f-f-r3-c"

NOTE_DEEP = "turn/river sizings beyond archived nodes approximated (33%, 66% bets, 2.5x raises)"


def tree(name, line, sources, notes, pot, effective_stack, ranges,
         flop_oop, flop_ip, donk=None, solve=None, system=None):
    cfg = {
        "_name": name,
        "_line": line,
        **({"_system": system} if system else {}),
        "_sources": sources,
        "_notes": notes,
        "pot": pot,
        "effective_stack": effective_stack,
        "ranges": ranges,
        "bet_sizes": {
            "flop": {"oop": flop_oop, "ip": flop_ip},
            "turn": {"oop": TURN_APPROX, "ip": TURN_APPROX},
            "river": {"oop": RIVER_APPROX, "ip": RIVER_APPROX},
        },
        "rake": [0.0, 0.0],
        "add_allin_threshold": 1.5,
        "force_allin_threshold": 0.15,
        "merging_threshold": 0.1,
        "solve": solve or {
            "max_iterations": 2000,
            "target_exploitability_pct_pot": 0.25,
            "compressed": False,
            "print_progress": False,
        },
    }
    if donk:
        cfg["donk_sizes"] = donk
    return cfg


SCENARIOS = [
    # S1 — UTG 2bb open vs BB call, 40bb. BB checks the flop, UTG c-bets.
    # Two buckets: 1.1bb (20% pot) and 4bb (73% pot).
    tree(
        "s1-utg-bb-40-cbet-20",
        "UTG 2bb open vs BB call (40bb cEV), S1 small c-bet: 1.1bb = 20% pot",
        [f"{S1_LINE}/kh8h3c-x.json", f"{S1_LINE}/kh8h3c-x-r1.1.json",
         f"{S1_LINE}/kh8h3c2s-x-r1.1-c.json"],
        f"BB check-raise to 5.7 vs 1.1 (5.18x) and 113% turn donk are archived; {NOTE_DEEP}",
        pot=5.5, effective_stack=38.0,
        ranges={"oop": "bb/vs-utg:40:cEV:call", "ip": "utg/rfi:40:cEV:raise"},
        flop_oop=["", "5.18x"], flop_ip=["20%", "2.5x"],
        donk={"turn": "113%"}, system="S1",
    ),
    tree(
        "s1-utg-bb-40-cbet-73",
        "UTG 2bb open vs BB call (40bb cEV), S1 large c-bet: 4bb = 73% pot",
        [f"{S1_LINE}/askh2c-x.json"],
        "BB check-raise vs 4 approximated at 2.3x (measured ratio vs 55-63% bets); "
        "113% turn donk approximated from the 1.1 line; " + NOTE_DEEP,
        pot=5.5, effective_stack=38.0,
        ranges={"oop": "bb/vs-utg:40:cEV:call", "ip": "utg/rfi:40:cEV:raise"},
        flop_oop=["", "2.3x"], flop_ip=["72.7%", "2.5x"],
        donk={"turn": "113%"}, system="S1",
    ),
    # S1 depth ladder — 20bb and 100bb UTG c-bets.
    tree(
        "utg-bb-20-cbet-20",
        "UTG 2bb open vs BB call (20bb cEV), 1.1bb = 20% pot c-bet",
        [f"{SOL}/20/r2-f-f-f-f-f-f-c/6s6h2c-x.json",
         f"{SOL}/13/r2-f-f-f-f-f-f-c/kc8h4d-x-r1.1.json"],
        "BB check-raise vs 1.1 approximated at 2.8x (13/15bb facing nodes raise to 3.1/3.4); "
        + NOTE_DEEP,
        pot=5.5, effective_stack=18.0,
        ranges={"oop": "bb/vs-utg:20:cEV:call", "ip": "utg/rfi:20:cEV:raise"},
        flop_oop=["", "2.8x"], flop_ip=["20%", "2.5x"],
        donk={"turn": "113%"},
    ),
    tree(
        "utg-bb-20-cbet-47",
        "UTG 2bb open vs BB call (20bb cEV), 2.6bb = 47% pot c-bet",
        [f"{SOL}/20/r2-f-f-f-f-f-f-c/5h4h3c-x.json"],
        "BB check-raise vs 2.6 approximated at 2.3x; " + NOTE_DEEP,
        pot=5.5, effective_stack=18.0,
        ranges={"oop": "bb/vs-utg:20:cEV:call", "ip": "utg/rfi:20:cEV:raise"},
        flop_oop=["", "2.3x"], flop_ip=["47.3%", "2.5x"],
        donk={"turn": "113%"},
    ),
    tree(
        "utg-bb-100-cbet-33",
        "UTG 2.1bb open vs BB call (100bb cEV), 1.9bb = 33% pot c-bet",
        [f"{S1_TURN_100}/6s6h2c-x.json"],
        "UTG opens 2.1 at 100bb; BB call range vs UTG is not in the store below "
        "50bb depths — pass --oop (literal Pio-style ranges work); BB check-raise "
        "approximated at 3x; " + NOTE_DEEP,
        pot=5.7, effective_stack=97.9,
        ranges={"oop": None, "ip": "utg/rfi:100:cEV:raise"},
        flop_oop=["", "3x"], flop_ip=["33.3%", "2.5x"],
        donk={"turn": "25%"},
    ),
    tree(
        "utg-bb-100-cbet-114",
        "UTG 2.1bb open vs BB call (100bb cEV), 6.5bb = 114% pot c-bet",
        [f"{S1_TURN_100}/7c4h2d-x.json"],
        "BB call range vs UTG is not in the store at 100bb — pass --oop (literal "
        "Pio-style ranges work); BB check-raise approximated at 2.3x; " + NOTE_DEEP,
        pot=5.7, effective_stack=97.9,
        ranges={"oop": None, "ip": "utg/rfi:100:cEV:raise"},
        flop_oop=["", "2.3x"], flop_ip=["114%", "2.5x"],
        donk={"turn": "25%"},
    ),
    # S2 — BTN 2.1bb open vs BB call, 40/50bb.
    tree(
        "s2-btn-bb-40-cbet-19",
        "BTN 2.1bb open vs BB call (40bb cEV), S2 small c-bet: 1.1bb = 19% pot",
        [f"{S2_LINE_40}/ah7h2h-x.json"],
        "BB check-raise vs 1.1 approximated at 5.18x (S1's measured ratio); " + NOTE_DEEP,
        pot=5.7, effective_stack=37.9,
        ranges={"oop": "bb/vs-btn:40:cEV:call", "ip": "btn/rfi:40:cEV:raise"},
        flop_oop=["", "5.18x"], flop_ip=["19.3%", "2.5x"],
        donk={"turn": "113%"}, system="S2",
    ),
    tree(
        "s2-btn-bb-40-cbet-72",
        "BTN 2.1bb open vs BB call (40bb cEV), S2 large c-bet: 4.1bb = 72% pot",
        [f"{S2_LINE_40}/9h6d3c-x.json"],
        "BB check-raise vs 4.1 approximated at 2.3x; " + NOTE_DEEP,
        pot=5.7, effective_stack=37.9,
        ranges={"oop": "bb/vs-btn:40:cEV:call", "ip": "btn/rfi:40:cEV:raise"},
        flop_oop=["", "2.3x"], flop_ip=["71.9%", "2.5x"],
        donk={"turn": "113%"}, system="S2",
    ),
    tree(
        "btn-bb-50-cbet-33",
        "BTN 2.1bb open vs BB call (50bb cEV), 1.9bb = 33% pot c-bet",
        [f"{S2_LINE_50}/6s6h2c-x.json"],
        "BB check-raise approximated at 5.18x; " + NOTE_DEEP,
        pot=5.7, effective_stack=47.9,
        ranges={"oop": "bb/vs-btn:50:cEV:call", "ip": "btn/rfi:50:cEV:raise"},
        flop_oop=["", "5.18x"], flop_ip=["33.3%", "2.5x"],
        donk={"turn": "113%"},
    ),
    tree(
        "btn-bb-50-cbet-81",
        "BTN 2.1bb open vs BB call (50bb cEV), 4.6bb = 81% pot c-bet",
        [f"{S2_LINE_50}/5h4h3c-x.json"],
        "BB check-raise approximated at 2.3x; " + NOTE_DEEP,
        pot=5.7, effective_stack=47.9,
        ranges={"oop": "bb/vs-btn:50:cEV:call", "ip": "btn/rfi:50:cEV:raise"},
        flop_oop=["", "2.3x"], flop_ip=["80.7%", "2.5x"],
        donk={"turn": "113%"},
    ),
    # SB-BB battle — SB 3bb open vs BB call (40bb). SB checks the flop, BB leads.
    tree(
        "sb-bb-40-lead-20",
        "SB 3bb open vs BB call (40bb cEV), BB lead after SB checks: 1.4bb = 20% pot",
        [f"{SB_BB_LINE}/ac9h5d-x.json", f"{SB_BB_LINE}/qctd6c-x-r4.4.json"],
        "SB x-raise vs 1.4 approximated at 2.3x (measured ratio vs 4.4); "
        "63% turn donk approximated from the 4.4 line; " + NOTE_DEEP,
        pot=7.0, effective_stack=37.0,
        ranges={"oop": "sb/rfi:40:cEV:raise", "ip": "bb/vs-sb-raise:40:cEV:call"},
        flop_oop=["", "2.3x"], flop_ip=["20%", "2.5x"],
        donk={"turn": "63%"},
    ),
    tree(
        "sb-bb-40-lead-63",
        "SB 3bb open vs BB call (40bb cEV), BB lead after SB checks: 4.4bb = 63% pot",
        [f"{SB_BB_LINE}/qctd6c-x.json", f"{SB_BB_LINE}/qctd6c-x-r4.4.json",
         f"{SB_BB_LINE}/qctd6c2d-x-r4.4-c.json"],
        "SB x-raise to 10.1 vs 4.4 (2.3x) and 63% turn donk are archived; " + NOTE_DEEP,
        pot=7.0, effective_stack=37.0,
        ranges={"oop": "sb/rfi:40:cEV:raise", "ip": "bb/vs-sb-raise:40:cEV:call"},
        flop_oop=["", "2.3x"], flop_ip=["62.9%", "2.5x"],
        donk={"turn": "63.3%"},
    ),
    # Vs 3bet — UTG 2bb open calls CO's 6.5bb 3bet (40bb). UTG checks, CO c-bets.
    tree(
        "utg-vs-co-3bet-40-cbet-20",
        "UTG calls CO's 6.5bb 3bet (40bb cEV), CO c-bet: 3.1bb = 20% pot",
        [f"{SOL}/40/flops/r2-f-f-f-f-r6.5-f-f-c/kdjh2c-x.json"],
        "UTG's call-3bet range is not in the store — pass --oop manually; "
        "UTG x-raise vs 3.1 approximated at 3x; " + NOTE_DEEP,
        pot=15.5, effective_stack=33.5,
        ranges={"oop": None, "ip": "co/vs-utg:40:cEV:raise"},
        flop_oop=["", "3x"], flop_ip=["20%", "2.5x"],
        donk={"turn": "113%"},
    ),
]


def main() -> int:
    TREES.mkdir(exist_ok=True)
    for old in TREES.glob("*.json"):
        if old.name != "index.json":
            old.unlink()
    index = []
    for cfg in SCENARIOS:
        path = TREES / f"{cfg['_name']}.json"
        path.write_text(json.dumps(cfg, indent=2, ensure_ascii=True) + "\n")
        index.append({
            "name": cfg["_name"],
            "line": cfg["_line"],
            **({"system": cfg["_system"]} if "_system" in cfg else {}),
            "pot": cfg["pot"],
            "effective_stack": cfg["effective_stack"],
            "flop_oop": cfg["bet_sizes"]["flop"]["oop"],
            "flop_ip": cfg["bet_sizes"]["flop"]["ip"],
            "turn_donk": cfg.get("donk_sizes", {}).get("turn"),
            "ranges": cfg["ranges"],
            "sources": cfg["_sources"],
        })
    (TREES / "index.json").write_text(json.dumps(index, indent=2, ensure_ascii=True) + "\n")
    print(f"Wrote {len(SCENARIOS)} trees + index.json to {TREES}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
