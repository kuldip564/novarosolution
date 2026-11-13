# Portfolio verification — November 2026

Every claim on `/work` and the four case studies was checked against the client's live site on 11 November 2026, or against this repository. The copy lives in `frontend/src/lib/case-study-content.ts`. Screenshots are in `frontend/public/images/work/<slug>/` and were captured on the same day.

## Evidence per project

| Project | Live URL | Credit in the site footer | Stack (how it was confirmed) | Features confirmed on the live site |
| --- | --- | --- | --- | --- |
| Zeevan | zeevan.shop | "Created by NovaRo Solution" | Expo + Expo Router (Expo reset styles and the `/_expo/static` bundle in the HTML); hosted on Vercel (`server: Vercel`) | Ghee, oil, masala and honey ranges; shop with search, range, category, price, rating and sort filters; sign-in; footer account links (My orders, Rewards, Addresses, Support); "Live tracking" and "Secure checkout" badges |
| KankreG | kankreg.com | "Created by NovaRo Solution" | Expo + Expo Router; Vercel | Promo bar with a code; shop-by-collection (Ghee, Oil, Atta, All); product cards with pack, price, discount and Add; shop filters for category, price and sort; Track Your Order; newsletter; shipping, refund, privacy and terms pages |
| Mr Antidot | mrantidot.com | "Developed by NovaRo Solution" | Next.js (`x-powered-by: Next.js`); Vercel | 10 service pages, each with time, starting price, method, warranty, what's included and FAQs; `/contact?service=…` pre-selects the service (checked on termite-treatment); 8 sectors; team profile pages; blog; gallery; WhatsApp and phone links; login |
| Quadrato Cargo | quadratocargo.com | "Technology partner: NovaRo Solution" | Next.js (`x-powered-by`, `x-nextjs-prerender`); Vercel; Content Security Policy header | Tracking by booking or tracking ID; 4-step booking (route and pickup, sender, recipient, parcel); instant (postal code) or scheduled (date and slot) pickup; tracking ID and QR on receipt; quotes; pricing by coverage zone; register and log in |

## What changed because of this check

- Zeevan and KankreG were tagged **Next.js** in `site-data.ts`. The live sites run on **Expo**, so the tags now say Expo and React Native.
- The figures previously shown as Novaro "results" were the clients' own business claims: Mr Antidot's 8+ years and 24/7 support, and Quadrato Cargo's 180 countries and 10K+ deliveries. Those figures now appear only under "Client background", attributed to the client's website. The results fields hold checkable facts instead, such as "10 service pages" and "4-step booking flow".
- KankreG's "SEO-ready structure" claim was removed. Its pages render only in the browser, and the server HTML has no content.
- The case-study JSON-LD no longer uses `sameAs` for the client's site, because a case study is not the same entity as the client. It now uses `about: Organization`.

## Not published, and why

- **Revenue, traffic, conversion or customer numbers:** we have none from the clients.
- **Delivery dates and project durations:** not recorded anywhere we can check.
- **Lessons learned:** left empty. The field exists (`lessons`) for the team to fill in with something specific and true.
- **Client testimonials on case studies:** none were added.

## Needs a person

- **Fallback testimonials:** the anonymous ones in `site-data.ts` ("Product Lead", "Brand Founder", "Operations Director", all rated 5) can't be traced to a real client. "Brand Founder" says the storefront was rebuilt "with Next.js", which contradicts the live sites. Confirm they are real or remove them.
- **Admin project records:** production's records may still hold the old hooks, tags and results, for example Quadrato's "dispatch flows across 180 countries". The case-study pages and cards now use the verified copy, but the home page still shows the admin hook. Update it in the admin.
- **The development-process steps** in each case study describe workstreams inferred from what shipped. Correct them if the real sequence differed.
- **Zeevan's store returned "Could not load products"** on 11 November 2026: the shop showed 0 items. Worth checking with the client.
- **SEO on the client sites:** Zeevan and KankreG serve an empty HTML shell, so search engines that don't run JavaScript see no content. This is a possible piece of follow-up work for those clients.
