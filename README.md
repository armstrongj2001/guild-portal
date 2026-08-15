# Guild Portal

A place for AI Builders Guild members to share what they're building and get
real feedback on it. Post a project — polished or half-broken — say what you
want feedback on, and let the guild respond.

**Live:** https://armstrongj2001.github.io/guild-portal/

## What it does

- **Share a project** in about a minute: title, one-liner, stage, links, tags
- **Ask for what you need** — every project can name the specific question it
  wants answered, which is the difference between "nice!" and useful feedback
- **Cheers and comments** from other members
- **Browse and filter** by newest, most cheered, wants-feedback, tag, or search
- **Sign in with GitHub or an email magic link** — no passwords

## Stack

Vite + React + TypeScript on GitHub Pages, with Supabase (Postgres + Auth) for
everything that writes. There is no server of our own: the browser talks to
Supabase directly, and every table is guarded by row-level security rather than
by hiding a key.

```
src/
  pages/        Home (grid + filters) · ProjectPage (detail + feedback thread)
  components/   Card, dialogs, comment thread, small primitives
  lib/
    api.ts      every read and write — one place to look
    auth.tsx    session + profile context
    supabase.ts client; null when unconfigured, which switches on demo mode
    demo.ts     seed projects so the app runs with no credentials
  styles/       tokens.css (light + dark palettes) · app.css
supabase/
  schema.sql    tables, RLS policies, the project_feed view — run once
```

## Run it

```bash
npm install
npm run dev
```

That works with no configuration — the app falls back to seed data in **demo
mode**, where signing in, posting, and commenting all function but nothing
persists. Good enough to explore or design against.

## Go live (3 steps)

1. **Create a free Supabase project** at [supabase.com](https://supabase.com).
2. **Run `supabase/schema.sql`** in the SQL editor (Dashboard → SQL Editor →
   paste → Run). Safe to re-run.
3. **Copy `.env.example` to `.env.local`** and paste in your Project URL and
   anon key from Dashboard → Project Settings → API.

Restart `npm run dev` and the demo banner disappears.

For **GitHub sign-in**: Supabase Dashboard → Authentication → Providers →
GitHub, then create an OAuth app at GitHub → Settings → Developer settings with
the callback URL Supabase shows you. Email magic links work with no setup.

For the **deployed site**, add the same two values as repository secrets
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) under Settings → Secrets and
variables → Actions, and add your Pages URL to Supabase → Authentication → URL
Configuration → Redirect URLs.

## Contributing

Open a PR. The interesting seams:

- `src/lib/api.ts` — every data operation, with its demo-mode twin
- `supabase/schema.sql` — the data model and its policies
- `src/styles/tokens.css` — colors and shape, light and dark

If you change the schema, update the demo seed in `src/lib/demo.ts` too, so a
clone with no credentials still shows something honest.
