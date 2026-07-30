import re
from playwright.sync_api import Page, expect
from pages.base_page import BasePage

class SignupPage(BasePage):
    """Page Object Model for the Signup Page (/signup)."""

    def __init__(self, page: Page):
        super().__init__(page)
        self.heading = page.get_by_role("heading", name=re.compile(r"Create your WebMind account", re.IGNORECASE))
        self.name_input = page.get_by_test_id("signup-name")
        self.email_input = page.get_by_test_id("signup-email")
        self.password_input = page.get_by_test_id("signup-password")
        self.confirm_password_input = page.get_by_test_id("signup-confirm-password")
        self.submit_button = page.get_by_test_id("signup-submit-button")

    def goto(self):
        """Navigate to Signup Page."""
        self.navigate_to("/signup")
        expect(self.heading).to_be_visible()

    def signup(self, name: str, email: str, password: str, confirm_password: str = None):
        """Perform signup with registration details."""
        if confirm_password is None:
            confirm_password = password

        self.name_input.clear()
        self.name_input.fill(name)

        self.email_input.clear()
        self.email_input.fill(email)

        self.password_input.clear()
        self.password_input.fill(password)

        self.confirm_password_input.clear()
        self.confirm_password_input.fill(confirm_password)

        self.submit_button.click()

    def assert_signup_success(self):
        """Assert user is redirected to Dashboard upon successful signup."""
        expect(self.page).to_have_url(re.compile(r".*/dashboard"), timeout=10000)
