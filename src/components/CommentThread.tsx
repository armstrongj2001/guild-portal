import { useState } from 'react';
import type { Comment, Profile } from '../types';
import { relativeTime } from '../lib/format';
import { Avatar } from './Avatar';

export function CommentThread({
  comments,
  profile,
  onSubmit,
  onSignIn,
}: {
  comments: Comment[];
  profile: Profile | null;
  onSubmit: (body: string) => Promise<void>;
  onSignIn: () => void;
}) {
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async () => {
    const text = body.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      await onSubmit(text);
      setBody('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="thread">
      <h2>
        Feedback{' '}
        <span className="thread__count">{comments.length ? comments.length : 'none yet'}</span>
      </h2>

      {profile ? (
        <div className="composer">
          <Avatar name={profile.display_name ?? profile.handle} src={profile.avatar_url} size={36} />
          <div className="composer__body">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What worked, what confused you, what you'd try next…"
              rows={3}
              maxLength={2000}
            />
            <div className="composer__foot">
              <span className="hint">Be specific. Kind and useful beats nice.</span>
              <button className="btn btn--primary btn--sm" onClick={() => void send()} disabled={!body.trim() || busy}>
                {busy ? 'Posting…' : 'Post feedback'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button className="signin-prompt" onClick={onSignIn}>
          Sign in to leave feedback
        </button>
      )}

      <ol className="comments">
        {comments.map((comment) => (
          <li key={comment.id}>
            <Avatar
              name={comment.author.display_name ?? comment.author.handle}
              src={comment.author.avatar_url}
              size={32}
            />
            <div>
              <p className="comments__meta">
                <strong>{comment.author.display_name ?? comment.author.handle}</strong>
                <span>@{comment.author.handle}</span>
                <time dateTime={comment.created_at}>{relativeTime(comment.created_at)}</time>
              </p>
              <p className="comments__body">{comment.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
