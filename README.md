# Straddle

A monorepo with a Python FastAPI backend and a React + TypeScript frontend.

## Layout

```
straddle/
├── backend/    Python FastAPI app (uv, ruff, ty, pytest)
└── frontend/   React + TypeScript app (Vite, pnpm)
```

## Backend

Python 3.12 managed by [uv](https://docs.astral.sh/uv/). Dependencies, lint, and type-check config live in `backend/pyproject.toml`.

### Run the dev server

```sh
cd backend
uv run uvicorn app.main:app --reload
```

The API is served at <http://localhost:8000>. Health check: <http://localhost:8000/health>.

### Tests

```sh
cd backend
uv run pytest
```

### Lint & type check

```sh
cd backend
uv run ruff check .
uv run ty check src tests
```

## Frontend

React + TypeScript scaffolded with [Vite](https://vite.dev/), packages managed with [pnpm](https://pnpm.io/).

### Run the dev server

```sh
cd frontend
pnpm dev
```

The dev server runs on <http://localhost:5173>. Requests to `/api/*` are proxied to the backend at <http://localhost:8000>, so the frontend can call the API via relative paths like `/api/health`.

### Build

```sh
cd frontend
pnpm run build
```

Output is written to `frontend/dist/`.

## Docker

### Dev (hot reload)

```sh
make start      # docker compose up -d (hot reload in containers)
make stop       # docker compose down
```

The frontend runs Vite with HMR at <http://localhost:5173> and the backend runs uvicorn with `--reload` at <http://localhost:8000>. Source directories are volume-mounted, so code changes reload instantly without rebuilding images.

### Production

```sh
make prod       # docker compose -f docker-compose.prod.yml up -d
```

The frontend is served as static files by nginx at <http://localhost:8080>, which proxies `/api/*` to the backend at <http://localhost:8000>.
