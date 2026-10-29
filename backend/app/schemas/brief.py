from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class GuidanceStepSchema(BaseModel):
    step: int
    title: str
    focus: str
    checkpoint: str
    tip: Optional[str] = None

class BriefContentSchema(BaseModel):
    summary: str
    product: str
    target_dimensions: str
    aesthetic_notes: str
    palette_hex: List[str] = Field(default_factory=list)
    clay_body_recommendation: str
    critical_tolerances: List[str] = Field(default_factory=list)

class GuidanceContentSchema(BaseModel):
    stages: List[GuidanceStepSchema]
    quality_checklist: List[str] = Field(default_factory=list)

class BriefOut(BaseModel):
    id: str
    request_id: str
    brief_json: BriefContentSchema
    guidance_json: GuidanceContentSchema
    version: int = 1
    source: str = "gemini"
    created_at: datetime

    class Config:
        from_attributes = True
