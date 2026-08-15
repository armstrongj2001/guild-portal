import { useCallback, useEffect, useState } from 'react';
import type { Project } from './types';
import { listMyCheers, listProjects, toggleCheer } from './lib/api';
import { useAuth } from './lib/auth';
import { usePath } from './lib/router';
import { isLive } from './lib/supabase';
import { Header } from './components/Header';
import { SignInDialog } from './components/SignInDialog';
import { SubmitDialog } from './components/SubmitDialog';
import { Home } from './pages/Home';
import { ProjectPage } from './pages/ProjectPage';

export default function App() {
  const { profile } = useAuth();
  const [path, navigate] = usePath();
  const [projects, setProjects] = useState<Project[]>([]);
  const [cheers, setCheers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<'submit' | 'signin' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    void (async () => {
      try {
        setProjects(await listProjects());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load projects.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!profile) return setCheers(new Set());
    void listMyCheers(profile.id).then(setCheers);
  }, [profile]);

  const cheer = useCallback(
    async (projectId: string) => {
      if (!profile) return setDialog('signin');

      // Optimistic: a cheer that waits on a round trip feels broken.
      const on = !cheers.has(projectId);
      setCheers((prev) => {
        const next = new Set(prev);
        if (on) next.add(projectId);
        else next.delete(projectId);
        return next;
      });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, cheer_count: Math.max(0, p.cheer_count + (on ? 1 : -1)) } : p,
        ),
      );

      try {
        await toggleCheer(projectId, profile.id);
      } catch {
        setProjects(await listProjects());
        setCheers(await listMyCheers(profile.id));
      }
    },
    [cheers, profile],
  );

  const openSubmit = () => setDialog(profile ? 'submit' : 'signin');

  const slug = path.startsWith('/p/') ? path.slice(3) : null;

  return (
    <div className="shell">
      <Header
        onSubmit={openSubmit}
        onSignIn={() => setDialog('signin')}
        onHome={() => navigate('/')}
      />

      {!isLive ? (
        <p className="banner">
          <strong>Demo mode.</strong> You're seeing sample projects — sign in, post, and comment all
          work, but nothing is saved. Connect Supabase to go live.
        </p>
      ) : null}

      <main className="main">
        {error ? <p className="notice notice--bad">{error}</p> : null}

        {slug ? (
          <ProjectPage
            slug={slug}
            cheers={cheers}
            onCheer={(id) => void cheer(id)}
            onBack={() => navigate('/')}
            onSignIn={() => setDialog('signin')}
          />
        ) : (
          <Home
            projects={projects}
            cheers={cheers}
            loading={loading}
            onOpen={(s) => navigate(`/p/${s}`)}
            onCheer={(id) => void cheer(id)}
            onSubmit={openSubmit}
          />
        )}
      </main>

      <footer className="foot">
        <span>Built by the AI Builders Guild.</span>
        <a href="https://github.com/armstrongj2001/guild-portal">Source ↗</a>
      </footer>

      {dialog === 'signin' ? <SignInDialog onClose={() => setDialog(null)} /> : null}
      {dialog === 'submit' ? (
        <SubmitDialog
          onClose={() => setDialog(null)}
          onCreated={(project) => {
            setProjects((prev) => [project, ...prev]);
            setDialog(null);
            navigate(`/p/${project.slug}`);
          }}
        />
      ) : null}
    </div>
  );
}
