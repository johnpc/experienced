import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

export default async function CMSPage() {
  const session = await getSession();

  if (!session?.isValid) {
    redirect('/admin/login?redirect=/admin/cms');
  }

  // Redirect to the static CMS interface
  redirect('/admin/index.html');
}
