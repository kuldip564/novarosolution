import Script from 'next/script';

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string[];
  schema?: Record<string, unknown>;
};

export default function SEO({
  canonical = '',
  schema
}: SEOProps) {
  return (
    <>
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
