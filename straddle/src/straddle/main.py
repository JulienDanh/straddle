from fastapi import FastAPI

from .routes import router as solvers_router

app = FastAPI(title="straddle")


@app.get("/")
def root() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(solvers_router)
