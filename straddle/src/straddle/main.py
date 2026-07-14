from fastapi import FastAPI

app = FastAPI(title="straddle")


@app.get("/")
def root() -> dict[str, str]:
    return {"status": "ok"}
