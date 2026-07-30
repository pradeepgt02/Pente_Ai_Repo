"""
webmind_utils.py
Reusable backend business-logic functions for WebMind
(URL validation, text chunking, password hashing, input sanitization, duplicate detection)
"""

import re
import hashlib
import hmac
from urllib.parse import urlparse


def is_valid_url(url: str) -> bool:
    """Validates that a URL is well-formed and uses http/https."""
    if not isinstance(url, str) or url.strip() == "":
        return False
    try:
        parsed = urlparse(url.strip())
        return parsed.scheme in ("http", "https") and bool(parsed.netloc)
    except Exception:
        return False


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50):
    """
    Splits crawled page text into overlapping chunks for embedding/indexing.

    Args:
        text: The full page text to split.
        chunk_size: Maximum characters per chunk.
        overlap: Number of overlapping characters between consecutive chunks.

    Returns:
        List of text chunks (strings). Empty input returns an empty list.
    """
    if not isinstance(text, str) or text.strip() == "":
        return []
    if chunk_size <= 0:
        raise ValueError("chunk_size must be a positive integer")
    if overlap < 0 or overlap >= chunk_size:
        raise ValueError("overlap must be >= 0 and less than chunk_size")

    text = text.strip()
    chunks = []
    start = 0
    text_len = len(text)
    step = chunk_size - overlap

    while start < text_len:
        end = min(start + chunk_size, text_len)
        chunks.append(text[start:end])
        if end == text_len:
            break
        start += step

    return chunks


def hash_password(password: str) -> str:
    """Hashes a password using SHA-256 with a fixed application salt (for demonstration)."""
    if not isinstance(password, str) or password == "":
        raise ValueError("Password must be a non-empty string")
    salt = "webmind_static_salt"
    return hashlib.sha256((salt + password).encode("utf-8")).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    """Verifies a plaintext password against a stored hash using constant-time comparison."""
    if not isinstance(password, str) or not isinstance(hashed, str):
        return False
    try:
        candidate_hash = hash_password(password)
    except ValueError:
        return False
    return hmac.compare_digest(candidate_hash, hashed)


def sanitize_input(text: str) -> str:
    """
    Strips potentially dangerous HTML/script content from user input
    (e.g., chat messages, website URLs) before storage or rendering.
    """
    if not isinstance(text, str):
        return ""
    # Remove <script>...</script> blocks entirely
    text = re.sub(r"<script.*?>.*?</script>", "", text, flags=re.IGNORECASE | re.DOTALL)
    # Strip any remaining HTML tags
    text = re.sub(r"<[^>]+>", "", text)
    return text.strip()


def is_duplicate_url(existing_urls, new_url: str) -> bool:
    """
    Determines whether new_url already exists in existing_urls,
    normalizing scheme/host case and trailing slashes.
    """
    if not isinstance(existing_urls, (list, tuple, set)) or not isinstance(new_url, str):
        return False

    def normalize(u: str) -> str:
        return u.strip().lower().rstrip("/")

    target = normalize(new_url)
    return any(normalize(u) == target for u in existing_urls)


def is_valid_email(email: str) -> bool:
    """Validates an email address format on the backend (mirrors frontend validation)."""
    if not isinstance(email, str) or email.strip() == "":
        return False
    pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    return re.match(pattern, email.strip()) is not None
