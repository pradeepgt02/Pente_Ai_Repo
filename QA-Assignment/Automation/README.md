# WebMind — UI Automation Framework (Part 7)

Playwright + JavaScript automation framework for WebMind, built as a
maintainable Page Object Model with environment-driven configuration.

## Project structure

```
Automation/
├── playwright.config.js     # baseURL, reporters, screenshot/video/trace settings
├── .env.example              # copy to .env and fill in real values
├── config/
│   └── testData.js           # env-driven test data (no hardcoded creds/URLs)
├── pages/
│   ├── BasePage.js           # shared wait/navigation helpers
│   ├── AuthPage.js           # login + signup
│   ├── DashboardPage.js      # welcome, nav, logout, theme toggle
│   └── WorkspacePage.js      # KB CRUD + AI chat interactions
├── fixtures/
│   └── pageFixtures.js       # injects page objects into every test; `loggedInPage` fixture
├── tests/
│   ├── auth.spec.js          # login (valid/invalid) + logout
│   ├── knowledgeBase.spec.js # KB CRUD: create, read, delete
│   ├── aiChat.spec.js        # AI interaction: grounded answer + fallback
│   └── fullWorkflow.spec.js  # all four required steps chained end-to-end
└── reports/                  # generated on run (gitignored)
```

## Setup

```bash
npm install
npx playwright install --with-deps chromium
cp .env.example .env   # then fill in real values
```

## Running

```bash
npm test                # full suite, headless
npm run test:headed     # watch it run in a real browser window
npm run test:debug      # step through with the Playwright inspector
npm run test:flow       # just the combined login->CRUD->AI->logout journey
npx playwright test --grep @smoke   # only the tagged smoke tests
npm run report          # open the last HTML report
```

## Design choices

- **Page Object Model** — every screen's locators and actions live in one
  `pages/*.js` file. Specs never touch a raw selector; they call
  `authPage.login(...)`, `workspacePage.addWebsite(...)`, etc. Locator
  changes only ever require editing one file.
- **Fixtures over setup boilerplate** — `fixtures/pageFixtures.js` extends
  Playwright's `test` so every spec just destructures the page objects it
  needs. The `loggedInPage` fixture removes repeated login steps from
  every test that requires an authenticated session.
- **Environment-driven config** — `playwright.config.js` and
  `config/testData.js` both read from `.env` (via `dotenv`), so the same
  codebase runs against local (`localhost:5173`) or a live/staging
  deployment by swapping one file — no code edits, no hardcoded secrets.
- **Meaningful assertions** — tests assert on actual content (e.g. the
  answer text matches the expected topic, a citation is present) rather
  than just "an element appeared." Two aiChat tests specifically assert
  the app's anti-hallucination behavior (grounded citation vs. explicit
  fallback), since that's WebMind's core trust claim per the Test
  Strategy.
- **Evidence on failure only** — screenshots, video, and trace are all set
  to capture only on failure, keeping passing runs fast and reports small
  while still giving full debugging evidence when something breaks.
- **HTML reporting** — `npm run report` opens a full interactive report
  (pass/fail per test, timings, and embedded failure screenshots/traces).

## Known assumptions / before first run

This framework was written from the application's documented feature set
(ApplicationOverview.md / TestStrategy.pdf), not from direct inspection of
the live DOM. All locators use `data-testid` attributes as placeholders
(e.g. `login-email-input`, `add-website-url-input`) following best
practice for selector stability. **Before the first real run**, confirm
or update these against the actual app — the fastest way is:

```bash
npm run codegen   # opens the app in a recorder, click through it, copy real selectors
```

Update the locators in `pages/*.js` accordingly; the test logic and
structure won't need to change.

## Test data

The suite expects a dedicated automation test account
(`TEST_USER_EMAIL` / `TEST_USER_PASSWORD` in `.env`) to already exist. If
your environment resets between runs, add a `global-setup.js` that signs
this account up via the API before the suite starts, and reference it
from `globalSetup` in `playwright.config.js`.

The `knowledgeBase.spec.js` and `fullWorkflow.spec.js` tests each create
and then delete their own knowledge base, so repeated runs shouldn't
accumulate stale data — but if a run fails mid-test before cleanup,
manually remove any leftover `TEST_WEBSITE_URL` knowledge base from the
account before re-running.
