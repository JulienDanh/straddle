"""Action, Sizing, and Decision models for the poker trainer."""

from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, ConfigDict, model_validator


class ActionType(Enum):
    """Types of actions a player can take."""

    FOLD = "fold"
    CHECK = "check"
    CALL = "call"
    BET = "bet"
    RAISE = "raise"

    @property
    def requires_size(self) -> bool:
        """True for BET and RAISE, which need a sizing."""
        return self in (ActionType.BET, ActionType.RAISE)


class SizingType(Enum):
    """How a bet/raise size is expressed."""

    FRACTION = "fraction"
    ABSOLUTE = "absolute"
    ALL_IN = "all_in"


class Sizing(BaseModel):
    """A bet or raise sizing: fraction of pot, absolute chips, or all-in."""

    model_config = ConfigDict(frozen=True)

    type: SizingType
    fraction: float | None = None
    absolute: int | None = None
    is_all_in: bool | None = None

    @classmethod
    def from_fraction(cls, fraction: float) -> Sizing:
        """Create a pot-fraction sizing, e.g. 0.66 for two-thirds pot."""
        return cls(type=SizingType.FRACTION, fraction=fraction)

    @classmethod
    def from_absolute(cls, amount: int) -> Sizing:
        """Create an absolute-chip sizing."""
        return cls(type=SizingType.ABSOLUTE, absolute=amount)

    @classmethod
    def all_in(cls) -> Sizing:
        """Create an all-in sizing."""
        return cls(type=SizingType.ALL_IN, is_all_in=True)


class Action(BaseModel):
    """A player action with an optional sizing."""

    model_config = ConfigDict(frozen=True)

    type: ActionType
    size: Sizing | None = None

    @classmethod
    def fold(cls) -> Action:
        return cls(type=ActionType.FOLD)

    @classmethod
    def check(cls) -> Action:
        return cls(type=ActionType.CHECK)

    @classmethod
    def call(cls) -> Action:
        return cls(type=ActionType.CALL)

    @classmethod
    def bet(cls, sizing: Sizing) -> Action:
        return cls(type=ActionType.BET, size=sizing)

    @classmethod
    def raise_(cls, sizing: Sizing) -> Action:
        return cls(type=ActionType.RAISE, size=sizing)

    @model_validator(mode="after")
    def _validate_size(self) -> Action:
        if self.type.requires_size and self.size is None:
            raise ValueError(f"Action {self.type.value!r} requires a size")
        if not self.type.requires_size and self.size is not None:
            raise ValueError(f"Action {self.type.value!r} does not accept a size")
        return self


class Decision(BaseModel):
    """The result of evaluating a HandState against a System of rules."""

    model_config = ConfigDict(frozen=True)

    action: Action | None = None
    matched_rule: str | None = None

    @property
    def has_decision(self) -> bool:
        """True if a matching rule produced an action."""
        return self.action is not None
