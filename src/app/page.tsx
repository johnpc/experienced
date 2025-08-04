import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Premier Construction & Remodeling - Quality Construction Services',
  description:
    'Transform your space with our professional construction and remodeling services. Quality craftsmanship, reliable service, and exceptional results for over 20 years.',
  keywords: [
    'construction services',
    'home remodeling',
    'kitchen renovation',
    'bathroom remodel',
    'home additions',
    'contractor',
  ],
  ogImage: '/images/og-home.jpg',
  canonical: process.env.NEXT_PUBLIC_SITE_URL,
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
            Premier Construction & Remodeling
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Transform your space with our professional construction and
            remodeling services. Quality craftsmanship, reliable service, and
            exceptional results.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="btn-primary">Get Free Quote</button>
            <button className="btn-secondary">View Our Work</button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <h3 className="mb-3 text-xl font-semibold">Kitchen Remodeling</h3>
            <p className="text-gray-600">
              Transform your kitchen into the heart of your home with our expert
              remodeling services.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <h3 className="mb-3 text-xl font-semibold">Bathroom Renovation</h3>
            <p className="text-gray-600">
              Create your perfect bathroom oasis with our comprehensive
              renovation solutions.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <h3 className="mb-3 text-xl font-semibold">Home Additions</h3>
            <p className="text-gray-600">
              Expand your living space with custom home additions designed to
              fit your lifestyle.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
