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

## Krystal Silvers (separate pen name)
`krystal-silvers/` is its own space, independent of the American Specter site above.
- `krystal-silvers/index.html` – author landing page
- `krystal-silvers/good-girl.html` – *Mafia Daddy's Captivating Good Girl*, a self-contained interactive romance (5 acts, 6 endings, HER/HIM scenes, Listen). Set `CONFIG.BOOK_URL` at the top of its script to show a "Read the full novel" button.

Once published, the pages are at `/krystal-silvers/`.
