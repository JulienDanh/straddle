"""Tests for the all-systems mode of the /evaluate endpoint."""

from fastapi.testclient import TestClient

from app.main import app

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


def test_all_systems_hand_matches_multiple_systems() -> None:
    """AKs on A-high flop, BTN, single-raised, heads-up satisfies BOTH the
    flop-cbet system (cbet A-high BTN) and the top-pair system (bet top pair).
    """
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
    by_name = {d["system_name"]: d for d in result["decisions"]}

    cbet = by_name["Flop Cbet Strategy"]
    assert cbet["has_decision"] is True
    assert cbet["matched_rule"] == "cbet A-high flop BTN"
    assert cbet["action"] is not None
    assert cbet["action"]["type"] == "bet"
    assert cbet["action"]["size"]["fraction"] == 0.66

    top_pair = by_name["Top Pair Strategy"]
    assert top_pair["has_decision"] is True
    assert top_pair["matched_rule"] == "bet top pair"
    assert top_pair["action"] is not None
    assert top_pair["action"]["type"] == "bet"


def test_all_systems_no_match_is_reported() -> None:
    """A preflop state matches neither flop/postflop system; both report
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
    """all_systems=False (default) still returns the single EvaluateResponse
    shape (top-level action/matched_rule/has_decision, NOT a decisions wrapper).
    Pins system_name to "Top Pair Strategy" so the assertion is stable
    regardless of how many systems are loaded or their file sort order.
    """
    response = client.post(
        "/evaluate",
        json={
            "hand": "AhKd",
            "board": "AhQs2c",
            "position": "BTN",
            "pot": 10.0,
            "hero_stack": 90.0,
            "villain_stack": 90.0,
            "num_players": 2,
            "pot_type": "single-raised",
            "system_name": "Top Pair Strategy",
            "all_systems": False,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "decisions" not in data
    assert data["has_decision"] is True


def test_villain_position_threads_through_and_gates_rule() -> None:
    """The villain_position request field reaches the state and gates a rule
    keyed on it. On a turn with top pair, the Flop Cbet System has only the
    villain_position-gated 'overbet top pair vs BB on the turn' rule; it
    matches when villain_position=BB and not when the field is omitted.
    """
    base = {
        "hand": "AhKd",       # top pair on an A-high turn
        "board": "AhQs2c9d",  # turn, A-high
        "position": "BTN",
        "pot": 10.0,
        "hero_stack": 90.0,
        "villain_stack": 90.0,
        "num_players": 2,
        "pot_type": "single-raised",
    }

    # With villain_position=BB, the gated overbet rule matches.
    with_bb = _evaluate_all({**base, "villain_position": "BB"})
    cbet_bb = next(
        d for d in with_bb["decisions"] if d["system_name"] == "Flop Cbet Strategy"
    )
    assert cbet_bb["has_decision"] is True
    assert cbet_bb["matched_rule"] == "overbet top pair vs BB on the turn"
    assert cbet_bb["action"]["size"]["fraction"] == 1.25

    # With villain_position omitted, the gated rule can never match.
    without = _evaluate_all(base)
    cbet_none = next(
        d for d in without["decisions"] if d["system_name"] == "Flop Cbet Strategy"
    )
    assert cbet_none["has_decision"] is False
    assert cbet_none["matched_rule"] is None

