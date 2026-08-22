"""Tests for system.py: Rule, System, load_system, load_systems_dir."""

from __future__ import annotations

from pathlib import Path
from textwrap import dedent

import pytest

from app.poker.actions import ActionType
from app.poker.board import Board
from app.poker.cards import Hand
from app.poker.state import HandState, Position, PotType
from app.poker.system import Rule, System, load_system, load_systems_dir

# --- Rule --------------------------------------------------------------------

class TestRule:
    def test_creation(self) -> None:
        rule = Rule(
            name="test-rule",
            conditions={"street": "flop"},
            action={"type": "check"},
        )
        assert rule.name == "test-rule"
        assert rule.conditions == {"street": "flop"}

    def test_to_action_fold(self) -> None:
        rule = Rule(name="fold-rule", conditions={}, action={"type": "fold"})
        action = rule.to_action()
        assert action.type == ActionType.FOLD
        assert action.size is None

    def test_to_action_bet_fraction(self) -> None:
        rule = Rule(name="bet-rule", conditions={}, action={"type": "bet", "size": 0.66})
        action = rule.to_action()
        assert action.type == ActionType.BET
        assert action.size is not None
        assert action.size.fraction == 0.66

    def test_to_action_bet_keyword(self) -> None:
        rule = Rule(name="pot-rule", conditions={}, action={"type": "bet", "size": "pot"})
        action = rule.to_action()
        assert action.size is not None
        assert action.size.fraction == 1.0

    def test_to_action_all_in(self) -> None:
        rule = Rule(name="shove", conditions={}, action={"type": "raise", "size": "all-in"})
        action = rule.to_action()
        assert action.type == ActionType.RAISE
        assert action.size is not None
        assert action.size.is_all_in is True


# --- System.evaluate ---------------------------------------------------------

class TestSystemEvaluate:
    def _make_flop_state(
        self,
        hand: Hand | None = None,
        board: Board | None = None,
    ) -> HandState:
        if hand is None:
            hand = Hand.parse("AhKd")
        if board is None:
            board = Board.parse("AhQs2c")
        return HandState(
            hand=hand,
            board=board,
            position=Position.BTN,
            pot=10.0,
            hero_stack=90.0,
            villain_stack=90.0,
            pot_type=PotType.SINGLE_RAISED,
        )

    def test_match(self) -> None:
        system = System(
            name="test",
            description="test system",
            rules=[
                Rule(
                    name="flop-bet",
                    conditions={"street": "flop"},
                    action={"type": "bet", "size": 0.66},
                ),
            ],
        )
        state = self._make_flop_state()
        decision = system.evaluate(state)
        assert decision.has_decision
        assert decision.matched_rule == "flop-bet"
        assert decision.action is not None
        assert decision.action.type == ActionType.BET

    def test_no_match(self) -> None:
        system = System(
            name="test",
            description="test system",
            rules=[
                Rule(
                    name="turn-bet",
                    conditions={"street": "turn"},
                    action={"type": "bet", "size": 0.66},
                ),
            ],
        )
        state = self._make_flop_state()
        decision = system.evaluate(state)
        assert not decision.has_decision
        assert decision.action is None
        assert decision.matched_rule is None

    def test_first_match_wins(self) -> None:
        system = System(
            name="test",
            description="test system",
            rules=[
                Rule(
                    name="rule1",
                    conditions={"street": "flop", "position": "BTN"},
                    action={"type": "check"},
                ),
                Rule(
                    name="rule2",
                    conditions={"street": "flop"},
                    action={"type": "bet", "size": 0.5},
                ),
            ],
        )
        state = self._make_flop_state()
        decision = system.evaluate(state)
        assert decision.matched_rule == "rule1"
        assert decision.action is not None
        assert decision.action.type == ActionType.CHECK


# --- _parse_action -----------------------------------------------------------

class TestParseAction:
    def test_fold(self) -> None:
        rule = Rule(name="r", conditions={}, action={"type": "fold"})
        action = rule.to_action()
        assert action.type == ActionType.FOLD
        assert action.size is None

    def test_bet_fraction(self) -> None:
        rule = Rule(name="r", conditions={}, action={"type": "bet", "size": 0.75})
        action = rule.to_action()
        assert action.size is not None
        assert action.size.fraction == 0.75

    def test_bet_absolute(self) -> None:
        rule = Rule(name="r", conditions={}, action={"type": "bet", "size": 150})
        action = rule.to_action()
        assert action.size is not None
        assert action.size.absolute == 150

    def test_bet_keyword_pot(self) -> None:
        rule = Rule(name="r", conditions={}, action={"type": "bet", "size": "pot"})
        action = rule.to_action()
        assert action.size is not None
        assert action.size.fraction == 1.0

    def test_bet_keyword_half_pot(self) -> None:
        rule = Rule(name="r", conditions={}, action={"type": "bet", "size": "half-pot"})
        action = rule.to_action()
        assert action.size is not None
        assert action.size.fraction == 0.50

    def test_bet_keyword_quarter_pot(self) -> None:
        rule = Rule(name="r", conditions={}, action={"type": "bet", "size": "quarter-pot"})
        action = rule.to_action()
        assert action.size is not None
        assert action.size.fraction == 0.25

    def test_bet_keyword_all_in(self) -> None:
        rule = Rule(name="r", conditions={}, action={"type": "raise", "size": "all-in"})
        action = rule.to_action()
        assert action.size is not None
        assert action.size.is_all_in is True

    def test_bet_without_size(self) -> None:
        rule = Rule(name="r", conditions={}, action={"type": "bet"})
        with pytest.raises(ValueError):
            rule.to_action()

    def test_fold_with_size(self) -> None:
        rule = Rule(name="r", conditions={}, action={"type": "fold", "size": 0.5})
        with pytest.raises(ValueError):
            rule.to_action()

    def test_invalid_keyword(self) -> None:
        rule = Rule(name="r", conditions={}, action={"type": "bet", "size": "bogus"})
        with pytest.raises(ValueError):
            rule.to_action()


# --- load_system -------------------------------------------------------------

class TestLoadSystem:
    def test_load_from_file(self, tmp_path: Path) -> None:
        yaml_content = dedent("""
            name: "Test System"
            description: "A test system"
            rules:
              - name: "rule1"
                conditions:
                  street: flop
                action:
                  type: check
        """)
        path = tmp_path / "test.yaml"
        path.write_text(yaml_content)
        system = load_system(path)
        assert system.name == "Test System"
        assert system.description == "A test system"
        assert len(system.rules) == 1
        assert system.rules[0].name == "rule1"

    def test_load_systems_dir(self, tmp_path: Path) -> None:
        (tmp_path / "a.yaml").write_text(
            dedent("""
                name: "A"
                description: ""
                rules: []
            """)
        )
        (tmp_path / "b.yaml").write_text(
            dedent("""
                name: "B"
                description: ""
                rules: []
            """)
        )
        systems = load_systems_dir(tmp_path)
        assert len(systems) == 2
        assert systems[0].name == "A"
        assert systems[1].name == "B"

    def test_load_systems_dir_sorted(self, tmp_path: Path) -> None:
        # Write in non-alphabetical order
        (tmp_path / "z.yaml").write_text('name: "Z"\ndescription: ""\nrules: []\n')
        (tmp_path / "a.yaml").write_text('name: "A"\ndescription: ""\nrules: []\n')
        systems = load_systems_dir(tmp_path)
        assert systems[0].name == "A"
        assert systems[1].name == "Z"

    def test_load_systems_dir_not_directory(self) -> None:
        with pytest.raises(ValueError):
            load_systems_dir("nonexistent_dir_xyz")
