from pydantic import BaseModel
from typing import Optional, List
from app.schemas.conversation import RecommendationResponse

class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None
    proceed: bool = False

class ChatResponse(BaseModel):
    message: Optional[str] = None
    thread_id: str
    proceed: bool
    recommendations: Optional[List[RecommendationResponse]] = None
