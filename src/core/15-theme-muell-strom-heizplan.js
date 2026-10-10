  /* ───────────── v5: Theme ───────────── */
  _isLight() {
    const p = this._themePref || this._c?.theme || 'dark';
    if (p === 'light') return true;
    if (p === 'auto') return this._h?.themes?.darkMode === false;
    return false;
  }
  _applyTheme() {
    const l = this._isLight(); this._light = l;
    WH = l ? '15,23,42' : '255,255,255'; FG = l ? '#334155' : '#fff';
    if (this._app) this._app.classList.toggle('light', l);
  }

  /* ───────────── v5: Müll ───────────── */
  _waste() {
    const s = this._s(this._c.extras.waste); if (!s) return null;
    const N = this._c.wasteNames, t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const list = [];
    for (const k in N) {
      const v = s.attributes[k]; if (!v) continue;
      const d = new Date(String(v).slice(0, 10) + 'T00:00:00'); if (isNaN(d)) continue;
      const days = Math.round((d - t0) / 864e5);
      if (days >= 0) list.push({ k, name: N[k][0], col: N[k][1], d, days });
    }
    return list.sort((a, b) => a.days - b.days);
  }
  _sWaste() {
    const WL = this._waste() || [], ico = { papier: 'news', gelbe_tonne: 'recycle', biomuell: 'flower', restmuell: 'trash', schadstoffe: 'truck' };
    const rgb = hex => { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return '148,163,184'; const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(','); };
    const rel = x => x.days === 0 ? 'Heute' : x.days === 1 ? 'Morgen' : `in ${x.days} Tagen`;
    const dt = x => x.d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
    const head = `<div class="grab"></div><div class="sh"><div class="ico">${ic('trash', 24)}</div><div><h2>Abfallkalender</h2><p>${WL.length ? 'Nächste Abholung: ' + (WL[0].days === 0 ? 'heute' : WL[0].days === 1 ? 'morgen' : 'in ' + WL[0].days + ' Tagen') : 'Keine Termine bekannt'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!WL.length) return head + `<div class="empty">🗑️ Keine kommenden Abholtermine gefunden${this._s(this._c.extras.waste) ? '' : ' (Sensor ' + esc(this._c.extras.waste) + ' fehlt)'}</div>`;
    const nx = WL.filter(x => x.days === WL[0].days), tip = WL[0].days === 1 ? 'Tonne heute Abend rausstellen.' : WL[0].days === 0 ? 'Heute ist Abholung – Tonne sollte draußen stehen.' : '';
    const hero = WL[0].days <= 1 ? `<div class="big sm">${WL[0].days === 0 ? 'Heute' : 'Morgen'}</div><span>${esc(nx.map(x => x.name).join(' + '))}</span>` : `<div class="big">${WL[0].days}</div><span>Tage bis ${esc(nx.map(x => x.name).join(' + '))}</span>`;
    const card = x => `<div class="wc ${x.days === WL[0].days ? 'nx' : ''}" style="--c:${rgb(x.col)}"><div class="bub">${ic(ico[x.k] || 'trash', 24)}</div><div class="tx"><div class="n">${esc(x.name)}</div><div class="s">${dt(x)}${x.days <= 1 ? '' : ' · ' + rel(x)}</div></div>${x.days <= 1 ? `<div class="bd">${x.days === 0 ? 'Heute' : 'Morgen'}</div>` : ''}</div>`;
    return head + `<div class="sum2"><div class="sbig wh" style="--c:${rgb(WL[0].col)}">${hero}</div><div class="cbox"><b>${dt(WL[0])}</b><small>nächster Termin</small></div></div>
      ${tip ? `<div class="card-note" style="margin-top:4px">${tip}</div>` : ''}
      <div class="lab2">ALLE TERMINE · ${WL.length}</div><div class="wl">${WL.map(card).join('')}</div>`;
  }
  _dayName(d) { const t0 = new Date(); t0.setHours(0, 0, 0, 0); const x = new Date(d); x.setHours(0, 0, 0, 0); const n = Math.round((x - t0) / 864e5); return n <= 0 ? 'Heute' : n === 1 ? 'Morgen' : x.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' }); }
  _dayTxt(x) { return x.days === 0 ? 'Heute' : x.days === 1 ? 'Morgen' : x.d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' }); }

  /* ───────────── v5: Schnellaktionen ───────────── */
  _quick() {
    const q = this._quickList().filter(x => x[0].startsWith('builtin:') || this._s(x[0])), TG = /^(light|switch|input_boolean|fan)\./;
    return `<div class="qa">${q.map(x => `<button class="qp${TG.test(x[0]) && this._val(x[0]) === 'on' ? ' on' : ''}" data-act="quick" data-e="${esc(x[0])}">${ic(x[2] || 'sparkle', 16)}<span>${esc(x[1])}</span></button>`).join('')}<button class="qp qe" data-act="qedit" aria-label="Schnellaktionen anpinnen oder bearbeiten">${ic(q.length ? 'plus' : 'sparkle', 16)}${q.length ? '' : '<span>Schnellaktionen anpinnen</span>'}</button></div>`;
  }
  _quickRun(e) {
    const h = this._h;
    if (e === 'builtin:goodnight') {
      const on = this._lightsOn().filter(l => l !== this._c.printer.light), open = this._openRooms();
      if (on.length) h.callService('light', 'turn_off', { entity_id: on });
      this._toast(`Gute Nacht 🌙 · ${on.length ? on.length + (on.length === 1 ? ' Licht aus' : ' Lichter aus') : 'alle Lichter aus'}${open.length ? ' · Fenster offen: ' + open.join(', ') : ' · alle Fenster zu'}`, open.length ? 5200 : 3200);
      return;
    }
    const d = dom(e), nm = this._name(e);
    if (d === 'button' || d === 'input_button') h.callService(d, 'press', { entity_id: e });
    else if (['light', 'switch', 'input_boolean', 'fan', 'humidifier'].includes(d)) { const on = this._val(e) === 'on'; h.callService(d, on ? 'turn_off' : 'turn_on', { entity_id: e }); this._toast(nm + (on ? ' aus' : ' an')); return; }
    else if (d === 'cover') h.callService('cover', 'toggle', { entity_id: e });
    else if (d === 'automation') h.callService('automation', 'trigger', { entity_id: e });
    else h.callService(d, 'turn_on', { entity_id: e });
    this._toast(nm + ' ausgeführt');
  }

  /* ───────────── v5: Systemstatus ───────────── */
  async _loadSys(force) {
    if (this._sysB || (!force && this._sys && Date.now() - this._sys.t < 3e5)) return;
    this._sysB = true;
    let issues = [];
    try { const r = await this._h.callWS({ type: 'repairs/list_issues' }); issues = (r?.issues || []).filter(i => !i.ignored); } catch (e) { issues = []; }
    this._sys = { t: Date.now(), issues };
    this._sysB = false;
    this._renderSoon();
  }
  _sysData() {
    const h = this._h, crit = new Set(this._c.critical), ig = this._c.ignore || [], ups = [], cr = [], other = {}, plat = {};
    for (const k in h.states) {
      if (ig.some(x => k.includes(x))) continue;
      const s = h.states[k], d = dom(k);
      if (d === 'update') { if (s.state === 'on') ups.push({ e: k, n: this._name(k).replace(/\s*(Update|update)$/, ''), cur: s.attributes.installed_version, lat: s.attributes.latest_version }); continue; }
      if (s.state !== 'unavailable') continue;
      const pl = h.entities?.[k]?.platform || '–'; plat[pl] = (plat[pl] || 0) + 1;
      if (crit.has(d)) cr.push(k); else other[d] = (other[d] || 0) + 1;
    }
    cr.sort((a, b) => this._name(a).localeCompare(this._name(b), 'de'));
    const iss = this._sys?.issues || [], nOther = Object.values(other).reduce((a, b) => a + b, 0);
    const bad = iss.some(i => i.severity === 'critical' || i.severity === 'error');
    const lvl = bad ? 'bad' : (ups.length || iss.length || cr.length) ? 'warn' : 'ok';
    return { ups, cr, other, nOther, iss, lvl, plat };
  }
  _sysRow() {
    const D = this._sysData(), parts = [];
    if (D.cr.length) parts.push(`${D.cr.length} Gerät${D.cr.length === 1 ? '' : 'e'} offline`);
    if (D.iss.length) parts.push(`${D.iss.length} Reparatur${D.iss.length === 1 ? '' : 'en'}`);
    if (D.ups.length) parts.push(`${D.ups.length} Update${D.ups.length === 1 ? '' : 's'}`);
    const tail = D.nOther ? ` · ${D.nOther} weitere inaktiv` : '';
    const col = D.lvl === 'bad' ? '#fb7185' : D.lvl === 'warn' ? '#fbbf24' : '#34d399';
    return `<button class="xr" data-act="sys"><div class="ico" style="color:${col};background:${col}22">${ic(D.lvl === 'ok' ? 'check' : 'wrench', 19)}</div><div><div class="t">System</div><div class="s">${esc((parts.length ? parts.join(' · ') : 'Alles in Ordnung') + tail)}</div></div><span class="dot" style="background:${col};color:${col}"></span></button>`;
  }
  _sSys() {
    const D = this._sysData();
    const row = (ico, t, s, e, m, col) => `<div class="vr ${e ? 'tap' : ''}" ${e ? `data-act="more" data-e="${esc(e)}"` : ''}><div class="ico" style="${col ? `color:${col};background:${col}22` : ''}">${ic(ico, 19)}</div><div><div class="t">${esc(t)}</div>${s ? `<div class="s">${esc(s)}</div>` : ''}</div>${m ? `<div class="m">${esc(m)}</div>` : ''}</div>`;
    const prettyIssue = i => String(i.translation_key || i.issue_id || '').replace(/[_\-]+/g, ' ');
    const oth = Object.entries(D.other).sort((a, b) => b[1] - a[1]);
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('wrench', 24)}</div><div><h2>Systemstatus</h2><p>${D.lvl === 'ok' ? 'Alles Wichtige in Ordnung' : 'Es gibt Hinweise'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="lab2">UPDATES · ${D.ups.length}</div>${D.ups.length ? D.ups.map(u => row('refresh', u.n, u.cur && u.lat ? `${u.cur} → ${u.lat}` : '', u.e, 'verfügbar', '#38bdf8')).join('') : '<div class="empty">✨ Alles ist aktuell</div>'}
      <div class="lab2">REPARATUREN · ${D.iss.length}</div>${D.iss.length ? D.iss.map(i => row('alert', (i.domain || 'System') + ' · ' + prettyIssue(i), i.severity ? 'Schwere: ' + i.severity : '', '', '', i.severity === 'warning' ? '#fbbf24' : '#fb7185')).join('') + '<div class="card-note">Details unter Einstellungen › System › Reparaturen</div>' : `<div class="empty">${this._sys ? '✨ Keine offenen Reparaturen' : 'Wird geladen …'}</div>`}
      <div class="lab2">NICHT VERFÜGBAR · WICHTIG · ${D.cr.length}</div>${D.cr.length ? D.cr.map(e => row(dom(e) === 'light' ? 'bulb' : dom(e) === 'climate' ? 'thermo' : 'plug', this._name(e), e, e, 'offline', '#fb7185')).join('') : '<div class="empty">✨ Alle wichtigen Geräte sind erreichbar</div>'}
      ${Object.keys(D.plat).length ? `<div class="lab2">OFFLINE NACH INTEGRATION</div><div class="calf" style="flex-wrap:wrap">${Object.entries(D.plat).sort((a, b) => b[1] - a[1]).map(o => `<button class="on" style="--ec:#fb923c;cursor:default"><i></i>${esc(o[0])} · ${o[1]}</button>`).join('')}</div><div class="card-note">So siehst du, welche Integration die meisten toten Entitäten verursacht – zum Aufräumen unter Einstellungen › Geräte & Dienste.</div>` : ''}
      ${oth.length ? `<div class="lab2">WEITERE NICHT VERFÜGBAR · ${D.nOther}</div><div class="calf" style="flex-wrap:wrap">${oth.map(o => `<button class="on" style="--ec:#94a3b8;cursor:default"><i></i>${esc(o[0])} · ${o[1]}</button>`).join('')}</div>` : ''}`;
  }

  /* ───────────── v5: Strom ───────────── */
  async _loadPower(force) {
    if (this._pwb || (!force && this._pw && Date.now() - this._pw.t < 3e5)) return;
    const ids = this._c.power.devices.map(d => d[1]).filter(e => e && this._s(e));
    if (!ids.length) return;
    this._pwb = true;
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    let today = null;
    try {
      const r = await this._h.callWS({ type: 'recorder/statistics_during_period', start_time: t0.toISOString(), statistic_ids: ids, period: 'hour', types: ['change'] });
      today = {}; for (const id of ids) today[id] = (r?.[id] || []).reduce((a, x) => a + (x.change || 0), 0);
    } catch (e) { today = null; }
    this._pw = { t: Date.now(), today: today || {}, ok: !!today };
    this._pwb = false;
    this._renderSoon();
  }
  _powerData() {
    const c = this._c.power, devs = [];
    for (const d of c.devices) {
      if (!this._s(d[0]) && !this._s(d[1])) continue;
      let w = this._num(d[0]); if (w != null && /^kw$/i.test(this._unit(d[0]))) w *= 1000;
      devs.push({ rate: d[0], en: d[1], n: d[2], icon: d[3] || 'plug', w: w ?? 0, kwh: this._pw?.ok ? (this._pw.today[d[1]] ?? null) : null });
    }
    devs.sort((a, b) => b.w - a.w || a.n.localeCompare(b.n, 'de'));
    const total = devs.reduce((a, d) => a + d.w, 0), kwh = this._pw?.ok ? devs.reduce((a, d) => a + (d.kwh || 0), 0) : null;
    const pv = c.pv || {}, pvn = k => (pv[k] && this._s(pv[k])) ? this._num(pv[k]) : null;
    return { devs, total, kwh, pv: { now: pvn('now'), today: pvn('today'), tomorrow: pvn('tomorrow'), remaining: pvn('remaining') } };
  }
  _powerCard(i) {
    const P = this._powerData(); if (!P.devs.length) return '';
    const act = P.devs.filter(d => d.w >= 1).slice(0, 4), mx = Math.max(...act.map(d => d.w), 1);
    const col = P.total > 800 ? '#fb923c' : P.total > 300 ? '#fbbf24' : '#34d399';
    const rows = act.length ? act.map(d => `<div class="bt fi" data-fp="2"><div class="t">${esc(d.n)}</div><div class="pc2"><i style="width:${clamp(d.w / mx * 100, 4, 100)}%;background:${col}"></i></div><b>${de(d.w, 0)} W</b></div>`).join('') : `<div class="okc"><span>${ic('check', 14)}Alle Geräte im Standby</span></div>`;
    return `<div class="c tap" style="--i:${i}" data-act="power"><div class="h">${ic('bolt', 14)}Strom<span class="r">${P.devs.length} Geräte</span></div>
      <div class="pwr"><div class="big" style="font-size:44px;color:${col}">${de(P.total, 0)}<small class="u"> W</small></div><div class="pwk">${P.kwh != null ? `<b>${de(P.kwh, 1)}</b> kWh heute` : 'jetzt gemessen'}</div></div>${rows}
      ${P.pv.today != null ? `<div class="card-note fi" data-fp="4">☀️ Solar-Prognose heute ${de(P.pv.today, 1)} kWh</div>` : '<div class="card-note fi" data-fp="4">tippen für alle Geräte</div>'}</div>`;
  }
  _sPower() {
    const P = this._powerData(), pr = this._price(), rg = this._pwr || 0;
    const pal = ['#fbbf24', '#fb923c', '#38bdf8', '#a78bfa', '#34d399'];
    const top = P.devs.filter(d => d.w >= 1).slice(0, 4);
    const series = (top.length ? top : P.devs.slice(0, 3)).filter(d => this._s(d.rate)).map((d, i) => ({ e: d.rate, name: d.n, color: pal[i % pal.length] }));
    const mx = Math.max(...P.devs.map(d => d.w), 1);
    const cost = pr && P.kwh != null ? de(P.kwh * pr, 2) + ' €' : null;
    const row = d => `<div class="vr tap" data-act="more" data-e="${esc(d.rate)}"><div class="ico" style="${d.w >= 1 ? 'color:#fbbf24;background:rgba(251,191,36,.16)' : ''}">${ic(d.icon, 19)}</div><div><div class="t">${esc(d.n)}</div><div class="pc2" style="margin-top:6px"><i style="width:${d.w >= 1 ? clamp(d.w / mx * 100, 3, 100) : 0}%;background:#fbbf24"></i></div>${d.kwh != null ? `<div class="s">${de(d.kwh, 2)} kWh heute</div>` : ''}</div><div class="m">${de(d.w, 0)} W</div></div>`;
    const pvRow = P.pv.today != null || P.pv.now != null ? `<div class="lab2">SOLAR-PROGNOSE</div><div class="dg">${P.pv.now != null ? `<div class="dt"><div class="v">${de(P.pv.now, 0)}<small class="u">W</small></div><div class="l">${ic('sun', 13)}Jetzt</div></div>` : ''}${P.pv.today != null ? `<div class="dt"><div class="v">${de(P.pv.today, 1)}<small class="u">kWh</small></div><div class="l">${ic('sun', 13)}Heute</div></div>` : ''}${P.pv.remaining != null ? `<div class="dt"><div class="v">${de(P.pv.remaining, 1)}<small class="u">kWh</small></div><div class="l">${ic('sun', 13)}Noch heute</div></div>` : ''}${P.pv.tomorrow != null ? `<div class="dt"><div class="v">${de(P.pv.tomorrow, 1)}<small class="u">kWh</small></div><div class="l">${ic('sun', 13)}Morgen</div></div>` : ''}</div>` : '';
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('bolt', 24)}</div><div><h2>Strom</h2><p>${P.devs.length} gemessene Geräte</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="dg"><div class="dt"><div class="v">${de(P.total, 0)}<small class="u">W</small></div><div class="l">${ic('bolt', 13)}Jetzt</div></div><div class="dt"><div class="v">${P.kwh != null ? de(P.kwh, 1) : '–'}<small class="u">kWh</small></div><div class="l">${ic('clock', 13)}Heute</div></div>${cost ? `<div class="dt"><div class="v">${cost}</div><div class="l">${ic('bolt', 13)}Kosten heute</div></div>` : ''}</div>
      <div class="seg wide" style="margin-top:12px">${[[0, 'Heute'], [7, '7 Tage'], [30, '30 Tage']].map(x => `<button class="${rg === x[0] ? 'on' : ''}" data-act="prange" data-n="${x[0]}">${x[1]}</button>`).join('')}</div>
      ${rg ? this._powerRange(rg) : `${series.length ? `<div class="lab2">VERLAUF · 24 STUNDEN</div>${this._chart(series, { h: 190, dec: 0 })}` : ''}
      <div class="lab2">GERÄTE</div>${P.devs.map(row).join('')}${pvRow}`}`;
  }

  /* ───────────── v5: Heizungsplan (climate-scheduler-card einbetten) ───────────── */
  _sSched() {
    const D = this._schedD, ids = Object.keys(this._h.states).filter(k => k.startsWith('schedule.'));
    if (!D || Date.now() - D.t > 3e5) this._loadSchedules();
    const meta = new Map((D?.list || []).map(x => [`schedule.${x.id}`, x])), on = ids.filter(k => this._val(k) === 'on').length;
    const TP = this._trvPlans(), nTP = TP.reduce((n, g) => n + g.th.length, 0), tab = !TP.length ? 'ha' : !ids.length ? 'trv' : this._schedTab || 'ha';
    const DAYS = [['monday', 'Mo'], ['tuesday', 'Di'], ['wednesday', 'Mi'], ['thursday', 'Do'], ['friday', 'Fr'], ['saturday', 'Sa'], ['sunday', 'So']];
    const mins = t => { const m = /^(\d+):(\d+)/.exec(t || ''); return m ? (+m[1]) * 60 + (+m[2]) : 0; };
    const nowD = new Date(), todayIdx = (nowD.getDay() + 6) % 7, nowPct = (nowD.getHours() * 60 + nowD.getMinutes()) / 14.4;
    const fmt = iso => { const d = new Date(iso); if (isNaN(d)) return ''; const same = d.toDateString() === nowD.toDateString(); return (same ? '' : d.toLocaleDateString('de-DE', { weekday: 'short' }) + ' ') + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); };
    const card = k => {
      const s = this._s(k), a = s.attributes || {}, m = meta.get(k), act = s.state === 'on', ne = a.next_event ? fmt(a.next_event) : '';
      const week = m ? `<div class="swk">${DAYS.map(([d, l], di) => `<div class="swr ${di === todayIdx ? 'td' : ''}"><span>${l}</span><div class="swt">${(m[d] || []).map(b => { const f = mins(b.from), t = Math.min(mins(b.to) || 1440, 1440); return `<i style="left:${(f / 14.4).toFixed(2)}%;width:${Math.max((t - f) / 14.4, .6).toFixed(2)}%"></i>`; }).join('')}${di === todayIdx ? `<b style="left:${nowPct.toFixed(2)}%"></b>` : ''}</div></div>`).join('')}<div class="swa"><span></span><div><em>0</em><em>6</em><em>12</em><em>18</em><em>24</em></div></div></div>` : '';
      return `<div class="sch ${act ? 'on' : ''}"><div class="sht" data-act="more" data-e="${k}"><div class="ico">${ic('clock', 19)}</div><div class="tx"><div class="n">${esc(m?.name || a.friendly_name || this._name(k))}</div><div class="s">${ne ? (act ? 'Aktiv bis ' : 'Nächster Start ') + ne : (act ? 'Gerade aktiv' : 'Kein Termin geplant')}</div></div><div class="bd ${act ? '' : 'off'}">${act ? 'Aktiv' : 'Pause'}</div></div>${week}</div>`;
    };
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('clock', 24)}</div><div><h2>Heizungsplan</h2><p>${ids.length ? ids.length + ' Zeitpläne · ' + on + ' gerade aktiv' : 'Keine Zeitpläne gefunden'}${nTP ? ' · ' + nTP + ' Thermostat-Pläne' : ''}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      ${TP.length && ids.length ? `<div class="seg wide" style="margin:6px 0 14px">${[['ha', 'Home Assistant · ' + ids.length], ['trv', 'Im Thermostat · ' + nTP]].map(x => `<button class="${tab === x[0] ? 'on' : ''}" data-act="schedtab" data-m="${x[0]}">${x[1]}</button>`).join('')}</div>` : ''}
      ${tab === 'trv' ? '' : ids.length ? `<div class="sl">${ids.sort((a, b) => (this._val(b) === 'on') - (this._val(a) === 'on') || this._name(a).localeCompare(this._name(b), 'de')).map(card).join('')}</div>` : `<div class="empty">🗓️ Es gibt noch keine Zeitpläne.<br><small>Lege unter Einstellungen → Geräte &amp; Dienste → Helfer einen „Zeitplan“ an.</small></div>`}
      ${TP.length && tab !== 'ha' ? `<div class="sl">${TP.map(g => this._trvCard(g)).join('')}</div>
      <div class="card-note">Diese Wochenpläne liegen direkt in den Heizkörperthermostaten. Sie greifen nur, wenn das Thermostat auf Automatik steht („Plan aktiv“). Steht es auf „manuell“, regelt Home Assistant die Temperatur.</div>` : ''}`;
  }
  async _loadSchedules() {
    if (this._scB) return; this._scB = true;
    let list = []; try { list = await this._h.callWS({ type: 'schedule/list' }); } catch (e) { list = []; }
    this._schedD = { t: Date.now(), list: Array.isArray(list) ? list : [] }; this._scB = false;
    if (this._sheet && this._sheet.t === 'sched') this._renderSheet();
  }
  _mountSched() {}
  /* pz16: Wochenpläne, die direkt in den Heizkörperthermostaten liegen (text.*_schedule_settings bzw. text.*_schedule_<wochentag>) */
  _trvPlans() {
    const S = this._h.states, E = this._h.entities || {}, Dv = this._h.devices || {}, A = this._h.areas || {}, by = new Map();
    const WD = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], SH = { mon: 'Mo', tue: 'Di', wed: 'Mi', thu: 'Do', fri: 'Fr', sat: 'Sa', sun: 'So' }, ORD = Object.keys(SH);
    for (const k in S) {
      if (!k.startsWith('text.')) continue;
      const m = /_schedule_(settings|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/.exec(k); if (!m || !okv(S[k].state) || !S[k].state.trim()) continue;
      const did = E[k]?.device_id || k.slice(5).replace(/_schedule_.*$/, '');
      if (!by.has(did)) by.set(did, { did, days: {}, set: null, ref: k });
      const g = by.get(did); if (m[1] === 'settings') g.set = S[k].state.trim(); else g.days[m[1]] = S[k].state.trim();
    }
    const pts = (str, re) => str.split(re === 1 ? /\|/ : /\s+/).map(p => /^(\d{1,2}):(\d{2})[\/,](-?\d+(?:\.\d+)?)$/.exec(p.trim())).filter(Boolean).map(x => ({ m: Math.min(+x[1] * 60 + +x[2], 1440), t: +x[3] })).sort((a, b) => a.m - b.m);
    const segs = (P, carry) => {
      if (!P.length) return []; const out = [], c0 = carry ?? P[P.length - 1].t, add = (f, to, t) => { const l = out[out.length - 1]; if (l && l.t === t && l.to === f) l.to = to; else out.push({ f, to, t }); };
      if (P[0].m > 0) add(0, P[0].m, c0); P.forEach((p, i) => { const to = i + 1 < P.length ? P[i + 1].m : 1440; if (to > p.m) add(p.m, to, p.t); }); return out;
    };
    const dayLbl = spec => { const d = spec.split(',').map(x => x.trim().slice(0, 3).toLowerCase()).filter(x => SH[x]).sort((a, b) => ORD.indexOf(a) - ORD.indexOf(b)); if (!d.length) return ''; const runs = []; d.forEach(x => { const r = runs[runs.length - 1]; if (r && ORD.indexOf(x) === ORD.indexOf(r[r.length - 1]) + 1) r.push(x); else runs.push([x]); }); return runs.map(r => r.length > 2 ? SH[r[0]] + '–' + SH[r[r.length - 1]] : r.map(x => SH[x]).join(', ')).join(', '); };
    const out = [];
    for (const g of by.values()) {
      const cl = Object.keys(S).find(x => x.startsWith('climate.') && E[x]?.device_id && E[x].device_id === g.did);
      const dev = Dv[g.did], ca = cl ? S[cl].attributes || {} : {};
      const name = (dev && (dev.name_by_user || dev.name)) || ca.friendly_name || (S[g.ref].attributes.friendly_name || '').replace(/\s*Schedule.*$/i, '') || g.ref;
      const area = A[(cl && E[cl]?.area_id) || dev?.area_id]?.name || '';
      const pm = String(ca.preset_mode || '').toLowerCase(), active = cl ? (['auto', 'schedule', 'program', 'programme'].includes(pm) || this._val(cl) === 'auto') : null;
      let rows, key;
      if (WD.some(d => g.days[d])) {
        let carry = null; for (let k = 6; k >= 0 && carry == null; k--) { const P = pts(g.days[WD[k]] || '', 0); if (P.length) carry = P[P.length - 1].t; }
        rows = WD.map((d, di) => { const P = pts(g.days[d] || '', 0), sg = segs(P, carry); if (P.length) carry = P[P.length - 1].t; return { l: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'][di], di, sg }; });
        key = 'w:' + WD.map(d => g.days[d] || '').join('|');
      } else if (g.set) {
        const [spec, ...rest] = g.set.split('|'), P = pts(rest.join('|'), 1);
        rows = [{ l: '', di: -1, days: dayLbl(spec || ''), sg: segs(P, null) }];
        key = 's:' + g.set;
      } else continue;
      if (!rows.some(r => r.sg.length)) continue;
      out.push({ name: name.trim(), area, cl, active, cur: ca.temperature, rows, key });
    }
    // Thermostate mit identischem Plan zu einer Karte zusammenfassen
    const grp = new Map(); for (const x of out) { if (!grp.has(x.key)) grp.set(x.key, { rows: x.rows, th: [] }); grp.get(x.key).th.push(x); }
    return [...grp.values()].sort((a, b) => b.th.length - a.th.length || a.th[0].name.localeCompare(b.th[0].name, 'de'));
  }
  _trvCard(G) {
    const nowD = new Date(), td = (nowD.getDay() + 6) % 7, nm = nowD.getHours() * 60 + nowD.getMinutes();
    const today = G.rows.find(r => r.di === td) || (G.rows.length === 1 ? G.rows[0] : null), seg = today?.sg.find(s => nm >= s.f && nm < s.to), nx = seg && today.sg.find(s => s.f > nm && s.t !== seg.t);
    // kühl (blau) → warm (orange): 16 °C und weniger blau, ab 22 °C orange
    const hcol = t => { const f = clamp((t - 16) / 6, 0, 1), A = [96, 165, 250], B = [251, 146, 60]; return `rgb(${A.map((a, k) => Math.round(a + (B[k] - a) * f)).join(',')})`; };
    const bar = r => `<div class="tpt">${r.sg.map(s => { const w = (s.to - s.f) / 14.4; return `<i style="left:${(s.f / 14.4).toFixed(2)}%;width:${w.toFixed(2)}%;background:${hcol(s.t)}">${w >= 9 ? `<em>${de(s.t, s.t % 1 ? 1 : 0)}°</em>` : ''}</i>`; }).join('')}${r === today ? `<b style="left:${(nm / 14.4).toFixed(2)}%"></b>` : ''}</div>`;
    const week = `<div class="swk tpw">${G.rows.map(r => r.di >= 0 ? `<div class="swr ${r.di === td ? 'td' : ''}"><span>${r.l}</span>${bar(r)}</div>` : `<div class="tpd">${r.days ? 'Gilt für ' + esc(r.days) : 'Keine Wochentage hinterlegt'}</div><div class="swr td"><span></span>${bar(r)}</div>`).join('')}<div class="swa"><span></span><div><em>0</em><em>6</em><em>12</em><em>18</em><em>24</em></div></div></div>`;
    const act = G.th.filter(x => x.active).length, known = G.th.filter(x => x.active != null).length;
    const mixed = act > 0 && act < known;
    const chips = G.th.map(x => `<button class="tpc ${x.active ? 'on' : ''}" ${x.cl ? `data-act="more" data-e="${x.cl}"` : ''}><span>${esc(x.name)}</span>${x.active == null || !mixed ? '' : `<small>${x.active ? 'Plan aktiv' : 'manuell'}</small>`}</button>`).join('');
    const sub = seg ? `Laut Plan jetzt ${de(seg.t, seg.t % 1 ? 1 : 0)} °C${nx ? ` · ab ${String(Math.floor(nx.f / 60)).padStart(2, '0')}:${String(nx.f % 60).padStart(2, '0')} ${de(nx.t, nx.t % 1 ? 1 : 0)} °C` : ''}` : 'Für heute kein Eintrag';
    return `<div class="sch tpl ${act ? 'on' : ''}"><div class="sht"><div class="ico">${ic('thermo', 19)}</div><div class="tx"><div class="n">${G.th.length > 1 ? G.th.length + ' Thermostate' : esc(G.th[0].name)}</div><div class="s">${sub}</div></div>${known ? `<div class="bd ${act ? '' : 'off'}">${act ? (act === known ? 'Aktiv' : act + ' von ' + known + ' aktiv') : 'Manuell'}</div>` : ''}</div>
      <div class="tpcs">${chips}</div>${week}</div>`;
  }

  /* ───────────── v5: Regenradar ───────────── */
  _radarUrl() {
    if (this._c.radarUrl) return this._c.radarUrl;
    const lat = this._h?.config?.latitude ?? 51.77, lon = this._h?.config?.longitude ?? 8.57;
    return `https://embed.windy.com/embed2.html?lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&detailLat=${lat.toFixed(2)}&detailLon=${lon.toFixed(2)}&zoom=7&level=surface&overlay=radar&product=radar&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
  }
