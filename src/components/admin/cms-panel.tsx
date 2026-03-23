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

  function updateFooterBanner(value: string) {
    setContent((current) => ({
      ...current,
      footer: {
        ...current.footer,
        bannerText: value,
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
      <div className={sectionCardClass}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-400">CMS</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Landing page editor</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Edit the live landing-page copy and the monthly reading schedule from one place. Changes are saved into
              the project content file, so they flow directly into the public site.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />
              View public site
            </Link>
            <button
              type="button"
              onClick={onReset}
              disabled={!hasUnsavedChanges || isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw className="h-4 w-4" />
              Reset draft
            </button>
            <button
              type="button"
              onClick={() => void onSave()}
              disabled={!hasUnsavedChanges || isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.9fr)]">
        <div className="space-y-6">
          <article className={sectionCardClass}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                <FilePenLine className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Hero and community</h2>
                <p className="text-sm text-slate-500">The lead message visitors see before they browse the books.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className={labelClass}>Hero title</span>
                <input
                  value={content.hero.title}
                  onChange={(event) => updateHero('title', event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>Hero description</span>
                <textarea
                  value={content.hero.description}
                  onChange={(event) => updateHero('description', event.target.value)}
                  className={`${inputClass} min-h-[140px] resize-y`}
                />
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>Community label</span>
                <input
                  value={content.hero.communityLabel}
                  onChange={(event) => updateHero('communityLabel', event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          </article>

          <article className={sectionCardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Pricing and call to action</h2>
            <p className="mt-1 text-sm text-slate-500">Manage the membership offer and the primary join button.</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className={labelClass}>Monthly amount</span>
                <input
                  value={content.pricing.amount}
                  onChange={(event) => updatePricing('amount', event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>Interval label</span>
                <input
                  value={content.pricing.intervalLabel}
                  onChange={(event) => updatePricing('intervalLabel', event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>CTA label</span>
                <input
                  value={content.pricing.ctaLabel}
                  onChange={(event) => updatePricing('ctaLabel', event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>CTA URL</span>
                <input
                  value={content.pricing.ctaHref}
                  onChange={(event) => updatePricing('ctaHref', event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className={labelClass}>Helper text</span>
                <input
                  value={content.pricing.helperText}
                  onChange={(event) => updatePricing('helperText', event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          </article>

          <article className={sectionCardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Schedule and footer copy</h2>
            <p className="mt-1 text-sm text-slate-500">Control the section labels and the footer highlights.</p>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className={labelClass}>Eyebrow</span>
                  <input
                    value={content.schedule.eyebrow}
                    onChange={(event) => updateSchedule('eyebrow', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2">
                  <span className={labelClass}>Schedule title</span>
                  <input
                    value={content.schedule.title}
                    onChange={(event) => updateSchedule('title', event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className={labelClass}>Schedule description</span>
                <textarea
                  value={content.schedule.description}
                  onChange={(event) => updateSchedule('description', event.target.value)}
                  className={`${inputClass} min-h-[100px] resize-y`}
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className={labelClass}>Gallery title</span>
                  <input
                    value={content.schedule.galleryTitle}
                    onChange={(event) => updateSchedule('galleryTitle', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2">
                  <span className={labelClass}>Gallery description</span>
                  <input
                    value={content.schedule.galleryDescription}
                    onChange={(event) => updateSchedule('galleryDescription', event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className={labelClass}>Footer banner</span>
                <input
                  value={content.footer.bannerText}
                  onChange={(event) => updateFooterBanner(event.target.value)}
                  className={inputClass}
                />
              </label>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={labelClass}>Highlight chips</span>
                  <button
                    type="button"
                    onClick={addHighlightItem}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add highlight
                  </button>
                </div>

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
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove highlight ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className={sectionCardClass}>
            <h2 className="text-xl font-semibold text-slate-900">Live preview snapshot</h2>
            <p className="mt-1 text-sm text-slate-500">A quick read on what will appear on the public page.</p>

            <div className="mt-6 rounded-[28px] bg-[#0e1f3e] p-6 text-[#f7e0e0] shadow-inner">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f0a3a3]">
                {content.schedule.eyebrow}
              </p>
              <h3 className="mt-3 text-3xl font-black tracking-tight">{content.hero.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#f7e0e0]/80">{content.hero.description}</p>

              <div className="mt-6 inline-flex items-end gap-2 rounded-2xl bg-white/10 px-5 py-4">
                <span className="text-3xl font-black">${content.pricing.amount}</span>
                <span className="pb-1 text-sm font-semibold text-[#f7e0e0]/80">{content.pricing.intervalLabel}</span>
              </div>

              <div className="mt-6 inline-flex rounded-full bg-[#ca3433] px-5 py-3 text-sm font-bold text-white">
                {content.pricing.ctaLabel}
              </div>
            </div>
          </article>

          <article className={sectionCardClass}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Books manager</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Edit titles, schedule details, and cover selections like a compact WordPress collection editor.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moveSelectedBook(-1)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                  Move up
                </button>
                <button
                  type="button"
                  onClick={() => moveSelectedBook(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                  Move down
                </button>
                <button
                  type="button"
                  onClick={addBook}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add book
                </button>
                <button
                  type="button"
                  onClick={removeSelectedBook}
                  disabled={content.books.length <= 1}
                  className="inline-flex items-center gap-2 rounded-full border border-red-100 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="space-y-2">
                {content.books.map((book, index) => (
                  <button
                    key={`${book.month}-${book.title}-${index}`}
                    type="button"
                    onClick={() => setSelectedBookIndex(index)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selectedBookIndex === index
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">{book.month}</p>
                    <p className="mt-2 font-semibold">{book.title}</p>
                  </button>
                ))}
              </div>

              {selectedBook ? (
                <div className="space-y-4">
                  <label className="grid gap-2">
                    <span className={labelClass}>Month label</span>
                    <input
                      value={selectedBook.month}
                      onChange={(event) => updateSelectedBook('month', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className={labelClass}>Book title</span>
                    <input
                      value={selectedBook.title}
                      onChange={(event) => updateSelectedBook('title', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className={labelClass}>Author</span>
                    <input
                      value={selectedBook.author}
                      onChange={(event) => updateSelectedBook('author', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className={labelClass}>Meetings</span>
                      <input
                        value={selectedBook.meetings}
                        onChange={(event) => updateSelectedBook('meetings', event.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="grid gap-2">
                      <span className={labelClass}>Time</span>
                      <input
                        value={selectedBook.time}
                        onChange={(event) => updateSelectedBook('time', event.target.value)}
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <label className="grid gap-2">
                    <span className={labelClass}>Cover image</span>
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
