import time
from urllib.parse import urlparse
from playwright.sync_api import Locator, Page

def wait_for_element_visible(locator: Locator, timeout_ms: int = 5000):
    """Wait until locator element becomes visible."""
    locator.wait_for(state="visible", timeout=timeout_ms)

def wait_for_element_hidden(locator: Locator, timeout_ms: int = 5000):
    """Wait until locator element is hidden."""
    locator.wait_for(state="hidden", timeout=timeout_ms)

def generate_random_email() -> str:
    """Generate unique random email for signup testing."""
    timestamp = int(time.time() * 1000)
    return f"qa_user_{timestamp}@webmind.ai"

def extract_domain_from_url(url: str) -> str:
    """Extract domain name from URL string."""
    try:
        parsed = urlparse(url)
        return parsed.netloc or url
    except Exception:
        return url
