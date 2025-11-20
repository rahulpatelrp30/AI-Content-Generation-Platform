from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import datetime

# Auth schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Content generation schemas
class GenerateRequest(BaseModel):
    content_type: Literal["blog", "email", "social"]
    tone: Literal["formal", "casual", "funny", "persuasive"]
    length: Literal["short", "medium", "long"]
    product: str
    audience: str
    extra_instructions: Optional[str] = None

class GenerateResponse(BaseModel):
    id: int
    generated_content: str
    model_used: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ContentResponse(BaseModel):
    id: int
    content_type: str
    tone: str
    length: str
    product: str
    audience: str
    extra_instructions: Optional[str]
    generated_content: str
    model_used: str
    created_at: datetime
    
    class Config:
        from_attributes = True
