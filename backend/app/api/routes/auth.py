from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.db.repositories.user import UserRepository
from app.db.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserOut, Token, GoogleLoginRequest
from app.services.auth import hash_password, verify_password, create_access_token
import httpx
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)

    existing_user = await repo.get_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    hashed = hash_password(user_data.password)

    new_user = await repo.create_user(
        email=user_data.email,
        hashed_password=hashed,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )
    return new_user


@router.post("/signin")
async def signin(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    user = await repo.get_by_email(credentials.email)

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.email})
    
    user_out = UserOut(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user_out
    }


@router.post("/google-login")
async def google_login(request: GoogleLoginRequest, db: AsyncSession = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        google_resp = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {request.token}"}
        )

    if google_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    user_info = google_resp.json()
    email = user_info.get("email")

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email associated")

    repo = UserRepository(db)
    user = await repo.get_by_email(email)

    if not user:
        hashed = hash_password(str(uuid.uuid4()))
        user = await repo.create_user(
            email=email,
            hashed_password=hashed,
            first_name=user_info.get("given_name", "Google"),
            last_name=user_info.get("family_name", "User")
        )

    access_token = create_access_token(data={"sub": user.email})
    
    user_out = UserOut(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user_out
    }


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
