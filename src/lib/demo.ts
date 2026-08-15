import type { Comment, Project } from '../types';

const ago = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();

/**
 * Seed data for demo mode. Never touches the network, so the portal is fully
 * explorable before Supabase is wired up. Writes are in-memory and vanish on
 * reload — the banner says so.
 */
export const demoProjects: Project[] = [
  {
    id: 'd1', slug: 'permit-guide', owner_id: 'u1', owner_handle: 'armstrongj2001',
    owner_name: 'Jobi', owner_avatar: null,
    title: 'Permit Guide',
    tagline: 'Turns a set of construction drawings into a jurisdiction-specific permit checklist.',
    description:
      'Upload a plan set, get back the exact submittal requirements for that city — forms, stamps, and the review sequence. Every jurisdiction publishes the same information in a different shape, so the parsing is the whole product.\n\nHandles Denver and Arvada today. Adding a jurisdiction is a config file, not code.',
    demo_url: 'https://example.com/permit-guide', repo_url: null, image_url: null,
    tags: ['rag', 'documents', 'construction'], stage: 'building',
    feedback_wanted: 'Is the checklist readable for someone who has never pulled a permit? I am too close to it.',
    created_at: ago(5), cheer_count: 7, comment_count: 2,
  },
  {
    id: 'd2', slug: 'meeting-capture', owner_id: 'u2', owner_handle: 'sortiz',
    owner_name: 'Sam Ortiz', owner_avatar: null,
    title: 'Meeting Capture',
    tagline: 'Dictation straight into structured meeting notes, no cleanup pass.',
    description:
      'Voice in, formatted notes out — decisions, owners, and follow-ups separated automatically. The hard part was never transcription quality; it was getting the model to leave the rambling out.',
    demo_url: 'https://example.com/capture', repo_url: 'https://github.com/example/meeting-capture',
    image_url: null, tags: ['voice', 'productivity', 'whisper'], stage: 'live',
    feedback_wanted: 'Looking for testers with genuinely messy standups.',
    created_at: ago(28), cheer_count: 12, comment_count: 1,
  },
  {
    id: 'd3', slug: 'shop-floor-copilot', owner_id: 'u3', owner_handle: 'renbuilds',
    owner_name: 'Ren Alvarez', owner_avatar: null,
    title: 'Shop Floor Copilot',
    tagline: 'A tablet assistant that answers machine questions from the manual you photographed.',
    description:
      'Point a camera at the machine plate, ask a question, get the answer from the manual. Offline-first, because the shop has no signal past the loading dock.',
    demo_url: null, repo_url: 'https://github.com/example/shop-floor', image_url: null,
    tags: ['vision', 'offline', 'manufacturing'], stage: 'idea',
    feedback_wanted: 'Anyone have a good pattern for shipping a local model to a cheap Android tablet?',
    created_at: ago(52), cheer_count: 4, comment_count: 3,
  },
  {
    id: 'd4', slug: 'ledger-diff', owner_id: 'u4', owner_handle: 'pmalik',
    owner_name: 'Priya Malik', owner_avatar: null,
    title: 'Ledger Diff',
    tagline: 'Reconciles two accounting exports and explains every discrepancy in plain English.',
    description:
      'CSV in, CSV in, narrative out. Instead of a diff table it writes the sentence a bookkeeper would: "Invoice 4471 posted twice in March, once as a credit."',
    demo_url: 'https://example.com/ledger-diff', repo_url: null, image_url: null,
    tags: ['finance', 'agents', 'typescript'], stage: 'live',
    feedback_wanted: 'The explanations get verbose past ~40 discrepancies. Summarize, paginate, or something else?',
    created_at: ago(74), cheer_count: 19, comment_count: 4,
  },
  {
    id: 'd5', slug: 'trailhead', owner_id: 'u5', owner_handle: 'dkwan',
    owner_name: 'Dani Kwan', owner_avatar: null,
    title: 'Trailhead',
    tagline: 'Drops you into an unfamiliar codebase with a guided tour instead of a README.',
    description:
      'Indexes a repo, finds the real entry points, and walks you through them in dependency order. Built after onboarding onto four codebases in one quarter.',
    demo_url: null, repo_url: 'https://github.com/example/trailhead', image_url: null,
    tags: ['devtools', 'code-graph', 'python'], stage: 'building',
    feedback_wanted: 'Does the tour order make sense on a repo you already know well? Try it on yours.',
    created_at: ago(96), cheer_count: 15, comment_count: 2,
  },
  {
    id: 'd6', slug: 'quiet-hours', owner_id: 'u2', owner_handle: 'sortiz',
    owner_name: 'Sam Ortiz', owner_avatar: null,
    title: 'Quiet Hours',
    tagline: 'Batches every notification into three digests a day and defends the gaps.',
    description:
      'A local daemon that holds Slack, email, and GitHub noise until a window opens. The interesting part is the escape hatch — deciding what is genuinely urgent without a rules engine nobody maintains.',
    demo_url: null, repo_url: null, image_url: null,
    tags: ['productivity', 'rust', 'local-first'], stage: 'idea',
    feedback_wanted: 'What has actually broken through your focus mode that should have?',
    created_at: ago(120), cheer_count: 9, comment_count: 1,
  },
];

export const demoComments: Record<string, Comment[]> = {
  d1: [
    {
      id: 'c1',
      project_id: 'd1',
      author_id: 'u2',
      body: 'The checklist reads well. What tripped me up was the stamp requirements — they need to be more visually separated from the forms.',
      created_at: ago(3),
      author: { handle: 'sortiz', display_name: 'Sam Ortiz', avatar_url: null },
    },
    {
      id: 'c2',
      project_id: 'd1',
      author_id: 'u3',
      body: 'Would love to see this for Boulder County. Happy to test if you add it.',
      created_at: ago(1),
      author: { handle: 'renbuilds', display_name: 'Ren Alvarez', avatar_url: null },
    },
  ],
  d2: [
    {
      id: 'c3',
      project_id: 'd2',
      author_id: 'u1',
      body: 'Tried it on a 40-minute call and the follow-ups were right. The decisions section pulled in one thing we explicitly tabled, though.',
      created_at: ago(20),
      author: { handle: 'armstrongj2001', display_name: 'Jobi', avatar_url: null },
    },
  ],
};
