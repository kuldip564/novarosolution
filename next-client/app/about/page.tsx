import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { fetchSiteContent } from '@/lib/api';
import AboutStoryExperience from '@/components/about/AboutStoryExperience';

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
  return (
    <AboutStoryExperience
      about={about}
      team={team}
      statsItems={statsItems}
      services={serviceItems}
      workPoints={workPoints}
      owners={owners}
    />
  );
}

