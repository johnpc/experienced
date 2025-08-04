import type { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface StructuredDataConfig {
  '@type': string;
  name: string;
  description?: string;
  url?: string;
  image?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone?: string;
  email?: string;
  openingHours?: string[];
  priceRange?: string;
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
  review?: Array<{
    '@type': 'Review';
    author: {
      '@type': 'Person';
      name: string;
    };
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number;
    };
    reviewBody: string;
  }>;
}

// Default SEO configuration
const DEFAULT_SEO = {
  siteName: 'Premier Construction & Remodeling',
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || 'https://premierconstructionco.com',
  defaultTitle:
    'Premier Construction & Remodeling - Quality Construction Services',
  titleTemplate: '%s | Premier Construction & Remodeling',
  defaultDescription:
    'Professional construction and remodeling services for your home and business. Quality craftsmanship, reliable service, and exceptional results for over 20 years.',
  defaultKeywords: [
    'construction',
    'remodeling',
    'renovation',
    'contractor',
    'home improvement',
    'kitchen remodel',
    'bathroom renovation',
    'home additions',
  ],
  defaultOGImage: '/images/og-default.jpg',
  twitterHandle: '@premierconstructionco',
};

/**
 * Generate Next.js metadata object with SEO optimization
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    canonical,
    noindex = false,
    nofollow = false,
  } = config;

  const fullTitle = title.includes('|')
    ? title
    : `${title} | ${DEFAULT_SEO.siteName}`;
  const imageUrl = ogImage || DEFAULT_SEO.defaultOGImage;
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${DEFAULT_SEO.siteUrl}${imageUrl}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [...DEFAULT_SEO.defaultKeywords, ...keywords],
    authors: [{ name: DEFAULT_SEO.siteName }],
    creator: DEFAULT_SEO.siteName,
    publisher: DEFAULT_SEO.siteName,

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || DEFAULT_SEO.siteUrl,
      siteName: DEFAULT_SEO.siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: ogType as any,
    },

    // Twitter
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [fullImageUrl],
      creator: DEFAULT_SEO.twitterHandle,
      site: DEFAULT_SEO.twitterHandle,
    },

    // Robots
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Additional metadata
    category: 'Construction & Remodeling',
    classification: 'Business',
  };

  // Add canonical URL if provided
  if (canonical) {
    metadata.alternates = {
      canonical,
    };
  }

  return metadata;
}

/**
 * Generate structured data (JSON-LD) for construction business
 */
export function generateBusinessStructuredData(): string {
  const businessData = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: 'Premier Construction & Remodeling',
    description:
      'Professional construction and remodeling services for residential and commercial properties.',
    url: DEFAULT_SEO.siteUrl,
    logo: `${DEFAULT_SEO.siteUrl}/images/logo.png`,
    image: `${DEFAULT_SEO.siteUrl}/images/og-default.jpg`,

    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Construction Way',
      addressLocality: 'Builder City',
      addressRegion: 'CA',
      postalCode: '12345',
      addressCountry: 'US',
    },

    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      availableLanguage: 'English',
    },

    telephone: '+1-555-123-4567',
    email: 'info@premierconstructionco.com',

    openingHours: ['Mo-Fr 08:00-17:00', 'Sa 09:00-15:00'],

    priceRange: '$$',

    areaServed: {
      '@type': 'State',
      name: 'California',
    },

    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 37.7749,
        longitude: -122.4194,
      },
      geoRadius: '50 miles',
    },

    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Construction & Remodeling Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Kitchen Remodeling',
            description:
              'Complete kitchen renovation services including custom cabinets, countertops, and appliances.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Bathroom Renovation',
            description:
              'Professional bathroom remodeling with modern fixtures, tile work, and accessibility features.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Home Additions',
            description:
              'Custom home additions to expand your living space with quality construction.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Complete Home Renovation',
            description:
              'Full home renovation services from design to completion.',
          },
        },
      ],
    },

    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 127,
      bestRating: 5,
      worstRating: 1,
    },

    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Sarah Johnson',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5,
        },
        reviewBody:
          'Premier Construction exceeded our expectations in every way. The attention to detail and quality of work is outstanding. Our new kitchen is the heart of our home!',
        datePublished: '2024-01-15',
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Mike Davis',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5,
        },
        reviewBody:
          'Professional, reliable, and high-quality work. They completed our bathroom renovation on time and within budget. Highly recommended!',
        datePublished: '2024-01-10',
      },
    ],

    sameAs: [
      'https://www.facebook.com/premierconstructionco',
      'https://www.instagram.com/premierconstructionco',
      'https://www.linkedin.com/company/premierconstructionco',
    ],
  };

  return JSON.stringify(businessData, null, 2);
}

/**
 * Generate structured data for a specific service
 */
export function generateServiceStructuredData(service: {
  name: string;
  description: string;
  url: string;
  image?: string;
}): string {
  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    image:
      service.image ||
      `${DEFAULT_SEO.siteUrl}/images/services/${service.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,

    provider: {
      '@type': 'GeneralContractor',
      name: 'Premier Construction & Remodeling',
      url: DEFAULT_SEO.siteUrl,
      telephone: '+1-555-123-4567',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Construction Way',
        addressLocality: 'Builder City',
        addressRegion: 'CA',
        postalCode: '12345',
        addressCountry: 'US',
      },
    },

    areaServed: {
      '@type': 'State',
      name: 'California',
    },

    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: service.name,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description,
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'USD',
            price: 'Contact for quote',
          },
        },
      ],
    },
  };

  return JSON.stringify(serviceData, null, 2);
}

/**
 * Generate structured data for a project/portfolio item
 */
export function generateProjectStructuredData(project: {
  name: string;
  description: string;
  url: string;
  image: string;
  dateCompleted: string;
  category: string;
}): string {
  const projectData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    url: project.url,
    image: project.image,
    dateCreated: project.dateCompleted,

    creator: {
      '@type': 'GeneralContractor',
      name: 'Premier Construction & Remodeling',
      url: DEFAULT_SEO.siteUrl,
    },

    about: {
      '@type': 'Service',
      name: project.category,
      provider: {
        '@type': 'GeneralContractor',
        name: 'Premier Construction & Remodeling',
      },
    },

    keywords: [project.category, 'construction', 'remodeling', 'renovation'],
  };

  return JSON.stringify(projectData, null, 2);
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>
): string {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return JSON.stringify(breadcrumbData, null, 2);
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(
  faqs: Array<{
    question: string;
    answer: string;
  }>
): string {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return JSON.stringify(faqData, null, 2);
}

/**
 * Validate and optimize SEO content
 */
export function validateSEOContent(content: {
  title: string;
  description: string;
  keywords?: string[];
}): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Title validation
  if (content.title.length < 30) {
    warnings.push('Title is too short (recommended: 30-60 characters)');
  }
  if (content.title.length > 60) {
    warnings.push('Title is too long (recommended: 30-60 characters)');
  }

  // Description validation
  if (content.description.length < 120) {
    warnings.push('Description is too short (recommended: 120-160 characters)');
  }
  if (content.description.length > 160) {
    warnings.push('Description is too long (recommended: 120-160 characters)');
  }

  // Keywords validation
  if (!content.keywords || content.keywords.length === 0) {
    suggestions.push('Consider adding relevant keywords for better SEO');
  }
  if (content.keywords && content.keywords.length > 10) {
    suggestions.push(
      'Consider reducing the number of keywords (recommended: 5-10)'
    );
  }

  // Content quality suggestions
  if (
    !content.title.toLowerCase().includes('construction') &&
    !content.title.toLowerCase().includes('remodel')
  ) {
    suggestions.push('Consider including industry-relevant terms in the title');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions,
  };
}

/**
 * Generate sitemap entry for a page
 */
export function generateSitemapEntry(
  url: string,
  options: {
    lastModified?: Date;
    changeFrequency?:
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'never';
    priority?: number;
  } = {}
): string {
  const {
    lastModified = new Date(),
    changeFrequency = 'monthly',
    priority = 0.5,
  } = options;

  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified.toISOString()}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export { DEFAULT_SEO };
