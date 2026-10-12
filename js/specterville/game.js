/* SPECTERVILLE engine: title hub, seven days, a town map with a clock, scenes with choices, set-piece events,
   the Case Board, a final accusation, saved progress. All content lives in data.js and days/*.js. */
(function () {
  var D = window.SV, SAVE = 'specterville-v2', BOOK_URL = 'https://www.amazon.com/dp/B09CLJ7HBB';
  var $ = function (id) { return document.getElementById(id); };
  var view = $('view'), st = { v: 'title', s: null, shown: null, ev: null, evStage: 0, acc: null, endPage: 0, board: { pick: [] } };

  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var fmt = function (t) { return esc(t).replace(/\*([^*]+)\*/g, '<em>$1</em>'); };
  var val = function (v, s) { return typeof v === 'function' ? v(s) : v; };
  var count = function (o) { return Object.keys(o).length; };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var LAST = D.DAYS.length - 1;

  var fresh = function () {
    return { day: 0, slot: 0, loc: D.DAYS[0].start, done: {}, picks: {}, clues: {}, theories: {}, unlocked: {}, evDone: {}, pendingEv: null, ending: false, final: false,
      trust: { ethan: 0, specters: 0, town: 0, cordero: 0 }, shield: true, visited: {}, wrong: 0, snap: null, ended: null };
  };
  var api = { clue: addClue };
  var day = function () { return D.DAYS[st.s.day]; };
  var places = function () { return day().places; };

  function save() { try { localStorage.setItem(SAVE, JSON.stringify(st.s)); } catch (e) {} }
  function load() { try { var o = JSON.parse(localStorage.getItem(SAVE)); return o && D.DAYS[o.day] && D.DAYS[o.day].places[o.loc] ? o : null; } catch (e) { return null; } }
  function wipe() { try { localStorage.removeItem(SAVE); } catch (e) {} }

  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(function () { t.classList.remove('show'); }, 2600); }
  function chime() { try { if (window.ASAudio && ASAudio.sting) ASAudio.sting('chime'); } catch (e) {} }
  function addClue(s, id) { if (!D.CLUES[id] || s.clues[id]) return; s.clues[id] = 1; chime(); toast('Clue added: ' + D.CLUES[id][0]); }

  function body(text) {
    return String(text).split(/\n\n+/).filter(function (p) { return p.trim(); }).map(function (p) {
      var m = p.trim().match(/^@(\w+)\s+([\s\S]*)$/), h = fmt(m ? m[2] : p.trim()).replace(/@(\w+)\s/g, function (_, k) { return '<br><b class="who">' + esc(D.WHO[k] || k) + '</b> '; });
      return m ? '<p><b class="who">' + esc(D.WHO[m[1]] || m[1]) + '</b> ' + h + '</p>' : '<p>' + h + '</p>';
    }).join('');
  }

  /* ---------- places & time ---------- */
  function unlockCheck() {
    var d = st.s.day, pl = places();
    Object.keys(pl).forEach(function (k) {
      var p = pl[k], key = d + ':' + k; if (!p.unlock || st.s.unlocked[key]) return;
      if (p.unlock(st.s)) { st.s.unlocked[key] = 1; toast('New place on the map: ' + p.name); }
    });
  }
  var open = function (k) { var p = places()[k]; return p && (!p.unlock || st.s.unlocked[st.s.day + ':' + k] || p.unlock(st.s)); };
  function clockText() { var d = day(); return 'Day ' + (st.s.day + 1) + ' · ' + d.label + ' · ' + d.slots[Math.min(st.s.slot, d.slots.length - 1)]; }
  function hasSpecter(p) { return p.actions.some(function (a) { return a.specter && (!a.show || a.show(st.s)); }); }
  function slotsLeft() { return day().slots.length - st.s.slot; }

  function travel(to) {
    if (to === st.s.loc || !open(to)) return;
    st.s.slot += 1; st.s.loc = to; st.s.visited[to] = 1; st.shown = null;
    unlockCheck();
    if (st.s.slot >= day().slots.length) { st.s.ending = true; }
    save(); proceed();
  }

  /* ---------- days, events ---------- */
  function startDay(i) {
    var s = st.s; s.day = i; s.slot = 0; s.loc = D.DAYS[i].start; s.visited = {}; s.visited[s.loc] = 1; s.ending = false; s.pendingEv = null; st.shown = null;
    var copy = clone(s); delete copy.snap; s.snap = JSON.stringify(copy);
    unlockCheck(); save(); st.v = 'dayintro'; render();
  }
  function nextEvent() {
    var s = st.s, evs = day().events || [];
    for (var i = 0; i < evs.length; i++) {
      var e = evs[i]; if (s.evDone[e.id]) continue;
      if (s.ending) return e;
      if (e.at === 'start') return e;
      if (typeof e.at === 'number' && s.slot >= e.at) return e;
    }
    return null;
  }
  function showEvent(e, replay) {
    var s = st.s; st.ev = e; st.evStage = s.picks['ev:' + e.id] != null ? 1 : 0; st.v = 'event';
    if (!replay) {
      s.evDone[e.id] = 1; s.pendingEv = e.id;
      if (e.loc && places()[e.loc]) { s.loc = e.loc; s.visited[e.loc] = 1; }
      if (e.fx) e.fx(s, api);
      [].concat(e.clue || []).forEach(function (c) { addClue(s, c); });
      unlockCheck(); save();
    }
    render();
  }
  function proceed() {
    var e = nextEvent();
    if (e) return showEvent(e);
    if (st.s.ending) return finishDay();
    st.v = 'place'; render();
  }
  function finishDay() {
    var s = st.s; s.ending = false;
    if (st.s.day >= LAST) { s.final = true; save(); return startAccuse(); }
    st.v = day().night ? 'night' : 'next'; save();
    if (st.v === 'next') return startDay(s.day + 1);
    render();
  }

  /* ---------- actions ---------- */
  function findAction(pid, aid) { return places()[pid].actions.filter(function (x) { return x.id === aid; })[0]; }
  function runAction(pid, aid) {
    var s = st.s, a = findAction(pid, aid); if (!a) return;
    var why = a.lock && a.lock(s);
    if (why) { st.shown = { title: a.label, html: '<p class="locked">' + esc(why) + '</p>' }; return render(); }
    if (a.specter && s.shield) {
      if (!s.done['flare_' + aid]) { s.done['flare_' + aid] = 1; s.trust.specters -= 1; }
      st.shown = { title: a.label, html: '<p class="flare">' + esc(D.FLARE) + '</p>', hint: true }; save(); return render();
    }
    var first = !s.done[aid]; s.done[aid] = 1;
    if (first) { if (a.fx) a.fx(s, api); [].concat(a.clue || []).forEach(function (c) { addClue(s, c); }); }
    var html = body(val(a.text, s));
    if (a.choices && s.picks[aid] == null) st.shown = { title: a.label, html: html, choices: a.choices, aid: aid };
    else {
      if (a.choices) html += '<div class="reply">' + body(a.choices[s.picks[aid]].reply) + '</div>';
      st.shown = { title: a.label, html: html, accuse: !!a.accuse };
    }
    unlockCheck(); save(); render();
  }
  function choose(pid, aid, i) {
    var s = st.s, a = findAction(pid, aid), c = a.choices[i];
    s.picks[aid] = i; if (c.fx) c.fx(s, api);
    st.shown = { title: a.label, html: body(val(a.text, s)) + '<div class="reply">' + body(c.reply) + '</div>' };
    unlockCheck(); save(); render();
  }
  function chooseEvent(i) {
    var s = st.s, e = st.ev, c = e.choices[i]; s.picks['ev:' + e.id] = i; if (c.fx) c.fx(s, api); st.evStage = 1; save(); render();
  }
  function continueEvent() {
    var s = st.s; s.pendingEv = null; save(); proceed();
  }

  /* ---------- Case Board ---------- */
  function theoryFor(a, b) {
    return D.THEORIES.filter(function (t) { return t.pairs.some(function (p) { return (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a); }); })[0];
  }
  function pickClue(id) {
    var b = st.board, i = b.pick.indexOf(id);
    if (i >= 0) { b.pick.splice(i, 1); b.msg = ''; return renderBoard(); }
    b.pick.push(id); b.msg = '';
    if (b.pick.length === 2) {
      var t = theoryFor(b.pick[0], b.pick[1]);
      if (!t) b.msg = 'Those two do not add up to anything. Not yet.';
      else if (st.s.theories[t.id]) b.msg = 'You already worked that out: ' + t.title + '.';
      else { st.s.theories[t.id] = 1; chime(); b.msg = 'Theory: ' + t.title; save(); }
      b.pick = [];
    }
    renderBoard();
  }
  function renderBoard() {
    var s = st.s || fresh(), b = st.board, panel = $('panel'), keys = Object.keys(D.CLUES), got = keys.filter(function (k) { return s.clues[k]; });
    var h = '<div class="panel-head"><h2>Case Board</h2><button class="tool" type="button" data-do="close">Close</button></div>';
    h += '<p class="sub">Clues <span>' + got.length + ' found</span></p><p class="hint">Tap two clues that belong together to form a theory.</p>';
    h += '<ul class="clues">' + got.map(function (k) {
      return '<li><button type="button" class="clue' + (b.pick.indexOf(k) >= 0 ? ' pick' : '') + '" data-clue="' + k + '"><span class="n">' + esc(D.CLUES[k][0]) + '</span><span class="t">' + esc(D.CLUES[k][1]) + '</span></button></li>';
    }).join('') + (got.length === 0 ? '<li><div class="clue dim"><span class="n">Nothing yet.</span></div></li>' : '') + '</ul>';
    if (b.msg) h += '<p class="msg" role="status">' + esc(b.msg) + '</p>';
    h += '<p class="sub">Theories <span>' + count(s.theories) + ' / ' + D.THEORIES.length + '</span></p><ul class="theories">' + D.THEORIES.map(function (t) {
      return s.theories[t.id] ? '<li class="got"><span class="n">' + esc(t.title) + '</span><span class="t">' + esc(t.text) + '</span></li>' : '<li class="dim"><span class="n">? ? ?</span></li>';
    }).join('') + '</ul>';
    h += '<p class="sub">Trust</p><div class="trust">' + [['ethan', 'Ethan'], ['cordero', 'Cordero'], ['specters', 'The Specters'], ['town', 'The Town']].map(function (x) {
      var v = Math.max(-3, Math.min(3, s.trust[x[0]] || 0)); return '<div><span>' + x[1] + '</span><i><b style="left:' + ((v + 3) / 6 * 100) + '%"></b></i></div>';
    }).join('') + '</div>';
    $('panel-in').innerHTML = h; panel.hidden = false;
  }
  function closeBoard() { $('panel').hidden = true; st.board.pick = []; st.board.msg = ''; }

  /* ---------- the accusation ---------- */
  function startAccuse() { st.acc = { step: 'suspect', suspect: null, picks: [], msg: '' }; st.v = 'accuse'; render(); }
  function evaluateAccusation() {
    var s = st.s, a = st.acc, sus = D.SUSPECTS.filter(function (x) { return x.id === a.suspect; })[0], keys = a.picks.filter(function (c) { return D.KEY.indexOf(c) >= 0; }).length;
    if (sus.truth && keys >= 2) { s.ended = 'win'; s.final = false; st.endPage = 0; st.v = 'ending'; save(); return render(); }
    s.wrong += 1; save();
    if (s.wrong >= 2) { s.ended = 'lose'; st.endPage = 0; st.v = 'ending'; save(); return render(); }
    a.step = 'result'; a.result = sus.truth ? D.ENDING.weak : sus.why; a.resultTitle = sus.truth ? 'Right name, not enough proof' : 'The wrong name'; render();
  }
  function accuseView() {
    var s = st.s, a = st.acc, h;
    if (a.step === 'suspect') {
      h = '<div class="col fade"><p class="eyebrow">The jailhouse</p><h1 class="scene-title">Who killed them?</h1><p class="blurb">Three rooms. One killer. You get two chances' + (s.wrong ? ', and you have used one' : '') + '.</p><div class="acts">' +
        D.SUSPECTS.map(function (x) { return '<button class="act" type="button" data-sus="' + x.id + '"><b class="who">' + esc(x.name) + '</b><br>' + esc(x.blurb) + '</button>'; }).join('') + '</div></div>';
    } else if (a.step === 'evidence') {
      var owned = Object.keys(D.CLUES).filter(function (k) { return s.clues[k]; }), need = Math.min(3, owned.length);
      var sus = D.SUSPECTS.filter(function (x) { return x.id === a.suspect; })[0];
      h = '<div class="col fade"><p class="eyebrow">Your accusation</p><h1 class="scene-title">' + esc(sus.name) + '</h1><p class="blurb">What proves it? Choose ' + need + ' clue' + (need === 1 ? '' : 's') + ' from the case you have built.</p><ul class="clues">' +
        owned.map(function (k) { return '<li><button type="button" class="clue' + (a.picks.indexOf(k) >= 0 ? ' pick' : '') + '" data-ev="' + k + '"><span class="n">' + esc(D.CLUES[k][0]) + '</span><span class="t">' + esc(D.CLUES[k][1]) + '</span></button></li>'; }).join('') +
        '</ul><div class="cta-row"><button class="cta" type="button" data-do="accuse-go"' + (a.picks.length === need ? '' : ' disabled') + '>Make the accusation</button><button class="cta ghost" type="button" data-do="accuse-back">Name someone else</button></div></div>';
    } else {
      h = '<div class="col fade"><p class="eyebrow">The jailhouse</p><h1 class="scene-title">' + esc(a.resultTitle) + '</h1><div class="scene">' + body(a.result) + '</div><div class="cta-row"><button class="cta" type="button" data-do="accuse-back">Try again</button></div></div>';
    }
    view.innerHTML = h;
  }
  function endingView() {
    var s = st.s, pages = D.ENDING[s.ended], p = pages[st.endPage], last = st.endPage >= pages.length - 1, h;
    h = '<div class="col fade"><p class="eyebrow">' + (s.ended === 'win' ? 'Case closed' : 'Case lost') + '</p><h1 class="scene-title">' + esc(p.title) + '</h1><div class="scene">' + body(val(p.text, s)) + '</div>';
    if (last) {
      h += '<div class="tally"><div><b>' + count(s.clues) + '</b><span>clues</span></div><div><b>' + count(s.theories) + ' / ' + D.THEORIES.length + '</b><span>theories</span></div><div><b>' + s.wrong + '</b><span>wrong names</span></div></div>';
      h += '<div class="cta-row">' + (s.ended === 'lose' ? '<button class="cta" type="button" data-do="retry">Try the final day again</button>' : '<button class="cta" type="button" data-do="board">Open the Case Board</button>') +
        '<button class="cta ghost" type="button" data-do="new">Play again</button><a class="cta ghost" href="' + BOOK_URL + '" target="_blank" rel="noopener">Read the full novel</a></div>';
    } else h += '<div class="cta-row"><button class="cta" type="button" data-do="next-page">Continue</button></div>';
    view.innerHTML = h + '</div>';
  }

  /* ---------- screens ---------- */
  function roads(keys) { // minimum spanning tree over the open places
    if (keys.length < 2) return '';
    var inT = {}, edges = [], first = keys[0]; inT[first] = 1;
    while (Object.keys(inT).length < keys.length) {
      var best = null;
      Object.keys(inT).forEach(function (a) { keys.forEach(function (b) {
        if (inT[b]) return; var dx = D.POS[a][0] - D.POS[b][0], dy = D.POS[a][1] - D.POS[b][1], d = dx * dx + dy * dy;
        if (!best || d < best.d) best = { a: a, b: b, d: d };
      }); });
      inT[best.b] = 1; edges.push(best);
    }
    return edges.map(function (e) { return 'M' + D.POS[e.a][0] + ' ' + D.POS[e.a][1] + ' L' + D.POS[e.b][0] + ' ' + D.POS[e.b][1]; }).join(' ');
  }
  function mapSvg(keys) {
    var trees = '';
    [[6, 12], [10, 40], [30, 30], [4, 66], [24, 86], [48, 76], [66, 70], [90, 56], [50, 22], [78, 8], [96, 78], [66, 24], [20, 48], [38, 60]].forEach(function (t) {
      trees += '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="2.2" fill="#16201a"/><circle cx="' + (t[0] + 1.7) + '" cy="' + (t[1] + 1) + '" r="1.7" fill="#1a271f"/>';
    });
    var r = roads(keys);
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><radialGradient id="g" cx="50%" cy="50%" r="75%"><stop offset="0" stop-color="#2a1d14"/><stop offset="1" stop-color="#0b0908"/></radialGradient></defs>' +
      '<rect width="100" height="100" fill="url(#g)"/>' + trees +
      '<path d="' + r + '" fill="none" stroke="#3a2c20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="' + r + '" fill="none" stroke="#5a4532" stroke-width=".4" stroke-dasharray="1.5 2" stroke-linecap="round"/></svg>';
  }
  function bar() {
    var s = st.s, playing = s && st.v !== 'title';
    $('clock').textContent = playing ? clockText() : '';
    var sh = $('btn-shield'); sh.hidden = !playing; sh.textContent = 'Shield: ' + (s && s.shield ? 'On' : 'Off'); sh.classList.toggle('on', !!(s && s.shield));
    $('btn-board').hidden = !playing; $('btn-menu').hidden = st.v === 'title';
  }

  function titleView() {
    var saved = load(), sd = saved && D.DAYS[saved.day];
    view.innerHTML = '<div class="col title fade"><p class="eyebrow">Based on the American Specter series by Rasheedah Prioleau</p>' +
      '<h1 class="logo">Specterville</h1><p class="tag">In Specter, Georgia, the living and the dead walk the same streets. You are Special Agent Audra Wheeler.</p>' +
      '<div class="doors">' +
      '<div class="door open"><span class="meta">Book One</span><h2>The Seven Sisters</h2><p class="d">One week, one town, one killer. Walk the map, question the living and the dead, build your case, and name the killer.</p>' +
      '<div class="cta-row">' + (saved ? '<button class="cta" type="button" data-do="continue">Continue: Day ' + (saved.day + 1) + ', ' + esc(sd.title) + '</button><button class="cta ghost" type="button" data-do="new">Start over</button>' : '<button class="cta" type="button" data-do="new">Begin Case One</button>') + '</div></div>' +
      '<div class="door sealed"><span class="meta">Book Two</span><h2>The Winter Solstice</h2><p class="d">The door is sealed. Amanda Stuart is waiting on the other side.</p></div>' +
      '<div class="door sealed"><span class="meta">Book Three</span><h2>Restless Spirits</h2><p class="d">The door is sealed. All Hallows’ Eve is still coming.</p></div></div>' +
      '<div class="cta-row"><a class="cta ghost" href="experience.html">Read Act I of The Seven Sisters</a><a class="cta ghost" href="index.html">Back to the site</a></div></div>';
  }
  function dayIntroView() {
    var d = day();
    view.innerHTML = '<div class="col fade title"><p class="eyebrow">Day ' + (st.s.day + 1) + ' of ' + D.DAYS.length + ' · ' + esc(d.label) + '</p><h1 class="logo small">' + esc(d.title) + '</h1><div class="scene left">' + body(d.intro) + '</div><div class="cta-row"><button class="cta" type="button" data-do="begin">Begin the day</button></div></div>';
  }
  function nightView() {
    var d = day();
    view.innerHTML = '<div class="col fade"><p class="eyebrow">' + esc(d.label) + ' night</p><h1 class="scene-title">Night falls on Specter</h1><div class="scene">' + body(d.night) + '</div>' +
      '<div class="tally"><div><b>' + count(st.s.clues) + '</b><span>clues</span></div><div><b>' + count(st.s.theories) + ' / ' + D.THEORIES.length + '</b><span>theories</span></div></div>' +
      '<div class="cta-row"><button class="cta" type="button" data-do="nextday">On to Day ' + (st.s.day + 2) + '</button><button class="cta ghost" type="button" data-do="board">Open the Case Board</button></div></div>';
  }
  function eventView() {
    var e = st.ev, s = st.s, ch = e.choices, h = '<div class="col fade"><div class="eyebrow"><span>' + clockText() + '</span><span class="pov">Scene</span></div><h1 class="scene-title">' + esc(e.title) + '</h1><div class="scene">' + body(val(e.text, s));
    if (ch && st.evStage === 0) h += '</div><div class="choices">' + ch.map(function (c, i) { return '<button class="choice" type="button" data-evpick="' + i + '">' + fmt(c.label) + '</button>'; }).join('') + '</div></div>';
    else {
      if (ch) h += '<div class="reply">' + body(ch[s.picks['ev:' + e.id]].reply) + '</div>';
      if (e.after) h += '<div class="reply">' + body(e.after) + '</div>';
      h += '</div><div class="cta-row"><button class="cta" type="button" data-do="ev-continue">Continue</button></div></div>';
    }
    view.innerHTML = h;
  }

  function mapView() {
    var s = st.s, keys = Object.keys(places()).filter(open), pins = keys.map(function (k) {
      var p = places()[k], here = k === s.loc, pos = D.POS[k];
      return '<button class="pin' + (here ? ' here' : '') + (hasSpecter(p) ? ' spooky' : '') + (s.visited[k] || here ? ' seen' : '') + '" type="button" data-go="' + k + '" style="left:' + pos[0] + '%;top:' + pos[1] + '%"' + (here ? ' aria-current="true"' : '') + '><i></i><span>' + esc(p.name) + '</span></button>';
    }).join('');
    view.innerHTML = '<div class="col wide fade"><div class="eyebrow"><span>The town of Specter, Georgia</span></div>' +
      '<div class="map">' + mapSvg(keys) + '<div class="mist"></div>' + pins + '</div>' +
      '<p class="mapnote">You are at <b>' + esc(places()[s.loc].name) + '</b>. Each trip across town costs time, and you have <b>' + slotsLeft() + '</b> left in the day.</p>' +
      '<div class="cta-row"><button class="cta" type="button" data-do="place">Back to ' + esc(places()[s.loc].name) + '</button></div></div>';
  }

  function placeView() {
    var s = st.s, pid = s.loc, p = places()[pid], sh = st.shown;
    var acts = p.actions.filter(function (a) { return !a.show || a.show(s); }).map(function (a) {
      var locked = a.lock && a.lock(s), done = s.done[a.id];
      return '<button class="act' + (done ? ' done' : '') + (locked ? ' lk' : '') + (a.specter ? ' spec' : '') + '" type="button" data-act="' + a.id + '">' + (a.specter ? '<em class="tagline">specter</em>' : '') + esc(a.label) + (done ? '<span class="chk">seen</span>' : '') + '</button>';
    }).join('');
    var scene = '';
    if (sh) {
      scene = '<div class="scene fade" id="scene"><h3>' + esc(sh.title) + '</h3>' + sh.html;
      if (sh.hint) scene += '<div class="cta-row"><button class="cta" type="button" data-do="shield">Switch the shield off</button></div>';
      if (sh.accuse) scene += '<div class="cta-row"><button class="cta" type="button" data-do="accuse">Make your accusation</button></div>';
      if (sh.choices) scene += '<div class="choices">' + sh.choices.map(function (c, i) { return '<button class="choice" type="button" data-pick="' + i + '">' + fmt(c.label) + '</button>'; }).join('') + '</div>';
      scene += '</div>';
    }
    view.innerHTML = '<div class="col fade"><div class="eyebrow"><span>' + esc(clockText()) + '</span><span class="pov">Audra</span></div>' +
      '<h1 class="scene-title">' + esc(p.name) + '</h1><p class="blurb">' + fmt(p.blurb) + '</p>' + scene +
      '<p class="sub">What do you do?</p><div class="acts">' + acts + '</div>' +
      '<div class="cta-row"><button class="cta" type="button" data-do="map">Leave. Open the map</button></div></div>';
    if (sh) { var sc = $('scene'); if (sc && sc.scrollIntoView) sc.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }

  function render() {
    bar();
    var v = st.v;
    if (v === 'title') titleView(); else if (v === 'dayintro') dayIntroView(); else if (v === 'night') nightView(); else if (v === 'event') eventView();
    else if (v === 'map') mapView(); else if (v === 'accuse') accuseView(); else if (v === 'ending') endingView(); else placeView();
    if (!$('panel').hidden) renderBoard();
    var sc = view.parentNode; if (sc && sc.scrollTo && v !== 'place') sc.scrollTo(0, 0);
  }

  /* ---------- input ---------- */
  function startNew() { wipe(); st.s = fresh(); st.shown = null; startDay(0); }
  function resume() {
    st.s = load(); var s = st.s; st.shown = null;
    if (s.ended) { st.endPage = 0; st.v = 'ending'; return render(); }
    if (s.final) return startAccuse();
    if (s.pendingEv) { var e = (day().events || []).filter(function (x) { return x.id === s.pendingEv; })[0]; if (e) return showEvent(e, true); }
    st.v = 'place'; render();
  }
  function retry() {
    var snap = st.s.snap; if (!snap) return startNew();
    st.s = JSON.parse(snap); st.s.snap = snap; st.s.wrong = 0; st.s.ended = null; st.s.final = false; st.v = 'dayintro'; save(); render();
  }
  function toggleShield() { st.s.shield = !st.s.shield; toast('Specter shield ' + (st.s.shield ? 'on. Specters cannot come near you.' : 'off. Specters can approach, and speak.')); save(); if (st.shown && st.shown.hint && !st.s.shield) st.shown = null; render(); }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('button,a') : null; if (!t || t.disabled) return;
    var d = t.getAttribute('data-do'), g = t.getAttribute('data-go'), a = t.getAttribute('data-act'), pk = t.getAttribute('data-pick'), cl = t.getAttribute('data-clue'),
      sus = t.getAttribute('data-sus'), ev = t.getAttribute('data-ev'), ep = t.getAttribute('data-evpick');
    if (t.id === 'btn-shield') return toggleShield();
    if (t.id === 'btn-board') return renderBoard();
    if (t.id === 'btn-menu') { st.v = 'title'; closeBoard(); return render(); }
    if (cl) return pickClue(cl);
    if (g) return travel(g);
    if (a) return runAction(st.s.loc, a);
    if (ep != null) return chooseEvent(+ep);
    if (sus) { st.acc.suspect = sus; st.acc.picks = []; st.acc.step = 'evidence'; return render(); }
    if (ev) { var p = st.acc.picks, i = p.indexOf(ev), need = Math.min(3, Object.keys(D.CLUES).filter(function (k) { return st.s.clues[k]; }).length); if (i >= 0) p.splice(i, 1); else if (p.length < need) p.push(ev); return render(); }
    if (pk != null && st.shown && st.shown.aid) return choose(st.s.loc, st.shown.aid, +pk);
    if (!d) return;
    if (d === 'new') return startNew();
    if (d === 'continue') return resume();
    if (d === 'begin') { st.v = 'place'; return proceed(); }
    if (d === 'map') { st.v = 'map'; return render(); }
    if (d === 'place') { st.v = 'place'; return render(); }
    if (d === 'board') return renderBoard();
    if (d === 'close') return closeBoard();
    if (d === 'shield') return toggleShield();
    if (d === 'ev-continue') return continueEvent();
    if (d === 'nextday') return startDay(st.s.day + 1);
    if (d === 'accuse') return startAccuse();
    if (d === 'accuse-go') return evaluateAccusation();
    if (d === 'accuse-back') { st.acc = { step: 'suspect', suspect: null, picks: [] }; return render(); }
    if (d === 'next-page') { st.endPage += 1; return render(); }
    if (d === 'retry') return retry();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('panel').hidden) closeBoard(); });

  render();
})();
