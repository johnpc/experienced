import { z } from 'zod';
import { ProjectCategory } from '@/types/content';

// SEO Metadata Schema
export const seoMetadataSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(60, 'Title should be under 60 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(160, 'Description should be under 160 characters'),
  keywords: z.array(z.string()).default([]),
  ogImage: z.string().url().optional(),
  ogType: z.string().optional(),
  twitterCard: z.enum(['summary', 'summary_large_image']).optional(),
});

// Project Image Schema
export const projectImageSchema = z.object({
  src: z.string().url('Image source must be a valid URL'),
  alt: z.string().min(1, 'Alt text is required for accessibility'),
  caption: z.string().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

// Project Category Schema
export const projectCategorySchema = z.nativeEnum(ProjectCategory);

// Project Schema
export const projectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  title: z
    .string()
    .min(1, 'Project title is required')
    .max(100, 'Title should be under 100 characters'),
  description: z
    .string()
    .min(1, 'Project description is required')
    .max(500, 'Description should be under 500 characters'),
  content: z.string().optional(),
  images: z.array(projectImageSchema).min(1, 'At least one image is required'),
  category: projectCategorySchema,
  completedAt: z.coerce.date(),
  featured: z.boolean().default(false),
  seo: seoMetadataSchema,
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  status: z.enum(['draft', 'published']).default('draft'),
});

// Page Schema
export const pageSchema = z.object({
  id: z.string().min(1, 'Page ID is required'),
  title: z
    .string()
    .min(1, 'Page title is required')
    .max(100, 'Title should be under 100 characters'),
  slug: z
    .string()
    .min(1, 'Page slug is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  content: z.string().min(1, 'Page content is required'),
  seo: seoMetadataSchema,
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  status: z.enum(['draft', 'published']).default('draft'),
});

// Address Schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z
    .string()
    .min(2, 'State is required')
    .max(2, 'State should be 2 characters'),
  zipCode: z
    .string()
    .min(5, 'ZIP code is required')
    .max(10, 'ZIP code should be under 10 characters'),
  country: z.string().min(1, 'Country is required').default('US'),
});

// Business Hours Schema
export const businessHoursSchema = z.object({
  day: z.string().min(1, 'Day is required'),
  open: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Open time must be in HH:MM format'
    ),
  close: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Close time must be in HH:MM format'
    ),
  closed: z.boolean().optional(),
});

// Contact Info Schema
export const contactInfoSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number is required')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address'),
  address: addressSchema,
  businessHours: z.array(businessHoursSchema),
});

// Social Links Schema
export const socialLinksSchema = z.object({
  facebook: z.string().url().optional(),
  instagram: z.string().url().optional(),
  twitter: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  youtube: z.string().url().optional(),
});

// Global SEO Schema
export const globalSEOSchema = z.object({
  defaultTitle: z.string().min(1, 'Default title is required'),
  titleTemplate: z.string().min(1, 'Title template is required'),
  defaultDescription: z.string().min(1, 'Default description is required'),
  defaultKeywords: z.array(z.string()),
  ogImage: z.string().url('OG image must be a valid URL'),
  twitterHandle: z.string().optional(),
});

// Site Config Schema
export const siteConfigSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteUrl: z.string().url('Site URL must be a valid URL'),
  description: z.string().min(1, 'Site description is required'),
  contact: contactInfoSchema,
  social: socialLinksSchema,
  seo: globalSEOSchema,
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
});

// Blog Post Schema
export const blogPostSchema = z.object({
  id: z.string().min(1, 'Blog post ID is required'),
  title: z
    .string()
    .min(1, 'Blog post title is required')
    .max(100, 'Title should be under 100 characters'),
  slug: z
    .string()
    .min(1, 'Blog post slug is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .max(300, 'Excerpt should be under 300 characters'),
  content: z.string().min(1, 'Blog post content is required'),
  author: z.string().min(1, 'Author is required'),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  tags: z.array(z.string()),
  category: z.string().min(1, 'Category is required'),
  featuredImage: z.string().url().optional(),
  seo: seoMetadataSchema,
  status: z.enum(['draft', 'published']).default('draft'),
});

// Service Schema
export const serviceSchema = z.object({
  id: z.string().min(1, 'Service ID is required'),
  title: z
    .string()
    .min(1, 'Service title is required')
    .max(100, 'Title should be under 100 characters'),
  slug: z
    .string()
    .min(1, 'Service slug is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  description: z
    .string()
    .min(1, 'Service description is required')
    .max(300, 'Description should be under 300 characters'),
  content: z.string().min(1, 'Service content is required'),
  icon: z.string().optional(),
  featuredImage: z.string().url().optional(),
  gallery: z.array(projectImageSchema).optional(),
  seo: seoMetadataSchema,
  order: z.number().int().min(0),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
});

// Testimonial Schema
export const testimonialSchema = z.object({
  id: z.string().min(1, 'Testimonial ID is required'),
  name: z.string().min(1, 'Name is required'),
  company: z.string().optional(),
  content: z
    .string()
    .min(1, 'Testimonial content is required')
    .max(500, 'Content should be under 500 characters'),
  rating: z.number().int().min(1).max(5),
  avatar: z.string().url().optional(),
  projectId: z.string().optional(),
  featured: z.boolean().default(false),
  publishedAt: z.coerce.date(),
});

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name should be under 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject should be under 200 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message should be under 1000 characters'),
  projectType: z.string().optional(),
  budget: z.string().optional(),
});

// Export type inference helpers
export type SEOMetadataInput = z.infer<typeof seoMetadataSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type PageInput = z.infer<typeof pageSchema>;
export type SiteConfigInput = z.infer<typeof siteConfigSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
