import { test, expect } from '../fixtures/pageFixtures.js';
import { testUser, invalidUser } from '../config/testData.js';

test.describe('Authentication', () => {
  test('user can log in with valid credentials and reach the Dashboard @smoke', async ({
    authPage,
    dashboardPage,
    page,
  }) => {
    await authPage.login(testUser.email, testUser.password);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(dashboardPage.welcomeHeading).toBeVisible();
    await expect(dashboardPage.welcomeHeading).toContainText(testUser.fullName);
  });

  test('login is rejected with an incorrect password', async ({ authPage }) => {
    await authPage.loginExpectingFailure(invalidUser.email, invalidUser.password);

    await expect(authPage.loginErrorMessage).toBeVisible();
    // Confirm we were NOT redirected despite the failed attempt.
    await expect(authPage.page).not.toHaveURL(/\/dashboard/);
  });

  test('logged-in user can log out and is returned to /login @smoke', async ({
    loggedInPage,
    dashboardPage,
  }) => {
    await dashboardPage.gotoDashboard();
    await dashboardPage.logout();

    await expect(loggedInPage).toHaveURL(/\/login/);

    // Regression check for DEF-002 / the offline-auth defect family:
    // going "back" after logout must not restore access to the dashboard.
    await loggedInPage.goBack();
    await expect(loggedInPage).toHaveURL(/\/login/);
  });
});
