  /* ───────────── Drucker (Bambu Lab) ───────────── */
  _pe(s) { return this._c.printer.prefix + s; }
  _pv(s) { const v = this._val(this._pe(s)); return okv(v) && v !== '' ? v : null; }
  _pn(s) { return this._num(this._pe(s)); }
  _hm(h) { if (h == null) return '–'; const m = Math.round(h * 60); return m >= 60 ? Math.floor(m / 60) + ' Std ' + String(m % 60).padStart(2, '0') + ' Min' : m + ' Min'; }
  _gauge(l, cur, tgt, mx, col) {
    const f = clamp((cur ?? 0) / mx, 0, 1), at = 135 + 270 * clamp((tgt ?? 0) / mx, 0, 1), tx = 60 + 46 * Math.cos(at * Math.PI / 180), ty = 60 + 46 * Math.sin(at * Math.PI / 180);
    return `<div class="gg"><svg viewBox="0 0 120 120"><path d="${arc(60, 60, 46, 135, 405)}" fill="none" stroke="rgba(${WH},.09)" stroke-width="9" stroke-linecap="round"/>${cur != null && f > .01 ? `<path d="${arc(60, 60, 46, 135, Math.max(135.5, 135 + 270 * f))}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" style="filter:drop-shadow(0 0 6px ${col})"/>` : ''}${tgt ? `<circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="5.500" fill="${FG}" style="filter:drop-shadow(0 0 5px rgba(${WH},.8))"/>` : ''}</svg><div class="gt"><div class="big">${cur != null ? de(cur, 0) : '–'}<small class="u">°</small></div></div><div class="gl">${l}${tgt ? '<span>Ziel ' + de(tgt, 0) + '°</span>' : ''}</div></div>`;
  }
  _tile(v, l, icon) { return `<div class="dt"><div class="v">${v}</div><div class="l">${ic(icon, 13)}${l}</div></div>`; }
  /* ───────────── Drucker: mehrere AMS + Live-Kamera ───────────── */
  _amsList() {
    const S = this._h.states, out = [];
    for (const k in S) {
      const m = /^sensor\.(.+)_slot_1$/.exec(k); if (!m || !S[`sensor.${m[1]}_slot_2`] || S[k].attributes?.empty === undefined && S[k].attributes?.filament_id === undefined && S[k].attributes?.type === undefined && !/ams/i.test(k)) continue;
      const b = m[1], f = (dom, ...n) => { for (const x of n) if (S[`${dom}.${b}_${x}`]) return `${dom}.${b}_${x}`; return `${dom}.${b}_${n[0]}`; };
      const num = /ams_?(\d+)$/i.exec(b);
      out.push({ b, num: num ? +num[1] : null, slot: n => `sensor.${b}_slot_${n}`, hum: f('sensor', 'luftfeuchtigkeit', 'humidity'), temp: f('sensor', 'temperatur', 'temperature'), dry: f('binary_sensor', 'trocknen', 'trocknen_2', 'drying'), on: S[`binary_sensor.${b}_aktiv`]?.state === 'on', alive: S[k].state !== 'unavailable' });
    }
    if (out.some(x => x.num == null) && !out.some(x => x.num === 1)) { const z = out.find(x => x.num == null); if (z) z.num = 1; }
    out.sort((a, b) => (a.num ?? 99) - (b.num ?? 99) || a.b.localeCompare(b.b));
    out.forEach((x, i) => { x.name = out.length > 1 ? 'AMS ' + (x.num ?? i + 1) : 'AMS'; });
    return out;
  }
  _camSrc(cam) {
    const a = cam.attributes || {}, ep = a.entity_picture; if (!this._camBound) this._camInit();
    if (this._c.printer.stream && a.access_token && !this._h.config?.mock) return `/api/camera_proxy_stream/${this._c.printer.camera}?token=${a.access_token}`;
    return this._camLast || ep || null;
  }
  /* Live-Bild: nächstes Einzelbild erst laden, wenn das vorige angekommen ist (so schnell, wie die Kamera liefert) */
  _camInit() {
    this._camBound = true;
    const step = async () => {
      if (!this._camBound) return;
      const cam = this._s(this._c.printer.camera), ep = cam?.attributes?.entity_picture, im = this._main?.querySelector('.camimg');
      if (this._v !== 'printer' || document.hidden || !im || !ep || ep[0] !== '/' || this._c.printer.stream) { this._camT = setTimeout(step, 1000); return; }
      try {
        const ac = new AbortController(), to = setTimeout(() => ac.abort(), 8000);
        let r; try { r = await fetch(ep + (ep.includes('?') ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store', signal: ac.signal }); } finally { clearTimeout(to); }
        if (!r.ok) throw 0;
        const u = URL.createObjectURL(await r.blob()), old = this._camLast; this._camLast = u; this._camAt = Date.now(); this._camFail = 0;
        { const bd = this._main.querySelector('.camstale'); if (bd) bd.innerHTML = this._camBadge(); }
        const el = this._main.querySelector('.camimg'); if (el) el.src = u;
        if (old) setTimeout(() => URL.revokeObjectURL(old), 3000);
        this._camT = setTimeout(step, 150);
      } catch (e) { this._camFail = (this._camFail || 0) + 1; const bd = this._main?.querySelector('.camstale'); if (bd) bd.innerHTML = this._camBadge(); this._camT = setTimeout(step, 2500); }
    };
    this._camT = setTimeout(step, 50);
  }
  _vPrinter() {
    const p = this._c.printer, P = this._printerInfo(), offline = !P || P.offline;
    const L = { running: 'Druckt', pause: 'Pausiert', finish: 'Fertig', failed: 'Fehlgeschlagen', idle: 'Bereit', prepare: 'Bereitet vor', slicing: 'Wird berechnet', init: 'Startet' };
    const SP = { silent: 'Leise', standard: 'Standard', sport: 'Sport', ludicrous: 'Rennmodus' };
    const pw = this._s(p.power) ? this._val(p.power) : null, lt = this._s(p.light) && this._val(p.light) !== 'unavailable' ? p.light : null;
    const cam = this._s(p.camera), pic = !offline && cam && cam.state !== 'unavailable' ? this._camSrc(cam) : null;
    const job = this._pv('name_der_aufgabe') || this._pv('gcode_dateiname'), stage = this._pv('aktueller_arbeitsschritt');
    const pct = P?.pct, lay = this._pn('aktuelle_schicht'), lays = this._pn('gesamtzahl_der_schichten'), rem = this._pn('verbleibende_zeit');
    const cls = !P || offline ? '' : P.st === 'running' ? 'live' : P.st === 'failed' ? 'bad' : P.st === 'pause' ? 'warn' : 'ok';
    const label = offline ? 'Offline' : (L[P.st] || P.st);
    const cost = this._num(p.cost), eJ = this._num(p.energyJob), eT = this._num(p.energyTotal), eY = this._num(p.energyYear), pW = this._num(p.powerW), vV = this._num(p.volt), fC = this._num(p.filamentCost);
    const hasErr = this._val(p.error) === 'on' || this._val(p.hms) === 'on';
    const toggles = `${pw != null && pw !== 'unavailable' ? `<button class="qb ${pw === 'on' ? 'on' : ''}" data-act="toggle" data-e="${p.power}">${ic('power', 14)}${pw === 'on' ? 'Steckdose an' : (offline ? 'Drucker einschalten' : 'Steckdose aus')}</button>` : ''}${lt ? `<button class="qb ${this._val(lt) === 'on' ? 'on' : ''}" data-act="toggle" data-e="${lt}">${ic('bulb', 14)}Druckraumlicht</button>` : ''}`;
    const hero = `<div class="c s8 prh" style="--i:0"><div class="prcam">${pic ? `<img class="camimg" src="${esc(pic)}" alt="Kamera">` : `<div class="prnone">${ic('printer', 54)}<span>${offline ? 'Drucker offline' : 'Keine Kamera'}</span></div>`}<span class="tag ${cls} prpill">${label}</span><span class="camstale">${pic ? this._camBadge() : ''}</span></div>
      <div class="prinfo"><div class="h" style="margin-bottom:8px">${ic('printer', 14)}${esc(p.name)}${hasErr ? '<span class="r" style="color:var(--bad)">Fehler gemeldet</span>' : ''}</div>
        ${offline ? `<div class="prtitle">Gerade nicht erreichbar</div><div class="hello">${pw === 'off' ? 'Die Steckdose ist ausgeschaltet.' : 'Keine Verbindung zum Drucker.'}</div>` : `<div class="prtitle">${esc(job || 'Kein aktiver Auftrag')}</div><div class="hello">${esc(stage ? stage.replace(/_/g, ' ') : (L[P.st] || ''))}</div>
          <div class="pbar"><i style="width:${clamp(pct ?? 0, 0, 100)}%"></i></div>
          <div class="prs"><div><b>${pct != null ? de(pct, 0) + ' %' : '–'}</b><span>Fortschritt</span></div><div><b>${lay != null ? de(lay, 0) + (lays != null ? ' / ' + de(lays, 0) : '') : '–'}</b><span>Schicht</span></div><div><b>${this._hm(rem)}</b><span>Rest</span></div><div><b>${P.end && okv(P.end) ? hhmm(P.end) : '–'}</b><span>Fertig um</span></div></div>`}
        <div class="prctl">${toggles}</div></div></div>`;
    const power = `<div class="c s4" style="--i:1"><div class="h">${ic('bolt', 14)}Strom &amp; Kosten</div><div class="dg" style="grid-template-columns:1fr 1fr">${this._tile(pW != null ? de(pW, 0) + '<small class="u">W</small>' : '–', 'Leistung', 'bolt')}${this._tile(vV != null ? de(vV, 0) + '<small class="u">V</small>' : '–', 'Spannung', 'plug')}${this._tile(eJ != null ? de(eJ, 2) + '<small class="u">kWh</small>' : '–', 'Aktueller Job', 'bolt')}${this._tile(cost != null ? de(cost, 2) + '<small class="u">€</small>' : '–', 'Kosten Druck', 'fuel')}${this._tile(eT != null ? de(eT, 0) + '<small class="u">kWh</small>' : '–', 'Gesamt', 'gauge')}${this._tile(eY != null ? de(eY, 0) + '<small class="u">kWh</small>' : '–', 'Dieses Jahr', 'cal')}</div>${fC ? `<div class="card-note">Filament: ${de(fC, 2)} €</div>` : ''}</div>`;
    const temps = `<div class="c s7" style="--i:2"><div class="h">${ic('thermo', 14)}Temperaturen</div><div class="ggs">${this._gauge('Düse', this._pn('temperatur_der_duse'), this._pn('zieltemperatur_der_duse'), 300, '#fb923c')}${this._gauge('Druckbett', this._pn('druckbetttemperatur'), this._pn('zieltemperatur_vom_druckbett'), 120, '#f472b6')}${this._gauge('Druckraum', this._pn('temperatur_im_druckraum'), null, 60, '#38bdf8')}</div></div>`;
    const fans = [['Bauteillüfter', 'bauteillufterdrehzahl'], ['Druckraumlüfter', 'druckraumlufterdrehzahl'], ['Druckkopflüfter', 'druckkopflufterdrehzahl'], ['Hotendlüfter', 'hotendlufterdrehzahl']].map(f => { const v = this._pn(f[1]); return `<div class="fan"><span>${f[0]}</span><div class="pc2"><i style="width:${clamp(v ?? 0, 0, 100)}%;background:#5eead4"></i></div><b>${v != null ? de(v, 0) + ' %' : '–'}</b></div>`; }).join('');
    const sp = this._pv('geschwindigkeitsprofil'), wifi = this._pn('wi_fi_signalqualitat');
    const fanc = `<div class="c s5" style="--i:3"><div class="h">${ic('wind', 14)}Lüfter &amp; Tempo</div>${fans}<div class="tags" style="margin-top:14px"><span class="tag">${ic('gauge', 12)}${esc(SP[sp] || sp || '–')}</span><span class="tag">WLAN ${wifi != null ? de(wifi, 0) + ' dBm' : '–'}</span>${this._val(p.door) === 'on' ? '<span class="tag warn">Gehäusetür offen</span>' : ''}</div></div>`;
    const AL = this._amsList();
    const amsCard = (A, cls, i) => {
      const slots = [1, 2, 3, 4].map(n => {
        const e = A.slot(n), s = this._s(e), a = s?.attributes || {}, ok = s && okv(s.state) && s.state !== 'empty' && a.empty !== true;
        const col = a.color ? '#' + String(a.color).replace('#', '').slice(0, 6) : null, rm = a.remain ?? a.remaining;
        return `<div class="spool ${a.active ? 'act' : ''}"><div class="sp-c" style="${ok && col ? `background:${col};box-shadow:0 0 22px ${col}66` : ''}">${ic('spool', 34)}</div><b>${ok ? esc(a.type || a.name || s.state) : (offline && !A.alive ? '–' : 'Leer')}</b><span>${ok && rm != null && rm >= 0 ? de(rm, 0) + ' %' : 'Slot ' + n}</span></div>`;
      }).join('');
      const ah = this._num(A.hum), at = this._num(A.temp), dry = this._val(A.dry) === 'on';
      return `<div class="c ${cls}" style="--i:${4 + i}"><div class="h">${ic('spool', 14)}${esc(A.name)}<span class="r">${dry ? 'Trocknet' : (A.on ? 'Aktiv' : '')}</span></div><div class="spools">${slots}</div><div class="tags" style="margin-top:14px"><span class="tag">${ic('drop', 12)}${ah != null ? de(ah, 0) + ' %' : '–'}</span><span class="tag">${ic('thermo', 12)}${at != null ? de(at, 1) + ' °C' : '–'}</span></div></div>`;
    };
    const many = AL.length > 1;
    const ams = AL.map((A, i) => amsCard(A, many ? 's6' : 's8', i)).join('');
    const wt = this._pn('gewicht_des_drucks'), ln = this._pn('drucklange'), tot = this._pn('gesamtnutzung'), nz = this._pv('dusentyp'), nzs = this._pn('dusengrosse');
    const facts = `<div class="c ${many ? 's12' : 's4'}" style="--i:6"><div class="h">${ic('list', 14)}Druckdaten</div><div class="dg" style="grid-template-columns:${many ? 'repeat(auto-fit,minmax(150px,1fr))' : '1fr 1fr'}">${this._tile(wt != null ? de(wt, 0) + '<small class="u">g</small>' : '–', 'Gewicht', 'gauge')}${this._tile(ln != null ? de(ln, 1) + '<small class="u">m</small>' : '–', 'Länge', 'list')}${this._tile(tot != null ? de(tot, 0) + '<small class="u">h</small>' : '–', 'Betriebszeit', 'cal')}${this._tile(nz ? esc(nz) + (nzs != null ? ' ' + de(nzs, 1) : '') : '–', 'Düse', 'printer')}</div></div>`;
    return `<div class="vh"><div><h1>Drucker</h1><p>${offline ? 'Offline' : label}${P && P.running && P.end && okv(P.end) ? ' · fertig um ' + hhmm(P.end) : ''}</p></div></div><div class="bento">${hero}${power}${temps}${fanc}${ams}${facts}</div>`;
  }

  /* ───────────── Wetterstation (Ecowitt) ───────────── */
  _sv(k) { return this._num(this._c.station[k]); }
  _enum(k) { const e = this._c.station[k], v = this._val(e); return !okv(v) || v === 'outside_calculable_range' ? '' : (ENUM[v] || String(v).replace(/_/g, ' ')); }
  _seg() { return `<div class="seg"><button class="${this._wxMode === 'fc' ? 'on' : ''}" data-act="wxmode" data-m="fc">${ic('cloudsun', 16)}Vorhersage</button><button class="${this._wxMode === 'station' ? 'on' : ''}" data-act="wxmode" data-m="station">${ic('radar', 16)}Wetterstation</button></div>`; }
  async _loadRain7() {
    const e = this._c.station.dayRain;
    if (!e || this._rb || (this._rn7t && Date.now() - this._rn7t < 6e5)) return;
    this._rb = true;
    const t0 = new Date(); t0.setHours(0, 0, 0, 0); t0.setDate(t0.getDate() - 6);
    try {
      const r = await this._h.callWS({ type: 'recorder/statistics_during_period', start_time: t0.toISOString(), statistic_ids: [e], period: 'day', types: ['change'] });
      const m = {}; for (const x of (r?.[e] || [])) m[new Date(x.start).toDateString()] = (m[new Date(x.start).toDateString()] || 0) + (x.change || 0);
      this._rn7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(+t0 + i * 864e5); return { d, v: m[d.toDateString()] || 0 }; });
    } catch (err) { this._rn7 = null; }
    this._rn7t = Date.now(); this._rb = false; this._renderSoon();
  }
  _gring(f, col, val, unit, label, sub) {
    const a1 = 135 + 270 * clamp(f, 0.015, 1);
    return `<div class="gr"><svg viewBox="0 0 120 120"><path d="${arc(60, 60, 48, 135, 405)}" fill="none" stroke="rgba(${WH},.09)" stroke-width="9" stroke-linecap="round"/>${f != null ? `<path d="${arc(60, 60, 48, 135, a1)}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" style="filter:drop-shadow(0 0 6px ${col})"/>` : ''}</svg><div class="gv"><b>${val}</b><small>${unit}</small></div><div class="gl2">${label}</div><div class="gs">${sub || '&nbsp;'}</div></div>`;
  }
  _vStation() {
    const c = this._c, st = c.station, w = this._wxNow(), night = this._app?.dataset.tod === 'night';
    const t = this._sv('temp') ?? w.temp, hum = this._sv('hum') ?? w.hum, feels = this._sv('feels'), dew = this._sv('dew');
    const cond = this._val(c.stationWeather) && okv(this._val(c.stationWeather)) ? this._val(c.stationWeather) : w.cond;
    this._need.add(st.temp); this._need.add(st.hum); this._need.add(st.press);
    const hpts = (this._hist[st.temp]?.pts || []).filter(p => !isNaN(p[1])), ht = hpts.map(p => p[1]);
    const mn = ht.length ? Math.min(...ht) : null, mx = ht.length ? Math.max(...ht) : null;
    const tOf = v => { const p = hpts.find(q => q[1] === v); return p ? hhmm(p[0]) : ''; };
    const hp = this._hist[st.press]?.pts?.map(p => p[1]) || [], dP = hp.length > 4 ? hp[hp.length - 1] - hp[0] : null;
    const upd = this._s(st.temp)?.last_updated, comf = this._enum('humidexL') || this._enum('dewL');
    const spd = this._sv('speed') ?? w.wind, uv = this._sv('uv'), sol = this._sv('solar'), lux = this._sv('lux');
    const uvL = uv == null ? '' : uv < 3 ? 'Niedrig' : uv < 6 ? 'Mäßig' : uv < 8 ? 'Hoch' : uv < 11 ? 'Sehr hoch' : 'Extrem';
    const uvC = uv == null ? '#94a3b8' : uv < 3 ? '#34d399' : uv < 6 ? '#fbbf24' : uv < 8 ? '#fb923c' : uv < 11 ? '#fb7185' : '#c084fc';
    const T = (v, d, u) => v == null ? '–' : de(v, d) + (u ? '<small class="u">' + u + '</small>' : '');
    const dirs = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'], bear = this._sv('dir'), dTxt0 = bear != null ? dirs[Math.round(bear / 45) % 8] + ' · ' + de(bear, 0) + '°' : '';
    const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
    const inR = c.rooms.filter(r => r.temp && !st.innen.exclude.includes(r.id)).map(r => [r.temp, r.hum, null, r.name]).concat(st.innen.extra.map(x => [x[1], x[2], null, x[0]])).filter(r => this._s(r[0]) && okv(this._val(r[0])));
    const inT = avg(inR.map(r => this._num(r[0])).filter(v => v != null)), inH = avg(inR.map(r => this._num(r[1])).filter(v => v != null));
    this._loadRain7();
    const r7 = this._rn7 && this._rn7.length ? this._rn7 : null;
    const spread = t != null && dew != null ? t - dew : null, fr = this._sv('frost');
    const warn = t != null && (t <= 2 || (fr != null && fr < 0 && t < 4)) ? ['Frostgefahr', '#93c5fd'] : spread != null && spread <= 1.5 && hum >= 95 ? ['Nebel möglich', '#cbd5e1'] : null;
    const batLow = st.batteryBin.some(e => this._val(e) === 'on');
    const hero = `<div class="c sky s5" style="--i:0;background:${this._sky(cond, night)}"><div class="skyin">
        <div class="wtop"><div><div class="hello" style="color:rgba(255,255,255,.75)">${esc(st.name)}</div><div class="wtemp big" data-count="${t ?? 0}" data-d="1">${de(t)}<small class="u" style="color:rgba(255,255,255,.8)">°</small></div><div class="wcond">${feels != null ? 'Gefühlt ' + de(feels, 1) + '°' : (COND[cond] || cond)}${comf ? ' · ' + esc(comf) : ''}</div></div>${wx(cond, 110)}</div>
        ${mn != null ? `<div class="hlr"><span style="color:#93c5fd">${ic('thermo', 14)}Tief <b>${de(mn, 1)}°</b><i>${tOf(mn)}</i></span><span style="color:#fda4af">${ic('thermo', 14)}Hoch <b>${de(mx, 1)}°</b><i>${tOf(mx)}</i></span></div>` : ''}
        <div class="chips">${dew != null ? `<span class="chip">${ic('thermo', 14)}Taupunkt <b>${de(dew, 1)}°</b></span>` : ''}${upd && this._rel(upd) !== '–' ? (this._stale(st.temp, 60) != null ? `<span class="chip stc">${ic('clock', 14)}Keine Daten seit <b>${this._agoTxt(this._stale(st.temp, 60))}</b></span>` : `<span class="chip">Aktualisiert <b>${this._rel(upd)}</b></span>`) : ''}${warn ? `<span class="chip" style="color:${warn[1]}">${ic('thermo', 14)}<b>${warn[0]}</b></span>` : ''}${batLow ? `<span class="chip stc">${ic('battery', 14)}<b>Batterie schwach</b></span>` : ''}</div></div></div>`;
    const rings = `<div class="c s7" style="--i:1"><div class="h">${ic('gauge', 14)}Jetzt<span class="r">Außen · Innen</span></div><div class="grs">
        ${this._gring(t == null ? 0 : clamp((t + 10) / 50, 0, 1), t == null ? '#94a3b8' : tempCol(t), de(t, 1), '°C', 'Außen', feels != null ? 'Gefühlt ' + de(feels, 1) + '°' : '')}
        ${this._gring(hum == null ? 0 : hum / 100, '#38bdf8', de(hum, 0), '%', 'Luftfeuchte', dew != null ? 'Taupunkt ' + de(dew, 1) + '°' : '')}
        ${this._gring(spd == null ? 0 : clamp(spd / 60, 0, 1), '#5eead4', de(spd, 1), 'km/h', 'Wind', dTxt0)}
        ${this._gring(inT == null ? 0 : clamp((inT - 5) / 30, 0, 1), inT == null ? '#94a3b8' : tempCol(inT), de(inT, 1), '°C', inR.length > 1 ? 'Innen Ø' : 'Innen', inH != null ? 'ohne Bad · ' + de(inH, 0) + ' %' : 'ohne Bad')}</div>
        ${inR.length ? `<div class="ins">${inR.map(r => `<div class="inc"><span class="n">${ic('home', 14)}${esc(r[3] || this._name(r[0]).replace(/^HP2550A_Pro_V[\d.]+\s*/i, '') || 'Innen')}</span><b>${de(this._num(r[0]), 1)}°</b><span class="hm">${this._num(r[1]) != null ? de(this._num(r[1]), 0) + ' %' : ''}</span></div>`).join('')}</div>` : ''}</div>`;
    const sunc = `<div class="c s4" style="--i:2"><div class="h">${ic('sun', 14)}Sonne &amp; Licht<span class="r" style="color:${uvC}">UV ${uv != null ? de(uv, 0) : '–'} · ${uvL || '–'}</span></div>${this._sunArc()}
        <div class="dg" style="grid-template-columns:1fr 1fr;margin-top:10px">${this._tile(T(sol, 0, 'W/m²'), 'Strahlung', 'sun')}${this._tile(lux == null ? '–' : lux >= 1000 ? de(lux / 1000, 1) + '<small class="u">klx</small>' : de(lux, 0) + '<small class="u">lx</small>', 'Helligkeit', 'bulb')}</div></div>`;
    const rr = [['Stunde', 'rainHour'], ['Heute', 'dayRain'], ['Woche', 'rainWeek'], ['Monat', 'rainMonth'], ['Jahr', 'rainYear']].map(r => [r[0], this._sv(r[1])]), rmax = Math.max(...rr.map(r => r[1] ?? 0), 1);
    const rate = this._sv('rainRate') || 0;
    const rain = `<div class="c s4" style="--i:3"><div class="h">${ic('rain', 14)}Regen<span class="r">${rate > 0 ? 'Es regnet' : 'Trocken'}</span></div>
        <div class="rrt"><div><div class="big" style="font-size:40px">${T(rate, 1)}</div><div class="l" style="font-size:12px;color:var(--tx2);margin-top:4px">mm/h · Rate</div></div><div><div class="big" style="font-size:40px">${T(this._sv('rainEvent') ?? 0, 1)}</div><div class="l" style="font-size:12px;color:var(--tx2);margin-top:4px">mm · Ereignis</div></div></div>
        ${rr.map(r => `<div class="rrow"><span>${r[0]}</span><div class="pc2" style="width:auto;flex:1"><i style="width:${clamp((r[1] ?? 0) / rmax * 100, r[1] ? 3 : 0, 100)}%;background:linear-gradient(90deg,#38bdf8,#818cf8)"></i></div><b>${r[1] != null ? de(r[1], r[0] === 'Jahr' ? 0 : 1) + ' mm' : '–'}</b></div>`).join('')}${r7 ? `<div class="r7h">Letzte 7 Tage</div><div class="r7">${r7.map(d => `<div><b>${d.v >= 0.05 ? de(d.v, 1) : ''}</b><i style="height:${Math.max(d.v >= 0.05 ? 4 : 2, d.v / Math.max(...r7.map(x => x.v), 1) * 38).toFixed(0)}px"></i><span>${d.d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '')}</span></div>`).join('')}</div>` : ''}</div>`;
    const dT = dP == null ? '' : Math.abs(dP) < 1 ? 'Stabil' : dP > 0 ? 'Steigend' : 'Fallend';
    const d3 = hp.length > 12 ? hp[hp.length - 1] - hp[hp.length - 10] : null;
    const pTxt = d3 == null ? '' : d3 <= -3 ? 'Druck fällt schnell – Sturm oder Unwetter möglich' : d3 <= -1 ? 'Druck fällt – Wetter wird unbeständiger' : d3 >= 3 ? 'Druck steigt schnell – rasche Besserung' : d3 >= 1 ? 'Druck steigt – Wetter beruhigt sich' : 'Druck stabil – kaum Änderung';
    const press = `<div class="c s4" style="--i:4"><div class="h">${ic('radar', 14)}Luftdruck<span class="r">${dT ? dT + ' · ' + (dP > 0 ? '+' : '') + de(dP, 1) + ' hPa' : ''}</span></div><div class="big" style="font-size:40px;margin-bottom:6px">${T(this._sv('press'), 1, 'hPa')}</div>${this._chart([{ e: st.press, name: 'Luftdruck', color: '#a78bfa' }], { h: 140, dec: 0 })}${pTxt ? `<div class="card-note" style="margin-top:8px">${pTxt} <small>(3 h: ${d3 > 0 ? '+' : ''}${de(d3, 1)} hPa)</small></div>` : ''}</div>`;
    const mgS = this._s(st.maxGust), gT = mgS && (this._sv('maxGust') || 0) > 0 && new Date(mgS.last_changed).toDateString() === new Date().toDateString() ? ' · ' + hhmm(mgS.last_changed) : '';
    const wind = `<div class="c s4" style="--i:6"><div class="h">${ic('wind', 14)}Wind</div>${this._compass({ ...w, wind: spd })}<div class="dg" style="margin-top:12px;grid-template-columns:1fr 1fr">${this._tile(T(this._sv('gust'), 0, 'km/h'), 'Böe jetzt', 'wind')}${this._tile(T(this._sv('maxGust'), 0, 'km/h'), (gT ? 'Max. Böe' + gT : 'Stärkste heute'), 'wind')}</div></div>`;
    const ls = this._val(st.lastStrike), dist = this._sv('strikeDist'), recent = okv(ls) && Date.now() - new Date(ls).getTime() < 90 * 6e4;
    const bolt = `<div class="c s4" style="--i:7"><div class="h">${ic('bolt', 14)}Blitze<span class="r" style="${recent ? 'color:var(--warm)' : ''}">${recent ? 'Aktiv in der Nähe' : 'Ruhig'}</span></div><div class="dg" style="grid-template-columns:1fr 1fr">${this._tile(T(this._sv('strikes'), 0), 'Heute', 'bolt')}${this._tile(T(dist, 0, 'km'), 'Entfernung', 'radar')}</div>${okv(ls) ? `<div class="card-note" style="margin-top:8px">Letzter Blitz: ${this._rel(ls)}</div>` : ''}</div>`;
    const hx = this._sv('humidex'), hxF = hx == null ? null : clamp((hx - 10) / 40, 0, 1);
    const hband = hxF == null ? '' : `<div class="hb"><div class="hbt"><i style="left:${(hxF * 100).toFixed(1)}%"></i></div><div class="hbl"><span>Kühl</span><span>Angenehm</span><span>Schwül</span><span>Hitze</span><span>Gefahr</span></div></div>`;
    const heat = `<div class="c s4" style="--i:8"><div class="h">${ic('flame', 14)}Hitze &amp; Komfort<span class="r">${esc(this._enum('humidexL') || '')}</span></div>${hband}<div class="dg heatg" style="margin-top:12px">${this._tile(T(feels, 1, '°'), 'Gefühlt', 'thermo')}${this._tile(T(this._sv('humidex'), 1, '°'), 'Humidex', 'sun')}${this._tile(T(this._sv('heat'), 1, '°'), 'Hitzeindex', 'flame')}</div></div>`;
    const bat = st.batteryPct.filter(e => this._s(e) && okv(this._val(e))).map(e => `<span class="bch"><i style="background:${this._num(e) < 25 ? '#fb7185' : '#34d399'}"></i>${esc(this._clean(this._name(e)).replace(/^HP2550A_Pro_V[\d.]+\s*/i, ''))} <b>${de(this._num(e), 0)} %</b></span>`);
    const bin = st.batteryBin.filter(e => this._s(e) && okv(this._val(e))).map(e => `<span class="bch"><i style="background:${this._val(e) === 'on' ? '#fb7185' : '#34d399'}"></i>${esc(this._name(e).replace(/^HP2550A_Pro_V[\d.]+\s*/i, ''))} <b>${this._val(e) === 'on' ? 'schwach' : 'OK'}</b></span>`);
    const sens = `<div class="c s4" style="--i:9"><div class="h">${ic('battery', 14)}Sensor-Batterien</div><div class="bchs">${bat.concat(bin).join('') || '<div class="empty">Keine Daten</div>'}</div></div>`;
    return `<div class="vh"><div><h1>Wetter</h1><p>${esc(st.name)}${upd && this._rel(upd) !== '–' ? ' · ' + this._rel(upd) : ''}</p></div>${this._seg()}</div>
      <div class="bento">${hero}${rings}${sunc}${rain}${press}
        <div class="c s8" style="--i:5"><div class="h">${ic('thermo', 14)}Temperatur &amp; Luftfeuchte<span class="r">24 h</span></div>${this._trend({ id: 'stn', temp: st.temp, hum: st.hum }, '#fb923c', { bare: true, h: 170 })}</div>
        ${wind}${heat}${bolt}${sens}</div>`;
  }

