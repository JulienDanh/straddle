# postflop-solver-python — agent guide

## Build & install (dev)

```sh
maturin develop --release
```

Rebuilds the Rust bindings; the native extension lands in `python/postflop_solver/_core*.abi3.so`. The `.so` is committed-free and built on demand; rebuild after any change to `src/lib.rs`.

## Run tests

```sh
pytest
```

The root `conftest.py` prepends `python/` to `sys.path`, so no env var is needed. Tests use the prebuilt `_core.abi3.so`; rebuild via `maturin develop` if you change Rust. Dev deps: `pip install -e ".[dev]"` (installs pytest).

## Import without install

```sh
PYTHONPATH=python python3 -c "import postflop_solver"
```

The package is not pip-installed by default; `maturin develop` or the `PYTHONPATH` both work.

## Docs

```sh
./scripts/gen_docs.sh     # pdoc -> docs/python/
```

## Lint / typecheck

None configured yet.

## Layout

- `src/lib.rs` — PyO3 bindings exposing `PostFlopGame` as `postflop_solver._core.PostFlopGame`.
- `python/postflop_solver/api.py` — the friendly `Solver` class + three private helpers (`_match_action`, `_player_idx`, `_int_to_card_str`). One cohesive class; do not split.
- `tests/test_api.py` — pytest, hits the public `Solver` API plus the helpers.

## Upstream

The Rust solver comes from the `postflop-solver` crate (git dep in `Cargo.toml`). Python is only the call boundary.
