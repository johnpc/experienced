import {
  generateMetadata,
  generateBusinessStructuredData,
  generateServiceStructuredData,
  generateProjectStructuredData,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  validateSEOContent,
  generateSitemapEntry,
} from '../seo';

describe('SEO Utilities', () => {
  describe('generateMetadata', () => {
    it('should generate complete metadata object', () => {
      const config = {
        title: 'Test Page',
        description: 'This is a test page description',
        keywords: ['test', 'page'],
        ogImage: '/images/test.jpg',
        canonical: 'https://example.com/test',
      };

      const metadata = generateMetadata(config);

      expect(metadata.title).toBe(
        'Test Page | Premier Construction & Remodeling'
      );
      expect(metadata.description).toBe('This is a test page description');
      expect(metadata.keywords).toContain('test');
      expect(metadata.keywords).toContain('construction');
      expect(metadata.openGraph?.title).toBe(
        'Test Page | Premier Construction & Remodeling'
      );
      expect(metadata.twitter).toBeDefined();
      expect(metadata.robots).toBeDefined();
    });

    it('should handle noindex and nofollow flags', () => {
      const config = {
        title: 'Private Page',
        description: 'This is a private page',
        noindex: true,
        nofollow: true,
      };

      const metadata = generateMetadata(config);

      expect(metadata.robots).toBeDefined();
    });

    it('should use default values when not provided', () => {
      const config = {
        title: 'Simple Page',
        description: 'Simple description',
      };

      const metadata = generateMetadata(config);

      expect(metadata.keywords).toContain('construction');
      expect(metadata.twitter).toBeDefined();
      expect(metadata.openGraph).toBeDefined();
    });
  });

  describe('generateBusinessStructuredData', () => {
    it('should generate valid JSON-LD for business', () => {
      const structuredData = generateBusinessStructuredData();
      const parsed = JSON.parse(structuredData);

      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('GeneralContractor');
      expect(parsed.name).toBe('Premier Construction & Remodeling');
      expect(parsed.address).toBeDefined();
      expect(parsed.contactPoint).toBeDefined();
      expect(parsed.hasOfferCatalog).toBeDefined();
      expect(parsed.aggregateRating).toBeDefined();
      expect(parsed.review).toHaveLength(2);
    });

    it('should include all required business properties', () => {
      const structuredData = generateBusinessStructuredData();
      const parsed = JSON.parse(structuredData);

      expect(parsed.telephone).toBeDefined();
      expect(parsed.email).toBeDefined();
      expect(parsed.openingHours).toBeDefined();
      expect(parsed.priceRange).toBeDefined();
      expect(parsed.areaServed).toBeDefined();
      expect(parsed.sameAs).toHaveLength(3);
    });
  });

  describe('generateServiceStructuredData', () => {
    it('should generate valid JSON-LD for service', () => {
      const service = {
        name: 'Kitchen Remodeling',
        description: 'Professional kitchen remodeling services',
        url: 'https://example.com/services/kitchen-remodeling',
        image: 'https://example.com/images/kitchen.jpg',
      };

      const structuredData = generateServiceStructuredData(service);
      const parsed = JSON.parse(structuredData);

      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('Service');
      expect(parsed.name).toBe('Kitchen Remodeling');
      expect(parsed.description).toBe(
        'Professional kitchen remodeling services'
      );
      expect(parsed.provider).toBeDefined();
      expect(parsed.provider['@type']).toBe('GeneralContractor');
    });
  });

  describe('generateProjectStructuredData', () => {
    it('should generate valid JSON-LD for project', () => {
      const project = {
        name: 'Modern Kitchen Remodel',
        description: 'Complete kitchen transformation',
        url: 'https://example.com/projects/modern-kitchen',
        image: 'https://example.com/images/kitchen-project.jpg',
        dateCompleted: '2024-01-15',
        category: 'Kitchen',
      };

      const structuredData = generateProjectStructuredData(project);
      const parsed = JSON.parse(structuredData);

      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('CreativeWork');
      expect(parsed.name).toBe('Modern Kitchen Remodel');
      expect(parsed.creator).toBeDefined();
      expect(parsed.about).toBeDefined();
      expect(parsed.keywords).toContain('Kitchen');
    });
  });

  describe('generateBreadcrumbStructuredData', () => {
    it('should generate valid JSON-LD for breadcrumbs', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Services', url: 'https://example.com/services' },
        {
          name: 'Kitchen Remodeling',
          url: 'https://example.com/services/kitchen',
        },
      ];

      const structuredData = generateBreadcrumbStructuredData(breadcrumbs);
      const parsed = JSON.parse(structuredData);

      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('BreadcrumbList');
      expect(parsed.itemListElement).toHaveLength(3);
      expect(parsed.itemListElement[0].position).toBe(1);
      expect(parsed.itemListElement[0].name).toBe('Home');
      expect(parsed.itemListElement[2].position).toBe(3);
    });
  });

  describe('generateFAQStructuredData', () => {
    it('should generate valid JSON-LD for FAQ', () => {
      const faqs = [
        {
          question: 'How long does a kitchen remodel take?',
          answer: 'Most kitchen remodels take 4-8 weeks.',
        },
        {
          question: 'Do you provide warranties?',
          answer: 'Yes, we provide comprehensive warranties.',
        },
      ];

      const structuredData = generateFAQStructuredData(faqs);
      const parsed = JSON.parse(structuredData);

      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('FAQPage');
      expect(parsed.mainEntity).toHaveLength(2);
      expect(parsed.mainEntity[0]['@type']).toBe('Question');
      expect(parsed.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    });
  });

  describe('validateSEOContent', () => {
    it('should validate good SEO content', () => {
      const content = {
        title: 'Professional Kitchen Remodeling Services',
        description:
          'Transform your kitchen with our professional remodeling services. Quality craftsmanship, reliable service, and exceptional results.',
        keywords: ['kitchen', 'remodeling', 'construction'],
      };

      const result = validateSEOContent(content);

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should identify title length issues', () => {
      const content = {
        title: 'Short',
        description:
          'This is a good description that meets the recommended length requirements for SEO optimization and search engine visibility.',
        keywords: ['test'],
      };

      const result = validateSEOContent(content);

      expect(result.isValid).toBe(false);
      expect(result.warnings).toContain(
        'Title is too short (recommended: 30-60 characters)'
      );
    });

    it('should identify description length issues', () => {
      const content = {
        title: 'This is a good title for SEO testing',
        description: 'Too short',
        keywords: ['test'],
      };

      const result = validateSEOContent(content);

      expect(result.isValid).toBe(false);
      expect(result.warnings).toContain(
        'Description is too short (recommended: 120-160 characters)'
      );
    });

    it('should provide keyword suggestions', () => {
      const content = {
        title: 'This is a good title for SEO testing',
        description:
          'This is a good description that meets the recommended length requirements for SEO optimization and search engine visibility.',
      };

      const result = validateSEOContent(content);

      expect(result.suggestions).toContain(
        'Consider adding relevant keywords for better SEO'
      );
    });
  });

  describe('generateSitemapEntry', () => {
    it('should generate valid sitemap entry', () => {
      const url = 'https://example.com/test-page';
      const options = {
        lastModified: new Date('2024-01-01'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };

      const entry = generateSitemapEntry(url, options);

      expect(entry).toContain('<loc>https://example.com/test-page</loc>');
      expect(entry).toContain('<lastmod>2024-01-01T00:00:00.000Z</lastmod>');
      expect(entry).toContain('<changefreq>weekly</changefreq>');
      expect(entry).toContain('<priority>0.8</priority>');
    });

    it('should use default values when options not provided', () => {
      const url = 'https://example.com/test-page';
      const entry = generateSitemapEntry(url);

      expect(entry).toContain('<loc>https://example.com/test-page</loc>');
      expect(entry).toContain('<changefreq>monthly</changefreq>');
      expect(entry).toContain('<priority>0.5</priority>');
    });
  });
});
