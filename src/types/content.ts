// Core content type definitions for the CMS

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  seo: SEOMetadata;
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export enum ProjectCategory {
  KITCHEN = 'kitchen',
  BATHROOM = 'bathroom',
  ADDITION = 'addition',
  RENOVATION = 'renovation',
  EXTERIOR = 'exterior',
  COMMERCIAL = 'commercial',
}

export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  images: ProjectImage[];
  category: ProjectCategory;
  completedAt: Date;
  featured: boolean;
  seo: SEOMetadata;
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: Address;
  businessHours: BusinessHours[];
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface GlobalSEO {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultKeywords: string[];
  ogImage: string;
  twitterHandle?: string;
}

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  description: string;
  contact: ContactInfo;
  social: SocialLinks;
  seo: GlobalSEO;
  logo?: string;
  favicon?: string;
}

// Blog post interface for future expansion
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  category: string;
  featuredImage?: string;
  seo: SEOMetadata;
  status: 'draft' | 'published';
}

// Service interface for service pages
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  icon?: string;
  featuredImage?: string;
  gallery?: ProjectImage[];
  features?: string[];
  seo: SEOMetadata;
  order: number;
  featured: boolean;
  status: 'draft' | 'published';
}

// Testimonial interface
export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
  projectId?: string;
  featured: boolean;
  publishedAt: Date;
}
