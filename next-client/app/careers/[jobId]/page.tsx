import { permanentRedirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ jobId: string }>;
};

export default async function CareersJobLegacyRedirect({ params }: PageProps) {
  const { jobId } = await params;
  permanentRedirect(`/jobs/${jobId}`);
}
