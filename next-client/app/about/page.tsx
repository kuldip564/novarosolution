import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { fetchSiteContent } from '@/lib/api';
import AboutStoryExperience from '@/components/about/AboutStoryExperience';
import FAQSection from '@/components/shared/FAQSection';

export const metadata: Metadata = buildMetadata({
  title: 'About | Novaro Solution',
  description:
    'Learn about Novaro Solution and how we build UI/UX, web, and mobile products with a modern engineering process.',
  keywords: ['about novaro solution', 'product engineering team', 'ui ux web mobile experts'],
  path: '/about'
});

export default async function AboutPage() {
  const content = await fetchSiteContent({ revalidate: 180 }).catch(() => ({} as any));
  const about = (content as any)?.aboutPage || {};
  const team = (content as any)?.teamSection || {};
  const serviceItems = Array.isArray((content as any)?.services?.items) ? (content as any).services.items : [];
  const statsItems = Array.isArray((content as any)?.stats?.items) ? (content as any).stats.items : [];
  const fallbackOwners = [
    {
      name: 'kuldip chaudhary',
      role: 'Founder & Owner',
      bio: 'Leads product strategy and delivery excellence across all client projects.',
      email: 'chaudharykuldip453@gmail.com',
      experience: '',
      avatar: ''
    },
    {
      name: 'mehul chaudhary',
      role: 'Founder & Owner',
      bio: 'Leads operations, delivery coordination, and long-term growth for NovaRo Solution engagements.',
      email: 'mehulchaudhary@gmail.com',
      experience: '',
      avatar: ''
    }
  ];
  const owners =
    Array.isArray(team?.ownerList) && team.ownerList.length
      ? team.ownerList
      : team?.owner
        ? [team.owner, ...fallbackOwners.slice(1)]
        : fallbackOwners;
  const workPoints =
    Array.isArray(about?.workPoints) && about.workPoints.length
      ? about.workPoints
      : [
          'Product strategy and discovery workshops',
          'Design sprints and rapid prototyping',
          'Full-stack implementation with modern tooling',
          'Long-term support and growth iterations'
        ];
  const faqItems = [
    {
      question: 'What services does Novaro Solution provide?',
      answer:
        'We provide UI/UX design, website development, mobile app development, product modernization, performance optimization, and SEO-ready implementation for startups and growing businesses.'
    },
    {
      question: 'How do you handle project delivery and communication?',
      answer:
        'We work in milestone-based cycles with regular updates, shared progress reviews, and clear deliverables. Clients receive transparent timelines, scope visibility, and structured communication from kickoff to launch.'
    },
    {
      question: 'Do you support long-term maintenance?',
      answer:
        'Yes. We provide post-launch support, iterative enhancements, bug fixes, and performance/SEO monitoring to keep digital products stable and growth-ready.'
    },
    {
      question: 'Do you work with international clients?',
      answer:
        'Yes. We collaborate remotely with clients across regions and align project workflows for timezone-friendly communication and delivery cadence.'
    }
  ];
  return (
    <main className="app-page-shell space-y-6">
      <AboutStoryExperience
        about={about}
        team={team}
        statsItems={statsItems}
        services={serviceItems}
        workPoints={workPoints}
        owners={owners}
      />
      <section className="page-content-card space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Company</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-100">Business Overview</h2>
        </div>
        <div className="space-y-3 text-sm leading-relaxed">
          <p className="text-slate-300">
            Novaro Solution is a product-focused digital engineering studio. We help businesses move from idea to
            launch with practical design and modern development standards. Our engagement model is built around
            reliability, transparent communication, and measurable outcomes.
          </p>
          <p className="text-slate-300">
            Our core team works across product strategy, frontend/backend implementation, mobile delivery, and SEO-aware
            performance optimization. We prioritize maintainable code, accessible interfaces, and scalable architecture
            so projects remain stable as business needs evolve.
          </p>
          <p className="text-slate-300">
            We operate through structured planning, sprint execution, and milestone sign-off. This process helps clients
            maintain clarity on timeline, scope, and quality expectations from discovery through post-launch support.
          </p>
        </div>
      </section>
      <FAQSection
        items={faqItems}
        intro="Answers to common questions about our workflow, delivery model, and long-term support."
      />
    </main>
  );
}

