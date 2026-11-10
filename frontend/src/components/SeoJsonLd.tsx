import { globalSiteJsonLd } from "@/lib/structured-data";

export function SeoJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSiteJsonLd()) }}
    />
  );
}
