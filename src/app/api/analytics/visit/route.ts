import { NextResponse } from 'next/server';

import { recordAnalyticsEvent, type AnalyticsEventType } from '@/lib/site-storage';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      type: AnalyticsEventType;
      route: string;
      visitorId: string;
      referrer: string;
    }>;

    const event = await recordAnalyticsEvent({
      type: body.type === 'cta_click' ? 'cta_click' : 'page_view',
      route: typeof body.route === 'string' && body.route.length > 0 ? body.route : '/',
      visitorId:
        typeof body.visitorId === 'string' && body.visitorId.length > 0 ? body.visitorId : 'anonymous',
      referrer:
        typeof body.referrer === 'string' && body.referrer.length > 0
          ? body.referrer
          : request.headers.get('referer') ?? 'direct',
    });

    return NextResponse.json({ ok: true, eventId: event.id });
  } catch {
    return NextResponse.json({ error: 'Unable to record analytics event.' }, { status: 400 });
  }
}
