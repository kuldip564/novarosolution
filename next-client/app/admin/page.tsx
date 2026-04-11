'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, loading, isAuthenticated, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const user = await login({ email, password });
      if (user.role !== 'admin') {
        setError('This account is not admin.');
        return;
      }
      router.replace('/admin/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Admin login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="app-page-shell flex min-h-[50vh] flex-col items-center justify-center px-4 py-12">
      <section className="premium-auth-panel w-full max-w-md space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Restricted</p>
          <h1 className="section-title mt-1 text-2xl font-extrabold md:text-4xl">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Use an administrator account to open the control panel.</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="form-label-premium" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@company.com"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="form-label-premium" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button className="btn w-full justify-center" type="submit" disabled={submitting}>
            {submitting ? 'Checking…' : 'Continue'}
          </button>
        </form>
        {error ? <p className="premium-alert premium-alert--error text-sm">{error}</p> : null}
        <p className="text-center text-sm text-slate-500">
          Standard account?{' '}
          <Link href="/login" className="font-medium text-cyan-300/90 underline-offset-2 hover:underline">
            User login
          </Link>
        </p>
      </section>
    </main>
  );
}
