type Name =
  | 'rocket' | 'users' | 'message' | 'heart' | 'search' | 'plus' | 'tag'
  | 'trophy' | 'sparkle' | 'link' | 'code' | 'clock' | 'filter' | 'bolt'
  | 'flask' | 'hammer' | 'check' | 'arrow' | 'command';

const PATHS: Record<Name, string> = {
  rocket: 'M5 13c-1.5 1.5-2 5-2 5s3.5-.5 5-2m6.5-3.5L9.5 8m9-5s-4 0-7 3l-4.5 4.5 4.5 4.5L16 10.5c3-3 3-7.5 3-7.5Z',
  users: 'M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19m17 0v-1.5a3.5 3.5 0 0 0-2.6-3.4M13.5 5.4a3 3 0 0 1 0 5.7M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  message: 'M21 11.5a8 8 0 0 1-8.5 8 9 9 0 0 1-3.9-.9L3 20.5l1.9-5.1A8 8 0 0 1 4 11.5a8 8 0 0 1 8-8 8 8 0 0 1 9 8Z',
  heart: 'M12 20.5 4.7 13.6a4.6 4.6 0 0 1 0-6.6 4.9 4.9 0 0 1 6.8 0l.5.5.5-.5a4.9 4.9 0 0 1 6.8 0 4.6 4.6 0 0 1 0 6.6Z',
  search: 'M20 20l-4-4m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  plus: 'M12 5v14M5 12h14',
  tag: 'M3 11.5V4a1 1 0 0 1 1-1h7.5a1 1 0 0 1 .7.3l8 8a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1-.3-.7ZM7.5 7.5h.01',
  trophy: 'M7 4h10v5a5 5 0 0 1-10 0V4Zm10 1h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3m2 10h6m-3-3v3',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Zm7 9l.8 2.2L22 15l-2.2.8L19 18l-.8-2.2L16 15l2.2-.8L19 12Z',
  link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  code: 'm16 18 6-6-6-6M8 6l-6 6 6 6',
  clock: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5Z',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  flask: 'M9 3h6M10 3v6L4.5 18A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3M7.5 15h9',
  hammer: 'm15 12-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9m5.6-1.6L21 4m-9 5 3-3m-1-1 5 5m-2-8 5 5',
  check: 'm5 13 4 4L19 7',
  arrow: 'M7 17 17 7m0 0H8m9 0v9',
  command: 'M15 6a3 3 0 1 1 3 3h-3V6Zm0 12a3 3 0 1 0 3-3h-3v3ZM9 6a3 3 0 1 0-3 3h3V6Zm0 12a3 3 0 1 1-3-3h3v3Zm0-9h6v6H9V9Z',
};

export function Icon({ name, size = 15 }: { name: Name; size?: number }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
