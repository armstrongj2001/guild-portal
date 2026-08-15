import { useState } from 'react';
import { STAGES, type NewProject, type Project, type Stage } from '../types';
import { createProject } from '../lib/api';
import { useAuth } from '../lib/auth';
import { Dialog } from './Dialog';

const EMPTY: NewProject = {
  title: '',
  tagline: '',
  description: '',
  demo_url: '',
  repo_url: '',
  image_url: '',
  tags: [],
  stage: 'building',
  feedback_wanted: '',
};

export function SubmitDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (project: Project) => void;
}) {
  const { profile } = useAuth();
  const [form, setForm] = useState<NewProject>(EMPTY);
  const [tagInput, setTagInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof NewProject>(key: K, value: NewProject[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addTags = (raw: string) => {
    const next = raw
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t && !form.tags.includes(t));
    if (next.length) set('tags', [...form.tags, ...next].slice(0, 6));
    setTagInput('');
  };

  const ready = form.title.trim().length > 1 && form.tagline.trim().length > 1;

  const submit = async () => {
    if (!profile || !ready || busy) return;
    setBusy(true);
    setError('');
    try {
      onCreated(await createProject(form, profile));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setBusy(false);
    }
  };

  return (
    <Dialog
      title="Share a project"
      subtitle="Half-finished is welcome. Say what you want feedback on."
      onClose={onClose}
    >
      <div className="stack">
        <label className="field">
          <span>
            What is it called? <em>required</em>
          </span>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Permit Guide"
            maxLength={80}
            autoFocus
          />
        </label>

        <label className="field">
          <span>
            One line about it <em>required</em>
          </span>
          <input
            value={form.tagline}
            onChange={(e) => set('tagline', e.target.value)}
            placeholder="Turns a set of drawings into a permit checklist."
            maxLength={140}
          />
          <small>{140 - form.tagline.length} characters left</small>
        </label>

        <fieldset className="field">
          <span>Where is it at?</span>
          <div className="chips">
            {STAGES.map((stage) => (
              <button
                key={stage.value}
                className={`chip${form.stage === stage.value ? ' is-active' : ''}`}
                onClick={() => set('stage', stage.value as Stage)}
                title={stage.hint}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span>Tell us more</span>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="What it does, why you built it, what surprised you."
            rows={5}
            maxLength={4000}
          />
        </label>

        <label className="field field--accent">
          <span>What do you want feedback on?</span>
          <textarea
            value={form.feedback_wanted}
            onChange={(e) => set('feedback_wanted', e.target.value)}
            placeholder="Is the onboarding clear? Is this even worth building?"
            rows={2}
            maxLength={500}
          />
          <small>Projects that ask a specific question get far better replies.</small>
        </label>

        <div className="row">
          <label className="field">
            <span>Live link</span>
            <input
              value={form.demo_url}
              onChange={(e) => set('demo_url', e.target.value)}
              placeholder="https://"
              inputMode="url"
            />
          </label>
          <label className="field">
            <span>Code link</span>
            <input
              value={form.repo_url}
              onChange={(e) => set('repo_url', e.target.value)}
              placeholder="https://github.com/…"
              inputMode="url"
            />
          </label>
        </div>

        <div className="field">
          <span>Tags</span>
          <div className="chips">
            {form.tags.map((tag) => (
              <button
                key={tag}
                className="chip is-active"
                onClick={() =>
                  set(
                    'tags',
                    form.tags.filter((t) => t !== tag),
                  )
                }
                title="Remove"
              >
                {tag} ✕
              </button>
            ))}
          </div>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addTags(tagInput);
              }
            }}
            onBlur={() => tagInput && addTags(tagInput)}
            placeholder="rag, voice, agents — press enter"
            disabled={form.tags.length >= 6}
          />
        </div>

        {error ? <p className="notice notice--bad">{error}</p> : null}

        <div className="dialog__actions">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={() => void submit()} disabled={!ready || busy}>
            {busy ? 'Posting…' : 'Post to the guild'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
