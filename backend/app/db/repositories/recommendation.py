from typing import Optional, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.recommendation import Recommendation


class RecommendationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        conversation_id: int,
        title: str,
        year: int = None,
        rating: float = None,
        duration: str = None,
        genre: Any = None,
        poster: str = None,
        backdrop: str = None,
        description: str = None,
        director: str = None,
        cast: Any = None,
        movie_id: int = None,
        reason: str = None,
    ) -> Recommendation:
        normalized_year = None
        if isinstance(year, int):
            normalized_year = year
        elif year is not None:
            try:
                normalized_year = int(str(year).strip())
            except (TypeError, ValueError):
                normalized_year = None

        normalized_rating = None
        if isinstance(rating, (int, float)):
            normalized_rating = float(rating)
        elif rating is not None:
            try:
                normalized_rating = float(str(rating).strip())
            except (TypeError, ValueError):
                normalized_rating = None

        genres_list = genre if isinstance(genre, list) else [genre] if genre else None
        cast_list = cast if isinstance(cast, list) else [cast] if cast else None

        recommendation = Recommendation(
            conversation_id=conversation_id,
            title=title,
            year=normalized_year,
            match=normalized_rating,
            runtime=duration,
            genres=genres_list,
            poster_path=poster,
            backdrop_path=backdrop,
            overview=description,
            director=director,
            cast=cast_list,
        )
        self.db.add(recommendation)
        await self.db.commit()
        await self.db.refresh(recommendation)
        return recommendation

    async def get_by_id(
        self, recommendation_id: int) -> Optional[Recommendation]:
        result = await self.db.execute(
            select(Recommendation).where(Recommendation.id == recommendation_id)
        )
        return result.scalar_one_or_none()

    async def get_by_conversation_id(
        self, conversation_id: int) -> List[Recommendation]:
        result = await self.db.execute(
            select(Recommendation)
            .where(Recommendation.conversation_id == conversation_id)
            .order_by(Recommendation.id.desc())
        )
        return result.scalars().all()

    async def delete_by_conversation_id(self, conversation_id: int) -> None:
        result = await self.db.execute(
            select(Recommendation).where(Recommendation.conversation_id == conversation_id)
        )
        recommendations = result.scalars().all()
        for rec in recommendations:
            await self.db.delete(rec)
        await self.db.commit()
