// Centralized test data. Pulling everything through env vars (via .env)
// means credentials/URLs never get hardcoded in a spec file, and the same
// suite can point at local vs. a live/staging deployment just by swapping
// the .env file — no code changes required.

export const testUser = {
  email: process.env.TEST_USER_EMAIL || 'qa.automation@example.com',
  password: process.env.TEST_USER_PASSWORD || 'Test@1234',
  fullName: process.env.TEST_USER_NAME || 'Pradeepkumar',
};

export const testWebsite = {
  url: process.env.TEST_WEBSITE_URL || 'https://www.python.org',
  label: process.env.TEST_WEBSITE_LABEL || 'python.org',
};

export const testChat = {
  question: process.env.TEST_CHAT_QUESTION || 'What is Python?',
  // A keyword we expect in a *grounded* answer, used to assert the
  // response is actually relevant rather than just "some text came back".
  expectedAnswerKeyword: /python/i,
};

export const invalidUser = {
  email: 'not-a-real-user@example.com',
  password: 'WrongPassword1',
};
