'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Lock, LogIn, User, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Login failed.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-sm">

        {/* Back to Home Button */}
        <div className="mb-6 flex justify-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative h-16 w-48">
            <Image 
              src="/exceed-logo.png" 
              alt="Exceed Learning Center" 
              fill 
              className="object-contain" 
              priority
            />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Exceed Learning</p>
            <h1 className="mt-1 text-2xl font-black text-[var(--color-ink)]">Admin Login</h1>
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">
          <form onSubmit={(e) => void handleSubmit(e)} className="p-8 space-y-5">

            <label className="grid gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Username</span>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="admin"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </label>

            <label className="grid gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</span>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[var(--color-accent-hover)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Exceed Learning Center &mdash; Admin Panel
        </p>
      </div>
    </main>
  );
}
