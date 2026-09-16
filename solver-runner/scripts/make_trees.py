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

S1_LINE = f"{SOL}/40/flops/r2-f-f-f-f-f-f-c"
S1_TURN_100 = f"{SOL}/100/flops/r2.1-f-f-f-f-f-f-c"
S2_LINE_40 = f"{SOL}/40/flops/f-f-f-f-f-r2.1-f-c"
S2_LINE_50 = f"{SOL}/50/flops/f-f-f-f-f-r2.1-f-c"
SB_BB_LINE = f"{SOL}/40/flops/f-f-f-f-f-f-r3-c"

# The course's own bet-size tree for the streets the captures do not cover
# (Sizing page, per-system sourced):
#   turn — OOP leads the 33% block (S10), check-raises to pot or jams (S6);
#          IP barrels geometric ~115% (S5/S8; the solver's "e" IS geometric)
#   river — IP 67% default value/bluff (S4/S11), 130% overbet vs capped (S4/S10);
#          OOP blocks 33%, value/bluffs 67% (S4/S10); the all-in option is
#          added automatically by add_allin_threshold where the course jams
#   both streets — IP raises are jams only ("never min-raise", S7)
COURSE_TURN = {"oop": ["33%", "100%, a"], "ip": ["e", "a"]}
COURSE_RIVER = {"oop": ["33%, 67%", "100%, a"], "ip": ["67%, 130%", "a"]}
NOTE_COURSE_DEEP = ("turn/river sizes follow the course's bet-size tree (Sizing page): "
                     "OOP block 33% (S10), CR to pot or jam (S6), IP geometric barrel "
                     "(S5/S8), river 67%/130% and jams via threshold (S4/S10/S11)")

# What the archived captures cover per tree (shown on the study-app page).
FIDELITY_DEFAULT = "flop archived · x-raise approx"
FIDELITY = {
    "generic-cbet-ip": "course bet-size tree — pot-relative, any depth",
    "generic-cbet-oop": "course bet-size tree — pot-relative, any depth",
    "s1-utg-bb-40-cbet-20": "flop · x-raise · donk archived",
    "sb-bb-40-lead-63": "flop · x-raise · donk archived",
    "s1-utg-bb-40-cbet-73": "flop archived · x-raise & donk approx",
    "s2-btn-bb-40-cbet-19": "flop archived · x-raise & donk approx",
    "s2-btn-bb-40-cbet-72": "flop archived · x-raise & donk approx",
    "btn-bb-50-cbet-33": "flop archived · x-raise & donk approx",
    "btn-bb-50-cbet-81": "flop archived · x-raise & donk approx",
    "utg-bb-20-cbet-47": "flop archived",
}


def tree(name, line, sources, notes, pot, effective_stack, ranges,
         flop_oop, flop_ip, donk=None, solve=None, system=None,
         turn=None, river=None):
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
            "turn": turn or COURSE_TURN,
            "river": river or COURSE_RIVER,
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
        # river donk = the OOP block (S10) unless the tree overrides it
        donk = {"river": "33%", **donk}
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
        f"BB check-raise to 5.7 vs 1.1 (5.18x) and 113% turn donk are archived; {NOTE_COURSE_DEEP}",
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
        "113% turn donk approximated from the 1.1 line; " + NOTE_COURSE_DEEP,
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
        + NOTE_COURSE_DEEP,
        pot=5.5, effective_stack=18.0,
        ranges={"oop": "bb/vs-utg:20:cEV:call", "ip": "utg/rfi:20:cEV:raise"},
        flop_oop=["", "2.8x"], flop_ip=["20%", "2.5x"],
        donk={"turn": "113%"},
    ),
    tree(
        "utg-bb-20-cbet-47",
        "UTG 2bb open vs BB call (20bb cEV), 2.6bb = 47% pot c-bet",
        [f"{SOL}/20/r2-f-f-f-f-f-f-c/5h4h3c-x.json"],
        "BB check-raise vs 2.6 approximated at 2.3x; " + NOTE_COURSE_DEEP,
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
        "approximated at 3x; " + NOTE_COURSE_DEEP,
        pot=5.7, effective_stack=97.9,
        ranges={"oop": None, "ip": "utg/rfi:100:cEV:raise"},
        flop_oop=["", "3x"], flop_ip=["33.3%", "2.5x"],
        donk={"turn": "113%"},
    ),
    tree(
        "utg-bb-100-cbet-114",
        "UTG 2.1bb open vs BB call (100bb cEV), 6.5bb = 114% pot c-bet",
        [f"{S1_TURN_100}/7c4h2d-x.json"],
        "BB call range vs UTG is not in the store at 100bb — pass --oop (literal "
        "Pio-style ranges work); BB check-raise approximated at 2.3x; " + NOTE_COURSE_DEEP,
        pot=5.7, effective_stack=97.9,
        ranges={"oop": None, "ip": "utg/rfi:100:cEV:raise"},
        flop_oop=["", "2.3x"], flop_ip=["114%", "2.5x"],
        donk={"turn": "113%"},
    ),
    # S2 — BTN 2.1bb open vs BB call, 40/50bb.
    tree(
        "s2-btn-bb-40-cbet-19",
        "BTN 2.1bb open vs BB call (40bb cEV), S2 small c-bet: 1.1bb = 19% pot",
        [f"{S2_LINE_40}/ah7h2h-x.json"],
        "BB check-raise vs 1.1 approximated at 5.18x (S1's measured ratio); " + NOTE_COURSE_DEEP,
        pot=5.7, effective_stack=37.9,
        ranges={"oop": "bb/vs-btn:40:cEV:call", "ip": "btn/rfi:40:cEV:raise"},
        flop_oop=["", "5.18x"], flop_ip=["19.3%", "2.5x"],
        donk={"turn": "113%"}, system="S2",
    ),
    tree(
        "s2-btn-bb-40-cbet-72",
        "BTN 2.1bb open vs BB call (40bb cEV), S2 large c-bet: 4.1bb = 72% pot",
        [f"{S2_LINE_40}/9h6d3c-x.json"],
        "BB check-raise vs 4.1 approximated at 2.3x; " + NOTE_COURSE_DEEP,
        pot=5.7, effective_stack=37.9,
        ranges={"oop": "bb/vs-btn:40:cEV:call", "ip": "btn/rfi:40:cEV:raise"},
        flop_oop=["", "2.3x"], flop_ip=["71.9%", "2.5x"],
        donk={"turn": "113%"}, system="S2",
    ),
    tree(
        "btn-bb-50-cbet-33",
        "BTN 2.1bb open vs BB call (50bb cEV), 1.9bb = 33% pot c-bet",
        [f"{S2_LINE_50}/6s6h2c-x.json"],
        "BB check-raise approximated at 5.18x; " + NOTE_COURSE_DEEP,
        pot=5.7, effective_stack=47.9,
        ranges={"oop": "bb/vs-btn:50:cEV:call", "ip": "btn/rfi:50:cEV:raise"},
        flop_oop=["", "5.18x"], flop_ip=["33.3%", "2.5x"],
        donk={"turn": "113%"},
    ),
    tree(
        "btn-bb-50-cbet-81",
        "BTN 2.1bb open vs BB call (50bb cEV), 4.6bb = 81% pot c-bet",
        [f"{S2_LINE_50}/5h4h3c-x.json"],
        "BB check-raise approximated at 2.3x; " + NOTE_COURSE_DEEP,
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
        "63% turn donk approximated from the 4.4 line; " + NOTE_COURSE_DEEP,
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
        "SB x-raise to 10.1 vs 4.4 (2.3x) and 63% turn donk are archived; " + NOTE_COURSE_DEEP,
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
        "UTG x-raise vs 3.1 approximated at 3x; " + NOTE_COURSE_DEEP,
        pot=15.5, effective_stack=33.5,
        ranges={"oop": None, "ip": "co/vs-utg:40:cEV:raise"},
        flop_oop=["", "3x"], flop_ip=["20%", "2.5x"],
        donk={"turn": "113%"},
    ),

    # Generic trees — the course bet-size ladder, pot-relative, any line/depth.
    # The one scenario fact a solver tree cannot infer is which side was the
    # preflop aggressor (the crate's sizes are per-position, not per-role),
    # so there are two: aggressor in position (opener called by a blind) and
    # aggressor out of position (early open, later caller).
    tree(
        "generic-cbet-ip",
        "Generic SRP tree — preflop aggressor is IN position (any depth; pass pot/stack/ranges)",
        [],
        "No captures: flop offers both course buckets (20% range bet, 73% polar) "
        "and the solver picks per texture; OOP x-raise 5.18x (S1's measured to-5.7 "
        "vs the small bet) plus the jam (S6). " + NOTE_COURSE_DEEP,
        pot=None, effective_stack=None,
        ranges={"oop": None, "ip": None},
        flop_oop=["", "5.18x, a"], flop_ip=["20%, 73%", "2.5x"],
        donk={"turn": "113%", "river": "33%"},
    ),
    tree(
        "generic-cbet-oop",
        "Generic SRP tree — preflop aggressor is OUT of position (any depth; pass pot/stack/ranges)",
        [],
        "Same ladder with the flop roles flipped: OOP c-bets, IP check-raises. "
        + NOTE_COURSE_DEEP,
        pot=None, effective_stack=None,
        ranges={"oop": None, "ip": None},
        flop_oop=["20%, 73%", "2.5x"], flop_ip=["", "5.18x, a"],
        donk={"turn": "113%", "river": "33%"},
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
            "fidelity": FIDELITY.get(cfg["_name"], FIDELITY_DEFAULT),
            "sources": cfg["_sources"],
        })
    text = json.dumps(index, indent=2, ensure_ascii=True) + "\n"
    (TREES / "index.json").write_text(text)
    # copy for the study-app Solver Trees page (self-contained for CI)
    app_copy = Path(__file__).resolve().parents[2] / "packages" / "study-app" / "src" / "data" / "solver-trees.json"
    app_copy.parent.mkdir(exist_ok=True)
    app_copy.write_text(text)
    print(f"Wrote {len(SCENARIOS)} trees + index.json to {TREES}")
    print(f"Wrote study-app copy to {app_copy}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
