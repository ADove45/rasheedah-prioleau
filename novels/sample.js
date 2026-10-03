// Story format: passages keyed by id. "text" is a list of paragraphs.
// "choices" is a list of { text, to }. A passage with no choices is an ending.
window.NOVELS = window.NOVELS || {};
window.NOVELS.sample = {
  title: "The Lantern on Route 9 (Sample)",
  start: "start",
  passages: {
    start: {
      text: [
        "Your headlights catch a swaying lantern at the roadside. No one is holding it.",
        "The gas gauge is nearly empty, and the nearest town is miles behind you."
      ],
      choices: [
        { text: "Stop and look at the lantern", to: "lantern" },
        { text: "Drive on", to: "drive" }
      ]
    },
    lantern: {
      text: [
        "The glass is warm. Beneath it, scratched into the iron, is a name and a year: 1863.",
        "Behind you, a voice says, softly, \"You came back.\""
      ],
      choices: [
        { text: "Turn around", to: "voice" },
        { text: "Run to the car", to: "drive" }
      ]
    },
    drive: {
      text: [
        "The engine coughs, then catches. In the mirror, the lantern light follows you for a mile.",
        "Then it goes out."
      ]
    },
    voice: {
      text: [
        "No one is there. But the road ahead is lit now, lantern after lantern, leading somewhere you have never been.",
        "You start walking."
      ]
    }
  }
};
