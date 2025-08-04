'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Category {
  id: string;
  name: string;
  count?: number;
  color?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  showCounts?: boolean;
  layout?: 'horizontal' | 'vertical' | 'dropdown';
  className?: string;
  isLoading?: boolean;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  showCounts = false,
  layout = 'horizontal',
  className = '',
  isLoading = false,
}: CategoryFilterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);
    if (layout === 'dropdown') {
      setIsDropdownOpen(false);
    }
  };

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  if (layout === 'horizontal') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 ${
              category.id === selectedCategory
                ? 'bg-primary-600 text-white shadow-md'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            {category.color && (
              <div
                className={`h-3 w-3 rounded-full ${
                  category.id === selectedCategory
                    ? 'bg-white bg-opacity-30'
                    : ''
                }`}
                style={{
                  backgroundColor:
                    category.id === selectedCategory
                      ? undefined
                      : category.color,
                }}
              />
            )}
            <span>{category.name}</span>
            {showCounts && category.count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  category.id === selectedCategory
                    ? 'bg-white bg-opacity-20 text-primary-100'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    );
  }

  return null;
}

// Utility function to generate category data from projects
export function generateCategoriesFromProjects(
  projects: Array<{ category: string }>,
  includeAll: boolean = true
): Category[] {
  const categoryMap = new Map<string, number>();

  // Count projects per category
  projects.forEach((project) => {
    const category = project.category.toLowerCase();
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  // Convert to category objects
  const categories: Category[] = Array.from(categoryMap.entries()).map(
    ([name, count]) => ({
      id: name,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
    })
  );

  // Sort categories by count (descending) then by name
  categories.sort((a, b) => {
    if (b.count !== a.count) {
      return (b.count || 0) - (a.count || 0);
    }
    return a.name.localeCompare(b.name);
  });

  // Add "All" category at the beginning if requested
  if (includeAll) {
    categories.unshift({
      id: 'all',
      name: 'All',
      count: projects.length,
    });
  }

  return categories;
}
