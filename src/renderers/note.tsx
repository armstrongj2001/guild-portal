import type { FeedItem } from '../types';
import { relativeTime } from '../time';

/**
 * Ship notes come from arbitrary PRs, so the body is rendered as plain text.
 * No markdown-to-HTML in v1 — untrusted markup is not worth the surface area.
 */
export function matches(item: FeedItem): boolean {
  return item.kind === 'note';
}

export default function Note({ item }: { item: FeedItem }) {
  const tags = (item.meta.tags as string[] | undefined) ?? [];

  return (
    <article className="item item--note">
      <header>
        <a className="actor" href={`https://github.com/${item.actor}`}>@{item.actor}</a>
        <span className="kind">ship note</span>
        <time dateTime={item.timestamp}>{relativeTime(item.timestamp)}</time>
      </header>
      <p className="title">{item.url ? <a href={item.url}>{item.title}</a> : item.title}</p>
      {item.body ? <p className="body">{item.body}</p> : null}
      {tags.length ? (
        <ul className="tags">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
