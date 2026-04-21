'use client';

import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, Images, Trash2, Upload, X } from 'lucide-react';

import { bookImageMap, bookImageOptions } from '@/lib/book-assets';

type StaticMediaItem = {
  kind: 'static';
  key: string;
  label: string;
  src: StaticImageData;
  type: string;
};

type UploadMediaItem = {
  kind: 'upload';
  filename: string;
  url: string;
  category?: 'reference' | 'general';
};

type MediaItem = StaticMediaItem | UploadMediaItem;

// Static assets from book-assets
const staticMedia: StaticMediaItem[] = [
  ...bookImageOptions.map((o) => ({
    kind: 'static' as const,
    key: o.value,
    label: o.label,
    src: bookImageMap[o.value as keyof typeof bookImageMap],
    type: 'Book Cover',
  })),
  {
    kind: 'static' as const,
    key: 'site-bg',
    label: 'Site Background',
    src: bookImageMap['site-bg'],
    type: 'Background',
  },
];

export function MediaPanel() {
  const [uploads, setUploads] = useState<Array<{ filename: string; url: string; category?: 'reference' | 'general' }>>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'static' | 'uploads' | 'reference'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<'reference' | 'general'>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load uploaded files on mount
  useEffect(() => {
    void fetchUploads();
  }, []);

  async function fetchUploads() {
    try {
      const res = await fetch('/api/admin/media');
      const data = (await res.json()) as { files: Array<{ filename: string; category?: 'reference' | 'general' }> };
      setUploads(data.files.map((f) => ({ 
        filename: typeof f === 'string' ? f : f.filename, 
        url: `/uploads/${typeof f === 'string' ? f : f.filename}`,
        category: typeof f === 'string' ? 'general' : f.category || 'general'
      })));
    } catch {
      // silently ignore
    }
  }

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploading(true);

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append('file', file);
      form.append('category', uploadCategory);
      try {
        const res = await fetch('/api/admin/media', { method: 'POST', body: form });
        const data = (await res.json()) as { filename?: string; url?: string; error?: string };
        if (!res.ok || data.error) {
          setUploadError(data.error ?? 'Upload failed.');
        }
      } catch {
        setUploadError('Upload failed.');
      }
    }

    setIsUploading(false);
    await fetchUploads();
  }, [uploadCategory]);

  async function handleDelete(filename: string) {
    try {
      await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
      setUploads((prev) => prev.filter((u) => u.filename !== filename));
      if (selected === filename) setSelected(null);
    } catch {
      // silently ignore
    } finally {
      setDeleteConfirm(null);
    }
  }

  function copyText(text: string) {
    void navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1800);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    void handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const allItems: MediaItem[] = [
    ...staticMedia,
    ...uploads.map((u) => ({ kind: 'upload' as const, ...u })),
  ];

  const filtered =
    filter === 'all' ? allItems :
    filter === 'static' ? allItems.filter((m) => m.kind === 'static') :
    filter === 'uploads' ? allItems.filter((m) => m.kind === 'upload') :
    filter === 'reference' ? allItems.filter((m) => m.kind === 'upload' && (m as UploadMediaItem).category === 'reference') :
    allItems;

  const selectedStatic: StaticMediaItem | null = selected
    ? (staticMedia.find((m) => m.key === selected) ?? null)
    : null;
  const selectedUpload: UploadMediaItem | null = selected
    ? (uploads.find((u) => u.filename === selected) ? { kind: 'upload', ...uploads.find((u) => u.filename === selected)! } : null)
    : null;

  const counts = {
    all: allItems.length,
    static: staticMedia.length,
    uploads: uploads.length,
    reference: uploads.filter(u => u.category === 'reference').length,
  };

  return (
    <section className="space-y-6">

      {/* Header */}
      <div className="sticky top-0 z-30 -mx-1 rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--color-accent)]">CMS</p>
            <h1 className="mt-2 text-3xl font-black text-[var(--color-ink)]">Media Library</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {counts.all} assets &mdash; {counts.static} built-in, {counts.uploads} uploaded ({counts.reference} reference).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Upload category selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Upload as:</label>
              <select 
                value={uploadCategory} 
                onChange={(e) => setUploadCategory(e.target.value as 'reference' | 'general')}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              >
                <option value="general">General Media</option>
                <option value="reference">Reference Screenshot</option>
              </select>
            </div>
            
            {/* Filter tabs */}
            <div className="flex gap-1.5">
              {(['all', 'static', 'uploads', 'reference'] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition ${
                    filter === f
                      ? 'bg-[var(--color-ink)] text-white shadow-sm'
                      : 'border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}>
                  {f === 'all' ? `All (${counts.all})` : 
                   f === 'static' ? `Built-in (${counts.static})` : 
                   f === 'uploads' ? `Uploads (${counts.uploads})` :
                   `Reference (${counts.reference})`}
                </button>
              ))}
            </div>
            {/* Upload button */}
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-[var(--color-accent-hover)] hover:shadow-lg disabled:opacity-60">
              <Upload className="h-3.5 w-3.5" />
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => void handleFiles(e.target.files)} />
          </div>
        </div>
        {uploadError && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            <span className="flex-1">{uploadError}</span>
            <button type="button" onClick={() => setUploadError(null)}><X className="h-4 w-4" /></button>
          </div>
        )}
      </div>

      {/* Drop zone + grid + detail */}
      <div className="flex gap-6">
        <div className="min-w-0 flex-1 space-y-4">

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer items-center justify-center gap-3 rounded-[20px] border-2 border-dashed px-6 py-5 transition ${
              isDragging
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Upload className={`h-5 w-5 ${isDragging ? 'text-[var(--color-accent)]' : 'text-slate-400'}`} />
            <div className="text-center">
              <p className="text-sm font-bold text-slate-500">
                {isDragging ? 'Drop to upload' : 'Drag & drop images here, or click to browse'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                JPEG, PNG, WebP, GIF &mdash; max 5 MB &mdash; Upload as: <span className="font-semibold">{uploadCategory === 'reference' ? 'Reference Screenshot' : 'General Media'}</span>
              </p>
            </div>
          </div>

          {/* Media grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/50 py-20">
              <Images className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-400">No uploads yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 xl:grid-cols-5">
              {filtered.map((item) => {
                const id = item.kind === 'static' ? item.key : item.filename;
                const isSelected = selected === id;
                const isUpload = item.kind === 'upload';

                return (
                  <div key={id} className="group relative">
                    <button type="button" onClick={() => setSelected(isSelected ? null : id)}
                      className={`relative w-full overflow-hidden rounded-[20px] border-2 bg-slate-50 transition-all ${
                        isSelected
                          ? 'border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/20'
                          : 'border-transparent hover:border-slate-200 hover:shadow-md'
                      }`}>
                      <div className="relative aspect-[3/4] w-full">
                        <Image
                          src={isUpload ? item.url : (item as StaticMediaItem).src}
                          alt={isUpload ? item.filename : (item as StaticMediaItem).label}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute right-2 top-2 rounded-full bg-[var(--color-accent)] p-1 shadow">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className="p-3 text-left">
                        <p className="line-clamp-2 text-xs font-bold leading-tight text-slate-700">
                          {isUpload ? item.filename : (item as StaticMediaItem).label}
                        </p>
                        <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                          isUpload 
                            ? (item as UploadMediaItem).category === 'reference'
                              ? 'bg-purple-50 text-purple-500'
                              : 'bg-blue-50 text-blue-500'
                            : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                        }`}>
                          {isUpload 
                            ? (item as UploadMediaItem).category === 'reference' 
                              ? 'Reference' 
                              : 'Uploaded'
                            : (item as StaticMediaItem).type}
                        </span>
                      </div>
                    </button>

                    {/* Delete button — uploads only */}
                    {isUpload && (
                      <button type="button"
                        onClick={() => setDeleteConfirm(item.filename)}
                        className="absolute right-2 top-2 hidden rounded-full border border-red-100 bg-white p-1.5 text-red-500 shadow-sm transition hover:bg-red-50 group-hover:flex"
                        title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail sidebar */}
        {(selectedStatic ?? selectedUpload) ? (
          <div className="w-[280px] shrink-0">
            <div className="sticky top-[160px] overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Details</p>
                <button type="button" onClick={() => setSelected(null)}
                  className="rounded-full border border-slate-100 p-1.5 text-slate-400 transition hover:border-slate-200 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="relative bg-slate-50" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={selectedStatic ? selectedStatic.src : `${selectedUpload!.url}`}
                  alt={selectedStatic ? selectedStatic.label : selectedUpload!.filename}
                  fill
                  className="object-contain p-6"
                  sizes="280px"
                  priority
                />
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Name</p>
                  <p className="mt-1 text-sm font-bold text-slate-800 break-all">
                    {selectedStatic ? selectedStatic.label : selectedUpload!.filename}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${
                    selectedUpload 
                      ? selectedUpload.category === 'reference'
                        ? 'bg-purple-50 text-purple-500'
                        : 'bg-blue-50 text-blue-500'
                      : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                  }`}>
                    {selectedUpload 
                      ? selectedUpload.category === 'reference' 
                        ? 'Reference Screenshot' 
                        : 'Uploaded Media'
                      : selectedStatic!.type}
                  </span>
                </div>

                {/* Copy key / URL */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {selectedUpload ? 'URL' : 'Image Key'}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                    <code className="min-w-0 flex-1 truncate text-[11px] text-slate-600">
                      {selectedUpload ? selectedUpload.url : selectedStatic!.key}
                    </code>
                    <button type="button"
                      onClick={() => copyText(selectedUpload ? selectedUpload.url : selectedStatic!.key)}
                      className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                      title="Copy">
                      {copied === (selectedUpload ? selectedUpload.url : selectedStatic?.key)
                        ? <Check className="h-3.5 w-3.5 text-green-500" />
                        : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Delete button for uploads */}
                {selectedUpload && (
                  <button type="button"
                    onClick={() => setDeleteConfirm(selectedUpload.filename)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-500 transition hover:bg-red-100">
                    <Trash2 className="h-4 w-4" /> Delete Image
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden w-[280px] shrink-0 xl:flex items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/50">
            <div className="p-8 text-center">
              <Images className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-xs font-bold text-slate-400">Click any image to see details</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="mt-4 text-lg font-black text-[var(--color-ink)]">Delete image?</h3>
              <p className="mt-2 text-sm font-medium text-slate-500 break-all">
                <span className="font-bold text-slate-700">{deleteConfirm}</span> will be permanently removed.
              </p>
            </div>
            <div className="flex gap-3 border-t border-slate-100 px-8 py-5">
              <button type="button" onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-full border border-slate-200 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={() => void handleDelete(deleteConfirm)}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
