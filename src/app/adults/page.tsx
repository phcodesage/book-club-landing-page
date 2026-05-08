import { AdultsBookClubPage } from '@/components/adults-book-club-page';
import { getSiteContent } from '@/lib/site-storage';

export const dynamic = 'force-dynamic';

export default async function AdultsPage() {
  const content = await getSiteContent();

  return <AdultsBookClubPage content={content} />;
}
