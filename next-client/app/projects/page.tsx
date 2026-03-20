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
    <section className="space-y-5">
      <h1 className="text-3xl font-extrabold md:text-5xl">Projects</h1>
      <p className="max-w-3xl text-slate-300">
        Real product work focused on speed, usability, and measurable growth.
      </p>
      <div className="post-list">
        {projects.map((project) => (
          <article className="card group" key={project._id}>
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="mt-2 text-slate-300">{project.description}</p>
            <Link
              className="mt-4 inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
              href={`/projects/${project.slug}`}
            >
              View project
            </Link>
          </article>
        ))}
      </div>
      {!projects.length ? <p className="mt-4 text-slate-400">No projects available yet.</p> : null}
    </section>
  );
}
