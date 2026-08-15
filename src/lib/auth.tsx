import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import type { Profile } from '../types';

type AuthValue = {
  profile: Profile | null;
  loading: boolean;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const DEMO_PROFILE: Profile = {
  id: 'demo-user',
  handle: 'you',
  display_name: 'You (demo)',
  avatar_url: null,
  bio: null,
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(supabase !== null);

  useEffect(() => {
    if (!supabase) return;

    const load = async (userId: string | undefined) => {
      if (!userId) return setProfile(null);
      const { data } = await supabase!.from('profiles').select('*').eq('id', userId).maybeSingle();
      setProfile((data as Profile) ?? null);
    };

    supabase.auth.getSession().then(async ({ data }) => {
      await load(data.session?.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void load(session?.user.id);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthValue = {
    profile,
    loading,
    // Demo mode signs you in instantly so the whole flow is explorable.
    signInWithGitHub: async () => {
      if (!supabase) return setProfile(DEMO_PROFILE);
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin + import.meta.env.BASE_URL },
      });
    },
    signInWithEmail: async (email: string) => {
      if (!supabase) return setProfile(DEMO_PROFILE);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + import.meta.env.BASE_URL },
      });
      if (error) throw error;
    },
    signOut: async () => {
      if (!supabase) return setProfile(null);
      await supabase.auth.signOut();
      setProfile(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth outside AuthProvider');
  return value;
}
