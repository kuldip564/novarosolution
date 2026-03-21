'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register({ name, email, password });
      router.replace('/');
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="app-page-shell">
    <section className="page-hero-shell space-y-4">
      <h1 className="section-title text-3xl font-extrabold md:text-5xl">Create Account</h1>
      <p className="text-slate-300">Join Novaro Solution portal.</p>
      <form className="page-content-card space-y-3" onSubmit={onSubmit}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" required />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password (min 6 chars)"
          minLength={6}
          required
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Register'}
        </button>
      </form>
      <p className="text-slate-300">
        Already have an account?{' '}
        <Link className="text-pink-300" href="/login">
          Login
        </Link>
      </p>
    </section>
    </main>
  );
}
