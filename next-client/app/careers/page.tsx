import type { Metadata } from 'next';
import CareersPageClient from '@/components/careers/CareersPageClient';
import { fetchPublishedJobs } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Careers | Novaro Solution',
  description: 'Explore open roles and apply to join Novaro Solution.',
  keywords: ['careers', 'jobs', 'hiring', 'novaro solution'],
  path: '/careers'
});

export default async function CareersPage() {
  const jobs = await fetchPublishedJobs({ revalidate: 120 });
  return <CareersPageClient initialJobs={jobs} />;
}
