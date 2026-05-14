from app.core.state import GraphState
from app.services.retriever import RetrieverService


class RetrieverNode:
    def __init__(self):
        self._retriever = RetrieverService()

    async def __call__(self, state: GraphState) -> dict:
        cinematic_query = state.get("cinematic_query") or ""
        genres = state.get("genres") or []
        retrieved_movies = await self._retriever.retrieve(
            cinematic_query=cinematic_query,
            genres=genres,
        )
        return {"retrieved_movies": retrieved_movies}
