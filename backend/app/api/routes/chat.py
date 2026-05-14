import asyncio
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_core.messages import HumanMessage, AIMessage
import uuid

from app.api.deps import get_db, get_current_user
from app.db.models.user import User
from app.db.repositories.conversation import ConversationRepository
from app.db.repositories.recommendation import RecommendationRepository
from app.core.graph import Graph
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["Chat"])

graph_instance = Graph()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conv_repo = ConversationRepository(db)
    thread_id = request.thread_id or str(uuid.uuid4())
    
    conversation = await conv_repo.get_by_thread_id(thread_id, current_user.id)
    if not conversation:
        conversation = await conv_repo.create(
            user_id=current_user.id,
            thread_id=thread_id,
            title="",
            summary=""
        )

    if graph_instance.graph is None:
        try:
            await asyncio.wait_for(graph_instance.initialize(), timeout=25)
        except asyncio.TimeoutError:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Chat engine initialization timed out. Please try again.",
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Chat engine initialization failed: {str(exc)}",
            )

    config = {"configurable": {"thread_id": thread_id, "user_id": current_user.id}}
    inputs = {
        "messages": [HumanMessage(content=request.message)],
        "proceed": request.proceed,
    }

    try:
        result = await asyncio.wait_for(
            graph_instance.graph.ainvoke(inputs, config=config),
            timeout=45,
        )
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Chat request timed out while waiting for AI providers. Please try again.",
        )

    # Update conversation record if the user proceeded and generation node provided info
    if request.proceed:
        title = result.get("title")
        summary = result.get("summary")
        if title or summary:
            await conv_repo.update(conversation.id, title=title, summary=summary)

    # Handle Recommendations if we transitioned to the retriever node
    recommendations = []
    retrieved_movies = result.get("retrieved_movies")
    if retrieved_movies:
        rec_repo = RecommendationRepository(db)
        for movie in retrieved_movies:
            rec = await rec_repo.create(
                conversation_id=conversation.id,
                movie_id=movie.get("id"),
                title=movie.get("title"),
                year=movie.get("year"),
                rating=movie.get("rating"),
                duration=movie.get("duration"),
                genre=movie.get("genre"),
                poster=movie.get("poster"),
                backdrop=movie.get("backdrop"),
                description=movie.get("description"),
                director=movie.get("director"),
                cast=movie.get("cast"),
                reason=movie.get("reason")
            )
            recommendations.append(rec)

    # Handle AI Response
    messages = result.get("messages", [])
    ai_content = None
    for msg in reversed(messages):
        if isinstance(msg, AIMessage):
            ai_content = msg.content
            break

    return ChatResponse(
        message=None if request.proceed else ai_content,
        thread_id=thread_id,
        proceed=result.get("proceed", False),
        recommendations=recommendations if recommendations else None
    )
