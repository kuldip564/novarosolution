'use client';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="card" role="alert" aria-live="assertive">
      <h1>Something went wrong</h1>
      <p className="text-slate-300">
        We could not load this page right now. Please try again.
      </p>
      <p className="mt-2 text-xs text-slate-400">{error?.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-4 py-2 text-sm font-semibold"
      >
        Retry
      </button>
    </section>
  );
}
