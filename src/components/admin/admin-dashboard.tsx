'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BarChart3, BookText, ChevronRight, Images, LayoutDashboard, LogOut, Menu, Sparkles, X, CreditCard } from 'lucide-react';

import type { SiteContent } from '@/lib/site-content';
import type { AnalyticsDashboardData } from '@/lib/site-storage';

import { AnalyticsPanel } from './analytics-panel';
import { CmsPanel } from './cms-panel';
import { MediaPanel } from './media-panel';
import { PaymentsPanel } from './payments-panel';

type AdminDashboardProps = {
  initialContent: SiteContent;
  initialAnalytics: AnalyticsDashboardData;
  username?: string;
};

type AdminView = 'analytics' | 'cms' | 'media' | 'payments';

type StatusState = {
  message: string;
  error: boolean;
};

const navigationItems: Array<{
  id: AdminView;
  label: string;
  description: string;
  icon: typeof BarChart3;
}> = [
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Visits, referrers, and CTA conversion',
    icon: BarChart3,
  },
  {
    id: 'cms',
    label: 'CMS',
    description: 'Landing-page copy and book schedule',
    icon: BookText,
  },
  {
    id: 'media',
    label: 'Media',
    description: 'Book covers, references, and site images',
    icon: Images,
  },
  {
    id: 'payments',
    label: 'Payments',
    description: 'Zelle payment submissions and verification',
    icon: CreditCard,
  },
];

export function AdminDashboard({ initialContent, initialAnalytics, username }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<AdminView>('analytics');
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshingAnalytics, setIsRefreshingAnalytics] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    message: 'Admin is connected to the live content file and analytics routes.',
    error: false,
  });

  const hasUnsavedChanges = JSON.stringify(content) !== JSON.stringify(savedContent);

  async function refreshAnalytics() {
    setIsRefreshingAnalytics(true);
    setStatus({ message: 'Refreshing analytics data...', error: false });

    try {
      const response = await fetch('/api/admin/analytics', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Analytics refresh failed.');
      }

      const nextAnalytics = (await response.json()) as AnalyticsDashboardData;
      setAnalytics(nextAnalytics);
      setStatus({ message: 'Analytics refreshed.', error: false });
    } catch {
      setStatus({ message: 'Unable to refresh analytics right now.', error: true });
    } finally {
      setIsRefreshingAnalytics(false);
    }
  }

  async function saveContent() {
    setIsSaving(true);
    setStatus({ message: 'Saving content changes...', error: false });

    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error('Content save failed.');
      }

      const saved = (await response.json()) as SiteContent;
      setContent(saved);
      setSavedContent(saved);
      setStatus({ message: 'Landing-page content saved.', error: false });
    } catch {
      setStatus({ message: 'Unable to save content right now.', error: true });
    } finally {
      setIsSaving(false);
    }
  }

  function resetContent() {
    setContent(savedContent);
    setStatus({ message: 'Unsaved draft changes were discarded.', error: false });
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  const sidebar = (
    <aside className="flex h-full flex-col rounded-[32px] bg-[var(--color-ink)] p-5 text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <LayoutDashboard className="h-5 w-5 text-[var(--color-accent)]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/40">Exceed Learning</p>
            <h2 className="text-lg font-black tracking-tight">Admin Panel</h2>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/20 hover:text-white md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-label="Close admin navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="mt-8 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveView(item.id);
                setIsMobileSidebarOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-[22px] px-4 py-4 text-left transition ${
                isActive ? 'bg-white text-[var(--color-ink)] shadow-sm' : 'bg-transparent text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-2xl p-2 ${isActive ? 'bg-[var(--color-accent)] text-white' : 'bg-white/10 text-white'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">{item.label}</p>
                  <p className={`mt-0.5 text-[10px] font-bold ${isActive ? 'text-[var(--color-ink)]/50' : 'text-white/40'}`}>{item.description}</p>
                </div>
              </div>
              <ChevronRight className={`h-4 w-4 ${isActive ? 'text-[var(--color-ink)]/30' : 'text-white/20'}`} />
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <Link
          href="/"
          className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:-translate-y-0.5"
        >
          <span>View Site</span>
          <ChevronRight className="h-4 w-4 text-[var(--color-accent)]" />
        </Link>

        {username && (
          <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Signed in as</p>
              <p className="mt-0.5 text-sm font-black text-white">{username}</p>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              title="Sign out"
              className="rounded-full border border-white/10 p-2 text-white/50 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="rounded-[22px] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 p-4 text-xs">
          <div className="flex items-center gap-2 font-black uppercase tracking-widest text-white">
            <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
            Live Sync
          </div>
          <p className="mt-2 text-[10px] font-medium leading-relaxed text-white/60">
            Changes save directly to the site content. Analytics update in real-time.
          </p>
        </div>
      </div>
    </aside>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[var(--color-ink)]">
      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 md:py-6">
        <header className="mb-6 flex items-center justify-between rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm md:hidden">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Exceed Learning</p>
            <h1 className="text-lg font-black text-[var(--color-ink)]">Admin Panel</h1>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="Open admin navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <div className="flex gap-6">
          <div className="sticky top-6 hidden h-[calc(100vh-3rem)] w-[300px] md:block">{sidebar}</div>

          <div className="min-w-0 flex-1 space-y-6">
            <div
              className={`rounded-[24px] border px-6 py-4 text-xs font-bold shadow-sm ${
                status.error ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-current opacity-50" />
              {status.message}
            </div>

            {activeView === 'analytics' ? (
              <AnalyticsPanel
                analytics={analytics}
                isRefreshing={isRefreshingAnalytics}
                onRefresh={refreshAnalytics}
              />
            ) : activeView === 'media' ? (
              <MediaPanel />
            ) : activeView === 'payments' ? (
              <PaymentsPanel />
            ) : (
              <CmsPanel
                content={content}
                setContent={setContent}
                hasUnsavedChanges={hasUnsavedChanges}
                isSaving={isSaving}
                onReset={resetContent}
                onSave={saveContent}
              />
            )}
          </div>
        </div>
      </div>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/50 p-4 md:hidden">
          <div className="h-full max-w-sm">{sidebar}</div>
        </div>
      ) : null}
    </main>
  );
}
