"""Pragmatic hand classification: made hands and draws for rule predicates."""

from __future__ import annotations

from collections import Counter
from collections.abc import Sequence
from enum import Enum

from app.poker.board import Board
from app.poker.cards import Card, Hand, Rank, Suit


class MadeHandCategory(Enum):
    """Categories of made poker hands, ordered roughly by strength."""

    HIGH_CARD = "high-card"
    PAIR = "pair"
    TWO_PAIR = "two-pair"
    TRIPS = "trips"
    SET = "set"
    STRAIGHT = "straight"
    FLUSH = "flush"
    FULL_HOUSE = "full-house"
    QUADS = "quads"
    STRAIGHT_FLUSH = "straight-flush"
    OVERPAIR = "overpair"


class DrawCategory(Enum):
    """Drawing hand categories."""

    FLUSH_DRAW = "flush-draw"
    OPEN_ENDED_STRAIGHT_DRAW = "oesd"
    GUTSHOT = "gutshot"
    BACKDOOR_FLUSH_DRAW = "backdoor-flush-draw"
    NO_DRAW = "no-draw"


class HandClassification:
    """Classification of a hand+board combination."""

    def __init__(
        self,
        made_hand: MadeHandCategory,
        draws: list[DrawCategory],
        is_top_pair: bool = False,
        is_overpair: bool = False,
        pair_rank: Rank | None = None,
        high_card_rank: Rank | None = None,
        has_three_straight: bool = False,
    ) -> None:
        self._made_hand = made_hand
        self._draws = draws
        self._is_top_pair = is_top_pair
        self._is_overpair = is_overpair
        self._pair_rank = pair_rank
        self._high_card_rank = high_card_rank
        self._has_three_straight = has_three_straight

    @property
    def made_hand(self) -> MadeHandCategory:
        return self._made_hand

    @property
    def draws(self) -> list[DrawCategory]:
        return self._draws

    @property
    def is_top_pair(self) -> bool:
        return self._is_top_pair

    @property
    def is_overpair(self) -> bool:
        return self._is_overpair

    @property
    def pair_rank(self) -> Rank | None:
        return self._pair_rank

    @property
    def high_card_rank(self) -> Rank | None:
        """When the made hand is HIGH_CARD, the rank of hero's higher hole card.

        None for non-high-card hands. Used by the high-card defending
        strategy (defend ace-high, then queen-high, then jack-high, ...).
        """
        return self._high_card_rank

    @property
    def has_flush_draw(self) -> bool:
        return DrawCategory.FLUSH_DRAW in self._draws

    @property
    def has_gutshot(self) -> bool:
        return DrawCategory.GUTSHOT in self._draws

    @property
    def has_oesd(self) -> bool:
        return DrawCategory.OPEN_ENDED_STRAIGHT_DRAW in self._draws

    @property
    def has_three_straight(self) -> bool:
        """True if two hole cards plus one board card form three consecutive ranks.

        Distinct from an OESD (which is four to a straight): this is the
        "3-to-a-straight" connector that the BBZ defending systems treat as a
        defending qualifier (e.g. 9-8 on a K-7-7 board).
        """
        return self._has_three_straight


class HandClassifier:
    """Classifies a hand+board combination into made hands and draws."""

    @staticmethod
    def classify(hand: Hand, board: Board) -> HandClassification:
        """Classify the hand against the board.

        Preflop: PAIR if pocket pair, else HIGH_CARD. No draws.
        Postflop: pragmatic classification of made hands and draws.
        """
        if board.is_preflop:
            if hand.is_pair:
                return HandClassification(MadeHandCategory.PAIR, [])
            return HandClassification(
                MadeHandCategory.HIGH_CARD, [], high_card_rank=hand.high_rank
            )

        hole_cards = list(hand.cards)
        board_cards = list(board)
        all_cards = hole_cards + board_cards

        rank_counts = Counter(c.rank for c in all_cards)
        suit_counts = Counter(c.suit for c in all_cards)
        hole_rank_counts = Counter(c.rank for c in hole_cards)
        hole_suits = [c.suit for c in hole_cards]

        board_rank_counts = Counter(c.rank for c in board_cards)
        board_high_rank = max(c.rank for c in board_cards)

        made_hand = _classify_made_hand(
            rank_counts, hole_rank_counts, board_rank_counts, suit_counts, all_cards
        )
        draws = _classify_draws(all_cards, hole_cards, board_cards, suit_counts, hole_suits)

        is_overpair = (
            hand.is_pair
            and hand.high_rank.value > board_high_rank.value
            and made_hand == MadeHandCategory.OVERPAIR
        )
        is_top_pair = False
        pair_rank = None
        if made_hand in (MadeHandCategory.PAIR, MadeHandCategory.SET) and hand.is_pair:
            pair_rank = hand.high_rank
        elif made_hand == MadeHandCategory.PAIR:
            # One hole card pairs with a board card; top pair if board card is highest
            for rank, count in rank_counts.items():
                if count == 2:
                    if rank in hole_rank_counts and rank == board_high_rank:
                        is_top_pair = True
                        pair_rank = rank
                    elif rank in hole_rank_counts:
                        pair_rank = rank

        high_card_rank = hand.high_rank if made_hand == MadeHandCategory.HIGH_CARD else None
        has_three_straight = _has_three_straight(hole_cards, board_cards)

        return HandClassification(
            made_hand=made_hand,
            draws=draws,
            is_top_pair=is_top_pair,
            is_overpair=is_overpair,
            pair_rank=pair_rank,
            high_card_rank=high_card_rank,
            has_three_straight=has_three_straight,
        )


def _classify_made_hand(
    rank_counts: Counter[Rank],
    hole_rank_counts: Counter[Rank],
    board_rank_counts: Counter[Rank],
    suit_counts: Counter[Suit],
    all_cards: list[Card],
) -> MadeHandCategory:
    """Classify the best made hand. Pragmatic, not a full 7-card evaluator."""
    counts = sorted(rank_counts.values(), reverse=True)
    has_flush = any(count >= 5 for count in suit_counts.values())
    has_straight = _detect_straight(rank_counts)

    if has_flush and has_straight:
        return MadeHandCategory.STRAIGHT_FLUSH

    if counts and counts[0] == 4:
        return MadeHandCategory.QUADS

    if counts and counts[0] >= 3 and len(counts) >= 2 and counts[1] >= 2:
        return MadeHandCategory.FULL_HOUSE

    if has_flush:
        return MadeHandCategory.FLUSH

    if has_straight:
        return MadeHandCategory.STRAIGHT

    if counts and counts[0] == 3:
        return _classify_trips_or_set(rank_counts, hole_rank_counts, board_rank_counts)

    if counts and counts[0] == 2 and len(counts) >= 2 and counts[1] == 2:
        return _classify_two_pair(rank_counts, hole_rank_counts, board_rank_counts)

    if counts and counts[0] == 2:
        return _classify_pair(rank_counts, hole_rank_counts, board_rank_counts)

    return MadeHandCategory.HIGH_CARD


def _classify_trips_or_set(
    rank_counts: Counter[Rank],
    hole_rank_counts: Counter[Rank],
    board_rank_counts: Counter[Rank],
) -> MadeHandCategory:
    """Distinguish a set (pocket pair + board card) from trips (one hole card + board pair)."""
    trips_rank = None
    for rank, count in rank_counts.items():
        if count == 3:
            trips_rank = rank
            break
    if trips_rank is None:
        return MadeHandCategory.TRIPS

    if hole_rank_counts.get(trips_rank, 0) == 2:
        return MadeHandCategory.SET

    if hole_rank_counts.get(trips_rank, 0) == 1 and board_rank_counts.get(trips_rank, 0) == 2:
        return MadeHandCategory.TRIPS

    if board_rank_counts.get(trips_rank, 0) == 3:
        return MadeHandCategory.TRIPS

    return MadeHandCategory.TRIPS


def _classify_two_pair(
    rank_counts: Counter[Rank],
    hole_rank_counts: Counter[Rank],
    board_rank_counts: Counter[Rank],
) -> MadeHandCategory:
    """Classify two pair. Returns TWO_PAIR only if hero contributes to at least one pair."""
    pair_ranks = [rank for rank, count in rank_counts.items() if count == 2]
    hero_contributes = any(hole_rank_counts.get(r, 0) > 0 for r in pair_ranks)
    if hero_contributes:
        return MadeHandCategory.TWO_PAIR
    # Both pairs on board, hero plays the board with two pair
    return MadeHandCategory.TWO_PAIR


def _classify_pair(
    rank_counts: Counter[Rank],
    hole_rank_counts: Counter[Rank],
    board_rank_counts: Counter[Rank],
) -> MadeHandCategory:
    """Classify a single pair as overpair, pair, or high-card (if board-paired only)."""
    pair_rank = None
    for rank, count in rank_counts.items():
        if count == 2:
            pair_rank = rank
            break
    if pair_rank is None:
        return MadeHandCategory.PAIR

    # Pocket pair above the board's high card → overpair
    if hole_rank_counts.get(pair_rank, 0) == 2:
        return MadeHandCategory.OVERPAIR

    # Hero contributes one card to the pair → pair
    if hole_rank_counts.get(pair_rank, 0) == 1:
        return MadeHandCategory.PAIR

    # Pair is entirely on the board, hero doesn't pair up → high card
    return MadeHandCategory.HIGH_CARD


def _classify_draws(
    all_cards: list[Card],
    hole_cards: list[Card],
    board_cards: list[Card],
    suit_counts: Counter[Suit],
    hole_suits: list[Suit],
) -> list[DrawCategory]:
    """Detect drawing hands. Returns list of DrawCategory (may be empty)."""
    draws: list[DrawCategory] = []
    if _has_flush_draw(suit_counts, hole_suits):
        draws.append(DrawCategory.FLUSH_DRAW)

    if _has_backdoor_flush_draw(suit_counts, hole_suits, board_cards):
        draws.append(DrawCategory.BACKDOOR_FLUSH_DRAW)

    rank_counts = Counter(c.rank for c in all_cards)
    if _has_oesd(rank_counts):
        draws.append(DrawCategory.OPEN_ENDED_STRAIGHT_DRAW)

    if _has_gutshot(rank_counts):
        draws.append(DrawCategory.GUTSHOT)

    if not draws:
        draws.append(DrawCategory.NO_DRAW)

    return draws


def _has_flush_draw(suit_counts: Counter[Suit], hole_suits: list[Suit]) -> bool:
    """4+ of the same suit total, including at least one hole card of that suit."""
    for suit, count in suit_counts.items():
        if count == 4 and suit in hole_suits:
            return True
    return False


def _has_backdoor_flush_draw(
    suit_counts: Counter[Suit], hole_suits: list[Suit], board_cards: list[Card]
) -> bool:
    """3 of the same suit on the flop, including at least one hole card. Only on flop."""
    if len(board_cards) != 3:
        return False
    for suit, count in suit_counts.items():
        if count == 3 and suit in hole_suits:
            return True
    return False


def _has_oesd(rank_counts: Counter[Rank]) -> bool:
    """Open-ended straight draw: 4 consecutive ranks present."""
    rank_values = sorted(set(r.value for r in rank_counts))
    consecutive = _max_consecutive(rank_values)
    if consecutive >= 4:
        # Make sure it's not a made straight (5 consecutive)
        if consecutive >= 5:
            return False
        return True
    return False


def _has_gutshot(rank_counts: Counter[Rank]) -> bool:
    """Gutshot: 4 of 5 consecutive ranks present (with a gap)."""
    rank_values = sorted(set(r.value for r in rank_counts))
    # Check for 4-rank windows with exactly one gap
    # A gutshot means 4 cards that can complete a straight with one card
    # Check all 5-card windows
    for window_start in range(2, 12):  # A-low windows through T-A
        window = list(range(window_start, window_start + 5))
        present = sum(1 for v in window if v in rank_values)
        if present == 4:
            # Make sure it's not already a straight (5 present) or OESD (4 consecutive)
            # Check if the 4 present are NOT 4 consecutive (which would be OESD)
            present_vals = [v for v in window if v in rank_values]
            consecutive = _max_consecutive(present_vals)
            if consecutive < 4:
                return True
    return False


def _detect_straight(rank_counts: Counter[Rank]) -> bool:
    """Check if 5 consecutive ranks are present (including wheel A-2-3-4-5)."""
    rank_values = set(r.value for r in rank_counts)
    # Wheel: A-2-3-4-5 (Ace plays as 1)
    if {14, 2, 3, 4, 5}.issubset(rank_values):
        return True
    sorted_vals = sorted(rank_values)
    return _max_consecutive(sorted_vals) >= 5


def _max_consecutive(values: Sequence[int]) -> int:
    """Length of the longest run of consecutive integers in the sorted sequence."""
    if not values:
        return 0
    values = sorted(set(values))
    max_run = 1
    current = 1
    for i in range(1, len(values)):
        if values[i] == values[i - 1] + 1:
            current += 1
            if current > max_run:
                max_run = current
        else:
            current = 1
    return max_run


def _has_three_straight(hole_cards: list[Card], board_cards: list[Card]) -> bool:
    """True if both hole cards plus one board card form three consecutive ranks.

    A "3-to-a-straight": the two hole cards are distinct ranks, and together
    with one board card they form a 3-card run (e.g. 9-8 on a K-7-7 board →
    7-8-9). Ace plays both high (Q-K-A) and low (A-2-3).
    """
    h1, h2 = hole_cards[0].rank, hole_cards[1].rank
    if h1 == h2:
        return False
    hole_vals = {h1.value, h2.value}
    # Ace also plays as 1 for the wheel.
    hole_vals_low = hole_vals | ({1} if 14 in hole_vals else set())
    board_vals = {c.rank.value for c in board_cards}
    board_vals_low = board_vals | ({1} if 14 in board_vals else set())
    # A 3-straight needs three consecutive ranks where exactly the two hole
    # cards + one board card are present across a 3-window.
    for window_start in range(1, 13):  # A-2-3 through Q-K-A
        window = set(range(window_start, window_start + 3))
        # Which window ranks come from hole vs board.
        from_hole = window & hole_vals_low
        from_board = window & board_vals_low
        if len(from_hole) == 2 and len(from_board) >= 1 and (from_hole | from_board) == window:
            return True
    return False
