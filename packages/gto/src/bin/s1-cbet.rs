//! System 1 spot: UTG opens 2bb, BB calls, BB checks — Hero decides the
//! flop c-bet. Dumps the BB's flop strategy at the root, then walks the
//! check branch and dumps UTG's c-bet strategy.
//!
//! Preflop ranges are read directly from the shared JSON range store
//! (packages/ranges/data/), embedded at compile time via
//! include_str! — the same single source of truth the app renders.

use gto::{build_game, solve_game, strategy_text, SpotConfig};
use postflop_solver::Action;

/// 40bb stacks, UTG raises to 2bb, SB folds, BB calls:
/// pot = 2 + 0.5 (SB) + 2 = 4.5bb; 38bb left behind.
const POT: i32 = 450;
const STACK: i32 = 3800;

/// Clean two-tone K-high flop — System 1's "bet top, bet bottom" bucket.
const BOARD: &str = "Kh8h3c";

/// The shared range store — the single source of truth for all stored
/// ranges (the app's typed loaders read the same files).
const UTG_RFI_JSON: &str =
    include_str!("../../../ranges/data/utg-rfi-cev.json");
const BB_VS_UTG_JSON: &str =
    include_str!("../../../ranges/data/bb-vs-utg-cev.json");

/// Pull one stack depth's action string out of a stored-range JSON array.
fn stored_range(json: &str, stack: i32, action: &str) -> String {
    let entries: serde_json::Value = serde_json::from_str(json).expect("valid range JSON");
    entries
        .as_array()
        .expect("range store is an array")
        .iter()
        .find(|entry| entry["stack"].as_i64() == Some(stack as i64))
        .and_then(|entry| entry["actions"][action].as_str())
        .unwrap_or_else(|| panic!("stack {stack} has no {action} action"))
        .to_string()
}

/// BB call-vs-UTG range at 40bb (OOP), from the shared range store.
fn bb_range() -> String {
    stored_range(BB_VS_UTG_JSON, 40, "call")
}

/// UTG RFI range at 40bb (IP), from the shared range store.
fn utg_range() -> String {
    stored_range(UTG_RFI_JSON, 40, "raise")
}

/// System 1 default c-bet: ~40% pot (plus all-in when near the threshold).
const BET_SIZES: &str = "40%,a";
const RAISE_SIZES: &str = "2.5x";

fn main() {
    // Arguments: [max_iterations] [--board <cards>] [--out <path>]
    // [--compressed]. Low iteration counts give a fast approximate solve for
    // exploration (default 1000). With --out, both strategy dumps go to that
    // file instead of stdout.
    let args: Vec<String> = std::env::args().skip(1).collect();
    let arg_value = |name: &str| {
        args.iter()
            .position(|a| a == name)
            .and_then(|i| args.get(i + 1))
            .cloned()
    };
    let max_iterations: u32 = args
        .iter()
        .filter(|a| !a.starts_with("--"))
        .find_map(|s| s.parse().ok())
        .unwrap_or(1000);
    let out_path = arg_value("--out");
    let board = arg_value("--board").unwrap_or_else(|| BOARD.to_string());
    let compressed = args.iter().any(|a| a == "--compressed");

    let cfg = SpotConfig::new(
        &bb_range(),
        &utg_range(),
        &board,
        POT,
        STACK,
        BET_SIZES,
        RAISE_SIZES,
    );

    let mut game = build_game(&cfg);
    solve_game(&mut game, max_iterations, 0.005, compressed);

    let mut text = strategy_text(&game, "BB");

    // Walk the check branch to see UTG's c-bet decision.
    let check = game
        .available_actions()
        .iter()
        .position(|a| matches!(a, Action::Check))
        .expect("BB can check");
    game.play(check);

    text.push_str(&strategy_text(&game, "UTG"));

    match &out_path {
        Some(path) => {
            std::fs::write(path, text).expect("failed to write output file");
            println!("Strategies written to {path}");
        }
        None => print!("{text}"),
    }
}
