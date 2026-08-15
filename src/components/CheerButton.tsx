export function CheerButton({
  count,
  cheered,
  onClick,
  size = 'md',
}: {
  count: number;
  cheered: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}) {
  return (
    <button
      className={`cheer cheer--${size}${cheered ? ' is-on' : ''}`}
      onClick={onClick}
      aria-pressed={cheered}
      title={cheered ? 'Remove your cheer' : 'Cheer this project'}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M12 20.5 4.7 13.6a4.6 4.6 0 0 1 0-6.6 4.9 4.9 0 0 1 6.8 0l.5.5.5-.5a4.9 4.9 0 0 1 6.8 0 4.6 4.6 0 0 1 0 6.6Z"
          fill={cheered ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}
