import pytest
from app.services.scoring import calculate_quality_score, calculate_match_score

def test_flawless_quality_score():
    subscores = {
        "structural": 100.0,
        "finish": 100.0,
        "pattern": 100.0,
        "colour": 100.0,
        "shape": 100.0
    }
    defects = []
    score, norm_subscores, penalty = calculate_quality_score(subscores, defects)
    assert score == 100.0
    assert penalty == 0.0

def test_defect_penalties():
    subscores = {
        "structural": 100.0,
        "finish": 100.0,
        "pattern": 100.0,
        "colour": 100.0,
        "shape": 100.0
    }
    # Crack penalty: 0.25 * 100 = 25 pts
    defects_with_crack = [{"class_name": "crack", "confidence": 1.0}]
    score, _, penalty = calculate_quality_score(subscores, defects_with_crack)
    assert penalty == 25.0
    assert score == 75.0

    # Chip penalty: 0.12 * 100 = 12 pts
    defects_with_chip = [{"class_name": "chip", "confidence": 1.0}]
    score, _, penalty = calculate_quality_score(subscores, defects_with_chip)
    assert penalty == 12.0
    assert score == 88.0

def test_match_score_formula():
    # 30 Colour + 25 Pattern + 20 Type + 15 Size + 10 Style
    match = calculate_match_score(
        colour_score=100.0,
        pattern_score=100.0,
        type_score=100.0,
        size_score=100.0,
        style_score=100.0
    )
    assert match == 100.0

    # Half scores
    match_half = calculate_match_score(50.0, 50.0, 50.0, 50.0, 50.0)
    assert match_half == 50.0
