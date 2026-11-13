# Measurement plan: GA4, Search Console and reporting

Written 12 November 2026. Covers what is implemented in code, what was found on the live site, and what has to be done inside the Google accounts.

**Access note:** this plan was prepared without access to the GA4 property or to Search Console. Everything under "found" comes from the website's code, its public HTML and its public DNS records. Account settings could not be inspected, so each one is listed as a step to check.

## 1. What exists today

| Item | Found | Source |
| --- | --- | --- |
| GA4 tag | `G-3Z1Z971K06` on the live site, loaded directly with gtag.js (no Tag Manager) | Live HTML |
| How it loads | On the first tap or scroll, or after 8 seconds, to keep it out of the page-load path | `frontend/src/app/layout.tsx` |
| Where it runs | On this branch: only on `novarosolution.com` and its subdomains, so local and preview builds don't pollute the data | `layout.tsx` |
| Events on the live site | `generate_lead` only | Earlier audit |
| A page-view "conversion" | `ads_conversion_Contact_Us_1` fires on every visit to `/contact`. It was created inside GA4 or Google Ads, not in the site's code. | Earlier audit (network requests) |
| Search Console verification | The domain's DNS has a `google-site-verification` TXT record, which is what a Domain property uses. Whether the property is verified, and by which Google account, can't be confirmed from outside. | `dig TXT novarosolution.com` |
| Sitemap | `https://www.novarosolution.com/sitemap.xml` returns 200 and is listed in `robots.txt`. It has 28 URLs on the live version and 31 after this branch deploys. | Live site |
| Redirects | `http://`, the bare domain and `http://www` all reach `https://www.novarosolution.com/` in one or two 308 steps | Live site |

## 2. GA4 events (implemented on this branch)

All events are sent from `frontend/src/lib/analytics.ts`. No event carries personal data: no names, email addresses, phone numbers or message text.

| Event | Fires when | Parameters | Key event? |
| --- | --- | --- | --- |
| `generate_lead` | The server confirms it saved (HTTP 201) or queued (202) an enquiry | `form_id`, `page_path`, `service`, `budget`, `timeline`, `stored` | **Yes — the only one** |
| `form_submit` | A form that passed browser validation is sent to the server. An attempt, not yet a lead. | `form_id`, `page_path` | No |
| `form_start` | First focus inside the form, once per page view | `form_id` | No |
| `form_validation_error` | Submit blocked by browser validation | `form_id`, `fields` (field names only) | No |
| `form_submit_error` | The server or network rejected the submission | `form_id`, `reason` | No |
| `primary_cta_click` | Click on a primary (filled) button, such as Start Your Project | `cta_text`, `cta_location`, `cta_destination`, `link_url`, `page_path` | No |
| `cta_click` | Click on a secondary button, such as View Case Studies | Same as above | No |
| `click_email` | Click on an email link | `link_location`, `page_path` | No |
| `click_phone` | Click on a phone link | `link_location`, `page_path` | No |
| `click_whatsapp` | Click on a WhatsApp link (`wa.me` and similar). The site has no WhatsApp link yet, so this stays at zero until one is added. | `link_location`, `page_path` | No |
| `service_page_view` | A service detail page opens | `service` (slug), `service_name` | No |
| `service_page_engagement` | The reader scrolled half the service page, or stayed 30 seconds with the tab visible; once per view | `service`, `trigger` | No |
| `project_view` | A case-study page opens | `project` (slug), `project_type` | No |

**Why only `generate_lead` is a key event:** a click on a button, an email link or a phone link shows interest, but nobody has contacted the business yet. Counting those as conversions would inflate the numbers and mislead ad bidding. They are reported as "intent" next to leads, never added to them.

**How duplicates are avoided**
- Each click sends exactly one event: email, phone and WhatsApp links are checked first, then buttons.
- Identical events within one second are merged, so a double click counts once.
- `generate_lead` depends on the server's answer, not on the click. Spam caught by the honeypot gets a plain 200 and is never counted.
- Page-load events (`service_page_view`, `project_view`) fire once per page view.
- Events that happen before GA has loaded are queued and sent after `config`, in order.

**Tested on a production build (12 November), with the contact API mocked:**
- **Service page:** one `service_page_view`; a double click on the primary button gave one `primary_cta_click`; the secondary button gave one `cta_click`; a scroll gave one `service_page_engagement`.
- **Case study:** one `project_view`.
- **Contact, server answers 200 (blocked spam):** `form_start` and `form_submit`, no `generate_lead`.
- **Contact, server confirms 202:** `form_start`, `form_submit`, then exactly one `generate_lead`.
- **Personal data:** none in any event.

## 3. GA4 account checklist

Do these in the GA4 property that owns `G-3Z1Z971K06`.

**Before changing anything, record the current state**
- [ ] Admin → Data streams: confirm there is one web stream for `https://www.novarosolution.com`, and note which Enhanced measurement options are on.
- [ ] Admin → Events and Key events: list what is currently marked as a key event.
- [ ] Admin → Product links: note whether Google Ads and Search Console are linked.

**Key events**
- [ ] Mark `generate_lead` as a key event (it appears in the list a day after this branch is live and the first lead arrives).
- [ ] Remove the key-event mark from `ads_conversion_Contact_Us_1`, and delete the rule that creates it (Admin → Events → Create event, or in Google Ads). It counts page visits, not leads.
- [ ] In Google Ads, if linked: import `generate_lead` as the conversion and remove the old one from bidding.

**Enhanced measurement**
- [ ] Turn **Form interactions** off. GA4's automatic version also sends `form_start` and `form_submit`, which would double-count ours.
- [ ] Keep page views, scrolls, outbound clicks and site search as they are.

**Custom dimensions (event scope)** — register these so the parameters appear in reports:
- [ ] `service`, `service_name`, `project`, `project_type`
- [ ] `cta_text`, `cta_location`, `cta_destination`, `link_location`
- [ ] `form_id`, `budget`, `timeline`, `stored`, `trigger`, `reason`

**Data quality**
- [ ] Admin → Data settings → Data filters: define internal traffic (office and home IP addresses) and activate the filter.
- [ ] In explorations, exclude hostnames `localhost` and `*.onrender.com` for data collected before this branch.
- [ ] Data retention: set event data to 14 months.
- [ ] Admin → Product links → Search Console: link the property, so search queries appear inside GA4.

**Consent**
- [ ] Decide whether a consent banner is needed for your visitors (it is for visitors in the EU and UK). If one is added, GA must wait for consent; say so and the loader can be adapted.

## 4. Search Console preparation and checklist

**What the site already provides**
- A valid XML sitemap, listed in `robots.txt`, with real last-modified dates.
- One canonical URL per page on `https://www.novarosolution.com`, with clean redirects from every other variant.
- `noindex` on the admin, on blog category filters and on the `onrender.com` copy.
- Optional HTML-tag verification through the `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` environment variable (for a URL-prefix property, if one is ever needed).

**Account steps**
- [ ] **Domain property:** open Search Console and check whether `novarosolution.com` already exists as a Domain property; the TXT record in DNS suggests it may. If it doesn't, add it: Search Console gives a TXT value, which goes into the DNS zone at Vercel (the domain's name servers are `vercel-dns.com`).
- [ ] **Owners:** add at least two owners, so access isn't lost with one account.
- [ ] **Sitemap:** Sitemaps → submit `https://www.novarosolution.com/sitemap.xml`. Re-check after deploying; it should then report 31 discovered URLs.
- [ ] **URL inspection** after the deploy: inspect and request indexing for the home page, the four service pages, `/work`, the four case studies and both location pages. Confirm "URL is on Google" and that the Google-selected canonical matches.
- [ ] **Indexing → Pages:** review "Not indexed" reasons weekly for the first month. "Crawled – currently not indexed" on thin pages is the one to act on.
- [ ] **Performance:** note the baseline (clicks, impressions, CTR, position for the last 28 days) on the day of the deploy.
- [ ] **Core Web Vitals:** check the mobile and desktop reports. They will show "Not enough data" until the site has enough real visitors; the public CrUX dataset has no data for the site today.
- [ ] **Manual actions** and **Security issues:** confirm both say "No issues detected".
- [ ] **Email alerts:** Settings → Email preferences: keep all alerts on, so indexing, manual-action and security emails reach an inbox someone reads.
- [ ] **Bing Webmaster Tools:** import the site from Search Console (one click), and submit the same sitemap.

**Monthly routine (15 minutes)**
1. Performance: queries and pages gaining or losing impressions.
2. Pages: new "Not indexed" reasons.
3. Core Web Vitals: any URL group moving to "Poor" or "Needs improvement".
4. Manual actions and Security issues: still clear.

## 5. Dashboard specification

**Tool:** Looker Studio (free), with two data sources: the GA4 property and the Search Console Domain property (both the "Site impression" and "URL impression" tables). Default date range: last 28 days, compared with the previous 28.

The dashboard has two clearly separated halves: **traffic** (how many people came) and **leads** (how many contacted the business). A third number, intent clicks, sits between them and is never added to leads.

### Page 1 — Overview

| Tile | Metric | Source and definition |
| --- | --- | --- |
| Organic users | Total users | GA4, filter: Session default channel group = Organic Search |
| Organic sessions | Sessions | GA4, same filter |
| Search impressions | Impressions | Search Console, site table |
| Search clicks | Clicks | Search Console, site table |
| Average CTR | Clicks ÷ impressions | Search Console, site table |
| Leads from organic | Event count of `generate_lead` | GA4, filter: Organic Search |
| Organic conversion rate | Organic leads ÷ organic sessions | Calculated field |
| All leads | Event count of `generate_lead`, all channels | GA4 |

Below the tiles: a time series of organic sessions and search clicks, and a separate one of leads per week (a bar chart, because the numbers are small).

### Page 2 — Search

- **Queries table:** query, clicks, impressions, CTR, average position (Search Console, site table). Filter control: branded versus non-branded (query contains "novaro").
- **Landing pages table:** page, clicks, impressions, CTR, position (Search Console, URL table).
- **Opportunity list:** queries in positions 5–20 with more than 50 impressions, sorted by impressions.

### Page 3 — Landing pages and engagement

- **Top organic landing pages:** landing page, sessions, engaged sessions, engagement rate, leads (GA4, Organic Search).
- **Service pages:** `service_page_view` and `service_page_engagement` by `service`, with the engagement share (engagements ÷ views).
- **Case studies:** `project_view` by `project`.
- **Buttons:** `primary_cta_click` by `cta_text` and `cta_location`.

### Page 4 — Leads (business results)

- **Leads by channel:** `generate_lead` by Session default channel group.
- **Leads by service, budget and timeline:** from the event parameters.
- **Form funnel:** `form_start` → `form_submit` → `generate_lead`, with drop-off at each step, plus `form_submit_error` by `reason`.
- **Intent clicks (not leads):** `click_email`, `click_phone`, `click_whatsapp`, shown in their own table with a note that they are not counted as leads.
- **Reconciliation:** a monthly count from Admin → Leads entered next to GA4's `generate_lead` count. The admin list is the source of truth; GA4 will usually be a little lower, because some visitors block analytics.

### Page 5 — Geography and devices

- **Country, and region for India:** organic sessions, search clicks and leads (GA4 for sessions and leads, Search Console for clicks by country).
- **Device:** mobile, desktop and tablet for the same metrics, plus Search Console clicks and CTR by device.

**Notes for whoever builds it**
- Search Console data arrives two to three days late; GA4 standard reports about a day late.
- GA4 applies thresholds on small numbers; with a handful of leads a month, read lead counts from the admin list.
- Keep traffic charts and lead charts on separate axes; never plot them on one scale.

## 6. Implementation checklist

**In code (done on this branch)**
- [x] Event names and parameters as in §2.
- [x] `generate_lead` only after server confirmation.
- [x] GA limited to the production domain.
- [x] Sitemap, canonical URLs, redirects and `noindex` rules.

**To deploy**
- [ ] Merge and deploy the branch (backend with or before the frontend).
- [ ] After the deploy, open the site with GA4's DebugView (or the Tag Assistant) and trigger each event once: a service page, a case study, a primary button, an email link, a phone link, and one real test enquiry. Delete the test enquiry in Admin → Leads afterwards.

**In the accounts**
- [ ] GA4 checklist in §3.
- [ ] Search Console checklist in §4.
- [ ] Build the Looker Studio dashboard from §5 and share it with the team.

**Worth adding later**
- Store the visitor's first landing page, referrer and UTM values with each lead in the admin. That would let the admin list itself say which leads came from search, without relying on GA4.
- Add a WhatsApp link if the business number is on WhatsApp; `click_whatsapp` is already tracked.
