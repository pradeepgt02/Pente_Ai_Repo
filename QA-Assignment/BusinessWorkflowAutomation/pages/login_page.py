import re
import time
from playwright.sync_api import Page, expect
from pages.base_page import BasePage


class LoginPage(BasePage):
    """Page Object Model for the Login Page (/login)."""

    def __init__(self, page: Page):
        super().__init__(page)
        self.heading = page.get_by_role("heading", name="Account Login")
        self.email_input = page.get_by_test_id("login-email")
        self.password_input = page.get_by_test_id("login-password")
        self.login_button = page.get_by_test_id("login-button")
        self.signup_link = page.get_by_test_id("signup-button")

    def goto(self):
        """Navigate to Login Page and verify heading is displayed."""
        self.navigate_to("/login")
        expect(self.heading).to_be_visible(timeout=15000)

    def login(self, email: str = "", password: str = ""):
        """Perform login with given credentials."""
        self.email_input.clear()
        if email:
            self.email_input.fill(email)

        self.password_input.clear()
        if password:
            self.password_input.fill(password)

        self.login_button.click()

    def ensure_authenticated(self, name: str, email: str, password: str):
        """
        Attempts login; if account is not registered or credentials fail,
        registers a new unique account via signup and logs in automatically.
        """
        self.goto()
        self.login(email, password)

        try:
            expect(self.page).to_have_url(re.compile(r".*/dashboard"), timeout=8000)
            return  # Login succeeded – done
        except Exception:
            pass  # Login failed – proceed to signup

        # Generate a unique email using timestamp to avoid "already registered" conflicts
        timestamp = int(time.time())
        unique_email = f"pnexgt22005+qa{timestamp}@gmail.com"

        self.navigate_to("/signup")
        expect(self.page.get_by_role("heading", name=re.compile(r"Create your WebMind account", re.IGNORECASE))).to_be_visible(timeout=10000)

        self.page.get_by_test_id("signup-name").fill(name)
        self.page.get_by_test_id("signup-email").fill(unique_email)
        self.page.get_by_test_id("signup-password").fill(password)
        # Wait briefly for password-strength checklist to settle before filling confirm
        self.page.wait_for_timeout(500)
        self.page.get_by_test_id("signup-confirm-password").fill(password)
        self.page.wait_for_timeout(500)
        self.page.get_by_test_id("signup-submit-button").click()

        expect(self.page).to_have_url(re.compile(r".*/dashboard"), timeout=15000)

    def assert_login_success(self):
        """Assert user is redirected to Dashboard upon successful login."""
        expect(self.page).to_have_url(re.compile(r".*/dashboard"), timeout=15000)

    def assert_error_message(self, expected_message: str):
        """Assert error message alert is displayed with expected text."""
        error_element = self.page.get_by_text(expected_message)
        expect(error_element).to_be_visible(timeout=8000)
