/* Reading-page player: scenes, choices, Listen (read aloud), Case Board, saved progress. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var SAVE = 'as-seven-sisters-v2', BOOK_URL = 'https://www.amazon.com/dp/B09CLJ7HBB';
  var STORY = window.AS_STORY, ACTS = window.AS_ACTS, CLUES = window.AS_CLUES, CHARS = window.AS_CHARS;
  var view = $('view'), st = { id: null, s: null, hist: [], log: {}, saved: null }, lastId = null, listening = false, textOn = true, soundOn = true, autoTimer, runTok = 0;
  var TRUST = { ethan: 'Ethan', cordero: 'Cordero', specters: 'The Specters', town: 'The Town' };

  var esc = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var fmt = function (t) { return esc(t).replace(/\*([^*]+)\*/g, '<em>$1</em>'); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var fresh = function () { return { trust: { ethan: 0, cordero: 0, specters: 0, town: 0 }, clues: {}, f: {}, shield: true }; };

  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(function () { t.classList.remove('show'); }, 2400); }
  function clue(s, id) { if (!s.clues[id]) { s.clues[id] = 1; ASAudio.sting('chime'); toast('Clue added: ' + CLUES[id][0]); } }
  function syncShield() { var b = $('btn-shield'); b.textContent = 'Shield: ' + (st.s && st.s.shield ? 'On' : 'Off'); b.classList.toggle('on', !!(st.s && st.s.shield)); }
  window.AS = { clue: clue, syncShield: syncShield, toast: toast };

  function save() { try { localStorage.setItem(SAVE, JSON.stringify({ id: st.id, s: st.s, hist: st.hist, log: st.log })); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(SAVE)); } catch (e) { return null; } }

  function parse(text) { // -> [{who, body}]
    return text.split(/\n\n+/).filter(function (p) { return p.trim(); }).map(function (p) {
      var m = p.trim().match(/^@(\w+)\s+([\s\S]*)$/); return m ? { who: m[1], body: m[2] } : { who: null, body: p.trim() };
    });
  }
  function paraHtml(items) { return items.map(function (it) { return '<p>' + fmt(it.body.replace(/@(\w+)\s/g, '')) + '</p>'; }).join(''); }
  var NARRATOR = { narr: true, g: 'f', rank: 1, pitch: 0.9, rate: 0.94 };
  // Quoted speech is read in the speaker's voice (Audra when nobody is tagged), everything else by the narrator.
  function speakItems(items) {
    var out = [];
    items.forEach(function (it, pi) {
      var cur = it.who || (/^“/.test(it.body) ? 'audra' : null);
      it.body.split(/(@\w+\s|“[^”]*”)/).forEach(function (seg) {
        if (!seg) return; var tag = seg.match(/^@(\w+)\s$/);
        if (tag) { cur = tag[1]; return; }
        if (/^“/.test(seg)) { out.push({ text: seg.replace(/[“”]/g, ''), who: CHARS[cur || 'audra'] || CHARS.audra, p: pi }); return; }
        if (/[A-Za-z0-9]/.test(seg)) out.push({ text: seg, who: NARRATOR, p: pi });
      });
    });
    return out;
  }
  function bookBtn() { return '<a class="cta ghost" href="' + BOOK_URL + '" target="_blank" rel="noopener">Read the full novel</a>'; }
  function drawActs(n) { $('acts').innerHTML = ACTS.map(function (a) { return '<i class="' + (a.n <= n ? 'on' : '') + '"></i>'; }).join(''); }

  var EXT = ['.mp4', '.webm', '.jpg', '.jpeg', '.png', '.webp'], found = {};
  function placeholder(title, note, base) {
    return '<div class="ph"><span class="k">Image or video placeholder</span><span class="t">' + esc(title) + '</span><span class="d">' + esc(note) + '</span><span class="f">Upload as ' + esc(base) + '.mp4 or .jpg</span></div>';
  }
  function mediaBox(id, cover) {
    var m = window.AS_MEDIA && window.AS_MEDIA[id] || [id, ''], base = 'media/act1/' + id;
    if (cover) return '<div class="media contain" id="media" data-cands="images/book-1-the-seven-sisters.jpg" data-alt="Book cover"></div>';
    return '<div class="media" id="media" data-base="' + base + '" data-alt="' + esc(m[0]) + '">' + placeholder(m[0], m[1], base) + '</div>';
  }
  function attachMedia() {
    var box = $('media'); if (!box) return;
    var cands = box.dataset.cands ? [box.dataset.cands] : EXT.map(function (e) { return box.dataset.base + e; });
    if (box.dataset.base && found[box.dataset.base] === false) return;
    if (box.dataset.base && found[box.dataset.base]) cands = [found[box.dataset.base]];
    (function next(i) {
      if (i >= cands.length) { if (box.dataset.base) found[box.dataset.base] = false; return; }
      var c = cands[i], vid = /\.(mp4|webm)$/.test(c), el = document.createElement(vid ? 'video' : 'img');
      var ok = function () { if ($('media') !== box) return; if (box.dataset.base) found[box.dataset.base] = c; box.innerHTML = ''; box.appendChild(el); if (vid) { var pr = el.play(); if (pr && pr.catch) pr.catch(function () {}); } };
      var bad = function () { next(i + 1); };
      if (vid) { el.muted = true; el.loop = true; el.autoplay = true; el.setAttribute('playsinline', ''); el.onloadeddata = ok; el.onerror = bad; el.src = c; }
      else { el.alt = box.dataset.alt || ''; el.onload = ok; el.onerror = bad; el.src = c; }
    })(0);
  }

  function render(focus, arrive) {
    stopListen(true); $('btn-back').disabled = !st.id || st.hist.length === 0;
    if (!st.id) return cover();
    var n = STORY[st.id], act = ACTS[n.act - 1]; drawActs(n.act); syncShield();
    var text = typeof n.text === 'function' ? n.text(st.s) : n.text, html = '', items = parse(text);
    if (arrive && lastId !== st.id) { if (n.sting) ASAudio.sting(n.sting); }
    ASAudio.setBeds(n.amb || []); lastId = st.id;
    html += mediaBox(st.id === 'act1end' ? 'act1end' : st.id, false) + '<div class="scroller" id="scroller"><div class="col">';
    if (n.endAct) {
      var total = Object.keys(CLUES).length, got = Object.keys(st.s.clues).length;
      html += '<div class="eyebrow"><span class="end-kind">End of Act ' + n.act + '</span><span>' + esc(act.ch) + '</span></div><h1 class="end-title" tabindex="-1" id="head">' + esc(n.title) + '</h1>';
      html += '<div class="prose"><p>You have a type, a name, and a twenty-five-year-old murder that ties it all to one powerful family. Audra knows the killer has been two steps ahead of her for thirteen years. Acts II through VI are coming next.</p></div><hr class="rule">';
      html += '<p class="tally">Clues found: <b>' + got + ' of ' + total + '</b></p>';
      html += '<div class="cta-row"><button class="cta" type="button" data-do="map">Open the Case Board</button><button class="cta ghost" type="button" data-do="back">Change your last choice</button><button class="cta ghost" type="button" data-do="again">Play again</button>' + bookBtn() + '<a class="cta ghost" href="index.html">Back to the site</a></div>';
      view._items = null;
    } else {
      html += '<div class="eyebrow"><span class="pov' + (n.pov === 'GWYN' ? ' gwyn' : '') + '">' + n.pov + '</span><span>Act ' + n.act + ' · ' + esc(act.name) + '</span><span>' + (n.ch === 'Prologue' ? 'From the prologue' : 'From chapter' + (/[–,]/.test(n.ch) ? 's ' : ' ') + esc(n.ch)) + '</span></div>';
      html += '<h1 class="scene-title" tabindex="-1" id="head">' + esc(n.title) + '</h1><div class="listening-note">Listening… press Text to read along.</div>';
      html += '<div class="prose">' + paraHtml(items) + '</div>';
      var cs = n.choices.map(function (c, i) { return { c: c, i: i }; }).filter(function (x) { return !x.c.show || x.c.show(st.s); });
      html += '<div class="choices">' + (cs.length > 1 ? '<div class="prompt">What do you do?</div>' : '');
      html += cs.map(function (x) { return '<button type="button" class="choice' + (cs.length === 1 ? ' next' : '') + '" data-i="' + x.i + '">' + fmt(x.c.label) + (cs.length === 1 ? ' →' : '') + '</button>'; }).join('') + '</div>';
      view._items = items; view._single = cs.length === 1 ? cs[0].i : -1;
    }
    html += '</div></div>';
    view.className = 'view fade' + (!textOn && listening ? ' hide-text' : '');
    view.innerHTML = html; save(); attachMedia();
    if (focus) { var sc = $('scroller'); if (sc) sc.scrollTop = 0; var h = $('head'); if (h) h.focus({ preventScroll: true }); }
    if (listening && !n.endAct) listen();
  }

  function cover() {
    stopListen(true); drawActs(0); ASAudio.setBeds(['wind']);
    view.className = 'view cover fade'; view._items = null;
    view.innerHTML = mediaBox('cover', true) + '<div class="scroller" id="scroller"><div class="col">' +
      '<div class="eyebrow"><span class="pov">AUDRA</span><span>An interactive investigation</span></div>' +
      '<h1 id="head" tabindex="-1">American Specter: <em>The Seven Sisters</em></h1><div class="byline">Rasheedah Prioleau</div>' +
      '<p class="lede">A librarian in Specter, Georgia lights a candle and does not wake up. Five other women have died the same way, in five different cities, and every one of them looks like your sister. You are FBI Special Agent Audra Wheeler, and the trail leads to the one town where the dead walk the streets beside the living.</p>' +
      '<ul class="facts"><li>You play <b>Audra</b></li><li><b>6</b> acts</li><li>Act <b>I</b> is open now</li><li>About <b>25</b> minutes so far</li></ul>' +
      '<div class="cta-row">' + (st.saved ? '<button class="cta" type="button" data-do="resume">Continue</button><button class="cta ghost" type="button" data-do="begin">Start over</button>' : '<button class="cta" type="button" data-do="begin">Begin</button>') + bookBtn() + '</div>' +
      '<p class="note">For adult readers. This story contains violence, a suicide attempt, sexual content, and racial violence. Your choices are saved on this device. Press Listen at the top to hear each scene read aloud, with soft music beneath it. Headphones recommended.</p></div></div>';
    attachMedia();
  }

  function enterScene(id) { st.id = id; var n = STORY[id]; if (n.enter) n.enter(st.s); }
  function ensureAudio() { ASAudio.init(); if (st.id) ASAudio.setBeds(STORY[st.id].amb || []); }
  function begin() { st = { id: null, s: fresh(), hist: [], log: {}, saved: null }; lastId = null; enterScene('prologue'); render(true, true); }
  function resume() { var d = st.saved; st = { id: d.id, s: d.s, hist: d.hist || [], log: d.log || {}, saved: null }; lastId = null; render(true, true); }
  function back() { if (!st.hist.length) return; var p = st.hist.pop(); delete st.log[p.id]; st.id = p.id; st.s = p.s; lastId = null; render(true, true); }
  function choose(i) {
    var n = STORY[st.id], c = n.choices[i], prev = st.id; if (!c) return;
    st.hist.push({ id: st.id, s: clone(st.s) }); if (c.fx) c.fx(st.s);
    if (c.to !== st.id) st.log[st.id] = c.label; enterScene(c.to);
    render(c.to !== prev, true);
  }

  // ---------- listen ----------
  function stopListen(keepFlag) { clearTimeout(autoTimer); runTok++; ASAudio.stopSpeech(); if (!keepFlag) { listening = false; } updateBtns(); }
  function listen() {
    var items = view._items; if (!items || !ASAudio.hasVoices()) return; var my = ++runTok, ps = view.querySelectorAll('.prose p'), single = view._single;
    view.classList.add('reading');
    var spoken = speakItems(items);
    ASAudio.speakSeq(spoken, function (i) {
      var pi = spoken[i] ? spoken[i].p : -1;
      Array.prototype.forEach.call(ps, function (p, k) { p.classList.toggle('now', k === pi); });
      if (ps[pi] && textOn) ps[pi].scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, function () {
      if (my !== runTok) return; view.classList.remove('reading'); Array.prototype.forEach.call(ps, function (p) { p.classList.remove('now'); });
      if (listening && single >= 0) autoTimer = setTimeout(function () { if (my === runTok && listening) choose(single); }, 1600);
    });
  }
  function setListening(on) {
    listening = on; updateBtns();
    if (on) { ensureAudio(); if (st.id && !STORY[st.id].endAct) listen(); } else { stopListen(true); view.classList.remove('reading', 'hide-text'); }
  }
  function updateBtns() {
    var b = $('btn-listen'); b.textContent = listening ? 'Stop' : 'Listen'; b.classList.toggle('on', listening); b.setAttribute('aria-pressed', listening);
    var t = $('btn-text'); t.textContent = 'Text: ' + (textOn ? 'On' : 'Off'); t.classList.toggle('on', textOn);
    view.classList.toggle('hide-text', !textOn && listening);
  }

  // ---------- panel ----------
  function opt(v, cur) { return '<option value="' + esc(v.name) + '"' + (v.name === cur ? ' selected' : '') + '>' + esc(v.name) + '</option>'; }
  function sel(id, label, voices, cur, sample) {
    return '<label class="vrow" for="' + id + '"><span>' + label + '</span><select id="' + id + '"><option value="">Automatic (best available)</option>' + voices.map(function (v) { return opt(v, cur); }).join('') + '</select><button class="tool" type="button" data-do="' + sample + '">Hear it</button></label>';
  }
  function openMap() {
    var s = st.s || fresh(), p = ASAudio.pref(), h = '<div class="panel-head"><h2>Case Board</h2><button class="tool" type="button" data-do="close">Close</button></div>';
    h += '<div><p class="sub">Trust</p><div class="meters">' + Object.keys(TRUST).map(function (k) { var v = s.trust[k], pct = Math.max(0, Math.min(100, 30 + v * 14)); return '<div><div class="meter-name"><span>' + TRUST[k] + '</span><span>' + (v > 0 ? '+' : '') + v + '</span></div><div class="track"><i style="width:' + pct + '%"></i></div></div>'; }).join('') + '</div></div>';
    h += '<div><p class="sub">Clues</p><ul class="clues">' + Object.keys(CLUES).map(function (k) { var g = s.clues[k]; return '<li class="' + (g ? 'got' : '') + '"><span class="n">' + (g ? esc(CLUES[k][0]) : 'Undiscovered') + '</span>' + (g ? '<span class="t">' + esc(CLUES[k][1]) + '</span>' : '') + '</li>'; }).join('') + '</ul></div>';
    var log = Object.keys(st.log || {}); if (log.length) h += '<div><p class="sub">Your choices</p><ul class="dec">' + log.map(function (k) { return '<li><span class="q">' + esc(STORY[k].title) + '</span>' + fmt(st.log[k]) + '</li>'; }).join('') + '</ul></div>';
    if (ASAudio.hasVoices()) {
      h += '<div><p class="sub">Voices for Listen</p><div class="voices">' + sel('v-narr', 'Narrator', ASAudio.voices('f'), p.narr, 'sample-narr') + sel('v-aud', 'Audra\u2019s own lines', ASAudio.voices('f'), p.aud, 'sample-aud') + sel('v-f', 'Women in scenes', ASAudio.voices('f'), p.f, 'sample-f') + sel('v-m', 'Men in scenes', ASAudio.voices('m'), p.m, 'sample-m') +
        '<label class="vrow" for="v-rate"><span>Reading speed</span><select id="v-rate">' + [[0.85, 'Slower'], [1, 'Normal'], [1.15, 'Faster'], [1.3, 'Fast']].map(function (r) { return '<option value="' + r[0] + '"' + (r[0] === p.rate ? ' selected' : '') + '>' + r[1] + '</option>'; }).join('') + '</select><button class="tool" type="button" data-do="sample-narr">Hear it</button></label></div><p class="vnote">These voices come from your own phone or computer. The ones marked Natural, Enhanced or Premium sound the most human.</p></div>';
    }
    $('panel-in').innerHTML = h; $('panel').hidden = false; $('panel').scrollTop = 0;
  }

  // ---------- wiring ----------
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button, a'); if (!b) return;
    var act = b.dataset.do;
    if (b.classList.contains('choice')) { ASAudio.init(); choose(+b.dataset.i); return; }
    if (act === 'begin') { ASAudio.init(); begin(); }
    else if (act === 'resume') { ASAudio.init(); resume(); }
    else if (act === 'again') { st.saved = null; begin(); }
    else if (act === 'back') back();
    else if (act === 'map') openMap();
    else if (act === 'close') $('panel').hidden = true;
    else if (act === 'sample-narr') ASAudio.speakSample({ narr: true, g: 'f', rank: 1, pitch: 0.9, rate: 0.94 });
    else if (act === 'sample-aud') ASAudio.speakSample({ aud: true, g: 'f', rank: 0 });
    else if (act === 'sample-f') ASAudio.speakSample({ g: 'f', rank: 2 });
    else if (act === 'sample-m') ASAudio.speakSample({ g: 'm' });
  });
  $('btn-back').onclick = back; $('btn-map').onclick = openMap;
  $('btn-listen').onclick = function () { setListening(!listening); };
  $('btn-text').onclick = function () { textOn = !textOn; if (!textOn && !listening) setListening(true); else updateBtns(); };
  $('btn-sound').onclick = function () { ensureAudio(); soundOn = !soundOn; ASAudio.setEnabled(soundOn); this.textContent = 'Music: ' + (soundOn ? 'On' : 'Off'); this.classList.toggle('on', soundOn); };
  $('btn-shield').onclick = function () { if (!st.s) return; st.s.shield = !st.s.shield; syncShield(); toast('Specter shield ' + (st.s.shield ? 'on' : 'off')); save(); };
  document.addEventListener('change', function (e) {
    var id = e.target.id; if (id === 'v-narr') ASAudio.setPref('narr', e.target.value); else if (id === 'v-aud') ASAudio.setPref('aud', e.target.value); else if (id === 'v-f') ASAudio.setPref('f', e.target.value); else if (id === 'v-m') ASAudio.setPref('m', e.target.value); else if (id === 'v-rate') ASAudio.setPref('rate', +e.target.value);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('panel').hidden = true; });

  if (!ASAudio.hasVoices()) { $('btn-listen').hidden = true; $('btn-text').hidden = true; } else $('btn-listen').hidden = false;
  st.saved = load(); soundOn = true; $('btn-sound').classList.add('on'); updateBtns(); cover();
})();
