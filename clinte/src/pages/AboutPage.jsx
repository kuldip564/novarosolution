import HomeLayout from '../assets/componet/HomeLayout';
import Stats from '../components/Stats';
import Features from '../components/Features';
import LoadingState from '../components/LoadingState';
import useSiteContent from '../hooks/useSiteContent';
import usePageReveal from '../hooks/usePageReveal';

const AboutPage = () => {
  const { data, loading, error } = useSiteContent();
  const about = data?.aboutPage;
  const team = data?.teamSection;
  const pageRef = usePageReveal();

  const fallbackOwner = {
    name: 'Kuldip Patel',
    role: 'Founder & Owner',
    bio: 'Leads product strategy and delivery excellence across all client projects.',
    email: 'owner@novarosolution.com',
    experience: '10+ years in software delivery',
    avatar: '👨‍💼',
  };
  const owners =
    team?.ownerList?.length && Array.isArray(team.ownerList)
      ? team.ownerList
      : [team?.owner || fallbackOwner];
  const visibleOwners = owners.slice(0, 2);

  if (loading) {
    return (
      <HomeLayout>
        <LoadingState screen label="Loading content..." />
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen text-white px-4 py-16 md:py-20">
        {error && (
          <div className="mx-auto max-w-5xl mb-4 text-sm text-red-400">
            {error}. Showing default content.
          </div>
        )}
        <section className="js-reveal page-hero-shell mx-auto max-w-5xl">
          <p className="page-hero-eyebrow text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {about?.eyebrow || 'About NovaRo Solution'}
          </p>
          <h1 className="page-hero-title mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50">
            {about?.title || 'A product studio for teams that care about craft.'}
          </h1>
          <p className="page-hero-description mt-4 text-sm md:text-base text-slate-300 max-w-3xl">
            {about?.paragraphs?.[0] ||
              'NovaRo Solution partners with modern software companies to design, build, and grow digital products that feel as considered as the tools you already love.'}
          </p>
          <p className="page-hero-description mt-3 text-sm md:text-base text-slate-300 max-w-3xl">
            {about?.paragraphs?.[1] ||
              'We blend strategy, design, and engineering into one integrated team. That means fewer handoffs, tighter feedback loops, and products that reach your customers faster without sacrificing quality.'}
          </p>
        </section>

        <div className="js-reveal">
          <Stats data={data?.stats} />
        </div>

        <section className="js-reveal page-content-card mx-auto max-w-5xl mt-4 md:mt-0">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-50">
            {about?.workTitle || 'How we work with you'}
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-300">
            {about?.workDescription ||
              'Every engagement starts with understanding your roadmap and constraints. We then assemble a cross-functional squad tailored to your needs and operate in close partnership with your internal team.'}
          </p>
          <ul className="mt-5 space-y-3 text-sm md:text-base text-slate-200">
            {(about?.workPoints?.length
              ? about.workPoints
              : [
                  'Product strategy and discovery workshops',
                  'Design sprints and rapid prototyping',
                  'Full-stack implementation with modern tooling',
                  'Long-term support and growth iterations',
                ]
            ).map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
        </section>

        <section className="js-reveal about-owner-section mx-auto mt-10 max-w-5xl">
          <div className="about-owner-header text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
              {team?.eyebrow || 'Our Team'}
            </p>
            <h2 className="section-title mt-3 text-2xl font-bold md:text-4xl">
              {team?.title || 'Owner behind NovaRo Solution'}
            </h2>
            <p className="about-owner-description mx-auto mt-3 max-w-3xl text-sm text-slate-300">
              {team?.description ||
                'Leadership focused on product quality, delivery speed, and long-term client success.'}
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {visibleOwners.map((item, index) => (
              <article
                key={`${item.name || 'owner'}-${index}`}
                className="premium-card about-owner-card relative overflow-hidden rounded-3xl p-6 md:p-8"
              >
                <div className="about-owner-glow-a pointer-events-none absolute -top-12 -right-10 h-44 w-44 rounded-full bg-linear-to-r from-red-500/18 via-pink-500/18 to-purple-500/18 blur-3xl" />
                <div className="about-owner-glow-b pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-linear-to-r from-blue-500/16 via-violet-500/16 to-pink-500/16 blur-3xl" />

                <p className="about-owner-label relative z-10 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Owner Details
                </p>
                <div className="relative z-10 mt-5 grid gap-5 md:grid-cols-[auto_1fr]">
                  <div className="about-owner-avatar inline-flex h-18 w-18 items-center justify-center rounded-2xl border border-white/12 bg-linear-to-r from-red-500/35 via-pink-500/35 to-purple-500/35 text-4xl shadow-[0_10px_30px_rgba(236,72,153,0.28)]">
                    {item.avatar || '👨‍💼'}
                  </div>
                  <div className="flex-1">
                    <h3 className="about-owner-name text-2xl font-semibold text-slate-100">
                      {item.name || 'Owner'}
                    </h3>
                    <p className="about-owner-role mt-1 text-sm font-medium uppercase tracking-[0.08em] text-pink-300">
                      {item.role || 'Team Owner'}
                    </p>
                    <p className="about-owner-bio mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
                      {item.bio}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                      {item.experience && (
                        <span className="about-owner-chip rounded-full border border-white/12 bg-white/6 px-3 py-1 text-slate-200">
                          {item.experience}
                        </span>
                      )}
                      {item.email && (
                        <span className="about-owner-chip rounded-full border border-white/12 bg-white/6 px-3 py-1 text-slate-200">
                          {item.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="js-reveal">
          <Features data={data?.features} />
        </div>
      </main>
    </HomeLayout>
  );
};

export default AboutPage;

