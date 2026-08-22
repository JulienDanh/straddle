"""Card, Rank, Suit, Deck, and Hand value objects for Texas Hold'em."""

from __future__ import annotations

import random
from collections.abc import Iterator
from enum import Enum
from functools import total_ordering


class Rank(Enum):
    """Card ranks 2 through Ace."""

    DEUCE = 2
    THREE = 3
    FOUR = 4
    FIVE = 5
    SIX = 6
    SEVEN = 7
    EIGHT = 8
    NINE = 9
    TEN = 10
    JACK = 11
    QUEEN = 12
    KING = 13
    ACE = 14

    def __lt__(self, other: object) -> bool:
        if not isinstance(other, Rank):
            return NotImplemented
        return self.value < other.value

    def __le__(self, other: object) -> bool:
        if not isinstance(other, Rank):
            return NotImplemented
        return self.value <= other.value

    def __gt__(self, other: object) -> bool:
        if not isinstance(other, Rank):
            return NotImplemented
        return self.value > other.value

    def __ge__(self, other: object) -> bool:
        if not isinstance(other, Rank):
            return NotImplemented
        return self.value >= other.value

    @property
    def label(self) -> str:
        """Single-character label: '2'..'9', 'T', 'J', 'Q', 'K', 'A'."""
        if self.value <= 9:
            return str(self.value)
        return {10: "T", 11: "J", 12: "Q", 13: "K", 14: "A"}[self.value]

    @classmethod
    def from_label(cls, label: str) -> Rank:
        """Parse a single-character rank label into a Rank."""
        label_lower = label.lower()
        single = {
            "2": cls.DEUCE,
            "3": cls.THREE,
            "4": cls.FOUR,
            "5": cls.FIVE,
            "6": cls.SIX,
            "7": cls.SEVEN,
            "8": cls.EIGHT,
            "9": cls.NINE,
            "t": cls.TEN,
            "j": cls.JACK,
            "q": cls.QUEEN,
            "k": cls.KING,
            "a": cls.ACE,
        }
        if label_lower not in single:
            raise ValueError(f"Invalid rank label: {label!r}")
        return single[label_lower]


class Suit(Enum):
    """Card suits with single-character string values."""

    CLUBS = "c"
    DIAMONDS = "d"
    HEARTS = "h"
    SPADES = "s"

    @classmethod
    def from_label(cls, label: str) -> Suit:
        """Parse a single-character suit label into a Suit."""
        label_lower = label.lower()
        for suit in cls:
            if suit.value == label_lower:
                return suit
        raise ValueError(f"Invalid suit label: {label!r}")


@total_ordering
class Card:
    """A single playing card, immutable and hashable."""

    __slots__ = ("_rank", "_suit")

    _rank: Rank
    _suit: Suit

    def __init__(self, rank: Rank, suit: Suit) -> None:
        object.__setattr__(self, "_rank", rank)
        object.__setattr__(self, "_suit", suit)

    @property
    def rank(self) -> Rank:
        return self._rank

    @property
    def suit(self) -> Suit:
        return self._suit

    @classmethod
    def parse(cls, text: str) -> Card:
        """Parse a 2-character card string like 'Ah' or 'Td'."""
        if len(text) != 2:
            raise ValueError(f"Card string must be 2 characters: {text!r}")
        rank = Rank.from_label(text[0])
        suit = Suit.from_label(text[1])
        return cls(rank, suit)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Card):
            return NotImplemented
        return self._rank == other._rank and self._suit == other._suit

    def __lt__(self, other: object) -> bool:
        if not isinstance(other, Card):
            return NotImplemented
        return (self._rank.value, self._suit.value) < (other._rank.value, other._suit.value)

    def __hash__(self) -> int:
        return hash((self._rank, self._suit))

    def __repr__(self) -> str:
        return f"Card({self._rank.name}, {self._suit.name})"

    def __str__(self) -> str:
        return f"{self._rank.label}{self._suit.value}"


class Deck:
    """A mutable 52-card deck. Supports shuffle and deal operations."""

    def __init__(self, cards: list[Card] | None = None) -> None:
        self._cards: list[Card] = list(cards) if cards is not None else []

    @classmethod
    def full(cls) -> Deck:
        """Create a full 52-card deck in standard order."""
        cards = [Card(rank, suit) for rank in Rank for suit in Suit]
        return cls(cards)

    def shuffle(self, rng: random.Random | None = None) -> None:
        """Shuffle the deck in place. Accepts an optional RNG for deterministic tests."""
        r = rng if rng is not None else random
        r.shuffle(self._cards)

    def deal(self, n: int) -> list[Card]:
        """Deal n cards from the top of the deck."""
        if n < 0:
            raise ValueError("Cannot deal a negative number of cards")
        if n > len(self._cards):
            raise ValueError(f"Not enough cards: requested {n}, have {len(self._cards)}")
        dealt = [self._cards.pop() for _ in range(n)]
        return dealt

    def deal_one(self) -> Card:
        """Deal a single card from the top of the deck."""
        if not self._cards:
            raise ValueError("Cannot deal from an empty deck")
        return self._cards.pop()

    def __len__(self) -> int:
        return len(self._cards)

    def __iter__(self) -> Iterator[Card]:
        return iter(self._cards)


class Hand:
    """The two hole cards. Immutable and hashable.

    Cards are stored sorted by rank descending, so Hand.parse("KhAd")
    equals Hand.parse("AdKh").
    """

    __slots__ = ("_cards",)

    _cards: tuple[Card, Card]

    def __init__(self, card1: Card, card2: Card) -> None:
        if card1 == card2:
            raise ValueError("Hand cannot contain duplicate cards")
        self._cards: tuple[Card, Card] = (
            (card1, card2) if card1.rank.value >= card2.rank.value else (card2, card1)
        )

    @property
    def cards(self) -> tuple[Card, Card]:
        return self._cards

    @property
    def high_card(self) -> Card:
        return self._cards[0]

    @property
    def low_card(self) -> Card:
        return self._cards[1]

    @property
    def high_rank(self) -> Rank:
        return self._cards[0].rank

    @property
    def low_rank(self) -> Rank:
        return self._cards[1].rank

    @property
    def is_pair(self) -> bool:
        return self._cards[0].rank == self._cards[1].rank

    @property
    def is_suited(self) -> bool:
        return self._cards[0].suit == self._cards[1].suit

    @classmethod
    def parse(cls, text: str) -> Hand:
        """Parse a hand string.

        4-char: exact suits, e.g. 'AhKd'.
        3-char: suited/offsuit shorthand, e.g. 'AKs' or 'AKo'.
        """
        if len(text) == 4:
            card1 = Card.parse(text[:2])
            card2 = Card.parse(text[2:])
            return cls(card1, card2)
        if len(text) == 3:
            rank1 = Rank.from_label(text[0])
            rank2 = Rank.from_label(text[1])
            suffix = text[2].lower()
            if rank1 == rank2:
                raise ValueError(
                    "Suited/offsuit shorthand cannot be used for pairs; use exact suits"
                )
            if suffix not in ("s", "o"):
                raise ValueError(f"Invalid hand shorthand suffix: {text[2]!r}")
            suited = suffix == "s"
            if suited:
                suit1 = Suit.SPADES
                suit2 = Suit.SPADES
            else:
                suit1 = Suit.SPADES
                suit2 = Suit.HEARTS
            return cls(Card(rank1, suit1), Card(rank2, suit2))
        raise ValueError(f"Hand string must be 3 or 4 characters: {text!r}")

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Hand):
            return NotImplemented
        return self._cards == other._cards

    def __hash__(self) -> int:
        return hash(self._cards)

    def __repr__(self) -> str:
        return f"Hand({self._cards[0]!r}, {self._cards[1]!r})"

    def __str__(self) -> str:
        return f"{self._cards[0]}{self._cards[1]}"
