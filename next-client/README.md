# Next.js SEO Frontend (App Router)

This folder is the production-grade SEO frontend for the existing MERN backend.

## Folder Structure

```text
next-client/
  app/
    blog/loading.tsx
    blog/
      [slug]/page.tsx
      page.tsx
    error.tsx
    layout.tsx
    loading.tsx
    page.tsx
    projects/loading.tsx
    projects/
      [slug]/page.tsx
      page.tsx
    providers.tsx
    robots.ts
    sitemap.ts
    globals.css
  components/
    SEO.tsx
    home/
      CreatorFeedPreview.tsx
      HomePageClient.tsx
  lib/
    api.ts
    seo.ts
  .env.example
  next.config.mjs
  package.json
  tsconfig.json
```

## Rendering Strategy

- Home page: server-rendered with metadata and SEO-visible content.
- Project details: SSG via `generateStaticParams()` + ISR revalidation.
- Blog details: SSG via `generateStaticParams()` + ISR revalidation.
- Project/Blog listings: server components fetching real backend data.

## SEO Features Included

- Dynamic metadata per page (`title`, `description`, `keywords`, Open Graph).
- Canonical URLs via metadata helpers.
- Reusable `SEO` component for JSON-LD schema injection.
- Dynamic `sitemap.xml` and `robots.txt` from App Router metadata routes.
- Clean URL structure (`/projects/[slug]`, `/blog/[slug]`).

## Backend Connection

This Next frontend fetches from Express API:

- `GET /api/site-content`
- `GET /api/creator/feed`
- `POST /api/contact`
- `POST /api/appointments`

All API calls are centralized in `lib/api.ts`.

## Run

```bash
cd next-client
npm install
npm run dev
```

Set environment values from `.env.example` before running.

## Vercel Deploy (Next.js)

1. Create/select a Vercel project.
2. Set **Root Directory** to `next-client`.
3. Add env variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend-domain`
4. Deploy.

Notes:
- `next-client/vercel.json` is included for Next.js build defaults.
- Existing root `vercel.json` in the repository is for the legacy Vite flow.
