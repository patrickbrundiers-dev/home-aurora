  /* ───────────── v10: Putzplan (Integration „putzplan“) ───────────── */
  _pzTasks() { return this._memo('pz', () => this._pzTasks0()); }
  _pzTasks0() {
    const st = this._h.states, out = [];
    for (const e in st) {
      const s = st[e], a = s.attributes || {};
      if (!a.putzplan_task || !e.startsWith('sensor.')) continue;
      const n = x => (x == null || x === '' || isNaN(Number(x))) ? null : Number(x);
      let t = { e, name: a.task_name || a.friendly_name || e, room: a.room || 'Allgemein', st: s.state, iv: n(a.interval_days), since: n(a.days_since_done), until: n(a.days_until_due), over: n(a.days_overdue) || 0, today: !!a.done_today, mdi: String(a.icon || '').replace(/^mdi:/, ''), lu: s.last_updated };
      /* sofort anzeigen, bevor Home Assistant antwortet; verschwindet, sobald der echte Zustand da ist (oder nach 8 s) */
      const o = this._pzO && this._pzO[e];
      if (o) {
        if (o.lu !== s.last_updated || Date.now() - o.t > 8000) delete this._pzO[e];
        else if (o.k === 'done') t = Object.assign(t, { today: true, st: 'ok', over: 0, since: 0, until: t.iv });
        else if (o.k === 'undo' && o.prev) t = Object.assign(t, o.prev, { today: false });
      }
      out.push(t);
    }
    return out;
  }
  _pzRank(t) { return t.st === 'overdue' ? 0 : t.st === 'due_soon' ? 1 : t.st === 'unknown' ? 2 : t.st === 'ok' ? 3 : 4; }
  _pzSum() {
    const T = this._pzTasks(), over = T.filter(t => t.st === 'overdue'), soon = T.filter(t => t.st === 'due_soon');
    return { T, over, soon, never: T.filter(t => t.st === 'unknown').length };
  }
  _pzIv(iv) {
    if (!iv) return '';
    const M = { 1: 'täglich', 2: 'alle 2 Tage', 7: 'wöchentlich', 14: 'alle 2 Wochen', 21: 'alle 3 Wochen', 28: 'alle 4 Wochen', 30: 'monatlich', 31: 'monatlich', 60: 'alle 2 Monate', 90: 'vierteljährlich', 91: 'vierteljährlich', 92: 'vierteljährlich', 180: 'halbjährlich', 182: 'halbjährlich', 183: 'halbjährlich', 365: 'jährlich', 366: 'jährlich' };
    return M[iv] || (iv % 7 === 0 && iv <= 56 ? `alle ${iv / 7} Wochen` : `alle ${iv} Tage`);
  }
  _pzIcon(t) {
    const M = { 'mop': 'mop', 'window-closed-variant': 'window', 'window-frame': 'window', 'window-open-variant': 'window', 'robot-vacuum': 'robovac', 'vacuum': 'vacuum', 'washing-machine': 'washer', 'countertop': 'counter', 'sponge': 'sponge', 'bed-empty': 'bed', 'bed': 'bed', 'bed-double-outline': 'bed', 'bed-double': 'bed', 'dishwasher': 'dishwasher', 'air-filter': 'filter', 'shower': 'shower', 'shower-head': 'shower', 'fridge-outline': 'fridge', 'fridge': 'fridge', 'door': 'door', 'door-sliding': 'door', 'spray-bottle': 'spray', 'spray': 'spray', 'toilet': 'toilet', 'faucet': 'faucet', 'sink': 'faucet', 'coffee-maker': 'coffee', 'stove': 'stove', 'hand-wash-outline': 'handwash', 'hand-wash': 'handwash', 'range-hood': 'hood', 'rug': 'rug', 'trash-can-outline': 'trash', 'trash-can': 'trash', 'kettle': 'kettle', 'cupboard-outline': 'cupboard', 'cupboard': 'cupboard', 'snowflake': 'snow', 'mirror': 'mirror', 'pipe': 'drain', 'curtains': 'curtains', 'wall': 'wall', 'sofa': 'sofa', 'radiator': 'radiator', 'wardrobe-outline': 'wardrobe', 'light-switch': 'lswitch', 'shoe-print': 'shoe', 'teddy-bear': 'teddy', 'toy-brick-outline': 'brick', 'bag-personal-outline': 'backpack', 'table-furniture': 'table', 'microwave': 'microwave', 'toaster': 'toaster', 'water-check': 'waterfilter', 'broom': 'broom' };
    const n = t.name.toLowerCase();
    if (/ölen|schmieren/.test(n)) return 'wrench';
    if (/dichtung|gummi/.test(n)) return 'sponge';
    if (M[t.mdi] && ICONS[M[t.mdi]]) return M[t.mdi];
    const R = [
      [/fenster|glas|rahmen/, 'window'], [/schwamm/, 'sponge'], [/lappen|tücher|handtuch|bademat/, 'cloth'], [/toilette/, 'toilet'],
      [/dusch/, 'shower'], [/wanne|bad(?!ezimmer)/, 'bath'], [/abfluss|siphon/, 'drain'], [/spiegel/, 'mirror'], [/perlator|armatur|spüle|waschbecken|wasserhahn/, 'faucet'],
      [/gefrier|kühl|eis/, 'fridge'], [/herd|kochfeld|backofen|ofen/, 'stove'], [/dunst|fett/, 'hood'], [/mikrowelle/, 'microwave'], [/toaster/, 'toaster'],
      [/kaffee/, 'coffee'], [/wasserkocher/, 'kettle'], [/spülmaschine/, 'dishwasher'], [/waschmaschine|wäsche|hygienewasch/, 'washer'], [/wasserfilter|kartusche/, 'waterfilter'],
      [/filter|flusen/, 'filter'], [/staubsauger|saugen|absaugen/, 'vacuum'], [/wischen|boden|flur|eingang/, 'mop'], [/bett|matratze|kissen|decke/, 'bed'],
      [/teppich/, 'rug'], [/gardine|vorhang/, 'curtains'], [/heizkörper/, 'radiator'], [/kleiderschrank/, 'wardrobe'], [/schrank/, 'cupboard'],
      [/klinke|lichtschalter/, 'lswitch'], [/tür|balkontür/, 'door'], [/kuscheltier/, 'teddy'], [/spielzeug/, 'brick'], [/schulranzen|ranzen/, 'backpack'],
      [/möbel|tisch/, 'table'], [/polster|sofa/, 'sofa'], [/müll|eimer/, 'trash'], [/fugen|silikon|wand/, 'wall'], [/spray|desinfekt/, 'spray']
    ];
    for (const [re, k] of R) if (re.test(n) && ICONS[k]) return k;
    return 'broom';
  }
  _pzSub(t) {
    const iv = this._pzIv(t.iv), tail = iv ? ' · ' + iv : '', d = (n, one, many) => `${n} ${n === 1 ? one : many}`;
    if (t.today) return 'Heute erledigt' + tail;
    if (t.st === 'overdue') return `Überfällig seit ${d(t.over, 'Tag', 'Tagen')}` + tail;
    if (t.st === 'due_soon') return (t.until === 0 ? 'Heute fällig' : t.until === 1 ? 'Morgen fällig' : `In ${t.until} Tagen fällig`) + tail;
    if (t.st === 'ok') return (t.until != null ? `In ${d(t.until, 'Tag', 'Tagen')} fällig` : 'Erledigt') + tail;
    if (t.st === 'as_needed') return 'Bei Bedarf' + (t.since != null ? ` · zuletzt vor ${d(t.since, 'Tag', 'Tagen')}` : '');
    return iv ? iv.charAt(0).toUpperCase() + iv.slice(1) : 'Ohne Intervall';
  }
  _pzIso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  /* verteilt alle Aufgaben ohne Startdatum so auf die nächsten Wochen, dass pro Tag nur wenige dran sind */
  _pzPlan() {
    const U = this._pzTasks().filter(t => t.st === 'unknown' && t.iv).sort((a, b) => a.iv - b.iv || a.name.localeCompare(b.name, 'de'));
    const H = 120, load = new Array(H).fill(0), now = new Date(), res = [];
    for (const t of U) {
      const span = Math.min(t.iv, 42); let best = 0, bl = 1e9;
      for (let o = 0; o < span; o++) {
        let l = 0; for (let d = o; d < H; d += t.iv) l = Math.max(l, load[d]);
        l += o === 0 ? 0.4 : 0;
        if (l < bl) { bl = l; best = o; }
      }
      for (let d = best; d < H; d += t.iv) load[d]++;
      const last = new Date(now.getFullYear(), now.getMonth(), now.getDate() - t.iv + best);
      res.push({ e: t.e, o: best, last: this._pzIso(last) });
    }
    return res;
  }
  async _pzStart() {
    const P = this._pzPlan(), g = {};
    for (const p of P) (g[p.last] = g[p.last] || []).push(p.e);
    const st = this._pzSt(); if (st) { st.cf = false; st.f = 'today'; }
    try { await Promise.all(Object.keys(g).map(d => this._h.callService('putzplan', 'update_task', { entity_id: g[d], last_done: d }))); } catch (err) { this._toast('Start fehlgeschlagen'); return; }
    const t0 = P.filter(p => p.o === 0).length;
    this._toast(`Plan gestartet · heute ${t0} ${t0 === 1 ? 'Aufgabe' : 'Aufgaben'}`, 3500); this._pzRefresh();
  }
  _cleanRows() {
    const S = this._pzSum(); if (!S.T.length || WALL_UI || !this._pzOn() || this._pzCard(0, 5)) return [];
    return [`<button class="xr kid" data-act="pz"><div class="ico">${ic('broom', 19)}</div><div><div class="t">Putzplan</div><div class="s">Alles sauber</div></div><span class="kdot ok"></span></button>`];
  }
  /* Karte „Heute putzen“ für die Startseite (n = max. Zeilen) */
  _pzCard(i, n, fit = 0) {
    const S = this._pzSum(); if (!S.T.length || !this._pzOn()) return '';
    const sched = S.T.filter(t => t.st !== 'as_needed'), U = S.T.filter(t => t.st === 'unknown');
    if (U.length && U.length === sched.length) return `<button class="c pzc pzfresh tap" style="--i:${i}" data-act="pz"><div class="ico">${ic('broom', 20)}</div><div><div class="t">Putzplan · noch nicht gestartet</div><div class="s">${U.length} Aufgaben – jetzt auf die Wochen verteilen</div></div><span class="pzv">${ic('chevron', 16)}</span></button>`;
    const due = S.T.filter(t => !t.today && (t.st === 'overdue' || (t.st === 'due_soon' && t.until === 0))).sort((a, b) => b.over - a.over || a.room.localeCompare(b.room, 'de') || a.name.localeCompare(b.name, 'de'));
    const done = S.T.filter(t => t.today).length, tot = due.length + done;
    if (!tot) return '';
    if (!due.length) return `<button class="c pzc pzfresh tap" style="--i:${i}" data-act="pz"><div class="ico ok">${ic('check', 20)}</div><div><div class="t">Heute alles geputzt</div><div class="s">${done} ${done === 1 ? 'Aufgabe' : 'Aufgaben'} erledigt</div></div><span class="pzv">${ic('chevron', 16)}</span></button>`;
    const rows = due.slice(0, n + fit).map((t, k) => `<div class="pzr ${t.st === 'overdue' ? 'o' : 'd'}${k >= n ? ' fi fh" data-fp="1' : ''}" data-sw="${esc(t.e)}"><div class="ico">${ic(this._pzIcon(t), 18)}</div><div><div class="t">${esc(t.name)}</div><div class="s">${esc(t.st === 'overdue' ? 'Überfällig seit ' + t.over + (t.over === 1 ? ' Tag' : ' Tagen') + ' · ' + t.room : t.room + (t.iv ? ' · ' + this._pzIv(t.iv) : ''))}</div></div><button class="pzb2" data-act="pzdone" data-e="${esc(t.e)}" aria-label="Erledigt">${ic('check', 18)}</button></div>`).join('');
    const more = due.length - rows.split('class="pzr ').length + 1;
    return `<div class="c pzc fix" style="--i:${i}"><div class="h">${ic('broom', 14)}Heute putzen<span class="r">${done} von ${tot} erledigt</span></div><div class="pzbar"><i style="width:${Math.round(100 * done / tot)}%"></i></div>${rows}<button class="pzmore" data-act="pz"><span class="fm" data-n="${more}">${more > 0 ? '+ ' + more + ' weitere · ' : ''}</span>Putzplan öffnen<span class="pzv">${ic('chevron', 14)}</span></button></div>`;
  }
  _cleanAlerts() { return []; }
  _pzSt() { return this._sheet && this._sheet.t === 'clean' ? this._sheet : this._v === 'clean' ? (this._pzp = this._pzp || {}) : null; }
  _pzRefresh() {
    const pq = this.shadowRoot.getElementById('pzq'), foc = pq && this.shadowRoot.activeElement === pq, pos = pq ? pq.selectionStart : 0;
    if (this._sheet && this._sheet.t === 'clean') this._renderSheet(); else { this._sig = ''; this._render(); }
    if (foc) { const p2 = this.shadowRoot.getElementById('pzq'); if (p2) { p2.focus(); try { p2.setSelectionRange(pos, pos); } catch (x) { } } }
  }
  /* Putzplan als eigene Ansicht (Standard) oder als Fenster; pro Gerät umschaltbar, Vorgabe per YAML putzplan_view: false */
  /* Putzplan auf dem Dashboard zeigen oder ganz ausblenden; pro Gerät umschaltbar, Vorgabe per YAML putzplan: false */
  _pzOn() { return this._pzsPref != null ? this._pzsPref === '1' : this._c?.putzplan !== false; }
  _pzView() { return this._pzvPref != null ? this._pzvPref === '1' : this._c?.putzplan_view !== false; }
  _sClean() {
    const S = this._pzSum(), T = S.T;
    const head = `<div class="grab"></div><div class="sh"><div class="ico">${ic('broom', 24)}</div><div><h2>Putzplan</h2><p>${T.length} Aufgaben${S.over.length ? ' · ' + S.over.length + ' überfällig' : ''}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!T.length) return head + '<div class="empty">Keine Putzplan-Aufgaben gefunden. Ist die Integration „Putzplan“ geladen?</div>';
    return head + this._cleanBody(this._sheet);
  }
  _vClean() {
    const S = this._pzSum(), T = S.T;
    const h = `<div class="vh"><div><h1>Putzplan</h1><p>${T.length} Aufgaben${S.over.length ? ' · ' + S.over.length + ' überfällig' : ''}</p></div><button class="vbt big pzhome" data-act="nav" data-v="home">${ic('chevron', 15)}<span>Zurück</span></button></div>`;
    if (!T.length) return h + '<div class="empty">Keine Putzplan-Aufgaben gefunden. Ist die Integration „Putzplan“ geladen?</div>';
    return h + `<div class="pzpage">${this._cleanBody(this._pzSt())}</div>`;
  }
  _cleanBody(st) {
    const S = this._pzSum(), T = S.T, f = st.f || 'today', q = (st.q || '').trim().toLowerCase();
    const sched = T.filter(t => t.st !== 'as_needed'), U = T.filter(t => t.st === 'unknown'), fresh = U.length > 0 && U.length === sched.length;
    const plan = U.length ? this._pzPlan() : [], p0 = plan.filter(p => p.o === 0).length, p7 = plan.filter(p => p.o < 7).length;
    const tone = fresh ? 'hot' : S.over.length ? 'hot' : S.soon.length ? 'warn' : 'live';
    const h1 = fresh ? 'Noch nicht gestartet' : S.over.length ? S.over.length + ' überfällig' : S.soon.length ? S.soon.length + ' bald fällig' : U.length ? 'Nichts fällig' : 'Alles sauber';
    const h2 = fresh ? `${U.length} Aufgaben ohne Startdatum` : `${S.soon.length && S.over.length ? S.soon.length + ' weitere bald fällig · ' : ''}${U.length ? U.length + ' ohne Startdatum · ' : ''}${T.length} Aufgaben`;
    const status = `<div class="vst ${tone}"><div class="vsi">${ic(fresh ? 'play' : S.over.length ? 'alert' : 'check', 26)}</div><div class="vsx"><div class="vkick">STATUS</div><div class="vh1">${h1}</div><div class="vh2">${h2}</div></div></div>`;
    let go = '';
    if (U.length) {
      go = st.cf
        ? `<div class="pzcf"><div class="pzct">Aufgaben verteilen?</div><div class="pzcs">${U.length} Aufgaben ohne Startdatum werden auf die nächsten Wochen verteilt: heute ${p0}, in den nächsten 7 Tagen ${p7}. Pro Aufgabe lässt sich das später mit „Rückgängig“ zurücknehmen.</div><div class="pzcb"><button class="vbt pzgo" data-act="pzgo">Jetzt starten</button><button class="vbt" data-act="pzcancel">Abbrechen</button></div></div>`
        : `<button class="vbt pzgo pzgo1" data-act="pzstart">${ic('play', 16)}<span>${fresh ? 'Plan starten' : U.length + ' Aufgaben ohne Startdatum verteilen'}</span></button>`;
    }
    const isToday = t => t.today || t.st === 'overdue' || (t.st === 'due_soon' && t.until === 0);
    const nToday = T.filter(t => !t.today && isToday(t)).length;
    const chips = `<div class="qfl" style="margin-top:12px">${[['today', 'Heute'], ['due', 'Fällig'], ['all', 'Alle']].map(x => `<button class="qfc ${x[0] === f && !q ? 'on' : ''}" data-act="pzf" data-e="${x[0]}"${x[0] === 'today' ? ' aria-label="Heute: überfällig, heute fällig und erledigt"' : ''}>${x[1]}${x[0] === 'today' && nToday ? `<b style="margin-left:6px;font-weight:700;font-variant-numeric:tabular-nums">${nToday}</b>` : ''}</button>`).join('')}<button class="qfc pzstb" data-act="pzstat" aria-label="Letzte 7 Tage">${ic('list', 13)} 7 Tage</button></div><input id="pzq" class="pzq" type="search" placeholder="Aufgabe oder Raum suchen …" value="${esc(st.q || '')}" autocomplete="off" enterkeyhint="search">`;
    const view = q ? 'all' : f;
    const list = q ? T.filter(t => (t.name + ' ' + t.room).toLowerCase().includes(q)) : view === 'due' ? T.filter(t => !t.today && (t.st === 'overdue' || t.st === 'due_soon')) : view === 'today' ? T.filter(isToday) : T;
    const rooms = {}; for (const t of list) (rooms[t.room] = rooms[t.room] || []).push(t);
    const key = r => Math.min(...rooms[r].map(t => this._pzRank(t)));
    const order = Object.keys(rooms).sort((a, b) => key(a) - key(b) || a.localeCompare(b, 'de'));
    this._pzCol = this._pzCol || {};
    const row = t => {
      const cls = t.today ? 'k' : t.st === 'overdue' ? 'o' : t.st === 'due_soon' ? 'd' : t.st === 'ok' ? 'k' : '';
      return `<div class="vr pz ${cls}"${t.today ? '' : ` data-sw="${esc(t.e)}"`}><div class="ico">${ic(this._pzIcon(t), 19)}</div><div><div class="t">${esc(t.name)}</div><div class="s">${esc(this._pzSub(t))}</div></div>${t.today ? `<button class="vbt pzu" data-act="pzundo" data-e="${esc(t.e)}" aria-label="Rückgängig">${ic('refresh', 15)}<span>Rückgängig</span></button>` : `<button class="vbt pzb" data-act="pzdone" data-e="${esc(t.e)}" aria-label="Erledigt">${ic('check', 18)}<span>Erledigt</span></button>`}</div>`;
    };
    const sortR = a => a.sort((x, y) => this._pzRank(x) - this._pzRank(y) || y.over - x.over || (x.until ?? 1e9) - (y.until ?? 1e9) || x.name.localeCompare(y.name, 'de'));
    const group = r => {
      const all = T.filter(t => t.room === r), cur = all.filter(t => t.today || t.st === 'ok' || t.st === 'as_needed').length, k = view + ':' + r;
      const worst = key(r), def = q ? false : view === 'all' ? worst > 1 : false, col = k in this._pzCol ? this._pzCol[k] : def;
      const kid = /^kinderzimmer/i.test(r), star = kid ? all.filter(t => t.since != null && t.since <= 6).length : 0;
      const info = view === 'all' || q ? `<span class="pzp"><i style="width:${Math.round(100 * cur / all.length)}%"></i></span><span class="pzc">${cur}/${all.length}</span>` : `<span class="pzc">${rooms[r].length}</span>`;
      return `<div class="pzg"><button class="pzh${col ? ' c' : ''}" data-act="pzroom" data-id="${esc(k)}" data-c="${col ? 1 : 0}"><span class="pzn">${esc(r.toUpperCase())}</span>${kid ? `<span class="pzs" title="in den letzten 7 Tagen erledigt">★ ${star} diese Woche</span>` : ''}${info}<span class="pzv">${ic('chevron', 14)}</span></button>${col ? '' : sortR(rooms[r]).map(row).join('')}</div>`;
    };
    const body = order.length ? order.map(group).join('') : q ? `<div class="empty">Keine Aufgabe zu „${esc(st.q)}“ gefunden.</div>` : view === 'today' ? `<div class="empty">Heute ist nichts dran. ✨</div>` : `<div class="empty">Nichts fällig. Unter „Alle" siehst du alle ${T.length} Aufgaben.</div>`;
    const doneS = view === 'today' && list.length ? `<div class="lab2">HEUTE · ${nToday} OFFEN · ${list.filter(t => t.today).length} ERLEDIGT</div>` : '';
    return status + go + chips + doneS + `<div class="pzl">${body}</div>` + `<div class="card-note">„Erledigt" setzt das Datum auf heute, nach rechts wischen geht auch. Intervalle und Aufgaben änderst du in der Putzplan-Integration.</div>`;
  }
  _pzOpt(e, k, prev) {
    this._pzO = this._pzO || {};
    this._pzO[e] = { k, t: Date.now(), lu: this._h.states[e]?.last_updated, prev };
    this._pzRefresh();
  }
  _pzCall(e, svc, ok) {
    let p; try { p = this._h.callService('putzplan', svc, { entity_id: e }); } catch (x) { p = Promise.reject(x); }
    Promise.resolve(p).catch(() => { if (this._pzO) delete this._pzO[e]; this._pzRefresh(); this._toast('Speichern fehlgeschlagen – bitte nochmal'); });
  }
  _pzDone(e) {
    const t0 = this._pzTasks().find(t => t.e === e), prev = t0 ? { st: t0.st, over: t0.over, since: t0.since, until: t0.until } : null;
    (this._pzPrev = this._pzPrev || {})[e] = prev;
    this._pzOpt(e, 'done', prev);
    this._pzCall(e, 'mark_done');
    this._toast((this._name(e).replace(/^Putzplan\s+/, '')) + ' erledigt ✓ · Rückgängig', 4500, { act: 'pzundo', e });
  }
  _pzUndo(e) {
    const prev = this._pzPrev && this._pzPrev[e];
    this._pzOpt(e, 'undo', prev);
    this._pzCall(e, 'undo_done');
    this._toast('Rückgängig gemacht');
  }

