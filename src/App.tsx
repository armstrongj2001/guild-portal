import { useMemo, useState } from 'react';
import feed from '../data/feed.json';
import type { FeedItem } from './types';
import { renderItem, themes } from './feed';

const items = feed as FeedItem[];

const STORAGE_KEY = 'guild-build-log:theme';

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? themes[0] ?? 'guild',
  );
  const [actor, setActor] = useState('all');
  const [kind, setKind] = useState('all');

  document.documentElement.dataset.theme = theme;

  const actors = useMemo(() => unique(items.map((i) => i.actor)), []);
  const kinds = useMemo(() => unique(items.map((i) => i.kind)), []);

  const visible = items.filter(
    (item) => (actor === 'all' || item.actor === actor) && (kind === 'all' || item.kind === kind),
  );

  return (
    <div className="app">
      <header className="masthead">
        <div>
          <h1>Guild Build Log</h1>
          <p className="tagline">What the AI Builders Guild is shipping.</p>
        </div>
        <div className="controls">
          <Select label="member" value={actor} options={actors} onChange={setActor} />
          <Select label="kind" value={kind} options={kinds} onChange={setKind} />
          <Select
            label="theme"
            value={theme}
            options={themes}
            includeAll={false}
            onChange={(next) => {
              setTheme(next);
              localStorage.setItem(STORAGE_KEY, next);
            }}
          />
        </div>
      </header>

      <main className="feed">
        {visible.length ? (
          visible.map((item) => <div key={item.id}>{renderItem(item)}</div>)
        ) : (
          <p className="empty">
            No activity yet. The refresh workflow populates <code>data/feed.json</code> three times
            a day.
          </p>
        )}
      </main>

      <footer>
        <a href="https://github.com/armstrongj2001/guild-build-log">Fork it</a> ·{' '}
        {items.length} items · built {new Date(BUILD_TIME).toLocaleString()}
      </footer>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  includeAll = true,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  includeAll?: boolean;
}) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {includeAll ? <option value="all">all</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

const unique = (values: string[]) => [...new Set(values)].sort();
