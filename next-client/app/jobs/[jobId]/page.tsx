import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobDetailClient from '@/components/careers/JobDetailClient';
import { fetchPublishedJobById } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

type PageProps = {
  params: Promise<{ jobId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = await fetchPublishedJobById(jobId, { revalidate: 60 });
  if (!job) {
    return buildMetadata({
      title: 'Jobs | Novaro Solution',
      description: 'Explore open roles at Novaro Solution.',
      path: `/jobs/${jobId}`
    });
  }
  return buildMetadata({
    title: `${job.title} | Jobs`,
    description: job.description.slice(0, 160),
    path: `/jobs/${jobId}`
  });
}

export default async function JobDetailPage({ params }: PageProps) {
  const { jobId } = await params;
  const job = await fetchPublishedJobById(jobId, { revalidate: 60 });
  if (!job) notFound();
  return <JobDetailClient job={job} />;
}
