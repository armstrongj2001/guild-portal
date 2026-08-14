import type { FeedItem, Renderer } from './types';
import Generic from './renderers/generic';

/**
 * Renderers and themes are auto-discovered: adding one is a single new file,
 * never an edit to a registry someone else owns. A malformed module is skipped
 * rather than crashing the build.
 */
const modules = import.meta.glob<Record<string, unknown>>('./renderers/*.tsx', { eager: true });

const renderers: Renderer[] = Object.entries(modules)
  .filter(([path]) => !path.endsWith('generic.tsx'))
  .flatMap(([path, mod]) => {
    if (typeof mod.matches !== 'function' || typeof mod.default !== 'function') {
      console.warn(`ignoring renderer ${path}: needs a \`matches\` export and a default component`);
      return [];
    }
    return [mod as unknown as Renderer];
  });

export function renderItem(item: FeedItem) {
  const match = renderers.find((r) => {
    try {
      return r.matches(item);
    } catch {
      return false;
    }
  });
  const Component = match?.default ?? Generic;
  return <Component item={item} />;
}

/**
 * Themes are plain CSS files that scope custom properties under
 * `[data-theme="<filename>"]`. They are inlined and injected together so the
 * switcher only has to flip the attribute on <html>.
 */
const themeSheets = import.meta.glob<string>('./themes/*.css', {
  eager: true,
  query: '?inline',
  import: 'default',
});

const style = document.createElement('style');
style.textContent = Object.values(themeSheets).join('\n');
document.head.append(style);

export const themes = Object.keys(themeSheets)
  .map((path) => path.replace('./themes/', '').replace('.css', ''))
  .sort();
