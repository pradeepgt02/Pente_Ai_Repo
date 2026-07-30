import { test as base } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { WorkspacePage } from '../pages/WorkspacePage.js';

// Extending Playwright's base `test` with our page objects means every
// spec just destructures what it needs (e.g. `{ authPage, dashboardPage }`)
// instead of re-instantiating `new AuthPage(page)` in every file. This is
// the main mechanism that keeps the framework DRY and "reusable methods"
// rather than copy-pasted setup per test.
export const test = base.extend({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  workspacePage: async ({ page }, use) => {
    await use(new WorkspacePage(page));
  },

  // A pre-authenticated page: any spec that lists `loggedInPage` as a
  // fixture starts already logged in, without repeating login steps.
  loggedInPage: async ({ page }, use) => {
    const authPage = new AuthPage(page);
    const { testUser } = await import('../config/testData.js');
    await authPage.login(testUser.email, testUser.password);
    await use(page);
  },
});

export { expect } from '@playwright/test';
