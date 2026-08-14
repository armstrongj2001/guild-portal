import type { ComponentType } from 'react';

/**
 * The contract between the pipeline and every renderer. Frozen — renderers are
 * the community contribution surface, so widening or narrowing this invalidates
 * work that already shipped. Add to `meta` instead.
 */
export type FeedItem = {
  id: string;
  kind: string; // "push" | "pr" | "release" | "note" | forker-defined
  actor: string;
  timestamp: string; // ISO
  repo?: string;
  url?: string;
  title?: string;
  body?: string;
  meta: Record<string, unknown>;
};

export type Renderer = {
  matches: (item: FeedItem) => boolean;
  default: ComponentType<{ item: FeedItem }>;
};
