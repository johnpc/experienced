import type { Metadata } from 'next';
import { generateMetadata, generateFAQStructuredData } from '@/lib/seo';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = generateMetadata({
  title: 'Contact Us - Premier Construction & Remodeling',
  description:
    'Get in touch with Premier Construction for a free consultation and estimate. Call (555) 123-4567 or fill out our contact form. Licensed and insured contractor.',
  keywords: [
    'contact construction company',
    'free estimate',
    'construction consultation',
    'remodeling quote',
    'licensed contractor',
  ],
  ogImage: '/images/og-contact.jpg',
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
});

export default function ContactPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Contact', href: '/contact' },
  ];

  // FAQ structured data for contact page
  const faqs = [
    {
      question: 'How long does a typical kitchen remodel take?',
      answer:
        'Most kitchen remodels take 4-8 weeks depending on the scope of work. We provide a detailed timeline during your consultation.',
    },
    {
      question: 'Do you provide free estimates?',
      answer:
        'Yes! We provide free, no-obligation estimates for all projects. Contact us to schedule your consultation.',
    },
    {
      question: 'Are you licensed and insured?',
      answer:
        'Absolutely. We are fully licensed, bonded, and insured. We provide proof of insurance before starting any work.',
    },
    {
      question: 'What warranty do you provide?',
      answer:
        'We provide a comprehensive warranty on all our work. Specific warranty terms vary by project type and will be detailed in your contract.',
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
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Contact Us</h1>
            <p className="text-xl text-primary-100">
              Ready to start your construction or remodeling project? Get in
              touch with us today for a free consultation and estimate.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Get In Touch
              </h2>

              <div className="mb-8 space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                      Phone
                    </h3>
                    <p className="text-gray-600">
                      <a
                        href="tel:555-123-4567"
                        className="transition-colors duration-200 hover:text-primary-600"
                      >
                        (555) 123-4567
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">
                      Monday - Friday: 8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                      Email
                    </h3>
                    <p className="text-gray-600">
                      <a
                        href="mailto:info@premierconstructionco.com"
                        className="transition-colors duration-200 hover:text-primary-600"
                      >
                        info@premierconstructionco.com
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                      Office
                    </h3>
                    <p className="text-gray-600">
                      123 Construction Way
                      <br />
                      Builder City, CA 12345
                    </p>
                    <p className="text-sm text-gray-500">By appointment only</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="text-gray-900">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-900">9:00 AM - 3:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-gray-900">Closed</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <h4 className="mb-1 text-sm font-semibold text-red-900">
                  Emergency Service
                </h4>
                <p className="text-sm text-red-700">
                  For construction emergencies, call{' '}
                  <a
                    href="tel:555-123-4567"
                    className="font-semibold underline"
                  >
                    (555) 123-4567
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Service Areas
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We proudly serve the following areas with our construction and
              remodeling services.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-3 lg:grid-cols-4">
            {[
              'Builder City',
              'Construction Town',
              'Remodel Heights',
              'Renovation Valley',
              'Craftsman Hills',
              'Contractor Creek',
              'Hammer Harbor',
              'Nail Junction',
              'Saw Mill',
              'Tool Town',
              'Blueprint Bay',
              'Foundation Falls',
            ].map((area) => (
              <div key={area} className="rounded-lg bg-white p-4 shadow-sm">
                <span className="font-medium text-gray-700">{area}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't see your area listed?{' '}
              <a
                href="tel:555-123-4567"
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Call us
              </a>{' '}
              to discuss your project - we may still be able to help!
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Get answers to common questions about our construction and
              remodeling services.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                How long does a typical kitchen remodel take?
              </h3>
              <p className="text-gray-600">
                Most kitchen remodels take 4-8 weeks depending on the scope of
                work. We'll provide a detailed timeline during your
                consultation.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Do you provide free estimates?
              </h3>
              <p className="text-gray-600">
                Yes! We provide free, no-obligation estimates for all projects.
                Contact us to schedule your consultation.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Are you licensed and insured?
              </h3>
              <p className="text-gray-600">
                Absolutely. We are fully licensed, bonded, and insured. We'll
                provide proof of insurance before starting any work.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                What warranty do you provide?
              </h3>
              <p className="text-gray-600">
                We provide a comprehensive warranty on all our work. Specific
                warranty terms vary by project type and will be detailed in your
                contract.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
