from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import RequestModel, FeedbackModel
from app.schemas.analysis import FeedbackCreate
from app.services.ai_gateway import generate_json
from app.services.llm_prompts import feedback_conversion_prompt

router = APIRouter(prefix="/requests", tags=["Feedback"])

@router.post("/{id}/feedback")
async def submit_feedback(
    id: str,
    data: FeedbackCreate,
    db: Session = Depends(get_db)
):
    req = db.query(RequestModel).filter(RequestModel.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    prompt = feedback_conversion_prompt(data.customer_comment, req.product)
    parsed, _ = await generate_json("feedback_conversion", prompt)

    fb = FeedbackModel(
        request_id=id,
        customer_comment=data.customer_comment,
        instruction=parsed.get("instruction", "Review piece and apply customer adjustments."),
        changed_fields=parsed.get("changed_fields", {})
    )
    db.add(fb)
    req.status = "REVISION_REQUESTED"
    db.commit()

    return {
        "id": fb.id,
        "request_id": id,
        "customer_comment": fb.customer_comment,
        "instruction": fb.instruction,
        "status": "REVISION_REQUESTED"
    }
