# straddle — agent guide

## Build & run

```sh
cd straddle
uv sync
uv run uvicorn straddle.main:app --reload
```

## Test

```sh
uv run pytest
```

## Lint / format

```sh
uv run ruff check .
uv run ruff format .
```

## Layout

- `src/straddle/main.py` — FastAPI app entry point.
- `tests/` — pytest tests.
