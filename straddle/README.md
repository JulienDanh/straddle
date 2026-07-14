# straddle

The application. Built with FastAPI.

## Develop

```sh
uv sync
uv run uvicorn straddle.main:app --reload
```

## Test

```sh
uv run pytest
```

## Lint

```sh
uv run ruff check .
uv run ruff format .
```
