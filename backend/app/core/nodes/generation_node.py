from app.core.state import GraphState
from app.services.generation import GenerationService


class GenerationNode:
    def __init__(self):
        self._agent = GenerationService()

    async def __call__(self, state: GraphState) -> dict:
        result = await self._agent.generate(state.get("messages", []))

        return {
            "cinematic_query": result.narrative,
            "genres": result.genres or [],
            "title": result.title,
            "summary": result.summary,
        }
