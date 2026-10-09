import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { BackLink, TopBar } from '../components/TopBar';
import { personal } from '../config/personal';
import { getConnectionsPuzzle, getWordleLevel } from '../data';
import { currentLevel } from '../progress/selectors';
import { useProgress } from '../progress/ProgressProvider';
import { TRACKS, type SaveData, type Track } from '../progress/types';

type Theme = NonNullable<SaveData['settings']['theme']>;
const THEMES: [Theme, string][] = [
  ['system', 'Auto'],
  ['light', 'Light'],
  ['dark', 'Dark'],
];

export function Settings() {
  const { save, setSettings, reset } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const toast = useToast();
  const theme = save.settings.theme ?? 'system';

  return (
    <>
      <TopBar left={<BackLink to="/" label="Home" />} title="Settings" />
      <main className="page settings">
        <section className="card settings-section">
          <h2>Look</h2>
          <div className="segmented" role="radiogroup" aria-label="Colour theme">
            {THEMES.map(([value, label]) => (
              <button key={value} type="button" role="radio" aria-checked={theme === value} onClick={() => setSettings({ theme: value })}>
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="card settings-section">
          <h2>Put {personal.appTitle} on your phone</h2>
          <p>
            <strong>iPhone:</strong> open this page in Safari, tap the Share button, then <em>Add to Home Screen</em>.
          </p>
          <p>
            <strong>Android:</strong> open the browser menu (⋮) and tap <em>Install app</em> or <em>Add to Home screen</em>.
          </p>
          <p className="muted">It then opens like a real app, works offline, and keeps your progress safe.</p>
        </section>

        <section className="card settings-section">
          <h2>Progress</h2>
          <p className="muted">Your progress is saved on this device.</p>
          <button type="button" className="btn btn-danger" onClick={() => setConfirmReset(true)}>
            Reset all progress
          </button>
        </section>

        {import.meta.env.DEV && <DevTools />}
      </main>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} labelledBy="reset-title">
        <h2 id="reset-title">Start again?</h2>
        <p className="lede">This clears every level, note and Kiln photo on this device. It can't be undone.</p>
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => setConfirmReset(false)}>
            Keep my progress
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              reset();
              setConfirmReset(false);
              toast('Fresh clay — all reset!');
            }}
          >
            Reset
          </button>
        </div>
      </Modal>
    </>
  );
}

/** Only in `npm run dev`: shortcuts for checking content, notes, the Kiln and the letter. */
function DevTools() {
  const { save, setSettings, update } = useProgress();

  const completeNext = (track: Track, count: number) =>
    update((s) => {
      const next = structuredClone(s);
      for (let k = 0; k < count; k++) {
        const level = currentLevel(next, track);
        if (!level) break;
        const finishedAt = new Date().toISOString();
        if (track === 'wordle') {
          const data = getWordleLevel(level);
          if (data) next.wordle[level] = { guesses: [data.answer], status: 'won', finishedAt };
        } else {
          const data = getConnectionsPuzzle(level);
          if (data) next.connections[level] = { order: [], solved: [0, 1, 2, 3], history: data.groups.map((g) => [...g.words]), mistakes: 0, status: 'won', finishedAt };
        }
      }
      return next;
    });

  return (
    <section className="card settings-section dev">
      <h2>Developer tools</h2>
      <p className="muted">Only visible in <code>npm run dev</code>.</p>
      <label className="toggle">
        <input type="checkbox" checked={!!save.settings.devUnlockAll} onChange={(e) => setSettings({ devUnlockAll: e.target.checked })} />
        Unlock every level
      </label>
      <div className="btn-row">
        {TRACKS.map((track) => (
          <button key={track} type="button" className="btn" onClick={() => completeNext(track, 5)}>
            Finish next 5 {track}
          </button>
        ))}
      </div>
      <div className="btn-row">
        <button type="button" className="btn" onClick={() => update((s) => ({ ...s, seen: [] }))}>
          Replay notes &amp; reveals
        </button>
        <Link className="btn" to="/letter?preview">
          Preview letter
        </Link>
        <a className="btn" href="?placeholders#/kiln">
          Placeholder photos
        </a>
      </div>
    </section>
  );
}
