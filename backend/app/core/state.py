from typing import Any, Dict, List, Optional
from langgraph.graph import MessagesState

class GraphState(MessagesState):
    proceed: bool = False
    cinematic_query: Optional[str] = None
    genres: Optional[List[str]] = None
    title: str = ""
    summary: str = ""
    retrieved_movies: Optional[List[Dict[str, Any]]] = None