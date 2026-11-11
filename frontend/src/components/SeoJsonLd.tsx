import { globalSiteJsonLd } from "@/lib/structured-data";
import { jsonLdString } from "@/lib/json-ld";

export function SeoJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(globalSiteJsonLd()) }}
    />
  );
}
