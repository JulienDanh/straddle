"""FastAPI application entry point."""

from fastapi import FastAPI

from app.models import HealthResponse

app = FastAPI(title="Straddle API")


@app.get("/")
def root() -> dict[str, str]:
    """Root endpoint returning a simple greeting."""
    return {"message": "Straddle API"}


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(status="ok")
