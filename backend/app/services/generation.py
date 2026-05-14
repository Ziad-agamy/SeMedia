from app.schemas.generation import GeneratorSchema
from langchain_core.messages import SystemMessage, BaseMessage
from app.config import settings
from typing import List
import os

class GenerationService():
    def __init__(self):
        self.primary_model = settings.groq_model(temp=0.7)
        self.fallback_model = settings.openrouter_model(temp=0.7)
        self.model_with_fallback = self.primary_model.with_fallbacks([self.fallback_model])
        self.model_with_fallback_and_parser = self.model_with_fallback.with_structured_output(GeneratorSchema)

        prompt_path = os.path.join("app", "prompts", "generation_model_prompt.txt")
        with open(prompt_path, 'r', encoding='utf-8') as sys:
            self.sys_prompt = sys.read()

    async def generate(self, messages: List[BaseMessage]) -> GeneratorSchema:
        messages = [
            SystemMessage(content=self.sys_prompt)
        ] + messages
        
        response = await self.model_with_fallback_and_parser.ainvoke(messages)

        return response