import re
from playwright.sync_api import Page, expect

class BasePage:
    """Base Page Object containing shared Playwright actions and assertions."""

    def __init__(self, page: Page):
        self.page = page

    def navigate_to(self, path: str):
        """Navigate to a relative URL path."""
        self.page.goto(path)

    def assert_url_contains(self, path_substring: str):
        """Assert current page URL contains the specified substring."""
        pattern = re.compile(r".*" + re.escape(path_substring) + r".*")
        expect(self.page).to_have_url(pattern)

    def take_screenshot(self, filepath: str):
        """Capture page screenshot."""
        self.page.screenshot(path=filepath, full_page=True)
