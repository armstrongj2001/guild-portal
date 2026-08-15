import { useMemo, useState } from 'react';
import type { Project, Stage } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { Sidebar } from '../components/Sidebar';
import { StatsBar } from '../components/StatsBar';

type Filter = 'all' | Stage | 'feedback';
type Sort = 'newest' | 'cheered' | 'discussed';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'cheered', label: 'Most cheered' },
  { value: 'discussed', label: 'Most discussed' },
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
  const [filter, setFilter] = useState<Filter>('all');
  const [tag, setTag] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      all: projects.length,
      idea: projects.filter((p) => p.stage === 'idea').length,
      building: projects.filter((p) => p.stage === 'building').length,
      live: projects.filter((p) => p.stage === 'live').length,
      feedback: projects.filter((p) => p.feedback_wanted).length,
    }),
    [projects],
  );

  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'idea', label: 'Ideas' },
    { value: 'building', label: 'Building' },
    { value: 'live', label: 'Live' },
    { value: 'feedback', label: 'Wants feedback' },
  ];

  const visible = useMemo(() => {
    const list = projects.filter((p) => {
      if (tag && !p.tags.includes(tag)) return false;
      if (filter === 'feedback' && !p.feedback_wanted) return false;
      if (filter !== 'all' && filter !== 'feedback' && p.stage !== filter) return false;
      return true;
    });

    const sorters: Record<Sort, (a: Project, b: Project) => number> = {
      newest: (a, b) => b.created_at.localeCompare(a.created_at),
      cheered: (a, b) => b.cheer_count - a.cheer_count,
      discussed: (a, b) => b.comment_count - a.comment_count,
    };
    return [...list].sort(sorters[sort]);
  }, [projects, sort, filter, tag]);

  return (
    <>
      <StatsBar projects={projects} />

      <div className="main">
        <div className="layout">
          <div className="feed">
            <section className="hero">
              <span className="eyebrow">AI Builders Guild</span>
              <h1>
                What the guild <em>is building</em>
              </h1>
              <p>
                Post what you're working on — polished or half-broken — say what you want feedback
                on, and get answers from people who build the same things you do.
              </p>
              <button className="btn btn--primary" onClick={onSubmit}>
                Share a project
              </button>
            </section>

            <div className="toolbar">
              <div className="filters">
                {filters.map((option) => (
                  <button
                    key={option.value}
                    className={filter === option.value ? 'is-active' : ''}
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                    <em>{counts[option.value]}</em>
                  </button>
                ))}
              </div>

              <label className="sort">
                <span>Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                  {SORTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {tag ? (
              <button className="activetag" onClick={() => setTag(null)}>
                #{tag} <span>clear ✕</span>
              </button>
            ) : null}

            {loading ? (
              <div className="cards">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="card card--skeleton" />
                ))}
              </div>
            ) : visible.length ? (
              <div className="cards">
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
                <h2>{projects.length ? 'Nothing matches that.' : 'The feed is waiting.'}</h2>
                <p>
                  {projects.length
                    ? 'Try a different filter or clear the search.'
                    : 'Be the first to post — one line about what you are building is enough to start.'}
                </p>
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    if (projects.length) {
                      setFilter('all');
                      setTag(null);
                    } else onSubmit();
                  }}
                >
                  {projects.length ? 'Clear filters' : 'Share the first project'}
                </button>
              </div>
            )}
          </div>

          <Sidebar projects={projects} activeTag={tag} onTag={setTag} onSubmit={onSubmit} />
        </div>
      </div>
    </>
  );
}
