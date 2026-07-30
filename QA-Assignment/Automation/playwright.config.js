import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  // Run serially by default — the suite shares one test account and its
  // knowledge bases, so parallel workers would race against each other.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,

  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'reports/results.json' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,

    // Evidence capture — only kept on failure, so passing runs stay small.
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to extend cross-browser coverage:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  outputDir: 'reports/test-artifacts',
});
