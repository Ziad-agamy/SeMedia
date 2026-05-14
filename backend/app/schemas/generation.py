from pydantic import BaseModel, Field
from typing import List, Optional, Literal

GenreType = Literal[
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Thriller",
    "War",
    "Western"
]

class GeneratorSchema(BaseModel):
    narrative: str = Field(
        description="A vivid, cinematic narrative (2-3 sentences) synthesized from the conversation history, rich in atmosphere and themes."
    )
    genres: Optional[List[GenreType]] = Field(
        default=None,
        description="List of genres extracted from the conversation if explicitly mentioned by the user. Must be from the predefined genre list. None if no genres were specified."
    )

    title: str = Field(
        description="Short title for the conversation between the user and AI"
    )
    
    summary: str = Field(
        description="Summary of the conversation between the uesr and AI"
    )