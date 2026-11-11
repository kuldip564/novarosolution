# Conversion audit and changes — November 2026

**Goal:** turn more relevant visitors into qualified enquiries, without inventing proof and without weakening form security.

**Status:** everything here is implemented on branch `cursor/usa-organic-growth`. It is not deployed. Several items also need a change in the admin, because production content comes from the CMS (§6).

## 1. What the audit found

### Homepage

| Area | Before | Problem |
| --- | --- | --- |
| Headline | "Custom software built to ship." | Says what we make, not who it's for |
| Subheadline | "…one senior team from the first sketch to launch." | "Senior" is not accurate for the whole team, which includes a 2026 graduate |
| Hero trust stat | "32 Clients served" | Can't be checked anywhere on the site |
| Studio stats | 32+ clients, 50+ products delivered, 98% return for phase two | The portfolio shows 4 projects. These figures break the "no fabricated statistics" rule. |
| Testimonials | 3 anonymous quotes ("Product Lead", "Brand Founder", "Operations Director"), all 5 stars | Not attributable. One says the store was built "with Next.js", which contradicts the live sites (Expo). They were also written into the database by the seed script. |
| Services block | "Explore all services" and "IT services worldwide" side by side | Two equal buttons competing |
| Location block | "All locations" and "Book a discovery call", right before the final enquiry section | Duplicate primary CTA |
| Final enquiry section | "Ready to ship something worth showing off?" with one button | No alternative for people who prefer email or phone |
| Project examples | Real projects with case studies | Good. Now also named in the hero as proof. |

### CTAs across the site

Contact-intent buttons used 9 different labels:
- "Start a project", "Start your project"
- "Book a call", "Book a discovery call", "Book a review call"
- "Discuss a project", "Start a similar project", "Discuss an AI pilot", "Request an audit"

Links to the portfolio used 4: "View full portfolio", "Explore our work", "See case studies", "See our work". Service-page CTAs opened a blank form, so the visitor had to say again what they'd just read about.

### Contact form

| Area | Before |
| --- | --- |
| Fields | Name, email, services (optional), budget, message. No company, phone or timeline. |
| Required service | Not required, so many leads arrived with no service selected |
| Validation | Name, email and a 10-character message only. Missing fields returned the schema library's raw text ("expected string, received undefined"). |
| Success state | A toast that disappears after a few seconds; the form simply cleared |
| Accessibility | Inputs weren't linked to their hint or error text (`aria-describedby` sat on a wrapper div). The services label pointed at nothing. Error text was `#f87171` on white, about 2.8:1 contrast, which fails WCAG AA. Inputs at about 15px triggered iOS zoom. |
| Spam protection | Rate limit only (5 per minute per IP) |
| Privacy notice | None at the form |
| Admin CSV export | Visitor text written straight into cells, so a value starting with `=`, `+`, `-` or `@` runs as a spreadsheet formula when opened |

### Measurement

GA4 recorded a `generate_lead` event, but that was the only one. There was nothing for CTA clicks, email, phone or WhatsApp clicks, case-study views or service-page engagement.

## 2. Homepage changes

**Hero:**
- **Headline:** "Custom software / for growing businesses." It keeps the "custom software" search term and adds who it's for.
- **Subheadline:** "Web apps, mobile apps, AI features and the marketing around them, designed and built by one team in Gandhinagar, India. You see a working build every week, and the code is yours at launch." Every claim in it is already stated elsewhere on the site.
- **CTAs:** primary **Start Your Project** → `/contact`; secondary **View Case Studies** → `/work`.
- **Proof line:** "Live client work: Zeevan · KankreG · Mr Antidot · Quadrato Cargo". Each name links to its case study and comes from the published projects.
- **Hero stat:** "1 day — Reply time on new enquiries", our stated reply commitment, replacing "32 clients served".

**Studio stats (homepage and About):**
- 2 yrs shipping production software (studio opened in 2024)
- 4 live client products in our portfolio
- People on the team (counted from the team list)
- 1 day reply time on new enquiries

**Other sections:**
- **Testimonials:** shown only when real quotes are published in the admin. With none published, the section is hidden.
- **Services block:** one button, **Explore Our Services**.
- **Projects block:** **View Case Studies**.
- **Location block:** the duplicate enquiry button is removed; "All locations" stays.
- **Final enquiry section:**
  - Title: "Tell us what you need built."
  - Description: "Share a few lines about your project. We reply within one business day, book a 30-minute call, and then send a scoped proposal with timeline and budget."
  - One **Start Your Project** button, with "Prefer email or a call?" and the email address and phone number underneath.
- **"Senior" wording** is removed from the homepage, About, the why-us section and the USA page.

## 3. CTA strategy (now used everywhere)

| Label | Where | Goes to |
| --- | --- | --- |
| **Start Your Project** | Header (desktop and mobile), homepage hero and final section, About and default CTA bands, web and app service page | `/contact` (service pages add `?service=…`) |
| **Book a Consultation** | Location pages and hub, services hub, digital marketing and cloud service pages | `/contact` (service pages add `?service=…`) |
| **Discuss Your Requirements** | Case studies, AI service page, the service rows, the "Something else?" industries card | `/contact` (service pages add `?service=…`) |
| **Explore Our Services** | Homepage services block | `/services` |
| **View Case Studies** | Homepage hero and projects, service pages, location pages, form success panel | `/work` or `#case-studies` |

**Rules:**
- No more than one primary and one secondary button in any block.
- Contact buttons on service pages pre-select that service on the form (for example `/contact?service=ai-machine-ml` selects "AI & automation").
- The homepage hero's button links follow their labels: case studies → `/work`, services → `/services`, everything else → `/contact`.

## 4. Contact form

| Field | Required | Validation (same rules in the browser and on the server) |
| --- | --- | --- |
| Name | Yes | 2–120 characters |
| Business email | Yes | Valid address, up to 254 characters. Free-mail addresses are allowed, because many small firms use them. |
| Company | Optional | Up to 120 characters |
| Phone or WhatsApp | Optional | Digits, spaces, `+ ( ) - .` only; 7–15 digits; country code hint shown |
| What do you need help with? | Yes, at least one | Web or mobile app, AI & automation, SEO & digital marketing, Cloud & DevOps, UI/UX design, Not sure yet |
| Budget range | Optional | Existing ranges; defaults to "Not sure yet" |
| Timeline | Optional | As soon as possible, Within 1–3 months, In 3–6 months, Just exploring |
| Project description | Yes | 20–5,000 characters, at most 6 links |

**States:**
- **Field errors:** shown next to each field, the first invalid field takes focus, and each field is marked `aria-invalid` and linked to its error and hint.
- **Server errors:** shown as an alert that offers email and phone as a fallback. Rate-limit errors (HTTP 429) get their own message.
- **Success:** a panel replaces the form and takes focus. It thanks the person by first name, explains the next three steps, gives the phone number for urgent projects, and links to case studies or a fresh form.

**Spam protection** (no CAPTCHA, so nothing slows real people down):
- **Honeypot:** a hidden field ("website"). If it's filled, the server answers like a success but stores and emails nothing.
- **Speed check:** forms sent less than 2.5 seconds after the page loaded are rejected with a polite "please send again" message.
- **Limits:** at most 6 links in the description, and the existing rate limit of 5 enquiries per minute per IP.
- **Cleaning:** control characters are stripped from every field before storage.

**Data handling:**
- **Admin and email:** new fields are stored with each lead (company, phone, timeline, and the source page path), shown in Admin → Leads, included in the notification email, and kept by the offline outbox.
- **CSV export:** includes all fields, and any cell starting with `= + - @` (or a tab or carriage return) is prefixed with `'` so it can't run as a formula.

**Privacy:**
- A notice under the button says details are used only to reply and prepare a proposal, never sold or added to a mailing list, and links to the Privacy Policy.
- The Privacy Policy now lists the new optional fields and the source page, and its date is updated (also in the sitemap).

**Accessibility and mobile:**
- The services are a fieldset with a real legend.
- Error colour on the light theme is `#b91c1c`, which passes 4.5:1 contrast.
- Inputs are 16px on phones, so iOS doesn't zoom.
- Fields have `autocomplete` and `inputmode` set; layout is two columns from 640px and one column below.

## 5. Measurement plan (GA4)

> **Superseded on 12 November 2026:** event names were aligned with the measurement plan. `cta_click` on primary buttons is now `primary_cta_click`; `email_click`, `phone_click` and `whatsapp_click` are `click_email`, `click_phone` and `click_whatsapp`; `case_study_view` is `project_view`; and `form_submit` and `service_page_view` were added. The current list is in [measurement-plan.md](measurement-plan.md).

All events come from `frontend/src/lib/analytics.ts`. **No personal data is ever sent**: no names, emails, phone numbers or message text.

| Event | Fires when | Parameters | Mark as key event? |
| --- | --- | --- | --- |
| `generate_lead` | Only after the server confirms the enquiry (HTTP 201 saved or 202 queued), never on a click | `form_id`, `page_path`, `service`, `budget`, `timeline`, `stored` (saved/queued) | **Yes — the only conversion** |
| `form_start` | First focus inside the form (once) | `form_id` | No (funnel step) |
| `form_validation_error` | Submit blocked by browser validation | `form_id`, `fields` (names only) | No |
| `form_submit_error` | Server or network error | `form_id`, `reason` (`server_validation`, `rate_limited`, `server`, `network`) | No |
| `cta_click` | Click on any CTA button (`.btn` link) | `cta_text`, `cta_location` (header, home-hero, services, …), `link_url`, `page_path` | No |
| `email_click` | Click on a `mailto:` link | `location`, `page_path` | Optional secondary |
| `phone_click` | Click on a `tel:` link | `location`, `page_path` | Optional secondary |
| `whatsapp_click` | Click on a `wa.me` or WhatsApp link | `location`, `page_path` | Optional secondary |
| `case_study_view` | A case-study page loads | `case_study` (slug) | No |
| `service_page_engagement` | Reader scrolled 50% of a service page, or spent 30s on it with the tab visible (once per view) | `service`, `trigger` | No |

**Avoiding false leads:**
- A lead is counted only when the server answers 201 (saved) or 202 (queued). Clicks on "Start Your Project" or the submit button, validation errors, failed submissions and honeypot spam (answered with a plain 200) are never leads.
- Identical events within one second are merged, so a double click counts once.

**GA loading:** GA still loads lazily, on the first interaction or after 8 s. Events that happen before it loads are queued and sent after `config`, so nothing is lost or misattributed.

**GA4 admin set-up (manual):**
1. Mark `generate_lead` as a key event.
2. Optionally mark `phone_click`, `email_click` and `whatsapp_click` as secondary key events.
3. Register custom dimensions: `cta_text`, `cta_location`, `service`, `case_study`, `trigger`, `stored`.
4. Build a funnel: `form_start` → `generate_lead`, broken down by `page_path`.

## 6. Needs a person (production content and set-up)

Production content comes from the admin, so the new defaults above appear only where the admin has nothing saved.

1. **Testimonials:** the seed script inserted the three anonymous testimonials into the database. Unpublish or delete them in Admin → Testimonials. Add quotes only from named clients who agreed to be quoted.
2. **Admin → Site content:**
   - Update `homeStats` and `aboutStats`, which probably still say 32+ / 50+ / 98%.
   - Update the hero headline, lede, CTA labels and stat, which probably still say "We build software / worldwide.", "See our work" / "Book a call" and "32 Clients served".
   - Update `cta.homeTitle`, `homeSections.cta.buttonLabel`, and the services and about CTA labels.
   - If the client and repeat-business numbers are real and you can show them, put them back.
3. **WhatsApp:** no WhatsApp link exists on the site, so `whatsapp_click` will stay at zero. If +91 96244 98325 is on WhatsApp, add a `https://wa.me/919624498325` link (the tracking already handles it).
4. **Enquiry emails:** SMTP is still not configured on Render (`/api/health` reports email "off"). Set the `SMTP_*` and `MAIL_TO` variables so every enquiry is emailed to the team.
5. **Deploy:** deploy the backend before or with the frontend. The new form sends new fields and requires a service; an old backend would store the core fields but ignore company, phone and timeline.
6. **Blog CTAs (done):** the blog content clusters in `lib/content-clusters.ts` now use the standard labels (Start Your Project, Discuss Your Requirements, Book a Consultation), and their buttons pre-select the matching service on the form.

## 7. Verification (local)

**API**, tested against the dev backend with no writable database, so enquiries were queued and none were stored:

| Request | Response |
| --- | --- |
| Empty body | 400, with the friendly message for each missing field |
| Bad phone, no service, short message | 400, with the three matching field messages |
| Sent 800 ms after load | 400 "quicker than we expected" |
| Honeypot filled | 200, nothing stored or emailed, logged as "spam blocked" |
| Valid enquiry | 202 queued; the `[lead-fallback]` log line contains company, phone, services, budget, timeline and source |

**Browser:**
- `/contact?service=web-app-eng` pre-selects "Web or mobile app".
- An empty submit shows three errors, focuses Name, and fires `form_start` and `form_validation_error` (no lead).
- An invalid phone shows its error and focuses the field.
- A valid submit shows the success panel with focus on its heading, and `generate_lead` fires once.

**Pages:**
- **Homepage:** the hero, proof line and stats render as described; no testimonials section; no "senior".
- **CTAs:** the AI service page, case study and location page use the standard labels; service CTAs carry `?service=`.
- **Tracking:** events fired as designed — `cta_click` (with locations header / home-hero / services), `email_click`, `phone_click`, `case_study_view` and `service_page_engagement`.
- **Phones:** no horizontal overflow at 360 px on `/`, `/contact`, `/services/web-app-eng`, `/work/zeevan` and `/about`.
- **Console:** no errors.

**Production build (12 November):** `npm run build` passes with all sessions' changes together. Checked on that build at phone width:
- The hero reads "Custom software for growing businesses." with **Start Your Project** and **View Case Studies**.
- The blog CTA on an AI article is **Discuss Your Requirements** → `/contact?service=ai-machine-ml`.
- An empty submit marks name, email and message invalid and focuses Name.
- With the API unreachable, the form shows "We couldn't reach our server just now…" with the email and phone fallback, and no lead event fires.
- `case_study_view` and `cta_click` (location `header`) are recorded.
- There is no horizontal overflow and no console errors.

**Test data note:** one automated test enquiry ("Test Person", test@example.com) reached the local dev backend on port 5001 during this check. Its database was unreachable and email is off, so the enquiry sits only in that process's memory queue. If local MongoDB starts before that backend restarts, it will be saved to the local `novaro` database; delete it in Admin → Leads. Production was not touched.

**Honeypot and analytics:** when the honeypot trips, the server answers with a plain 200. The browser shows the success panel, so bots learn nothing, but `generate_lead` fires only on 201 or 202. Spam is therefore never counted as a lead. Admin → Leads remains the source of truth if GA and the admin ever disagree.

## 8. Next ideas (not implemented)

- Once there is enough traffic, A/B test the hero headline (who-it's-for versus outcome) and the primary CTA label ("Start Your Project" versus "Book a Consultation").
- Add one short, named testimonial or a client logo strip as soon as a client approves it. Both sections appear automatically when content is added in the admin.
- If a cookie or consent banner is introduced, have GA respect it before any events are sent.
