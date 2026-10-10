  /* ───────────── Hintergrund-Effekte (Regen, Schnee, Sterne, Glühpunkte) ───────────── */
  _fxKind() {
    const c = this._val(this._c.weather), night = this._app.dataset.tod === 'night';
    let k = /rainy|pouring/.test(c || '') ? 'rain' : /snowy|hail/.test(c || '') ? 'snow' : (night || c === 'clear-night') ? 'stars' : 'motes';
    if (this._light && k !== 'rain') k = 'none';
    if (k !== this._fx.kind) { this._fx = { kind: k, p: [] }; }
  }
  _fxStart() {
    if (this._fxRaf || this._amb || !this._cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = this._cv, ctx = cv.getContext('2d');
    let last = 0;
    const loop = (ts = performance.now()) => {
      this._fxRaf = requestAnimationFrame(loop);
      if (last && ts - last < 32) return;
      const k = last ? Math.min(3, (ts - last) / 16.7) : 1; last = ts;
      const dpr = Math.min(2, window.devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight;
      if (!W || !H) return;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); this._fx.p = []; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const f = this._fx, vh = Math.min(H, 1400);
      if (!f.p.length) {
        const n = { rain: 130, snow: 80, stars: 70, motes: 26 }[f.kind] || 0;
        f.p = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * vh, v: .5 + Math.random(), r: Math.random(), a: Math.random() * 6.28 }));
      }
      for (const p of f.p) {
        if (f.kind === 'rain') { p.y += 9 * p.v * k; p.x -= 1.6 * p.v * k; if (p.y > vh) { p.y = -20; p.x = Math.random() * W; } ctx.strokeStyle = `rgba(147,197,253,${.12 + .2 * p.r})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 3, p.y + 14 * p.v); ctx.stroke(); }
        else if (f.kind === 'snow') { p.y += .7 * p.v * k; p.a += .01 * k; p.x += Math.sin(p.a) * .5 * k; if (p.y > vh) { p.y = -6; p.x = Math.random() * W; } ctx.fillStyle = `rgba(255,255,255,${.25 + .4 * p.r})`; ctx.beginPath(); ctx.arc(p.x, p.y, 1 + 2 * p.r, 0, 6.28); ctx.fill(); }
        else if (f.kind === 'stars') { p.a += .02 * p.v * k; ctx.fillStyle = `rgba(255,255,255,${.1 + .5 * Math.abs(Math.sin(p.a))})`; ctx.beginPath(); ctx.arc(p.x, p.y * .6, .6 + 1.2 * p.r, 0, 6.28); ctx.fill(); }
        else { p.y -= .12 * p.v * k; p.x += Math.sin(p.a += .004 * k) * .15 * k; if (p.y < -10) { p.y = vh + 10; p.x = Math.random() * W; } const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7 + 9 * p.r); g.addColorStop(0, `rgba(180,230,255,${.22 + .2 * p.r})`); g.addColorStop(1, 'rgba(180,230,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, 6.28); ctx.fill(); }
      }
    };
    loop();
  }
  _fxStop() { cancelAnimationFrame(this._fxRaf); this._fxRaf = 0; }
}


