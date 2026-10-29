from datetime import datetime
from typing import Tuple

def calculate_indicative_demand(
    price_midpoint: float,
    customer_budget: int,
    reference_date: datetime = None
) -> Tuple[str, int]:
    """
    Demand: CraftBase (default 2) + SeasonBonus (+2 Oct-Nov, +1 Nov-Feb) + PriceFit (+1 if price <= budget)
    Scale: Low (0-2), Medium (3-4), High (5+)
    Always labelled as indicative.
    """
    craft_base = 2
    d = reference_date or datetime.now()
    month = d.month

    # Season bonus: festive / gifting season
    if month in [10, 11]: # Oct - Nov
        season_bonus = 2
    elif month in [12, 1, 2]: # Dec - Feb
        season_bonus = 1
    else:
        season_bonus = 0

    # Price fit bonus
    price_fit = 1 if price_midpoint <= float(customer_budget) else 0

    total_score = craft_base + season_bonus + price_fit

    if total_score >= 5:
        level = "High"
    elif total_score >= 3:
        level = "Medium"
    else:
        level = "Low"

    return level, total_score
