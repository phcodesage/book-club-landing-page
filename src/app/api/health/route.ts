import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'teen-book-club-landing-page',
    timestamp: new Date().toISOString(),
  });
}
