import { BasePage } from './BasePage.js';

export class WorkspacePage extends BasePage {
  constructor(page) {
    super(page);

    // --- Knowledge base creation (Create) ---
    this.addWebsiteUrlInput = page.getByTestId('add-website-url-input');
    this.addWebsiteSubmitButton = page.getByRole('button', { name: /^(add|submit|index)$/i });
    this.indexingStatusBanner = page.getByTestId('indexing-status-banner');
    this.indexingCompleteBadge = page.getByTestId('indexing-complete-badge');

    // --- Indexed content viewer (Read) ---
    this.indexedContentPanelToggle = page.getByTestId('indexed-content-toggle');
    this.indexedContentPanel = page.getByTestId('indexed-content-panel');
    this.indexedPageRow = page.getByTestId('indexed-page-row');

    // --- Knowledge base management (Update / Delete) ---
    this.knowledgeBaseOptionsButton = page.getByTestId('kb-options-button');
    this.deleteKnowledgeBaseMenuItem = page.getByRole('menuitem', { name: /delete/i });
    this.confirmDeleteButton = page.getByRole('button', { name: /confirm|yes,? delete/i });

    // --- AI chat ---
    this.chatInput = page.getByTestId('chat-input');
    this.chatSendButton = page.getByTestId('chat-send-button');
    this.latestChatMessage = page.getByTestId('chat-message').last();
    this.retrievedReferencesSection = page.getByTestId('retrieved-references');
    this.fallbackNotFoundMessage = page.getByText(/could not find this information/i);
  }

  // ---------- Create ----------

  /** Submits a URL to be crawled/indexed and waits for indexing to complete. */
  async addWebsite(url) {
    await this.addWebsiteUrlInput.fill(url);
    await this.addWebsiteSubmitButton.click();
    await this.waitVisible(this.indexingStatusBanner);
    await this.waitVisible(this.indexingCompleteBadge, 60_000); // crawling can take a while
  }

  // ---------- Read ----------

  async openIndexedContentPanel() {
    await this.indexedContentPanelToggle.click();
    await this.waitVisible(this.indexedContentPanel);
  }

  async indexedPageCount() {
    return this.indexedPageRow.count();
  }

  // ---------- Delete ----------

  /** Deletes the currently open knowledge base and confirms the dialog. */
  async deleteCurrentKnowledgeBase() {
    await this.knowledgeBaseOptionsButton.click();
    await this.deleteKnowledgeBaseMenuItem.click();
    await this.confirmDeleteButton.click();
  }

  // ---------- AI interaction ----------

  async askQuestion(question) {
    await this.chatInput.fill(question);
    await this.chatSendButton.click();
    await this.waitVisible(this.latestChatMessage, 20_000); // LLM response can take a few seconds
  }

  async getLatestAnswerText() {
    return this.latestChatMessage.innerText();
  }

  async hasCitation() {
    return this.retrievedReferencesSection.isVisible().catch(() => false);
  }
}
