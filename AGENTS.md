# straddle — agent guide

## Monorepo layout

- `postflop_solver/` — solver library (Rust + PyO3 Python bindings). See [`postflop_solver/AGENTS.md`](postflop_solver/AGENTS.md) for build/test/import commands.
- `straddle/` — the application. _(Not yet created; scaffold when there's app code.)_

## Working in the library

```sh
cd postflop_solver
maturin develop --release   # rebuild Rust bindings
pytest                       # tests live in postflop_solver/tests/
```

The root has no build config of its own; all solver build/test commands run from `postflop_solver/`.

## When the app lands

Create `straddle/` with its own `pyproject.toml` (or equivalent) that depends on the `postflop_solver` package. Add a `straddle/AGENTS.md` at that point mirroring this structure.
