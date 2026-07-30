import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    this.welcomeHeading = page.getByTestId('dashboard-welcome-heading');
    this.addWebsiteButton = page.getByRole('button', { name: /\+?\s*add website/i });
    this.recentChatsList = page.getByTestId('recent-chats-list');
    this.knowledgeBaseList = page.getByTestId('knowledge-base-list');

    this.profileMenuButton = page.getByTestId('profile-menu-button');
    this.logoutMenuItem = page.getByRole('menuitem', { name: /log ?out/i });

    this.themeToggleButton = page.getByTestId('theme-toggle-button');
  }

  async gotoDashboard() {
    await this.goto('/dashboard');
    await this.waitVisible(this.welcomeHeading);
  }

  async clickAddWebsite() {
    await this.addWebsiteButton.click();
  }

  /** Logs the current user out via the profile menu and waits for /login. */
  async logout() {
    await this.profileMenuButton.click();
    await this.logoutMenuItem.click();
    await this.waitForUrlContains('/login');
  }

  knowledgeBaseEntry(label) {
    return this.knowledgeBaseList.getByText(label, { exact: false });
  }
}
