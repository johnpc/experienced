import type { Metadata, Viewport } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import StructuredData from '@/components/seo/StructuredData';
import { generateMetadata, generateBusinessStructuredData } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = generateMetadata({
  title: 'Premier Construction & Remodeling - Quality Construction Services',
  description:
    'Professional construction and remodeling services for your home and business. Quality craftsmanship, reliable service, and exceptional results for over 20 years.',
  keywords: [
    'construction',
    'remodeling',
    'renovation',
    'contractor',
    'home improvement',
  ],
  ogImage: '/images/og-default.jpg',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const businessStructuredData = generateBusinessStructuredData();

  return (
    <html lang="en">
      <head>
        <StructuredData data={businessStructuredData} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
