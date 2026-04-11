export default function Stats() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <article className="page-content-card space-y-2">
        <h3 className="text-lg font-semibold text-slate-100">SSR + SSG</h3>
        <p className="text-sm text-slate-400">Search engines can read content directly from HTML source.</p>
      </article>
      <article className="page-content-card space-y-2">
        <h3 className="text-lg font-semibold text-slate-100">Core Web Vitals</h3>
        <p className="text-sm text-slate-400">Image optimization, font loading, and layout stability are built-in.</p>
      </article>
      <article className="page-content-card space-y-2">
        <h3 className="text-lg font-semibold text-slate-100">Scalable SEO</h3>
        <p className="text-sm text-slate-400">Metadata, canonical URLs, robots, sitemap, and JSON-LD are automated.</p>
      </article>
    </section>
  );
}
