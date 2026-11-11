# Technical SEO audit — November 2026

Checked against a local **production build** (`next build && next start`), crawling as mobile Googlebot from `/` and the sitemap. Nothing here claims a page is indexed; that needs Search Console after deploy. Earlier work this month (titles, Open Graph, schema graph, geo pages, terms) is in `website-audit-2026-11.md`.

## Issues found and fixed in this pass

| Issue (verified) | Effect | Fix |
| --- | --- | --- |
| The root `app/loading.tsx` streamed every page as "skeleton + footer first, real content in a hidden `<div>` at the end of the HTML" | Crawlers that don't run JavaScript (AI answer engines, some Bing passes) saw page content hidden and after the footer; the first heading on every page was the footer's "Services" H2 | Removed the root loading boundary; all public pages are pre-rendered |
| Home (below the hero), `/work` and the contact form were lazy-loaded with `next/dynamic` and a skeleton | Same as above: about 52 KB of home content and all four project write-ups arrived after the footer, hidden | Imported directly; content is now in reading order |
| The root layout set `canonical: "/"` | Any page without its own canonical would point at the homepage | Removed; every page declares its own |
| `/blog`: H1 jumped straight to H3 article titles | Broken heading outline | Added a section H2 ("Latest articles") |
| `/contact`: "Email", "Phone", "Studio", "Business hours" were H4 headings used as labels; H2 jumped to H4 | Headings used for styling | Labels are now plain text; "What happens next" is an H2 |
| 6 of 8 blog posts shared one `og:image` (the same stock cover) | Identical social previews | Posts without their own photo use a branded card with the post title |
| `BlogPosting.image` used relative paths (`/images/…`); `publisher` had no `url` | Google can't use relative image URLs in Article markup | Absolute URLs; publisher `url` and `logo` added |
| `/services` repeated the Organization with a partial address and a logo-less copy | Conflicting entity data | Links to the site-wide Organization by `@id`; each Service points to its own page |
| Sitemap `lastmod` was "now" on every URL | Google learns to ignore lastmod | Only real dates: post publish dates and legal "last updated" dates |
| No Person markup for the team | Missed E-E-A-T signals | `Person` for each of the 8 team members on `/about` (name, role, photo, skills, `worksFor`); no personal contact data |
| Render's `*.onrender.com` copy of the site was indexable | Duplicate host | `X-Robots-Tag: noindex, nofollow` on any `*.onrender.com` host (canonical is still www) |
| No way to verify Search Console or Bing without a code change | — | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `NEXT_PUBLIC_BING_SITE_VERIFICATION` env vars, listed in `render.yaml` |
| Four blog posts had only one internal link (the blog list) | Weak discovery and context | Service pages show three related articles; articles link to their service; case studies link to the services used |

## URLs affected

- **All pages:** HTML order, canonical fallback removed, structured data on every page.
- `/`, `/work`, `/contact`: content no longer lazy-loaded.
- `/blog` and all 8 `/blog/*` posts: headings, social images, Article schema, a "next step" link.
- `/about`: AboutPage, Person and BreadcrumbList.
- `/services` and the 4 `/services/*` pages: schema, related reading.
- The 4 `/work/*` pages: links to the services used.
- `sitemap.xml`, `next.config.ts` (headers), `render.yaml`.

**No URL was renamed, so no redirects were needed.** The existing slugs (`/services/web-app-eng`, `/services/ai-machine-ml`, …) were kept: they are established, short, lowercase and descriptive enough. Google treats words in URLs as a very small signal, and a migration would reset what these URLs have earned. The `/locations/<country>` pages tried earlier on this branch were never deployed, so they don't need redirects either; they now return 404.

## Validation results (final crawl)

| Check | Result |
| --- | --- |
| URLs crawled from `/` + sitemap | 30, all 200, all in the sitemap |
| Sitemap | Valid XML, 30 canonical indexable URLs, 12 with real lastmod; no admin, API, parameter, or noindex URLs |
| Canonicals | Every page self-canonical to `https://www.novarosolution.com/…`; `?utm_…` parameters canonicalise to the clean URL |
| Blog filters (`/blog?category=…`) | `noindex, follow`, canonical `/blog` |
| Unknown URLs (`/nope`, `/services/nope`, `/work/nope`, `/blog/nope`, `/locations/nope`) | 404 with `noindex` |
| Trailing slash (`/about/`) | One 308 to `/about` |
| `novarosolution.com` → www | One 308 to `https://www.novarosolution.com/…` |
| Admin | `noindex, nofollow` meta and header; disallowed in robots.txt |
| robots.txt | Allows all public pages, `/_next/` CSS/JS and `/og` images; disallows `/admin/` and `/api/`; points at the sitemap |
| Titles / descriptions / OG / X cards | Unique on all 30 pages; no missing tags; `og:url` matches the canonical |
| Headings | Exactly one H1 per page, first in the HTML; no skipped levels |
| Content in initial HTML | No hidden streamed segments on any page |
| Orphan pages | None. Weakest pages now have 2–3 contextual links (the location page has 3) |
| Images | 151 `<img>` tags, all with alt text |
| Structured data | All blocks parse. Required fields are present for Organization, LocalBusiness, BreadcrumbList, BlogPosting, Service and Person. No relative URLs or unresolved `@id`s. No Review, AggregateRating or FAQPage markup |

## Remaining / not done

- **Rich Results Test and Schema.org validator.** These are online tools and weren't run from here. Run them after deploy (see below). The local checks cover the same required fields.
- **Thin content.** Blog posts are 300–370 words and case studies about 290. Expand the ones that Search Console shows getting impressions.
- **Core Web Vitals.** Not measurable locally; check PageSpeed Insights and the CWV report after deploy. LCP images were moved to eager, high-priority loading earlier this month.
- **No image sitemap.** Image URLs with `&` break Next.js sitemap XML; the images are discoverable from the pages anyway.

## Manual actions

1. **Deploy** the branch to production (frontend after the backend).
2. **Google Search Console:**
   - Add the `https://www.novarosolution.com` URL-prefix property, or a Domain property via DNS.
   - For the HTML-tag method, put the code in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` on Render and redeploy.
   - Submit `https://www.novarosolution.com/sitemap.xml`.
   - Use **URL Inspection → Request indexing** for `/`, `/services`, `/locations/gandhinagar`, `/locations`, `/about` and `/work`.
   - Over the next weeks, review **Pages** (index coverage) and **Core Web Vitals**.
3. **Bing Webmaster Tools:** import from Search Console, or set `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
4. **Rich Results Test:** run it on `/`, `/blog/tech-seo-tips`, `/about` and `/services/web-app-eng`.
5. **Google Business Profile** for the Sargasan studio: name, address and phone exactly as in the footer; website link to `/locations/gandhinagar`.
6. **Render domain:** if the frontend's `*.onrender.com` URL appears in Search Console, it is already `noindex`; no action needed beyond monitoring.
