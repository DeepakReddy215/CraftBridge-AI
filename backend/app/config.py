import os
from typing import Dict, List
from pydantic import BaseModel

class AppSettings(BaseModel):
    # App & Server
    port: int = int(os.getenv("PORT", "8000"))
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./craftbridge.db")
    allowed_origins: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:5173,http://localhost:3000,https://craftbridge-web.onrender.com"
        ).split(",")
    ]
    forge_passphrase: str = os.getenv("FORGE_PASSPHRASE", "craftbridge-pottery-forge-master-2026")
    active_model_bootstrap: str = os.getenv("ACTIVE_MODEL_BOOTSTRAP", "models/yolov8n_pottery.onnx")

    # Supabase (optional for offline / direct testing)
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_service_key: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    supabase_jwt_secret: str = os.getenv("SUPABASE_JWT_SECRET", "super-secret-jwt-key-2026")

    # AI Gateway Providers & Quotas
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    gemini_rpm: int = int(os.getenv("GEMINI_RPM", "15"))
    gemini_rpd: int = int(os.getenv("GEMINI_RPD", "250"))

    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    groq_rpm: int = int(os.getenv("GROQ_RPM", "30"))
    groq_rpd: int = int(os.getenv("GROQ_RPD", "1000"))

    # Section 4.5: Quality Weights & Penalties
    quality_weights: Dict[str, float] = {
        "structural": 35.0,
        "finish": 20.0,
        "pattern": 15.0,
        "colour": 15.0,
        "shape": 15.0,
    }

    defect_penalties: Dict[str, float] = {
        "crack": 0.25,
        "chip": 0.12,
        "uneven_glaze": 0.08,
        "stain": 0.05,
    }

    # Section 4.5: Match Formula Weights
    match_weights: Dict[str, float] = {
        "colour": 30.0,
        "pattern": 25.0,
        "type": 20.0,
        "size": 15.0,
        "style": 10.0,
    }

    # Section 4.5 & 6.2: Price Constants
    labour_hourly_rate: float = 65.0
    studio_margin: float = 0.15
    price_bound_low: float = 0.92
    price_bound_high: float = 1.08

    complexity_multipliers: Dict[str, float] = {
        "Low": 1.0,
        "Medium": 1.2,
        "High": 1.5,
    }

settings = AppSettings()
