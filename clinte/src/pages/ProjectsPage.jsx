import { Link } from 'react-router-dom';
import HomeLayout from '../assets/componet/HomeLayout';
import CTA from '../components/CTA';
import LoadingState from '../components/LoadingState';
import useSiteContent from '../hooks/useSiteContent';
import usePageReveal from '../hooks/usePageReveal';

const fallbackProjects = [
  {
    name: 'SaaS Analytics Platform',
    category: 'Web App',
    client: 'FlowMetrics',
    year: '2025',
    status: 'Live',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    summary:
      'Built a full-stack analytics platform with dashboard, auth, and subscriptions for a growing SaaS startup.',
    challenge: 'The client needed scalable reporting with high performance for large datasets.',
    solution: 'Built modular dashboards, optimized APIs, and a subscription-ready architecture.',
    results: ['40% faster reporting', '2x user engagement', 'Production-ready architecture'],
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    timeline: '12 weeks',
    projectLink: 'https://example.com/case-study-analytics',
  },
  {
    name: 'E-Commerce Mobile Experience',
    category: 'Mobile + API',
    client: 'UrbanCart',
    year: '2024',
    status: 'Live',
    image:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80',
    summary:
      'Designed and developed a premium shopping app experience with robust backend APIs and admin controls.',
    challenge: 'Low mobile conversion and inconsistent experience across devices.',
    solution: 'Delivered a polished mobile flow with faster checkout and admin visibility.',
    results: ['30% higher conversion', 'Improved retention', 'Smooth checkout flow'],
    tech: ['React Native', 'Express', 'MongoDB'],
    timeline: '10 weeks',
    projectLink: 'https://example.com/case-study-commerce',
  },
  {
    name: 'Enterprise Admin Suite',
    category: 'Admin Dashboard',
    client: 'OpsCloud',
    year: '2026',
    status: 'Ongoing',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
    summary:
      'Delivered a modular admin portal for team operations, reporting, and workflow automations.',
    challenge: 'Operations teams used scattered tools with slow reporting.',
    solution: 'Unified workflows into one modular suite with role-based access and live insights.',
    results: ['Reduced manual tasks', 'Centralized operations', 'Faster decision making'],
    tech: ['React', 'Node.js', 'JWT Auth'],
    timeline: '14 weeks',
    projectLink: 'https://example.com/case-study-admin-suite',
  },
];

const ProjectsPage = () => {
  const { data, loading, error } = useSiteContent();
  const pageRef = usePageReveal();
  const pageContent = data?.projectsPage;
  const projects = Array.isArray(pageContent?.items) && pageContent.items.length
    ? pageContent.items
    : fallbackProjects;

  if (loading) {
    return (
      <HomeLayout>
        <LoadingState screen label="Loading projects..." />
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen px-4 py-16 text-white md:py-20">
        {error && (
          <div className="mx-auto mb-4 max-w-6xl text-sm text-red-400">
            {error}. Showing default content.
          </div>
        )}

        <section className="js-reveal page-hero-shell mx-auto max-w-6xl">
          <p className="page-hero-eyebrow text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {pageContent?.eyebrow || 'Our Projects'}
          </p>
          <h1 className="page-hero-title mt-4 text-3xl font-bold text-slate-50 md:text-5xl">
            {pageContent?.title || 'Projects we designed, built, and scaled'}
          </h1>
          <p className="page-hero-description mt-4 max-w-3xl text-sm text-slate-300 md:text-base">
            {pageContent?.description ||
              'Explore selected client projects delivered by NovaRo Solution across product design, engineering, and growth execution.'}
          </p>
        </section>

        <section className="js-reveal projects-grid mx-auto mt-8 grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={`${project.name || 'project'}-${index}`}
              className="premium-card projects-card rounded-3xl p-6"
            >
              <Link
                to={`/projects/${index}`}
                className="projects-image-wrap mb-4 block overflow-hidden rounded-2xl border border-white/10"
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.name || 'Project image'}
                    className="projects-image h-44 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="projects-image h-44 w-full bg-linear-to-br from-slate-800 to-slate-700" />
                )}
              </Link>
              <p className="projects-card-category text-xs font-semibold uppercase tracking-[0.16em] text-pink-300">
                {project.category || 'Project'}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.client ? (
                  <span className="projects-meta-chip rounded-full border border-white/12 bg-white/6 px-2.5 py-1 text-[11px] font-medium text-slate-200">
                    Client: {project.client}
                  </span>
                ) : null}
                {project.year ? (
                  <span className="projects-meta-chip rounded-full border border-white/12 bg-white/6 px-2.5 py-1 text-[11px] font-medium text-slate-200">
                    {project.year}
                  </span>
                ) : null}
                {project.status ? (
                  <span className="projects-meta-chip rounded-full border border-white/12 bg-white/6 px-2.5 py-1 text-[11px] font-medium text-slate-200">
                    {project.status}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 text-xl font-semibold text-slate-100">
                <Link to={`/projects/${index}`} className="projects-details-link">
                  {project.name || 'Untitled Project'}
                </Link>
              </h2>
              <p className="projects-card-summary mt-3 text-sm leading-relaxed text-slate-300">
                {project.summary || 'Project details will be updated by admin.'}
              </p>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Results</p>
                <ul className="space-y-1 text-sm text-slate-200">
                  {(Array.isArray(project.results) ? project.results : []).slice(0, 3).map((item) => (
                    <li key={item} className="projects-card-result">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(Array.isArray(project.tech) ? project.tech : []).map((stack) => (
                  <span
                    key={stack}
                    className="projects-tech-chip rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-slate-200"
                  >
                    {stack}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                {project.timeline ? (
                  <p className="text-xs font-semibold text-amber-300">Timeline: {project.timeline}</p>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/projects/${index}`}
                    className="projects-view-link inline-flex items-center rounded-lg border border-white/15 bg-white/6 px-3 py-1.5 text-xs font-semibold text-slate-100"
                  >
                    View Details
                  </Link>
                  {project.projectLink ? (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noreferrer"
                      className="projects-view-link inline-flex items-center rounded-lg border border-white/15 bg-white/6 px-3 py-1.5 text-xs font-semibold text-slate-100"
                    >
                      Open Link
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </section>

        <div className="js-reveal">
          <CTA data={data?.cta} />
        </div>
      </main>
    </HomeLayout>
  );
};

export default ProjectsPage;
