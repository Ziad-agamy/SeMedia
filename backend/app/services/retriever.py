from langchain_pinecone import PineconeVectorStore
from langchain_classic.retrievers import ContextualCompressionRetriever, EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from app.config import settings
from scripts.ingest_knowledge import Knowledge
from pinecone import Pinecone
from typing import List, Any

class RetrieverService():
    def __init__(self):
        self.index_name = settings.PINECONE_INDEX_NAME
        self.embed = settings.embedding_model
        self.rerank = settings.rerank_model
        self.knowledge = Knowledge()
        self._ensure_knowledge()
        self.docs = self.knowledge.load_documents()

    def _ensure_knowledge(self):
        """Check if Pinecone index is populated, ingest if not."""
        pc = Pinecone()
        index = pc.Index(self.index_name)
        stats = index.describe_index_stats()

        if stats["total_vector_count"] == 0:
            print("Pinecone index is empty. Running ingestion...")
            self.knowledge.ingest_knowledge()
            print("Ingesti on complete.")
        else:
            print(f"Pinecone index already has {stats['total_vector_count']} vectors. Skipping ingestion.")

    async def retrieve(self, cinematic_query: str, genres: List[str]) -> List[dict[str, Any]]:
        vectorstore = PineconeVectorStore(
            index_name=self.index_name,
            embedding=self.embed
        )

        search_kwargs = {"k": 10}
        if genres:
            search_kwargs["filter"] = {"genre": {"$in": genres}}

        vector_retriever = vectorstore.as_retriever(
            search_kwargs=search_kwargs
        )

        bm25_retriever = BM25Retriever.from_documents(self.docs)
        bm25_retriever.k = 10

        hybrid_retriever = EnsembleRetriever(
            retrievers=[vector_retriever, bm25_retriever],
            weights=[0.7, 0.3]
        )
        compressor = ContextualCompressionRetriever(
            base_compressor=self.rerank,
            base_retriever=hybrid_retriever
        )

        docs = await compressor.ainvoke(cinematic_query)

        def _ensure_list(v):
            return v if isinstance(v, list) else [x.strip() for x in str(v).split(",")] if v else []

        results = []
        for i, doc in enumerate(docs):
            m = doc.metadata
            rd = m.get("release_date", "")
            year = int(rd[:4]) if len(rd) >= 4 and rd[:4].isdigit() else 2026
            poster = m.get("poster_path", "")
            backdrop = m.get("backdrop_path", "")

            results.append({
                "id": m.get("id", i + 1),
                "title": m.get("title", "Unknown Title"),
                "year": year,
                "rating": m.get("vote_average", 0.0),
                "duration": f"{m.get('runtime', 120)} min",
                "genre": _ensure_list(m.get("genres", [])),
                "poster": f"https://image.tmdb.org/t/p/w500{poster}" if poster else "",
                "backdrop": f"https://image.tmdb.org/t/p/original{backdrop}" if backdrop else "",
                "description": doc.page_content,
                "director": m.get("director", "Unknown"),
                "cast": _ensure_list(m.get("cast", []))
            })

        return results