'use client';

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container main flex min-h-[50vh] flex-col items-center justify-center py-16">
          <section className="premium-page-hero max-w-md space-y-4 text-center" role="alert" aria-live="assertive">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-300/90">Fatal</p>
            <h1 className="text-2xl font-extrabold text-slate-100">Unexpected error</h1>
            <p className="text-slate-400">Something went wrong while loading the application.</p>
            <button type="button" onClick={reset} className="btn mt-2 inline-flex justify-center">
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}

