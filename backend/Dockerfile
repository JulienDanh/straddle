FROM python:3.12-slim

WORKDIR /app

# Install uv
RUN pip install --no-cache-dir uv

# Copy dependency files first for layer caching
COPY pyproject.toml uv.lock .python-version ./

# Install third-party dependencies only (skip building the project itself)
RUN uv sync --frozen --no-dev --no-install-project

# Copy application source and rule systems
COPY src/ src/
COPY systems/ systems/

# Install the project itself
RUN uv sync --frozen --no-dev

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--reload-dir", "src"]
