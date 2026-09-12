//! Solver tooling for the study-app range data.
//!
//! Wraps [postflop-solver](https://github.com/b-inary/postflop-solver) so a spot
//! can be solved and its strategies dumped in the combo:freq format used by
//! `packages/design-system/src/data/ranges` (e.g. `4c3c:0.0009,...`).
//!
//! Money amounts are integers in any unit. Using bb*100 keeps blind fractions
//! integral: a 40bb stack is `4000`, a 5.5bb pot is `550`.

use postflop_solver::*;

/// A postflop spot to solve.
pub struct SpotConfig {
    /// OOP range. Pio-style groups ("AA", "ATs+", "A9s-A6s") or weighted
    /// specific combos ("AsAh:0.5"), comma-separated.
    pub oop_range: String,
    /// IP range, same format as `oop_range`.
    pub ip_range: String,
    /// Board, 3-5 cards concatenated: "Kh9s5c", "Kh9s5cTd", "Kh9s5cTd2h".
    pub board: String,
    /// Pot at the start of the solved street.
    pub starting_pot: i32,
    /// Effective stack still behind at the start of the solved street.
    pub effective_stack: i32,
    /// Bet sizes for every street and both players, e.g. "40%,e,a".
    /// "e" = geometric, "a" = all-in.
    pub bet_sizes: String,
    /// Raise sizes, as a multiple of the previous bet (e.g. "2.5x").
    pub raise_sizes: String,
}

impl SpotConfig {
    pub fn new(
        oop_range: &str,
        ip_range: &str,
        board: &str,
        starting_pot: i32,
        effective_stack: i32,
        bet_sizes: &str,
        raise_sizes: &str,
    ) -> Self {
        Self {
            oop_range: oop_range.to_string(),
            ip_range: ip_range.to_string(),
            board: board.to_string(),
            starting_pot,
            effective_stack,
            bet_sizes: bet_sizes.to_string(),
            raise_sizes: raise_sizes.to_string(),
        }
    }
}

/// Build the game tree for a spot without solving it.
pub fn build_game(cfg: &SpotConfig) -> PostFlopGame {
    let n = cfg.board.len();
    if !(n == 6 || n == 8 || n == 10) {
        panic!("board must have 3, 4, or 5 cards (got {})", n / 2);
    }
    let (flop, turn, river, initial_state) = match n {
        6 => (
            flop_from_str(&cfg.board).unwrap(),
            NOT_DEALT,
            NOT_DEALT,
            BoardState::Flop,
        ),
        8 => (
            flop_from_str(&cfg.board[..6]).unwrap(),
            card_from_str(&cfg.board[6..8]).unwrap(),
            NOT_DEALT,
            BoardState::Turn,
        ),
        _ => (
            flop_from_str(&cfg.board[..6]).unwrap(),
            card_from_str(&cfg.board[6..8]).unwrap(),
            card_from_str(&cfg.board[8..10]).unwrap(),
            BoardState::River,
        ),
    };

    let card_config = CardConfig {
        range: [
            cfg.oop_range.parse().expect("invalid OOP range"),
            cfg.ip_range.parse().expect("invalid IP range"),
        ],
        flop,
        turn,
        river,
    };

    let bet_sizes =
        BetSizeOptions::try_from((cfg.bet_sizes.as_str(), cfg.raise_sizes.as_str()))
            .expect("invalid bet sizes");

    let tree_config = TreeConfig {
        initial_state,
        starting_pot: cfg.starting_pot,
        effective_stack: cfg.effective_stack,
        rake_rate: 0.0,
        rake_cap: 0.0,
        flop_bet_sizes: [bet_sizes.clone(), bet_sizes.clone()],
        turn_bet_sizes: [bet_sizes.clone(), bet_sizes.clone()],
        river_bet_sizes: [bet_sizes.clone(), bet_sizes],
        turn_donk_sizes: None,
        river_donk_sizes: None,
        add_allin_threshold: 1.5,
        force_allin_threshold: 0.15,
        merging_threshold: 0.1,
    };

    let action_tree = ActionTree::new(tree_config).expect("invalid tree config");
    PostFlopGame::with_config(card_config, action_tree).expect("invalid card config")
}

/// Allocate memory and solve, stopping at `max_iterations` or once the
/// exploitability drops to `target_pot_fraction` of the starting pot.
/// Returns the exploitability reached. Use `compressed` to halve memory
/// usage at the cost of precision (16-bit storage).
pub fn solve_game(
    game: &mut PostFlopGame,
    max_iterations: u32,
    target_pot_fraction: f32,
    compressed: bool,
) -> f32 {
    let (mem, mem_compressed) = game.memory_usage();
    let (mem, unit) = if compressed {
        (mem_compressed, "16-bit int")
    } else {
        (mem, "32-bit float")
    };
    println!(
        "Memory usage ({}): {:.2}GB",
        unit,
        mem as f64 / (1024.0 * 1024.0 * 1024.0)
    );

    game.allocate_memory(compressed);

    let target = game.tree_config().starting_pot as f32 * target_pot_fraction;
    let exploitability = solve(game, max_iterations, target, true);
    println!("\nExploitability: {:.4}", exploitability);
    exploitability
}

/// Lowercase action label for the range-data keys. Bet and raise sizes are
/// suffixed so distinct sizings stay distinct ("bet220", "raise550").
pub fn action_label(action: &Action) -> String {
    match action {
        Action::Fold => "fold".to_string(),
        Action::Check => "check".to_string(),
        Action::Call => "call".to_string(),
        Action::Bet(amount) => format!("bet{amount}"),
        Action::Raise(amount) => format!("raise{amount}"),
        Action::AllIn(_) => "allIn".to_string(),
        _ => unreachable!("chance action in a decision node"),
    }
}

/// Build the current node's strategy as text: a header naming the acting
/// player and available actions, then one paste-ready line per action:
/// `check 4c3c:0.0009,...`.
pub fn strategy_text(game: &PostFlopGame, player_name: &str) -> String {
    let actions = game.available_actions();
    let player = game.current_player();
    let position = if player == 0 { "OOP" } else { "IP" };
    let names = holes_to_strings(game.private_cards(player)).expect("hole cards");
    let strategy = game.strategy();

    let mut text = format!("\n# {player_name} ({position}): {actions:?}\n");

    let num_hands = names.len();
    for (i, action) in actions.iter().enumerate() {
        let combos: Vec<String> = (0..num_hands)
            .map(|h| format!("{}:{:.4}", names[h], strategy[i * num_hands + h]))
            .collect();
        text.push_str(&format!("{} {}\n", action_label(action), combos.join(",")));
    }
    text
}

/// Structured strategy at the current node: (player index, position, one
/// entry per action with per-combo frequencies). The server's JSON response
/// is built from this.
pub fn strategy_data(
    game: &PostFlopGame,
) -> (usize, &'static str, Vec<(String, Vec<(String, f32)>)>) {
    let actions = game.available_actions();
    let player = game.current_player();
    let position = if player == 0 { "OOP" } else { "IP" };
    let names = holes_to_strings(game.private_cards(player)).expect("hole cards");
    let strategy = game.strategy();

    let num_hands = names.len();
    let mut out = Vec::new();
    for (i, action) in actions.iter().enumerate() {
        let combos = (0..num_hands)
            .map(|h| (names[h].clone(), strategy[i * num_hands + h]))
            .collect();
        out.push((action_label(action), combos));
    }
    (player, position, out)
}

/// Walk an action path by label (e.g. "check", "bet180") after solving,
/// landing on the node whose strategy should be returned.
pub fn play_path(game: &mut PostFlopGame, path: &[String]) -> Result<(), String> {
    for label in path {
        let index = game
            .available_actions()
            .iter()
            .position(|a| action_label(a) == *label)
            .ok_or_else(|| {
                format!(
                    "action {label:?} not available here (have {:?})",
                    game.available_actions()
                        .iter()
                        .map(action_label)
                        .collect::<Vec<_>>()
                )
            })?;
        game.play(index);
    }
    Ok(())
}

