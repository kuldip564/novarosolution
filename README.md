# Novaro Solution

Monorepo: **Next.js frontend** + **Express backend** + **Prisma DB** + **Cloudinary media**.

## Structure

```
frontend/     Next.js 16 public site + /admin panel
backend/      Express API, Prisma, Cloudinary uploads
figma/        Static HTML reference (legacy)
```

## Quick start

```bash
# Install root + workspaces
npm install
cd backend && npm install && cd ../frontend && npm install && cd ..

# Backend env
cp backend/.env.example backend/.env
# Set JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, optional CLOUDINARY_*

# Frontend env
cp frontend/.env.example frontend/.env.local
# Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (same as backend cloud name)

# Database
cd backend
npm run db:migrate
npm run db:seed

# Run both apps (from repo root)
cd ..
npm run dev
```

- Public site: http://localhost:3000 (or 3001 if 3000 is busy)
- Admin panel: http://localhost:3000/admin/login
- API health: http://localhost:5001/api/health

## First admin login

Credentials come from `backend/.env`:

| Variable | Default |
|----------|---------|
| `ADMIN_EMAIL` | `admin@novarosolution.com` |
| `ADMIN_PASSWORD` | `ChangeMeNow!123` |

The backend syncs these on every startup. Change them before production.

## Cloudinary

All CMS images are stored as `{ secureUrl, publicId }` in the database.

**Backend** (secret — never expose to browser):

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Frontend** (public — for `f_auto,q_auto` transforms):

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

### Upload flow

1. Admin selects image → `POST /api/admin/upload` (auth required)
2. Backend uploads to Cloudinary folder `novaro/` (or local `/uploads` if Cloudinary unset)
3. API returns `{ secureUrl, publicId }` stored in Prisma JSON fields
4. Public pages use `cloudinaryTransformUrl()` + `next/image`

### Signed uploads

`POST /api/admin/upload/sign` returns server-signed params for direct Cloudinary uploads (API secret stays on server).

## Database

Local dev uses SQLite (`backend/prisma/dev.db`). For production, set:

```
DATABASE_URL="postgresql://user:pass@host:5432/novaro?schema=public"
```

Then run `npm run db:migrate` and `npm run db:seed` in `backend/`.

## Scripts

| Command | Where | Description |
|---------|-------|-------------|
| `npm run dev` | root | Frontend + backend |
| `npm run build` | root | Production build both |
| `npm run db:migrate` | backend | Prisma migrate |
| `npm run db:seed` | backend | Seed content + admin user |
| `npm run db:studio` | backend | Prisma Studio |

## Deploy notes

- Set strong `JWT_SECRET`, `ADMIN_PASSWORD`, and Cloudinary credentials
- Use PostgreSQL in production
- Point `CORS_ORIGIN` to your production frontend URL
- Ensure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` matches your Cloudinary account
- Run migrations before first deploy

## Blog (Part 4 — public pages ✅ · Part 5 — admin TipTap editor ✅)

