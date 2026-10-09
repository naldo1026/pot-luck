import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import type { ConnectionsGroup } from '../../data/types';

const MAX_FONT = 18;
const MIN_FONT = 9;

/** Shrinks a tile's label until the longest word fits on the tile. */
function useFitText(text: string) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let size = Math.min(MAX_FONT, Math.max(MIN_FONT, el.clientWidth / 4.6));
      el.style.fontSize = `${size}px`;
      while ((el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) && size > MIN_FONT) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);
  return ref;
}

interface TileProps {
  word: string;
  selected: boolean;
  jumpIndex: number | null;
  shaking: boolean;
  disabled: boolean;
  onToggle: (word: string) => void;
}

export function Tile({ word, selected, jumpIndex, shaking, disabled, onToggle }: TileProps) {
  const labelRef = useFitText(word);
  const classes = ['conn-tile'];
  if (selected) classes.push('selected');
  if (jumpIndex !== null) classes.push('jump');
  if (shaking && selected) classes.push('shake');
  return (
    <button
      type="button"
      className={classes.join(' ')}
      aria-pressed={selected}
      disabled={disabled}
      style={{ '--j': jumpIndex ?? 0 } as CSSProperties}
      onClick={() => onToggle(word)}
    >
      <span ref={labelRef} className="conn-tile-label">
        {word}
      </span>
    </button>
  );
}

export function GroupBar({ group, animate }: { group: ConnectionsGroup; animate: boolean }) {
  return (
    <div className={`group-bar${animate ? ' group-in' : ''}`} style={{ background: `var(--grp-${group.difficulty})` }} role="group" aria-label={`${group.name}: ${group.words.join(', ')}`}>
      <strong>{group.name}</strong>
      <span>{group.words.join(', ')}</span>
    </div>
  );
}
