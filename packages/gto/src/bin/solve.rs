//! Solve an arbitrary postflop spot from the command line and dump the root
//! player's strategy in the range-data combo format.
//!
//! Money amounts are in chips (bb*100 recommended). Example — UTG opens 2.5bb,
//! BB calls, flop K-high on a 40bb stack:
//!
//! ```sh
//! cargo run --release -p gto --bin solve -- \
//!   --board Kh9s5c --pot 550 --stack 3750 \
//!   --oop-range "22+,A2s+,K5s+,Q8s+,J8s+,T8s+,97s+,87s,76s,65s,54s,AJo+,KJo+,QJo" \
//!   --ip-range "88+,ATs+,A5s-A4s,KTs+,QTs+,JTs,T9s,AJo+,KQo" \
//!   --bet-sizes "40%,e,a" --raise-sizes "2.5x"
//! ```

use gto::{build_game, dump_strategy, solve_game, SpotConfig};

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();

    let value = |name: &str| -> Option<String> {
        args.iter()
            .position(|a| a == name)
            .and_then(|i| args.get(i + 1))
            .cloned()
    };
    let flag = |name: &str| args.iter().any(|a| a == name);

    let board = value("--board").expect("--board is required");
    let oop_range = value("--oop-range").expect("--oop-range is required");
    let ip_range = value("--ip-range").expect("--ip-range is required");
    let pot: i32 = value("--pot")
        .expect("--pot is required")
        .parse()
        .expect("invalid --pot");
    let stack: i32 = value("--stack")
        .expect("--stack is required")
        .parse()
        .expect("invalid --stack");

    let bet_sizes = value("--bet-sizes").unwrap_or_else(|| "60%,e,a".to_string());
    let raise_sizes = value("--raise-sizes").unwrap_or_else(|| "2.5x".to_string());
    let max_iterations: u32 = value("--max-iterations")
        .unwrap_or_else(|| "1000".to_string())
        .parse()
        .expect("invalid --max-iterations");
    let target: f32 = value("--target")
        .unwrap_or_else(|| "0.005".to_string())
        .parse()
        .expect("invalid --target");
    let compressed = flag("--compressed");

    let cfg = SpotConfig::new(
        &oop_range,
        &ip_range,
        &board,
        pot,
        stack,
        &bet_sizes,
        &raise_sizes,
    );

    let mut game = build_game(&cfg);
    solve_game(&mut game, max_iterations, target, compressed);
    dump_strategy(&game, "root");
}
