# On-page keyword map — November 2026

Written **before** changing copy, from a crawl of all 31 sitemap URLs on a production build. Each URL gets one primary topic. Keyword volumes are not included because no volume tool was connected; check them in Google Keyword Planner and Search Console before re-prioritising. Intent: **T** transactional, **C** commercial investigation, **I** informational, **N** navigational/brand.

## 1. Page inventory and mapping

| URL | Intent | Primary keyword | Secondary keywords | Current issue | Action |
| --- | --- | --- | --- | --- | --- |
| `/` | T, N | custom software development company | web and mobile app development, AI development, Novaro Solution | H1 is a slogan ("We build software worldwide.") | Specific H1 default ("Custom software, web apps & AI that ship."); hero text is editable in admin |
| `/services` | C | software development services | web app, AI, digital marketing, cloud services | Fine; hub for the four services | Keep; link each service to its page |
| `/services/web-app-eng` | T | web and mobile app development services | web application development company, SaaS MVP, mobile app development, ecommerce development | H1 "Web & App Engineering" is a label; 349 words; no problems, process, FAQ or case-study blocks | Full service-page structure (§3) |
| `/services/ai-machine-ml` | T | AI development services | AI document extraction, invoice data extraction, AI search over company documents, machine learning development | H1 is a label; 302 words; "a ai" grammar | Full structure |
| `/services/digital-marketing` | T | digital marketing and SEO services | technical SEO, local SEO, Google Ads management, Meta ads, conversion tracking | H1 "Digital Marketing"; 262 words | Full structure |
| `/services/cloud-devops` | T | cloud and DevOps services | AWS and GCP setup, CI/CD pipelines, cloud cost reduction, design systems | H1 is a label; 289 words; no hero image | Full structure |
| `/work` | C | software development case studies | web app case studies, D2C ecommerce case study, logistics platform | Fine | Better image alt text |
| `/work/[slug]` (×4) | C | "[client] case study" | project type (D2C storefront, logistics platform, service booking platform) | H1 is only the client name | H1 = client + project type; descriptive alts |
| `/about` | N, C | about Novaro Solution | software studio in Gandhinagar, team | Fine | Team photo alt = name + role |
| `/contact` | T | contact Novaro Solution | start a software project, get a proposal | Title leads with markets rather than the action | Title leads with "start a project" |
| `/it-services` | T | IT services company | software, AI, web apps worldwide | Overlaps the homepage (see §2) | Keep scoped to "IT services company"; link to the homepage and services |
| `/software-development-usa` | T | software development company for US companies | remote team, US time-zone overlap | Fine | — |
| `/locations` | C | where Novaro works | markets, time zones | Fine | — |
| `/locations/gandhinagar` | T, L | software and website development company in Gandhinagar | web, app, SEO and AI in Gandhinagar | Fine (rebuilt last pass) | — |
| `/locations/ahmedabad` | T, L | website and software development for Ahmedabad businesses | app, SEO and AI for Ahmedabad | Fine | — |
| `/blog` | I | software, AI and SEO articles | — | Fine | — |
| `/blog/saas-mvp-cost-factors` | I/C | SaaS MVP cost | — | Fine | — |
| `/blog/custom-vs-off-the-shelf` | I/C | custom vs off-the-shelf software | — | Fine | — |
| `/blog/hire-it-services-company` | C | how to hire an IT services company | — | Fine | — |
| `/blog/web-app-development-expect` | I | what to expect from web app development | — | Fine | — |
| `/blog/working-with-us-teams` | I/C | working with a software studio in India from the US | — | Fine | — |
| `/blog/ship-fast-stack` | I | single full-stack team | — | Fine | — |
| `/blog/ai-prod-apps` | I | AI features in production apps | — | Fine | — |
| `/blog/tech-seo-tips` | I | technical SEO checklist | — | Fine | — |
| Legal pages (×4) | N | — | — | Fine | — |

## 2. Cannibalization check

| Overlap | Risk | Resolution |
| --- | --- | --- |
| `/` vs `/it-services` vs `/services` on "software development / IT services company" | Medium | Each page owns one phrasing. `/` owns "custom software development company" (brand and overview). `/it-services` owns "IT services company". `/services` owns "software development services" (the hub). Titles and H1s keep these distinct; each links to the others with descriptive anchors. |
| `/services/web-app-eng` vs `/blog/web-app-development-expect` | Low | Different intent (hire vs learn). The article links to the service; the service links to the article as related reading. |
| `/services/digital-marketing` vs `/blog/tech-seo-tips` | Low | Same pattern: service = hire, article = checklist. |
| `/it-services` vs `/blog/hire-it-services-company` | Low | Service vs buying guide; cross-linked. |
| `/locations/gandhinagar` vs `/` for "software company Gandhinagar" | Low | Only the location page has Gandhinagar in its title and H1. The homepage mentions the studio once. |
| Mobile app development | None | No separate mobile page, so no duplicate. "Mobile app development" is a secondary topic of `/services/web-app-eng` (H1 "Web and mobile app development services"). |
| Service × city combinations | None | Not created by design. City pages describe their services and link to the service pages. |

## 3. Service-page structure (applied to all four)

1. **H1** with the service name in plain words.
2. **Introduction:** what it is and who it's for.
3. **Business problems solved.**
4. **How Novaro solves them.**
5. **Scope of services:** "What's included". The copy lives in `frontend/src/lib/service-page-content.ts`, so it stays complete whatever the CMS holds. Admin edits to service bullets and outcomes still show on the `/services` hub.
6. **Technologies.**
7. **Development process.**
8. **Benefits and practical examples:** outcomes, plus the existing scenario sections.
9. **Relevant case studies:** real portfolio projects only.
10. **FAQs:** genuine questions, answered with facts the site already publishes (timelines, pricing approach, stack). No FAQPage markup, per `seo-growth.md`.
11. **Related services.**
12. **Related reading:** blog articles.
13. **Contact CTA.**

Rules followed: no unsupported claims (no certifications, client counts or results that aren't already published), no keyword stuffing, no new duplicate pages.

## 4. What changed

- **Service pages** (`/services/[slug]`) now follow the structure in §3. Each is about 1,250–1,360 words, up from 260–350. The content comes from `src/lib/service-page-content.ts` and the layout from `src/styles/service-page.css`. Each page has a jump bar, two hero CTAs, case-study cards with real portfolio images, six FAQs (visible text only, no FAQPage markup), related services, related reading and a service-specific CTA. Service JSON-LD gains an `OfferCatalog` that matches the visible scope list.
- **The AI page** says plainly that no AI case study is published yet, and shows the platforms the team built instead.
- **Fixes:** the CTA no longer renders "Start a AI & Machine Learning project". The unsupported "clinicians" outcome default was removed.
- **Case studies:** the H1 and title say what was built. Each has its own meta description, written from its published story.
- **Homepage H1 default:** "Custom software built to ship." The hero is a CMS field, so if production has a saved hero in the admin, change it there too.
- **Contact title:** it now leads with the action.
- **Alt text:** homepage and `/work` project cards use descriptive alts, screenshots read "… screenshot n of N", and team photos give name and role.

## 5. Final state (verified on a production build)

| URL | Target keyword | Title | Meta description | H1 |
| --- | --- | --- | --- | --- |
| `/` | custom software development company | Custom Software & AI Development Company — Novaro Solution | Novaro Solution builds custom software, web and mobile apps, AI features and SEO for companies in the USA, UK, Europe and India. Studio in Gandhinagar. | Custom software built to ship. |
| `/services/web-app-eng` | web and mobile app development services | Web & Mobile App Development Services — Novaro Solution | Custom web apps, SaaS platforms and mobile apps built on Next.js and Node.js by one team in Gandhinagar, India, with a working build every week. | Web and mobile app development services |
| `/services/ai-machine-ml` | AI development services | AI & Machine Learning Development Services — Novaro Solution | AI development for real business workflows: document extraction, search over your own files and LLM features, with evaluation and a person in the loop. | AI and machine learning development services |
| `/services/digital-marketing` | digital marketing and SEO services | Digital Marketing & SEO Services — Novaro Solution | Technical SEO, local SEO, Google Ads and Meta campaigns with conversion tracking, run by the team that builds your site, so the fixes actually ship. | Digital marketing and SEO services |
| `/services/cloud-devops` | cloud and DevOps services | Cloud & DevOps Services on AWS and GCP — Novaro Solution | AWS and GCP setup, CI/CD pipelines, monitoring and cloud cost reviews, plus design systems, from the team that builds your app, so nothing is lost in handover. | Cloud, DevOps and design system services |
| `/work/zeevan` | Zeevan case study (D2C storefront) | Zeevan Case Study: D2C Ghee Storefront — Novaro Solution | How we built Zeevan's D2C storefront for premium A2 ghee: product storytelling, trust-led visuals and a fast mobile path to purchase. | Zeevan: a D2C storefront for a premium A2 ghee brand |
| `/work/kankreg` | KankreG case study (D2C store) | KankreG Case Study: A2 Ghee D2C Store — Novaro Solution | How we built KankreG's A2 ghee D2C store: brand-forward product pages, clear value messaging and performance tuned for mobile shoppers. | KankreG: an A2 ghee store built for mobile shoppers |
| `/work/mr-antidot` | Mr Antidot case study (service platform) | Mr Antidot Case Study: Service Platform — Novaro Solution | How we built Mr Antidot's service platform: treatment catalogues, transparent pricing, sector pages and lead capture for the operations team. | Mr Antidot: a service platform for hygiene and pest control |
| `/work/quadrato-cargo` | Quadrato Cargo case study (courier platform) | Quadrato Cargo Case Study: Courier Platform — Novaro Solution | How we built Quadrato Cargo's courier platform: instant and scheduled pickup booking, live shipment tracking and quote requests. | Quadrato Cargo: courier booking and shipment tracking platform |
| `/contact` | contact Novaro Solution / start a software project | Contact Us to Start a Software Project — Novaro Solution | Tell us what you need built: a web app, an AI feature or marketing. We reply within one business day. Call +91 96244 98325 or visit our Gandhinagar studio. | Contact our software studio in Gandhinagar |

The other pages (hub pages, location pages, blog, legal) were reviewed in §1 and kept as they are.

**Crawl after the change:** 31 URLs, all 200 and in the sitemap. No duplicate titles or descriptions, one H1 per page, no orphan pages, every image has alt text, and the JSON-LD parses.

## 6. Still to do (needs a person or data)

- Check search volumes in Google Keyword Planner and Search Console queries. Re-prioritise secondary keywords if the data disagrees.
- Read the service-page FAQs and process steps to confirm they match how projects actually run, for example that model usage costs are measured during an AI pilot.
- `/it-services` (265 words) and the blog posts (210–290 words) are short. Expand them only with real experience, such as a project walkthrough or real numbers, not filler.
- Publish an AI case study when a client agrees; the AI page links to it automatically if it is added to `caseStudies` in `service-page-content.ts`.
