from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt

from app.db.session import AsyncSessionLocal
from app.db.models.user import User
from app.db.repositories.user import UserRepository
from app.config import settings
from app.services.auth import ALGORITHM
from app.schemas.auth import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that yields a database session and handles teardown."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Dependency that extracts the JWT token from the Authorization header,
    decodes it, and retrieves the authenticated user from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    repo = UserRepository(db)
    user = await repo.get_by_email(email=token_data.email)
    
    if user is None:
        raise credentials_exception
        
    return user
