import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { KnowledgeBasePage } from '../pages/KnowledgeBasePage.js';
import { ChatPage } from '../pages/ChatPage.js';

/**
 * Extended Custom Test Fixture with Page Objects
 * Provides reusable page instances automatically to all test files
 */
export const test = baseTest.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  knowledgeBasePage: async ({ page }, use) => {
    await use(new KnowledgeBasePage(page));
  },
  chatPage: async ({ page }, use) => {
    await use(new ChatPage(page));
  },
});

export { expect } from '@playwright/test';
