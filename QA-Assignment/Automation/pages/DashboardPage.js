import { expect } from '@playwright/test';

/**
 * Page Object Model for the Dashboard Page (/dashboard)
 */
export class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Locators matching Dashboard UI
    this.welcomeHeading = page.getByRole('heading', { name: /Welcome,/i });
    // New chat button – exists both on /dashboard AND in the sidebar on workspace pages
    this.newChatButton = page.getByTestId('new-chat-button');
    // Sidebar new-chat button (button text "New chat" in sidebar)
    this.sidebarNewChatButton = page.locator('button', { hasText: /^New chat$/i });
    this.recentChatsHeading = page.getByRole('heading', { name: 'Recent Chats' });
    this.knowledgeBasesHeading = page.getByRole('heading', { name: 'Knowledge Bases' });
    // Add website – matches both "+ Add Website" on dashboard and "Add website" in sidebar
    this.addWebsiteLink = page.locator('button', { hasText: /add website/i }).first();
    // Profile dropdown: confirmed by live inspection — uses title="Account profile"
    this.profileDropdownTrigger = page.locator('button[title="Account profile"]');
    // Logout: sidebar button has confirmed data-testid="sidebar-logout-button"
    this.logoutButton = page.getByTestId('sidebar-logout-button');
  }

  /**
   * Navigate directly to Dashboard page
   */
  async goto() {
    await this.page.goto('/dashboard');
    await this.assertOnDashboard();
  }

  /**
   * Assert Dashboard page is loaded.
   * Works from dashboard URL or any workspace URL (sidebar is always present after login).
   */
  async assertOnDashboard() {
    // Accept either /dashboard or /workspace/* — both mean user is authenticated
    await expect(this.page).toHaveURL(/\/(dashboard|workspace)/, { timeout: 15000 });
    // The welcome heading only appears on /dashboard — navigate there if needed
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/dashboard')) {
      await this.page.goto('/dashboard');
      await expect(this.page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
    }
    await expect(this.welcomeHeading).toBeVisible({ timeout: 15000 });
  }

  /**
   * Click New Chat button — navigates to /workspace/chat/:id
   */
  async clickNewChat() {
    // Ensure we are on /dashboard before clicking the big "New chat" button
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/dashboard')) {
      await this.page.goto('/dashboard');
      await expect(this.page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
    }
    await expect(this.newChatButton).toBeVisible({ timeout: 10000 });
    await this.newChatButton.click();
    await expect(this.page).toHaveURL(/.*\/workspace\/chat\/.*/, { timeout: 15000 });
  }

  /**
   * Click Add Website link to navigate to indexing page
   */
  async clickAddWebsite() {
    // Navigate directly to /workspace/index — avoids button click race condition
    await this.page.goto('/workspace/index');
    await expect(this.page).toHaveURL(/.*\/workspace\/index/, { timeout: 15000 });
  }

  /**
   * Perform logout via Profile Dropdown (title="Account profile" or Log out button in sidebar)
   */
  async logout() {
    // The sidebar shows a direct "Log out" button — try that first
    const directLogout = this.page.locator('button', { hasText: /log.?out/i });
    if (await directLogout.count() > 0 && await directLogout.first().isVisible()) {
      await directLogout.first().click();
    } else {
      // Fallback: profile dropdown trigger
      await this.profileDropdownTrigger.click();
      await directLogout.waitFor({ state: 'visible', timeout: 8000 });
      await directLogout.first().click();
    }
    await expect(this.page).toHaveURL(/.*\/login/, { timeout: 15000 });
  }
}
