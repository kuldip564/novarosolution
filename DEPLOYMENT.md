# NovaRo Solution Deployment Guide

This project supports:
- **Vercel (recommended in your case)**: frontend + serverless API together.
- **Single Node server**: backend serves `clinte/dist` in production.

## 1) Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+
- MongoDB Atlas connection string
- Atlas Network Access allows your server IP

## 2) Environment Variables

Create `server/.env`:

```env
PORT=5001
CORS_ORIGIN=https://your-domain.com
JWT_SECRET=use-a-strong-random-secret
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1
TRUST_PROXY=1
DEFAULT_ADMIN_ENABLED=false
DEFAULT_ADMIN_NAME=
DEFAULT_ADMIN_EMAIL=
DEFAULT_ADMIN_PASSWORD=
```

Security notes:
- Use a long random `JWT_SECRET` (at least 24+ chars).
- Keep `DEFAULT_ADMIN_ENABLED=false` in production.
- Never commit `server/.env`.

Optional frontend env for separate frontend hosting:

`clinte/.env.production`
```env
VITE_API_URL=https://api.your-domain.com
```

If backend serves frontend from same domain (recommended), keep `VITE_API_URL` empty.

## 3) Vercel Deployment

Project contains Vercel-ready files:
- `vercel.json`
- `api/[...all].js`
- root `package.json` with `vercel-build`

In Vercel dashboard:
1. Import this GitHub repo
2. Framework preset: **Other**
3. Build command: `npm run vercel-build` (already in `vercel.json`)
4. Output directory: `clinte/dist` (already in `vercel.json`)
5. Add environment variables from `server/.env` into Vercel Project Settings
6. Redeploy

## 4) Install Dependencies

```bash
cd server && npm install
cd ../clinte && npm install
```

## 5) Build Frontend

```bash
cd ../server
npm run build
```

This generates `clinte/dist`.

## 6) Start in Production

```bash
cd /path/to/novarosolution/server
npm run start:prod
```

The server will:
- Start API on `PORT`
- Serve frontend static files from `clinte/dist`
- Handle SPA routes by returning `index.html`

## 7) Quick Health Checks

- API: `GET /api/health`
- Site content: `GET /api/site-content`
- Frontend root: `GET /`

## 8) Common Issues

- **Atlas connection fails**: Add server public IP in Atlas Network Access.
- **Frontend blank page**: Ensure `npm run build` completed and `clinte/dist` exists.
- **CORS blocked**: Set `CORS_ORIGIN` to your frontend domain.
- **DNS SRV issues**: Keep `MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1`.
