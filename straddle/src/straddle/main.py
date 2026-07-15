from fastapi import FastAPI
from slowapi import Limiter
from slowapi.util import get_remote_address

from .routes import router as solvers_router

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="straddle")
app.state.limiter = limiter


@app.get("/")
def root() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(solvers_router)
