"""Tests for state.py: Position, PotType, ActionRecord, HandState."""

from __future__ import annotations

import math

import pytest
from pydantic import ValidationError

from app.poker.board import Board, Street
from app.poker.cards import Hand
from app.poker.state import ActionRecord, HandState, Position, PotType

# --- Position ----------------------------------------------------------------

class TestPosition:
    def test_values(self) -> None:
        assert Position.UTG.value == "UTG"
        assert Position.BTN.value == "BTN"
        assert Position.SB.value == "SB"
        assert Position.BB.value == "BB"


# --- PotType -----------------------------------------------------------------

class TestPotType:
    def test_values(self) -> None:
        assert PotType.LIMPED.value == "limped"
        assert PotType.SINGLE_RAISED.value == "single-raised"
        assert PotType.THREE_BET.value == "3bet"


# --- ActionRecord ------------------------------------------------------------

class TestActionRecord:
    def test_creation(self) -> None:
        ar = ActionRecord(
            actor=Position.BTN, street="preflop", action_type="raise", amount=3.0
        )
        assert ar.actor == Position.BTN
        assert ar.amount == 3.0

    def test_optional_amount(self) -> None:
        ar = ActionRecord(actor=Position.BTN, street="preflop", action_type="fold")
        assert ar.amount is None


# --- HandState ---------------------------------------------------------------

class TestHandState:
    def test_creation(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert state.hand == aks_hand
        assert state.board == ace_high_flop
        assert state.position == Position.BTN
        assert state.pot == 10.0
        assert state.hero_stack == 90.0
        assert state.villain_stack == 90.0
        assert state.num_players == 2

    def test_street_property(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert state.street == Street.FLOP

    def test_street_preflop(self, aks_hand: Hand, preflop_board: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert state.street == Street.PREFLOP

    def test_spr(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert state.spr == 9.0

    def test_spr_zero_pot(self, aks_hand: Hand, preflop_board: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=preflop_board,
            position=Position.BTN,
            pot=0.0,
            hero_stack=100.0,
            villain_stack=100.0,
        )
        assert math.isinf(state.spr)

    def test_is_heads_up(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            num_players=2,
        )
        assert state.is_heads_up
        assert not state.is_multiway

    def test_is_multiway(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            num_players=3,
        )
        assert not state.is_heads_up
        assert state.is_multiway

    def test_negative_pot(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        with pytest.raises(ValidationError):
            HandState(
                hand=aks_hand,
                board=ace_high_flop,
                position=Position.BTN,
                pot=-1.0,
                hero_stack=90.0,
                villain_stack=90.0,
            )

    def test_negative_hero_stack(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        with pytest.raises(ValidationError):
            HandState(
                hand=aks_hand,
                board=ace_high_flop,
                position=Position.BTN,
                pot=10.0,
                hero_stack=-1.0,
                villain_stack=90.0,
            )

    def test_num_players_too_few(self, aks_hand: Hand, preflop_board: Board) -> None:
        with pytest.raises(ValidationError):
            HandState(
                hand=aks_hand,
                board=preflop_board,
                position=Position.BTN,
                pot=10.0,
                hero_stack=90.0,
                villain_stack=90.0,
                num_players=1,
            )

    def test_num_players_too_many(self, aks_hand: Hand, preflop_board: Board) -> None:
        with pytest.raises(ValidationError):
            HandState(
                hand=aks_hand,
                board=preflop_board,
                position=Position.BTN,
                pot=10.0,
                hero_stack=90.0,
                villain_stack=90.0,
                num_players=7,
            )

    def test_frozen(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        with pytest.raises(ValidationError):
            state.pot = 20.0  # type: ignore

    def test_pot_type_default(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert state.pot_type is None

    def test_action_history_default(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert state.action_history == []

    def test_villain_position_default_none(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
        )
        assert state.villain_position is None

    def test_villain_position_set(self, aks_hand: Hand, ace_high_flop: Board) -> None:
        state = HandState(
            hand=aks_hand,
            board=ace_high_flop,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            villain_position=Position.BB,
        )
        assert state.villain_position == Position.BB
