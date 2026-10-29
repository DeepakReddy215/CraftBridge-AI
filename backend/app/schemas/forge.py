from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class DatasetCreate(BaseModel):
    name: str = Field(..., max_length=255)
    source: Optional[str] = None
    uri: Optional[str] = None
    classes: List[str] = Field(default_factory=list)
    counts: Dict[str, int] = Field(default_factory=dict)
    license: str = Field("CC-BY-4.0", max_length=64)

class TrainingRunCreate(BaseModel):
    dataset_id: str
    base_model: str = Field("yolov8n", pattern="^(yolov8n|yolov8s)$")
    epochs: int = Field(25, ge=1, le=300)
    imgsz: int = Field(640, ge=320, le=1024)
    batch: int = Field(16, ge=1, le=128)
    classes: List[str] = Field(default_factory=list)
    seed: int = Field(42)
    split: str = Field("70/20/10")
    augmentation: str = Field("standard")

class MetricCallback(BaseModel):
    epoch: int
    epochs: int
    metrics: Dict[str, float]
    loss: List[float]

class FinalFinishCallback(BaseModel):
    status: str
    final: Optional[Dict[str, Any]] = None

class ModelPromoteRequest(BaseModel):
    passphrase: Optional[str] = None
