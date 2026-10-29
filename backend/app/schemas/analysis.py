from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class SubmissionCreate(BaseModel):
    request_id: str
    height_cm: float = Field(..., gt=0)
    material_cost: float = Field(..., ge=0)
    labour_hours: float = Field(..., gt=0)
    complexity: str = Field("Medium", pattern="^(Low|Medium|High)$")
    image_paths: List[str] = Field(default_factory=list)

class DefectBoxSchema(BaseModel):
    id: str
    class_name: str
    confidence: float
    box: List[float] # [ymin, xmin, ymax, xmax]
    region: str # 'upper', 'middle', 'bottom', 'left', 'right'

class MatchDetailSchema(BaseModel):
    colour_score: float
    pattern_score: float
    type_score: float
    size_score: float
    style_score: float
    notes: str

class RankedFixSchema(BaseModel):
    priority: str # 'structural', 'finish', 'cosmetic', 'advisory'
    title: str
    description: str
    action_step: str

class ReportSchema(BaseModel):
    executive_summary: str
    passed_checks: List[str] = Field(default_factory=list)
    ranked_fixes: List[RankedFixSchema] = Field(default_factory=list)
    artisan_praise: str
    customer_guidance: str

class AnalysisOut(BaseModel):
    id: str
    submission_id: str
    job_status: str
    stage: str
    match_pct: float
    match_detail: Dict[str, Any]
    defects: List[Dict[str, Any]]
    annotated_path: Optional[str] = None
    quality_score: float
    subscores: Dict[str, Any]
    price_low: int
    price_high: int
    demand_level: str
    report: Dict[str, Any]
    model_version: str
    created_at: datetime

    class Config:
        from_attributes = True

class FeedbackCreate(BaseModel):
    customer_comment: str = Field(..., max_length=1000)
