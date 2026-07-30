import { expect } from '@playwright/test';

/**
 * Page Object Model for Knowledge Base / Website Management (/workspace/index)
 */
export class KnowledgeBasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Locators
    this.pageHeading = page.getByRole('heading', { name: /Add a website/i });
    this.urlInput = page.getByPlaceholder('https://example.com');
    this.initialQuestionInput = page.getByPlaceholder('What is this website about?');
    this.maxPagesSelect = page.locator('select');
    this.submitButton = page.getByRole('button', { name: /Crawl and index website/i });
    // Scope modal delete button to the modal container to avoid strict mode violation
    // The modal contains heading "Delete Knowledge Base"
    this.deleteModal = page.locator('div').filter({ has: page.getByRole('heading', { name: /Delete Knowledge Base/i }) }).first();
    this.modalDeleteButton = this.deleteModal.getByRole('button', { name: 'Delete', exact: true });
    this.modalCancelButton = this.deleteModal.getByRole('button', { name: 'Cancel' });
  }

  /**
   * Navigate to Add Website page
   */
  async goto() {
    await this.page.goto('/workspace/index');
    await expect(this.pageHeading).toBeVisible({ timeout: 15000 });
  }

  /**
   * Submit website indexing form
   * @param {string} url
   * @param {string} [initialQuestion='']
   * @param {number|string} [maxPages=1]
   */
  async addWebsite(url, initialQuestion = '', maxPages = 1) {
    await expect(this.urlInput).toBeVisible({ timeout: 15000 });
    await this.urlInput.fill(url);
    if (initialQuestion) {
      await this.initialQuestionInput.fill(initialQuestion);
    }
    if (maxPages) {
      await this.maxPagesSelect.selectOption(String(maxPages));
    }
    await this.submitButton.click();
  }

  /**
   * Assert website is indexed and listed in the Knowledge Base list.
   * Allows up to 60s for the deployed crawler to complete indexing.
   * @param {string} domainOrUrl
   */
  async assertWebsiteIndexed(domainOrUrl) {
    const siteItem = this.page.getByText(domainOrUrl, { exact: false });
    await expect(siteItem.first()).toBeVisible({ timeout: 60000 });
  }

  /**
   * Delete website from Knowledge Base
   * @param {string} domainOrUrl
   */
  async deleteWebsite(domainOrUrl) {
    // Navigate to /workspace/index if not already there
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/workspace/index')) {
      await this.page.goto('/workspace/index');
      await expect(this.pageHeading).toBeVisible({ timeout: 15000 });
    }

    const siteContainer = this.page.locator('div', { hasText: domainOrUrl }).filter({
      has: this.page.locator('button[title="Delete website"]'),
    }).first();
    await siteContainer.hover();

    const deleteBtn = siteContainer.locator('button[title="Delete website"]').first();
    await deleteBtn.click();

    // Wait for the modal to appear, then click the scoped Delete button
    const deleteModal = this.page.locator('div').filter({
      has: this.page.getByRole('heading', { name: /Delete Knowledge Base/i }),
    }).first();
    await expect(deleteModal).toBeVisible({ timeout: 8000 });

    const confirmDeleteBtn = deleteModal.getByRole('button', { name: 'Delete', exact: true });
    await expect(confirmDeleteBtn).toBeVisible({ timeout: 5000 });
    await confirmDeleteBtn.click();
  }

  /**
   * Assert website is removed from Knowledge Base list
   * @param {string} domainOrUrl
   */
  async assertWebsiteDeleted(domainOrUrl) {
    const siteItem = this.page.getByText(domainOrUrl, { exact: true });
    await expect(siteItem).toHaveCount(0, { timeout: 15000 });
  }
}
