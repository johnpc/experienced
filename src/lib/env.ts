import { z } from 'zod';

const envSchema = z.object({
  // Authentication
  ADMIN_USERNAME: z.string().min(1, 'Admin username is required'),
  ADMIN_PASSWORD: z
    .string()
    .min(6, 'Admin password must be at least 6 characters'),

  // GitHub Integration
  GITHUB_TOKEN: z.string().min(1, 'GitHub token is required'),
  GITHUB_REPO: z.string().min(1, 'GitHub repository is required'),
  GITHUB_BRANCH: z.string().default('main'),

  // Site Configuration
  NEXT_PUBLIC_SITE_URL: z.string().url('Site URL must be a valid URL'),
  NEXT_PUBLIC_SITE_NAME: z.string().min(1, 'Site name is required'),

  // Optional Contact Form
  CONTACT_EMAIL: z.string().email().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Invalid environment variables:', error);
  throw new Error('Invalid environment variables');
}

export { env };
