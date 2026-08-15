import type { Project } from '../types';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

type Builder = {
  handle: string;
  name: string;
  avatar: string | null;
  projects: number;
  cheers: number;
};

export function Sidebar({
  projects,
  activeTag,
  onTag,
  onSubmit,
}: {
  projects: Project[];
  activeTag: string | null;
  onTag: (tag: string | null) => void;
  onSubmit: () => void;
}) {
  const builders = rankBuilders(projects);
  const tags = rankTags(projects);

  return (
    <aside className="sidebar">
      <section className="panel">
        <header className="panel__head">
          <h2>
            <Icon name="trophy" size={13} /> Guild builders
          </h2>
          <span>{builders.length} active</span>
        </header>
        {builders.length ? (
          <ol className="builders">
            {builders.slice(0, 6).map((builder, i) => (
              <li key={builder.handle}>
                <span className="builders__rank">#{i + 1}</span>
                <Avatar name={builder.name} src={builder.avatar} size={30} />
                <div className="builders__who">
                  <strong>{builder.name}</strong>
                  <span>@{builder.handle}</span>
                </div>
                <div className="builders__counts">
                  <span className="pill pill--cheer">{builder.cheers}</span>
                  <span className="pill">
                    {builder.projects} {builder.projects === 1 ? 'project' : 'projects'}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="panel__empty">No builders yet.</p>
        )}
      </section>

      <section className="panel">
        <header className="panel__head">
          <h2>
            <Icon name="tag" size={13} /> What people build with
          </h2>
        </header>
        {tags.length ? (
          <div className="cloud">
            {tags.slice(0, 14).map(([tag, count]) => (
              <button
                key={tag}
                className={activeTag === tag ? 'is-active' : ''}
                onClick={() => onTag(activeTag === tag ? null : tag)}
              >
                #{tag} <em>{count}</em>
              </button>
            ))}
          </div>
        ) : (
          <p className="panel__empty">Tags appear as projects are posted.</p>
        )}
      </section>

      <section className="panel panel--cta">
        <h2>
          <Icon name="sparkle" size={15} /> Working on something?
        </h2>
        <p>
          Half-finished is welcome. Say what you want feedback on and the guild will tell you
          straight.
        </p>
        <button className="btn btn--primary btn--block" onClick={onSubmit}>
          Share a project
        </button>
        <ul className="steps">
          <li>
            <span>1</span> Name it and describe it in a line
          </li>
          <li>
            <span>2</span> Ask a specific question
          </li>
          <li>
            <span>3</span> Get real answers, not applause
          </li>
        </ul>
      </section>
    </aside>
  );
}

function rankBuilders(projects: Project[]): Builder[] {
  const map = new Map<string, Builder>();

  for (const p of projects) {
    const entry = map.get(p.owner_handle) ?? {
      handle: p.owner_handle,
      name: p.owner_name ?? p.owner_handle,
      avatar: p.owner_avatar,
      projects: 0,
      cheers: 0,
    };
    entry.projects += 1;
    entry.cheers += p.cheer_count;
    map.set(p.owner_handle, entry);
  }

  return [...map.values()].sort((a, b) => b.cheers - a.cheers || b.projects - a.projects);
}

function rankTags(projects: Project[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const p of projects) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
