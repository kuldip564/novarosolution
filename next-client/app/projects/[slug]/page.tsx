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
    <>
      <SEO
        title={`${project.title} | Project`}
        description={project.description}
        canonical={canonical}
        schema={schema}
      />
      <div className="app-page-shell space-y-6">
        <header className="premium-page-hero space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Case study</p>
          <h1 className="section-title text-3xl font-extrabold md:text-5xl">{project.title}</h1>
          <p className="max-w-3xl text-slate-300">{project.description}</p>
        </header>
        <article className="page-content-card overflow-hidden !p-0">
          <div className="overflow-hidden rounded-[inherit]">
            <Image
              src={
                project.imageUrl ||
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200'
              }
              alt={`${project.title} preview`}
              width={900}
              height={520}
              className="h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              priority
            />
          </div>
        </article>
      </div>
    </>
  );
}
