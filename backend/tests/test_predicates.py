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
        assert "villain_position" in reg
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


# --- villain_position predicate ----------------------------------------------

class TestVillainPositionPredicate:
    def test_match(self, aks_hand: Hand, preflop_board: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=0.0,
            hero_stack=100.0,
            villain_stack=100.0,
            villain_position=Position.BB,
        )
        assert evaluate_conditions({"villain_position": "BB"}, state)

    def test_no_match(self, aks_hand: Hand, preflop_board: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=0.0,
            hero_stack=100.0,
            villain_stack=100.0,
            villain_position=Position.BB,
        )
        assert not evaluate_conditions({"villain_position": "CO"}, state)

    def test_none_villain_position_never_matches(
        self, aks_hand: Hand, preflop_board: Board
    ) -> None:
        # An unspecified villain position must not satisfy a condition.
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=0.0,
            hero_stack=100.0,
            villain_stack=100.0,
        )
        assert not evaluate_conditions({"villain_position": "BB"}, state)


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


# --- New predicate keys: board thresholds, rank-contains, connectivity ---

class TestBoardHighThresholds:
    def _state(self, board: str) -> HandState:
        return HandState(
            hand=Hand.parse("AhKd"),
            board=Board.parse(board),
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )

    def test_broadway_matches(self) -> None:
        assert evaluate_conditions({"board": "broadway"}, self._state("AhQs2c"))
        assert evaluate_conditions({"board": "broadway"}, self._state("Td9d2c"))

    def test_broadway_no_match(self) -> None:
        assert not evaluate_conditions({"board": "broadway"}, self._state("9d8c2s"))

    def test_comparison_ge_t(self) -> None:
        assert evaluate_conditions({"board": ">=T"}, self._state("AhQs2c"))
        assert evaluate_conditions({"board": ">=T"}, self._state("Td9d2c"))
        assert not evaluate_conditions({"board": ">=T"}, self._state("9d8c2s"))

    def test_comparison_le_k(self) -> None:
        assert evaluate_conditions({"board": "<=K"}, self._state("KdQs2c"))
        assert not evaluate_conditions({"board": "<=K"}, self._state("AhQs2c"))


class TestBoardRankPredicate:
    def _state(self, board: str) -> HandState:
        return HandState(
            hand=Hand.parse("AhKd"),
            board=Board.parse(board),
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )

    def test_contains_rank(self) -> None:
        assert evaluate_conditions({"board_rank": "2"}, self._state("AhKd2s"))
        assert evaluate_conditions({"board_rank": 2}, self._state("AhKd2s"))
        assert evaluate_conditions({"board_rank": "A"}, self._state("AhKd2s"))
        assert not evaluate_conditions({"board_rank": "Q"}, self._state("AhKd2s"))

    def test_preflop_no_rank(self) -> None:
        state = HandState(
            hand=Hand.parse("AhKd"),
            board=Board.parse(""),
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert not evaluate_conditions({"board_rank": "A"}, state)


class TestConnectivityPredicates:
    def _state(self, board: str) -> HandState:
        return HandState(
            hand=Hand.parse("AhKd"),
            board=Board.parse(board),
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )

    def test_straights_possible(self) -> None:
        assert evaluate_conditions({"board": "straights-possible"}, self._state("7d8c9s"))
        assert evaluate_conditions({"board": "connected"}, self._state("Ah2d3s"))
        assert not evaluate_conditions({"board": "straights-possible"}, self._state("Kd8c3s"))

    def test_disconnected(self) -> None:
        assert evaluate_conditions({"board": "disconnected"}, self._state("Kd8c2s"))
        assert not evaluate_conditions({"board": "disconnected"}, self._state("7d8c2s"))


class TestNewHandPredicates:
    def _state(self, hand: str, board: str) -> HandState:
        return HandState(
            hand=Hand.parse(hand),
            board=Board.parse(board),
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )

    def test_three_straight(self) -> None:
        assert evaluate_conditions({"hand": "three-straight"}, self._state("9d8c", "Kh7s7d"))
        assert not evaluate_conditions({"hand": "three-straight"}, self._state("7d2c", "Kh8s4d"))

    def test_ace_high(self) -> None:
        assert evaluate_conditions({"hand": "a-high"}, self._state("AhKd", "7s5c2d"))
        assert evaluate_conditions({"hand": "k-high"}, self._state("KhQd", "7s5c2d"))
        assert not evaluate_conditions({"hand": "a-high"}, self._state("KhQd", "7s5c2d"))

    def test_backdoor_flush_draw(self) -> None:
        # As2s on a Q-8-3-rainbow-ish flop: 2 hole spades + 1 board spade = 3
        # spades on the flop → backdoor flush draw (count == 3, flop only).
        state = HandState(
            hand=Hand.parse("As2s"),
            board=Board.parse("Qs8d3c"),
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert evaluate_conditions({"hand": "backdoor-flush-draw"}, state)


class TestRegistryHasNewKeys:
    def test_default_registry_has_new_keys(self) -> None:
        reg = default_registry()
        assert "board_rank" in reg
        # The board/hand string values (broadway, straights-possible,
        # disconnected, backdoor-flush-draw, three-straight, a-high) are
        # matched through the existing board/hand predicates, not new keys.
