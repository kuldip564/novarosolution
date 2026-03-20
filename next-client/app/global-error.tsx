'use client';

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="container main">
          <section className="card" role="alert" aria-live="assertive">
            <h1>Unexpected error</h1>
            <p className="text-slate-300">Something went wrong while loading the application.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}

