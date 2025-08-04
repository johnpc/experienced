'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  className?: string;
  showThumbnails?: boolean;
  showCaptions?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  aspectRatio?: 'square' | 'video' | 'wide' | 'tall';
}

export default function ImageCarousel({
  images,
  className = '',
  showThumbnails = true,
  showCaptions = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  aspectRatio = 'video',
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(
    new Array(images.length).fill(false)
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, images.length, autoPlayInterval]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

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

  if (images.length === 0) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-gray-200 ${getAspectRatioClasses()} ${className}`}
      >
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto mb-2 h-12 w-12"
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
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className={className}>
      {/* Main Image Container */}
      <div
        className={`relative ${getAspectRatioClasses()} group overflow-hidden rounded-lg bg-gray-200`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded[currentIndex] ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(currentIndex)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority={currentIndex === 0}
            />

            {!imageLoaded[currentIndex] && (
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
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white opacity-0 transition-all duration-200 hover:bg-opacity-75 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white opacity-0 transition-all duration-200 hover:bg-opacity-75 group-hover:opacity-100"
              aria-label="Next image"
            >
              <svg
                className="h-5 w-5"
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
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Caption */}
      {showCaptions && currentImage.caption && (
        <div className="mt-2 text-center text-sm text-gray-600">
          {currentImage.caption}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'ring-primary-200 border-primary-600 ring-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="64px"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-primary-600 bg-opacity-20" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicator (alternative to thumbnails) */}
      {!showThumbnails && images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'w-6 bg-primary-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
