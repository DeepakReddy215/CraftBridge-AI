from typing import Dict, Any

def craft_brief_prompt(product: str, style: str, colors: list, size: str, budget: int, purpose: str, pattern: str) -> str:
    return f"""
You are an expert master ceramicist and craft technologist.
Analyze this patron bespoke request and return a structured JSON craft brief.

SPECIFICATIONS:
- Product Form: {product}
- Aesthetic Style: {style}
- Requested Palette: {', '.join(colors)}
- Target Size: {size}
- Budget Ceiling: ₹{budget}
- Purpose/Placement: {purpose}
- Texture/Pattern: {pattern}

Provide concise, highly actionable technical advice for the wheel thrower: clay body formulation, target caliper band, aesthetic notes, and 3 critical tolerances.
"""

def report_polish_prompt(product: str, quality_score: float, defects: list, match_pct: float) -> str:
    return f"""
Rewrite the following raw ceramic inspection findings into encouraging, plain-English artisan feedback and customer guidance.

Context:
- Product: {product}
- Quality Score: {quality_score}/100
- Detected Defects: {defects}
- Intent Match: {match_pct}%

Respond strictly with JSON containing:
- executive_summary
- passed_checks (array of strings)
- ranked_fixes (array of objects with priority, title, description, action_step)
- artisan_praise
- customer_guidance
"""

def feedback_conversion_prompt(customer_comment: str, product: str) -> str:
    return f"""
Convert the following customer comment on a ceramic piece into actionable workshop revision instructions for the potter.

Customer Comment: "{customer_comment}"
Product: {product}

Return JSON with:
- instruction (plain English step for artisan)
- changed_fields (which parameters need attention)
"""
