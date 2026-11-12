# Content strategy and 90-day editorial calendar

Written 12 November 2026. Goal: build topical authority around what Novaro sells (web and software development, mobile apps, AI and automation, SEO and digital marketing, cloud and DevOps, UI/UX) through a small number of connected, experience-based articles.

**Status:** the article template is built (see §6). On 12 November 2026 six articles were written and added to the site's built-in posts (`frontend/src/lib/blog.ts`): website development process, website development cost in India, mobile app development process, React Native vs Flutter vs native, website performance (our own site's numbers), and SEO for Indian businesses. Their external facts link to sources that were checked on that date. **They still need the human fact review** in [content/article-template.md](content/article-template.md), including a named reviewer, before this branch is deployed. The existing eight posts were moved into their cluster categories.

Search volumes are not included, because no keyword tool was connected. Check each primary keyword in Google Keyword Planner and Search Console before writing, and swap in a close variant if the data says so.

## 1. Principles

- **Clusters, not one-offs.** Each cluster has one pillar article that covers the topic end to end, and supporting articles that each answer one narrower question and link back to the pillar and to the service page.
- **One primary keyword per URL.** Check new topics against [on-page-keyword-map.md](on-page-keyword-map.md). Service pages own "hire" intent; articles own "learn" and "compare" intent.
- **One article a week, at most.** Thirteen good articles in 90 days beats fifty thin ones. If the reviewer isn't available, the slot slips; it is not filled with unreviewed copy.
- **Experience first.** Every article needs something only Novaro can say: a project we shipped, a number we measured, a decision we got wrong. The four case studies and our own site's audits are the raw material.
- **Honest numbers.** Prices, timelines and statistics need a source or the team's confirmation. No client revenue, traffic or conversion figures without permission. No ranking guarantees.
- **Real authors.** A byline is a team member who knows the topic, or "Novaro Team". No invented experts.

## 2. Clusters

The category set in the admin places an article in its cluster. That drives the "More on this topic" links and the call to action on the article page.

| Cluster (admin category) | Pillar article | Supports this page | Existing articles to fold in |
| --- | --- | --- | --- |
| Web Development | Website development process: from brief to launch | `/services/web-app-eng` | `saas-mvp-cost-factors`, `custom-vs-off-the-shelf`, `web-app-development-expect`, `hire-it-services-company`, `ship-fast-stack`, `working-with-us-teams` (currently "Product") |
| Mobile Apps | Mobile app development process | `/services/web-app-eng` | none |
| AI & Automation | AI applications in business: where it pays off | `/services/ai-machine-ml` | `ai-prod-apps` (currently "AI / ML") |
| Digital Marketing | SEO for Indian businesses: a practical guide | `/services/digital-marketing` | `tech-seo-tips` (currently "Growth") |
| Gujarat Business | Website strategy for Gujarat SMEs | `/locations/gandhinagar`, `/locations/ahmedabad` | none |
| Cloud & DevOps / Design (after day 90) | Cloud setup for a growing product | `/services/cloud-devops` | none |

The old category names ("Product", "AI / ML", "Growth") already map to the right clusters in code, so nothing breaks before the articles are recategorised.

### Topics per cluster

**Web Development:** website development process (pillar) · website development cost in India · custom website vs template · features every business website needs · website performance optimisation.

**Mobile Apps:** app development process (pillar) · React Native vs native apps · mobile app cost in India · app maintenance and scalability.

**AI & Automation:** AI applications in business (pillar) · workflow automation · AI-powered business tools · practical machine learning applications.

**Digital Marketing:** SEO for Indian businesses (pillar) · Google Ads strategy · lead generation · website conversion optimisation.

**Gujarat Business:** website strategy for Gujarat SMEs (pillar) · digital growth for Gandhinagar businesses · technology adoption in Ahmedabad · digital transformation for Indian businesses.

## 3. Overlap with existing pages

| New topic | Could collide with | How they stay apart |
| --- | --- | --- |
| Website development cost in India | `saas-mvp-cost-factors` | The new one is about websites, for an SME owner. The existing one is about SaaS products, for a founder. Link them to each other. |
| Custom website vs template | `custom-vs-off-the-shelf` | Websites vs business software. Different title, keyword and examples. |
| AI applications in business | `ai-prod-apps`, `/services/ai-machine-ml` | The pillar is for business owners (what to automate). `ai-prod-apps` is for product teams. The service page is for hiring. |
| SEO for Indian businesses | `tech-seo-tips`, `/services/digital-marketing` | The pillar is the overview. `tech-seo-tips` becomes its technical checklist. The service page is for hiring. |
| Gujarat and city articles | `/locations/gandhinagar`, `/locations/ahmedabad` | Location pages sell the service. Articles teach, and never claim an office we don't have. |

## 4. 90-day editorial calendar

One new article a week, starting the week of 16 November 2026. P1 means publish first, because it has the highest commercial value or we have real experience to draw on; P2 follows. The week is when the article goes live after review, so writing starts about two weeks earlier.

| Week of | Topic | Search intent | Primary keyword | Target reader | Suggested URL | Cluster | Internal links | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 16 Nov | Website development cost in India: what changes the price | Commercial investigation | website development cost in India | SME owner setting a budget | `/blog/website-development-cost-india` | Web Development | `/services/web-app-eng`, `saas-mvp-cost-factors`, pillar (when live), `/contact` | P1 |
| 23 Nov | Website development process: from brief to launch (pillar) | Informational | website development process | Business owner commissioning a first serious site | `/blog/website-development-process` | Web Development | All web articles, `/services/web-app-eng`, `/work/mr-antidot` | P1 |
| 30 Nov | SEO for Indian businesses: a practical guide (pillar) | Informational | SEO for Indian businesses | Owner or marketer starting SEO | `/blog/seo-for-indian-businesses` | Digital Marketing | `tech-seo-tips`, `/services/digital-marketing`, `/locations/gandhinagar` | P1 |
| 7 Dec | React Native vs native apps: how we choose | Commercial investigation | React Native vs native app development | Founder deciding how to build an app | `/blog/react-native-vs-native-apps` | Mobile Apps | `/services/web-app-eng`, `/work/zeevan`, `/work/kankreg` (both built with Expo) | P1 |
| 14 Dec | Website strategy for Gujarat SMEs (pillar) | Informational, local | website for small business in Gujarat | Gujarat SME owner | `/blog/website-strategy-gujarat-smes` | Gujarat Business | `/locations/gandhinagar`, `/locations/ahmedabad`, cost article | P1 |
| 21 Dec | AI applications in business: where it pays off (pillar) | Informational | AI applications in business | Owner or operations head | `/blog/ai-applications-in-business` | AI & Automation | `ai-prod-apps`, `/services/ai-machine-ml` | P1 |
| 28 Dec | Website performance: what we fixed on our own site | Informational | website performance optimization | Marketer or developer with a slow site | `/blog/website-performance-optimization` | Web Development | Pillar, `tech-seo-tips`, `/services/cloud-devops` | P2 |
| 4 Jan | Mobile app development cost in India | Commercial investigation | mobile app development cost in India | Founder setting a budget | `/blog/mobile-app-development-cost-india` | Mobile Apps | React Native article, `/services/web-app-eng`, `/contact` | P1 |
| 11 Jan | Workflow automation for small businesses: where to start | Informational | workflow automation for small business | Operations manager | `/blog/workflow-automation-small-business` | AI & Automation | AI pillar, `/services/ai-machine-ml`, `/work/quadrato-cargo` | P2 |
| 18 Jan | Google Ads for service businesses: a starting strategy | Informational | Google Ads strategy for small business | Service-business owner | `/blog/google-ads-strategy-service-business` | Digital Marketing | SEO pillar, `/services/digital-marketing`, `/work/mr-antidot` | P2 |
| 25 Jan | Mobile app development process (pillar) | Informational | mobile app development process | First-time app founder | `/blog/mobile-app-development-process` | Mobile Apps | React Native and cost articles, `/services/web-app-eng` | P2 |
| 1 Feb | Website conversion: turning visitors into enquiries | Informational | website conversion optimization | Owner with traffic but few leads | `/blog/website-conversion-optimization` | Digital Marketing | SEO pillar, Google Ads article, `/work/mr-antidot` (pre-filled booking) | P2 |
| 8 Feb | Digital growth for Gandhinagar businesses | Informational, local | digital marketing for Gandhinagar businesses | Gandhinagar business owner | `/blog/digital-growth-gandhinagar-businesses` | Gujarat Business | Gujarat pillar, `/locations/gandhinagar`, SEO pillar | P2 |

**Alongside (not new articles):** the eight existing articles are 210–290 words each. Expand two a month with a real example and sources, move them into their cluster's category, and replace the "Novaro Team" byline with the engineer or marketer who actually wrote the update.

**Backlog for days 90–180:** custom website vs template · features every business website needs · app maintenance and scalability · AI-powered business tools · practical machine learning applications · lead generation for B2B services · technology adoption in Ahmedabad · digital transformation for Indian businesses · cloud setup for a growing product · CI/CD explained for founders · what a design system is and when you need one.

## 5. What each article must contain

The full template and checklist are in [content/article-template.md](content/article-template.md). In short: an original title; a brief with intent, target keyword and secondary keywords; a clear introduction; useful detail with at least one real example; our own screenshots or diagrams; internal links to the pillar and service page; a `Sources` section for every factual claim; a genuine author; an SEO title and description; and a signed-off fact review.

## 6. What the article page now does automatically

Built in `frontend/src/app/blog/[slug]/page.tsx`, with helpers in `src/lib/article-enhance.ts` and `src/lib/content-clusters.ts`:

- **Byline:** a real team member's name shows with their role and links to the About page. Any other byline is credited to the Novaro Solution team. The built-in posts no longer use invented titles ("Novaro AI Lead", "Novaro Growth Lead").
- **Dates:** the published date always shows; an "Updated" date shows when the article is edited on a later day. Both are in the structured data. The API now returns the last-edit time.
- **Table of contents:** built from the H2 headings when there are three or more.
- **Sources:** a final `Sources` heading becomes a numbered source list, and feeds `citation` in the structured data.
- **Cluster links:** "More on this topic" lists other articles in the same cluster, pillar first.
- **Call to action:** each cluster has its own message and button, with a link to its service page.
- **Structured data:** `BlogPosting` with `author` (Person only for real team members, otherwise the organisation), `datePublished`, `dateModified`, `articleSection`, `citation`, publisher and breadcrumbs.
- **Internal links** in article bodies now open in the same tab; external links still open in a new one.

Drafts stay unpublished in the admin (status Draft, with preview) until the review is signed off.

## 7. Measuring it

- **Per cluster, monthly, in Search Console:** impressions, clicks and the queries each article appears for.
- **Enquiries:** which article a contact-form visitor landed on. Add the landing page to the lead record if it isn't there yet.
- **Review at day 90:** keep the clusters that earn impressions and enquiries, and rework or merge articles that earn neither. Don't add a second article on a keyword that an existing one already targets.
