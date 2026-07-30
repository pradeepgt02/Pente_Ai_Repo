# WebMind AI — Playwright JavaScript Test Automation Framework

Senior SDET level Playwright test automation framework built in pure JavaScript for E2E testing of the **WebMind AI Application**.

---

## 📁 Framework Architecture & Project Structure

```
automation/
│
├── pages/                   # Page Object Model (POM) classes
│   ├── LoginPage.js         # Page object for /login route
│   ├── DashboardPage.js     # Page object for /dashboard route
│   ├── KnowledgeBasePage.js # Page object for /workspace/index route (CRUD)
│   └── ChatPage.js          # Page object for /workspace/chat/:id route (AI Chat)
│
├── tests/                   # End-to-End Test Specifications
│   ├── login.spec.js        # User authentication & login test suite
│   ├── crud.spec.js         # Knowledge Base CRUD workflow test suite
│   ├── aiChat.spec.js       # AI Chat interaction test suite
│   └── logout.spec.js       # User session termination & logout test suite
│
├── utils/                   # Shared Helper Utilities & Test Data
│   ├── testData.js          # Centralized test configuration & data
│   └── helpers.js           # Reusable helper functions
│
├── fixtures/                # Custom Playwright Test Fixtures
│   └── baseFixture.js       # Extended test fixture providing POM instances
│
├── screenshots/             # Automatic failure screenshots destination
│   └── .gitkeep
│
├── reports/                 # Playwright HTML Test Reports destination
│   └── .gitkeep
│
├── playwright.config.js     # Master Playwright Test Runner Configuration
├── .env                     # Environment Variables (Credentials, Base URL)
├── package.json             # Node dependencies and execution scripts
└── README.md                # Framework documentation
```

---

## ⚡ Key Framework Features

- **Page Object Model (POM)**: High maintainability with clean separation of page actions and test specifications.
- **Custom Playwright Fixtures**: `baseFixture.js` automatically instantiates page objects (`loginPage`, `dashboardPage`, `knowledgeBasePage`, `chatPage`) for every test spec.
- **Accessible Locators**: Strict adherence to user-centric, accessible selectors (`getByRole`, `getByPlaceholder`, `getByTestId`).
- **Zero Credentials Hardcoding**: All authentication and test targets are managed via environment variables (`.env`).
- **Automatic Failure Screenshots**: Playwright automatically captures screenshots on failure (`screenshot: 'only-on-failure'`).
- **HTML Reporting**: Rich visual HTML report generated on every test run in `automation/reports/`.
- **Reusable Assertions**: Custom assertions embedded in Page Objects for robust test validation.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js version 18.0 or higher
- Running instance of WebMind AI Application (default `http://localhost:5173`)

### 2. Installation
Navigate into the `automation/` directory and install dependencies along with Playwright browser binaries:

```bash
cd automation
npm install
npx playwright install chromium
```

---

## ⚙️ Environment Configuration (`.env`)

Configure your target application URL and test credentials in `automation/.env`:

```env
BASE_URL=http://localhost:5173
TEST_USER_EMAIL=qa.tester@webmind.ai
TEST_USER_PASSWORD=Password123!
TEST_USER_NAME=QA Tester
TEST_WEBSITE_URL=https://example.com
```

---

## 🧪 Running Tests

### Execute All Tests (Headless)
```bash
npm run test
```

### Execute Tests in Headed Browser Mode
```bash
npm run test:headed
```

### Execute Specific Test Suites
```bash
# Run Login Tests
npm run test:login

# Run Knowledge Base CRUD Tests
npm run test:crud

# Run AI Chat Tests
npm run test:aichat

# Run Logout Tests
npm run test:logout
```

### View HTML Test Report
```bash
npm run test:report
```

---

## 📄 Explanation of Folders and Files

### 📁 `pages/` (Page Object Model)
Contains class definitions representing the application pages:
- **`LoginPage.js`**: Handles URL navigation, email/password input, login button submission, error alert checks, and URL assertions.
- **`DashboardPage.js`**: Encapsulates workspace navigation, welcome banner assertions, "New Chat" triggering, "Add Website" navigation, and opening profile dropdown.
- **`KnowledgeBasePage.js`**: Handles website indexing form inputs (URL, initial question, max crawl depth), verifying indexed websites, and executing website deletion workflows.
- **`ChatPage.js`**: Controls text prompt entry into the AI composer, submitting messages, and verifying AI response rendering.

### 📁 `tests/` (Test Specifications)
Contains executable Playwright test specs using `beforeEach` and `afterEach` lifecycle hooks:
- **`login.spec.js`**: Validates successful user login, invalid credential rejection, and empty input validations.
- **`crud.spec.js`**: Validates full CRUD workflow (Index website, verify presence in list, and delete website).
- **`aiChat.spec.js`**: Validates AI interaction lifecycle (initiating chat, submitting prompt, verifying user message & AI response).
- **`logout.spec.js`**: Validates session logout from profile dropdown and redirection to login page.

### 📁 `fixtures/`
- **`baseFixture.js`**: Extends `@playwright/test` to inject POM instances into test parameters automatically.

### 📁 `utils/`
- **`testData.js`**: Holds test constants, environmental fallback values, user credentials, and expected error strings.
- **`helpers.js`**: Reusable utility functions for element visibility waiting, random email generation, and domain parsing.

### 📁 `screenshots/` & `reports/`
- Output directories holding HTML reports (`reports/`) and failure screenshots (`screenshots/` & `test-results/`).

### 📄 Configuration Files
- **`playwright.config.js`**: Master Playwright runner setup configured with 30s timeout, HTML reporting, failure screenshots, video recordings, and base URL resolution.
- **`package.json`**: NPM package manifest with execution scripts.
