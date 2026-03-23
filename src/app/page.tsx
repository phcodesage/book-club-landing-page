import { BookClubPage } from '@/components/book-club-page';
import { getSiteContent } from '@/lib/site-storage';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const content = await getSiteContent();

  return <BookClubPage content={content} />;
}
