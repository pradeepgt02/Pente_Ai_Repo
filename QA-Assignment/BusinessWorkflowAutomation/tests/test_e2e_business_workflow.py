import re
import pytest
from playwright.sync_api import expect
from utils.config import Config


@pytest.mark.e2e
class TestEndToEndBusinessWorkflow:
    """Part 8 - Complete End-to-End Business Workflow Automation.
    
    Automates the full RAG lifecycle:
    1. User Authentication (Login / Registration)
    2. Knowledge Base Ingestion (Add & Index Website)
    3. Knowledge Base Verification (Read & Validate indexing)
    4. AI RAG Query Interaction (Send prompt & verify response)
    5. Teardown & Cleanup (Delete Knowledge Base & Logout)
    """

    def test_complete_e2e_rag_workflow(
        self,
        login_page,
        dashboard_page,
        knowledge_base_page,
        chat_page
    ):
        # -------------------------------------------------------------
        # Step 1: User Authentication & Access Workspace
        # -------------------------------------------------------------
        login_page.ensure_authenticated(
            Config.TEST_USER_NAME,
            Config.TEST_USER_EMAIL,
            Config.TEST_USER_PASSWORD
        )
        dashboard_page.assert_on_dashboard()

        # -------------------------------------------------------------
        # Step 2: Knowledge Ingestion - Index New Website Source
        # -------------------------------------------------------------
        dashboard_page.click_add_website()
        knowledge_base_page.add_website(
            url=Config.TEST_WEBSITE_URL,
            initial_question="What is the purpose of this website?",
            max_pages=1
        )

        # -------------------------------------------------------------
        # Step 3: Knowledge Base Verification (Read & Validate)
        # Wait for "Indexing complete!" heading then assert KB in sidebar
        # -------------------------------------------------------------
        indexing_complete = chat_page.page.get_by_role(
            "heading", name=re.compile(r"Indexing complete", re.IGNORECASE)
        )
        expect(indexing_complete).to_be_visible(timeout=60000)
        knowledge_base_page.assert_website_indexed(Config.TEST_WEBSITE_DOMAIN)

        # -------------------------------------------------------------
        # Step 4: AI RAG Interaction Workflow
        # -------------------------------------------------------------
        dashboard_page.click_new_chat()

        # Handle KB selection if chat input is disabled
        chat_page.page.wait_for_timeout(2000)
        if chat_page.chat_input.is_disabled():
            select_kb_btn = chat_page.page.locator("button", has_text="Select knowledge base")
            if select_kb_btn.count() > 0 and select_kb_btn.first.is_visible():
                select_kb_btn.first.click()
                chat_page.page.wait_for_timeout(1000)
                kb_option = chat_page.page.locator("li, button, [role='option']").filter(
                    has_text=re.compile(r"example|http", re.IGNORECASE)
                ).first
                if kb_option.count() > 0:
                    kb_option.click()
                expect(chat_page.chat_input).to_be_enabled(timeout=15000)

        chat_page.send_message(Config.AI_PROMPT)
        chat_page.assert_user_message(Config.AI_PROMPT)
        chat_page.assert_ai_response_received()

        # -------------------------------------------------------------
        # Step 5: Teardown & Resource Cleanup (Delete KB & Logout)
        # -------------------------------------------------------------
        dashboard_page.click_add_website()
        knowledge_base_page.delete_website(Config.TEST_WEBSITE_DOMAIN)
        knowledge_base_page.assert_website_deleted(Config.TEST_WEBSITE_DOMAIN)

        dashboard_page.logout()
