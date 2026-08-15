import { useEffect, useState } from 'react';
import type { Comment, Project } from '../types';
import { addComment, getProject, listComments } from '../lib/api';
import { useAuth } from '../lib/auth';
import { hostname, relativeTime } from '../lib/format';
import { Avatar } from '../components/Avatar';
import { CheerButton } from '../components/CheerButton';
import { CommentThread } from '../components/CommentThread';
import { StageBadge, Tag } from '../components/Tag';

export function ProjectPage({
  slug,
  cheers,
  onCheer,
  onBack,
  onSignIn,
}: {
  slug: string;
  cheers: Set<string>;
  onCheer: (id: string) => void;
  onBack: () => void;
  onSignIn: () => void;
}) {
  const { profile } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let live = true;
    void (async () => {
      const found = await getProject(slug);
      if (!live) return;
      if (!found) return setMissing(true);
      setProject(found);
      setComments(await listComments(found.id));
    })();
    return () => {
      live = false;
    };
  }, [slug]);

  if (missing) {
    return (
      <div className="empty">
        <p>That project isn't here.</p>
        <button className="btn" onClick={onBack}>
          Back to the portal
        </button>
      </div>
    );
  }

  if (!project) return <div className="card card--skeleton card--tall" />;

  const post = async (body: string) => {
    if (!profile) return;
    const comment = await addComment(project.id, body, profile);
    setComments((prev) => [...prev, comment]);
    setProject((prev) => (prev ? { ...prev, comment_count: prev.comment_count + 1 } : prev));
  };

  return (
    <article className="detail">
      <button className="linkish linkish--back" onClick={onBack}>
        ← All projects
      </button>

      <header className="detail__head">
        <div className="detail__who">
          <Avatar
            name={project.owner_name ?? project.owner_handle}
            src={project.owner_avatar}
            size={44}
          />
          <div>
            <strong>{project.owner_name ?? project.owner_handle}</strong>
            <span>
              @{project.owner_handle} · {relativeTime(project.created_at)}
            </span>
          </div>
        </div>
        <StageBadge stage={project.stage} />
      </header>

      <h1>{project.title}</h1>
      <p className="detail__tagline">{project.tagline}</p>

      <div className="detail__actions">
        <CheerButton
          count={project.cheer_count}
          cheered={cheers.has(project.id)}
          onClick={() => onCheer(project.id)}
        />
        {project.demo_url ? (
          <a className="btn btn--sm" href={project.demo_url} target="_blank" rel="noreferrer">
            Open {hostname(project.demo_url)} ↗
          </a>
        ) : null}
        {project.repo_url ? (
          <a className="btn btn--sm btn--ghost" href={project.repo_url} target="_blank" rel="noreferrer">
            View code ↗
          </a>
        ) : null}
      </div>

      {project.feedback_wanted ? (
        <aside className="asking">
          <h2>What they're asking for</h2>
          <p>{project.feedback_wanted}</p>
        </aside>
      ) : null}

      {project.description ? <div className="prose">{project.description}</div> : null}

      {project.tags.length ? (
        <div className="detail__tags">
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      ) : null}

      <CommentThread comments={comments} profile={profile} onSubmit={post} onSignIn={onSignIn} />
    </article>
  );
}
