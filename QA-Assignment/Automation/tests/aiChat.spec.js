import { test, expect } from '../fixtures/baseFixture.js';
import { testData } from '../utils/testData.js';

test.describe('AI Interaction - Chat Functionality Tests', () => {

  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    // Authenticate user (login or signup fallback) before initiating AI chat
    await loginPage.ensureAuthenticated(
      testData.user.name,
      testData.user.email,
      testData.user.password
    );
    await dashboardPage.assertOnDashboard();
  });

  test('TC06: Should send a prompt and receive an AI generated response in chat', async ({ page, dashboardPage, knowledgeBasePage, chatPage }) => {
    // Step 1: Index a website first (AI chat requires a knowledge base)
    await dashboardPage.clickAddWebsite();
    await knowledgeBasePage.addWebsite(
      testData.website.url,
      testData.website.initialQuestion,
      1
    );

    // Step 2: Wait for indexing to complete (shown on /workspace/index page)
    // "Indexing complete!" heading appears after successful crawl
    const indexingComplete = page.getByRole('heading', { name: /Indexing complete/i });
    await expect(indexingComplete).toBeVisible({ timeout: 60000 });

    // Step 3: Confirm website appears in the sidebar KB list
    await knowledgeBasePage.assertWebsiteIndexed(testData.website.domain);

    // Step 4: Navigate to Dashboard and start a new chat session
    await dashboardPage.clickNewChat();

    // Step 5: Wait for the chat input to become enabled (KB auto-selected if only one exists)
    // or select the knowledge base manually
    await page.waitForTimeout(2000);

    const chatInputDisabled = await chatPage.chatInput.isDisabled();
    if (chatInputDisabled) {
      // Need to select a knowledge base
      const selectKbButton = page.locator('button', { hasText: /select knowledge base/i });
      if (await selectKbButton.count() > 0) {
        await selectKbButton.first().click();
        // Wait for KB options to appear
        await page.waitForTimeout(1000);
        // Click the first available KB option (the website we just indexed)
        const kbOption = page.locator('li, button, [role="option"]').filter({ hasText: testData.website.domain }).first();
        if (await kbOption.count() > 0) {
          await kbOption.click();
        } else {
          // Try clicking any available KB option
          const anyKbOption = page.locator('li, button, [role="option"]').filter({ hasText: /example|http/i }).first();
          if (await anyKbOption.count() > 0) await anyKbOption.click();
        }
        // Wait for chat input to become enabled
        await expect(chatPage.chatInput).toBeEnabled({ timeout: 15000 });
      }
    }

    // Step 6: Send AI query prompt
    await chatPage.sendMessage(testData.aiChat.prompt);

    // Step 7: Assert user prompt is visible in conversation
    await chatPage.assertUserMessage(testData.aiChat.prompt);

    // Step 8: Assert AI generated response is received
    await chatPage.assertAiResponseReceived();
  });
});
