import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { generateMetadata } from '@/lib/seo';
import { ContentFetcher } from '@/lib/content-fetcher';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import ProjectGallery from '@/components/projects/ProjectGallery';
import { ProjectErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ProjectGallerySkeleton } from '@/components/ui/LoadingStates';

export const metadata: Metadata = generateMetadata({
  title: 'Our Projects - Premier Construction & Remodeling Portfolio',
  description:
    'View our portfolio of completed construction and remodeling projects including kitchens, bathrooms, home additions, and complete renovations. Quality craftsmanship examples.',
  keywords: [
    'construction projects',
    'remodeling portfolio',
    'kitchen remodel examples',
    'bathroom renovation examples',
    'home addition projects',
  ],
  ogImage: '/images/og-projects.jpg',
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/projects`,
});

// Enable ISR with 30 minute revalidation
export const revalidate = 1800;

const projects = [
  {
    id: 'modern-kitchen-remodel',
    title: 'Modern Kitchen Transformation',
    category: 'Kitchen',
    description:
      'Complete kitchen renovation featuring custom cabinets, quartz countertops, and modern appliances.',
    image: '/images/projects/kitchen-modern.jpg',
    featured: true,
  },
  {
    id: 'luxury-bathroom-renovation',
    title: 'Luxury Master Bathroom',
    category: 'Bathroom',
    description:
      'Spa-like master bathroom with walk-in shower, soaking tub, and premium finishes.',
    image: '/images/projects/bathroom-luxury.jpg',
    featured: true,
  },
  {
    id: 'home-addition-family-room',
    title: 'Family Room Addition',
    category: 'Addition',
    description:
      'Spacious family room addition with vaulted ceilings and large windows.',
    image: '/images/projects/addition-family-room.jpg',
    featured: false,
  },
  {
    id: 'whole-house-renovation',
    title: 'Complete Home Renovation',
    category: 'Renovation',
    description:
      'Full home renovation including open floor plan, updated kitchen, and modern finishes.',
    image: '/images/projects/whole-house.jpg',
    featured: true,
  },
  {
    id: 'exterior-siding-project',
    title: 'Exterior Siding & Windows',
    category: 'Exterior',
    description:
      'New siding installation with energy-efficient windows and updated trim work.',
    image: '/images/projects/exterior-siding.jpg',
    featured: false,
  },
  {
    id: 'commercial-office-buildout',
    title: 'Office Space Buildout',
    category: 'Commercial',
    description:
      'Modern office space with open work areas, conference rooms, and break room.',
    image: '/images/projects/commercial-office.jpg',
    featured: false,
  },
];

const categories = [
  'All',
  'Kitchen',
  'Bathroom',
  'Addition',
  'Renovation',
  'Exterior',
  'Commercial',
];

async function ProjectsContent() {
  const contentFetcher = new ContentFetcher();
  const projects = await contentFetcher.getProjects();

  // Transform projects to match ProjectGallery interface
  const transformedProjects = projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    category: project.category,
    images: project.images || [],
    completedAt: project.completedAt,
    featured: project.featured || false,
    slug: project.id,
  }));

  return (
    <ProjectErrorBoundary>
      <ProjectGallery
        projects={transformedProjects}
        showFilters={true}
        showFeaturedFirst={true}
        gridCols={3}
        className="py-16"
      />
    </ProjectErrorBoundary>
  );
}

export default async function ProjectsPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
  ];

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <section className="border-b bg-gray-50 py-4">
        <div className="container-custom">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </section>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 text-white">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Our Projects
            </h1>
            <p className="text-xl text-primary-100">
              Explore our portfolio of completed construction and remodeling
              projects. Each project showcases our commitment to quality
              craftsmanship and attention to detail.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="bg-gray-50">
        <div className="container-custom">
          <div className="py-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Our Portfolio
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Explore our comprehensive portfolio of completed construction and
              remodeling projects. Each project showcases our commitment to
              quality craftsmanship and attention to detail.
            </p>
          </div>

          <Suspense
            fallback={<ProjectGallerySkeleton count={9} gridCols={3} />}
          >
            <ProjectsContent />
          </Suspense>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Our Project Process
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Every project follows our proven process to ensure quality results
              and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Initial Consultation
              </h3>
              <p className="text-sm text-gray-600">
                We meet with you to understand your vision, needs, and budget.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Design & Planning
              </h3>
              <p className="text-sm text-gray-600">
                Detailed plans, 3D renderings, and material selections are
                created.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Construction
              </h3>
              <p className="text-sm text-gray-600">
                Professional construction with regular updates and quality
                control.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Final Walkthrough
              </h3>
              <p className="text-sm text-gray-600">
                Complete inspection, cleanup, and warranty documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 text-white">
        <div className="container-custom text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Start Your Project?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-100">
            Let's discuss your vision and create something amazing together.
            Contact us today for a free consultation and estimate.
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
  );
}
