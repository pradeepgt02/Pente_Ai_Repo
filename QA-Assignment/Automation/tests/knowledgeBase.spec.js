import { test, expect } from '../fixtures/pageFixtures.js';
import { testWebsite } from '../config/testData.js';

// CRUD mapping for WebMind's core "knowledge base" resource:
//   Create -> submit a URL and crawl/index it
//   Read   -> the new KB appears on the Dashboard, and its indexed pages
//             are visible in the Indexed Content panel
//   Update -> WebMind has no in-place KB edit; re-submitting the same URL
//             is the closest analogue (covered separately in TC-KB-005 /
//             REG_0xx as a duplicate-detection case, not here)
//   Delete -> the KB is removed and no longer appears on the Dashboard

test.describe('Knowledge Base CRUD workflow', () => {
  test.beforeEach(async ({ loggedInPage, dashboardPage }) => {
    await dashboardPage.gotoDashboard();
  });

  test('user can create a knowledge base by indexing a website @smoke', async ({
    dashboardPage,
    workspacePage,
  }) => {
    await dashboardPage.clickAddWebsite();
    await workspacePage.addWebsite(testWebsite.url);

    await expect(workspacePage.indexingCompleteBadge).toBeVisible();
  });

  test('newly created knowledge base is readable on the Dashboard and in Indexed Content', async ({
    dashboardPage,
    workspacePage,
  }) => {
    await dashboardPage.clickAddWebsite();
    await workspacePage.addWebsite(testWebsite.url);

    // Read #1 — appears in the Dashboard's KB list
    await dashboardPage.gotoDashboard();
    await expect(dashboardPage.knowledgeBaseEntry(testWebsite.label)).toBeVisible();

    // Read #2 — indexed pages are listed with real content, not an empty shell
    await workspacePage.openIndexedContentPanel();
    const pageCount = await workspacePage.indexedPageCount();
    expect(pageCount).toBeGreaterThan(0);
  });

  test('user can delete a knowledge base and it no longer appears on the Dashboard', async ({
    dashboardPage,
    workspacePage,
  }) => {
    await dashboardPage.clickAddWebsite();
    await workspacePage.addWebsite(testWebsite.url);

    await workspacePage.deleteCurrentKnowledgeBase();

    await dashboardPage.gotoDashboard();
    await expect(dashboardPage.knowledgeBaseEntry(testWebsite.label)).toHaveCount(0);
  });
});
