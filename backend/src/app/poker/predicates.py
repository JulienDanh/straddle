"""Predicate registry and built-in predicates for rule conditions."""

from __future__ import annotations

import re
from collections.abc import Callable
from typing import Any

from app.poker.board import Street
from app.poker.board_texture import BoardAnalyzer, BoardHighCard, BoardSuitTexture
from app.poker.hand_classification import HandClassifier, MadeHandCategory
from app.poker.state import HandState, Position, PotType

PredicateFn = Callable[[HandState, Any], bool]


class PredicateRegistry:
    """Registry of predicate functions keyed by condition name."""

    def __init__(self) -> None:
        self._predicates: dict[str, PredicateFn] = {}

    def register(self, key: str, fn: PredicateFn) -> None:
        """Register a predicate. Raises on duplicate registration."""
        if key in self._predicates:
            raise ValueError(f"Predicate already registered: {key!r}")
        self._predicates[key] = fn

    def get(self, key: str) -> PredicateFn:
        """Look up a predicate. Raises on unknown key."""
        if key not in self._predicates:
            raise KeyError(f"Unknown predicate key: {key!r}")
        return self._predicates[key]

    def keys(self) -> list[str]:
        return sorted(self._predicates.keys())

    def __contains__(self, key: object) -> bool:
        return key in self._predicates


def _street_predicate(state: HandState, value: Any) -> bool:
    expected = Street(value)
    return state.board.street == expected


def _position_predicate(state: HandState, value: Any) -> bool:
    expected = Position(value)
    return state.position == expected


def _pot_predicate(state: HandState, value: Any) -> bool:
    if state.pot_type is None:
        return False
    normalized = value.replace("-", "_").replace(" ", "_").lower()
    for pt in PotType:
        if pt.name.lower() == normalized or pt.value.replace("-", "_").lower() == normalized:
            return state.pot_type == pt
    return False


def _board_predicate(state: HandState, value: Any) -> bool:
    if state.board.is_preflop:
        return False
    texture = BoardAnalyzer.analyze(state.board)
    if isinstance(value, str):
        return _check_board_property(texture, value)
    if isinstance(value, list):
        return all(_check_board_property(texture, v) for v in value)
    return False


def _check_board_property(texture: Any, value: str) -> bool:
    """Check a single board texture property against a string value."""
    v = value.lower().strip()

    # High card classifications
    for hc in BoardHighCard:
        if v == hc.value.lower():
            return texture.high_card == hc

    # Suit texture
    for st in BoardSuitTexture:
        if v == st.value.lower():
            return texture.suit_texture == st

    # Boolean properties
    if v in ("paired", "is-paired"):
        return texture.is_paired
    if v in ("trips", "is-trips", "three-of-a-kind"):
        return texture.is_trips
    if v in ("monotone", "is-monotone"):
        return texture.is_monotone
    if v in ("two-tone", "is-two-tone", "two_tone"):
        return texture.is_two_tone
    if v in ("rainbow", "is-rainbow"):
        return texture.is_rainbow
    if v in ("ace-high", "a-high", "is-ace-high"):
        return texture.is_ace_high
    if v in ("king-high", "k-high"):
        return texture.is_king_high
    if v in ("flush-draw", "has-flush-draw"):
        return texture.has_flush_draw
    if v == "low":
        return texture.high_card == BoardHighCard.LOW

    return False


def _hand_predicate(state: HandState, value: Any) -> bool:
    classification = HandClassifier.classify(state.hand, state.board)
    if isinstance(value, str):
        return _check_hand_property(classification, value)
    if isinstance(value, list):
        return all(_check_hand_property(classification, v) for v in value)
    return False


def _check_hand_property(classification: Any, value: str) -> bool:
    """Check a single hand classification property against a string value."""
    v = value.lower().strip()

    # Made hand categories
    for mhc in MadeHandCategory:
        if v == mhc.value.lower():
            return classification.made_hand == mhc

    # Special properties
    if v in ("top-pair", "is-top-pair"):
        return classification.is_top_pair
    if v in ("overpair", "is-overpair"):
        return classification.is_overpair

    # Draw checks
    if v in ("flush-draw", "has-flush-draw"):
        return classification.has_flush_draw
    if v in ("gutshot", "has-gutshot"):
        return classification.has_gutshot
    if v in ("oesd", "open-ended-straight-draw", "has-oesd"):
        return classification.has_oesd

    return False


def _players_predicate(state: HandState, value: Any) -> bool:
    if isinstance(value, int):
        return state.num_players == value
    v = str(value).lower().strip().replace("-", "_").replace(" ", "_")
    if v in ("heads_up", "hu"):
        return state.is_heads_up
    if v in ("multiway", "mw"):
        return state.is_multiway
    # Try parsing as int
    try:
        return state.num_players == int(v)
    except ValueError:
        return False


_SPR_COMPARISON = re.compile(r"^(<=|>=|<|>)\s*(\d+(?:\.\d+)?)$")


def _spr_predicate(state: HandState, value: Any) -> bool:
    v = str(value).strip()
    match = _SPR_COMPARISON.match(v)
    if match is None:
        raise ValueError(f"Invalid spr condition: {value!r}")
    op, num_str = match.groups()
    threshold = float(num_str)
    spr = state.spr
    if op == "<":
        return spr < threshold
    if op == "<=":
        return spr <= threshold
    if op == ">":
        return spr > threshold
    if op == ">=":
        return spr >= threshold
    return False


def _default_registry() -> PredicateRegistry:
    """Create a registry with all built-in predicates registered."""
    registry = PredicateRegistry()
    registry.register("street", _street_predicate)
    registry.register("position", _position_predicate)
    registry.register("pot", _pot_predicate)
    registry.register("board", _board_predicate)
    registry.register("hand", _hand_predicate)
    registry.register("players", _players_predicate)
    registry.register("spr", _spr_predicate)
    return registry


_default_registry_instance = _default_registry()


def default_registry() -> PredicateRegistry:
    """Return the shared default registry with built-in predicates."""
    return _default_registry_instance


def evaluate_conditions(
    conditions: dict[str, Any], state: HandState, registry: PredicateRegistry | None = None
) -> bool:
    """Evaluate AND logic across all conditions. Empty dict → True."""
    if not conditions:
        return True
    reg = registry if registry is not None else default_registry()
    for key, value in conditions.items():
        predicate = reg.get(key)
        if not predicate(state, value):
            return False
    return True
