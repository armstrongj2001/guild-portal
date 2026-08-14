/**
 * Build-time only. Reads members.json and notes/, calls the GitHub Events API,
 * and merges the result into data/feed.json. Never runs in a browser: the token
 * stays in CI and visitors never hit GitHub's rate limits.
 *
 * Run with `npm run fetch` (Node >= 23.6 strips the types natively).
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FeedItem } from '../src/types.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FEED = join(ROOT, 'data', 'feed.json');
const MAX_ITEMS = 500;

const KINDS: Record<string, string> = {
  PushEvent: 'push',
  PullRequestEvent: 'pr',
  ReleaseEvent: 'release',
  IssuesEvent: 'issue',
  CreateEvent: 'create',
  WatchEvent: 'star',
  ForkEvent: 'fork',
};

type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  actor: { login: string };
  repo: { name: string };
  payload: Record<string, any>;
};

async function fetchMemberEvents(handle: string): Promise<FeedItem[]> {
  const res = await fetch(`https://api.github.com/users/${handle}/events/public?per_page=100`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'guild-build-log',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });

  // Fail soft: a deleted account or a transient 5xx must never break the build.
  if (!res.ok) {
    console.warn(`skipping ${handle}: ${res.status} ${res.statusText}`);
    return [];
  }

  const events = (await res.json()) as GitHubEvent[];
  return events.flatMap((event) => {
    const kind = KINDS[event.type];
    if (!kind) return [];
    return [
      {
        id: `gh-${event.id}`,
        kind,
        actor: event.actor.login,
        timestamp: event.created_at,
        repo: event.repo.name,
        url: `https://github.com/${event.repo.name}`,
        title: describe(kind, event),
        meta: { eventType: event.type, payload: summarize(kind, event.payload) },
      },
    ];
  });
}

function describe(kind: string, event: GitHubEvent): string {
  const repo = event.repo.name;
  switch (kind) {
    case 'push':
      return `pushed ${event.payload.size ?? 0} commit(s) to ${repo}`;
    case 'pr':
      return `${event.payload.action} a pull request in ${repo}`;
    case 'release':
      return `released ${event.payload.release?.tag_name ?? ''} in ${repo}`;
    case 'issue':
      return `${event.payload.action} an issue in ${repo}`;
    default:
      return `${kind} in ${repo}`;
  }
}

/** Events payloads are large; keep only what renderers plausibly need. */
function summarize(kind: string, payload: Record<string, any>): Record<string, unknown> {
  switch (kind) {
    case 'push':
      return {
        branch: payload.ref?.replace('refs/heads/', ''),
        size: payload.size,
        commits: (payload.commits ?? []).map((c: any) => ({ message: c.message, sha: c.sha })),
      };
    case 'pr':
      return {
        action: payload.action,
        number: payload.number,
        title: payload.pull_request?.title,
        url: payload.pull_request?.html_url,
        merged: payload.pull_request?.merged,
      };
    case 'release':
      return { tag: payload.release?.tag_name, url: payload.release?.html_url };
    case 'issue':
      return { action: payload.action, title: payload.issue?.title, url: payload.issue?.html_url };
    default:
      return {};
  }
}

/** Ship notes: `notes/YYYY-MM-DD-<handle>.md` with `key: value` frontmatter. */
async function readNotes(): Promise<FeedItem[]> {
  const dir = join(ROOT, 'notes');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md') && f !== 'README.md');

  return Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(dir, file), 'utf8');
      const { frontmatter, body } = parseFrontmatter(raw);
      const stamp = file.slice(0, 10);
      const actor = file.slice(11).replace(/\.md$/, '');
      return {
        id: `note-${file}`,
        kind: 'note',
        actor,
        timestamp: new Date(`${stamp}T12:00:00Z`).toISOString(),
        url: frontmatter.url,
        title: frontmatter.title ?? actor,
        body: body.trim(),
        meta: { tags: frontmatter.tags?.split(',').map((t) => t.trim()) ?? [] },
      };
    }),
  );
}

function parseFrontmatter(raw: string): { frontmatter: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };

  const frontmatter = Object.fromEntries(
    match[1]
      .split('\n')
      .map((line) => line.match(/^([\w-]+):\s*(.*)$/))
      .filter((m): m is RegExpMatchArray => Boolean(m))
      .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]),
  );
  return { frontmatter, body: match[2] };
}

async function main() {
  const { members } = JSON.parse(await readFile(join(ROOT, 'members.json'), 'utf8')) as {
    members: { handle: string }[];
  };

  const fetched = (await Promise.all(members.map((m) => fetchMemberEvents(m.handle)))).flat();
  const notes = await readNotes();
  const existing = JSON.parse(await readFile(FEED, 'utf8')) as FeedItem[];

  // Append-and-dedupe, never replace: the Events API only reaches back ~90 days
  // and a full rewrite would silently truncate the archive.
  const byId = new Map(existing.map((item) => [item.id, item]));
  for (const item of [...fetched, ...notes]) byId.set(item.id, item);

  const feed = [...byId.values()]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, MAX_ITEMS);

  await writeFile(FEED, `${JSON.stringify(feed, null, 2)}\n`);
  console.log(`feed.json: ${feed.length} items (${feed.length - existing.length} new)`);
}

await main();
