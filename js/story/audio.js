// Generated ambience and stingers (Web Audio, no files) plus browser text-to-speech.
window.ASAudio = (function () {
  var ctx, master, enabled = true, beds = {}, active = {}, noiseCache = {};

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = enabled ? 0.85 : 0; master.connect(ctx.destination);
    } catch (e) { ctx = null; }
  }

  function noise(kind) {
    if (noiseCache[kind]) return noiseCache[kind];
    var len = ctx.sampleRate * 3, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), last = 0, b0 = 0, b1 = 0, b2 = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      else if (kind === 'pink') { b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.05; d[i] = (b0 + b1 + b2 + w * 0.184) * 0.2; }
      else d[i] = w;
    }
    return (noiseCache[kind] = buf);
  }
  function src(kind) { var s = ctx.createBufferSource(); s.buffer = noise(kind); s.loop = true; s.start(); return s; }
  function osc(type, f) { var o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.start(); return o; }
  function lfo(freq, depth, target) { var o = osc('sine', freq), g = ctx.createGain(); g.gain.value = depth; o.connect(g); g.connect(target); return o; }

  // each bed builds nodes into `out` and returns a stop() cleanup
  var defs = {
    cicada: function (out) {
      var n = src('white'), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = 9;
      var am = ctx.createGain(); am.gain.value = 0.05; lfo(32, 0.04, am.gain); lfo(0.12, 0.03, am.gain);
      n.connect(bp); bp.connect(am); am.connect(out); return function () { n.stop(); };
    },
    crickets: function (out) {
      var n = src('white'), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3600; bp.Q.value = 14;
      var am = ctx.createGain(); am.gain.value = 0.035; lfo(7, 0.03, am.gain); lfo(0.08, 0.02, am.gain);
      n.connect(bp); bp.connect(am); am.connect(out); return function () { n.stop(); };
    },
    hum: function (out) {
      var a = osc('sine', 60), b = osc('sine', 120), n = src('brown'), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220;
      var g = ctx.createGain(); g.gain.value = 0.07; a.connect(g); b.connect(g); n.connect(lp); lp.connect(g); g.connect(out);
      return function () { a.stop(); b.stop(); n.stop(); };
    },
    rain: function (out) {
      var n = src('pink'), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 700;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7000; var g = ctx.createGain(); g.gain.value = 0.28;
      n.connect(hp); hp.connect(lp); lp.connect(g); g.connect(out); return function () { n.stop(); };
    },
    wind: function (out) {
      var n = src('pink'), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = 1.2;
      lfo(0.07, 260, bp.frequency); var g = ctx.createGain(); g.gain.value = 0.22; n.connect(bp); bp.connect(g); g.connect(out);
      return function () { n.stop(); };
    },
    cold: function (out) { // the Cold Air: thin, dry, low
      var a = osc('sawtooth', 55), b = osc('sawtooth', 55.8), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 170; lp.Q.value = 7;
      var g = ctx.createGain(); g.gain.value = 0.2; lfo(0.18, 0.08, g.gain);
      var n = src('white'), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6500; var hg = ctx.createGain(); hg.gain.value = 0.015;
      a.connect(lp); b.connect(lp); lp.connect(g); g.connect(out); n.connect(hp); hp.connect(hg); hg.connect(out);
      return function () { a.stop(); b.stop(); n.stop(); };
    },
    murmur: function (out) { // diner / crowd
      var n = src('pink'), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8;
      var g = ctx.createGain(); g.gain.value = 0.09; lfo(0.4, 0.04, g.gain); n.connect(bp); bp.connect(g); g.connect(out); return function () { n.stop(); };
    },
    candle: function (out) { // soft crackle
      var timer = setInterval(function () {
        if (!ctx) return; var t = ctx.currentTime, n = ctx.createBufferSource(); n.buffer = noise('white');
        var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3500; var g = ctx.createGain();
        g.gain.setValueAtTime(0.05 + Math.random() * 0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03 + Math.random() * 0.04);
        n.connect(hp); hp.connect(g); g.connect(out); n.start(t, Math.random() * 2, 0.1);
      }, 260);
      return function () { clearInterval(timer); };
    },
    heartbeat: function (out) {
      var timer = setInterval(function () {
        var t = ctx.currentTime;
        [0, 0.28].forEach(function (off, i) {
          var o = osc('sine', 52), g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t + off); g.gain.exponentialRampToValueAtTime(i ? 0.25 : 0.4, t + off + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + off + 0.18);
          o.connect(g); g.connect(out); o.stop(t + off + 0.25);
        });
      }, 1000);
      return function () { clearInterval(timer); };
    }
  };

  function setBeds(names) {
    if (!ctx) return;
    Object.keys(active).forEach(function (k) {
      if (names.indexOf(k) === -1) {
        var a = active[k]; a.out.gain.cancelScheduledValues(ctx.currentTime); a.out.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
        setTimeout(function () { try { a.stop(); a.out.disconnect(); } catch (e) {} }, 3000); delete active[k];
      }
    });
    names.forEach(function (k) {
      if (active[k] || !defs[k]) return;
      var out = ctx.createGain(); out.gain.value = 0; out.connect(master);
      var stop = defs[k](out); out.gain.setTargetAtTime(1, ctx.currentTime, 0.9); active[k] = { out: out, stop: stop };
    });
  }

  function env(g, t, peak, a, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  var stings = {
    candle: function () { var t = ctx.currentTime, n = ctx.createBufferSource(); n.buffer = noise('white'); var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2; bp.frequency.setValueAtTime(400, t); bp.frequency.exponentialRampToValueAtTime(3200, t + 0.5); var g = ctx.createGain(); env(g, t, 0.35, 0.08, 0.6); n.connect(bp); bp.connect(g); g.connect(master); n.start(t, 0, 1); },
    phase: function () { var t = ctx.currentTime, o = osc('sine', 660), g = ctx.createGain(), d = ctx.createDelay(); d.delayTime.value = 0.22; var fb = ctx.createGain(); fb.gain.value = 0.5; o.frequency.exponentialRampToValueAtTime(1320, t + 0.8); env(g, t, 0.14, 0.2, 1.2); o.connect(g); g.connect(master); g.connect(d); d.connect(fb); fb.connect(d); d.connect(master); o.stop(t + 1.6); setTimeout(function () { try { d.disconnect(); } catch (e) {} }, 4000); },
    chime: function () { var t = ctx.currentTime;[784, 1175].forEach(function (f, i) { var o = osc('sine', f), g = ctx.createGain(); env(g, t + i * 0.12, 0.16, 0.01, 0.7); o.connect(g); g.connect(master); o.stop(t + 1.1); }); },
    cold: function () { var t = ctx.currentTime, o = osc('sawtooth', 70), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220; var g = ctx.createGain(); o.frequency.exponentialRampToValueAtTime(34, t + 1.6); env(g, t, 0.35, 0.05, 1.6); o.connect(lp); lp.connect(g); g.connect(master); o.stop(t + 2); },
    thud: function () { var t = ctx.currentTime, o = osc('sine', 90), g = ctx.createGain(); o.frequency.exponentialRampToValueAtTime(35, t + 0.3); env(g, t, 0.6, 0.01, 0.4); o.connect(g); g.connect(master); o.stop(t + 0.6); },
    knock: function () { var t = ctx.currentTime;[0, 0.22, 0.44].forEach(function (off) { var o = osc('triangle', 150), g = ctx.createGain(); o.frequency.exponentialRampToValueAtTime(70, t + off + 0.1); env(g, t + off, 0.5, 0.005, 0.12); o.connect(g); g.connect(master); o.stop(t + off + 0.2); }); },
    thunder: function () { var t = ctx.currentTime, n = ctx.createBufferSource(); n.buffer = noise('brown'); var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; var g = ctx.createGain(); env(g, t, 0.8, 0.3, 3); n.connect(lp); lp.connect(g); g.connect(master); n.start(t, 0, 4); }
  };
  function sting(name) { if (ctx && enabled && stings[name]) { try { stings[name](); } catch (e) {} } }

  function setEnabled(on) { enabled = on; if (master) master.gain.setTargetAtTime(on ? 0.85 : 0, ctx.currentTime, 0.2); }

  // ---------- voices (device text-to-speech, picked like a reader would) ----------
  var voiceList = [], run = 0, pref = { narr: '', f: '', m: '', rate: 1.0 };
  var FEM = /samantha|victoria|karen|moira|tessa|aria|jenny|zira|susan|hazel|ava|allison|joanna|female|serena|fiona|emma|libby|sonia|michelle|nicole|salli|kendra|ivy|amy|siri/i;
  var MALE = /daniel|alex|fred|david|mark|guy|george|male|tom|aaron|ryan|brian|davis|oliver|arthur|matthew|joey|justin|eric|christopher|gordon/i;
  function loadVoices() { if (window.speechSynthesis) { try { voiceList = speechSynthesis.getVoices().filter(function (v) { return /^en/i.test(v.lang); }); } catch (e) { voiceList = []; } } }
  if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function score(v) { return (/natural|neural|online/i.test(v.name) ? 6 : 0) + (/premium|enhanced/i.test(v.name) ? 5 : 0) + (/google|microsoft|apple|siri/i.test(v.name) ? 2 : 0) + (/en-US/i.test(v.lang) ? 1 : 0); }
  function ranked(gender) {
    var re = gender === 'm' ? MALE : gender === 'f' ? FEM : null;
    var pool = voiceList.filter(function (v) { return !re || re.test(v.name); });
    if (!pool.length && re) pool = voiceList.slice();
    return pool.sort(function (a, b) { return score(b) - score(a); });
  }
  function findByName(n) { return n && voiceList.filter(function (v) { return v.name === n; })[0]; }
  function resolve(who) {
    who = who || {}; var g = who.g || 'f', want = who.narr ? pref.narr : pref[g], v = findByName(want), pitch = who.pitch || 1, rate = (who.rate || 1) * pref.rate;
    if (!v) { var list = ranked(g); v = list[Math.min(who.rank || 0, list.length - 1)] || null; }
    if (g === 'm' && v && !MALE.test(v.name) && FEM.test(v.name)) pitch = Math.min(pitch, 0.6);
    return { voice: v, pitch: pitch, rate: rate };
  }
  function chunks(text) {
    var parts = text.match(/[^.!?\u2026]+[.!?\u2026]+["\u201d\u2019)]*\s*|[^.!?\u2026]+$/g) || [text], out = [], cur = '';
    parts.forEach(function (p) { if ((cur + p).length > 230 && cur) { out.push(cur); cur = p; } else cur += p; });
    if (cur) out.push(cur); return out;
  }
  function stopSpeech() { run++; if (window.speechSynthesis) { try { speechSynthesis.cancel(); } catch (e) {} } }
  // items: [{text, who}] read in order; onItem(i) fires as each begins; onDone() when all finish
  function speakSeq(items, onItem, onDone) {
    stopSpeech(); var my = run, i = 0;
    if (!window.speechSynthesis || !items.length) { if (onDone) onDone(); return false; }
    function nextItem() {
      if (my !== run) return; if (i >= items.length) { if (onDone) onDone(); return; }
      var it = items[i], cs = chunks(it.text.replace(/[*\u2192]/g, '')), k = 0, cfg = resolve(it.who); if (onItem) onItem(i); i++;
      (function nextChunk() {
        if (my !== run) return; if (k >= cs.length) return nextItem();
        var u = new SpeechSynthesisUtterance(cs[k++]); if (cfg.voice) { u.voice = cfg.voice; u.lang = cfg.voice.lang; } else u.lang = 'en-US';
        u.pitch = cfg.pitch; u.rate = cfg.rate; u.onend = u.onerror = nextChunk; speechSynthesis.speak(u);
      })();
    }
    nextItem(); return true;
  }
  function loadPref() { try { var d = JSON.parse(localStorage.getItem('as-voices') || '{}'); pref = { narr: d.narr || '', f: d.f || '', m: d.m || '', rate: +d.rate || 1.0 }; } catch (e) {} }
  function savePref() { try { localStorage.setItem('as-voices', JSON.stringify(pref)); } catch (e) {} }
  loadPref();

  return {
    init: init, setBeds: setBeds, sting: sting, setEnabled: setEnabled, isEnabled: function () { return enabled; },
    speakSeq: speakSeq, stopSpeech: stopSpeech, hasVoices: function () { return !!window.speechSynthesis; },
    voices: function (g) { if (!voiceList.length) loadVoices(); return ranked(g); }, pref: function () { return pref; },
    setPref: function (k, v) { pref[k] = v; savePref(); }, speakSample: function (who) { speakSeq([{ text: 'Half past noon on a Monday, and the air conditioner is off.', who: who }]); }
  };
})();
