# Rasheedah Prioleau — American Specter Series

Interactive novel site, hosted on GitHub Pages. No build step.

- `index.html` – landing page (reads `novels/library.js`)
- `reader.html` – choose-your-path reader (`reader.html?novel=<slug>`)
- `novels/library.js` – pen name, bio, and the list of novels
- `novels/<slug>.js` – one file per novel (passages and choices)

## Add a novel
1. Copy `novels/sample.js` to `novels/<slug>.js` and rename `window.NOVELS.sample` to `window.NOVELS.<slug>`.
2. Add an entry to `novels/library.js`.

## Publish
Repo Settings → Pages → Deploy from branch → select the branch and `/ (root)`.

## Interactive experience (Book One)
`experience.html` is a reading-page interactive adaptation of *The Seven Sisters*: second-person scenes that keep the novel's wording, choices written as lines from the book, a Case Board, a Listen button (device voices) and generated mysterious music.
- `js/story/engine.js` - page player, choices, Listen, Case Board, save/resume
- `js/story/audio.js` - generated ambience, stingers, text-to-speech and voice picking
- `js/story/act1.js` - Act I scenes (one file per act; Acts II-VI to follow)
- `css/story.css` - reading-page styling

In a scene, a paragraph starting `@ethan ` is read in that character's voice; everything else is read by the narrator.
The full manuscript is **not** in this repo.

## Pictures and video
Each scene has a pinned picture/video area. Add files to `media/act1/` (see the README there); until then a labeled placeholder is shown.

## Specterville (the game)
`specterville.html` is an explorable-town investigation game across the whole American Specter universe. You play Audra Wheeler. It currently holds Case One, "The Candle" (Book One, one Monday in Specter, Georgia). Books Two and Three are sealed doors on the title screen.
- `js/specterville/data.js` - **all the content**: places, people, scenes, choices, clues, theories. Edit this to grow the game.
- `js/specterville/game.js` - the engine (title hub, map, clock, scenes, Case Board, save/resume). Rarely needs to change.
- `css/specterville.css` - styling.

How it plays: each trip across town costs an hour (8 in a day). At each place you examine things and talk to people for clues. The specter shield blocks specters from speaking, so you must switch it off at the right moments. On the Case Board, tap two clues that belong together to form a theory.

Add a place: add an entry to `SV.PLACES` with `x`/`y` map position and a list of `actions`. Add a clue to `SV.CLUES` and a theory (a pair of clues) to `SV.THEORIES`. Case One was checked against the manuscript of *The Seven Sisters* (chapters 1-5). It is being extended chapter by chapter.
