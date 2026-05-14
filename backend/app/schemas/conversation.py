from pydantic import BaseModel
from typing import Optional, List

class ConversationResponse(BaseModel):
    id: int
    title: str
    summary: str
    thread_id: str

    class Config:
        from_attributes = True


class RecommendationResponse(BaseModel):
    id: int
    title: str
    year: Optional[int] = None
    director: Optional[str] = None
    genres: Optional[List[str]] = None
    match: Optional[float] = None
    overview: Optional[str] = None
    cast: Optional[List[str]] = None
    runtime: Optional[str] = None
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None

    class Config:
        from_attributes = True
