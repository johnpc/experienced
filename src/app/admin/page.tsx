import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();

  if (!session?.isValid) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="rounded-lg bg-white p-6 shadow">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mb-6 text-gray-600">
              Welcome back, {session.username}! You are successfully
              authenticated.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="border-primary-200 rounded-lg border bg-primary-50 p-4">
                <h3 className="mb-2 text-lg font-medium text-primary-900">
                  Content Management
                </h3>
                <p className="mb-4 text-primary-700">
                  Access the Decap CMS to manage your website content.
                </p>
                <a
                  href="/admin/cms"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Open CMS
                </a>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-2 text-lg font-medium text-green-900">
                  Website Preview
                </h3>
                <p className="mb-4 text-green-700">
                  View your live website to see published changes.
                </p>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  View Site
                </a>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Session expires:{' '}
                  {new Date(
                    session.timestamp + 24 * 60 * 60 * 1000
                  ).toLocaleString()}
                </div>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
