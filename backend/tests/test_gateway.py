import pytest
from app.services.ai_gateway import generate_json, check_rate_limit, _token_buckets

@pytest.mark.asyncio
async def test_template_fallback_without_keys():
    """
    Acceptance check (Milestone M3): works with AI keys removed.
    """
    data, source = await generate_json(
        task="craft_brief",
        prompt="Test prompt without API keys"
    )
    assert source in ["template", "cache"]
    assert "summary" in data
    assert "target_dimensions" in data
    assert "stages" in data

def test_token_bucket_limit():
    _token_buckets["gemini"]["tokens"] = 0.5
    _token_buckets["gemini"]["daily_calls"] = 0
    # Should allow 0 tokens when under 1.0
    allowed = check_rate_limit("gemini")
    assert allowed is False

    # Replenish
    _token_buckets["gemini"]["tokens"] = 5.0
    allowed = check_rate_limit("gemini")
    assert allowed is True
