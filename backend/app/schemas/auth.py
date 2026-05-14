from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    token: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None
