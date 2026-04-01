import { readFile } from 'node:fs/promises';
import path from 'node:path';

import connectDB from '@/lib/mongodb';
import SiteContentModel from '@/lib/models/SiteContent';
import AnalyticsEventModel from '@/lib/models/AnalyticsEvent';
import { defaultSiteContent, normalizeSiteContent, type SiteContent } from '@/lib/site-content';

export type AnalyticsEventType = 'page_view' | 'cta_click';

export type AnalyticsEvent = {
  id: string;
  timestamp: string;
  type: AnalyticsEventType;
  route: string;
  visitorId: string;
  referrer: string;
};

export type AnalyticsDay = {
  date: string;
  visits: number;
  uniqueVisitors: number;
  ctaClicks: number;
};

export type AnalyticsDashboardData = {
  summary: {
    totalVisits: number;
    uniqueVisitors: number;
    visitsToday: number;
    ctaClicks: number;
    conversionRate: number;
  };
  daily: AnalyticsDay[];
  recentEvents: AnalyticsEvent[];
  topReferrers: Array<{ source: string; visits: number }>;
  lastRecordedAt: string | null;
};

// ── Site Content ──────────────────────────────────────────────────────────────

async function getContentFromFile(): Promise<SiteContent> {
  try {
    const raw = await readFile(path.join(process.cwd(), 'data', 'site-content.json'), 'utf8');
    return normalizeSiteContent(JSON.parse(raw));
  } catch {
    return defaultSiteContent;
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    await connectDB();
    const doc = await SiteContentModel.findOne().lean();
    if (!doc) {
      const fallback = await getContentFromFile();
      await SiteContentModel.create(fallback);
      return fallback;
    }
    return normalizeSiteContent(doc);
  } catch (err) {
    console.warn('[site-storage] MongoDB unavailable, falling back to JSON file.', err);
    return getContentFromFile();
  }
}

export async function saveSiteContent(content: unknown): Promise<SiteContent> {
  const normalized = normalizeSiteContent(content);
  try {
    await connectDB();
    await SiteContentModel.findOneAndUpdate(
      {},
      { $set: normalized },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.warn('[site-storage] MongoDB unavailable, save skipped.', err);
  }
  return normalized;
}

// ── Analytics ─────────────────────────────────────────────────────────────────

function normalizeReferrer(referrer: string): string {
  const trimmed = referrer.trim();
  if (!trimmed) return 'direct';
  try {
    const parsed = new URL(trimmed);
    return parsed.hostname.replace(/^www\./, '') || 'direct';
  } catch {
    return trimmed;
  }
}

export async function recordAnalyticsEvent(input: {
  type: AnalyticsEventType;
  route: string;
  visitorId: string;
  referrer: string;
}): Promise<AnalyticsEvent> {
  const event = {
    eventId: crypto.randomUUID(),
    timestamp: new Date(),
    type: input.type,
    route: input.route,
    visitorId: input.visitorId,
    referrer: normalizeReferrer(input.referrer),
  };

  try {
    await connectDB();
    await AnalyticsEventModel.create(event);
  } catch (err) {
    console.warn('[site-storage] MongoDB unavailable, analytics event not saved.', err);
  }

  return {
    id: event.eventId,
    timestamp: event.timestamp.toISOString(),
    type: event.type,
    route: event.route,
    visitorId: event.visitorId,
    referrer: event.referrer,
  };
}

function buildDailySeries(events: AnalyticsEvent[], numberOfDays: number): AnalyticsDay[] {
  const days: AnalyticsDay[] = [];
  const now = new Date();

  for (let i = numberOfDays - 1; i >= 0; i--) {
    const day = new Date(now);
    day.setUTCDate(now.getUTCDate() - i);
    days.push({ date: day.toISOString().slice(0, 10), visits: 0, uniqueVisitors: 0, ctaClicks: 0 });
  }

  const lookup = new Map(
    days.map((d) => [d.date, { visits: 0, uniqueVisitors: new Set<string>(), ctaClicks: 0 }])
  );

  for (const event of events) {
    const key = new Date(event.timestamp).toISOString().slice(0, 10);
    const bucket = lookup.get(key);
    if (!bucket) continue;
    if (event.type === 'page_view') { bucket.visits++; bucket.uniqueVisitors.add(event.visitorId); }
    if (event.type === 'cta_click') bucket.ctaClicks++;
  }

  return days.map((d) => {
    const b = lookup.get(d.date);
    return { date: d.date, visits: b?.visits ?? 0, uniqueVisitors: b?.uniqueVisitors.size ?? 0, ctaClicks: b?.ctaClicks ?? 0 };
  });
}

function buildDashboard(events: AnalyticsEvent[], days: number): AnalyticsDashboardData {
  const pageViews = events.filter((e) => e.type === 'page_view');
  const ctaClicks = events.filter((e) => e.type === 'cta_click');
  const totalVisits = pageViews.length;
  const uniqueVisitors = new Set(pageViews.map((e) => e.visitorId)).size;
  const todayKey = new Date().toISOString().slice(0, 10);
  const daily = buildDailySeries(events, days);

  const topReferrers = Array.from(
    pageViews.reduce((acc, e) => {
      const src = normalizeReferrer(e.referrer);
      acc.set(src, (acc.get(src) ?? 0) + 1);
      return acc;
    }, new Map<string, number>())
  )
    .map(([source, visits]) => ({ source, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);

  return {
    summary: {
      totalVisits,
      uniqueVisitors,
      visitsToday: daily.find((d) => d.date === todayKey)?.visits ?? 0,
      ctaClicks: ctaClicks.length,
      conversionRate: totalVisits > 0 ? Number(((ctaClicks.length / totalVisits) * 100).toFixed(1)) : 0,
    },
    daily,
    recentEvents: events.slice(0, 8),
    topReferrers,
    lastRecordedAt: events[0]?.timestamp ?? null,
  };
}

export async function getAnalyticsDashboardData(days = 14): Promise<AnalyticsDashboardData> {
  try {
    await connectDB();

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);

    const rawEvents = await AnalyticsEventModel.find({ timestamp: { $gte: cutoff } })
      .sort({ timestamp: -1 })
      .lean();

    const events: AnalyticsEvent[] = rawEvents.map((e) => ({
      id: e.eventId,
      timestamp: e.timestamp.toISOString(),
      type: e.type,
      route: e.route,
      visitorId: e.visitorId,
      referrer: e.referrer,
    }));

    return buildDashboard(events, days);
  } catch (err) {
    console.warn('[site-storage] MongoDB unavailable, returning empty analytics.', err);
    return buildDashboard([], days);
  }
}
