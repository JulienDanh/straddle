"""Position, PotType, ActionRecord, and HandState models."""

from __future__ import annotations

import math
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field

from app.poker.board import Board
from app.poker.cards import Hand


class Position(Enum):
    """6-max table positions."""

    UTG = "UTG"
    MP = "MP"
    CO = "CO"
    BTN = "BTN"
    SB = "SB"
    BB = "BB"


class PotType(Enum):
    """Classification of the pot based on preflop action."""

    LIMPED = "limped"
    SINGLE_RAISED = "single-raised"
    THREE_BET = "3bet"
    FOUR_BET = "4bet"
    FIVE_BET_PLUS = "5bet+"


class ActionRecord(BaseModel):
    """A simplified action history record."""

    model_config = ConfigDict(frozen=True)

    actor: Position
    street: str
    action_type: str
    amount: float | None = None


class HandState(BaseModel):
    """Complete state of a hand from hero's perspective."""

    model_config = ConfigDict(frozen=True, arbitrary_types_allowed=True)

    hand: Hand
    board: Board
    position: Position
    pot: float = Field(ge=0)
    hero_stack: float = Field(ge=0)
    villain_stack: float = Field(ge=0)
    num_players: int = Field(default=2, ge=2, le=6)
    action_history: list[ActionRecord] = Field(default_factory=list)
    pot_type: PotType | None = None

    @property
    def street(self):
        """The current betting street, derived from the board."""

        return self.board.street

    @property
    def spr(self) -> float:
        """Stack-to-pot ratio: hero_stack / pot. Infinity if pot is 0."""
        if self.pot == 0:
            return math.inf
        return self.hero_stack / self.pot

    @property
    def is_heads_up(self) -> bool:
        return self.num_players == 2

    @property
    def is_multiway(self) -> bool:
        return self.num_players > 2
