import type { Comment, Project } from '../types';

const ago = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();

/**
 * Seed data for demo mode. Never touches the network, so the portal is fully
 * explorable before Supabase is wired up. Writes are in-memory and vanish on
 * reload — the banner says so.
 */
export const demoProjects: Project[] = [
  {
    id: 'd1',
    slug: 'permit-guide',
    owner_id: 'u1',
    owner_handle: 'armstrongj2001',
    owner_name: 'Jobi',
    owner_avatar: null,
    title: 'Permit Guide',
    tagline: 'Turns a set of construction drawings into a jurisdiction-specific permit checklist.',
    description:
      'Upload a plan set, get back the exact submittal requirements for that city — forms, stamps, and the review sequence. Built because every jurisdiction publishes the same information in a different shape.\n\nRight now it handles Denver and Arvada. Adding a jurisdiction is a config file, not code.',
    demo_url: 'https://example.com',
    repo_url: null,
    image_url: null,
    tags: ['construction', 'documents', 'rag'],
    stage: 'building',
    feedback_wanted:
      'Is the checklist output readable enough for someone who has never pulled a permit? I am too close to it.',
    created_at: ago(5),
    cheer_count: 7,
    comment_count: 2,
  },
  {
    id: 'd2',
    slug: 'meeting-capture',
    owner_id: 'u2',
    owner_handle: 'guildmember',
    owner_name: 'Sam Ortiz',
    owner_avatar: null,
    title: 'Meeting Capture',
    tagline: 'Dictation straight into structured meeting notes, no cleanup pass.',
    description:
      'Voice in, formatted notes out — decisions, owners, and follow-ups separated automatically. The trick was not transcription quality, it was getting the model to leave the rambling out.',
    demo_url: null,
    repo_url: 'https://github.com/example/meeting-capture',
    image_url: null,
    tags: ['voice', 'productivity'],
    stage: 'live',
    feedback_wanted: 'Looking for testers with messy standups.',
    created_at: ago(28),
    cheer_count: 12,
    comment_count: 1,
  },
  {
    id: 'd3',
    slug: 'shop-floor-copilot',
    owner_id: 'u3',
    owner_handle: 'buildsbot',
    owner_name: 'Ren',
    owner_avatar: null,
    title: 'Shop Floor Copilot',
    tagline: 'A tablet assistant that answers machine questions from the manual you photographed.',
    description:
      'Point a camera at the machine plate, ask a question, get the answer from the manual. Offline-first because the shop has no signal.',
    demo_url: null,
    repo_url: null,
    image_url: null,
    tags: ['vision', 'offline', 'manufacturing'],
    stage: 'idea',
    feedback_wanted: 'Does anyone have a good pattern for shipping a local model to a cheap tablet?',
    created_at: ago(52),
    cheer_count: 4,
    comment_count: 0,
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
      author: { handle: 'guildmember', display_name: 'Sam Ortiz', avatar_url: null },
    },
    {
      id: 'c2',
      project_id: 'd1',
      author_id: 'u3',
      body: 'Would love to see this for Boulder County. Happy to test if you add it.',
      created_at: ago(1),
      author: { handle: 'buildsbot', display_name: 'Ren', avatar_url: null },
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
