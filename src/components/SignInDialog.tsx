import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { isLive } from '../lib/supabase';
import { Dialog } from './Dialog';

export function SignInDialog({ onClose }: { onClose: () => void }) {
  const { signInWithGitHub, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const sendLink = async () => {
    setError('');
    try {
      await signInWithEmail(email);
      if (isLive) setSent(true);
      else onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send the link.');
    }
  };

  return (
    <Dialog
      title="Welcome to the Guild"
      subtitle="Sign in to share projects and leave feedback."
      onClose={onClose}
    >
      {sent ? (
        <p className="notice notice--good">
          Check <strong>{email}</strong> for a sign-in link. You can close this window.
        </p>
      ) : (
        <div className="stack">
          <button
            className="btn btn--primary btn--block"
            onClick={() => {
              void signInWithGitHub();
              if (!isLive) onClose();
            }}
          >
            Continue with GitHub
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
          <button
            className="btn btn--block"
            onClick={() => void sendLink()}
            disabled={!email.includes('@')}
          >
            Email me a sign-in link
          </button>

          {error ? <p className="notice notice--bad">{error}</p> : null}
          <p className="hint">No password. Nothing shared with anyone outside the guild.</p>
        </div>
      )}
    </Dialog>
  );
}
