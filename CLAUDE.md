# Pot Luck

A personalised Wordle + Connections web app (a gift). Two tracks of 50 levels each, a pottery-studio look built around `#3b733f`, and no backend: progress is saved in `localStorage`.

## Commands

```bash
npm install
npm run dev              # http://localhost:5173 (dev tools appear in Settings)
npm test                 # unit + content + UI flow tests (Vitest)
npm run typecheck
npm run build            # static site in dist/
npm run preview          # serve dist/ locally
npm run check:personal   # list placeholder (✏️) text still to fill in
npm run words:build      # regenerate the Wordle valid-guess list
```

## Personalising (start here)

All of it lives in **`src/config/personal.ts`**:
- `greetingName` (home screen: "Morning, my Sweet Pea ☕"), `name` ("Sweet Pea", used on win cards and the lock screen), `fromName`, `appTitle`.
- `milestones`: notes shown the first time she finishes level 10/20/30/40 of each game. Set a note to `''` to skip it.
- `finale`: the letter unlocked when **both** level 50s are finished. A blank line starts a new paragraph.
- `passcode`: the "studio door" lock. It stays **off** until `answer` is something other than `✏️`. The comparison ignores case, spaces and `-./,'`, so `14/02/23` matches `140223`.
- `photos`: Kiln gallery photos. `unlockAt` is the number of finished puzzles across both games (out of 100). `focus` is the CSS `object-position` used for cropping.
- `winPhotoEvery`: show a polaroid on every Nth level's win card. It only uses photos already revealed in the Kiln.

Text containing `✏️` is a placeholder. It shows in `npm run dev` but is hidden in production builds (`personalText()`).

**Adding a photo:** drop the JPEG into `src/assets/photos/`, import it at the top of `personal.ts`, then add an entry to `photos` with a unique `id`.

**Inside-joke slots:** puzzle entries marked `personalSlot: true` (with a `// ✏️ swap for your own` comment) are safe to replace. Run `npm test` afterwards. The content tests check the 5-letter answers, 4×4 groups, duplicates, tile length and so on. Wordle answers in personal slots don't need to be dictionary words: every answer is always accepted as a guess.

**Sweet pea touches** (her nickname):
- `src/components/SweetPea.tsx`: the jug of sweet peas on Home, a bloom on every finished pot in the level map plus a sprout on the current one, and a pea pod for Connections mistakes (a pea pops out per mistake).
- A sprig on the letter.
- Wordle level 24 is SWEET (the Althorp "Spencer" sweet pea fact).
- Connections level 1 has a "___ PEA" group, and level 30 has SWEET PEA among the cottage garden flowers.

## Architecture

- **Vite + React 19 + TypeScript 7**, `HashRouter`, Vite `base: './'`. The build works from any static host or subfolder.
- **PWA** (`vite-plugin-pwa`): installable and offline. Installing it also protects iOS `localStorage` from Safari's 7-day eviction.
- **Routes:** `/`, `/:track` (level map), `/:track/:level` (play), `/kiln`, `/letter`, `/settings`. `track` is `wordle` or `connections`.
- `src/progress/`
  - `types.ts`: the `SaveData` schema (versioned).
  - `repository.ts`: the async `ProgressRepository` interface plus `LocalStorageRepository` (key `potluck:save:v1`). **The backend seam:** implement `ProgressRepository` against an API and return it from `createRepository()`.
  - `selectors.ts`: pure rules for unlocking (level N opens when N-1 is won or lost), stats, Kiln temperature and win-photo choice.
  - `reveals.ts`: one-time surprises (notes → photos → finale), tracked in `save.seen`.
  - `ProgressProvider.tsx`: context. Persists on every change.
- `src/games/wordle/`
  - `logic.ts`: two-pass `scoreGuess` (handles duplicate letters) and `keyStates`.
  - `words.ts`: lazy-loads `valid-guesses.txt` (12.5k words from the MIT `word-list` package, which includes British spellings) and merges in every answer.
- `src/games/connections/logic.ts`: `evaluateSelection` (correct / one away / wrong / already guessed) and `applyGuess`.
- `src/components/RevealGate.tsx`: games "hold" reveals while their end animation and result card are showing. `RevealHost` shows them afterwards.
- `src/data/`: `wordle/answers.ts`, `connections/puzzles-01-25.ts` and `puzzles-26-50.ts` (combined in `data/index.ts`). Types are in `data/types.ts`.
  - Every Connections puzzle is designed to have exactly one valid split, with red herrings that "lock" into one group (e.g. LOVE fits TENNIS TERMS but is needed for "___ OF MY LIFE"). When editing, keep that property.
  - `content.test.ts` checks structure and that no category name repeats; it can't check that a puzzle has a single solution.
- **Styling:** plain CSS. Tokens are in `src/styles/tokens.css`, with dark mode via `prefers-color-scheme` or `data-theme`. Fonts: Fraunces, DM Sans and Caveat (self-hosted via @fontsource).

## Dev-only helpers

- **Settings → Developer tools:**
  - Unlock every level.
  - Finish the next 5 levels.
  - Replay notes and reveals.
  - Preview the letter.
- **`?placeholders`** (e.g. `http://localhost:5173/?placeholders#/kiln`) swaps the real photos for neutral stand-ins.

## Deploying

The site is live at **https://naldo1026.github.io/pot-luck/** and is deployed from **`naldo1026/pot-luck`**, a public repo on the personal GitHub account.
- Every push to `main` runs `.github/workflows/deploy.yml`: `npm ci`, then `npm test`, then `npm run build`, then GitHub Pages. If a test fails, nothing is published.
- To update the site: `git commit -am "…" && git push`. Installed copies pick up the new version on their next open, and her progress is kept.
- **Use the personal account only, never the work (Pirical) one.**
  - The commit identity is set locally in this repo: `Ronaldo Goncalves <70907458+naldo1026@users.noreply.github.com>`.
  - The repo-local `credential.https://github.com.helper` pushes as `naldo1026`, using `gh auth token --user naldo1026`.
  - The globally active `gh` account stays as the work one. For `gh` commands against this repo, prefix them with `GH_TOKEN="$(gh auth token --user naldo1026)"`.
- Private-repo Pages needs GitHub Pro. That's why the repo is public.

## Privacy and known limitations

- The passcode is **just for fun**. The repo is public, so the photos, letter, notes and passcode answer can be read by anyone who browses `naldo1026/pot-luck`, and anything committed stays in the git history. For real protection, put the site behind Cloudflare Access (free, email one-time code) or add a backend with auth. `index.html` sets `noindex` and `robots.txt` disallows crawling.
- Progress lives in one browser on one device until a backend exists.
- If she plays in mobile Safari without "Add to Home Screen", iOS may clear site data after weeks of not visiting.
