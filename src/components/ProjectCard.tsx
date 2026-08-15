import type { Project } from '../types';
import { hostname, relativeTime } from '../lib/format';
import { Avatar } from './Avatar';
import { CheerButton } from './CheerButton';
import { Icon } from './Icon';
import { StageBadge, Tag } from './Tag';

export function ProjectCard({
  project,
  cheered,
  onOpen,
  onCheer,
  onTag,
}: {
  project: Project;
  cheered: boolean;
  onOpen: () => void;
  onCheer: () => void;
  onTag: (tag: string) => void;
}) {
  return (
    <article className="card">
      <button className="card__hit" onClick={onOpen} aria-label={`Open ${project.title}`} />

      <div className="card__head">
        <Avatar
          name={project.owner_name ?? project.owner_handle}
          src={project.owner_avatar}
          size={34}
        />
        <div className="card__who">
          <strong>{project.owner_name ?? project.owner_handle}</strong>
          <span>
            @{project.owner_handle} · {relativeTime(project.created_at)}
          </span>
        </div>
        <StageBadge stage={project.stage} />
      </div>

      <h3 className="card__title">{project.title}</h3>
      <p className="card__tagline">{project.tagline}</p>
      {project.description ? (
        <p className="card__desc">{project.description.split('\n')[0]}</p>
      ) : null}

      {project.feedback_wanted ? (
        <p className="card__asking">
          <span className="card__asking-label">
            <Icon name="message" size={11} /> wants feedback on
          </span>
          {project.feedback_wanted}
        </p>
      ) : null}

      {project.tags.length ? (
        <div className="card__tags">
          {project.tags.slice(0, 5).map((tag) => (
            <Tag key={tag} label={tag} onClick={() => onTag(tag)} />
          ))}
        </div>
      ) : null}

      <div className="strip">
        <code>guild/{project.slug}</code>
        <span className="strip__dot" />
        <span className="strip__meta">
          <Icon name="clock" size={11} /> {relativeTime(project.created_at)}
        </span>
        <div className="strip__links">
          {project.demo_url ? (
            <a className="chiplink chiplink--go" href={project.demo_url} target="_blank" rel="noreferrer">
              <Icon name="link" size={12} /> {hostname(project.demo_url)}
            </a>
          ) : null}
          {project.repo_url ? (
            <a className="chiplink" href={project.repo_url} target="_blank" rel="noreferrer">
              <Icon name="code" size={12} /> source
            </a>
          ) : null}
        </div>
      </div>

      <footer className="card__foot">
        <CheerButton count={project.cheer_count} cheered={cheered} onClick={onCheer} size="sm" />
        <button className="ghostcount" onClick={onOpen}>
          <Icon name="message" size={13} />
          {project.comment_count}
          <span>{project.comment_count === 1 ? 'reply' : 'replies'}</span>
        </button>
        <button className="openlink" onClick={onOpen}>
          Open <Icon name="arrow" size={12} />
        </button>
      </footer>
    </article>
  );
}
