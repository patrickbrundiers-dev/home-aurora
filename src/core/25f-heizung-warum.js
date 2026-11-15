  /* ───────────── pz50: „Warum?“ und „Protokoll“ (Dynamische Heizungssteuerung ab 0.21) ─────────────
     Die Integration beantwortet zwei Dienste mit return_response:
       dynamic_heating.why       → { heating, verdict, checks: [{ name, ok: true/false/null, detail }] }
       dynamic_heating.decisions → { room, count, decisions: [{ at, area, mode, text, target, room, outdoor, source }] }
     Das Urteil („Heizt nicht: Fenster – offen“) steht immer im Heizungsfenster; „Warum?“ klappt die Prüfliste auf,
     „Protokoll“ die Entscheidungen der letzten 24 h / 3 / 7 Tage mit Filter nach Bereich. Antworten bleiben eine Minute. */
  _dhPHas() { const S = this._h?.services; return !S || !!S.dynamic_heating?.why; }
  _dhPKey(sid, kind) { const L = this._dhLog || {}; return kind === 'why' ? `why|${sid}` : `log|${sid}|${L.days || 1}|${L.area || ''}`; }
  async _dhPLoad(sid, kind, force) {
    const C = this._dhPc || (this._dhPc = {}), k = this._dhPKey(sid, kind), c = C[k];
    if (c?.busy || (!force && c && Date.now() - c.t < (c.ok ? 6e4 : 3e5))) return;
    C[k] = { ...(c || {}), busy: true, t: c?.t || 0 };
    const L = this._dhLog || {}, data = { entity_id: sid };
    if (kind === 'log') { data.days = L.days || 1; if (L.area) data.area = L.area; }
    let d = null, ok = false;
    try {
      const r = await this._h.callWS({ type: 'call_service', domain: 'dynamic_heating', service: kind === 'why' ? 'why' : 'decisions', service_data: data, return_response: true });
      d = r?.response || {}; ok = true;
    } catch (e) { d = { err: String(e?.message || e?.code || 'unbekannter Fehler') }; }
    C[k] = { t: Date.now(), busy: false, ok, d };
    if (this._sheet?.t === 'heat') this._renderSheet();
  }
  _dhP(sid, kind) { this._dhPLoad(sid, kind); return this._dhPc?.[this._dhPKey(sid, kind)] || null; }
  _dhPAct(a, el) {
    const sh = this._sheet; if (!sh || sh.t !== 'heat') return;
    const r = this._c.rooms.find(x => x.id === sh.id), sid = r?.heat?.status; if (!sid) return;
    if (a === 'dhp') { const m = el.dataset.m; sh.p = sh.p === m ? null : m; if (sh.p) this._dhPLoad(sid, sh.p, true); }
    else if (a === 'dhpre') this._dhPLoad(sid, sh.p || 'why', true);
    else if (a === 'dhpf') {
      const L = this._dhLog || (this._dhLog = {});
      if (el.dataset.k === 'days') L.days = parseFloat(el.dataset.v) || 1; else L.area = el.dataset.v || '';
      this._dhLogN = 40; this._dhPLoad(sid, 'log');
    } else if (a === 'dhpmore') this._dhLogN = (this._dhLogN || 40) + 60;
    this._renderSheet();
  }
  /* kurzes Urteil oben im Heizungsfenster */
  _dhVerdict(sid) {
    if (!this._dhPHas()) return '';
    const w = this._dhP(sid, 'why'), v = w?.ok ? w.d?.verdict : '';
    if (!okv(v) || !v) return '';
    const bad = w.d.heating === false && (w.d.checks || []).some(c => c.ok === false);
    return `<div class="hwhy ${w.d.heating ? 'heat' : bad ? 'bad' : ''}">${ic(w.d.heating ? 'flame' : bad ? 'alert' : 'check', 15)}<span>${esc(String(v))}</span></div>`;
  }
  _dhPanel(sid) {
    if (!this._dhPHas()) return '';
    const p = this._sheet?.p || null;
    const btn = (m, i, l) => `<button class="qb ${p === m ? 'on' : ''}" data-act="dhp" data-m="${m}">${ic(i, 14)}${l}</button>`;
    let body = '';
    if (p) {
      const c = this._dhP(sid, p);
      if (!c || (!c.ok && c.busy)) body = '<div class="sk" style="height:120px"></div>';
      else if (!c.ok) body = `<div class="card-note" style="color:#fb7185">Ging nicht: ${esc(c.d?.err || '')}</div>`;
      else body = p === 'why' ? this._dhWhyHtml(c.d) : this._dhLogHtml(c.d);
      body += `<div class="hbtns"><button class="qb" data-act="dhpre">${ic('refresh', 14)}${p === 'why' ? 'Neu prüfen' : 'Neu laden'}</button></div>`;
    }
    return `<div class="hbtns hwbt">${btn('why', 'search', 'Warum?')}${btn('log', 'list', 'Protokoll')}</div>${p ? `<div class="hwp">${body}</div>` : ''}`;
  }
  _dhWhyHtml(d) {
    const L = Array.isArray(d?.checks) ? d.checks : [];
    if (!L.length) return '<div class="empty">Noch keine Prüfung – die Regelung rechnet gleich.</div>';
    const mk = ok => ok === true ? `<i class="ok">${ic('check', 14)}</i>` : ok === false ? `<i class="no">${ic('close', 14)}</i>` : '<i class="in">·</i>';
    return `<div class="hwl">${L.map(c => `<div class="hwc ${c.ok === false ? 'no' : ''}">${mk(c.ok)}<b>${esc(String(c.name ?? ''))}</b><span>${esc(okv(c.detail) ? String(c.detail) : '')}</span></div>`).join('')}</div>`;
  }
  _dhLogHtml(d) {
    const L = this._dhLog || {}, days = L.days || 1, area = L.area || '';
    const AR = ['Zeitplan', 'Anwesenheit', 'Fenster', 'Wetter', 'Therme', 'Ventile', 'Bedienung', 'Hinweis', 'Störung'];
    const chip = (k, v, l, on) => `<button class="chip ${on ? 'on' : ''}" data-act="dhpf" data-k="${k}" data-v="${esc(String(v))}">${esc(l)}</button>`;
    const f = `<div class="hwf">${[[1, '24 h'], [3, '3 Tage'], [7, '7 Tage']].map(([v, l]) => chip('days', v, l, days === v)).join('')}</div><div class="hwf">${chip('area', '', 'Alle', !area)}${AR.map(a => chip('area', a, a, area === a)).join('')}</div>`;
    const it = Array.isArray(d?.decisions) ? d.decisions : [], n = this._dhLogN || 40;
    if (!it.length) return f + '<div class="empty">Keine Einträge in dieser Zeit.</div>';
    const n1 = (v, s) => { const x = parseFloat(v); return isNaN(x) ? null : s + ' ' + de(x, 1) + ' °C'; };
    let last = '';
    const rows = it.slice(0, n).map(x => {
      const t = new Date(x.at), ok = !isNaN(t), day = ok ? t.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
      const head = day && day !== last ? `<div class="hwd">${esc(day)}</div>` : ''; if (day) last = day;
      const meta = [okv(x.area) ? x.area : '', n1(x.target, 'Soll'), n1(x.room, 'Raum'), n1(x.outdoor, 'außen'), okv(x.source) ? 'durch ' + x.source : ''].filter(Boolean).map(s => esc(String(s))).join(' · ');
      return `${head}<div class="hwe"><em>${ok ? hhmm(t) : ''}</em><div><div>${esc(okv(x.text) ? String(x.text) : '')}</div>${meta ? `<small>${meta}</small>` : ''}</div></div>`;
    }).join('');
    return f + `<div class="hwl">${rows}</div>` + (it.length > n ? `<div class="hbtns"><button class="qb" data-act="dhpmore">${ic('chevron', 14)}Weitere ${it.length - n}</button></div>` : '');
  }
  /* Hinweise aus den neuen Attributen des Status-Sensors (wenn die Integration sie liefert) */
  _dhNew(a) {
    const out = [], note = (c, s) => `<div class="card-note" style="color:${c}">${esc(s)}</div>`;
    if (a.heating_limit_lifted === 'heat_today') out.push(note('#fbbf24', 'Heizgrenze aufgehoben: „Heute heizen“ ist an'));
    else if (a.heating_limit_lifted === 'cold_snap') out.push(note('#38bdf8', 'Kälteeinbruch – die Heizgrenze gilt gerade nicht'));
    const fr = parseFloat(a.frost_night);
    if (!isNaN(fr)) out.push(note('#38bdf8', `Frostnacht erwartet (${de(fr, 0)} °C) – nachts nur halb abgesenkt`));
    const obj = v => (v && typeof v === 'object' && !Array.isArray(v) ? Object.entries(v) : []);
    for (const [k, v] of obj(a.contact_problems)) out.push(note('#fb7185', `Fensterkontakt ${k}: ${v}`));
    for (const [k, v] of obj(a.valve_own_state)) out.push(note('#fb7185', `${this._name(k)} stellt sich selbst: ${v}`));
    return out.join('');
  }
  _facadeTxt(f) { return { n: 'Nord', no: 'Nordost', o: 'Ost', so: 'Südost', s: 'Süd', sw: 'Südwest', w: 'West', nw: 'Nordwest' }[String(f || '').toLowerCase()] || ''; }
