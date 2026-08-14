import type { FeedItem } from '../types';
import { relativeTime } from '../time';

/**
 * Reference implementation #1 — copy this file to add your own renderer.
 * Export `matches` plus a default component. First match wins.
 */
export function matches(item: FeedItem): boolean {
  return item.kind === 'push';
}

type Commit = { message: string; sha: string };

export default function Push({ item }: { item: FeedItem }) {
  const { branch, commits = [] } = item.meta as { branch?: string; commits?: Commit[] };

  return (
    <article className="item item--push">
      <header>
        <a className="actor" href={`https://github.com/${item.actor}`}>@{item.actor}</a>
        <span className="kind">pushed{branch ? ` to ${branch}` : ''}</span>
        <time dateTime={item.timestamp}>{relativeTime(item.timestamp)}</time>
      </header>
      <p className="title">
        <a href={item.url}>{item.repo}</a>
      </p>
      <ul className="commits">
        {commits.slice(0, 3).map((commit) => (
          <li key={commit.sha}>
            <code>{commit.sha.slice(0, 7)}</code> {commit.message.split('\n')[0]}
          </li>
        ))}
      </ul>
    </article>
  );
}
