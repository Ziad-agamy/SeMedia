from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.models.recommendation import Recommendation
from app.db.base import Base


class Conversation(Base):
    __tablename__ = "conversation"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    thread_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, default="Movie Conversation")
    summary: Mapped[str] = mapped_column(Text, nullable=False)

    user = relationship("User", back_populates="conversations")
    recommendations = relationship(
        "Recommendation",
        back_populates="conversation",
        cascade="all, delete-orphan",
    )