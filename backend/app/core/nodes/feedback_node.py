from langchain_core.messages import AIMessage

from app.core.state import GraphState
from app.services.feedback import FeedbackService


class FeedbackNode:
    def __init__(self):
        self._agent = FeedbackService()

    async def __call__(self, state: GraphState) -> dict:
        feedback_text = await self._agent.chat(state.get("messages", []))

        return {
            "messages": [AIMessage(content=feedback_text)],
            "proceed": bool(state.get("proceed", False)),
        }