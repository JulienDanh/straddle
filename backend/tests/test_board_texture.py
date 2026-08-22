"""Tests for board_texture.py: BoardAnalyzer, BoardTexture."""

from __future__ import annotations

import pytest

from app.poker.board import Board
from app.poker.board_texture import BoardAnalyzer, BoardHighCard, BoardSuitTexture
from app.poker.cards import Rank


class TestBoardHighCard:
    def test_values(self) -> None:
        assert BoardHighCard.ACE_HIGH.value == "A-high"
        assert BoardHighCard.LOW.value == "low"


class TestBoardSuitTexture:
    def test_values(self) -> None:
        assert BoardSuitTexture.RAINBOW.value == "rainbow"
        assert BoardSuitTexture.TWO_TONE.value == "two-tone"
        assert BoardSuitTexture.MONOTONE.value == "monotone"


class TestBoardAnalyzer:
    def test_ace_high(self) -> None:
        board = Board.parse("AhKd2s")
        texture = BoardAnalyzer.analyze(board)
        assert texture.high_card == BoardHighCard.ACE_HIGH
        assert texture.is_ace_high

    def test_king_high(self) -> None:
        board = Board.parse("KhQd2s")
        texture = BoardAnalyzer.analyze(board)
        assert texture.high_card == BoardHighCard.KING_HIGH

    def test_queen_high(self) -> None:
        board = Board.parse("QhJd2s")
        texture = BoardAnalyzer.analyze(board)
        assert texture.high_card == BoardHighCard.QUEEN_HIGH

    def test_jack_high(self) -> None:
        board = Board.parse("JhTd2s")
        texture = BoardAnalyzer.analyze(board)
        assert texture.high_card == BoardHighCard.JACK_HIGH

    def test_ten_high(self) -> None:
        board = Board.parse("Th9d2s")
        texture = BoardAnalyzer.analyze(board)
        assert texture.high_card == BoardHighCard.TEN_HIGH

    def test_low(self) -> None:
        board = Board.parse("9h8d2s")
        texture = BoardAnalyzer.analyze(board)
        assert texture.high_card == BoardHighCard.LOW

    def test_rainbow(self) -> None:
        board = Board.parse("AhKd2s")
        texture = BoardAnalyzer.analyze(board)
        assert texture.suit_texture == BoardSuitTexture.RAINBOW
        assert texture.is_rainbow

    def test_two_tone(self) -> None:
        board = Board.parse("AhKdAd")
        texture = BoardAnalyzer.analyze(board)
        assert texture.suit_texture == BoardSuitTexture.TWO_TONE
        assert texture.is_two_tone

    def test_monotone(self) -> None:
        board = Board.parse("AhKh2h")
        texture = BoardAnalyzer.analyze(board)
        assert texture.suit_texture == BoardSuitTexture.MONOTONE
        assert texture.is_monotone

    def test_paired(self) -> None:
        board = Board.parse("AhAd2s")
        texture = BoardAnalyzer.analyze(board)
        assert texture.is_paired

    def test_not_paired(self) -> None:
        board = Board.parse("AhKd2s")
        texture = BoardAnalyzer.analyze(board)
        assert not texture.is_paired

    def test_trips(self) -> None:
        board = Board.parse("AhAdAs")
        texture = BoardAnalyzer.analyze(board)
        assert texture.is_trips

    def test_not_trips(self) -> None:
        board = Board.parse("AhAd2s")
        texture = BoardAnalyzer.analyze(board)
        assert not texture.is_trips

    def test_has_flush_draw(self) -> None:
        board = Board.parse("AhKd2h")
        texture = BoardAnalyzer.analyze(board)
        assert texture.has_flush_draw

    def test_no_flush_draw(self) -> None:
        board = Board.parse("AhKd2s")
        texture = BoardAnalyzer.analyze(board)
        assert not texture.has_flush_draw

    def test_rank_counts(self) -> None:
        board = Board.parse("AhAd2s")
        texture = BoardAnalyzer.analyze(board)
        assert texture.rank_counts[Rank.ACE] == 2
        assert texture.rank_counts[Rank.DEUCE] == 1

    def test_suit_counts(self) -> None:
        board = Board.parse("AhAs2s")
        texture = BoardAnalyzer.analyze(board)
        from app.poker.cards import Suit

        assert texture.suit_counts[Suit.SPADES] == 2
        assert texture.suit_counts[Suit.HEARTS] == 1

    def test_ranks(self) -> None:
        board = Board.parse("AhKd2s")
        texture = BoardAnalyzer.analyze(board)
        assert Rank.ACE in texture.ranks
        assert Rank.KING in texture.ranks
        assert Rank.DEUCE in texture.ranks

    def test_preflop_raises(self) -> None:
        board = Board.parse("")
        with pytest.raises(ValueError):
            BoardAnalyzer.analyze(board)
