import { useAuth } from '../lib/auth';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

export function Header({
  onSubmit,
  onSignIn,
  onHome,
  onSearch,
}: {
  onSubmit: () => void;
  onSignIn: () => void;
  onHome: () => void;
  onSearch: () => void;
}) {
  const { profile, signOut } = useAuth();

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

        <button className="search" onClick={onSearch}>
          <Icon name="search" size={15} />
          <span>Search projects, builders, tags…</span>
          <kbd>⌘K</kbd>
        </button>

        <div className="header__actions">
          <button className="btn btn--primary" onClick={onSubmit}>
            <Icon name="plus" size={14} /> Share a project
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
