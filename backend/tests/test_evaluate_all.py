"""Tests for the all-systems mode of the /evaluate endpoint."""

from pathlib import Path
from textwrap import dedent

from fastapi.testclient import TestClient

from app.main import app
from app.poker.system import load_system

client = TestClient(app)


def _evaluate_all(body: dict) -> dict:
    """POST /evaluate with all_systems=True and return the JSON."""
    response = client.post("/evaluate", json={**body, "all_systems": True})
    assert response.status_code == 200
    return response.json()


def test_all_systems_returns_one_decision_per_system() -> None:
    """Every loaded system appears in the result, in load order."""
    systems = client.get("/systems").json()
    result = _evaluate_all(
        {
            "hand": "AhKd",
            "board": "AhQs2c",
            "position": "BTN",
            "pot": 10.0,
            "hero_stack": 90.0,
            "villain_stack": 90.0,
            "num_players": 2,
            "pot_type": "single-raised",
        }
    )
    decisions = result["decisions"]
    assert [d["system_name"] for d in decisions] == [s["name"] for s in systems]
    assert len(decisions) == len(systems)


def test_all_systems_reports_matching_system() -> None:
    """UTG with AKs on a safe K-high flop matches BBZ System 1 (cbet)."""
    result = _evaluate_all(
        {
            "hand": "AhKd",
            "board": "Kh8d3c",  # safe broadway, no risk factors
            "position": "UTG",
            "pot": 10.0,
            "hero_stack": 90.0,
            "villain_stack": 90.0,
            "num_players": 2,
            "pot_type": "single-raised",
            "villain_position": "BB",
        }
    )
    by_name = {d["system_name"]: d for d in result["decisions"]}
    s1 = by_name["BBZ System 1: UTG vs BB C-betting Flops"]
    assert s1["has_decision"] is True
    assert s1["matched_rule"] == "cbet 100% on safe broadway flops"
    assert s1["action"] is not None
    assert s1["action"]["type"] == "bet"
    assert s1["action"]["size"]["fraction"] == 0.33


def test_all_systems_no_match_is_reported() -> None:
    """A preflop state matches no BBZ system (all are postflop); each reports
    has_decision=False with null action/rule."""
    result = _evaluate_all(
        {
            "hand": "AhKd",
            "board": "",
            "position": "BTN",
            "pot": 10.0,
            "hero_stack": 90.0,
            "villain_stack": 90.0,
            "num_players": 2,
            "pot_type": "single-raised",
        }
    )
    for d in result["decisions"]:
        assert d["has_decision"] is False
        assert d["action"] is None
        assert d["matched_rule"] is None


def test_single_system_mode_unchanged() -> None:
    """all_systems=False returns the single EvaluateResponse shape (top-level
    action/matched_rule/has_decision, NOT a decisions wrapper). Pins
    system_name to a BBZ system so the assertion is stable regardless of
    how many systems are loaded or their file sort order.
    """
    response = client.post(
        "/evaluate",
        json={
            "hand": "AhKd",
            "board": "Kh8d3c",
            "position": "UTG",
            "pot": 10.0,
            "hero_stack": 90.0,
            "villain_stack": 90.0,
            "num_players": 2,
            "pot_type": "single-raised",
            "villain_position": "BB",
            "system_name": "BBZ System 1: UTG vs BB C-betting Flops",
            "all_systems": False,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "decisions" not in data
    assert data["has_decision"] is True
    assert data["matched_rule"] == "cbet 100% on safe broadway flops"


def test_villain_position_threads_through_and_gates_rule(tmp_path: Path) -> None:
    """The villain_position request field reaches the state and gates a rule
    keyed on it. No shipped system gates differentially on villain_position,
    so this builds a throwaway system with a villain_position-gated rule
    and confirms it matches with villain_position=BB but not without.
    """
    yaml_content = dedent("""
        name: "Villain Position Test"
        description: "gated on villain_position"
        rules:
          - name: "only vs BB"
            conditions:
              street: flop
              villain_position: BB
            action:
              type: bet
              size: 0.5
    """)
    path = tmp_path / "vp.yaml"
    path.write_text(yaml_content)
    system = load_system(path)

    from app.poker.board import Board
    from app.poker.cards import Hand
    from app.poker.state import HandState, Position, PotType

    hand = Hand.parse("AhKd")
    board = Board.parse("Kh8d3c")

    def make_state(villain_position: Position | None = None) -> HandState:
        return HandState(
            hand=hand,
            board=board,
            position=Position.UTG,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            num_players=2,
            pot_type=PotType.SINGLE_RAISED,
            villain_position=villain_position,
        )

    # With villain_position=BB, the gated rule matches.
    with_bb = system.evaluate(make_state(Position.BB))
    assert with_bb.has_decision is True
    assert with_bb.matched_rule == "only vs BB"

    # Without villain_position, the gate fails (None never matches).
    without = system.evaluate(make_state(None))
    assert without.has_decision is False
    assert without.matched_rule is None
