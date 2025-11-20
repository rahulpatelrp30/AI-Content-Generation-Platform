from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
import os
from pathlib import Path

# Get the backend directory
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

# Load .env file explicitly with absolute path
load_dotenv(ENV_FILE)

# Debug: print to verify loading
print(f"🔍 Loading .env from: {ENV_FILE}")
print(f"🔍 .env exists: {ENV_FILE.exists()}")
openai_key = os.getenv("OPENAI_API_KEY")
print(f"🔍 OPENAI_API_KEY loaded: {bool(openai_key)} (length: {len(openai_key) if openai_key else 0})")

class Settings(BaseSettings):
    # Database (using SQLite for development)
    DATABASE_URL: str = "sqlite:///./ai_content.db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # AI APIs - Load from environment with os.getenv as fallback
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY: Optional[str] = os.getenv("ANTHROPIC_API_KEY")
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = True

settings = Settings()
