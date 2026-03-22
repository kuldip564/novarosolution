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
        <script
          id={`jsonld-${canonical}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
    </>
  );
}
