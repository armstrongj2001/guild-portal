import { useEffect, useRef } from 'react';
import { useAuth } from '../lib/auth';
import { Avatar } from './Avatar';

export function Header({
  onSubmit,
  onSignIn,
  onHome,
  query,
  onQuery,
}: {
  onSubmit: () => void;
  onSignIn: () => void;
  onHome: () => void;
  query?: string;
  onQuery?: (value: string) => void;
}) {
  const { profile, signOut } = useAuth();
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        search.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="header">
      <div className="header__inner">
        <button className="brand" onClick={onHome}>
          <span className="brand__mark" aria-hidden="true">
            ◆
          </span>
          <span className="brand__text">
            <strong>Guild Portal</strong>
            <small>AI Builders Guild</small>
          </span>
        </button>

        {onQuery ? (
          <label className="search">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              ref={search}
              value={query ?? ''}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search projects, builders, tags…"
              type="search"
            />
            <kbd>⌘K</kbd>
          </label>
        ) : null}

        <div className="header__actions">
          <button className="btn btn--primary" onClick={onSubmit}>
            Share a project
          </button>
          {profile ? (
            <div className="account">
              <Avatar name={profile.display_name ?? profile.handle} src={profile.avatar_url} />
              <div className="account__menu">
                <p>
                  Signed in as <strong>@{profile.handle}</strong>
                </p>
                <button className="btn btn--ghost btn--sm" onClick={() => void signOut()}>
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <button className="btn btn--ghost" onClick={onSignIn}>
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
