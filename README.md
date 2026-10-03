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
`experience.html` is a cinematic, choice-driven adaptation of *The Seven Sisters*.
- `js/experience/engine.js` – scene player, choices, Case Board, save/resume
- `js/experience/audio.js` – generated ambience, stingers, text-to-speech
- `js/experience/visuals.js` – procedural backdrops, particles, silhouettes
- `js/experience/act1.js` – Act I scenes (one file per act; Acts II-VI to follow)

The full manuscript is **not** in this repo. Scenes use original narration plus short quoted excerpts.
