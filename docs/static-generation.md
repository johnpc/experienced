# Static Site Generation System

This document outlines the static site generation (SSG) system implemented for the Next.js Marketing CMS.

## Overview

The static site generation system enables the website to pre-render pages at build time, providing excellent performance and SEO benefits while still allowing dynamic content updates through the CMS.

## Key Components

### 1. generateStaticParams Implementation

**Location**: `src/app/projects/[slug]/page.tsx`, `src/app/services/[slug]/page.tsx`

- Implements Next.js 14 `generateStaticParams` for dynamic routes
- Fetches content paths from GitHub repository at build time
- Includes fallback mechanisms for build-time failures
- Generates static pages for all published content

### 2. Content Fetching Utilities

**Location**: `src/lib/content-fetcher.ts`

- `ContentFetcher` class for retrieving content from Git repository
- Methods for fetching pages, projects, services, and blog posts
- `getContentPaths()` method specifically for static generation
- Error handling and fallback mechanisms

### 3. Incremental Static Regeneration (ISR)

**Configuration**:

- Projects: 30-minute revalidation (`revalidate = 1800`)
- Services: 30-minute revalidation (`revalidate = 1800`)
- Static pages: 1-hour revalidation

**Features**:

- Automatic content updates without full rebuilds
- Webhook-triggered revalidation for immediate updates
- Tag-based cache invalidation

### 4. Automatic Sitemap Generation

**Location**: `src/app/sitemap.ts`

- Dynamic sitemap generation including all content types
- Proper lastModified dates and change frequencies
- SEO-optimized priority settings
- Fallback handling for content fetching failures

### 5. Robots.txt Generation

**Location**: `src/app/robots.ts`

- Automatic robots.txt generation
- Proper disallow rules for admin and API routes
- Sitemap reference inclusion

### 6. Revalidation System

**Location**: `src/lib/revalidation.ts`

- Comprehensive revalidation utilities
- Webhook-triggered content updates
- Tag-based cache management
- Path-specific revalidation

**API Endpoint**: `src/app/api/revalidate/route.ts`

- Manual revalidation triggers
- Content type-specific revalidation
- Authentication-protected endpoint

### 7. GitHub Webhook Integration

**Location**: `src/app/api/github/webhook/route.ts`

- Automatic revalidation on content changes
- Signature verification for security
- Support for push, pull request, and repository events
- Intelligent content change detection

### 8. Build Validation System

**Location**: `src/lib/build-validation.ts`

- Content validation for static generation
- Build-time error detection
- Content statistics and monitoring
- Environment validation

**Script**: `scripts/validate-build.js`

- Standalone validation script
- CI/CD integration support
- Build report generation

## Static Generation Flow

1. **Build Time**:
   - `generateStaticParams` fetches content paths from GitHub
   - Static pages are pre-rendered for all published content
   - Sitemap and robots.txt are generated
   - Build validation ensures content integrity

2. **Runtime**:
   - Pre-rendered pages serve instantly
   - ISR handles content updates automatically
   - Webhook triggers immediate revalidation when content changes

3. **Content Updates**:
   - CMS updates trigger GitHub commits
   - Webhooks notify the application of changes
   - Affected pages are revalidated automatically
   - New content becomes available within revalidation intervals

## Performance Benefits

- **Fast Loading**: Pre-rendered pages serve instantly
- **SEO Optimized**: Static HTML with proper meta tags and structured data
- **Scalable**: CDN-friendly static assets
- **Reliable**: Fallback mechanisms ensure availability

## Configuration

### Environment Variables

```env
GITHUB_TOKEN=your_github_token
GITHUB_REPO=owner/repository
GITHUB_BRANCH=main
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Revalidation Intervals

```typescript
export const REVALIDATION_INTERVALS = {
  STATIC_PAGES: 3600, // 1 hour
  DYNAMIC_CONTENT: 1800, // 30 minutes
  FREQUENTLY_UPDATED: 300, // 5 minutes
  SITE_CONFIG: 86400, // 24 hours
};
```

## Monitoring and Debugging

### Build Validation

```bash
npm run build:validate
```

### Manual Revalidation

```bash
curl -X POST /api/revalidate \
  -H "Authorization: Bearer your_token" \
  -d '{"type": "projects", "paths": ["/projects/kitchen-remodel"]}'
```

### Content Statistics

The system provides detailed statistics about:

- Total pages, projects, services, and blog posts
- Generated static paths
- Last content update timestamps
- Build validation results

## Error Handling

- **GitHub API Failures**: Fallback to cached content or hardcoded paths
- **Content Parsing Errors**: Individual item failures don't break the build
- **Webhook Failures**: Graceful degradation with scheduled revalidation
- **Build Validation**: Comprehensive error reporting and warnings

## Testing

The static generation system includes comprehensive tests for:

- Content validation
- Path generation
- Revalidation logic
- Error handling scenarios

Run tests with:

```bash
npm test -- --testPathPattern="static-generation|content-fetcher|revalidation"
```

## Future Enhancements

- **Preview Mode**: Draft content preview for editors
- **A/B Testing**: Static generation for multiple content variants
- **Multi-language**: Static generation for internationalized content
- **Advanced Caching**: More granular cache control strategies
