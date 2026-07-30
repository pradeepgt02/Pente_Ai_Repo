// Shared behavior every page object inherits from, so individual page
// classes only define locators + page-specific actions, not low-level
// waiting/navigation logic repeated in every file.

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async waitForUrlContains(fragment, options = {}) {
    await this.page.waitForURL(`**${fragment}**`, { timeout: 10_000, ...options });
  }

  /** Waits for a locator to be visible and returns it, for chaining into an assertion. */
  async waitVisible(locator, timeout = 10_000) {
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  async currentUrl() {
    return this.page.url();
  }
}
