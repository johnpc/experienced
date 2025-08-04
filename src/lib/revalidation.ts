import { revalidatePath, revalidateTag } from 'next/cache';

// Revalidation tags for different content types
export const REVALIDATION_TAGS = {
  PAGES: 'pages',
  PROJECTS: 'projects',
  SERVICES: 'services',
  BLOG: 'blog',
  TESTIMONIALS: 'testimonials',
  SITE_CONFIG: 'site-config',
  ALL_CONTENT: 'all-content',
} as const;

// Revalidation intervals (in seconds)
export const REVALIDATION_INTERVALS = {
  STATIC_PAGES: 3600, // 1 hour
  DYNAMIC_CONTENT: 1800, // 30 minutes
  FREQUENTLY_UPDATED: 300, // 5 minutes
  SITE_CONFIG: 86400, // 24 hours
} as const;

/**
 * Revalidate specific content paths
 */
export async function revalidateContent(
  contentType: keyof typeof REVALIDATION_TAGS,
  paths?: string[]
) {
  try {
    // Revalidate by tag
    revalidateTag(REVALIDATION_TAGS[contentType]);
    revalidateTag(REVALIDATION_TAGS.ALL_CONTENT);

    // Revalidate specific paths if provided
    if (paths) {
      for (const path of paths) {
        revalidatePath(path);
      }
    }

    // Revalidate common paths based on content type
    switch (contentType) {
      case 'PAGES':
        revalidatePath('/');
        break;
      case 'PROJECTS':
        revalidatePath('/projects');
        break;
      case 'SERVICES':
        revalidatePath('/services');
        break;
      case 'BLOG':
        revalidatePath('/blog');
        break;
      case 'SITE_CONFIG':
        revalidatePath('/');
        revalidatePath('/about');
        revalidatePath('/contact');
        break;
    }

    console.log(
      `Revalidated content type: ${contentType}`,
      paths ? `with paths: ${paths.join(', ')}` : ''
    );
  } catch (error) {
    console.error(`Failed to revalidate content type ${contentType}:`, error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}

/**
 * Revalidate all content
 */
export async function revalidateAllContent() {
  try {
    revalidateTag(REVALIDATION_TAGS.ALL_CONTENT);

    // Revalidate main pages
    const mainPaths = ['/', '/about', '/services', '/projects', '/contact'];
    for (const path of mainPaths) {
      revalidatePath(path);
    }

    console.log('Revalidated all content');
  } catch (error) {
    console.error('Failed to revalidate all content:', error);
  }
}

/**
 * Get revalidation configuration for a page
 */
export function getRevalidationConfig(
  pageType: 'static' | 'dynamic' | 'frequent' | 'config'
) {
  switch (pageType) {
    case 'static':
      return { revalidate: REVALIDATION_INTERVALS.STATIC_PAGES };
    case 'dynamic':
      return { revalidate: REVALIDATION_INTERVALS.DYNAMIC_CONTENT };
    case 'frequent':
      return { revalidate: REVALIDATION_INTERVALS.FREQUENTLY_UPDATED };
    case 'config':
      return { revalidate: REVALIDATION_INTERVALS.SITE_CONFIG };
    default:
      return { revalidate: REVALIDATION_INTERVALS.DYNAMIC_CONTENT };
  }
}

/**
 * Handle webhook-triggered revalidation
 */
export async function handleWebhookRevalidation(payload: {
  commits?: Array<{
    added?: string[];
    modified?: string[];
    removed?: string[];
  }>;
}) {
  try {
    const changedFiles = new Set<string>();

    // Collect all changed files
    if (payload.commits) {
      for (const commit of payload.commits) {
        [
          ...(commit.added || []),
          ...(commit.modified || []),
          ...(commit.removed || []),
        ].forEach((file) => {
          changedFiles.add(file);
        });
      }
    }

    // Determine what content types were affected
    const affectedTypes = new Set<keyof typeof REVALIDATION_TAGS>();
    const affectedPaths = new Set<string>();

    for (const file of Array.from(changedFiles)) {
      if (file.startsWith('content/pages/')) {
        affectedTypes.add('PAGES');
        const slug = file.replace('content/pages/', '').replace('.md', '');
        if (slug !== 'index') {
          affectedPaths.add(`/${slug}`);
        }
      } else if (file.startsWith('content/projects/')) {
        affectedTypes.add('PROJECTS');
        const slug = file.replace('content/projects/', '').replace('.md', '');
        affectedPaths.add(`/projects/${slug}`);
      } else if (file.startsWith('content/services/')) {
        affectedTypes.add('SERVICES');
        const slug = file.replace('content/services/', '').replace('.md', '');
        affectedPaths.add(`/services/${slug}`);
      } else if (file.startsWith('content/blog/')) {
        affectedTypes.add('BLOG');
        const slug = file.replace('content/blog/', '').replace('.md', '');
        affectedPaths.add(`/blog/${slug}`);
      } else if (file.startsWith('content/testimonials/')) {
        affectedTypes.add('TESTIMONIALS');
      } else if (file.startsWith('content/settings/')) {
        affectedTypes.add('SITE_CONFIG');
      }
    }

    // Revalidate affected content types
    if (affectedTypes.size === 0) {
      // If no specific content types detected, revalidate all
      await revalidateAllContent();
    } else {
      for (const contentType of Array.from(affectedTypes)) {
        await revalidateContent(contentType, Array.from(affectedPaths));
      }
    }

    return {
      success: true,
      affectedTypes: Array.from(affectedTypes),
      affectedPaths: Array.from(affectedPaths),
    };
  } catch (error) {
    console.error('Failed to handle webhook revalidation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Schedule periodic revalidation (for use with cron jobs)
 */
export async function scheduleRevalidation() {
  try {
    // This would typically be called by a cron job or scheduled function
    await revalidateAllContent();

    console.log('Scheduled revalidation completed');
    return { success: true };
  } catch (error) {
    console.error('Scheduled revalidation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
