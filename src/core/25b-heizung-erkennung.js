
  /* ───────────── pz20: Heizungssteuerung automatisch erkennen ─────────────
     1. „Dynamische Heizungssteuerung“ (dynamic_heating): ein Status-Sensor mit dem Attribut thermostat_setpoints
        nennt die Thermostate eines Raums. Der Raum bekommt dann heat/climate/climate_more automatisch –
        stellst du weitere Räume um, braucht das Dashboard keine Änderung.
     2. Blueprint „Advanced Heating Control“: die Automation nennt Thermostate, Zeitpläne (schedule.*),
        den Umschalter zwischen den Plänen und die Komfort-/Eco-Temperaturen. Daraus entsteht der Heizplan eines Raums. */
  _heatScan(dhs) {
    const rooms = this._c.rooms, add = new Set();
    for (const r of rooms) {
      if (!r._orig) r._orig = { climate: r.climate, climate_more: r.climate_more, heat: r.heat };
      const o = r._orig;
      // eingetragene Steuerung hat Vorrang; nur Räume ohne heat-Eintrag werden automatisch zugeordnet
      let st = null;
      if (!o.heat) {
        const own = [o.climate, ...(o.climate_more || [])].filter(Boolean);
        st = dhs.find(s => { const k = Object.keys(s.attributes.thermostat_setpoints || {}); return k.some(e => own.includes(e)) || s.entity_id.startsWith(`sensor.${r.id}_heizung`); }) || null;
      }
      if (st) {
        const trv = Object.keys(st.attributes.thermostat_setpoints).sort((a, b) => (b === o.climate) - (a === o.climate));
        const sw = st.entity_id.replace(/^sensor\./, 'switch.').replace(/_status$/, '_regelung_aktiv');
        r.heat = { status: st.entity_id, switch: this._s(sw) ? sw : null }; r.climate = trv[0]; r.climate_more = trv.slice(1); r._auto = 'dh';
        [st.entity_id, sw, ...trv].forEach(e => add.add(e));
      } else if (r._auto) { r.climate = o.climate; r.climate_more = o.climate_more; r.heat = o.heat; r._auto = null; }
      for (const e of this._planIds(r)) add.add(e);
    }
    // ersetzte Einträge (z. B. ein gelöschtes Better-Thermostat) nicht als „fehlt“ melden
    this._autoRepl = new Set(rooms.filter(r => r._auto && r._orig.climate && !(r._orig.climate in this._h.states)).map(r => r._orig.climate));
    return [...add].filter(e => e && e in this._h.states);
  }
  /* Automations-Konfigurationen lesen (alle 30 Min.) und Räume mit Advanced-Heating-Control-Plänen verbinden.
     Über die REST-Schnittstelle kommt die gespeicherte Konfiguration mit use_blueprint (klein, braucht Admin-Rechte);
     das WebSocket-Kommando automation/config liefert dagegen den ausgerollten Blueprint (~80 KB pro Automation). */
  async _loadPlans() {
    if (this._plB || (this._plans && Date.now() - this._plans.t < 18e5)) return;
    this._plB = true;
    const map = {};
    try {
      const ids = Object.keys(this._h.states).filter(k => k.startsWith('automation.') && this._h.states[k].attributes?.id);
      const cfgs = await Promise.all(ids.map(e => this._h.callApi('GET', `config/automation/config/${encodeURIComponent(this._h.states[e].attributes.id)}`).then(x => [e, x], () => [e, null])));
      for (const [e, cfg] of cfgs) {
        const bp = cfg?.use_blueprint, inp = bp?.input || {};
        if (!bp || !/heating/i.test(bp.path || '') || !inp.input_trvs) continue;
        const trvs = [].concat(inp.input_trvs);
        const r = this._c.rooms.find(x => trvs.includes(x._orig?.climate ?? x.climate) || trvs.includes(x.climate) || (inp.input_temperature_sensor && inp.input_temperature_sensor === x.temp));
        if (!r) continue;
        map[r.id] = { auto: e, on: this._val(e) === 'on', sch: [].concat(inp.input_schedulers || []), sel: inp.input_scheduler_selector || null, comfort: inp.input_temperature_comfort_static ?? null, eco: inp.input_temperature_eco_static ?? null };
      }
    } catch (err) { /* ohne Rechte oder ohne Automationen: kein Heizplan */ }
    this._plans = { t: Date.now(), map };
    this._plB = false; this._xw = null; this._sig = '';
    this._renderSoon();
  }
  _planIds(r) { const p = this._plans?.map[r.id]; return p ? [p.auto, ...p.sch, p.sel].filter(Boolean) : []; }
  /* Heizplan eines Raums: welcher Zeitplan gilt gerade, Komfort oder Eco, und wann ist der nächste Wechsel */
  _plan(r) {
    const D = r.heat && this._dh(r);
    if (D) {
      const a = D.a, nx = a.next_event ? new Date(a.next_event) : null, M = { comfort: 'Komfort', eco: 'Eco', away: 'Abwesend', off: 'Aus', boost: 'Boost', preheat: 'Vorheizen' };
      return { src: 'Dynamische Heizungssteuerung', mode: M[a.mode] || (a.mode ? String(a.mode) : ''), next: nx && !isNaN(nx) ? nx : null, on: D.auto };
    }
    const p = this._plans?.map[r.id]; if (!p) return null;
    const scs = p.sch.filter(e => this._s(e));
    // Umschalter: an/aus wählt den 2. Plan; eine Zahl den n-ten (ab 1); ein Text den Plan mit diesem Namen oder dieser ID
    let cur = scs[0];
    const sv = p.sel && scs.length > 1 ? this._val(p.sel) : null;
    if (sv === 'on') cur = scs[1];
    else if (okv(sv) && sv !== 'off') {
      const n = parseInt(sv, 10), t = String(sv).trim().toLowerCase();
      cur = !isNaN(n) && String(n) === String(sv).trim() ? scs[clamp(n - 1, 0, scs.length - 1)] : scs.find(e => e.toLowerCase() === t || e.slice(9).toLowerCase() === t || this._name(e).trim().toLowerCase() === t) || scs[0];
    }
    const s = cur && this._s(cur), nx = s?.attributes?.next_event ? new Date(s.attributes.next_event) : null, on = s?.state === 'on';
    return { src: 'Heizplan', sched: cur, schedName: s ? this._name(cur) : '', mode: s ? (on ? 'Komfort' : 'Eco') : '', temp: s ? (on ? p.comfort : p.eco) : null, next: nx && !isNaN(nx) ? nx : null, nextMode: s ? (on ? 'Eco' : 'Komfort') : '', on: this._val(p.auto) === 'on' };
  }
  _whenTxt(d) {
    if (!d) return '';
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const days = Math.floor((new Date(d).setHours(0, 0, 0, 0) - t0) / 864e5);
    return (days === 0 ? '' : days === 1 ? 'morgen ' : d.toLocaleDateString('de-DE', { weekday: 'short' }) + ' ') + hhmm(d);
  }

  /* Heizdauer heute: Verlauf der Thermostate seit Mitternacht (mit Attributen), alle 10 Minuten neu.
     Ein Raum heizt, solange eines seiner Thermostate heizt (hvac_action, sonst Sollwert über Ist-Temperatur). */
  async _loadHeatTime() {
    if (this._htB || (this._ht && Date.now() - this._ht.t < 6e5)) return;
    const rooms = this._c.rooms.filter(r => r.climate), ents = [...new Set(rooms.flatMap(r => [r.climate, ...(r.climate_more || [])]).filter(e => this._s(e)))];
    if (!ents.length) return;
    this._htB = true;
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const out = {};
    try {
      const res = await this._h.callWS({ type: 'history/history_during_period', start_time: t0.toISOString(), end_time: new Date().toISOString(), entity_ids: ents, minimal_response: false, no_attributes: false, significant_changes_only: false, include_start_time_state: true });
      const iv = {};
      for (const e of ents) {
        const L = res?.[e] || [], v = []; let a = {}, on = null;
        for (const x of L) {
          if (x.a) a = x.a; else if (x.attributes) a = x.attributes;
          const s = x.s ?? x.state, ts = Math.max(t0.getTime(), x.lu != null ? x.lu * 1000 : (x.lc != null ? x.lc * 1000 : new Date(x.last_updated || x.last_changed || t0).getTime()));
          const h = s !== 'off' && okv(s) && (a.hvac_action != null ? a.hvac_action === 'heating' : (a.temperature != null && a.current_temperature != null && a.temperature > a.current_temperature + 0.2));
          if (h && on == null) on = ts; else if (!h && on != null) { v.push([on, ts]); on = null; }
        }
        if (on != null) v.push([on, Date.now()]);
        iv[e] = v;
      }
      for (const r of rooms) {
        const all = [r.climate, ...(r.climate_more || [])].flatMap(e => iv[e] || []).sort((p, q) => p[0] - q[0]);
        let sum = 0, cs = null, ce = null;
        for (const [s, e] of all) { if (cs == null || s > ce) { if (cs != null) sum += ce - cs; cs = s; ce = e; } else ce = Math.max(ce, e); }
        if (cs != null) sum += ce - cs;
        out[r.id] = sum;
      }
    } catch (err) { this._ht = { t: Date.now(), ok: false, by: {} }; this._htB = false; return; }
    this._ht = { t: Date.now(), ok: true, by: out };
    this._htB = false;
    this._renderSoon();
  }
  _heatTime(r) { this._loadHeatTime(); const v = this._ht?.ok ? this._ht.by[r.id] : null; return v == null ? null : v; }
  _durTxt(ms) { const m = Math.round(ms / 6e4); return m < 60 ? `${m} Min.` : `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')} h`; }
