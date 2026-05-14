from langchain_core.messages import SystemMessage
from app.core.utils.trimmer import trimmer
from langchain_core.messages import BaseMessage
from app.config import settings
from typing import List
import os

class FeedbackService:
    def __init__(self):
        self.primary_model = settings.groq_model(temp=0.3)
        self.fallback_model = settings.openrouter_model(temp=0.3)
        self.model_with_fallback = self.primary_model.with_fallbacks(
            [self.fallback_model]
        )
        self.trimmer = trimmer

        prompt_path = os.path.join("app", "prompts", "feedback_model_prompt.txt")
        with open(prompt_path, "r", encoding="utf-8") as sys:
            self.sys_prompt = sys.read()

    async def chat(self, messages: List[BaseMessage]) -> str:
        messages = [SystemMessage(content=self.sys_prompt)] + messages

        chain = self.trimmer | self.model_with_fallback
        response = await chain.ainvoke(messages)
        return response.content