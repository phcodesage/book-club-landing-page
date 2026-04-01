'use client';

import Image from 'next/image';
import { BookOpen, Calendar, Clock, Mail, MapPin, Phone, Sparkles, Users, X, Zap } from 'lucide-react';
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
  content: SiteContent;
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
      className={`group relative flex flex-col overflow-hidden rounded-sm bg-white text-left shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-500 animate-fade-in hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] ${
        isPast ? 'grayscale opacity-60' : 'cursor-pointer hover:-translate-y-1'
      }`}
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Red Accent Top Border */}
      <div className="h-1.5 w-full bg-[var(--color-accent)]" />

      <div className="relative p-6 pt-8">
        <div className="absolute left-6 top-0 -translate-y-1/2 rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
          {book.month}
        </div>

        <div className="mb-6 flex justify-center">
          <div className={`relative transition-transform duration-500 ${isPast ? '' : 'group-hover:scale-105'}`}>
            <div className="relative h-56 w-40">
              <Image
                src={coverImage}
                alt={book.title}
                fill
                sizes="(max-width: 640px) 160px, 160px"
                className="rounded shadow-md object-cover"
              />
            </div>
            {isPast && (
              <div className="absolute inset-0 flex items-center justify-center rounded bg-black/20">
                <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  Completed
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="line-clamp-2 min-h-[2.8rem] text-lg font-bold leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
            {book.title}
          </h3>
          <p className="mt-2 text-sm font-medium text-[var(--color-gray-text)]">
            {book.author ? `by ${book.author}` : '\u00A0'}
          </p>
          
          <div className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Calendar className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              <span>{book.meetings}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Clock className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              <span>{book.time}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-sm transition-transform group-hover:scale-110">
              <Zap className="h-3 w-3" />
            </div>
            <span>View Details</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function BookModal({ book, onClose, content }: BookModalProps) {
  const coverImage = getBookImage(book.imageKey);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-sm bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
      >
        {/* Red Accent Top Border */}
        <div className="h-1.5 w-full bg-[var(--color-accent)]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[var(--color-ink)] transition-all hover:bg-[var(--color-accent)] hover:text-white"
          aria-label="Close book details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="bg-gray-50 p-8 md:w-2/5">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded shadow-2xl">
              <Image 
                src={coverImage} 
                alt={book.title} 
                fill 
                className="object-cover" 
                sizes="(max-width: 768px) 200px, 300px" 
              />
            </div>
          </div>

          <div className="flex flex-col justify-center p-8 md:w-3/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)]">
              {book.month} Selection
            </span>
            <h2 id="book-modal-title" className="mt-2 text-3xl font-black text-[var(--color-ink)] leading-tight">
              {book.title}
            </h2>
            {book.author ? (
              <p className="mt-2 text-lg font-medium text-[var(--color-gray-text)]">by {book.author}</p>
            ) : null}

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--color-accent)] shadow-sm">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Meeting Dates</p>
                  <p className="font-bold text-[var(--color-ink)]">{book.meetings}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--color-accent)] shadow-sm">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Meeting Time</p>
                  <p className="font-bold text-[var(--color-ink)]">{book.time}</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <a
                href={content.modal.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full rounded-full bg-[var(--color-accent)] py-4 text-center text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-[var(--color-accent-hover)] hover:-translate-y-1"
              >
                {content.modal.ctaLabel}
              </a>
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
      <Navigation 
        logo={content.navigation.logoPath} 
        email={content.contact.email} 
        emailHref={content.contact.emailHref} 
      />
      <main className="min-h-screen bg-[var(--color-light-bg)] pt-[104px]">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[var(--color-ink)] py-20 lg:py-32">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0">
            <Image 
              src={content.hero.backgroundImage} 
              alt="Hero background" 
              fill 
              className="object-cover opacity-10" 
              sizes="100vw"
              priority
            />
          </div>
          
          <div className="container relative z-10 mx-auto max-w-7xl px-4">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:text-left">
              {/* Left Column: Text Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="animate-fade-in inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                  <span>{content.hero.communityLabel}</span>
                </div>

                <h1 className="animate-slide-in mt-8 text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl">
                  {content.hero.title.split(' ').map((word, i) => (
                    <span key={i} className={i === 1 ? 'text-[var(--color-accent)]' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>

                <p className="animate-slide-in mt-8 max-w-2xl text-lg font-medium leading-relaxed text-gray-300 md:text-xl" style={{ animationDelay: '0.1s' }}>
                  {content.hero.description}
                </p>

                <div className="animate-slide-in mt-12 flex flex-wrap justify-center gap-4 lg:justify-start" style={{ animationDelay: '0.2s' }}>
                  <a
                    href={content.pricing.ctaHref}
                    className="rounded-full bg-[var(--color-accent)] px-10 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-2xl hover:-translate-y-1"
                  >
                    {content.pricing.ctaLabel}
                  </a>
                  <button 
                    onClick={() => document.getElementById('reading-list')?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-full border-2 border-white/20 px-10 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-white/40"
                  >
                    View Reading List
                  </button>
                </div>
              </div>

              {/* Right Column: Image Content */}
              <div className="animate-fade-in relative flex-1" style={{ animationDelay: '0.3s' }}>
                <div className="relative mx-auto aspect-[4/3] w-full max-w-[600px] overflow-hidden rounded-2xl shadow-2xl">
                  <Image 
                    src={siteBg} 
                    alt="Teen Book Club" 
                    fill 
                    priority 
                    className="object-cover transition-transform duration-700 hover:scale-105" 
                    sizes="(max-width: 1024px) 100vw, 50vw" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/60 via-transparent to-transparent" />
                  
                  {/* Decorative Elements on Image */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-xl bg-white/10 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-white">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] shadow-lg">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Community</p>
                        <p className="text-sm font-bold">{content.hero.communityStats}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Accent Cards */}
                <div className="absolute -right-6 -top-6 hidden h-24 w-24 animate-float items-center justify-center rounded-2xl bg-white shadow-2xl lg:flex">
                  <BookOpen className="h-10 w-10 text-[var(--color-accent)]" />
                </div>
                <div className="absolute -bottom-6 -left-6 hidden h-32 w-48 animate-float items-center justify-center rounded-2xl bg-[var(--color-accent)] p-4 text-white shadow-2xl lg:flex" style={{ animationDelay: '-3s' }}>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{content.hero.floatingCardTitle}</p>
                    <p className="mt-1 text-lg font-black leading-tight">{content.hero.floatingCardSubtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 py-20 lg:py-28">
          {/* Intro Section */}
          <header id="reading-list" className="mb-20 text-center scroll-mt-32">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-1 w-10 bg-[var(--color-accent)] rounded-full" />
              <span className="text-sm font-black uppercase tracking-[0.3em] text-[var(--color-accent)]">
                {content.schedule.eyebrow}
              </span>
              <div className="h-1 w-10 bg-[var(--color-accent)] rounded-full" />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-[var(--color-ink)] md:text-5xl lg:text-6xl">
              {content.schedule.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-[var(--color-gray-text)]">
              {content.schedule.description}
            </p>
          </header>

          {/* Pricing Highlight */}
          <section id="pricing" className="mb-32 scroll-mt-32">
            <div className="relative overflow-hidden rounded-3xl bg-white p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:p-16">
              <div className="absolute right-0 top-0 h-full w-1/3 bg-[var(--color-accent)]/5 skew-x-12" />
              
              <div className="relative z-10 flex flex-col items-center justify-between gap-12 lg:flex-row lg:text-left">
                <div className="max-w-xl text-center lg:text-left">
                  <h3 className="text-3xl font-black text-[var(--color-ink)] md:text-4xl">
                    {content.pricing.sectionHeading}
                  </h3>
                  <p className="mt-4 text-lg font-medium text-[var(--color-gray-text)]">
                    {content.pricing.helperText}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-6 lg:items-end">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-[var(--color-ink)]">$</span>
                    <span className="text-7xl font-black tracking-tighter text-[var(--color-ink)]">{content.pricing.amount}</span>
                    <span className="text-xl font-bold text-gray-400">{content.pricing.intervalLabel}</span>
                  </div>
                  <a
                    href={content.pricing.ctaHref}
                    onClick={() => void sendAnalyticsEvent('cta_click')}
                    className="rounded-full bg-[var(--color-accent)] px-12 py-5 text-sm font-black uppercase tracking-widest text-white shadow-[0_15px_30px_rgba(194,39,45,0.3)] transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-[0_20px_40px_rgba(194,39,45,0.4)] hover:-translate-y-1"
                  >
                    {content.pricing.ctaLabel}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section className="mb-32">
            <div className="mb-16 flex flex-col items-center justify-between gap-6 border-b border-gray-200 pb-8 md:flex-row md:text-left">
              <div>
                <h2 className="text-3xl font-black text-[var(--color-ink)] md:text-4xl">
                  {content.schedule.galleryTitle}
                </h2>
                <p className="mt-2 text-lg font-medium text-[var(--color-gray-text)]">
                  {content.schedule.galleryDescription}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[var(--color-accent)]" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-200" />
                  <span>Past Due</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {content.books.map((book, index) => {
                const isPast = book.isCompleted || (today ? isMonthPast(book.month, today, book.meetings) : false);

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

          {/* Footer Section */}
          <footer id="contact" className="pt-20 border-t border-gray-200 scroll-mt-32">
            <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
                  <Phone className="h-8 w-8 text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Call Our Office</p>
                  <a
                    href={`tel:${content.contact.phone.replace(/\s+/g, '')}`}
                    className="mt-2 block text-xl font-black text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    {content.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
                  <MapPin className="h-8 w-8 text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visit Us</p>
                  <p className="mt-2 text-xl font-black text-[var(--color-ink)]">
                    {content.contact.location}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
                  <Mail className="h-8 w-8 text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Send an Email</p>
                  <a
                    href={content.contact.emailHref}
                    className="mt-2 block text-xl font-black text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors underline decoration-[var(--color-accent)] decoration-2 underline-offset-4"
                  >
                    {content.contact.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-8 border-t border-gray-100 py-12 md:flex-row">
              <div className="flex flex-wrap justify-center gap-4">
                {content.footer.highlightItems.map((item, index) => {
                  const Icon = [Sparkles, Users, Zap][index % 3];
                  return (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold shadow-sm"
                    >
                      <Icon className="h-4 w-4 text-[var(--color-accent)]" />
                      <span className="text-gray-600">{item}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs font-bold text-gray-400">
                © {new Date().getFullYear()} {content.footer.copyrightText}
              </p>
            </div>
          </footer>
        </div>

        {selectedBook ? <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} content={content} /> : null}
      </main>
      <ScrollToTop />
    </>
  );
}
