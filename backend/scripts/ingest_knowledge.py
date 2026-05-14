import pickle
from langchain_pinecone import PineconeVectorStore
from langchain_community.document_loaders import CSVLoader
from app.config import settings

class Knowledge():
    def __init__(self):
        self.embed = settings.embedding_model
        self.index_name = settings.PINECONE_INDEX_NAME
        self.data_path = "data/tmdb_movies_2010_2026.csv"
        self.docs_cache_path = "data/movies_docs.pkl"

    def ingest_knowledge(self):

        movies = CSVLoader(
            file_path=self.data_path,
            source_column="title",
            metadata_columns=[
                "title", "overview", "release_date",
                "runtime", "vote_average", "vote_count",
                "popularity", "genres", "production_countries",
                "director", "cast", "keywords", "poster_path", "backdrop_path"],
            content_columns=["tagline", "overview"]
        ).load()

        with open(self.docs_cache_path, "wb") as f:
            pickle.dump(movies, f)

        vectorstore = PineconeVectorStore.from_documents(
            documents=movies,
            embedding=self.embed,
            index_name=self.index_name,
        )

        return vectorstore

    def load_documents(self):
        with open(self.docs_cache_path, "rb") as f:
            return pickle.load(f)