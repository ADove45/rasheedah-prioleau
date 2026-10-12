/* SPECTERVILLE: CONTENT FILE. This is the file you edit to grow the game; the engine (game.js) never needs to change for new places, people or clues.

   Case One, "The Candle" (Book One, Monday in Specter, Georgia). Dialogue is condensed from Act I (js/story/act1.js) so it keeps the novel's wording.
   Anything marked INVENTED is a placeholder I wrote to fill a gap. Please correct it against the manuscript.

   Paragraph starting "@key " is spoken by that character (shown as a name tag). *Asterisks* make italics. */
window.SV = {};

/* ---------- Time ---------- */
SV.SLOTS = ['12:30 pm', '1:30 pm', '2:30 pm', '3:30 pm', '4:30 pm', '5:30 pm', '6:30 pm', '7:30 pm']; // each trip across town uses one hour

/* ---------- People (name tags) ---------- */
SV.WHO = {
  audra: 'Audra', ethan: 'Ethan', benjamin: 'Benjamin', katherine: 'Katherine', charles: 'Charles', ashley: 'Ashley',
  mackenzie: 'Mackenzie', gwyn: 'Gwyneth', mayor: 'Mayor Broner', brendon: 'Brendon'
};

/* ---------- Clues (same 13 as the Case Board in Book One) ---------- */
SV.CLUES = {
  candle: ['The Dry Spell Reliever', 'A purple candle from the Daylight Candle Shop and a prayer card: May love’s embrace meet me at dawn’s face.'],
  burns: ['The Burns', 'Singed skin and fingernail scratches at the throat, as on the other victims and on Kendra.'],
  scent: ['A Visitor', 'Candle wax and perfume. Gwyneth may not have slept alone.'],
  ben: ['Never Missed a Day', 'Benjamin: Gwyn never missed work. Mr. Stuart sent her building super to check on her.'],
  katherine: ['The Sheriff’s Daughter', 'Katherine: Gwyn lived alone after leaving a cheater. Her late father, the sheriff, hated the specters.'],
  charles: ['In a Hurry', 'Charles: on her last day Gwyn rushed out as if she had somewhere important to go.'],
  history: ['Browser History', 'Gwyn visited the Daylight Candle Shop, ending on the Dry Spell Reliever.'],
  victims: ['Five Victims', 'Amanda Price, Jenifer Martin, Linda Parker, Regina Fowler, Gwyneth Miller. All look like Kendra.'],
  presence: ['A Presence', 'Mackenzie: not a specter, but the energy of someone living, used as a weapon.'],
  throat: ['The Throat Chakra', 'The throat governs truth and speech. Someone may be silencing the victims to keep a secret.'],
  abigail: ['Abigail Stevens', 'Gwyn’s birth mother was strangled in the hospital the day Gwyn was born. Never solved.'],
  cordero: ['A Familiar Signature', 'Deputy Jonathan Cordero signed Abigail’s witness statements. He never told you.'],
  shelleys: ['The Shelleys', 'The richest family in town. They paid for the new hospital, built where the old one stood.']
};

/* ---------- Theories: connect two clues on the Case Board. "pairs" lists every combination that works. ---------- */
SV.THEORIES = [
  { id: 'living', title: 'A living killer', pairs: [['burns', 'presence']],
    text: 'The burns look like a specter’s work, but Mackenzie says the energy behind them belongs to someone living. You may not be hunting a specter at all.' },
  { id: 'door', title: 'The candle is the door', pairs: [['candle', 'history'], ['charles', 'history']],
    text: 'Gwyn went looking for the Dry Spell Reliever on her last day, and she lit it that night. Whatever came for her, the Daylight Candle Shop is where it started.' },
  { id: 'chosen', title: 'Chosen women', pairs: [['victims', 'katherine']],
    text: 'Five women who look like your sister, and Gwyn lived alone. Nobody gets this lucky by accident. Someone chose them.' },
  { id: 'old', title: 'An old murder', pairs: [['throat', 'abigail']],
    text: 'The throat governs truth and speech, and Abigail Stevens was strangled the day her daughter was born. Someone has been silencing women in Specter for a long time.' },
  { id: 'cordero', title: 'What Cordero left out', pairs: [['cordero', 'abigail']],
    text: 'Jonathan Cordero signed Abigail’s statements and never mentioned it to you. Did he recruit you onto this task force for a reason he left out?' },
  { id: 'money', title: 'Old crime, new money', pairs: [['shelleys', 'cordero'], ['shelleys', 'abigail']],
    text: 'The Shelleys paid for a hospital built on top of the old one, the place where Abigail died. A crime can be buried under a very nice building.' }
];

/* ---------- The town map. x, y are percent positions on the map. ----------
   unlock(s): the place stays hidden until this returns true.
   actions: things to do there. Each action:
     id, label           button text (id must be unique in the game)
     show(s)             optional: only offer it when true
     lock(s)             optional: returns a reason string if it can't be done yet
     specter: true       a specter is speaking; the shield must be off
     clue: 'id' or [ids]   clues you get the first time
     fx(s)               extra effects the first time (trust, flags)
     text                string or function(s); the scene
     choices: [{label, reply, fx}]   optional replies to the scene; the reply is shown after you choose
   Trust meters: s.trust.ethan, s.trust.specters, s.trust.town                                                       */
SV.PLACES = {
  apartment: { name: 'Gwyneth Miller’s Apartment', x: 18, y: 30, kind: 'house',
    blurb: 'Half past noon. The air conditioner is off, and the Georgia heat sits on everything. You can hear country cops inevitably messing up the bedroom, which is now an official FBI crime scene.',
    actions: [
      { id: 'body', label: 'Examine the body', clue: 'burns',
        text: 'Gwyneth is lying in bed, on her side, with her hands near her throat, which is singed with strange burn marks. Her fingernails have scratched at her throat as well, peeling away some of the skin. These are the telltale signs of the specter you are following, but most disturbingly, this victim, like all the others, looks a lot like your sister.\n\n“Shit,” you say.' },
      { id: 'candle', label: 'Look at the purple candle by the bed', clue: 'candle',
        text: 'You look over at the side table and take in the large purple candle. “What is this?” You lean in close. Next to it sits a tiny instruction card.\n\n*“May love’s embrace meet me at dawn’s face.”* The Daylight Candle Shop.' },
      { id: 'room', label: 'Search the room', clue: 'scent',
        text: 'You walk into the bedroom and immediately note the scent of candles and perfume. You suspect that maybe this woman did have a visitor the night before, and that this would not fit the profile of your four previous cases. You scan the room and make note of the cheap, feminine décor.' },
      { id: 'ethan_apt', label: 'Ethan Cole is in the doorway',
        text: function (s) {
          return (s.done.candle ? '@ethan “A candle from the Daylight Candle Shop.”\n\nHearing his voice, you take a shallow breath before quickly letting it out.\n\n' : 'Behind you, a voice you know. You take a shallow breath before quickly letting it out.\n\n') +
            'You turn as he strolls through the bedroom door. He wears laid-back local Southern clothes, faded jeans with a slightly tattered T-shirt and baseball cap, but there is no mistaking the city attitude in his walk. Ethan Cole.\n\nHis New York City swagger is enough to make a nun forget her vows just long enough to break them four or five times. He is six years older than you, but it looks good on him.\n\n@ethan “Hey, Audra. Wait up.”';
        },
        choices: [
          { label: '“I don’t have time, Ethan.”', reply: 'You leave without another word. Ethan watches you go.', fx: function (s) { s.trust.ethan -= 1; } },
          { label: '“Don’t worry, I won’t go around zapping your ghostly citizens.”', reply: 'He laughs, relieved, and lets you pass.', fx: function (s) { s.trust.ethan += 1; } },
          { label: '“You might want to warn the Daylight Candle Shop that they’re next on my list.”', reply: 'Ethan’s smile fades. Somewhere across town, a few specters will hear about this before supper.', fx: function (s) { s.trust.specters -= 1; } }
        ] }
    ] },

  library: { name: 'The Specter Public Library', x: 44, y: 18, kind: 'library',
    blurb: 'You find it hard to believe that people still go to the library, but it is full of people, mostly students, playing games at computers with headphones on. Specters dot the room in various stages of manifestation. The newbies are easy to spot, opaque and ghost-like. It is the ones who have mastered appearing normal that unsettle you.',
    actions: [
      { id: 'ben', label: 'Go to the reference desk', specter: true, clue: 'ben',
        fx: function (s) { s.trust.specters += 1; },
        text: 'You walk up to what appears to be an empty reference desk and are unsettled by the appearance of a specter who looks the part of a college kid with coke-bottle glasses and severe acne.\n\n@benjamin “You here about Gwyn?” His voice is the usual hollow, otherworldly echo associated with specters still mastering speech without a voice box.\n\n@benjamin “She didn’t come into work this morning. Gwyn never missed a day. Mr. Stuart sent her building super over to check on her.”' },
      { id: 'katherine', label: 'Go to the woman crying in the aisle', clue: 'katherine',
        text: 'You catch sight of a woman in her late thirties, crying alone down an aisle. She quickly dries her red-rimmed blue eyes and crosses her arms over her chest.\n\n“Hi, I’m Agent Wheeler. I’m here about Gwyneth Miller. Did you know her?”\n\n@katherine “I’m Katherine Taylor. We worked here together for the last six years. She was such a nice girl. She’d never hurt a fly. I can’t believe anyone would...”\n\n“Do you know if Gwyneth was seeing anybody?”\n\n@katherine “No. She was seeing some loser about a year ago but kicked him out. She’s been alone ever since. Her daddy was the sheriff, you know. He couldn’t stand the specters. I think that always weighed on her.”' },
      { id: 'charles', label: 'Knock on the manager’s door', clue: 'charles',
        text: 'At the manager’s door you hear hushed, muffled voices. You knock, and the voices stop. The door opens just wide enough for a tall, dark, and handsome man to peek his head out. His hair is disheveled, as if he has raked his hands through it several times. His eyes are bloodshot and there is a faint hint of liquor on his breath.\n\nA ghostly, feminine voice from inside says, “I’m outta here,” and a young girl with black and purple hair pushes past him and around you. Her shoulder vanishes and reappears as the rest of her clears you.\n\n@charles “My daughter, Amanda. I promised to do something remotely father-like and I had to back out because of all this.” He rubs his eyes. @charles “Gwyn? She was in a hurry that last day. Rushed out of here like she had somewhere important to be.”' },
      { id: 'computer', label: 'Check Gwyneth’s computer', clue: 'history',
        lock: function (s) { return s.done.charles ? null : 'It is password protected. Someone in charge would know it.'; },
        text: '“The password is library,” Charles Stuart supplies. “I need to get back to my office.”\n\nYou sit at Gwyneth’s computer and power it up quickly. You go to the web browser and check the history. In the last four hours of her last day at work, Gwyneth Miller searched for and visited the Daylight Candle Shop’s website. The final page in her history is on the big purple candle called the Dry Spell Reliever.\n\nYou shake your head and take down the address.' }
    ] },

  diner: { name: 'Bishop’s', x: 72, y: 30, kind: 'diner',
    blurb: 'The unmistakable aroma of barbecue guides you to a hole in the wall. You step into the diner/bar/café and feel the daggers of local, loyal patron stares. Walking past them in your Prada suit with silk shirt and red-soled Manolos, you realize you might have felt less conspicuous in a paper bag.',
    actions: [
      { id: 'ashley', label: 'Talk to the waitress', specter: true,
        fx: function (s) { s.trust.specters += 1; },
        text: 'A specter waitress, whom you are sure was a high school cheerleader, what with her winning smile and pumped-up attitude over barbecue, comes to take your order.\n\n@ashley “Hey, you here about Gwyn? Everyone knows everyone. Awful shame, she was so nice. Helped me every time I needed to find a book.”\n\nIt unnerves you how many people in this room are not alive, and how well they hide it.' },
      { id: 'ethan_diner', label: 'Ethan slides into your booth',
        text: '@ethan “We’ll talk after lunch.” He lifts an eyebrow, and you realize he doesn’t want to talk amongst listening citizens.\n\nHe orders the ribs. You wait for him to say what he came to say.',
        choices: [
          { label: '“I don’t believe in coincidences, Ethan. You should remember that much about me.”', reply: 'Ethan says nothing, but the corner of his mouth tells you he remembers.', fx: function (s) {} },
          { label: '“You look okay.”', reply: 'It is not much, but he takes it. His shoulders drop an inch.', fx: function (s) { s.trust.ethan += 1; } },
          { label: 'Say nothing and eat your ribs.', reply: 'The silence stretches, and you let it. Ethan stops pretending not to notice.', fx: function (s) { s.trust.ethan -= 1; } }
        ] }
    ] },

  station: { name: 'The Sheriff’s Station', x: 28, y: 66, kind: 'station',
    blurb: 'A four-room mobile home converted into a sheriff’s station. There are two other desks in the room marked for a secretary and a deputy, but no one is there. An ancient filing cabinet takes up nearly half of the wall behind the sheriff’s desk.',
    actions: [
      { id: 'files', label: 'Lay out the four case files', clue: 'victims',
        text: 'In the back meeting room you open the briefcase and line up four separate files, in order from the first murder to the last.\n\n“Amanda Price of Boston, Massachusetts,” you say, and look at the girl’s postmortem mug shot. Her skin is grayish, her dark hair spread across the steel table.\n\nJenifer Martin. Linda Parker. Regina Fowler. And now Gwyneth Miller. Five women. Dark hair, dark eyes, sleeping alone.\n\nEvery one of them looks like Kendra.' },
      { id: 'kendra', label: 'Tell Ethan about your sister’s case',
        lock: function (s) { return s.done.files ? null : 'You haven’t laid out the files yet.'; },
        text: '@ethan “Okay, tell me again about your sister’s case.” His face is set in an intense yet calm pose that says he is listening to your words, reading between the lines, and watching your body language.',
        choices: [
          { label: '“I ran to my sister’s room after hearing a crash.”', fx: function (s) { s.trust.ethan += 1; },
            reply: '“I ran to my sister’s room after hearing a crash. She was up in the air grabbing for her throat. When I flipped on the light she fell back onto the bed. No one else was there. I called 9-1-1 and tried my best at CPR. She was almost nine months pregnant at the time.”\n\n@ethan “How is she now?”\n\n“She’s still in a coma. Nothing has changed in the past thirteen years.”\n\n@ethan “Oh, Rook.” It is the nickname he gave you your first day together as partners.' },
          { label: 'Give him the facts and nothing else.', reply: 'You give him the facts. Your sister was attacked the same way, thirteen years ago. You keep your voice level and your eyes on the files.\n\n@ethan “Okay.”\n\nHe lets you keep your distance. You notice that he noticed.' }
        ] }
    ] },

  shop: { name: 'The Daylight Candle Shop', x: 56, y: 52, kind: 'shop',
    blurb: 'You park on the square in front of the shop and are greeted by soft music and the scent of lavender. The shop is small but well lit, with narrow aisles of candles on every shelf.',
    actions: [
      { id: 'mackenzie', label: 'Question the owner, Mackenzie Knox', clue: 'presence',
        text: '@mackenzie “Oh... hello. I didn’t hear the door. I apologize. Were you looking for anything in particular?”\n\nHer rich dark skin has a glow, and if you believed in auras, you would associate that glow with the purity of the woman’s spirit. Instead, you wave those thoughts away.\n\n“Yes, I’m Special Agent Audra Wheeler of the FBI special unit charged with bringing...”\n\n@mackenzie “I know why you are here, Agent Wheeler. May I see your hands?”',
        choices: [
          { label: 'Give her your hands.', fx: function (s, api) { api.clue(s, 'throat'); },
            reply: '“Why?”\n\n@mackenzie “This case is personal to you. I know things. Something about a sister,” she says, closing her eyes. “But it is not entirely clear.”\n\nYou figure it is worth a shot. Mackenzie turns your palms upward and you watch her face go through several emotional changes before she puts them back down.\n\n@mackenzie “It is not a specter. This presence is not a dead person’s spirit but an energy of someone living. What I sense is that the energy is being used as a weapon. The throat chakra governs truth and speech. Someone is silencing these women.”' },
          { label: '“I just need to ask you a few questions about the day Gwyneth came into your shop.”', fx: function (s) { s.trust.specters -= 1; },
            reply: '@mackenzie “Then I will say it plainly. It is not a specter. This presence is not a dead person’s spirit but an energy of someone living.”\n\n“Right, energy killed them.”\n\n@mackenzie “What I sense is that the energy is being used as a weapon.”\n\nHer tone is polite. Her warmth is gone.' }
        ] },
      { id: 'gwyn', label: 'Look at who is coming forward', specter: true, clue: 'abigail',
        lock: function (s) { return s.done.mackenzie ? null : 'Nothing is happening in here yet. Perhaps the owner has something to say first.'; },
        text: '“Before she died, Gwyneth purchased a candle from you, the Dry Spell Reliever.”\n\n@mackenzie “The candle calls a romantic specter. When it is purchased the specter knows where to go.” She looks around and then nods to an empty space. @mackenzie “He’s my grandfather. He has nothing for you, but I know someone who does.”\n\nYou watch as the air takes shape and an opaque specter manifests right in front of you.\n\nWhen you see that the specter coming forward is none other than Gwyneth Miller, you feel your entire body turn cold.\n\n@gwyn “Hello.” Her otherworldly voice is light, hollow, and seems somewhat amused.\n\n“Hello, Gwyneth. How long have you been here?”\n\n@gwyn “Since yesterday, I think. You want to solve my murder?”\n\n“Do you want me to solve your murder?”\n\n@gwyn “It won’t do me any good now, will it? But I suppose you could save another young lady. I wasn’t going to speak to you at first, but then I heard you say that your sister was adopted. The Sheriff adopted me also. I didn’t find out until I graduated from college. I found out my birth mother, Abigail Stevens, was strangled in the hospital the day I was born. And that the air that night was cold, and hard to breathe. Just like mine.”' }
    ] },

  bnb: { name: 'The Bed & Breakfast', x: 84, y: 68, kind: 'house',
    blurb: 'Your room at the B&B. Ethan’s jacket is on the chair. The file you brought is on the bed.',
    actions: [
      { id: 'file', label: 'Read the three tarnished pages on Abigail Stevens', clue: 'cordero',
        lock: function (s) { return s.done.gwyn ? null : 'You have no file on Abigail Stevens yet. Not until someone says her name.'; },
        text: 'You think about Gwyneth’s description of the air. You try to remember the air on the night of Kendra’s attack; it was cold and hard to breathe as well, but you attributed that all of these years to the mixture of adrenaline and panic.\n\nThe file is thin. Three tarnished pages, a medical examiner photograph, and a witness statement at the bottom of each page, signed by the same deputy.\n\nDeputy Jonathan Cordero. The man who recruited you.\n\n@ethan “What did you find out?”\n\n“Gwyn is now a specter. Her birth mother was murdered in the hospital just after Gwyn was born, strangled to death. Her name was Abigail Stevens.”',
        choices: [
          { label: '“I had a miscarriage, Ethan.”', fx: function (s) { s.trust.ethan += 2; },
            reply: 'Ethan’s eyes widen in shock.\n\n@ethan “Why didn’t you tell me?”\n\n“Well, you were leaving. It didn’t seem to bother you to be moving a thousand miles away.”\n\n@ethan “I told you, I didn’t want your career to get shot up because of me.” Then he stands and pulls you into a tight embrace. @ethan “Oh, Audra. You should have yelled and screamed at me. Honestly, Rook, losing you was the worst thing to ever happen to me.”' },
          { label: '“It doesn’t matter now.”', fx: function (s) { s.trust.ethan -= 1; },
            reply: 'You shrug it off, and you can see that he does not believe you.\n\n@ethan “Okay. I’m sorry, Audra. I’m sorry I wasn’t there.”\n\nYou nod and turn back to the file. It is easier to look at the dead.' }
        ] },
      { id: 'knock', label: 'A loud knock on the door', clue: 'shelleys',
        show: function (s) { return s.slot >= 5; },
        text: 'The visitor doesn’t bother to wait on an answer. A short, stout man with dark skin, thinning hair, and thick glasses waddles through the door.\n\n@mayor “Cole! Is this that FBI lady?”\n\n“Agent Wheeler,” you supply, extending your hand.\n\n@mayor “Mayor Broner.” He ignores your hand and focuses his scowl on you. @mayor “It’s them specters, ain’t it? I won’t have this in my town! Cole, you were elected as sheriff to pick up where Miller left off, and now his own daughter is victim to them!”\n\n@ethan “We really don’t know that, sir.”\n\n@brendon “Yeah, calm down, Jimmy. Specters have been nothing but kind and generous to our town for the last ten years. The Shelleys saw to the new hospital, and nobody asked them to.”\n\nThe richest family in town, you think. You file the name away.',
        fx: function (s) { s.trust.town -= 1; } }
    ] },

  /* INVENTED: the hospital, as a way to reach the Shelleys clue without the mayor. Rewrite to match the book. */
  hospital: { name: 'The New Hospital', x: 88, y: 18, kind: 'hospital',
    unlock: function (s) { return !!s.clues.abigail; },
    blurb: 'A clean, expensive building on a hill. The parking lot is nearly empty. Somewhere beneath all that glass was the place where Abigail Stevens died.',
    actions: [
      { id: 'plaque', label: 'Read the dedication plaque in the lobby', clue: 'shelleys',
        text: 'The plaque is polished brass. *This hospital was made possible by the generosity of the Shelley family, on the site of the old Specter Memorial.*\n\nThe old building is gone. The ground is the same. You wonder what else a family can buy when it buys a hospital.' }
    ] }
};

/* ---------- Words the engine shows ---------- */
SV.FLARE = 'Your specter shield flares at your wrist. The figure comes no closer, and its voice breaks into static. You will not get an honest word out of it while the shield is on.';
SV.START = 'apartment';
