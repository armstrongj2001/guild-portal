import { useMemo, useState } from 'react';
import type { Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';

type Sort = 'newest' | 'cheered' | 'feedback';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'cheered', label: 'Most cheered' },
  { value: 'feedback', label: 'Wants feedback' },
];

export function Home({
  projects,
  cheers,
  loading,
  onOpen,
  onCheer,
  onSubmit,
}: {
  projects: Project[];
  cheers: Set<string>;
  loading: boolean;
  onOpen: (slug: string) => void;
  onCheer: (id: string) => void;
  onSubmit: () => void;
}) {
  const [sort, setSort] = useState<Sort>('newest');
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const tags = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tags))].sort().slice(0, 12),
    [projects],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = projects.filter(
      (p) =>
        (!tag || p.tags.includes(tag)) &&
        (!q ||
          `${p.title} ${p.tagline} ${p.owner_handle} ${p.tags.join(' ')}`.toLowerCase().includes(q)),
    );

    if (sort === 'cheered') list = [...list].sort((a, b) => b.cheer_count - a.cheer_count);
    if (sort === 'feedback') list = list.filter((p) => p.feedback_wanted);
    return list;
  }, [projects, sort, tag, query]);

  return (
    <>
      <section className="hero">
        <h1>What the guild is building</h1>
        <p>
          Share what you're working on — polished or half-broken — and get real feedback from people
          who build the same things you do.
        </p>
        <button className="btn btn--primary btn--lg" onClick={onSubmit}>
          Share a project
        </button>
      </section>

      <div className="toolbar">
        <div className="segmented">
          {SORTS.map((option) => (
            <button
              key={option.value}
              className={sort === option.value ? 'is-active' : ''}
              onClick={() => setSort(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          type="search"
        />
      </div>

      {tags.length ? (
        <div className="tagbar">
          <button className={tag === null ? 'is-active' : ''} onClick={() => setTag(null)}>
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              className={tag === t ? 'is-active' : ''}
              onClick={() => setTag(tag === t ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>
      ) : null}

      {loading ? (
        <div className="grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card card--skeleton" />
          ))}
        </div>
      ) : visible.length ? (
        <div className="grid">
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              cheered={cheers.has(project.id)}
              onOpen={() => onOpen(project.slug)}
              onCheer={() => onCheer(project.id)}
              onTag={setTag}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>Nothing here yet.</p>
          <button className="btn btn--primary" onClick={onSubmit}>
            Be the first to share
          </button>
        </div>
      )}
    </>
  );
}
