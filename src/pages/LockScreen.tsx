import { useState, type FormEvent } from 'react';
import { LockIcon, PotIcon } from '../components/icons';
import { personal, personalText } from '../config/personal';
import { passcodeMatches } from '../utils/passcode';

const NOPES = ["Nope — the clay's still wet!", 'Not quite… have another go', "The kiln door's stuck. Try again!", 'Hmm, not that one 🤔'];

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { passcode } = personal;
  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const hint = personalText(passcode.hint);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (passcodeMatches(value)) {
      setMessage(`Welcome in, ${personal.name} 🌸`);
      setOpening(true);
      window.setTimeout(onUnlock, 1100);
      return;
    }
    setTries((t) => t + 1);
    setMessage(NOPES[tries % NOPES.length]);
    setShake(true);
    window.setTimeout(() => setShake(false), 500);
    setValue('');
  };

  return (
    <main className={`lock${opening ? ' opening' : ''}`}>
      <div className="lock-door card">
        <div className="lock-badge" aria-hidden>
          <PotIcon width={40} height={46} />
          <span className="lock-padlock">
            <LockIcon width={18} height={18} />
          </span>
        </div>
        <p className="eyebrow">{personal.appTitle}</p>
        <h1>The studio's locked</h1>
        <form onSubmit={submit} className={shake ? 'shake' : undefined}>
          <label htmlFor="passcode" className="lock-prompt">
            {personalText(passcode.prompt) ?? 'Enter the secret code'}
          </label>
          <input
            id="passcode"
            className="lock-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode={passcode.inputMode}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-block" disabled={!value.trim()}>
            Open the studio
          </button>
        </form>
        <p className="lock-message" role="status" aria-live="polite">
          {message}
        </p>
        {tries >= 2 && hint && <p className="lock-hint hand">Hint: {hint}</p>}
      </div>
    </main>
  );
}
