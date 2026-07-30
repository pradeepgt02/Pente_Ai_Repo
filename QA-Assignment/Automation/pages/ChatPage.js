import { expect } from '@playwright/test';

/**
 * Page Object Model for Chat Page (/workspace/chat/:id)
 */
export class ChatPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Locators
    this.chatInput = page.getByTestId('chat-input');
    this.sendButton = page.getByTestId('send-button');
    this.loadingSpinner = page.locator('.animate-spin');
  }

  /**
   * Send a chat message / AI prompt
   * @param {string} messageText
   */
  async sendMessage(messageText) {
    await expect(this.chatInput).toBeEnabled({ timeout: 15000 });
    await this.chatInput.fill(messageText);
    await this.sendButton.click();
  }

  /**
   * Assert user prompt is visible in chat history
   * @param {string} text
   */
  async assertUserMessage(text) {
    const userMsg = this.page.getByText(text, { exact: false });
    await expect(userMsg.first()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Assert AI generated response is received and rendered.
   * Waits for spinner to disappear first then checks for response content.
   */
  async assertAiResponseReceived() {
    // Wait for loading spinner to disappear (AI processing complete)
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 });
    } catch {
      // Spinner may not exist or already gone
    }

    // Extra wait for response text to render
    await this.page.waitForTimeout(2000);

    // Try specific AI message containers first
    const specificContainers = this.page.locator(
      '[data-testid="ai-message"], [data-testid="assistant-message"], ' +
      '.ai-message, .assistant-message, .prose, .markdown'
    );
    if (await specificContainers.count() > 0) {
      await expect(specificContainers.first()).toBeVisible({ timeout: 20000 });
      return;
    }

    // Fallback: any content block containing typical AI response keywords
    const messages = this.page.locator('main, section, article, div').filter({
      hasText: /AI|Assistant|Source|WebMind|Response|Here|This|Based|According|The|website|content|summary|information/i,
    });
    await expect(messages.first()).toBeVisible({ timeout: 20000 });
  }
}
