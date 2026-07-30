import re
from playwright.sync_api import Page, expect
from pages.base_page import BasePage


class KnowledgeBasePage(BasePage):
    """Page Object Model for Knowledge Base Management (/workspace/index)."""

    def __init__(self, page: Page):
        super().__init__(page)
        self.page_heading = page.get_by_role("heading", name=re.compile(r"Add a website", re.IGNORECASE))
        self.url_input = page.get_by_placeholder("https://example.com")
        self.initial_question_input = page.get_by_placeholder("What is this website about?")
        self.max_pages_select = page.locator("select")
        self.submit_button = page.get_by_role("button", name=re.compile(r"Crawl and index website", re.IGNORECASE))

    def _get_delete_modal(self):
        """Get the scoped delete confirmation modal to avoid strict mode violation."""
        return self.page.locator("div").filter(
            has=self.page.get_by_role("heading", name=re.compile(r"Delete Knowledge Base", re.IGNORECASE))
        ).first

    def goto(self):
        """Navigate to Add Website / Knowledge Base indexing page."""
        self.navigate_to("/workspace/index")
        expect(self.page_heading).to_be_visible(timeout=15000)

    def add_website(self, url: str, initial_question: str = "", max_pages: int = 1):
        """Fill and submit website indexing form."""
        expect(self.url_input).to_be_visible(timeout=15000)
        self.url_input.fill(url)
        if initial_question:
            self.initial_question_input.fill(initial_question)
        if max_pages:
            self.max_pages_select.select_option(str(max_pages))
        self.submit_button.click()

    def assert_website_indexed(self, domain_or_url: str):
        """Assert website is indexed and listed in the Knowledge Base list.
        Waits up to 60s for crawling/indexing to complete on deployed infra.
        """
        site_item = self.page.get_by_text(domain_or_url, exact=False)
        expect(site_item.first).to_be_visible(timeout=60000)

    def delete_website(self, domain_or_url: str):
        """Delete an indexed website from Knowledge Base list."""
        # Navigate to /workspace/index if not already there
        current_url = self.page.url  # property, no parentheses
        if "/workspace/index" not in current_url:
            self.navigate_to("/workspace/index")
            expect(self.page_heading).to_be_visible(timeout=15000)

        site_container = self.page.locator("div", has_text=domain_or_url).filter(
            has=self.page.locator('button[title="Delete website"]')
        ).first
        site_container.hover()

        delete_btn = site_container.locator('button[title="Delete website"]').first
        delete_btn.click()

        # Wait for modal and click the scoped "Delete" button inside the modal
        modal = self._get_delete_modal()
        expect(modal).to_be_visible(timeout=8000)
        confirm_btn = modal.get_by_role("button", name="Delete", exact=True)
        expect(confirm_btn).to_be_visible(timeout=5000)
        confirm_btn.click()

    def assert_website_deleted(self, domain_or_url: str):
        """Assert website is removed from Knowledge Base list."""
        site_item = self.page.get_by_text(domain_or_url, exact=True)
        expect(site_item).to_have_count(0, timeout=15000)
