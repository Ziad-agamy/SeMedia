import app.db.models  # noqa: F401 — register models on Base.metadata
from app.db.base import Base
from app.db.session import engine


async def ensure_schema() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
