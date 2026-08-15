-- Demo content for a fresh Guild Portal. Optional — run it once in the SQL
-- editor so the portal has something to show before real members post.
--
-- To remove it later:
--   delete from auth.users where email like '%@guild.demo';
-- (projects, comments, and cheers cascade)

-- Demo members. The on_auth_user_created trigger turns each of these into a
-- profile row, so handles and display names come from raw_user_meta_data.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
                        email_confirmed_at, created_at, updated_at,
                        raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'sortiz@guild.demo',    '', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"user_name":"sortiz","full_name":"Sam Ortiz"}'),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated', 'renbuilds@guild.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"user_name":"renbuilds","full_name":"Ren Alvarez"}'),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-4333-8333-333333333333', 'authenticated', 'authenticated', 'pmalik@guild.demo',    '', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"user_name":"pmalik","full_name":"Priya Malik"}'),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-8444-444444444444', 'authenticated', 'authenticated', 'dkwan@guild.demo',     '', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"user_name":"dkwan","full_name":"Dani Kwan"}')
on conflict (id) do nothing;

insert into projects (id, owner_id, slug, title, tagline, description, demo_url, repo_url, tags, stage, feedback_wanted, created_at)
values
  ('aaaaaaaa-0000-4000-8000-000000000001', '33333333-3333-4333-8333-333333333333', 'ledger-diff', 'Ledger Diff',
   'Reconciles two accounting exports and explains every discrepancy in plain English.',
   E'CSV in, CSV in, narrative out. Instead of a diff table it writes the sentence a bookkeeper would: "Invoice 4471 posted twice in March, once as a credit."',
   'https://example.com/ledger-diff', null, '{finance,agents,typescript}', 'live',
   'The explanations get verbose past ~40 discrepancies. Summarize, paginate, or something else?', now() - interval '3 days'),

  ('aaaaaaaa-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'meeting-capture', 'Meeting Capture',
   'Dictation straight into structured meeting notes, no cleanup pass.',
   E'Voice in, formatted notes out — decisions, owners, and follow-ups separated automatically. The hard part was never transcription quality; it was getting the model to leave the rambling out.',
   'https://example.com/capture', 'https://github.com/example/meeting-capture', '{voice,productivity,whisper}', 'live',
   'Looking for testers with genuinely messy standups.', now() - interval '28 hours'),

  ('aaaaaaaa-0000-4000-8000-000000000003', '44444444-4444-4444-8444-444444444444', 'trailhead', 'Trailhead',
   'Drops you into an unfamiliar codebase with a guided tour instead of a README.',
   E'Indexes a repo, finds the real entry points, and walks you through them in dependency order. Built after onboarding onto four codebases in one quarter.',
   null, 'https://github.com/example/trailhead', '{devtools,code-graph,python}', 'building',
   'Does the tour order make sense on a repo you already know well? Try it on yours.', now() - interval '4 days'),

  ('aaaaaaaa-0000-4000-8000-000000000004', '22222222-2222-4222-8222-222222222222', 'shop-floor-copilot', 'Shop Floor Copilot',
   'A tablet assistant that answers machine questions from the manual you photographed.',
   E'Point a camera at the machine plate, ask a question, get the answer from the manual. Offline-first, because the shop has no signal past the loading dock.',
   null, 'https://github.com/example/shop-floor', '{vision,offline,manufacturing}', 'idea',
   'Anyone have a good pattern for shipping a local model to a cheap Android tablet?', now() - interval '2 days'),

  ('aaaaaaaa-0000-4000-8000-000000000005', '11111111-1111-4111-8111-111111111111', 'quiet-hours', 'Quiet Hours',
   'Batches every notification into three digests a day and defends the gaps.',
   E'A local daemon that holds Slack, email, and GitHub noise until a window opens. The interesting part is the escape hatch — deciding what is genuinely urgent without a rules engine nobody maintains.',
   null, null, '{productivity,rust,local-first}', 'idea',
   'What has actually broken through your focus mode that should have?', now() - interval '5 days')
on conflict (id) do nothing;

insert into comments (project_id, author_id, body, created_at)
values
  ('aaaaaaaa-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'The narrative output is the whole trick. I would try grouping by root cause before paginating — most of my 40+ cases are the same mistake repeated.', now() - interval '2 days'),
  ('aaaaaaaa-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', 'Ran it against a messy Q3 export. Two false positives, both timing differences across a month boundary.', now() - interval '1 day'),
  ('aaaaaaaa-0000-4000-8000-000000000002', '33333333-3333-4333-8333-333333333333', 'Tried it on a 40-minute call and the follow-ups were right. The decisions section pulled in one thing we explicitly tabled, though.', now() - interval '20 hours'),
  ('aaaaaaaa-0000-4000-8000-000000000003', '22222222-2222-4222-8222-222222222222', 'Pointed it at a repo I wrote and it started somewhere I would not have — but it was defensible. That is a good sign.', now() - interval '3 days'),
  ('aaaaaaaa-0000-4000-8000-000000000004', '44444444-4444-4444-8444-444444444444', 'Quantized 3B on a Snapdragon tablet works if you accept ~2s. Happy to share the build config.', now() - interval '1 day')
on conflict do nothing;

insert into cheers (project_id, user_id)
select p.id, u.id
from projects p
cross join (values
  ('11111111-1111-4111-8111-111111111111'::uuid),
  ('22222222-2222-4222-8222-222222222222'::uuid),
  ('33333333-3333-4333-8333-333333333333'::uuid),
  ('44444444-4444-4444-8444-444444444444'::uuid)
) as u(id)
where p.owner_id <> u.id
on conflict do nothing;
