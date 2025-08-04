'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  }>;
  completedAt: string | Date;
  featured: boolean;
  slug?: string;
}

interface ProjectGalleryProps {
  projects: Project[];
  categories?: string[];
  showFilters?: boolean;
  showFeaturedFirst?: boolean;
  gridCols?: 1 | 2 | 3 | 4;
  className?: string;
}

const defaultCategories = [
  'All',
  'Kitchen',
  'Bathroom',
  'Addition',
  'Renovation',
  'Exterior',
  'Commercial',
];

export default function ProjectGallery({
  projects,
  categories = defaultCategories,
  showFilters = true,
  showFeaturedFirst = true,
  gridCols = 3,
  className = '',
}: ProjectGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (project) =>
          project.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort by featured status if enabled
    if (showFeaturedFirst) {
      filtered = filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    }

    return filtered;
  }, [projects, selectedCategory, showFeaturedFirst]);

  const handleCategoryChange = async (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);

    // Simulate loading delay for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsLoading(false);
  };

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
      {/* Category Filters */}
      {showFilters && categories.length > 1 && (
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                disabled={isLoading}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 ${
                  category === selectedCategory
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={getGridClasses()}
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isLoading={isLoading}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* No Results */}
      {filteredProjects.length === 0 && !isLoading && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No projects found
          </h3>
          <p className="text-gray-600">
            No projects match the selected category. Try selecting a different
            category.
          </p>
        </div>
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isLoading: boolean;
}

function ProjectCard({ project, index, isLoading }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const projectUrl = `/projects/${project.slug || project.id}`;
  const mainImage = project.images[0];
  const completedDate =
    typeof project.completedAt === 'string'
      ? new Date(project.completedAt)
      : project.completedAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200 md:h-56">
        {mainImage && !imageError ? (
          <>
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200">
                <svg
                  className="h-8 w-8 text-gray-400"
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
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <svg
              className="h-8 w-8 text-gray-400"
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
        )}

        {/* Category Badge */}
        <div className="absolute left-3 top-3">
          <span className="rounded bg-primary-600 px-2 py-1 text-xs font-medium text-white shadow-sm">
            {project.category}
          </span>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute right-3 top-3">
            <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-medium text-white shadow-sm">
              Featured
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20" />

        {/* View Project Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Link
            href={projectUrl}
            className="translate-y-2 transform rounded-lg bg-white px-4 py-2 font-medium text-primary-600 shadow-lg transition-all duration-300 group-hover:translate-y-0"
          >
            View Project
          </Link>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-primary-600">
            <Link href={projectUrl} className="hover:underline">
              {project.title}
            </Link>
          </h3>
          <time className="text-xs text-gray-500">
            {completedDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
            })}
          </time>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {project.description}
        </p>

        <div className="flex items-center justify-between">
          <Link
            href={projectUrl}
            className="inline-flex items-center text-sm font-medium text-primary-600 transition-colors duration-200 hover:text-primary-700"
          >
            View Details
            <svg
              className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
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

          {/* Image Count */}
          {project.images.length > 1 && (
            <div className="flex items-center text-xs text-gray-500">
              <svg
                className="mr-1 h-3 w-3"
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
              {project.images.length} photos
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
