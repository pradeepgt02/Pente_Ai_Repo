import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Centralized Test Data Configuration
 */
export const testData = {
  baseUrl: process.env.BASE_URL || 'https://claysys-rag-project.vercel.app/',
  user: {
    email: process.env.TEST_USER_EMAIL || 'pnexgt22005@gmail.com',
    password: process.env.TEST_USER_PASSWORD || 'Pnex@gt2',
    name: process.env.TEST_USER_NAME || 'QA Tester',
  },
  invalidUser: {
    email: 'nonexistent.user@webmind.ai',
    password: 'WrongPassword123!',
  },
  website: {
    url: process.env.TEST_WEBSITE_URL || 'https://example.com',
    domain: 'example.com',
    initialQuestion: 'What is the purpose of this website?',
    maxPages: '1',
  },
  aiChat: {
    prompt: 'Summarize the core topics on this website.',
    expectedKeyword: 'Domain',
  },
  errorMessages: {
    emptyEmail: 'Email cannot be empty',
    emptyPassword: 'Password cannot be empty',
    invalidEmailFormat: 'Invalid email format',
    incorrectCredentials: 'Incorrect credentials',
  },
};
