import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  generateMetadata as generateSEOMetadata,
  generateProjectStructuredData,
} from '@/lib/seo';
import { ContentFetcher } from '@/lib/content-fetcher';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import ImageCarousel from '@/components/projects/ImageCarousel';
import RichTextRenderer from '@/components/content/RichTextRenderer';
import {
  ProjectErrorBoundary,
  ContentErrorBoundary,
  ImageErrorBoundary,
} from '@/components/ui/ErrorBoundary';
import {
  ImageCarouselSkeleton,
  ContentSkeleton,
} from '@/components/ui/LoadingStates';

// This would typically come from your CMS or database
const projects = {
  'modern-kitchen-remodel': {
    title: 'Modern Kitchen Transformation',
    category: 'Kitchen',
    description:
      'Complete kitchen renovation featuring custom cabinets, quartz countertops, and modern appliances.',
    completedAt: '2024-01-15',
    featured: true,
    images: [
      {
        src: '/images/projects/kitchen-before.jpg',
        alt: 'Kitchen before renovation showing dated cabinets and countertops',
        caption: 'Before: Dated kitchen with worn cabinets',
      },
      {
        src: '/images/projects/kitchen-after.jpg',
        alt: 'Modern kitchen with white cabinets and quartz countertops',
        caption: 'After: Stunning modern transformation',
      },
      {
        src: '/images/projects/kitchen-island.jpg',
        alt: 'Large kitchen island with seating and storage',
        caption: 'Custom island with breakfast bar seating',
      },
    ],
    content: `
# Modern Kitchen Transformation

This stunning kitchen remodel completely transformed a dated 1990s kitchen into a modern culinary masterpiece. The project showcases our expertise in custom cabinetry, stone work, and space optimization.

## Project Highlights

### Custom Cabinetry
- Soft-close white shaker cabinets
- Crown molding and decorative trim
- Pull-out drawers and organizers
- Under-cabinet LED lighting

### Premium Surfaces
- Quartz countertops with waterfall edge
- Subway tile backsplash with decorative accent
- Luxury vinyl plank flooring
- Custom tile work around range

### Modern Appliances
- Stainless steel appliance package
- 36" gas range with hood
- Built-in microwave and dishwasher
- Counter-depth refrigerator

### Space Optimization
- Removed wall to create open concept
- Added large center island with seating
- Maximized storage with floor-to-ceiling cabinets
- Created dedicated coffee station

## Timeline & Process

**Week 1-2**: Demolition and structural work
**Week 3-4**: Electrical and plumbing rough-in
**Week 5-6**: Drywall, painting, and flooring
**Week 7-8**: Cabinet installation and countertops
**Week 9**: Final details and appliance installation

## Client Testimonial

*"Premier Construction exceeded our expectations in every way. The attention to detail and quality of work is outstanding. Our new kitchen is the heart of our home!"* - Sarah & Mike Johnson
    `,
    seo: {
      title: 'Modern Kitchen Remodel - Premier Construction Project',
      description:
        'See our stunning kitchen transformation featuring custom cabinets, quartz countertops, and modern design elements.',
      keywords: [
        'kitchen remodel',
        'modern kitchen',
        'custom cabinets',
        'quartz countertops',
        'kitchen renovation',
      ],
    },
  },
  // Add more projects here...
};

type Props = {
  params: { slug: string };
};

// Enable ISR with 30 minute revalidation
export const revalidate = 1800;

// Generate static params for all projects
export async function generateStaticParams() {
  try {
    const contentFetcher = new ContentFetcher();
    const { projectPaths } = await contentFetcher.getContentPaths();

    return projectPaths.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for projects:', error);
    // Fallback to hardcoded project slugs for build-time generation
    return [
      { slug: 'modern-kitchen-remodel' },
      // Add more fallback slugs as needed
    ];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const contentFetcher = new ContentFetcher();
    const project = await contentFetcher.getProject(params.slug);

    if (!project) {
      return {
        title: 'Project Not Found',
      };
    }

    return generateSEOMetadata({
      title: project.seo.title,
      description: project.seo.description,
      keywords: project.seo.keywords,
      ogImage: project.images[0]?.src || '/images/og-projects.jpg',
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${params.slug}`,
    });
  } catch (error) {
    return {
      title: 'Project Not Found',
    };
  }
}

export default async function ProjectPage({ params }: Props) {
  const contentFetcher = new ContentFetcher();
  const project = await contentFetcher.getProject(params.slug);

  if (!project) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: project.title, href: `/projects/${params.slug}` },
  ];

  // Generate structured data for the project
  const projectStructuredData = generateProjectStructuredData({
    name: project.title,
    description: project.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${params.slug}`,
    image: `${process.env.NEXT_PUBLIC_SITE_URL}${project.images[0]?.src}`,
    dateCompleted:
      typeof project.completedAt === 'string'
        ? project.completedAt
        : project.completedAt.toISOString(),
    category: project.category,
  });

  return (
    <ProjectErrorBoundary>
      <div className="bg-white">
        <StructuredData data={projectStructuredData} />
        {/* Breadcrumb */}
        <section className="border-b bg-gray-50 py-4">
          <div className="container-custom">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-4">
                  <span className="text-primary-800 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium">
                    {project.category}
                  </span>
                </div>
                <h1 className="mb-6 text-4xl font-bold text-gray-900">
                  {project.title}
                </h1>
                <p className="mb-6 text-lg text-gray-600">
                  {project.description}
                </p>
                <div className="mb-8 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Completed:{' '}
                  {new Date(project.completedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/contact" className="btn-primary">
                    Start Your Project
                  </Link>
                  <Link href="/projects" className="btn-secondary">
                    View All Projects
                  </Link>
                </div>
              </div>

              <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">Main Project Image</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Gallery */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Project Gallery
            </h2>

            <div className="mx-auto max-w-4xl">
              <ImageErrorBoundary>
                <Suspense
                  fallback={
                    <ImageCarouselSkeleton
                      aspectRatio="video"
                      showThumbnails={true}
                    />
                  }
                >
                  <ImageCarousel
                    images={project.images}
                    showThumbnails={true}
                    showCaptions={true}
                    aspectRatio="video"
                    className="mb-8"
                  />
                </Suspense>
              </ImageErrorBoundary>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-16">
          <div className="container-custom">
            <ContentErrorBoundary>
              <Suspense
                fallback={<ContentSkeleton className="mx-auto max-w-4xl" />}
              >
                <RichTextRenderer
                  content={project.content || ''}
                  enableTOC={true}
                  maxWidth="prose"
                  className="mx-auto max-w-4xl"
                />
              </Suspense>
            </ContentErrorBoundary>
          </div>
        </section>

        {/* Related Projects */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Related Projects
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(projects)
                .filter(([slug]) => slug !== params.slug)
                .slice(0, 3)
                .map(([slug, relatedProject]) => (
                  <div
                    key={slug}
                    className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
                  >
                    <div className="relative h-48 bg-gray-200">
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">Project Image</span>
                      </div>
                      <div className="absolute left-3 top-3">
                        <span className="rounded bg-primary-600 px-2 py-1 text-xs font-medium text-white">
                          {relatedProject.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {relatedProject.title}
                      </h3>
                      <p className="mb-4 text-sm text-gray-600">
                        {relatedProject.description}
                      </p>
                      <Link
                        href={`/projects/${slug}`}
                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        View Project
                        <svg
                          className="ml-1 h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 py-16 text-white">
          <div className="container-custom text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Inspired by This Project?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-100">
              Let's create something amazing for your space. Contact us today to
              discuss your vision and get a free consultation.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-lg bg-white px-8 py-3 font-medium text-primary-600 transition-colors duration-200 hover:bg-gray-100"
              >
                Get Free Consultation
              </Link>
              <a
                href="tel:555-123-4567"
                className="rounded-lg border-2 border-white px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-white hover:text-primary-600"
              >
                Call (555) 123-4567
              </a>
            </div>
          </div>
        </section>
      </div>
    </ProjectErrorBoundary>
  );
}
