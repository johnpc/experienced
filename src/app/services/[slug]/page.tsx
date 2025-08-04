import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  generateMetadata as generateSEOMetadata,
  generateServiceStructuredData,
} from '@/lib/seo';
import { ContentFetcher } from '@/lib/content-fetcher';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';

// This would typically come from your CMS or database
const services = {
  'kitchen-remodeling': {
    title: 'Kitchen Remodeling',
    description:
      'Transform your kitchen with our comprehensive remodeling services, from design to completion.',
    icon: 'kitchen',
    featuredImage: '/images/services/kitchen-remodeling-hero.jpg',
    content: `
# Kitchen Remodeling Services

Transform the heart of your home with our comprehensive kitchen remodeling services. From minor updates to complete renovations, we bring your vision to life with quality craftsmanship and attention to detail.

## Our Kitchen Services

### Custom Cabinetry
- Design and installation of custom cabinets
- Refacing and refinishing existing cabinets
- Soft-close hardware and premium finishes
- Maximized storage solutions

### Countertops & Surfaces
- Quartz, granite, and marble countertops
- Custom tile backsplashes
- Waterfall edges and decorative details
- Professional templating and installation

### Complete Renovations
- Space planning and design consultation
- Structural modifications and layout changes
- Electrical and plumbing updates
- Flooring installation and finishing

### Appliance Integration
- Built-in appliance installation
- Kitchen island design and construction
- Range hood and ventilation systems
- Under-cabinet lighting solutions

## Why Choose Our Kitchen Remodeling?

- **Expert Design**: Our team helps you maximize space and functionality
- **Quality Materials**: We use only premium materials and finishes
- **Professional Installation**: Licensed craftsmen ensure perfect results
- **Project Management**: Single point of contact throughout your project
- **Warranty**: All work backed by our comprehensive warranty

## The Remodeling Process

1. **Consultation**: Free in-home consultation and design discussion
2. **Design**: 3D renderings and detailed project planning
3. **Permits**: We handle all necessary permits and approvals
4. **Construction**: Professional installation with minimal disruption
5. **Completion**: Final walkthrough and warranty documentation

## Popular Kitchen Features

- Large center islands with seating
- Open concept layouts
- Smart storage solutions
- Energy-efficient appliances
- Luxury finishes and fixtures
    `,
    features: [
      'Custom Cabinetry',
      'Countertop Installation',
      'Appliance Integration',
      'Space Planning',
      'Electrical & Plumbing',
      'Flooring Installation',
    ],
    seo: {
      title: 'Kitchen Remodeling Services - Premier Construction',
      description:
        'Professional kitchen remodeling services including custom cabinets, countertops, and complete renovations.',
      keywords: [
        'kitchen remodeling',
        'kitchen renovation',
        'custom cabinets',
        'countertops',
        'kitchen design',
      ],
    },
  },
  'bathroom-renovation': {
    title: 'Bathroom Renovation',
    description:
      'Create your perfect bathroom oasis with our comprehensive renovation solutions.',
    icon: 'bathroom',
    featuredImage: '/images/services/bathroom-renovation-hero.jpg',
    content: `
# Bathroom Renovation Services

Transform your bathroom into a personal oasis with our comprehensive renovation services. Whether you're updating a powder room or creating a luxury master suite, we deliver exceptional results.

## Our Bathroom Services

### Complete Renovations
- Full bathroom remodels from floor to ceiling
- Layout modifications and space optimization
- Accessibility improvements and aging-in-place features
- Luxury spa-like transformations

### Tile & Stonework
- Custom tile installations for floors and walls
- Natural stone surfaces and accents
- Mosaic and decorative tile work
- Waterproofing and proper substrate preparation

### Fixtures & Plumbing
- High-end fixture installation
- Custom vanities and storage solutions
- Walk-in showers and soaking tubs
- Modern plumbing and water efficiency upgrades

### Lighting & Ventilation
- Recessed and vanity lighting design
- Proper ventilation system installation
- Heated floors and towel warmers
- Smart home integration options

## Popular Bathroom Features

- Walk-in showers with multiple shower heads
- Freestanding soaking tubs
- Double vanities with ample storage
- Heated tile floors
- Smart mirrors and lighting
- Steam showers and spa features
    `,
    features: [
      'Tile Work',
      'Fixture Installation',
      'Vanity & Storage',
      'Accessibility Features',
      'Lighting Design',
      'Ventilation Systems',
    ],
    seo: {
      title: 'Bathroom Renovation Services - Premier Construction',
      description:
        'Professional bathroom renovation services including tile work, fixtures, and complete bathroom remodels.',
      keywords: [
        'bathroom renovation',
        'bathroom remodel',
        'tile installation',
        'bathroom fixtures',
        'vanity installation',
      ],
    },
  },
  // Add more services here...
};

type Props = {
  params: { slug: string };
};

// Enable ISR with 30 minute revalidation
export const revalidate = 1800;

// Generate static params for all services
export async function generateStaticParams() {
  try {
    const contentFetcher = new ContentFetcher();
    const { servicePaths } = await contentFetcher.getContentPaths();

    return servicePaths.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for services:', error);
    // Fallback to hardcoded service slugs for build-time generation
    return [
      { slug: 'kitchen-remodeling' },
      { slug: 'bathroom-renovation' },
      // Add more fallback slugs as needed
    ];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const contentFetcher = new ContentFetcher();
    const service = await contentFetcher.getService(params.slug);

    if (!service) {
      return {
        title: 'Service Not Found',
      };
    }

    return generateSEOMetadata({
      title: service.seo.title,
      description: service.seo.description,
      keywords: service.seo.keywords,
      ogImage: service.featuredImage || '/images/og-services.jpg',
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${params.slug}`,
    });
  } catch (error) {
    return {
      title: 'Service Not Found',
    };
  }
}

export default async function ServicePage({ params }: Props) {
  const contentFetcher = new ContentFetcher();
  const service = await contentFetcher.getService(params.slug);

  if (!service) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: service.title, href: `/services/${params.slug}` },
  ];

  // Generate structured data for the service
  const serviceStructuredData = generateServiceStructuredData({
    name: service.title,
    description: service.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${params.slug}`,
    image: service.featuredImage,
  });

  return (
    <div className="bg-white">
      <StructuredData data={serviceStructuredData} />
      {/* Breadcrumb */}
      <section className="border-b bg-gray-50 py-4">
        <div className="container-custom">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">
                {service.title}
              </h1>
              <p className="mb-8 text-xl text-primary-100">
                {service.description}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="rounded-lg bg-white px-8 py-3 font-medium text-primary-600 transition-colors duration-200 hover:bg-gray-100"
                >
                  Get Free Estimate
                </Link>
                <a
                  href="tel:555-123-4567"
                  className="rounded-lg border-2 border-white px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-white hover:text-primary-600"
                >
                  Call (555) 123-4567
                </a>
              </div>
            </div>

            <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20">
                <span className="text-lg text-white">Service Hero Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              What's Included
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Our comprehensive {service.title.toLowerCase()} services include
              everything you need for a successful project.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(service.features || []).map((feature, index) => (
              <div
                key={index}
                className="flex items-center rounded-lg bg-gray-50 p-4"
              >
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <svg
                    className="h-4 w-4 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: (service.content || '')
                    .replace(/\n/g, '<br>')
                    .replace(
                      /#{1}\s+(.+)/g,
                      '<h2 class="text-3xl font-bold text-gray-900 mb-6 mt-8">$1</h2>'
                    )
                    .replace(
                      /#{2}\s+(.+)/g,
                      '<h3 class="text-2xl font-semibold text-gray-900 mb-4 mt-6">$1</h3>'
                    )
                    .replace(
                      /#{3}\s+(.+)/g,
                      '<h4 class="text-xl font-semibold text-gray-900 mb-3 mt-4">$1</h4>'
                    )
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/- (.+)/g, '<li class="mb-2">$1</li>')
                    .replace(
                      /(\d+\.\s+\*\*(.+?)\*\*:.+)/g,
                      '<div class="mb-4"><strong>$2</strong>: $1</div>'
                    ),
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Our Process
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We follow a proven process to ensure your{' '}
              {service.title.toLowerCase()} project is completed on time, on
              budget, and to your complete satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Consultation
              </h3>
              <p className="text-sm text-gray-600">
                Free consultation to discuss your vision and requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Design & Planning
              </h3>
              <p className="text-sm text-gray-600">
                Detailed planning, 3D renderings, and material selection.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
                3
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
                4
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Completion
              </h3>
              <p className="text-sm text-gray-600">
                Final walkthrough, cleanup, and warranty documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Related Services
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(services)
              .filter(([slug]) => slug !== params.slug)
              .slice(0, 3)
              .map(([slug, relatedService]) => (
                <div
                  key={slug}
                  className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    {relatedService.title}
                  </h3>

                  <p className="mb-4 text-gray-600">
                    {relatedService.description}
                  </p>

                  <Link
                    href={`/services/${slug}`}
                    className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700"
                  >
                    Learn More
                    <svg
                      className="ml-1 h-4 w-4"
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
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 text-white">
        <div className="container-custom text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-100">
            Contact us today for a free consultation and estimate for your{' '}
            {service.title.toLowerCase()} project. Let's bring your vision to
            life!
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-lg bg-white px-8 py-3 font-medium text-primary-600 transition-colors duration-200 hover:bg-gray-100"
            >
              Get Free Estimate
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
