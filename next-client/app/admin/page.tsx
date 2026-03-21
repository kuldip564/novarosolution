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
    <section className="card space-y-4">
      <h1 className="text-3xl font-extrabold md:text-5xl">Admin Login</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Admin email" />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Checking...' : 'Login as Admin'}
        </button>
      </form>
      {error ? <p className="text-red-400">{error}</p> : null}
      <p className="text-sm text-slate-300">
        Need regular user login?{' '}
        <Link href="/login" className="underline">
          Go to Login
        </Link>
      </p>
    </section>
  );
}
