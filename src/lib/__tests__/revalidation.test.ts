import {
  handleWebhookRevalidation,
  getRevalidationConfig,
  REVALIDATION_TAGS,
  REVALIDATION_INTERVALS,
} from '../revalidation';

// Mock Next.js revalidation functions
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

import { revalidatePath, revalidateTag } from 'next/cache';

describe('Revalidation System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleWebhookRevalidation', () => {
    it('should handle page content changes', async () => {
      const payload = {
        commits: [
          {
            added: ['content/pages/new-page.md'],
            modified: ['content/pages/about.md'],
            removed: [],
          },
        ],
      };

      const result = await handleWebhookRevalidation(payload);

      expect(result.success).toBe(true);
      expect(result.affectedTypes).toContain('PAGES');
      expect(result.affectedPaths).toContain('/about');
    });

    it('should handle project content changes', async () => {
      const payload = {
        commits: [
          {
            added: [],
            modified: ['content/projects/kitchen-remodel.md'],
            removed: ['content/projects/old-project.md'],
          },
        ],
      };

      const result = await handleWebhookRevalidation(payload);

      expect(result.success).toBe(true);
      expect(result.affectedTypes).toContain('PROJECTS');
      expect(result.affectedPaths).toContain('/projects/kitchen-remodel');
      expect(result.affectedPaths).toContain('/projects/old-project');
    });

    it('should handle service content changes', async () => {
      const payload = {
        commits: [
          {
            added: ['content/services/new-service.md'],
            modified: [],
            removed: [],
          },
        ],
      };

      const result = await handleWebhookRevalidation(payload);

      expect(result.success).toBe(true);
      expect(result.affectedTypes).toContain('SERVICES');
      expect(result.affectedPaths).toContain('/services/new-service');
    });

    it('should handle blog content changes', async () => {
      const payload = {
        commits: [
          {
            added: [],
            modified: ['content/blog/2024-01-15-new-post.md'],
            removed: [],
          },
        ],
      };

      const result = await handleWebhookRevalidation(payload);

      expect(result.success).toBe(true);
      expect(result.affectedTypes).toContain('BLOG');
      expect(result.affectedPaths).toContain('/blog/2024-01-15-new-post');
    });

    it('should handle testimonial changes', async () => {
      const payload = {
        commits: [
          {
            added: ['content/testimonials/john-doe.md'],
            modified: [],
            removed: [],
          },
        ],
      };

      const result = await handleWebhookRevalidation(payload);

      expect(result.success).toBe(true);
      expect(result.affectedTypes).toContain('TESTIMONIALS');
    });

    it('should handle site config changes', async () => {
      const payload = {
        commits: [
          {
            added: [],
            modified: ['content/settings/general.yml'],
            removed: [],
          },
        ],
      };

      const result = await handleWebhookRevalidation(payload);

      expect(result.success).toBe(true);
      expect(result.affectedTypes).toContain('SITE_CONFIG');
    });

    it('should handle multiple content type changes', async () => {
      const payload = {
        commits: [
          {
            added: ['content/pages/new-page.md'],
            modified: [
              'content/projects/kitchen-remodel.md',
              'content/services/plumbing.md',
            ],
            removed: ['content/blog/old-post.md'],
          },
        ],
      };

      const result = await handleWebhookRevalidation(payload);

      expect(result.success).toBe(true);
      expect(result.affectedTypes).toContain('PAGES');
      expect(result.affectedTypes).toContain('PROJECTS');
      expect(result.affectedTypes).toContain('SERVICES');
      expect(result.affectedTypes).toContain('BLOG');
    });

    it('should handle empty commits gracefully', async () => {
      const payload = {
        commits: [],
      };

      const result = await handleWebhookRevalidation(payload);

      expect(result.success).toBe(true);
      expect(result.affectedTypes).toHaveLength(0);
    });

    it('should handle non-content file changes', async () => {
      const payload = {
        commits: [
          {
            added: ['src/components/Header.tsx'],
            modified: ['package.json'],
            removed: ['README.md'],
          },
        ],
      };

      const result = await handleWebhookRevalidation(payload);

      expect(result.success).toBe(true);
      // Should trigger revalidateAllContent when no specific content types are detected
      expect(result.affectedTypes).toHaveLength(0);
    });

    it('should handle errors gracefully', async () => {
      // Mock revalidateTag to throw an error
      (revalidateTag as jest.Mock).mockImplementation(() => {
        throw new Error('Revalidation failed');
      });

      const payload = {
        commits: [
          {
            modified: ['content/pages/test.md'],
          },
        ],
      };

      const result = await handleWebhookRevalidation(payload);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Revalidation failed');
    });
  });

  describe('getRevalidationConfig', () => {
    it('should return correct config for static pages', () => {
      const config = getRevalidationConfig('static');
      expect(config.revalidate).toBe(REVALIDATION_INTERVALS.STATIC_PAGES);
    });

    it('should return correct config for dynamic content', () => {
      const config = getRevalidationConfig('dynamic');
      expect(config.revalidate).toBe(REVALIDATION_INTERVALS.DYNAMIC_CONTENT);
    });

    it('should return correct config for frequent updates', () => {
      const config = getRevalidationConfig('frequent');
      expect(config.revalidate).toBe(REVALIDATION_INTERVALS.FREQUENTLY_UPDATED);
    });

    it('should return correct config for site config', () => {
      const config = getRevalidationConfig('config');
      expect(config.revalidate).toBe(REVALIDATION_INTERVALS.SITE_CONFIG);
    });

    it('should return default config for unknown type', () => {
      const config = getRevalidationConfig('unknown' as any);
      expect(config.revalidate).toBe(REVALIDATION_INTERVALS.DYNAMIC_CONTENT);
    });
  });

  describe('REVALIDATION_TAGS', () => {
    it('should have all expected tags', () => {
      expect(REVALIDATION_TAGS.PAGES).toBe('pages');
      expect(REVALIDATION_TAGS.PROJECTS).toBe('projects');
      expect(REVALIDATION_TAGS.SERVICES).toBe('services');
      expect(REVALIDATION_TAGS.BLOG).toBe('blog');
      expect(REVALIDATION_TAGS.TESTIMONIALS).toBe('testimonials');
      expect(REVALIDATION_TAGS.SITE_CONFIG).toBe('site-config');
      expect(REVALIDATION_TAGS.ALL_CONTENT).toBe('all-content');
    });
  });

  describe('REVALIDATION_INTERVALS', () => {
    it('should have reasonable intervals', () => {
      expect(REVALIDATION_INTERVALS.STATIC_PAGES).toBe(3600); // 1 hour
      expect(REVALIDATION_INTERVALS.DYNAMIC_CONTENT).toBe(1800); // 30 minutes
      expect(REVALIDATION_INTERVALS.FREQUENTLY_UPDATED).toBe(300); // 5 minutes
      expect(REVALIDATION_INTERVALS.SITE_CONFIG).toBe(86400); // 24 hours
    });
  });
});
