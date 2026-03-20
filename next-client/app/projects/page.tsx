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
    <section>
      <h1>Projects</h1>
      <div className="post-list">
        {projects.map((project) => (
          <article className="card" key={project._id}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <Link href={`/projects/${project.slug}`}>View project</Link>
          </article>
        ))}
      </div>
      {!projects.length ? <p className="mt-4 text-slate-400">No projects available yet.</p> : null}
    </section>
  );
}
