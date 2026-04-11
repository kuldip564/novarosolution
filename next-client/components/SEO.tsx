type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string[];
  /** Single JSON-LD object or an array of nodes (wrapped with @context + @graph). */
  schema?: Record<string, unknown> | Record<string, unknown>[];
};

function serializeJsonLd(schema: Record<string, unknown> | Record<string, unknown>[]): Record<string, unknown> {
  if (Array.isArray(schema)) {
    return {
      '@context': 'https://schema.org',
      '@graph': schema
    };
  }
  return schema;
}

export default function SEO({ canonical = '', schema }: SEOProps) {
  const id = canonical ? canonical.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 48) : 'root';
  return (
    <>
      {schema ? (
        <script
          id={`jsonld-${id}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serializeJsonLd(schema)) }}
        />
      ) : null}
    </>
  );
}
