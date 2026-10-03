// Procedural backdrops, particles and character silhouettes (no image files needed).
window.ASVisuals = (function () {
  var cv = document.getElementById('fx'), ctx = cv.getContext('2d');
  var stat = document.createElement('canvas'), sctx = stat.getContext('2d');
  var W = 0, H = 0, dpr = 1, bgName = 'bedroom_night', fxList = [], parts = [], flames = [], t0 = performance.now();

  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function grad(c, stops) { var g = c.createLinearGradient(0, 0, 0, H); stops.forEach(function (s, i) { g.addColorStop(i / (stops.length - 1), s); }); c.fillStyle = g; c.fillRect(0, 0, W, H); }

  var parts_ = {
    stars: function (c, n) { var r = rng(7); for (var i = 0; i < n; i++) { c.fillStyle = 'rgba(255,255,240,' + (0.3 + r() * 0.6) + ')'; c.fillRect(r() * W, r() * H * 0.6, 1.4, 1.4); } },
    moon: function (c, x, y, rad) { var g = c.createRadialGradient(x, y, rad * 0.2, x, y, rad * 3); g.addColorStop(0, 'rgba(230,240,255,.5)'); g.addColorStop(1, 'rgba(230,240,255,0)'); c.fillStyle = g; c.fillRect(x - rad * 3, y - rad * 3, rad * 6, rad * 6); c.fillStyle = '#eef3ff'; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill(); },
    floor: function (c, col, h) { c.fillStyle = col; c.fillRect(0, H * h, W, H * (1 - h)); },
    window: function (c, x, y, w, h, light) { c.fillStyle = light; c.fillRect(x, y, w, h); c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(x + w / 2 - 3, y, 6, h); c.fillRect(x, y + h / 2 - 3, w, 6); var g = c.createLinearGradient(x, y + h, x + w * 0.4, H); g.addColorStop(0, light.replace(/[\d.]+\)$/, '.28)')); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(x, y + h); c.lineTo(x + w, y + h); c.lineTo(x + w * 1.6, H); c.lineTo(x - w * 0.6, H); c.fill(); },
    skyline: function (c, col, seed, base) { var r = rng(seed), x = 0; c.fillStyle = col; while (x < W) { var w = 40 + r() * 70, h = 50 + r() * 140; c.fillRect(x, H * base - h, w, h + H); if (r() > 0.7) { c.beginPath(); c.moveTo(x, H * base - h); c.lineTo(x + w / 2, H * base - h - 30); c.lineTo(x + w, H * base - h); c.fill(); } x += w + 4; } },
    trees: function (c, col, seed, base) { var r = rng(seed); c.fillStyle = col; for (var x = -20; x < W + 40; x += 28 + r() * 30) { var h = 90 + r() * 170; c.beginPath(); c.ellipse(x, H * base - h * 0.55, 34 + r() * 24, h * 0.55, 0, 0, 7); c.fill(); c.fillRect(x - 3, H * base - h * 0.2, 6, h * 0.3); } c.fillRect(0, H * base - 2, W, H); },
    shelves: function (c, col, y0, rows) { var r = rng(11); for (var k = 0; k < rows; k++) { var y = y0 + k * (H * 0.13); c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(0, y + H * 0.1, W, 5); for (var x = 0; x < W; x += 10 + r() * 8) { c.fillStyle = col.replace('X', (9 + r() * 15 | 0)); c.fillRect(x, y + H * 0.1 - (H * 0.06 + r() * H * 0.04), 7 + r() * 5, H * 0.06 + r() * H * 0.04); } } },
    vignette: function (c) { var g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.65)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  };

  // background definitions: static layer drawn once, plus optional flame sources
  var bgs = {
    bedroom_night: function (c) { grad(c, ['#04050d', '#0b1230', '#171a33']); parts_.stars(c, 120); parts_.moon(c, W * 0.78, H * 0.22, 36); parts_.window(c, W * 0.62, H * 0.1, W * 0.3, H * 0.34, 'rgba(120,150,230,.22)'); parts_.floor(c, '#0a0a12', 0.7); c.fillStyle = '#10101c'; c.fillRect(W * 0.12, H * 0.5, W * 0.46, H * 0.22); c.fillStyle = '#1a1a2c'; c.fillRect(W * 0.1, H * 0.46, W * 0.07, H * 0.26); flames = [[W * 0.64, H * 0.5, 1]]; parts_.vignette(c); },
    apt_day: function (c) { grad(c, ['#2c2418', '#3c2f1e', '#1d1710']); parts_.window(c, W * 0.1, H * 0.12, W * 0.36, H * 0.42, 'rgba(255,225,160,.5)'); parts_.window(c, W * 0.58, H * 0.12, W * 0.3, H * 0.42, 'rgba(255,225,160,.4)'); parts_.floor(c, '#15100b', 0.74); parts_.vignette(c); },
    library: function (c) { grad(c, ['#10161a', '#16222a', '#0d1317']); parts_.shelves(c, 'hsl(25,40%,X%)', H * 0.04, 4); parts_.floor(c, '#0a0f12', 0.8); var g = c.createLinearGradient(0, 0, 0, H * 0.3); g.addColorStop(0, 'rgba(190,230,255,.22)'); g.addColorStop(1, 'rgba(190,230,255,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H * 0.3); parts_.vignette(c); },
    diner: function (c) { grad(c, ['#2a140c', '#3a1d10', '#150a06']); parts_.window(c, W * 0.55, H * 0.14, W * 0.38, H * 0.36, 'rgba(255,190,110,.4)'); c.fillStyle = 'rgba(200,40,40,.7)'; c.fillRect(W * 0.08, H * 0.2, W * 0.28, 8); c.fillStyle = 'rgba(255,200,120,.7)'; c.fillRect(W * 0.08, H * 0.3, W * 0.2, 4); parts_.floor(c, '#120805', 0.76); parts_.vignette(c); },
    trailer: function (c) { grad(c, ['#1a1c20', '#23262c', '#101114']); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, H * 0.18, W, 5); c.fillStyle = 'rgba(210,220,235,.12)'; c.fillRect(W * 0.2, H * 0.12, W * 0.6, 7); c.fillStyle = '#2d2a24'; c.fillRect(W * 0.62, H * 0.2, W * 0.3, H * 0.5); c.fillStyle = '#3b3a35'; for (var i = 0; i < 4; i++) c.fillRect(W * 0.64, H * 0.24 + i * H * 0.11, W * 0.26, H * 0.09); parts_.floor(c, '#0b0b0c', 0.78); parts_.vignette(c); },
    bnb: function (c) { grad(c, ['#2a1b17', '#352119', '#150d0a']); parts_.window(c, W * 0.64, H * 0.12, W * 0.26, H * 0.38, 'rgba(150,170,255,.18)'); c.fillStyle = '#2b1612'; c.fillRect(W * 0.08, H * 0.5, W * 0.5, H * 0.24); c.fillStyle = '#4a2c24'; c.fillRect(W * 0.06, H * 0.42, W * 0.06, H * 0.32); var g = c.createRadialGradient(W * 0.3, H * 0.3, 10, W * 0.3, H * 0.3, W * 0.3); g.addColorStop(0, 'rgba(255,190,110,.35)'); g.addColorStop(1, 'rgba(255,190,110,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); parts_.floor(c, '#0f0806', 0.76); parts_.vignette(c); },
    candleshop: function (c) { grad(c, ['#1a0f22', '#2a1633', '#120a18']); parts_.shelves(c, 'hsl(280,35%,X%)', H * 0.06, 3); var r = rng(5); flames = []; for (var k = 0; k < 3; k++) for (var i = 0; i < 9; i++) { var x = W * 0.05 + i * (W * 0.105) + r() * 10, y = H * 0.06 + k * (H * 0.13) + H * 0.1 - H * 0.07; flames.push([x, y, 0.5 + r() * 0.5]); c.fillStyle = 'rgba(240,225,200,.55)'; c.fillRect(x - 3, y, 7, H * 0.06); } parts_.floor(c, '#0c0710', 0.82); parts_.vignette(c); },
    street_dusk: function (c) { grad(c, ['#1c2740', '#7a4a4a', '#d9915a', '#2a1a14']); parts_.skyline(c, '#120c0b', 3, 0.72); parts_.trees(c, '#0a0706', 9, 0.78); parts_.floor(c, '#0c0807', 0.78); parts_.vignette(c); }
  };

  function drawStatic() {
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0); flames = []; sctx.clearRect(0, 0, W, H);
    (bgs[bgName] || bgs.bedroom_night)(sctx);
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    cv.width = stat.width = W * dpr; cv.height = stat.height = H * dpr; drawStatic();
  }
  window.addEventListener('resize', resize);

  function seedParts() {
    parts = []; var r = Math.random;
    fxList.forEach(function (f) {
      var n = f === 'rain' ? 220 : f === 'dust' ? 50 : f === 'fog' ? 7 : 0;
      for (var i = 0; i < n; i++) parts.push({ k: f, x: r() * W, y: r() * H, s: 0.4 + r(), a: r(), r0: 120 + r() * 200 });
    });
  }
  function frame(now) {
    var t = (now - t0) / 1000; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(stat, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    flames.forEach(function (f, i) {
      var fl = 0.7 + 0.3 * Math.sin(t * 9 + i * 1.7) * Math.sin(t * 4.3 + i), rad = 36 * f[2] + 18 * fl;
      var g = ctx.createRadialGradient(f[0], f[1], 1, f[0], f[1], rad * 2.6); g.addColorStop(0, 'rgba(255,200,110,' + 0.5 * fl + ')'); g.addColorStop(1, 'rgba(255,150,60,0)'); ctx.fillStyle = g; ctx.fillRect(f[0] - rad * 3, f[1] - rad * 3, rad * 6, rad * 6);
      ctx.fillStyle = 'rgba(255,235,170,.95)'; ctx.beginPath(); ctx.ellipse(f[0], f[1] - 4, 2.4 * f[2] + 1, 6 * fl * f[2] + 3, 0, 0, 7); ctx.fill();
    });
    parts.forEach(function (p) {
      if (p.k === 'rain') { ctx.strokeStyle = 'rgba(180,200,230,.35)'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 3, p.y + 16 * p.s); ctx.stroke(); p.y += 15 * p.s; p.x -= 2; if (p.y > H) { p.y = -20; p.x = Math.random() * W + 40; } }
      else if (p.k === 'dust') { ctx.fillStyle = 'rgba(255,230,180,' + (0.12 + 0.25 * Math.abs(Math.sin(t * p.s + p.a * 6))) + ')'; ctx.fillRect(p.x, p.y, 2, 2); p.y -= 0.12 * p.s; p.x += Math.sin(t * 0.4 + p.a * 9) * 0.25; if (p.y < 0) p.y = H; }
      else if (p.k === 'fog') { var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r0); g.addColorStop(0, 'rgba(200,215,230,.07)'); g.addColorStop(1, 'rgba(200,215,230,0)'); ctx.fillStyle = g; ctx.fillRect(p.x - p.r0, p.y - p.r0, p.r0 * 2, p.r0 * 2); p.x += 0.15 * p.s; if (p.x > W + p.r0) p.x = -p.r0; }
    });
    requestAnimationFrame(frame);
  }

  function setScene(bg, fx) { bgName = bg || bgName; fxList = fx || []; drawStatic(); seedParts(); }

  // ---------- silhouettes ----------
  var HAIR = {
    puff: '<circle cx="60" cy="62" r="36"/>', cap: '<path d="M30 78 Q32 46 62 44 Q90 46 90 78 L96 82 L26 82 Z"/>', long: '<path d="M30 80 Q28 40 60 40 Q92 40 90 80 L96 150 L82 150 L84 90 L36 90 L38 150 L24 150 Z"/>',
    bun: '<circle cx="60" cy="40" r="14"/><path d="M33 78 Q32 50 60 50 Q88 50 87 78 Z"/>', short: '<path d="M33 80 Q32 46 60 46 Q88 46 87 80 Q60 66 33 80 Z"/>', ponytail: '<path d="M33 80 Q32 46 60 46 Q88 46 87 80 Q60 66 33 80 Z"/><ellipse cx="94" cy="86" rx="9" ry="22" transform="rotate(-12 94 86)"/>',
    bald: '', gray: '<path d="M34 76 Q36 52 60 52 Q84 52 86 76 Q60 68 34 76 Z"/>'
  };
  function silhouette(ch) {
    var col = ch.specter ? '#bcd9f5' : (ch.tone || '#1d1713'), rim = ch.specter ? '#e6f3ff' : '#d4a574';
    var glasses = ch.glasses ? '<circle cx="50" cy="86" r="8" fill="none" stroke="' + rim + '" stroke-width="1.5"/><circle cx="70" cy="86" r="8" fill="none" stroke="' + rim + '" stroke-width="1.5"/>' : '';
    return '<svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg"><g fill="' + col + '" stroke="' + rim + '" stroke-opacity=".55" stroke-width="1.4">' +
      '<path d="M8 200 C8 146 38 126 60 126 C82 126 112 146 112 200 Z"/><rect x="50" y="108" width="20" height="24" rx="6"/><ellipse cx="60" cy="86" rx="26" ry="31"/>' + (HAIR[ch.hair] || '') + '</g>' + glasses + '</svg>';
  }

  requestAnimationFrame(frame);
  return { resize: resize, setScene: setScene, silhouette: silhouette };
})();
