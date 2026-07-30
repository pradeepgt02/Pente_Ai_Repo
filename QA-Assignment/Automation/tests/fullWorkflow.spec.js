import { test, expect } from '../fixtures/pageFixtures.js';
import { testUser, testWebsite, testChat } from '../config/testData.js';

// This spec demonstrates the four required automation targets running as
// one continuous session (login -> CRUD -> AI interaction -> logout),
// the way a real user would experience them. The other spec files test
// each piece in isolation with more edge cases; this one proves they work
// together end-to-end.

test('full user journey: login, add a knowledge base, ask a question, log out @smoke', async ({
  authPage,
  dashboardPage,
  workspacePage,
  page,
}) => {
  await test.step('Login', async () => {
    await authPage.login(testUser.email, testUser.password);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  await test.step('Create — add and index a website', async () => {
    await dashboardPage.clickAddWebsite();
    await workspacePage.addWebsite(testWebsite.url);
    await expect(workspacePage.indexingCompleteBadge).toBeVisible();
  });

  await test.step('Read — confirm the knowledge base is listed', async () => {
    await dashboardPage.gotoDashboard();
    await expect(dashboardPage.knowledgeBaseEntry(testWebsite.label)).toBeVisible();
  });

  await test.step('AI interaction — ask a grounded question and verify the citation', async () => {
    await dashboardPage.knowledgeBaseEntry(testWebsite.label).click();
    await workspacePage.askQuestion(testChat.question);

    const answerText = await workspacePage.getLatestAnswerText();
    expect(answerText.toLowerCase()).toMatch(testChat.expectedAnswerKeyword);
    expect(await workspacePage.hasCitation()).toBe(true);
  });

  await test.step('Delete — clean up the knowledge base created by this run', async () => {
    await workspacePage.deleteCurrentKnowledgeBase();
  });

  await test.step('Logout', async () => {
    await dashboardPage.gotoDashboard();
    await dashboardPage.logout();
    await expect(page).toHaveURL(/\/login/);
  });
});
