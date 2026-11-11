# Performance report — November 2026

This report covers the 8 key pages on branch `cursor/usa-organic-growth`, measured before and after the performance changes on 11 November 2026. Every number below comes from an actual run, and the conditions are listed with each set. **No Core Web Vitals pass is claimed:** there is no real-user (field) data for this site yet (see §2).

## 1. Testing conditions

| | Local lab runs (before and after) | PageSpeed Insights (live site) |
| --- | --- | --- |
| What was tested | A production build of this branch (`npm run build`, then `next start -p 3100`) on this Mac | https://www.novarosolution.com/, which runs the older `main` commit, not this branch |
| Tool | Lighthouse 12.8.2 CLI, headless Chrome, performance category only | PSI website, Lighthouse 13.6.0, HeadlessChromium 157 |
| Mobile | Default preset: emulated Moto G Power, simulated slow 4G, 4× CPU slowdown | Same profile (Slow 4G throttling) |
| Desktop | `--preset=desktop` | PSI desktop profile |
| Runs | 3 per page per form factor; medians reported | 1 run each, homepage only |
| Pages | `/`, `/about`, `/services`, `/services/web-app-eng`, `/work`, `/work/zeevan`, `/blog`, `/contact` | `/` |

**How to read the numbers**
- **Comparing local runs:** they are served from localhost with near-zero time to first byte, and this Mac renders WebGL on a GPU. So the local before and after runs are comparable with each other, but **not** with PageSpeed Insights.
- **Why PSI covers only the homepage:** the PageSpeed Insights API rejected every call with HTTP 429, because the shared daily quota for keyless use was exhausted. The homepage was therefore run through the PSI website instead.
- **Backend data:** the local server ran without the backend API, so pages rendered the built-in default content. Production renders content from the admin, so its HTML and images may differ slightly.

## 2. Live site — PageSpeed Insights (11 Nov 2026, before any of these changes)

| Homepage | Score | FCP | LCP | TBT | CLS | Speed Index |
| --- | --- | --- | --- | --- | --- | --- |
| Mobile | 96 | 1.7 s | 1.7 s | 120 ms | 0.02 | 4.0 s |
| Desktop | 65 | 0.4 s | 1.4 s | **1,220 ms** | 0 | 1.5 s |

- **Desktop diagnostics:** 9.1 s of main-thread work, 20 long tasks, 305 KiB of unused JavaScript and 21 KiB of unused CSS.
- **Field data (CrUX):** "No Data" for both the URL and the origin, on mobile and desktop. The site doesn't yet have enough Chrome traffic for real-user Core Web Vitals, so the 75th-percentile LCP, INP and CLS **cannot be evaluated**. Lab numbers are not a substitute for that data.

## 3. Lab results — before → after (median of 3)

### Mobile

| Page | Score | FCP (s) | LCP (s) | TBT (ms) | CLS | Speed Index (s) |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 91 → 91 | 1.36 → 1.36 | 3.44 → 3.42 | 40 → 45 | 0.000 → 0.000 | 1.63 → 1.59 |
| `/about` | 88 → 88 | 1.36 → 1.35 | 3.95 → 3.93 | 44 → 38 | 0.000 → 0.000 | 1.82 → 1.84 |
| `/services` | 86 → 86 | 2.48 → 2.48 | 3.69 → 3.67 | 29 → 18 | 0.000 → 0.000 | 2.48 → 2.48 |
| `/services/web-app-eng` | 86 → 87 | 1.81 → 1.81 | 4.09 → 3.95 | 16 → 16 | 0.000 → 0.000 | 1.81 → 1.81 |
| `/work` | 79 → **89** | 1.20 → 1.20 | 5.71 → **3.79** | 7 → 4 | 0.000 → 0.000 | 1.51 → 1.89 |
| `/work/zeevan` | 82 → 86 | 1.35 → 1.36 | 4.81 → 4.13 | 31 → 15 | 0.000 → 0.000 | 1.35 → 1.36 |
| `/blog` | 90 → 89 | 1.35 → 1.36 | 3.61 → 3.63 | 4 → 9 | 0.000 → 0.000 | 1.35 → 1.36 |
| `/contact` | 85 → 87 | 1.80 → 1.81 | 4.23 → 3.84 | 15 → 33 | 0.000 → 0.000 | 1.81 → 1.81 |

Transferred KB on mobile:

| Page | Total | JavaScript | Images | CSS | Fonts | Third-party |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 660 → 602 | 350 → 291 | 32 → 32 | 40 → 40 | 156 → 156 | 0 → 0 |
| `/about` | 449 → 449 | 266 → 266 | 34 → 34 | 39 → 39 | 73 → 73 | 0 → 0 |
| `/services` | 426 → 427 | 257 → 258 | 23 → 23 | 39 → 39 | 73 → 73 | 0 → 0 |
| `/services/web-app-eng` | 643 → 561 | 349 → 286 | 31 → 12 | 41 → 41 | 156 → 156 | 0 → 0 |
| `/work` | 1,242 → **618** | 264 → 264 | 826 → **201** | 39 → 39 | 73 → 73 | 0 → 0 |
| `/work/zeevan` | 728 → 504 | 345 → 281 | 221 → 60 | 39 → 39 | 73 → 73 | 0 → 0 |
| `/blog` | 443 → 444 | 260 → 261 | 35 → 35 | 34 → 35 | 73 → 73 | 0 → 0 |
| `/contact` | 1,012 → **487** | 762 → 260 | 24 → 3 | 34 → 35 | 156 → 156 | 461 → **0** |

### Desktop

| Page | Score | FCP (s) | LCP (s) | TBT (ms) | CLS | Speed Index (s) |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 95 → 99 | 0.33 → 0.32 | 1.47 → **0.87** | 1 → 0 | 0.000 → 0.000 | 0.69 → 1.11 |
| `/about` | 98 → 100 | 0.33 → 0.33 | 1.06 → 0.74 | 0 → 0 | 0.000 → 0.000 | 0.48 → 0.53 |
| `/services` | 99 → 100 | 0.33 → 0.33 | 1.00 → 0.73 | 0 → 0 | 0.000 → 0.000 | 0.48 → 0.52 |
| `/services/web-app-eng` | 96 → 100 | 0.45 → 0.45 | 1.37 → 0.79 | 0 → 0 | 0.000 → 0.000 | 0.51 → 0.55 |
| `/work` | 93 → 100 | 0.50 → 0.28 | 1.73 → 0.74 | 0 → 0 | 0.000 → 0.000 | 0.51 → 0.51 |
| `/work/zeevan` | 99 → 100 | 0.32 → 0.33 | 0.93 → 0.75 | 0 → 0 | 0.000 → 0.000 | 0.46 → 0.49 |
| `/blog` | 98 → 100 | 0.32 → 0.33 | 1.02 → 0.73 | 0 → 0 | 0.000 → 0.000 | 0.54 → 0.55 |
| `/contact` | 89 → 100 | 0.37 → 0.37 | 2.17 → **0.79** | 0 → 0 | 0.000 → 0.000 | 0.65 → 0.56 |

Transferred KB on desktop:

| Page | Total | JavaScript | Images | CSS | Fonts | Third-party |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 879 → 820 | 524 → 465 | 50 → 50 | 49 → 49 | 156 → 156 | 0 → 0 |
| `/about` | 727 → 663 | 506 → 443 | 34 → 34 | 45 → 45 | 73 → 73 | 0 → 0 |
| `/services` | 719 → 656 | 506 → 443 | 29 → 29 | 45 → 45 | 73 → 73 | 0 → 0 |
| `/services/web-app-eng` | 834 → 750 | 517 → 454 | 31 → 10 | 47 → 47 | 156 → 156 | 0 → 0 |
| `/work` | 1,543 → **821** | 517 → 453 | 826 → 166 | 48 → 48 | 73 → 73 | 0 → 0 |
| `/work/zeevan` | 926 → 692 | 517 → 453 | 221 → 50 | 48 → 48 | 73 → 73 | 0 → 0 |
| `/blog` | 766 → 695 | 524 → 461 | 52 → 44 | 45 → 45 | 73 → 73 | 0 → 0 |
| `/contact` | 1,259 → **711** | 944 → 443 | 47 → 3 | 45 → 45 | 156 → 156 | 484 → **0** |

Desktop JavaScript is still higher than mobile because desktop also downloads three.js, but it now arrives after the load event (§6).

### What the observed timings show

On desktop, the moment the largest element was **actually painted** moved from about 1.2–2.6 s to about 0.1–0.2 s after navigation. Examples:
- `/services/web-app-eng`: 1,178 → 102 ms
- `/work`: 1,188 → 101 ms
- `/contact`: 2,582 → 97 ms

Before, page headers and the remounted hero waited for JavaScript. Now they paint with the HTML.

On mobile, the LCP Lighthouse **simulates** (3.4–4.1 s on most pages) barely moved, although the observed LCP now matches FCP. In the simulated slow-4G model, the LCP still sits behind the shared JavaScript and fonts that load before it (§7).

## 4. Bundle size comparison

Initial JavaScript is the scripts referenced by each page's HTML, gzip -9, from the build output:

| Page | Before | After |
| --- | --- | --- |
| `/` | 275 KB | 275 KB |
| `/about` | 276 KB | 276 KB |
| `/services` | 267 KB | 268 KB |
| `/services/web-app-eng` | 263 KB | 263 KB |
| `/work` | 264 KB | 264 KB |
| `/work/zeevan` | 263 KB | 263 KB |
| `/blog` | 263 KB | 263 KB |
| `/contact` | **333 KB** | **270 KB** |

Other pages also download less JavaScript, even though their initial HTML is unchanged. Before, every page also prefetched the 73 KB contact chunk with zod. After, the contact page's own scripts total about 17 KB gzip across two chunks (9.4 KB + 7.5 KB). That is why transferred JavaScript fell by about 60 KB on most pages.

Largest shared chunks after the change:

| Chunk | Size (gzip) |
| --- | --- |
| React DOM | 69 KB |
| framer-motion | 43 + 17 + 13 KB |
| Two app/runtime chunks | 39 KB each |
| three.js (desktop only, after load) | 129 KB |
| TipTap (admin only) | 134 KB |

## 5. Largest bottlenecks found

1. **Desktop WebGL on every page:**
   - The three.js background (about 129 KB gzip) started about 180 ms after load and rendered the full scene at the display refresh rate, with no frame cap.
   - On machines without a GPU (as in PSI's test environment), Chrome rasterises it on the CPU. That is the 1,220 ms TBT, 9.1 s of main-thread work and 20 long tasks PSI measured on desktop.
2. **The whole page remounted after hydration on desktop.** Once the motion settings resolved, the route template swapped a plain fragment for a framer-motion `opacity: 0` wrapper. At the same moment, the motion provider swapped its fragment for `<ReactLenis>`. The full tree mounted twice and faded in from transparent.
3. **Page headers were hidden until JavaScript ran.** The `.pagehead` content and the services and about intros were `opacity: 0` until JavaScript added `.in`, with a CSS fallback after 0.5 s. That delayed LCP on every inner page.
4. **Project images were never optimised.** The `?v=4` cache-busting query made the image component set `unoptimized`, so 1,024×1,024 JPEGs of about 230 KB each went to every screen. `/work` alone moved 826 KB of images.
5. **The map loaded on page load.** The Google Maps embed on `/contact` pulled about 460 KB of third-party script as soon as the page loaded.
6. **zod in the public bundle.** It was in the contact chunk (about 73 KB gzip), and the chunk was prefetched from every page.
7. **The homepage hero kept timers and remounts.** A 30 Hz `setInterval` polled mouse position, and the hero copy (the LCP text) switched between two wrappers after hydration.
8. **The services LCP image was lazy-loaded.** On desktop, the service-page intro image was a plain `<img loading="lazy">`, yet it was the LCP element.

## 6. Optimisations implemented

- **Route transitions.** `app/template.tsx` no longer uses framer-motion or swaps wrappers. The first page renders exactly as the server sent it, and later client navigations get a 0.38 s CSS fade-and-rise, turned off under `prefers-reduced-motion`.
- **Smooth scrolling (Lenis).** It is now mounted *beside* the page, not around it, using Lenis's root store, so switching it on after hydration doesn't remount the tree. The provider no longer runs framer's per-frame loop: Lenis uses `autoRaf`, and scroll position is published through `useLenis`.
- **Page headers visible on first paint.** `.pagehead`, `.hero`, `.services-intro__head` and `.about-intro__head` reveals render at full opacity. Their entrance is now a transform-only slide that doesn't delay LCP, also turned off under reduced motion.
- **Homepage hero:**
  - One stable wrapper around the hero copy, so the LCP text is never remounted.
  - The 30 Hz polling became a `mousemove` listener throttled with `requestAnimationFrame`.
- **Deferred decorative effects.** The three.js background, the hero's 3D mark and the custom cursor start only after `window.load` plus an idle callback, through the new `useAfterLoad` hook.
- **WebGL background loop:**
  - It is capped at 30 fps, with time scaled so the motion speed is unchanged.
  - It stops completely while the tab is hidden and resumes when the tab is visible again.
- **No WebGL on software renderers.** SwiftShader, llvmpipe and other renderers without a GPU are treated as "no WebGL", so the scene never runs on the CPU. The CSS background still shows.
- **No zod in the public contact form.** It uses a hand-written validator with the same rules and messages; the API still validates on the server. The contact page's initial JavaScript fell from 333 KB to 270 KB gzip, and the chunk is no longer prefetched site-wide.
- **Map loads on scroll.** The Google Maps embed mounts only when it scrolls within 200 px of view, and the styled placeholder shows until then.
- **Project images optimised.** The local `/images/work/*.jpg?v=4` files now go through the Next image optimizer with a `srcset`. Example: `zeevan.jpg`, 223 KB JPEG → 48 KB AVIF at 640 px.
- **Cloudinary images get a `srcset`.** They now use a loader, so phones get a phone-sized file instead of a single fixed-width image.
- **Service-page intro image.** It uses `next/image`, loads eagerly (it can be the LCP element) and is sized to its column.

**Already in good shape:**
- Fonts are self-hosted WOFF2 through `next/font`, with `font-display: swap` and size-adjusted fallbacks, and only the two latin subsets are preloaded.
- Static assets are served with `Cache-Control: public, max-age=31536000, immutable` and Brotli on Vercel.
- HTML is served with `max-age=0, must-revalidate`, and no cache rules were added for dynamic, form or admin routes.

## 7. Verification on the local build (after the changes)

| Check | Result |
| --- | --- |
| Inner page H1 and lede visible without JavaScript (`/services/web-app-eng`, `/work`, `/about`, `/contact`, `/work/zeevan`) | Visible at full opacity |
| Same headers 50 ms after DOMContentLoaded, with JavaScript | Visible at full opacity |
| Client-side navigation (About → Services → Work) | No full reload (window state kept); `.route-shell--enter` animation runs |
| Contact form, empty submit | All three messages shown: "Please enter your name (at least 2 characters).", "Please enter a valid email address." and "Tell us a bit more — at least 10 characters." An invalid email is still flagged. No valid form was submitted. |
| Map on `/contact` | No iframe and 0 map requests on load; iframe present after scrolling near it |
| Images on `/work` | Served from `/_next/image?url=/images/work/…jpg?v=4&w=828&q=75` |
| Desktop effects, built-in browser with a GPU (ANGLE Metal, Apple M3) | Load event ends at 71 ms; three.js requested at about 1.0 s; background canvas, hero canvas, custom cursor and `html.lenis` all present by 6 s |
| Lenis smooth scroll | A 600 px wheel scroll eases over about 1.2 s (50 distinct positions); the in-page FAQ link lands just below the header |
| Width 360 px, all 8 pages | No horizontal overflow |
| Console | No errors on all 8 pages |
| `prefers-reduced-motion: reduce` | Header and route animations show `none`; all reveals visible; no Lenis; no WebGL background or cursor |

## 8. Remaining issues

1. **Mobile LCP is still 3.4–4.1 s in the lab, inside Google's "needs improvement" band, on most pages.** The real paint now happens at FCP, but the slow-4G simulation counts the shared JavaScript (about 260–290 KB) and fonts that load before it. The next real gains:
   - Remove framer-motion from the shared bundle.
   - Trim the latin-ext font described below.
2. **framer-motion is still in the shared bundle,** at roughly 60–75 KB gzip across three chunks. It is used by the Header mobile menu, `Button`, `MotionConfig` in the provider, and `Parallax` in every page header. Moving these to CSS (or lazy-loading the menu) would take it off most pages.
3. **`Button` creates two motion values and two springs per instance,** even on touch devices where the magnetic effect is off.
4. **Unused CSS.** `globals.css` is large; PSI reports about 21 KB of unused CSS per page, and Lighthouse about 13 KB on the homepage.
5. **An 84 KB Inter latin-ext font** downloads on pages that show the ₹ sign (homepage, service pages, contact), because ₹ falls in the latin-ext range.
6. **Some above-the-fold text still waits for JavaScript:**
   - Headings split by `SplitText` outside the hero.
   - Content in a plain `<Reveal>` above the fold. For example, the `/services` intro subline (`<Reveal delay={0.08}>`, not inside `.services-intro__head`) is `opacity: 0` until JavaScript runs, and it is the mobile LCP element on `/services`.
7. **`/it-services` still uses a plain `<img>`** for its 1,280×720 hero instead of `next/image`.
8. **Small lab regressions, within or near run-to-run noise:**
   - Desktop homepage Speed Index 0.69 → 1.11 s, because the 3D mark now appears after load. Still in the "good" range.
   - `/work` mobile Speed Index 1.51 → 1.89 s.
   - `/contact` mobile TBT 15 → 33 ms.
   - `/blog` mobile score 90 → 89.
9. **No field data.** Set up Search Console, then check CrUX (PageSpeed Insights or the Search Console Core Web Vitals report) once traffic is enough to report. Do not claim the site passes Core Web Vitals until it does.
10. **Not live yet.** None of this reaches users until the site is redeployed from this branch. After deploying, re-run PageSpeed Insights on production for the same 8 pages, mobile and desktop.

Raw data: Lighthouse JSON for every run (`lh/before/`, `lh/after/`), the per-page bundle measurements (`bundle-before.txt`, `bundle-after.txt`) and the summariser scripts are in the session scratchpad folder `perf/`. They are not committed to the repository.
