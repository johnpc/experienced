import { MetadataRoute } from 'next';
import { ContentFetcher } from '@/lib/content-fetcher';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://premierconstructionco.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  try {
    const contentFetcher = new ContentFetcher();
    const [services, projects, pages] = await Promise.all([
      contentFetcher.getServices(),
      contentFetcher.getProjects(),
      contentFetcher.getPages(),
    ]);

    // Dynamic service pages
    const servicePages = services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Dynamic project pages
    const projectPages = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Dynamic content pages
    const contentPages = pages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

    return [...staticPages, ...servicePages, ...projectPages, ...contentPages];
  } catch (error) {
    console.error('Failed to generate dynamic sitemap:', error);
    // Return static pages as fallback
    return staticPages;
  }
}
