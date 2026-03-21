import type { Metadata } from 'next';
import ContactPageClient from '@/components/contact/ContactPageClient';
import { fetchSiteContent } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact | Novaro Solution',
  description:
    'Contact Novaro Solution for UI/UX design, web development, and mobile app development projects.',
  keywords: ['contact novaro solution', 'project inquiry', 'ui ux web mobile contact'],
  path: '/contact'
});

export default async function ContactPage() {
  const content = await fetchSiteContent({ revalidate: 180 }).catch(() => ({} as any));
  const section = (content as any)?.contactPage || (content as any)?.contactForm || {};

  return (
    <ContactPageClient
      title={section?.title || 'Contact Us'}
      description={section?.description || 'Tell us about your project goals and we will get back to you quickly.'}
    />
  );
}
