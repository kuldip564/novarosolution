import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Login | Novaro Solution',
  description: 'Sign in to access protected actions and personalized features.',
  keywords: ['novaro login', 'user login'],
  path: '/login'
});

export default function LoginPage() {
  return (
    <section className="card space-y-4">
      <h1 className="text-3xl font-extrabold md:text-5xl">Login</h1>
      <p className="text-slate-300">
        Authentication is managed in the main application experience.
      </p>
      <p className="text-slate-300">
        If you do not have access yet, contact the admin team to create your account.
      </p>
      <Link className="btn inline-block" href="/">
        Back to homepage
      </Link>
    </section>
  );
}

