import { useMemo } from 'react';
import { initials } from '../lib/format';

/** Deterministic gradient per handle — every member gets a distinct mark. */
function gradient(seed: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return [`hsl(${hue} 72% 62%)`, `hsl(${(hue + 48) % 360} 68% 46%)`];
}

export function Avatar({
  name,
  src,
  size = 32,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  const [from, to] = useMemo(() => gradient(name), [name]);
  const style = { width: size, height: size, fontSize: size * 0.36 };

  return src ? (
    <img className="avatar" src={src} alt="" style={style} loading="lazy" />
  ) : (
    <span
      className="avatar avatar--fallback"
      style={{ ...style, backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
