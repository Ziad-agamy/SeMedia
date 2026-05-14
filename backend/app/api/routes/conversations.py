from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.db.models.user import User
from app.db.models.conversation import Conversation
from app.db.repositories.conversation import ConversationRepository
from app.db.repositories.recommendation import RecommendationRepository
from app.schemas.conversation import ConversationResponse, RecommendationResponse

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("/", response_model=list[ConversationResponse])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all conversations for the current user, ordered newest first."""
    repo = ConversationRepository(db)
    conversations = await repo.get_user_conversations(current_user.id)
    return conversations


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Hard delete a conversation and all its recommendations."""
    repo = ConversationRepository(db)
    deleted = await repo.delete(conversation_id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )

    rec_repo = RecommendationRepository(db)
    await rec_repo.delete_by_conversation_id(conversation_id)


@router.get("/{conversation_id}/recommendations", response_model=list[RecommendationResponse])
async def get_conversation_recommendations(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all recommendations for a specific conversation."""
    conv_repo = ConversationRepository(db)
    conversation = await conv_repo.get(conversation_id, current_user.id)

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )

    rec_repo = RecommendationRepository(db)
    recommendations = await rec_repo.get_by_conversation_id(conversation_id)
    return recommendations