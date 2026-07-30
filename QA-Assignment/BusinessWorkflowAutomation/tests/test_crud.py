import pytest
from utils.config import Config

@pytest.mark.crud
class TestKnowledgeBaseCRUD:
    """Knowledge Base CRUD feature tests."""

    def test_crud_lifecycle(self, login_page, dashboard_page, knowledge_base_page):
        # Authenticate / ensure registered user session
        login_page.ensure_authenticated(
            Config.TEST_USER_NAME,
            Config.TEST_USER_EMAIL,
            Config.TEST_USER_PASSWORD
        )
        dashboard_page.assert_on_dashboard()

        # 1. CREATE (Index Website)
        dashboard_page.click_add_website()
        knowledge_base_page.add_website(Config.TEST_WEBSITE_URL, max_pages=1)

        # 2. READ (Assert Indexed)
        knowledge_base_page.assert_website_indexed(Config.TEST_WEBSITE_DOMAIN)

        # 3. DELETE (Delete and Assert Removed)
        knowledge_base_page.delete_website(Config.TEST_WEBSITE_DOMAIN)
        knowledge_base_page.assert_website_deleted(Config.TEST_WEBSITE_DOMAIN)
