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

# Database (MongoDB — Atlas or local replica set; see backend/.env.example)
cd backend
npm run db:push
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
3. API returns `{ secureUrl, publicId }` stored in Prisma composite fields
4. Public pages use `cloudinaryTransformUrl()` + `next/image`

### Signed uploads

`POST /api/admin/upload/sign` returns server-signed params for direct Cloudinary uploads (API secret stays on server).

## Database

MongoDB via Prisma. Set `DATABASE_URL` in `backend/.env` (see `backend/.env.example`).

**Replica set required:** Prisma + MongoDB needs a replica set for transactions. [MongoDB Atlas](https://www.mongodb.com/atlas) clusters qualify out of the box. For local dev, run MongoDB with `--replSet` and run `rs.initiate()` once.

```bash
cd backend
npm run db:push    # sync schema (no SQL migrations)
npm run db:seed    # seed content + admin user
npm run db:studio  # optional Prisma Studio
```

The `backend/prisma/migrations/` folder is legacy (SQLite) and is not used with MongoDB.

## Scripts

| Command | Where | Description |
|---------|-------|-------------|
| `npm run dev` | root | Frontend + backend |
| `npm run build` | root | Production build both |
| `npm run db:push` | backend | Prisma db push (sync schema) |
| `npm run db:seed` | backend | Seed content + admin user |
| `npm run db:studio` | backend | Prisma Studio |

## Deploy notes

- Set strong `JWT_SECRET`, `ADMIN_PASSWORD`, and Cloudinary credentials
- Use MongoDB Atlas (or another replica-set deployment) in production
- Point `CORS_ORIGIN` to your production frontend URL
- Ensure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` matches your Cloudinary account
- Run `npm run db:push` before first deploy

## Blog (Part 4 — public pages ✅ · Part 5 — admin TipTap editor ✅)

