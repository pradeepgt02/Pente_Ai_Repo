"""
test_webmind_utils.py
Pytest unit tests for WebMind backend business-logic functions.
10 tests covering positive, negative, and edge-case scenarios.
"""

import pytest
from webmind_utils import (
    is_valid_url,
    chunk_text,
    hash_password,
    verify_password,
    sanitize_input,
    is_duplicate_url,
    is_valid_email,
)


# ---------------------------------------------------------
# is_valid_url
# ---------------------------------------------------------
class TestIsValidUrl:
    def test_positive_valid_https_url(self):
        """[Positive] Accepts a well-formed https URL."""
        assert is_valid_url("https://www.python.org") is True

    def test_negative_malformed_url(self):
        """[Negative] Rejects a malformed URL missing proper scheme."""
        assert is_valid_url("htp:/notaurl") is False


# ---------------------------------------------------------
# chunk_text
# ---------------------------------------------------------
class TestChunkText:
    def test_positive_splits_text_into_expected_chunks(self):
        """[Positive] Splits a long string into the expected number of chunks."""
        text = "A" * 1000
        chunks = chunk_text(text, chunk_size=500, overlap=50)
        assert len(chunks) == 3


# ---------------------------------------------------------
# hash_password / verify_password
# ---------------------------------------------------------
class TestPasswordHashing:
    def test_positive_verify_correct_password(self):
        """[Positive] verify_password returns True for the correct password."""
        hashed = hash_password("Test@1234")
        assert verify_password("Test@1234", hashed) is True

    def test_negative_verify_incorrect_password(self):
        """[Negative] verify_password returns False for an incorrect password."""
        hashed = hash_password("Test@1234")
        assert verify_password("WrongPass1", hashed) is False


# ---------------------------------------------------------
# sanitize_input
# ---------------------------------------------------------
class TestSanitizeInput:
    def test_positive_plain_text_unchanged(self):
        """[Positive] Plain text with no HTML passes through unchanged."""
        assert sanitize_input("what is python") == "what is python"

    def test_negative_strips_script_tags(self):
        """[Negative] Removes <script> payloads entirely (XSS prevention)."""
        result = sanitize_input("<script>alert(1)</script>hello")
        assert "<script>" not in result
        assert "hello" in result


# ---------------------------------------------------------
# is_duplicate_url
# ---------------------------------------------------------
class TestIsDuplicateUrl:
    def test_positive_detects_exact_duplicate(self):
        """[Positive] Detects an exact duplicate URL in the existing list."""
        assert is_duplicate_url(["https://www.python.org"], "https://www.python.org") is True


# ---------------------------------------------------------
# is_valid_email
# ---------------------------------------------------------
class TestIsValidEmail:
    def test_positive_valid_email(self):
        """[Positive] Accepts a standard, well-formed email address."""
        assert is_valid_email("pradeep@example.com") is True

    def test_negative_missing_at_symbol(self):
        """[Negative] Rejects an email missing the '@' symbol."""
        assert is_valid_email("plainaddress") is False
