import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const metadata: Metadata = generateMetadata({
  title: 'About Us - Premier Construction & Remodeling',
  description:
    "Learn about Premier Construction's 20+ years of experience in home remodeling and construction services. Quality craftsmanship, reliable service, and exceptional results.",
  keywords: [
    'about us',
    'construction company',
    'remodeling experience',
    'professional contractors',
    'licensed contractor',
  ],
  ogImage: '/images/og-about.jpg',
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
});

export default function AboutPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <section className="border-b bg-gray-50 py-4">
        <div className="container-custom">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </section>
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 text-white">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              About Premier Construction
            </h1>
            <p className="text-xl text-primary-100">
              With over 20 years of experience in the construction and
              remodeling industry, we have built a reputation for quality
              craftsmanship, reliable service, and exceptional customer
              satisfaction.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Our Story
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  Founded in 2003, our company started as a small family
                  business with a simple mission: to help homeowners transform
                  their spaces with quality construction and remodeling
                  services. Over the years, we have grown into a trusted name in
                  the industry while maintaining our commitment to personalized
                  service and attention to detail.
                </p>
                <p>
                  What began as a two-person operation has evolved into a
                  full-service construction company, but we have never lost
                  sight of our core values: treating every project as if it were
                  our own home, using only the finest materials, and ensuring
                  every customer is completely satisfied with the results.
                </p>
              </div>
            </div>
            <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">Company Photo Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Our Values
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              These core principles guide everything we do and ensure every
              project meets our high standards.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Quality First
              </h3>
              <p className="text-gray-600">
                We never compromise on the quality of materials or workmanship.
                Every project is built to last.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Customer Focused
              </h3>
              <p className="text-gray-600">
                Your satisfaction is our top priority. We listen to your needs
                and exceed your expectations.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Reliable Service
              </h3>
              <p className="text-gray-600">
                We show up on time and complete projects as promised. You can
                count on us.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-600 py-16 text-white">
        <div className="container-custom text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Start Your Project?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-100">
            Contact us today for a free consultation and estimate. We will help
            you bring your vision to life with quality craftsmanship and
            professional service.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="rounded-lg bg-white px-8 py-3 font-medium text-primary-600 transition-colors duration-200 hover:bg-gray-100"
            >
              Get Free Consultation
            </a>
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
