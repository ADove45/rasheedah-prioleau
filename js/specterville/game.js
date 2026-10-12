/* SPECTERVILLE engine: title hub, town map with a clock, scenes with choices, Case Board with theories, saved progress.
   All content lives in data.js. */
(function () {
  var D = window.SV, SAVE = 'specterville-v1', BOOK_URL = 'https://www.amazon.com/dp/B09CLJ7HBB';
  var $ = function (id) { return document.getElementById(id); };
  var view = $('view'), st = { v: 'title', s: null, shown: null, board: { pick: [] } };

  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var fmt = function (t) { return esc(t).replace(/\*([^*]+)\*/g, '<em>$1</em>'); };
  var val = function (v, s) { return typeof v === 'function' ? v(s) : v; };
  var count = function (o) { return Object.keys(o).length; };

  var fresh = function () { return { slot: 0, loc: D.START, done: {}, picks: {}, clues: {}, theories: {}, unlocked: {}, trust: { ethan: 0, specters: 0, town: 0 }, shield: true, visited: {} }; };
  var api = { clue: addClue };

  function save() { try { localStorage.setItem(SAVE, JSON.stringify(st.s)); } catch (e) {} }
  function load() { try { var o = JSON.parse(localStorage.getItem(SAVE)); return o && o.loc && D.PLACES[o.loc] ? o : null; } catch (e) { return null; } }
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
    Object.keys(D.PLACES).forEach(function (k) {
      var p = D.PLACES[k]; if (!p.unlock || st.s.unlocked[k]) return;
      if (p.unlock(st.s)) { st.s.unlocked[k] = 1; toast('New place on the map: ' + p.name); }
    });
  }
  var open = function (k) { var p = D.PLACES[k]; return p && (!p.unlock || st.s.unlocked[k] || p.unlock(st.s)); };
  function clockText() { return D.SLOTS[Math.min(st.s.slot, D.SLOTS.length - 1)] + ', Monday'; }
  function hasSpecter(p) { return p.actions.some(function (a) { return a.specter; }); }

  function travel(to) {
    if (to === st.s.loc || !open(to)) return;
    st.s.slot += 1; st.s.loc = to; st.s.visited[to] = 1; st.shown = null;
    if (to === 'bnb' && st.s.slot >= 5 && !st.s.done.knock) toast('Someone is pounding on your door.');
    unlockCheck(); save();
    if (st.s.slot >= D.SLOTS.length) { st.v = 'end'; } else st.v = 'place';
    render();
  }

  /* ---------- actions ---------- */
  function runAction(pid, aid) {
    var s = st.s, a = D.PLACES[pid].actions.filter(function (x) { return x.id === aid; })[0]; if (!a) return;
    var why = a.lock && a.lock(s);
    if (why) { st.shown = { title: a.label, html: '<p class="locked">' + esc(why) + '</p>' }; return render(); }
    if (a.specter && s.shield) {
      if (!s.done['flare_' + aid]) { s.done['flare_' + aid] = 1; s.trust.specters -= 1; }
      st.shown = { title: a.label, html: '<p class="flare">' + esc(D.FLARE) + '</p>', hint: true }; save(); return render();
    }
    var first = !s.done[aid]; s.done[aid] = 1;
    if (first) { if (a.fx) a.fx(s, api); [].concat(a.clue || []).forEach(function (c) { addClue(s, c); }); }
    var html = body(val(a.text, s));
    if (a.choices && s.picks[aid] == null) {
      st.shown = { title: a.label, html: html, choices: a.choices, aid: aid };
    } else {
      if (a.choices) html += '<div class="reply">' + body(a.choices[s.picks[aid]].reply) + '</div>';
      st.shown = { title: a.label, html: html };
    }
    unlockCheck(); save(); render();
  }
  function choose(pid, aid, i) {
    var s = st.s, a = D.PLACES[pid].actions.filter(function (x) { return x.id === aid; })[0], c = a.choices[i];
    s.picks[aid] = i; if (c.fx) c.fx(s, api);
    st.shown = { title: a.label, html: body(val(a.text, s)) + '<div class="reply">' + body(c.reply) + '</div>' };
    unlockCheck(); save(); render();
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
    var s = st.s || fresh(), b = st.board, panel = $('panel'), got = Object.keys(D.CLUES).filter(function (k) { return s.clues[k]; });
    var h = '<div class="panel-head"><h2>Case Board</h2><button class="tool" type="button" data-do="close">Close</button></div>';
    h += '<p class="sub">Clues <span>' + got.length + ' / ' + count(D.CLUES) + '</span></p><p class="hint">Tap two clues that belong together to form a theory.</p>';
    h += '<ul class="clues">' + Object.keys(D.CLUES).map(function (k) {
      return s.clues[k] ? '<li><button type="button" class="clue' + (b.pick.indexOf(k) >= 0 ? ' pick' : '') + '" data-clue="' + k + '"><span class="n">' + esc(D.CLUES[k][0]) + '</span><span class="t">' + esc(D.CLUES[k][1]) + '</span></button></li>'
        : '<li><div class="clue dim"><span class="n">Undiscovered</span></div></li>';
    }).join('') + '</ul>';
    if (b.msg) h += '<p class="msg" role="status">' + esc(b.msg) + '</p>';
    h += '<p class="sub">Theories <span>' + count(s.theories) + ' / ' + D.THEORIES.length + '</span></p><ul class="theories">' + D.THEORIES.map(function (t) {
      return s.theories[t.id] ? '<li class="got"><span class="n">' + esc(t.title) + '</span><span class="t">' + esc(t.text) + '</span></li>' : '<li class="dim"><span class="n">? ? ?</span></li>';
    }).join('') + '</ul>';
    h += '<p class="sub">Trust</p><div class="trust">' + [['ethan', 'Ethan'], ['specters', 'The Specters'], ['town', 'The Town']].map(function (x) {
      var v = Math.max(-3, Math.min(3, s.trust[x[0]])); return '<div><span>' + x[1] + '</span><i><b style="left:' + ((v + 3) / 6 * 100) + '%"></b></i></div>';
    }).join('') + '</div>';
    $('panel-in').innerHTML = h; panel.hidden = false;
  }
  function closeBoard() { $('panel').hidden = true; st.board.pick = []; st.board.msg = ''; }

  /* ---------- screens ---------- */
  var ROADS = 'M18 30 L44 18 L72 30 M18 30 L28 66 M44 18 L56 52 M72 30 L56 52 M28 66 L56 52 M56 52 L84 68 M72 30 L88 18 M84 68 L72 30';
  function mapSvg() {
    var trees = '';
    [[6, 12], [10, 52], [8, 82], [38, 84], [50, 88], [66, 86], [94, 44], [93, 88], [64, 8], [30, 38], [76, 52], [14, 70], [46, 38]].forEach(function (t) {
      trees += '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="2.4" fill="#16201a"/><circle cx="' + (t[0] + 1.8) + '" cy="' + (t[1] + 1) + '" r="1.8" fill="#1a271f"/>';
    });
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><radialGradient id="g" cx="50%" cy="50%" r="75%"><stop offset="0" stop-color="#2a1d14"/><stop offset="1" stop-color="#0b0908"/></radialGradient></defs>' +
      '<rect width="100" height="100" fill="url(#g)"/>' + trees +
      '<path d="' + ROADS + '" fill="none" stroke="#3a2c20" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="' + ROADS + '" fill="none" stroke="#5a4532" stroke-width=".4" stroke-dasharray="1.5 2" stroke-linecap="round"/>' +
      '<circle cx="56" cy="52" r="6" fill="#17110d" stroke="#5a4532" stroke-width=".4"/></svg>';
  }
  function bar() {
    var s = st.s;
    $('clock').textContent = s ? clockText() : '';
    var sh = $('btn-shield'); sh.hidden = !s; sh.textContent = 'Shield: ' + (s && s.shield ? 'On' : 'Off'); sh.classList.toggle('on', !!(s && s.shield));
    $('btn-board').hidden = !s; $('btn-menu').hidden = st.v === 'title';
  }

  function titleView() {
    var saved = load();
    view.innerHTML = '<div class="col title fade"><p class="eyebrow">Based on the American Specter series by Rasheedah Prioleau</p>' +
      '<h1 class="logo">Specterville</h1><p class="tag">In Specter, Georgia, the living and the dead walk the same streets. You are Special Agent Audra Wheeler.</p>' +
      '<div class="doors">' +
      '<div class="door open"><span class="meta">Book One</span><h2>The Seven Sisters</h2><p class="d">Case One: <b>The Candle</b>. One day, one town, one killer. Walk the map, question the living and the dead, and build your case.</p>' +
      '<div class="cta-row">' + (saved ? '<button class="cta" type="button" data-do="continue">Continue the case</button><button class="cta ghost" type="button" data-do="new">Start over</button>' : '<button class="cta" type="button" data-do="new">Begin Case One</button>') + '</div></div>' +
      '<div class="door sealed"><span class="meta">Book Two</span><h2>The Winter Solstice</h2><p class="d">The door is sealed. Amanda Stuart is waiting on the other side.</p></div>' +
      '<div class="door sealed"><span class="meta">Book Three</span><h2>Restless Spirits</h2><p class="d">The door is sealed. All Hallows’ Eve is still coming.</p></div></div>' +
      '<div class="cta-row"><a class="cta ghost" href="experience.html">Read Act I of The Seven Sisters</a><a class="cta ghost" href="index.html">Back to the site</a></div></div>';
  }

  function mapView() {
    var s = st.s, pins = Object.keys(D.PLACES).filter(open).map(function (k) {
      var p = D.PLACES[k], here = k === s.loc;
      return '<button class="pin' + (here ? ' here' : '') + (hasSpecter(p) ? ' spooky' : '') + (s.visited[k] || here ? ' seen' : '') + '" type="button" data-go="' + k + '" style="left:' + p.x + '%;top:' + p.y + '%"' + (here ? ' aria-current="true"' : '') + '><i></i><span>' + esc(p.name) + '</span></button>';
    }).join('');
    view.innerHTML = '<div class="col wide fade"><div class="eyebrow"><span>The town of Specter, Georgia</span><span>' + clockText() + '</span></div>' +
      '<div class="map">' + mapSvg() + '<div class="mist"></div>' + pins + '</div>' +
      '<p class="mapnote">You are at <b>' + esc(D.PLACES[s.loc].name) + '</b>. Each trip across town costs an hour, and you have <b>' + (D.SLOTS.length - s.slot) + '</b> left before night.</p>' +
      '<div class="cta-row"><button class="cta" type="button" data-do="place">Back to ' + esc(D.PLACES[s.loc].name) + '</button></div></div>';
  }

  function placeView() {
    var s = st.s, pid = s.loc, p = D.PLACES[pid], sh = st.shown;
    var acts = p.actions.filter(function (a) { return !a.show || a.show(s); }).map(function (a) {
      var locked = a.lock && a.lock(s), done = s.done[a.id];
      return '<button class="act' + (done ? ' done' : '') + (locked ? ' lk' : '') + (a.specter ? ' spec' : '') + '" type="button" data-act="' + a.id + '">' + (a.specter ? '<em class="tagline">specter</em>' : '') + esc(a.label) + (done ? '<span class="chk">seen</span>' : '') + '</button>';
    }).join('');
    var scene = '';
    if (sh) {
      scene = '<div class="scene fade" id="scene"><h3>' + esc(sh.title) + '</h3>' + sh.html;
      if (sh.hint) scene += '<div class="cta-row"><button class="cta" type="button" data-do="shield">Switch the shield off</button></div>';
      if (sh.choices) scene += '<div class="choices">' + sh.choices.map(function (c, i) { return '<button class="choice" type="button" data-pick="' + i + '">' + fmt(c.label) + '</button>'; }).join('') + '</div>';
      scene += '</div>';
    }
    view.innerHTML = '<div class="col fade"><div class="eyebrow"><span>' + esc(clockText()) + '</span><span class="pov">Audra</span></div>' +
      '<h1 class="scene-title">' + esc(p.name) + '</h1><p class="blurb">' + fmt(p.blurb) + '</p>' + scene +
      '<p class="sub">What do you do?</p><div class="acts">' + acts + '</div>' +
      '<div class="cta-row"><button class="cta" type="button" data-do="map">Leave. Open the map</button></div></div>';
    if (sh) { var sc = $('scene'); if (sc && sc.scrollIntoView) sc.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }

  function endView() {
    var s = st.s, nc = count(s.clues), nt = count(s.theories);
    var verdict = nt >= D.THEORIES.length ? 'You have every thread in your hands.' : nt >= 3 ? 'You have the shape of something dangerous.' : 'You have more questions than answers, and that is where cases begin.';
    view.innerHTML = '<div class="col fade"><p class="eyebrow">Monday night</p><h1 class="scene-title">Night Falls on Specter</h1>' +
      '<p class="blurb">The last light goes out of the sky over the square. Somewhere a candle is being lit by someone who does not know what is coming. ' + verdict + '</p>' +
      '<div class="tally"><div><b>' + nc + ' / ' + count(D.CLUES) + '</b><span>clues</span></div><div><b>' + nt + ' / ' + D.THEORIES.length + '</b><span>theories</span></div></div>' +
      '<p class="blurb">This is the end of the first playable chapter. The rest of the case, and the truth behind it, is still being written.</p>' +
      '<div class="cta-row"><button class="cta" type="button" data-do="board">Open the Case Board</button><button class="cta ghost" type="button" data-do="new">Play again</button><a class="cta ghost" href="' + BOOK_URL + '" target="_blank" rel="noopener">Read the full novel</a></div></div>';
  }

  function render() {
    bar();
    if (st.v === 'title') titleView(); else if (st.v === 'map') mapView(); else if (st.v === 'end') endView(); else placeView();
    if (!$('panel').hidden) renderBoard();
    var sc = view.parentNode; if (sc && sc.scrollTo && st.v !== 'place') sc.scrollTo(0, 0);
  }

  /* ---------- input ---------- */
  function startNew() { wipe(); st.s = fresh(); st.s.visited[D.START] = 1; st.shown = null; st.v = 'place'; save(); render(); }
  function toggleShield() { st.s.shield = !st.s.shield; toast('Specter shield ' + (st.s.shield ? 'on. Specters cannot come near you.' : 'off. Specters can approach, and speak.')); save(); if (st.shown && st.shown.hint && !st.s.shield) st.shown = null; render(); }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('button,a') : null; if (!t) return;
    var d = t.getAttribute('data-do'), g = t.getAttribute('data-go'), a = t.getAttribute('data-act'), pk = t.getAttribute('data-pick'), cl = t.getAttribute('data-clue');
    if (t.id === 'btn-shield') return toggleShield();
    if (t.id === 'btn-board') return renderBoard();
    if (t.id === 'btn-menu') { st.v = 'title'; closeBoard(); return render(); }
    if (cl) return pickClue(cl);
    if (g) return travel(g);
    if (a) return runAction(st.s.loc, a);
    if (pk != null && st.shown && st.shown.aid) return choose(st.s.loc, st.shown.aid, +pk);
    if (!d) return;
    if (d === 'new') return startNew();
    if (d === 'continue') { st.s = load(); st.v = st.s.slot >= D.SLOTS.length ? 'end' : 'place'; st.shown = null; return render(); }
    if (d === 'map') { st.v = 'map'; return render(); }
    if (d === 'place') { st.v = 'place'; return render(); }
    if (d === 'board') return renderBoard();
    if (d === 'close') return closeBoard();
    if (d === 'shield') return toggleShield();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('panel').hidden) closeBoard(); });

  render();
})();
