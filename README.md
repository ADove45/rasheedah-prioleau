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
`experience.html` is a reading-page interactive adaptation of *The Seven Sisters*: second-person scenes that keep the novel's wording, choices written as lines from the book, a Case Board, a Listen button (device voices) and generated ambient sound.
- `js/story/engine.js` - page player, choices, Listen, Case Board, save/resume
- `js/story/audio.js` - generated ambience, stingers, text-to-speech and voice picking
- `js/story/act1.js` - Act I scenes (one file per act; Acts II-VI to follow)
- `css/story.css` - reading-page styling

In a scene, a paragraph starting `@ethan ` is read in that character's voice; everything else is read by the narrator.
The full manuscript is **not** in this repo.

## Pictures and video
Each scene has a pinned picture/video area. Add files to `media/act1/` (see the README there); until then a labeled placeholder is shown.
