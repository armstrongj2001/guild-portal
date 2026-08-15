import type { Project } from '../types';
import { hostname, relativeTime } from '../lib/format';
import { Avatar } from './Avatar';
import { CheerButton } from './CheerButton';
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
          size={36}
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

      {project.feedback_wanted ? (
        <p className="card__asking">
          <span className="card__asking-label">Wants feedback on</span>
          {project.feedback_wanted}
        </p>
      ) : null}

      {project.tags.length ? (
        <div className="card__tags">
          {project.tags.slice(0, 4).map((tag) => (
            <Tag key={tag} label={tag} onClick={() => onTag(tag)} />
          ))}
        </div>
      ) : null}

      <footer className="card__foot">
        <CheerButton count={project.cheer_count} cheered={cheered} onClick={onCheer} size="sm" />
        <button className="linkish" onClick={onOpen}>
          {project.comment_count === 1 ? '1 comment' : `${project.comment_count} comments`}
        </button>
        <div className="card__links">
          {project.demo_url ? (
            <a href={project.demo_url} target="_blank" rel="noreferrer">
              {hostname(project.demo_url)} ↗
            </a>
          ) : null}
          {project.repo_url ? (
            <a href={project.repo_url} target="_blank" rel="noreferrer">
              code ↗
            </a>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
