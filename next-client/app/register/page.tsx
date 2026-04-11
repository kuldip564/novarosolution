'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { register, loading, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
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
      await register({ name, email, password });
      router.replace(redirect);
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="app-page-shell flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
      <section className="premium-auth-panel w-full max-w-md space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Account</p>
        <h1 className="section-title mt-1 text-2xl font-extrabold md:text-4xl">Create account</h1>
        <p className="mt-1 text-sm text-slate-400">One account for jobs, chat, and tools.</p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="form-label-premium" htmlFor="reg-name">
            Name
          </label>
          <input id="reg-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />
        </div>
        <div>
          <label className="form-label-premium" htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>
        <div>
          <label className="form-label-premium" htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
        </div>
        {error ? <p className="premium-alert premium-alert--error text-sm">{error}</p> : null}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Register'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-400">
        Already registered?{' '}
        <Link className="text-cyan-300/90 underline-offset-2 hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </section>
    </main>
  );
}
