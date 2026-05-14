from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.conversation import Conversation


class ConversationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: int, thread_id: str, title: str, summary: str = "") -> Conversation:
        conversation = Conversation(
            user_id=user_id,
            thread_id=thread_id,
            title=title,
            summary=summary
        )
        self.db.add(conversation)
        await self.db.commit()
        await self.db.refresh(conversation)
        return conversation

    async def get(self, conversation_id: int, user_id: int) -> Optional[Conversation]:
        result = await self.db.execute(
            select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            )
        )
        return result.scalar_one_or_none()

    async def get_by_thread_id(self, thread_id: str, user_id: int) -> Optional[Conversation]:
        result = await self.db.execute(
            select(Conversation).where(
                Conversation.thread_id == thread_id,
                Conversation.user_id == user_id
            )
        )
        return result.scalar_one_or_none()

    async def get_user_conversations(self, user_id: int) -> list[Conversation]:
        result = await self.db.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.id.desc())
        )
        return result.scalars().all()

    async def update(self, conversation_id: int, title: Optional[str] = None, summary: Optional[str] = None) -> Conversation:
        result = await self.db.execute(
            select(Conversation).where(Conversation.id == conversation_id)
        )
        conversation = result.scalar_one()
        if title is not None:
            conversation.title = title
        if summary is not None:
            conversation.summary = summary
        await self.db.commit()
        await self.db.refresh(conversation)
        return conversation

    async def delete(self, conversation_id: int, user_id: int) -> bool:
        conversation = await self.get(conversation_id, user_id)
        if not conversation:
            return False
        await self.db.delete(conversation)
        await self.db.commit()
        return True
