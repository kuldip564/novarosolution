import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="app-page-shell flex min-h-[45vh] flex-col items-center justify-center py-16">
      <section className="premium-page-hero max-w-md space-y-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">404</p>
        <h1 className="section-title text-2xl font-extrabold md:text-4xl">Page not found</h1>
        <p className="text-slate-400">The page you are looking for does not exist or was moved.</p>
        <Link className="btn inline-flex justify-center" href="/">
          Back to home
        </Link>
      </section>
    </div>
  );
}
