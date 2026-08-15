import { supabase } from './supabase';
import { demoComments, demoProjects } from './demo';
import type { Comment, NewProject, Profile, Project } from '../types';

const projects = [...demoProjects];
const comments: Record<string, Comment[]> = { ...demoComments };
const demoCheers = new Set<string>();

/** Sample rows carry `d`-prefixed ids; anything else is a real uuid. */
const isSample = (id: string) => /^d\d+$/.test(id);

export function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  return `${base || 'project'}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * A live database with nothing in it renders an empty page, which reads as
 * broken rather than new. Fall back to the samples until the first real
 * project lands; the banner says which one you are looking at.
 */
export async function listProjects(): Promise<{ projects: Project[]; sample: boolean }> {
  if (!supabase) return { projects: projects.slice().sort(byNewest), sample: true };

  const { data, error } = await supabase
    .from('project_feed')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  const live = data as Project[];
  return live.length
    ? { projects: live, sample: false }
    : { projects: projects.slice().sort(byNewest), sample: true };
}

export async function getProject(slug: string): Promise<Project | null> {
  const sample = projects.find((p) => p.slug === slug);
  if (!supabase) return sample ?? null;

  const { data, error } = await supabase
    .from('project_feed')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return (data as Project) ?? sample ?? null;
}

export async function createProject(input: NewProject, owner: Profile): Promise<Project> {
  const slug = slugify(input.title);

  if (!supabase) {
    const project: Project = {
      id: crypto.randomUUID(),
      slug,
      owner_id: owner.id,
      owner_handle: owner.handle,
      owner_name: owner.display_name,
      owner_avatar: owner.avatar_url,
      ...input,
      description: input.description || null,
      demo_url: input.demo_url || null,
      repo_url: input.repo_url || null,
      image_url: input.image_url || null,
      feedback_wanted: input.feedback_wanted || null,
      created_at: new Date().toISOString(),
      cheer_count: 0,
      comment_count: 0,
    };
    projects.unshift(project);
    return project;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      owner_id: owner.id,
      slug,
      title: input.title,
      tagline: input.tagline,
      description: input.description || null,
      demo_url: input.demo_url || null,
      repo_url: input.repo_url || null,
      image_url: input.image_url || null,
      tags: input.tags,
      stage: input.stage,
      feedback_wanted: input.feedback_wanted || null,
    })
    .select('slug')
    .single();

  if (error) throw error;
  const created = await getProject(data.slug);
  if (!created) throw new Error('project vanished after insert');
  return created;
}

export async function listComments(projectId: string): Promise<Comment[]> {
  if (!supabase || isSample(projectId)) return comments[projectId] ?? [];

  const { data, error } = await supabase
    .from('comments')
    .select('*, author:profiles(handle, display_name, avatar_url)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as unknown as Comment[];
}

export async function addComment(
  projectId: string,
  body: string,
  author: Profile,
): Promise<Comment> {
  if (!supabase || isSample(projectId)) {
    const comment: Comment = {
      id: crypto.randomUUID(),
      project_id: projectId,
      author_id: author.id,
      body,
      created_at: new Date().toISOString(),
      author: {
        handle: author.handle,
        display_name: author.display_name,
        avatar_url: author.avatar_url,
      },
    };
    comments[projectId] = [...(comments[projectId] ?? []), comment];
    bumpDemo(projectId, 'comment_count', 1);
    return comment;
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({ project_id: projectId, author_id: author.id, body })
    .select('*, author:profiles(handle, display_name, avatar_url)')
    .single();

  if (error) throw error;
  return data as unknown as Comment;
}

export async function listMyCheers(userId: string): Promise<Set<string>> {
  if (!supabase) return new Set(demoCheers);

  const { data, error } = await supabase.from('cheers').select('project_id').eq('user_id', userId);
  if (error) throw error;
  return new Set([...data.map((row) => row.project_id), ...demoCheers]);
}

/** Returns the new cheered state. */
export async function toggleCheer(projectId: string, userId: string): Promise<boolean> {
  const local = !supabase || isSample(projectId);
  const cheered = !(local ? demoCheers.has(projectId) : await hasCheered(projectId, userId));

  if (local) {
    if (cheered) demoCheers.add(projectId);
    else demoCheers.delete(projectId);
    bumpDemo(projectId, 'cheer_count', cheered ? 1 : -1);
    return cheered;
  }

  const { error } = cheered
    ? await supabase!.from('cheers').insert({ project_id: projectId, user_id: userId })
    : await supabase!.from('cheers').delete().eq('project_id', projectId).eq('user_id', userId);

  if (error) throw error;
  return cheered;
}

async function hasCheered(projectId: string, userId: string): Promise<boolean> {
  const { data } = await supabase!
    .from('cheers')
    .select('project_id')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .maybeSingle();
  return Boolean(data);
}

function bumpDemo(projectId: string, field: 'cheer_count' | 'comment_count', delta: number) {
  const project = projects.find((p) => p.id === projectId);
  if (project) project[field] = Math.max(0, project[field] + delta);
}

const byNewest = (a: Project, b: Project) => b.created_at.localeCompare(a.created_at);
