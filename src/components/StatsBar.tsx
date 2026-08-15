import type { Project } from '../types';

export function StatsBar({ projects }: { projects: Project[] }) {
  const builders = new Set(projects.map((p) => p.owner_handle)).size;
  const cheers = projects.reduce((n, p) => n + p.cheer_count, 0);
  const feedback = projects.reduce((n, p) => n + p.comment_count, 0);
  const live = projects.filter((p) => p.stage === 'live').length;

  const stats = [
    { label: 'projects', value: projects.length, sub: `${live} live`, tone: 'accent' },
    { label: 'builders', value: builders, sub: 'shipping', tone: 'sky' },
    { label: 'feedback', value: feedback, sub: 'replies', tone: 'good' },
    { label: 'cheers', value: cheers, sub: 'given', tone: 'cheer' },
  ];

  return (
    <div className="statsbar">
      <div className="statsbar__inner">
        <span className="pulse">
          <i /> guild feed
        </span>
        <div className="stats">
          {stats.map((stat) => (
            <div key={stat.label} className={`stat stat--${stat.tone}`}>
              <span className="stat__value">{stat.value}</span>
              <span className="stat__meta">
                <strong>{stat.label}</strong>
                <small>{stat.sub}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
