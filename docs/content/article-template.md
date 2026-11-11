# Article template and review checklist

Use this for every blog article. Write the brief first, then the draft, then get the claims reviewed. An article is published from the admin (`/admin` → Posts) only after the review box at the bottom is complete.

## 1. Brief (fill in before writing)

| Field | Value |
| --- | --- |
| Working title | |
| Cluster | Web development / Mobile apps / AI & automation / Digital marketing & SEO / Gujarat business guides / Cloud, DevOps & design |
| Role in cluster | Pillar or supporting article |
| Search intent | Informational / commercial investigation / transactional / local |
| Target reader | Who they are, and what decision they are trying to make |
| Primary keyword | One phrase. Check it against `docs/content-strategy.md` so no other page targets it |
| Secondary keywords | 3–5 related phrases, used only where they fit naturally |
| Suggested URL | `/blog/<slug>`: short, lower-case, no dates |
| The one thing only we can say | A project, a number we measured, a mistake we made, a screenshot we own |
| Internal links | Pillar article, 1–2 sibling articles, the cluster's service page, a case study if relevant |
| Author | A real team member who knows the topic, or "Novaro Team" |
| Reviewer | Who checks the facts (must not be the author) |

If "the one thing only we can say" is empty, don't write the article yet.

## 2. Structure

1. **Title (H1):** says what the reader gets, in under ~60 characters.
2. **Introduction (2–4 sentences):** the question, who it's for, and the short answer.
3. **Body (H2 sections):** each H2 answers one sub-question. With three or more H2s, the page builds a table of contents automatically.
4. **Practical example:** at least one real example: a project, a calculation, or a before/after. Name the client only if they have agreed.
5. **Screenshot or original illustration:** our own screenshots or diagrams, with descriptive alt text. No stock photos standing in for evidence.
6. **What to do next:** one short section that links to the pillar or service page in context.
7. **Sources:** end the article with an H2 called exactly `Sources`, followed by a list of links. The page turns this into a numbered source list and adds it to the article's structured data. Every statistic, price, law, or third-party claim needs a source here.

## 3. Fields in the admin

| Admin field | What to enter |
| --- | --- |
| Title | The H1 |
| Slug | The suggested URL slug |
| Category | The cluster name exactly as listed in the brief; this drives the "More on this topic" links and the call to action |
| Tags | Primary keyword plus 2–4 secondary keywords |
| Excerpt | 1–2 sentences, used on cards |
| Meta title | Up to ~60 characters, primary keyword near the front |
| Meta description | 140–160 characters, a plain summary |
| Author | A real team member's name exactly as on the About page (the page then shows their role), or "Novaro Team" |
| Cover image | Our own image, 1600px wide or more |
| Status | Keep as **Draft** until section 4 is complete |

The page adds these automatically: published and updated dates, reading time, breadcrumbs, table of contents, source list, cluster links, the cluster's call to action, and `BlogPosting` structured data (author, dates, citations).

## 4. Review before publishing (required)

- [ ] Every number, price, date and statistic has a source in the Sources list, or is our own figure that the reviewer has confirmed.
- [ ] Nothing about a client is published without their permission: no revenue, traffic, conversion or customer numbers.
- [ ] No claim about rankings, guarantees or results we can't show.
- [ ] Prices and timelines match what we currently quote (see the FAQ on the home page).
- [ ] Technical statements were checked by an engineer who has done the work.
- [ ] The article doesn't repeat another article; the primary keyword is unique in the calendar.
- [ ] Links work; internal links point to the pillar and the service page.
- [ ] Images are ours, with alt text.
- [ ] The author is real and has read the final version.
- [ ] Reviewer name and date: ____________________

## 5. After publishing

- Update the article when facts change; the page shows an "Updated" date automatically.
- After about 8 weeks, check Search Console for the queries it appears for, and adjust the title or add a missing section.
