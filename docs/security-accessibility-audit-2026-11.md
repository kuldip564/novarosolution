# Accessibility, security and code-quality audit — 11 November 2026

**Scope:** the public site (13 page types), the admin login, the Express API and both dependency trees, on branch `cursor/usa-organic-growth`.

**Method:**
- `npm audit`;
- a scan of the built JavaScript and of git history for secrets;
- a review of the API code (auth, CORS, headers, uploads, validation);
- axe-core 4.14 (WCAG 2.0, 2.1 and 2.2 A/AA plus best practices) on 13 pages in the light theme and 4 in the dark theme;
- scripted keyboard tests (Playwright and Chrome);
- `tsc`, ESLint and an import-graph scan for dead code.

**Target:** WCAG 2.2 AA.

**Status:** all fixes below are implemented and verified locally on a production build, but are **not committed or deployed**.

## Summary

| Severity | Found | Fixed in code | Needs account or infrastructure access |
| --- | --- | --- | --- |
| Critical | 1 | 1 | — |
| High | 4 | 3 | 1 |
| Medium | 9 | 8 | 1 |
| Low | 11 | 8 | 3 |

**After the fixes:**
- axe-core: **0 violations** on all 17 page and theme combinations (before: 6 rule types on 7 pages).
- `npm audit`, production dependencies: **0 vulnerabilities** in the frontend and the backend. Before: frontend 1 critical / 7 high / 28 moderate; backend 4 high.
- ESLint: 3 problems remaining, down from 13 (§4).
- TypeScript: clean, except 2 errors in another session's in-progress file (§4).

## 1. Critical

### C1. Next.js advisories, including a middleware/proxy bypass — fixed

- **Problem:** `next@16.2.9` was affected by about 20 advisories. The most serious is a middleware/proxy bypass in App Router apps built with Turbopack, which is how this site is built. The `/admin` redirect runs in `src/proxy.ts`. Admin data stayed protected, because every `/api/admin/*` route checks the signed session cookie on the server (`requireAuth`), but the page-level guard could be bypassed. The bundled `sharp` and `postcss` were also vulnerable.
- **Fix:** upgraded to `next@16.4.6` and `eslint-config-next@16.4.6`, which also brings patched `sharp` and `postcss`. A production build succeeds and every page was re-tested.

## 2. High

### H1. Vulnerable dependencies (TipTap, ProseMirror, zod, dev tooling) — fixed

- **TipTap and ProseMirror** (admin blog editor): XSS on paste and prototype pollution. Upgraded to `@tiptap/*@3.33.1`, with `@tiptap/core` and `@tiptap/pm` pinned to match.
- **zod:** memory exhaustion on oversized collections. Upgraded to `4.6.7`; the backend was already on `4.6.7`.
- **Dev-only tools** (`concurrently`/`shell-quote` critical, `brace-expansion`, `js-yaml`, `browserslist`, `nanoid`, `source-map-js`): fixed with `npm audit fix`.
- **Unused package:** `@hookform/resolvers` removed.

### H2. Backend Prisma advisory — fixed with an override

- **Problem:** `prisma` and `@prisma/config` 6.19.3 pin `deepmerge-ts@7.1.5` (stack exhaustion on recursive input). It runs only when the Prisma CLI loads its config at build time, so visitors couldn't reach it.
- **Fix:** an npm `overrides` entry forces `deepmerge-ts@8.0.2`. `prisma validate` and `prisma generate` still succeed, and the backend type-checks. Backend audit: 0.
- **Remove the override** once you upgrade to a Prisma release that ships the fix. Check that release's MongoDB support first, because Prisma 7 changed it.

### H3. No security headers on the website — fixed

- **Problem:** the site sent only HSTS (from Vercel) plus `X-Powered-By: Next.js`. There was no clickjacking protection, which matters most on the admin login, and no `nosniff`, referrer or permissions policy, and no CSP.
- **Fix (`next.config.ts`):**
  - Enforced on every route: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a `Permissions-Policy` that turns off camera, microphone, geolocation, payment, USB and topics, `Cross-Origin-Opener-Policy: same-origin`, and an enforced CSP of `frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'`.
  - The `X-Powered-By` header is removed.
  - A full CSP is sent as `Content-Security-Policy-Report-Only` in production. The browser logs anything it would block, but blocks nothing. Running it against 8 pages surfaced the Google Analytics and Ads endpoints; those were added, and there are now **0 violations** locally.
- **To enforce the full CSP:** watch the browser console on production for a while, then move the policy into the enforced header (§6).

### H4. Google Ads counts contact-page visits as conversions — needs account access

- **Problem:** GA fires `ads_conversion_Contact_Us_1` on every `/contact` page view. Google Ads therefore treats each visit to the contact page as a conversion, which inflates conversion counts and misguides bidding.
- **Fix (in your accounts):** in GA4 and Google Ads, replace it with the `generate_lead` event, which fires only after the server confirms an enquiry.

## 3. Medium

| # | Finding | Fix |
| --- | --- | --- |
| M1 | **No skip link** on any page (WCAG 2.4.1). Keyboard users tabbed through 10 header items on every page. | "Skip to main content" is now the first Tab stop on every public page. It is hidden until focused and targets the page content (`#main-content`). |
| M2 | **Team profile dialog didn't return focus** to the card that opened it after closing (WCAG 2.4.3). | Focus now goes back to the opening button. Tested: the dialog is `role="dialog"` and `aria-modal`, focus moves in, Tab stays inside, Escape closes, and focus returns. |
| M3 | **Team cards: accessible name didn't match the visible label** (WCAG 2.5.3). The button said "View profile for …" while showing the name, role and skills. A heading inside a button is also invalid HTML. | The member's name inside the `<h3>` is now the button, and a transparent overlay keeps the whole card clickable. The focus ring is on the card frame. |
| M4 | **Colour contrast**, light theme: service card numbers at 3.94:1. | Now use `--text-soft` (about 7.5:1). |
| M5 | **Colour contrast**, dark theme: muted text (`--slate` `#5c6b85`) at 3.3–3.7:1 on dark surfaces, used in 42 places (privacy note, industries line, distances…); blue labels on pale cards at 4.49:1. | Dark `--slate` is now `#8391a8` (4.5:1 or better on every dark surface); the labels on pale cards use `#1d4ed8`. |
| M6 | **JSON-LD script breakout:** structured data used `JSON.stringify` inside `<script>`, which doesn't escape `</script>`. Admin-edited text could end the tag and inject HTML. | A new `lib/json-ld.ts` escapes `<`, `>` and `&` (and U+2028/2029). It is used on 12 pages and components; the JSON still parses to the same data. The blog article page is the other session's file and still uses `JSON.stringify` (see the note in §6). |
| M7 | **Uploaded SVGs** (local upload fallback) were allowed and served under the site's own domain via the `/uploads` proxy. An SVG containing script, opened directly, could run on the site's origin. | `/uploads` is served with `Content-Security-Policy: default-src 'none'; … sandbox` and `nosniff`, and dotfiles return 404. Verified with a test SVG containing `<script>`. |
| M8 | **Admin password changes revert on restart:** "Change password" in the admin is reset to `ADMIN_PASSWORD` from the environment on every server start. A leaked password can't be rotated from the admin. | **Needs account access:** change `ADMIN_PASSWORD` (and `JWT_SECRET`, if you suspect a leak) in the Render environment. Making in-admin changes permanent is a code change to the start-up sync, worth doing next. |
| M9 | **Test traffic in GA:** GA loaded on any host, so local builds, previews and the onrender.com copy reported visits to the real property. My own test runs today were recorded too. | GA now loads only on `novarosolution.com` and its subdomains. In GA4, also filter out hostname `localhost` and `*.onrender.com` for past data. |

## 4. Low

| # | Finding | Status |
| --- | --- | --- |
| L1 | Invalid ARIA: location pills were `<a role="listitem">`. | Fixed: a real `<ul>`/`<li>` list. |
| L2 | Four "Learn more" links on `/services` didn't say which service. | Fixed: each adds hidden text, e.g. "Learn more about Web & App Engineering". The second button became "Discuss Your Requirements" and pre-selects the service on the form. |
| L3 | The admin login had no `main` landmark, and the public login page named `backend/.env`, `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Its error message also mentioned `DATABASE_URL`. | Fixed: wrapped in `<main>`, internal names removed, neutral error text. |
| L4 | The real Atlas cluster hostname appeared in `docs/production-runbook.md`. | Fixed: replaced with `cluster0.xxxxx…`. The git history check found only placeholder credentials and no secrets committed. |
| L5 | Dead code: 16 files imported nowhere (old Hero, Marquee, Process, ServiceRows, ServicesGrid, Stats, TeamSection, WhySection, WorkGrid, SiteBackground, Skeleton, AnimatedLink, the bgfx canvas, design-tokens, motion). | Fixed: deleted. An import-graph scan now finds no dead modules. They remain in git history if ever needed. |
| L6 | Lint errors in shared components: setting state inside an effect (Header, LegalDocument), reading a ref during render (SplitText), unused imports (AboutExperience, EmptyState), an unescaped apostrophe (privacy policy). | Fixed without changing behaviour. The mobile menu still closes on navigation (now without an extra render), the legal page "back to top" button still works, and the headline animation is unchanged. |
| L7 | ESLint, 2 remaining errors, in the admin blog editor (`admin/(panel)/blog/page.tsx`, `BlogPostEditorPage.tsx`): data loading that sets state inside an effect. | Not changed: another session is working on the blog. Functionally fine; tidy them up when that work lands. |
| L8 | ESLint, 1 remaining warning: react-hook-form's `watch()` (contact form) can't be optimised by the React Compiler. | Known library limitation; no change. |
| L9 | 7 moderate advisories in ESLint's TypeScript tooling (dev only, never shipped). | Held back by `eslint-config-next`'s version range. Clears when it updates. |
| L10 | The backend has no linter configured. | Recommendation: add ESLint with the same TypeScript rules as the frontend. |
| L11 | Admin sessions are 7-day signed cookies (`httpOnly`, `secure` in production, `SameSite=Lax`). Logout clears the cookie but can't revoke a stolen token before it expires. | Acceptable for a single-admin site. If more admins are added, shorten the lifetime or add a token version to the user record. |

## 5. Checked and found sound

- **Secrets:**
  - The frontend reads only `NEXT_PUBLIC_*` variables (API URL, site URL, Cloudinary cloud name, search-console verification codes).
  - No credentials appear in the built JavaScript; the scan looked for MongoDB URLs, JWT and SMTP secrets, Cloudinary secrets, AWS keys and private keys.
  - `.env` files are git-ignored, and the git history contains only placeholder credentials.
- **Admin authentication:**
  - bcrypt with cost 12; the JWT secret must be at least 32 characters.
  - Login is rate-limited to 20 per 15 minutes, with an account lockout.
  - Every admin API route uses `requireAuth`, and no endpoint returns password hashes.
- **CSRF:** the admin cookie is `SameSite=Lax` and the API only parses JSON bodies, so cross-site forms can't act as an admin. CORS uses an explicit allowlist with credentials.
- **API headers:** Helmet on every API response; `x-powered-by` is disabled; JSON body limit is 512 KB.
- **Input validation:**
  - The contact form is validated with zod on the server: lengths, email and phone formats, and a required service.
  - Spam protection: honeypot, a minimum fill time, a link limit, and 5 requests per minute per IP.
  - Admin CSV export is protected against spreadsheet formulas; admin CRUD routes use zod schemas.
- **Output encoding:** React escapes all text. The only raw HTML is blog content, which `sanitize-html` cleans on save and on read with an allowlist of tags, attributes and schemes, and which forces `rel="noopener noreferrer"` on links.
- **Uploads:** admin only; images only by MIME type; 8 MB limit; random filenames; Cloudinary signed uploads when configured.
- **Keyboard:** visible focus rings on every element tested. The mobile menu is a modal dialog: focus moves in and is trapped, Escape closes it and returns focus, and page scrolling is locked. FAQ accordions use `aria-expanded`.
- **Forms:** labels linked to inputs; errors linked through `aria-describedby`, announced with `role="alert"` and focused on submit; the success state is announced and focused.
- **Images, structure and motion:** every image has alt text; each page has one `h1` and no skipped heading levels; `prefers-reduced-motion` turns off scroll effects, WebGL, the custom cursor and entrance animations.
- **Responsiveness:** no horizontal overflow at 360 px on the pages tested.

## 6. Needs account or infrastructure access

1. **Deploy** this branch (frontend on Vercel, backend on Render). Until then the live site still runs the vulnerable Next.js 16.2.9 and has no security headers.
2. **Google Ads / GA4:** replace the page-view conversion `ads_conversion_Contact_Us_1` with `generate_lead` (H4), and add hostname filters for `localhost` and `onrender.com` (M9).
3. **Render environment:**
   - Rotate `ADMIN_PASSWORD`; it's the only way to change it permanently (M8).
   - Make sure `JWT_SECRET` is a long random value.
   - Set `CORS_ORIGIN` to exactly the production origins.
4. **Enforce the full CSP:** after deploying, open the site's main pages and the admin with DevTools, look for "[Report Only]" messages, and allowlist anything legitimate. Then rename `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in `next.config.ts`. The admin's direct Cloudinary uploads (`api.cloudinary.com`) are already allowed.
5. **HSTS preload:** consider `includeSubDomains; preload` on Vercel, but only once every subdomain serves HTTPS.
6. **Blog items (done on 12 November):** see §7.

## 7. Re-check on 12 November 2026

Run again after the portfolio, case-study, service-page, article-template, performance and conversion changes landed, on a fresh production build of everything together.

**Fixed in this pass**

| Item | Change |
| --- | --- |
| M6 (remaining page) | The blog article page now writes its structured data with `jsonLdString()`. No page uses plain `JSON.stringify` for JSON-LD any more. |
| L7 | The two admin blog lint errors are fixed. The post list now waits 200 ms after typing before it searches (one request per pause instead of one per key), and the editor's initial load is cancelled if the page is left first. |
| Build blocker | The type errors in `lib/content-clusters.ts` are fixed. `next build` passes with no file excluded. |

**Results**

| Check | Result |
| --- | --- |
| Production build | Passes |
| TypeScript (frontend and backend) | 0 errors |
| ESLint (frontend) | 0 errors, 1 warning (the known react-hook-form `watch()` notice, L8) |
| `npm audit`, production dependencies | 0 vulnerabilities in both apps. 7 moderate remain in dev-only lint tooling (L9). |
| axe-core 4 (WCAG 2.0–2.2 A/AA and best practices) | **0 violations** on 18 pages in the light theme and 6 in the dark theme. That includes the new portfolio, two case studies, two service pages and two articles. One `h1` on every page. |
| Keyboard | "Skip to main content" is the first Tab stop and moves focus to the content. Portfolio filters work with Enter, set `aria-pressed`, and announce "Showing 2 of 4 projects". Every new link style (portfolio cards, case-study and service jump links, related-service cards, article CTA) shows a 2px focus outline. |
| Mobile menu | Opens as a modal dialog (`aria-modal`), takes focus, keeps focus inside through 14 Tab presses, locks page scroll, closes on Escape and returns focus to the menu button. |
| Reduced motion | With `prefers-reduced-motion`: no WebGL canvas, no header entrance animation, and no content left hidden. |
| Security headers (site) | Present on `/` and `/admin/login`: `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, the enforced CSP (`frame-ancestors 'none'` and so on) and the report-only full CSP. No `X-Powered-By`. |
| Secrets in built files | No credential values. The only match is the variable *names* `ADMIN_EMAIL` / `ADMIN_PASSWORD` in help text on the admin settings page (informational; no values). |
| Frontend environment variables | Only `NEXT_PUBLIC_*` values plus `API_PROXY_TARGET` and `NODE_ENV`, both read on the server only. |
| API (local) | An unknown origin gets no `Access-Control-Allow-Origin`; the allowed origin gets it with credentials. Admin routes without a session cookie return 401. Helmet headers are present. |

**New code reviewed**

- **Article enhancer** (`lib/article-enhance.ts`): works only on HTML the API has already sanitised. It adds heading ids made of `a–z`, `0–9` and `-`, and removes `target`/`rel` from links to our own pages. Source links are limited to `http(s)` and rendered by React, so their text is escaped.
- **Contact form validator** (`lib/contact-form-schema.ts`): the browser check is now hand-written; the server still validates every field with zod, so nothing relies on the browser.
- **Map embed** (`LazyMap`): loads the Google Maps iframe only when scrolled near. The report-only CSP already lists the map origins.

**Tests:** neither app has an automated test suite (no `test` script). The checks above (build, types, lint, dependency audit, axe, scripted keyboard tests) are what could be run. Adding API tests for the contact route and the admin auth guard is the most valuable next step.

**Still needs account or infrastructure access:** items 1–5 above are unchanged.
