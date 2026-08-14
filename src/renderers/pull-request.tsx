import type { FeedItem } from '../types';
import { relativeTime } from '../time';

/** Reference implementation #2 — see `push.tsx` for the shape. */
export function matches(item: FeedItem): boolean {
  return item.kind === 'pr';
}

export default function PullRequest({ item }: { item: FeedItem }) {
  const { action, number, title, url, merged } = item.meta as {
    action?: string;
    number?: number;
    title?: string;
    url?: string;
    merged?: boolean;
  };

  return (
    <article className="item item--pr">
      <header>
        <a className="actor" href={`https://github.com/${item.actor}`}>@{item.actor}</a>
        <span className="kind">{merged ? 'merged' : action} PR</span>
        <time dateTime={item.timestamp}>{relativeTime(item.timestamp)}</time>
      </header>
      <p className="title">
        <a href={url ?? item.url}>
          {item.repo}#{number} — {title}
        </a>
      </p>
    </article>
  );
}
