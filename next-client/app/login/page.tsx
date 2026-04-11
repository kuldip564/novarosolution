'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      router.replace(redirect);
    }
  }, [loading, isAuthenticated, redirect, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login({ email, password });
      router.replace(redirect);
    } catch (err: any) {
      setError(err?.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="app-page-shell flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
      <section className="premium-auth-panel w-full max-w-md space-y-5">
      <div>
        <h1 className="section-title text-2xl font-extrabold md:text-4xl">Sign in</h1>
        <p className="mt-1 text-sm text-slate-400">Use your account to continue.</p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="form-label-premium" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="form-label-premium" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>
        {error ? <p className="premium-alert premium-alert--error text-sm">{error}</p> : null}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-400">
        New here?{' '}
        <Link className="text-cyan-300/90 underline-offset-2 hover:underline" href="/register">
          Create an account
        </Link>
      </p>
    </section>
    </main>
  );
}

