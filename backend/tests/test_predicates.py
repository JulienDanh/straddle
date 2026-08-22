"""Tests for predicates.py: PredicateRegistry, built-in predicates, evaluate_conditions."""

from __future__ import annotations

import pytest

from app.poker.board import Board
from app.poker.cards import Hand
from app.poker.predicates import (
    PredicateRegistry,
    default_registry,
    evaluate_conditions,
)
from app.poker.state import HandState, Position, PotType

# --- Registry mechanics ------------------------------------------------------

class TestPredicateRegistry:
    def test_register_and_get(self) -> None:
        registry = PredicateRegistry()
        registry.register("test", lambda s, v: True)
        fn = registry.get("test")
        assert fn is not None

    def test_duplicate_registration(self) -> None:
        registry = PredicateRegistry()
        registry.register("test", lambda s, v: True)
        with pytest.raises(ValueError):
            registry.register("test", lambda s, v: False)

    def test_unknown_key(self) -> None:
        registry = PredicateRegistry()
        with pytest.raises(KeyError):
            registry.get("nonexistent")

    def test_keys(self) -> None:
        registry = PredicateRegistry()
        registry.register("a", lambda s, v: True)
        registry.register("b", lambda s, v: True)
        assert registry.keys() == ["a", "b"]

    def test_contains(self) -> None:
        registry = PredicateRegistry()
        registry.register("test", lambda s, v: True)
        assert "test" in registry
        assert "other" not in registry

    def test_default_registry_has_builtins(self) -> None:
        reg = default_registry()
        assert "street" in reg
        assert "position" in reg
        assert "pot" in reg
        assert "board" in reg
        assert "hand" in reg
        assert "players" in reg
        assert "spr" in reg


# --- street predicate --------------------------------------------------------

class TestStreetPredicate:
    def test_match(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"street": "flop"}, state)

    def test_no_match(self, aks_hand: Hand, preflop_board: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert not evaluate_conditions({"street": "flop"}, state)

    def test_preflop(self, aks_hand: Hand, preflop_board: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=0.0,
            hero_stack=100.0,
            villain_stack=100.0,
        )
        assert evaluate_conditions({"street": "preflop"}, state)


# --- position predicate ------------------------------------------------------

class TestPositionPredicate:
    def test_match(self, aks_hand: Hand, preflop_board: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=0.0,
            hero_stack=100.0,
            villain_stack=100.0,
        )
        assert evaluate_conditions({"position": "BTN"}, state)

    def test_no_match(self, aks_hand: Hand, preflop_board: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=0.0,
            hero_stack=100.0,
            villain_stack=100.0,
        )
        assert not evaluate_conditions({"position": "UTG"}, state)


# --- pot predicate -----------------------------------------------------------

class TestPotPredicate:
    def test_match(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            pot_type=PotType.SINGLE_RAISED,
        )
        assert evaluate_conditions({"pot": "single-raised"}, state)

    def test_underscore_variant(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            pot_type=PotType.SINGLE_RAISED,
        )
        assert evaluate_conditions({"pot": "single_raised"}, state)

    def test_3bet(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=30.0,
            hero_stack=70.0,
            villain_stack=70.0,
            pot_type=PotType.THREE_BET,
        )
        assert evaluate_conditions({"pot": "3bet"}, state)

    def test_no_match(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            pot_type=PotType.SINGLE_RAISED,
        )
        assert not evaluate_conditions({"pot": "3bet"}, state)

    def test_none_pot_type(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            pot_type=None,
        )
        assert not evaluate_conditions({"pot": "single-raised"}, state)


# --- board predicate ---------------------------------------------------------

class TestBoardPredicate:
    def test_ace_high(
        self, aks_hand: Hand, ace_high_flop: Board
    ) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"board": "A-high"}, state)

    def test_monotone(self, aks_hand: Hand, monotone_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=monotone_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"board": "monotone"}, state)

    def test_paired(self, aks_hand: Hand, paired_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=paired_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"board": "paired"}, state)

    def test_list_all_match(self, aks_hand: Hand, monotone_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=monotone_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"board": ["K-high", "monotone"]}, state)

    def test_list_one_not_match(self, aks_hand: Hand, monotone_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=monotone_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert not evaluate_conditions({"board": ["A-high", "monotone"]}, state)

    def test_low(self, aks_hand: Hand, low_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=low_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"board": "low"}, state)

    def test_low_paired(self, aks_hand: Hand, low_paired_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=low_paired_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"board": ["low", "paired"]}, state)


# --- hand predicate ---------------------------------------------------------

class TestHandPredicate:
    def test_overpair(self) -> None:
        hand = Hand.parse("AhAd")
        board = Board.parse("Kh8d2s")
        state = HandState(
            hand=hand,
            board=board,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"hand": "overpair"}, state)

    def test_top_pair(self) -> None:
        hand = Hand.parse("AhKd")
        board = Board.parse("Kh8d2s")
        state = HandState(
            hand=hand,
            board=board,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"hand": "top-pair"}, state)

    def test_flush_draw(self) -> None:
        hand = Hand.parse("AhKh")
        board = Board.parse("Qh8d9h")
        state = HandState(
            hand=hand,
            board=board,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"hand": "flush-draw"}, state)

    def test_set(self) -> None:
        hand = Hand.parse("AhAd")
        board = Board.parse("AsKd2s")
        state = HandState(
            hand=hand,
            board=board,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"hand": "set"}, state)

    def test_list(self) -> None:
        # AhKh + Qh8d9h = 4 hearts, no pair → high-card + flush-draw
        hand = Hand.parse("AhKh")
        board = Board.parse("Qh8d9h")
        state = HandState(
            hand=hand,
            board=board,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"hand": ["high-card", "flush-draw"]}, state)

    def test_list_no_match(self) -> None:
        hand = Hand.parse("AhKd")
        board = Board.parse("Qs8c2s")
        state = HandState(
            hand=hand,
            board=board,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert not evaluate_conditions({"hand": ["set", "flush-draw"]}, state)

    def test_preflop_high_card(self, aks_hand: Hand, preflop_board: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=0.0,
            hero_stack=100.0,
            villain_stack=100.0,
        )
        assert evaluate_conditions({"hand": "high-card"}, state)

    def test_preflop_pair(self) -> None:
        hand = Hand.parse("AhAd")
        board = Board.parse("")
        state = HandState(
            hand=hand,
            board=board,
            position=Position.BTN,
            pot=0.0,
            hero_stack=100.0,
            villain_stack=100.0,
        )
        assert evaluate_conditions({"hand": "pair"}, state)


# --- players predicate -------------------------------------------------------

class TestPlayersPredicate:
    def test_heads_up(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            num_players=2,
        )
        assert evaluate_conditions({"players": "heads-up"}, state)

    def test_multiway(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            num_players=3,
        )
        assert evaluate_conditions({"players": "multiway"}, state)

    def test_int(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            num_players=3,
        )
        assert evaluate_conditions({"players": 3}, state)

    def test_int_no_match(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            num_players=2,
        )
        assert not evaluate_conditions({"players": 3}, state)


# --- spr predicate -----------------------------------------------------------

class TestSprPredicate:
    def test_less_than(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=50.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"spr": "<2"}, state)

    def test_greater_than(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"spr": ">3"}, state)

    def test_less_equal(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=45.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"spr": "<=2"}, state)

    def test_no_match(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert not evaluate_conditions({"spr": "<2"}, state)

    def test_invalid_format(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        with pytest.raises(ValueError):
            evaluate_conditions({"spr": "high"}, state)


# --- evaluate_conditions AND logic ------------------------------------------

class TestEvaluateConditions:
    def test_empty_conditions(self, aks_hand: Hand, preflop_board: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=0.0,
            hero_stack=100.0,
            villain_stack=100.0,
        )
        assert evaluate_conditions({}, state)

    def test_all_match(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            pot_type=PotType.SINGLE_RAISED,
        )
        conditions = {
            "street": "flop",
            "position": "BTN",
            "pot": "single-raised",
        }
        assert evaluate_conditions(conditions, state)

    def test_one_fails(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            pot_type=PotType.SINGLE_RAISED,
        )
        conditions = {
            "street": "flop",
            "position": "UTG",
            "pot": "single-raised",
        }
        assert not evaluate_conditions(conditions, state)
