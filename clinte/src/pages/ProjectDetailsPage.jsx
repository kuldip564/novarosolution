import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import HomeLayout from '../assets/componet/HomeLayout';
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

const ProjectDetailsPage = () => {
  const { data, loading, error } = useSiteContent();
  const { projectIndex } = useParams();
  const pageRef = usePageReveal();
  const projects =
    Array.isArray(data?.projectsPage?.items) && data.projectsPage.items.length
      ? data.projectsPage.items
      : fallbackProjects;
  const safeIndex = Number(projectIndex);
  const project = Number.isInteger(safeIndex) ? projects[safeIndex] : null;

  if (loading) {
    return (
      <HomeLayout>
        <LoadingState screen label="Loading project details..." />
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen px-4 py-16 text-white md:py-20">
        <section className="js-reveal mx-auto max-w-6xl">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200 hover:bg-white/10"
          >
            <FaArrowLeft />
            Back to Projects
          </Link>
        </section>

        {!project ? (
          <section className="js-reveal mx-auto mt-6 max-w-6xl">
            <article className="premium-card rounded-3xl p-8">
              <h1 className="text-2xl font-bold text-slate-100">Project not found</h1>
              <p className="mt-3 text-sm text-slate-300">
                This project is not available right now. Please open another project from the projects list.
              </p>
            </article>
          </section>
        ) : (
          <section className="js-reveal mx-auto mt-6 grid max-w-6xl gap-6 lg:grid-cols-[1.25fr,0.75fr]">
            <article className="premium-card projects-card rounded-3xl p-7 md:p-8">
              {project.image ? (
                <div className="projects-image-wrap mb-5 overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={project.image}
                    alt={project.name || 'Project cover'}
                    className="projects-image h-60 w-full object-cover"
                  />
                </div>
              ) : null}
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
              <h1 className="mt-3 text-3xl font-bold text-slate-100 md:text-4xl">
                {project.name || 'Untitled Project'}
              </h1>
              <p className="projects-card-summary mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
                {project.summary || 'No summary available for this project.'}
              </p>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Project Results
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {(Array.isArray(project.results) ? project.results : []).map((item) => (
                    <li key={item} className="projects-card-result rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {project.challenge ? (
                <div className="projects-detail-block mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Challenge</p>
                  <p className="mt-2 text-sm text-slate-200">{project.challenge}</p>
                </div>
              ) : null}

              {project.solution ? (
                <div className="projects-detail-block mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Solution</p>
                  <p className="mt-2 text-sm text-slate-200">{project.solution}</p>
                </div>
              ) : null}
            </article>

            <article className="premium-card projects-side-card rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-slate-100">Project Details</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Timeline</p>
                  <p className="mt-1 text-sm text-slate-200">{project.timeline || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Tech Stack</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(Array.isArray(project.tech) ? project.tech : []).map((stack) => (
                      <span
                        key={stack}
                        className="projects-tech-chip rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-slate-200"
                      >
                        {stack}
                      </span>
                    ))}
                  </div>
                </div>
                {project.projectLink ? (
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noreferrer"
                    className="projects-view-link inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/6 px-3 py-2 text-xs font-semibold text-slate-100"
                  >
                    <FaExternalLinkAlt />
                    Open Project Link
                  </a>
                ) : null}
                {error ? <p className="text-xs text-red-400">{error}</p> : null}
              </div>
            </article>
          </section>
        )}
      </main>
    </HomeLayout>
  );
};

export default ProjectDetailsPage;
