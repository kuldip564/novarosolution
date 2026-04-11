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
      title: 'Careers | Novaro Solution',
      description: 'Explore open roles at Novaro Solution.',
      path: `/careers/${jobId}`
    });
  }
  return buildMetadata({
    title: `${job.title} | Careers`,
    description: job.description.slice(0, 160),
    path: `/careers/${jobId}`
  });
}

export default async function CareerJobPage({ params }: PageProps) {
  const { jobId } = await params;
  const job = await fetchPublishedJobById(jobId, { revalidate: 60 });
  if (!job) notFound();
  return <JobDetailClient job={job} />;
}
