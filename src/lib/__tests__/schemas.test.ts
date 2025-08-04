import {
  seoMetadataSchema,
  projectSchema,
  pageSchema,
  contactFormSchema,
  projectCategorySchema,
} from '../schemas';
import { ProjectCategory } from '@/types/content';

describe('Content Schemas', () => {
  describe('seoMetadataSchema', () => {
    it('should validate correct SEO metadata', () => {
      const validSEO = {
        title: 'Test Page Title',
        description:
          'This is a test page description that is under 160 characters.',
        keywords: ['test', 'page', 'seo'],
        ogImage: 'https://example.com/image.jpg',
        twitterCard: 'summary_large_image' as const,
      };

      const result = seoMetadataSchema.parse(validSEO);
      expect(result).toEqual(validSEO);
    });

    it('should reject title that is too long', () => {
      const invalidSEO = {
        title:
          'This is a very long title that exceeds the 60 character limit and should fail validation',
        description: 'Valid description',
        keywords: [],
      };

      expect(() => seoMetadataSchema.parse(invalidSEO)).toThrow();
    });

    it('should reject description that is too long', () => {
      const invalidSEO = {
        title: 'Valid title',
        description:
          'This is a very long description that exceeds the 160 character limit and should fail validation because it is way too long for SEO purposes and will be truncated by search engines anyway so we should prevent this from happening in the first place',
        keywords: [],
      };

      expect(() => seoMetadataSchema.parse(invalidSEO)).toThrow();
    });

    it('should provide default values for optional fields', () => {
      const minimalSEO = {
        title: 'Test Title',
        description: 'Test description',
      };

      const result = seoMetadataSchema.parse(minimalSEO);
      expect(result.keywords).toEqual([]);
    });
  });

  describe('projectCategorySchema', () => {
    it('should validate valid project categories', () => {
      expect(projectCategorySchema.parse('kitchen')).toBe(
        ProjectCategory.KITCHEN
      );
      expect(projectCategorySchema.parse('bathroom')).toBe(
        ProjectCategory.BATHROOM
      );
      expect(projectCategorySchema.parse('addition')).toBe(
        ProjectCategory.ADDITION
      );
      expect(projectCategorySchema.parse('renovation')).toBe(
        ProjectCategory.RENOVATION
      );
      expect(projectCategorySchema.parse('exterior')).toBe(
        ProjectCategory.EXTERIOR
      );
      expect(projectCategorySchema.parse('commercial')).toBe(
        ProjectCategory.COMMERCIAL
      );
    });

    it('should reject invalid project categories', () => {
      expect(() => projectCategorySchema.parse('invalid')).toThrow();
      expect(() => projectCategorySchema.parse('')).toThrow();
      expect(() => projectCategorySchema.parse(null)).toThrow();
    });
  });

  describe('projectSchema', () => {
    it('should validate complete project data', () => {
      const validProject = {
        id: 'test-project',
        title: 'Test Project',
        description: 'This is a test project description.',
        content: 'Detailed project content here.',
        images: [
          {
            src: 'https://example.com/image1.jpg',
            alt: 'Test image 1',
            caption: 'First test image',
          },
        ],
        category: 'kitchen',
        completedAt: '2024-01-15',
        featured: true,
        seo: {
          title: 'Test Project SEO Title',
          description: 'Test project SEO description',
          keywords: ['test', 'project'],
        },
        publishedAt: '2024-01-20',
        updatedAt: '2024-01-25',
        status: 'published',
      };

      const result = projectSchema.parse(validProject);
      expect(result.id).toBe('test-project');
      expect(result.category).toBe(ProjectCategory.KITCHEN);
      expect(result.completedAt).toBeInstanceOf(Date);
      expect(result.featured).toBe(true);
    });

    it('should require at least one image', () => {
      const invalidProject = {
        id: 'test-project',
        title: 'Test Project',
        description: 'Test description',
        images: [], // Empty array should fail
        category: 'kitchen',
        completedAt: '2024-01-15',
        featured: false,
        seo: {
          title: 'Test',
          description: 'Test description',
          keywords: [],
        },
        publishedAt: '2024-01-20',
        updatedAt: '2024-01-25',
        status: 'published',
      };

      expect(() => projectSchema.parse(invalidProject)).toThrow(
        'At least one image is required'
      );
    });

    it('should provide default values', () => {
      const minimalProject = {
        id: 'test-project',
        title: 'Test Project',
        description: 'Test description',
        images: [
          {
            src: 'https://example.com/image1.jpg',
            alt: 'Test image',
          },
        ],
        category: 'kitchen',
        completedAt: '2024-01-15',
        seo: {
          title: 'Test',
          description: 'Test description',
          keywords: [],
        },
        publishedAt: '2024-01-20',
        updatedAt: '2024-01-25',
      };

      const result = projectSchema.parse(minimalProject);
      expect(result.featured).toBe(false);
      expect(result.status).toBe('draft');
    });
  });

  describe('pageSchema', () => {
    it('should validate correct page data', () => {
      const validPage = {
        id: 'test-page',
        title: 'Test Page',
        slug: 'test-page',
        content: 'This is test page content.',
        seo: {
          title: 'Test Page SEO',
          description: 'Test page description',
          keywords: ['test'],
        },
        publishedAt: '2024-01-20',
        updatedAt: '2024-01-25',
        status: 'published',
      };

      const result = pageSchema.parse(validPage);
      expect(result.slug).toBe('test-page');
      expect(result.publishedAt).toBeInstanceOf(Date);
    });

    it('should reject invalid slug format', () => {
      const invalidPage = {
        id: 'test-page',
        title: 'Test Page',
        slug: 'Test Page!', // Invalid characters
        content: 'Test content',
        seo: {
          title: 'Test',
          description: 'Test description',
          keywords: [],
        },
        publishedAt: '2024-01-20',
        updatedAt: '2024-01-25',
      };

      expect(() => pageSchema.parse(invalidPage)).toThrow();
    });
  });

  describe('contactFormSchema', () => {
    it('should validate correct contact form data', () => {
      const validForm = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        subject: 'Kitchen Remodel Inquiry',
        message: 'I would like to get a quote for a kitchen remodel.',
        projectType: 'kitchen',
        budget: '10000-25000',
      };

      const result = contactFormSchema.parse(validForm);
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
    });

    it('should reject invalid email', () => {
      const invalidForm = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'Test message',
      };

      expect(() => contactFormSchema.parse(invalidForm)).toThrow();
    });

    it('should reject message that is too long', () => {
      const invalidForm = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'x'.repeat(1001), // Exceeds 1000 character limit
      };

      expect(() => contactFormSchema.parse(invalidForm)).toThrow();
    });

    it('should allow optional fields to be undefined', () => {
      const minimalForm = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
      };

      const result = contactFormSchema.parse(minimalForm);
      expect(result.phone).toBeUndefined();
      expect(result.projectType).toBeUndefined();
      expect(result.budget).toBeUndefined();
    });
  });
});
