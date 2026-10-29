import hashlib
import json
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Type
import httpx
from pydantic import BaseModel
from app.config import settings

# Memory cache & rate-limit tracker (in addition to DB storage)
_memory_cache: Dict[str, Any] = {}
_token_buckets: Dict[str, Dict[str, float]] = {
    "gemini": {"tokens": float(settings.gemini_rpm), "last_update": time.time(), "daily_calls": 0},
    "groq": {"tokens": float(settings.groq_rpm), "last_update": time.time(), "daily_calls": 0},
}

CACHEABLE_TASKS = {"craft_brief", "workshop_guidance", "report_polish"}

# Deterministic built-in templates (Section 6.2: "always returns something usable")
TEMPLATES: Dict[str, Any] = {
    "craft_brief": {
        "summary": "Handcrafted terracotta vessel with balanced proportions, refined vertical fluting, and organic matte finish.",
        "product": "Terracotta Vase",
        "target_dimensions": "Height: 22 ± 1.5 cm, Max Diameter: 14 cm, Base: 9 cm",
        "aesthetic_notes": "Warm earthy undertones with smooth vertical fluting and satin unglazed mouth rim.",
        "palette_hex": ["#c85a20", "#14161b"],
        "clay_body_recommendation": "Refined terracotta with 15% fine grog for structural stability and low shrinkage.",
        "critical_tolerances": [
            "Base flatness < 1.5mm wobble",
            "Wall thickness uniform 5-7mm throughout belly",
            "Zero glaze crawling around rim and foot shoulder"
        ],
        "stages": [
            {
                "step": 1,
                "title": "Clay Conditioning & Centering",
                "focus": "De-airing & cone wedging",
                "checkpoint": "Centering true to wheel head within 2mm",
                "tip": "Maintain even moisture to prevent drying cracks."
            },
            {
                "step": 2,
                "title": "Pulling & Fluting Form",
                "focus": "Uniform wall graduation",
                "checkpoint": "Check 22cm height with calipers before trimming",
                "tip": "Use wooden rib for crisp fluting ribs."
            },
            {
                "step": 3,
                "title": "Slow Drying & Bisque Firing",
                "focus": "Even moisture release",
                "checkpoint": "Moisture < 2% before Cone 06 firing",
                "tip": "Wrap lip in wax resist to slow rim drying."
            },
            {
                "step": 4,
                "title": "Glazing & Vitrification",
                "focus": "Dip consistency and matte finish",
                "checkpoint": "Specific gravity 1.45 for glaze bath",
                "tip": "Sponge foot rim clean by 4mm."
            }
        ],
        "quality_checklist": [
            "No visible structural micro-cracks under 10x visual inspection",
            "Weight between 750g and 900g for ideal hand feel",
            "Base smoothed with wet chamois leather"
        ]
    },
    "report_polish": {
        "executive_summary": "Outstanding craftsmanship with solid structural integrity and graceful contouring. Surface nuances detected are characteristic of artisanal kiln firing.",
        "passed_checks": [
            "Zero structural micro-cracks detected by ONNX YOLO scan",
            "Height and diameter align within designated caliper tolerances",
            "Earthy terracotta tone meets customer palette specifications"
        ],
        "ranked_fixes": [
            {
                "priority": "finish",
                "title": "Smooth Uneven Glaze Sheen on Mid-Shoulder",
                "description": "Minor glaze accumulation variance detected on shoulder region.",
                "action_step": "Lightly buff with 400-grit diamond pad and seal with microcrystalline wax."
            },
            {
                "priority": "cosmetic",
                "title": "Clean Kiln Ash Specks from Foot Ring",
                "description": "Small ash mark located on lower foot region.",
                "action_step": "Sponge with diluted white vinegar bath."
            }
        ],
        "artisan_praise": "Your wheel centering and handle tension demonstrate veteran throwing skill. The vessel has wonderful hand feel.",
        "customer_guidance": "This piece captures the requested organic aesthetic beautifully. Minor surface nuances reflect authentic craft production."
    },
    "feedback_conversion": {
        "instruction": "Buff the glaze gloss on the left shoulder and verify base stability on a flat surface.",
        "changed_fields": {"finish": "satin_buff", "base": "flatness_check"}
    }
}

def hash_cache_key(task: str, prompt: str) -> str:
    cleaned = "".join(prompt.split())
    return hashlib.sha256(f"{task}:{cleaned}".encode("utf-8")).hexdigest()

def check_rate_limit(provider: str) -> bool:
    bucket = _token_buckets.get(provider)
    if not bucket:
        return True

    now = time.time()
    elapsed = now - bucket["last_update"]
    bucket["last_update"] = now

    max_rpm = float(settings.gemini_rpm if provider == "gemini" else settings.groq_rpm)
    max_rpd = int(settings.gemini_rpd if provider == "gemini" else settings.groq_rpd)

    # Replenish tokens (tokens/sec = max_rpm / 60)
    bucket["tokens"] = min(max_rpm, bucket["tokens"] + elapsed * (max_rpm / 60.0))

    # Daily cap check at 90% per spec Section 6.2
    if bucket["daily_calls"] >= int(0.9 * max_rpd):
        return False

    if bucket["tokens"] >= 1.0:
        bucket["tokens"] -= 1.0
        bucket["daily_calls"] += 1
        return True
    return False

def get_budget_status() -> Dict[str, Any]:
    gemini_bucket = _token_buckets["gemini"]
    groq_bucket = _token_buckets["groq"]
    return {
        "gemini_rpm_remaining": round(gemini_bucket["tokens"], 1),
        "gemini_rpd_remaining": max(0, settings.gemini_rpd - gemini_bucket["daily_calls"]),
        "groq_rpm_remaining": round(groq_bucket["tokens"], 1),
        "primary_provider": "gemini" if settings.gemini_api_key else "groq" if settings.groq_api_key else "template"
    }

async def call_gemini(prompt: str, schema: Optional[Type[BaseModel]] = None) -> Optional[Dict[str, Any]]:
    if not settings.gemini_api_key:
        return None

    if not check_rate_limit("gemini"):
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent?key={settings.gemini_api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"response_mime_type": "application/json"}
    }

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(text)
    except Exception:
        pass
    return None

async def call_groq(prompt: str) -> Optional[Dict[str, Any]]:
    if not settings.groq_api_key:
        return None

    if not check_rate_limit("groq"):
        return None

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": settings.groq_model,
        "messages": [
            {"role": "system", "content": "You are CraftBridge AI. Return strictly valid JSON."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"}
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                text = data["choices"][0]["message"]["content"]
                return json.loads(text)
    except Exception:
        pass
    return None

async def generate_json(
    task: str,
    prompt: str,
    schema: Optional[Type[BaseModel]] = None,
    images: Optional[List[str]] = None
) -> Tuple[Dict[str, Any], str]:
    """
    Unified entry point enforcing:
    1. Caching check (SHA-256)
    2. Fallback chain: Gemini (primary) -> Groq (fallback) -> Templates (deterministic)
    3. Pydantic validation & source tracking
    """
    key = hash_cache_key(task, prompt)
    if task in CACHEABLE_TASKS and key in _memory_cache:
        return _memory_cache[key], "cache"

    # Step 1: Primary - Gemini
    res = await call_gemini(prompt, schema)
    if res:
        if schema:
            try:
                validated = schema(**res).model_dump()
                _memory_cache[key] = validated
                return validated, "gemini"
            except Exception:
                pass
        else:
            _memory_cache[key] = res
            return res, "gemini"

    # Step 2: Fallback - Groq
    res = await call_groq(prompt)
    if res:
        if schema:
            try:
                validated = schema(**res).model_dump()
                _memory_cache[key] = validated
                return validated, "groq"
            except Exception:
                pass
        else:
            _memory_cache[key] = res
            return res, "groq"

    # Step 3: Last Resort - Built-in Deterministic Templates
    template_data = TEMPLATES.get(task, TEMPLATES["craft_brief"])
    _memory_cache[key] = template_data
    return template_data, "template"
