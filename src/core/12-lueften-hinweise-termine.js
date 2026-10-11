  /* ───────────── Lüften (Smart Ventilation) ───────────── */
  _roomByName(n) {
    n = (n || '').trim().toLowerCase();
    return this._c.rooms.find(r => r.name.toLowerCase() === n || (r.id === 'bad' && /bad/.test(n)));
  }
  _ventData() {
    const s = this._s(this._c.stats.vent), a = s?.attributes || {};
    const rooms = (a.raeume || []).map(r => {
      const sen = r.entity_id ? this._s(r.entity_id) : null, at = sen?.attributes || {}, k = at.karte || {};
      return { ...r, name: (r.raum || '').trim(), k, ent: k.entitaeten || at.entitaeten || {}, best: at.bester_zeitpunkt || k.bester_zeitpunkt, rest: at.rest_minuten ?? k.rest_minuten, why: k.entscheidungsgrund || '' };
    });
    const live = r => r.laeuft || (r.lueften && !r.pausiert);
    const prio = rooms.filter(live).sort((x, y) => (y.laeuft - x.laeuft) || (y.dringlichkeit - x.dringlichkeit));
    const paused = rooms.filter(r => !live(r) && r.lueften).sort((x, y) => y.dringlichkeit - x.dringlichkeit);
    const ok = rooms.filter(r => !live(r) && !r.lueften);
    
    return { rooms, prio, paused, ok, sum: a.summe || {}, trend: a.trend_tage || [] };
  }
  _sVent() {
    const V = this._ventData(), su = V.sum, RC = { niedrig: '45,212,191', beobachten: '251,191,36', hoch: '251,113,133' };
    const risk = r => ({ niedrig: ['ok', 'Schimmelrisiko niedrig'], beobachten: ['warn', 'Schimmel beobachten'], hoch: ['bad', 'Schimmelrisiko hoch'] })[r] || ['', ''];
    const card = r => {
      const cfg = this._roomByName(r.name), col = RC[r.schimmelrisiko] || RC.niedrig, k = r.k;
      const open = (cfg && this._room(cfg).open) || k.fenster_offen > 0, C = 2 * Math.PI * 34;
      const frac = r.laeuft ? clamp((k.fortschritt || 0) / 100, 0, 1) : clamp((r.minuten || 0) / 20, 0, 1);
      const num = r.laeuft ? (r.rest ?? k.rest_minuten ?? 0) : r.minuten, lab = r.laeuft ? 'Min. rest' : 'Minuten';
      const rk = risk(r.schimmelrisiko), snooze = r.ent.snooze && this._s(r.ent.snooze), skip = r.ent.skip && this._s(r.ent.skip);
      return `<div class="vc ${r.entity_id ? 'tap' : ''}" style="--rc:${col}" ${r.entity_id ? `data-act="vroom" data-e="${r.entity_id}"` : ''}>
        <div class="vm"><svg viewBox="0 0 78 78"><circle cx="39" cy="39" r="34" fill="none" stroke="rgba(${WH},.12)" stroke-width="6"/><circle cx="39" cy="39" r="34" fill="none" stroke="rgb(${col})" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(C * frac).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 39 39)" style="filter:drop-shadow(0 0 6px rgb(${col}))"/></svg><div class="n"><div><b>${num}</b><span>${lab}</span></div></div></div>
        <div class="vb"><h3>${esc(r.name)}${r.laeuft ? '<span class="tag live">lüftet gerade</span>' : ''}</h3>
          <p>${esc(r.empfehlung || '')}</p>${r.why && r.why !== r.empfehlung ? `<p class="why">${esc(r.why)}</p>` : ''}
          <div class="tags">${rk[0] ? `<span class="tag ${rk[0]}">${rk[1]}</span>` : ''}${open && !r.laeuft ? `<span class="tag live">Fenster offen</span>` : ''}${k.innen_t != null ? `<span class="tag">innen ${de(k.innen_t)}° · ${de(k.innen_rh, 0)} %</span><span class="tag">außen ${de(k.aussen_t)}°</span>` : ''}${r.heute_kwh_netto ? `<span class="tag">${de(r.heute_kwh_netto, 2)} kWh heute</span>` : ''}</div>
          ${!r.laeuft && (snooze || skip) ? `<div class="vbs">${snooze ? `<button class="vbt" data-act="press" data-e="${r.ent.snooze}" data-msg="Erinnerung für ${esc(r.name)} 30 Min. ausgesetzt">${ic('play', 11)} 30 Min. später</button>` : ''}${skip ? `<button class="vbt" data-act="press" data-e="${r.ent.skip}" data-msg="${esc(r.name)}: heute nicht mehr erinnern">Heute nicht mehr</button>` : ''}</div>` : ''}
          ${r.laeuft ? `<div class="vbar"><i style="width:${(frac * 100).toFixed(0)}%"></i></div>` : ''}</div></div>`;
    };
    const row = r => {
      const cfg = this._roomByName(r.name);
      return `<div class="vr ${r.entity_id ? 'tap' : ''}" ${r.entity_id ? `data-act="vroom" data-e="${r.entity_id}"` : ''}><div class="ico">${ic(cfg?.icon || 'wind', 19)}</div><div><div class="t">${esc(r.name)}</div><div class="s">${ic('alert', 11)} ${esc(r.pausiert)}</div></div><div class="m">${r.minuten} Min.<small>${r.best ? 'Beste Zeit: ' + esc(r.best) : esc(r.empfehlung || '')}</small></div></div>`;
    };
    const mx = Math.max(...V.trend.map(t => t.anzahl), 1);
    const bars = V.trend.map((t, i) => `<div class="${i === V.trend.length - 1 ? 'today' : ''}"><b>${t.anzahl ? t.anzahl + '×' : ''}</b><i style="height:${Math.max(4, t.anzahl / mx * 78)}px"></i>${i === V.trend.length - 1 ? 'Heute' : new Date(t.datum).toLocaleDateString('de-DE', { weekday: 'short' })}</div>`).join('');
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('wind', 24)}</div><div><h2>Lüften</h2><p>${V.prio.length} jetzt · ${V.paused.length} später · ${V.ok.length} in Ordnung</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="vsum"><div class="vk hot"><div class="big">${V.prio.length}</div><div class="l">${V.prio.length === 1 ? 'Raum' : 'Räume'} jetzt zu lüften</div></div><div class="vk"><div class="big">${de(su.heute_eur_netto ?? 0, 2)}<small class="u">€</small></div><div class="l">Wärmeverlust heute · ${de(su.heute_kwh_netto ?? 0, 2)} kWh</div></div></div>
      <div class="lab2">PRIORITÄT · ${V.prio.length}</div>${V.prio.length ? V.prio.map(card).join('') : '<div class="empty">✨ Gerade muss nirgends gelüftet werden</div>'}
      ${V.paused.length ? `<div class="lab2">SPÄTER EMPFOHLEN · ${V.paused.length}</div>${V.paused.map(row).join('')}` : ''}
      ${V.ok.length ? `<div class="lab2">ALLES GUT · ${V.ok.length}</div><div class="okc">${V.ok.map(r => `<span ${r.entity_id ? `class="tap" data-act="vroom" data-e="${r.entity_id}"` : ''}>${ic('check', 14)}${esc(r.name)}</span>`).join('')}</div>` : ''}
      ${V.trend.length ? `<div class="lab2">LETZTE 7 TAGE</div><div class="sctl" style="display:block;margin-bottom:0"><div class="tr">${bars}</div></div>` : ''}`;
  }

  /* ───────────── Batterien, Kontakte, Hinweise ───────────── */
  _isBat(k) { const s = this._h.states[k]; return !!s && k.startsWith('sensor.') && s.attributes.device_class === 'battery'; }
  _isContact(k) {
    if (!k.startsWith('binary_sensor.')) return false;
    const dc = this._h.states[k]?.attributes?.device_class;
    return (dc === 'window' || dc === 'door' || dc === 'opening') && !/_status$|_window_open$|p2s_|klodeckel|^binary_sensor\.fenster_und_turen$/.test(k);
  }
  _clean(n) { return String(n || '').replace(/\s*(contact|kontakt|battery( level)?|batterie(stand)?|akku(stand)?)\s*$/i, '').trim(); }
  _batteries() { return this._memo('bat', () => this._batteries0()); }
  _batteries0() {
    const out = [];
    for (const k in this._h.states) if (this._isBat(k)) { const v = parseFloat(this._h.states[k].state); if (!isNaN(v)) out.push({ e: k, v, n: this._clean(this._name(k)) }); }
    out.sort((a, b) => a.v - b.v || a.n.localeCompare(b.n, 'de'));
    return { all: out, low: out.filter(b => b.v <= this._c.batteryLow) };
  }
  _contacts() {
    const all = [];
    for (const k in this._h.states) if (this._isContact(k) && this._val(k) !== 'unavailable') { const n = this._clean(this._name(k)); all.push({ e: k, n, open: this._val(k) === 'on', door: /fenster|window/i.test(n) ? false : /t(ü|ue)r|door/i.test(n) ? true : this._attr(k, 'device_class') === 'door', since: this._s(k)?.last_changed }); }
    all.sort((a, b) => (b.open - a.open) || a.n.localeCompare(b.n, 'de'));
    return { all, open: all.filter(x => x.open) };
  }
  _rel(ts) {
    const m = Math.round((Date.now() - new Date(ts).getTime()) / 6e4);
    if (isNaN(m)) return '–';
    return m < 2 ? 'gerade eben' : m < 60 ? `vor ${m} Min.` : m < 1440 ? `vor ${Math.round(m / 60)} Std.` : `vor ${Math.round(m / 1440)} ${Math.round(m / 1440) === 1 ? 'Tag' : 'Tagen'}`;
  }
  _plant() {
    const p = this._c.plant, s = this._s(p.entity);
    if (!s || !okv(s.state)) return null;
    const d = new Date(String(s.state).replace(' ', 'T'));
    if (isNaN(d)) return null;
    const days = Math.max(0, Math.floor((Date.now() - d) / 864e5));
    return { days, due: days >= p.days, last: d, a: s.attributes };
  }
  _printerInfo() {
    const s = this._s(this._c.printer.prefix + 'druckstatus');
    if (!s) return null;
    const st = s.state, offline = !okv(st) || st === 'offline';
    return { st, offline, running: st === 'running' || st === 'pause', pct: this._num(this._c.printer.prefix + 'druckfortschritt'), end: this._val(this._c.printer.prefix + 'endzeit') };
  }
  _alerts() {
    const c = this._c, A = [], wn = this._num(c.alerts.now) || 0, wp = this._num(c.alerts.pre) || 0;
    const LV = ['', 'Wetterwarnung', 'Markante Wetterwarnung', 'Unwetterwarnung', 'Extreme Unwetterwarnung'];
    if (wn > 0) A.push({ id: 'warn', crit: wn >= 3, cls: wn >= 3 ? 'bad' : 'warn', icon: 'alert', text: LV[Math.min(wn, 4)], sub: 'Stufe ' + wn, act: 'nav', attrs: 'data-v="weather"' });
    else if (wp > 0) A.push({ id: 'pre', cls: 'info', icon: 'alert', text: 'Vorabinformation Wetter', sub: 'Stufe ' + wp, act: 'nav', attrs: 'data-v="weather"' });
    const st = c.station, ls = this._val(st.lastStrike);
    if (okv(ls) && Date.now() - new Date(ls).getTime() < 90 * 6e4 && Date.now() >= new Date(ls).getTime() - 6e4) {
      const dist = this._num(st.strikeDist);
      A.push({ id: 'bolt', crit: true, cls: 'warn', icon: 'bolt', text: 'Blitze' + (dist != null ? ' in ' + de(dist, 0) + ' km' : ' in der Nähe'), sub: this._rel(ls), act: 'nav', attrs: 'data-v="weather"' });
    }
    const WL = this._waste();
    if (WL && WL.length && WL[0].days <= 1) { const nx = WL.filter(x => x.days === WL[0].days); A.push({ id: 'waste', cls: 'info', icon: 'trash', text: (WL[0].days === 0 ? 'Heute' : 'Morgen') + ': ' + nx.map(x => x.name).join(' + '), sub: '', act: 'waste', attrs: '' }); }
    const B = this._batteries(), DB = this._devBat(), dset = new Set(DB.map(d => d.e)), dis = DB.filter(d => d.v <= c.batteryLow && !d.charging);
    const gl = B.low.filter(b => !dset.has(b.e));
    if (gl.length) A.push({ id: 'bat', cls: gl[0].v <= 10 ? 'bad' : 'warn', icon: 'battery', text: `${gl.length} ${gl.length === 1 ? 'Batterie' : 'Batterien'} schwach`, sub: `${gl[0].n} ${de(gl[0].v, 0)} %`, act: 'bat' });
    if (dis.length) A.unshift({ id: 'devbat', crit: dis[0].v <= 10, cls: dis[0].v <= 10 ? 'bad' : 'warn', icon: 'battery', text: dis.length === 1 ? `Tablet-Akku ${de(dis[0].v, 0)} %` : `${dis.length} Geräte-Akkus schwach`, sub: dis[0].n, act: 'bat' });
    const pr = this._printerInfo();
    if (pr && !pr.offline && pr.running) A.push({ id: 'prn', cls: pr.st === 'pause' ? 'warn' : 'info', icon: 'printer', text: pr.st === 'pause' ? 'Druck pausiert' : `Druck läuft ${de(pr.pct, 0)} %`, sub: pr.end && okv(pr.end) ? 'fertig ' + hhmm(pr.end) : '', pct: pr.pct, act: 'nav', attrs: 'data-v="printer"' });
    else if (pr && !pr.offline && pr.st === 'failed') A.push({ id: 'prn', cls: 'bad', icon: 'printer', text: 'Druck fehlgeschlagen', sub: '', act: 'nav', attrs: 'data-v="printer"' });
    else if (pr && !pr.offline && pr.st === 'finish') { const ag = this._age(this._c.printer.prefix + 'druckstatus'); if (ag != null && ag < 3 * 36e5) A.push({ id: 'prn', cls: 'ok', icon: 'check', text: 'Druck fertig', sub: 'vor ' + this._agoTxt(ag), act: 'nav', attrs: 'data-v="printer"' }); }
    if (pr && !pr.offline && !(pr.st === 'failed') && (this._val(c.printer.error) === 'on' || this._val(c.printer.hms) === 'on')) A.push({ id: 'prerr', crit: true, cls: 'bad', icon: 'alert', text: 'Druckerfehler gemeldet', sub: '', act: 'nav', attrs: 'data-v="printer"' });
    const MS = this._missing();
    if (MS.length) A.push({ id: 'miss', cls: 'warn', icon: 'alert', text: MS.length === 1 ? 'Gerät fehlt' : `${MS.length} Geräte fehlen`, sub: MS[0], act: 'sys' });
    A.push(...this._alertsHome());
    A.unshift(...this._tmrAlerts());
    return A;
  }
  _alertHtml(a) { return `<button class="al ${a.cls}${a.crit ? ' crit' : ''}" data-act="${a.act}" ${a.attrs || ''}>${ic(a.icon, 16)}<span>${esc(a.text)}${a.sub ? ` <small${a.tmr ? ` data-tmr="${a.tmr}"` : ''}>${esc(a.sub)}</small>` : ''}</span>${a.pct != null && !isNaN(a.pct) ? `<i class="alb"><u style="width:${clamp(a.pct, 0, 100)}%"></u></i>` : ''}</button>`; }

  /* ───────────── Termine ───────────── */
  async _loadCal() {
    if (this._calB || (this._cal && Date.now() - this._cal.t < 6e5)) return;
    this._calB = true;
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const y0 = t0.getFullYear(), mo0 = t0.getMonth(), m0 = new Date(y0, mo0, 1 - ((new Date(y0, mo0, 1).getDay() + 6) % 7)), m2 = new Date(y0, mo0 + 3, 8);
    const t1 = new Date(Math.max(+t0 + this._c.calendarDays * 864e5, +m2)), evs = [];
    const old = this._cal?.evs || []; let fails = 0;
    await Promise.all(this._c.calendars.map(async c => {
      if (!this._s(c[0]) || this._s(c[0]).state === 'unavailable') { fails++; evs.push(...old.filter(x => x.cal === c[0])); return; }
      try {
        const r = await this._h.callApi('GET', `calendars/${c[0]}?start=${encodeURIComponent(m0.toISOString())}&end=${encodeURIComponent(t1.toISOString())}`);
        for (const ev of r || []) {
          const allDay = !!(ev.start && ev.start.date), s = new Date(allDay ? ev.start.date + 'T00:00:00' : ev.start.dateTime);
          if (isNaN(s)) continue;
          let e = new Date(allDay ? (ev.end?.date || ev.start.date) + 'T00:00:00' : (ev.end?.dateTime || ev.start.dateTime));
          if (isNaN(e) || e <= s) e = new Date(+s + (allDay ? 864e5 : 36e5));
          evs.push({ cal: c[0], col: c[2], calName: c[1], title: ev.summary || '(ohne Titel)', loc: ev.location || '', allDay, s, e });
        }
      } catch (err) { fails++; evs.push(...old.filter(x => x.cal === c[0])); /* Kalender nicht erreichbar */ }
    }));
    this._cal = { t: fails ? Date.now() - 6e5 + 25e3 : Date.now(), evs };
    this._calB = false;
    if (fails) { clearTimeout(this._calRt); this._calRt = setTimeout(() => this._loadCal(), 26e3); }
    this._renderSoon();
  }
  _calList() {
    const now = new Date(), t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const horizon = +t0 + this._c.calendarDays * 864e5, list = [], cnt = {};
    for (const ev of this._cal.evs) {
      cnt[ev.cal] = (cnt[ev.cal] || 0) + 1;
      if (this._calOff.has(ev.cal)) continue;
      if (ev.allDay) { for (const d = new Date(Math.max(+ev.s, +t0)); d < ev.e && +d < horizon; d.setDate(d.getDate() + 1)) list.push({ ...ev, dk: +d, day: new Date(d) }); }
      else if (ev.e >= now && +ev.s < horizon) { const d = new Date(ev.s); d.setHours(0, 0, 0, 0); list.push({ ...ev, dk: Math.max(+d, +t0), day: new Date(Math.max(+d, +t0)) }); }
    }
    list.sort((a, b) => a.dk - b.dk || (b.allDay - a.allDay) || a.s - b.s);
    return { list, cnt, t0 };
  }
  _calGroups(list, t0) {
    let html = '', last = null;
    for (const ev of list) {
      if (ev.dk !== last) {
        last = ev.dk;
        const diff = Math.round((ev.dk - +t0) / 864e5);
        html += `<div class="dh"><b>${diff === 0 ? 'Heute' : diff === 1 ? 'Morgen' : ev.day.toLocaleDateString('de-DE', { weekday: 'long' })}</b>${ev.day.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}</div>`;
      }
      const tm = ev.allDay ? 'Ganztägig' : `${hhmm(ev.s)}<br><span style="color:var(--tx3)">${hhmm(ev.e)}</span>`;
      html += `<div class="ev" style="--ec:${ev.col}"><i></i><div style="min-width:0"><div class="t">${esc(ev.title)}</div><div class="s">${esc(ev.calName)}${ev.loc ? ' · ' + esc(ev.loc) : ''}</div></div><div class="tm">${tm}</div></div>`;
    }
    return html;
  }
  _calMap() {
    const M = new Map(); if (!this._cal) return M;
    for (const ev of this._cal.evs) {
      if (this._calOff.has(ev.cal)) continue;
      const d = new Date(ev.s); d.setHours(0, 0, 0, 0);
      const end = ev.allDay ? +ev.e : (ev.e > ev.s ? +ev.e - 1 : +ev.s);
      for (let n = 0; n < 70 && (ev.allDay ? +d < end : +d <= end); n++, d.setDate(d.getDate() + 1)) { const k = +d; if (!M.has(k)) M.set(k, []); M.get(k).push(ev); }
    }
    for (const a of M.values()) a.sort((x, y) => (y.allDay - x.allDay) || x.s - y.s);
    return M;
  }
  _calCard(i, n, fit = 0) {
    if (!this._c.calendars.some(c => this._s(c[0]))) return '';
    const open = `data-act="cal"`;
    if (!this._cal) return `<div class="c" style="--i:${i}"><div class="h">${ic('cal', 14)}Termine</div><div class="sk" style="height:140px"></div></div>`;
    const { list, t0 } = this._calList(), W = this._waste(), skipW = !!(W && W.length);
    const L = list.filter(ev => !(skipW && /müll|muell|abfall/i.test(ev.cal + ' ' + ev.calName))), lim = n || 4, shown = L.slice(0, lim + fit), more = L.length - shown.length;
    let body = '', last = null;
    shown.forEach((ev, k) => {
      const fx = k >= lim ? ` fi fh" data-fp="${k - lim < 2 ? 1 : 3}" data-fg="cal${k}` : '';
      if (ev.dk !== last) {
        last = ev.dk; const diff = Math.round((ev.dk - +t0) / 864e5);
        body += `<div class="ccd${fx}"><b>${diff === 0 ? 'Heute' : diff === 1 ? 'Morgen' : ev.day.toLocaleDateString('de-DE', { weekday: 'long' })}</b>${ev.day.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })}</div>`;
      }
      body += `<div class="cc2${fx}" style="--ec:${ev.col}"><i></i><div class="t">${esc(ev.title)}</div><div class="w">${ev.allDay ? esc(ev.calName) : hhmm(ev.s)}</div></div>`;
    });
    if (!shown.length) body = `<div class="empty">🗓️ Keine Termine in den nächsten ${this._c.calendarDays} Tagen</div>`;
    return `<div class="c calc tap" style="--i:${i}" ${open}><div class="h">${ic('cal', 14)}Termine<span class="r">Kalender${ic('chevron', 13)}</span></div>${body}${more > 0 || fit ? `<div class="ccm fm" data-n="${more}" data-full="1">${more > 0 ? `+ ${more} weitere` : ''}</div>` : ''}</div>`;
  }
  /* pz23: Woche ab heute (sieben Tage, keine schon vergangenen), Tablet in sieben Spalten, Handy als Tagesliste (auch freie Tage) */
  _calWeek(t0) {
    const wo = clamp(this._calWk || 0, 0, 8), mon = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate() + 7 * wo), M = this._calMap();
    const sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6);
    const fmt = (d, o) => d.toLocaleDateString('de-DE', o);
    let n = 0, days = '';
    for (let k = 0; k < 7; k++) {
      const d = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + k), key = +d, evs = M.get(key) || [];
      n += evs.length;
      const rows = evs.map(ev => `<div class="wke${ev.allDay ? ' ad' : ''}" style="--ec:${ev.col}" title="${esc(ev.calName)}"><i></i>${ev.allDay ? '' : `<b>${hhmm(ev.s)}</b>`}<span>${esc(ev.title)}</span></div>`).join('');
      days += `<div class="wkd${key === +t0 ? ' today' : ''}${key < +t0 ? ' past' : ''}${d.getDay() % 6 === 0 ? ' we' : ''}"><div class="wkh"><b>${key === +t0 ? 'Heute' : fmt(d, { weekday: 'short' }).replace('.', '')}</b><span>${d.getDate()}.</span></div><div class="wkl">${rows || '<div class="wk0">frei</div>'}</div></div>`;
    }
    const nav = `<div class="cmh"><button data-act="calwk" data-n="-1" ${wo === 0 ? 'disabled' : ''} aria-label="Vorherige Woche">${ic('chevron', 18).replace('<svg', '<svg style="transform:rotate(180deg)"')}</button><b>${wo === 0 ? 'Nächste 7 Tage' : wo === 1 ? 'Danach' : 'In ' + wo + ' Wochen'}<small class="wkn">${fmt(mon, { day: 'numeric', month: mon.getMonth() === sun.getMonth() ? undefined : 'short' })}–${fmt(sun, { day: 'numeric', month: 'short' })} · ${n ? n + (n === 1 ? ' Termin' : ' Termine') : 'keine Termine'}</small></b><button class="cmt" data-act="calwk" data-n="0" ${wo === 0 ? 'disabled' : ''}>Heute</button><button data-act="calwk" data-n="1" ${wo === 8 ? 'disabled' : ''} aria-label="Nächste Woche">${ic('chevron', 18)}</button></div>`;
    return nav + `<div class="wk" lang="de">${days}</div>`;
  }
  _sCal() {
    const head = `<div class="grab"></div><div class="sh"><div class="ico">${ic('cal', 24)}</div><div><h2>Kalender</h2><p>${this._calMode === 'list' ? `nächste ${this._c.calendarDays} Tage` : this._calMode === 'month' ? 'Monatsansicht' : 'Wochenansicht'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!this._cal) return head + '<div class="sk" style="height:220px"></div>';
    const mode = ['list', 'month'].includes(this._calMode) ? this._calMode : 'week';
    const tabs = `<div class="cal2tabs"><button class="${mode === 'week' ? 'on' : ''}" data-act="calmode" data-m="week">${ic('grid', 14)}Woche</button><button class="${mode === 'month' ? 'on' : ''}" data-act="calmode" data-m="month">${ic('cal', 14)}Monat</button><button class="${mode === 'list' ? 'on' : ''}" data-act="calmode" data-m="list">${ic('list', 14)}Liste</button></div>`;
    const { list, cnt, t0 } = this._calList();
    const chips = this._c.calendars.filter(c => cnt[c[0]]).map(c => `<button class="${this._calOff.has(c[0]) ? '' : 'on'}" style="--ec:${c[2]}" data-act="calf" data-e="${c[0]}"><i></i>${esc(c[1])}</button>`).join('');
    const chipsH = chips ? `<div class="calf">${chips}</div>` : '';
    if (mode === 'list') return head + tabs + chipsH + (list.length ? this._calGroups(list, t0) : `<div class="empty">🗓️ Keine Termine</div>`);
    if (mode === 'week') return head + tabs + this._calWeek(t0) + (chipsH ? `<div style="margin-top:14px">${chipsH}</div>` : '');
    const mo = Math.max(0, Math.min(2, this._calMo || 0)), first = new Date(t0.getFullYear(), t0.getMonth() + mo, 1);
    const lead = (first.getDay() + 6) % 7, nd = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate(), weeks = Math.ceil((lead + nd) / 7);
    const M = this._calMap(), sel = this._calSel != null ? this._calSel : +t0;
    let cells = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => `<div class="cmw">${d}</div>`).join('');
    for (let k = 0; k < weeks * 7; k++) {
      const d = new Date(first.getFullYear(), first.getMonth(), 1 - lead + k), key = +d, evs = M.get(key) || [], cols = [...new Set(evs.map(e => e.col))].slice(0, 3);
      cells += `<button class="cmd${d.getMonth() !== first.getMonth() ? ' out' : ''}${key === +t0 ? ' today' : ''}${key === sel ? ' sel' : ''}" data-act="calday" data-d="${key}" aria-label="${d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}"><span class="n">${d.getDate()}</span><span class="dots">${cols.map(c => `<i style="--ec:${c}"></i>`).join('')}</span></button>`;
    }
    const sd = new Date(sel), sev = M.get(sel) || [], diff = Math.round((sel - +t0) / 864e5);
    const rows = sev.map(ev => `<div class="ev" style="--ec:${ev.col}"><i></i><div style="min-width:0"><div class="t">${esc(ev.title)}</div><div class="s">${esc(ev.calName)}${ev.loc ? ' · ' + esc(ev.loc) : ''}</div></div><div class="tm">${ev.allDay ? 'Ganztägig' : `${hhmm(ev.s)}<br><span style="color:var(--tx3)">${hhmm(ev.e)}</span>`}</div></div>`).join('');
    const nav = `<div class="cmh"><button data-act="calmo" data-n="-1" ${mo === 0 ? 'disabled' : ''} aria-label="Vorheriger Monat">${ic('chevron', 18).replace('<svg', '<svg style="transform:rotate(180deg)"')}</button><b>${first.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</b><button class="cmt" data-act="calmo" data-n="0">Heute</button><button data-act="calmo" data-n="1" ${mo === 2 ? 'disabled' : ''} aria-label="Nächster Monat">${ic('chevron', 18)}</button></div>`;
    return head + tabs + nav + `<div class="cmg">${cells}</div><div class="cmsel"><b>${diff === 0 ? 'Heute' : diff === 1 ? 'Morgen' : sd.toLocaleDateString('de-DE', { weekday: 'long' })}</b> · ${sd.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })}</div>${rows || `<div class="empty">Keine Termine</div>`}${chipsH ? `<div style="margin-top:14px">${chipsH}</div>` : ''}`;
  }

  /* ───────────── Pflanze, Batterien, Fenster ───────────── */
  _plantRow() {
    const P = this._plant(), L = this._plantsData(); if (!P && !L.length) return '';
    const dry = L.filter(x => x.dry).length, due = P && P.due, bad = dry > 0 || due;
    const sub = L.length ? (dry ? `<b style="color:#fbbf24">${dry} ${dry === 1 ? 'Pflanze braucht' : 'Pflanzen brauchen'} Wasser</b>` : 'Alle Pflanzen versorgt') + (P ? ' · gegossen ' + (P.days === 0 ? 'heute' : 'vor ' + P.days + (P.days === 1 ? ' Tag' : ' Tagen')) : '') : (P.days === 0 ? 'Heute gegossen' : 'zuletzt vor ' + P.days + (P.days === 1 ? ' Tag' : ' Tagen'));
    return `<div class="xr tapx" data-act="plants"><div class="ico" style="${bad ? 'background:rgba(251,191,36,.2);color:#fbbf24' : 'background:rgba(52,211,153,.14);color:#34d399'}">${ic('leaf', 19)}</div><div><div class="t">${esc(this._c.plant.name)}${!L.length && due ? ' · gießen' : ''}</div><div class="s">${sub}</div></div>${P ? `<button class="mpb main" style="margin-left:auto" data-act="plant" aria-label="Gegossen">${ic('drop', 18)}</button>` : ''}</div>`;
  }
  _batRow(b) {
    const cls = b.v <= 10 ? 'low' : b.v <= this._c.batteryLow ? 'mid' : '', col = b.v <= 10 ? '#fb7185' : b.v <= this._c.batteryLow ? '#fbbf24' : '#34d399';
    return `<div class="bt ${cls}" data-act="more" data-e="${b.e}" style="cursor:pointer"><div class="t">${esc(b.n)}</div><div class="pc2"><i style="width:${clamp(b.v, 2, 100)}%;background:${col}"></i></div><b>${de(b.v, 0)} %</b></div>`;
  }
  _batCard(i, cls = 's4') {
    const B = this._batteries(); if (!B.all.length) return '';
    const rows = (B.low.length ? B.low : B.all).slice(0, 4);
    return `<div class="c ${cls} tap" style="--i:${i}" data-act="bat"><div class="h">${ic('battery', 14)}Batterien<span class="r">${B.low.length ? B.low.length + ' schwach' : 'Alle okay'}</span></div>${rows.map(b => this._batRow(b)).join('')}<div class="card-note">${B.all.length} Geräte · tippen für alle</div></div>`;
  }
  _doorCard(i, cls = 's4') {
    const K = this._contacts(); if (!K.all.length) return '';
    const rows = K.open.slice(0, 5).map(k => `<div class="vr"><div class="ico" style="color:#fb923c">${ic(k.door ? 'door' : 'window', 19)}</div><div><div class="t">${esc(k.n)}</div></div><div class="m" style="color:#fb923c">offen</div></div>`).join('');
    return `<div class="c ${cls} tap" style="--i:${i}" data-act="doors"><div class="h">${ic('window', 14)}Fenster &amp; Türen<span class="r">${K.open.length ? K.open.length + ' offen' : 'Alles zu'}</span></div>${rows || `<div class="okc"><span>${ic('check', 14)}Alles geschlossen</span></div>`}<div class="card-note">${K.all.length} Kontakte · tippen für alle</div></div>`;
  }

