import { globalSiteJsonLd } from "@/lib/structured-data";

export function SeoJsonLd() {
  const schemas = globalSiteJsonLd();

  return (
    <>
      {schemas.map((schema) => (
        <script
          key={schema["@id"] as string}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
