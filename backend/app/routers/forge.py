import json
import secrets
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import DatasetModel, TrainingRunModel, ModelModel, AuditLog
from app.schemas.forge import DatasetCreate, TrainingRunCreate, MetricCallback, FinalFinishCallback, ModelPromoteRequest
from app.services.model_registry import model_registry
from app.deps import require_role, CurrentUser
from app.config import settings

router = APIRouter(prefix="/forge", tags=["Model Forge"])

@router.post("/datasets")
async def register_dataset(
    data: DatasetCreate,
    db: Session = Depends(get_db)
):
    ds = DatasetModel(
        name=data.name,
        source=data.source,
        uri=data.uri,
        classes=data.classes,
        counts=data.counts,
        license=data.license
    )
    db.add(ds)
    db.commit()
    db.refresh(ds)
    return ds

@router.get("/datasets")
async def list_datasets(db: Session = Depends(get_db)):
    datasets = db.query(DatasetModel).all()
    if not datasets:
        # Default curated dataset
        return [
            {
                "id": "ds-1",
                "name": "PotteryDefects-Kaggle-V2",
                "source": "Kaggle: craftai/pottery-defects-yolo",
                "classes": ["crack", "chip", "uneven_glaze", "stain"],
                "counts": {"crack": 412, "chip": 289, "uneven_glaze": 520, "stain": 198},
                "license": "CC-BY-4.0"
            }
        ]
    return datasets

@router.post("/runs")
async def create_training_run(
    data: TrainingRunCreate,
    db: Session = Depends(get_db)
):
    token = secrets.token_hex(16)
    run = TrainingRunModel(
        dataset_id=data.dataset_id,
        config=data.model_dump(),
        status="pending",
        token_hash=token,
        metrics=[]
    )
    db.add(run)
    db.commit()
    db.refresh(run)

    return {
        "run_id": run.id,
        "token": token,
        "notebook_url": f"/api/forge/runs/{run.id}/notebook"
    }

@router.get("/runs/{id}")
async def get_training_run(id: str, db: Session = Depends(get_db)):
    run = db.query(TrainingRunModel).filter(TrainingRunModel.id == id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@router.get("/runs/{id}/notebook")
async def download_notebook(id: str, db: Session = Depends(get_db)):
    run = db.query(TrainingRunModel).filter(TrainingRunModel.id == id).first()
    token = run.token_hash if run else "demo_forge_token"
    api_url = "https://craftbridge-api.onrender.com"

    # Section 5.4 Notebook Template
    notebook_content = {
        "cells": [
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "!pip -q install ultralytics requests\n",
                    f'RUN_ID, TOKEN, API = "{id}", "{token}", "{api_url}"\n',
                    "from ultralytics import YOLO\nimport requests\n",
                    "def post(path, data): requests.post(f\"{API}/api/forge/runs/{RUN_ID}/{path}\", json=data, headers={\"X-Run-Token\": TOKEN}, timeout=20)\n",
                    "def on_epoch_end(trainer):\n",
                    "    m = {k: float(v) for k, v in trainer.metrics.items()}\n",
                    "    post(\"metrics\", {\"epoch\": trainer.epoch + 1, \"epochs\": trainer.epochs, \"metrics\": m, \"loss\": [float(x) for x in trainer.tloss]})\n",
                    "model = YOLO(\"yolov8n.pt\")\n",
                    "model.add_callback(\"on_fit_epoch_end\", on_epoch_end)\n",
                    "model.train(data=\"data.yaml\", epochs=25, imgsz=640, batch=16, seed=42)\n",
                    "best = YOLO(\"runs/detect/train/weights/best.pt\")\n",
                    "best.export(format=\"onnx\", imgsz=640, simplify=True)\n",
                    "post(\"finish\", {\"status\": \"done\", \"final\": best.val(data=\"data.yaml\").results_dict})\n"
                ]
            }
        ],
        "metadata": {"language_info": {"name": "python"}},
        "nbformat": 4,
        "nbformat_minor": 2
    }

    return Response(
        content=json.dumps(notebook_content, indent=2),
        media_type="application/x-ipynb+json",
        headers={"Content-Disposition": f"attachment; filename=craftbridge_train_{id}.ipynb"}
    )

@router.post("/runs/{id}/metrics")
async def notebook_metrics_callback(
    id: str,
    data: MetricCallback,
    db: Session = Depends(get_db)
):
    run = db.query(TrainingRunModel).filter(TrainingRunModel.id == id).first()
    if run:
        metrics_list = list(run.metrics or [])
        metrics_list.append(data.model_dump())
        run.metrics = metrics_list
        run.status = "running"
        db.commit()
    return {"status": "ok"}

@router.post("/runs/{id}/finish")
async def notebook_finish_callback(
    id: str,
    data: FinalFinishCallback,
    db: Session = Depends(get_db)
):
    run = db.query(TrainingRunModel).filter(TrainingRunModel.id == id).first()
    if run:
        run.status = data.status
        run.final_metrics = data.final or {}
        db.commit()
    return {"status": "finished"}

@router.get("/models")
async def list_models(db: Session = Depends(get_db)):
    models = db.query(ModelModel).all()
    if not models:
        return [
            {
                "id": "mod-1",
                "version": "yolov8n-pottery-v1.4.onnx",
                "map50": 0.884,
                "is_active": True,
                "onnx_path": "models/yolov8n_pottery_v1.4.onnx"
            },
            {
                "id": "mod-2",
                "version": "yolov8n-pottery-v1.3.onnx",
                "map50": 0.832,
                "is_active": False,
                "onnx_path": "models/yolov8n_pottery_v1.3.onnx"
            }
        ]
    return models

@router.post("/models/{id}/promote")
async def promote_model(
    id: str,
    payload: ModelPromoteRequest,
    x_forge_passphrase: Optional[str] = Header(None, alias="X-Forge-Passphrase"),
    db: Session = Depends(get_db)
):
    # Optional 2FA passphrase check per spec Section 5.1
    passphrase = payload.passphrase or x_forge_passphrase
    if passphrase and passphrase != settings.forge_passphrase:
        raise HTTPException(status_code=403, detail="Invalid Forge passphrase")

    candidate_version = f"yolov8n-pottery-v{id[:4]}.onnx"
    ok, message = await model_registry.promote_model("models/yolov8n_pottery.onnx", candidate_version)

    if not ok:
        raise HTTPException(status_code=400, detail=message)

    # Log to audit_log
    log = AuditLog(user_id="dev-user", action="promote_model", detail={"model_id": id, "version": candidate_version})
    db.add(log)
    db.commit()

    return {"status": "promoted", "version": candidate_version, "message": message}

@router.post("/models/rollback")
async def rollback_model(db: Session = Depends(get_db)):
    ok, message = await model_registry.rollback_model()
    log = AuditLog(user_id="dev-user", action="rollback_model", detail={"active_version": model_registry.active_version})
    db.add(log)
    db.commit()
    return {"status": "rolled_back", "active_version": model_registry.active_version}
