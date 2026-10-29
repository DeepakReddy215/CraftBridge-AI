import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    role = Column(String(32), default="customer") # 'customer', 'artisan', 'developer'
    created_at = Column(DateTime, default=utc_now)

class RequestModel(Base):
    __tablename__ = "requests"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    customer_id = Column(String(64), ForeignKey("profiles.id"), nullable=True)
    artisan_id = Column(String(64), ForeignKey("profiles.id"), nullable=True)
    product = Column(String(128), nullable=False)
    style = Column(String(128), nullable=True)
    colors = Column(JSON, default=list)
    size_label = Column(String(64), nullable=True)
    budget = Column(Integer, default=800)
    purpose = Column(Text, nullable=True)
    pattern = Column(Text, nullable=True)
    reference_image_path = Column(Text, nullable=True)
    status = Column(String(32), default="DRAFT") # DRAFT, BRIEFED, IN_PROGRESS, UPLOADED, ANALYSED, PREVIEWED, REVISION_REQUESTED, APPROVED
    created_at = Column(DateTime, default=utc_now)

class BriefModel(Base):
    __tablename__ = "briefs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    request_id = Column(String(64), ForeignKey("requests.id"), nullable=False)
    brief_json = Column(JSON, nullable=False)
    guidance_json = Column(JSON, nullable=False)
    version = Column(Integer, default=1)
    source = Column(String(32), default="gemini") # 'gemini', 'groq', 'template'
    created_at = Column(DateTime, default=utc_now)

class SubmissionModel(Base):
    __tablename__ = "submissions"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    request_id = Column(String(64), ForeignKey("requests.id"), nullable=False)
    artisan_id = Column(String(64), ForeignKey("profiles.id"), nullable=True)
    height_cm = Column(Float, nullable=False)
    material_cost = Column(Float, nullable=False)
    labour_hours = Column(Float, nullable=False)
    complexity = Column(String(32), default="Medium")
    image_paths = Column(JSON, default=list)
    created_at = Column(DateTime, default=utc_now)

class AnalysisModel(Base):
    __tablename__ = "analyses"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    submission_id = Column(String(64), ForeignKey("submissions.id"), nullable=False)
    job_status = Column(String(32), default="completed") # pending, processing, completed, failed
    stage = Column(String(64), default="Completed")
    match_pct = Column(Float, default=0.0)
    match_detail = Column(JSON, default=dict)
    defects = Column(JSON, default=list)
    annotated_path = Column(Text, nullable=True)
    quality_score = Column(Float, default=0.0)
    subscores = Column(JSON, default=dict)
    price_low = Column(Integer, default=0)
    price_high = Column(Integer, default=0)
    demand_level = Column(String(32), default="Medium")
    report = Column(JSON, default=dict)
    model_version = Column(String(64), default="yolov8n-pottery-onnx-v1.4")
    created_at = Column(DateTime, default=utc_now)

class FeedbackModel(Base):
    __tablename__ = "feedback"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    request_id = Column(String(64), ForeignKey("requests.id"), nullable=False)
    submission_id = Column(String(64), ForeignKey("submissions.id"), nullable=True)
    customer_comment = Column(Text, nullable=False)
    instruction = Column(Text, nullable=True)
    changed_fields = Column(JSON, default=dict)
    created_at = Column(DateTime, default=utc_now)

class AIUsage(Base):
    __tablename__ = "ai_usage"

    id = Column(Integer, primary_key=True, autoincrement=True)
    day = Column(String(32), nullable=False)
    provider = Column(String(32), nullable=False)
    model = Column(String(64), nullable=False)
    calls = Column(Integer, default=0)
    tokens_in = Column(Integer, default=0)
    tokens_out = Column(Integer, default=0)
    errors = Column(Integer, default=0)

class AICache(Base):
    __tablename__ = "ai_cache"

    key = Column(String(255), primary_key=True)
    response = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=utc_now)

class DatasetModel(Base):
    __tablename__ = "datasets"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    source = Column(String(255), nullable=True)
    uri = Column(Text, nullable=True)
    classes = Column(JSON, default=list)
    counts = Column(JSON, default=dict)
    license = Column(String(64), default="CC-BY-4.0")
    created_by = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=utc_now)

class TrainingRunModel(Base):
    __tablename__ = "training_runs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    dataset_id = Column(String(64), ForeignKey("datasets.id"), nullable=True)
    config = Column(JSON, default=dict)
    status = Column(String(32), default="pending")
    token_hash = Column(String(128), nullable=True)
    metrics = Column(JSON, default=list)
    final_metrics = Column(JSON, default=dict)
    artifact_pt = Column(Text, nullable=True)
    artifact_onnx = Column(Text, nullable=True)
    notebook_url = Column(Text, nullable=True)
    created_by = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=utc_now)

class ModelModel(Base):
    __tablename__ = "models"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    run_id = Column(String(64), ForeignKey("training_runs.id"), nullable=True)
    version = Column(String(128), nullable=False)
    onnx_path = Column(Text, nullable=False)
    map50 = Column(Float, default=0.0)
    is_active = Column(Boolean, default=False)
    promoted_by = Column(String(64), nullable=True)
    promoted_at = Column(DateTime, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(64), nullable=True)
    action = Column(String(128), nullable=False)
    detail = Column(JSON, default=dict)
    at = Column(DateTime, default=utc_now)
