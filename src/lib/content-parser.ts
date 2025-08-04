import { z } from 'zod';
import matter from 'gray-matter';
import {
  projectSchema,
  pageSchema,
  siteConfigSchema,
  blogPostSchema,
  serviceSchema,
  testimonialSchema,
} from './schemas';
import type {
  Project,
  Page,
  SiteConfig,
  BlogPost,
  Service,
  Testimonial,
} from '@/types/content';

// Generic content parser with validation
export class ContentParser {
  /**
   * Parse and validate project content from markdown
   */
  static parseProject(content: string): Project {
    try {
      const { data, content: markdownContent } = matter(content);

      // Add content to the data object
      const projectData = {
        ...data,
        content: markdownContent,
        // Ensure dates are properly formatted
        completedAt: new Date(data.completedAt),
        publishedAt: new Date(data.publishedAt || Date.now()),
        updatedAt: new Date(data.updatedAt || Date.now()),
      };

      return projectSchema.parse(projectData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Project validation failed: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw new Error(`Failed to parse project content: ${error}`);
    }
  }

  /**
   * Parse and validate page content from markdown
   */
  static parsePage(content: string): Page {
    try {
      const { data, content: markdownContent } = matter(content);

      const pageData = {
        ...data,
        content: markdownContent,
        publishedAt: new Date(data.publishedAt || Date.now()),
        updatedAt: new Date(data.updatedAt || Date.now()),
      };

      return pageSchema.parse(pageData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Page validation failed: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw new Error(`Failed to parse page content: ${error}`);
    }
  }

  /**
   * Parse and validate site configuration
   */
  static parseSiteConfig(content: string): SiteConfig {
    try {
      const { data } = matter(content);
      return siteConfigSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Site config validation failed: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw new Error(`Failed to parse site config: ${error}`);
    }
  }

  /**
   * Parse and validate blog post content from markdown
   */
  static parseBlogPost(content: string): BlogPost {
    try {
      const { data, content: markdownContent } = matter(content);

      const blogPostData = {
        ...data,
        content: markdownContent,
        publishedAt: new Date(data.publishedAt || Date.now()),
        updatedAt: new Date(data.updatedAt || Date.now()),
      };

      return blogPostSchema.parse(blogPostData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Blog post validation failed: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw new Error(`Failed to parse blog post content: ${error}`);
    }
  }

  /**
   * Parse and validate service content from markdown
   */
  static parseService(content: string): Service {
    try {
      const { data, content: markdownContent } = matter(content);

      const serviceData = {
        ...data,
        content: markdownContent,
      };

      return serviceSchema.parse(serviceData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Service validation failed: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw new Error(`Failed to parse service content: ${error}`);
    }
  }

  /**
   * Parse and validate testimonial content
   */
  static parseTestimonial(content: string): Testimonial {
    try {
      const { data } = matter(content);

      const testimonialData = {
        ...data,
        publishedAt: new Date(data.publishedAt || Date.now()),
      };

      return testimonialSchema.parse(testimonialData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Testimonial validation failed: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw new Error(`Failed to parse testimonial content: ${error}`);
    }
  }

  /**
   * Generate slug from title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Extract excerpt from content
   */
  static extractExcerpt(content: string, maxLength: number = 160): string {
    // Remove markdown formatting
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/`(.*?)`/g, '$1') // Remove code
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    // Find the last complete word within the limit
    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return lastSpace > 0
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  /**
   * Validate content type based on file path or content
   */
  static getContentType(
    filePath: string
  ):
    | 'project'
    | 'page'
    | 'blog'
    | 'service'
    | 'testimonial'
    | 'config'
    | 'unknown' {
    const path = filePath.toLowerCase();

    if (path.includes('/projects/')) return 'project';
    if (path.includes('/pages/')) return 'page';
    if (path.includes('/blog/')) return 'blog';
    if (path.includes('/services/')) return 'service';
    if (path.includes('/testimonials/')) return 'testimonial';
    if (path.includes('config.') || path.includes('settings.')) return 'config';

    return 'unknown';
  }

  /**
   * Parse any content type based on file path
   */
  static parseContent(
    content: string,
    filePath: string
  ): Project | Page | BlogPost | Service | Testimonial | SiteConfig {
    const contentType = this.getContentType(filePath);

    switch (contentType) {
      case 'project':
        return this.parseProject(content);
      case 'page':
        return this.parsePage(content);
      case 'blog':
        return this.parseBlogPost(content);
      case 'service':
        return this.parseService(content);
      case 'testimonial':
        return this.parseTestimonial(content);
      case 'config':
        return this.parseSiteConfig(content);
      default:
        throw new Error(`Unknown content type for file: ${filePath}`);
    }
  }
}
