.PHONY: start stop build dev test lint prod

# Dev: hot reload — backend uvicorn --reload, frontend Vite HMR
start:
	docker compose up --build -d

stop:
	docker compose down

build:
	docker compose build

# Production: nginx serves static SPA, proxies /api to backend
prod:
	docker compose -f docker-compose.prod.yml up --build -d

dev: stop
	cd backend && uv run uvicorn app.main:app --reload &
	cd frontend && pnpm dev

test:
	cd backend && uv run pytest -q

lint:
	cd backend && uv run ruff check src tests systems
	cd backend && uv run ty check src tests
	cd frontend && pnpm lint
