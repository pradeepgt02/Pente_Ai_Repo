import { test, expect } from '../fixtures/pageFixtures.js';
import { testWebsite, testChat } from '../config/testData.js';

test.describe('AI Chat interaction', () => {
  test.beforeEach(async ({ loggedInPage, dashboardPage, workspacePage }) => {
    // A knowledge base must exist and be indexed before a grounded
    // question can be asked against it.
    await dashboardPage.gotoDashboard();
    await dashboardPage.clickAddWebsite();
    await workspacePage.addWebsite(testWebsite.url);
  });

  test('asking a question with a known answer returns a grounded, cited response @smoke', async ({
    workspacePage,
  }) => {
    await workspacePage.askQuestion(testChat.question);

    const answerText = await workspacePage.getLatestAnswerText();

    // Meaningful assertion, not just "a message appeared": the answer must
    // actually be relevant to the question, and must be grounded with a
    // citation — WebMind's core anti-hallucination guarantee.
    expect(answerText.toLowerCase()).toMatch(testChat.expectedAnswerKeyword);
    expect(await workspacePage.hasCitation()).toBe(true);
  });

  test('asking an unrelated question triggers the grounded fallback, not a fabricated answer', async ({
    workspacePage,
  }) => {
    await workspacePage.askQuestion(
      'What is the capital of a fictional country that does not exist?'
    );

    await expect(workspacePage.fallbackNotFoundMessage).toBeVisible();
    expect(await workspacePage.hasCitation()).toBe(false);
  });
});
