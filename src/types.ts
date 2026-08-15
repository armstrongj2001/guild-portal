export type Stage = 'idea' | 'building' | 'live';

export type Project = {
  id: string;
  slug: string;
  owner_id: string;
  owner_handle: string;
  owner_name: string | null;
  owner_avatar: string | null;
  title: string;
  tagline: string;
  description: string | null;
  demo_url: string | null;
  repo_url: string | null;
  image_url: string | null;
  tags: string[];
  stage: Stage;
  feedback_wanted: string | null;
  created_at: string;
  cheer_count: number;
  comment_count: number;
};

export type Comment = {
  id: string;
  project_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author: {
    handle: string;
    display_name: string | null;
    avatar_url: string | null;
  };
};

export type Profile = {
  id: string;
  handle: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

export type NewProject = {
  title: string;
  tagline: string;
  description: string;
  demo_url: string;
  repo_url: string;
  image_url: string;
  tags: string[];
  stage: Stage;
  feedback_wanted: string;
};

export const STAGES: { value: Stage; label: string; hint: string }[] = [
  { value: 'idea', label: 'Idea', hint: 'Thinking it through' },
  { value: 'building', label: 'Building', hint: 'Actively working on it' },
  { value: 'live', label: 'Live', hint: 'Out in the world' },
];
