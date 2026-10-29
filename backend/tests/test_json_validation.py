import pytest
from pydantic import ValidationError
from app.schemas.request import RequestCreate
from app.schemas.analysis import SubmissionCreate, DefectBoxSchema

def test_request_validation():
    # Valid
    req = RequestCreate(
        product="Terracotta Vase",
        budget=1200,
        colors=["#c85a20", "#14161b"]
    )
    assert req.budget == 1200

    # Invalid negative budget
    with pytest.raises(ValidationError):
        RequestCreate(product="Vase", budget=50)

def test_defect_box_schema():
    box = DefectBoxSchema(
        id="def-1",
        class_name="crack",
        confidence=0.88,
        box=[0.1, 0.2, 0.4, 0.5],
        region="upper"
    )
    assert box.region == "upper"
    assert len(box.box) == 4

def test_submission_validation():
    # Valid
    sub = SubmissionCreate(
        request_id="req-123",
        height_cm=22.5,
        material_cost=150.0,
        labour_hours=4.0,
        complexity="Medium"
    )
    assert sub.height_cm == 22.5

    # Invalid complexity
    with pytest.raises(ValidationError):
        SubmissionCreate(
            request_id="req-123",
            height_cm=22.5,
            material_cost=150.0,
            labour_hours=4.0,
            complexity="Extreme"
        )
