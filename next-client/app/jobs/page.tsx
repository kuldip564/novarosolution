import type { Metadata } from 'next';
import CareersPageClient from '@/components/careers/CareersPageClient';
import { fetchPublishedJobs } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: 'Jobs | Novaro Solution',
  description: 'Explore open roles and apply to join Novaro Solution.',
  keywords: ['jobs', 'hiring', 'novaro solution', 'careers'],
  path: '/jobs'
});

export default async function JobsPage() {
  const jobs = await fetchPublishedJobs({ revalidate: 120 });
  return <CareersPageClient initialJobs={jobs} />;
}
