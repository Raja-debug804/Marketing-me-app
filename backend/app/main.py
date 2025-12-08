from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth, integrations, notify, platform, users
from app.db import base  # noqa: F401
from app.db.init_db import init_db
from app.db.session import SessionLocal


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    yield
    # Shutdown


app = FastAPI(title="NotifyInsights API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = FastAPI()


app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(platform.router, prefix="/api/v1/platform", tags=["platform"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(notify.router, prefix="/api/v1", tags=["notify"])
app.include_router(integrations.router, prefix="/api/v1", tags=["integrations"])


@app.get("/")
def root():
    return {"status": "ok"}
