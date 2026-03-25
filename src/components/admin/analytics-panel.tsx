import {
  Activity,
  ArrowUpRight,
  Globe,
  MousePointerClick,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';

import type { AnalyticsDashboardData } from '@/lib/site-storage';

type AnalyticsPanelProps = {
  analytics: AnalyticsDashboardData;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
};

const numberFormatter = new Intl.NumberFormat('en-US');

function formatDayLabel(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date));
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

function formatEventLabel(type: 'page_view' | 'cta_click') {
  return type === 'cta_click' ? 'CTA click' : 'Page view';
}

export function AnalyticsPanel({ analytics, isRefreshing, onRefresh }: AnalyticsPanelProps) {
  const maxVisits = Math.max(...analytics.daily.map((day) => day.visits), 1);
  const metrics = [
    {
      label: 'Total visits',
      value: numberFormatter.format(analytics.summary.totalVisits),
      helper: 'All landing-page views',
      icon: Activity,
    },
    {
      label: 'Unique readers',
      value: numberFormatter.format(analytics.summary.uniqueVisitors),
      helper: 'By browser visitor id',
      icon: Users,
    },
    {
      label: 'Visits today',
      value: numberFormatter.format(analytics.summary.visitsToday),
      helper: 'Today\'s performance',
      icon: TrendingUp,
    },
    {
      label: 'CTA conversion',
      value: `${analytics.summary.conversionRate}%`,
      helper: `${numberFormatter.format(analytics.summary.ctaClicks)} tracked clicks`,
      icon: MousePointerClick,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="sticky top-0 z-30 -mx-1 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-lg backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--color-accent)]">Analytics</p>
          <h1 className="mt-2 text-3xl font-black text-[var(--color-ink)]">Performance Overview</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
            Track real-time engagement and conversion metrics for the Teen Book Club landing page.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-[var(--color-ink)]/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{metric.label}</p>
                  <p className="mt-3 text-4xl font-black tracking-tight text-[var(--color-ink)]">{metric.value}</p>
                </div>
                <div className="rounded-2xl bg-[var(--color-accent)]/10 p-3 text-[var(--color-accent)]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-[11px] font-bold text-slate-400">{metric.helper}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
        <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-[var(--color-ink)]">Traffic Trends</h2>
              <p className="text-sm font-medium text-slate-500">Daily visits over the last 14 days.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              {analytics.lastRecordedAt ? `Sync: ${formatTimestamp(analytics.lastRecordedAt)}` : 'No sync data'}
            </div>
          </div>

          <div className="mt-12">
            <div className="flex h-64 items-end gap-3 px-2">
              {analytics.daily.map((day) => {
                const height = `${Math.max((day.visits / maxVisits) * 100, day.visits > 0 ? 12 : 4)}%`;

                return (
                  <div key={day.date} className="group flex min-w-0 flex-1 flex-col items-center gap-3">
                    <div className="relative flex h-full w-full items-end justify-center rounded-2xl bg-slate-50/50 p-1.5 transition-colors group-hover:bg-slate-50">
                      <div className="flex w-full flex-col items-center gap-2">
                        <div
                          className="w-full rounded-xl bg-[var(--color-accent)] opacity-80 transition-all group-hover:opacity-100"
                          style={{ height }}
                          title={`${day.visits} visits`}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{formatDayLabel(day.date)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[var(--color-ink)]/5 p-3 text-[var(--color-ink)]">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--color-ink)]">Referrers</h2>
              <p className="text-sm font-medium text-slate-500">Top traffic sources.</p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {analytics.topReferrers.length > 0 ? (
              analytics.topReferrers.map((referrer, index) => {
                const maxReferrerVisits = analytics.topReferrers[0]?.visits ?? 1;
                const width = `${(referrer.visits / maxReferrerVisits) * 100}%`;

                return (
                  <div key={referrer.source} className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-slate-600">
                        {index + 1}. {referrer.source}
                      </span>
                      <span className="text-[var(--color-ink)]">{numberFormatter.format(referrer.visits)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-50">
                      <div
                        className="h-full rounded-full bg-[var(--color-accent)]"
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-100 px-4 py-12 text-center text-xs font-bold text-slate-400">
                No referrer data available.
              </div>
            )}
          </div>
        </article>
      </div>

      <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-[var(--color-ink)]">Recent Activity</h2>
          <p className="text-sm font-medium text-slate-500">Latest engagement events.</p>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full text-left text-xs font-bold">
            <thead>
              <tr className="border-b border-slate-100 pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="pb-4 pr-4">Event</th>
                <th className="pb-4 pr-4">Route</th>
                <th className="pb-4 pr-4">Referrer</th>
                <th className="pb-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {analytics.recentEvents.length > 0 ? (
                analytics.recentEvents.map((event) => (
                  <tr key={event.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="py-5 pr-4">
                      <span className="inline-flex rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)]">
                        {formatEventLabel(event.type)}
                      </span>
                    </td>
                    <td className="py-5 pr-4 font-black text-[var(--color-ink)]">{event.route}</td>
                    <td className="py-5 pr-4 text-slate-500">{event.referrer}</td>
                    <td className="py-5 text-slate-400">{formatTimestamp(event.timestamp)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    No recent events tracked.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
