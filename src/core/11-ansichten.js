  /* ───────────── Ansicht: Zuhause ───────────── */
  _homeBits() {
    const c = this._c, L = this._lightsOn().length, open = this._openRooms(), V = this._num(c.stats.vent) || 0, vr = (this._val(c.stats.ventRoom) || '').trim(); const VD = this._ventData();
    const w = this._wxNow(), fc = this._fc?.daily || [];
    const sentence = `${L ? `<b class="w">${L} ${L === 1 ? 'Licht brennt' : 'Lichter brennen'}</b>` : 'Alle Lichter sind <b>aus</b>'}, ${open.length ? `<b class="r">${open.length === 1 ? 'ein Fenster' : open.length + ' Fenster'} offen</b> (${esc(open.join(', '))}${this._since(this._openSince()) ? ', ' + this._since(this._openSince()) : ''})` : 'alle Fenster sind <b>geschlossen</b>'}${V > 0 && vr && vr !== 'unknown' ? `. Im Raum <b>${esc(vr)}</b> sollte gelüftet werden.` : '.'}`;
    const mini = fc.slice(0, 5).map((d, i) => `<div>${i === 0 ? 'Heute' : new Date(d.datetime).toLocaleDateString('de-DE', { weekday: 'short' })}${wx(d.condition, 30)}<b>${de(d.temperature, 0)}°</b></div>`).join('');
    const ex = c.extras;
    const xr = [];
    if (this._s(ex.waste)) { const WL = this._waste(); xr.push(`<button class="xr" data-act="waste"><div class="ico">${ic('trash', 19)}</div><div><div class="t">Müllabfuhr</div><div class="s">${WL && WL.length ? WL.slice(0, 2).map(x => this._dayTxt(x) + ' ' + esc(x.name)).join(' · ') : esc(this._val(ex.waste))}</div></div></button>`); }
    if (this._s(ex.fuel)) xr.push(`<button class="xr" data-act="fuel"><div class="ico">${ic('fuel', 19)}</div><div><div class="t">Tanken · günstigster Preis</div><div class="s">${esc(this._val(ex.fuel))} ${esc(this._unit(ex.fuel))}${this._s(ex.fuelName) && okv(this._val(ex.fuelName)) ? ' · ' + esc(this._val(ex.fuelName)) : ''}</div></div></button>`);
    const tvR = this._tvRows(); if (tvR.length) xr.push(...tvR); else if (this._s(ex.kids)) xr.push(`<button class="xr" data-act="toggle" data-e="${ex.kids}"><div class="ico">${ic('shield', 19)}</div><div><div class="t">Kindersicherung TV</div><div class="s">${this._val(ex.kids) === 'on' ? 'Aktiv' : 'Aus'}</div></div><span class="sw ${this._val(ex.kids) === 'on' ? 'on' : ''}"></span></button>`);
    { const sr = this._shopRow(); if (sr) xr.splice(Math.min(xr.length, 1), 0, sr); }
    xr.splice(Math.min(xr.length, 2), 0, ...this._cleanRows());
    xr.push(...this._kidRows());
    { const mr = this._musicRow(); if (mr) xr.push(mr); }
    if (this._s(ex.winter)) xr.push(`<button class="xr" data-act="more" data-e="${ex.winter}"><div class="ico">${ic(this._val(ex.winter) === 'on' ? 'thermo' : 'sun', 19)}</div><div><div class="t">Heizmodus</div><div class="s">${this._val(ex.winter) === 'on' ? 'Wintermodus aktiv' : 'Sommerbetrieb'}</div></div></button>`);
    const sa = this._s(c.sun)?.attributes, sUp = this._val(c.sun) === 'above_horizon';
    const sunChip = sa ? `<span class="chip">${ic(sUp ? 'moon' : 'sun', 14)}<b>${hhmm(sUp ? sa.next_setting : sa.next_rising)}</b></span>` : '';
    const bathState = this._val(c.stats.bath) || '–';
    const bathBusy = bathState !== 'Frei' && bathState !== '–';
    return { c, L, open, V, vr, VD, w, fc, sentence, mini, ex, xr, sunChip, bathState, bathBusy };
  }
  _vHome() {
    const { c, L, open, V, vr, VD, w, fc, sentence, mini, ex, xr, sunChip, bathState, bathBusy } = this._homeBits();
    const AL = this._alerts();
    const BP = this._banPick(AL)[0], CH = AL.filter(a => a !== BP);
    return `${this._banner(AL)}${CH.length ? `<div class="alerts">${CH.map(a => this._alertHtml(a)).join('')}</div>` : ''}${this._quick()}<div class="bento">
      <div class="c hero s8" style="--i:0"><div class="hl"><div><div class="hello">${this._greet()}</div><div class="clock big" id="clk">${this._clockStr()}</div>
        <div class="date">${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</div><div class="sum">${sentence}</div></div>
        <div class="pp" style="margin-top:20px">${this._persons()}</div></div>${this._rings()}</div>
      <div class="c wxh s4 tap" style="--i:1;--wglow:${this._wxGlow(w.cond)}" data-act="nav" data-v="weather">
        <div class="wtop"><div><div class="wtemp big" data-count="${w.temp ?? 0}" data-d="1">${de(w.temp)}<small class="u">°C</small></div><div class="wcond">${COND[w.cond] || w.cond}</div></div>${wx(w.cond, 88)}</div>
        <div><div class="chips"><span class="chip">${ic('drop', 14)}<b>${de(w.hum, 0)}</b>%</span><span class="chip">${ic('wind', 14)}<b>${de(w.wind, 0)}</b> ${esc(w.windU)}</span>${w.rain ? `<span class="chip">${ic('rain', 14)}<b>${de(w.rain)}</b> ${esc(w.rainU)}</span>` : ''}${sunChip}</div>${mini ? `<div class="mini">${mini}</div>` : ''}</div></div>
      ${this._stat(2, 'bulb', 'Lichter an', L, L ? 'hot' : '', L ? esc(this._lightsOn().slice(0, 2).map(e => this._name(e)).join(', ')) + (L > 2 ? ' …' : '') : 'Alles aus', 'lights')}
      ${this._stat(3, 'window', 'Fenster offen', open.length, open.length ? 'bad' : 'cool', this._winSub(open), 'doors')}
      ${(() => { const nv = VD.rooms.length ? VD.prio.length : V; return this._stat(4, 'wind', 'Räume zu lüften', nv, nv ? 'hot' : 'cool', nv ? (VD.prio.slice(0, 2).map(r => esc(r.name)).join(', ') + (VD.prio.length > 2 ? ' …' : '')) : (VD.paused.length ? VD.paused.length + ' später empfohlen' : 'Luft ist gut'), 'vent'); })()}
      ${this._stat(5, 'bath', 'Badezimmer', bathState, bathBusy ? 'bad' : 'cool', 'Status', 'nav', 'data-v="bath"')}
      <div class="s8 col">${this._pzCard(5, 5)}<div><div class="h">${ic('grid', 14)}Räume<span class="r">${this._c.rooms.length} Räume</span></div><div class="rg">${c.rooms.map((r, i) => this._roomTile(r, false, 6 + i)).join('')}</div></div>
        <div class="c" style="--i:10"><div class="h">${ic('thermo', 14)}Temperaturen<span class="r">letzte 24 Stunden</span></div>${this._chart(this._tempSeries(false), { h: 190, dec: 1 })}</div>
        <div class="c" style="--i:11"><div class="h">${ic('star', 14)}Alltag</div><div class="ex two">${xr.join('')}${this._plantRow()}${this._sysRow()}${this._ambRow()}${this._setRow()}</div></div></div>
      <div class="s4 col">${this._calCard(8)}${this._powerCard(9) || `<div class="c" style="--i:9"><div class="h">${ic('sun', 14)}Sonne</div>${this._sunArc()}</div>`}</div>
    </div>`;
  }

  /* ───────────── Ansicht: Räume ───────────── */
  _vRooms() {
    const c = this._c, L = this._lightsOn().length;
    return `<div class="vh"><div><h1>Räume</h1><p>${L ? L + ' Lichter an' : 'Alle Lichter aus'} · ${this._openRooms().length ? this._openRooms().length + ' Fenster offen' : 'alle Fenster zu'}</p></div><button class="qb ${L ? 'on' : ''}" data-act="lights">${ic('bulb', 14)}Alle Lichter</button></div>
      <div class="rg big">${c.rooms.map((r, i) => this._roomTile(r, true, i)).join('')}</div>
      ${this._batCard(21, 's12') ? `<div class="bento" style="margin-top:16px">${this._batCard(21, 's12')}</div>` : ''}`;
  }

  /* ───────────── Ansicht: Klima ───────────── */
  _dial(r, i) {
    const I = this._room(r), cl = I.cl; if (!cl) return '';
    const cur = cl.attributes.current_temperature ?? I.temp, tg = cl.attributes.temperature, heat = I.act === 'heating', off = I.mode === 'off', auto = !off && I.dh?.auto;
    const fc = clamp(((cur ?? 10) - 10) / 20, 0, 1), ft = clamp(((tg ?? 10) - 10) / 20, 0, 1), a1 = 135 + 270 * fc, at = 135 + 270 * ft;
    const col = cur != null ? tempCol(cur) : '#94a3b8';
    const tx = 100 + 84 * Math.cos(at * Math.PI / 180), ty = 100 + 84 * Math.sin(at * Math.PI / 180);
    return `<div class="c dial ${heat ? 'heat' : ''}" style="--i:${i}">
      <div class="dn">${ic(r.icon, 18)}<span>${esc(r.name)}</span><button class="pw ${off ? '' : 'on'}" data-act="hvac" data-e="${r.climate}">${ic('power', 17)}</button></div>
      <div class="dctr"><svg class="dsvg" viewBox="0 0 200 170"><path d="${arc(100, 100, 84, 135, 405)}" fill="none" stroke="rgba(${WH},.09)" stroke-width="12" stroke-linecap="round"/>
        ${cur != null ? `<path d="${arc(100, 100, 84, 135, Math.max(135.5, a1))}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${col});opacity:${off ? .35 : 1}"/>` : ''}
        ${tg != null && !off ? `<circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="9" fill="${FG}" style="filter:drop-shadow(0 0 8px rgba(${WH},.8))"/><circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="3.500" fill="${col}"/>` : ''}</svg>
        <div class="mid htap" data-act="heat" data-room="${r.id}"><div class="cur big">${de(cur)}<small class="u">°</small></div><div class="tg">${off ? 'Heizung aus' : (auto ? 'Automatik' : 'Ziel') + ' <b>' + de(tg) + '°</b>'}</div></div></div>
      <div class="dst ${heat ? 'heat' : ''}">${heat ? ic('flame', 14) + 'Heizt gerade' : (off ? 'Aus' : esc(I.dh?.label || 'Bereit'))}</div>${this._planLine(r)}
      <div class="dbt">${auto ? `<button class="qb on" data-act="heat" data-room="${r.id}">${ic('clock', 14)}Automatik</button>` : `<button class="rbn" data-act="temp" data-e="${r.climate}" data-d="-0.5">${ic('minus', 22)}</button><button class="rbn" data-act="temp" data-e="${r.climate}" data-d="0.5">${ic('plus', 22)}</button>`}</div></div>`;
  }
  /* Klima-Kachel: Heizdauer heute und nächster Wechsel laut Plan */
  _planLine(r) {
    const P = this._plan(r), ht = this._heatTime(r), parts = [];
    if (ht != null) parts.push('heute ' + this._durTxt(ht) + ' geheizt');
    if (P?.next && P.on !== false) parts.push(P.nextMode ? `${P.nextMode} ab ${this._whenTxt(P.next)}` : `Wechsel ${this._whenTxt(P.next)}`);
    return parts.length ? `<div class="dpl">${esc(parts.join(' · '))}</div>` : '';
  }
  _tempSeries(out = true) {
    const c = this._c, pal = ['#fb923c', '#a78bfa', '#f472b6', '#34d399', '#38bdf8', '#facc15', '#94a3b8'];
    const series = c.rooms.filter(r => r.temp).map((r, i) => ({ e: r.temp, name: r.name, color: pal[i % pal.length] }));
    if (out && c.outdoor.temp) series.push({ e: c.outdoor.temp, name: 'Draußen', color: '#e2e8f0' });
    return series;
  }
  _vClimate() {
    const c = this._c, rooms = c.rooms.filter(r => r.climate && this._s(r.climate)), w = this._wxNow();
    const heating = rooms.filter(r => this._room(r).act === 'heating').length;
    const series = this._tempSeries();
    return `<div class="vh"><div><h1>Klima</h1><p>${heating ? heating + (heating === 1 ? ' Heizung läuft' : ' Heizungen laufen') : 'Keine Heizung aktiv'} · draußen ${de(w.temp)} °C</p></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="qb" data-act="vent">${ic('wind', 14)}Lüften</button><button class="qb" data-act="sched">${ic('clock', 14)}Heizungsplan</button>${this._s(c.extras.winter) ? `<span class="chip">${ic(this._val(c.extras.winter) === 'on' ? 'thermo' : 'sun', 14)}<b>${this._val(c.extras.winter) === 'on' ? 'Wintermodus' : 'Sommerbetrieb'}</b></span>` : ''}</div></div>
      <div class="dials">${rooms.map((r, i) => this._dial(r, i)).join('')}</div>
      ${this._airCard(6)}
      <div class="c" style="margin-top:16px;--i:7"><div class="h">${ic('thermo', 14)}Temperaturverlauf<span class="r">letzte 24 Stunden</span></div>${this._chart(series, { dec: 0, h: 260 })}</div>`;
  }

  /* ───────────── Ansicht: Bad ───────────── */
  _vBath() {
    const c = this._c, b = c.bath, room = c.rooms.find(r => r.id === b.room) || c.rooms[0], I = this._room(room);
    const st = this._val(c.stats.bath) || '–', busy = st !== 'Frei' && st !== '–';
    const hum = I.hum, hf = clamp((hum ?? 0) / 100, 0, 1), hcol = hum > 65 ? '#fb7185' : hum > 55 ? '#fbbf24' : '#38bdf8';
    const tiles = b.stats.filter(s => this._s(s[0])).map(s => `<div class="bs"><div class="v big">${de(this._num(s[0]), s[0].includes('durchschnitt') ? 1 : 0)}<small class="u">${s[2]}</small></div><div class="l">${s[1]}</div></div>`).join('');
    return `<div class="vh"><div><h1>Badezimmer</h1><p>${busy ? 'Gerade in Benutzung' : 'Frei'} · ${I.open ? 'Fenster offen' : 'Fenster zu'}</p></div></div>
      <div class="bento">
        <div class="c bstatus s5" style="--i:0"><div class="h">${ic('bath', 14)}Status</div><div><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><span class="pulse ${busy ? 'busy' : ''}"></span><span style="color:var(--tx2);font-size:13px">${busy ? 'Belegt' : 'Verfügbar'}</span></div><div class="v">${esc(st)}</div></div>
          <div class="chips"><span class="chip">${ic('window', 14)}Fenster <b>${I.open ? 'offen' : 'zu'}</b></span>${I.lights.length ? `<span class="chip">${ic('bulb', 14)}Licht <b>${I.on.length ? 'an' : 'aus'}</b></span>` : ''}${I.act === 'heating' ? `<span class="chip">${ic('flame', 14)}<b>heizt</b></span>` : ''}</div></div>
        <div class="c s7" style="--i:1"><div class="h">${ic('drop', 14)}Raumklima</div><div class="twocol">
          <div class="gwrap"><svg viewBox="0 0 200 110" style="width:100%;overflow:visible"><path d="${arc(100, 100, 84, 180, 360)}" fill="none" stroke="rgba(${WH},.09)" stroke-width="14" stroke-linecap="round"/><path d="${arc(100, 100, 84, 180, Math.max(180.5, 180 + 180 * hf))}" fill="none" stroke="${hcol}" stroke-width="14" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${hcol})"/></svg><div class="gv"><div class="big" data-count="${hum ?? 0}" data-d="0">${de(hum, 0)}</div><div style="font-size:12px;color:var(--tx2)">Luftfeuchte %</div></div></div>
          <div style="text-align:center"><div class="big" style="font-size:64px;color:${I.temp != null ? tempCol(I.temp) : 'inherit'}" data-count="${I.temp ?? 0}" data-d="1">${de(I.temp)}</div><div style="font-size:12px;color:var(--tx2);margin-top:6px">Temperatur °C</div></div></div></div>
        <div class="c s12" style="--i:2"><div class="h">${ic('drop', 14)}Duschstatistik</div><div class="bstat">${tiles}</div></div>
        <div class="c s12" style="--i:3"><div class="h">${ic('thermo', 14)}Temperatur &amp; Luftfeuchte<span class="r">24 h</span></div>${this._trend({ id: 'bath', temp: room.temp, hum: room.hum }, '#fb923c', { bare: true })}</div>
        ${I.lights.length ? `<div class="c s12" style="--i:5"><div class="h">${ic('bulb', 14)}Licht</div><div class="lg">${I.lights.map(e => this._lightTile(e)).join('')}</div></div>` : ''}
      </div>`;
  }

  /* ───────────── Ansicht: Wetter ───────────── */
  _sky(cond, night) {
    const m = { sunny: night ? ['#0b1230', '#1b2a5e'] : ['#1d5fb4', '#58b0ea'], 'clear-night': ['#090d24', '#1c2760'], partlycloudy: night ? ['#0e1634', '#2a3a6e'] : ['#2b6cb8', '#7bb6e6'], cloudy: ['#34425e', '#66789a'], rainy: ['#1f2a40', '#3c4f6e'], pouring: ['#161e30', '#2e3d58'], lightning: ['#171630', '#3b2f63'], 'lightning-rainy': ['#171630', '#3b2f63'], snowy: ['#4b5d7e', '#9db2cf'], 'snowy-rainy': ['#44566f', '#8ea3bd'], fog: ['#4b5668', '#8793a6'], hail: ['#34425e', '#7d8fae'], windy: ['#2c4a73', '#6aa0cf'], 'windy-variant': ['#2c4a73', '#6aa0cf'], exceptional: ['#3a2f4a', '#7a5f8a'] };
    const c = m[cond] || m.cloudy;
    return `linear-gradient(160deg,${c[0]} 0%,${c[1]} 100%)`;
  }
  _feels(t, h, w) {
    if (t == null) return null;
    const sf = this._num(this._c.station.feels); if (sf != null) return sf;
    const a = this._attr(this._c.weather, 'apparent_temperature'); if (a != null) return a;
    if (h == null) return t;
    const e = h / 100 * 6.105 * Math.exp(17.27 * t / (237.7 + t));
    return t + 0.33 * e - 0.70 * ((w || 0) / 3.6) - 4;
  }
  _dew(t, h) { const sd = this._num(this._c.station.dew); if (sd != null) return sd; if (t == null || h == null) return null; const g = Math.log(h / 100) + 17.62 * t / (243.12 + t); return 243.12 * g / (17.62 - g); }
  _moonSvg(p, size = 56) {
    const r = 24, c = 28, f = p > .5 ? 1 - p : p, k = Math.cos(2 * Math.PI * f), rx = Math.abs(k) * r;
    const lit = f < .25 ? `M${c} ${c - r}A${r} ${r} 0 0 1 ${c} ${c + r}A${rx.toFixed(2)} ${r} 0 0 0 ${c} ${c - r}z` : `M${c} ${c - r}A${r} ${r} 0 0 1 ${c} ${c + r}A${rx.toFixed(2)} ${r} 0 0 1 ${c} ${c - r}z`;
    return `<svg width="${size}" height="${size}" viewBox="0 0 56 56" style="flex:none"><defs><radialGradient id="mg" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#c7d2fe"/></radialGradient></defs><circle cx="28" cy="28" r="24" fill="rgba(${WH},.07)" stroke="rgba(${WH},.14)"/><g transform="${p > .5 ? 'translate(56 0) scale(-1 1)' : ''}"><path d="${lit}" fill="url(#mg)" style="filter:drop-shadow(0 0 8px rgba(199,210,254,.6))"/></g></svg>`;
  }
  _moon() {
    const age = (((Date.now() - Date.UTC(2000, 0, 6, 18, 14)) / 864e5) % 29.530588853 + 29.530588853) % 29.530588853, p = age / 29.530588853;
    const name = p < .03 || p > .97 ? 'Neumond' : p < .22 ? 'Zunehmende Sichel' : p < .28 ? 'Erstes Viertel' : p < .47 ? 'Zunehmender Mond' : p < .53 ? 'Vollmond' : p < .72 ? 'Abnehmender Mond' : p < .78 ? 'Letztes Viertel' : 'Abnehmende Sichel';
    return { p, name, ill: (1 - Math.cos(2 * Math.PI * p)) / 2 };
  }
  _compass(w) {
    const b = this._num(this._c.station.dir) ?? this._attr(this._c.weather, 'wind_bearing'), sp = w.wind;
    const dirs = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'], from = b != null ? dirs[Math.round(b / 45) % 8] : null;
    const word = sp == null ? '' : sp < 2 ? 'Windstill' : sp < 12 ? 'Leichte Brise' : sp < 29 ? 'Mäßiger Wind' : sp < 50 ? 'Frischer Wind' : sp < 75 ? 'Starker Wind' : 'Sturm';
    const ticks = Array.from({ length: 24 }, (_, i) => `<line x1="65" y1="8" x2="65" y2="${i % 6 === 0 ? 15 : 12}" stroke="rgba(${WH},${i % 6 === 0 ? .5 : .2})" stroke-width="1.5" transform="rotate(${i * 15} 65 65)"/>`).join('');
    const arrow = b != null ? `<g transform="rotate(${(b + 180) % 360} 65 65)"><path d="M65 20 L74 58 L65 52 L56 58z" fill="#5eead4" style="filter:drop-shadow(0 0 6px rgba(94,234,212,.8))"/><path d="M65 110 L65 60" stroke="rgba(94,234,212,.35)" stroke-width="2" stroke-linecap="round"/></g>` : '';
    const gust = this._num(this._c.station.maxGust) ?? this._attr(this._c.weather, 'wind_gust_speed');
    return `<div class="cmp"><svg width="130" height="130" viewBox="0 0 130 130"><circle cx="65" cy="65" r="56" fill="rgba(${WH},.04)" stroke="rgba(${WH},.12)"/>${ticks}
      <text x="65" y="28" text-anchor="middle" fill="rgba(${WH},.7)" font-size="10" font-weight="600">N</text><text x="106" y="69" text-anchor="middle" fill="rgba(${WH},.45)" font-size="10">O</text><text x="65" y="112" text-anchor="middle" fill="rgba(${WH},.45)" font-size="10">S</text><text x="24" y="69" text-anchor="middle" fill="rgba(${WH},.45)" font-size="10">W</text>${arrow}</svg>
      <div class="t"><b>${de(sp, 0)} <small class="u" style="font-size:13px">${esc(w.windU)}</small></b>${word}${from ? '<br>aus ' + from : ''}${gust != null ? '<br>Max. Böe heute ' + de(gust, 0) + ' ' + esc(w.windU) : ''}</div></div>`;
  }
  _meteo() {
    const hr = (this._fc?.hourly || []).slice(0, 24);
    if (hr.length < 4) return this._fc ? '<div class="empty sm">Keine stündliche Vorhersage verfügbar</div>' : '<div class="sk" style="height:200px"></div>';
    const N = hr.length, T = hr.map(d => d.temperature), mn = Math.min(...T), mx = Math.max(...T), rg = Math.max(mx - mn, 2);
    const X = i => (i + .5) / N * 100, Y = t => (1 - (t - mn) / rg) * 66 + 14;
    const pts = hr.map((d, i) => [X(i), Y(d.temperature)]), path = smooth(pts);
    const col = tempCol((mn + mx) / 2);
    let html = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="mga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".38"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><path d="${path}L${X(N - 1)} 100L${X(0)} 100z" fill="url(#mga)"/><path d="${path}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round" vector-effect="non-scaling-stroke" style="filter:drop-shadow(0 0 6px ${col})"/></svg>`;
    hr.forEach((d, i) => {
      const hh = new Date(d.datetime).getHours(), prob = d.precipitation_probability != null ? d.precipitation_probability : Math.min(100, (d.precipitation || 0) * 50);
      if (i % 2 === 0) html += `<span class="ab" style="left:${X(i)}%;top:0">${wx(d.condition, 30)}</span>`;
      if (i % 3 === 0) html += `<span class="ab tl" style="left:${X(i)}%;top:${76 + Y(d.temperature) - 12}px">${de(d.temperature, 0)}°</span>`;
      if (prob >= 5) html += `<i class="rb2" style="left:${X(i)}%;height:${Math.max(4, prob * .36)}px"></i>`;
      if (prob >= 25 && i % 2 === 0) html += `<span class="ab" style="left:${X(i)}%;bottom:${34 + prob * .36 + 6}px;color:#7dd3fc;font-size:11px">${Math.round(prob)}%</span>`;
      if (i % 2 === 0) html += `<span class="ab" style="left:${X(i)}%;bottom:6px">${String(hh).padStart(2, '0')}</span>`;
    });
    return `<div class="mgw"><div class="mg">${html}</div></div>`;
  }
  _vWeather() {
    if (this._wxMode === 'station') return this._vStation();
    const c = this._c, w = this._wxNow(), fc = this._fc?.daily || [], night = this._app?.dataset.tod === 'night';
    const wa = this._s(c.weather)?.attributes || {};
    const st = c.station, feels = this._feels(w.temp, w.hum, w.wind), dew = this._num(st.dew) ?? wa.dew_point ?? this._dew(w.temp, w.hum), d0 = fc[0];
    const uv = this._num(st.uv) ?? wa.uv_index ?? null, sol = this._num(st.solar), dayRain = this._num(st.dayRain), gm = this._num(st.maxGust), strikes = this._num(st.strikes), lastStrike = this._val(st.lastStrike), sDist = this._num(st.strikeDist);
    const WA = this._alerts().filter(a => ['warn', 'pre', 'bolt'].includes(a.id));
    const cloudy = ['partlycloudy', 'cloudy', 'rainy', 'pouring', 'lightning', 'lightning-rainy', 'snowy', 'snowy-rainy', 'fog', 'hail'].includes(w.cond);
    const clouds = (cloudy ? '<i class="cl c1"></i><i class="cl c2"></i><i class="cl c3"></i>' : '') + (w.cond === 'sunny' && !night ? '<i class="sunglow"></i>' : '');
    const lows = fc.map(d => d.templow ?? d.temperature - 5), gmn = Math.min(...lows, 99), gmx = Math.max(...fc.map(d => d.temperature), -99), g = Math.max(gmx - gmn, 1);
    const days = fc.slice(0, 7).map((d, i) => {
      const lo = d.templow ?? d.temperature - 5, l = (lo - gmn) / g * 100, wd = Math.max((d.temperature - lo) / g * 100, 8);
      return `<div class="dr ${i === 0 ? 'f' : ''}"><span class="dd">${i === 0 ? 'Heute' : new Date(d.datetime).toLocaleDateString('de-DE', { weekday: 'short' })}</span>${wx(d.condition, 30)}<span class="dp">${d.precipitation_probability != null && d.precipitation_probability >= 10 ? ic('drop', 11) + d.precipitation_probability + '%' : ''}</span><span class="dlo">${de(lo, 0)}°</span><div class="dbar"><i style="left:${l.toFixed(0)}%;width:${wd.toFixed(0)}%;background:linear-gradient(90deg,${tempCol(lo)},${tempCol(d.temperature)})"></i></div><span class="dhi">${de(d.temperature, 0)}°</span></div>`;
    }).join('');
    const sun = this._s(c.sun)?.attributes || {}, up = this._val(c.sun) === 'above_horizon';
    const nr = new Date(sun.next_rising).getTime(), ns = new Date(sun.next_setting).getTime(), left = Math.max(0, (up ? ns : nr) - Date.now()), lh = Math.floor(left / 36e5), lm = Math.floor(left % 36e5 / 6e4);
    const mo = this._moon();
    const rad = this._s(c.radar), pic = rad?.attributes?.entity_picture;
    const tile = (v, l, icon) => `<div class="dt"><div class="v">${v}</div><div class="l">${ic(icon, 13)}${l}</div></div>`;
    return `<div class="vh"><div><h1>Wetter</h1><p>${COND[w.cond] || w.cond}${feels != null ? ' · gefühlt ' + de(feels, 0) + '°' : ''}</p></div>${this._seg()}</div>
      ${WA.length ? `<div class="alerts">${WA.map(a => this._alertHtml(a)).join('')}</div>` : ''}<div class="bento">
        <div class="c sky s8" style="--i:0;background:${this._sky(w.cond, night)}">${clouds}<div class="skyin">
          <div class="wtop"><div><div class="hello" style="color:rgba(255,255,255,.75)">Jetzt bei dir</div><div class="wtemp big" data-count="${w.temp ?? 0}" data-d="1">${de(w.temp)}<small class="u" style="color:rgba(255,255,255,.8)">°</small></div><div class="wcond">${COND[w.cond] || w.cond}${feels != null ? ' · gefühlt ' + de(feels, 0) + '°' : ''}</div>${d0 ? `<div class="hl2">Höchstwert ${de(d0.temperature, 0)}° · Tiefstwert ${de(d0.templow ?? d0.temperature - 5, 0)}°</div>` : ''}</div>${wx(w.cond, 150)}</div>
          <div class="chips"><span class="chip">${ic('drop', 14)}Luftfeuchte <b>${de(w.hum, 0)} %</b></span><span class="chip">${ic('wind', 14)}Wind <b>${de(w.wind, 0)} ${esc(w.windU)}</b></span><span class="chip">${ic('rain', 14)}Regen <b>${de(w.rain ?? 0)} ${esc(w.rainU)}</b></span>${w.press ? `<span class="chip">${ic('radar', 14)}<b>${de(w.press, 0)} hPa</b></span>` : ''}</div></div></div>
        <div class="c s4" style="--i:1"><div class="h">${ic('sun', 14)}Sonne &amp; Mond</div>${this._sunArc()}
          ${isNaN(lh) ? '' : `<div class="srow" style="margin-top:8px"><span>${up ? 'Noch <b>' + lh + ' h ' + lm + ' min</b> Tageslicht' : 'Sonne in <b>' + lh + ' h ' + lm + ' min</b>'}</span></div>`}
          <div class="moon">${this._moonSvg(mo.p)}<div><b>${mo.name}</b>${Math.round(mo.ill * 100)} % beleuchtet</div></div></div>
        <div class="c s12 wxcard" style="--i:5">${this._wxCard() || `<div class="h">${ic('thermo', 14)}Die nächsten 24 Stunden<span class="r">Temperatur &amp; Regenwahrscheinlichkeit</span></div>${this._meteo()}`}</div>
        <div class="c s12 trcard" style="--i:6">${this._trCard() || `<div class="h">${ic('cloudsun', 14)}Die nächsten Tage</div>${days || (this._fc ? '<div class="empty sm">Keine Vorhersage verfügbar</div>' : '<div class="sk" style="height:200px"></div>')}`}</div>
        ${this._radarCard(7, 's12')}
      </div>`;
  }

