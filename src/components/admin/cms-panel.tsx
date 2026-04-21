'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  FilePenLine,
  ImageIcon,
  MapPin,
  Plus,
  RotateCcw,
  Save,
  Tag,
  Trash2,
} from 'lucide-react';

import { DEFAULT_BOOK_IMAGE_KEY, bookImageMap, bookImageOptions } from '@/lib/book-assets';
import type { SiteContent } from '@/lib/site-content';

type CmsPanelProps = {
  content: SiteContent;
  setContent: Dispatch<SetStateAction<SiteContent>>;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => Promise<void>;
};

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
      {children}
    </span>
  );
}

export function CmsPanel({ content, setContent, hasUnsavedChanges, isSaving, onReset, onSave }: CmsPanelProps) {
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);

  useEffect(() => {
    setSelectedBookIndex((i) => Math.min(i, content.books.length - 1));
  }, [content.books.length]);

  const selectedBook = content.books[selectedBookIndex];
  const coverSrc =
    bookImageMap[((selectedBook?.imageKey ?? DEFAULT_BOOK_IMAGE_KEY) as keyof typeof bookImageMap)] ??
    bookImageMap[DEFAULT_BOOK_IMAGE_KEY];

  function updateNavigation(field: keyof SiteContent['navigation'], value: string) {
    setContent((c) => ({ ...c, navigation: { ...c.navigation, [field]: value } }));
  }
  function updateHero(field: keyof SiteContent['hero'], value: string) {
    setContent((c) => ({ ...c, hero: { ...c.hero, [field]: value } }));
  }
  function updatePricing(field: keyof SiteContent['pricing'], value: string) {
    setContent((c) => ({ ...c, pricing: { ...c.pricing, [field]: value } }));
  }
  function updateSchedule(field: keyof SiteContent['schedule'], value: string) {
    setContent((c) => ({ ...c, schedule: { ...c.schedule, [field]: value } }));
  }
  function updateModal(field: keyof SiteContent['modal'], value: string) {
    setContent((c) => ({ ...c, modal: { ...c.modal, [field]: value } }));
  }
  function updateFooter(field: keyof SiteContent['footer'], value: string) {
    setContent((c) => ({ ...c, footer: { ...c.footer, [field]: value } }));
  }
  function updateContact(field: keyof SiteContent['contact'], value: string) {
    setContent((c) => ({ ...c, contact: { ...c.contact, [field]: value } }));
  }
  function updateHighlightItem(index: number, value: string) {
    setContent((c) => ({
      ...c,
      footer: { ...c.footer, highlightItems: c.footer.highlightItems.map((item, i) => (i === index ? value : item)) },
    }));
  }
  function addHighlightItem() {
    setContent((c) => ({ ...c, footer: { ...c.footer, highlightItems: [...c.footer.highlightItems, 'New highlight'] } }));
  }
  function removeHighlightItem(index: number) {
    setContent((c) => ({
      ...c,
      footer: {
        ...c.footer,
        highlightItems: c.footer.highlightItems.length > 1 ? c.footer.highlightItems.filter((_, i) => i !== index) : c.footer.highlightItems,
      },
    }));
  }
  function updateSelectedBook(field: keyof SiteContent['books'][number], value: string) {
    setContent((c) => ({
      ...c,
      books: c.books.map((book, i) => (i === selectedBookIndex ? { ...book, [field]: value } : book)),
    }));
  }

  function updateSelectedBookBoolean(field: keyof SiteContent['books'][number], value: boolean) {
    setContent((c) => ({
      ...c,
      books: c.books.map((book, i) => (i === selectedBookIndex ? { ...book, [field]: value } : book)),
    }));
  }
  function addBook() {
    setContent((c) => ({
      ...c,
      books: [...c.books, { month: 'New Month 2026', title: 'New Book Title', author: '', meetings: 'Date TBD', time: '5:00 PM', imageKey: DEFAULT_BOOK_IMAGE_KEY }],
    }));
    setSelectedBookIndex(content.books.length);
  }
  function removeSelectedBook() {
    if (content.books.length <= 1) return;
    setContent((c) => ({ ...c, books: c.books.filter((_, i) => i !== selectedBookIndex) }));
    setSelectedBookIndex((i) => Math.max(i - 1, 0));
  }
  function moveSelectedBook(direction: -1 | 1) {
    const target = selectedBookIndex + direction;
    if (target < 0 || target >= content.books.length) return;
    setContent((c) => {
      const books = [...c.books];
      [books[selectedBookIndex], books[target]] = [books[target], books[selectedBookIndex]];
      return { ...c, books };
    });
    setSelectedBookIndex(target);
  }

  return (
    <section className="space-y-6">

      {/* Sticky save bar */}
      <div className="sticky top-0 z-30 -mx-1 rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--color-accent)]">CMS</p>
            <h1 className="mt-2 text-3xl font-black text-[var(--color-ink)]">Content Editor</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
              Manage the landing page copy, pricing details, and the monthly reading schedule.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onReset} disabled={!hasUnsavedChanges || isSaving}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
            <button type="button" onClick={() => void onSave()} disabled={!hasUnsavedChanges || isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-8 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[var(--color-accent-hover)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60">
              <Save className="h-3.5 w-3.5" /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Books Manager - full width */}
      <article className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm">

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--color-ink)]/5 p-3 text-[var(--color-ink)]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--color-ink)]">Books Manager</h2>
              <p className="text-sm font-medium text-slate-500">Click a book to edit its details and cover image.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => moveSelectedBook(-1)} title="Move Up"
              className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
              <ArrowUp className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => moveSelectedBook(1)} title="Move Down"
              className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
              <ArrowDown className="h-4 w-4" />
            </button>
            <button type="button" onClick={addBook}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-[var(--color-ink)]/90">
              <Plus className="h-3.5 w-3.5" /> Add Book
            </button>
            <button type="button" onClick={removeSelectedBook} disabled={content.books.length <= 1} title="Remove Book"
              className="rounded-full border border-red-100 p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-30">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body: flex row - book list | cover | fields */}
        <div className="flex min-h-[600px] overflow-hidden">

          {/* Book list - fixed width */}
          <div className="w-[200px] shrink-0 overflow-y-auto border-r border-slate-100">
            <div className="space-y-1 p-3">
              {content.books.map((book, index) => {
                const active = selectedBookIndex === index;
                return (
                  <button
                    key={`${book.month}-${index}`}
                    type="button"
                    onClick={() => setSelectedBookIndex(index)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                      active
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-md'
                        : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded-md shadow-sm">
                      <Image
                        src={bookImageMap[book.imageKey as keyof typeof bookImageMap] ?? bookImageMap[DEFAULT_BOOK_IMAGE_KEY]}
                        alt={book.title}
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[9px] font-black uppercase tracking-widest leading-none ${active ? 'text-white/60' : 'text-slate-400'}`}>
                        {book.month}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs font-bold leading-tight">{book.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover display + picker - fixed width */}
          {selectedBook ? (
            <div className="flex w-[260px] shrink-0 flex-col border-r border-slate-100">
              <div className="relative flex-1 bg-slate-50/80" style={{ minHeight: 300 }}>
                <Image
                  src={coverSrc}
                  alt={selectedBook.title}
                  fill
                  className="object-contain p-6"
                  sizes="260px"
                  priority
                />
              </div>
              <div className="border-t border-slate-100 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                  <Label>Choose Cover</Label>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {bookImageOptions.map((option) => {
                    const isSelected = selectedBook.imageKey === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        title={option.label}
                        onClick={() => updateSelectedBook('imageKey', option.value)}
                        className={`relative aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-[var(--color-accent)] shadow-md shadow-[var(--color-accent)]/20'
                            : 'border-transparent hover:border-slate-300'
                        }`}
                      >
                        <Image
                          src={bookImageMap[option.value as keyof typeof bookImageMap]}
                          alt={option.label}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-end justify-end bg-[var(--color-accent)]/20 p-1">
                            <div className="rounded-full bg-[var(--color-accent)] p-0.5">
                              <Check className="h-2.5 w-2.5 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {/* Fields - fills all remaining space */}
          {selectedBook ? (
            <div className="min-w-0 flex-1 overflow-y-auto p-8 space-y-5">
              <div className="pb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--color-accent)]">Editing</p>
                <h3 className="mt-1 line-clamp-2 text-xl font-black leading-tight text-[var(--color-ink)]">
                  {selectedBook.title}
                </h3>
              </div>
              <label className="grid gap-2">
                <Label>Month</Label>
                <input value={selectedBook.month} onChange={(e) => updateSelectedBook('month', e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-2">
                <Label>Title</Label>
                <input value={selectedBook.title} onChange={(e) => updateSelectedBook('title', e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-2">
                <Label>Author</Label>
                <input value={selectedBook.author} onChange={(e) => updateSelectedBook('author', e.target.value)} className={inputClass} placeholder="Optional" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-2">
                  <Label>Meeting Dates</Label>
                  <input value={selectedBook.meetings} onChange={(e) => updateSelectedBook('meetings', e.target.value)} className={inputClass} />
                </label>
                <label className="grid gap-2">
                  <Label>Time</Label>
                  <input value={selectedBook.time} onChange={(e) => updateSelectedBook('time', e.target.value)} className={inputClass} />
                </label>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <label className="flex flex-1 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedBook.isCompleted ?? false}
                    onChange={(e) => updateSelectedBookBoolean('isCompleted', e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-tight text-slate-700">Mark as Completed</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">This will fade the book on the landing page.</p>
                  </div>
                </label>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="relative h-10 w-8 shrink-0 overflow-hidden rounded-lg shadow-sm">
                  <Image src={coverSrc} alt={selectedBook.title} fill className="object-cover" sizes="32px" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight text-slate-700">
                    {bookImageOptions.find((o) => o.value === selectedBook.imageKey)?.label ?? 'Unknown'}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-400">{selectedBook.imageKey}</p>
                </div>
              </div>
            </div>
          ) : null}

        </div>
      </article>

      {/* Text content sections - 2-col grid */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Navigation */}
        <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--color-ink)]/5 p-3 text-[var(--color-ink)]">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--color-ink)]">Navigation</h2>
              <p className="text-sm font-medium text-slate-500">Site logo and branding.</p>
            </div>
          </div>
          <div className="grid gap-5">
            <label className="grid gap-2">
              <Label>Logo Path</Label>
              <input value={content.navigation.logoPath} onChange={(e) => updateNavigation('logoPath', e.target.value)} className={inputClass} placeholder="/exceed-logo.png" />
            </label>
          </div>
        </article>

        {/* Hero & Community */}
        <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--color-ink)]/5 p-3 text-[var(--color-ink)]">
              <FilePenLine className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--color-ink)]">Hero Section</h2>
              <p className="text-sm font-medium text-slate-500">Primary messaging for the top section.</p>
            </div>
          </div>
          <div className="grid gap-5">
            <label className="grid gap-2">
              <Label>Hero Title</Label>
              <input value={content.hero.title} onChange={(e) => updateHero('title', e.target.value)} className={inputClass} />
            </label>
            <label className="grid gap-2">
              <Label>Description</Label>
              <textarea value={content.hero.description} onChange={(e) => updateHero('description', e.target.value)} className={`${inputClass} min-h-[100px] resize-y`} />
            </label>
            <label className="grid gap-2">
              <Label>Community Label</Label>
              <input value={content.hero.communityLabel} onChange={(e) => updateHero('communityLabel', e.target.value)} className={inputClass} />
            </label>
            <label className="grid gap-2">
              <Label>Background Image Path</Label>
              <input value={content.hero.backgroundImage} onChange={(e) => updateHero('backgroundImage', e.target.value)} className={inputClass} placeholder="/site-bg.jpg" />
            </label>
            <label className="grid gap-2">
              <Label>Community Stats Text</Label>
              <input value={content.hero.communityStats} onChange={(e) => updateHero('communityStats', e.target.value)} className={inputClass} placeholder="Join 1000+ Members" />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <Label>Floating Card Title</Label>
                <input value={content.hero.floatingCardTitle} onChange={(e) => updateHero('floatingCardTitle', e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-2">
                <Label>Floating Card Subtitle</Label>
                <input value={content.hero.floatingCardSubtitle} onChange={(e) => updateHero('floatingCardSubtitle', e.target.value)} className={inputClass} />
              </label>
            </div>
          </div>
        </article>

        {/* Pricing & CTA */}
        <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--color-ink)]/5 p-3 text-[var(--color-ink)]">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--color-ink)]">Pricing & CTA</h2>
              <p className="text-sm font-medium text-slate-500">Membership offer and join button.</p>
            </div>
          </div>
          <div className="grid gap-5">
            <label className="grid gap-2">
              <Label>Section Heading</Label>
              <input value={content.pricing.sectionHeading} onChange={(e) => updatePricing('sectionHeading', e.target.value)} className={inputClass} />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <Label>Monthly Amount</Label>
                <input value={content.pricing.amount} onChange={(e) => updatePricing('amount', e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-2">
                <Label>Interval Label</Label>
                <input value={content.pricing.intervalLabel} onChange={(e) => updatePricing('intervalLabel', e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-2">
                <Label>CTA Label</Label>
                <input value={content.pricing.ctaLabel} onChange={(e) => updatePricing('ctaLabel', e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-2">
                <Label>Stripe URL</Label>
                <input value={content.pricing.ctaHref} onChange={(e) => updatePricing('ctaHref', e.target.value)} className={inputClass} />
              </label>
            </div>
            <label className="grid gap-2">
              <Label>Helper Text</Label>
              <input value={content.pricing.helperText} onChange={(e) => updatePricing('helperText', e.target.value)} className={inputClass} />
            </label>
          </div>
        </article>

        {/* Schedule Labels */}
        <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="mb-1 text-lg font-black text-[var(--color-ink)]">Schedule Labels</h2>
          <p className="mb-6 text-sm font-medium text-slate-500">Section headings for the reading schedule.</p>
          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <Label>Eyebrow</Label>
                <input value={content.schedule.eyebrow} onChange={(e) => updateSchedule('eyebrow', e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-2">
                <Label>Schedule Title</Label>
                <input value={content.schedule.title} onChange={(e) => updateSchedule('title', e.target.value)} className={inputClass} />
              </label>
            </div>
            <label className="grid gap-2">
              <Label>Description</Label>
              <textarea value={content.schedule.description} onChange={(e) => updateSchedule('description', e.target.value)} className={`${inputClass} min-h-[80px] resize-y`} />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <Label>Gallery Title</Label>
                <input value={content.schedule.galleryTitle} onChange={(e) => updateSchedule('galleryTitle', e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-2">
                <Label>Gallery Subtitle</Label>
                <input value={content.schedule.galleryDescription} onChange={(e) => updateSchedule('galleryDescription', e.target.value)} className={inputClass} />
              </label>
            </div>
          </div>
        </article>

        {/* Modal CTA */}
        <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="mb-1 text-lg font-black text-[var(--color-ink)]">Book Modal CTA</h2>
          <p className="mb-6 text-sm font-medium text-slate-500">Call-to-action shown in book detail modals.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <Label>Modal CTA Label</Label>
              <input value={content.modal.ctaLabel} onChange={(e) => updateModal('ctaLabel', e.target.value)} className={inputClass} />
            </label>
            <label className="grid gap-2">
              <Label>Modal CTA URL</Label>
              <input value={content.modal.ctaHref} onChange={(e) => updateModal('ctaHref', e.target.value)} className={inputClass} />
            </label>
          </div>
        </article>

        {/* Contact & Footer */}
        <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--color-ink)]/5 p-3 text-[var(--color-ink)]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--color-ink)]">Contact & Footer</h2>
              <p className="text-sm font-medium text-slate-500">Contact info, highlights, and copyright.</p>
            </div>
          </div>
          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <Label>Phone</Label>
                <input value={content.contact.phone} onChange={(e) => updateContact('phone', e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-2">
                <Label>Location</Label>
                <input value={content.contact.location} onChange={(e) => updateContact('location', e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-2">
                <Label>Email Display</Label>
                <input value={content.contact.email} onChange={(e) => updateContact('email', e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-2">
                <Label>Mailto URL</Label>
                <input value={content.contact.emailHref} onChange={(e) => updateContact('emailHref', e.target.value)} className={inputClass} />
              </label>
            </div>
            <label className="grid gap-2">
              <Label>Copyright Text</Label>
              <input value={content.footer.copyrightText} onChange={(e) => updateFooter('copyrightText', e.target.value)} className={inputClass} />
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Highlight Chips</Label>
                <button type="button" onClick={addHighlightItem}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              <div className="grid gap-2">
                {content.footer.highlightItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex gap-2">
                    <input value={item} onChange={(e) => updateHighlightItem(index, e.target.value)} className={inputClass} />
                    <button type="button" onClick={() => removeHighlightItem(index)} aria-label={`Remove highlight ${index + 1}`}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 px-4 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

      </div>
    </section>
  );
}
