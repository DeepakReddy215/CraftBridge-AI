from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class RequestCreate(BaseModel):
    product: str = Field(..., max_length=128)
    style: Optional[str] = Field("Modern Minimalist", max_length=128)
    colors: List[str] = Field(default_factory=list)
    size_label: Optional[str] = Field("Medium (18-25cm)", max_length=64)
    budget: int = Field(800, ge=100, le=50000)
    purpose: Optional[str] = Field("", max_length=500)
    pattern: Optional[str] = Field("", max_length=200)
    reference_image_path: Optional[str] = None

class RequestAssign(BaseModel):
    artisan_id: Optional[str] = None

class RequestOut(BaseModel):
    id: str
    customer_id: Optional[str] = None
    artisan_id: Optional[str] = None
    product: str
    style: Optional[str] = None
    colors: List[str] = []
    size_label: Optional[str] = None
    budget: int
    purpose: Optional[str] = None
    pattern: Optional[str] = None
    reference_image_path: Optional[str] = None
    status: str
    created_at: datetime
    brief: Optional[dict] = None

    class Config:
        from_attributes = True
