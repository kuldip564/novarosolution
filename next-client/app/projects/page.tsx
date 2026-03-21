import Link from 'next/link';
import type { Metadata } from 'next';
import { getProjects } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Projects | Novaro Solution',
  description:
    'Explore UI/UX design, web development, and mobile app development projects delivered by Novaro Solution.',
  keywords: ['ui ux design projects', 'web development portfolio', 'mobile app case studies'],
  path: '/projects'
});

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  try {
    projects = await getProjects({ revalidate });
  } catch {
    projects = [];
  }

  return (
    <main className="app-page-shell space-y-5">
      <section className="page-hero-shell space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Case Studies</p>
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Projects</h1>
        <p className="max-w-3xl text-slate-300">
          Real product work focused on speed, usability, and measurable growth.
        </p>
      </section>
      <div className="post-list">
        {projects.map((project) => (
          <article className="card group" key={project._id}>
            <p className="text-xs uppercase tracking-[0.08em] text-slate-400">
              {project.category || 'Digital Product'} {project.year ? `• ${project.year}` : ''}
            </p>
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="mt-2 text-slate-300">{project.description}</p>
            <Link
              className="btn mt-4 inline-flex px-4 py-2 text-sm"
              href={`/projects/${project.slug}`}
            >
              View project
            </Link>
          </article>
        ))}
      </div>
      {!projects.length ? <p className="mt-4 text-slate-400">No projects available yet.</p> : null}
    </main>
  );
}
