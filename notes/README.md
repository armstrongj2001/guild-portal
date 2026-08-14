# Ship notes

One file per note: `YYYY-MM-DD-<github-handle>.md`.

```markdown
---
title: What you shipped
url: https://link-to-the-thing
tags: comma, separated
---

Free text. Rendered as plain text — markdown is not converted to HTML.
```

The date and handle come from the filename, so nothing else needs editing.
The fetch script folds these into `data/feed.json` as `kind: "note"`.
