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
