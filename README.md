# straddle

Monorepo for the **straddle** poker project.

## Layout

| Path | What |
|------|------|
| `postflop_solver/` | Python bindings for the [postflop-solver](https://github.com/JulienDanh/postflop-solver) Rust crate — the solver library. |
| `straddle/` | The application. _(Created when there's app code.)_ |

## The solver library

See [`postflop_solver/README.md`](postflop_solver/README.md) for the library API, installation, and usage. Quick start:

```sh
cd postflop_solver
maturin develop --release
pytest
```
