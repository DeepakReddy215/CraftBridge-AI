import pytest

VALID_TRANSITIONS = {
    "DRAFT": ["BRIEFED"],
    "BRIEFED": ["IN_PROGRESS"],
    "IN_PROGRESS": ["UPLOADED"],
    "UPLOADED": ["ANALYSED"],
    "ANALYSED": ["PREVIEWED", "REVISION_REQUESTED", "APPROVED"],
    "PREVIEWED": ["REVISION_REQUESTED", "APPROVED"],
    "REVISION_REQUESTED": ["IN_PROGRESS", "UPLOADED"],
    "APPROVED": []
}

def can_transition(current: str, next_state: str) -> bool:
    return next_state in VALID_TRANSITIONS.get(current, [])

def test_happy_path_transitions():
    assert can_transition("DRAFT", "BRIEFED") is True
    assert can_transition("BRIEFED", "IN_PROGRESS") is True
    assert can_transition("IN_PROGRESS", "UPLOADED") is True
    assert can_transition("UPLOADED", "ANALYSED") is True
    assert can_transition("ANALYSED", "APPROVED") is True

def test_invalid_transitions():
    assert can_transition("DRAFT", "APPROVED") is False
    assert can_transition("DRAFT", "UPLOADED") is False
    assert can_transition("APPROVED", "DRAFT") is False
