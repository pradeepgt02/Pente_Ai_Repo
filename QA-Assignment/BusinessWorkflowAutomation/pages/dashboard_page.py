import re
from playwright.sync_api import Page, expect
from pages.base_page import BasePage


class DashboardPage(BasePage):
    """Page Object Model for the Dashboard Page (/dashboard)."""

    def __init__(self, page: Page):
        super().__init__(page)
        self.welcome_heading = page.get_by_role("heading", name=re.compile(r"Welcome,", re.IGNORECASE))
        self.new_chat_button = page.get_by_test_id("new-chat-button")
        self.sidebar_logout_button = page.get_by_test_id("sidebar-logout-button")

    def goto(self):
        """Navigate to Dashboard Page directly."""
        self.navigate_to("/dashboard")
        self.assert_on_dashboard()

    def assert_on_dashboard(self):
        """Assert Dashboard page is active and welcome banner is visible.
        
        If user landed on a workspace page after signup, navigate back to /dashboard.
        Note: page.url is a property (not a method) in Python Playwright.
        """
        current_url = self.page.url
        if "/dashboard" not in current_url:
            self.navigate_to("/dashboard")
        expect(self.page).to_have_url(re.compile(r".*/dashboard"), timeout=15000)
        expect(self.welcome_heading).to_be_visible(timeout=15000)

    def click_new_chat(self):
        """Click New Chat button and verify navigation to chat workspace."""
        current_url = self.page.url
        if "/dashboard" not in current_url:
            self.navigate_to("/dashboard")
            expect(self.page).to_have_url(re.compile(r".*/dashboard"), timeout=15000)
        expect(self.new_chat_button).to_be_visible(timeout=10000)
        self.new_chat_button.click()
        expect(self.page).to_have_url(re.compile(r".*/workspace/chat/.*"), timeout=15000)

    def click_add_website(self):
        """Navigate directly to Knowledge Base indexing page."""
        self.navigate_to("/workspace/index")
        expect(self.page).to_have_url(re.compile(r".*/workspace/index"), timeout=15000)

    def logout(self):
        """Perform user logout from any page (Dashboard or Workspace)."""
        logout_by_text = self.page.locator("button", has_text=re.compile(r"log.?out", re.IGNORECASE))
        
        if self.sidebar_logout_button.count() > 0 and self.sidebar_logout_button.first.is_visible():
            self.sidebar_logout_button.first.dispatch_event("click")
        elif logout_by_text.count() > 0 and logout_by_text.first.is_visible():
            logout_by_text.first.dispatch_event("click")
        else:
            profile_trigger = self.page.locator('button[title="Account profile"]').or_(
                self.page.locator("button", has_text=re.compile(r"QA Tester|@gmail\.com", re.IGNORECASE))
            )
            if profile_trigger.count() > 0 and profile_trigger.first.is_visible():
                profile_trigger.first.click()
                self.page.wait_for_timeout(500)
            
            logout_btn = self.page.get_by_test_id("logout-button").or_(logout_by_text)
            expect(logout_btn.first).to_be_visible(timeout=8000)
            logout_btn.first.dispatch_event("click")

        expect(self.page).to_have_url(re.compile(r".*/login"), timeout=15000)
