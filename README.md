# postflop-solver-python

Python bindings for [postflop-solver](https://github.com/nsyt/postflop-solver), an open-source Texas hold'em postflop poker solver.

## Installation

```sh
pip install maturin
maturin develop --release
```

Or from the wheel:

```sh
pip install postflop-solver
```

## Usage

```python
from postflop_solver import Solver

s = Solver(
    oop_range="66+,A8s+,AJo+",
    ip_range="QQ-22,ATo+",
    board="Td9d6hQc",
    starting_pot=200,
    effective_stack=900,
    bet_sizes="60%, e, a",
    raise_sizes="2.5x",
)

s.allocate_memory()
s.solve(iterations=1000, verbose=True)

# Dict-based results: {hand: {action: freq}}
print(s.strategy())
print(s.average_equity("oop"))
print(s.average_ev("oop"))
```

## Node locking

```python
s.play("Bet(120)")  # navigate to IP's response
s.lock_strategy({"AhKh": {"Fold": 0.9, "Call": 0.1}})  # lock specific hands
s.back_to_root()
s.solve(iterations=1000)  # OOP's max-exploit strategy
```

## Docs

```sh
./scripts/gen_docs.sh
open docs/python/index.html
```

## Architecture

- `src/lib.rs` — PyO3 bindings wrapping `PostFlopGame` as a Python class
- `python/postflop_solver/api.py` — Friendly `Solver` class with dict-based API
- `python/postflop_solver/__init__.py` — Package entry point

The Rust solver runs at native speed. Python is only the call boundary.
