"""End-to-end integration tests: load example YAML, evaluate states."""

from __future__ import annotations

from pathlib import Path

import pytest

from app.poker.actions import ActionType
from app.poker.board import Board
from app.poker.cards import Hand
from app.poker.state import HandState, Position, PotType
from app.poker.system import load_system

SYSTEMS_DIR = Path(__file__).resolve().parent.parent / "systems"


@pytest.fixture
def flop_cbet_system() -> object:
    """Load the example flop_cbet.yaml system."""
    return load_system(SYSTEMS_DIR / "flop_cbet.yaml")


class TestFlopCbetSystem:
    def test_loads(self, flop_cbet_system) -> None:
        assert flop_cbet_system.name == "Flop Cbet Strategy"
        assert len(flop_cbet_system.rules) == 4

    def test_cbet_ace_high_btn(
        self, flop_cbet_system, aks_hand: Hand, ace_high_flop: Board
    ) -> None:
        """AKs on A-high flop, BTN, single-raised, heads-up → bet 0.66."""
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            num_players=2,
            pot_type=PotType.SINGLE_RAISED,
        )
        decision = flop_cbet_system.evaluate(state)
        assert decision.has_decision
        assert decision.matched_rule == "cbet A-high flop BTN"
        assert decision.action is not None
        assert decision.action.type == ActionType.BET
        assert decision.action.size is not None
        assert decision.action.size.fraction == 0.66

    def test_cbet_monotone_king_high(
        self, flop_cbet_system, monotone_flop: Board
    ) -> None:
        """K-high monotone flop, BTN, single-raised → bet 0.75."""
        hand = Hand.parse("AhQh")
        state = HandState(
            hand=hand,
            board=monotone_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            num_players=2,
            pot_type=PotType.SINGLE_RAISED,
        )
        decision = flop_cbet_system.evaluate(state)
        assert decision.has_decision
        assert decision.matched_rule == "cbet monotone K-high flop"
        assert decision.action is not None
        assert decision.action.type == ActionType.BET
        assert decision.action.size is not None
        assert decision.action.size.fraction == 0.75

    def test_check_back_paired_low(
        self, flop_cbet_system, low_paired_flop: Board
    ) -> None:
        """High-card hand on paired low flop, BTN, single-raised → check."""
        hand = Hand.parse("AhKd")
        state = HandState(
            hand=hand,
            board=low_paired_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            num_players=2,
            pot_type=PotType.SINGLE_RAISED,
        )
        decision = flop_cbet_system.evaluate(state)
        assert decision.has_decision
        assert decision.matched_rule == "check back paired low board"
        assert decision.action is not None
        assert decision.action.type == ActionType.CHECK

    def test_shove_set_low_spr(self, flop_cbet_system) -> None:
        """Set on the turn with SPR < 2 → raise all-in."""
        hand = Hand.parse("AhAd")
        board = Board.parse("AsKh2c9d")  # turn, hero has a set of aces
        state = HandState(
            hand=hand,
            board=board,
            position=Position.BTN,
            pot=100.0,
            hero_stack=150.0,  # SPR = 1.5
            villain_stack=150.0,
            num_players=2,
            pot_type=PotType.SINGLE_RAISED,
        )
        decision = flop_cbet_system.evaluate(state)
        assert decision.has_decision
        assert decision.matched_rule == "shove set with low SPR"
        assert decision.action is not None
        assert decision.action.type == ActionType.RAISE
        assert decision.action.size is not None
        assert decision.action.size.is_all_in is True

    def test_no_match(
        self, flop_cbet_system, aks_hand: Hand, preflop_board: Board
    ) -> None:
        """Preflop state matches no flop rules → no decision."""
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=0.0,
            hero_stack=100.0,
            villain_stack=100.0,
            num_players=2,
            pot_type=PotType.SINGLE_RAISED,
        )
        decision = flop_cbet_system.evaluate(state)
        assert not decision.has_decision
        assert decision.action is None
        assert decision.matched_rule is None
