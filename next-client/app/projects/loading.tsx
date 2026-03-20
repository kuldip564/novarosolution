export default function ProjectsLoading() {
  return (
    <section>
      <div className="h-8 w-40 rounded bg-white/10" />
      <div className="post-list mt-5">
        {[1, 2, 3, 4].map((item) => (
          <article key={item} className="card animate-pulse">
            <div className="h-5 w-2/3 rounded bg-white/10" />
            <div className="mt-3 h-4 w-full rounded bg-white/10" />
            <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
          </article>
        ))}
      </div>
    </section>
  );
}
