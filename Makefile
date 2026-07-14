# straddle - Makefile

.PHONY: build test example docs clean

# --- Library (postflop_solver) ---
build:
	cd postflop_solver && maturin develop --release

# Run all tests
# Usage: make test [TEST_ARGS=...] (e.g., make test TEST_ARGS="-k test_strategy")
test:
	cd postflop_solver && pytest $(TEST_ARGS)

# Run the node locking example
example:
	cd postflop_solver && PYTHONPATH=python python3 examples/node_locking_demo.py

# Run the basic solver example
basic-example:
	cd postflop_solver && PYTHONPATH=python python3 examples/python_demo.py

# --- App (straddle) ---
# (Placeholder for future app commands)
app:
	@echo "App not yet implemented. Create straddle/ to get started."

# --- Clean ---
clean:
	find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete 2>/dev/null || true
	find . -name ".pytest_cache" -type d -exec rm -rf {} + 2>/dev/null || true
	rm -rf postflop_solver/target 2>/dev/null || true
	@echo "Cleaned Python bytecode, pytest cache, and Rust build artifacts."