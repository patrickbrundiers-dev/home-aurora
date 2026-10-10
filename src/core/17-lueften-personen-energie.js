  /* ───────────── v5.2: Lüften – Raumkarte ───────────── */
  _ago(iso) {
    const t = new Date(iso).getTime(); if (isNaN(t)) return '';
    const m = Math.max(0, Math.round((Date.now() - t) / 6e4));
    return m < 2 ? 'gerade eben' : m < 60 ? `vor ${m} Min.` : m < 1440 ? `vor ${Math.round(m / 60)} Std.` : `vor ${Math.round(m / 1440)} Tg.`;
  }
  _mmss(s) { s = Math.round(s || 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  _vrChart(v) {
    const pts = (v?.punkte || []).filter(p => p[1] != null && p[2] != null);
    if (pts.length < 2) return '<div class="empty">Noch keine Lüftung aufgezeichnet</div>';
    const T = Math.max(...pts.map(p => p[0]), 1), W = 300, H = 104, pl = 4, pr = 8, pt = 8, pb = 6;
    const rng = i => { let a = Math.min(...pts.map(p => p[i])), b = Math.max(...pts.map(p => p[i])); if (b - a < .6) { a -= .3; b += .3; } const pad = (b - a) * .15; return [a - pad, b + pad]; };
    const [a1, b1] = rng(1), [a2, b2] = rng(2);
    const X = s => pl + s / T * (W - pl - pr), Y1 = v1 => pt + (1 - (v1 - a1) / (b1 - a1)) * (H - pt - pb), Y2 = v2 => pt + (1 - (v2 - a2) / (b2 - a2)) * (H - pt - pb);
    const segs = [];
    let cur = [];
    for (const p of (v.punkte || [])) { if (p[1] == null || p[2] == null) { if (cur.length) segs.push(cur); cur = []; } else cur.push(p); }
    if (cur.length) segs.push(cur);
    const line = (seg, i, Y) => seg.map((p, k) => (k ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[i]).toFixed(1)).join('');
    const area = segs.filter(s => s.length > 1).map(s => line(s, 1, Y1) + `L${X(s[s.length - 1][0]).toFixed(1)} ${H - pb}L${X(s[0][0]).toFixed(1)} ${H - pb}z`).join('');
    const last = pts[pts.length - 1];
    return `<svg class="vrch" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="vag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38bdf8" stop-opacity=".45"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#vag)"/>${segs.map(s => `<path d="${line(s, 1, Y1)}" fill="none" stroke="#38bdf8" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`).join('')}
      ${segs.map(s => `<path d="${line(s, 2, Y2)}" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>`).join('')}</svg>
      <span class="vrdot" style="left:${(X(last[0]) / W * 100).toFixed(1)}%;top:${(Y1(last[1]) / H * 100).toFixed(1)}%"></span>`;
  }
  _sVRoom(e) {
    const s = this._s(e);
    if (!s) return `<div class="grab"></div><div class="sh"><button class="x bk" data-act="vent">${ic('chevron', 20)}</button><div><h2>Lüften</h2></div><button class="x" data-act="close">${ic('close', 20)}</button></div><div class="empty">Raum nicht gefunden</div>`;
    const at = s.attributes || {}, k = at.karte || {}, ent = k.entitaeten || at.entitaeten || {}, nm = k.name || this._name(e).replace(/ Empfehlung$/, '');
    const cfg = this._roomByName(nm), run = !!k.laeuft, pause = k.pausiert || '', want = k.lueften !== false && (k.minuten > 0) && !pause && !run;
    const win = k.fenster_status || [], nOpen = win.filter(w => w.offen).length;
    const tone = run ? 'live' : pause ? 'warn' : want ? 'hot' : 'ok';
    const chip = run ? 'Lüftet gerade' : pause ? 'Pausiert' : want ? 'Jetzt lüften' : 'Alles gut';
    const icon = run ? 'wind' : pause ? 'pause' : want ? 'wind' : 'check';
    const head = pause || k.status || s.state;
    let sub = pause && k.minuten ? `Später: ${k.modus || 'Lüften'} · ca. ${k.minuten} Min.${k.grund ? ' · wegen ' + k.grund : ''}` : (k.entscheidungsgrund || ''); if (sub === head) sub = '';
    const risk = { niedrig: ['ok', 'Niedrig'], beobachten: ['warn', 'Beobachten'], hoch: ['bad', 'Hoch'] }[k.schimmel] || ['', '–'];
    const sn = ent.snooze && this._s(ent.snooze), sk = ent.skip && this._s(ent.skip), pm = ent.party_mode && this._s(ent.party_mode);
    const tile = (lab, ico, big, small, ee) => `<div class="vt ${ee ? 'tap' : ''}" ${ee ? `data-act="more" data-e="${esc(ee)}"` : ''}><div class="vtl">${ic(ico, 14)}${lab}</div><div class="vtv">${big}</div><div class="vts">${small}</div></div>`;
    const wallPct = k.wand_rh != null ? clamp(k.wand_rh, 0, 100) : null;
    const V = k.verlauf || at.verlauf || {}, vp = (V.punkte || []).filter(p => p[1] != null && p[2] != null);
    let vsum = '';
    if (vp.length > 1) {
      const a0 = vp[0][1], a1 = vp[vp.length - 1][1], t0 = vp[0][2], t1 = vp[vp.length - 1][2], dp = a0 ? (a1 - a0) / a0 * 100 : 0;
      vsum = `<div class="vrs"><div><b>${de(a0, 1)}</b> → <b>${de(a1, 1)}</b> <small>g/m³</small> <span class="tag ${dp <= -1 ? 'ok' : dp >= 1 ? 'bad' : ''}">${dp > 0 ? '+' : ''}${de(dp, 0)} %</span></div><div class="vrt">Temp. ${de(t0, 0)} → ${de(t1, 1)} °C</div></div>`;
    }
    const last = vp.length ? this._mmss(vp[vp.length - 1][0]) + ' min' : '';
    const T = k.trend_tage || at.trend_tage || [], mx = Math.max(...T.map(t => t.anzahl), 1);
    const bars = T.map((t, i) => `<div class="${i === T.length - 1 ? 'today' : ''}"><b>${t.anzahl ? t.anzahl + '×' : ''}</b><i style="height:${Math.max(4, t.anzahl / mx * 78)}px"></i>${i === T.length - 1 ? 'Heute' : new Date(t.datum).toLocaleDateString('de-DE', { weekday: 'short' })}</div>`).join('');
    const st = k.statistik || at.statistik || {}, stRow = (lab, o) => o ? `<div class="vr"><div><div class="t">${lab}</div><div class="s">${o.count}× gelüftet · Ø ${de(o.avg_minutes, 0)} Min.${o.count ? ' · ' + o.ok + ' ausreichend' : ''}</div></div><div class="m">${de(o.kwh, 2)} kWh<small>${de(o.cost, 2)} €</small></div></div>` : '';
    const wins = (k.lueftungsfenster || []).slice(0, 3).map(w => `<div class="vr"><div class="ico">${ic('clock', 19)}</div><div><div class="t">${hhmm(w.start)} – ${hhmm(w.end)}</div><div class="s">${w.hours} Std. · Wind ${de(w.wind, 0)} m/s${w.rain_probability ? ' · Regen ' + w.rain_probability + ' %' : ''}</div></div><div class="m">−${de(w.gain, 1)} g/m³<small>Entfeuchtung</small></div></div>`).join('');
    const flags = [[k.urlaub, 'Urlaubsmodus', 'sun'], [k.entfeuchter, 'Entfeuchter läuft', 'drop'], [k.rollo_empfehlung, 'Rollo schließen', 'window'], [k.nach_dusche, 'Nach dem Duschen', 'bath'], [k.kuehlt_aus, 'Kühlt aus', 'thermo'], [k.regen_bald, 'Regen bald', 'rain']].filter(f => f[0]).map(f => `<span class="vchip">${ic(f[2], 14)}${f[1]}</span>`).join('');
    const co2 = k.co2 != null ? tile('CO₂', 'gauge', `${de(k.co2, 0)}<small>ppm</small>`, k.co2 > 1200 ? 'Hoch' : k.co2 > 800 ? 'Erhöht' : 'Gut', ent.co2) : '';
    return `<div class="grab"></div><div class="sh"><button class="x bk" data-act="vent" aria-label="Zurück">${ic('chevron', 20)}</button><div class="ico">${ic(cfg?.icon || 'wind', 24)}</div><div><h2>${esc(nm)}</h2><p style="white-space:nowrap">${k.saison === 'winter' ? '❄ Winter' : k.saison ? '☀ Sommer' : ''}${k.fenster_anzahl != null ? ' · ' + k.fenster_anzahl + ' Fenster' : ''}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="vst ${tone}"><div class="vsi">${ic(icon, 26)}</div><div class="vsx"><div class="vkick">${chip.toUpperCase()}</div><div class="vh1">${esc(head)}</div>${sub ? `<div class="vh2">${esc(sub)}</div>` : ''}</div></div>
      ${run ? `<div class="vbar" style="margin:10px 2px 0"><i style="width:${clamp(k.fortschritt || 0, 0, 100)}%"></i></div><div class="vh2" style="margin:6px 4px 0">${this._mmss(k.dauer_s)} gelüftet${k.rest_minuten != null ? ' · noch ' + de(k.rest_minuten, 0) + ' Min.' : ''}</div>` : ''}
      <div class="vact">${pm ? `<button class="vbt big ${k.party_modus ? 'on' : ''}" data-act="press" data-e="${ent.party_mode}" data-msg="${k.party_modus ? 'Party-Modus aktualisiert' : 'Party-Modus gestartet'}">${ic('sparkle', 15)}${k.party_modus ? 'Party-Modus aktiv' + (k.party_bis ? ' · bis ' + hhmm(k.party_bis) : '') : 'Party-Modus starten'}</button>` : ''}${!run && sn ? `<button class="vbt big" data-act="press" data-e="${ent.snooze}" data-msg="Erinnerung 30 Min. ausgesetzt">${ic('clock', 15)}30 Min. später</button>` : ''}${!run && sk ? `<button class="vbt big" data-act="press" data-e="${ent.skip}" data-msg="Heute nicht mehr erinnern">${ic('close', 15)}Heute nicht mehr</button>` : ''}</div>
      <div class="vts3">${tile('INNEN', 'home', `${de(k.innen_t)}<small>°C</small>`, `${de(k.innen_ah)} g/m³ · ${de(k.innen_rh, 0)} %`, ent.innen)}${tile('AUSSEN', 'cloudsun', `${de(k.aussen_t)}<small>°C</small>`, `${de(k.aussen_ah)} g/m³`, ent.aussen)}${tile('WAND', 'drop', `${wallPct != null ? de(wallPct, 0) : '–'}<small>%</small>`, `${wallPct != null ? `<div class="wbar"><i style="width:${wallPct}%"></i><u style="left:60%"></u><u style="left:70%"></u></div>` : ''}<span class="tag ${risk[0]}">${risk[1]}</span>`, ent.wand)}${co2}</div>
      ${k.schimmel_grund || k.wand_taupunkt_abstand != null ? `<div class="vnote">${ic('shield', 16)}<div><b>Schimmel: ${risk[1]}</b>${k.schimmel_grund ? ' – ' + esc(k.schimmel_grund) : ''}${k.schimmel_massnahme ? `<br><span>${esc(k.schimmel_massnahme)}</span>` : ''}${k.wand_taupunkt_abstand != null ? `<br><span>Abstand zum Taupunkt an der Wand: ${de(k.wand_taupunkt_abstand, 1)} K</span>` : ''}</div></div>` : ''}
      <div class="lab2">LETZTE LÜFTUNG</div>
      <div class="sctl vrbox"><div class="vrhd"><span class="vleg"><i style="background:#38bdf8"></i>Feuchte</span><span class="vleg"><i style="background:#fbbf24"></i>Temp.</span><span class="vago">${V.ende ? this._ago(V.ende) : ''}${last ? ' · ' + last : ''}</span></div>${vsum}<div class="vrplot">${this._vrChart(V)}</div>${vp.length > 1 ? `<div class="vrx"><span>0:00</span><span>${last}</span></div>` : ''}</div>
      ${T.length ? `<div class="lab2">LETZTE 7 TAGE</div><div class="sctl" style="display:block"><div class="tr">${bars}</div></div>` : ''}
      ${win.length ? `<div class="lab2">FENSTER</div>${win.map(w => `<div class="vr"><div class="ico" style="${w.offen ? 'color:#fb923c;background:rgba(251,146,60,.16)' : 'color:#34d399;background:rgba(52,211,153,.12)'}">${ic('window', 19)}</div><div><div class="t">${esc(w.name)}</div></div><div class="m" style="${w.offen ? 'color:#fb923c' : 'color:#34d399'}">${w.offen ? 'offen' : 'geschlossen'}</div></div>`).join('')}` : ''}
      <div class="lab2">ÜBERBLICK</div>
      <div class="vchips">${k.bester_zeitpunkt || at.bester_zeitpunkt ? `<span class="vchip">${ic('clock', 14)}${esc(k.bester_zeitpunkt || at.bester_zeitpunkt)}</span>` : ''}<button class="vchip btn" data-act="vx">${ic('cal', 14)}${k.heute_anzahl || 0}× heute · ${de(k.heute_min || 0, 0)} Min.<span class="chev ${this._vx ? 'up' : ''}">${ic('chevron', 12)}</span></button><span class="vchip">${ic('flame', 14)}${de(k.heute_kwh || 0, 2)} kWh · ${de(k.heute_eur || 0, 2)} €</span>${flags}</div>
      ${this._vx ? `<div class="vstat">${stRow('Diese Woche', st.woche)}${stRow('Dieser Monat', st.monat)}${stRow('Gesamt', st.gesamt)}</div>` : ''}
      ${wins ? `<div class="lab2">BESTE LÜFTUNGSZEITEN</div>${wins}` : ''}
      ${cfg ? `<button class="qb" style="margin-top:14px" data-act="room" data-room="${cfg.id}">${ic(cfg.icon || 'grid', 14)}${esc(cfg.name)} öffnen</button>` : ''}`;
  }

  /* ───────────── v5.2: Wer ist da ───────────── */
  _homeLL() {
    const z = this._s('zone.home')?.attributes || {}, c = this._h?.config || {};
    const la = z.latitude ?? c.latitude, lo = z.longitude ?? c.longitude;
    return la != null && lo != null ? [la, lo] : null;
  }
  _pInfo(e) {
    const s = this._s(e); if (!s) return null;
    const a = s.attributes || {}, home = s.state === 'home', ll = this._homeLL();
    let dist = null;
    if (!home && a.latitude != null && a.longitude != null && ll) {
      const R = 6371, r = x => x * Math.PI / 180, dLa = r(a.latitude - ll[0]), dLo = r(a.longitude - ll[1]);
      const q = Math.sin(dLa / 2) ** 2 + Math.cos(r(ll[0])) * Math.cos(r(a.latitude)) * Math.sin(dLo / 2) ** 2;
      dist = 2 * R * Math.asin(Math.sqrt(q));
    }
    this._pt = this._pt || {};
    const tr = this._pt[e] = this._pt[e] || [];
    if (dist != null) { const l = tr[tr.length - 1]; if (!l || Date.now() - l.t > 6e4) { tr.push({ t: Date.now(), d: dist }); if (tr.length > 12) tr.shift(); } } else tr.length = 0;
    let dir = '', eta = null;
    if (dist != null && tr.length > 1) {
      const old = tr.find(x => Date.now() - x.t >= 180e3) || tr[0], dt = (Date.now() - old.t) / 36e5, dd = dist - old.d;
      if (dt > 0.02 && Math.abs(dd) > .15) {
        dir = dd < 0 ? 'näher' : 'weiter';
        if (dd < 0) { const sp = -dd / dt; if (sp > 3) eta = Math.min(180, Math.round(dist / sp * 60)); }
      } else if (dt > 0.02) dir = 'steht';
    }
    let bat = null;
    const src = a.source, dev = this._h.entities?.[src]?.device_id;
    if (dev) for (const k in this._h.entities) { const en = this._h.entities[k]; if (en.device_id === dev && this._attr(k, 'device_class') === 'battery') { const v = this._num(k); if (v != null) { bat = v; break; } } }
    if (bat == null && this._attr(src, 'battery_level') != null) bat = this._attr(src, 'battery_level');
    return { e, s, a, home, dist, dir, eta, bat, since: s.last_changed, zone: home ? 'Zuhause' : s.state === 'not_home' ? 'Unterwegs' : s.state };
  }
  _pSub(p) {
    if (p.home) return 'Zuhause';
    const d = p.dist != null ? (p.dist < 1 ? Math.round(p.dist * 1000) + ' m' : de(p.dist, 1) + ' km') : '';
    const t = p.eta ? ` · ≈${p.eta} Min.` : p.dir === 'näher' ? ' · kommt näher' : '';
    return (p.zone === 'Unterwegs' ? 'Unterwegs' : esc(p.zone)) + (d ? ' · ' + d : '') + t;
  }
  _sPersons() {
    const P = this._c.persons.map(e => this._pInfo(e)).filter(Boolean);
    const row = p => `<div class="vr tap" data-act="more" data-e="${p.e}"><div class="av big2" ${p.a.entity_picture ? `style="background-image:url('${esc(p.a.entity_picture)}')"` : ''}>${p.a.entity_picture ? '' : esc((p.a.friendly_name || '?')[0])}</div>
      <div><div class="t">${esc(p.a.friendly_name || p.e)}</div><div class="s">${p.home ? 'Zuhause' : esc(p.zone)}${p.since ? ' · seit ' + new Date(p.since).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
      <div class="vchips" style="margin-top:6px">${p.dist != null ? `<span class="vchip">${ic('radar', 13)}${p.dist < 1 ? Math.round(p.dist * 1000) + ' m' : de(p.dist, 1) + ' km'} entfernt</span>` : ''}${p.dir === 'näher' ? `<span class="vchip good">${ic('chevron', 13)}kommt näher${p.eta ? ' · ≈' + p.eta + ' Min.' : ''}</span>` : p.dir === 'weiter' ? `<span class="vchip">${ic('chevron', 13)}entfernt sich</span>` : ''}${p.bat != null ? `<span class="vchip ${p.bat <= 15 ? 'bad' : ''}">${ic('battery', 13)}${de(p.bat, 0)} %</span>` : ''}${p.a.gps_accuracy != null && !p.home ? `<span class="vchip">GPS ±${de(p.a.gps_accuracy, 0)} m</span>` : ''}</div></div></div>`;
    const home = P.filter(p => p.home).length;
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('user', 24)}</div><div><h2>Wer ist da?</h2><p>${home} von ${P.length} zuhause</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>${P.map(row).join('')}<div class="card-note">Entfernung und Richtung berechnet die Karte aus den GPS-Daten der Personen. Die Ankunftszeit ist nur eine grobe Schätzung.</div>`;
  }

  /* ───────────── v5.2: Energie über Zeit ───────────── */
  _price() { const e = this._c.power.priceEntity, v = e && this._num(e); return v != null ? v : (this._c.power.price || null); }
  async _loadPR(force) {
    if (this._prb || (!force && this._pr && Date.now() - this._pr.t < 6e5)) return;
    const ids = this._c.power.devices.map(d => d[1]).filter(e => e && this._s(e));
    if (!ids.length) return;
    this._prb = true;
    const t0 = new Date(); t0.setHours(0, 0, 0, 0); t0.setDate(t0.getDate() - 59);
    let days = null;
    try {
      const r = await this._h.callWS({ type: 'recorder/statistics_during_period', start_time: t0.toISOString(), statistic_ids: ids, period: 'day', types: ['change'] });
      days = {}; const per = {};
      for (const id of ids) for (const x of (r?.[id] || [])) { const d = new Date(x.start), key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); days[key] = (days[key] || 0) + (x.change || 0); (per[id] = per[id] || {})[key] = (x.change || 0); }
      this._pr = { t: Date.now(), days, per, ok: true };
    } catch (e) { this._pr = { t: Date.now(), days: {}, per: {}, ok: false }; }
    this._prb = false;
    if (this._sheet?.t === 'power') this._renderSheet();
  }
  _prSeries(n) {
    const out = [], t = new Date(); t.setHours(0, 0, 0, 0);
    for (let i = n - 1; i >= 0; i--) { const d = new Date(+t - i * 864e5), key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); out.push({ d, key, v: this._pr?.days?.[key] ?? 0 }); }
    return out;
  }
  _powerRange(n) {
    if (!this._pr) { this._loadPR(); return '<div class="sk" style="height:200px"></div>'; }
    if (!this._pr.ok) return '<div class="empty">Statistik nicht verfügbar</div>';
    const cur = this._prSeries(n), prevT = new Date(); prevT.setHours(0, 0, 0, 0);
    let prev = 0; for (let i = n; i < 2 * n; i++) { const d = new Date(+prevT - i * 864e5), key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); prev += this._pr.days[key] || 0; }
    const sum = cur.reduce((a, x) => a + x.v, 0), mx = Math.max(...cur.map(x => x.v), .01), pr = this._price();
    const dd = prev > 0 ? (sum - prev) / prev * 100 : null;
    const bars = cur.map((x, i) => `<div class="${i === cur.length - 1 ? 'today' : ''}"><b>${n <= 7 ? de(x.v, 1) : ''}</b><i style="height:${Math.max(3, x.v / mx * 90)}px"></i>${n <= 7 ? (i === cur.length - 1 ? 'Heute' : x.d.toLocaleDateString('de-DE', { weekday: 'short' })) : (i % 5 === 0 || i === cur.length - 1 ? x.d.getDate() + '.' : '')}</div>`).join('');
    const per = this._c.power.devices.filter(d => this._pr.per[d[1]]).map(d => ({ n: d[2], icon: d[3] || 'plug', v: cur.reduce((a, x) => a + (this._pr.per[d[1]][x.key] || 0), 0) })).filter(x => x.v > 0.005).sort((a, b) => b.v - a.v);
    const pm = Math.max(...per.map(x => x.v), .01);
    return `<div class="dg" style="margin-top:12px"><div class="dt"><div class="v">${de(sum, 1)}<small class="u">kWh</small></div><div class="l">${ic('bolt', 13)}${n} Tage</div></div><div class="dt"><div class="v">${de(sum / n, 2)}<small class="u">kWh</small></div><div class="l">${ic('clock', 13)}Ø pro Tag</div></div>${pr ? `<div class="dt"><div class="v">${de(sum * pr, 2)}<small class="u">€</small></div><div class="l">${ic('bolt', 13)}bei ${de(pr, 2)} €/kWh</div></div>` : ''}${dd != null ? `<div class="dt"><div class="v" style="color:${dd > 5 ? 'var(--bad)' : dd < -5 ? 'var(--ok)' : 'inherit'}">${dd > 0 ? '+' : ''}${de(dd, 0)}<small class="u">%</small></div><div class="l">${ic('chevron', 13)}zur Vorperiode</div></div>` : ''}</div>
      <div class="sctl" style="display:block;margin-top:10px"><div class="tr ${n > 7 ? 'dense' : ''}">${bars}</div></div>
      <div class="lab2">VERBRAUCH NACH GERÄT</div>${per.length ? per.map(x => `<div class="bt"><div class="t">${esc(x.n)}</div><div class="pc2"><i style="width:${x.v / pm * 100}%;background:#fbbf24"></i></div><b style="width:auto;min-width:62px">${de(x.v, 1)} kWh</b></div>`).join('') : '<div class="empty">Keine Verbrauchsdaten</div>'}`;
  }

  /* ───────────── v5.2: Schnellaktionen bearbeiten ───────────── */
  _quickList() {
    try { const j = JSON.parse(localStorage.getItem('home-aurora-quick') || 'null'); if (Array.isArray(j)) return j; } catch (e) { /* Standard */ }
    return this._c.quick || [];
  }
  _quickSave(list) { try { localStorage.setItem('home-aurora-quick', JSON.stringify(list)); } catch (e) { this._toast('Speichern auf diesem Gerät nicht möglich'); } }
  _sQuick() {
    const list = this._quickList(), has = new Set(list.map(x => x[0]));
    const F = [['sc', 'Szenen & Skripte', /^(scene|script)\./], ['light', 'Lichter', /^light\./], ['switch', 'Schalter', /^(switch|input_boolean)\./], ['cover', 'Rollläden', /^cover\./], ['btn', 'Buttons', /^(button|input_button)\./]], qf = this._sheet.qf || 'sc', fx = (F.find(f => f[0] === qf) || F[0])[2];
    const cand = Object.keys(this._h.states).filter(k => fx.test(k) && !has.has(k) && this._h.states[k].state !== 'unavailable').sort((a, b) => this._name(a).localeCompare(this._name(b), 'de'));
    const fchips = `<div class="qfl">${F.map(f => `<button class="qfc ${f[0] === qf ? 'on' : ''}" data-act="qfil" data-e="${f[0]}">${f[1]}</button>`).join('')}</div>`;
    const row = (x, i) => `<div class="vr qr"><div class="ico">${ic(x[2] || 'sparkle', 19)}</div><div><div class="t">${esc(x[1])}</div><div class="s">${x[0].startsWith('builtin:') ? 'Eingebaut' : esc(x[0])}${!x[0].startsWith('builtin:') && !this._s(x[0]) ? ' · nicht gefunden' : ''}</div></div><div class="qbtns"><button class="vbt" data-act="qmove" data-i="${i}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="Nach oben">▲</button><button class="vbt" data-act="qmove" data-i="${i}" data-d="1" ${i === list.length - 1 ? 'disabled' : ''} aria-label="Nach unten">▼</button><button class="vbt" data-act="qdel" data-i="${i}" aria-label="Entfernen">${ic('close', 12)}</button></div></div>`;
    const add = k => `<div class="vr tap" data-act="qadd" data-e="${esc(k)}"><div class="ico">${ic(this._qIcon(k), 19)}</div><div><div class="t">${esc(this._name(k))}</div><div class="s">${k.startsWith('scene.') ? 'Szene' : k.startsWith('script.') ? 'Skript' : esc(k)}</div></div><div class="m">${ic('plus', 16)}</div></div>`;
    return `<div class="grab"></div><div class="sh"><button class="x bk" data-act="settings" aria-label="Zurück">${ic('chevron', 20)}</button><div class="ico">${ic('sparkle', 24)}</div><div><h2>Schnellaktionen</h2><p>Leiste oben auf der Startseite · gilt nur für dieses Gerät</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="lab2">IN DER LEISTE · ${list.length}</div>${list.length ? list.map(row).join('') : '<div class="empty">Noch keine Schnellaktionen</div>'}
      ${!has.has('builtin:goodnight') ? `<div class="vr tap" data-act="qadd" data-e="builtin:goodnight"><div class="ico">${ic('moon', 19)}</div><div><div class="t">Gute Nacht</div><div class="s">Lichter aus, offene Fenster melden</div></div><div class="m">${ic('plus', 16)}</div></div>` : ''}
      <div class="lab2">ANPINNEN · ${cand.length}</div>${fchips}${cand.length ? cand.map(add).join('') : '<div class="empty">Alles aus dieser Auswahl ist schon in der Leiste</div>'}
      <div class="lab2">NEUE SZENE AUS DEN AKTUELLEN LICHTERN</div>
      <div class="qnew"><input id="qname" type="text" maxlength="40" placeholder="z. B. Kino-Abend" autocomplete="off"><button class="vbt big on" data-act="qsave">${ic('check', 15)}Speichern</button></div>
      <div class="card-note">Merkt sich alle Lichter, die gerade an sind (Helligkeit &amp; Farbe), und legt sie in Home Assistant als Szene an. Braucht Administrator-Rechte.</div>
      <button class="qb" style="margin-top:12px" data-act="qreset">Standard wiederherstellen</button>`;
  }
  async _sceneSave() {
    const inp = this.shadowRoot.getElementById('qname'), name = (inp?.value || '').trim();
    if (!name) { this._toast('Bitte einen Namen eingeben'); return; }
    const on = this._lightsOn(); if (!on.length) { this._toast('Schalte erst die gewünschten Lichter ein'); return; }
    const ents = {};
    for (const e of on) {
      const a = this._attr(e, 'rgb_color') && this._attr(e, 'color_mode') !== 'color_temp' ? { rgb_color: this._attr(e, 'rgb_color') } : (this._attr(e, 'color_temp_kelvin') ? { color_temp_kelvin: this._attr(e, 'color_temp_kelvin') } : {});
      ents[e] = { state: 'on', ...(this._attr(e, 'brightness') ? { brightness: this._attr(e, 'brightness') } : {}), ...a };
    }
    const id = String(Date.now());
    try {
      await this._h.callApi('POST', 'config/scene/config/' + id, { id, name, entities: ents });
      await this._h.callService('scene', 'reload', {});
      const slug = 'scene.' + name.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      const list = this._quickList(); list.push([slug, name, 'sparkle']); this._quickSave(list);
      this._toast(`Szene „${name}“ gespeichert`); this._sig = ''; this._renderSheet(); this._render();
    } catch (er) { this._toast('Szene konnte nicht gespeichert werden (Administrator-Rechte nötig)', 4200); }
  }

  /* ───────────── v5.2: Luftgeräte (Entfeuchter, Luftreiniger …) ───────────── */
  _airGroups() {
    const ig = this._c.airIgnore || [], keys = this._c.air || Object.keys(this._h.states).filter(k => /^(fan|humidifier)\./.test(k));
    const g = {};
    for (const k of keys) { if (ig.some(x => k.includes(x))) continue; const id = k.split('.')[1]; (g[id] = g[id] || { id, ents: [] }).ents.push(k); }
    return Object.values(g).map(x => {
      const fan = x.ents.find(e => e.startsWith('fan.')), hum = x.ents.find(e => e.startsWith('humidifier.')), main = fan || hum;
      const off = x.ents.every(e => this._val(e) === 'unavailable' || this._val(e) === undefined);
      const rel = Object.keys(this._h.states).filter(k => k.startsWith('sensor.' + x.id + '_') && okv(this._val(k))).slice(0, 4);
      return { ...x, fan, hum, main, off, on: !off && x.ents.some(e => this._val(e) === 'on'), rel, name: this._name(main) };
    }).sort((a, b) => a.off - b.off || a.name.localeCompare(b.name, 'de'));
  }
  _airCard(i) {
    const G = this._airGroups(); if (!G.length) return '';
    const dev = g => {
      const a = g.fan ? this._s(g.fan)?.attributes || {} : {}, ha = g.hum ? this._s(g.hum)?.attributes || {} : {}, pct = a.percentage;
      const modes = (a.preset_modes || []).filter(Boolean);
      const sens = g.rel.map(k => `<span class="vchip">${esc(this._name(k).replace(g.name, '').trim() || this._name(k))} <b>${esc(this._val(k))}${this._unit(k) ? ' ' + esc(this._unit(k)) : ''}</b></span>`).join('');
      return `<div class="adev ${g.off ? 'off' : ''}"><div class="ahd"><div class="ico" style="${g.on ? 'color:#38bdf8;background:rgba(56,189,248,.16)' : ''}">${ic(g.hum && !g.fan ? 'drop' : 'wind', 19)}</div><div><div class="t">${esc(g.name)}</div><div class="s">${g.off ? 'Nicht erreichbar' : g.on ? 'An' : 'Aus'}${g.on && pct != null ? ' · ' + pct + ' %' : ''}${g.on && ha.humidity != null ? ' · Ziel ' + ha.humidity + ' %' : ''}</div></div>${g.off ? '<span class="tag bad">offline</span>' : `<button class="sw ${g.on ? 'on' : ''}" data-act="toggle" data-e="${g.main}" aria-label="Ein/Aus"></button>`}</div>
        ${!g.off && g.on ? `<div class="actl">${g.fan && a.percentage != null ? [33, 66, 100].map(p => `<button class="vbt ${pct != null && Math.abs(pct - p) < 17 ? 'on' : ''}" data-act="fanpct" data-e="${g.fan}" data-p="${p}">${p === 33 ? 'Leise' : p === 66 ? 'Mittel' : 'Stark'}</button>`).join('') : ''}${modes.map(m => `<button class="vbt ${a.preset_mode === m ? 'on' : ''}" data-act="preset" data-e="${g.fan}" data-m="${esc(m)}">${esc(m)}</button>`).join('')}${g.hum && ha.humidity != null ? `<button class="vbt" data-act="hum" data-e="${g.hum}" data-d="-5" aria-label="Weniger">${ic('minus', 12)}</button><span class="vh2" style="align-self:center">Ziel ${ha.humidity} %</span><button class="vbt" data-act="hum" data-e="${g.hum}" data-d="5" aria-label="Mehr">${ic('plus', 12)}</button>` : ''}</div>` : ''}
        ${sens ? `<div class="vchips" style="margin-top:8px">${sens}</div>` : ''}</div>`;
    };
    return `<div class="c" style="margin-top:16px;--i:${i}"><div class="h">${ic('wind', 14)}Luft &amp; Geräte<span class="r">${G.filter(g => g.on).length} an · ${G.length} Geräte</span></div>${G.map(dev).join('')}</div>`;
  }

