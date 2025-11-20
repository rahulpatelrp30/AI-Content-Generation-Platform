from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, ContentGeneration
from app.schemas import GenerateRequest, GenerateResponse, ContentResponse
from app.auth import get_current_user
from app.ai_service import get_ai_generator

router = APIRouter()

@router.post("/generate", response_model=GenerateResponse)
async def generate_content(
    request: GenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate AI content based on user input."""
    print(f"📝 Generate content request received from user {current_user.email}")
    print(f"📝 Request: {request.content_type}, {request.tone}, {request.length}")
    
    try:
        # Get the AI generator instance
        print("📝 Getting AI generator...")
        ai_gen = get_ai_generator()
        print(f"📝 AI generator obtained: {ai_gen is not None}")
        
        # Generate content using AI
        print("📝 Calling AI generation...")
        generated_text, model_used = await ai_gen.generate(
            content_type=request.content_type,
            tone=request.tone,
            length=request.length,
            product=request.product,
            audience=request.audience,
            extra_instructions=request.extra_instructions,
            preferred_model="openai"  # Can be made configurable
        )
        
        # Save to database
        new_generation = ContentGeneration(
            user_id=current_user.id,
            content_type=request.content_type,
            tone=request.tone,
            length=request.length,
            product=request.product,
            audience=request.audience,
            extra_instructions=request.extra_instructions,
            generated_content=generated_text,
            model_used=model_used
        )
        db.add(new_generation)
        db.commit()
        db.refresh(new_generation)
        
        return new_generation
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Content generation failed: {str(e)}"
        )

@router.get("/history", response_model=List[ContentResponse])
async def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 50
):
    """Get user's content generation history."""
    generations = db.query(ContentGeneration)\
        .filter(ContentGeneration.user_id == current_user.id)\
        .order_by(ContentGeneration.created_at.desc())\
        .limit(limit)\
        .all()
    
    return generations

@router.get("/history/{content_id}", response_model=ContentResponse)
async def get_content_by_id(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific content generation by ID."""
    content = db.query(ContentGeneration)\
        .filter(
            ContentGeneration.id == content_id,
            ContentGeneration.user_id == current_user.id
        )\
        .first()
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found"
        )
    
    return content

@router.delete("/history/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_content(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a content generation."""
    content = db.query(ContentGeneration)\
        .filter(
            ContentGeneration.id == content_id,
            ContentGeneration.user_id == current_user.id
        )\
        .first()
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found"
        )
    
    db.delete(content)
    db.commit()
    
    return None
