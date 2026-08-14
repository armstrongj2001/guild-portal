# Guild Build Log

A public feed of what the AI Builders Guild is shipping — members' GitHub
activity, demo links, and hand-written ship notes on one page.

**Live:** https://armstrongj2001.github.io/guild-build-log/

No accounts. No secrets. No paid services. `git clone && npm i && npm run dev`
works offline with real data, because the feed is committed to the repo.

## How it works

```
.github/workflows/refresh.yml   cron 3x daily + manual dispatch
  └─ scripts/fetch.ts           GITHUB_TOKEN → GitHub Events API
       ├─ reads  members.json   guild handles
       ├─ reads  notes/*.md     hand-written ship notes
       └─ writes data/feed.json normalized, deduped, sorted, capped

.github/workflows/deploy.yml    build + publish to Pages on push to main

src/
  renderers/*.tsx               ← fork surface (one file per event kind)
  themes/*.css                  ← fork surface (one file per theme)
  feed.tsx                      auto-discovers both via import.meta.glob
```

The browser never calls GitHub. All fetching happens at build time in CI, so
there is no token in the client and no rate limit for visitors.

## Contributing

Three paths, easiest first — all additive, none of them edit a file someone
else owns. See [CONTRIBUTING.md](CONTRIBUTING.md).

1. Add yourself to `members.json` (~90 seconds)
2. Drop a ship note in `notes/`
3. Add a renderer or a theme

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run fetch    # refresh data/feed.json (do NOT run this on a PR branch)
```

`npm run fetch` works without a token at a lower rate limit. Set `GITHUB_TOKEN`
to raise it.
