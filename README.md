# Reviewer Arcade

A React 18, TypeScript, Vite, Tailwind, and Lucide study app for **two people: Clyde Justin and Clark**.

## Run and verify

```sh
npm install
npm run dev
npm run check:data
npm run build
```

Use `npm.cmd` on Windows if PowerShell blocks `npm`. To host with XAMPP, copy the contents of `dist/` into your Apache web folder after building.

## Student grades and separate libraries

Clyde Justin is configured as Grade 9 and Clark as Grade 5, using the example grades supplied. Change `grade` in `src/data/index.ts` when needed. Each library filters strictly by student ownership and selected term. Subjects with the same title still use separate question files and unique IDs. Progress only counts reviewers owned by that student; previously shared attempts are retained in storage but excluded. Assign an unassigned reviewer by moving its JSON into the correct student/term folder and updating its `player` and `questionFile` in the catalog.

## Person / term / subject organization

All subjects live in JSON question banks, grouped by student and term:

```text
src/data/
  CLYreviewer/
    1stTERM/                    Clyde Justin's subject JSON files
    2ndTERM/                    Clyde Justin's next-term subjects
  CLARKreviewer/
    1stTERM/                    Clark's subject JSON files
    2ndTERM/                    Clark's next-term subjects
  unassigned/
    1stTERM/                    Chemistry and Orange Economy
  catalog.json                  Subject metadata and question-file paths
  index.ts                      Player definitions and recursive bank loader
```

Chemistry and Orange Economy remain unassigned until their student ownership is specified. They are hidden from both libraries until explicitly assigned. All 501 questions are retained. The school-term selector filters the library for the chosen person. The second term starts empty, with no invented questions.

## Add a second-term subject

1. Create `src/data/CLYreviewer/2ndTERM/clyde-math-term2.json` for Clyde Justin, or use `src/data/CLARKreviewer/2ndTERM/` for Clark.

```json
[
  {
    "id": "clyde-math-term2-1",
    "prompt": "What is 12 multiplied by 3?",
    "options": ["36", "15", "9", "24"],
    "answer": 0
  }
]
```

2. Add its metadata to `src/data/catalog.json`:

```json
{
  "id": "clyde-math-term2",
  "title": "Mathematics",
  "description": "Second-term mathematics practice",
  "player": "clyde",
  "category": "math",
  "term": "2nd term",
  "questionFile": "CLYreviewer/2ndTERM/clyde-math-term2.json"
}
```

`clyde` is the stable internal ID for **Clyde Justin**; `clark` is Clark. Keeping this ID preserves existing Clyde scores. Use `unassigned` for reviewers whose student ownership is unknown; these are hidden from both libraries. Categories are `science`, `math`, `language`, `humanities`, and `arts`. Each reviewer ID must be unique across people and terms, and match its question filename. Answers use zero-based option indexes. An optional `context` string adds a question hint or scenario.

3. Run `npm run check:data` and `npm run build`. No UI component edits are needed. Add all new subjects as JSON files; the React components render them.

## App architecture

- `src/types.ts`: shared types, including the two player IDs and school terms.
- `src/components/`: reusable reviewer cards and the shared quiz engine.
- `src/hooks/useProgress.ts`: validated browser-local score storage.
- `src/App.tsx`: player and term selection, navigation, library, and history.
- `src/styles.css`: responsive styling and Tailwind layers.
- `scripts/check-data.mjs`: validates metadata, folder ownership, terms, and questions.

Questions and options shuffle per attempt. Each correct answer earns 10 XP. Finished attempts save separately by player, with unique reviewer IDs distinguishing terms. Unfinished attempts are discarded on exit. Scores are stored in this browser and do not sync between devices. Legacy standalone pages and their importer have been removed; all 501 imported questions remain in JSON. Educational content was imported as supplied, not independently fact-checked.

## Profile entry flow

The home URL opens a standalone profile chooser. Selecting a profile navigates to `#/clyde` or `#/clark` and opens a term chooser, with no subjects displayed. Selecting a term opens `#/clyde/1stTERM`, `#/clark/1stTERM`, or the corresponding `2ndTERM` route. Only the selected student and term subjects are displayed. The dashboard displays only the current student, with a Switch profile link to `#/`. Returning to the chooser unmounts the current dashboard; selecting a profile starts at the term chooser. Browser Back/Forward follows profile navigation, and direct profile links open that student's term chooser. Explicit term links open that term's library. No profile is selected automatically at the home URL. These profiles organize local study content; they are not password-protected accounts.

Use **Change term** in the sidebar or page header to return to the current student's term chooser. Changing term resets search, filters, view, and any unfinished quiz. XP and progress on the dashboard are scoped to the selected student and term. Both term cards remain selectable, including terms with no subjects yet.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` validates questions, builds the React app, and deploys `dist/` on pushes to `main` or manual runs. In repository Settings > Pages, keep Source set to **GitHub Actions**. Commit and push the source, lockfile, and workflow to start deployment. Check the Actions tab for a successful deployment before visiting https://charlespura.github.io/CLYreviewer/.

CI builds with `npm run build -- --base /CLYreviewer/` so assets use the repository path. Regular local builds retain relative paths for XAMPP. Profile and term URLs use hash routing, so refreshing them works on static Pages hosting. The workflow publishes the compiled React application. Progress remains local to each visitor's browser. No custom secrets are required; deployment uses GitHub's workflow token.

## React source and Vite entry

All screens are React TypeScript components in `src/`. Question content is JSON under `src/data/`. Styling uses Tailwind and `src/styles.css`. Legacy HTML pages and the language-statistics overrides have been removed. The only source HTML file is the minimal root `index.html` required by this Vite browser app to mount `src/main.tsx`. It contains no reviewer UI or question content. Vite also emits a compiled `dist/index.html` for static hosting; `dist/` is ignored by Git.
