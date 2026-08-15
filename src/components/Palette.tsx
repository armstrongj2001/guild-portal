import { useEffect, useMemo, useState } from 'react';
import type { Project } from '../types';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

/** ⌘K jump-to-project. Opened from the header search or the shortcut. */
export function Palette({
  projects,
  onOpen,
  onClose,
}: {
  projects: Project[];
  onOpen: (slug: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? projects.filter((p) =>
          `${p.title} ${p.tagline} ${p.owner_handle} ${p.tags.join(' ')}`.toLowerCase().includes(q),
        )
      : projects;
    return list.slice(0, 8);
  }, [projects, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && results[active]) onOpen(results[active].slug);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [results, active, onOpen, onClose]);

  return (
    <div className="scrim scrim--top" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Search projects">
        <div className="palette__input">
          <Icon name="search" size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, builders, tags…"
            autoFocus
          />
          <kbd>esc</kbd>
        </div>

        {results.length ? (
          <ul className="palette__list">
            {results.map((project, i) => (
              <li key={project.id}>
                <button
                  className={i === active ? 'is-active' : ''}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => onOpen(project.slug)}
                >
                  <Avatar
                    name={project.owner_name ?? project.owner_handle}
                    src={project.owner_avatar}
                    size={26}
                  />
                  <span className="palette__row">
                    <strong>{project.title}</strong>
                    <span>
                      @{project.owner_handle} · {project.tags.join(' · ') || project.stage}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="palette__empty">Nothing matches “{query}”.</p>
        )}

        <div className="palette__foot">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
