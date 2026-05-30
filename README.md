# Social Media OS

AI-powered command center for social media managers — 6 clients + portfolio, team tasks, unified inbox (coming), and AI content (Claude, OpenAI, Higgsfield, Nanobanana).

## Phase 0 + Connect (current)

- Dashboard with live mock data
- Clients, Calendar, Tasks, Inbox placeholder, AI Studio, Settings
- **Instagram + Google OAuth connect** (Settings → Connect per client)
- SQLite database for connection tokens
- Setup guide at `/settings/setup`

## Quick start

```bash
cd social-media-os
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → redirects to `/dashboard`.

### Connect Instagram & Google

1. Copy `.env.example` → `.env.local` (or use existing `.env`)
2. Follow **[Settings → Setup guide](http://localhost:3000/settings/setup)** to create Meta & Google apps
3. Add `META_APP_ID`, `META_APP_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
4. Restart dev server → **Settings** → click **Connect** next to each client
5. Client logs in with their Instagram / Google account (one time per client)

## Roadmap

| Phase | Features |
|-------|----------|
| **0** | Dashboard shell (this release) |
| **1** | Real CRUD — clients, calendar, tasks (Supabase) |
| **1b** | Claude + OpenAI — captions, batches, reports |
| **1c** | Higgsfield + Nanobanana — images & video |
| **2** | Instagram connect + comment inbox |
| **3** | Google reviews inbox |
| **4** | Publish + metrics + DMs |
| **5** | Ad creatives + client portal |

## Stack

- Next.js 16 · React 19 · Tailwind CSS 4
- Phase 1+: Supabase, Clerk, Vercel

## Your clients (mock data)

Add real clients on the **Clients** page in the app (not in code).

Replace placeholder names — clients are stored in the database.

## API keys

Copy `.env.example` to `.env.local` when enabling AI phases.
