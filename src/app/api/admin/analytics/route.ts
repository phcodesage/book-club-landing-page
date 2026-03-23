import { NextResponse } from 'next/server';

import { getAnalyticsDashboardData } from '@/lib/site-storage';

export const runtime = 'nodejs';

export async function GET() {
  const analytics = await getAnalyticsDashboardData();
  return NextResponse.json(analytics);
}
