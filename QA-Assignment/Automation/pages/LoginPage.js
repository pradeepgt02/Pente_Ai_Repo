import { expect } from '@playwright/test';

/**
 * Page Object Model for the Login Page (/login)
 */
export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Accessible and reliable locators matching existing WebMind UI
    this.heading = page.getByRole('heading', { name: 'Account Login' });
    this.emailInput = page.getByTestId('login-email');
    this.passwordInput = page.getByTestId('login-password');
    this.loginButton = page.getByTestId('login-button');
    this.signupButton = page.getByTestId('signup-button');
  }

  /**
   * Navigate to Login page
   */
  async goto() {
    await this.page.goto('/login');
    await expect(this.heading).toBeVisible({ timeout: 15000 });
  }

  /**
   * Perform login action
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.emailInput.clear();
    if (email !== undefined && email !== null && email !== '') {
      await this.emailInput.fill(email);
    }
    await this.passwordInput.clear();
    if (password !== undefined && password !== null && password !== '') {
      await this.passwordInput.fill(password);
    }
    await this.loginButton.click();
  }

  /**
   * Ensure authenticated: try login first, fallback to signup with unique email.
   * This handles the case where the configured credentials don't exist on the server.
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  async ensureAuthenticated(name, email, password) {
    await this.goto();
    await this.login(email, password);

    try {
      await expect(this.page).toHaveURL(/.*\/dashboard/, { timeout: 8000 });
      return; // Login succeeded
    } catch {
      // Login failed – fallback to signup with unique timestamped email
    }

    const timestamp = Date.now();
    const uniqueEmail = `pnexgt22005+qa${timestamp}@gmail.com`;

    await this.page.goto('/signup');
    await expect(this.page.getByRole('heading', { name: /Create your WebMind account/i })).toBeVisible({ timeout: 10000 });

    await this.page.getByTestId('signup-name').fill(name);
    await this.page.getByTestId('signup-email').fill(uniqueEmail);
    await this.page.getByTestId('signup-password').fill(password);
    // Brief pause for password-strength UI to settle before filling confirm
    await this.page.waitForTimeout(500);
    await this.page.getByTestId('signup-confirm-password').fill(password);
    await this.page.waitForTimeout(500);
    await this.page.getByTestId('signup-submit-button').click();

    await expect(this.page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  }

  /**
   * Assert login is successful and redirects to dashboard
   */
  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  }

  /**
   * Assert error message is displayed on screen
   * @param {string} expectedMessage
   */
  async assertErrorMessage(expectedMessage) {
    const errorElement = this.page.getByText(expectedMessage);
    await expect(errorElement).toBeVisible({ timeout: 8000 });
  }

  /**
   * Clear input fields
   */
  async clearFields() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }
}
