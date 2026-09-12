//! HTTP API around the solver. POST /solve with a spot config, get the
//! node's strategy as JSON. POST body:
//!
//! {
//!   "board": "Kh8h3c",            // 3-5 card board
//!   "pot": 450,                   // chips (bb * 100)
//!   "stack": 3800,                // chips behind
//!   "oopRange": "AsAh:0.5,...",   // Pio-style or weighted combos
//!   "ipRange": "AA,KQs,...",
//!   "betSizes": "40%,a",          // optional, default "40%,a"
//!   "raiseSizes": "2.5x",         // optional, default "2.5x"
//!   "maxIterations": 200,        // optional, default 200
//!   "target": 0.005,              // optional, exploitability stop (pot fraction)
//!   "compressed": true,           // optional, 16-bit storage (halves memory)
//!   "path": ["check"]            // optional, walk after solving; strategy is
//!                                 // dumped at the last node of the path
//! }
//!
//! Response: { exploitability, player, position, path, actions: [{ label,
//! combos: { "AsAh": 0.5, ... } }] }. Frequencies are rounded to 4 decimals.
//!
//! Solves are serialized (one at a time — they need multi-GB RAM) and the
//! request blocks until done: minutes for real ranges. Invalid boards,
//! ranges, or paths return 400 with the panic message from the solver.

use axum::{
    extract::{DefaultBodyLimit, Json, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Router,
};
use gto::{build_game, play_path, solve_game, strategy_data, SpotConfig};
use postflop_solver::PostFlopGame;
use serde::{Deserialize, Serialize};
use std::panic::AssertUnwindSafe;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Deserialize)]
struct SolveRequest {
    board: String,
    pot: i32,
    stack: i32,
    #[serde(rename = "oopRange")]
    oop_range: String,
    #[serde(rename = "ipRange")]
    ip_range: String,
    #[serde(rename = "betSizes", default = "default_bet_sizes")]
    bet_sizes: String,
    #[serde(rename = "raiseSizes", default = "default_raise_sizes")]
    raise_sizes: String,
    #[serde(rename = "maxIterations", default = "default_iterations")]
    max_iterations: u32,
    #[serde(default = "default_target")]
    target: f32,
    #[serde(default)]
    compressed: bool,
    #[serde(default)]
    path: Vec<String>,
}

fn default_bet_sizes() -> String {
    "40%,a".to_string()
}
fn default_raise_sizes() -> String {
    "2.5x".to_string()
}
fn default_iterations() -> u32 {
    200
}
fn default_target() -> f32 {
    0.005
}

#[derive(Serialize)]
struct ActionOut {
    label: String,
    combos: std::collections::BTreeMap<String, f32>,
}

#[derive(Serialize)]
struct SolveResponse {
    exploitability: f32,
    player: usize,
    position: &'static str,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    path: Vec<String>,
    actions: Vec<ActionOut>,
}

/// One solve at a time — each takes multi-GB of RAM and all cores.
type Shared = Arc<Mutex<()>>;

async fn solve(State(lock): State<Shared>, Json(req): Json<SolveRequest>) -> Response {
    let _guard = lock.lock().await;
    let result = tokio::task::spawn_blocking(move || run_solve(req))
        .await
        .unwrap_or_else(|e| Err(format!("solve task failed: {e}")));
    match result {
        Ok(resp) => (StatusCode::OK, Json(resp)).into_response(),
        Err(msg) => (StatusCode::BAD_REQUEST, msg).into_response(),
    }
}

fn run_solve(req: SolveRequest) -> Result<SolveResponse, String> {
    // The solver signals bad input by panicking (Range/board parse); catch
    // those and surface them as 400s instead of killing the task.
    let outcome = std::panic::catch_unwind(AssertUnwindSafe(|| -> Result<(PostFlopGame, f32), String> {
        let cfg = SpotConfig::new(
            &req.oop_range,
            &req.ip_range,
            &req.board,
            req.pot,
            req.stack,
            &req.bet_sizes,
            &req.raise_sizes,
        );
        let mut game = build_game(&cfg);
        let exploitability = solve_game(&mut game, req.max_iterations, req.target, req.compressed);
        play_path(&mut game, &req.path)?;
        Ok((game, exploitability))
    }))
    .map_err(|p| panic_message(&p));

    let (game, exploitability) = outcome.and_then(|game| game)?;
    let (player, position, actions) = strategy_data(&game);

    Ok(SolveResponse {
        exploitability,
        player,
        position,
        path: req.path,
        actions: actions
            .into_iter()
            .map(|(label, combos)| {
                let map = combos
                    .into_iter()
                    .map(|(c, f)| (c, (f * 10000.0).round() / 10000.0))
                    .collect();
                ActionOut { label, combos: map }
            })
            .collect(),
    })
}

fn panic_message(payload: &Box<dyn std::any::Any + Send>) -> String {
    if let Some(s) = payload.downcast_ref::<&str>() {
        s.to_string()
    } else if let Some(s) = payload.downcast_ref::<String>() {
        s.clone()
    } else {
        "solver panicked (unknown cause)".to_string()
    }
}

async fn health() -> &'static str {
    "ok"
}

fn panic_hook_for_pretty_errors() {
    // Keep panics single-line: the hook that prints backtraces pollutes
    // stderr in a container; the message is returned to the client instead.
    std::panic::set_hook(Box::new(|info| {
        if let Some(payload) = info.payload().downcast_ref::<&str>() {
            eprintln!("solver panic: {payload}");
        } else if let Some(payload) = info.payload().downcast_ref::<String>() {
            eprintln!("solver panic: {payload}");
        }
    }));
}

#[tokio::main]
async fn main() {
    panic_hook_for_pretty_errors();

    let addr = std::env::var("GTO_ADDR").unwrap_or_else(|_| "0.0.0.0:8080".to_string());
    let app = Router::new()
        .route("/health", get(health))
        .route(
            "/solve",
            post(solve).layer(DefaultBodyLimit::max(8 * 1024 * 1024)),
        )
        .with_state(Arc::new(Mutex::new(())));

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("bind GTO_ADDR");
    println!("gto solver API listening on http://{addr} (POST /solve, GET /health)");
    axum::serve(listener, app)
        .await
        .expect("serve");
}
