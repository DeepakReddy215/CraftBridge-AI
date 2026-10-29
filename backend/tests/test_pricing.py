import pytest
from app.services.pricing import calculate_base_cost, calculate_quality_factor, calculate_price_range

def test_worked_price_example():
    """
    Acceptance check (Milestone M6):
    Section 4.5: 'Base 495, medium, quality 86, margin 15 percent gives about Rs 720 to 845.'
    """
    base_cost = 495.0
    complexity = "Medium"
    quality_score = 86.0
    margin = 0.15

    price_low, price_high, details = calculate_price_range(
        base_cost=base_cost,
        complexity=complexity,
        quality_score=quality_score,
        margin=margin
    )

    # Verify quality factor: 0.80 + 0.40 * (86/100) = 1.144
    assert details["quality_factor"] == 1.144

    # Verify midpoint ~ 781
    assert round(details["midpoint"]) == 781

    # Verify price bounds: low ~ 718-720, high ~ 843-845
    assert 715 <= price_low <= 725
    assert 840 <= price_high <= 850
    assert price_low < price_high

def test_complexity_multipliers():
    base = 500.0
    quality = 90.0

    low_p, _, _ = calculate_price_range(base, "Low", quality)
    med_p, _, _ = calculate_price_range(base, "Medium", quality)
    high_p, _, _ = calculate_price_range(base, "High", quality)

    assert low_p < med_p < high_p
