"""FastAPI application entry point."""

from pathlib import Path

from fastapi import FastAPI

from app.models import (
    ActionResponse,
    BoardTextureResponse,
    ClassifyResponse,
    EvaluateRequest,
    EvaluateResponse,
    HealthResponse,
    SizingResponse,
    SystemSummary,
)
from app.poker.board import Board
from app.poker.board_texture import BoardAnalyzer
from app.poker.cards import Hand
from app.poker.hand_classification import HandClassifier
from app.poker.state import HandState, Position, PotType
from app.poker.system import System, load_systems_dir

SYSTEMS_DIR = Path(__file__).resolve().parent.parent.parent / "systems"

app = FastAPI(title="Straddle API")


def _load_systems() -> list[System]:
    """Load all rule systems from the systems directory."""
    if not SYSTEMS_DIR.is_dir():
        return []
    return load_systems_dir(SYSTEMS_DIR)


@app.get("/")
def root() -> dict[str, str]:
    """Root endpoint returning a simple greeting."""
    return {"message": "Straddle API"}


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(status="ok")


@app.get("/systems", response_model=list[SystemSummary])
def list_systems() -> list[SystemSummary]:
    """List all available rule systems."""
    systems = _load_systems()
    return [
        SystemSummary(name=s.name, description=s.description, rule_count=len(s.rules))
        for s in systems
    ]


@app.get("/classify", response_model=ClassifyResponse)
def classify(hand: str, board: str) -> ClassifyResponse:
    """Classify a hand + board combination."""
    parsed_hand = Hand.parse(hand)
    parsed_board = Board.parse(board)

    classification = HandClassifier.classify(parsed_hand, parsed_board)
    draws = [d.value for d in classification.draws]
    pair_rank: str | None = None
    if classification.pair_rank is not None:
        pair_rank = classification.pair_rank.label

    board_texture: BoardTextureResponse | None = None
    if not parsed_board.is_preflop:
        texture = BoardAnalyzer.analyze(parsed_board)
        board_texture = BoardTextureResponse(
            high_card=texture.high_card.value,
            suit_texture=texture.suit_texture.value,
            is_paired=texture.is_paired,
            is_trips=texture.is_trips,
            has_flush_draw=texture.has_flush_draw,
        )

    return ClassifyResponse(
        made_hand=classification.made_hand.value,
        draws=draws,
        is_top_pair=classification.is_top_pair,
        is_overpair=classification.is_overpair,
        pair_rank=pair_rank,
        board_texture=board_texture,
    )


@app.post("/evaluate", response_model=EvaluateResponse)
def evaluate(request: EvaluateRequest) -> EvaluateResponse:
    """Evaluate a hand state against a rule system."""
    parsed_hand = Hand.parse(request.hand)
    parsed_board = Board.parse(request.board)
    position = Position(request.position)
    pot_type: PotType | None = None
    if request.pot_type is not None:
        pot_type = PotType(request.pot_type)

    state = HandState(
        hand=parsed_hand,
        board=parsed_board,
        position=position,
        pot=request.pot,
        hero_stack=request.hero_stack,
        villain_stack=request.villain_stack,
        num_players=request.num_players,
        pot_type=pot_type,
    )

    systems = _load_systems()
    if not systems:
        return EvaluateResponse(action=None, matched_rule=None, has_decision=False)

    system = systems[0]
    if request.system_name is not None:
        for s in systems:
            if s.name == request.system_name:
                system = s
                break

    decision = system.evaluate(state)
    action_response: ActionResponse | None = None
    if decision.action is not None:
        sizing_response: SizingResponse | None = None
        if decision.action.size is not None:
            sizing_response = SizingResponse(
                type=decision.action.size.type.value,
                fraction=decision.action.size.fraction,
                absolute=decision.action.size.absolute,
                is_all_in=decision.action.size.is_all_in,
            )
        action_response = ActionResponse(
            type=decision.action.type.value,
            size=sizing_response,
        )

    return EvaluateResponse(
        action=action_response,
        matched_rule=decision.matched_rule,
        has_decision=decision.has_decision,
    )
