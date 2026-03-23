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
      helper: 'All recorded landing-page views',
      icon: Activity,
    },
    {
      label: 'Unique readers',
      value: numberFormatter.format(analytics.summary.uniqueVisitors),
      helper: 'Estimated by browser visitor id',
      icon: Users,
    },
    {
      label: 'Visits today',
      value: numberFormatter.format(analytics.summary.visitsToday),
      helper: 'UTC day rollup',
      icon: TrendingUp,
    },
    {
      label: 'CTA conversion',
      value: `${analytics.summary.conversionRate}%`,
      helper: `${numberFormatter.format(analytics.summary.ctaClicks)} join clicks tracked`,
      icon: MousePointerClick,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-400">Analytics</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Visit performance</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            This dashboard tracks public landing-page visits and CTA clicks through the new server routes. It is
            intentionally scoped to this project only.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh analytics
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{metric.value}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">{metric.helper}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Visits over the last 14 days</h2>
              <p className="text-sm text-slate-500">Daily landing-page views with unique-reader context.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {analytics.lastRecordedAt ? `Last event ${formatTimestamp(analytics.lastRecordedAt)}` : 'No events yet'}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex h-64 items-end gap-3">
              {analytics.daily.map((day) => {
                const height = `${Math.max((day.visits / maxVisits) * 100, day.visits > 0 ? 12 : 4)}%`;

                return (
                  <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                    <div className="flex h-full w-full items-end justify-center rounded-[20px] bg-slate-100 p-2">
                      <div className="flex w-full flex-col items-center gap-2">
                        <div
                          className="w-full rounded-2xl bg-gradient-to-t from-[#ca3433] via-[#ea5f5e] to-[#f0a3a3] transition-all"
                          style={{ height }}
                          title={`${day.visits} visits`}
                        />
                        <span className="text-xs font-medium text-slate-500">{day.visits}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-slate-600">{formatDayLabel(day.date)}</p>
                      <p className="text-[11px] text-slate-400">{day.uniqueVisitors} unique</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Top referrers</h2>
              <p className="text-sm text-slate-500">Who is sending traffic into the site.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {analytics.topReferrers.length > 0 ? (
              analytics.topReferrers.map((referrer, index) => {
                const maxReferrerVisits = analytics.topReferrers[0]?.visits ?? 1;
                const width = `${(referrer.visits / maxReferrerVisits) * 100}%`;

                return (
                  <div key={referrer.source} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {index + 1}. {referrer.source}
                      </span>
                      <span className="text-slate-500">{numberFormatter.format(referrer.visits)} visits</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0e1f3e] to-[#ca3433]"
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                Referrer data will appear after the first public visits are tracked.
              </div>
            )}
          </div>
        </article>
      </div>

      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
          <p className="text-sm text-slate-500">The most recent events recorded for this landing page.</p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <th className="pb-3 pr-4">Event</th>
                <th className="pb-3 pr-4">Route</th>
                <th className="pb-3 pr-4">Referrer</th>
                <th className="pb-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.recentEvents.length > 0 ? (
                analytics.recentEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="py-4 pr-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {formatEventLabel(event.type)}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-medium text-slate-700">{event.route}</td>
                    <td className="py-4 pr-4 text-slate-500">{event.referrer}</td>
                    <td className="py-4 text-slate-500">{formatTimestamp(event.timestamp)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-slate-500">
                    No analytics events have been recorded yet.
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
