/* SPECTERVILLE: CORE CONTENT. Case One, "The Seven Sisters" (Book One), as one investigation across seven days.
   Shared things live here: people, clues, theories, suspects, map positions. Each day is its own file in js/specterville/days/.

   Paragraph starting "@key " is spoken by that character (shown as a name tag). *Asterisks* make italics.
   Dialogue is condensed from the manuscript and keeps its wording wherever it can.
   THE TRUTH: the killer is Principal Lillian Shelley, using Pleiades/chakra energy. Do not reveal it before the accusation. */
window.SV = { DAYS: [] };

SV.WHO = {
  audra: 'Audra', ethan: 'Ethan', benjamin: 'Benjamin', katherine: 'Katherine', charles: 'Charles', ashley: 'Ashley',
  mackenzie: 'Mackenzie', gwyn: 'Gwyneth', mayor: 'Mayor Broner', brendon: 'Brendon', miller: 'Sheriff Miller', cordero: 'Cordero',
  yolanda: 'Yolanda', joshua: 'Joshua', eric: 'Eric', thomas: 'Thomas', renee: 'Renee', delluca: 'Delluca', drshelley: 'Dr. Shelley',
  principal: 'Principal Shelley', margret: 'Margret', magic: 'Magic', marcus: 'Marcus', tammy: 'Tammy', amanda: 'Amanda', raj: 'Raj Kapure',
  stockard: 'Reverend Stockard', hawthorne: 'Dr. Hawthorne', mrs: 'Mrs. Shelley', eli: 'Eli', pierce: 'Pierce', kenneth: 'Dr. Shelley, Sr.', reporter: 'Reporter'
};

/* ---------- Clues ---------- */
SV.CLUES = {
  /* Day 1 */
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
  abigail: ['Abigail Stevens', 'Gwyn’s birth mother was strangled in the hospital the day Gwyn was born. Never solved. The air that night was cold, dry, and hard to breathe.'],
  cordero: ['A Familiar Signature', 'Deputy Jonathan Cordero signed Abigail’s witness statements. He never told you.'],
  shelleys: ['The Shelleys', 'The richest family in town. They funded the new hospital five years ago. The old hospital, where Abigail died, is now a park.'],
  /* Day 2 */
  delluca: ['Candy Reign, Gone', 'Abigail’s friend Candy died of an overdose five years ago. Her building was owned by the Shelleys until they gave it to HUD.'],
  samefather: ['One Father', 'Kendra and Gwyn are full sisters. Every victim has the same father and a different mother, and all were adopted.'],
  pleiades: ['The Seven Sisters', 'Each victim died under the Pleiades star cluster over her city. One star is left, Taygete, and Kendra is Alcyone. The killer may be seeking a power seven times.'],
  millerghost: ['The Old Sheriff', 'Sheriff Miller ran DNA on every man in town and found no match. Abigail had a sugar daddy and a bank in town. Ask Annie, the teller.'],
  /* Day 3 */
  renee: ['Abigail’s Sister', 'Renee: Abigail gave her first baby up, then married a sailor named Raj Kapure. She came back pregnant again and had an apartment. A private Indian doctor never delivered the baby.'],
  money: ['Money From Nowhere', 'About $3,000 a month has gone into Abigail’s account since before her death, and still arrives today. Thomas traces it to an unnamed Swiss account.'],
  fire: ['A Fire With No Cause', 'The sheriff’s station burned the day Audra went to see Renee. Eric found no accelerant, no explosive, and no point of origin.'],
  corderoknew: ['Cordero Knew Her', 'Cordero: “Yes, I knew her. But I didn’t kill her.” He left town less than six months after Abigail’s murder.'],
  margret: ['Kendra’s Twin', 'Margret Shelley, the hospital administrator, looks exactly like Kendra. In the elevator Audra could not breathe, and she fainted.'],
  drshelley: ['The Specter Doctor', 'Dr. Kenneth Shelley II was a resident when Abigail died. He gave her money from time to time. “She wasn’t my type.”'],
  hawthorn: ['The Math Teacher', 'Mr. Hawthorn tutored Abigail and brought word of an assault to the principal. Abigail wouldn’t name anyone.'],
  invite: ['The Invitation', 'Principal Shelley invited you to a Saturday dinner “to question the family discreetly.” She told you to bring dates.'],
  warning: ['A Ghost’s Warning', 'Sheriff Miller: if you open your mouth about your sister, you put her and yourself in danger.'],
  lights: ['The Lights', 'When Audra turned on Kendra’s lights, the thing let go and she fell. The attacks always come near dawn, in the dark.'],
  accuses: ['“One of You”', 'Gwyn, at the town hall: “I was killed by a person. I was killed by one of you!”'],
  staged: ['A Staged Distraction', 'Sheriff Miller and Dr. Shelley: the murders may be staged to look like Abigail’s. They may only be a distraction.'],
  /* Day 4 */
  hid: ['Cordero Hid Kendra', 'Cordero delivered twins with a midwife in Atlanta. Kendra went to his friend. Margret was sold to Dr. Shelley’s wife. Abigail begged him: “Don’t let them get her too.”'],
  autopsy: ['The Autopsy', 'Abigail’s neck was broken. Truth serum in her bones, sleeping pills in her teeth. She was questioned before she died.'],
  license: ['Raj Kapure Lives', 'Abigail’s husband is alive, a prince, living in Boston. The divorce was never finalized.'],
  candyplan: ['Candy’s Plan', 'Magic: Candy and Abigail planned to run off with two of the Shelley boys. “Big Mama Shelley” had Candy arrested. After Abigail’s murder Candy blamed the Shelleys.'],
  eli: ['The Missing Triplet', 'The third triplet is Eli Shelley. He is in prison for killing Amanda Stuart while driving drunk.'],
  kennedy: ['Kennedy Shelley', 'Ashley says the councilman’s son Kennedy “turned out to be a real jerk,” and that “people said his mama was crazy anyway.”'],
  /* Day 5 */
  satellite: ['The Satellite', 'Yellow dots are living people, green are specters. A tomb in the cemetery shows a crowd of specters. The Shelley mansion has five times as many specters as people.'],
  dnadinner: ['The Dinner DNA', 'Dr. Shelley, Sr. is Abigail’s biological father. The triplets are not his sons. Any triplet might be Margret’s father.'],
  mrsshelley: ['Mrs. Shelley’s Silence', 'Mrs. Shelley sat silent and pale through the dinner. “Now you know everything,” she said, and left.'],
  rajcalls: ['Kapure’s Call', 'Raj Kapure called, and seemed not to know Abigail was dead. He must tie up business overseas before he flies down.'],
  /* Day 6 */
  stockard1: ['The Reverend’s Touch', 'Reverend Stockard’s handshake carries a warm energy. “Only the called can feel that.”'],
  drugged: ['Margret Is Sedated', 'Margret is in the front pew, her head bobbing. The Shelleys have her heavily medicated.'],
  /* Day 7 */
  triplets: ['Her Sons', 'Mrs. Shelley: Principal Lillian got pregnant by a married man, another teacher. Her parents forced her to give the triplets to Kenneth, and the family raised them as their own.'],
  eliletter: ['A Letter From Eli', 'An unopened letter from Eli Shelley to Abigail, six months before she died: “It still breaks my heart that it is over.”'],
  elitruth: ['What Eli Knows', 'Eli loved Abigail. His father told him she was his sister, so he tested their DNA. He did not send the money. He admits running down Amanda Stuart.'],
  pink: ['The Pink Signature', 'A strange energy source, a pink signature, showed at the Shelley house, then at Ethan’s house the night Margret stayed.'],
  confession: ['Margret’s “Confession”', 'Margret confessed on television to Gwyn’s murder while drugged. Ethan’s trick: she called him and confessed so he could take her in on a 5150.'],
  kendracalls: ['Kendra’s Calls', 'Thirteen years ago Kendra called the hospital (35 min), the church four times, the high school (15 min), and Renee Stevens.'],
  stockardcall: ['“Ask Principal Shelley”', 'Reverend Stockard: he told Kendra that if there were a pregnant teenager in Specter, the best person to ask would be Principal Shelley. “She would know.”']
};

/* ---------- Theories: connect two clues on the Case Board. "pairs" lists every combination that works. ---------- */
SV.THEORIES = [
  { id: 'living', title: 'A living killer', pairs: [['burns', 'presence']],
    text: 'The burns look like a specter’s work, but Mackenzie says the energy behind them belongs to someone living. You may not be hunting a specter at all.' },
  { id: 'door', title: 'The candle is the door', pairs: [['candle', 'history'], ['charles', 'history']],
    text: 'Gwyn went looking for the Dry Spell Reliever on her last day, and she lit it that night. Whatever came for her, the Daylight Candle Shop is where it started.' },
  { id: 'chosen', title: 'Chosen women', pairs: [['victims', 'katherine'], ['victims', 'samefather']],
    text: 'Five women who look like your sister, with one father between them. Nobody gets this lucky by accident. Someone chose them.' },
  { id: 'old', title: 'An old murder', pairs: [['throat', 'abigail']],
    text: 'The throat governs truth and speech, and Abigail Stevens was strangled the day her daughter was born. Someone has been silencing women in Specter for a long time.' },
  { id: 'cordero', title: 'What Cordero left out', pairs: [['cordero', 'abigail'], ['corderoknew', 'cordero']],
    text: 'Jonathan Cordero signed Abigail’s statements and never mentioned it to you. Did he recruit you onto this task force for a reason he left out?' },
  { id: 'money', title: 'Old crime, new money', pairs: [['shelleys', 'abigail'], ['shelleys', 'delluca']],
    text: 'Abigail died in the old hospital, and the old hospital is now a park. The richest family in town paid for the new one, and gave her friend’s building away. Her file is three pages long. Someone did not want anyone to look hard.' },
  { id: 'stars', title: 'The killer follows the stars', pairs: [['pleiades', 'victims'], ['pleiades', 'samefather']],
    text: 'Seven sisters, seven stars, seven cities. The killer is working through Abigail’s daughters under the Pleiades. Gwyn was Calaeno. Taygete is left, and Kendra, who lives, is Alcyone.' },
  { id: 'dark', title: 'It needs the dark', pairs: [['lights', 'presence'], ['lights', 'abigail']],
    text: 'A living person’s energy, strong in the dark, gone when the lights come on. It struck near dawn. You can’t fight it. You can only light the room.' },
  { id: 'silenced', title: 'Questioned, then silenced', pairs: [['autopsy', 'throat']],
    text: 'Truth serum in her bones, sleeping pills in her teeth. Abigail was made to talk before she died. The killer wanted something from her, and then wanted her quiet.' },
  { id: 'swiss', title: 'The Swiss account', pairs: [['money', 'license'], ['money', 'rajcalls']],
    text: 'Raj Kapure and Abigail never divorced. If the money comes from a joint Swiss account, he may be sending it, or someone else is sending it in his name.' },
  { id: 'family', title: 'It runs in the family', pairs: [['dnadinner', 'samefather'], ['dnadinner', 'candyplan']],
    text: 'Dr. Shelley, Sr. fathered Abigail. His sons were being asked to marry the women they might have been related to. The Shelleys had every reason to stop that wedding, and every reason to silence Abigail.' },
  { id: 'sedated', title: 'Keeping Margret quiet', pairs: [['drugged', 'confession']],
    text: 'Margret is sedated, forced into a public “confession,” and kept out of the hospital. Someone in that house wants her silent, or wants her blamed.' },
  { id: 'keeper', title: 'Kendra’s search led here', pairs: [['kendracalls', 'stockardcall']],
    text: 'Kendra called the church, and the pastor sent her to the one person in Specter who knew every pregnant teenager. Thirteen years ago, one phone call put Kendra on a killer’s list.' }
];

/* ---------- Suspects for the final accusation ---------- */
SV.SUSPECTS = [
  { id: 'brendon', name: 'Councilman Brendon Shelley', blurb: 'Charming. Went tense at the sight of Abigail’s file. One of the Shelley triplets.',
    why: 'Brendon sits calmly in the interview room with a mug of coffee. Pierce’s reader shows nothing near him. When the energy surges, he is locked in a room with Joshua.' },
  { id: 'cordero', name: 'AD Jonathan Cordero', blurb: 'Your boss. The deputy who signed Abigail’s statements and hid Kendra.',
    why: 'He hid Kendra to save her, and he knelt over Abigail’s remains and said he had failed her. He is the one man who has been at your side the whole time.' },
  { id: 'lillian', name: 'Principal Lillian Shelley', blurb: 'Eighty. Principal of the high school for nearly forty years. Margret’s “aunt.”', truth: true },
  { id: 'raj', name: 'Raj Kapure', blurb: 'Abigail’s husband. A prince. He may have sent the money.',
    why: 'Raj is a grieving man who flew in to pay respects and gave you every account he had. He called you. Killers don’t call.' },
  { id: 'kenneth', name: 'Dr. Kenneth Shelley, Sr.', blurb: 'The family patriarch. Abigail’s biological father, and the one who bought Margret.',
    why: 'He is bedridden, hooked to monitors, his heart already failing. He cannot lift a hand, let alone choke a woman in another city.' },
  { id: 'eli', name: 'Eli Shelley', blurb: 'The third triplet. In prison for killing Amanda Stuart. He loved Abigail.',
    why: 'Eli has been shackled in a state prison for five years. He wept when you told him of Gwyn’s death.' },
  { id: 'drshelley', name: 'Dr. Kenneth Shelley II (specter)', blurb: 'A triplet, a specter, a resident the night Abigail died. He gave her money “from time to time.”',
    why: 'He is dead, and a specter. Mackenzie said it plainly: this is the energy of someone living.' },
  { id: 'hawthorne', name: 'Dr. Brian Hawthorne', blurb: 'Abigail’s old tutor. He brought the assault to the principal.',
    why: 'He was the one who tried to help. He sat quietly at the dinner, married to a specter doctor, and your energy reader found nothing.' }
];
/* Clues that point at the truth. A correct accusation needs two of the three you pick. */
SV.KEY = ['presence', 'throat', 'pleiades', 'lights', 'drugged', 'kendracalls', 'stockardcall', 'invite', 'autopsy'];

/* ---------- Map positions (percent) ---------- */
SV.POS = {
  apartment: [14, 28], library: [36, 16], school: [58, 12], hospital: [88, 16], diner: [74, 32], townhall: [46, 36],
  shop: [52, 50], shops: [60, 60], station: [28, 62], hud: [12, 50], scoop: [16, 76], bnb: [84, 66], lake: [94, 42],
  trailer: [6, 90], church: [36, 88], cemetery: [58, 90], mansion: [78, 86], prison: [94, 92], jail: [40, 50]
};

/* ---------- Words the engine shows ---------- */
SV.FLARE = 'Your specter shield flares at your wrist. The figure comes no closer, and its voice breaks into static. You will not get an honest word out of it while the shield is on.';
