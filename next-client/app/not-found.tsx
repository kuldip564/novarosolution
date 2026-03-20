import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="card">
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Return to home</Link>
    </section>
  );
}
