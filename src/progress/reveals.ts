import { personal, personalText, type PersonalPhoto } from '../config/personal';
import { isFinaleUnlocked, isFinished, unlockedPhotos } from './selectors';
import { TRACKS, type SaveData, type Track } from './types';

export type Reveal =
  | { kind: 'note'; key: string; track: Track; level: number; message: string }
  | { kind: 'photo'; key: string; photo: PersonalPhoto }
  | { kind: 'finale'; key: string };

/** One-time surprises she's earned but not seen yet, in the order they should appear. */
export function pendingReveals(save: SaveData, config = personal): Reveal[] {
  const seen = new Set(save.seen);
  const out: Reveal[] = [];

  for (const track of TRACKS) {
    const notes = config.milestones[track] ?? {};
    for (const [levelText, raw] of Object.entries(notes)) {
      const level = Number(levelText);
      const message = personalText(raw);
      const key = `note:${track}:${level}`;
      if (message && isFinished(save[track][level]?.status) && !seen.has(key)) {
        out.push({ kind: 'note', key, track, level, message });
      }
    }
  }

  for (const photo of unlockedPhotos(save, config.photos)) {
    const key = `kiln:${photo.id}`;
    if (!seen.has(key)) out.push({ kind: 'photo', key, photo });
  }

  if (isFinaleUnlocked(save) && !seen.has('finale')) out.push({ kind: 'finale', key: 'finale' });

  return out;
}
