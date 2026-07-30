import os
import sys
import pytest
from pathlib import Path
from playwright.sync_api import sync_playwright, Page, BrowserContext

# Dynamically add project root directory to sys.path so modules like utils & pages are resolved
root_dir = Path(__file__).parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from utils.config import Config
from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage
from pages.knowledge_base_page import KnowledgeBasePage
from pages.chat_page import ChatPage


@pytest.fixture(scope="session")
def browser_context():
    """Session-scoped Playwright browser context."""
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        )
        context = browser.new_context(
            base_url=Config.BASE_URL,
            viewport={"width": 1280, "height": 720},
            ignore_https_errors=True
        )
        # Increase default timeouts for deployed app network latency
        context.set_default_timeout(30000)
        context.set_default_navigation_timeout(30000)
        yield context
        context.close()
        browser.close()


@pytest.fixture(scope="function")
def page(browser_context: BrowserContext):
    """Function-scoped fresh page instance."""
    page = browser_context.new_page()
    yield page
    page.close()


@pytest.fixture
def login_page(page: Page):
    """Fixture providing initialized LoginPage instance."""
    return LoginPage(page)


@pytest.fixture
def dashboard_page(page: Page):
    """Fixture providing initialized DashboardPage instance."""
    return DashboardPage(page)


@pytest.fixture
def knowledge_base_page(page: Page):
    """Fixture providing initialized KnowledgeBasePage instance."""
    return KnowledgeBasePage(page)


@pytest.fixture
def chat_page(page: Page):
    """Fixture providing initialized ChatPage instance."""
    return ChatPage(page)


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Capture failure screenshots automatically."""
    outcome = yield
    report = outcome.get_result()
    if report.when == "call" and report.failed:
        page = item.funcargs.get("page")
        if page:
            screenshots_dir = Path(__file__).parent.parent / "screenshots"
            screenshots_dir.mkdir(exist_ok=True)
            screenshot_path = screenshots_dir / f"failure_{item.name}.png"
            try:
                page.screenshot(path=str(screenshot_path), full_page=True)
            except Exception:
                pass
