'use client';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="app-page-shell flex min-h-[40vh] flex-col items-center justify-center py-12">
      <section className="premium-page-hero max-w-lg space-y-4 text-center" role="alert" aria-live="assertive">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-300/90">Error</p>
        <h1 className="section-title text-2xl font-extrabold md:text-3xl">Something went wrong</h1>
        <p className="text-slate-400">We could not load this view. You can retry or return home from the header.</p>
        <p className="text-xs text-slate-500">{error?.message}</p>
        <button type="button" onClick={reset} className="btn mt-2 inline-flex justify-center">
          Try again
        </button>
      </section>
    </div>
  );
}
