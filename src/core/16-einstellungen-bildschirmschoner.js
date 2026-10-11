  /* ───────────── v5: Einstellungen ───────────── */
  _setRow() { return `<button class="xr" data-act="settings"><div class="ico">${ic('cog', 19)}</div><div><div class="t">Darstellung &amp; Modi</div><div class="s">${{ dark: 'Dunkel', light: 'Hell', auto: 'Automatisch' }[this._themePref || this._c.theme] || 'Dunkel'}${WALL_UI && this._ambMin() ? ' · Ambient nach ' + this._ambMin() + ' Min.' : ''}</div></div></button>`; }
  _ambRow() { if (!WALL_UI) return ''; return `<button class="xr" data-act="ambient"><div class="ico">${ic('expand', 19)}</div><div><div class="t">Wandtablet-Modus</div><div class="s">Uhr &amp; Überblick, tippen zum Beenden</div></div></button>`; }
  _sSet() {
    const th = this._themePref || this._c.theme || 'dark', am = String(this._ambMin());
    const seg = (act, cur, items) => `<div class="seg wide">${items.map(x => `<button class="${cur === x[0] ? 'on' : ''}" data-act="${act}" data-m="${x[0]}">${x[1]}</button>`).join('')}</div>`;
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('cog', 24)}</div><div><h2>Darstellung &amp; Modi</h2><p>Home Aurora v5.2 · Build pz27</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="lab2">DESIGN</div>${seg('theme', th, [['dark', 'Dunkel'], ['light', 'Hell'], ['auto', 'Automatisch']])}
      <div class="card-note">„Automatisch“ folgt dem Dunkel-/Hellmodus deines Home-Assistant-Profils. Die Auswahl gilt nur für dieses Gerät.</div>
      ${WALL_UI ? `      <div class="lab2">WANDTABLET-MODUS</div>
      <button class="xr" style="width:100%" data-act="ambient"><div class="ico">${ic('expand', 19)}</div><div><div class="t">Jetzt starten</div><div class="s">Große Uhr, Wetter, nächster Termin · Bildschirm bleibt an</div></div></button>
      <div class="card-note" style="margin-top:12px">Automatisch starten nach Inaktivität</div>${seg('ambafter', am, [['0', 'Aus'], ['2', '2 Min'], ['5', '5 Min'], ['10', '10 Min'], ['30', '30 Min']])}
      <div class="card-note" style="margin-top:12px">Nachts automatisch${this._nightCfg() ? ` (${this._nightCfg().from}–${this._nightCfg().to} Uhr, nach ${this._nightCfg().after} Min)` : ''}</div>${seg('ambnight', this._nightCfg() ? '1' : '0', [['1', 'An'], ['0', 'Aus']])}
      ` : ''}
      ${this._fullySet()}${this._tabletSet()}
      ${this._pzSum().T.length ? `<div class="lab2">PUTZPLAN</div>${seg('pzshow', this._pzOn() ? '1' : '0', [['1', 'Sichtbar'], ['0', 'Ausgeblendet']])}
      <div class="card-note">Ausgeblendet verschwinden die Karte „Heute putzen“${WALL_UI ? ' und der Reiter in der Leiste' : ' und der Eintrag im Alltag'}. Die Aufgaben in Home Assistant bleiben unverändert. Gilt nur für dieses Gerät.</div>
      ${this._pzOn() ? `<div class="card-note" style="margin-top:12px">Beim Antippen öffnen als</div>${seg('pzview', this._pzView() ? '1' : '0', [['1', 'Eigene Ansicht'], ['0', 'Fenster']])}
      <div class="card-note">Eigene Seite mit „Zurück“ oder Fenster über der Startseite. Gilt nur für dieses Gerät.</div>` : ''}` : ''}
      ${this._shopOk() || this._rcpOk() ? `<div class="lab2">EINKAUFSLISTE &amp; REZEPTE</div>${seg('shopshow', this._shopOn() ? '1' : '0', [['1', 'Sichtbar'], ['0', 'Ausgeblendet']])}
      <div class="card-note">Ausgeblendet verschwindet der Eintrag „Einkaufsliste“ im Alltag. Die Listen in Home Assistant bleiben unverändert. Gilt nur für dieses Gerät.</div>` : ''}
      <div class="lab2">SCHNELLAKTIONEN</div>
      <button class="xr" style="width:100%" data-act="qedit"><div class="ico">${ic('sparkle', 19)}</div><div><div class="t">Schnellaktionen bearbeiten</div><div class="s">Szenen &amp; Skripte hinzufügen, sortieren, neue Szene speichern</div></div></button>
      <div class="lab2">SCHNELLZUGRIFF</div>
      <div class="ex two"><button class="xr" data-act="sys"><div class="ico">${ic('wrench', 19)}</div><div><div class="t">Systemstatus</div></div></button><button class="xr" data-act="power"><div class="ico">${ic('bolt', 19)}</div><div><div class="t">Strom</div></div></button><button class="xr" data-act="sched"><div class="ico">${ic('clock', 19)}</div><div><div class="t">Heizungsplan</div></div></button><button class="xr" data-act="bat"><div class="ico">${ic('battery', 19)}</div><div><div class="t">Batterien</div></div></button><button class="xr" data-act="persons"><div class="ico">${ic('user', 19)}</div><div><div class="t">Wer ist da?</div></div></button><button class="xr" data-act="vent"><div class="ico">${ic('wind', 19)}</div><div><div class="t">Lüften</div></div></button></div>`;
  }

  /* ───────────── v5: Ambient / Wandtablet ───────────── */
  _ambMin() { const v = this._ambPref != null ? parseInt(this._ambPref, 10) : NaN; return isNaN(v) ? (parseInt(this._c?.ambient_after, 10) || 0) : v; }
  _nightCfg() {
    const p = this._nightPref, c = this._c?.ambient_night;
    if (p === '0') return null;
    if (p === '1') return { from: '23:00', to: '06:00', after: 1, ...(c || {}) };
    return c ? { from: '23:00', to: '06:00', after: 1, ...c } : null;
  }
  _inNight() {
    const n = this._nightCfg(); if (!n) return null;
    const hm = s => { const [h, m] = String(s).split(':').map(Number); return (h || 0) * 60 + (m || 0); }, d = new Date(), t = d.getHours() * 60 + d.getMinutes(), a = hm(n.from), b = hm(n.to);
    return (a <= b ? (t >= a && t < b) : (t >= a || t < b)) ? n : null;
  }
  _ambOn() {
    if (!WALL_UI) return;
    if (this._amb || !this._amb_el) return;
    this._amb = true; this._ambClk = ''; this._amb_el.classList.add('show'); this._ambRender(true); this._fullyApply();
    // Dashboard dahinter ist verdeckt: Partikel, Radar und CSS-Animationen anhalten (spart Tablet-Leistung und Wärme).
    this._app.classList.add('ambon'); this._fxStop(); this._rdr?.pause();
    try { navigator.wakeLock?.request('screen').then(l => { this._wl = l; }).catch(() => {}); } catch (e) { /* optional */ }
  }
  _ambOff(home) {
    if (!this._amb) return;
    this._amb = false; this._ambBy = null; this._lastAct = Date.now(); this._amb_el?.classList.remove('show'); this._fullyApply();
    this._app?.classList.remove('ambon'); if (this.isConnected) this._fxStart();
    if (home && this._built) { this._swallow = Date.now() + 800; this._v = 'home'; this._closeSheet(); this._enter = true; this._counted = false; }
    if (this._built && this.isConnected) { this._sig = ''; this._render(); }
    try { this._wl?.release(); } catch (e) { /* optional */ } this._wl = null;
  }
  _ambRender(first) {
    if (!this._amb || !this._amb_el || !this._h) return;
    const w = this._wxNow(), lights = this._lightsOn().length, open = this._openRooms();
    const temps = this._c.rooms.map(r => this._room(r).temp).filter(t => t != null), avg = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null;
    let nxt = '';
    const WL = this._waste(), wasteTx = /tonne|müll|abfall|gelber sack|gelbe sack|restmüll|biomüll|sperrmüll|papier|altpapier/i;
    if (this._cal) { const { list } = this._calList(), skipW = !!(WL && WL[0] && WL[0].days <= 1), n = list.find(x => x.e > new Date() && !(skipW && wasteTx.test(x.title || ''))); if (n) nxt = `<div class="ambn">${ic('cal', 18)}<span>${n.allDay ? this._dayName(n.s) : n.s.toLocaleString('de-DE', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} · ${esc(n.title)}</span></div>`; }
    const wn = WL && WL[0] && WL[0].days <= 1 ? `<div class="ambn">${ic('trash', 18)}<span>${this._dayTxt(WL[0])} · ${esc(WL[0].name)}</span></div>` : '';
    const pe = this._persons();
    if (first || !this._ambDrift || Date.now() - this._ambDrift > 6e4) { this._ambDrift = Date.now(); this._ambDx = Math.round((Math.random() - .5) * 60); this._ambDy = Math.round((Math.random() - .5) * 50); }
    this._morph(this._amb_el, `<div class="ambin" style="transform:translate(${this._ambDx}px,${this._ambDy}px)"><div class="ambc big">${this._clockStr()}</div>
      <div class="ambd">${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      <div class="ambr"><div class="ambw">${wx(w.cond, 64)}<div><div class="ambt big">${de(w.temp)}<small>°C</small></div><div class="ambs">${COND[w.cond] || w.cond}</div></div></div>
      ${avg != null ? `<div class="ambw"><div class="ico">${ic('home', 34)}</div><div><div class="ambt big">${de(avg)}<small>°C</small></div><div class="ambs">innen Ø</div></div></div>` : ''}</div>
      <div class="ambl">${nxt}${wn}${open.length ? `<div class="ambn warn">${ic('window', 18)}<span>${open.length} Fenster offen</span></div>` : ''}${lights ? `<div class="ambn">${ic('bulb', 18)}<span>${lights} ${lights === 1 ? 'Licht' : 'Lichter'} an</span></div>` : ''}</div>
      <div class="pp ambp">${pe}</div><div class="ambh">Tippen zum Beenden</div></div>`);
  }

