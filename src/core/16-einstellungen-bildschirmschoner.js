  /* ───────────── v5: Einstellungen ───────────── */
  _setRow() { return `<button class="xr" data-act="settings"><div class="ico">${ic('cog', 19)}</div><div><div class="t">Darstellung &amp; Modi</div><div class="s">${{ dark: 'Dunkel', light: 'Hell', auto: 'Automatisch' }[this._themePref || this._c.theme] || 'Dunkel'}${WALL_UI && this._ambMin() ? ' · Ambient nach ' + this._ambMin() + ' Min.' : ''}</div></div></button>`; }
  _ambRow() { if (!WALL_UI) return ''; return `<button class="xr" data-act="ambient"><div class="ico">${ic('expand', 19)}</div><div><div class="t">Wandtablet-Modus</div><div class="s">Uhr &amp; Überblick, tippen zum Beenden</div></div></button>`; }
  _sSet() {
    const th = this._themePref || this._c.theme || 'dark', am = String(this._ambMin());
    const seg = (act, cur, items) => `<div class="seg wide">${items.map(x => `<button class="${cur === x[0] ? 'on' : ''}" data-act="${act}" data-m="${x[0]}">${x[1]}</button>`).join('')}</div>`;
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('cog', 24)}</div><div><h2>Darstellung &amp; Modi</h2><p>Home Aurora v5.2 · Build pz31</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
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
  /* Bildschirmschoner: Tageswerte, Regen, Wind, Sonne und ein Streifen mit den nächsten Stunden und morgen */
  _ambWx(w) {
    const fc = this._fc, d0 = fc?.daily?.[0], P = [], ok = v => v != null && isFinite(v);
    if (d0 && ok(d0.temperature) && ok(d0.templow)) P.push(`Heute ${de(d0.templow, 0)}° bis ${de(d0.temperature, 0)}°`);
    const now = Date.now(), H = (fc?.hourly || []).filter(x => { const t = Date.parse(x.datetime); return t > now - 36e5 && t < now + 13 * 36e5; });
    const wet = x => (x.precipitation || 0) >= 0.3 || ((x.precipitation_probability || 0) >= 60 && /rain|pour|snow|hail/.test(x.condition || ''));
    const snow = x => /snow/.test(x.condition || ''), hh = x => new Date(x.datetime).getHours() + ' Uhr', soon = H.filter(x => Date.parse(x.datetime) < now + 6 * 36e5);
    const nowWet = (w.rain || 0) > 0 || /rain|pour|hail/.test(w.cond || '');
    let r = '';
    if (nowWet) { const dry = soon.find(x => Date.parse(x.datetime) > now && !wet(x)); r = 'Regnet gerade' + (dry ? ' · trocken ab ' + hh(dry) : ''); }
    else { const n = soon.find(x => Date.parse(x.datetime) + 36e5 > now && wet(x)); if (n) r = (snow(n) ? 'Schnee' : 'Regen') + (Date.parse(n.datetime) <= now ? ' möglich' : ' ab ' + hh(n)); }
    if (ok(w.wind) && w.wind >= 25) P.push(`Wind ${de(w.wind, 0)} ${esc(w.windU)}`);
    const sun = this._s(this._c.sun)?.attributes;
    if (sun && sun.next_rising && sun.next_setting) { const up = this._val(this._c.sun) === 'above_horizon', t = up ? sun.next_setting : sun.next_rising; if (!isNaN(Date.parse(t))) P.push(`${up ? 'Sonnenuntergang' : 'Sonnenaufgang'} ${hhmm(t)}`); }
    const line = P.length || r ? `<div class="ambx">${P.map(x => `<span>${x}</span>`).join('<i></i>')}${r ? `${P.length ? '<i></i>' : ''}<b>${ic('drop', 15)}${esc(r)}</b>` : ''}</div>` : '';
    // alle 2 Stunden ab der nächsten vollen Stunde, dazu „Morgen“ aus der Tagesvorhersage
    const S = H.filter(x => Date.parse(x.datetime) > now).filter((_, i) => i % 2 === 1).slice(0, 5).filter(x => ok(x.temperature));
    const rain = x => (x.precipitation || 0) >= 0.1 ? `${de(x.precipitation, x.precipitation < 10 ? 1 : 0)} mm` : (x.precipitation_probability || 0) >= 30 ? `${de(x.precipitation_probability, 0)} %` : '';
    const cell = (lab, cond, t, sub) => `<div class="ambf"><div class="ambfl">${lab}</div>${wx(cond, 34)}<div class="ambft">${t}</div><div class="ambfs">${sub || '&nbsp;'}</div></div>`;
    let strip = S.map(x => cell(hh(x), x.condition || 'cloudy', de(x.temperature, 0) + '°', rain(x))).join('');
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); const tk = tomorrow.toDateString();
    const d1 = (fc?.daily || []).find(x => new Date(x.datetime).toDateString() === tk);
    if (d1 && ok(d1.temperature)) strip += `<i class="ambfd"></i>` + cell('Morgen', d1.condition || 'cloudy', `${ok(d1.templow) ? de(d1.templow, 0) + '° / ' : ''}${de(d1.temperature, 0)}°`, rain(d1));
    return line + (strip ? `<div class="ambfx">${strip}</div>` : '');
  }
  /* Bildschirmschoner: Hinweise als ruhige Chips; Warnungen zuerst und in Gelb */
  _ambChips() {
    const C = [], chip = (icon, txt, warn) => C.push(`<div class="ambn${warn ? ' warn' : ''}">${ic(icon, 18)}<span>${txt}</span></div>`);
    let AL = []; try { AL = this._alerts(); } catch (e) { AL = []; }
    AL.filter(a => (a.crit || a.id === 'warn' || a.cls === 'bad') && a.id !== 'open' && a.id !== 'waste').slice(0, 2).forEach(a => chip(a.icon, esc(a.text) + (a.sub && !a.tmr ? ` <small>${esc(a.sub)}</small>` : ''), true));
    const open = this._openRooms(); if (open.length) chip('window', `${open.length} Fenster offen`, true);
    const WL = this._waste(), wasteTx = /tonne|müll|abfall|gelber sack|gelbe sack|restmüll|biomüll|sperrmüll|papier|altpapier/i;
    if (this._cal) { const { list } = this._calList(), skipW = !!(WL && WL[0] && WL[0].days <= 1), n = list.find(x => x.e > new Date() && !(skipW && wasteTx.test(x.title || ''))); if (n) chip('cal', `${n.allDay ? this._dayName(n.s) : n.s.toLocaleString('de-DE', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} · ${esc(n.title)}`); }
    if (WL && WL[0] && WL[0].days <= 1) { const nx = WL.filter(x => x.days === WL[0].days); chip('trash', `${this._dayTxt(WL[0])} · ${esc(nx.map(x => x.name).join(' + '))}`); }
    if (this._pzOn()) { const T = this._pzSum().T, due = T.filter(t => !t.today && (t.st === 'overdue' || (t.st === 'due_soon' && t.until === 0))).length; if (due) chip('broom', `Heute putzen · ${due} ${due === 1 ? 'Aufgabe' : 'Aufgaben'}`); }
    if (this._shopOn() && this._shopOk()) { const n = parseInt(this._val(this._shopC().list), 10) || 0; if (n) chip('cart', `Einkaufsliste · ${n} ${n === 1 ? 'Sache' : 'Sachen'}`); }
    const lights = this._lightsOn().length; if (lights) chip('bulb', `${lights} ${lights === 1 ? 'Licht' : 'Lichter'} an`);
    return C.join('');
  }
  _ambRender(first) {
    if (!this._amb || !this._amb_el || !this._h) return;
    this._loadFc();
    const w = this._wxNow();
    const temps = this._c.rooms.map(r => this._room(r).temp).filter(t => t != null), avg = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null;
    const pe = this._persons();
    if (first || !this._ambDrift || Date.now() - this._ambDrift > 6e4) { this._ambDrift = Date.now(); this._ambDx = Math.round((Math.random() - .5) * 60); this._ambDy = Math.round((Math.random() - .5) * 50); }
    this._morph(this._amb_el, `<div class="ambin" style="transform:translate(${this._ambDx}px,${this._ambDy}px)"><div class="ambc big">${this._clockStr()}</div>
      <div class="ambd">${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      <div class="ambr"><div class="ambw">${wx(w.cond, 64)}<div><div class="ambt big">${de(w.temp)}<small>°C</small></div><div class="ambs">${COND[w.cond] || w.cond}</div></div></div>
      ${avg != null ? `<div class="ambw"><div class="ico">${ic('home', 34)}</div><div><div class="ambt big">${de(avg)}<small>°C</small></div><div class="ambs">innen Ø</div></div></div>` : ''}</div>
      ${this._ambWx(w)}<div class="ambl">${this._ambChips()}</div>
      <div class="pp ambp">${pe}</div><div class="ambh">Tippen zum Beenden</div></div>`);
  }
