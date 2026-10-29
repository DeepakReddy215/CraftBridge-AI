from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import RequestModel, BriefModel
from app.services.ai_gateway import generate_json
from app.services.llm_prompts import craft_brief_prompt

router = APIRouter(prefix="/requests", tags=["Briefs"])

@router.post("/{id}/brief")
async def generate_request_brief(
    id: str,
    db: Session = Depends(get_db)
):
    req = db.query(RequestModel).filter(RequestModel.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    prompt = craft_brief_prompt(
        product=req.product,
        style=req.style or "Modern Minimalist",
        colors=req.colors or [],
        size=req.size_label or "Medium",
        budget=req.budget,
        purpose=req.purpose or "",
        pattern=req.pattern or ""
    )

    data, source = await generate_json("craft_brief", prompt)

    # Separate brief and guidance objects
    brief_data = {
        "summary": data.get("summary", ""),
        "product": data.get("product", req.product),
        "target_dimensions": data.get("target_dimensions", "22 ± 1.5 cm"),
        "aesthetic_notes": data.get("aesthetic_notes", ""),
        "palette_hex": data.get("palette_hex", req.colors),
        "clay_body_recommendation": data.get("clay_body_recommendation", "Refined stoneware"),
        "critical_tolerances": data.get("critical_tolerances", [])
    }

    guidance_data = {
        "stages": data.get("stages", []),
        "quality_checklist": data.get("quality_checklist", [])
    }

    # Save to database
    brief_record = BriefModel(
        request_id=id,
        brief_json=brief_data,
        guidance_json=guidance_data,
        source=source,
        version=1
    )
    db.add(brief_record)
    req.status = "BRIEFED"
    db.commit()

    return {
        "id": brief_record.id,
        "request_id": id,
        "brief_json": brief_data,
        "guidance_json": guidance_data,
        "source": source
    }
