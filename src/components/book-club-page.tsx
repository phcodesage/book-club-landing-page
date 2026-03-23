'use client';

import Image from 'next/image';
import { BookOpen, Calendar, Clock, Sparkles, Users, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { getBookImage, siteBg } from '@/lib/book-assets';
import { isMonthPast, type SiteBook, type SiteContent } from '@/lib/site-content';
import { Navigation } from './navigation';
import { ScrollToTop } from './scroll-to-top';

type BookClubPageProps = {
  content: SiteContent;
};

type BookCardProps = {
  book: SiteBook;
  isPast: boolean;
  index: number;
  onSelect: (book: SiteBook) => void;
};

type BookModalProps = {
  book: SiteBook;
  onClose: () => void;
};

type AnalyticsEventType = 'page_view' | 'cta_click';

function getVisitorId() {
  const storageKey = 'teen-book-club-visitor-id';
  const existingId = window.localStorage.getItem(storageKey);

  if (existingId) {
    return existingId;
  }

  const nextId = window.crypto.randomUUID();
  window.localStorage.setItem(storageKey, nextId);
  return nextId;
}

async function sendAnalyticsEvent(type: AnalyticsEventType) {
  const payload = JSON.stringify({
    type,
    route: '/',
    visitorId: getVisitorId(),
    referrer: document.referrer || 'direct',
  });

  if (type === 'cta_click' && 'sendBeacon' in navigator) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/analytics/visit', blob);
    return;
  }

  await fetch('/api/analytics/visit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
    keepalive: true,
  });
}

function BookCard({ book, isPast, index, onSelect }: BookCardProps) {
  const coverImage = getBookImage(book.imageKey);

  return (
    <button
      type="button"
      disabled={isPast}
      onClick={() => onSelect(book)}
      className={`group relative overflow-hidden rounded-2xl p-5 text-left shadow-xl transition-all duration-500 animate-fade-in ${
        isPast
          ? 'cursor-default grayscale opacity-60'
          : 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
      }`}
      style={{
        backgroundColor: 'var(--color-cream)',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        <span
          className="rounded-full px-3 py-1.5 text-xs font-bold shadow-md"
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-cream)' }}
        >
          {book.month}
        </span>
        {isPast ? (
          <span className="rounded-full bg-neutral-600 px-3 py-1 text-center text-xs font-bold text-white shadow-md">
            Completed
          </span>
        ) : null}
      </div>

      <div className="mb-4 mt-8 flex justify-center">
        <div className={`relative transition-transform duration-500 ${isPast ? '' : 'group-hover:scale-105'}`}>
          <div className="relative h-48 w-32 sm:h-52 sm:w-36">
            <Image
              src={coverImage}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 128px, 144px"
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
          <div
            className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black shadow-md"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-cream)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-tight text-[var(--color-ink)]">
          {book.title}
        </h3>
        <p
          className={`mb-3 text-xs ${book.author ? 'line-clamp-1' : ''}`}
          style={{ color: 'rgba(14, 31, 62, 0.7)' }}
        >
          {book.author ? `by ${book.author}` : '\u00A0'}
        </p>
        <div className="flex items-center justify-center gap-1 text-xs font-semibold text-[var(--color-accent)]">
          <Calendar className="h-3 w-3" />
          <span>{book.meetings}</span>
        </div>
        <div className="mt-1 flex items-center justify-center gap-1 text-xs font-semibold text-[var(--color-accent)]">
          <Clock className="h-3 w-3" />
          <span>{book.time}</span>
        </div>
      </div>
    </button>
  );
}

function BookModal({ book, onClose }: BookModalProps) {
  const coverImage = getBookImage(book.imageKey);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl p-8 shadow-2xl"
        style={{ backgroundColor: 'var(--color-cream)' }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ca3433]"
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-cream)' }}
          aria-label="Close book details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <span
            className="mb-4 inline-block rounded-full px-4 py-2 text-sm font-bold"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-cream)' }}
          >
            {book.month}
          </span>

          <div className="mb-6 flex justify-center">
            <Image src={coverImage} alt={book.title} className="w-48 rounded-xl shadow-2xl" sizes="192px" />
          </div>

          <h2 id="book-modal-title" className="mb-2 text-2xl font-black text-[var(--color-ink)]">
            {book.title}
          </h2>
          {book.author ? (
            <p className="mb-4 text-base font-semibold text-[rgba(14,31,62,0.7)]">by {book.author}</p>
          ) : null}

          <div className="space-y-3">
            <div
              className="flex items-center justify-center gap-3 rounded-xl p-3"
              style={{ backgroundColor: 'rgba(14, 31, 62, 0.08)' }}
            >
              <Calendar className="h-5 w-5 text-[var(--color-accent)]" />
              <span className="font-bold text-[var(--color-ink)]">Meetings: {book.meetings}</span>
            </div>
            <div
              className="flex items-center justify-center gap-3 rounded-xl p-3"
              style={{ backgroundColor: 'rgba(14, 31, 62, 0.08)' }}
            >
              <Clock className="h-5 w-5 text-[var(--color-accent)]" />
              <span className="font-bold text-[var(--color-ink)]">Time: {book.time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookClubPage({ content }: BookClubPageProps) {
  const [selectedBook, setSelectedBook] = useState<SiteBook | null>(null);
  const [today, setToday] = useState<Date | null>(null);
  const hasTrackedVisit = useRef(false);

  useEffect(() => {
    setToday(new Date());
  }, []);

  useEffect(() => {
    if (hasTrackedVisit.current) {
      return;
    }

    hasTrackedVisit.current = true;
    void sendAnalyticsEvent('page_view');
  }, []);

  useEffect(() => {
    if (!selectedBook) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedBook(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBook]);

  return (
    <>
      <Navigation logo="/logo.png" />
      <main className="min-h-screen bg-[var(--color-ink)] text-[var(--color-cream)] pt-16">
        <section className="relative mb-16 overflow-hidden">
        <div className="relative h-[600px]">
          <Image src={siteBg} alt="" fill priority sizes="100vw" className="object-cover brightness-[0.55]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(202,52,51,0.18)_0%,rgba(14,31,62,0.4)_100%)]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="animate-float mb-6 flex items-center justify-center">
              <div className="relative">
                <BookOpen className="h-24 w-24 text-[var(--color-accent)]" />
                <Sparkles className="absolute -right-2 -top-2 h-8 w-8 text-[var(--color-cream)]" />
              </div>
            </div>

            <h1 className="animate-slide-in mb-4 text-6xl font-black tracking-tight text-white md:text-8xl">
              {content.hero.title}
            </h1>

            <div className="animate-slide-in mb-6 flex items-center gap-3" style={{ animationDelay: '0.1s' }}>
              <div className="h-1 w-16 rounded-full bg-[var(--color-accent)]" />
              <Zap className="h-6 w-6 text-[var(--color-accent)]" />
              <div className="h-1 w-16 rounded-full bg-[var(--color-accent)]" />
            </div>

            <p
              className="animate-slide-in max-w-3xl text-xl font-light leading-relaxed text-white md:text-2xl"
              style={{ animationDelay: '0.2s' }}
            >
              {content.hero.description}
            </p>

            <div className="animate-slide-in mt-6 flex items-center gap-2" style={{ animationDelay: '0.3s' }}>
              <Users className="h-5 w-5 text-[var(--color-cream)]" />
              <p className="text-lg font-semibold text-[var(--color-cream)]">{content.hero.communityLabel}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 pb-16">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-block">
            <span
              className="rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.3em]"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-cream)' }}
            >
              {content.schedule.eyebrow}
            </span>
          </div>
          <h2 className="mb-4 text-5xl font-black tracking-tight text-[var(--color-cream)] md:text-6xl">
            {content.schedule.title}
          </h2>
          <p className="text-xl font-light text-[rgba(247,224,224,0.9)]">{content.schedule.description}</p>
        </header>

        <section className="mb-16 text-center">
          <div className="relative mb-6 inline-block">
            <div className="absolute inset-0 blur-xl opacity-50" style={{ backgroundColor: 'var(--color-accent)' }} />
            <div
              className="relative rounded-2xl px-10 py-5 text-3xl font-black"
              style={{ backgroundColor: 'var(--color-cream)', color: 'var(--color-accent)' }}
            >
              <span className="align-super text-lg">$</span>
              {content.pricing.amount}
              <span className="ml-2 text-xl font-semibold">{content.pricing.intervalLabel}</span>
            </div>
          </div>

          <div>
            <a
              href={content.pricing.ctaHref}
              onClick={() => {
                void sendAnalyticsEvent('cta_click');
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-pulse-glow inline-block rounded-full px-12 py-5 text-xl font-black uppercase tracking-wide shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-cream)' }}
            >
              {content.pricing.ctaLabel}
            </a>
            <p className="mt-4 text-sm font-semibold text-[rgba(247,224,224,0.7)]">{content.pricing.helperText}</p>
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-[var(--color-cream)] md:text-4xl">
              {content.schedule.galleryTitle}
            </h2>
            <p className="mt-2 text-lg text-[rgba(247,224,224,0.8)]">{content.schedule.galleryDescription}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {content.books.map((book, index) => {
              const isPast = today ? isMonthPast(book.month, today) : false;

              return (
                <BookCard
                  key={`${book.month}-${book.title}-${index}`}
                  book={book}
                  isPast={isPast}
                  index={index}
                  onSelect={setSelectedBook}
                />
              );
            })}
          </div>
        </section>

        <footer className="text-center">
          <div
            className="group relative inline-block overflow-hidden rounded-full px-10 py-5 shadow-xl"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-20" />
            <p className="relative z-10 text-xl font-bold text-white">{content.footer.bannerText}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {content.footer.highlightItems.map((item, index) => {
              const Icon = [Sparkles, Users, Zap][index % 3];

              return (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-2 rounded-full px-6 py-3"
                  style={{ backgroundColor: 'rgba(247, 224, 224, 0.1)' }}
                >
                  <Icon className="h-5 w-5 text-[var(--color-cream)]" />
                  <span className="font-semibold text-[var(--color-cream)]">{item}</span>
                </div>
              );
            })}
          </div>
        </footer>
      </div>

        {selectedBook ? <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} /> : null}
      </main>
      <ScrollToTop />
    </>
  );
}
