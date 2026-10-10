  /* ───────────── v6.1: Tablet-Sperre (Kiosk Mode + PIN) ───────────── */
  _lockOn() { const e = this._c.unlock?.entity; return !!(WALL_UI && e && this._s(e)); }
  _lockBtn() {
    if (!this._lockOn()) return '';
    const open = this._val(this._c.unlock.entity) === 'on';
    return `<button class="nb lk ${open ? 'on' : ''}" data-act="lock">${ic(open ? 'unlock' : 'lock', 24)}<span class="lab">${open ? 'Sperren' : 'Entsperren'}</span></button>`;
  }
  _unlockPin() { const u = this._c.unlock || {}, s = this._val(u.pin); return okv(s) && String(s).length ? String(s) : String(u.code || ''); }
  _lockToggle() {
    const e = this._c.unlock.entity;
    if (this._val(e) === 'on') { this._h.callService('input_boolean', 'turn_off', { entity_id: e }); this._toast('Gesperrt 🔒'); return; }
    this._pin = ''; this._pinBad = 0; this._sheet = { t: 'pin' }; this._renderSheet();
  }
  _pinKey(k) {
    if (Date.now() < (this._pinWait || 0)) return;
    const need = this._unlockPin(); if (!need) return;
    this._pin = ((this._pin || '') + k).slice(0, need.length); this._pinBad = 0;
    if (this._pin.length < need.length) return this._renderSheet();
    if (this._pin === need) {
      if (this._sheet?.kid) { const pn = this._pin; this._pinFails = 0; this._pin = ''; this._kidPinOk(pn); return; }
      this._h.callService('input_boolean', 'turn_on', { entity_id: this._c.unlock.entity }); this._pinFails = 0; this._pin = ''; this._closeSheet(); this._toast('Entsperrt 🔓'); return;
    }
    this._pinFails = (this._pinFails || 0) + 1; this._pinBad = Date.now(); this._pin = '';
    if (this._pinFails >= 5) { this._pinWait = Date.now() + 30000; this._pinFails = 0; }
    this._renderSheet();
  }
  _sPin() {
    const need = this._unlockPin(), n = need.length || 4, p = this._pin || '', bad = Date.now() - (this._pinBad || 0) < 700, wait = Date.now() < (this._pinWait || 0);
    const dots = Array.from({ length: n }, (_, i) => `<i class="${i < p.length ? 'on' : ''}"></i>`).join('');
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<button class="pk" data-act="pk" data-k="${k}">${k}</button>`).join('') + `<span></span><button class="pk" data-act="pk" data-k="0">0</button><button class="pk del" data-act="pdel" aria-label="Löschen">${ic('backspace', 24)}</button>`;
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('lock', 24)}</div><div><h2>${this._sheet.kid ? 'Eltern-PIN' : 'Tablet entsperren'}</h2><p>${!need ? 'PIN nicht verfügbar' : wait ? 'Zu viele Versuche – kurz warten' : bad ? 'Falsche PIN' : this._sheet.kid ? 'PIN eingeben für ' + esc(this._kidActTxt()) : 'PIN eingeben für Seitenleiste &amp; Einstellungen'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="pinw"><div class="pdots ${bad ? 'bad' : ''}">${dots}</div><div class="pad">${keys}</div></div>`;
  }

  /* ───────────── Tanken: Übersicht der günstigsten Tankstellen (Tankerkönig) ───────────── */
  _fuelData(kind) {
    const S = this._h.states, st = {}, hl = this._h.config?.latitude, hn = this._h.config?.longitude;
    const km = (a, b, c, d) => { if ([a, b, c, d].some(v => v == null || isNaN(v))) return null; const R = Math.PI / 180, x = (d - b) * R * Math.cos((a + c) / 2 * R), y = (c - a) * R; return Math.sqrt(x * x + y * y) * 6371; };
    for (const k in S) {
      const s = S[k], a = s.attributes || {};
      if (!k.startsWith('sensor.') || !a.fuel_type || !a.station_name) continue;
      const id = k.replace(/_(super_e10|super|diesel|e10|e5)$/, '');
      const o = st[id] || (st[id] = { e: {}, id, brand: a.brand || a.station_name, name: String(a.friendly_name || a.station_name).replace(/\s+(Super E10|Super E5|Super|Diesel|E10|E5)$/i, ''), street: [a.street, a.house_number].filter(Boolean).join(' '), city: a.city, lat: a.latitude, lon: a.longitude, p: {}, t: 0 });
      const v = parseFloat(s.state);
      if (v > 0 && v < 10) { o.p[String(a.fuel_type).toLowerCase()] = v; o.e[String(a.fuel_type).toLowerCase()] = k; o.t = Math.max(o.t, new Date(s.last_updated).getTime() || 0); }
    }
    for (const k in S) {
      if (!k.startsWith('binary_sensor.') || !/_status$/.test(k)) continue;
      const o = st[k.replace(/_status$/, '')]; if (o) o.open = S[k].state === 'on';
    }
    const all = Object.values(st).filter(o => o.p[kind] != null).map(o => Object.assign(o, { price: o.p[kind], km: km(hl, hn, o.lat, o.lon) }));
    all.sort((a, b) => ((b.open !== false) - (a.open !== false)) || a.price - b.price || (a.km ?? 1e9) - (b.km ?? 1e9));
    return { all, total: Object.keys(st).length };
  }
  _sFuel() {
    const K = ['e10', 'e5', 'diesel'], KL = { e10: 'Super E10', e5: 'Super E5', diesel: 'Diesel' };
    const kind = K.includes(this._fuelK) ? this._fuelK : 'e10', D = this._fuelData(kind), L = D.all.slice(0, 8), best = L[0];
    const fp = v => { const s = de(v, 3); return `${s.slice(0, -1)}<sup>${s.slice(-1)}</sup>`; };
    const seg = `<div class="seg fseg">${K.map(k => `<button class="${k === kind ? 'on' : ''}" data-act="fuelk" data-k="${k}">${KL[k]}</button>`).join('')}</div>`;
    const upd = D.all.reduce((m, o) => Math.max(m, o.t), 0);
    const head = `<div class="grab"></div><div class="sh"><div class="ico">${ic('fuel', 24)}</div><div><h2>Tankpreise</h2><p>${best ? esc(KL[kind]) + ' · ' + L.length + ' günstigste von ' + D.all.length + (upd ? ' · ' + this._rel(upd) : '') : 'Keine Preise verfügbar'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>${seg}`;
    if (!best) return head + `<div class="empty">⛽ Keine Tankstellen mit ${esc(KL[kind])}-Preis gefunden. Ist die Tankerkönig-Integration eingerichtet?</div>`;
    L.forEach(o => { if (o.e[kind]) this._need.add(o.e[kind]); });
    const maps = !window.fully;
    const trendOf = o => { const pts = this._hist[o.e[kind]]?.pts?.filter(p => !isNaN(p[1])) || []; if (pts.length < 2) return ''; const dd = (pts[pts.length - 1][1] - pts[0][1]) * 100; return Math.abs(dd) < .05 ? '' : `<em class="ft ${dd > 0 ? 'up' : 'dn'}" title="Änderung in 24 h">${ic(dd > 0 ? 'arrowup' : 'arrowdown', 12)}${de(Math.abs(dd), 1)}</em>`; };
    const row = (o, i) => { const closed = o.open === false, d = (o.price - best.price) * 100, go = maps && o.lat != null && o.lon != null;
      return `<div class="fr ${closed ? 'cl' : ''} ${i === 0 && !closed ? 'bst' : ''} ${go ? 'go' : ''}" ${go ? `data-act="maps" data-lat="${o.lat}" data-lon="${o.lon}"` : ''}><div class="rk">${i + 1}</div><div class="tx"><div class="n">${esc(o.name)}</div><div class="s">${esc([o.city, o.km != null ? de(o.km, 1) + ' km' : '', closed ? 'geschlossen' : ''].filter(Boolean).join(' · '))}</div></div><div class="pr"><b>${trendOf(o)}${fp(o.price)}<small> €</small></b><span>${i === 0 || d < 0.05 ? 'günstigster' : '+' + de(d, 1) + ' ct'}</span></div>${go ? `<div class="mp">${ic('chevron', 16)}</div>` : ''}</div>`; };
    return head + `<div class="lab2">TOP ${L.length} · ${esc(KL[kind]).toUpperCase()}</div><div class="fl">${L.map(row).join('')}</div><div class="card-note">Pfeil: Preisänderung in den letzten 24 h (ct)${maps ? ' · Tippen öffnet die Route in Karten' : ''}</div>`;
  }

  /* ───────────── Pflanzen: Übersicht aller Pflanzensensoren ───────────── */
  _plantsData() {
    const S = this._h.states, out = [], cfg = this._c.plants;
    const ids = Array.isArray(cfg) && cfg.length ? cfg.map(x => typeof x === 'string' ? { moist: x } : x) : Object.keys(S).filter(k => /^sensor\..+_soil_moisture$/.test(k)).map(k => ({ moist: k }));
    for (const p of ids) {
      const base = p.moist.replace(/_soil_moisture$/, ''), pick = (v, sfx, dom = 'sensor') => v || (S[`${dom}.${base.replace(/^sensor\./, '')}_${sfx}`] ? `${dom}.${base.replace(/^sensor\./, '')}_${sfx}` : null);
      const ms = S[p.moist]; if (!ms) continue;
      const t = pick(p.temp, 'temperature'), h = pick(p.hum, 'humidity'), b = pick(p.bat, 'battery'), dr = pick(p.dry, 'dry', 'binary_sensor'), wn = pick(null, 'soil_warning', 'number');
      const mv = parseFloat(ms.state), warn = wn ? parseFloat(S[wn]?.state) : 20, num = e => { const v = e && S[e] ? parseFloat(S[e].state) : NaN; return isNaN(v) ? null : v; };
      const name = p.name || String(ms.attributes.friendly_name || base).replace(/\s+(Feuchtigkeit|Bodenfeuchte|Soil moisture|Moisture)$/i, '');
      out.push({ e: p.moist, name, moist: isNaN(mv) ? null : mv, warn: isNaN(warn) ? 20 : warn, temp: num(t), hum: num(h), bat: num(b), dry: dr && S[dr] ? S[dr].state === 'on' : (!isNaN(mv) && mv < (isNaN(warn) ? 20 : warn)), t: new Date(ms.last_updated).getTime() || 0 });
    }
    return out.sort((a, b) => (b.dry - a.dry) || a.name.localeCompare(b.name, 'de'));
  }
  _sPlants() {
    const L = this._plantsData(), P = this._plant(), dry = L.filter(x => x.dry).length;
    const head = `<div class="grab"></div><div class="sh"><div class="ico">${ic('leaf', 24)}</div><div><h2>Pflanzen</h2><p>${L.length ? (dry ? dry + ' von ' + L.length + ' brauchen Wasser' : 'Alle ' + L.length + ' Pflanzen versorgt') : 'Keine Pflanzensensoren gefunden'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    const wat = P ? `<div class="pwat ${P.due ? 'due' : ''}"><div class="bub">${ic('drop', 22)}</div><div class="tx"><div class="n">${P.days === 0 ? 'Heute gegossen' : 'Zuletzt gegossen vor ' + P.days + (P.days === 1 ? ' Tag' : ' Tagen')}</div><div class="s">${P.last.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}${P.due ? ' · Intervall ' + this._c.plant.days + ' Tage erreicht' : ''}</div></div><button class="pgb" data-act="plant">${ic('drop', 16)}Gegossen</button></div>` : '';
    const chip = (ico, v, u, warn) => v == null ? '' : `<span class="pch ${warn ? 'w' : ''}">${ic(ico, 14)}${de(v, v % 1 ? 1 : 0)}${u}</span>`;
    const card = x => { const col = x.dry ? '251,191,36' : '52,211,153', pc = x.moist == null ? 0 : clamp(x.moist, 2, 100);
      return `<div class="plc ${x.dry ? 'dry' : ''}" style="--c:${col}" data-act="more" data-e="${esc(x.e)}"><div class="bub">${ic('leaf', 22)}</div><div class="tx"><div class="n">${esc(x.name)}</div><div class="pm"><div class="pc2"><i style="width:${pc}%;background:rgb(${col})"></i></div><b>${x.moist == null ? '–' : de(x.moist, 0) + ' %'}</b></div><div class="pchs">${chip('thermo', x.temp, ' °C')}${chip('drop', x.hum, ' %')}${chip('battery', x.bat, ' %', x.bat != null && x.bat < 20)}</div></div><div class="bd ${x.dry ? '' : 'ok'}">${x.dry ? 'Gießen' : 'OK'}</div></div>`; };
    return head + wat + (L.length ? `<div class="lab2">PFLANZEN · ${L.length}</div><div class="pll">${L.map(card).join('')}</div>` : `<div class="empty">🌱 Keine Pflanzensensoren (…_soil_moisture) gefunden.</div>`);
  }

  /* ───────────── Heizung je Raum ───────────── */
  /* Temperatur- & Luftfeuchtetrend (24 h) in einem Diagramm, Achsen links/rechts mit Min/Max */
  _trend(r, col, opt = {}) {
    const T = r.temp, H = r.hum; if (!T && !H) return '';
    [T, H].forEach(x => { if (x && !this._hist[x]) this._need.add(x); });
    if ((T && !this._hist[T]) || (H && !this._hist[H])) return `${opt.bare ? '' : '<div class="lab2">TREND · 24 H</div>'}<div class="sk" style="height:${opt.h || 150}px"></div>`;
    const pt = x => (x && this._hist[x]?.pts || []).filter(p => !isNaN(p[1]));
    const tp = pt(T), hp = pt(H); if (!tp.length && !hp.length) return opt.bare ? '<div class="empty">Noch keine Verlaufsdaten</div>' : '';
    const t0 = Math.min(...[tp[0]?.[0], hp[0]?.[0]].filter(v => v != null)), t1 = Math.max(...[tp.at(-1)?.[0], hp.at(-1)?.[0]].filter(v => v != null)), W = 600, Hh = 120;
    const st = a => { const v = a.map(p => p[1]), lo = Math.min(...v), hi = Math.max(...v), av = v.reduce((s, x) => s + x, 0) / v.length; return { lo, hi, av }; };
    const path = (a, S) => { const rg = Math.max(S.hi - S.lo, 1), pd = rg * .08, mn = S.lo - pd, mx = S.hi + pd; return a.map((p, i) => `${i ? 'L' : 'M'}${((p[0] - t0) / Math.max(t1 - t0, 1) * W).toFixed(1)} ${(Hh - (p[1] - mn) / (mx - mn) * Hh).toFixed(1)}`).join(''); };
    const TS = tp.length ? st(tp) : null, HS = hp.length ? st(hp) : null, tl = tp.length ? path(tp, TS) : '', hl = hp.length ? path(hp, HS) : '';
    const hh = x => new Date(x).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const side = (S, d, u, c, ico, right) => S ? `<div class="tcol ${right ? 'r' : ''}" style="color:${c}"><span>${ic(ico, 14)}${de(S.hi, d)}${u}</span><span>${de(S.lo, d)}${u}</span></div>` : '<div class="tcol"></div>';
    const gid = 'tg' + (r.id || '').replace(/\W/g, '');
    const svg = `<svg viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none" class="tsvg" ${opt.h ? `style="height:${opt.h}px"` : ''}><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".32"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
      ${tl ? `<path d="${tl}L${W} ${Hh}L0 ${Hh}Z" fill="url(#${gid})"/><path d="${tl}" fill="none" stroke="${col}" stroke-width="2.600" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="filter:drop-shadow(0 0 4px ${col})"/>` : ''}
      ${hl ? `<path d="${hl}" fill="none" stroke="#38bdf8" stroke-width="2.200" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` : ''}</svg>`;
    const avg = `<div class="tavg">${TS ? `<span style="color:${col}">${ic('thermo', 13)}Ø ${de(TS.av, 1)} °C</span>` : ''}${HS ? `<span style="color:#38bdf8">${ic('drop', 13)}Ø ${de(HS.av, 0)} %</span>` : ''}</div>`;
    return `${opt.bare ? '' : '<div class="lab2">TEMPERATUR &amp; LUFTFEUCHTE · 24 H</div>'}<div class="${opt.bare ? 'trend tb' : 'sctl trend'}" style="display:block"><div class="trow">${side(TS, 1, '°', col, 'thermo', false)}<div class="tmid">${svg}</div>${side(HS, 0, '%', '#38bdf8', 'drop', true)}</div><div class="tax"><span>${hh(t0)}</span><span>${hh((t0 + t1) / 2)}</span><span>${hh(t1)}</span></div>${avg}</div>`;
  }
  /* Heizung eines Raums mit „Dynamischer Heizungssteuerung“: Ziel kommt von der Regelung, mehrere Thermostate */
  _sHeatDh(r, I, D, o) {
    const a = D.a, m = o.off ? 'off' : D.auto ? 'auto' : 'heat';
    const seg = `<div class="seg hseg">${[['auto', 'Automatik'], ['heat', 'Manuell'], ['off', 'Aus']].map(([k, l]) => `<button class="${m === k ? 'on' : ''}" data-act="dhmode" data-room="${r.id}" data-m="${k}">${l}</button>`).join('')}</div>`;
    const side = o.auto ? `<div class="hctl"><div class="hset"><b>${de(I.target)}</b><span>Ziel der Automatik °C</span></div></div>` : o.ctl;
    const nx = a.next_event ? new Date(a.next_event) : null, pm = parseFloat(a.preheat_minutes);
    const tiles = `<div class="dg">${this._tile(I.open || a.window_open ? 'Offen' : 'Zu', 'Fenster', 'window')}${nx && !isNaN(nx) ? this._tile((nx.toDateString() === new Date().toDateString() ? '' : nx.toLocaleDateString('de-DE', { weekday: 'short' }) + ' ') + hhmm(nx), 'Nächster Wechsel', 'clock') : ''}${!isNaN(pm) && pm > 0 ? this._tile(de(pm, 0) + ' Min.', 'Vorheizen', 'flame') : ''}${a.present != null ? this._tile(a.present ? 'Ja' : 'Nein', 'Jemand da', 'home') : ''}</div>`;
    const short = s => esc((s.attributes.friendly_name || s.entity_id).replace(new RegExp('^' + r.name + '\\s*', 'i'), '').replace(/[\s-]+$/, '') || s.entity_id);
    const trv = `<div class="lab2">THERMOSTATE · ${D.trv.length}</div><div class="mcol">${D.trv.map(s => { const x = s.attributes, un = !okv(s.state); return `<div class="xr"><div class="ico">${ic('thermo', 19)}</div><div class="grow" data-act="more" data-e="${s.entity_id}"><div class="t">${short(s)}</div><div class="s">${un ? 'nicht erreichbar' : s.state === 'off' ? 'Aus' : `misst ${de(x.current_temperature)} ° · Soll ${de(x.temperature)} °`}</div></div></div>`; }).join('')}</div>`;
    const note = a.decision_status && okv(a.decision_status) && a.decision_status !== D.label ? `<div class="card-note">${esc(String(a.decision_status))}</div>` : '';
    [r.temp, r.hum].forEach(x => { if (x && !this._hist[x]) this._need.add(x); });
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic(r.icon, 24)}</div><div><h2>Heizung · ${esc(r.name)}</h2><p>${esc(o.status)}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="hhero ${o.heat ? 'heat' : ''}">${o.dial}<div class="hside">${side}${seg}</div></div>
      ${note}<div class="lab2">STATUS</div>${tiles}${trv}
      ${this._trend(r, o.col)}
      <div class="hbtns"><button class="qb" data-act="sched">${ic('clock', 14)}Heizungsplan</button><button class="qb" data-act="room" data-room="${r.id}">${ic(r.icon, 14)}Zurück zum Raum</button></div>`;
  }
  _sHeat() {
    const r = this._c.rooms.find(x => x.id === this._sheet.id); if (!r || !r.climate) return `<div class="grab"></div><div class="empty">Kein Thermostat für diesen Raum.</div>`;
    const I = this._room(r), cl = I.cl, at = cl?.attributes || {}, e = r.climate, off = I.mode === 'off', heat = I.act === 'heating';
    if (!cl) return `<div class="grab"></div><div class="sh"><div class="ico">${ic('thermo', 24)}</div><div><h2>Heizung · ${esc(r.name)}</h2><p>Thermostat nicht verfügbar</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    const cur = at.current_temperature ?? I.temp, tg = at.temperature, mn = at.min_temp ?? 5, mx = at.max_temp ?? 30, hum = at.current_humidity ?? I.hum;
    const PL = { none: 'Manuell', eco: 'Eco', comfort: 'Komfort', sleep: 'Schlafen', boost: 'Boost', away: 'Abwesend', home: 'Zuhause', activity: 'Aktiv' };
    let pt = {}; try { pt = typeof at.bt_preset_heat_temperatures === 'string' ? JSON.parse(at.bt_preset_heat_temperatures) : (at.bt_preset_heat_temperatures || {}); } catch (x) { pt = {}; }
    const presets = (at.preset_modes || []).filter(m => m !== 'none');
    const D = I.dh, auto = !off && D?.auto;
    const status = off ? 'Heizung aus' : I.open || at.window_open || D?.a.window_open ? 'Fenster offen – Heizung pausiert' : auto ? 'Automatik' + (D.label ? ' · ' + D.label : '') : heat ? 'Heizt gerade' : 'Bereit – Wunschtemperatur erreicht';
    const col = cur != null ? tempCol(cur) : '#fb923c', fc = clamp(((cur ?? 10) - 10) / 20, 0, 1), ft = clamp(((tg ?? 10) - 10) / 20, 0, 1), a1 = 135 + 270 * fc, a2 = 135 + 270 * ft;
    const tx = 100 + 84 * Math.cos(a2 * Math.PI / 180), ty = 100 + 84 * Math.sin(a2 * Math.PI / 180);
    const dial = `<div class="hdial"><svg viewBox="0 0 200 170"><path d="${arc(100, 100, 84, 135, 405)}" fill="none" stroke="rgba(${WH},.09)" stroke-width="12" stroke-linecap="round"/>${cur != null ? `<path d="${arc(100, 100, 84, 135, Math.max(135.5, a1))}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${col});opacity:${off ? .35 : 1}"/>` : ''}${tg != null && !off ? `<circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="9" fill="${FG}"/><circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="3.500" fill="${col}"/>` : ''}</svg>
      <div class="mid"><div class="l">Aktuell</div><div class="cur big">${de(cur)}<small class="u">°</small></div><div class="tg">${off ? 'Heizung aus' : (auto ? 'Automatik' : 'Ziel') + ' <b>' + de(tg) + '°</b>'}</div>${hum != null ? `<div class="hhum">${ic('drop', 12)}${de(hum, 0)} %</div>` : ''}</div></div>`;
    const ctl = `<div class="hctl"><button class="rbn" data-act="temp" data-e="${e}" data-d="-0.5" ${off ? 'disabled' : ''}>${ic('minus', 22)}</button><div class="hset"><b>${off ? '–' : de(tg)}</b><span>Wunsch °C</span></div><button class="rbn" data-act="temp" data-e="${e}" data-d="0.5" ${off ? 'disabled' : ''}>${ic('plus', 22)}</button></div>`;
    const modes = (at.hvac_modes || ['heat', 'off']).filter(m => ['heat', 'off', 'auto', 'heat_cool'].includes(m)), ML = { heat: 'Heizen', off: 'Aus', auto: 'Auto', heat_cool: 'Auto' };
    const seg = `<div class="seg hseg">${modes.map(m => `<button class="${I.mode === m ? 'on' : ''}" data-act="chvac" data-e="${e}" data-m="${m}">${ML[m]}</button>`).join('')}</div>`;
    const pre = presets.length ? `<div class="lab2">VOREINSTELLUNGEN</div><div class="hpre">${presets.map(m => `<button class="${at.preset_mode === m ? 'on' : ''}" data-act="cpreset" data-e="${e}" data-m="${m}"><b>${esc(PL[m] || m)}</b>${pt[m] != null ? `<span>${de(pt[m], 1)}°</span>` : ''}</button>`).join('')}</div>` : '';
    if (D) return this._sHeatDh(r, I, D, { dial, ctl, status, heat, off, auto, col });
    const lc = at.last_change ? new Date(at.last_change).getTime() : new Date(cl.last_changed).getTime(), vm = at.next_valve_maintenance ? new Date(at.next_valve_maintenance) : null;
    const tiles = `<div class="dg">${this._tile(I.open || at.window_open ? 'Offen' : 'Zu', 'Fenster', 'window')}${this._tile(this._rel(lc).replace('vor ', ''), 'Letzte Änderung', 'clock')}${vm && !isNaN(vm) ? this._tile(vm.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }), 'Ventilwartung', 'wrench') : ''}</div>`;
    const errs = (typeof at.errors === 'string' && at.errors !== '[]' && at.errors.length > 2 ? `<div class="card-note" style="color:#fb7185">Thermostat meldet: ${esc(at.errors)}</div>` : '') + (r.temp ? this._staleNote(r.temp) : '');
    [r.temp, r.hum].forEach(x => { if (x && !this._hist[x]) this._need.add(x); });
    const trend = this._trend(r, col);
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic(r.icon, 24)}</div><div><h2>Heizung · ${esc(r.name)}</h2><p>${esc(status)}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="hhero ${heat ? 'heat' : ''}">${dial}<div class="hside">${ctl}${seg}</div></div>
      ${pre}${errs}
      <div class="lab2">STATUS</div>${tiles}
      ${trend}
      <div class="hbtns"><button class="qb" data-act="sched">${ic('clock', 14)}Heizungsplan</button><button class="qb" data-act="room" data-room="${r.id}">${ic(r.icon, 14)}Zurück zum Raum</button></div>`;
  }

