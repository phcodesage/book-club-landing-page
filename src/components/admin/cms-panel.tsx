import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  FilePenLine,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';

import { DEFAULT_BOOK_IMAGE_KEY, bookImageOptions } from '@/lib/book-assets';
import type { SiteContent } from '@/lib/site-content';

type CmsPanelProps = {
  content: SiteContent;
  setContent: Dispatch<SetStateAction<SiteContent>>;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => Promise<void>;
};

const sectionCardClass = 'rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm';
const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200';
const labelClass = 'text-sm font-medium text-slate-700';

export function CmsPanel({
  content,
  setContent,
  hasUnsavedChanges,
  isSaving,
  onReset,
  onSave,
}: CmsPanelProps) {
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);

  useEffect(() => {
    setSelectedBookIndex((current) => Math.min(current, content.books.length - 1));
  }, [content.books.length]);

  const selectedBook = content.books[selectedBookIndex];

  function updateHero(field: keyof SiteContent['hero'], value: string) {
    setContent((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [field]: value,
      },
    }));
  }

  function updatePricing(field: keyof SiteContent['pricing'], value: string) {
    setContent((current) => ({
      ...current,
      pricing: {
        ...current.pricing,
        [field]: value,
      },
    }));
  }

  function updateSchedule(field: keyof SiteContent['schedule'], value: string) {
    setContent((current) => ({
      ...current,
      schedule: {
        ...current.schedule,
        [field]: value,
      },
    }));
  }

  function updateContact(field: keyof SiteContent['contact'], value: string) {
    setContent((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [field]: value,
      },
    }));
  }

  function updateHighlightItem(index: number, value: string) {
    setContent((current) => ({
      ...current,
      footer: {
        ...current.footer,
        highlightItems: current.footer.highlightItems.map((item, itemIndex) =>
          itemIndex === index ? value : item
        ),
      },
    }));
  }

  function addHighlightItem() {
    setContent((current) => ({
      ...current,
      footer: {
        ...current.footer,
        highlightItems: [...current.footer.highlightItems, 'New highlight'],
      },
    }));
  }

  function removeHighlightItem(index: number) {
    setContent((current) => ({
      ...current,
      footer: {
        ...current.footer,
        highlightItems:
          current.footer.highlightItems.length > 1
            ? current.footer.highlightItems.filter((_, itemIndex) => itemIndex !== index)
            : current.footer.highlightItems,
      },
    }));
  }

  function updateSelectedBook(field: keyof SiteContent['books'][number], value: string) {
    setContent((current) => ({
      ...current,
      books: current.books.map((book, index) =>
        index === selectedBookIndex
          ? {
              ...book,
              [field]: value,
            }
          : book
      ),
    }));
  }

  function addBook() {
    setContent((current) => ({
      ...current,
      books: [
        ...current.books,
        {
          month: 'New Month 2026',
          title: 'New Book Title',
          author: '',
          meetings: 'Date TBD',
          time: '5:00 PM',
          imageKey: DEFAULT_BOOK_IMAGE_KEY,
        },
      ],
    }));

    setSelectedBookIndex(content.books.length);
  }

  function removeSelectedBook() {
    if (content.books.length <= 1) {
      return;
    }

    setContent((current) => ({
      ...current,
      books: current.books.filter((_, index) => index !== selectedBookIndex),
    }));

    setSelectedBookIndex((current) => Math.max(current - 1, 0));
  }

  function moveSelectedBook(direction: -1 | 1) {
    const targetIndex = selectedBookIndex + direction;

    if (targetIndex < 0 || targetIndex >= content.books.length) {
      return;
    }

    setContent((current) => {
      const books = [...current.books];
      [books[selectedBookIndex], books[targetIndex]] = [books[targetIndex], books[selectedBookIndex]];

      return {
        ...current,
        books,
      };
    });

    setSelectedBookIndex(targetIndex);
  }

  return (
    <section className="space-y-6">
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
            <button
              type="button"
              onClick={onReset}
              disabled={!hasUnsavedChanges || isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
            <button
              type="button"
              onClick={() => void onSave()}
              disabled={!hasUnsavedChanges || isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-8 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[var(--color-accent-hover)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.9fr)]">
        <div className="space-y-6">
          <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-[var(--color-ink)]/5 p-3 text-[var(--color-ink)]">
                <FilePenLine className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[var(--color-ink)]">Hero & Community</h2>
                <p className="text-sm font-medium text-slate-500">Primary messaging for the top section.</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6">
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hero Title</span>
                <input
                  value={content.hero.title}
                  onChange={(event) => updateHero('title', event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</span>
                <textarea
                  value={content.hero.description}
                  onChange={(event) => updateHero('description', event.target.value)}
                  className={`${inputClass} min-h-[120px] resize-y`}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Community Label</span>
                <input
                  value={content.hero.communityLabel}
                  onChange={(event) => updateHero('communityLabel', event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-black text-[var(--color-ink)]">Pricing & CTA</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Membership offer and join button.</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Amount</span>
                <input
                  value={content.pricing.amount}
                  onChange={(event) => updatePricing('amount', event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interval Label</span>
                <input
                  value={content.pricing.intervalLabel}
                  onChange={(event) => updatePricing('intervalLabel', event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">CTA Label</span>
                <input
                  value={content.pricing.ctaLabel}
                  onChange={(event) => updatePricing('ctaLabel', event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stripe URL</span>
                <input
                  value={content.pricing.ctaHref}
                  onChange={(event) => updatePricing('ctaHref', event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Helper Text</span>
                <input
                  value={content.pricing.helperText}
                  onChange={(event) => updatePricing('helperText', event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-black text-[var(--color-ink)]">Schedule & Contact</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Section labels and contact information.</p>

            <div className="mt-8 grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Eyebrow</span>
                  <input
                    value={content.schedule.eyebrow}
                    onChange={(event) => updateSchedule('eyebrow', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Schedule Title</span>
                  <input
                    value={content.schedule.title}
                    onChange={(event) => updateSchedule('title', event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</span>
                <textarea
                  value={content.schedule.description}
                  onChange={(event) => updateSchedule('description', event.target.value)}
                  className={`${inputClass} min-h-[100px] resize-y`}
                />
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gallery Title</span>
                  <input
                    value={content.schedule.galleryTitle}
                    onChange={(event) => updateSchedule('galleryTitle', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gallery Subtitle</span>
                  <input
                    value={content.schedule.galleryDescription}
                    onChange={(event) => updateSchedule('galleryDescription', event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</span>
                  <input
                    value={content.contact.phone}
                    onChange={(event) => updateContact('phone', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</span>
                  <input
                    value={content.contact.location}
                    onChange={(event) => updateContact('location', event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Display</span>
                  <input
                    value={content.contact.email}
                    onChange={(event) => updateContact('email', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mailto URL</span>
                  <input
                    value={content.contact.emailHref}
                    onChange={(event) => updateContact('emailHref', event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highlight Chips</span>
                  <button
                    type="button"
                    onClick={addHighlightItem}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <Plus className="h-3 w-3" />
                    Add Item
                  </button>
                </div>

                <div className="grid gap-3">
                  {content.footer.highlightItems.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex gap-3">
                      <input
                        value={item}
                        onChange={(event) => updateHighlightItem(index, event.target.value)}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlightItem(index)}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 px-4 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove highlight ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-black text-[var(--color-ink)]">Live Preview</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Visual snapshot of the live site.</p>

            <div className="mt-8 rounded-[28px] border border-slate-100 bg-white p-8 text-slate-900 shadow-inner">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--color-accent)]">
                {content.schedule.eyebrow}
              </p>
              <h3 className="mt-3 text-3xl font-black tracking-tight text-[var(--color-ink)]">{content.hero.title}</h3>
              <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-500">{content.hero.description}</p>

              <div className="mt-8 inline-flex items-baseline gap-2 rounded-2xl bg-slate-50 px-6 py-4">
                <span className="text-xl font-black text-[var(--color-ink)]">$</span>
                <span className="text-4xl font-black tracking-tighter text-[var(--color-ink)]">{content.pricing.amount}</span>
                <span className="text-sm font-bold text-slate-400">{content.pricing.intervalLabel}</span>
              </div>

              <div className="mt-8 block rounded-full bg-[var(--color-accent)] px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                {content.pricing.ctaLabel}
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-[var(--color-ink)]">Books Manager</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">Edit monthly selections.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moveSelectedBook(-1)}
                  className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                  title="Move Up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSelectedBook(1)}
                  className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                  title="Move Down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={addBook}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-[var(--color-ink)]/90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
                <button
                  type="button"
                  onClick={removeSelectedBook}
                  disabled={content.books.length <= 1}
                  className="rounded-full border border-red-100 p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-30"
                  title="Remove Book"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="space-y-2">
                {content.books.map((book, index) => (
                  <button
                    key={`${book.month}-${book.title}-${index}`}
                    type="button"
                    onClick={() => setSelectedBookIndex(index)}
                    className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                      selectedBookIndex === index
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-lg'
                        : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <p className={`text-[9px] font-black uppercase tracking-widest ${selectedBookIndex === index ? 'text-white/70' : 'text-slate-400'}`}>
                      {book.month}
                    </p>
                    <p className="mt-1.5 font-bold leading-tight line-clamp-1">{book.title}</p>
                  </button>
                ))}
              </div>

              {selectedBook ? (
                <div className="space-y-5 rounded-2xl bg-slate-50/50 p-6">
                  <label className="grid gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Month</span>
                    <input
                      value={selectedBook.month}
                      onChange={(event) => updateSelectedBook('month', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title</span>
                    <input
                      value={selectedBook.title}
                      onChange={(event) => updateSelectedBook('title', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author</span>
                    <input
                      value={selectedBook.author}
                      onChange={(event) => updateSelectedBook('author', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meetings</span>
                      <input
                        value={selectedBook.meetings}
                        onChange={(event) => updateSelectedBook('meetings', event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time</span>
                      <input
                        value={selectedBook.time}
                        onChange={(event) => updateSelectedBook('time', event.target.value)}
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <label className="grid gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cover</span>
                    <select
                      value={selectedBook.imageKey}
                      onChange={(event) => updateSelectedBook('imageKey', event.target.value)}
                      className={inputClass}
                    >
                      {bookImageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
