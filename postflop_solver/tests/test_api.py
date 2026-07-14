import pytest

from postflop_solver import Solver
from postflop_solver.api import _int_to_card_str, _match_action


def _player_idx(player, solver):
    if player is None:
        return solver._g.current_player()
    p = player.strip().lower()
    if p in ("oop", "0"):
        return 0
    if p in ("ip", "1"):
        return 1
    raise ValueError(f"Player must be 'oop' or 'ip', got '{player}'")

_OOP_RANGE = "66+,A8s+,AJo+"
_IP_RANGE = "QQ-22,ATo+"
_BOARD = "Td9d6hQc"


def _make_solver(oop_range=_OOP_RANGE, ip_range=_IP_RANGE, board=_BOARD):
    return Solver(
        oop_range=oop_range,
        ip_range=ip_range,
        board=board,
        starting_pot=200,
        effective_stack=900,
        bet_sizes="60%, e, a",
        raise_sizes="2.5x",
    )


def _cards(board):
    return [board[i : i + 2] for i in range(0, len(board), 2)]


@pytest.fixture
def solved():
    s = _make_solver()
    s.solve(iterations=20)
    return s


def _round_trip_card(c):
    ranks = "23456789TJQKA"
    suits = "cdhs"
    return ranks.index(c[0]) * 4 + suits.index(c[1])


def test_int_to_card_str_round_trip():
    for idx in range(52):
        assert _int_to_card_str(idx) == _int_to_card_str(idx)
        assert _round_trip_card(_int_to_card_str(idx)) == idx
    assert _int_to_card_str(0) == "2c"
    assert _int_to_card_str(51) == "As"
    assert _int_to_card_str(_round_trip_card("Td")) == "Td"
    assert _int_to_card_str(_round_trip_card("8s")) == "8s"


def test_match_action_exact_substring_miss():
    actions = ["Check", "Bet(120)", "AllIn(900)"]
    assert _match_action("Bet(120)", actions) == 1
    assert _match_action("bet", actions) == 1
    assert _match_action("check", actions) == 0
    assert _match_action("CHECK", actions) == 0
    assert _match_action("fold", actions) is None


def test_player_idx_valid_and_invalid():
    s = _make_solver()
    assert _player_idx("oop", s) == 0
    assert _player_idx("ip", s) == 1
    assert _player_idx("0", s) == 0
    assert _player_idx("1", s) == 1
    assert _player_idx(None, s) == s._g.current_player()
    with pytest.raises(ValueError):
        _player_idx("utg", s)


def test_board_validation_too_few():
    with pytest.raises(ValueError):
        _make_solver(board="Td9")


def test_board_validation_too_many():
    with pytest.raises(ValueError):
        _make_solver(board="Td9d6hQc2d3s4c")


def test_construct_and_solve_smoke(solved):
    assert solved.is_solved is True
    actions = solved.available_actions()
    assert isinstance(actions, list) and len(actions) > 0
    assert solved.current_player() in ("oop", "ip")
    board = solved.current_board()
    assert set(_cards(board)) == set(_cards(_BOARD))
    assert len(board) == len(_BOARD)
    assert solved.history() == []


def test_strategy_shape(solved):
    strat = solved.strategy()
    assert isinstance(strat, dict) and len(strat) > 0
    assert len(strat) == solved.num_hands(solved.current_player())
    for hand, freqs in strat.items():
        assert len(hand) == 4
        assert set(freqs.keys()).issubset(set(solved.available_actions()))
        assert sum(freqs.values()) == pytest.approx(1.0, abs=0.05)


def test_average_equity_range(solved):
    eq_oop = solved.average_equity("oop")
    eq_ip = solved.average_equity("ip")
    assert 0.0 <= eq_oop <= 1.0
    assert 0.0 <= eq_ip <= 1.0
    assert eq_oop + eq_ip == pytest.approx(1.0, abs=0.05)


def test_range_percentages_sum(solved):
    rp = solved.range_percentages("oop")
    assert all(0.0 <= v <= 100.0 for v in rp.values())
    assert sum(rp.values()) == pytest.approx(100.0, abs=0.5)


def test_play_and_back_to_root(solved):
    assert solved.history() == []
    action = solved.available_actions()[0]
    solved.play(action)
    assert len(solved.history()) == 1
    solved.back_to_root()
    assert solved.history() == []


def test_private_cards_distinct(solved):
    pc = solved.private_cards("oop")
    assert all(len(h) == 4 for h in pc)
    assert len(pc) == len(set(pc))
    assert len(pc) == solved.num_hands("oop")


def test_repr_contains_board(solved):
    assert solved.current_board() in repr(solved)
