/* ───────────── v6: Wetterradar – eigene Karte, DWD-Radar, Blitze, Wind, Warnungen ───────────── */
const RD_TS = 256, RD_R = 20037508.342789244;
const rdX = (lon, z) => (lon + 180) / 360 * RD_TS * 2 ** z;
const rdY = (lat, z) => { const s = Math.sin(lat * Math.PI / 180); return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * RD_TS * 2 ** z; };
const rdLon = (x, z) => x / (RD_TS * 2 ** z) * 360 - 180;
const rdLat = (y, z) => { const n = Math.PI - 2 * Math.PI * y / (RD_TS * 2 ** z); return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))); };
const rdMx = (x, z) => (x / (RD_TS * 2 ** z) - 0.5) * 2 * RD_R;
const rdMy = (y, z) => (0.5 - y / (RD_TS * 2 ** z)) * 2 * RD_R;
const rdKm = (a, b) => { const r = Math.PI / 180, dl = (b.lat - a.lat) * r, dn = (b.lon - a.lon) * r, h = Math.sin(dl / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dn / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); };
const RD_TYPES = {
  rain: { n: 'Regen', i: 'drop', f: 'none' },
  snow: { n: 'Schnee', i: 'snow', f: 'grayscale(1) brightness(1.55) contrast(1.2)' },
  sleet: { n: 'Schneeregen', i: 'snow', f: 'hue-rotate(95deg) saturate(1.15)' },
  freezing: { n: 'Gefrierender Regen', i: 'drop', f: 'hue-rotate(170deg) saturate(1.6)' },
};
// Intensität am Standort (mm/h) → Farbe wie die Radarbilder und Balkenhöhe in der Zeitleiste
const RD_LEG = [[0.1, '#60a5fa', 'leicht'], [1, '#22c55e', 'mäßig'], [2.5, '#facc15', 'kräftig'], [10, '#ef4444', 'stark'], [30, '#d946ef', 'Unwetter']];
const rdCol = v => { let c = RD_LEG[0][1]; for (const [t, k] of RD_LEG) if (v >= t) c = k; return c; };
const rdHH = t => new Date(t).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
const RD_CARD = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
const RD_HTML = () => `<div class="rd-map"><div class="rd-world"><div class="rd-base"></div><div class="rd-fr"></div><div class="rd-bl"></div><div class="rd-wn"></div><div class="rd-rf"></div><div class="rd-ov"></div></div></div>
<canvas class="rd-wind"></canvas><div class="rd-fx"></div><div class="rd-vig"></div>
<div class="rd-top"><div class="rd-l"><div class="rd-k">REGENRADAR</div><div class="rd-live"><i></i><span>live</span></div><a class="rd-ext" target="_blank" rel="noopener noreferrer">wetter.com${ic('chevron', 12)}</a><div class="rd-warns"></div></div>
<div class="rd-r"><div class="rd-say"></div><div class="rd-sub"></div><div class="rd-leg">${RD_LEG.map(([v, c, n]) => `<span><i style="background:${c}"></i>${n}</span>`).join('')}</div><div class="rd-type"></div></div></div>
<div class="rd-ctl"><button class="rd-cb z" data-rd="in" aria-label="Vergrößern">${ic('plus', 18)}</button><button class="rd-cb z" data-rd="out" aria-label="Verkleinern">${ic('minus', 18)}</button><button class="rd-cb z" data-rd="home" aria-label="Zu meinem Standort">${ic('radar', 18)}</button><button class="rd-cb ex" data-act="radar" aria-label="Vollbild">${ic('expand', 18)}</button></div>
<button class="rd-cb rdx" data-act="close" aria-label="Schließen">${ic('close', 18)}</button>
<div class="rd-pills"><div class="rd-wp"></div><div class="rd-bp"></div></div>
<div class="rd-tl"><button class="rd-play" data-rd="play" aria-label="Wiedergabe">${ic('pause', 18)}</button><div class="rd-dw"><div class="rd-dots"></div><div class="rd-lb"></div></div><div class="rd-clk"><b>--:--</b><span>RADAR</span></div></div>
<div class="rd-att">Karte © Esri · Radar, Warnungen, Blitzdichte © DWD · Einschläge Blitzortung.org · Kachelmann</div><div class="rd-err" hidden>Karte nicht erreichbar – Netzwerk prüfen</div>`;

class AuroraRadar {
  constructor(host) {
    this.h = host; this.cfg = host._rdrCfg(); this.full = false; this.alive = true; this.paused = true;
    const hc = host._h?.config || {};
    this.home = { lat: hc.latitude ?? 51.7235, lon: hc.longitude ?? 8.5633 };
    this.z = this.cfg.zoom; this.cx = rdX(this.home.lon, this.z); this.cy = rdY(this.home.lat, this.z);
    this.W = 0; this.H = 0; this.tiles = new Map(); this.tOk = 0; this.tErr = 0; this.fr = []; this.cur = []; this.old = []; this.ok = []; this.fi = 0; this.nowIdx = 0;
    this.play = !matchMedia('(prefers-reduced-motion: reduce)').matches; this.rates = []; this.say = null; this.gen = 0; this.sig = {}; this.kw = null; this.fxk = '';
    const r = this.root = document.createElement('div'); r.className = 'rdm'; r.innerHTML = RD_HTML();
    this.q = s => r.querySelector(s);
    this.world = this.q('.rd-world'); this.baseEl = this.q('.rd-base'); this.frEl = this.q('.rd-fr'); this.blEl = this.q('.rd-bl'); this.wnEl = this.q('.rd-wn'); this.rfEl = this.q('.rd-rf'); this.ovEl = this.q('.rd-ov'); this.map = this.q('.rd-map');
    this.q('.rd-ext').href = this.cfg.ext;
    this.cv = this.q('.rd-wind'); this.ctx = this.cv.getContext('2d'); this.P = [];
    this.bindEvents();
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(r);
    this.setMode(false);
  }
  /* ── Steuerung ── */
  setMode(full) {
    this.full = !!full; this.root.classList.toggle('full', this.full);
    if (this.full) this.map.removeAttribute('data-act'); else this.map.setAttribute('data-act', 'radar');
  }
  resume() { if (!this.paused) return; this.paused = false; this.resize(); this.refresh(); this.t5 = setInterval(() => this.refresh(), 3e5); this.tp = setInterval(() => this.stepPlay(), 480); this.raf(); }
  pause() { if (this.paused) return; this.paused = true; clearInterval(this.t5); clearInterval(this.tp); cancelAnimationFrame(this._raf); }
  destroy() { this.alive = false; this.pause(); this.ro.disconnect(); this.root.remove(); }
  bindEvents() {
    const m = this.map, pt = new Map(); let drag = null, pd = 0;
    m.addEventListener('pointerdown', e => {
      if (!this.full) return;
      pt.set(e.pointerId, e); m.setPointerCapture?.(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, cx: this.cx, cy: this.cy }; if (pt.size === 2) { const [a, b] = [...pt.values()]; pd = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); }
    });
    m.addEventListener('pointermove', e => {
      if (!pt.has(e.pointerId)) return; pt.set(e.pointerId, e);
      if (pt.size === 2) { const [a, b] = [...pt.values()], d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); if (pd && d / pd > 1.35) { this.zoom(1); pd = d; drag = null; } else if (pd && d / pd < 0.74) { this.zoom(-1); pd = d; drag = null; } return; }
      if (!drag) return; this.cx = drag.cx - (e.clientX - drag.x); this.cy = drag.cy - (e.clientY - drag.y); this.view(); this.later();
    });
    const up = e => { pt.delete(e.pointerId); if (pt.size < 2) pd = 0; if (!pt.size) drag = null; else { const o = [...pt.values()][0]; drag = { x: o.clientX, y: o.clientY, cx: this.cx, cy: this.cy }; } };
    m.addEventListener('pointerup', up); m.addEventListener('pointercancel', up);
    m.addEventListener('wheel', e => { if (!this.full) return; e.preventDefault(); const t = Date.now(); if (t - (this._wh || 0) < 220) return; this._wh = t; this.zoom(e.deltaY < 0 ? 1 : -1); }, { passive: false });
    m.addEventListener('dblclick', () => { if (this.full) this.zoom(1); });
    this.root.addEventListener('click', e => {
      const b = e.target.closest('[data-rd]'); if (!b) return; const k = b.dataset.rd;
      if (k === 'in') this.zoom(1); else if (k === 'out') this.zoom(-1); else if (k === 'home') this.center();
      else if (k === 'play') { this.play = !this.play; this.setPlayIcon(); }
    });
    const dw = this.q('.rd-dots'); let sc = false;
    const pick = e => { const r = dw.getBoundingClientRect(), n = this.fr.length; if (!n) return; this.play = false; this.setPlayIcon(); this.show(Math.max(0, Math.min(n - 1, Math.round((e.clientX - r.left) / r.width * (n - 1))))); };
    dw.addEventListener('pointerdown', e => { sc = true; dw.setPointerCapture?.(e.pointerId); pick(e); });
    dw.addEventListener('pointermove', e => { if (sc) pick(e); });
    dw.addEventListener('pointerup', () => { sc = false; });
  }
  setPlayIcon() { const b = this.q('.rd-play'); b.innerHTML = ic(this.play ? 'pause' : 'play', 18); }
  zoom(d) { const z = Math.max(5, Math.min(11, this.z + d)); if (z === this.z) return; const f = 2 ** (z - this.z); this.cx *= f; this.cy *= f; this.z = z; this.clearTiles(); this.dropFrames(); this.view(); this.markers(); this.later(0); }
  center() { this.z = this.cfg.zoom; this.cx = rdX(this.home.lon, this.z); this.cy = rdY(this.home.lat, this.z); this.clearTiles(); this.dropFrames(); this.view(); this.markers(); this.later(0); }
  later(ms = 450) { clearTimeout(this._lt); this._lt = setTimeout(() => this.loadOverlays(), ms); }
  resize() {
    const W = this.root.clientWidth, H = this.root.clientHeight; if (!W || !H) return;
    const ch = W !== this.W || H !== this.H; this.W = W; this.H = H;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); this.cv.width = W * dpr; this.cv.height = H * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); this.initP();
    this.view(); this.markers(); if (ch && !this.paused) this.later(250);
  }
  /* ── Karte ── */
  view() { this.world.style.transform = `translate3d(${(this.W / 2 - this.cx).toFixed(1)}px,${(this.H / 2 - this.cy).toFixed(1)}px,0)`; this.placeTiles(); }
  baseStyle() { return this.h._app?.classList.contains('light') ? 'light' : 'dark'; }
  clearTiles() { this.tiles.forEach(i => i.remove()); this.tiles.clear(); }
  layers(st) {
    const b = this.cfg.base; if (typeof b === 'string') return [[b, this.baseEl]];
    const L = b[st] || b.dark || []; return L.map((u, i) => [u, i ? this.rfEl : this.baseEl]);
  }
  placeTiles() {
    const st = this.baseStyle(); if (st !== this.bs) { this.bs = st; this.clearTiles(); }
    const z = this.z, n = 2 ** z, W = this.W, H = this.H; if (!W) return;
    const x0 = Math.floor((this.cx - W / 2) / RD_TS) - 1, x1 = Math.floor((this.cx + W / 2) / RD_TS) + 1, y0 = Math.max(0, Math.floor((this.cy - H / 2) / RD_TS) - 1), y1 = Math.min(n - 1, Math.floor((this.cy + H / 2) / RD_TS) + 1);
    const keep = new Set(), LY = this.layers(st);
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) LY.forEach(([tpl, host], li) => {
      if (this.cfg.mock && li) return;
      const k = li + '/' + z + '/' + x + '/' + y; keep.add(k); if (this.tiles.has(k)) return;
      const im = new Image(); im.className = 'rd-t'; im.alt = ''; im.draggable = false; im.decoding = 'async'; im.referrerPolicy = 'no-referrer';
      im.style.left = x * RD_TS + 'px'; im.style.top = y * RD_TS + 'px';
      if (!li) { im.onload = () => { this.tOk++; this.q('.rd-err').hidden = true; }; im.onerror = () => { this.tErr++; if (!this.tOk && this.tErr > 5) this.q('.rd-err').hidden = false; }; }
      const xm = ((x % n) + n) % n;
      im.src = this.cfg.mock ? this.mockTile(z, xm, y) : tpl.replace('{s}', 'abcd'[(xm + y) % 4]).replace('{st}', st).replace('{z}', z).replace('{x}', xm).replace('{y}', y);
      host.appendChild(im); this.tiles.set(k, im);
    });
    this.tiles.forEach((im, k) => { if (!keep.has(k)) { im.remove(); this.tiles.delete(k); } });
  }
  mockTile(z, x, y) {
    this._mt = this._mt || new Map(); const k = this.bs + z + '/' + x + '/' + y; if (this._mt.has(k)) return this._mt.get(k);
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), light = this.bs === 'light';
    g.fillStyle = light ? '#e4eaf2' : '#141b2b'; g.fillRect(0, 0, 256, 256);
    let s = (x * 73856093 ^ y * 19349663 ^ z * 83492791) >>> 0; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    g.strokeStyle = light ? 'rgba(15,23,42,.10)' : 'rgba(255,255,255,.07)'; g.lineWidth = 1;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(rnd() * 256, 0); g.bezierCurveTo(rnd() * 256, 80, rnd() * 256, 160, rnd() * 256, 256); g.stroke(); }
    g.fillStyle = light ? 'rgba(15,23,42,.06)' : 'rgba(255,255,255,.04)'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(rnd() * 256, rnd() * 256, 20 + rnd() * 50, 0, 7); g.fill(); }
    g.strokeStyle = light ? 'rgba(15,23,42,.08)' : 'rgba(255,255,255,.05)'; g.strokeRect(0, 0, 256, 256);
    const u = c.toDataURL(); this._mt.set(k, u); return u;
  }
  /* ── Zeitachse (DWD) ── */
  iso(t) { return new Date(t).toISOString(); }
  async capsTimes() {
    const L = this.cfg.radar, nm = L.split(':').pop(), url = this.cfg.wms.replace(/\/wms$/, '') + '/' + nm + '/wms?service=WMS&version=1.3.0&request=GetCapabilities';
    const r = await fetch(url); if (!r.ok) throw new Error('caps'); const x = new DOMParser().parseFromString(await r.text(), 'text/xml');
    const d = [...x.getElementsByTagName('Dimension')].find(e => (e.getAttribute('name') || '').toLowerCase() === 'time'); if (!d) throw new Error('dim');
    const per = p => { const m = /P(?:T)?(?:(\d+)H)?(?:(\d+)M)?/.exec(p || ''); return m ? ((+m[1] || 0) * 60 + (+m[2] || 0)) * 6e4 || 3e5 : 3e5; };
    const out = new Set(), now = Date.now(), lo = now - this.cfg.past * 6e4 - 3e5, hi = now + this.cfg.future * 6e4 + 3e5;
    for (const tok of d.textContent.split(',')) {
      const p = tok.trim().split('/'); if (p.length >= 2) { const a = Date.parse(p[0]), b = Date.parse(p[1]), s = per(p[2]); if (!isFinite(a) || !isFinite(b)) continue; for (let t = Math.max(a, b - 5 * 864e5), n = 0; t <= b && n < 4000; t += s, n++) if (t >= lo && t <= hi) out.add(t); }
      else { const t = Date.parse(p[0]); if (isFinite(t) && t >= lo && t <= hi) out.add(t); }
    }
    return [...out].sort((a, b) => a - b);
  }
  async buildFrames() {
    let times = []; const cfg = this.cfg, now = Date.now();
    if (!cfg.mock) { try { times = await this.capsTimes(); } catch (e) { times = []; } }
    if (times.length < 8) { times = []; const Lt = Math.floor((now - 7 * 6e4) / 3e5) * 3e5; for (let t = Lt - cfg.past * 6e4; t <= Lt + cfg.future * 6e4; t += 3e5) times.push(t); }
    this.fr = times; let ni = 0; times.forEach((t, i) => { if (t <= now) ni = i; }); this.nowIdx = ni; if (this.fi >= times.length || !this._fiSet) { this.fi = ni; this._fiSet = true; }
    this.drawTl();
  }
  drawTl() {
    const n = this.fr.length, now = Date.now();
    this.q('.rd-dots').innerHTML = this.fr.map((t, i) => `<i class="${t > now ? 'f' : ''}" data-i="${i}"></i>`).join('');
    const at = ms => { let b = 0, bd = 1e18; this.fr.forEach((t, i) => { const d = Math.abs(t - (now + ms)); if (d < bd) { bd = d; b = i; } }); return b / Math.max(1, n - 1) * 100; };
    const in_ = ms => n && now + ms >= this.fr[0] - 6e5 && now + ms <= this.fr[n - 1] + 6e5;
    this.q('.rd-lb').innerHTML = [['−2 h', -72e5], ['−1 h', -36e5], ['jetzt', 0], ['+1 h', 36e5], ['+2 h', 72e5]].filter(x => n > 10 && in_(x[1])).map(x => { const l = at(x[1]); return `<span style="left:${l.toFixed(1)}%${l > 90 ? ';transform:translateX(-100%)' : ''}">${x[0]}</span>`; }).join('');
    this.dotsEl = [...this.q('.rd-dots').children]; this.bars();
  }
  // Zeitleiste als Niederschlagsverlauf am Standort (wie bei wetter.com): Höhe und Farbe nach mm/h
  bars() {
    const rc = this.rc; if (!rc || !this.dotsEl) return;
    this.dotsEl.forEach((d, i) => { const v = rc.get(this.fr[i]), r = v != null && v >= 0.1; d.classList.toggle('r', r); d.style.cssText = r ? `--h:${Math.min(1, Math.log1p(v) / Math.log1p(20)).toFixed(2)};--c:${rdCol(v)}` : ''; });
  }
  /* ── Overlays (Radar-Frames, Blitzdichte, Warnungen) ── */
  box() { const bw = this.W * 1.5, bh = this.H * 1.5, z = this.z, l = this.cx - bw / 2, t = this.cy - bh / 2, s = Math.min(1, 1100 / Math.max(bw, bh)); return { l, t, bw, bh, w: Math.round(bw * s), h: Math.round(bh * s), bbox: [rdMx(l, z), rdMy(t + bh, z), rdMx(l + bw, z), rdMy(t, z)].map(v => v.toFixed(1)).join(',') }; }
  wmsUrl(layer, b, time) { return `${this.cfg.wms}?service=WMS&version=1.3.0&request=GetMap&layers=${encodeURIComponent(layer)}&styles=&format=image/png&transparent=true&crs=EPSG:3857&bbox=${b.bbox}&width=${b.w}&height=${b.h}${time ? '&time=' + encodeURIComponent(this.iso(time)) : ''}`; }
  place(im, b) { im.style.left = b.l.toFixed(1) + 'px'; im.style.top = b.t.toFixed(1) + 'px'; im.style.width = b.bw.toFixed(1) + 'px'; im.style.height = b.bh.toFixed(1) + 'px'; }
  dropFrames() { this.gen++; [...this.cur, ...this.old].forEach(i => i && i.remove()); this.cur = []; this.old = []; this.ok = []; this.blEl.innerHTML = ''; this.wnEl.innerHTML = ''; }
  mockFrame(t, b) {
    const c = document.createElement('canvas'); c.width = Math.round(b.w / 2); c.height = Math.round(b.h / 2); const g = c.getContext('2d'), z = this.z, now = Date.now();
    const blobs = [[this.home.lon - 0.9, this.home.lat + 0.35, 0.45, 1], [this.home.lon - 0.2, this.home.lat + 0.1, 0.22, 0.8], [this.home.lon - 1.4, this.home.lat - 0.2, 0.3, 0.6], [this.home.lon + 1.0, this.home.lat + 0.5, 0.35, 0.9]];
    const dt = (t - now) / 36e5; blobs.forEach(([lo, la, rr, it]) => {
      const lon = lo + (dt + 1.0) * 0.55, lat = la, px = (rdX(lon, z) - b.l) / b.bw * c.width, py = (rdY(lat, z) - b.t) / b.bh * c.height, pr = rr * (RD_TS * 2 ** z / 360) / b.bw * c.width;
      const gr = g.createRadialGradient(px, py, 0, px, py, pr); gr.addColorStop(0, 'rgba(217,70,239,' + (.9 * it) + ')'); gr.addColorStop(.25, 'rgba(239,68,68,' + (.85 * it) + ')'); gr.addColorStop(.45, 'rgba(250,204,21,.8)'); gr.addColorStop(.7, 'rgba(34,197,94,.65)'); gr.addColorStop(1, 'rgba(59,130,246,0)'); g.fillStyle = gr; g.beginPath(); g.arc(px, py, pr, 0, 7); g.fill();
    }); return c.toDataURL();
  }
  loadOverlays() {
    if (this.paused || !this.W || !this.fr.length) return;
    const b = this.box(), myGen = ++this.gen; this.old.forEach(i => i && i.remove()); this.old = this.cur; this.cur = []; this.ok = [];
    const order = this.fr.map((t, i) => i).sort((a, c) => Math.abs(a - this.fi) - Math.abs(c - this.fi)); let q = 0, run = 0, done = 0;
    const finish = () => { if (myGen === this.gen) { this.old.forEach(i => i && i.remove()); this.old = []; } };
    const pump = () => {
      while (run < 6 && q < order.length) {
        const i = order[q++]; run++;
        const im = new Image(); im.className = 'rd-f'; im.alt = ''; im.draggable = false; im.decoding = 'async'; this.place(im, b); this.cur[i] = im; this.frEl.appendChild(im);
        const end = ok => { run--; done++; if (myGen !== this.gen) return; this.ok[i] = ok; if (!ok) im.remove(); if (i === this.fi) this.show(this.fi); if (ok && i === this.fi) finish(); if (done >= order.length) finish(); this.dotState(); pump(); };
        im.onload = () => end(true); im.onerror = () => end(false);
        im.src = this.cfg.mock ? this.mockFrame(this.fr[i], b) : this.wmsUrl(this.cfg.radar, b, this.fr[i]);
      }
    };
    pump();
    const bl = new Image(); bl.alt = ''; this.place(bl, b); bl.onerror = () => bl.remove(); bl.src = this.cfg.mock ? this.mockBolt(b) : this.wmsUrl(this.cfg.bolt, b); this.blEl.innerHTML = ''; this.blEl.appendChild(bl);
    this.warnLayer(b);
  }
  mockBolt(b) { const c = document.createElement('canvas'); c.width = 200; c.height = 160; const g = c.getContext('2d'); g.fillStyle = 'rgba(34,211,238,.9)'; for (let i = 0; i < 22; i++) { g.beginPath(); g.arc(120 + Math.random() * 50, 70 + Math.random() * 50, 1.6, 0, 7); g.fill(); } return c.toDataURL(); }
  warnLayer(b) {
    b = b || this.box(); const has = this.h._rdrWarns().length; this.wnEl.innerHTML = '';
    if (!has || this.cfg.mock) return; const im = new Image(); im.alt = ''; this.place(im, b); im.onerror = () => im.remove(); im.src = this.wmsUrl(this.cfg.warn, b); this.wnEl.appendChild(im);
  }
  /* ── Frames abspielen ── */
  show(i) {
    this.fi = i; const set = [this.cur, this.old];
    [...this.cur, ...this.old].forEach(im => im && im.classList.remove('on'));
    const pick = (this.cur[i] && this.ok[i]) ? this.cur[i] : this.old[i]; if (pick) pick.classList.add('on');
    const t = this.fr[i]; if (t) { const c = this.q('.rd-clk'); c.firstChild.textContent = rdHH(t); c.lastChild.textContent = t > Date.now() ? 'PROGNOSE' : 'RADAR'; c.classList.toggle('fc', t > Date.now()); }
    this.dotState();
  }
  dotState() { (this.dotsEl || []).forEach((d, i) => { d.classList.toggle('on', i === this.fi); d.classList.toggle('na', this.ok.length > 0 && this.ok[i] === false); }); }
  stepPlay() {
    if (!this.play || this.paused || !this.fr.length) return;
    let n = this.fi + 1; if (n >= this.fr.length) n = 0; let g = 0; while (this.ok[n] === false && g++ < this.fr.length) n = (n + 1) % this.fr.length; this.show(n);
  }
  /* ── Daten (Regen-Wert am Standort, Kachelmann, …) ── */
  async refresh() {
    if (this.paused) return; await this.buildFrames(); this.show(Math.min(this.fi, this.fr.length - 1)); this.loadOverlays();
    this.fetchRates(); this.fetchKw();
  }
  async fetchRates() {
    const cfg = this.cfg, now = Date.now(), fr = this.fr, n = fr.length; if (!n) return;
    // Regen am Standort für jeden Frame: vergangene bleiben gespeichert, ab „jetzt“ wird jede Runde neu gefragt (Prognose ändert sich)
    const rc = this.rc = this.rc || new Map(), keep = new Set(fr); for (const t of rc.keys()) if (!keep.has(t)) rc.delete(t);
    const t0 = fr[this.nowIdx], need = fr.filter(t => t >= t0 || !rc.has(t));
    if (cfg.mock) { const T0 = now + (cfg.mockEta ?? 35) * 6e4; need.forEach(t => rc.set(t, 2.2 * Math.exp(-(((t - T0) / 6e4 / 12) ** 2)))); }
    else {
      const m = 3000, mx = this.home.lon / 180 * RD_R, my = Math.log(Math.tan((90 + this.home.lat) * Math.PI / 360)) / Math.PI * RD_R, bb = [mx - m, my - m, mx + m, my + m].map(v => v.toFixed(1)).join(','), L = encodeURIComponent(cfg.radar);
      const one = async t => {
        try {
          const r = await fetch(`${cfg.wms}?service=WMS&version=1.3.0&request=GetFeatureInfo&layers=${L}&query_layers=${L}&styles=&crs=EPSG:3857&bbox=${bb}&width=5&height=5&i=2&j=2&info_format=application/json&feature_count=1&time=${encodeURIComponent(this.iso(t))}`);
          if (!r.ok) return null; const j = await r.json(), f = j.features?.[0]; if (!f) return 0;
          const v = Object.values(f.properties || {}).find(x => typeof x === 'number' && isFinite(x)); if (v == null) return 0; const q = v * cfg.factor; return q < 0 || q > 500 ? 0 : q;
        } catch (e) { return null; }
      };
      // höchstens 6 Abfragen gleichzeitig, die nahe Zukunft zuerst
      const q = [...need].sort((a, b) => Math.abs(a - now) - Math.abs(b - now)); let k = 0;
      await Promise.all(Array.from({ length: Math.min(6, q.length) }, async () => { while (k < q.length) { const t = q[k++], v = await one(t); if (v != null) rc.set(t, v); else rc.delete(t); } }));
      if (!this.alive || this.fr !== fr) return;
    }
    const idx = []; for (let i = this.nowIdx; i < n && fr[i] <= now + cfg.future * 6e4 + 3e5; i++) idx.push(i);
    this.rates = idx.map(i => rc.has(fr[i]) ? rc.get(fr[i]) : null); this.rateT = idx.map(i => fr[i]); this.bars(); this.upd(true);
  }
  async fetchKw() {
    const e = this.h._c.stationWeather; if (!e || !this.h._s(e) || (this.kw && Date.now() - this.kw.t < 9e5)) return;
    try { const r = await this.h._h.callWS({ type: 'call_service', domain: 'weather', service: 'get_forecasts', service_data: { type: 'hourly' }, target: { entity_id: e }, return_response: true }); this.kw = { t: Date.now(), list: r?.response?.[e]?.forecast || [] }; } catch (er) { this.kw = { t: Date.now(), list: [] }; }
    this.upd(true);
  }
  /* ── Auswertung ── */
  ptype() {
    const h = this.h, w = h._wxNow(), t = w.temp, rh = w.hum ?? 80; let cond = w.cond;
    const wr = h._rdrWarns().map(x => (x.name + ' ' + x.head + ' ' + x.type).toLowerCase()).join(' ');
    if (this.eta != null && this.kw?.list) { const e = this.kw.list.find(x => Date.parse(x.datetime) + 36e5 > Date.now() && (x.precipitation || 0) >= 0.1); if (e && (e.condition === 'snowy' || e.condition === 'snowy-rainy')) cond = e.condition; }
    if (t != null && t <= 3 && /gefrierend|glatteis|eisregen/.test(wr)) return 'freezing';
    if (cond === 'snowy') return 'snow'; if (cond === 'snowy-rainy') return 'sleet';
    if (t == null) return 'rain';
    const tw = t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) + Math.atan(t + rh) - Math.atan(rh - 1.676331) + 0.00391838 * rh ** 1.5 * Math.atan(0.023101 * rh) - 4.686035;
    return tw <= 0 && t <= 2 ? 'snow' : tw <= 1.2 && t <= 3.5 ? 'sleet' : 'rain';
  }
  sayInfo() {
    const h = this.h, now = Date.now(), c = h._c, st = c.station; let cur = null, eta = null, src = '', stop = null, until = null;
    const sr = h._num(st.rainRate); const rt = this.rates || [];
    if (rt.length && rt.some(x => x != null)) {
      src = 'DWD-Radar'; cur = rt[0] != null ? rt[0] : null;
      for (let i = 1; i < rt.length; i++) if (rt[i] != null && rt[i] >= 0.1) { eta = Math.max(5, Math.round((this.rateT[i] - now) / 6e4)); break; }
      if (cur != null && cur >= 0.1) { for (let i = 1; i < rt.length; i++) if (rt[i] != null && rt[i] < 0.1) { stop = this.rateT[i]; break; } }
      for (let i = rt.length - 1; i >= 0; i--) if (rt[i] != null) { until = this.rateT[i]; break; }
    } else if (this.kw?.list?.length) {
      src = 'Kachelmann'; const e = this.kw.list.find(x => Date.parse(x.datetime) + 36e5 > now && Date.parse(x.datetime) < now + 36e5 * 3 && (x.precipitation || 0) >= 0.1);
      if (e) { const m = Math.round((Date.parse(e.datetime) - now) / 6e4); if (m <= 0) cur = e.precipitation; else eta = Math.max(5, m); }
    }
    if (sr != null && sr >= 0.1) { cur = sr; src = 'Wetterstation'; }
    this.eta = eta; const ty = this.ptype(), T = RD_TYPES[ty], verb = T.n;
    const f5 = m => m < 60 ? Math.max(5, Math.round(m / 5) * 5) : Math.round(m / 5) * 5;
    const fin = t => t != null && isFinite(t) && t > now;
    if (cur != null && cur >= 0.1) return { tone: 'now', ty, txt: `${de(cur, cur < 10 ? 1 : 0)} mm/h gerade hier`, sub: `${verb}${fin(stop) ? ' bis etwa ' + rdHH(stop) + ' Uhr' : ''}${src ? ' · ' + src : ''}`, rain: true };
    if (eta != null) { const at = now + eta * 6e4; return { tone: 'soon', ty, txt: `${verb} ab ${rdHH(Math.round(at / 3e5) * 3e5)} Uhr`, sub: `in ~${f5(eta)} min${src ? ' · ' + src : ''}`, rain: false }; }
    return { tone: 'dry', ty, txt: 'trocken', sub: src === 'Kachelmann' ? 'nächste 3 Stunden' : fin(until) ? `kein Niederschlag bis ${rdHH(until)} Uhr` : 'nächste Stunde', rain: false };
  }
  windInfo() {
    const h = this.h, st = h._c.station, kw = h._s(h._c.stationWeather)?.attributes || {};
    const f = u => /m\/s/.test(u || '') ? 3.6 : /mph/.test(u || '') ? 1.609344 : /kn/.test(u || '') ? 1.852 : 1;
    const g = e => { const v = h._num(e); return v == null ? null : v * f(h._attr(e, 'unit_of_measurement')); };
    let spd = g(st.speed), gust = g(st.gust), mx = g(st.maxGust), dir = h._num(st.dir);
    const kf = f(kw.wind_speed_unit); if (spd == null && kw.wind_speed != null) spd = kw.wind_speed * kf; if (gust == null && kw.wind_gust_speed != null) gust = kw.wind_gust_speed * kf; if (dir == null && kw.wind_bearing != null) dir = +kw.wind_bearing;
    if (mx == null) mx = g('sensor.kachelmannwetter_windboen_maximum_heute');
    if (gust == null) gust = spd; return { spd, gust, mx, dir };
  }
  strikes() {
    const h = this.h, S = h._h.states, out = [];
    for (const id in S) {
      if (!id.startsWith('geo_location.')) continue; const a = S[id].attributes || {};
      if (!/blitzortung/i.test(a.source || '') && !/lightning_strike/.test(id)) continue;
      const lat = +a.latitude, lon = +a.longitude; if (!isFinite(lat) || !isFinite(lon)) continue;
      const d = rdKm(this.home, { lat, lon }); if (d > this.cfg.strikeKm) continue;
      const t = Date.parse(a.publication_date || S[id].last_changed); out.push({ id, lat, lon, d, t: isFinite(t) ? t : Date.now() });
    }
    return out.sort((a, b) => a.d - b.d);
  }
  boltInfo() {
    const h = this.h, st = h._c.station, S = this.strikes();
    if (S.length) return { n: S.length, d: S[0].d, S, src: 'bo' };
    const ls = h._val(st.lastStrike), sd = h._num(st.strikeDist);
    if (okv(ls) && Date.now() - Date.parse(ls) < 120 * 6e4 && Date.now() >= Date.parse(ls) - 6e4) return { n: Math.max(1, Math.round(h._num(st.strikes) || 1)), d: sd, S: [], src: 'st' };
    return { n: 0, S: [], storm: h._val(this.cfg.kw.storm) === 'on' };
  }
  /* ── Darstellung ── */
  upd(force) {
    if (!this.alive) return; const h = this.h, q = this.q, say = this.sayInfo(), wi = this.windInfo(), bi = this.boltInfo(), W = h._rdrWarns(), T = RD_TYPES[say.ty];
    this.say = say; this.wi = wi; if (this.W && this.baseStyle() !== this.bs) this.placeTiles();
    const set = (k, el, html) => { if (this.sig[k] !== html) { this.sig[k] = html; el.innerHTML = html; } };
    const sy = q('.rd-say'); sy.className = 'rd-say t-' + say.tone; set('say', sy, esc(say.txt));
    set('sub', q('.rd-sub'), esc(say.sub));
    const showT = say.tone !== 'dry'; set('type', q('.rd-type'), showT ? `<span>${ic(T.i, 13)}${esc(T.n)}</span>` : '');
    this.frEl.style.filter = T.f === 'none' ? '' : T.f; q('.rd-leg i').style.filter = T.f === 'none' ? '' : T.f;
    const fxk = say.rain ? (say.ty === 'rain' || say.ty === 'freezing' ? 'rain' : 'snow') : ''; if (fxk !== this.fxk) { this.fxk = fxk; const fx = q('.rd-fx'); fx.className = 'rd-fx' + (fxk ? ' on ' + fxk : ''); fx.innerHTML = fxk ? Array.from({ length: fxk === 'rain' ? 26 : 22 }, (_, i) => `<i style="left:${(i * 97 % 100)}%;animation-delay:-${(i * 0.37 % 3).toFixed(2)}s;animation-duration:${(fxk === 'rain' ? 0.7 + (i % 5) * 0.12 : 4 + (i % 6) * 0.7).toFixed(2)}s"></i>`).join('') : ''; }
    const live = q('.rd-live'), age = this.fr.length ? Date.now() - this.fr[this.nowIdx] : 0, stale = age > 25 * 6e4 && !this.cfg.mock; live.classList.toggle('st', stale); set('live', live.lastChild, stale ? 'Daten alt' : 'live');
    set('warns', q('.rd-warns'), W.slice(0, this.full ? 99 : 2).map(w => `<button class="rd-w l${w.level} ${w.pre ? 'pre' : ''} ${w.level >= 3 && !w.pre ? 'rdp' : ''}" data-act="warn" data-k="${w.k}" data-i="${w.i}">${ic('alert', 14)}<span>${w.pre ? 'Vorab: ' : ''}${esc(w.name)}${w.end ? ' · bis ' + this.fmtEnd(w.end) : ''}</span></button>`).join('') + (!this.full && W.length > 2 ? `<button class="rd-w more" data-act="radar"><span>+${W.length - 2} weitere</span></button>` : ''));
    if (W.length !== this._wn) { this._wn = W.length; this.warnLayer(); }
    const wd = wi.dir, wc = this.wcol(Math.max(wi.spd || 0, (wi.gust || 0) * 0.7));
    set('wp', q('.rd-wp'), wi.spd == null && wi.gust == null ? '' : `<div class="rd-wc" style="--wc:${wc}"><span class="rd-cp"><em>N</em><svg viewBox="0 0 24 24" style="transform:rotate(${wd != null ? Math.round(wd + 180) : 0}deg)"><path d="M12 3l6 17-6-4-6 4z" fill="currentColor"/></svg></span><div><b>${de(wi.gust ?? wi.spd, 1)} <small>km/h Böen</small></b><s>Wind ${de(wi.spd ?? 0, 1)}${wd != null ? ' · aus ' + RD_CARD[Math.round(wd / 45) % 8] : ''}${wi.mx != null ? ' · max heute ' + de(wi.mx, 1) : ''}</s></div></div>`);
    let bp = ''; if (bi.n) bp = `<div class="rd-bc">${ic('bolt', 16)}<b>${bi.n}</b> ${bi.n === 1 ? 'Blitz' : 'Blitze'}${bi.d != null ? ' · nächster ' + de(bi.d, 0) + ' km' : ''}</div>`; else if (bi.storm) bp = `<div class="rd-bc soft">${ic('bolt', 16)}Gewitter erwartet</div>`;
    set('bp', q('.rd-bp'), bp); this.bolts = bi.S; this.markers(); this.windSetup();
  }
  fmtEnd(iso) { const d = new Date(iso); if (isNaN(d)) return ''; const same = d.toDateString() === new Date().toDateString(); return (same ? '' : d.toLocaleDateString('de-DE', { weekday: 'short' }) + ' ') + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); }
  wcol(v) { return v < 15 ? '#67e8f9' : v < 30 ? '#86efac' : v < 45 ? '#fde047' : v < 60 ? '#fb923c' : '#f87171'; }
  markers() {
    const z = this.z, hx = rdX(this.home.lon, z), hy = rdY(this.home.lat, z), mpp = 156543.03392 * Math.cos(this.home.lat * Math.PI / 180) / 2 ** z, now = Date.now();
    const rings = this.bolts?.length || this.sig.bp ? this.cfg.rings.map(k => `<i class="rd-ring" style="left:${hx}px;top:${hy}px;width:${(2000 * k / mpp).toFixed(1)}px;height:${(2000 * k / mpp).toFixed(1)}px"></i>`).join('') : '';
    const bs = (this.bolts || []).map(s => { const a = (now - s.t) / 6e4, c = a < 3 ? 'n' : a < 60 ? 'o' : 'x'; return `<i class="rd-s ${c}" style="left:${rdX(s.lon, z).toFixed(1)}px;top:${rdY(s.lat, z).toFixed(1)}px" title="${de(s.d, 0)} km · ${this.h._ago(new Date(s.t).toISOString())}">${ic('bolt', 20)}</i>`; }).join('');
    const html = `${rings}${bs}<i class="rd-home" style="left:${hx}px;top:${hy}px"></i>`; if (this.sig.mk !== html) { this.sig.mk = html; this.ovEl.innerHTML = html; }
  }
  /* ── Windschlieren ── */
  initP() { const n = Math.round(Math.max(18, Math.min(90, this.W * this.H / 7000))); this.P = Array.from({ length: n }, () => this.np(true)); }
  np(r) { return { x: Math.random() * this.W, y: Math.random() * this.H, a: r ? Math.random() * 60 : 0, l: 40 + Math.random() * 60 }; }
  windSetup() { const w = this.wi || {}; this.wv = Math.max(w.spd || 0, (w.gust || 0) * 0.6); this.wdir = w.dir; this.wcl = this.wcol(Math.max(w.spd || 0, (w.gust || 0) * 0.7)); if (this.wv < 1.5 || this.wdir == null) this.ctx.clearRect(0, 0, this.W, this.H); }
  raf() {
    cancelAnimationFrame(this._raf); if (this.paused || !this.alive) return;
    const tick = ts => {
      if (this.paused || !this.alive) return; if (!this.root.isConnected) return this.pause();
      if (ts - (this._lf || 0) > 33) { this._lf = ts; this.drawWind(); }
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }
  drawWind() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const g = this.ctx, W = this.W, H = this.H; if (!W || this.wv == null || this.wv < 1.5 || this.wdir == null) return;
    const rad = (this.wdir + 180) * Math.PI / 180, v = 0.5 + Math.min(this.wv, 70) * 0.055, vx = Math.sin(rad) * v, vy = -Math.cos(rad) * v, len = 2 + Math.min(this.wv, 60) * 0.28;
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; g.strokeStyle = this.wcl; g.lineWidth = 1.5; g.lineCap = 'round';
    for (const p of this.P) {
      p.a++; p.x += vx; p.y += vy; if (p.a > p.l || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) { Object.assign(p, this.np(false)); continue; }
      g.globalAlpha = Math.sin(Math.PI * p.a / p.l) * 0.7; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - vx * len, p.y - vy * len); g.stroke();
    } g.globalAlpha = 1;
  }
}

