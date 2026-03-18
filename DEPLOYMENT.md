# NovaRo Solution Deployment Guide

This project deploys as a single Node.js service:
- Backend API: `server/`
- Frontend build: `clinte/dist` served by backend in production

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
```

Optional frontend env for separate frontend hosting:

`clinte/.env.production`
```env
VITE_API_URL=https://api.your-domain.com
```

If backend serves frontend from same domain (recommended), keep `VITE_API_URL` empty.

## 3) Install Dependencies

```bash
cd server && npm install
cd ../clinte && npm install
```

## 4) Build Frontend

```bash
cd ../server
npm run build
```

This generates `clinte/dist`.

## 5) Start in Production

```bash
cd /path/to/novarosolution/server
npm run start:prod
```

The server will:
- Start API on `PORT`
- Serve frontend static files from `clinte/dist`
- Handle SPA routes by returning `index.html`

## 6) Quick Health Checks

- API: `GET /api/health`
- Site content: `GET /api/site-content`
- Frontend root: `GET /`

## 7) Common Issues

- **Atlas connection fails**: Add server public IP in Atlas Network Access.
- **Frontend blank page**: Ensure `npm run build` completed and `clinte/dist` exists.
- **CORS blocked**: Set `CORS_ORIGIN` to your frontend domain.
- **DNS SRV issues**: Keep `MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1`.
