import { Icon } from './Icon';

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

const STAGE_ICON = { idea: 'flask', building: 'hammer', live: 'check' } as const;

export function StageBadge({ stage }: { stage: string }) {
  const icon = STAGE_ICON[stage as keyof typeof STAGE_ICON];
  return (
    <span className={`stage stage--${stage}`}>
      {icon ? <Icon name={icon} size={11} /> : null}
      {stage}
    </span>
  );
}
