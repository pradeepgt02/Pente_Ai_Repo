import { test, expect } from '../fixtures/baseFixture.js';
import { testData } from '../utils/testData.js';

test.describe('Authentication - User Logout Tests', () => {

  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    // Authenticate user (login or signup fallback) prior to testing logout functionality
    await loginPage.ensureAuthenticated(
      testData.user.name,
      testData.user.email,
      testData.user.password
    );
    await dashboardPage.assertOnDashboard();
  });

  test('TC07: Should successfully log out user via Profile Dropdown', async ({ dashboardPage, loginPage }) => {
    // Perform logout action from Dashboard
    await dashboardPage.logout();

    // Verify user is redirected back to Login page
    await expect(loginPage.heading).toBeVisible({ timeout: 10000 });
  });
});
