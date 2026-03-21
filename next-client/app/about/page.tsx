import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { fetchSiteContent } from '@/lib/api';

export const metadata: Metadata = buildMetadata({
  title: 'About | Novaro Solution',
  description:
    'Learn about Novaro Solution and how we build UI/UX, web, and mobile products with a modern engineering process.',
  keywords: ['about novaro solution', 'product engineering team', 'ui ux web mobile experts'],
  path: '/about'
});

function normalizeAvatarValue(avatar: unknown) {
  return String(avatar || '').trim();
}

function getInitials(name: unknown) {
  const safe = String(name || '').trim();
  if (!safe) return 'ON';
  const parts = safe.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'ON';
}

function isImageAvatar(avatar: unknown) {
  const value = normalizeAvatarValue(avatar).toLowerCase();
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:image/') ||
    value.startsWith('blob:') ||
    value.startsWith('/')
  );
}

export default async function AboutPage() {
  const content = await fetchSiteContent({ revalidate: 180 }).catch(() => ({} as any));
  const about = (content as any)?.aboutPage || {};
  const team = (content as any)?.teamSection || {};
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
  const visibleOwners = owners.slice(0, 2);

  return (
    <main className="app-page-shell space-y-6">
      <section className="page-hero-shell space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          {about?.eyebrow || 'About NovaRo Solution'}
        </p>
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">
          {about?.title || 'A product studio for teams that care about craft.'}
        </h1>
        <p className="text-slate-300">
          {about?.paragraphs?.[0] ||
            'NovaRo Solution partners with modern software companies to design, build, and grow digital products that feel as considered as the tools you already love.'}
        </p>
        <p className="text-slate-300">
          {about?.paragraphs?.[1] ||
            'We blend strategy, design, and engineering into one integrated team. That means fewer handoffs, tighter feedback loops, and products that reach your customers faster without sacrificing quality.'}
        </p>
      </section>

      <section className="page-content-card space-y-3">
        <h2 className="text-2xl font-semibold">{about?.workTitle || 'How we work with you'}</h2>
        <p className="text-slate-300">
          {about?.workDescription ||
            'Every engagement starts with understanding your roadmap and constraints. We then assemble a cross-functional squad tailored to your needs and operate in close partnership with your internal team.'}
        </p>
        <ul className="space-y-2 text-slate-200">
          {(Array.isArray(about?.workPoints) && about.workPoints.length
            ? about.workPoints
            : [
                'Product strategy and discovery workshops',
                'Design sprints and rapid prototyping',
                'Full-stack implementation with modern tooling',
                'Long-term support and growth iterations'
              ]
          ).map((point: string) => (
            <li key={point}>- {point}</li>
          ))}
        </ul>
      </section>

      <section className="page-content-card space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
          {team?.eyebrow || 'Our Team'}
        </p>
        <h2 className="section-title text-2xl font-bold md:text-4xl">
          {team?.title || 'Owner behind NovaRo Solution'}
        </h2>
        <p className="text-slate-300">
          {team?.description ||
            'Leadership focused on product quality, delivery speed, and long-term client success.'}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {visibleOwners.map((item: any, index: number) => (
            <article key={`${item.name || 'owner'}-${index}`} className="admin-list-card">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Owner Details</p>
              <div className="mt-3 flex items-start gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-sm font-bold flex items-center justify-center">
                  {isImageAvatar(item.avatar) ? (
                    <img src={normalizeAvatarValue(item.avatar)} alt={item.name || 'Owner'} className="h-full w-full object-cover" />
                  ) : (
                    getInitials(item.name)
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{item.name || 'Owner'}</h3>
                  <p className="text-sm text-pink-300 uppercase tracking-[0.08em]">{item.role || 'Team Owner'}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.bio}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {item.experience ? <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">{item.experience}</span> : null}
                    {item.email ? <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">{item.email}</span> : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

