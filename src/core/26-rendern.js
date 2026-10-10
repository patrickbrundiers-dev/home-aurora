  /* ───────────── Rendern ───────────── */
  _navHtml() {
    return `<div class="logo"></div>${(WALL_UI && this._pzView() ? [...TABS, ['clean', 'Putzplan', 'broom']] : TABS).map(t => `<button class="nb ${this._v === t[0] ? 'on' : ''}" data-act="nav" data-v="${t[0]}">${ic(t[2], 24)}<span class="lab">${t[1]}</span></button>`).join('')}
      <div class="sp"></div>${this._lockBtn()}<button class="nb gear" data-act="settings">${ic('cog', 24)}<span class="lab">Einstellungen</span></button>`;
  }
  /* Suchen über alle Entitäten (Lichter, Batterien, Putzplan) laufen pro Zeichenvorgang nur einmal: _memo merkt sich
     ihr Ergebnis, solange _render bzw. _renderSheet läuft, und vergisst es danach wieder. */
  _memo(k, fn) { if (!this._mm) return fn(); return k in this._mm ? this._mm[k] : (this._mm[k] = fn()); }
  _render() { const top = !this._mm; if (top) this._mm = {}; try { this._render0(); } finally { if (top) this._mm = null; } }
  _renderSheet() { const top = !this._mm; if (top) this._mm = {}; try { this._renderSheet0(); } finally { if (top) this._mm = null; } }
  _render0() {
    if (!this._h || !this._built) return;
    this._lastRender = Date.now();
    // Bildschirmschoner offen: nur ihn aktualisieren, das Dashboard dahinter erst beim Beenden neu zeichnen.
    if (this._amb) { this._ambRender(); return; }
    this._applyTheme();
    this._need = new Set();
    const views = { clean: () => this._vClean(), home: () => this._vHome(), rooms: () => this._vRooms(), climate: () => this._vClimate(), bath: () => this._vBath(), weather: () => this._vWeather(), printer: () => this._vPrinter() };
    this._main.className = this._enter ? 'enter' : '';
    this._rc = (this._rc || 0) + 1;
    this._morph(this._main, (views[this._v] || views.home)());
    this._morph(this._nav, this._navHtml());
    if (this._sheet) this._renderSheet();
    this._rdrMount();
    this._todSet();
    this._fxKind();
    this._fitHost(); requestAnimationFrame(() => this._fitHost());
    if (this._fitCock) { this._fitCock(); requestAnimationFrame(() => this._fitCock()); }
    if (this._need.size) this._loadHist();
    if (this._v === 'home' || this._v === 'weather') this._loadFc();
    if (this._v === 'weather') { this._loadFcX(); this._wxRestore(); }
    if (this._v === 'home') { this._loadCal(); this._loadSys(); this._loadPower(); }
    this._ambRender();
    if (this._enter && !this._counted) {
      this._counted = true;
      this._countUp();
      clearTimeout(this._et); this._et = setTimeout(() => { this._enter = false; }, 1000);
    }
  }
  /* Aktualisiert das DOM an Ort und Stelle (statt innerHTML zu ersetzen): laufende Animationen
     (Wetter-Icons, Wolken, Regen) starten dadurch bei Datenänderungen nicht jedes Mal neu. */
  _morph(el, html) {
    const t = document.createElement('template'); t.innerHTML = html;
    this._mc(el, t.content);
  }
  _mc(a, b) {
    const ac = a.childNodes, bc = b.childNodes;
    for (let i = 0; i < bc.length; i++) {
      const n = bc[i], o = ac[i];
      if (!o) { a.appendChild(n.cloneNode(true)); continue; }
      if (o.nodeType !== n.nodeType || o.nodeName !== n.nodeName) { a.replaceChild(n.cloneNode(true), o); continue; }
      if (n.nodeType !== 1) { if (o.nodeValue !== n.nodeValue && !(a._cu > performance.now())) o.nodeValue = n.nodeValue; continue; }
      for (const at of [...o.attributes]) if (!n.hasAttribute(at.name)) o.removeAttribute(at.name);
      for (const at of n.attributes) if (o.getAttribute(at.name) !== at.value) o.setAttribute(at.name, at.value);
      if (o.nodeName === 'INPUT' && o.type !== 'file') { const v = n.getAttribute('value'); if (v != null && o.value !== v && this.shadowRoot.activeElement !== o) o.value = v; }
      if (o.hasAttribute('data-keep')) continue;
      this._mc(o, n);
    }
    while (ac.length > bc.length) a.removeChild(a.lastChild);
  }
  _renderSoon() { clearTimeout(this._rs); this._rs = setTimeout(() => this._render(), 140); }
  _renderSheet0() {
    const st = this._sh.scrollTop;
    if (this._sheet.t === 'sched' && this._schedEl && this._sh.contains(this._schedEl)) { this._schedEl.hass = this._h; this._ov.classList.add('show'); return; }
    const r = this._sheet.t === 'room' ? this._c.rooms.find(x => x.id === this._sheet.id) : null;
    const T = { vroom: () => this._sVRoom(this._sheet.e), persons: () => this._sPersons(), quick: () => this._sQuick(), vent: () => this._sVent(), cal: () => this._sCal(), bat: () => this._sBat(), doors: () => this._sDoors(), sys: () => this._sSys(), waste: () => this._sWaste(), power: () => this._sPower(), sched: () => this._sSched(), set: () => this._sSet(), warn: () => this._sWarn(), radar: () => this._sRadar(), pin: () => this._sPin(), fuel: () => this._sFuel(), plants: () => this._sPlants(), heat: () => this._sHeat(), kid: () => this._sKid(), clean: () => this._sClean(), tv: () => this._sTv(), pzstat: () => this._sPzStat(), music: () => this._sMusic() };
    const qn = this.shadowRoot.getElementById('qname'), qv = qn ? qn.value : null, qf = qn && this.shadowRoot.activeElement === qn;
    const an = this.shadowRoot.getElementById('annq'), av = an ? an.value : null, af = an && this.shadowRoot.activeElement === an;
    const pq = this.shadowRoot.getElementById('pzq'), pqf = pq && this.shadowRoot.activeElement === pq, pqs = pq ? pq.selectionStart : 0;
    const html = r ? this._sRoom(r) : (T[this._sheet.t] || (() => this._sLights()))(), key = this._sheet.t + ':' + (this._sheet.id || this._sheet.e || '');
    if (this._shKey === key && this._sh.firstChild) this._morph(this._sh, html); else this._sh.innerHTML = html;
    this._shKey = key;
    if (pqf) { const p2 = this.shadowRoot.getElementById('pzq'); if (p2) { p2.focus(); try { p2.setSelectionRange(pqs, pqs); } catch (x) { } } }
    if (qv != null) { const n2 = this.shadowRoot.getElementById('qname'); if (n2) { n2.value = qv; if (qf) n2.focus(); } }
    if (av != null) { const a2 = this.shadowRoot.getElementById('annq'); if (a2 && a2 !== an) { a2.value = av; if (af) a2.focus(); } }
    if (this._sheet.t === 'sched') this._mountSched();
    this._sh.scrollTop = st;
    this._ov.classList.toggle('rdfull', this._sheet.t === 'radar'); this._ov.classList.add('show');
    this._rdrMount();
    if (this._need.size) this._loadHist();
  }
  _closeSheet() { this._sheet = null; this._shKey = null; this._schedEl = null; this._armed = false; this._ov.classList.remove('show', 'rdfull'); this._rdrMount(); }
  _todSet() {
    const s = this._s(this._c.sun), el = s?.attributes?.elevation;
    let t;
    if (el != null) t = el > 8 ? 'day' : el > -6 ? 'dusk' : 'night';
    else { const h = new Date().getHours(); t = h >= 8 && h < 18 ? 'day' : (h >= 6 && h < 8) || (h >= 18 && h < 21) ? 'dusk' : 'night'; }
    this._app.dataset.tod = t;
    this._fullyApply();
  }
  _clockTick() {
    const nt = WALL_UI ? this._inNight() : null, vis = document.visibilityState === 'visible' && this.getClientRects().length > 0;
    if (this._amb) { if (this._ambBy === 'night' && !nt) this._ambOff(); else { const s = this._clockStr(); if (this._ambClk !== s) { this._ambClk = s; this._ambRender(); } } }
    else if (nt && vis && Date.now() - this._lastAct > nt.after * 6e4) { this._ambOn(); this._ambBy = 'night'; }
    else if (WALL_UI && this._ambMin() > 0 && Date.now() - this._lastAct > this._ambMin() * 6e4 && vis) { this._ambOn(); this._ambBy = 'day'; }
    this._tmrTick();
    const el = this.shadowRoot?.getElementById('clk');
    if (!el) return;
    const s = this._clockStr();
    if (el._last !== s) { el._last = s; el.innerHTML = s; }
  }
  _countUp() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this._main.querySelectorAll('[data-count]').forEach(el => {
      const to = parseFloat(el.dataset.count), d = parseInt(el.dataset.d || '0', 10), node = el.firstChild;
      if (isNaN(to) || !node || node.nodeType !== 3) return;
      const t0 = performance.now(); el._cu = t0 + 850;
      const step = t => {
        const p = clamp((t - t0) / 800, 0, 1), e = 1 - Math.pow(1 - p, 3);
        node.nodeValue = de(to * e, d);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  /* Hintergrund/Navigation bis zur echten Fensterunterkante ziehen (HA-Kopfzeile ist im Kiosk-Modus weg, --header-height bleibt aber gesetzt) */
  _fitHost() {
    if (!this._fhR) { this._fhR = 1; addEventListener('resize', () => this._fitHost()); }
    const t = this.getBoundingClientRect().top, ih = window.innerHeight || document.documentElement.clientHeight;
    if (!(ih > 0) || t < 0 || t > ih / 2) return;
    this.style.setProperty('--hmin', Math.floor(ih - t) + 'px');
  }
  _toast(msg, ms = 2200, a) {
    this._tst.textContent = msg; this._tst.classList.add('show');
    if (a) { this._tst.dataset.act = a.act; this._tst.dataset.e = a.e; this._tst.classList.add('tap'); } else { delete this._tst.dataset.act; delete this._tst.dataset.e; this._tst.classList.remove('tap'); }
    clearTimeout(this._tt); this._tt = setTimeout(() => this._tst.classList.remove('show'), ms);
  }

