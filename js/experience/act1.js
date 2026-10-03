// ACT I: THE CANDLE. Original narration with short quotes from the novel.
window.AS_CHARS = {
  audra:     { name: 'Audra Wheeler', g: 'f', rank: 0, pitch: 1.0, rate: 1.0, hair: 'puff' },
  ethan:     { name: 'Ethan Cole', g: 'm', rank: 0, pitch: 0.85, rate: 0.97, hair: 'cap' },
  gwyn:      { name: 'Gwyneth Miller', g: 'f', rank: 1, pitch: 0.7, rate: 0.78, hair: 'long', specter: true },
  benjamin:  { name: 'Benjamin Conner', g: 'm', rank: 1, pitch: 0.65, rate: 0.8, hair: 'short', glasses: true, specter: true },
  katherine: { name: 'Katherine Taylor', g: 'f', rank: 2, pitch: 1.05, rate: 0.98, hair: 'long' },
  charles:   { name: 'Charles Stuart', g: 'm', rank: 1, pitch: 0.8, rate: 0.95, hair: 'short' },
  ashley:    { name: 'Ashley', g: 'f', rank: 2, pitch: 0.8, rate: 0.85, hair: 'ponytail', specter: true },
  mackenzie: { name: 'Mackenzie Knox', g: 'f', rank: 1, pitch: 0.95, rate: 0.92, hair: 'bun' },
  mayor:     { name: 'Mayor Broner', g: 'm', rank: 2, pitch: 0.75, rate: 1.05, hair: 'bald', glasses: true },
  brendon:   { name: 'Brendon Shelley', g: 'm', rank: 3, pitch: 0.9, rate: 0.95, hair: 'gray' }
};

window.AS_CLUES = {
  candle:    { title: 'The Dry Spell Reliever', text: 'A purple candle from the Daylight Candle Shop, with a prayer card: "May love\'s embrace meet me at dawn\'s face."' },
  burns:     { title: 'The Burns', text: 'Singed skin and fingernail scratches at the throat. The same marks as the other victims, and as Kendra.' },
  scent:     { title: 'A Visitor', text: 'Candle wax and perfume. Unlike the others, Gwyneth may not have slept alone.' },
  ben:       { title: 'Never Missed a Day', text: 'Benjamin: Gwyn never missed work. Her supervisor sent the building super when she didn\'t show.' },
  katherine: { title: 'The Sheriff\'s Daughter', text: 'Katherine: Gwyn lived alone after leaving a cheater. Her late father, the sheriff, hated the specters.' },
  charles:   { title: 'In a Hurry', text: 'Charles: on her last day Gwyn rushed out, as if she had somewhere to be.' },
  history:   { title: 'Browser History', text: 'Gwyn spent her last hours at work viewing the Daylight Candle Shop, ending on the Dry Spell Reliever.' },
  victims:   { title: 'Five Victims', text: 'Amanda Price (Boston), Jenifer Martin (Newark), Linda Parker (Charlotte), Regina Fowler (Savannah), Gwyneth Miller (Specter). All dark-haired, dark-eyed, alone in bed. All look like Kendra.' },
  presence:  { title: 'A Presence, Not a Specter', text: 'Mackenzie: this is not a dead person\'s spirit but the energy of someone living, used as a weapon.' },
  throat:    { title: 'The Throat Chakra', text: 'The throat is about truth and speech. Someone may be silencing the victims to keep a secret.' },
  abigail:   { title: 'Abigail Stevens', text: 'Gwyn\'s birth mother was strangled in the hospital the day Gwyn was born. The case was never solved.' },
  cordero:   { title: 'A Familiar Signature', text: 'Deputy Jonathan Cordero signed Abigail\'s witness statements. He never told Audra.' },
  shelleys:  { title: 'The Shelleys', text: 'The richest family in town. They funded the new hospital, built on the site of the old one.' }
};

(function () {
  var N = function (t) { return { n: t }; }, S = function (w, t) { return { s: w, t: t }; }, Q = function (t) { return { q: t }; };
  var CLUE = function (c) { return { clue: c }; }, ST = function (s) { return { sting: s }; }, FX = function (f) { return { fx: f }; };
  var SH = function (v) { return { shield: v }; }, TR = function (o) { return { trust: o }; }, CAST = function (c) { return { cast: c }; };
  var IF = function (fn, b) { b.if = fn; return b; };
  var done = function (k) { return function (s) { return !s.flags[k]; }; };
  var mark = function (k, extra) { return function (s) { s.flags[k] = 1; if (extra) extra(s); }; };

  window.AS_SCENES = {
    s01: { where: 'Specter, Georgia — Saturday night', bg: 'bedroom_night', amb: ['crickets', 'wind'],
      card: { kicker: 'American Specter', title: 'The Seven Sisters', sub: 'Act I — The Candle' },
      beats: [
        N('Specter, Georgia. A quiet town where the living and the dead share the same streets.'),
        N('Gwyneth Miller is a librarian, the late sheriff\'s daughter, and very lonely.'),
        N('Today she bought a candle from the shop on the square. Her father would not have approved.'),
        Q('May love\'s embrace meet me at dawn\'s face.'), ST('candle'),
        N('She lights it. She says the prayer. She blows it out.'),
        N('Something answers in the dark. It is gentle, and it is patient. The rest of the night belongs to her.'),
        N('Then dawn comes, and the air in the room turns cold and thin.'), FX('frost'), ST('cold'),
        N('By Monday, everyone in town knows that Gwyneth Miller is gone.')
      ], next: 's02' },

    s02: { where: 'Gwyneth Miller\'s apartment — Monday, 12:30 PM', bg: 'apt_day', amb: ['hum', 'cicada'], fx: ['dust'], cast: [],
      card: { kicker: 'Monday', title: 'Special Agent Audra Wheeler' },
      beats: [
        N('The air conditioner is off. Country cops tramp through a bedroom that is now a federal crime scene.'),
        N('FBI Special Agent Audra Wheeler has spent four years chasing criminal specters. Gwyneth is the fifth victim of a killer who has followed her from Boston to Newark, Charlotte, Savannah, and now Specter, Georgia.'),
        SH(true), N('She switches on her specter shield. No spirit can come within five feet of her.'),
        N('Specters leave no fingerprints, no DNA, no note. No obvious motive.'),
        S('audra', 'Nobody touches anything until I\'ve looked.')
      ], next: 's02h' },

    s02h: { where: 'Gwyneth Miller\'s apartment', bg: 'apt_day', amb: ['hum', 'cicada'], fx: ['dust'], beats: [],
      choice: { prompt: 'What do you examine?', options: [
        { t: 'The purple candle by the bed', to: 's02a', cond: done('c1'), do: mark('c1') },
        { t: 'The body', to: 's02b', cond: done('c2'), do: mark('c2') },
        { t: 'The room itself', to: 's02c', cond: done('c3'), do: mark('c3') },
        { t: 'That\'s enough. Move on.', to: 's03' }
      ] } },
    s02a: { where: 'Gwyneth Miller\'s apartment', bg: 'apt_day', amb: ['hum', 'cicada'], fx: ['dust'], beats: [
      N('A fat purple candle sits beside a small instruction card and a box of special matches.'),
      Q('May love\'s embrace meet me at dawn\'s face.'),
      S('audra', 'The Daylight Candle Shop. Somebody sold her this.'), CLUE('candle')], next: 's02h' },
    s02b: { where: 'Gwyneth Miller\'s apartment', bg: 'apt_day', amb: ['hum', 'cicada'], fx: ['dust'], beats: [
      N('Gwyneth lies on her side, hands near her throat. The skin is singed and scratched raw by her own fingernails.'),
      N('Audra has seen these burns four times before. She has seen them once more, thirteen years ago, on someone she loves.'), ST('cold'),
      N('Dark hair. Dark eyes. Alone in bed. She looks a lot like Audra\'s sister.'),
      S('audra', 'Shit.'), CLUE('burns')], next: 's02h' },
    s02c: { where: 'Gwyneth Miller\'s apartment', bg: 'apt_day', amb: ['hum', 'cicada'], fx: ['dust'], beats: [
      N('Candle wax and perfume hang in the stale air, as if the victim had company the night before.'),
      N('The other four victims slept alone. This one doesn\'t quite fit the pattern.'), CLUE('scent')], next: 's02h' },

    s03: { where: 'Outside the apartment — Monday', bg: 'street_dusk', amb: ['cicada'], cast: [['right', 'ethan']], beats: [
      N('Outside, a man in a ball cap strolls up with a New York swagger he never lost.'),
      N('Ethan Cole. Her former partner. The man she hasn\'t spoken to in two years.'),
      S('ethan', 'Audra. Wait up.'),
      S('audra', 'I\'m going to the library to question her coworkers.'),
      S('ethan', 'I already did that.'),
      S('ethan', 'Go easy on this town, okay? Gwyneth was the old sheriff\'s daughter, and people loved her. They\'ve learned to live with the specters. Don\'t drag your FBI bias in here.')],
      choice: { prompt: 'How do you answer?', options: [
        { t: '"I don\'t have time for this, Ethan."', to: 's03a', do: function (s) { s.trust.ethan -= 1; } },
        { t: '"I\'ll be careful. And thank you for calling it in."', to: 's03a', do: function (s) { s.trust.ethan += 1; } },
        { t: '"Warn the Daylight Candle Shop. They\'re next on my list."', to: 's03a', do: function (s) { s.trust.specters -= 1; } }
      ] } },
    s03a: { where: 'Outside the apartment — Monday', bg: 'street_dusk', amb: ['cicada'], cast: [['right', 'ethan']], beats: [
      N('She doesn\'t slow down. A hand on her shoulder; she pulls away, shutting out everything that touch used to mean.')], next: 's04' },

    s04: { where: 'Specter Public Library', bg: 'library', amb: ['hum', 'murmur'], cast: [], beats: [
      N('The library is full of students at computers. Nobody seems to mind that half the staff are dead.')],
      choice: { prompt: 'Who do you talk to?', options: [
        { t: 'The reference desk', to: 's04a', cond: done('l1'), do: mark('l1') },
        { t: 'The woman crying in the stacks', to: 's04b', cond: done('l2'), do: mark('l2') },
        { t: 'The manager\'s office', to: 's04c', cond: done('l3'), do: mark('l3') },
        { t: 'Check Gwyneth\'s computer', to: 's04d' }
      ] } },
    s04h: { where: 'Specter Public Library', bg: 'library', amb: ['hum', 'murmur'], beats: [],
      choice: { prompt: 'Who do you talk to?', options: [
        { t: 'The reference desk', to: 's04a', cond: done('l1'), do: mark('l1') },
        { t: 'The woman crying in the stacks', to: 's04b', cond: done('l2'), do: mark('l2') },
        { t: 'The manager\'s office', to: 's04c', cond: done('l3'), do: mark('l3') },
        { t: 'Check Gwyneth\'s computer', to: 's04d' }
      ] } },
    s04a: { where: 'Specter Public Library', bg: 'library', amb: ['hum', 'murmur'], cast: [['right', 'benjamin']], beats: [
      IF(function (s) { return s.shield; }, N('The moment Audra nears the desk, her shield shoves a college-age specter clean out of his chair.')),
      IF(function (s) { return s.shield; }, S('benjamin', 'Whoa! What is that thing?')),
      IF(function (s) { return s.shield; }, N('In a town like this, the shield is worse than useless. She switches it off.')), IF(function (s) { return s.shield; }, SH(false)),
      TR({ specters: 1 }),
      S('benjamin', 'You here about Gwyn? She never missed a day. Mr. Stuart had her building super check on her.'),
      S('audra', 'Who called the super?'),
      S('benjamin', 'Management. That door, over there.'), CLUE('ben')], next: 's04h' },
    s04b: { where: 'Specter Public Library', bg: 'library', amb: ['hum', 'murmur'], cast: [['right', 'katherine']], beats: [
      N('Katherine Taylor worked beside Gwyneth for six years. She dries her eyes as Audra approaches.'),
      S('katherine', 'She was such a nice girl. She\'d never hurt a fly.'),
      S('audra', 'Was she seeing anyone? Spending time with specters?'),
      S('katherine', 'Not for a year. She threw out a cheater and stayed alone. Her father was the old sheriff, and he made no secret of how he felt about specters. She stayed loyal to his side.'), CLUE('katherine')], next: 's04h' },
    s04c: { where: 'Specter Public Library', bg: 'library', amb: ['hum', 'murmur'], cast: [['right', 'charles']], beats: [
      N('Voices hush behind the manager\'s door when she knocks. A disheveled man peeks out, bloodshot, with liquor on his breath.'),
      N('A girl with purple-streaked hair storms past him. Her shoulder flickers through Audra\'s. A specter.'),
      S('charles', 'My daughter, Amanda. I\'m Charles Stuart. Come in.'),
      S('charles', 'Gwyn was quiet, but everyone liked her. The last day she worked, she was in an awful hurry to leave. Like she had somewhere important to be.'),
      N('When Audra steps out again, the memory of her sister\'s bedroom door rushes back. She grips a bookshelf until it passes.'), ST('cold'), CLUE('charles')], next: 's04h' },
    s04d: { where: 'Specter Public Library', bg: 'library', amb: ['hum', 'murmur'], cast: [], beats: [
      N('Gwyneth\'s computer password is just "library."'),
      N('In the last four hours of her last workday, she kept returning to one website: the Daylight Candle Shop. The final page: a thick purple candle called the Dry Spell Reliever.'), CLUE('history'),
      N('Audra copies down the address, but first, her stomach is growling. She hasn\'t eaten since Savannah.')], next: 's05' },

    s05: { where: 'Bishop\'s Diner', bg: 'diner', amb: ['murmur', 'hum'], cast: [['left', 'ashley']], beats: [
      N('Barbecue smoke leads her to a hole-in-the-wall. Every local turns to stare at her Prada suit and red-soled heels.'),
      S('ashley', 'You here about Gwyn? Everyone knows everyone. Awful shame. Helped me find a book every time.'),
      N('Ashley is a perky ex-cheerleader specter with a Southern twang. She phases out to fetch water, which spoils Audra\'s appetite.'),
      N('Over a salad she doesn\'t want, Audra thinks of her boss, Assistant Director Jonathan Cordero. He was first on the scene when her sister was attacked. He recruited her into the FBI just before graduation. She never asked why.'),
      N('Thirteen years ago, her sister Kendra was nine months pregnant. A crash from her bedroom. Audra ran in and found her hanging in the air, clawing at her burned throat. When the light came on, she fell.'), FX('frost'), ST('cold'),
      N('Then the memory fades. The diner door opens. Ethan walks in.'), FX('frostoff'),
      CAST([['left', 'ashley'], ['right', 'ethan']]),
      S('ashley', 'Hey, Sheriff! Can I get you anything?'),
      S('audra', 'Sheriff?'),
      S('ethan', 'Long story.')],
      choice: { prompt: 'How do you play it?', options: [
        { t: '"Why are you here? You know I don\'t believe in coincidences."', to: 's05a', do: function (s) { s.trust.ethan += 0; } },
        { t: '"You look okay."', to: 's05a', do: function (s) { s.trust.ethan += 1; } },
        { t: 'Say nothing and eat your ribs.', to: 's05a', do: function (s) { s.trust.ethan -= 1; } }
      ] } },
    s05a: { where: 'Bishop\'s Diner', bg: 'diner', amb: ['murmur', 'hum'], cast: [['right', 'ethan']], beats: [
      S('ethan', 'We\'ll talk after lunch. Not here. Too many listening ears.'),
      N('He means the specters. They are everywhere, and they hear everything.')], next: 's06' },

    s06: { where: 'Sheriff\'s station (a converted trailer)', bg: 'trailer', amb: ['hum'], cast: [['right', 'ethan']], beats: [
      N('The sheriff\'s station is a four-room mobile home. No deputy, no secretary, and an ancient filing cabinet.'),
      N('In the back meeting room, Audra lines up four case files: Amanda Price of Boston. Jenifer Martin of Newark. Linda Parker of Charlotte. Regina Fowler of Savannah.'), CLUE('victims'),
      S('ethan', 'They all look alike.'),
      S('audra', 'A serial killer with a type. A type that looks a lot like my sister.')],
      choice: { prompt: 'How much do you tell him?', options: [
        { t: 'Everything. Thirteen years of it.', to: 's06a', do: function (s) { s.trust.ethan += 1; } },
        { t: 'Just the facts. Keep it professional.', to: 's06b' }
      ] } },
    s06a: { where: 'Sheriff\'s station', bg: 'trailer', amb: ['hum'], cast: [['right', 'ethan']], beats: [
      S('audra', 'She\'s still in a coma. Nothing has changed in thirteen years. They called it an unexplained phenomenon.'),
      S('ethan', 'Is there any connection between your sister and this town?'),
      S('audra', 'The only thing here that means anything to me is you. And I still don\'t believe in coincidences.'),
      S('ethan', 'Me neither.')], next: 's07' },
    s06b: { where: 'Sheriff\'s station', bg: 'trailer', amb: ['hum'], cast: [['right', 'ethan']], beats: [
      S('audra', 'My sister was attacked the same way, years ago. I think the cases are connected.'),
      S('ethan', 'Okay.'),
      N('He lets her keep her distance. She notices that he noticed.')], next: 's07' },

    s07: { where: 'The Bed & Breakfast', bg: 'bnb', amb: ['hum'], cast: [], beats: [
      N('Ethan follows her to the B&B. He doesn\'t ask. She doesn\'t make him.'),
      N('The door closes. The rest belongs to them.'), FX('black'),
      N('By quarter past five he is asleep and she is showered, dressed, and gone. She leaves a note with one address on it.'), FX('blackoff'),
      N('She tells herself it doesn\'t have to mean anything. It always has.')], next: 's08' },

    s08: { where: 'The Daylight Candle Shop', bg: 'candleshop', amb: ['candle', 'hum'], fx: ['dust'], cast: [['right', 'mackenzie']], beats: [
      N('Soft music, lavender, and shelves of candles that glow like a hundred small heartbeats.'),
      S('mackenzie', 'Welcome. Were you looking for something in particular?'),
      S('audra', 'Special Agent Wheeler, FBI. I\'m investigating the death of Gwyneth Miller.'),
      S('mackenzie', 'Specters do not kill, Agent Wheeler. They can be mischievous, even frightening, but they do not kill.'),
      S('mackenzie', 'This case is personal to you. May I have your hands?')],
      choice: { prompt: 'Do you let her?', options: [
        { t: 'Give her your hands.', to: 's08a' },
        { t: '"Just answer my questions."', to: 's08b', do: function (s) { s.trust.specters -= 1; } }
      ] } },
    s08a: { where: 'The Daylight Candle Shop', bg: 'candleshop', amb: ['candle', 'hum'], fx: ['dust'], cast: [['right', 'mackenzie']], beats: [
      N('Mackenzie turns Audra\'s palms upward. Her face passes through several emotions.'),
      S('mackenzie', 'Something about a sister. It is not a specter. It is a presence: the energy of someone living, used as a weapon.'), CLUE('presence'),
      N('She opens a booklet of chakras. Everything can be corrupted, she says. A mind that opens the crown chakra can reach for control and telekinesis. The throat chakra governs truth and speech.'),
      S('mackenzie', 'I would guess the killer is trying to silence them. To keep something secret.'), CLUE('throat'),
      S('mackenzie', 'If you can figure out why, then you will know who.')], next: 's08c' },
    s08b: { where: 'The Daylight Candle Shop', bg: 'candleshop', amb: ['candle', 'hum'], fx: ['dust'], cast: [['right', 'mackenzie']], beats: [
      S('mackenzie', 'Then I will say it plainly. It is not a specter. It is a presence, the energy of someone living, used as a weapon.'), CLUE('presence'),
      N('Her tone is polite. Her warmth is gone.')], next: 's08c' },
    s08c: { where: 'The Daylight Candle Shop', bg: 'candleshop', amb: ['candle', 'hum'], cast: [['right', 'mackenzie']], beats: [
      S('audra', 'The candle Gwyneth bought. What does it do?'),
      S('mackenzie', 'It calls a romantic specter. He makes love to the one who lights it. He is my grandfather, and he has nothing for you. But I know someone who does.'),
      N('She glances at an empty chair. The air begins to take shape.')], next: 's09' },

    s09: { where: 'The Daylight Candle Shop', bg: 'candleshop', amb: ['candle', 'hum'], cast: [['center', 'gwyn']], beats: [
      ST('phase'),
      IF(function (s) { return s.shield; }, N('Audra\'s shield flares. The specter can come no closer. To hear her, Audra has to lower it.')), IF(function (s) { return s.shield; }, SH(false)),
      N('It is Gwyneth Miller. She has been here since yesterday.'),
      S('gwyn', 'Agent Wheeler. You want to solve my murder?'),
      S('audra', 'Do you want me to?'),
      S('gwyn', 'It won\'t do me any good now. But you could save another girl. I wasn\'t going to talk to you, until I heard your sister was adopted.'),
      S('gwyn', 'The sheriff adopted me, too. I found out after college that my birth mother was murdered. The day I was born. In the hospital. Nobody ever solved it.'),
      S('audra', 'What was her name?'),
      S('gwyn', 'Abigail Stevens.'), CLUE('abigail'),
      S('gwyn', 'I felt fingers, but not fleshy ones. Skeletal. They burned. The air was cooler, and drier, and hard to breathe.'),
      N('It is the same air Audra remembers from her sister\'s bedroom.'), ST('cold')], next: 's10' },

    s10: { where: 'Sheriff\'s station — that evening', bg: 'trailer', amb: ['hum'], cast: [['right', 'ethan']], beats: [
      N('Back at the station, Audra repeats everything Gwyn said. Ethan listens, then unlocks the bottom drawer of the old filing cabinet.'),
      N('Abigail\'s file is three tarnished pages. A strangled young woman. Under occupation, one word: prostitute. Audra can see exactly why no one tried very hard.'),
      N('Then a name on the witness statements stops her cold.'),
      S('audra', 'Deputy Jonathan Cordero. How did I miss that?'), CLUE('cordero'),
      S('ethan', 'He\'s from here. He was a deputy in the seventies and eighties. He\'s the one who suggested I come to Specter.'),
      S('audra', 'Why didn\'t you call me?'),
      S('ethan', 'You blew me off when I tried. I never knew why.'),
      N('Audra closes her eyes. Two years of silence ends in a whisper.'),
      S('audra', 'I had a miscarriage, Ethan.')],
      choice: { prompt: 'What happens next?', options: [
        { t: 'Let him hold you.', to: 's10a', do: function (s) { s.trust.ethan += 2; } },
        { t: 'Step back. Focus on the case.', to: 's10b', do: function (s) { s.trust.ethan -= 1; } }
      ] } },
    s10a: { where: 'Sheriff\'s station', bg: 'trailer', amb: ['hum'], cast: [['right', 'ethan']], beats: [
      S('ethan', 'You should have yelled at me. You should have screamed. I should have known.'),
      S('ethan', 'Losing you was the worst thing that ever happened to me.'),
      N('For a long moment, neither of them says anything else.')], next: 's11' },
    s10b: { where: 'Sheriff\'s station', bg: 'trailer', amb: ['hum'], cast: [['right', 'ethan']], beats: [
      S('ethan', 'Okay. I\'m sorry, Audra. I\'m sorry I wasn\'t there.'),
      N('She nods and turns back to the file. It is easier to look at the dead.')], next: 's11' },

    s11: { where: 'Sheriff\'s station — evening', bg: 'trailer', amb: ['hum'], cast: [['left', 'mayor'], ['right', 'brendon']], beats: [
      ST('knock'),
      N('A loud knock, and a short, stout man in thick glasses waddles in without waiting.'),
      S('mayor', 'It\'s them specters, ain\'t it? I won\'t have this in my town! Cole, you were elected to pick up where Miller left off, and now his own daughter\'s dead!'),
      S('brendon', 'Calm down, Jimmy. Specters have been nothing but kind and generous to this town for ten years, and you know it.'),
      S('mayor', 'I\'m calling a town hall meeting Thursday. I expect this mess straightened out by then.'),
      N('The mayor stomps out. The charming man with salt-and-pepper hair stays long enough to shake Audra\'s hand. Brendon Shelley, councilman.'),
      N('His eyes drift to the file in her hand, and for a moment he goes stiff.'),
      S('brendon', 'This ugly business is merely an isolated incident. Right?'),
      S('audra', 'We shall see.'),
      N('Later, in her room at the B&B, a phone call from Ethan. One question has been nagging her: who are the Shelleys?'),
      S('ethan', 'The richest family in town. They paid for the new hospital.'),
      S('audra', 'The new hospital. So what happened to the old one, where Abigail died?'), CLUE('shelleys'),
      N('Audra stares at the ceiling, wide awake. Something in this town is very old, and very well hidden.')], next: 'act1_end' },

    act1_end: { end: true, where: 'End of Act I', bg: 'bedroom_night', amb: ['wind'] }
  };
})();
