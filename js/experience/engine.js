// Scene player: beats, choices, state, Case Board, save/resume.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var SAVE = 'as-seven-sisters-save-v1';
  var CH = window.AS_CHARS, CLUES = window.AS_CLUES, SC = window.AS_SCENES;
  var NARR = { g: 'f', rank: 1, pitch: 0.95, rate: 0.96 };
  var S, scene, beats, bi, typing, typeTimer, autoTimer, awaiting, cardTimer, settings = { sound: true, voice: true, auto: false };

  function fresh() { return { scene: 's01', trust: { ethan: 0, cordero: 0, specters: 0, town: 0 }, clues: {}, flags: {}, shield: true, auto: false }; }
  function save() { try { localStorage.setItem(SAVE, JSON.stringify({ scene: S.scene, state: S, settings: settings })); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(SAVE)); } catch (e) { return null; } }

  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(function () { t.classList.remove('show'); }, 2600); }
  function updateShield() { var b = $('shieldbtn'); b.textContent = 'Shield: ' + (S.shield ? 'ON' : 'OFF'); b.classList.toggle('off', !S.shield); }
  function beds() { var l = (scene.amb || []).slice(); if ($('frost').classList.contains('on') && l.indexOf('cold') < 0) l.push('cold'); ASAudio.setBeds(l); }

  function renderCast(list) {
    var el = $('cast'); el.innerHTML = '';
    (list || []).forEach(function (p) {
      var c = CH[p[1]]; if (!c) return; var d = document.createElement('div');
      d.className = 'sil in ' + p[0] + (c.specter ? ' spec' : ''); d.dataset.key = p[1];
      d.innerHTML = ASVisuals.silhouette(c) + '<div class="nm">' + c.name + '</div>'; el.appendChild(d);
    });
  }
  function highlight(key) { Array.prototype.forEach.call($('cast').children, function (d) { d.classList.toggle('talk', d.dataset.key === key); }); }

  function go(id) {
    clearTimeout(typeTimer); clearTimeout(autoTimer); ASAudio.stopSpeech();
    scene = SC[id]; if (!scene) { console.error('missing scene', id); return; }
    S.scene = id; save();
    $('frost').classList.remove('on'); $('black').classList.remove('on');
    $('where').textContent = scene.where || ''; $('choices').innerHTML = ''; $('prompt').textContent = '';
    ASVisuals.setScene(scene.bg, scene.fx); renderCast(scene.cast); beds();
    beats = scene.beats || []; bi = 0; awaiting = false;
    if (scene.end) return showEnd();
    if (scene.card) return showCard(scene.card, function () { step(); });
    step();
  }

  function showCard(c, done) {
    $('cardk').textContent = c.kicker || ''; $('cardt').textContent = c.title || ''; $('cards').textContent = c.sub || '';
    $('card').classList.add('show'); var fin = function () { clearTimeout(cardTimer); $('card').classList.remove('show'); $('card').onclick = null; done(); };
    $('card').onclick = fin; cardTimer = setTimeout(fin, 3400);
  }

  function instant(b) {
    if (b.clue) { if (!S.clues[b.clue]) { S.clues[b.clue] = 1; ASAudio.sting('chime'); toast('Clue added: ' + CLUES[b.clue].title); } return true; }
    if (b.sting) { ASAudio.sting(b.sting); return true; }
    if (typeof b.shield === 'boolean') { S.shield = b.shield; updateShield(); toast('Specter shield ' + (b.shield ? 'ON' : 'OFF')); return true; }
    if (b.fx) { if (b.fx === 'frost') $('frost').classList.add('on'); if (b.fx === 'frostoff') $('frost').classList.remove('on'); if (b.fx === 'black') $('black').classList.add('on'); if (b.fx === 'blackoff') $('black').classList.remove('on'); beds(); return true; }
    if (b.cast) { renderCast(b.cast); return true; }
    if (b.trust) { Object.keys(b.trust).forEach(function (k) { S.trust[k] += b.trust[k]; }); return true; }
    if (b.flag) { S.flags[b.flag] = 1; return true; }
    return false;
  }

  function step() {
    clearTimeout(autoTimer);
    for (;;) {
      if (bi >= beats.length) return finish();
      var b = beats[bi++];
      if (b.if && !b.if(S)) continue;
      if (instant(b)) continue;
      return show(b);
    }
  }

  function show(b) {
    var who = b.s ? CH[b.s] : null, txt = b.n || b.t || b.q, spec = who && who.specter;
    $('speaker').textContent = who ? who.name : (b.q ? 'From the novel' : '');
    $('speaker').className = spec ? 'spec' : ''; $('text').className = (b.q ? 'quote ' : '') + (spec ? 'spec' : '');
    $('qsrc').textContent = b.q ? '— American Specter: The Seven Sisters' : '';
    highlight(b.s); if (spec && S.lastSpec !== b.s) ASAudio.sting('phase'); S.lastSpec = spec ? b.s : null;
    var el = $('text'), i = 0, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    clearTimeout(typeTimer); typing = true; awaiting = true; el.textContent = '';
    var spoken = ASAudio.speak(txt, who || NARR, function () { if (settings.auto && !typing) autoTimer = setTimeout(advance, 900); });
    function tick() { if (i >= txt.length || reduce) { el.textContent = txt; typing = false; if (settings.auto && !spoken) autoTimer = setTimeout(advance, 1400 + txt.length * 30); else if (settings.auto && spoken && !window.speechSynthesis.speaking) autoTimer = setTimeout(advance, 900); return; } i += 1; el.textContent = txt.slice(0, i); typeTimer = setTimeout(tick, 16); }
    tick();
  }

  function advance() {
    if (!awaiting || $('choices').children.length) return;
    if (typing) { clearTimeout(typeTimer); var b = beats[bi - 1]; $('text').textContent = b.n || b.t || b.q; typing = false; return; }
    ASAudio.stopSpeech(); step();
  }

  function finish() {
    awaiting = false; var ch = scene.choice;
    if (ch) {
      var opts = ch.options.filter(function (o) { return !o.cond || o.cond(S); });
      $('speaker').textContent = ''; $('prompt').textContent = ch.prompt || ''; highlight(null);
      $('hint').textContent = 'Choose (1–' + opts.length + ')'; $('choices').innerHTML = '';
      opts.forEach(function (o, k) {
        var btn = document.createElement('button'); btn.className = 'choice'; btn.innerHTML = '<b>' + (k + 1) + '</b>' + o.t;
        btn.onclick = function (e) { e.stopPropagation(); pick(o); }; btn.dataset.k = k; $('choices').appendChild(btn);
      });
      $('choices')._opts = opts; return;
    }
    if (scene.next) go(scene.next);
  }
  function pick(o) { $('choices').innerHTML = ''; $('hint').textContent = 'Click or press Space to continue'; if (o.do) o.do(S); go(o.to); }

  function showEnd() { renderEnd(); $('end').classList.add('show'); ASAudio.setBeds(['wind']); }
  function renderEnd() {
    var n = Object.keys(S.clues).length, total = Object.keys(CLUES).length;
    $('endstats').innerHTML = '<span>Clues found: <b>' + n + ' / ' + total + '</b></span><span>Ethan: <b>' + S.trust.ethan + '</b></span><span>Specters: <b>' + S.trust.specters + '</b></span><span>Town: <b>' + S.trust.town + '</b></span>';
  }

  function openBoard() {
    var g = $('boardgrid'); g.innerHTML = ''; Object.keys(CLUES).forEach(function (k) {
      var d = document.createElement('div'); d.className = 'clue' + (S.clues[k] ? '' : ' lock');
      d.innerHTML = S.clues[k] ? '<h4>' + CLUES[k].title + '</h4><p>' + CLUES[k].text + '</p>' : '<h4>?</h4><p>Undiscovered</p>'; g.appendChild(d);
    });
    $('board').classList.add('show');
  }

  function begin(resume) {
    ASAudio.init(); settings.sound = $('optSound').checked; settings.voice = $('optVoice').checked; settings.auto = $('optAuto').checked;
    ASAudio.setEnabled(settings.sound); ASAudio.setVoices(settings.voice);
    var sv = resume && load(); S = sv ? sv.state : fresh(); updateShield();
    $('title').classList.remove('show'); $('end').classList.remove('show');
    go(sv ? S.scene : 's01');
  }

  // wiring
  $('beginBtn').onclick = function () { localStorage.removeItem(SAVE); begin(false); };
  $('resumeBtn').onclick = function () { begin(true); };
  $('againBtn').onclick = function () { localStorage.removeItem(SAVE); $('end').classList.remove('show'); $('title').classList.add('show'); ASAudio.setBeds([]); };
  $('endBoardBtn').onclick = openBoard;
  $('boardBtn').onclick = function (e) { e.stopPropagation(); openBoard(); };
  $('closeBoard').onclick = function () { $('board').classList.remove('show'); };
  $('shieldbtn').onclick = function (e) { e.stopPropagation(); S.shield = !S.shield; updateShield(); toast('Specter shield ' + (S.shield ? 'ON' : 'OFF')); save(); };
  $('soundBtn').onclick = function (e) { e.stopPropagation(); settings.sound = !settings.sound; ASAudio.setEnabled(settings.sound); this.classList.toggle('on', settings.sound); this.textContent = 'Sound: ' + (settings.sound ? 'ON' : 'OFF'); };
  $('voiceBtn').onclick = function (e) { e.stopPropagation(); settings.voice = !settings.voice; ASAudio.setVoices(settings.voice); this.textContent = 'Voices: ' + (settings.voice ? 'ON' : 'OFF'); };
  $('autoBtn').onclick = function (e) { e.stopPropagation(); settings.auto = !settings.auto; this.textContent = 'Auto: ' + (settings.auto ? 'ON' : 'OFF'); if (settings.auto) advance(); };
  $('dialog').onclick = advance;
  document.addEventListener('keydown', function (e) {
    if ($('title').classList.contains('show') || $('board').classList.contains('show')) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); advance(); }
    var n = parseInt(e.key, 10), o = $('choices')._opts; if (n >= 1 && o && $('choices').children.length && o[n - 1]) pick(o[n - 1]);
  });
  if (load()) $('resumeBtn').style.display = 'inline-block';
  if (!ASAudio.hasVoices()) { $('optVoice').checked = false; $('optVoice').disabled = true; }
  ASVisuals.resize();
  window.AS = { go: function (id) { S = S || fresh(); go(id); }, state: function () { return S; } };
})();
