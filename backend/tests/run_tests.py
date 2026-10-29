import unittest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.pricing import calculate_price_range, calculate_quality_factor
from app.services.scoring import calculate_quality_score, calculate_match_score
from app.services.demand import calculate_indicative_demand

class TestCraftBridgeCore(unittest.TestCase):
    def test_worked_price_example(self):
        """
        Milestone M6 Acceptance Check:
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

        self.assertEqual(details["quality_factor"], 1.144)
        self.assertEqual(round(details["midpoint"]), 781)
        self.assertTrue(715 <= price_low <= 725, f"Expected price_low ~720, got {price_low}")
        self.assertTrue(840 <= price_high <= 850, f"Expected price_high ~845, got {price_high}")
        print(f"\n[PASS] Worked Price Test: Base Rs 495 -> Rs {price_low} to {price_high}")

    def test_scoring_weights_and_penalties(self):
        """
        Section 4.5: 35 Structural + 20 Finish + 15 Pattern + 15 Colour + 15 Shape
        Penalties: crack 0.25 (25%), chip 0.12 (12%), uneven glaze 0.08 (8%), stain 0.05 (5%)
        """
        subscores = {"structural": 100.0, "finish": 100.0, "pattern": 100.0, "colour": 100.0, "shape": 100.0}
        
        # Flawless
        score, _, penalty = calculate_quality_score(subscores, [])
        self.assertEqual(score, 100.0)
        self.assertEqual(penalty, 0.0)

        # Defect penalty: crack
        crack_score, _, crack_pen = calculate_quality_score(subscores, [{"class_name": "crack", "confidence": 1.0}])
        self.assertEqual(crack_pen, 25.0)
        self.assertEqual(crack_score, 75.0)

        # Defect penalty: chip
        chip_score, _, chip_pen = calculate_quality_score(subscores, [{"class_name": "chip", "confidence": 1.0}])
        self.assertEqual(chip_pen, 12.0)
        self.assertEqual(chip_score, 88.0)
        print("\n[PASS] Scoring Penalties Test: Crack -25%, Chip -12%")

    def test_match_formula(self):
        """
        Section 4.5: 30 Colour + 25 Pattern + 20 Type + 15 Size + 10 Style
        """
        match = calculate_match_score(100.0, 100.0, 100.0, 100.0, 100.0)
        self.assertEqual(match, 100.0)
        print("\n[PASS] Match Score Test: 100% Alignment verified")

    def test_indicative_demand(self):
        """
        Section 4.5: Demand: CraftBase + SeasonBonus + PriceFit
        """
        level, score = calculate_indicative_demand(price_midpoint=780.0, customer_budget=850)
        self.assertIn(level, ["Medium", "High"])
        self.assertTrue(score >= 3)
        print(f"\n[PASS] Indicative Demand Test: Level {level}, Score {score}/5")

if __name__ == "__main__":
    unittest.main()
