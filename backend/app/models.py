from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    generations = relationship("ContentGeneration", back_populates="user")

class ContentGeneration(Base):
    __tablename__ = "content_generations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content_type = Column(String(50), nullable=False)  # blog, email, social
    tone = Column(String(50), nullable=False)  # formal, casual, funny, persuasive
    length = Column(String(20), nullable=False)  # short, medium, long
    product = Column(String(255))
    audience = Column(String(255))
    extra_instructions = Column(Text)
    generated_content = Column(Text, nullable=False)
    model_used = Column(String(50), nullable=False)  # gpt-4, claude-3, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User", back_populates="generations")
