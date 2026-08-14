# Contributing

Everything here is **additive**. A valid contribution adds a file or a line —
it never edits a file someone else owns. That is what makes this safe to
auto-merge.

## Step zero, if you forked

GitHub disables both of these on forks. Without them your fork looks broken:

1. **Actions** → the Actions tab → "I understand my workflows, go ahead and enable them"
2. **Pages** → Settings → Pages → Source: **GitHub Actions**

Then run the `deploy` workflow manually once from the Actions tab.

---

## 1. Add yourself (~90 seconds, no code)

Edit `members.json`, add one entry, open a PR:

```json
{ "handle": "your-github-handle" }
```

Your public GitHub activity shows up on the next refresh (3x daily).

## 2. Write a ship note (no code)

Create `notes/YYYY-MM-DD-your-handle.md`:

```markdown
---
title: What you shipped
url: https://link-to-the-thing
tags: ai, demo
---

A paragraph about it. Rendered as plain text.
```

The date and handle are read from the filename.

## 3. Write a renderer

One new file in `src/renderers/`. It is auto-discovered — there is no registry
to edit. Copy this:

```tsx
import type { FeedItem } from '../types';
import { relativeTime } from '../time';

export function matches(item: FeedItem): boolean {
  return item.kind === 'release';   // your kind here
}

export default function Release({ item }: { item: FeedItem }) {
  return (
    <article className="item">
      <header>
        <a className="actor" href={`https://github.com/${item.actor}`}>@{item.actor}</a>
        <span className="kind">released</span>
        <time dateTime={item.timestamp}>{relativeTime(item.timestamp)}</time>
      </header>
      <p className="title"><a href={item.url}>{item.title}</a></p>
    </article>
  );
}
```

Rules:

- Export `matches` **and** a default component. First match wins.
- `generic.tsx` is the fallback and is never matched against — leave it alone.
- The `FeedItem` type is frozen. Need more data? Put it in `meta` via
  `scripts/fetch.ts` and say so in the PR.
- Ship notes are untrusted markdown from arbitrary PRs. Render text, not HTML.
  No `dangerouslySetInnerHTML`.

Claim a kind first with the "Claim a renderer" issue template so two people
don't build the same one.

## 4. Write a theme

One new file in `src/themes/<name>.css`. The filename becomes the theme name in
the switcher, and the selector has to match it:

```css
[data-theme='midnight'] {
  --bg: #05060a;
  --surface: #0d1018;
  --border: #1c2130;
  --text: #dfe4f0;
  --muted: #7b849c;
  --accent: #9d7bff;
  --accent-soft: #9d7bff22;
  --radius: 10px;
  --font: ui-sans-serif, system-ui, sans-serif;
  --mono: ui-monospace, Menlo, monospace;
}
```

Define every variable — there is no fallback layer.

---

## The one rule about `data/feed.json`

**Never run `npm run fetch` on a PR branch.** CI regenerates that file; a local
run guarantees a conflict. It is marked `merge=ours` in `.gitattributes` to
limit the damage, but the fix is to not touch it.

## PR labels

A PR touching only `members.json`, `notes/`, `src/renderers/`, or `src/themes/`
is labeled `auto-mergeable`. Anything else gets manual review — not a
rejection, just a conversation.
