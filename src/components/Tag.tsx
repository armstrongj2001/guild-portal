export function Tag({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  if (!onClick) return <span className="tag">{label}</span>;

  return (
    <button className={`tag tag--button${active ? ' is-active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
}

export function StageBadge({ stage }: { stage: string }) {
  return <span className={`stage stage--${stage}`}>{stage}</span>;
}
