import pytest
from utils.config import Config


@pytest.mark.smoke
class TestUserLogin:
    """User Login feature tests and assertions."""

    def test_login_success(self, login_page, dashboard_page):
        """TC01: Should successfully authenticate (login or signup fallback) and reach dashboard."""
        login_page.ensure_authenticated(
            Config.TEST_USER_NAME,
            Config.TEST_USER_EMAIL,
            Config.TEST_USER_PASSWORD
        )
        dashboard_page.assert_on_dashboard()

    def test_login_invalid_credentials(self, login_page):
        """TC02: Should display error for invalid credentials."""
        login_page.goto()
        login_page.login(Config.INVALID_USER_EMAIL, Config.INVALID_USER_PASSWORD)
        login_page.assert_error_message(Config.MSG_INCORRECT_CREDENTIALS)

    def test_login_empty_email(self, login_page):
        """TC03: Should show validation error when email is empty."""
        login_page.goto()
        login_page.login("", Config.TEST_USER_PASSWORD)
        login_page.assert_error_message(Config.MSG_EMPTY_EMAIL)

    def test_login_empty_password(self, login_page):
        """TC04: Should show validation error when password is empty."""
        login_page.goto()
        login_page.login(Config.TEST_USER_EMAIL, "")
        login_page.assert_error_message(Config.MSG_EMPTY_PASSWORD)
