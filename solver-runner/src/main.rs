//! solver-runner: run the postflop-solver crate from a JSON spot config.
//!
//! Usage:
//!   solver-runner --config <spot.json> [--out <result.json>] [--save <game.bin>] [--info]
//!
//! The spot config describes the board, pot/stack, ranges (PioSOLVER-style
//! strings, with optional weights — the range store's combo:freq strings parse
//! directly), and bet sizes per street. After solving, the root strategy is
//! dumped as class:freq strings per action (the range store / RangeGrid copy
//! format) plus per-hand equity/EV.

use postflop_solver::*;
use serde::Deserialize;
use std::collections::BTreeMap;
use std::fs;
use std::process::ExitCode;

const RANKS: [char; 13] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

#[derive(Deserialize)]
struct SpotConfig {
    /// Board cards, 2 chars each: 3 cards = flop, 4 = turn, 5 = river.
    board: String,
    /// Pot size at the initial street (bb, fractional ok).
    pot: f64,
    /// Effective stack behind at the initial street (bb, fractional ok).
    effective_stack: f64,
    /// [rake_rate, rake_cap]
    #[serde(default)]
    rake: [f64; 2],
    ranges: RangesSpec,
    bet_sizes: StreetsSpec,
    #[serde(default)]
    donk_sizes: DonkSpec,
    #[serde(default = "default_add_allin")]
    add_allin_threshold: f64,
    #[serde(default = "default_force_allin")]
    force_allin_threshold: f64,
    #[serde(default = "default_merging")]
    merging_threshold: f64,
    #[serde(default)]
    solve: SolveSpec,
}

#[derive(Deserialize)]
struct RangesSpec {
    /// Out of position player.
    oop: String,
    /// In position player.
    ip: String,
}

/// Bet sizes per street, per player: [first-bet sizes, raise sizes].
#[derive(Deserialize)]
struct StreetsSpec {
    flop: SideSpec,
    turn: SideSpec,
    river: SideSpec,
}

#[derive(Deserialize)]
struct SideSpec {
    oop: [String; 2],
    ip: [String; 2],
}

#[derive(Deserialize, Default)]
#[serde(default)]
struct DonkSpec {
    turn: Option<String>,
    river: Option<String>,
}

#[derive(Deserialize)]
#[serde(default)]
struct SolveSpec {
    /// Cap on CFR iterations.
    max_iterations: u32,
    /// Stop early when exploitability falls below this % of the pot.
    target_exploitability_pct_pot: f32,
    /// Store the tree as 16-bit integers (slower, less memory).
    compressed: bool,
    /// Print solver progress to stderr.
    print_progress: bool,
}

impl Default for SolveSpec {
    fn default() -> Self {
        Self {
            max_iterations: 1000,
            target_exploitability_pct_pot: 0.5,
            compressed: false,
            print_progress: true,
        }
    }
}

fn default_add_allin() -> f64 {
    1.5
}
fn default_force_allin() -> f64 {
    0.15
}
fn default_merging() -> f64 {
    0.1
}

fn main() -> ExitCode {
    let mut config_path: Option<String> = None;
    let mut out_path: Option<String> = None;
    let mut save_path: Option<String> = None;
    let mut info_only = false;

    let mut args = std::env::args().skip(1);
    while let Some(arg) = args.next() {
        match arg.as_str() {
            "--config" => config_path = Some(expect_value(&mut args, "--config")),
            "--out" => out_path = Some(expect_value(&mut args, "--out")),
            "--save" => save_path = Some(expect_value(&mut args, "--save")),
            "--info" => info_only = true,
            other => {
                eprintln!("Unknown argument: {other}");
                print_usage();
                return ExitCode::from(2);
            }
        }
    }

    let Some(config_path) = config_path else {
        print_usage();
        return ExitCode::from(2);
    };

    let raw = match fs::read_to_string(&config_path) {
        Ok(raw) => raw,
        Err(err) => {
            eprintln!("Failed to read {config_path}: {err}");
            return ExitCode::FAILURE;
        }
    };
    let config: SpotConfig = match serde_json::from_str(&raw) {
        Ok(config) => config,
        Err(err) => {
            eprintln!("Failed to parse {config_path}: {err}");
            return ExitCode::FAILURE;
        }
    };

    if let Err(err) = run(&config, out_path.as_deref(), save_path.as_deref(), info_only) {
        eprintln!("Error: {err}");
        return ExitCode::FAILURE;
    }
    ExitCode::SUCCESS
}

fn print_usage() {
    eprintln!(
        "Usage: solver-runner --config <spot.json> [--out <result.json>] [--save <game.bin>] [--info]"
    );
}

fn expect_value(args: &mut impl Iterator<Item = String>, flag: &str) -> String {
    args.next()
        .unwrap_or_else(|| panic!("{flag} requires a value"))
}

fn run(
    config: &SpotConfig,
    out_path: Option<&str>,
    save_path: Option<&str>,
    info_only: bool,
) -> Result<(), String> {
    // The solver works in integer amounts. Find the smallest unit that keeps
    // pot and stack exact (down to 1/100 bb), then report amounts in bb.
    const SCALE_CANDIDATES: [f64; 8] = [1.0, 2.0, 4.0, 5.0, 10.0, 20.0, 50.0, 100.0];
    let scale = SCALE_CANDIDATES
        .iter()
        .copied()
        .find(|&s| {
            (config.pot * s).fract().abs() < 1e-9
                && (config.effective_stack * s).fract().abs() < 1e-9
        })
        .ok_or_else(|| {
            format!(
                "pot {} / effective_stack {} need finer than 1/100 bb units",
                config.pot, config.effective_stack
            )
        })?;
    let scale_i32 = |v: f64, name: &str| -> Result<i32, String> {
        let scaled = v * scale;
        if (scaled - scaled.round()).abs() > 1e-6 {
            return Err(format!("{name} {v} does not scale to an integer"));
        }
        Ok(scaled.round() as i32)
    };
    let pot = scale_i32(config.pot, "pot")?;
    let effective_stack = scale_i32(config.effective_stack, "effective_stack")?;

    let cards = parse_board(&config.board)?;
    let (initial_state, flop, turn, river) = match cards.len() {
        3 => (
            BoardState::Flop,
            [cards[0], cards[1], cards[2]],
            NOT_DEALT,
            NOT_DEALT,
        ),
        4 => (
            BoardState::Turn,
            [cards[0], cards[1], cards[2]],
            cards[3],
            NOT_DEALT,
        ),
        5 => (
            BoardState::River,
            [cards[0], cards[1], cards[2]],
            cards[3],
            cards[4],
        ),
        n => return Err(format!("Board must have 3-5 cards, got {n}")),
    };

    let oop_range: Range = config
        .ranges
        .oop
        .parse()
        .map_err(|_| "Failed to parse OOP range")?;
    let ip_range: Range = config
        .ranges
        .ip
        .parse()
        .map_err(|_| "Failed to parse IP range")?;

    let card_config = CardConfig {
        range: [oop_range, ip_range],
        flop,
        turn,
        river,
    };

    let parse_side = |side: &SideSpec| -> Result<[BetSizeOptions; 2], String> {
        let oop = BetSizeOptions::try_from((
            side.oop[0].as_str(),
            side.oop[1].as_str(),
        ))
        .map_err(|e| format!("Invalid OOP bet sizes: {e}"))?;
        let ip = BetSizeOptions::try_from((
            side.ip[0].as_str(),
            side.ip[1].as_str(),
        ))
        .map_err(|e| format!("Invalid IP bet sizes: {e}"))?;
        Ok([oop, ip])
    };

    let tree_config = TreeConfig {
        initial_state,
        starting_pot: pot,
        effective_stack,
        rake_rate: config.rake[0],
        rake_cap: config.rake[1] * scale,
        flop_bet_sizes: parse_side(&config.bet_sizes.flop)?,
        turn_bet_sizes: parse_side(&config.bet_sizes.turn)?,
        river_bet_sizes: parse_side(&config.bet_sizes.river)?,
        turn_donk_sizes: donk_options(&config.donk_sizes.turn)?,
        river_donk_sizes: donk_options(&config.donk_sizes.river)?,
        add_allin_threshold: config.add_allin_threshold,
        force_allin_threshold: config.force_allin_threshold,
        merging_threshold: config.merging_threshold,
    };

    let action_tree = ActionTree::new(tree_config).map_err(|e| format!("Invalid tree: {e}"))?;
    let mut game = PostFlopGame::with_config(card_config, action_tree)
        .map_err(|e| format!("Invalid card config: {e}"))?;

    let (mem, mem_compressed) = game.memory_usage();
    eprintln!(
        "Memory usage: {:.2}GB ({:.2}GB compressed)",
        mem as f64 / 1e9,
        mem_compressed as f64 / 1e9
    );

    if info_only {
        return Ok(());
    }

    game.allocate_memory(config.solve.compressed);
    let target = pot as f32 * config.solve.target_exploitability_pct_pot / 100.0;
    let exploitability = solve(
        &mut game,
        config.solve.max_iterations,
        target,
        config.solve.print_progress,
    );
    eprintln!(
        "Exploitability: {:.4}bb ({:.3}% of pot)",
        exploitability as f64 / scale,
        100.0 * exploitability / pot as f32
    );

    if let Some(path) = save_path {
        save_data_to_file(&game, "solver-runner", path, None)
            .map_err(|e| format!("Failed to save game tree: {e}"))?;
        eprintln!("Saved solved tree to {path}");
    }

    // Root state: OOP acts first on flop/turn, IP on river.
    let root_player = match initial_state {
        BoardState::River => 1,
        _ => 0,
    };
    let root_player_label = if root_player == 0 { "oop" } else { "ip" };

    game.cache_normalized_weights();

    let actions: Vec<String> = game
        .available_actions()
        .iter()
        .map(|a| rescale_action(&format!("{a:?}"), scale))
        .collect();
    let strategy = game.strategy();
    let root_cards = game.private_cards(root_player);
    let num_hands = root_cards.len();

    // Per-action class:freq strings, averaged over the combos present per class.
    let mut strategy_by_action = serde_json::Map::new();
    for (ai, action) in actions.iter().enumerate() {
        let mut sum: BTreeMap<(u8, u8, u8), (f32, u32)> = BTreeMap::new();
        for (hi, &(c1, c2)) in root_cards.iter().enumerate() {
            let freq = strategy[hi + ai * num_hands];
            let key = class_key(c1, c2);
            let entry = sum.entry(key).or_insert((0.0, 0));
            entry.0 += freq;
            entry.1 += 1;
        }
        let classes: Vec<String> = sum
            .iter()
            .map(|(key, &(total, count))| {
                format!("{}:{:.4}", class_label(key), total / count as f32)
            })
            .collect();
        strategy_by_action.insert(
            action.clone(),
            serde_json::Value::String(classes.join(",")),
        );
    }

    let per_player = |player: usize| -> Result<serde_json::Value, String> {
        let hands = holes_to_strings(game.private_cards(player))
            .map_err(|e| format!("Failed to format hole cards: {e}"))?;
        let ev: Vec<f64> = game
            .expected_values(player)
            .iter()
            .map(|&v| v as f64 / scale)
            .collect();
        Ok(serde_json::json!({
            "hands": hands,
            "equity": game.equity(player),
            "ev": ev,
            "avg_equity": compute_average(&game.equity(player), game.normalized_weights(player)),
            "avg_ev": compute_average(&game.expected_values(player), game.normalized_weights(player)) as f64 / scale,
        }))
    };

    let root_hands = holes_to_strings(root_cards)
        .map_err(|e| format!("Failed to format hole cards: {e}"))?;

    let result = serde_json::json!({
        "board": config.board,
        "pot": config.pot,
        "effective_stack": config.effective_stack,
        "units": "bb",
        "exploitability": exploitability as f64 / scale,
        "exploitability_pct_pot": 100.0 * exploitability / pot as f32,
        "root": {
            "player": root_player_label,
            "actions": actions,
            "strategy_by_action": strategy_by_action,
            "hands": root_hands,
            "strategy": strategy,
            "oop": per_player(0)?,
            "ip": per_player(1)?,
        },
    });

    let pretty = serde_json::to_string_pretty(&result).map_err(|e| e.to_string())?;
    match out_path {
        Some(path) => {
            fs::write(path, pretty).map_err(|e| format!("Failed to write {path}: {e}"))?;
            eprintln!("Wrote results to {path}");
        }
        None => println!("{pretty}"),
    }
    Ok(())
}

/// Convert a solver action's Debug label (e.g. "Bet(120)") back to bb units.
fn rescale_action(label: &str, scale: f64) -> String {
    if let Some(open) = label.rfind('(') {
        if let Some(close) = label.rfind(')') {
            if let Ok(n) = label[open + 1..close].parse::<i32>() {
                let v = n as f64 / scale;
                let amount = if v.fract() == 0.0 {
                    format!("{}", v as i64)
                } else {
                    format!("{v}")
                };
                return format!("{}({})", &label[..open], amount);
            }
        }
    }
    label.to_string()
}

fn parse_board(board: &str) -> Result<Vec<u8>, String> {
    let board = board.trim();
    if board.len() % 2 != 0 {
        return Err(format!("Board must be pairs of chars: {board}"));
    }
    let mut cards = Vec::with_capacity(5);
    for chunk in board.as_bytes().chunks(2) {
        let s = std::str::from_utf8(chunk).map_err(|_| "Board must be UTF-8".to_string())?;
        cards.push(card_from_str(s).map_err(|_| format!("Invalid card: {s}"))?);
    }
    if board.len() >= 4 {
        let mut all = cards.clone();
        all.sort_unstable();
        all.dedup();
        if all.len() != cards.len() {
            return Err("Board cards must be unique".to_string());
        }
    }
    Ok(cards)
}

fn donk_options(spec: &Option<String>) -> Result<Option<DonkSizeOptions>, String> {
    match spec {
        Some(s) => DonkSizeOptions::try_from(s.as_str())
            .map(Some)
            .map_err(|e| format!("Invalid donk sizes: {e}")),
        None => Ok(None),
    }
}

/// Sort key for a hand class: (high rank, low rank, pair=0 < suited=1 < offsuit=2).
fn class_key(c1: u8, c2: u8) -> (u8, u8, u8) {
    let (r1, s1) = (c1 / 4, c1 % 4);
    let (r2, s2) = (c2 / 4, c2 % 4);
    let (hi, lo) = if r1 >= r2 { (r1, r2) } else { (r2, r1) };
    let suit_class = if hi == lo {
        0
    } else if s1 == s2 {
        1
    } else {
        2
    };
    (hi, lo, suit_class)
}

fn class_label(&(hi, lo, suit_class): &(u8, u8, u8)) -> String {
    match suit_class {
        0 => format!("{}{}", RANKS[hi as usize], RANKS[hi as usize]),
        1 => format!("{}{}s", RANKS[hi as usize], RANKS[lo as usize]),
        _ => format!("{}{}o", RANKS[hi as usize], RANKS[lo as usize]),
    }
}
