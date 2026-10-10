  /* ───────────── v13: Kompakt-Vorhersage (stündlich) im Stil der Kachelmann-Kompaktvorhersage ───────────── */
  _wxEnt() { const e = this._c.weatherCompact; return e && this._s(e) ? e : this._c.weather; }
  async _loadFcX(force) {
    const w = this._wxEnt();
    if (this._wxb || (!force && this._wxF && this._wxF.e === w && Date.now() - this._wxF.t < 9e5)) return;
    this._wxb = true;
    let hourly = [];
    try { const r = await this._h.callWS({ type: 'call_service', domain: 'weather', service: 'get_forecasts', service_data: { type: 'hourly' }, target: { entity_id: w }, return_response: true }); hourly = r?.response?.[w]?.forecast || []; } catch (e) { hourly = []; }
    this._wxF = { t: Date.now(), e: w, hourly };
    this._wxb = false;
    if (this._v === 'weather') this._renderSoon();
  }
  _wxBear(b) {
    if (b == null || b === '') return null;
    const n = parseFloat(b); if (!isNaN(n)) return n;
    const M = { N: 0, NNO: 22.5, NO: 45, ONO: 67.5, O: 90, OSO: 112.5, SO: 135, SSO: 157.5, S: 180, SSW: 202.5, SW: 225, WSW: 247.5, W: 270, WNW: 292.5, NW: 315, NNW: 337.5, NNE: 22.5, NE: 45, ENE: 67.5, E: 90, ESE: 112.5, SE: 135, SSE: 157.5 };
    return M[String(b).trim().toUpperCase()] ?? null;
  }
  /* Sonnenauf-/untergang (Näherung nach „Sunrise equation“), day = lokales Datum 00:00 */
  _wxSun(day) {
    const cf = this._h.config || {}, lat = cf.latitude ?? 51.7, lon = cf.longitude ?? 8.4, R = Math.PI / 180;
    const J = Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), 12) / 864e5 + 2440587.5;
    const n = Math.round(J - 2451545.0 + 0.0008), Js = n - lon / 360;
    const M = (357.5291 + 0.98560028 * Js) % 360, Mr = M * R;
    const C = 1.9148 * Math.sin(Mr) + 0.02 * Math.sin(2 * Mr) + 0.0003 * Math.sin(3 * Mr);
    const lam = (M + C + 180 + 102.9372) % 360, lr = lam * R;
    const Jt = 2451545.0 + Js + 0.0053 * Math.sin(Mr) - 0.0069 * Math.sin(2 * lr);
    const dec = Math.asin(Math.sin(lr) * Math.sin(23.44 * R));
    const cw = (Math.sin(-0.833 * R) - Math.sin(lat * R) * Math.sin(dec)) / (Math.cos(lat * R) * Math.cos(dec));
    const w0 = Math.acos(Math.max(-1, Math.min(1, cw))) / R;
    return { rise: (Jt - w0 / 360 - 2440587.5) * 864e5, set: (Jt + w0 / 360 - 2440587.5) * 864e5 };
  }
  _wxGeo() {
    const F = this._wxF; if (!F || F.hourly.length < 6) return null;
    const now = Date.now(), all = F.hourly.filter(d => new Date(d.datetime).getTime() >= now - 36e5 && d.temperature != null);
    const bw = (this._main && this._main.getBoundingClientRect().width) || 0;
    const W = Math.max(290, Math.min(1180, Math.floor((bw || 390) - 62)));
    const span = this._wxSpan || (W < 600 ? 48 : 72);
    const hr = all.slice(0, span).map(d => ({ ...d, ts: new Date(d.datetime).getTime() }));
    if (hr.length < 6) return null;
    return { W, span, hr, N: hr.length };
  }
  _wxChart(G) {
    const { W, hr, N } = G, wide = W > 640, HT = wide ? 220 : 180, L = 32, Rr = 30, pw = W - L - Rr, px = pw / N, T0 = hr[0].ts, T1 = hr[N - 1].ts;
    const X = t => L + (t - T0) / 36e5 * px + px / 2, pt = 8, ph = HT - pt - 3;
    const wu = this._attr(this._wxEnt(), 'wind_speed_unit') || 'km/h', kw = /m\/s/.test(wu) ? 3.6 : /mph/.test(wu) ? 1.609 : 1;
    const T = hr.map(d => d.temperature), D = hr.map(d => d.dew_point != null ? d.dew_point : d.temperature), P = hr.map(d => d.precipitation || 0);
    const lo = Math.min(...T, ...D), hi = Math.max(...T, ...D), steps = [2, 4, 5, 8, 10, 20];
    const step = steps.find(s => Math.ceil(hi / s) - Math.floor(lo / s) <= 5) || 20;
    let y0 = Math.floor(lo / step) * step, y1 = Math.ceil(hi / step) * step; if (y1 - y0 < step * 2) y1 = y0 + step * 2;
    const nl = Math.round((y1 - y0) / step) + 1, Y = v => pt + (1 - (v - y0) / (y1 - y0)) * ph;
    const pm = Math.max(...P), q = [0.25, 0.5, 1, 2, 5, 10, 20].find(v => v * (nl - 1) >= Math.max(pm, 0.01)) || 20, rm = q * (nl - 1);
    const fmt = v => (Math.round(v * 100) / 100).toString().replace('.', ',');
    let g = '';
    /* Nacht */
    const d0 = new Date(T0); d0.setHours(0, 0, 0, 0); const sun = [];
    for (let k = -1; k <= Math.ceil(N / 24) + 1; k++) sun.push(this._wxSun(new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + k)));
    for (let k = 0; k < sun.length - 1; k++) { const a = Math.max(sun[k].set, T0 - 18e5), b = Math.min(sun[k + 1].rise, T1 + 18e5); if (b > a) { const xa = Math.max(L, X(a)), xb = Math.min(L + pw, X(b)); if (xb > xa) g += `<rect class="wxn" x="${xa.toFixed(1)}" y="0" width="${(xb - xa).toFixed(1)}" height="${HT}"/>`; } }
    /* Gitter + Achsen */
    for (let k = 0; k < nl; k++) {
      const v = y0 + k * step, yy = Y(v).toFixed(1);
      g += `<line class="gl" x1="${L}" x2="${L + pw}" y1="${yy}" y2="${yy}"/><text x="${L - 6}" y="${yy}" text-anchor="end" dy=".35em">${v}°</text><text x="${L + pw + 6}" y="${yy}" dy=".35em" class="mm">${fmt(k * q)}</text>`;
    }
    /* Tageswechsel + Tageslabels */
    const days = []; const mids = [];
    for (let k = 0; k <= Math.ceil(N / 24) + 1; k++) { const m = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + k).getTime(); mids.push(m); if (m > T0 && m < T1) g += `<line class="dl" x1="${X(m).toFixed(1)}" x2="${X(m).toFixed(1)}" y1="0" y2="${HT}"/>`; }
    const todayK = new Date(); todayK.setHours(0, 0, 0, 0);
    for (let k = 0; k < mids.length - 1; k++) {
      const a = Math.max(mids[k], T0), b = Math.min(mids[k + 1], T1 + 36e5); if (b <= a) continue;
      const xa = Math.max(L, X(a) - (a === T0 ? px / 2 : 0)), xb = Math.min(L + pw, X(b) - px / 2); if (xb - xa < 22) continue;
      const dd = new Date(mids[k]);
      days.push(`<div class="wxd" style="left:${xa.toFixed(1)}px;width:${(xb - xa).toFixed(1)}px${a === T0 && xb - xa < 110 ? ';justify-content:flex-start;padding-left:6px;box-sizing:border-box' : ''}">${mids[k] === todayK.getTime() ? 'Heute' : dd.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '')}${xb - xa > 80 ? `<small>${dd.getDate()}.${dd.getMonth() + 1}.</small>` : ''}</div>`);
    }
    /* Regen */
    const bwid = Math.max(1.6, px * 0.78);
    P.forEach((v, i) => { if (v > 0.001) { const h = Math.max(1.5, Math.min(1, v / rm) * ph); g += `<rect class="wxr" x="${(X(hr[i].ts) - bwid / 2).toFixed(1)}" y="${(pt + ph - h).toFixed(1)}" width="${bwid.toFixed(1)}" height="${h.toFixed(1)}" rx="1.4"/>`; } });
    /* Kurven */
    const pts = hr.map((d, i) => [X(d.ts), Y(T[i])]), dpts = hr.map((d, i) => [X(d.ts), Y(D[i])]);
    g += `<defs><linearGradient id="wxg" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${Y(y1).toFixed(1)}" y2="${Y(y0).toFixed(1)}"><stop offset="0" stop-color="#fb923c"/><stop offset=".5" stop-color="#fbbf24"/><stop offset="1" stop-color="#60a5fa"/></linearGradient></defs>`;
    g += `<path class="wxp" d="${smooth(dpts)}"/><path class="tp" stroke="url(#wxg)" d="${smooth(pts)}"/>`;
    g += `<line class="wxcl" x1="0" x2="0" y1="0" y2="${HT}" style="display:none"/><circle class="wxcd" r="5" cx="0" cy="0" style="display:none"/>`;
    /* Symbole + Wind */
    const pick = min => [1, 2, 3, 6, 12, 24].find(s => s * px >= min) || 24;
    const top = 54, wt = top + HT + 6, tot = wt + 38;
    const si = pick(wide ? 34 : 28), sw = pick(wide ? 30 : 26), isz = wide ? 28 : 24;
    const onGrid = (d, s) => s === 24 ? new Date(d.ts).getHours() === 12 : new Date(d.ts).getHours() % s === 0;
    let ic1 = '', wnd = '';
    hr.forEach(d => {
      if (onGrid(d, si)) ic1 += `<div class="wxi" style="left:${X(d.ts).toFixed(1)}px">${wx(d.condition, isz)}</div>`;
      if (onGrid(d, sw)) {
        const b = this._wxBear(d.wind_bearing), v = d.wind_speed != null ? d.wind_speed * kw : null; if (b == null || v == null) return;
        const col = v >= 50 ? '#fb7185' : v >= 30 ? '#fbbf24' : 'currentColor';
        wnd += `<div class="wxw" style="top:${wt}px;left:${X(d.ts).toFixed(1)}px;color:${col}"><svg width="16" height="16" viewBox="0 0 16 16" style="transform:rotate(${Math.round(b + 180)}deg)"><path d="M8 1.5 12.6 9H9.3v5.5H6.7V9H3.4z" fill="currentColor"/></svg>${Math.round(v)}</div>`;
      }
    });
    this._wxG = { G, L, px, N, hr, T0, X, Y, HT, top, W, pw, kw, wu, T, D, P };
    return `<div class="wxc" data-w="${W}" style="width:${W}px;height:${tot}px">${days.join('')}${ic1}<svg class="wxs" width="${W}" height="${HT}" viewBox="0 0 ${W} ${HT}" style="top:${top}px">${g}</svg>${wnd}<div class="wxt" style="display:none"></div></div>`;
  }
  _wxTip(i) {
    const Q = this._wxG, d = Q.hr[i], x = Q.X(d.ts), v = Q.kw, f = (a, u, n = 0) => a == null ? '–' : de(a * (u || 1), n);
    const dt = new Date(d.ts);
    return { x, y: Q.Y(Q.T[i]), html: `<div class="wxth"><b>${dt.toLocaleDateString('de-DE', Q.W < 600 ? { weekday: 'short', day: 'numeric', month: 'numeric' } : { weekday: 'long', day: 'numeric', month: 'long' })}, ${hhmm(d.ts)} Uhr</b></div><div class="wxtl">
      <div class="wxtr"><i class="wxdt t"></i>Temperatur<b>${de(d.temperature, 1)} °C</b></div>
      ${d.dew_point != null ? `<div class="wxtr"><i class="wxdt"></i>Taupunkt<b>${de(d.dew_point, 1)} °C</b></div>` : ''}
      ${d.wind_gust_speed != null ? `<div class="wxtr"><i class="wxdt"></i>Windböen<b>${Math.round(d.wind_gust_speed * v)} ${esc(Q.wu === 'm/s' ? 'km/h' : Q.wu)}</b></div>` : ''}
      ${d.wind_speed != null ? `<div class="wxtr"><i class="wxdt"></i>Mittelwind<b>${Math.round(d.wind_speed * v)} ${esc(Q.wu === 'm/s' ? 'km/h' : Q.wu)}</b></div>` : ''}
      <div class="wxtr"><i class="wxdt r"></i>Niederschlag<b>${de(d.precipitation || 0, 1)} mm</b></div></div><div class="wxti">${wx(d.condition, 38)}<span>${COND[d.condition] || ''}</span></div>` };
  }
  _wxCur(c, i) {
    const Q = this._wxG; if (!Q || !c) return;
    const t = this._wxTip(i), s = c.querySelector('svg.wxs'), ln = s.querySelector('.wxcl'), dot = s.querySelector('.wxcd'), tip = c.querySelector('.wxt');
    ln.setAttribute('x1', t.x); ln.setAttribute('x2', t.x); ln.style.display = ''; dot.setAttribute('cx', t.x); dot.setAttribute('cy', t.y); dot.style.display = '';
    tip.innerHTML = t.html; tip.style.display = '';
    const nar = Q.W < 600, tw = nar ? 168 : 252, left = t.x > Q.W * 0.52 ? Math.max(0, t.x - 12 - tw) : Math.min(Q.W - tw, t.x + 12);
    tip.classList.toggle('nar', nar);
    tip.style.left = left + 'px'; tip.style.top = (Q.top + (nar ? 2 : 6)) + 'px'; tip.style.width = tw + 'px';
  }
  _wxPtr(ev, ty) {
    if (ty === 'u') { this._wxDrag = false; return; }
    const c = ev.target && ev.target.closest ? ev.target.closest('.wxc') : null, Q = this._wxG;
    if (!c || !Q) return;
    if (ty === 'd') { this._wxDrag = true; this._busy = true; } else if (!this._wxDrag && ev.pointerType !== 'mouse') return;
    const x = ev.clientX - c.getBoundingClientRect().left, i = Math.max(0, Math.min(Q.N - 1, Math.round((x - Q.L - Q.px / 2) / Q.px)));
    this._wxSelT = Q.hr[i].ts; this._wxCur(c, i);
  }
  _wxCard() {
    const G = this._wxGeo(); if (!G) return this._wxF && !this._wxF.hourly.length && this._wxF.t ? '' : null;
    const src = this._attr(this._wxEnt(), 'friendly_name') || '', n = G.hr.length;
    const chips = [[48, '48 h'], [72, '3 Tage'], [120, '5 Tage'], [216, '9 Tage']].map(x => `<button class="qfc ${x[0] === G.span ? 'on' : ''}" data-act="wxspan" data-n="${x[0]}">${x[1]}</button>`).join('');
    const ch = this._wxChart(G);
    return `<div class="h">${ic('cloudsun', 14)}Vorhersage kompakt<span class="r">${esc(src)}</span></div><div class="qfl wxsp">${chips}</div><div class="wxwrap">${ch}</div><div class="card-note" style="margin-top:6px">Tippen oder wischen für Details · Temperatur (Linie), Taupunkt (gestrichelt), Regen (Balken, mm), Wind (Pfeile in km/h) · Nacht dunkel hinterlegt</div>`;
  }
  _wxRestore() {
    const Q = this._wxG, c = this.shadowRoot && this.shadowRoot.querySelector('.wxc'); if (!Q || !c || !this._wxSelT) return;
    const i = Q.hr.findIndex(d => d.ts === this._wxSelT); if (i >= 0) this._wxCur(c, i);
  }
  /* ───────────── v14: 14-Tage-Trend (Kachelmann) – gleiche Bauweise wie die Kompakt-Vorhersage ───────────── */
  _trDays() {
    const e = this._c.trend, a = e && this._s(e) ? this._s(e).attributes : null, d = a && Array.isArray(a.days) ? a.days : null;
    if (!d || d.length < 3) return null;
    const CW = { clear: 'sunny', scattered: 'partlycloudy', broken: 'cloudy', overcast: 'cloudy' };
    return d.slice(0, 14).map(x => {
      const dt = new Date(x.date + 'T12:00:00');
      let cond = x.condition;
      if (!cond) cond = (x.precipitation_type && (x.precipitation || 0) >= 1) ? 'rainy' : (CW[x.cloud_word] || 'cloudy');
      return { ...x, dt, cond, hi: x.temp_max, lo: x.temp_min, hh: x.temp_max_high ?? x.temp_max, hl: x.temp_max_low ?? x.temp_max, lh: x.temp_min_high ?? x.temp_min, ll: x.temp_min_low ?? x.temp_min };
    });
  }
  _trGeo() {
    const D0 = this._trDays(); if (!D0) return null;
    const bw = (this._main && this._main.getBoundingClientRect().width) || 0, W = Math.max(290, Math.min(1180, Math.floor((bw || 390) - 62)));
    const span = this._trSpan || (W < 600 ? 10 : 14), D = D0.slice(0, span);
    return { W, span, D, n: D.length };
  }
  _trChart(G) {
    const { W, D, n } = G, wide = W > 640, HT = wide ? 220 : 170, L = 32, Rr = 30, pw = W - L - Rr, colW = pw / n, X = i => L + colW * (i + 0.5), pt = 8, ph = HT - pt - 3, top = 54;
    const vals = D.flatMap(d => [d.hh, d.hl, d.lh, d.ll, d.hi, d.lo]).filter(v => v != null), lo = Math.min(...vals), hi = Math.max(...vals), steps = [2, 4, 5, 8, 10, 20];
    const step = steps.find(s => Math.ceil(hi / s) - Math.floor(lo / s) <= 5) || 20;
    let y0 = Math.floor(lo / step) * step, y1 = Math.ceil(hi / step) * step; if (y1 - y0 < step * 2) y1 = y0 + step * 2;
    const nl = Math.round((y1 - y0) / step) + 1, Y = v => pt + (1 - (v - y0) / (y1 - y0)) * ph;
    const pm = Math.max(...D.map(d => d.precipitation || 0)), q = [0.25, 0.5, 1, 2, 5, 10, 20, 50].find(v => v * (nl - 1) >= Math.max(pm, 0.01)) || 50, rm = q * (nl - 1);
    const fmt = v => (Math.round(v * 100) / 100).toString().replace('.', ',');
    let g = '';
    /* Wochenende dunkel hinterlegt (wie die Nacht in der Kompakt-Vorhersage) */
    D.forEach((d, i) => { if (d.is_weekend) g += `<rect class="wxn" x="${(L + colW * i).toFixed(1)}" y="0" width="${colW.toFixed(1)}" height="${HT}"/>`; });
    /* Gitter + Achsen */
    for (let k = 0; k < nl; k++) {
      const v = y0 + k * step, yy = Y(v).toFixed(1);
      g += `<line class="gl" x1="${L}" x2="${L + pw}" y1="${yy}" y2="${yy}"/><text x="${L - 6}" y="${yy}" text-anchor="end" dy=".35em">${v}°</text><text x="${L + pw + 6}" y="${yy}" dy=".35em" class="mm">${fmt(k * q)}</text>`;
    }
    /* Wochenwechsel */
    D.forEach((d, i) => { if (i > 0 && d.dt.getDay() === 1) g += `<line class="dl" x1="${(L + colW * i).toFixed(1)}" x2="${(L + colW * i).toFixed(1)}" y1="0" y2="${HT}"/>`; });
    /* Regen */
    const bwid = Math.max(4, Math.min(colW * 0.4, 34));
    D.forEach((d, i) => { const p = d.precipitation || 0; if (p > 0.04) { const h = Math.max(1.5, Math.min(1, p / rm) * ph), pr = (d.precipitation_probability_1mm ?? 100) / 100; g += `<rect class="wxr" style="opacity:${(0.45 + 0.4 * pr).toFixed(2)}" x="${(X(i) - bwid / 2).toFixed(1)}" y="${(pt + ph - h).toFixed(1)}" width="${bwid.toFixed(1)}" height="${h.toFixed(1)}" rx="2"/>`; } });
    /* Bandbreite + Linien */
    const band = (up, lw) => { const u = D.map((d, i) => [X(i), Y(d[up])]), l = D.map((d, i) => [X(i), Y(d[lw])]).reverse(); return `${smooth(u)}L${l[0][0].toFixed(1)} ${l[0][1].toFixed(1)}${smooth(l).replace(/^M[^C]*/, '')}Z`; };
    if (D.every(d => d.hh != null && d.hl != null)) g += `<path class="trb h" d="${band('hh', 'hl')}"/>`;
    if (D.every(d => d.lh != null && d.ll != null)) g += `<path class="trb l" d="${band('lh', 'll')}"/>`;
    const line = k => { const run = D.map((d, i) => d[k] != null ? [X(i), Y(d[k])] : null).filter(Boolean); return run.length > 1 ? smooth(run) : ''; };
    g += `<path class="trl h" d="${line('hi')}"/><path class="trl l" d="${line('lo')}"/>`;
    const lab = (x, y, t, c) => `<g class="trp"><rect x="${(x - 11).toFixed(1)}" y="${(y - 8).toFixed(1)}" width="22" height="15" rx="7"/><text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="middle" fill="${c}" dy="0">${Math.round(t)}°</text></g>`;
    D.forEach((d, i) => { if (colW < 24 && i % 2) return; if (d.hi != null) g += lab(X(i), Y(d.hi) - 12, d.hi, '#fda4af'); if (d.lo != null) g += lab(X(i), Y(d.lo) + 14, d.lo, '#93c5fd'); });
    /* Auswahl-Cursor */
    const sel = this._trI != null && this._trI < n ? this._trI : null;
    if (sel != null) { const d = D[sel], yv = d.hi ?? (d.hl != null && d.hh != null ? (d.hl + d.hh) / 2 : y0); g += `<line class="wxcl" x1="${X(sel).toFixed(1)}" x2="${X(sel).toFixed(1)}" y1="0" y2="${HT}"/><circle class="wxcd" r="5" cx="${X(sel).toFixed(1)}" cy="${Y(yv).toFixed(1)}"/>`; }
    /* Sonnenanteil (Streifen unter dem Diagramm) */
    D.forEach((d, i) => { const s = Math.max(0, Math.min(100, d.sun_hours_relative ?? 0)) / 100; g += `<rect class="trs" style="opacity:${(0.2 + s * 0.8).toFixed(2)}" x="${(L + colW * i + 2).toFixed(1)}" y="${HT + 8}" width="${(colW - 4).toFixed(1)}" height="14" rx="5"/>`; });
    D.forEach((d, i) => { g += `<rect class="trhit" data-act="trsel" data-i="${i}" x="${(L + colW * i).toFixed(1)}" y="0" width="${colW.toFixed(1)}" height="${HT + 26}"/>`; });
    /* Tageslabels + Symbole (wie in der Kompakt-Vorhersage) */
    const isz = wide ? 28 : 22, tk = new Date(); tk.setHours(0, 0, 0, 0);
    const days = D.map((d, i) => { const dn = d.dt.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', ''); return `<div class="wxd" style="left:${(L + colW * i).toFixed(1)}px;width:${colW.toFixed(1)}px">${dn}${colW > 62 ? `<small>${d.dt.getDate()}.${d.dt.getMonth() + 1}.</small>` : ''}</div>`; }).join('');
    const icons = D.map((d, i) => `<div class="wxi" style="left:${X(i).toFixed(1)}px">${wx(d.cond, isz)}</div>`).join('');
    const nar = W < 600;
    let tip = '';
    if (sel != null) {
      const d = D[sel], f = (v, k = 0) => v == null ? '–' : de(v, k), rg = (a, b, k = 0) => nar || a == null || b == null ? '' : ` <small>(${de(a, k)}–${de(b, k)})</small>`;
      const tw = nar ? 168 : 280, x = X(sel), left = x > W * 0.52 ? Math.max(0, x - 12 - tw) : Math.min(W - tw, x + 12);
      const mid = (a, b) => a != null && b != null ? (a + b) / 2 : null;
      tip = `<div class="wxt${nar ? ' nar' : ''}" style="left:${left.toFixed(0)}px;top:${top + (nar ? 2 : 6)}px;width:${tw}px"><div class="wxth"><b>${d.dt.toLocaleDateString('de-DE', nar ? { weekday: 'short', day: 'numeric', month: 'numeric' } : { weekday: 'long', day: 'numeric', month: 'long' })}</b></div>
        <div class="wxtl"><div class="wxtr"><i class="wxdt t"></i>Höchstwert<b>${f(d.hi ?? mid(d.hl, d.hh))} °C${rg(d.hl, d.hh)}</b></div>
        <div class="wxtr"><i class="wxdt b"></i>Tiefstwert<b>${f(d.lo ?? mid(d.ll, d.lh))} °C${rg(d.ll, d.lh)}</b></div>
        <div class="wxtr"><i class="wxdt r"></i>Niederschlag<b>${f(d.precipitation, 1)} mm${rg(d.precipitation_low, d.precipitation_high, 1)}</b></div>
        <div class="wxtr"><i class="wxdt"></i>Regen ≥ 1 mm<b>${f(d.precipitation_probability_1mm)} %</b></div>
        <div class="wxtr"><i class="wxdt s"></i>Sonne<b>${f(d.sun_hours, 1)} h${d.sun_hours_relative != null ? ` <small>(${f(d.sun_hours_relative)} %)</small>` : ''}</b></div></div><div class="wxti">${wx(d.cond, 38)}<span>${COND[d.cond] || ''}</span></div></div>`;
    }
    return `<div class="trw" data-w="${W}" style="width:${W}px;height:${top + HT + 30}px">${days}${icons}<svg class="wxs" width="${W}" height="${HT + 26}" viewBox="0 0 ${W} ${HT + 26}" style="top:${top}px">${g}</svg>${tip}</div>`;
  }
  _trCard() {
    const G = this._trGeo(); if (!G) return null;
    const chips = [[7, '7 Tage'], [10, '10 Tage'], [14, '14 Tage']].map(x => `<button class="qfc ${x[0] === G.span ? 'on' : ''}" data-act="trspan" data-n="${x[0]}">${x[1]}</button>`).join('');
    return `<div class="h">${ic('cloudsun', 14)}14-Tage-Trend<span class="r">Kachelmann</span></div><div class="qfl wxsp">${chips}</div><div class="wxwrap">${this._trChart(G)}</div><div class="card-note" style="margin-top:6px">Tippen für Details · Höchst- (rot) und Tiefstwert (blau) mit Bandbreite der Prognose, Regen (Balken, mm), Sonnenanteil (gelb) · Wochenende dunkel hinterlegt</div>`;
  }
