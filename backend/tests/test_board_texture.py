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


class TestNewTextureProperties:
    """Tests for the broadway / low / rank-contains / connectivity additions."""

    def test_broadway(self) -> None:
        for cards in ("AhKd2s", "KdQs2c", "QsJc2d", "JcTd2s", "Td9d2c"):
            assert BoardAnalyzer.analyze(Board.parse(cards)).is_broadway

    def test_not_broadway(self) -> None:
        for cards in ("9d8c2s", "7d5c2s", "5d4c2s"):
            assert not BoardAnalyzer.analyze(Board.parse(cards)).is_broadway

    def test_is_low(self) -> None:
        assert BoardAnalyzer.analyze(Board.parse("9d8c2s")).is_low
        assert not BoardAnalyzer.analyze(Board.parse("Td9d2c")).is_low

    def test_contains_rank(self) -> None:
        texture = BoardAnalyzer.analyze(Board.parse("AhKd2s"))
        assert texture.contains_rank(Rank.ACE)
        assert texture.contains_rank(Rank.KING)
        assert texture.contains_rank(Rank.DEUCE)
        assert not texture.contains_rank(Rank.QUEEN)

    @pytest.mark.parametrize(
        "cards,expected",
        [
            ("7d8c9s", True),    # three consecutive
            ("8d9cTs", True),    # three consecutive, T-high
            ("6d5c3s", True),    # 3-4-5-6 window covered by 3,5,6
            ("Ah2d3s", True),    # wheel A-2-3
            ("AdKcQs", True),    # Q-K-A high straight
            ("Kd8c3s", False),   # scattered, no 3-in-a-window
            ("AhKd2s", False),   # A, K, 2 — only 2 in any window
        ],
    )
    def test_straights_possible(self, cards: str, expected: bool) -> None:
        assert BoardAnalyzer.analyze(Board.parse(cards)).straights_possible is expected

    @pytest.mark.parametrize(
        "cards,expected",
        [
            ("Kd8c2s", True),     # no touching ranks
            ("AhTd2s", True),     # A, T, 2 — A(14) and T(10) not adjacent, T and 2 not adjacent
            ("8d5c2s", True),     # scattered
            ("7d8c2s", False),    # 7-8 touching
            ("9d8c2s", False),    # 8-9 touching
            ("TdJc2s", False),    # T-J touching
        ],
    )
    def test_is_disconnected(self, cards: str, expected: bool) -> None:
        assert BoardAnalyzer.analyze(Board.parse(cards)).is_disconnected is expected
