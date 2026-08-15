import type { Project } from '../types';
import { Icon } from './Icon';

export function StatsBar({ projects }: { projects: Project[] }) {
  const builders = new Set(projects.map((p) => p.owner_handle)).size;
  const cheers = projects.reduce((n, p) => n + p.cheer_count, 0);
  const feedback = projects.reduce((n, p) => n + p.comment_count, 0);
  const live = projects.filter((p) => p.stage === 'live').length;
  const asking = projects.filter((p) => p.feedback_wanted).length;

  const stats = [
    { icon: 'rocket', label: 'projects', value: projects.length, sub: `${live} live`, tone: 'accent' },
    { icon: 'users', label: 'builders', value: builders, sub: 'shipping', tone: 'sky' },
    { icon: 'message', label: 'feedback', value: feedback, sub: `${asking} asking`, tone: 'good' },
    { icon: 'heart', label: 'cheers', value: cheers, sub: 'given', tone: 'cheer' },
  ] as const;

  return (
    <div className="statsbar">
      <div className="statsbar__inner">
        <span className="pulse">
          <i /> guild feed
        </span>
        <span className="protocol">
          <Icon name="bolt" size={12} />
          open portal · no invite required
        </span>
        <div className="stats">
          {stats.map((stat) => (
            <div key={stat.label} className={`stat stat--${stat.tone}`}>
              <span className="stat__icon">
                <Icon name={stat.icon} size={14} />
              </span>
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
