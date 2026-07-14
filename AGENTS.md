# straddle — agent guide

## Monorepo layout

- `postflop_solver/` — solver library (Rust + PyO3 Python bindings). See [`postflop_solver/AGENTS.md`](postflop_solver/AGENTS.md) for build/test/import commands.
- `straddle/` — the application (FastAPI backend + React/Vite frontend). See [`straddle/AGENTS.md`](straddle/AGENTS.md) for run/test/lint commands and architecture notes.

## Working in the library

```sh
cd postflop_solver
maturin develop --release   # rebuild Rust bindings
pytest                       # tests live in postflop_solver/tests/
```

The root has no build config of its own; all solver build/test commands run from `postflop_solver/`.

## Workflow

We track work in the [Straddle GitHub project](https://github.com/users/JulienDanh/projects/3). Every agent follows the same loop:

- **Long task → issue.** Anything beyond a trivial fix gets a GitHub issue *first*, written with enough context (problem, relevant files, acceptance criteria) that another agent could execute it. Add it to the project.
- **Issue → pull request.** Solve issues on a feature branch and open a PR — **never push straight to `main`**. Reference the issue with `Closes #N` in the PR body so it auto-closes on merge.
- **Keep the board honest.** Move an issue to "In Progress" when you start it and let it move to "Done" when the PR merges.

