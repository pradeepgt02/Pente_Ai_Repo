import { BasePage } from './BasePage.js';

// NOTE ON SELECTORS: this framework is written against data-testid hooks
// (e.g. data-testid="login-email-input") as a best practice — they're
// stable across CSS/copy changes, unlike text or class selectors. The
// exact attribute names below are placeholders matching the app's
// documented field names; confirm/update them against the real DOM
// (e.g. via `npm run codegen`) before the first live run.

export class AuthPage extends BasePage {
  constructor(page) {
    super(page);

    // --- Login locators ---
    // CONFIRMED against a real screenshot of /login (as of this edit):
    // the email field's placeholder is literally "name@example.com", and
    // the submit button reads "Login" with an arrow icon.
    this.loginEmailInput = page.getByPlaceholder('name@example.com');
    // The password field's placeholder wasn't visible in the screenshot
    // (masked dots only), so this falls back to the input's type attribute,
    // which is a safe, standard way to target it regardless of placeholder text.
    this.loginPasswordInput = page.locator('input[type="password"]').first();
    this.loginSubmitButton = page.getByRole('button', { name: /log ?in/i });
    // NOT YET CONFIRMED — no failed-login screenshot available. Leaving as a
    // testid guess; replace once you've seen what a real validation/error
    // message looks like (e.g. it might be a toast, not an inline element).
    this.loginErrorMessage = page.getByTestId('login-error-message');

    // --- Signup locators ---
    // NOT YET CONFIRMED — no screenshot of /signup has been provided yet.
    // These are still placeholders. Run:
    //   npx playwright codegen https://claysys-rag-project.vercel.app/signup
    // click through the real form, and swap these for what codegen records
    // (likely getByPlaceholder(...) or getByLabel(...), following the same
    // pattern as the login fields above).
    this.signupFullNameInput = page.getByTestId('signup-fullname-input');
    this.signupEmailInput = page.getByTestId('signup-email-input');
    this.signupPasswordInput = page.getByTestId('signup-password-input');
    this.signupConfirmPasswordInput = page.getByTestId('signup-confirm-password-input');
    this.signupSubmitButton = page.getByRole('button', { name: /sign ?up/i });
    this.signupErrorMessage = page.getByTestId('signup-error-message');
  }

  async gotoLogin() {
    await this.goto('/login');
    await this.waitVisible(this.loginEmailInput);
  }

  async gotoSignup() {
    await this.goto('/signup');
    await this.waitVisible(this.signupFullNameInput);
  }

  /** Logs in and waits for the redirect to /dashboard to complete. */
  async login(email, password) {
    await this.gotoLogin();
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitButton.click();
    await this.waitForUrlContains('/dashboard');
  }

  /** Attempts a login expected to fail; does NOT wait for a redirect. */
  async loginExpectingFailure(email, password) {
    await this.gotoLogin();
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitButton.click();
    await this.waitVisible(this.loginErrorMessage);
  }

  async signup({ fullName, email, password, confirmPassword = password }) {
    await this.gotoSignup();
    await this.signupFullNameInput.fill(fullName);
    await this.signupEmailInput.fill(email);
    await this.signupPasswordInput.fill(password);
    await this.signupConfirmPasswordInput.fill(confirmPassword);
    await this.signupSubmitButton.click();
  }
}
