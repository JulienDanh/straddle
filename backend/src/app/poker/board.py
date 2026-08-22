"""Street and Board value objects for Texas Hold'em."""

from __future__ import annotations

from collections.abc import Iterator
from enum import Enum

from app.poker.cards import Card


class Street(Enum):
    """Betting streets in Texas Hold'em."""

    PREFLOP = "preflop"
    FLOP = "flop"
    TURN = "turn"
    RIVER = "river"

    @property
    def card_count(self) -> int:
        """Number of board cards dealt on this street."""
        return {
            Street.PREFLOP: 0,
            Street.FLOP: 3,
            Street.TURN: 4,
            Street.RIVER: 5,
        }[self]


class Board:
    """Immutable community card board. Validates card count in {0, 3, 4, 5}."""

    __slots__ = ("_cards", "_street")

    _cards: tuple[Card, ...]
    _street: Street

    def __init__(self, cards: tuple[Card, ...] = ()) -> None:
        cards = tuple(cards)
        if len(cards) not in (0, 3, 4, 5):
            raise ValueError(f"Board must have 0, 3, 4, or 5 cards; got {len(cards)}")
        seen: set[Card] = set()
        for c in cards:
            if c in seen:
                raise ValueError(f"Duplicate card on board: {c}")
            seen.add(c)
        self._cards = cards
        self._street = _street_from_count(len(cards))

    @property
    def cards(self) -> tuple[Card, ...]:
        return self._cards

    @property
    def street(self) -> Street:
        return self._street

    @property
    def is_preflop(self) -> bool:
        return self._street == Street.PREFLOP

    @property
    def is_flop(self) -> bool:
        return self._street == Street.FLOP

    @property
    def is_turn(self) -> bool:
        return self._street == Street.TURN

    @property
    def is_river(self) -> bool:
        return self._street == Street.RIVER

    @classmethod
    def parse(cls, text: str) -> Board:
        """Parse a board string of concatenated 2-char cards, e.g. 'AhKdQs'."""
        text = text.strip()
        if len(text) == 0:
            return cls(())
        if len(text) % 2 != 0:
            raise ValueError(f"Board string must have even length: {text!r}")
        cards = tuple(Card.parse(text[i : i + 2]) for i in range(0, len(text), 2))
        return cls(cards)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Board):
            return NotImplemented
        return self._cards == other._cards

    def __hash__(self) -> int:
        return hash(self._cards)

    def __repr__(self) -> str:
        return f"Board({list(self._cards)!r})"

    def __str__(self) -> str:
        return "".join(str(c) for c in self._cards)

    def __iter__(self) -> Iterator[Card]:
        return iter(self._cards)

    def __len__(self) -> int:
        return len(self._cards)


def _street_from_count(count: int) -> Street:
    if count == 0:
        return Street.PREFLOP
    if count == 3:
        return Street.FLOP
    if count == 4:
        return Street.TURN
    if count == 5:
        return Street.RIVER
    raise ValueError(f"Invalid board card count: {count}")
