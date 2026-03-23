import { NextResponse } from 'next/server';

import { getSiteContent, saveSiteContent } from '@/lib/site-storage';

export const runtime = 'nodejs';

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const content = await saveSiteContent(payload);
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: 'Unable to save content.' }, { status: 400 });
  }
}
