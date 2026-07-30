import os
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load environment variables from .env
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class Config:
    """Centralized configuration and environment settings."""
    BASE_URL = os.getenv("BASE_URL", "https://claysys-rag-project.vercel.app/")
    TEST_USER_EMAIL = os.getenv("TEST_USER_EMAIL", "pnexgt22005@gmail.com")
    TEST_USER_PASSWORD = os.getenv("TEST_USER_PASSWORD", "Pnex@gt2")
    TEST_USER_NAME = os.getenv("TEST_USER_NAME", "QA Tester")
    TEST_WEBSITE_URL = os.getenv("TEST_WEBSITE_URL", "https://example.com")

    # Derive domain from website URL (e.g., "https://example.com" -> "example.com")
    TEST_WEBSITE_DOMAIN = urlparse(TEST_WEBSITE_URL).netloc or "example.com"

    # Test Data Datasets
    INVALID_USER_EMAIL = "invalid.user@webmind.ai"
    INVALID_USER_PASSWORD = "WrongPassword123!"

    AI_PROMPT = "Summarize the core concepts of this website."

    # Expected Error Messages (exact text from the deployed UI)
    MSG_EMPTY_EMAIL = "Email cannot be empty"
    MSG_EMPTY_PASSWORD = "Password cannot be empty"
    MSG_INCORRECT_CREDENTIALS = "Incorrect credentials"
