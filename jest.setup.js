// Jest setup file to configure environment variables for tests
import '@testing-library/jest-dom';

// Set required environment variables for tests
process.env.ADMIN_USERNAME = 'test-admin';
process.env.ADMIN_PASSWORD = 'test-password-123';
process.env.GITHUB_TOKEN = 'test-github-token';
process.env.GITHUB_REPO = 'test-owner/test-repo';
process.env.GITHUB_BRANCH = 'main';
process.env.NEXT_PUBLIC_SITE_URL = 'https://test-site.com';
process.env.NEXT_PUBLIC_SITE_NAME = 'Test Site';

// Optional environment variables
process.env.CONTACT_EMAIL = 'test@example.com';
process.env.SMTP_HOST = 'smtp.test.com';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'test-user';
process.env.SMTP_PASS = 'test-pass';
