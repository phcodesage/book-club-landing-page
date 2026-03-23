import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

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

type AnalyticsStore = {
  events: AnalyticsEvent[];
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
  topReferrers: Array<{
    source: string;
    visits: number;
  }>;
  lastRecordedAt: string | null;
};

const siteContentPath = path.join(process.cwd(), 'data', 'site-content.json');
const analyticsPath = path.join(process.cwd(), 'runtime-data', 'analytics.json');

async function ensureParentDirectory(filePath: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function writeJsonFile<T>(filePath: string, value: T) {
  await ensureParentDirectory(filePath);
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const file = await readFile(filePath, 'utf8');
    return JSON.parse(file) as T;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      await writeJsonFile(filePath, fallback);
      return fallback;
    }

    return fallback;
  }
}

function toDateKey(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

function buildDailySeries(events: AnalyticsEvent[], numberOfDays: number): AnalyticsDay[] {
  const days: AnalyticsDay[] = [];
  const now = new Date();

  for (let index = numberOfDays - 1; index >= 0; index -= 1) {
    const day = new Date(now);
    day.setUTCDate(now.getUTCDate() - index);

    days.push({
      date: day.toISOString().slice(0, 10),
      visits: 0,
      uniqueVisitors: 0,
      ctaClicks: 0,
    });
  }

  const lookup = new Map(
    days.map((day) => [
      day.date,
      {
        visits: 0,
        uniqueVisitors: new Set<string>(),
        ctaClicks: 0,
      },
    ])
  );

  for (const event of events) {
    const key = toDateKey(event.timestamp);
    const bucket = lookup.get(key);

    if (!bucket) {
      continue;
    }

    if (event.type === 'page_view') {
      bucket.visits += 1;
      bucket.uniqueVisitors.add(event.visitorId);
    }

    if (event.type === 'cta_click') {
      bucket.ctaClicks += 1;
    }
  }

  return days.map((day) => {
    const bucket = lookup.get(day.date);

    return {
      date: day.date,
      visits: bucket?.visits ?? 0,
      uniqueVisitors: bucket?.uniqueVisitors.size ?? 0,
      ctaClicks: bucket?.ctaClicks ?? 0,
    };
  });
}

function normalizeReferrer(referrer: string): string {
  const trimmed = referrer.trim();

  if (!trimmed) {
    return 'direct';
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.hostname.replace(/^www\./, '') || 'direct';
  } catch {
    return trimmed;
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await readJsonFile(siteContentPath, defaultSiteContent);
  return normalizeSiteContent(raw);
}

export async function saveSiteContent(content: unknown): Promise<SiteContent> {
  const normalized = normalizeSiteContent(content);
  await writeJsonFile(siteContentPath, normalized);
  return normalized;
}

async function getAnalyticsStore(): Promise<AnalyticsStore> {
  return readJsonFile<AnalyticsStore>(analyticsPath, { events: [] });
}

async function saveAnalyticsStore(store: AnalyticsStore) {
  await writeJsonFile(analyticsPath, store);
}

export async function recordAnalyticsEvent(input: {
  type: AnalyticsEventType;
  route: string;
  visitorId: string;
  referrer: string;
}) {
  const store = await getAnalyticsStore();

  const event: AnalyticsEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type: input.type,
    route: input.route,
    visitorId: input.visitorId,
    referrer: normalizeReferrer(input.referrer),
  };

  store.events = [...store.events, event].slice(-5000);
  await saveAnalyticsStore(store);

  return event;
}

export async function getAnalyticsDashboardData(days = 14): Promise<AnalyticsDashboardData> {
  const store = await getAnalyticsStore();
  const pageViews = store.events.filter((event) => event.type === 'page_view');
  const ctaClicks = store.events.filter((event) => event.type === 'cta_click');
  const totalVisits = pageViews.length;
  const uniqueVisitors = new Set(pageViews.map((event) => event.visitorId)).size;
  const daily = buildDailySeries(store.events, days);
  const todayKey = new Date().toISOString().slice(0, 10);
  const topReferrers = Array.from(
    pageViews.reduce((accumulator, event) => {
      const source = normalizeReferrer(event.referrer);
      accumulator.set(source, (accumulator.get(source) ?? 0) + 1);
      return accumulator;
    }, new Map<string, number>())
  )
    .map(([source, visits]) => ({ source, visits }))
    .sort((left, right) => right.visits - left.visits)
    .slice(0, 5);

  return {
    summary: {
      totalVisits,
      uniqueVisitors,
      visitsToday: daily.find((day) => day.date === todayKey)?.visits ?? 0,
      ctaClicks: ctaClicks.length,
      conversionRate: totalVisits > 0 ? Number(((ctaClicks.length / totalVisits) * 100).toFixed(1)) : 0,
    },
    daily,
    recentEvents: [...store.events]
      .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
      .slice(0, 8),
    topReferrers,
    lastRecordedAt: store.events.at(-1)?.timestamp ?? null,
  };
}
