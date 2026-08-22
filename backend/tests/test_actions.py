"""Tests for actions.py: ActionType, SizingType, Sizing, Action, Decision."""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.poker.actions import Action, ActionType, Decision, Sizing, SizingType

# --- ActionType --------------------------------------------------------------

class TestActionType:
    def test_values(self) -> None:
        assert ActionType.FOLD.value == "fold"
        assert ActionType.CHECK.value == "check"
        assert ActionType.CALL.value == "call"
        assert ActionType.BET.value == "bet"
        assert ActionType.RAISE.value == "raise"

    def test_requires_size(self) -> None:
        assert ActionType.BET.requires_size
        assert ActionType.RAISE.requires_size
        assert not ActionType.FOLD.requires_size
        assert not ActionType.CHECK.requires_size
        assert not ActionType.CALL.requires_size


# --- Sizing ------------------------------------------------------------------

class TestSizing:
    def test_from_fraction(self) -> None:
        s = Sizing.from_fraction(0.66)
        assert s.type == SizingType.FRACTION
        assert s.fraction == 0.66

    def test_from_absolute(self) -> None:
        s = Sizing.from_absolute(150)
        assert s.type == SizingType.ABSOLUTE
        assert s.absolute == 150

    def test_all_in(self) -> None:
        s = Sizing.all_in()
        assert s.type == SizingType.ALL_IN
        assert s.is_all_in is True

    def test_frozen(self) -> None:
        s = Sizing.from_fraction(0.5)
        with pytest.raises(ValidationError):
            s.fraction = 0.75  # type: ignore


# --- Action ------------------------------------------------------------------

class TestAction:
    def test_fold(self) -> None:
        a = Action.fold()
        assert a.type == ActionType.FOLD
        assert a.size is None

    def test_check(self) -> None:
        a = Action.check()
        assert a.type == ActionType.CHECK
        assert a.size is None

    def test_call(self) -> None:
        a = Action.call()
        assert a.type == ActionType.CALL
        assert a.size is None

    def test_bet(self) -> None:
        a = Action.bet(Sizing.from_fraction(0.66))
        assert a.type == ActionType.BET
        assert a.size is not None
        assert a.size.fraction == 0.66

    def test_raise(self) -> None:
        a = Action.raise_(Sizing.all_in())
        assert a.type == ActionType.RAISE
        assert a.size is not None
        assert a.size.is_all_in is True

    def test_bet_requires_size(self) -> None:
        with pytest.raises(ValidationError):
            Action(type=ActionType.BET)

    def test_raise_requires_size(self) -> None:
        with pytest.raises(ValidationError):
            Action(type=ActionType.RAISE)

    def test_fold_rejects_size(self) -> None:
        with pytest.raises(ValidationError):
            Action(type=ActionType.FOLD, size=Sizing.from_fraction(0.5))

    def test_check_rejects_size(self) -> None:
        with pytest.raises(ValidationError):
            Action(type=ActionType.CHECK, size=Sizing.all_in())

    def test_call_rejects_size(self) -> None:
        with pytest.raises(ValidationError):
            Action(type=ActionType.CALL, size=Sizing.from_absolute(10))

    def test_frozen(self) -> None:
        a = Action.fold()
        with pytest.raises(ValidationError):
            a.type = ActionType.CHECK  # type: ignore


# --- Decision ----------------------------------------------------------------

class TestDecision:
    def test_empty(self) -> None:
        d = Decision()
        assert d.action is None
        assert d.matched_rule is None
        assert not d.has_decision

    def test_with_action(self) -> None:
        d = Decision(action=Action.check(), matched_rule="test-rule")
        assert d.action is not None
        assert d.matched_rule == "test-rule"
        assert d.has_decision

    def test_frozen(self) -> None:
        d = Decision()
        with pytest.raises(ValidationError):
            d.action = Action.fold()  # type: ignore
