import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Null until the two env vars are set, which puts the whole app in demo mode
 * against seed data. That keeps `npm run dev` working for anyone who clones the
 * repo without credentials.
 *
 * The anon key is meant to be public — every table is guarded by row-level
 * security, not by hiding this string.
 */
export const supabase = url && key ? createClient(url, key) : null;

export const isLive = supabase !== null;
