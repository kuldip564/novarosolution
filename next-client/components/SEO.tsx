import Script from 'next/script';

type SEOProps = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string[];
  schema?: Record<string, unknown>;
};

export default function SEO({
  title,
  description,
  canonical,
  keywords = [],
  schema
}: SEOProps) {
  return (
    <>
      <section className="sr-only" aria-hidden="true">
        <h2>{title}</h2>
        <p>{description}</p>
        <p>{keywords.join(', ')}</p>
        <p>{canonical}</p>
      </section>
      {schema ? (
        <Script
          id={`jsonld-${canonical}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
