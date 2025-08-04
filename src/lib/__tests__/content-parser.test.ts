import { ContentParser } from '../content-parser';
import { ProjectCategory } from '@/types/content';

describe('ContentParser', () => {
  describe('parseProject', () => {
    it('should parse valid project content', () => {
      const content = `---
id: "kitchen-remodel-2024"
title: "Modern Kitchen Remodel"
description: "Complete kitchen transformation with custom cabinets and granite countertops"
category: "kitchen"
completedAt: "2024-01-15"
featured: true
images:
  - src: "https://example.com/kitchen1.jpg"
    alt: "Modern kitchen with white cabinets"
  - src: "https://example.com/kitchen2.jpg"
    alt: "Kitchen island with granite countertop"
seo:
  title: "Modern Kitchen Remodel - Premier Construction"
  description: "See our stunning kitchen remodel featuring custom cabinets and granite countertops"
  keywords: ["kitchen remodel", "custom cabinets", "granite countertops"]
status: "published"
---

This beautiful kitchen remodel transformed a dated space into a modern culinary haven.

## Features
- Custom white shaker cabinets
- Granite countertops
- Stainless steel appliances
- Subway tile backsplash`;

      const result = ContentParser.parseProject(content);

      expect(result.id).toBe('kitchen-remodel-2024');
      expect(result.title).toBe('Modern Kitchen Remodel');
      expect(result.category).toBe(ProjectCategory.KITCHEN);
      expect(result.featured).toBe(true);
      expect(result.images).toHaveLength(2);
      expect(result.content).toContain('This beautiful kitchen remodel');
      expect(result.seo.title).toBe(
        'Modern Kitchen Remodel - Premier Construction'
      );
    });

    it('should throw error for invalid project content', () => {
      const content = `---
id: ""
title: ""
description: ""
category: "invalid-category"
completedAt: "invalid-date"
images: []
seo:
  title: ""
  description: ""
  keywords: []
---

Content here`;

      expect(() => ContentParser.parseProject(content)).toThrow(
        'Project validation failed'
      );
    });
  });

  describe('parsePage', () => {
    it('should parse valid page content', () => {
      const content = `---
id: "about-us"
title: "About Our Company"
slug: "about"
seo:
  title: "About Us - Premier Construction"
  description: "Learn about our construction company's history and values"
  keywords: ["construction company", "about us", "history"]
status: "published"
---

# About Premier Construction

We have been serving the community for over 20 years.`;

      const result = ContentParser.parsePage(content);

      expect(result.id).toBe('about-us');
      expect(result.title).toBe('About Our Company');
      expect(result.slug).toBe('about');
      expect(result.content).toContain('# About Premier Construction');
    });

    it('should throw error for invalid slug format', () => {
      const content = `---
id: "about-us"
title: "About Our Company"
slug: "About Us!"
seo:
  title: "About Us"
  description: "About us page"
  keywords: []
---

Content`;

      expect(() => ContentParser.parsePage(content)).toThrow(
        'Page validation failed'
      );
    });
  });

  describe('generateSlug', () => {
    it('should generate valid slugs from titles', () => {
      expect(ContentParser.generateSlug('Kitchen Remodeling Services')).toBe(
        'kitchen-remodeling-services'
      );
      expect(ContentParser.generateSlug('Bathroom Renovation & Design')).toBe(
        'bathroom-renovation-design'
      );
      expect(ContentParser.generateSlug('  Home   Additions  ')).toBe(
        'home-additions'
      );
      expect(ContentParser.generateSlug('Custom Work - Premium Quality!')).toBe(
        'custom-work-premium-quality'
      );
    });

    it('should handle edge cases', () => {
      expect(ContentParser.generateSlug('')).toBe('');
      expect(ContentParser.generateSlug('   ')).toBe('');
      expect(ContentParser.generateSlug('123')).toBe('123');
      expect(ContentParser.generateSlug('---')).toBe('');
    });
  });

  describe('extractExcerpt', () => {
    it('should extract plain text excerpt from markdown', () => {
      const content = `# Heading

This is **bold text** and *italic text* with a [link](http://example.com).

Here's another paragraph with \`code\` formatting.`;

      const excerpt = ContentParser.extractExcerpt(content, 50);

      expect(excerpt).toBe(
        'Heading This is bold text and italic text with a...'
      );
      expect(excerpt.length).toBeLessThanOrEqual(53); // 50 + "..."
    });

    it('should return full content if under limit', () => {
      const content = 'Short content';
      const excerpt = ContentParser.extractExcerpt(content, 100);

      expect(excerpt).toBe('Short content');
    });
  });

  describe('getContentType', () => {
    it('should identify content types from file paths', () => {
      expect(
        ContentParser.getContentType('/content/projects/kitchen-remodel.md')
      ).toBe('project');
      expect(ContentParser.getContentType('/content/pages/about.md')).toBe(
        'page'
      );
      expect(
        ContentParser.getContentType('/content/blog/latest-trends.md')
      ).toBe('blog');
      expect(
        ContentParser.getContentType('/content/services/kitchen-remodeling.md')
      ).toBe('service');
      expect(
        ContentParser.getContentType('/content/testimonials/john-doe.md')
      ).toBe('testimonial');
      expect(ContentParser.getContentType('/content/config.yml')).toBe(
        'config'
      );
      expect(ContentParser.getContentType('/content/unknown/file.md')).toBe(
        'unknown'
      );
    });
  });

  describe('parseSiteConfig', () => {
    it('should parse valid site configuration', () => {
      const content = `---
siteName: "Premier Construction & Remodeling"
siteUrl: "https://premierconstructionco.com"
description: "Professional construction and remodeling services"
contact:
  phone: "15551234567"
  email: "info@premierconstructionco.com"
  address:
    street: "123 Main St"
    city: "Anytown"
    state: "CA"
    zipCode: "12345"
    country: "US"
  businessHours:
    - day: "Monday"
      open: "08:00"
      close: "17:00"
    - day: "Tuesday"
      open: "08:00"
      close: "17:00"
social:
  facebook: "https://facebook.com/premierconstructionco"
  instagram: "https://instagram.com/premierconstructionco"
seo:
  defaultTitle: "Premier Construction & Remodeling"
  titleTemplate: "%s | Premier Construction"
  defaultDescription: "Professional construction and remodeling services"
  defaultKeywords: ["construction", "remodeling", "renovation"]
  ogImage: "https://premierconstructionco.com/og-image.jpg"
---`;

      const result = ContentParser.parseSiteConfig(content);

      expect(result.siteName).toBe('Premier Construction & Remodeling');
      expect(result.contact.phone).toBe('15551234567');
      expect(result.contact.address.city).toBe('Anytown');
      expect(result.social.facebook).toBe(
        'https://facebook.com/premierconstructionco'
      );
    });
  });
});
