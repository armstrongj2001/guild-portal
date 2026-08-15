-- Guild Portal schema. Paste this into the Supabase SQL editor and run it once.
-- Safe to re-run.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- profiles --
create table if not exists profiles (
  id           uuid primary key references auth.users on delete cascade,
  handle       text unique not null,
  display_name text,
  avatar_url   text,
  bio          text,
  created_at   timestamptz not null default now()
);

-- A profile row is created for every new signup so the app never has to handle
-- a logged-in user without one.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base text;
  candidate text;
  n int := 0;
begin
  base := lower(regexp_replace(
    coalesce(
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'preferred_username',
      split_part(new.email, '@', 1),
      'member'
    ), '[^a-z0-9_-]', '', 'gi'));
  if base = '' then base := 'member'; end if;

  candidate := base;
  while exists (select 1 from profiles where handle = candidate) loop
    n := n + 1;
    candidate := base || n::text;
  end loop;

  insert into profiles (id, handle, display_name, avatar_url)
  values (
    new.id,
    candidate,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', candidate),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------- projects --
create table if not exists projects (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references profiles on delete cascade,
  slug            text unique not null,
  title           text not null check (char_length(title) between 2 and 80),
  tagline         text not null check (char_length(tagline) between 2 and 140),
  description     text check (char_length(description) <= 4000),
  demo_url        text,
  repo_url        text,
  image_url       text,
  tags            text[] not null default '{}',
  stage           text not null default 'building' check (stage in ('idea', 'building', 'live')),
  feedback_wanted text check (char_length(feedback_wanted) <= 500),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists projects_created_at_idx on projects (created_at desc);
create index if not exists projects_owner_idx on projects (owner_id);

create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists projects_touch on projects;
create trigger projects_touch before update on projects
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------- comments --
create table if not exists comments (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  author_id  uuid not null references profiles on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists comments_project_idx on comments (project_id, created_at);

-- ------------------------------------------------------------------ cheers --
create table if not exists cheers (
  project_id uuid not null references projects on delete cascade,
  user_id    uuid not null references profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- --------------------------------------------------------------------- RLS --
alter table profiles enable row level security;
alter table projects enable row level security;
alter table comments enable row level security;
alter table cheers   enable row level security;

drop policy if exists "profiles are public"        on profiles;
drop policy if exists "own profile is editable"    on profiles;
drop policy if exists "projects are public"        on projects;
drop policy if exists "members can post projects"  on projects;
drop policy if exists "owners can edit projects"   on projects;
drop policy if exists "owners can delete projects" on projects;
drop policy if exists "comments are public"        on comments;
drop policy if exists "members can comment"        on comments;
drop policy if exists "authors can delete comments" on comments;
drop policy if exists "cheers are public"          on cheers;
drop policy if exists "members can cheer"          on cheers;
drop policy if exists "members can uncheer"        on cheers;

create policy "profiles are public"     on profiles for select using (true);
create policy "own profile is editable" on profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "projects are public"       on projects for select using (true);
create policy "members can post projects" on projects for insert
  with check (auth.uid() = owner_id);
create policy "owners can edit projects"  on projects for update
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners can delete projects" on projects for delete
  using (auth.uid() = owner_id);

create policy "comments are public"        on comments for select using (true);
create policy "members can comment"        on comments for insert
  with check (auth.uid() = author_id);
create policy "authors can delete comments" on comments for delete
  using (auth.uid() = author_id);

create policy "cheers are public"   on cheers for select using (true);
create policy "members can cheer"   on cheers for insert with check (auth.uid() = user_id);
create policy "members can uncheer" on cheers for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------- the feed --
-- One row per project with its author and counts, so the grid is a single
-- query. security_invoker keeps the underlying RLS policies in force.
create or replace view project_feed
with (security_invoker = on) as
select
  p.*,
  pr.handle       as owner_handle,
  pr.display_name as owner_name,
  pr.avatar_url   as owner_avatar,
  (select count(*) from cheers   c  where c.project_id  = p.id) as cheer_count,
  (select count(*) from comments cm where cm.project_id = p.id) as comment_count
from projects p
join profiles pr on pr.id = p.owner_id;

grant select on project_feed to anon, authenticated;
