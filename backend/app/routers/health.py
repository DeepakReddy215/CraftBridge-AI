from fastapi import APIRouter
from app.services.ai_gateway import get_budget_status
from app.services.defects import detector

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
async def health_check():
    """
    Section 4.4: Cheap liveness check, reports model version and AI budget remaining.
    """
    budget = get_budget_status()
    return {
        "status": "healthy",
        "active_model": detector.model_version,
        "model_loaded": detector.session is not None,
        "version": "1.0.0-free-tier",
        "ai_budget": budget
    }
