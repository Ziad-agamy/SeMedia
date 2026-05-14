from typing import List
from langchain_core.messages import SystemMessage, HumanMessage
from app.config import settings
from app.services.generation import GenerationService
from app.services.retriever import RetrieverService
from tests.orchestrator.schema import EvaluationDatasetGeneratorSchema
import json
import os

class EvaluationDatasetGenerator:
    def __init__(self):
        self.llm = settings.groq_model(temp=0.7)
        self.gen_agent = GenerationService()
        self.retriever = RetrieverService()
        self.generated_inputs: List[str] = []

        prompt_path = os.path.join("tests", "prompts", "user_simulator.txt")
        with open(prompt_path, 'r', encoding='utf-8') as sys:
            self.sys_prompt = sys.read()

    async def generate_data(self):
        context = ""
        if self.generated_inputs:
            context = "\n\n## Previous User Inputs (DO NOT generate similar ones):\n" + "\n".join(
                f"- {inp}" for inp in self.generated_inputs[-15:]
            )
        
        full_prompt = self.sys_prompt + context
        message = [SystemMessage(content=full_prompt)]
        
        parsed = None
        for attempt in range(3):
            response = await self.llm.ainvoke(message)
            if not response or not response.content:
                continue
            try:
                content = response.content.strip()
                if content.startswith("```"):
                    content = content.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
                data = json.loads(content)
                parsed = EvaluationDatasetGeneratorSchema(**data)
                break
            except (json.JSONDecodeError, ValueError):
                continue
        
        if not parsed:
            raise RuntimeError("LLM failed to generate valid JSON after 3 attempts.")

        user_input: str = parsed.user_input
        reference_titles: List[str] = parsed.reference_movies
        self.generated_inputs.append(user_input)

        gen_output = await self.gen_agent.generate(messages=[HumanMessage(content=user_input)])
        description = gen_output.narrative

        retrieved_output = await self.retriever.retrieve(
            cinematic_query=description, 
            genres=gen_output.genres or []
        )
        retrieved_titles = [movie["title"] for movie in retrieved_output]

        return {
            "question": user_input,
            "contexts": [description],
            "answer": f"Movies: {', '.join(retrieved_titles)}",
            "reference": f"Reference: {', '.join(reference_titles)}"
        }
