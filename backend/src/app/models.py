"""Pydantic models for the backend API."""

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Response model for the health check endpoint."""

    status: str


class EvaluateRequest(BaseModel):
    """Request body for the /evaluate endpoint."""

    hand: str
    board: str
    position: str = "BTN"
    pot: float = 10.0
    hero_stack: float = 90.0
    villain_stack: float = 90.0
    num_players: int = 2
    pot_type: str | None = "single-raised"
    system_name: str | None = None
    villain_position: str | None = None
    # When true, evaluate against every loaded system and return an
    # EvaluateAllResponse (a decision per system); system_name is ignored.
    all_systems: bool = False


class SizingResponse(BaseModel):
    """JSON-serializable sizing."""

    type: str
    fraction: float | None = None
    absolute: int | None = None
    is_all_in: bool | None = None


class ActionResponse(BaseModel):
    """JSON-serializable action."""

    type: str
    size: SizingResponse | None = None


class EvaluateResponse(BaseModel):
    """Response for the /evaluate endpoint (single-system mode)."""

    action: ActionResponse | None = None
    matched_rule: str | None = None
    has_decision: bool


class SystemDecision(BaseModel):
    """One system's verdict on a hand state."""

    system_name: str
    action: ActionResponse | None = None
    matched_rule: str | None = None
    has_decision: bool


class EvaluateAllResponse(BaseModel):
    """Response for the /evaluate endpoint when all_systems=True.

    One decision per loaded system, in load order (alphabetical by file).
    """

    decisions: list[SystemDecision]


class BoardTextureResponse(BaseModel):
    """JSON-serializable board texture."""

    high_card: str
    suit_texture: str
    is_paired: bool
    is_trips: bool
    has_flush_draw: bool


class ClassifyResponse(BaseModel):
    """Response for the /classify endpoint."""

    made_hand: str
    draws: list[str]
    is_top_pair: bool
    is_overpair: bool
    pair_rank: str | None = None
    board_texture: BoardTextureResponse | None = None


class SystemSummary(BaseModel):
    """Summary of a rule system."""

    name: str
    description: str
    rule_count: int


class RuleResponse(BaseModel):
    """A single rule in a system, for visualization."""

    name: str
    conditions: dict[str, object]
    action: dict[str, object]


class SystemDetailResponse(BaseModel):
    """A system with its full rule list, for rule visualization."""

    name: str
    description: str
    rules: list[RuleResponse]
