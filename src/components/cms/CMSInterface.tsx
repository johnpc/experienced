'use client';

import { useEffect, useRef, useState } from 'react';

export default function CMSInterface() {
  const cmsRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initCMS = async () => {
      try {
        setLoading(true);

        // Dynamically import Decap CMS to avoid SSR issues
        const CMS = await import('decap-cms-app');

        // Get the dynamic configuration
        const configResponse = await fetch('/api/cms/config');
        if (!configResponse.ok) {
          throw new Error('Failed to load CMS configuration');
        }

        const config = await configResponse.json();

        // Initialize CMS with the configuration
        CMS.default.init({ config });

        // Custom preview templates can be registered here
        // CMS.default.registerPreviewTemplate('pages', PagePreview);
        // CMS.default.registerPreviewTemplate('projects', ProjectPreview);

        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize CMS:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to initialize CMS'
        );
        setLoading(false);
      }
    };

    initCMS();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">
            Loading Content Management System...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="mb-2 text-lg font-semibold text-red-900">
              CMS Initialization Error
            </h2>
            <p className="mb-4 text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div ref={cmsRef} id="nc-root" />
      <noscript>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              JavaScript Required
            </h1>
            <p className="text-gray-600">
              The content management system requires JavaScript to function
              properly. Please enable JavaScript in your browser and refresh the
              page.
            </p>
          </div>
        </div>
      </noscript>
    </div>
  );
}
