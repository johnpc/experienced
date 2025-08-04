'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className={`error-boundary ${this.props.className || ''}`}>
          <DefaultErrorFallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            showDetails={this.props.showDetails}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
  showDetails?: boolean;
}

function DefaultErrorFallback({
  error,
  errorInfo,
  onRetry,
  showDetails = false,
}: DefaultErrorFallbackProps) {
  const [showFullError, setShowFullError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[400px] items-center justify-center p-6"
    >
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Something went wrong
        </h2>
        <p className="mb-6 text-gray-600">
          We're sorry, but something unexpected happened. Please try again or
          contact support if the problem persists.
        </p>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={onRetry}
            className="rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-primary-700"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
          >
            Reload Page
          </button>
        </div>

        {/* Contact Support */}
        <div className="mt-6 text-sm text-gray-500">
          Need help?{' '}
          <a
            href="/contact"
            className="text-primary-600 underline hover:text-primary-700"
          >
            Contact Support
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// Specific error boundary for project components
export function ProjectErrorBoundary({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ErrorBoundary
      className={className}
      fallback={
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Unable to load project
            </h3>
            <p className="mb-4 text-gray-600">
              There was an error loading this project. Please try refreshing the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-primary-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Image error boundary
export function ImageErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-200">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto mb-2 h-8 w-8"
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
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Content error boundary
export function ContentErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start">
            <svg
              className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <h3 className="mb-1 text-sm font-medium text-yellow-800">
                Content Error
              </h3>
              <p className="text-sm text-yellow-700">
                There was an error rendering this content. The content may be
                malformed or contain unsupported elements.
              </p>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
