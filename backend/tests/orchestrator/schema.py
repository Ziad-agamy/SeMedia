from pydantic import BaseModel, Field
from typing import List

class EvaluationDatasetGeneratorSchema(BaseModel):
    user_input: str = Field(
        description="A natural, conversational user request"
        )

    reference_movies: List[str] = Field(
        description="A list of exactly 5 high-quality reference movies that BEST match the request"
        )