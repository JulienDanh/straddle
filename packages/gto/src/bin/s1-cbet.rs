//! System 1 spot: UTG opens 2.5bb, BB calls, BB checks — Hero decides the
//! flop c-bet. Dumps the BB's flop strategy at the root, then walks the
//! check branch and dumps UTG's c-bet strategy.
//!
//! The ranges below are rough placeholders. Replace them with the stored
//! solution exports from `packages/design-system/src/data/ranges` (the
//! solver accepts the same weighted combo format, e.g. "AsAh:0.5,AcAd:1").
//! Edit the constants to explore other boards or stack depths.

use gto::{build_game, dump_strategy, solve_game, SpotConfig};
use postflop_solver::Action;

/// 40bb stacks, UTG raises to 2.5bb, SB folds, BB calls:
/// pot = 2.5 + 0.5 (SB) + 2.5 = 5.5bb; 37.5bb left behind.
const POT: i32 = 550;
const STACK: i32 = 3750;

/// Clean two-tone K-high flop — System 1's "bet top, bet bottom" bucket.
const BOARD: &str = "Kh9s5c";

/// Placeholder BB call-vs-UTG range (OOP).
const BB_RANGE: &str = "22+,A2s+,K5s+,Q8s+,J8s+,T8s+,97s+,87s,76s,65s,54s,AJo+,KJo+,QJo";
/// Placeholder UTG RFI range (IP).
const UTG_RANGE: &str = "88+,ATs+,A5s-A4s,KTs+,QTs+,JTs,T9s,AJo+,KQo";

/// System 1 default c-bet: ~40% pot.
const BET_SIZES: &str = "40%,e,a";
const RAISE_SIZES: &str = "2.5x";

fn main() {
    // Optional first argument: max iterations (default 1000). Low values give
    // a fast approximate solve for exploration.
    let max_iterations: u32 = std::env::args()
        .nth(1)
        .and_then(|s| s.parse().ok())
        .unwrap_or(1000);

    let cfg = SpotConfig::new(BB_RANGE, UTG_RANGE, BOARD, POT, STACK, BET_SIZES, RAISE_SIZES);

    let mut game = build_game(&cfg);
    solve_game(&mut game, max_iterations, 0.005, false);

    dump_strategy(&game, "BB");

    // Walk the check branch to see UTG's c-bet decision.
    let check = game
        .available_actions()
        .iter()
        .position(|a| matches!(a, Action::Check))
        .expect("BB can check");
    game.play(check);

    dump_strategy(&game, "UTG");
}
