import { initials } from '../lib/format';

export function Avatar({
  name,
  src,
  size = 32,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  const style = { width: size, height: size, fontSize: size * 0.38 };

  return src ? (
    <img className="avatar" src={src} alt="" style={style} loading="lazy" />
  ) : (
    <span className="avatar avatar--fallback" style={style} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
