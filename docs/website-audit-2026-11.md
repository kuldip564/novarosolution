# Novaro Solution — website audit and changes (November 2026)

Scope: the whole public site in this repository (`frontend/`), checked locally. Nothing has been deployed. No ranking or traffic number is promised; see `seo-growth.md` for the search strategy.

## 1. What the site is built on (verified in the repo)

| Area | Finding |
| --- | --- |
| Frontend | Next.js 16.2.9 (App Router, Turbopack), React 19.2, TypeScript, Tailwind 4 plus ~12k lines of custom CSS in `src/styles/` |
| Motion / 3D | framer-motion, Lenis smooth scroll, three.js hero and background (desktop only) |
| Backend | Express + Prisma + MongoDB in `backend/`; Cloudinary for media. The public site falls back to built-in content when the database is unreachable |
| Hosting | Render (`render.yaml`); `novarosolution.com` 301s to `www` |
| Analytics | GA4 `G-3Z1Z971K06`, loaded after first interaction |
| SEO plumbing | `site-metadata.ts`, `structured-data.ts`, `geo-seo.ts`, `sitemap.ts`, `robots.ts`, `public/llms.txt` |

## 2. How it was tested

- Every public route at 320, 375, 430, 768, 1280 and 1440 px in headless Chrome: horizontal overflow, tiny text, small tap targets, full-page and scroll-by-scroll screenshots, dark and light theme.
- An SEO crawler reading each sitemap URL as Googlebot: title, description, canonical, H1, Open Graph image, JSON-LD types, duplicates.
- A link crawler over every page: all internal links and `#anchors`.
- A console sweep (errors, hydration, warnings) on 13 key pages at phone and desktop width.
- `tsc --noEmit` and ESLint on changed files.

## 3. Confirmed issues and what was done

### Bugs

| Issue (verified) | Fix |
| --- | --- |
| Home page replaced by "Something went wrong" when the browser has no WebGL (hardware acceleration off, some work laptops) | WebGL is probed before 3D starts; renderers fail quietly |
| With "reduce motion" on, every FAQ answer and every Work "View details" panel was forced open | Reduced motion now only stops animation |
| Phone hero: only 72 px of top space (logo under the header) and a blank line inside the headline | Hero keeps its own spacing; headline line break fixed |
| Contact details rendered as "PHONE+91 96244…", "EMAILnovaro@…" | Labels sit above values |
| Light sections inside the dark theme: pale-cyan labels on white, dark text on a dark map bar | Light sections get dark-blue accents and light surfaces |
| Home services cards rebuilt on every phone load (hydration mismatch) | Tilt wrapper only added after hydration |
| Several `aria-labelledby` pointed at headings with no id | Ids added |
| Address printed without the city ("…Sargasan, Gujarat 382419") — inconsistent business details hurt local SEO | Address now includes Gandhinagar everywhere |
| A space was dropped before "(" after links in JSX ("novarosolution.com(the") | Explicit spaces |
| Next.js 16 deprecated the image `priority` prop, so hero images were lazy-loaded (slower Largest Contentful Paint) | Priority images now load eagerly with high fetch priority |

### SEO

| Issue (verified) | Fix |
| --- | --- |
| 16 of 28 pages (all service, case-study and blog pages) had no title, description or canonical in the `<head>` for Googlebot and AI crawlers — Next.js streamed them into the body | `htmlLimitedBots` in `next.config.ts` |
| Home and Services titles/descriptions too long (81/85 and 175–183 characters) | Rewritten to fit search results |
| About, Services, Work, Blog and Contact H1 was literally "NOVARO ABOUT" etc. | Big word kept as decoration; real keyword H1 added |
| Every page shared one dashboard screenshot as its social preview | Branded 1200×630 card per page (`/og`) |
| Organization schema thin; three separate JSON-LD blocks | One connected graph: founders, team size, contact points, languages, every served city and country, services with URLs |
| Blog posts: no modified date, no breadcrumb schema, tiny icon as fallback preview | Full BlogPosting + BreadcrumbList; branded fallback image; pagination canonicals; category filters `noindex` |
| Case studies had no description over 100 characters and no project image on the page | Longer descriptions; image + results layout |

### Geo SEO

- **New `/locations/gandhinagar`** — "Software development company in Gandhinagar & Ahmedabad". The studio is in Sargasan, 12 km from GIFT City and 25 km from Ahmedabad, so this is one honest local page rather than two thin ones.
- **New `/locations`** — one hub with a section for India, the USA, UK, Europe, UAE, Canada and Australia. Each section has a time-zone overlap chart calculated from real offsets and the data-protection law that applies. These are sections, not separate country pages, to stay clear of doorway pages.
- `/software-development-usa` keeps its URL and copy and now uses the same design.
- Hero, footer and contact service-area chips link to the right page or hub section. The footer has a "Locations" link.
- `llms.txt`, the sitemap and `seo-growth.md` are updated.

### Terms & Conditions

`/terms` grew from 4 short sections to 31, plus an "In short" summary. It now has company details (name, studio address, email, phone, hours, website), definitions and proposals. It also covers fees and invoicing, change requests, acceptance and warranty, IP ownership, confidentiality and data protection, AI and SEO disclaimers, and liability. Termination and refunds, Indian law and arbitration in Gandhinagar are covered too.

### UI / UX

- Phones: headline-first hero, swipeable testimonials, two-up team and capability cards, compact project buttons, shorter page intros, two-column footer, readable labels (≥11.5 px), larger tap targets.
- Tablets: centred hero buttons, two-up process, testimonial and contact tiles, a smaller manager card, intros without empty voids.
- Desktop: three-up testimonials, a large closing call-to-action, centred blog reading column with a share rail, case studies with image and metric cards.
- Pages shortened on phones (for example About 13,800 → 10,100 px; Contact 8,700 → 7,000 px).

## 4. Test results (final run)

- 0 pages with horizontal scroll across all routes at 320–1440 px.
- 30 sitemap URLs: all return 200; 28 pass every SEO check, 2 have descriptions of about 100 characters (acceptable).
- 36 unique internal links and all `#anchors`: 0 broken.
- Sitemap XML valid.
- 0 console errors or hydration errors on the 13 pages swept. The only warning is a dev-only Next.js image notice that fires because the same image file appears again lower on the page.
- TypeScript: 0 errors. ESLint: no new warnings in changed files (remaining warnings were already there).

## 5. Decisions for the owner

1. **Default theme.** The brand brief says white background, navy text. The site currently follows the visitor's system setting, so dark-mode users see the dark design first. Switching the default to light is a one-line change.
2. **Terms & Conditions numbers.** These are defaults written as "unless your proposal says otherwise". Please confirm them, and have a lawyer review the page:
   - invoices due in 15 days
   - 7 business days for acceptance
   - 30-day bug-fix warranty
   - liability capped at 3 months' fees
   - 12-month non-solicitation
   - 3-year confidentiality
   - arbitration seated in Gandhinagar
3. **Data-protection wording** on `/locations` and `/terms` describes how data is handled. It also says you will sign a data processing agreement on request. Confirm you are happy to offer that.
4. **"7 profiles with photos"** on the About page is an internal-looking stat. Consider replacing it, and adding a photo for Ronak Prajapati.

## 6. Manual actions (cannot be done from the repo)

1. Approve and deploy (nothing has been deployed).
2. Google Search Console: verify the `www` property, submit `sitemap.xml`, and request indexing for `/locations/gandhinagar` and `/locations`.
3. Google Business Profile for the Sargasan studio: same name, address and phone as the footer, with the website link set to `/locations/gandhinagar`. Ask real clients for reviews there; do not add reviews to the site.
4. Listings filled out by a person: Clutch, GoodFirms, LinkedIn company page — same facts as `llms.txt`.
5. After deploy, check Core Web Vitals in Search Console and PageSpeed Insights (not measurable locally).
6. Blog posts are 300–370 words. Expanding the two that match real Search Console queries will do more than adding new pages.

## 7. Redesign pass (brand brief)

- **Light is the default theme** for every first-time visitor: white backgrounds, navy text, electric-blue actions. A saved Light, Dark or System choice from the header toggle is still respected. The server HTML ships light too, so there's no dark flash.
- **Counters fixed.** Every stat used to render "0" in the HTML and count up only in the browser, so crawlers, link previews and no-JS visitors saw "0+ clients". The real number is now in the HTML, and the count-up only runs when a counter scrolls into view.
- **Hero.** "Start your project" (primary, links to /contact) and "Explore our work" (secondary, links to /work). The labels stay editable in the admin. A label mentioning work, portfolio or case study links to /work; anything else links to /contact.
- **New home sections, using only information already on the site:**
  - "Products we've shipped" strip linking to the four case studies
  - Why Novaro
  - Technology stack (from the FAQ answer)
  - Industry solutions, each linked to its real case study where one exists
  - Latest three blog posts

  Home order: hero, stats, services, why, featured work, process, technology, testimonials, industries, insights, studio location, FAQ, final call-to-action.
- **Services.** A jump bar under the intro links to each service, and every service has "Learn more" (its own page) next to "Discuss this service".
- **Case studies.** Project facts (type, stack, live site) and "Other products we've shipped" cards. The portfolio button now reads "View case study".
- **About.** A compact capabilities section (four services, each with a link) plus the four-step process.
- **Tested:** 8 key pages at 320, 375, 768 and 1440 px in the light theme show no horizontal scroll or tiny text, and 13 pages show no console errors.
