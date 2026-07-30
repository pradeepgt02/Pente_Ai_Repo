import re
import pytest
from playwright.sync_api import expect
from utils.config import Config


@pytest.mark.chat
class TestAIChatInteraction:
    """AI Chat interaction feature tests."""

    def test_ai_chat_response(self, login_page, dashboard_page, knowledge_base_page, chat_page):
        # Step 1: Authenticate / ensure registered user session
        login_page.ensure_authenticated(
            Config.TEST_USER_NAME,
            Config.TEST_USER_EMAIL,
            Config.TEST_USER_PASSWORD
        )
        dashboard_page.assert_on_dashboard()

        # Step 2: Index a website first (AI chat requires a knowledge base)
        dashboard_page.click_add_website()
        knowledge_base_page.add_website(
            url=Config.TEST_WEBSITE_URL,
            initial_question="What is the purpose of this website?",
            max_pages=1
        )

        # Step 3: Wait for "Indexing complete!" heading confirming crawl finished
        indexing_complete = chat_page.page.get_by_role(
            "heading", name=re.compile(r"Indexing complete", re.IGNORECASE)
        )
        expect(indexing_complete).to_be_visible(timeout=60000)

        # Step 4: Confirm website appears in the sidebar KB list
        knowledge_base_page.assert_website_indexed(Config.TEST_WEBSITE_DOMAIN)

        # Step 5: Navigate to Dashboard and Start new chat
        dashboard_page.click_new_chat()

        # Step 6: Handle KB selection if chat input is disabled
        chat_page.page.wait_for_timeout(2000)

        if chat_page.chat_input.is_disabled():
            select_kb_btn = chat_page.page.locator("button", has_text="Select knowledge base")
            if select_kb_btn.count() > 0 and select_kb_btn.first.is_visible():
                select_kb_btn.first.click()
                chat_page.page.wait_for_timeout(1000)
                # Click any available KB option in the dropdown
                kb_option = chat_page.page.locator("li, button, [role='option']").filter(
                    has_text=re.compile(r"example|http", re.IGNORECASE)
                ).first
                if kb_option.count() > 0:
                    kb_option.click()
                expect(chat_page.chat_input).to_be_enabled(timeout=15000)

        # Step 7: Send AI query prompt
        chat_page.send_message(Config.AI_PROMPT)

        # Step 8: Assert user prompt & AI response
        chat_page.assert_user_message(Config.AI_PROMPT)
        chat_page.assert_ai_response_received()
