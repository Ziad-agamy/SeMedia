from typing import List, Optional

from sqlalchemy import Float, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("conversation.id", ondelete="CASCADE"), nullable=False, index=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    director: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    genres: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    match: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    overview: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cast: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    runtime: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    poster_path: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    backdrop_path: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    conversation = relationship("Conversation", back_populates="recommendations")
