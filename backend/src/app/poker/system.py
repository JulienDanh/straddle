"""Rule, System, and YAML loading for declarative poker strategies."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml
from pydantic import BaseModel, ConfigDict

from app.poker.actions import Action, ActionType, Sizing
from app.poker.predicates import PredicateRegistry, default_registry, evaluate_conditions
from app.poker.state import HandState


class Rule(BaseModel):
    """A single declarative rule: conditions → action."""

    model_config = ConfigDict(frozen=True)

    name: str
    conditions: dict[str, Any]
    action: dict[str, Any]

    def to_action(self) -> Action:
        """Parse the action dict into an Action."""
        return _parse_action(self.action)


class System(BaseModel):
    """A system of rules evaluated first-match-wins."""

    model_config = ConfigDict(frozen=True)

    name: str
    description: str = ""
    rules: list[Rule]

    def evaluate(
        self, state: HandState, registry: PredicateRegistry | None = None
    ) -> Any:
        """Evaluate rules in order. Returns Decision on first match, empty Decision if no match."""
        from app.poker.actions import Decision

        reg = registry if registry is not None else default_registry()
        for rule in self.rules:
            if evaluate_conditions(rule.conditions, state, reg):
                return Decision(action=rule.to_action(), matched_rule=rule.name)
        return Decision(action=None, matched_rule=None)


def _parse_action(action_dict: dict[str, Any]) -> Action:
    """Parse an action dict into an Action.

    The 'size' field is interpreted as:
    - float: pot fraction (Sizing.from_fraction)
    - int: absolute chips (Sizing.from_absolute)
    - str: keyword ('all-in', 'half-pot', 'pot', 'quarter-pot')
    """
    action_type_str = action_dict.get("type")
    if action_type_str is None:
        raise ValueError("Action dict must have a 'type' field")

    action_type = ActionType(action_type_str)
    size_raw = action_dict.get("size")

    if action_type.requires_size:
        if size_raw is None:
            raise ValueError(f"Action {action_type.value!r} requires a 'size' field")
        sizing = _parse_size(size_raw)
        return Action(type=action_type, size=sizing)

    if size_raw is not None:
        raise ValueError(f"Action {action_type.value!r} does not accept a 'size' field")

    return Action(type=action_type)


def _parse_size(size_raw: Any) -> Sizing:
    """Parse a size value into a Sizing."""
    if isinstance(size_raw, float):
        return Sizing.from_fraction(size_raw)
    if isinstance(size_raw, int):
        # bool is a subclass of int, but we don't expect bools in YAML size fields
        if isinstance(size_raw, bool):
            raise ValueError(f"Invalid size value: {size_raw!r}")
        return Sizing.from_absolute(size_raw)
    if isinstance(size_raw, str):
        keyword = size_raw.lower().strip().replace("-", "").replace("_", "")
        if keyword == "allin":
            return Sizing.all_in()
        if keyword in ("halfpot",):
            return Sizing.from_fraction(0.50)
        if keyword == "pot":
            return Sizing.from_fraction(1.0)
        if keyword in ("thirdpot",):
            return Sizing.from_fraction(0.33)
        if keyword in ("quarterpot",):
            return Sizing.from_fraction(0.25)
        if keyword in ("tworelthirdspot",):
            return Sizing.from_fraction(0.66)
        raise ValueError(f"Unknown size keyword: {size_raw!r}")
    raise ValueError(f"Invalid size value: {size_raw!r}")


def load_system(path: str | Path) -> System:
    """Load a System from a YAML file."""
    path = Path(path)
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    if not isinstance(data, dict):
        raise ValueError(f"YAML file {path} must contain a mapping at the top level")
    return System.model_validate(data)


def load_systems_dir(directory: str | Path) -> list[System]:
    """Load all *.yaml files from a directory, sorted alphabetically by filename."""
    directory = Path(directory)
    if not directory.is_dir():
        raise ValueError(f"Not a directory: {directory}")
    yaml_files = sorted(directory.glob("*.yaml"))
    return [load_system(f) for f in yaml_files]
