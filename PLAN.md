# Implementation checklist

- [x] **Phase 1: Scaffold.** Vite/React/TS, deps, tokens + global CSS, HashRouter shell, PWA manifest + pot icons, CLAUDE.md, PLAN.md
- [x] **Phase 2: Progress layer.** SaveData, LocalStorageRepository (async seam), ProgressProvider, unlock rules, stats, reveals, personal.ts, tests
- [x] **Phase 3: Wordle.** Two-pass scoring, board/keyboard, flip/pop/shake/bounce, toasts, in-progress save, result card with note + share
- [x] **Phase 4: Connections.** evaluate/apply logic, grid with fit-text tiles, group bars, mistakes, one-away/already-guessed, reveal on loss, share
- [x] **Phase 5: Shell screens.** LockScreen, Home, TrackMap (pot shelf), Play + guards, HowToPlay, Stats, notes, Finale, Settings (+ dev tools)
- [x] **Phase 5b: Photos.** Copied 3 photos (no GPS/camera EXIF), Polaroid, Kiln gauge + reveal, win-card polaroid, `?placeholders` flag
- [x] **Phase 6: Content.** 50 Wordle answers + notes, 12.5k valid-guess list, 50 Connections puzzles (de-duplicated across halves), content tests
- [x] **Phase 7: Polish and QA.** Browser QA at 390×844, 375×667 and 1280×800, dark mode, lock screen, Kiln, letter; build passes; `check:personal`
- [x] **Extra: Sweet pea.** Greeting, jug illustration, blooming pot shelf, pea-pod mistakes, SWEET (Wordle 24), ___ PEA (Connections 1), SWEET PEA (Connections 30)
- [ ] **For the user:** fill in the ✏️ placeholders (`npm run check:personal`), then deploy `dist/`

---

# Plan: "Pot Luck": a personalised Wordle + Connections web app

## Context

A gift for the user's girlfriend: a 29-year-old from Northampton who loves Wordle, NYT Connections, pottery and arts & crafts, and whose favourite colour is `#3b733f`. The app plays like the NYT games but uses puzzles themed on English life, Northampton, pottery/crafts and 90s/00s British nostalgia. It must look great on mobile, needs no backend (progress goes in `localStorage`), and should have a clean seam for adding a backend later.

**Decisions confirmed with the user**
- **Two tracks:** 50 Wordle levels + 50 Connections levels (100 puzzles), each with its own level map.
- **Unlock in order:** finishing a level (win *or* lose) unlocks the next one, and finished levels can be replayed/reviewed.
- **Personal touches:** her name on the home screen; milestone notes at levels 10/20/30/40; a secret message once both level 50s are done; clearly marked "inside joke" slots in the puzzle data.
- **Her photos** (3 so far, from `~/Downloads`) appear in **"The Kiln"**, a gallery that unlocks photos as she progresses, and now and then on **win cards**.
- **Privacy:** a **cute passcode lock screen** on first visit. The user chose this knowing it is not real security.

The working directory `/Users/ronaldo/Documents/person` is empty (not a git repo). Node v20.19.5 and npm are available. This is a greenfield build.

## Stack

- **Vite + React 18 + TypeScript**. The build output is a static `dist/` folder that can be hosted anywhere (Netlify Drop, GitHub Pages, Vercel).
- **react-router-dom with `HashRouter`** and Vite `base: './'`, so deep links work on any static host without rewrites.
- **vite-plugin-pwa**, so she can "Add to Home Screen" and play offline. Installing it also protects `localStorage` from iOS Safari's 7-day eviction of storage for sites that haven't been visited.
- **@fontsource/fraunces** (warm serif for headings) and **@fontsource/dm-sans** (body text). The fonts are self-hosted so they work offline.
- **Vitest + @testing-library/react** for tests.
- Plain CSS with custom properties (no UI library). Animations are CSS keyframes.

## Project layout

```
person/
  CLAUDE.md                 # how to run, customise, deploy (required by global rules)
  PLAN.md                   # copy of this plan with phase checklists, ticked as we go
  index.html  vite.config.ts  package.json  tsconfig.json
  public/                   # pot icon (svg + png sizes) for PWA / favicon
  scripts/check-personal.ts # flags any unfilled placeholder text in config
  src/
    main.tsx  App.tsx       # routes
    config/personal.ts      # ← the ONE file he edits: name, title, notes, finale, photos, passcode
    assets/photos/          # photo-1.jpg … photo-3.jpg (copied from ~/Downloads, see Photos)
    data/
      wordle/answers.ts     # 50 × { level, answer, note, personalSlot? }
      wordle/valid-guesses.txt  # ~13k 5-letter words, lazy-loaded
      connections/puzzles.ts    # 50 × { level, groups: [{ name, words[4], difficulty 0–3 }] }
    progress/
      types.ts              # SaveData schema (versioned)
      repository.ts         # ProgressRepository interface (async) + LocalStorageRepository
      ProgressProvider.tsx  # React context: useProgress(), unlock rules, derived stats
    games/
      wordle/   logic.ts  WordleGame.tsx  Board.tsx  Tile.tsx  Keyboard.tsx  wordle.css
      connections/ logic.ts  ConnectionsGame.tsx  Grid.tsx  SolvedGroup.tsx  connections.css
    components/ Header  Modal  Toast  LevelMap  StatsModal  HowToPlay  NoteModal  ShareButton
                Polaroid  KilnRevealModal
    pages/      LockScreen  Home  TrackMap  Play  Kiln  Finale  Settings
    styles/     tokens.css  global.css
    utils/      share.ts  shuffle.ts
```

## Design direction: "pottery studio"

- **Palette (tokens.css):** primary `#3b733f` (her green) for buttons, headers and correct tiles. Background is an oatmeal/cream "speckled stoneware" (`#f6f1e7` with a subtle CSS speckle texture). Terracotta accent `#c2693e`, honey-glaze ochre for "present", warm slate for "absent". White text on `#3b733f` has a contrast ratio of about 5.7:1, which passes WCAG AA.
- **Wordle tiles:** correct = `#3b733f`, present = honey ochre, absent = warm grey. Tiles have slightly rounded "glazed ceramic" corners and a soft sheen. They keep the NYT flip, pop and shake animations.
- **Connections difficulty colours:** glaze-inspired versions of the four NYT hues (honey yellow, a green tint built from `#3b733f`, celadon blue, lavender), so the NYT colour language stays readable.
- **Level map:** a grid of 50 little pots. Locked pots are unglazed bisque with a lock. The current pot pulses. Finished pots are glazed green (won) or terracotta (lost) and show the result.
- **Mobile first:** layouts sized with `dvh`/`svh` and `env(safe-area-inset-*)`, touch targets of at least 44px, and `touch-action: manipulation` (no double-tap zoom). The Wordle board scales to the space between the header and keyboard. Connections tile text auto-shrinks for long words. Physical keyboard support on desktop. Dark mode ("kiln at night") follows `prefers-color-scheme`.
- Small inline SVG motifs (pot, wheel, brush) on the home and finale screens.

## Game behaviour (NYT parity)

**Wordle** (`games/wordle/logic.ts`)
- 6 guesses of 5 letters. "Not enough letters" and "Not in word list" toasts with a row shake. Tile flip reveals, a bounce on win, and the answer shown on loss.
- `scoreGuess(guess, answer)` uses the two-pass algorithm (exact matches first, then presents limited by the letter counts left over), so duplicate letters score correctly.
- `mergeKeyStates()` gives the keyboard colours with the precedence correct > present > absent.
- Valid guesses = a public 5-letter list, plus British spellings (mould, odour, etc.), plus every answer (merged automatically, so an answer can never be rejected). The list is lazy-loaded with a dynamic import.
- After the game, a card shows the answer's **note**, a short personal or fun fact (e.g. *BOOTS: Northampton's been making them since the 1600s, which is why the football team are the Cobblers*).

**Connections** (`games/connections/logic.ts`)
- 16 tiles in a 4×4 grid. She can select up to 4. Buttons: Shuffle, Deselect all, Submit (enabled only when 4 tiles are selected). Four mistake dots.
- `evaluateSelection(selection, puzzle, solved, history)` returns `correct | oneAway | wrong | alreadyGuessed`. "One away…" and "Already guessed!" toasts behave as on NYT; a repeat guess costs no mistake.
- A correct guess collapses the 4 tiles into a coloured group bar at the top. On a loss, the remaining groups are revealed in difficulty order.
- The tile order is persisted, so a shuffle survives a reload.

**Both games:** stats modal (played, win %, current/max streak, Wordle guess distribution, Connections "perfect" count), derived from the save data rather than stored separately. A share button builds an emoji grid (`Pot Luck Wordle #12 4/6` / 🟨🟩🟦🟪 rows) and uses `navigator.share` on mobile, falling back to the clipboard. "How to play" opens automatically on first visit to each game.

## Progress and storage (`src/progress/`)

```ts
interface SaveData {
  version: 1;
  wordle: Record<number, { guesses: string[]; status: 'playing'|'won'|'lost'; finishedAt?: string }>;
  connections: Record<number, { order: string[]; solved: number[]; history: string[][];
                                mistakes: number; status: 'playing'|'won'|'lost'; finishedAt?: string }>;
  seen: string[];                 // one-time reveals: "note:wordle:10", "kiln:photo-2", "finale"
  settings: { seenHowTo: { wordle: boolean; connections: boolean }; unlocked: boolean }; // unlocked = passcode entered
}
```
- A single key, `potluck:save:v1`. Every read and write is wrapped in try/catch. Bad or missing JSON falls back to a fresh save, and a `migrate()` hook handles future versions.
- **Backend seam:** `ProgressRepository` is an **async** interface (`load(): Promise<SaveData>`, `save(d): Promise<void>`) built by a `createRepository()` factory. A later `ApiRepository` can drop in without touching the UI.
- **Unlock rule:** level N of a track is playable if N === 1 or level N-1 of that track is `won`/`lost`. Route guards send locked levels back to the map.
- **In-progress games** are saved after every guess, so she can close the tab mid-puzzle and carry on later.
- Settings page: "Reset progress" (with a confirm step). An "Unlock all" toggle appears **only in dev builds** (`import.meta.env.DEV`) so the user can check content.

## Personalisation (`src/config/personal.ts`)

```ts
export const personal = {
  appTitle: 'Pot Luck',
  name: 'Love',                        // her name → "Morning, Love ☕" (time-of-day greeting)
  fromName: 'Me',
  milestones: { wordle: { 10: '…', 20: '…', 30: '…', 40: '…' },
                connections: { 10: '…', 20: '…', 30: '…', 40: '…' } }, // '' = skip
  finale: { title: '…', message: '…' },  // shown once BOTH level 50s are finished
  passcode: { enabled: true, prompt: 'When did we first meet? (DDMMYY)', answer: '…',
              inputMode: 'numeric', hint: '…' },
  photos: [  // add more photos here at any time
    { src: photo1, alt: '…', caption: '…', focus: 'center 30%', unlockAt: 5 },
    { src: photo2, alt: '…', caption: '…', focus: 'center',     unlockAt: 35 },
    { src: photo3, alt: '…', caption: '…', focus: 'center',     unlockAt: 70 },
  ],                                    // unlockAt = total puzzles finished across both tracks
  winPhotoEvery: 3,                     // show a polaroid on roughly every 3rd win
};
```
- A milestone note pops up (once) the first time she finishes that level in that track.
- The home screen shows a sealed "envelope" with progress (`37 / 100`). It opens to the Finale page with a confetti/glaze-drip reveal once both level 50s are done.
- **Inside joke slots:** about 8 Wordle answers and about 8 Connections groups are marked `personalSlot: true` with a `// ✏️ swap for your own` comment. They ship with working generic content, so the game is never broken. The user can replace them, and the content tests catch any mistakes.
- `npm run check:personal` lists any placeholder text still left in the config, to run before sharing the link.

## Photos, The Kiln and the passcode

- **Asset prep:** copy the 3 WhatsApp JPEGs to `src/assets/photos/photo-{1,2,3}.jpg` and downscale them to a 1200px long edge with `sips -Z 1200` (about 100KB each). Photos 1 and 2 are portrait 3:4 (1200×1600) and photo 3 is landscape 4:3 (1600×1200). Check that no GPS/EXIF data remains (`sips -g all`; WhatsApp normally strips it). Vite fingerprints the files and the PWA precaches them, so they work offline.
- **Privacy while building:** I won't open or screenshot the real photos. UI checks will use neutral placeholder images (a dev-only `?placeholders` flag), and the user does the final look with the real ones.
- **The Kiln (`/kiln`):** a third card on Home ("The Kiln: 1 of 3 pieces fired"). Each photo slot shows as an unfired clay silhouette with a kiln temperature gauge as its progress bar (e.g. *640°C / 1200°C*, mapped from puzzles finished against `unlockAt`). When she crosses a threshold, a `KilnRevealModal` plays a "glaze reveal": the photo goes from blurred clay-sepia to full colour with a shimmer sweep, inside a polaroid frame with the caption. Each reveal plays once (`seen: "kiln:photo-N"`), and unlocked photos open full-size from the gallery.
- **Win cards:** on a win, if `level % winPhotoEvery === 0`, a small tilted `Polaroid` appears on the result card. The photo is chosen deterministically from the **already-unlocked** photos, so the gallery isn't spoiled and replays look the same. Nothing shows if none are unlocked yet.
- **Polaroid component:** white border, a slight random tilt, a handwritten-style caption, and `object-fit: cover` with the per-photo `focus` so faces aren't cropped. The user can adjust `focus` in config.
- **Lock screen:** shown before anything else until `settings.unlocked` is true. It is a pottery "studio door" with a padlock: the prompt plus a numeric keypad or text input (`inputMode`). Input is compared after normalising (trimmed, case-insensitive, separators removed). A wrong answer shakes and shows a playful message, and the hint appears after 2 wrong tries. She only enters it once per device. **Not real security:** the photos are still in the static bundle, which is documented in `CLAUDE.md` (keep the repo private and share the link only with her).

## Content (100 puzzles)

Theme bank, mixed across levels. Difficulty ramps up: 1–10 gentle, 11–30 medium, 31–50 tricky.
- **Pottery & craft:** clay bodies (earthenware, stoneware, porcelain, terracotta), techniques (throw, coil, pinch, slab), kiln terms (bisque, raku, cone, glaze), Stoke potteries (Wedgwood, Denby, Spode, Emma Bridgewater, Moorcroft), famous potters (Clarice Cliff, Lucie Rie, Grayson Perry, Bernard Leach), knitting/crochet/embroidery, *The Great Pottery Throw Down*.
- **Northampton:** shoemaking (Church's, Grenson, Tricker's, brogue, welt, last), the Cobblers, the Saints, Franklin's Gardens, Delapre Abbey, the Nene, Abington Park, Royal & Derngate, Silverstone, Alan Moore.
- **Very English:** biscuits, crisps, Bake Off, Greggs, cuppa culture, slang (chuffed, knackered, skint), seaside towns, panto, pubs, Royals, corgis.
- **90s/00s nostalgia (she'd have grown up then):** Spice Girls, S Club 7, Busted/McFly, Girls Aloud, Tamagotchi, Furby, Tracy Beaker, Blue Peter, Jacqueline Wilson, Tammy Girl, Groovy Chick.
- **Purple-style wordplay:** `___ware` (stone, earthen, Tupper, soft), things you *throw* (pot, party, tantrum, shade), `___pot` (tea, jack, crack, hot), hidden words, homophones.
- Each Connections puzzle has deliberate red herrings, as NYT puzzles do. Wordle answers are 5-letter themed words (GLAZE, WHEEL, THROW, KILNS, MOULD, SCONE, CUPPA, QUEUE, TELLY, BOOTS, LACES, QUILT, EASEL…), each with a note.
- I'll draft the content in batches, possibly with parallel subagents, and then do a dedicated review pass for factual accuracy (especially the Northampton facts), unambiguous groups and fair difficulty.

## Phases (mirrored as checklists in `PLAN.md`)

1. **Scaffold:** Vite React TS, dependencies, `tokens.css`/`global.css`, HashRouter shell, Header, PWA manifest and pot icon, `CLAUDE.md`, `PLAN.md`.
2. **Progress layer:** SaveData types, LocalStorageRepository, ProgressProvider, unlock rules, stats selectors, `personal.ts`, plus unit tests.
3. **Wordle:** logic and tests, Board/Tile/Keyboard, animations, toasts, saving in-progress games, end card with note, share.
4. **Connections:** logic and tests, Grid/SolvedGroup, mistakes, one-away/already-guessed, reveal on loss, share.
5. **Shell screens:** LockScreen, Home (greeting, two game cards, Kiln card, envelope), TrackMap (50 pots), Play routing and guards, HowToPlay, Stats, NoteModal milestones, Finale, Settings.
5b. **Photos:** asset prep and EXIF check, Polaroid, Kiln page and gauge, KilnRevealModal, win-card polaroid, placeholder-image dev flag.
6. **Content:** 50 Wordle answers with notes, the valid-guess list, 50 Connections puzzles, and a content-validation test suite.
7. **Polish and QA:** dark mode, accessibility (aria-live toasts, focus traps in modals, reduced-motion), responsive QA, `check:personal`, deploy notes in `CLAUDE.md`.

## Verification

- **Unit tests (`npm test`):**
  - `scoreGuess` duplicate-letter cases (e.g. ABBEY/BABES, GLAZE/EERIE).
  - Keyboard colour precedence.
  - `evaluateSelection` for every outcome.
  - Unlock rules.
  - Repository behaviour with corrupt or missing JSON.
  - Kiln unlock thresholds and gauge mapping.
  - Win-photo selection only ever returns unlocked photos.
  - Passcode normalisation (e.g. `14/02/23` matches `140223`).
- **Content tests:**
  - Exactly levels 1–50 in both tracks.
  - Wordle answers are 5 letters A–Z, unique, and present in the valid list.
  - Each Connections puzzle has 4 groups × 4 words, 16 unique words (case-insensitive), and difficulties 0–3 each used once.
  - No empty strings.
- **Component tests:** play a Wordle to a win and a loss, and a Connections puzzle with a one-away, a repeated guess and a win. Assert that progress persists and the next level unlocks.
- **Manual/browser:** `npm run dev`, then drive it with the Playwright MCP tools at iPhone size (390×844) and desktop (1280×800).
  - Use the `?placeholders` flag so no real photos are viewed.
  - Screenshot the lock screen, home screen, map, both games, the Kiln (locked and revealed) and the finale.
  - Reload mid-game to confirm the state is restored.
  - Check there's no horizontal scroll and the keyboard isn't covered by the safe areas.
- **Build:** `npm run build && npm run preview` to confirm the static build works from a subpath and the PWA installs. Deployment options (Netlify Drop drag-and-drop, or GitHub Pages) go in `CLAUDE.md`.

## Known limitations (to note in CLAUDE.md)

- Progress lives on one device and browser until a backend exists. The `ProgressRepository` seam is where that backend goes.
- If she plays in mobile Safari without installing the app, iOS can clear storage after weeks of not visiting. Recommend "Add to Home Screen".
- The passcode is just for fun. The photos are inside the public static files, so anyone with the URL who goes looking can find them. If stronger privacy is needed later, put the site behind Cloudflare Access (free, email one-time code) or a backend with auth.
