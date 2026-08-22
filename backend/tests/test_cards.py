"""Tests for cards.py: Rank, Suit, Card, Deck, Hand."""

from __future__ import annotations

import random

import pytest

from app.poker.cards import Card, Deck, Hand, Rank, Suit

# --- Rank --------------------------------------------------------------------

class TestRank:
    def test_values(self) -> None:
        assert Rank.DEUCE.value == 2
        assert Rank.ACE.value == 14

    def test_label_low(self) -> None:
        assert Rank.DEUCE.label == "2"
        assert Rank.NINE.label == "9"

    def test_label_face(self) -> None:
        assert Rank.TEN.label == "T"
        assert Rank.JACK.label == "J"
        assert Rank.QUEEN.label == "Q"
        assert Rank.KING.label == "K"
        assert Rank.ACE.label == "A"

    def test_from_label(self) -> None:
        assert Rank.from_label("a") == Rank.ACE
        assert Rank.from_label("t") == Rank.TEN
        assert Rank.from_label("A") == Rank.ACE

    def test_from_label_invalid(self) -> None:
        with pytest.raises(ValueError):
            Rank.from_label("x")


# --- Suit --------------------------------------------------------------------

class TestSuit:
    def test_values(self) -> None:
        assert Suit.CLUBS.value == "c"
        assert Suit.DIAMONDS.value == "d"
        assert Suit.HEARTS.value == "h"
        assert Suit.SPADES.value == "s"

    def test_from_label(self) -> None:
        assert Suit.from_label("h") == Suit.HEARTS
        assert Suit.from_label("H") == Suit.HEARTS

    def test_from_label_invalid(self) -> None:
        with pytest.raises(ValueError):
            Suit.from_label("x")


# --- Card --------------------------------------------------------------------

class TestCard:
    def test_parse(self) -> None:
        card = Card.parse("Ah")
        assert card.rank == Rank.ACE
        assert card.suit == Suit.HEARTS

    def test_parse_ten(self) -> None:
        card = Card.parse("Td")
        assert card.rank == Rank.TEN
        assert card.suit == Suit.DIAMONDS

    def test_parse_invalid_length(self) -> None:
        with pytest.raises(ValueError):
            Card.parse("A")

    def test_str(self) -> None:
        assert str(Card(Rank.ACE, Suit.HEARTS)) == "Ah"
        assert str(Card(Rank.TEN, Suit.DIAMONDS)) == "Td"
        assert str(Card(Rank.DEUCE, Suit.CLUBS)) == "2c"

    def test_equality(self) -> None:
        c1 = Card(Rank.ACE, Suit.HEARTS)
        c2 = Card(Rank.ACE, Suit.HEARTS)
        assert c1 == c2
        assert c1 != Card(Rank.KING, Suit.HEARTS)
        assert c1 != Card(Rank.ACE, Suit.SPADES)

    def test_hash(self) -> None:
        c1 = Card(Rank.ACE, Suit.HEARTS)
        c2 = Card(Rank.ACE, Suit.HEARTS)
        assert hash(c1) == hash(c2)
        assert len({c1, c2}) == 1

    def test_ordering(self) -> None:
        ace = Card(Rank.ACE, Suit.HEARTS)
        king = Card(Rank.KING, Suit.SPADES)
        deuce = Card(Rank.DEUCE, Suit.CLUBS)
        assert ace > king
        assert king > deuce
        assert deuce < ace

    def test_ordering_same_rank_different_suit(self) -> None:
        # Same rank: ordered by suit (c < d < h < s)
        c = Card(Rank.ACE, Suit.CLUBS)
        s = Card(Rank.ACE, Suit.SPADES)
        assert c < s

    def test_immutable(self) -> None:
        card = Card(Rank.ACE, Suit.HEARTS)
        with pytest.raises(AttributeError):
            card.rank = Rank.KING  # type: ignore


# --- Deck --------------------------------------------------------------------

class TestDeck:
    def test_full_deck_size(self) -> None:
        deck = Deck.full()
        assert len(deck) == 52

    def test_deal_one(self) -> None:
        deck = Deck.full()
        card = deck.deal_one()
        assert isinstance(card, Card)
        assert len(deck) == 51

    def test_deal_n(self) -> None:
        deck = Deck.full()
        cards = deck.deal(5)
        assert len(cards) == 5
        assert len(deck) == 47

    def test_deal_empty_deck(self) -> None:
        deck = Deck()
        with pytest.raises(ValueError):
            deck.deal_one()

    def test_deal_too_many(self) -> None:
        deck = Deck.full()
        with pytest.raises(ValueError):
            deck.deal(53)

    def test_deal_negative(self) -> None:
        deck = Deck.full()
        with pytest.raises(ValueError):
            deck.deal(-1)

    def test_shuffle_deterministic(self) -> None:
        deck1 = Deck.full()
        deck2 = Deck.full()
        rng1 = random.Random(42)
        rng2 = random.Random(42)
        deck1.shuffle(rng=rng1)
        deck2.shuffle(rng=rng2)
        assert [str(c) for c in deck1] == [str(c) for c in deck2]

    def test_shuffle_changes_order(self) -> None:
        deck1 = Deck.full()
        deck2 = Deck.full()
        deck2.shuffle(rng=random.Random(0))
        assert [str(c) for c in deck1] != [str(c) for c in deck2]

    def test_iter(self) -> None:
        deck = Deck.full()
        assert len(list(deck)) == 52


# --- Hand --------------------------------------------------------------------

class TestHand:
    def test_parse_4char(self) -> None:
        hand = Hand.parse("AhKd")
        assert hand.high_rank == Rank.ACE
        assert hand.low_rank == Rank.KING

    def test_parse_4char_order_normalized(self) -> None:
        h1 = Hand.parse("KhAd")
        h2 = Hand.parse("AdKh")
        assert h1 == h2
        assert h1.high_rank == Rank.ACE
        assert h1.low_rank == Rank.KING

    def test_parse_suited_shorthand(self) -> None:
        hand = Hand.parse("AKs")
        assert hand.high_rank == Rank.ACE
        assert hand.low_rank == Rank.KING
        assert hand.is_suited

    def test_parse_offsuit_shorthand(self) -> None:
        hand = Hand.parse("AKo")
        assert hand.high_rank == Rank.ACE
        assert hand.low_rank == Rank.KING
        assert not hand.is_suited

    def test_parse_pair(self) -> None:
        hand = Hand.parse("AhAd")
        assert hand.is_pair
        assert hand.high_rank == Rank.ACE
        assert hand.low_rank == Rank.ACE

    def test_parse_invalid(self) -> None:
        with pytest.raises(ValueError):
            Hand.parse("ABC")
        with pytest.raises(ValueError):
            Hand.parse("AhK")
        with pytest.raises(ValueError):
            Hand.parse("AhKdX")

    def test_parse_pair_shorthand_invalid(self) -> None:
        with pytest.raises(ValueError):
            Hand.parse("AAs")

    def test_parse_invalid_suffix(self) -> None:
        with pytest.raises(ValueError):
            Hand.parse("AKx")

    def test_is_pair(self) -> None:
        assert Hand.parse("AhAd").is_pair
        assert not Hand.parse("AhKd").is_pair

    def test_is_suited(self) -> None:
        assert Hand.parse("AhKh").is_suited
        assert not Hand.parse("AhKd").is_suited
        assert Hand.parse("AKs").is_suited
        assert not Hand.parse("AKo").is_suited

    def test_high_low_rank(self) -> None:
        hand = Hand.parse("KhAd")
        assert hand.high_rank == Rank.ACE
        assert hand.low_rank == Rank.KING

    def test_equality(self) -> None:
        # Same cards in different order should be equal
        h1 = Hand.parse("AhKd")
        h2 = Hand.parse("KdAh")
        assert h1 == h2

    def test_inequality_different_ranks(self) -> None:
        h1 = Hand.parse("AhKd")
        h2 = Hand.parse("AhQd")
        assert h1 != h2

    def test_hash(self) -> None:
        h1 = Hand.parse("AhKd")
        h2 = Hand.parse("KdAh")
        assert hash(h1) == hash(h2)
        assert len({h1, h2}) == 1

    def test_duplicate_cards_raises(self) -> None:
        with pytest.raises(ValueError):
            Hand(Card(Rank.ACE, Suit.HEARTS), Card(Rank.ACE, Suit.HEARTS))
