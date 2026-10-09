/**
 * ✏️  THE ONE FILE TO PERSONALISE.
 *
 * Anything containing the ✏️ marker is placeholder text. Placeholders are shown in
 * `npm run dev` so you can see where they appear, but are hidden in the real build.
 * Run `npm run check:personal` before you share the link to list anything left to fill in.
 */
import photo1 from '../assets/photos/photo-1.jpg';
import photo2 from '../assets/photos/photo-2.jpg';
import photo3 from '../assets/photos/photo-3.jpg';

export interface PersonalPhoto {
  id: string;
  src: string;
  /** Read aloud by screen readers. */
  alt: string;
  /** Handwritten caption under the polaroid. */
  caption: string;
  /** CSS object-position used when the photo is cropped, e.g. 'center 30%' to keep faces in frame. */
  focus?: string;
  /** Unlocks in The Kiln once this many puzzles (out of 100, both games combined) are finished. */
  unlockAt: number;
}

export const personal = {
  appTitle: 'Pot Luck',

  /** What you call her on win cards and the lock screen ("You got it in 3/6, Sweet Pea!"). */
  name: 'Sweet Pea',

  /** The home screen greeting: "Morning, my Sweet Pea ☕". */
  greetingName: 'my Sweet Pea',

  /** How you sign your notes. */
  fromName: '✏️ Your name',

  /**
   * Little notes that pop up the first time she finishes these levels.
   * Leave a note as '' to skip it.
   */
  milestones: {
    wordle: {
      10: '✏️ A note for finishing Wordle level 10',
      20: '✏️ A note for finishing Wordle level 20',
      30: '✏️ A note for finishing Wordle level 30',
      40: '✏️ A note for finishing Wordle level 40',
    },
    connections: {
      10: '✏️ A note for finishing Connections level 10',
      20: '✏️ A note for finishing Connections level 20',
      30: '✏️ A note for finishing Connections level 30',
      40: '✏️ A note for finishing Connections level 40',
    },
  } as Record<'wordle' | 'connections', Record<number, string>>,

  /** The secret letter, unlocked once BOTH level 50s are finished. Blank lines become paragraphs. */
  finale: {
    title: 'To my sweet pea 🌸',
    message: `✏️ Write your letter here.

It can be as long as you like — each blank line starts a new paragraph.`,
  },

  /**
   * The "studio door" lock screen shown the first time she opens the app on a device.
   * It's just for fun, not real security. Answers are compared ignoring case, spaces,
   * dashes, dots and slashes, so '14/02/23', '14.02.23' and '140223' all match '140223'.
   * The lock is skipped automatically until you replace the ✏️ answer.
   */
  passcode: {
    enabled: true,
    prompt: '✏️ When did we first meet? (DDMMYY)',
    answer: '✏️',
    /** 'numeric' shows a number keypad; 'text' shows a normal keyboard. */
    inputMode: 'numeric' as 'numeric' | 'text',
    /** Shown after two wrong tries. */
    hint: '✏️ A little hint',
  },

  /** Photos for The Kiln gallery and the occasional polaroid on win cards. Add as many as you like. */
  photos: [
    { id: 'photo-1', src: photo1, alt: 'A photo of us', caption: '✏️ caption', focus: 'center 30%', unlockAt: 5 },
    { id: 'photo-2', src: photo2, alt: 'A photo of us', caption: '✏️ caption', focus: 'center 30%', unlockAt: 35 },
    { id: 'photo-3', src: photo3, alt: 'A photo of us', caption: '✏️ caption', focus: 'center', unlockAt: 70 },
  ] as PersonalPhoto[],

  /** A polaroid appears on the win card for every Nth level (from photos she's already unlocked). */
  winPhotoEvery: 3,
};

export const PLACEHOLDER = '✏️';

export function isPlaceholder(text: string | undefined): boolean {
  return !text || text.includes(PLACEHOLDER);
}

/** Placeholder text is visible while developing and hidden in the production build. */
export function personalText(text: string | undefined): string | undefined {
  if (!text) return undefined;
  if (text.includes(PLACEHOLDER) && !import.meta.env.DEV) return undefined;
  return text;
}
