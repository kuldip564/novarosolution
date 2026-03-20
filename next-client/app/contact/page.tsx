import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact | Novaro Solution',
  description: 'Contact Novaro Solution to discuss your UI/UX, web, or mobile product roadmap.',
  keywords: ['contact novaro', 'project consultation', 'web development contact'],
  path: '/contact'
});

export default function ContactPage() {
  return (
    <section className="card space-y-4">
      <h1 className="text-3xl font-extrabold md:text-5xl">Contact</h1>
      <p className="text-slate-300">
        Share your project requirements and timeline. We will respond with a clear plan and next steps.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link className="btn inline-block" href="/#contact-form">
          Open contact form
        </Link>
        <Link className="btn inline-block" href="/services">
          View services
        </Link>
      </div>
    </section>
  );
}

