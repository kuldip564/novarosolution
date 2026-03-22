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
    <main className="app-page-shell space-y-4">
    <section className="page-hero-shell space-y-4">
      <h1 className="section-title text-3xl font-extrabold md:text-5xl">Login</h1>
      <p className="text-slate-300">Sign in to continue.</p>
      <form className="page-content-card space-y-3" onSubmit={onSubmit}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          autoComplete="email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-slate-300">
        New user?{' '}
        <Link className="text-pink-300" href="/register">
          Create account
        </Link>
      </p>
    </section>
    </main>
  );
}

