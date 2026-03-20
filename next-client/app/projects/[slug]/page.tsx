import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SEO from '@/components/SEO';
import { getProjectBySlug, getProjects } from '@/lib/api';
import { buildCanonical, buildMetadata } from '@/lib/seo';

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getProjects({ revalidate });
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, { revalidate });

  if (!project) {
    return buildMetadata({
      title: 'Project Not Found | Novaro Solution',
      description: 'Requested project page is not available.',
      path: `/projects/${slug}`
    });
  }

  return buildMetadata({
    title: `${project.title} | Project`,
    description: project.description,
    keywords: ['project', 'portfolio', project.slug],
    path: `/projects/${slug}`,
    image:
      project.imageUrl ||
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200'
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, { revalidate });

  if (!project) notFound();

  const canonical = buildCanonical(`/projects/${slug}`);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image:
      project.imageUrl ||
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    url: canonical
  };

  return (
    <article className="card">
      <SEO
        title={`${project.title} | Project`}
        description={project.description}
        canonical={canonical}
        schema={schema}
      />
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <Image
        src={
          project.imageUrl ||
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200'
        }
        alt={`${project.title} preview`}
        width={900}
        height={520}
        priority
      />
    </article>
  );
}
