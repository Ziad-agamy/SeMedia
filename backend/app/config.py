from langchain_ollama import OllamaEmbeddings
from langchain_cohere import CohereRerank
from langchain_groq import ChatGroq
from langchain_openrouter import ChatOpenRouter
from urllib.parse import quote
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    
    REDIS_PORT: int
    REDIS_PASSWORD: str

    PINECONE_API_KEY: str
    COHERE_API_KEY: str
    OPENROUTER_API_KEY: str
    GROQ_API_KEY: str

    PINECONE_INDEX_NAME: str
    SECRET_KEY: str
    
    model_config = SettingsConfigDict(
        env_file="./.env",
        env_ignore_empty=True,
        extra="ignore"
    )

    @property
    def postgre_url(self):
        return self.sqlalchemy_postgres_url

    @property
    def sqlalchemy_postgres_url(self):
        password = quote(self.DB_PASSWORD)
        return f"postgresql+asyncpg://{self.DB_USER}:{password}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def psycopg_postgres_url(self):
        password = quote(self.DB_PASSWORD)
        return f"postgresql://{self.DB_USER}:{password}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def redis_url(self):
        password = quote(self.REDIS_PASSWORD)
        return f"redis://:{password}@localhost:{self.REDIS_PORT}"

    @property
    def embedding_model(self):
        return OllamaEmbeddings(model="qwen3-embedding:0.6b")

    @property
    def rerank_model(self):
        return CohereRerank(model="rerank-english-v3.0", top_n=5)

    def groq_model(self, temp):
        return ChatGroq(model="llama-3.3-70b-versatile", temperature=temp)

    def openrouter_model(self, temp):
        return ChatOpenRouter(model="z-ai/glm-4.5-air:free", temperature=temp)

settings = Settings()

os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY
os.environ["GROQ_API_KEY"] = settings.GROQ_API_KEY
os.environ["OPENROUTER_API_KEY"] = settings.OPENROUTER_API_KEY
os.environ["COHERE_API_KEY"] = settings.COHERE_API_KEY