import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Playwright Test Automation Configuration
 * Senior SDET Standards – Deployed App (https://claysys-rag-project.vercel.app/)
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60000,       // 60s per test – deployed app needs more time
  expect: {
    timeout: 10000,     // 10s for assertions
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,  // 1 local retry to handle flakiness
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'reports', open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://claysys-rag-project.vercel.app/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  outputDir: 'test-results',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
