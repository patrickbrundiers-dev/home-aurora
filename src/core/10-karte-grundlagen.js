class HomeAurora extends HTMLElement {
  constructor() {
    super();
    this._v = 'home'; this._sheet = null; this._hist = {}; this._fc = null; this._need = new Set();
    this._enter = true; this._counted = false; this._sig = ''; this._fx = { kind: '', p: [] };
    this._cal = null; this._calOff = new Set(); this._wxMode = 'fc'; this._pw = null; this._sys = null; this._amb = false; this._rweb = false; this._lastAct = Date.now(); this._lastRender = 0;
    this.attachShadow({ mode: 'open' });
  }

  /* ───────────── Lebenszyklus ───────────── */
  setConfig(cfg) {
    const c = cfg || {};
    this._c = Object.assign({}, DEFAULTS, c, { outdoor: { ...DEFAULTS.outdoor, ...(c.outdoor || {}) }, stats: { ...DEFAULTS.stats, ...(c.stats || {}) }, extras: { ...DEFAULTS.extras, ...(c.extras || {}) }, bath: { ...DEFAULTS.bath, ...(c.bath || {}) }, station: { ...DEFAULTS.station, ...(c.station || {}) }, alerts: { ...DEFAULTS.alerts, ...(c.alerts || {}) }, plant: { ...DEFAULTS.plant, ...(c.plant || {}) }, printer: { ...DEFAULTS.printer, ...(c.printer || {}) }, power: { ...DEFAULTS.power, ...(c.power || {}) }, wasteNames: { ...DEFAULTS.wasteNames, ...(c.wasteNames || {}) }, shopping: { ...DEFAULTS.shopping, ...(c.shopping || {}) } });
    this._c.rooms = (this._c.rooms || []).map(r => ({ ...r })); // eigene Kopie: die Heizungserkennung ergänzt Räume
    try { this._themePref = localStorage.getItem('home-aurora-theme'); this._ambPref = localStorage.getItem('home-aurora-amb'); this._nightPref = localStorage.getItem('home-aurora-ambnight'); this._fuPref = localStorage.getItem('home-aurora-fully'); this._pzvPref = localStorage.getItem('home-aurora-pzview'); this._pzsPref = localStorage.getItem('home-aurora-pzshow'); this._shsPref = localStorage.getItem('home-aurora-shopshow'); } catch (e) { /* kein Speicher */ }
    const w = new Set();
    const walk = o => { if (typeof o === 'string') { if (/^[a-z_]+\.[a-z0-9_]+$/.test(o)) w.add(o); } else if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') Object.values(o).forEach(walk); };
    walk(this._c);
    this._pid = this._c.printer.prefix.replace(/^sensor\./, '');
    this._watch = [...w];
    this._build();
  }
  set hass(h) { this._h = h; if (this._built) this._tick(); }
  get hass() { return this._h; }
  getCardSize() { return 12; }
  static getStubConfig() { return {}; }
  static getConfigElement() { return document.createElement('@@TAG@@-editor'); }
  connectedCallback() {
    this._clk = setInterval(() => this._clockTick(), 1000); this._fxStart();
    this._actFn = () => { this._lastAct = Date.now(); };
    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(t => window.addEventListener(t, this._actFn, { passive: true }));
  }
  disconnectedCallback() {
    clearInterval(this._clk); clearTimeout(this._camT); this._camBound = false; this._fxStop();
    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(t => window.removeEventListener(t, this._actFn));
    this._ambOff(); this._rdr?.destroy(); this._rdr = null;
  }

  _build() {
    this.shadowRoot.innerHTML = `<style>${CSS}${CSS2}${CSS3}${CSS4}</style>
      <div class="app" data-tod="night">
        <div class="bg"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="blob b4"></div><canvas class="fx"></canvas><div class="grain"></div></div>
        <div class="shell"><nav></nav><main></main></div>
        <div class="ov"><div class="sheet"></div></div><div class="amb"></div><div class="toast"></div>
      </div>`;
    const r = this.shadowRoot;
    this._app = r.querySelector('.app'); this._nav = r.querySelector('nav'); this._main = r.querySelector('main');
    this._ov = r.querySelector('.ov'); this._sh = r.querySelector('.sheet'); this._cv = r.querySelector('canvas.fx'); this._tst = r.querySelector('.toast'); this._amb_el = r.querySelector('.amb');
    this._amb_el.addEventListener('pointerdown', ev => { this._swallow = Date.now() + 800; ev.preventDefault(); this._ambOff(true); });
    this._applyTheme();
    this._built = true;
    this._events(r);
    if (this._h) { this._sig = ''; this._tick(); }
    if (this.isConnected) this._fxStart();
  }

  _tick() {
    const h = this._h; let sig = this._isLight() + '|';
    for (const e of this._watch) sig += (h.states[e]?.last_updated || '-') + '|';
    for (const k of this._xIds()) sig += (h.states[k]?.last_updated || '-');
    const va = h.states[this._c.stats.vent]?.attributes?.raeume; if (va) for (const r of va) if (r.entity_id) sig += (h.states[r.entity_id]?.last_updated || '-');
    if (sig === this._sig) return;
    if (this._rweb && this._v === 'weather' && Date.now() - this._lastRender < 3e5) return;
    this._sig = sig;
    if (this._busy) { this._dirty = true; return; }
    const gap = Date.now() - this._lastRender;
    if (gap < 1200) { if (!this._rt) this._rt = setTimeout(() => { this._rt = 0; if (!this._busy) this._render(); else this._dirty = true; }, 1200 - gap); return; }
    cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => this._render());
  }

  /* Weitere Entitäten, deren Änderung neu zeichnet (Lichter, Timer, Batterien, Kontakte, Drucker, Putzplan, Thermostat-Pläne).
     Die Suche über alle Entitäten kostet bei ~2.500 Entitäten spürbar Zeit pro HA-Update, darum wird die Liste
     gemerkt und nur jede Minute (oder wenn eine gemerkte Entität verschwindet) neu aufgebaut. */
  _xIds() {
    const h = this._h, now = Date.now();
    if (this._xw && now - this._xwT < 6e4 && this._xw.every(k => k in h.states)) return this._xw;
    const l = [], dhs = [];
    for (const k in h.states) if (k.startsWith('sensor.') && h.states[k].attributes?.thermostat_setpoints) dhs.push(h.states[k]);
    l.push(...this._heatScan(dhs));
    this._loadPlans();
    for (const k in h.states) if (k.startsWith('light.') || (k.startsWith('sensor.') && k.includes('timer')) || this._isBat(k) || this._isContact(k) || k.includes(this._pid) || h.states[k].attributes?.putzplan_task || (k.startsWith('text.') && k.includes('_schedule_'))) l.push(k);
    this._xw = l; this._xwT = now;
    return l;
  }

  /* ───────────── Daten-Helfer ───────────── */
  _s(e) { return this._h.states[e]; }
  _val(e) { const s = e && this._h.states[e]; return s ? s.state : undefined; }
  _num(e) { const v = parseFloat(this._val(e)); return isNaN(v) ? null : v; }
  _attr(e, a) { return this._h.states[e]?.attributes?.[a]; }
  _name(e) { const n = this._attr(e, 'friendly_name'); return n ? (String(n).replace(/^[A-Z0-9]{2,6}_[A-Z0-9]{10,}\s+(?=\S)/, '') || n) : e; }
  _unit(e) { return this._attr(e, 'unit_of_measurement') || ''; }
  _lights() { return this._memo('lights', () => Object.keys(this._h.states).filter(k => k.startsWith('light.') && this._h.states[k].state !== 'unavailable').sort((a, b) => this._name(a).localeCompare(this._name(b), 'de'))); }
  _lightsOn() { return this._lights().filter(e => this._val(e) === 'on'); }
  _glow(on) {
    const cs = on.map(e => this._attr(e, 'rgb_color')).filter(Boolean);
    if (!cs.length) return '251,191,36';
    return [0, 1, 2].map(i => Math.round(cs.reduce((a, c) => a + c[i], 0) / cs.length)).join(',');
  }
  /* Heizungssteuerung eines Raums – für jede Heizung gleich, egal welche Integration dahintersteckt:
     • „Dynamische Heizungssteuerung“ (dynamic_heating, Schlüssel heat): regelt mehrere Thermostate, Ziel und Status kommen vom Sensor.
     • Blueprint „Advanced Heating Control“: Automatik = Automation an, Ziel steht direkt am Thermostat.
     • sonst nur das Thermostat (Manuell/Aus).
     Ergebnis: auto (Automatik aktiv), mode (heat/off), act (heating/idle), target, label, trv (alle Thermostate),
     kind ('dh' | 'ahc' | null) und sw (Schalter bzw. Automation der Automatik). */
  _dh(r) {
    if (!r.climate) return null;
    const trv = [r.climate, ...(r.climate_more || [])].map(e => this._s(e)).filter(Boolean);
    const heating = trv.some(s => { const x = s.attributes; return x.hvac_action === 'heating' || (x.hvac_action == null && s.state !== 'off' && x.temperature != null && x.current_temperature != null && x.temperature > x.current_temperature + 0.2); });
    const mode = trv.length && trv.every(s => s.state === 'off') ? 'off' : 'heat', act = heating ? 'heating' : 'idle', t0 = trv[0]?.attributes.temperature;
    if (r.heat) {
      const st = this._s(r.heat.status), a = st?.attributes || {}, auto = this._val(r.heat.switch) === 'on' && a.enabled !== false;
      // neuere Integration: Betriebsart-Auswahl + eigenes Raum-Thermostat (Ziel und „heizt gerade“ kommen von dort)
      const X = r.heat.status ? this._dhX(r.heat.status) : null, sel = X ? this._val(X.mode) : null;
      if (X && okv(sel)) {
        const rx = (X.cl && this._s(X.cl)?.attributes) || {}, aut = auto && sel === 'Automatik', off = auto ? sel === 'Aus' : mode === 'off';
        const act2 = rx.hvac_action ? (rx.hvac_action === 'heating' ? 'heating' : 'idle') : act;
        return { kind: 'dh', x: X, sel, on: auto, sw: r.heat.switch, st, a, auto: aut, trv, mode: off ? 'off' : 'heat', act: off ? 'idle' : act2, target: rx.temperature ?? a.current_setpoint ?? a.target_temperature ?? t0, label: st && okv(st.state) ? st.state : '' };
      }
      const target = auto ? (a.current_setpoint ?? a.target_temperature ?? t0) : t0;
      return { kind: 'dh', sw: r.heat.switch, st, a, auto, trv, mode, act, target, label: st && okv(st.state) ? st.state : '' };
    }
    const p = this._plans?.map[r.id], auto = !!p && this._val(p.auto) === 'on';
    let label = '';
    if (auto) { const P = this._plan(r); if (P?.mode) label = 'Plan ' + P.mode; }
    return { kind: p ? 'ahc' : null, sw: p?.auto || null, st: null, a: {}, auto, trv, mode, act, target: t0, label };
  }
  _room(r) {
    let cl = r.climate ? this._s(r.climate) : null;
    const dh = cl ? this._dh(r) : null;
    if (dh) cl = { ...cl, state: dh.mode, attributes: { ...cl.attributes, temperature: dh.target, current_temperature: (r.temp && this._num(r.temp)) ?? cl.attributes.current_temperature, hvac_action: dh.act } };
    const lights = (r.lights || []).filter(e => this._s(e) && this._val(e) !== 'unavailable');
    const on = lights.filter(e => this._val(e) === 'on');
    const win = (r.window || []).filter(e => this._s(e));
    return {
      temp: r.temp ? this._num(r.temp) : null, hum: r.hum ? this._num(r.hum) : null, cl, lights, on, win,
      open: win.some(e => this._val(e) === 'on'), stale: r.temp ? this._stale(r.temp) : null, target: cl?.attributes?.temperature, act: cl?.attributes?.hvac_action, mode: cl?.state, glow: this._glow(on), dh,
    };
  }
  _openRooms() { return this._c.rooms.filter(r => this._room(r).open).map(r => r.name); }
  _openSince() { let t = null; for (const r of this._c.rooms) for (const e of (r.window || [])) { const s = this._s(e); if (s && s.state === 'on') { const x = new Date(s.last_changed).getTime(); if (!isNaN(x) && (t == null || x < t)) t = x; } } return t; }
  _since(t) {
    if (t == null) return '';
    const m = Math.max(0, Math.round((Date.now() - t) / 6e4));
    if (m < 2) return 'gerade geöffnet';
    if (m < 60) return `seit ${m} Min.`;
    if (m < 1440) { const h = Math.floor(m / 60), r = m % 60; return `seit ${h} Std.${r >= 5 ? ' ' + r + ' Min.' : ''}`; }
    const d = Math.floor(m / 1440); return `seit ${d} ${d === 1 ? 'Tag' : 'Tagen'}`;
  }
  _winSub(open) { if (!open.length) return 'Alles zu'; const sn = this._since(this._openSince()); return (sn ? sn + ' · ' : '') + esc(open.join(', ')); }
  _devBat() {
    const out = [];
    for (const b of this._batteries().all) {
      const pf = this._h.entities?.[b.e]?.platform;
      if (pf !== 'mobile_app' && pf !== 'fully_kiosk') continue;
      const base = b.e.replace(/_battery(_level)?$/, ''), bin = 'binary_sensor.' + base.slice(base.indexOf('.') + 1);
      const st = this._val(base + '_battery_state');
      out.push({ ...b, n: String(b.n).replace(/\s*battery( level)?\s*$/i, '').trim(), charging: st === 'charging' || st === 'full' || this._val(bin + '_is_charging') === 'on' || this._val(bin + '_plugged_in') === 'on' });
    }
    return out;
  }
  _wxNow() {
    const c = this._c, w = this._s(c.weather);
    const o = c.outdoor;
    return {
      cond: w?.state || 'cloudy',
      temp: this._num(o.temp) ?? w?.attributes?.temperature ?? null,
      hum: this._num(o.hum) ?? w?.attributes?.humidity ?? null,
      wind: this._num(o.wind) ?? w?.attributes?.wind_speed ?? null, windU: (o.wind && this._unit(o.wind)) || w?.attributes?.wind_speed_unit || 'km/h',
      rain: this._num(o.rain), rainU: (o.rain && this._unit(o.rain)) || 'mm/h',
      press: w?.attributes?.pressure ?? null,
    };
  }
  _wxGlow(c) {
    return ({ sunny: 'rgba(251,191,36,.38)', 'clear-night': 'rgba(129,140,248,.38)', rainy: 'rgba(56,189,248,.32)', pouring: 'rgba(59,130,246,.38)', lightning: 'rgba(250,204,21,.28)', 'lightning-rainy': 'rgba(250,204,21,.28)', snowy: 'rgba(186,230,253,.3)', partlycloudy: 'rgba(125,211,252,.32)', fog: 'rgba(203,213,225,.25)' })[c] || 'rgba(148,163,184,.3)';
  }

  /* ───────────── Verlauf & Vorhersage ───────────── */
  _resample(raw, t0, t1, n) {
    if (!raw.length) return [];
    raw.sort((a, b) => a[0] - b[0]);
    const out = []; let j = 0, last = raw[0][1];
    for (let i = 0; i < n; i++) {
      const t = t0 + (t1 - t0) * i / (n - 1);
      while (j < raw.length && raw[j][0] <= t) { last = raw[j][1]; j++; }
      out.push([t, last]);
    }
    return out;
  }
  async _loadHist() {
    if (this._hl) return;
    const need = [...this._need].filter(e => !this._hist[e] || Date.now() - this._hist[e].t > 6e5);
    this._need.clear();
    if (!need.length) return;
    this._hl = true;
    const end = Date.now(), start = end - 24 * 3600e3;
    try {
      const res = await this._h.callWS({ type: 'history/history_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(), entity_ids: need, minimal_response: true, no_attributes: true, significant_changes_only: false });
      for (const e of need) {
        const raw = (res[e] || []).map(x => [x.lu != null ? x.lu * 1000 : (x.last_updated ? new Date(x.last_updated).getTime() : start), parseFloat(x.s !== undefined ? x.s : x.state)]).filter(p => !isNaN(p[1]));
        this._hist[e] = { t: Date.now(), pts: this._resample(raw, start, end, 72) };
      }
    } catch (err) { for (const e of need) this._hist[e] = { t: Date.now(), pts: [] }; }
    this._hl = false;
    this._renderSoon();
  }
  async _loadFc() {
    if (this._fcb || (this._fc && Date.now() - this._fc.t < 9e5)) return;
    this._fcb = true;
    const w = this._c.weather;
    const get = async type => {
      try { const r = await this._h.callWS({ type: 'call_service', domain: 'weather', service: 'get_forecasts', service_data: { type }, target: { entity_id: w }, return_response: true }); return r?.response?.[w]?.forecast || []; } catch (e) { return []; }
    };
    const [daily, hourly] = await Promise.all([get('daily'), get('hourly')]);
    this._fc = { t: Date.now(), daily: daily.length ? daily : (this._attr(w, 'forecast') || []), hourly };
    this._fcb = false;
    this._renderSoon();
  }

  /* ───────────── Bausteine ───────────── */
  _ring(t) {
    if (t == null) return '';
    const f = clamp((t - 10) / 20, 0, 1), C = 2 * Math.PI * 26, col = tempCol(t);
    return `<svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="rgba(${WH},.09)" stroke-width="5"/><circle cx="32" cy="32" r="26" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(C * f).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 32 32)" style="filter:drop-shadow(0 0 5px ${col})"/></svg>`;
  }
  _spark(e) {
    const d = this._hist[e];
    if (!d) { this._need.add(e); return '<div class="sk"></div>'; }
    if (d.pts.length < 2) return '';
    const vs = d.pts.map(p => p[1]), mn = Math.min(...vs), mx = Math.max(...vs), rg = Math.max(mx - mn, 1);
    const pts = d.pts.map((p, i) => [i / (d.pts.length - 1) * 200, 40 - (p[1] - mn) / rg * 32]);
    const path = smooth(pts), col = tempCol(vs[vs.length - 1]);
    return `<svg class="spark" viewBox="0 0 200 46" preserveAspectRatio="none"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".35"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><path d="${path}L200 46L0 46z" fill="url(#sg)"/><path d="${path}" fill="none" stroke="${col}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round"/></svg>`;
  }
  _chart(series, opt = {}) {
    const H = opt.h || 200;
    series.forEach(s => { if (!this._hist[s.e]) this._need.add(s.e); });
    const data = series.map(s => ({ ...s, pts: this._hist[s.e]?.pts || [] }));
    if (data.some(s => !this._hist[s.e])) return `<div class="sk" style="height:${H}px"></div>`;
    const all = data.flatMap(s => s.pts.map(p => p[1]));
    // ohne Verlauf (Recorder schließt die Sensoren aus, frisch eingerichtet): wenigstens die aktuellen Werte zeigen
    if (!all.length) {
      const now = series.map(s => [s, this._num(s.e)]).filter(x => x[1] != null);
      return now.length ? `<div class="chips nowv">${now.map(([s, v]) => `<span class="chip"><i class="cdot" style="background:${s.color}"></i>${esc(s.name)} <b>${de(v, opt.dec ?? 1)}${opt.unit ?? '°'}</b></span>`).join('')}</div><div class="empty sm">Noch kein Verlauf aufgezeichnet</div>` : '<div class="empty sm">Noch kein Verlauf aufgezeichnet</div>';
    }
    let mn = Math.min(...all), mx = Math.max(...all);
    if (mx - mn < 2) { mn -= 1; mx += 1; }
    const pad = (mx - mn) * .1; mn -= pad; mx += pad;
    const first = data.find(s => s.pts.length) || data[0];
    const t0 = first.pts[0][0], t1 = first.pts[first.pts.length - 1][0];
    const X = t => (t - t0) / (t1 - t0) * 100, Y = v => (1 - (v - mn) / (mx - mn)) * 100;
    let svg = '', lab = '';
    for (let i = 0; i < 4; i++) { const v = mn + (mx - mn) * i / 3, y = Y(v); svg += `<line x1="0" x2="100" y1="${y}" y2="${y}" stroke="rgba(${WH},.07)" vector-effect="non-scaling-stroke"/>`; lab += `<span class="yl" style="top:${y}%">${de(v, opt.dec ?? 0)}</span>`; }
    const tk = new Date(t0); tk.setMinutes(0, 0, 0);
    for (let t = tk.getTime() + 3600e3; t < t1; t += 3600e3) { const hh = new Date(t).getHours(); if (hh % 6 === 0) { svg += `<line x1="${X(t)}" x2="${X(t)}" y1="0" y2="100" stroke="rgba(${WH},.045)" vector-effect="non-scaling-stroke"/>`; lab += `<span class="xl" style="left:${X(t)}%">${String(hh).padStart(2, '0')}:00</span>`; } }
    data.forEach(s => {
      if (s.pts.length < 2) return;
      const pts = s.pts.map(p => [X(p[0]), Y(p[1])]), last = pts[pts.length - 1];
      svg += `<path d="${smooth(pts)}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="filter:drop-shadow(0 0 4px ${s.color})"/>`;
      lab += `<span class="cd" style="left:${last[0]}%;top:${last[1]}%;background:${s.color};color:${s.color}"></span>`;
    });
    const leg = series.length > 1 ? `<div class="leg">${series.map(s => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>` : '';
    return `<div class="chw" style="height:${H}px"><div class="plot"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${svg}</svg>${lab}</div></div>${leg}`;
  }
  _rings() {
    const c = this._c, L = this._lights(), on = this._lightsOn().length;
    const wr = c.rooms.filter(r => (r.window || []).some(e => this._s(e))), closed = wr.filter(r => !this._room(r).open).length;
    const cr = c.rooms.filter(r => r.climate && this._s(r.climate)), heat = cr.filter(r => this._room(r).act === 'heating').length;
    const temps = c.rooms.map(r => this._room(r).temp).filter(t => t != null), avg = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null;
    const R = [[72, on / Math.max(L.length, 1), '#fbbf24', 'Lichter an', `${on}/${L.length}`], [56, closed / Math.max(wr.length, 1), '#34d399', 'Fenster zu', `${closed}/${wr.length}`], [40, heat / Math.max(cr.length, 1), '#fb923c', 'Heizung aktiv', `${heat}/${cr.length}`]];
    const svg = R.map(r => `<circle cx="88" cy="88" r="${r[0]}" fill="none" stroke="rgba(${WH},.08)" stroke-width="9"/>${r[1] > 0 ? `<path d="${arc(88, 88, r[0], -90, -90 + Math.min(r[1], .9999) * 360)}" fill="none" stroke="${r[2]}" stroke-width="9" stroke-linecap="round" style="filter:drop-shadow(0 0 6px ${r[2]})"/>` : ''}`).join('');
    return `<div class="rings"><div style="position:relative"><svg class="rgsvg" viewBox="0 0 176 176">${svg}</svg>
      <div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center"><div><div class="big" style="font-size:26px">${de(avg)}<small class="u">°</small></div><div style="font-size:10.5px;color:var(--tx3);margin-top:2px">Ø innen</div></div></div></div>
      <div class="rl">${R.map(r => `<div style="color:${r[2]}"><i style="background:${r[2]}"></i><span style="color:var(--tx2)">${r[3]}</span><b>${r[4]}</b></div>`).join('')}</div></div>`;
  }
  _sunArc() {
    const s = this._s(this._c.sun);
    if (!s) return '';
    const a = s.attributes, up = s.state === 'above_horizon', now = Date.now();
    const nr = new Date(a.next_rising).getTime(), ns = new Date(a.next_setting).getTime();
    if (isNaN(nr) || isNaN(ns)) return '';
    let f = .5;
    if (up) { const st = nr - 864e5; f = clamp((now - st) / (ns - st), 0, 1); } else { const st = ns - 864e5; f = clamp((now - st) / (nr - st), 0, 1); }
    const ang = 180 + 180 * f, cx = 100, cy = 92, r = 80;
    const px = cx + r * Math.cos(ang * Math.PI / 180), py = cy + r * Math.sin(ang * Math.PI / 180);
    const col = up ? '#fbbf24' : '#a5b4fc';
    return `<svg class="sunarc" viewBox="0 0 200 104"><defs><linearGradient id="sa" x1="0" x2="1"><stop offset="0" stop-color="${col}" stop-opacity=".1"/><stop offset="1" stop-color="${col}"/></linearGradient></defs>
      <path d="${arc(cx, cy, r, 180, 360)}" fill="none" stroke="rgba(${WH},.1)" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>
      <path d="${arc(cx, cy, r, 180, Math.max(180.5, ang))}" fill="none" stroke="url(#sa)" stroke-width="4" stroke-linecap="round"/>
      <line x1="8" x2="192" y1="${cy}" y2="${cy}" stroke="rgba(${WH},.12)"/>
      <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="14" fill="${col}" opacity=".18"/><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="7" fill="${col}" style="filter:drop-shadow(0 0 8px ${col})"/></svg>
      <div class="srow"><span>${ic('sun', 14)} Aufgang <b>${hhmm(nr)}</b></span><span>Untergang <b>${hhmm(ns)}</b> ${ic('moon', 14)}</span></div>`;
  }
  _lightTile(e) {
    const s = this._s(e); if (!s) return '';
    const on = s.state === 'on', at = s.attributes, lc = at.rgb_color ? at.rgb_color.join(',') : '251,191,36';
    const dim = (at.supported_color_modes || []).some(m => m !== 'onoff');
    const pct = at.brightness != null ? Math.round(at.brightness / 2.55) : null;
    return `<div class="lt ${on ? 'on' : ''}" style="--lc:${lc}" data-act="toggle" data-e="${e}" data-hold>
      <div class="bub">${ic('bulb', 22)}</div><div class="n">${esc(at.friendly_name || e)}</div><div class="s">${on ? (pct != null ? pct + ' %' : 'An') : 'Aus'}</div>
      ${on && dim ? `<input type="range" min="1" max="100" value="${pct ?? 100}" style="--v:${pct ?? 100}%" data-act="bright" data-e="${e}">` : ''}</div>`;
  }
  _roomTile(r, big, i) {
    const I = this._room(r);
    const flame = I.act === 'heating';
    const hl = this._humLevel(I);
    return `<div class="c tap rm ${I.on.length ? 'lit' : ''} ${I.stale != null ? 'stale' : ''}" style="--glow:${I.glow};--i:${i}" data-act="room" data-room="${r.id}">
      <div class="rt"><span>${esc(r.name)}</span>${I.open ? `<span class="wbd" title="Fenster offen">${ic('window', 18)}</span>` : ''}</div>
      <div class="rmid"><div class="rw ${I.temp == null ? 'nr' : ''}">${this._ring(I.temp)}<span class="ri">${ic(r.icon, 22)}</span></div>
        <div class="rv big">${I.temp != null ? de(I.temp) + '<small class="u">°</small>' : I.on.length + '<small class="u">an</small>'}</div></div>
      ${big && r.temp ? this._spark(r.temp) : ''}
      <div class="rb">${I.stale != null ? `<span class="stl" title="Sensor ohne Meldung">${ic('clock', 14)}${this._agoTxt(I.stale)}</span>` : ''}${I.hum != null ? `<span class="${hl ? 'hw hw' + hl : ''}">${ic('drop', 14)}${de(I.hum, 0)}%</span>` : ''}${I.lights.length ? `<span class="${I.on.length ? 'on' : ''}">${ic('bulb', 14)}${I.on.length}/${I.lights.length}</span>` : ''}${flame ? `<span class="heat">${ic('flame', 14)}heizt</span>` : (I.target != null && I.mode !== 'off' ? `<span>${ic('thermo', 14)}${de(I.target)}°</span>` : '')}</div>
      ${big && I.lights.length ? `<div><button class="qb ${I.on.length ? 'on' : ''}" data-act="room-lights" data-room="${r.id}">${ic('bulb', 14)}${I.on.length ? 'Alle aus' : 'Alle an'}</button></div>` : ''}
    </div>`;
  }
  _stat(i, icon, label, value, cls, sub, act, extra = '') {
    const num = typeof value === 'number';
    return `<div class="c st s3 ${act ? 'tap' : ''} ${cls}" style="--i:${i}" ${act ? `data-act="${act}" ${extra}` : ''}>
      <div class="top"><div class="ico">${ic(icon, 22)}</div></div>
      <div><div class="v big" ${num ? `data-count="${value}" data-d="0"` : 'style="font-size:30px;font-weight:300"'}>${num ? value : esc(value)}</div><div class="l">${label}</div><div class="sub">${sub || '&nbsp;'}</div></div></div>`;
  }
  _persons() {
    return this._c.persons.filter(e => this._s(e)).map(e => {
      const s = this._s(e), home = s.state === 'home', nm = s.attributes.friendly_name || e, pic = s.attributes.entity_picture;
      return `<div class="pc tap ${home ? '' : 'away'}" data-act="persons"><div class="av" ${pic ? `style="background-image:url('${esc(pic)}')"` : ''}>${pic ? '' : esc(nm[0] || '?')}</div><div>${esc(nm)}<small>${home ? 'Zuhause' : (s.state === 'not_home' ? 'Unterwegs' : esc(s.state))}</small></div></div>`;
    }).join('');
  }
  _greet() { const h = new Date().getHours(); return h < 5 ? 'Gute Nacht' : h < 11 ? 'Guten Morgen' : h < 17 ? 'Guten Tag' : h < 22 ? 'Guten Abend' : 'Gute Nacht'; }
  _clockStr() { const d = new Date(); return String(d.getHours()).padStart(2, '0') + '<span>:</span>' + String(d.getMinutes()).padStart(2, '0'); }

