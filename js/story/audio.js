// Generated ambience and stingers (Web Audio, no files) plus browser text-to-speech.
window.ASAudio = (function () {
  var ctx, master, enabled = true, active = {}, noiseCache = {};

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
  function osc(type, f) { var o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.start(); return o; }

  // ---------- music: a soft drifting pad, sparse music-box notes, long echo ----------
  var rev = null, revIn = null;
  function reverb() {
    if (rev) return revIn;
    var len = ctx.sampleRate * 3.6, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) { var d = buf.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    rev = ctx.createConvolver(); rev.buffer = buf; revIn = ctx.createGain(); revIn.gain.value = 1;
    var wet = ctx.createGain(); wet.gain.value = 0.7; revIn.connect(rev); rev.connect(wet); wet.connect(master);
    return revIn;
  }
  var MOODS = {
    night: { pad: 110,  bell: 440,   scale: [0, 2, 3, 5, 7, 8, 10], chords: [[0, 7, 14, 15], [-4, 3, 7, 14], [3, 7, 10, 14], [5, 8, 12, 19]], chordSec: 11, tick: 0.9,  density: 0.42, bright: 800 },
    day:   { pad: 146.8, bell: 587.3, scale: [0, 2, 3, 5, 7, 9, 10], chords: [[0, 7, 10, 14], [-4, 0, 3, 7], [-7, -4, 0, 3], [-5, 2, 5, 7]],     chordSec: 10, tick: 0.8,  density: 0.5,  bright: 950 },
    warm:  { pad: 87.3,  bell: 523.3, scale: [0, 2, 4, 6, 7, 9, 11], chords: [[0, 4, 7, 11], [-3, 0, 4, 11], [2, 6, 9, 14]],                    chordSec: 9,  tick: 0.65, density: 0.6,  bright: 1200 },
    cold:  { pad: 82.4,  bell: 329.6, scale: [0, 1, 3, 5, 7, 8, 10], chords: [[0, 1, 6, 7], [-2, 0, 5, 6], [0, 6, 7, 13]],                      chordSec: 12, tick: 1.4,  density: 0.28, bright: 520 }
  };
  function moodFor(names) {
    if (names.indexOf('cold') > -1) return 'cold';
    if (names.indexOf('candle') > -1) return 'warm';
    if (names.indexOf('wind') > -1 || names.indexOf('crickets') > -1) return 'night';
    return 'day';
  }
  function makeMusic(mood, out) {
    var m = MOODS[mood], ci = 0, timers = [], dry = ctx.createGain(); dry.gain.value = 1; dry.connect(out);
    var send = ctx.createGain(); send.gain.value = 0.55; dry.connect(send); send.connect(reverb());
    var dl = ctx.createDelay(1.5), fb = ctx.createGain(), dlp = ctx.createBiquadFilter(), dg = ctx.createGain();
    dl.delayTime.value = 0.62; fb.gain.value = 0.38; dlp.type = 'lowpass'; dlp.frequency.value = 1800; dg.gain.value = 0.5;
    dry.connect(dl); dl.connect(dlp); dlp.connect(fb); fb.connect(dl); dlp.connect(dg); dg.connect(out); dg.connect(send);
    function hz(base, semi) { return base * Math.pow(2, semi / 12); }
    function pad() {
      var t = ctx.currentTime, chord = m.chords[ci++ % m.chords.length], dur = m.chordSec, lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = m.bright; lp.Q.value = 0.6; lp.connect(dry);
      chord.forEach(function (semi, i) {
        [-6, 6].forEach(function (cents) {
          var o = ctx.createOscillator(), g = ctx.createGain(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = hz(m.pad, semi); o.detune.value = cents;
          g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.028, t + 4); g.gain.setValueAtTime(0.028, t + dur - 1); g.gain.linearRampToValueAtTime(0.0001, t + dur + 5);
          o.connect(g); g.connect(lp); o.start(t); o.stop(t + dur + 5.5);
        });
      });
      var sub = ctx.createOscillator(), sg = ctx.createGain(); sub.type = 'sine'; sub.frequency.value = hz(m.pad / 2, chord[0]);
      sg.gain.setValueAtTime(0.0001, t); sg.gain.linearRampToValueAtTime(0.05, t + 5); sg.gain.linearRampToValueAtTime(0.0001, t + dur + 5); sub.connect(sg); sg.connect(dry); sub.start(t); sub.stop(t + dur + 5.5);
    }
    function bell() {
      if (Math.random() > m.density) return;
      var t = ctx.currentTime + 0.05, chord = m.chords[(ci - 1 + m.chords.length) % m.chords.length], semi;
      if (Math.random() < 0.55) semi = chord[Math.floor(Math.random() * chord.length)] % 12; else semi = m.scale[Math.floor(Math.random() * m.scale.length)];
      var f = hz(m.bell, semi + (Math.random() < 0.3 ? 12 : 0)), vel = 0.05 + Math.random() * 0.06, n = Math.random() < 0.3 ? 2 : 1;
      for (var k = 0; k < n; k++) {
        var tt = t + k * 0.42, ff = k ? hz(m.bell, m.scale[Math.floor(Math.random() * m.scale.length)]) : f;
        [[1, 1], [2.76, 0.18], [5.4, 0.06]].forEach(function (p) {
          var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = ff * p[0];
          g.gain.setValueAtTime(0.0001, tt); g.gain.exponentialRampToValueAtTime(vel * p[1], tt + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, tt + 3.2 / p[0] + 0.4);
          o.connect(g); g.connect(dry); o.start(tt); o.stop(tt + 4);
        });
      }
    }
    pad(); timers.push(setInterval(pad, m.chordSec * 1000)); timers.push(setInterval(bell, m.tick * 1000));
    setTimeout(bell, 1200);
    return function () { timers.forEach(clearInterval); setTimeout(function () { try { dry.disconnect(); dg.disconnect(); } catch (e) {} }, 9000); };
  }

  var curMood = null;
  function setBeds(names) { // scenes pass their old ambience names; they now choose the music mood
    if (!ctx) return; var mood = (names && names.length) ? moodFor(names) : null; if (mood === curMood) return; curMood = mood;
    Object.keys(active).forEach(function (k) {
      var a = active[k]; a.out.gain.cancelScheduledValues(ctx.currentTime); a.out.gain.setTargetAtTime(0, ctx.currentTime, 1.6);
      setTimeout(function () { try { a.stop(); a.out.disconnect(); } catch (e) {} }, 9000); delete active[k];
    });
    if (!mood) return;
    var out = ctx.createGain(); out.gain.value = 0; out.connect(master); out.gain.setTargetAtTime(1, ctx.currentTime, 1.4);
    active[mood] = { out: out, stop: makeMusic(mood, out) };
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
  var voiceList = [], run = 0, pref = { narr: '', aud: '', f: '', m: '', rate: 1.0 };
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
    who = who || {}; var g = who.g || 'f', want = who.narr ? pref.narr : who.aud ? pref.aud : pref[g], v = findByName(want), pitch = who.pitch || 1, rate = (who.rate || 1) * pref.rate;
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
  function loadPref() { try { var d = JSON.parse(localStorage.getItem('as-voices') || '{}'); pref = { narr: d.narr || '', aud: d.aud || '', f: d.f || '', m: d.m || '', rate: +d.rate || 1.0 }; } catch (e) {} }
  function savePref() { try { localStorage.setItem('as-voices', JSON.stringify(pref)); } catch (e) {} }
  loadPref();

  return {
    init: init, debug: function () { return { ctx: ctx, master: master }; }, setBeds: setBeds, sting: sting, setEnabled: setEnabled, isEnabled: function () { return enabled; },
    speakSeq: speakSeq, stopSpeech: stopSpeech, hasVoices: function () { return !!window.speechSynthesis; },
    voices: function (g) { if (!voiceList.length) loadVoices(); return ranked(g); }, pref: function () { return pref; },
    setPref: function (k, v) { pref[k] = v; savePref(); }, speakSample: function (who) { speakSeq([{ text: 'Half past noon on a Monday, and the air conditioner is off.', who: who }]); }
  };
})();
