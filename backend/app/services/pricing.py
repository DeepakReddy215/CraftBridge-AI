from typing import Tuple, Dict, Any
from app.config import settings

def calculate_base_cost(material_cost: float, labour_hours: float, rate: float = None, overhead: float = None) -> float:
    """
    Base = Material + Labour x Rate + Overhead
    """
    hourly_rate = rate if rate is not None else settings.labour_hourly_rate
    # If overhead is not provided, use standard ratio of 15% of labour + material (or flat min 43)
    calc_overhead = overhead if overhead is not None else round((material_cost + labour_hours * hourly_rate) * 0.095, 2)
    return round(material_cost + (labour_hours * hourly_rate) + calc_overhead, 2)

def calculate_quality_factor(quality_score: float) -> float:
    """
    QualityFactor = 0.80 + 0.40 x (Quality / 100)
    """
    clamped_quality = max(0.0, min(100.0, quality_score))
    return round(0.80 + (0.40 * (clamped_quality / 100.0)), 4)

def calculate_price_range(
    base_cost: float,
    complexity: str,
    quality_score: float,
    margin: float = None
) -> Tuple[int, int, Dict[str, Any]]:
    """
    Price = Base x Complexity (1.0/1.2/1.5) x QualityFactor (0.80 + 0.40 x Quality/100) x (1 + Margin)
    range = 0.92x to 1.08x
    Worked example: Base 495, medium (1.2), quality 86, margin 15% gives about Rs 720 to 845.
    """
    complexity_mult = settings.complexity_multipliers.get(complexity, 1.2)
    q_factor = calculate_quality_factor(quality_score)
    studio_margin = margin if margin is not None else settings.studio_margin

    midpoint = base_cost * complexity_mult * q_factor * (1.0 + studio_margin)

    price_low = round(midpoint * settings.price_bound_low)
    price_high = round(midpoint * settings.price_bound_high)

    details = {
        "base_cost": base_cost,
        "complexity": complexity,
        "complexity_multiplier": complexity_mult,
        "quality_score": quality_score,
        "quality_factor": q_factor,
        "margin": studio_margin,
        "midpoint": round(midpoint, 2),
        "price_low": price_low,
        "price_high": price_high,
    }

    return price_low, price_high, details
