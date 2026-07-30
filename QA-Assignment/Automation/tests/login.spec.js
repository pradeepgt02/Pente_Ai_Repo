import { test, expect } from '../fixtures/baseFixture.js';
import { testData } from '../utils/testData.js';

test.describe('Authentication - User Login Tests', () => {

  test('TC01: Should successfully authenticate and reach dashboard (login or signup fallback)', async ({ loginPage, dashboardPage }) => {
    // Uses ensureAuthenticated: tries login first, falls back to signup if credentials missing
    await loginPage.ensureAuthenticated(
      testData.user.name,
      testData.user.email,
      testData.user.password
    );
    await dashboardPage.assertOnDashboard();
  });

  test('TC02: Should display error message when logging in with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(testData.invalidUser.email, testData.invalidUser.password);
    await loginPage.assertErrorMessage(testData.errorMessages.incorrectCredentials);
  });

  test('TC03: Should show validation error when email is empty', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', testData.user.password);
    await loginPage.assertErrorMessage(testData.errorMessages.emptyEmail);
  });

  test('TC04: Should show validation error when password is empty', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(testData.user.email, '');
    await loginPage.assertErrorMessage(testData.errorMessages.emptyPassword);
  });
});
