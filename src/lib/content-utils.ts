import { ProjectCategory } from '@/types/content';

// Content type constants
export const CONTENT_TYPES = {
  PROJECT: 'project',
  PAGE: 'page',
  BLOG: 'blog',
  SERVICE: 'service',
  TESTIMONIAL: 'testimonial',
  CONFIG: 'config',
} as const;

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

// Project category display names
export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  [ProjectCategory.KITCHEN]: 'Kitchen Remodeling',
  [ProjectCategory.BATHROOM]: 'Bathroom Renovation',
  [ProjectCategory.ADDITION]: 'Home Additions',
  [ProjectCategory.RENOVATION]: 'Home Renovation',
  [ProjectCategory.EXTERIOR]: 'Exterior Work',
  [ProjectCategory.COMMERCIAL]: 'Commercial Projects',
};

// Content status options
export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;

export type ContentStatus =
  (typeof CONTENT_STATUS)[keyof typeof CONTENT_STATUS];

// SEO helpers
export const SEO_LIMITS = {
  TITLE_MAX: 60,
  DESCRIPTION_MAX: 160,
  EXCERPT_MAX: 300,
} as const;

// File extension helpers
export const SUPPORTED_IMAGE_FORMATS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'avif',
  'gif',
] as const;

export const SUPPORTED_CONTENT_FORMATS = [
  'md',
  'mdx',
  'yml',
  'yaml',
  'json',
] as const;

// Validation helpers
export function isValidImageFormat(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? SUPPORTED_IMAGE_FORMATS.includes(extension as any) : false;
}

export function isValidContentFormat(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension
    ? SUPPORTED_CONTENT_FORMATS.includes(extension as any)
    : false;
}

// URL helpers
export function createProjectUrl(slug: string): string {
  return `/projects/${slug}`;
}

export function createPageUrl(slug: string): string {
  return `/${slug}`;
}

export function createBlogUrl(slug: string): string {
  return `/blog/${slug}`;
}

export function createServiceUrl(slug: string): string {
  return `/services/${slug}`;
}

// Content sorting helpers
export function sortByDate<T extends { publishedAt: Date }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

export function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function filterByStatus<T extends { status: ContentStatus }>(
  items: T[],
  status: ContentStatus
): T[] {
  return items.filter((item) => item.status === status);
}

export function filterByCategory<T extends { category: ProjectCategory }>(
  items: T[],
  category: ProjectCategory
): T[] {
  return items.filter((item) => item.category === category);
}

export function filterFeatured<T extends { featured: boolean }>(
  items: T[]
): T[] {
  return items.filter((item) => item.featured);
}

// Search helpers
export function searchContent<
  T extends { title: string; description?: string; content?: string },
>(items: T[], query: string): T[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return items;

  return items.filter((item) => {
    const searchableText = [
      item.title,
      item.description || '',
      item.content || '',
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });
}

// Date formatting helpers
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'iso' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'iso':
      return dateObj.toISOString().split('T')[0];
    default:
      return dateObj.toLocaleDateString();
  }
}

// Content validation helpers
export function validateContentLength(
  content: string,
  maxLength: number
): boolean {
  return content.length <= maxLength;
}

export function validateSlugFormat(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

export function validateEmailFormat(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhoneFormat(phone: string): boolean {
  return /^[\+]?[1-9][\d]{0,15}$/.test(phone);
}

// Content transformation helpers
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength - suffix.length);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + suffix
    : truncated + suffix;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}
