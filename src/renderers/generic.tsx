import type { FeedItem } from '../types';
import { relativeTime } from '../time';

/** Fallback for any kind without a dedicated renderer. Never remove this one. */
export function matches(): boolean {
  return true;
}

export default function Generic({ item }: { item: FeedItem }) {
  return (
    <article className="item">
      <header>
        <a className="actor" href={`https://github.com/${item.actor}`}>@{item.actor}</a>
        <span className="kind">{item.kind}</span>
        <time dateTime={item.timestamp}>{relativeTime(item.timestamp)}</time>
      </header>
      <p className="title">
        {item.url ? <a href={item.url}>{item.title ?? item.repo}</a> : (item.title ?? item.repo)}
      </p>
      {item.body ? <p className="body">{item.body}</p> : null}
    </article>
  );
}
