import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { getAnalyticsDashboardData, getSiteContent } from '@/lib/site-storage';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const [content, analytics] = await Promise.all([getSiteContent(), getAnalyticsDashboardData()]);

  return <AdminDashboard initialContent={content} initialAnalytics={analytics} username={session.username} />;
}
