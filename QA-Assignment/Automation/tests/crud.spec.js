import { test, expect } from '../fixtures/baseFixture.js';
import { testData } from '../utils/testData.js';

test.describe('Knowledge Base - CRUD Workflow Tests', () => {

  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    // Authenticate user (login or signup fallback) before executing Knowledge Base CRUD operations
    await loginPage.ensureAuthenticated(
      testData.user.name,
      testData.user.email,
      testData.user.password
    );
    await dashboardPage.assertOnDashboard();
  });

  test('TC05: Should execute full CRUD lifecycle: Index website, Read in list, and Delete website', async ({ dashboardPage, knowledgeBasePage }) => {
    // 1. CREATE (Index Website)
    await dashboardPage.clickAddWebsite();
    await knowledgeBasePage.addWebsite(
      testData.website.url,
      testData.website.initialQuestion,
      1
    );

    // 2. READ (Verify website appears in Knowledge Base)
    await knowledgeBasePage.assertWebsiteIndexed(testData.website.domain);

    // 3. DELETE (Remove website from Knowledge Base)
    await knowledgeBasePage.deleteWebsite(testData.website.domain);
    await knowledgeBasePage.assertWebsiteDeleted(testData.website.domain);
  });
});
