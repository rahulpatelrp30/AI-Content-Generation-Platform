from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.database import engine
from app.models import Base
from app.routers import auth, content, health

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting AI Content Generation Platform API...")
    yield
    # Shutdown
    print("🛑 Shutting down...")

app = FastAPI(
    title="AI Content Generation Platform API",
    description="Generate marketing content, blog posts, and social media captions using AI",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration - allow local and production domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://kaabil.engineer",
        "https://*.vercel.app",  # Allow all Vercel preview deployments
        "*"  # Allow all origins for demo (restrict in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "🚀 AI Content Generation Platform API",
        "version": "1.0.0",
        "status": "running",
        "docs": "http://localhost:8000/docs",
        "endpoints": {
            "health": "/health",
            "register": "/auth/register",
            "login": "/auth/login",
            "generate": "/api/generate",
            "history": "/api/history"
        }
    }

# Include routers
app.include_router(health.router)
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(content.router, prefix="/api", tags=["content"])

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False  # Disable reload in production
    )
