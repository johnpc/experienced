import Link from 'next/link';
import { generateBreadcrumbStructuredData } from '@/lib/seo';
import StructuredData from './StructuredData';

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({
  items,
  className = '',
}: BreadcrumbsProps) {
  // Generate structured data for breadcrumbs
  const structuredData = generateBreadcrumbStructuredData(
    items.map((item) => ({
      name: item.name,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://premierconstructionco.com'}${item.href}`,
    }))
  );

  return (
    <>
      <StructuredData data={structuredData} />
      <nav
        className={`flex items-center space-x-2 text-sm ${className}`}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <svg
                  className="mx-2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {index === items.length - 1 ? (
                <span className="font-medium text-gray-900" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 transition-colors duration-200 hover:text-primary-600"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
