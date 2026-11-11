# Production runbook — backend on Render + MongoDB Atlas

Written after the 10 Nov 2026 deploy logs. They showed four problems:

- **MongoDB Atlas rejected the login** (`SCRAM failure: bad auth`).
- **Contact-form enquiries failed to save and were lost.**
- **Rate limiting ignored Render's proxy** (`ERR_ERL_UNEXPECTED_X_FORWARDED_FOR`).
- **The deploy built old commit `a001b93` from `main`.**

The code fixes are on `cursor/usa-organic-growth`. The steps below need your Render and Atlas accounts.

## 1. Fix the database login (required)

The logs say Atlas reached the cluster but **rejected the username/password** in `DATABASE_URL`. Network access is fine. This is not a code bug.

1. Atlas → **Database Access** → find the user named in `DATABASE_URL`.
2. Choose **Edit → Edit Password**, and set a new password made of **letters and numbers only**. Then no URL-encoding is needed.
3. Build the URL with the database name after the host:

   ```
   mongodb+srv://USER:NEWPASSWORD@cluster0.utxftds.mongodb.net/novaro?retryWrites=true&w=majority
   ```

   If you keep special characters, encode them: `@` → `%40`, `:` → `%3A`, `/` → `%2F`, `#` → `%23`, `%` → `%25`.
4. Render → backend service → **Environment** → update `DATABASE_URL` → **Save, rebuild and deploy**.
5. Atlas → **Network Access** must allow Render: `0.0.0.0/0`, or Render's outbound IPs on paid plans.

On startup the backend now prints the connection target **without the password**, the exact problem class (`auth_failed`, `unreachable`, `dns`, `config`), and the fix. It also flags common URL mistakes, such as an unencoded `@` or a missing database name.

## 2. Deploy the right code

Render deployed `main` at `a001b93`. None of the November work (redesign, SEO, these server fixes) is on `main` yet. Either:

- open a pull request from `cursor/usa-organic-growth` to `main` and merge it, **or**
- Render → service → **Settings → Branch** → `cursor/usa-organic-growth` (temporary).

Deploy the **backend first**, then the frontend.

## 3. Recommended environment variables

| Variable | Value | Why |
| --- | --- | --- |
| `TRUST_PROXY` | `1` | Render has one proxy. Rate limits now apply per visitor, not to everyone at once. Default in production is already 1. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | your mail provider | Every enquiry is emailed to you. It is also the backup copy if the database is ever down. |
| `MAIL_TO` | `novaro@novarosolution.com` | Where enquiry emails go. |
| `MAIL_FROM` | a sender your SMTP account may use | Optional; defaults to `SMTP_USER`. |
| `SMTP_SECURE` | `true` for port 465 | Optional; inferred from the port. |

**Gmail or Google Workspace:**
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER` = the address
- `SMTP_PASS` = a Google **App Password**, not the normal password

The startup log shows `Email: ready — enquiries are emailed to …` when it works.

## 4. Check it works

1. Open `https://<backend>/api/health`. You want `"database":"connected"`, `"queuedLeads":0`, and `"email":"configured"`.
2. Send a test enquiry from `/contact`. It should appear in admin → Leads, and in your inbox if SMTP is set. Delete it afterwards.
3. The Render health check path is `/api/health` (set in `render.yaml`).

## 5. How enquiries are protected now

- **Database up:** the enquiry is saved and returns 201. An email is sent if SMTP is configured.
- **Database down or rejecting writes:**
  - The visitor still sees "received" (202).
  - The enquiry is queued in memory and written to the log as one line: `[lead-fallback] {"name":…,"email":…}`.
  - It is emailed if SMTP is configured.
  - It is saved automatically, with its original time, within about a minute of the database coming back. No restart is needed; the admin user is re-synced at the same time.
- **If the server restarts before the database returns:** the queue is lost, but every enquiry is still in the `[lead-fallback]` log lines (and the emails). Search Render logs for `lead-fallback`.

Enquiries sent **before this fix** while the database was failing were **not saved and not logged**. In the 10 Nov log there are two, at 09:32:49 and 09:33:00. Those visitors saw an error, so they may have emailed or called instead.

## 6. Other production notes

- **Free plan sleeps.** Render free web services spin down after about 15 minutes idle. The first request then takes 30–60 seconds, which can make the contact form time out. For a business site, put at least the backend (ideally both services) on a paid instance.
- **Latency:** the Atlas cluster is in Mumbai (`AP_SOUTH_1`), with a round trip of about 670 ms from Render. Creating the Render services in the **Singapore** region (or moving Atlas next to Render) will speed up every database call. Render cannot change the region of an existing service; you create a new one.
- **Rate limits:**
  - page content reads: 600/min per visitor
  - other API calls: 120/min
  - contact form: 5/min
  - admin login: 20 per 15 min
- **Dependencies:** `npm audit fix` applied; `zod` upgraded to 4.6.7; `nodemailer` 10.4.0. One advisory remains in Prisma's command-line tool (`deepmerge-ts`), which only runs at build time. It goes away with the Prisma 7 upgrade; schedule that separately.
- **Prisma config** moved from `package.json#prisma` to `backend/prisma.config.ts` (removes the deprecation warning). Local Prisma CLI commands still read `backend/.env`.
