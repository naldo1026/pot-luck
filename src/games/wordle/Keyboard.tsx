import { BackspaceIcon } from '../../components/icons';
import type { LetterState } from './logic';

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', '+ZXCVBNM-'];

export function Keyboard({ states, onKey }: { states: Record<string, LetterState>; onKey: (key: string) => void }) {
  return (
    <div className="keyboard" aria-label="Keyboard">
      {ROWS.map((row, r) => (
        <div key={row} className="kb-row">
          {r === 1 && <span className="kb-spacer" />}
          {row.split('').map((ch) => {
            if (ch === '+')
              return (
                <button key="enter" type="button" className="key key-wide" onClick={() => onKey('Enter')}>
                  Enter
                </button>
              );
            if (ch === '-')
              return (
                <button key="back" type="button" className="key key-wide" aria-label="Backspace" onClick={() => onKey('Backspace')}>
                  <BackspaceIcon width={22} height={22} />
                </button>
              );
            const state = states[ch];
            return (
              <button
                key={ch}
                type="button"
                className={`key${state ? ` ${state}` : ''}`}
                aria-label={state ? `${ch} ${state}` : ch}
                onClick={() => onKey(ch)}
              >
                {ch}
              </button>
            );
          })}
          {r === 1 && <span className="kb-spacer" />}
        </div>
      ))}
    </div>
  );
}
