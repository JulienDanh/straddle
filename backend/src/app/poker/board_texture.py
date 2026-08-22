"""Board texture analysis: high card, suit texture, paired/trips detection."""

from __future__ import annotations

from collections import Counter
from enum import Enum

from app.poker.board import Board
from app.poker.cards import Card, Rank, Suit


class BoardHighCard(Enum):
    """Highest card classification of the board."""

    ACE_HIGH = "A-high"
    KING_HIGH = "K-high"
    QUEEN_HIGH = "Q-high"
    JACK_HIGH = "J-high"
    TEN_HIGH = "T-high"
    LOW = "low"  # 9 or lower


class BoardSuitTexture(Enum):
    """Suit distribution of the board."""

    RAINBOW = "rainbow"
    TWO_TONE = "two-tone"
    MONOTONE = "monotone"


class BoardTexture:
    """Computed texture classification of a board."""

    def __init__(
        self,
        high_card: BoardHighCard,
        suit_texture: BoardSuitTexture,
        is_paired: bool,
        is_trips: bool,
        cards: tuple[Card, ...],
    ) -> None:
        self._high_card = high_card
        self._suit_texture = suit_texture
        self._is_paired = is_paired
        self._is_trips = is_trips
        self._cards = cards

    @property
    def high_card(self) -> BoardHighCard:
        return self._high_card

    @property
    def suit_texture(self) -> BoardSuitTexture:
        return self._suit_texture

    @property
    def is_paired(self) -> bool:
        return self._is_paired

    @property
    def is_trips(self) -> bool:
        return self._is_trips

    @property
    def ranks(self) -> list[Rank]:
        return [c.rank for c in self._cards]

    @property
    def suits(self) -> list[Suit]:
        return [c.suit for c in self._cards]

    @property
    def rank_counts(self) -> dict[Rank, int]:
        return dict(Counter(self.ranks))

    @property
    def suit_counts(self) -> dict[Suit, int]:
        return dict(Counter(self.suits))

    @property
    def is_ace_high(self) -> bool:
        return self._high_card == BoardHighCard.ACE_HIGH

    @property
    def is_king_high(self) -> bool:
        return self._high_card == BoardHighCard.KING_HIGH

    @property
    def is_monotone(self) -> bool:
        return self._suit_texture == BoardSuitTexture.MONOTONE

    @property
    def is_two_tone(self) -> bool:
        return self._suit_texture == BoardSuitTexture.TWO_TONE

    @property
    def is_rainbow(self) -> bool:
        return self._suit_texture == BoardSuitTexture.RAINBOW

    @property
    def has_flush_draw(self) -> bool:
        """True if there are 2+ of the same suit (potential flush draw)."""
        return any(count >= 2 for count in self.suit_counts.values())

    @property
    def is_broadway(self) -> bool:
        """True if the board's high card is T or above (T/J/Q/K/A-high)."""
        return self._high_card != BoardHighCard.LOW

    @property
    def is_low(self) -> bool:
        """True if the board's high card is 9 or below."""
        return self._high_card == BoardHighCard.LOW

    def contains_rank(self, rank: Rank) -> bool:
        """True if the board has a card of the given rank."""
        return rank in self.ranks

    @property
    def straights_possible(self) -> bool:
        """True if the board's ranks are connected enough to make a straight.

        A straight is considered possible when the board contains at least
        three distinct ranks within a 5-rank window — i.e. a hand could
        complete a straight with two hole cards. Boards with a single gap
        (e.g. 8-6-4) still qualify; totally disconnected boards (e.g.
        A-K-2, K-8-3) do not. Ace plays both high (T-J-Q-K-A) and low
        (A-2-3-4-5).
        """
        values = sorted({r.value for r in self.ranks})
        # Ace also plays as 1 for the wheel.
        if Rank.ACE.value in values:
            values = sorted(set(values) | {1})
        if len(values) < 3:
            return False
        for window_start in range(1, 11):  # A-low windows through T-A
            window = set(range(window_start, window_start + 5))
            present = len(window & set(values))
            if present >= 3:
                return True
        return False

    @property
    def is_disconnected(self) -> bool:
        """True if no two board ranks are consecutive (a 'dry' board).

        The inverse of straight connectivity: a board with no touching ranks
        cannot make a straight with two hole cards within a single window.
        Note this is stricter than `not straights_possible` — a board like
        8-6-4 is not consecutive but can still make a straight (gaps fill),
        so it is NOT disconnected. Only truly scattered boards (e.g. K-8-2)
        qualify.
        """
        values = sorted({r.value for r in self.ranks})
        if len(values) < 2:
            return False
        for i in range(1, len(values)):
            if values[i] == values[i - 1] + 1:
                return False
        return True


class BoardAnalyzer:
    """Analyzes a Board to produce a BoardTexture."""

    @staticmethod
    def analyze(board: Board) -> BoardTexture:
        """Classify the texture of a board. Raises ValueError on a preflop board."""
        if board.is_preflop:
            raise ValueError("Cannot analyze texture of a preflop board (0 cards)")
        cards = tuple(board)
        high_card = _classify_high_card(cards)
        suit_texture = _classify_suit_texture(cards)
        rank_counts = Counter(c.rank for c in cards)
        is_paired = any(count == 2 for count in rank_counts.values())
        is_trips = any(count == 3 for count in rank_counts.values())
        return BoardTexture(high_card, suit_texture, is_paired, is_trips, cards)


def _classify_high_card(cards: tuple[Card, ...]) -> BoardHighCard:
    max_rank = max(c.rank for c in cards)
    if max_rank == Rank.ACE:
        return BoardHighCard.ACE_HIGH
    if max_rank == Rank.KING:
        return BoardHighCard.KING_HIGH
    if max_rank == Rank.QUEEN:
        return BoardHighCard.QUEEN_HIGH
    if max_rank == Rank.JACK:
        return BoardHighCard.JACK_HIGH
    if max_rank == Rank.TEN:
        return BoardHighCard.TEN_HIGH
    return BoardHighCard.LOW


def _classify_suit_texture(cards: tuple[Card, ...]) -> BoardSuitTexture:
    suit_counts = Counter(c.suit for c in cards)
    num_suits = len(suit_counts)
    if num_suits == 1:
        return BoardSuitTexture.MONOTONE
    if num_suits == 2:
        return BoardSuitTexture.TWO_TONE
    return BoardSuitTexture.RAINBOW
