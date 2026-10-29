from typing import Dict, List, Any, Tuple
from app.config import settings

def calculate_quality_score(
    subscores: Dict[str, float],
    defects: List[Dict[str, Any]]
) -> Tuple[float, Dict[str, float], float]:
    """
    Quality formula: 35 Structural + 20 Finish + 15 Pattern + 15 Colour + 15 Shape
    Penalties: crack 0.25 (25%), chip 0.12 (12%), uneven glaze 0.08 (8%), stain 0.05 (5%)
    """
    weights = settings.quality_weights
    structural = subscores.get("structural", 100.0)
    finish = subscores.get("finish", 100.0)
    pattern = subscores.get("pattern", 100.0)
    colour = subscores.get("colour", 100.0)
    shape = subscores.get("shape", 100.0)

    # Base weighted sum (out of 100)
    base_score = (
        (structural * weights["structural"] / 100.0) +
        (finish * weights["finish"] / 100.0) +
        (pattern * weights["pattern"] / 100.0) +
        (colour * weights["colour"] / 100.0) +
        (shape * weights["shape"] / 100.0)
    )

    # Calculate penalties from detected defects
    total_penalty_pct = 0.0
    for defect in defects:
        cls_name = defect.get("class_name", "").lower()
        penalty = settings.defect_penalties.get(cls_name, 0.0)
        confidence = defect.get("confidence", 1.0)
        total_penalty_pct += penalty * confidence

    # Penalty scales against the 100 max score
    penalty_deduction = round(total_penalty_pct * 100.0, 2)
    final_score = max(0.0, min(100.0, round(base_score - penalty_deduction, 1)))

    normalized_subscores = {
        "structural": round(structural, 1),
        "finish": round(finish, 1),
        "pattern": round(pattern, 1),
        "colour": round(colour, 1),
        "shape": round(shape, 1),
    }

    return final_score, normalized_subscores, penalty_deduction

def calculate_match_score(
    colour_score: float,
    pattern_score: float,
    type_score: float,
    size_score: float,
    style_score: float
) -> float:
    """
    Match formula: 30 Colour + 25 Pattern + 20 Type + 15 Size + 10 Style
    """
    c = max(0.0, min(100.0, colour_score)) * (30.0 / 100.0)
    p = max(0.0, min(100.0, pattern_score)) * (25.0 / 100.0)
    t = max(0.0, min(100.0, type_score)) * (20.0 / 100.0)
    sz = max(0.0, min(100.0, size_score)) * (15.0 / 100.0)
    st = max(0.0, min(100.0, style_score)) * (10.0 / 100.0)

    return round(c + p + t + sz + st, 1)
