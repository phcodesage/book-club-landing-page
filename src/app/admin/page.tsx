import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { getAnalyticsDashboardData, getSiteContent } from '@/lib/site-storage';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [content, analytics] = await Promise.all([getSiteContent(), getAnalyticsDashboardData()]);

  return <AdminDashboard initialContent={content} initialAnalytics={analytics} />;
}
