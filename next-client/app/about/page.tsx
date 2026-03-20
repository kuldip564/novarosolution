import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About | Novaro Solution',
  description:
    'Learn about Novaro Solution and how we build UI/UX, web, and mobile products with a modern engineering process.',
  keywords: ['about novaro solution', 'product engineering team', 'ui ux web mobile experts'],
  path: '/about'
});

export default function AboutPage() {
  return (
    <section className="card space-y-4">
      <h1 className="text-3xl font-extrabold md:text-5xl">About</h1>
      <p className="text-slate-300">
        We are a focused digital product team helping startups and growing businesses launch faster.
      </p>
      <p className="text-slate-300">
        Our approach combines UI/UX clarity, scalable web architecture, and reliable delivery.
      </p>
    </section>
  );
}

