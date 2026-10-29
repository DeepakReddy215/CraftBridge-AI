from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import RequestModel, BriefModel
from app.schemas.request import RequestCreate, RequestOut, RequestAssign
from app.deps import get_current_user, CurrentUser

router = APIRouter(prefix="/requests", tags=["Requests"])

@router.post("", response_model=RequestOut)
async def create_request(
    data: RequestCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    req = RequestModel(
        customer_id=user.id,
        product=data.product,
        style=data.style,
        colors=data.colors,
        size_label=data.size_label,
        budget=data.budget,
        purpose=data.purpose,
        pattern=data.pattern,
        reference_image_path=data.reference_image_path,
        status="DRAFT"
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

@router.get("", response_model=List[RequestOut])
async def list_requests(
    role: Optional[str] = None,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    query = db.query(RequestModel)
    if role == "customer":
        query = query.filter(RequestModel.customer_id == user.id)
    elif role == "artisan":
        # Artisans see assigned or available requests
        pass
    items = query.order_by(RequestModel.created_at.desc()).all()
    return items

@router.get("/{id}", response_model=RequestOut)
async def get_request(
    id: str,
    db: Session = Depends(get_db)
):
    req = db.query(RequestModel).filter(RequestModel.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Attach brief if generated
    brief = db.query(BriefModel).filter(BriefModel.request_id == id).first()
    res = RequestOut.model_validate(req)
    if brief:
        res.brief = {
            "brief_json": brief.brief_json,
            "guidance_json": brief.guidance_json,
            "source": brief.source,
            "version": brief.version
        }
    return res

@router.post("/{id}/assign", response_model=RequestOut)
async def assign_artisan(
    id: str,
    payload: RequestAssign,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    req = db.query(RequestModel).filter(RequestModel.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    artisan_id = payload.artisan_id or user.id
    req.artisan_id = artisan_id
    req.status = "IN_PROGRESS"
    db.commit()
    db.refresh(req)
    return req

@router.post("/{id}/approve")
async def approve_request(
    id: str,
    db: Session = Depends(get_db)
):
    req = db.query(RequestModel).filter(RequestModel.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    req.status = "APPROVED"
    db.commit()
    return {"status": "APPROVED", "request_id": id}
