/* DAY SIX, SUNDAY: Church (Chapter 26). */
(function () {
  SV.DAYS[5] = {
    label: 'Sunday', title: 'Church', start: 'church',
    slots: ['10:00 am', '12:30 pm', '2:30 pm', '4:30 pm', '6:30 pm'],
    intro: 'You pull up to the church and feel dwarfed by its height. You wonder if you should say a pre-church prayer preparing God to see you inside of His house. You reason that either He already knows you are coming, or He will be more than happy to see you when you get inside.',
    places: {
      church: { name: 'The Church', blurb: 'Magic pulls into the parking space next to you. Her wardrobe of the day is an appropriately modest flower-print dress with matching hat. You would not have believed two nights ago this woman led a naked dance show, if you hadn’t seen it for yourself. The choir is in a jazzed-up rendition of *His Eye Is on the Sparrow*, with specter Marcus Knox accompanying them on his saxophone.',
        actions: [
          { id: 'pews', label: 'Take a seat in the second pew', clue: 'drugged',
            text: 'Ethan dips his fingers in the holy water, as does Magic. You wait politely, not certain what the ritual is about. Magic leads you to the second row of benches on the right. When you glance to the left you are surprised to find the Shelleys taking up the front row. Every one of them from the dinner party, including Margret Shelley, who you are certain has to be drugged up. Her head bobs ever so slightly. You and Ethan exchange concerned glances.\n\nNo matter the personal differences, you realize that Margret is a young woman in need of serious help that includes getting her away from the Shelleys until she is strong enough to take care of herself. You feel disgusted as you wonder how much money it took the Shelleys to pay the hospital not to treat her.' },
          { id: 'sermon', label: 'Listen to the sermon',
            text: 'You are surprised to find that the preacher is black. An interesting mixture of the entire town fills the nearly full congregation, including the dark clerk from Fashions Today, and Delluca, the manager of the run-down HUD apartment building.\n\n@stockard “It has been nearly a week since we lost one of the living to tragic circumstances. Gwyn Miller was a rising star and, though we are glad to have her angelic spirit here with us again, we are saddened by the loss of such a precious life. So many things about this life make it so precious. Even with the promise of eternal paradise at the end, it is this life with its ever so much more preciously fleeting time that is more important. Because what you do here determines who and what you meet on the other side. It is in this life that we have the power to even create life.”\n\nYou can hardly believe when an hour passes. At the time of prayer Ethan stands to his feet and, though you are scared of what it means, you stand next to him. You listen to the preacher’s prayers for forgiveness and peace and feel the warm comfort that enters you. For the first time in a long time, you clear your mind and feel thankful for all of the good things.' },
          { id: 'handshake', label: 'Shake the Reverend’s hand', clue: 'stockard1',
            lock: function (s) { return s.done.sermon ? null : 'The service isn’t over.'; },
            text: 'You stand in the receiving line with Ethan and Magic.\n\n@stockard “Agent Wheeler.”\n\n“Excellent sermon,” you praise as he shakes your hand. You are given pause for a moment as you feel a strange warm energy emanate from his touch. You look at him curiously and his smile widens.\n\n@stockard “Only the called can feel that.” He turns quickly to the next parishioner.\n\nMagic announces that it is her day off, “Feel free to swing by to see me at work next week,” and leaves, seeming to almost run away from the church that had been so open and loving to all who had entered, even you.' }
        ] },

      lake: { name: 'Ethan’s Lake', blurb: 'The dock. Ethan has one fishing line, one blanket, and a plan.',
        actions: [
          { id: 'fishing', label: 'Learn to fish',
            text: '“One thing I have never done is fish,” you said. “Why don’t I follow you out to the country and you can show me how it’s done in your lake?”\n\n@ethan “I should warn you that I haven’t actually caught a fish myself. So, we may need to make plans to go back into town to actually eat.”\n\n“I have my entire meal from the Shelleys’ dinner,” you say, and tell him that after Gwyn forced Dr. Shelley’s revelations the guests were asked to leave with the dinner that was never served. Yolanda made the comment that Gwyn just may be a specter with a motive.\n\n@ethan “She was probably just trying to force the issue in a dramatic way.”\n\n“Why would you say that?” you pause, watching the strange expression across his face. “Did you all plan that?”\n\n@ethan “Maybe.” He shrugs.\n\n“Jesus, Ethan. Why? You know Charles Stuart was there and Margret made some insinuation that his daughter wasn’t swiped off the road by Eli, that it could have been the Councilman.”\n\n@ethan “Whoa. The accident with Amanda Stuart was several years before I arrived here. But I’ll be happy to open the case again and see if I can get to the truth of what happened.”\n\nHe pulls the line of the fishing pole in front of you. @ethan “Okay, I’ll hook the worm and cast off. You hold the pole and reel her in.”\n\n“I’m worried about Margret.”\n\n@ethan “Me too.”\n\n“Sometimes doing the right thing is hard. But I know you care for her, so do what you think is necessary to get her help.”\n\nHe kisses the top of your head. You fall into a comfortable silence and are happy to drop discussions of the Shelleys, specters, and death. After an hour without a single bite, you announce that it is lunch time.',
            fx: function (s) { s.trust.ethan += 1; } }
        ] },

      bnb: { name: 'The Bed & Breakfast', blurb: 'Yolanda says they are flipping through the photos and reading over the letters, and will leave your share for when you get back. “Enjoy your Sunday.”',
        actions: [
          { id: 'quail', label: 'Cold quail with wild rice, and lemon meringue pie',
            text: 'Ethan follows you back to the B&B and you rest in your room as you share the cold leftover quail with wild rice and spinach for lunch. You follow that with a healthy heaping slice of lemon meringue pie.\n\n@ethan “Wow. Even cold and a day old that was delicious.”\n\n“Wasn’t it?”\n\nYou both stretch out on the bed after eating and fall asleep in each other’s arms.',
            fx: function (s) { s.trust.ethan += 1; } }
        ] }
    },
    events: [],
    night: 'On Monday morning you will go through the photo albums and the letters Renee Stevens gave you. You will find one that was never opened.'
  };
})();
