  /* ───────────── pz45: Aufgaben & Punkte (Integration ChoreOps) ───────────── */
  /* ChoreOps legt pro Person einen Sensor „… UI-Dashboard-Helfer“ an (Attribut purpose = purpose_dashboard_helper) mit
     Aufgaben, Strafen und Punkte-Knöpfen. Pro Aufgabe gibt es einen Status-Sensor mit den Knöpfen zum Erledigen (claim),
     Genehmigen und Ablehnen. Das Dashboard drückt nur diese Knöpfe; Punkte rechnet ChoreOps selbst.
     YAML: chores: { users: ['Leonie', 'Nele', 'Lisa'] } legt Reihenfolge und Auswahl fest (leer = alle). aufgaben: false blendet aus. */
  _choC() { return this._c.chores || {}; }
  _choKeys() {
    const h = this._h, now = Date.now();
    if (this._choK && now - this._choKT < 6e4 && this._choK.every(k => k in h.states)) return this._choK;
    const l = [];
    for (const k in h.states) if (k.startsWith('sensor.') && k.includes('choreops') && h.states[k].attributes?.purpose === 'purpose_dashboard_helper') l.push(k);
    this._choK = l; this._choKT = now;
    return l;
  }
  _choUsers() {
    return this._memo('cho', () => {
      const want = (this._choC().users || []).map(n => String(n).toLowerCase());
      const U = [];
      for (const k of this._choKeys()) {
        const a = this._s(k)?.attributes || {}, name = a.user_name; if (!name) continue;
        if (want.length && !want.includes(String(name).toLowerCase())) continue;
        const pe = a.core_sensors?.points_eid, pts = this._num(pe);
        const ch = (a.chores || []).map(c => {
          const s = this._s(c.eid); if (!s) return null;
          const x = s.attributes || {};
          return { eid: c.eid, name: c.name || x.chore_name || '', st: s.state, grp: c.primary_group || '', pts: parseFloat(x.default_points) || 0, due: x.due_date || '', icon: x.icon || '', turn: x.turn_user_name || '', freq: x.recurring_frequency || '', desc: x.description || '', claim: x.claim_button_eid, ok: x.approve_button_eid, no: x.disapprove_button_eid, canClaim: x.can_claim !== false, canOk: x.can_approve !== false, at: x.last_approved || '' };
        }).filter(Boolean);
        const rw = (a.rewards || []).map(r => {
          const x = this._s(r.eid)?.attributes || {}, st = this._val(r.eid) || r.status || '';
          return { eid: r.eid, name: r.name || x.reward_name || '', cost: parseFloat(r.cost ?? x.cost) || 0, st, icon: x.icon || '', desc: x.description || '', claim: x.claim_button_eid, ok: x.approve_button_eid, no: x.disapprove_button_eid, wait: (parseInt(x.pending_claims, 10) || 0) > 0 || /^(claimed|pending)$/.test(st) };
        }).filter(r => r.eid && r.name).sort((p, q) => p.cost - q.cost || p.name.localeCompare(q.name, 'de'));
        U.push({ name, key: k, pts, ch, rw, pen: (a.penalties || []).filter(p => p && p.eid), pb: (a.points_buttons || []).filter(p => p && p.eid), paused: !!a.chores_paused });
      }
      if (want.length) U.sort((a, b) => want.indexOf(a.name.toLowerCase()) - want.indexOf(b.name.toLowerCase()));
      return U;
    });
  }
  _choOk() { return this._choUsers().length > 0; }
  _choOn() { return this._chsPref != null ? this._chsPref === '1' : this._c?.aufgaben !== false; }
  /* Was heute dran ist: fällig/überfällig/wartend oder von ChoreOps unter „heute“ einsortiert; erledigt zählt mit */
  _choToday(c) {
    if (['overdue', 'due', 'claimed'].includes(c.st)) return true;
    if (c.st === 'not_my_turn' || c.st === 'completed_by_other') return false;
    if (c.grp === 'today') return true;
    const d = Date.parse(c.due); if (!isNaN(d)) { const e = new Date(); e.setHours(23, 59, 59, 999); if (d <= +e) return true; }
    return false;
  }
  _choDone(c) { return c.st === 'approved' || c.st === 'completed'; }
  _choSum() {
    return this._memo('chosum', () => {
      const U = this._choUsers().map(u => { const T = u.ch.filter(c => this._choToday(c)); return { ...u, T, open: T.filter(c => !this._choDone(c) && c.st !== 'claimed').length, wait: u.ch.filter(c => c.st === 'claimed').length + u.rw.filter(r => r.wait).length, late: T.filter(c => c.st === 'overdue').length }; });
      return { U, open: U.reduce((a, u) => a + u.open, 0), wait: U.reduce((a, u) => a + u.wait, 0) };
    });
  }
  _choLab(c) {
    const t = Date.parse(c.due), when = !isNaN(t) ? (new Date(t).toDateString() === new Date().toDateString() ? 'bis ' + hhmm(c.due) + ' Uhr' : new Date(t).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' }) + ', ' + hhmm(c.due)) : '';
    return { pending: when ? 'Offen · ' + when : 'Offen', due: 'Jetzt fällig' + (when ? ' · ' + when : ''), overdue: 'Überfällig', claimed: 'Wartet auf OK', approved: 'Erledigt', completed: 'Erledigt', not_my_turn: c.turn ? c.turn + ' ist dran' : 'Nicht dran', completed_by_other: 'Schon erledigt', missed: 'Verpasst' }[c.st] || c.st;
  }
  /* mdi-Icon der Aufgabe auf die eigenen Strich-Icons abbilden */
  _choIco(c) {
    const s = (c.icon + ' ' + c.name).toLowerCase();
    const M = [[/bed|bett/, 'bed'], [/dish|spül/, 'dishwasher'], [/silverware|tisch decken|fork/, 'cook'], [/table|tisch/, 'table'], [/trash|müll/, 'trash'], [/water|gieß|pflanz/, 'flower'], [/tooth|zähne/, 'sparkle'], [/basket|wäsche/, 'washer'], [/toy|brick|spielzeug/, 'brick'], [/bag|ranzen|schule/, 'backpack'], [/book|hausaufgab/, 'list'], [/broom|aufräum|zimmer/, 'broom'], [/dog|gassi|hund/, 'shoe'], [/vacuum|saug/, 'vacuum']];
    return (M.find(m => m[0].test(s)) || [0, 'check'])[1];
  }
  _rwIco(r) {
    const s = (r.icon + ' ' + r.name).toLowerCase();
    const M = [[/cellphone|tablet|handy|bildschirm/, 'phone'], [/ice|eis|süß|candy/, 'heart'], [/food|essen/, 'cook'], [/movie|film/, 'tv'], [/night|bett/, 'moon'], [/piggy|geld|€/, 'cart'], [/ticket|ausflug|kino/, 'star']];
    return (M.find(m => m[0].test(s)) || [0, 'sparkle'])[1];
  }
  _rwHtml(u, busy) {
    if (!u.rw.length) return '';
    const card = r => {
      const have = u.pts ?? 0, ok = have >= r.cost, pct = r.cost ? Math.min(100, Math.round(100 * have / r.cost)) : 100;
      let act;
      if (r.wait) act = `<div class="rwda"><button class="chb no" data-act="chono" data-e="${esc(r.no || '')}" aria-label="${esc(r.name)} ablehnen" ${busy ? 'disabled' : ''}>${ic('close', 16)}</button><button class="chb ok" data-act="rwok" data-e="${esc(r.ok || '')}" ${busy ? 'disabled' : ''}>${ic('check', 16)} OK</button></div>`;
      else if (ok && r.claim) act = `<button class="chb go${this._choArm === r.claim ? ' arm' : ''}" data-act="rwclaim" data-e="${esc(r.claim)}" data-n="${esc(r.name)}" ${busy ? 'disabled' : ''}>${this._choArm === r.claim ? 'Wirklich einlösen?' : ic('star', 15) + ' Einlösen'}</button>`;
      else act = `<span class="rwdn">noch ${de(r.cost - have, 0)} ⭐</span>`;
      return `<div class="rwd${r.wait ? ' wait' : ok ? ' ok' : ''}"><div class="rwdt"><div class="ico">${ic(this._rwIco(r), 18)}</div><div class="tx"><div class="t">${esc(r.name)}</div><div class="s">${r.wait ? 'Wartet auf OK' : '⭐ ' + de(r.cost, 0)}</div></div></div><div class="rwdb"><i style="width:${pct}%"></i></div>${act}</div>`;
    };
    return `<div class="lab2">BELOHNUNGEN · ⭐ ${u.pts != null ? de(u.pts, 0) : '–'} GESAMMELT</div><div class="rwdg">${u.rw.map(card).join('')}</div>`;
  }
  _choRow() {
    if (!this._choOn() || !this._choOk()) return '';
    const S = this._choSum();
    const sub = S.wait ? `${S.wait} ${S.wait === 1 ? 'wartet' : 'warten'} auf OK` : S.open ? `${S.open} heute offen` : 'Heute alles erledigt';
    const pts = S.U.filter(u => u.pts != null).slice(0, 4).map(u => `${esc(u.name)} ${de(u.pts, 0)}`).join(' · ');
    return `<button class="xr" data-act="cho"><div class="ico" ${S.wait ? 'style="background:rgba(251,191,36,.18);color:#fcd34d"' : ''}>${ic('star', 19)}</div><div><div class="t">Aufgaben &amp; Punkte</div><div class="s">${sub}${pts ? ' · ⭐ ' + pts : ''}</div></div>${S.wait ? '<span class="kdot lk" style="background:#fbbf24;box-shadow:0 0 10px rgba(251,191,36,.6)"></span>' : ''}</button>`;
  }
  _choTb() {
    if (!this._choOn() || !this._choOk()) return '';
    const S = this._choSum();
    return `<button class="tb${S.wait ? ' on' : ''}" data-act="cho" aria-label="Aufgaben und Punkte">${ic('star', 15)}<span>${S.wait ? S.wait + ' warten auf OK' : S.open ? 'Aufgaben · ' + S.open + ' offen' : 'Aufgaben'}</span></button>`;
  }
  _sCho() {
    const head = p => `<div class="grab"></div><div class="sh"><div class="ico">${ic('star', 24)}</div><div><h2>Aufgaben &amp; Punkte</h2><p>${p}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    const S = this._choSum();
    if (!S.U.length) return head('Nicht verfügbar') + '<div class="empty">Keine Personen in ChoreOps gefunden. Ist die Integration geladen?</div>';
    const u = S.U.find(x => x.name === this._choSel) || S.U.find(x => x.wait) || S.U[0];
    const tabs = `<div class="chu">${S.U.map(x => `<button class="${x === u ? 'on' : ''}" data-act="chou" data-u="${esc(x.name)}"><b>${esc(x.name)}</b><span>⭐ ${x.pts != null ? de(x.pts, 0) : '–'}</span>${x.wait ? `<i class="w">${x.wait}</i>` : x.open ? `<i>${x.open}</i>` : ''}</button>`).join('')}</div>`;
    const busy = this._choBusy || '';
    const row = c => {
      const done = this._choDone(c), cl = c.st === 'claimed', late = c.st === 'overdue', off = c.st === 'not_my_turn' || c.st === 'completed_by_other';
      let act = '';
      if (cl) act = `<button class="chb no" data-act="chono" data-e="${esc(c.no || '')}" aria-label="${esc(c.name)} ablehnen" ${busy ? 'disabled' : ''}>${ic('close', 16)}</button><button class="chb ok" data-act="chook" data-e="${esc(c.ok || '')}" ${busy ? 'disabled' : ''}>${ic('check', 16)} OK</button>`;
      else if (!done && !off && c.claim && c.canClaim) act = `<button class="chb go" data-act="choclaim" data-e="${esc(c.claim)}" ${busy ? 'disabled' : ''}>${ic('check', 16)} Erledigt</button>`;
      else if (done) act = `<span class="chd">${ic('check', 16)}</span>`;
      return `<div class="chr${done ? ' dn' : ''}${late ? ' late' : ''}${cl ? ' wait' : ''}${off ? ' off' : ''}"><div class="ico">${ic(this._choIco(c), 18)}</div><div class="tx"><div class="t">${esc(c.name)}</div><div class="s">${esc(this._choLab(c))}</div></div><span class="chp">+${de(c.pts, 0)}</span>${act}</div>`;
    };
    const T = u.ch.filter(c => this._choToday(c)), L = u.ch.filter(c => !T.includes(c) && c.st !== 'not_my_turn' && c.st !== 'completed_by_other'), O = u.ch.filter(c => c.st === 'not_my_turn' || c.st === 'completed_by_other');
    const ord = c => ({ claimed: 0, overdue: 1, due: 2, pending: 3 }[c.st] ?? 5);
    T.sort((a, b) => ord(a) - ord(b) || String(a.due).localeCompare(String(b.due)));
    L.sort((a, b) => String(a.due).localeCompare(String(b.due)));
    const doneT = T.filter(c => this._choDone(c)).length;
    const pen = u.pen.slice().sort((a, b) => (a.points || 0) - (b.points || 0) || String(a.name).localeCompare(String(b.name), 'de'));
    const plus = u.pb.filter(p => /\+/.test(p.name || '')), minus = u.pb.filter(p => /-/.test(p.name || ''));
    const pbt = p => { const v = String(p.name || '').replace(/^\D*/, '').replace(/\.0$/, ''); return `<button data-act="chopt" data-e="${esc(p.eid)}" ${busy ? 'disabled' : ''}>${/-/.test(p.name || '') ? '−' : '+'}${esc(v.replace(/^[-+]/, ''))}</button>`; };
    return head(`${esc(u.name)} · ⭐ ${u.pts != null ? de(u.pts, 0) + ' Punkte' : '–'}${u.paused ? ' · pausiert' : ''}`) + tabs
      + `<div class="lab2">HEUTE · ${doneT} VON ${T.length} ERLEDIGT</div>`
      + (T.length ? `<div class="pzbar chbar"><i style="width:${T.length ? Math.round(100 * doneT / T.length) : 0}%"></i></div>${T.map(row).join('')}` : '<div class="empty sm">Heute nichts zu tun 🎉</div>')
      + (L.length ? `<div class="lab2">DEMNÄCHST · ${L.length}</div>${L.map(row).join('')}` : '')
      + (O.length ? `<div class="lab2">ANDERE SIND DRAN · ${O.length}</div>${O.map(row).join('')}` : '')
      + this._rwHtml(u, busy)
      + (pen.length ? `<div class="lab2">STRAFE GEBEN · zweimal tippen</div><div class="chpen">${pen.map(p => `<button class="${this._choArm === p.eid ? 'arm' : ''}" data-act="chopen" data-e="${esc(p.eid)}" data-n="${esc(p.name)}" ${busy ? 'disabled' : ''}><b>${de(p.points, 0)}</b><span>${this._choArm === p.eid ? 'Wirklich?' : esc(p.name)}</span></button>`).join('')}</div>` : '')
      + (plus.length || minus.length ? `<div class="lab2">PUNKTE VON HAND</div><div class="chpts">${minus.map(pbt).join('')}<span>⭐ ${u.pts != null ? de(u.pts, 0) : '–'}</span>${plus.map(pbt).join('')}</div>` : '')
      + `<div class="card-note">„Erledigt“ meldet die Aufgabe, mit „OK“ gibt es die Punkte. Eingelöste Belohnungen ziehen die Punkte erst nach „OK“ ab. Aufgaben, Strafen und Belohnungen werden in Home Assistant unter ChoreOps verwaltet.</div>`;
  }
  async _choPress(e, msg) {
    if (!e || this._choBusy) return;
    this._choBusy = e; this._renderSheet();
    try { await this._h.callService('button', 'press', { entity_id: e }); if (msg) this._toast(msg); }
    catch (er) { this._toast('Ging nicht: ' + (er?.message || 'Fehler'), 4200); }
    this._choBusy = ''; this._renderSheet();
  }
  _choAct(a, el) {
    const e = el.dataset.e;
    switch (a) {
      case 'cho': this._sheet = { t: 'cho' }; this._choArm = ''; if (el.dataset.u) this._choSel = el.dataset.u; this._renderSheet(); break;
      case 'chou': this._choSel = el.dataset.u; this._choArm = ''; this._renderSheet(); this._sh.scrollTop = 0; break;
      case 'choclaim': this._choPress(e, 'Gemeldet · wartet auf OK'); break;
      case 'chook': this._choPress(e, 'Punkte gutgeschrieben ⭐'); break;
      case 'chono': this._choPress(e, 'Abgelehnt'); break;
      case 'chopt': this._choPress(e); break;
      case 'rwok': this._choPress(e, 'Belohnung genehmigt 🎁'); break;
      case 'rwclaim':
        if (this._choArm !== e) { this._choArm = e; this._renderSheet(); clearTimeout(this._choAt); this._choAt = setTimeout(() => { this._choArm = ''; if (this._sheet?.t === 'cho') this._renderSheet(); }, 3000); break; }
        this._choArm = ''; clearTimeout(this._choAt); this._choPress(e, `${el.dataset.n} eingelöst · wartet auf OK`); break;
      case 'chopen':
        if (this._choArm !== e) { this._choArm = e; this._renderSheet(); clearTimeout(this._choAt); this._choAt = setTimeout(() => { this._choArm = ''; if (this._sheet?.t === 'cho') this._renderSheet(); }, 3000); break; }
        this._choArm = ''; clearTimeout(this._choAt); this._choPress(e, `Strafe: ${el.dataset.n}`); break;
    }
  }
