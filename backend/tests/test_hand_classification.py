"""Tests for hand_classification.py: HandClassifier, HandClassification."""

from __future__ import annotations

from app.poker.board import Board
from app.poker.cards import Hand, Rank
from app.poker.hand_classification import (
    DrawCategory,
    HandClassifier,
    MadeHandCategory,
)


class TestPreflop:
    def test_pocket_pair(self) -> None:
        hand = Hand.parse("AhAd")
        board = Board.parse("")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.PAIR
        assert c.draws == []

    def test_high_card(self) -> None:
        hand = Hand.parse("AhKd")
        board = Board.parse("")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.HIGH_CARD
        assert c.draws == []


class TestMadeHands:
    def test_overpair(self) -> None:
        hand = Hand.parse("AhAd")
        board = Board.parse("Kh8d2s")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.OVERPAIR
        assert c.is_overpair

    def test_top_pair(self) -> None:
        hand = Hand.parse("AhKd")
        board = Board.parse("Kh8d2s")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.PAIR
        assert c.is_top_pair
        assert c.pair_rank is not None
        from app.poker.cards import Rank

        assert c.pair_rank == Rank.KING

    def test_set(self) -> None:
        hand = Hand.parse("AhAd")
        board = Board.parse("AsKd2s")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.SET

    def test_trips(self) -> None:
        hand = Hand.parse("AhKd")
        board = Board.parse("AsAd2s")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.TRIPS

    def test_two_pair(self) -> None:
        hand = Hand.parse("AhKd")
        board = Board.parse("AsKh2s")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.TWO_PAIR

    def test_quads(self) -> None:
        hand = Hand.parse("AhAd")
        board = Board.parse("AsAc2s")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.QUADS

    def test_full_house(self) -> None:
        hand = Hand.parse("AhAd")
        board = Board.parse("AsKsKc")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.FULL_HOUSE

    def test_flush(self) -> None:
        # AhKh + Qh8h2h = 5 hearts (flush)
        hand = Hand.parse("AhKh")
        board = Board.parse("Qh8h2h")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.FLUSH

    def test_straight(self) -> None:
        hand = Hand.parse("5h4d")
        board = Board.parse("3s2cAh")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.STRAIGHT

    def test_wheel_straight(self) -> None:
        hand = Hand.parse("Ah2d")
        board = Board.parse("3s4c5h")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.STRAIGHT

    def test_high_card(self) -> None:
        hand = Hand.parse("AhKd")
        board = Board.parse("Qs8c2s")
        c = HandClassifier.classify(hand, board)
        assert c.made_hand == MadeHandCategory.HIGH_CARD


class TestDraws:
    def test_flush_draw(self) -> None:
        # AhKh + Qh8d9h = 4 hearts (flush draw)
        hand = Hand.parse("AhKh")
        board = Board.parse("Qh8d9h")
        c = HandClassifier.classify(hand, board)
        assert c.has_flush_draw
        assert DrawCategory.FLUSH_DRAW in c.draws

    def test_gutshot(self) -> None:
        # 6-7-9-T needs an 8 for straight (gutshot)
        hand = Hand.parse("6h7d")
        board = Board.parse("9sTc2s")
        c = HandClassifier.classify(hand, board)
        assert c.has_gutshot
        assert DrawCategory.GUTSHOT in c.draws

    def test_oesd(self) -> None:
        # 6-7-8-9 open ended
        hand = Hand.parse("6h7d")
        board = Board.parse("8s9c2h")
        c = HandClassifier.classify(hand, board)
        assert c.has_oesd
        assert DrawCategory.OPEN_ENDED_STRAIGHT_DRAW in c.draws

    def test_no_draw(self) -> None:
        hand = Hand.parse("AhKd")
        board = Board.parse("Qs8c2s")
        c = HandClassifier.classify(hand, board)
        assert DrawCategory.NO_DRAW in c.draws

    def test_backdoor_flush_draw(self) -> None:
        # 3 of the same suit on the flop with a hole card
        hand = Hand.parse("AhKd")
        board = Board.parse("8h2hJs")
        c = HandClassifier.classify(hand, board)
        assert DrawCategory.BACKDOOR_FLUSH_DRAW in c.draws


class TestHandClassificationProperties:
    def test_has_flush_draw(self) -> None:
        # AhKh + Qh8d9h = 4 hearts (flush draw)
        hand = Hand.parse("AhKh")
        board = Board.parse("Qh8d9h")
        c = HandClassifier.classify(hand, board)
        assert c.has_flush_draw is True

    def test_has_gutshot_false(self) -> None:
        hand = Hand.parse("AhKd")
        board = Board.parse("Qs8c2s")
        c = HandClassifier.classify(hand, board)
        assert c.has_gutshot is False


class TestHighCardRank:
    """The high_card_rank property reports hero's high card for high-card hands."""

    def test_preflop_high_card_rank(self) -> None:
        hand = Hand.parse("AhKd")
        c = HandClassifier.classify(hand, Board.parse(""))
        assert c.made_hand.value == "high-card"
        assert c.high_card_rank == Rank.ACE

    def test_postflop_high_card_rank(self) -> None:
        hand = Hand.parse("KhQd")
        c = HandClassifier.classify(hand, Board.parse("7s5c2d"))
        assert c.made_hand.value == "high-card"
        assert c.high_card_rank == Rank.KING

    def test_pair_has_no_high_card_rank(self) -> None:
        hand = Hand.parse("AhKd")
        c = HandClassifier.classify(hand, Board.parse("Ac7d2s"))
        assert c.made_hand.value != "high-card"
        assert c.high_card_rank is None


class TestThreeStraight:
    """The has_three_straight property detects a 3-to-a-straight connector."""

    def test_three_straight_present(self) -> None:
        # 9-8 on a K-7-7 board: 7-8-9 three-straight.
        hand = Hand.parse("9d8c")
        board = Board.parse("Kh7s7d")
        c = HandClassifier.classify(hand, board)
        assert c.has_three_straight

    def test_wheel_three_straight(self) -> None:
        # A-2 on a 3-high board: A-2-3 (ace plays low).
        hand = Hand.parse("Ah2d")
        board = Board.parse("3s7c8d")
        c = HandClassifier.classify(hand, board)
        assert c.has_three_straight

    def test_high_three_straight(self) -> None:
        # Q-K on an A board: Q-K-A.
        hand = Hand.parse("QdKc")
        board = Board.parse("Ah7s2d")
        c = HandClassifier.classify(hand, board)
        assert c.has_three_straight

    def test_no_three_straight(self) -> None:
        # 7-2 on a K-8-4 board: no three consecutive with a board card.
        hand = Hand.parse("7d2c")
        board = Board.parse("Kh8s4d")
        c = HandClassifier.classify(hand, board)
        assert not c.has_three_straight

    def test_pair_not_three_straight(self) -> None:
        # Pocket pair can't form a three-straight.
        hand = Hand.parse("AhAd")
        board = Board.parse("KhQs2d")
        c = HandClassifier.classify(hand, board)
        assert not c.has_three_straight
