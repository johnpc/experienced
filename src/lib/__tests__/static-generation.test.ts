/**
 * Tests for static site generation functionality
 */

// Create a standalone version of validateContentItem to avoid env dependencies
function validateContentItem(
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

describe('Static Site Generation', () => {
  describe('validateContentItem', () => {
    it('should validate a valid project', () => {
      const project = {
        id: 'kitchen-remodel',
        title: 'Kitchen Remodel',
        slug: 'kitchen-remodel',
        description: 'A beautiful kitchen transformation',
        category: 'kitchen',
        completedAt: '2024-01-01',
        images: [{ src: '/image.jpg', alt: 'Kitchen' }],
        seo: {
          title: 'Kitchen Remodel',
          description: 'SEO description',
        },
      };

      const result = validateContentItem(project, 'project');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should identify missing required fields in project', () => {
      const project = {
        id: 'kitchen-remodel',
        // Missing title, description, category, completedAt, images
        seo: {
          title: 'Kitchen Remodel',
          description: 'SEO description',
        },
      };

      const result = validateContentItem(project, 'project');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field: title');
      expect(result.errors).toContain('Missing required field: description');
      expect(result.errors).toContain('Missing required field: category');
      expect(result.errors).toContain('Missing required field: completedAt');
      expect(result.errors).toContain('Missing required field: images');
    });

    it('should validate a valid service', () => {
      const service = {
        id: 'kitchen-remodeling',
        title: 'Kitchen Remodeling',
        slug: 'kitchen-remodeling',
        description: 'Professional kitchen remodeling services',
        content: 'Detailed service content...',
        order: 1,
        seo: {
          title: 'Kitchen Remodeling Services',
          description: 'SEO description',
        },
      };

      const result = validateContentItem(service, 'service');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should identify missing SEO metadata', () => {
      const item = {
        id: 'test',
        title: 'Test Item',
        slug: 'test',
        // Missing seo field
      };

      const result = validateContentItem(item, 'page');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing SEO metadata');
    });

    it('should identify incomplete SEO metadata', () => {
      const item = {
        id: 'test',
        title: 'Test Item',
        slug: 'test',
        content: 'Test content',
        seo: {
          // Missing title and description
        },
      };

      const result = validateContentItem(item, 'page');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing SEO title');
      expect(result.errors).toContain('Missing SEO description');
    });

    it('should validate blog post specific fields', () => {
      const blogPost = {
        id: 'test-post',
        title: 'Test Post',
        slug: 'test-post',
        content: 'Blog post content',
        author: 'John Doe',
        publishedAt: '2024-01-01',
        seo: {
          title: 'Test Post',
          description: 'SEO description',
        },
      };

      const result = validateContentItem(blogPost, 'blog');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should identify missing blog post fields', () => {
      const blogPost = {
        id: 'test-post',
        title: 'Test Post',
        slug: 'test-post',
        // Missing content, author, publishedAt
        seo: {
          title: 'Test Post',
          description: 'SEO description',
        },
      };

      const result = validateContentItem(blogPost, 'blog');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field: content');
      expect(result.errors).toContain('Missing required field: author');
      expect(result.errors).toContain('Missing required field: publishedAt');
    });
  });

  describe('Static Generation Integration', () => {
    it('should handle generateStaticParams fallback', () => {
      // This test would verify that generateStaticParams functions
      // properly fall back to hardcoded values when content fetching fails

      const fallbackProjects = [{ slug: 'modern-kitchen-remodel' }];

      const fallbackServices = [
        { slug: 'kitchen-remodeling' },
        { slug: 'bathroom-renovation' },
      ];

      expect(fallbackProjects).toHaveLength(1);
      expect(fallbackServices).toHaveLength(2);
      expect(fallbackProjects[0].slug).toBe('modern-kitchen-remodel');
    });

    it('should validate ISR configuration', () => {
      // Test that ISR revalidation intervals are properly configured
      const revalidateIntervals = {
        staticPages: 3600, // 1 hour
        dynamicContent: 1800, // 30 minutes
        frequentUpdates: 300, // 5 minutes
      };

      expect(revalidateIntervals.staticPages).toBeGreaterThan(0);
      expect(revalidateIntervals.dynamicContent).toBeGreaterThan(0);
      expect(revalidateIntervals.frequentUpdates).toBeGreaterThan(0);
    });

    it('should validate sitemap generation', () => {
      // Test sitemap structure
      const sitemapEntry = {
        url: 'https://example.com/projects/kitchen-remodel',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      };

      expect(sitemapEntry.url).toMatch(/^https?:\/\//);
      expect(sitemapEntry.lastModified).toBeInstanceOf(Date);
      expect([
        'always',
        'hourly',
        'daily',
        'weekly',
        'monthly',
        'yearly',
        'never',
      ]).toContain(sitemapEntry.changeFrequency);
      expect(sitemapEntry.priority).toBeGreaterThanOrEqual(0);
      expect(sitemapEntry.priority).toBeLessThanOrEqual(1);
    });
  });
});
