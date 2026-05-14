from app.config import settings
from langgraph.graph import StateGraph, END, START
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from psycopg_pool import AsyncConnectionPool
from app.core.state import GraphState
from app.core.nodes.feedback_node import FeedbackNode
from app.core.nodes.generation_node import GenerationNode
from app.core.nodes.retriever_node import RetrieverNode
from app.core.edges.proceed import should_proceed


class Graph:
    def __init__(self):
        self.feedback_node = FeedbackNode()
        self.generation_node = GenerationNode()
        self.retriever = RetrieverNode()
        self.checkpointer = None
        self.pool = None
        self.graph = None

    def __build(self, checkpointer):
        graph = StateGraph(GraphState)
        
        graph.add_node("feedback_agent", self.feedback_node)
        graph.add_node("generation_agent", self.generation_node)
        graph.add_node("retriever", self.retriever)

        graph.add_conditional_edges(
            START,
            should_proceed,
            {"proceed": "generation_agent", "no-proceed": "feedback_agent"},
        )

        graph.add_edge("feedback_agent", END)
        graph.add_edge("generation_agent", "retriever")
        graph.add_edge("retriever", END)

        return graph.compile(checkpointer=checkpointer)

    async def initialize(self):
        self.pool = AsyncConnectionPool(conninfo=settings.psycopg_postgres_url)
        self.checkpointer = AsyncPostgresSaver(self.pool)
        await self.checkpointer.setup()
        self.graph = self.__build(self.checkpointer)

    async def close(self):
        if self.pool:
            await self.pool.close()

    async def shutdown(self):
        await self.close()