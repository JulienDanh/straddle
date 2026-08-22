"""Shared fixtures for poker domain tests."""

from __future__ import annotations

import pytest

from app.poker.board import Board
from app.poker.cards import Card, Hand, Rank, Suit
from app.poker.state import ActionRecord, HandState, Position, PotType

# --- Cards -------------------------------------------------------------------

@pytest.fixture
def ace_h() -> Card:
    return Card(Rank.ACE, Suit.HEARTS)


@pytest.fixture
def king_d() -> Card:
    return Card(Rank.KING, Suit.DIAMONDS)


@pytest.fixture
def queen_s() -> Card:
    return Card(Rank.QUEEN, Suit.SPADES)


@pytest.fixture
def jack_c() -> Card:
    return Card(Rank.JACK, Suit.CLUBS)


@pytest.fixture
def ten_h() -> Card:
    return Card(Rank.TEN, Suit.HEARTS)


@pytest.fixture
def nine_d() -> Card:
    return Card(Rank.NINE, Suit.DIAMONDS)


@pytest.fixture
def deuce_c() -> Card:
    return Card(Rank.DEUCE, Suit.CLUBS)


# --- Hands -------------------------------------------------------------------

@pytest.fixture
def aks_hand() -> Hand:
    """Ace-King suited (spades)."""
    return Hand.parse("AKs")


@pytest.fixture
def pocket_aces() -> Hand:
    """Pocket aces."""
    return Hand.parse("AhAd")


@pytest.fixture
def pocket_kings() -> Hand:
    """Pocket kings."""
    return Hand.parse("KhKd")


# --- Boards ------------------------------------------------------------------

@pytest.fixture
def preflop_board() -> Board:
    return Board.parse("")


@pytest.fixture
def ace_high_flop() -> Board:
    """A-K-Q rainbow flop."""
    return Board.parse("AhKdQs")


@pytest.fixture
def monotone_flop() -> Board:
    """K-8-2 all hearts (monotone)."""
    return Board.parse("Kh8h2h")


@pytest.fixture
def paired_flop() -> Board:
    """8-8-4 flop (paired, low)."""
    return Board.parse("8s8d4h")


@pytest.fixture
def low_paired_flop() -> Board:
    """7-7-2 flop (paired, low)."""
    return Board.parse("7s7d2h")


@pytest.fixture
def low_flop() -> Board:
    """9-high flop."""
    return Board.parse("9s7d4h")


# --- HandStates --------------------------------------------------------------

@pytest.fixture
def preflop_state(
    aks_hand: Hand, preflop_board: Board
) -> HandState:
    return HandState(
        hand=aks_hand,
        board=preflop_board,
        position=Position.BTN,
        pot=0.0,
        hero_stack=100.0,
        villain_stack=100.0,
        num_players=2,
        pot_type=PotType.SINGLE_RAISED,
    )


@pytest.fixture
def flop_state(
    aks_hand: Hand, ace_high_flop: Board
) -> HandState:
    """BTN with AKs on an A-high flop, single-raised pot, heads-up."""
    return HandState(
        hand=aks_hand,
        board=ace_high_flop,
        position=Position.BTN,
        pot=10.0,
        hero_stack=90.0,
        villain_stack=90.0,
        num_players=2,
        pot_type=PotType.SINGLE_RAISED,
    )


@pytest.fixture
def flop_btn_action_history() -> list[ActionRecord]:
    """A simple preflop action history: BTN raises, BB calls."""
    return [
        ActionRecord(actor=Position.BTN, street="preflop", action_type="raise", amount=3.0),
        ActionRecord(actor=Position.BB, street="preflop", action_type="call", amount=2.0),
    ]
