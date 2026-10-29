from typing import List, Dict, Any
from app.services.ai_gateway import generate_json
from app.services.llm_prompts import report_polish_prompt

def generate_rule_based_findings(
    defects: List[Dict[str, Any]],
    match_detail: Dict[str, Any],
    quality_score: float
) -> List[Dict[str, Any]]:
    """
    Python rules produce raw findings strictly ordered by priority:
    1. structural -> 2. mismatch -> 3. finish -> 4. cosmetic
    """
    findings = []

    # Priority 1: Structural (cracks, structural chips)
    for d in defects:
        cls_name = d.get("class_name", "").lower()
        if cls_name == "crack":
            findings.append({
                "priority": "structural",
                "title": f"Hairline Stress Crack in {d.get('region', 'middle').capitalize()} Wall",
                "description": f"Micro-crack identified in {d.get('region', 'middle')} section (confidence {int(d.get('confidence', 0)*100)}%).",
                "action_step": "Reject structural integrity or seal with food-grade epoxy prior to testing.",
            })

    # Priority 2: Mismatch
    if match_detail.get("colour_score", 100) < 70:
        findings.append({
            "priority": "mismatch",
            "title": "Glaze Shade Drift from Swatch",
            "description": "Fired glaze hue deviates from customer requested color palette by > 5 ΔE.",
            "action_step": "Adjust oxide wash balance in subsequent kiln batches.",
        })

    # Priority 3: Finish (uneven glaze)
    for d in defects:
        cls_name = d.get("class_name", "").lower()
        if cls_name in ["uneven_glaze", "crawling"]:
            findings.append({
                "priority": "finish",
                "title": f"Uneven Glaze Sheen on {d.get('region', 'middle').capitalize()} Section",
                "description": f"A localized glaze thickness variance was detected in the {d.get('region', 'middle')} zone.",
                "action_step": "Buff gently with 400-grit diamond polishing pad and apply microcrystalline wax.",
            })

    # Priority 4: Cosmetic (stains, kiln ash)
    for d in defects:
        cls_name = d.get("class_name", "").lower()
        if cls_name in ["stain", "pinhole"]:
            findings.append({
                "priority": "cosmetic",
                "title": f"Surface Kiln Ash Residue near {d.get('region', 'bottom').capitalize()}",
                "description": f"Minor firing deposit mark noted on {d.get('region', 'bottom')} surface.",
                "action_step": "Sponge with a diluted white vinegar bath or fine pumice rub.",
            })

    return findings

async def build_report(
    product: str,
    quality_score: float,
    defects: List[Dict[str, Any]],
    match_pct: float,
    match_detail: Dict[str, Any]
) -> Dict[str, Any]:
    raw_findings = generate_rule_based_findings(defects, match_detail, quality_score)

    prompt = report_polish_prompt(product, quality_score, defects, match_pct)
    llm_report, _ = await generate_json("report_polish", prompt)

    # Guarantee rule-based findings are merged if LLM omitted them
    if not llm_report.get("ranked_fixes"):
        llm_report["ranked_fixes"] = raw_findings

    return llm_report
