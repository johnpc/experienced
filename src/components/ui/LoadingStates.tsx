'use client';

import { motion } from 'framer-motion';

// Project Card Skeleton
export function ProjectCardSkeleton({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg bg-white shadow-sm ${className}`}
    >
      {/* Image Skeleton */}
      <div className="relative h-48 animate-pulse bg-gray-200 md:h-56">
        <div className="absolute left-3 top-3 h-5 w-16 animate-pulse rounded bg-gray-300 px-2 py-1" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-300" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-300" />
        </div>

        <div className="mb-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-300" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-300" />
        </div>

        <div className="flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
}

// Project Gallery Skeleton
export function ProjectGallerySkeleton({
  count = 6,
  gridCols = 3,
  className = '',
}: {
  count?: number;
  gridCols?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const getGridClasses = () => {
    const baseClasses = 'grid gap-6 md:gap-8';
    switch (gridCols) {
      case 1:
        return `${baseClasses} grid-cols-1`;
      case 2:
        return `${baseClasses} grid-cols-1 md:grid-cols-2`;
      case 3:
        return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
      case 4:
        return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      default:
        return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
    }
  };

  return (
    <div className={className}>
      {/* Filter Skeleton */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-20 animate-pulse rounded-full bg-gray-300"
            />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className={getGridClasses()}>
        {Array.from({ length: count }).map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

// Image Carousel Skeleton
export function ImageCarouselSkeleton({
  aspectRatio = 'video',
  showThumbnails = true,
  className = '',
}: {
  aspectRatio?: 'square' | 'video' | 'wide' | 'tall';
  showThumbnails?: boolean;
  className?: string;
}) {
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-video';
      case 'wide':
        return 'aspect-[21/9]';
      case 'tall':
        return 'aspect-[3/4]';
      default:
        return 'aspect-video';
    }
  };

  return (
    <div className={className}>
      {/* Main Image Skeleton */}
      <div
        className={`relative ${getAspectRatioClasses()} animate-pulse rounded-lg bg-gray-200`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Caption Skeleton */}
      <div className="mx-auto mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-300" />

      {/* Thumbnails Skeleton */}
      {showThumbnails && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 w-16 flex-shrink-0 animate-pulse rounded bg-gray-300"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Content Loading Skeleton
export function ContentSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title */}
      <div className="h-8 w-3/4 animate-pulse rounded bg-gray-300" />

      {/* Paragraphs */}
      <div className="space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-gray-300" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-300" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-300" />
      </div>

      {/* Subheading */}
      <div className="mt-6 h-6 w-1/2 animate-pulse rounded bg-gray-300" />

      {/* More paragraphs */}
      <div className="space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-gray-300" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-300" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300" />
      </div>
    </div>
  );
}

// Spinner Component
export function Spinner({
  size = 'md',
  color = 'primary',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
