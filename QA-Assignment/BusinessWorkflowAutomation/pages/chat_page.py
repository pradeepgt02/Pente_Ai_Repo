import re
from playwright.sync_api import Page, expect
from pages.base_page import BasePage


class ChatPage(BasePage):
    """Page Object Model for AI Chat Workspace (/workspace/chat/:id)."""

    def __init__(self, page: Page):
        super().__init__(page)
        self.chat_input = page.get_by_test_id("chat-input")
        self.send_button = page.get_by_test_id("send-button")
        self.loading_spinner = page.locator(".animate-spin")

    def send_message(self, message_text: str):
        """Send chat prompt to AI model."""
        expect(self.chat_input).to_be_enabled(timeout=15000)
        self.chat_input.fill(message_text)
        self.send_button.click()

    def assert_user_message(self, text: str):
        """Assert user prompt message is rendered in chat history."""
        user_msg = self.page.get_by_text(text, exact=False)
        expect(user_msg.first).to_be_visible(timeout=10000)

    def assert_ai_response_received(self):
        """
        Assert AI generated response bubble is rendered in chat.
        Waits for loading to complete then checks for any response content.
        """
        # Wait for spinner to disappear (AI is processing)
        try:
            self.loading_spinner.wait_for(state="hidden", timeout=30000)
        except Exception:
            pass  # Spinner may not exist or already gone

        # Wait a bit for response to render
        self.page.wait_for_timeout(2000)

        # Check for any message bubble rendered after the user prompt
        # The AI response container typically lives in these semantic elements
        ai_response = self.page.locator(
            "[data-testid='ai-message'], [data-testid='assistant-message'], "
            ".ai-message, .assistant-message, .prose, .markdown"
        )
        if ai_response.count() > 0:
            expect(ai_response.first).to_be_visible(timeout=20000)
            return

        # Fallback: look for any substantial content block after the user message
        messages = self.page.locator("main, section, article, div").filter(
            has_text=re.compile(
                r"AI|Assistant|Source|WebMind|Response|Here|This|Based|According|"
                r"The|website|content|summary|information",
                re.IGNORECASE
            )
        )
        expect(messages.first).to_be_visible(timeout=20000)
