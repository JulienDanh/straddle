"""Tests for board.py: Street, Board."""

from __future__ import annotations

import pytest

from app.poker.board import Board, Street
from app.poker.cards import Card, Rank, Suit

# --- Street ------------------------------------------------------------------

class TestStreet:
    def test_values(self) -> None:
        assert Street.PREFLOP.value == "preflop"
        assert Street.FLOP.value == "flop"
        assert Street.TURN.value == "turn"
        assert Street.RIVER.value == "river"

    @pytest.mark.parametrize(
        ("street", "count"),
        [
            (Street.PREFLOP, 0),
            (Street.FLOP, 3),
            (Street.TURN, 4),
            (Street.RIVER, 5),
        ],
    )
    def test_card_count(self, street: Street, count: int) -> None:
        assert street.card_count == count


# --- Board -------------------------------------------------------------------

class TestBoard:
    def test_preflop(self) -> None:
        board = Board()
        assert len(board) == 0
        assert board.is_preflop
        assert board.street == Street.PREFLOP

    def test_flop(self) -> None:
        board = Board.parse("AhKdQs")
        assert len(board) == 3
        assert board.is_flop
        assert board.street == Street.FLOP

    def test_turn(self) -> None:
        board = Board.parse("AhKdQsJc")
        assert len(board) == 4
        assert board.is_turn
        assert board.street == Street.TURN

    def test_river(self) -> None:
        board = Board.parse("AhKdQsJc2d")
        assert len(board) == 5
        assert board.is_river
        assert board.street == Street.RIVER

    def test_parse_empty(self) -> None:
        board = Board.parse("")
        assert len(board) == 0
        assert board.is_preflop

    def test_invalid_count(self) -> None:
        with pytest.raises(ValueError):
            Board((Card(Rank.ACE, Suit.HEARTS),))
        with pytest.raises(ValueError):
            Board(tuple(Card(Rank(r), Suit.HEARTS) for r in [Rank.ACE, Rank.KING]))

    def test_duplicate_cards(self) -> None:
        card = Card(Rank.ACE, Suit.HEARTS)
        with pytest.raises(ValueError):
            Board((card, card, Card(Rank.KING, Suit.SPADES)))

    def test_parse_invalid_length(self) -> None:
        with pytest.raises(ValueError):
            Board.parse("AhK")

    def test_is_preflop_false(self) -> None:
        assert not Board.parse("AhKdQs").is_preflop

    def test_is_flop_false(self) -> None:
        assert not Board.parse("AhKdQsJc").is_flop
        assert not Board.parse("").is_flop

    def test_equality(self) -> None:
        b1 = Board.parse("AhKdQs")
        b2 = Board.parse("AhKdQs")
        b3 = Board.parse("AhKdJd")
        assert b1 == b2
        assert b1 != b3

    def test_hash(self) -> None:
        b1 = Board.parse("AhKdQs")
        b2 = Board.parse("AhKdQs")
        assert hash(b1) == hash(b2)
        assert len({b1, b2}) == 1

    def test_iter(self) -> None:
        board = Board.parse("AhKdQs")
        cards = list(board)
        assert len(cards) == 3
        assert cards[0] == Card(Rank.ACE, Suit.HEARTS)

    def test_str(self) -> None:
        board = Board.parse("AhKdQs")
        assert str(board) == "AhKdQs"
        assert str(Board()) == ""
