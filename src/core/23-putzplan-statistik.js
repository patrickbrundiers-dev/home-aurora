  /* ───────────── v12: Putzplan-Statistik · letzte 7 Tage (aus dem Verlauf von Home Assistant) ───────────── */
  _pzDayKey(ms) { const d = new Date(ms); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  async _pzLoadStat(force) {
    const c = this._pzS;
    if (!force && c && c.ok && Date.now() - c.t < 6e4) return;
    if (this._pzSBusy) return; this._pzSBusy = true;
    const T = this._pzTasks(), info = {}; T.forEach(t => { info[t.e] = t; });
    const d0 = new Date(); d0.setHours(0, 0, 0, 0); d0.setDate(d0.getDate() - 6);
    const from = d0.getTime(), st = from - 2 * 864e5;
    try {
      const res = await this._h.callWS({ type: 'history/history_during_period', start_time: new Date(st).toISOString(), end_time: new Date().toISOString(), entity_ids: T.map(t => t.e), include_start_time_state: true, significant_changes_only: false, minimal_response: false, no_attributes: false });
      const evs = [];
      for (const e in res) {
        let prevLd, at = {}, mine = [];
        for (const x of res[e] || []) {
          if (x.a) at = x.a; else if (x.attributes) at = x.attributes;
          const ts = x.lu != null ? x.lu * 1000 : (x.last_updated ? new Date(x.last_updated).getTime() : st), ld = at.last_done || null;
          if (prevLd !== undefined && ld && ld !== prevLd) {
            if (ld === this._pzDayKey(ts)) mine.push({ e, ts, ld });
            else if (prevLd && ld < prevLd) { const i = mine.map(m => m.ld).lastIndexOf(prevLd); if (i >= 0) mine.splice(i, 1); }
          }
          prevLd = ld;
        }
        const t = info[e];
        for (const m of mine) if (m.ts >= from) evs.push({ e, ts: m.ts, name: t ? t.name : (at.task_name || e), room: t ? t.room : (at.room || 'Allgemein'), t });
      }
      evs.sort((a, b) => b.ts - a.ts);
      this._pzS = { ok: true, t: Date.now(), evs, from };
    } catch (err) { this._pzS = { ok: false, t: Date.now(), evs: [], from }; }
    this._pzSBusy = false;
    if (this._sheet && this._sheet.t === 'pzstat') this._renderSheet();
  }
  _sPzStat() {
    const S = this._pzS, back = !this._pzView() ? `<button class="vbt" data-act="pzback" style="margin-top:14px;width:100%">${ic('chevron', 15)}<span>Zurück zum Putzplan</span></button>` : '';
    const head = p => `<div class="grab"></div><div class="sh"><div class="ico">${ic('broom', 24)}</div><div><h2>Putzplan · letzte 7 Tage</h2><p>${p}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!S) return head('Lade Verlauf …') + `<div class="empty">Verlauf wird geladen …</div>`;
    if (!S.ok) return head('Nicht verfügbar') + `<div class="empty">Der Verlauf konnte nicht geladen werden.</div><button class="vbt" data-act="pzstatr" style="width:100%">${ic('refresh', 15)}<span>Nochmal versuchen</span></button>` + back;
    const days = [], today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) { const d = new Date(today); d.setDate(d.getDate() - i); days.push({ d, k: this._pzDayKey(d.getTime()), ev: [] }); }
    const by = {}; days.forEach(x => { by[x.k] = x; });
    for (const ev of S.evs) { const x = by[this._pzDayKey(ev.ts)]; if (x) x.ev.push(ev); }
    const tot = S.evs.length, mx = Math.max(1, ...days.map(x => x.ev.length)), wd = d => d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
    const bars = days.slice().reverse().map((x, i) => `<div class="c1${x.k === days[0].k ? ' t' : ''}"><b>${x.ev.length || ''}</b><i style="height:${x.ev.length ? Math.max(6, Math.round(88 * x.ev.length / mx)) : 3}px"></i><span>${x.k === days[0].k ? 'Heute' : wd(x.d)}</span></div>`).join('');
    const rooms = {}; S.evs.forEach(ev => { rooms[ev.room] = (rooms[ev.room] || 0) + 1; });
    const rl = Object.keys(rooms).sort((a, b) => rooms[b] - rooms[a] || a.localeCompare(b, 'de'));
    const chips = rl.length ? `<div class="lab2" style="margin-top:14px">NACH RAUM</div><div class="qfl">${rl.map(r => `<span class="qfc pzsc">${esc(r)} <b>${rooms[r]}</b></span>`).join('')}</div>` : '';
    const lbl = (x, i) => (i === 0 ? 'HEUTE' : i === 1 ? 'GESTERN' : x.d.toLocaleDateString('de-DE', { weekday: 'long' }).toUpperCase()) + ' · ' + x.d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }).toUpperCase() + ' · ' + x.ev.length + ' erledigt';
    const list = days.map((x, i) => `<div class="lab2" style="margin-top:14px">${lbl(x, i)}</div>` + (x.ev.length ? x.ev.map(ev => `<div class="pzsr"><span class="pzt">${hhmm(ev.ts)}</span><div class="ico">${ic(ev.t ? this._pzIcon(ev.t) : 'broom', 17)}</div><div><div class="t">${esc(ev.name)}</div><div class="s">${esc(ev.room)}</div></div></div>`).join('') : `<div class="pzsn">nichts erledigt</div>`)).join('');
    const avg = (tot / 7).toFixed(1).replace('.', ',');
    return head(tot ? `${tot} ${tot === 1 ? 'Aufgabe' : 'Aufgaben'} erledigt · Ø ${avg} pro Tag` : 'Noch nichts erledigt') + `<div class="pzsb">${bars}</div>` + chips + list + `<div class="card-note">Die Zeiten kommen aus dem Verlauf von Home Assistant. Erledigungen vor dem Start des Putzplans sind nicht enthalten.</div>` + back;
  }

