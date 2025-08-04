import type { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata, generateFAQStructuredData } from '@/lib/seo';
import { ContentFetcher } from '@/lib/content-fetcher';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = generateMetadata({
  title: 'Our Services - Premier Construction & Remodeling',
  description:
    'Professional construction and remodeling services including kitchen remodeling, bathroom renovation, home additions, and complete renovations. Licensed, insured, and experienced.',
  keywords: [
    'construction services',
    'remodeling services',
    'kitchen remodel',
    'bathroom renovation',
    'home additions',
    'licensed contractor',
  ],
  ogImage: '/images/og-services.jpg',
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
});

// Enable ISR with 30 minute revalidation
export const revalidate = 1800;

const services = [
  {
    title: 'Kitchen Remodeling',
    slug: 'kitchen-remodeling',
    description:
      'Transform your kitchen with custom cabinets, countertops, and modern appliances.',
    features: [
      'Custom Cabinetry',
      'Countertop Installation',
      'Appliance Integration',
      'Space Planning',
    ],
    icon: (
      <svg
        className="h-8 w-8"
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
    ),
  },
  {
    title: 'Bathroom Renovation',
    slug: 'bathroom-renovation',
    description:
      'Create your perfect bathroom oasis with our comprehensive renovation solutions.',
    features: [
      'Tile Work',
      'Fixture Installation',
      'Vanity & Storage',
      'Accessibility Features',
    ],
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
        />
      </svg>
    ),
  },
  {
    title: 'Home Additions',
    slug: 'home-additions',
    description:
      'Expand your living space with custom home additions designed to fit your lifestyle.',
    features: [
      'Room Additions',
      'Second Stories',
      'Sunrooms',
      'Garage Conversions',
    ],
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
        />
      </svg>
    ),
  },
  {
    title: 'Complete Renovations',
    slug: 'complete-renovations',
    description:
      'Full home renovations that transform your entire living space.',
    features: [
      'Whole House Remodels',
      'Open Floor Plans',
      'Structural Changes',
      'Design Consultation',
    ],
    icon: (
      <svg
        className="h-8 w-8"
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
    ),
  },
  {
    title: 'Exterior Work',
    slug: 'exterior-work',
    description:
      "Enhance your home's curb appeal with professional exterior improvements.",
    features: [
      'Siding Installation',
      'Roofing',
      'Windows & Doors',
      'Deck & Patio',
    ],
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    ),
  },
  {
    title: 'Commercial Projects',
    slug: 'commercial-projects',
    description:
      'Professional commercial construction and renovation services.',
    features: [
      'Office Buildouts',
      'Retail Spaces',
      'Restaurant Renovations',
      'ADA Compliance',
    ],
    icon: (
      <svg
        className="h-8 w-8"
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
    ),
  },
];

export default async function ServicesPage() {
  const contentFetcher = new ContentFetcher();
  const services = await contentFetcher.getServices();
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
  ];

  // FAQ structured data
  const faqs = [
    {
      question: 'What construction services do you offer?',
      answer:
        'We offer comprehensive construction and remodeling services including kitchen remodeling, bathroom renovation, home additions, complete home renovations, exterior work, and commercial projects.',
    },
    {
      question: 'Are you licensed and insured?',
      answer:
        'Yes, we are fully licensed, bonded, and insured. We provide proof of insurance before starting any work and maintain all required licenses for construction work.',
    },
    {
      question: 'Do you provide free estimates?',
      answer:
        'Yes, we provide free, no-obligation estimates for all projects. Contact us to schedule your consultation and receive a detailed estimate.',
    },
    {
      question: 'How long do construction projects typically take?',
      answer:
        'Project timelines vary depending on scope and complexity. Kitchen remodels typically take 4-8 weeks, bathroom renovations 2-4 weeks, and home additions 8-16 weeks. We provide detailed timelines during consultation.',
    },
  ];

  const faqStructuredData = generateFAQStructuredData(faqs);

  return (
    <div className="bg-white">
      <StructuredData data={faqStructuredData} />

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
              Our Services
            </h1>
            <p className="text-xl text-primary-100">
              From kitchen remodels to complete home renovations, we provide
              comprehensive construction and remodeling services to transform
              your space.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              What We Do
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We specialize in residential and commercial construction projects,
              delivering quality craftsmanship and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  {service.icon}
                </div>

                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {service.title}
                </h3>

                <p className="mb-4 text-gray-600">{service.description}</p>

                <ul className="mb-6 space-y-2">
                  {(service.features || []).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <svg
                        className="mr-2 h-4 w-4 text-primary-500"
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
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services/${service.slug}`}
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

      {/* Process Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Our Process
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We follow a proven process to ensure your project is completed on
              time, on budget, and to your complete satisfaction.
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
                Free in-home consultation to discuss your vision and
                requirements.
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

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Why Choose Our Services?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                    <svg
                      className="h-3 w-3 text-primary-600"
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
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">
                      Licensed & Insured
                    </h3>
                    <p className="text-sm text-gray-600">
                      Fully licensed contractors with comprehensive insurance
                      coverage.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                    <svg
                      className="h-3 w-3 text-primary-600"
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
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">
                      Quality Materials
                    </h3>
                    <p className="text-sm text-gray-600">
                      We use only premium materials from trusted suppliers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                    <svg
                      className="h-3 w-3 text-primary-600"
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
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">
                      Warranty Protection
                    </h3>
                    <p className="text-sm text-gray-600">
                      All work is backed by our comprehensive warranty.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                    <svg
                      className="h-3 w-3 text-primary-600"
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
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">
                      Transparent Pricing
                    </h3>
                    <p className="text-sm text-gray-600">
                      No hidden fees or surprise costs - you know exactly what
                      you're paying.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">
                  Services Image Placeholder
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 text-white">
        <div className="container-custom text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-100">
            Contact us today for a free consultation and estimate. Let's discuss
            how we can transform your space with our professional construction
            and remodeling services.
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
