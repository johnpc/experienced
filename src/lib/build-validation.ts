/**
 * Build-time validation utilities for static site generation
 */

import { ContentFetcher } from './content-fetcher';

export interface BuildValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalPages: number;
    totalProjects: number;
    totalServices: number;
    totalBlogPosts: number;
    generatedPaths: number;
  };
}

/**
 * Validate content availability for static generation
 */
export async function validateBuildContent(): Promise<BuildValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let stats = {
    totalPages: 0,
    totalProjects: 0,
    totalServices: 0,
    totalBlogPosts: 0,
    generatedPaths: 0,
  };

  try {
    const contentFetcher = new ContentFetcher();

    // Test content fetching
    const [pages, projects, services, blogPosts] = await Promise.allSettled([
      contentFetcher.getPages(),
      contentFetcher.getProjects(),
      contentFetcher.getServices(),
      contentFetcher.getBlogPosts(),
    ]);

    // Check pages
    if (pages.status === 'fulfilled') {
      stats.totalPages = pages.value.length;
      if (pages.value.length === 0) {
        warnings.push('No pages found in content repository');
      }
    } else {
      errors.push(`Failed to fetch pages: ${pages.reason}`);
    }

    // Check projects
    if (projects.status === 'fulfilled') {
      stats.totalProjects = projects.value.length;
      if (projects.value.length === 0) {
        warnings.push('No projects found in content repository');
      }
    } else {
      errors.push(`Failed to fetch projects: ${projects.reason}`);
    }

    // Check services
    if (services.status === 'fulfilled') {
      stats.totalServices = services.value.length;
      if (services.value.length === 0) {
        warnings.push('No services found in content repository');
      }
    } else {
      errors.push(`Failed to fetch services: ${services.reason}`);
    }

    // Check blog posts
    if (blogPosts.status === 'fulfilled') {
      stats.totalBlogPosts = blogPosts.value.length;
    } else {
      warnings.push(`Failed to fetch blog posts: ${blogPosts.reason}`);
    }

    // Calculate total generated paths
    stats.generatedPaths =
      stats.totalPages +
      stats.totalProjects +
      stats.totalServices +
      stats.totalBlogPosts;

    // Validate environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SITE_URL',
      'NEXT_PUBLIC_SITE_NAME',
      'GITHUB_TOKEN',
      'GITHUB_REPO',
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        errors.push(`Missing required environment variable: ${envVar}`);
      }
    }

    // Check GitHub API connectivity
    try {
      await contentFetcher.getContentStats();
    } catch (error) {
      warnings.push(
        `GitHub API connectivity issue: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  } catch (error) {
    errors.push(
      `Build validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return {
    success: errors.length === 0,
    errors,
    warnings,
    stats,
  };
}

/**
 * Log build validation results
 */
export function logBuildValidation(result: BuildValidationResult): void {
  console.log('\n🔍 Build Validation Results:');
  console.log('================================');

  if (result.success) {
    console.log('✅ Build validation passed');
  } else {
    console.log('❌ Build validation failed');
  }

  console.log('\n📊 Content Statistics:');
  console.log(`  Pages: ${result.stats.totalPages}`);
  console.log(`  Projects: ${result.stats.totalProjects}`);
  console.log(`  Services: ${result.stats.totalServices}`);
  console.log(`  Blog Posts: ${result.stats.totalBlogPosts}`);
  console.log(`  Total Generated Paths: ${result.stats.generatedPaths}`);

  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach((error) => console.log(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach((warning) => console.log(`  - ${warning}`));
  }

  console.log('================================\n');
}

/**
 * Generate build report for monitoring
 */
export async function generateBuildReport(): Promise<{
  timestamp: string;
  buildId: string;
  validation: BuildValidationResult;
  environment: {
    nodeVersion: string;
    nextVersion: string;
    platform: string;
  };
}> {
  const validation = await validateBuildContent();

  return {
    timestamp: new Date().toISOString(),
    buildId:
      process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'local',
    validation,
    environment: {
      nodeVersion: process.version,
      nextVersion: process.env.npm_package_dependencies_next || 'unknown',
      platform: process.platform,
    },
  };
}

/**
 * Validate individual content item for static generation
 */
export function validateContentItem(
  item: any,
  type: 'page' | 'project' | 'service' | 'blog'
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Common validations
  if (!item.id) errors.push('Missing required field: id');
  if (!item.title) errors.push('Missing required field: title');
  if (!item.slug && type !== 'page')
    errors.push('Missing required field: slug');

  // Type-specific validations
  switch (type) {
    case 'project':
      if (!item.description) errors.push('Missing required field: description');
      if (!item.category) errors.push('Missing required field: category');
      if (!item.completedAt) errors.push('Missing required field: completedAt');
      if (!item.images || item.images.length === 0)
        errors.push('Missing required field: images');
      break;

    case 'service':
      if (!item.description) errors.push('Missing required field: description');
      if (!item.content) errors.push('Missing required field: content');
      if (typeof item.order !== 'number')
        errors.push('Missing or invalid field: order');
      break;

    case 'blog':
      if (!item.content) errors.push('Missing required field: content');
      if (!item.author) errors.push('Missing required field: author');
      if (!item.publishedAt) errors.push('Missing required field: publishedAt');
      break;

    case 'page':
      if (!item.content) errors.push('Missing required field: content');
      break;
  }

  // SEO validation
  if (!item.seo) {
    errors.push('Missing SEO metadata');
  } else {
    if (!item.seo.title) errors.push('Missing SEO title');
    if (!item.seo.description) errors.push('Missing SEO description');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
