/**
 * Prepares stored article HTML for the article template, with no schema changes:
 *  - gives every <h2> an id and returns a table of contents;
 *  - lifts a final "Sources" (or "References") section out of the body so the template can
 *    render it as a numbered source list and add it to the Article schema;
 *  - keeps links to our own pages in the same tab (the API marks every link target="_blank").
 *
 * Convention for writers: end the article with an H2 called "Sources" followed by a list
 * of links. See docs/content/article-template.md.
 */
export type ArticleHeading = { id: string; text: string };
export type ArticleSource = { href: string; label: string };

export type EnhancedArticle = {
  html: string;
  toc: ArticleHeading[];
  sources: ArticleSource[];
};

const SITE_HOSTS = /^https?:\/\/(www\.)?novarosolution\.com/i;

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "section"
  );
}

export function enhanceArticle(content: string): EnhancedArticle {
  let html = content;
  const sources: ArticleSource[] = [];

  // 1. Sources: the last H2 named Sources/References and everything after it.
  const sourceHeading = /<h2[^>]*>\s*(sources|references)\s*<\/h2>/gi;
  let match: RegExpExecArray | null;
  let last: RegExpExecArray | null = null;
  while ((match = sourceHeading.exec(html))) last = match;
  if (last) {
    const tail = html.slice(last.index + last[0].length);
    if (!/<h2[\s>]/i.test(tail)) {
      for (const link of tail.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
        const href = link[1];
        if (/^https?:\/\//i.test(href)) sources.push({ href, label: stripTags(link[2]) || href });
      }
      if (sources.length) html = html.slice(0, last.index);
    }
  }

  // 2. Internal links stay in the same tab and drop the external-link attributes.
  html = html.replace(/<a\s([^>]*?)href="([^"]+)"([^>]*)>/gi, (tag, before: string, href: string, after: string) => {
    const internal = href.startsWith("/") || SITE_HOSTS.test(href);
    if (!internal) return tag;
    const path = href.replace(SITE_HOSTS, "") || "/";
    const rest = `${before}${after}`.replace(/\s*(target|rel)="[^"]*"/gi, "").trim();
    return `<a ${rest ? `${rest} ` : ""}href="${path}">`;
  });

  // 3. Heading ids and table of contents.
  const toc: ArticleHeading[] = [];
  const used = new Set<string>();
  html = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_tag, attrs: string, inner: string) => {
    const text = stripTags(inner);
    let id = slugify(text);
    for (let n = 2; used.has(id); n += 1) id = `${slugify(text)}-${n}`;
    used.add(id);
    toc.push({ id, text });
    return `<h2${attrs.replace(/\s*id="[^"]*"/i, "")} id="${id}">${inner}</h2>`;
  });

  return { html, toc, sources };
}
