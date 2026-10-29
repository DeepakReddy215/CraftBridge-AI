from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import RequestModel, SubmissionModel
from app.schemas.analysis import SubmissionCreate
from app.services.storage import get_signed_upload_urls
from app.deps import get_current_user, CurrentUser

router = APIRouter(prefix="/requests", tags=["Submissions"])

@router.post("/{id}/uploads/sign")
async def sign_upload_urls(id: str):
    file_keys = [
        f"{id}/front.jpg",
        f"{id}/back.jpg",
        f"{id}/rim.jpg",
        f"{id}/base.jpg"
    ]
    urls = get_signed_upload_urls(bucket="photos", file_keys=file_keys)
    return {"signed_urls": urls}

@router.post("/{id}/submissions")
async def create_submission(
    id: str,
    data: SubmissionCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user)
):
    req = db.query(RequestModel).filter(RequestModel.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    submission = SubmissionModel(
        request_id=id,
        artisan_id=user.id,
        height_cm=data.height_cm,
        material_cost=data.material_cost,
        labour_hours=data.labour_hours,
        complexity=data.complexity,
        image_paths=data.image_paths
    )
    db.add(submission)
    req.status = "UPLOADED"
    db.commit()
    db.refresh(submission)

    return {
        "id": submission.id,
        "request_id": submission.request_id,
        "height_cm": submission.height_cm,
        "material_cost": submission.material_cost,
        "labour_hours": submission.labour_hours,
        "complexity": submission.complexity,
        "image_paths": submission.image_paths,
        "created_at": submission.created_at
    }
