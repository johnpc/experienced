# Next.js Marketing CMS

A self-hosted marketing website built with Next.js and Decap CMS for Git-backed content management.

## Features

- 🚀 **Next.js 14+** with App Router and TypeScript
- 📝 **Decap CMS** for intuitive content management
- 🔒 **Secure Authentication** with environment-based credentials
- 📱 **Responsive Design** with Tailwind CSS
- 🔍 **SEO Optimized** with static site generation
- 📧 **Contact Forms** with external service integration
- 🛡️ **Security First** with proper headers and validation

## Getting Started

1. **Clone and Install**

   ```bash
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:
   - Set admin credentials
   - Add GitHub personal access token
   - Configure site details

3. **Development**

   ```bash
   npm run dev
   ```

4. **Access Admin**
   - Visit `http://localhost:3000/admin`
   - Login with your configured credentials

## Environment Variables

| Variable                | Description                          | Required |
| ----------------------- | ------------------------------------ | -------- |
| `ADMIN_USERNAME`        | Admin login username                 | Yes      |
| `ADMIN_PASSWORD`        | Admin login password                 | Yes      |
| `GITHUB_TOKEN`          | GitHub personal access token         | Yes      |
| `GITHUB_REPO`           | Repository in format `username/repo` | Yes      |
| `GITHUB_BRANCH`         | Git branch (default: main)           | No       |
| `NEXT_PUBLIC_SITE_URL`  | Site URL                             | Yes      |
| `NEXT_PUBLIC_SITE_NAME` | Site name                            | Yes      |

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # React components
├── lib/                 # Utilities and configurations
├── types/              # TypeScript type definitions
└── content/            # Git-based content storage
```

## Deployment

This project can be deployed to:

- AWS Amplify
- Vercel
- Netlify
- Self-hosted with Docker

See deployment documentation for specific instructions.

## License

MIT License - see LICENSE file for details.
