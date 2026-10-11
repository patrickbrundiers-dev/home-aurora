  /* ───────────── v7: Alter von Messwerten, Feuchte-Hinweis, Fully-Helligkeit ───────────── */
  _age(e) { const s = e && this._s(e); if (!s) return null; const t = new Date(s.last_reported || s.last_updated || s.last_changed).getTime(); return isNaN(t) ? null : Math.max(0, Date.now() - t); }
  _stale(e, min) { const a = this._age(e); return a != null && a > (min || this._c.stale_min || 240) * 6e4 ? a : null; }
  _agoTxt(ms) { const m = Math.round(ms / 6e4); return m < 60 ? m + ' Min.' : m < 2880 ? Math.round(m / 60) + ' Std.' : Math.round(m / 1440) + ' Tg.'; }
  _humLevel(I) { const w = this._c.hum_warn || 65; return I.hum == null || I.open || I.hum < w ? 0 : I.hum >= w + 10 ? 2 : 1; }
  _humHint(r, I) {
    const lv = this._humLevel(I); if (!lv) return '';
    return `<button class="hwarn l${lv}" data-act="vent">${ic('wind', 20)}<div><b>Luftfeuchte ${lv === 2 ? 'sehr ' : ''}hoch · ${de(I.hum, 0)} %</b><span>Fenster ist zu – Stoßlüften empfohlen</span></div></button>`;
  }
  _staleNote(e) { const a = this._stale(e); return a != null ? `<div class="card-note stn">${ic('clock', 14)}Raumsensor hat seit ${this._agoTxt(a)} nichts gemeldet – Werte evtl. veraltet</div>` : ''; }
  _camBadge() {
    const f = this._camFail || 0, a = this._camAt ? Date.now() - this._camAt : null;
    return f >= 2 || (a != null && a > 15e3) ? `${ic('clock', 13)}Kamerabild veraltet${a != null && a > 6e4 ? ' · vor ' + this._agoTxt(a) : ''}` : '';
  }
  /* Fully Kiosk: Helligkeit nach Tageszeit (nur Tablet-Version, nur wenn die Fully-JavaScript-Schnittstelle da ist) */
  _fullyOk() { return WALL_UI && typeof window.fully?.setScreenBrightness === 'function'; }
  _fullyApply(force) {
    if (!this._fullyOk()) return;
    const on = this._fuPref === '1', L = { day: 200, dusk: 120, night: 35, ...(this._c.fully_brightness || {}) };
    if (!on) { this._fuLast = null; return; }
    let v = L[this._app?.dataset.tod] ?? L.day;
    if (this._amb) v = Math.min(v, this._ambBy === 'night' ? 20 : 90);
    v = Math.max(1, Math.min(255, Math.round(v)));
    if (!force && this._fuLast === v) return;
    this._fuLast = v;
    try { window.fully.setScreenBrightness(v); } catch (e) { /* optional */ }
  }
  /* Wandtablet über Home Assistant (Fully-Integration): geht von jedem Gerät aus, auch vom Handy */
  _tabletSet() {
    const T = this._c.tablet, b = T && this._s(T.brightness); if (!b) return '';
    const v = parseFloat(b.state), mx = parseFloat(b.attributes.max) || 255, au = T.auto && this._s(T.auto), bat = this._num(T.battery), pl = this._val(T.plugged) === 'on';
    const pct = isNaN(v) ? null : Math.round(v / mx * 100), L = [['35', 'Dunkel'], ['120', 'Mittel'], ['200', 'Hell'], [String(mx), 'Max']];
    return `<div class="lab2">${esc((T.name || 'Wandtablet').toUpperCase())} · HELLIGKEIT</div>
      <div class="hctl" style="margin-bottom:10px"><button class="rbn" data-act="tbright" data-d="-20" aria-label="Dunkler">${ic('minus', 22)}</button><div class="hset"><b>${pct == null ? '–' : pct + ' %'}</b><span>${bat != null ? `Akku ${de(bat, 0)} %${pl ? ' · lädt' : ''}` : 'Bildschirm'}</span></div><button class="rbn" data-act="tbright" data-d="20" aria-label="Heller">${ic('plus', 22)}</button></div>
      <div class="seg wide">${L.map(([x, l]) => `<button class="${!isNaN(v) && Math.abs(v - +x) < 3 ? 'on' : ''}" data-act="tbright" data-v="${x}">${l}</button>`).join('')}</div>
      ${au ? `<div class="card-note" style="margin-top:12px">Automatisch nach Tageszeit (tags hell, Dämmerung mittel, nachts dunkel)</div><div class="seg wide">${[['on', 'An'], ['off', 'Aus']].map(([x, l]) => `<button class="${au.state === x ? 'on' : ''}" data-act="tauto" data-m="${x}">${l}</button>`).join('')}</div>${au.state === 'on' ? '<div class="card-note">Von Hand gestellte Helligkeit gilt bis zum nächsten Wechsel der Tageszeit.</div>' : ''}` : ''}`;
  }
  _fullySet() {
    if (!this._fullyOk()) return '';
    const on = this._fuPref === '1', seg = `<div class="seg wide">${[['1', 'Automatisch'], ['0', 'Aus']].map(x => `<button class="${(on ? '1' : '0') === x[0] ? 'on' : ''}" data-act="fuauto" data-m="${x[0]}">${x[1]}</button>`).join('')}</div>`;
    return `<div class="lab2">TABLET-HELLIGKEIT (FULLY)</div>${seg}<div class="card-note">Standard: Aus – die Helligkeit regelt eine Home-Assistant-Automation. „Automatisch“ dimmt stattdessen direkt über das Dashboard: tags hell, abends gedimmt, nachts dunkel.</div>`;
  }

  /* ───────────── v8: Kinder-Handy (Google Family Link) mit PIN ───────────── */
  _kids() { return (this._c.kidphones || []).filter(k => k && this._s(k.lock)); }
  _kidInfo(k) {
    const sw = this._s(k.lock), a = (sw && sw.attributes) || {}, off = !sw || sw.state === 'unavailable' || sw.state === 'unknown';
    const code = Number(a.lock_override_code), nv = e => { const v = e && parseFloat(this._val(e)); return isNaN(v) ? null : v; };
    const manual = !!a.locked || code === 1 || code === 7, freed = !manual && code === 4;
    let usable = !off && (sw.state === 'on' || freed);
    const bonus = a.bonus_minutes != null ? Number(a.bonus_minutes) : (nv(k.bonus) || 0);
    const used = nv(k.used), lim = this._s(k.limit)?.attributes || {};
    const limit = lim.enabled ? Number(lim.configured_minutes) || null : null;
    let reason = '', wait = false;
    const op = this._kidOpt;
    if (op && op.e === k.lock && Date.now() - op.t < 30000 && op.sig === JSON.stringify([sw?.state, a.lock_override_code, a.bonus_minutes, a.locked])) { wait = true; if (op.a === 'sperren') usable = false; if (op.a === 'entsperren') usable = true; }
    if (off) reason = 'Keine Verbindung zu Family Link';
    else if (wait) reason = op.a === 'sperren' ? 'Sperre wird übertragen …' : op.a === 'entsperren' ? 'Freigabe wird übertragen …' : 'Bonus wird übertragen …';
    else if (freed) reason = 'Manuell entsperrt (Sperre aufgehoben)';
    else if (usable) reason = bonus > 0 ? `inkl. ${Math.round(bonus)} Min. Bonus` : 'Keine Sperre aktiv';
    else if (manual) reason = 'Manuell gesperrt';
    else if (a.daily_limit_reached || this._val(k.reached) === 'on') reason = 'Tageslimit erreicht';
    else if (a.bedtime_active || this._val(k.bed) === 'on') reason = 'Schlafenszeit';
    else if (a.school_time_active || this._val(k.school) === 'on') reason = 'Schulzeit';
    else reason = 'Gesperrt';
    return { sw, a, off, usable, manual, bonus, used, limit, reason, wait, tone: off ? 'warn' : usable ? 'live' : 'hot' };
  }
  _kidNext(k) {
    const a = this._s(k.next)?.attributes || {}, hm = s => { const d = new Date(s); return isNaN(d) ? '' : d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); };
    const day = s => { const d = new Date(s); if (isNaN(d)) return ''; const t0 = new Date(); t0.setHours(0, 0, 0, 0); const n = Math.round((new Date(d).setHours(0, 0, 0, 0) - t0.getTime()) / 864e5); return n === 0 ? 'heute' : n === 1 ? 'morgen' : d.toLocaleDateString('de-DE', { weekday: 'short' }); };
    if (a.bedtime_active && a.bedtime_end) return 'Schlafenszeit bis ' + hm(a.bedtime_end);
    if (a.schooltime_active && a.next_scheduled_end) return 'Schulzeit bis ' + hm(a.next_scheduled_end);
    if (a.next_scheduled_start) { const t = a.next_scheduled_type === 'bedtime' ? 'Schlafenszeit' : a.next_scheduled_type === 'school_time' ? 'Schulzeit' : 'Sperre'; return `${t} ${day(a.next_scheduled_start)} ${hm(a.next_scheduled_start)}`; }
    return '';
  }
  _kidSchool(k) {
    const a = this._s(k.school)?.attributes || {}, now = new Date(), pad = n => String(n).padStart(2, '0');
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`, hm = n => `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const cur = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const win = String(k.schoolWin && this._val(k.schoolWin) || ''), o = win.startsWith(today) ? win.split('|') : null;
    const flag = !!k.schoolFree && this._val(k.schoolFree) === 'on';
    const has = !!(k.schoolFree && k.schoolWin && this._s(k.schoolFree) && this._s(k.schoolWin));
    let s0 = a.schooltime_start && String(a.schooltime_start).startsWith(today) ? String(a.schooltime_start).slice(11, 16) : '', e0 = s0 && a.schooltime_end ? String(a.schooltime_end).slice(11, 16) : '';
    const os = o && o.length === 3 ? o[1] : '', oe = o && o.length === 3 ? o[2] : '';
    const ws = os || s0, we = oe || e0, mod = !!o;
    let st = 'none', title = 'Heute keine Schulzeit', sub = 'Wochenende, Ferien oder kein Plan für heute', ico = 'sun', tone = 'dim';
    if (mod && flag) { st = 'free'; title = 'Heute schulfrei'; sub = ws ? `Geplant war ${ws}–${we} Uhr · aufgehoben` : 'Schulzeit aufgehoben'; ico = 'sun'; tone = 'live'; }
    else if (mod) { st = 'ended'; title = 'Schule vorzeitig beendet'; sub = ws ? `Geplant war ${ws}–${we} Uhr` : ''; ico = 'check'; tone = 'live'; }
    else if (ws && cur < ws) { st = 'soon'; title = `Schule ab ${ws} Uhr`; sub = `bis ${we} Uhr`; ico = 'backpack'; tone = 'warn'; }
    else if (ws && cur < we) { st = 'run'; title = 'Schulzeit läuft'; sub = `${ws}–${we} Uhr`; ico = 'backpack'; tone = 'hot'; }
    else if (ws) { st = 'done'; title = 'Schule vorbei'; sub = `${ws}–${we} Uhr`; ico = 'check'; tone = 'dim'; }
    return { has, st, title, sub, ico, tone, mod, ws, we };
  }
  _kidRows() {
    return this._kids().map((k, i) => {
      const I = this._kidInfo(k), SC = this._kidSchool(k), u = (I.used != null ? ` · ${Math.round(I.used)} Min. heute` : '') + (SC.has && SC.st === 'free' ? ' · schulfrei' : '');
      return `<button class="xr kid" data-act="kid" data-i="${i}"><div class="ico">${ic('phone', 19)}</div><div><div class="t">${esc(k.title || (k.name + 's Handy'))}</div><div class="s">${I.usable ? 'Nutzbar' : esc(I.reason)}${I.usable && I.bonus > 0 ? ' · Bonus' : ''}${u}</div></div><span class="kdot ${I.off ? 'off' : I.usable ? 'ok' : 'lk'}"></span></button>`;
    });
  }
  _sKid() {
    const i = this._sheet.i || 0, k = this._kids()[i];
    if (!k) return `<div class="grab"></div><div class="sh"><div class="ico">${ic('phone', 24)}</div><div><h2>Handy</h2><p>Nicht verfügbar</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div><div class="empty">Das Gerät wurde in Home Assistant nicht gefunden. Ist die Family-Link-Integration geladen?</div>`;
    const I = this._kidInfo(k), ttl = k.title || (k.name + 's Handy'), nxt = this._kidNext(k), busy = !!this._kidBusy, SC = this._kidSchool(k), ok = Date.now() < (this._kidUntil || 0) && this._kidPin;
    const tiles = `<div class="dg kdg">${this._tile(I.used != null ? Math.round(I.used) + ' Min.' : '–', 'Heute genutzt', 'clock')}${this._tile(I.bonus > 0 ? Math.round(I.bonus) + ' Min.' : 'Kein', 'Bonuszeit', 'plus')}${this._tile(I.limit ? I.limit + ' Min.' : 'Kein Limit', 'Tageslimit', 'gauge')}${this._tile(nxt ? esc(nxt) : '–', 'Nächste Sperre', 'bed').replace('class="dt"', 'class="dt kfull"')}</div>`;
    const b = (a, cls, ico, txt, sub) => `<button class="kb ${cls || ''}" data-act="kact" data-i="${i}" data-a="${a}" ${busy ? 'disabled' : ''}>${ic(ico, 22)}<b>${txt}</b>${sub ? `<small>${sub}</small>` : ''}</button>`;
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('phone', 24)}</div><div><h2>${esc(ttl)}</h2><p>${I.off ? 'Keine Verbindung' : I.usable ? 'Nutzbar' : esc(I.reason)}${nxt && !I.off ? ' · ' + esc(nxt) : ''}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="vst ${I.tone}"><div class="vsi">${ic(I.usable ? 'unlock' : 'lock', 26)}</div><div class="vsx"><div class="vkick">STATUS</div><div class="vh1">${I.off ? 'Offline' : I.usable ? 'Handy nutzbar' : 'Handy gesperrt'}</div><div class="vh2">${esc(I.reason)}</div></div></div>
      ${tiles}
      <div class="lab2">${ic(ok ? 'unlock' : 'lock', 13)} STEUERUNG · ${ok ? 'PIN akzeptiert' : 'nur mit PIN'}</div>
      <div class="kgrid k1">${I.usable ? b('sperren', 'danger', 'lock', 'Handy sperren', 'sofort, bis du es freigibst') : b('entsperren', 'good', 'unlock', 'Handy entsperren', 'hebt die Sperre auf')}</div>
      ${SC.has ? `<div class="lab2">${ic('backpack', 13)} SCHULZEIT HEUTE</div><div class="ksc ${SC.tone}"><div class="ksi">${ic(SC.ico, 22)}</div><div><b>${esc(SC.title)}</b><span>${esc(SC.sub)}</span></div></div><div class="kgrid k2">${SC.mod ? b('schule_normal', '', 'refresh', 'Wie geplant', 'Schulzeit wiederherstellen') : ''}${!SC.mod && (SC.st === 'soon' || SC.st === 'run') ? b('schule_frei', '', 'sun', 'Heute schulfrei', 'nur heute, Plan bleibt') : ''}${!SC.mod && SC.st === 'run' ? b('schule_aus', '', 'check', 'Schule jetzt aus', 'Schulzeit sofort beenden') : ''}</div>` : ''}
      <div class="lab2">${ic('plus', 13)} BONUSZEIT GEBEN</div>
      <div class="kgrid k3">${b('bonus15', '', 'plus', '+15', 'Minuten')}${b('bonus30', '', 'plus', '+30', 'Minuten')}${b('bonus60', '', 'plus', '+60', 'Minuten')}</div>
      <div class="kgrid k2">${I.bonus > 0 ? b('bonus_reset', '', 'refresh', 'Bonus zurücksetzen', Math.round(I.bonus) + ' Min. aktiv') : ''}<button class="kb" data-act="kact" data-i="${i}" data-a="ring">${ic('bell', 22)}<b>Handy klingeln</b><small>zum Wiederfinden · ohne PIN</small></button></div>
      <div class="card-note">Sperren, Bonuszeit und Schulzeit funktionieren nur mit PIN. Schulzeit ändert nur den heutigen Tag, der Wochenplan bleibt. An Ferien und Feiertagen setzt Home Assistant die Schulzeit automatisch auf frei. Ein Skript in Home Assistant prüft die PIN zusätzlich. Die PIN gilt danach 90 Sekunden. Ein aktiver Bonus hebt Schlafenszeit, Schulzeit und Tageslimit auf, aber nicht eine manuelle Sperre.</div>`;
  }
  _kidAct(i, a) {
    const k = this._kids()[i]; if (!k || this._kidBusy) return;
    if (a === 'ring') { this._h.callService('button', 'press', { entity_id: k.ring }); this._toast('Handy klingelt 🔔'); return; }
    if (Date.now() < (this._kidUntil || 0) && this._kidPin) return this._kidRun(i, a);
    this._kidPend = { i, a }; this._pin = ''; this._pinBad = 0; this._sheet = { t: 'pin', kid: true, i }; this._renderSheet();
  }
  _kidRun(i, a) {
    const MSG = { sperren: 'Handy gesperrt 🔒', entsperren: 'Handy entsperrt 🔓', bonus15: '+15 Min. Bonus gegeben', bonus30: '+30 Min. Bonus gegeben', bonus60: '+60 Min. Bonus gegeben', bonus_reset: 'Bonus zurückgesetzt', schule_frei: 'Heute schulfrei ☀️', schule_aus: 'Schule beendet ✓', schule_normal: 'Schulzeit wie geplant' };
    const sv = String(this._c.kidScript || 'script.kinderhandy_aktion').replace(/^script\./, '');
    this._kidBusy = a; if (this._sheet?.t === 'kid') this._renderSheet();
    let p; try { p = this._h.callService('script', sv, { aktion: a, pin: this._kidPin }); } catch (e) { p = Promise.reject(e); }
    const k0 = this._kids()[i], sw0 = k0 && this._s(k0.lock), a0 = (sw0 && sw0.attributes) || {};
    Promise.resolve(p).then(() => { if (k0) this._kidOpt = { e: k0.lock, a, t: Date.now(), sig: JSON.stringify([sw0?.state, a0.lock_override_code, a0.bonus_minutes, a0.locked]) }; this._toast(MSG[a] || 'Erledigt'); }).catch(e => {
      const m = String((e && (e.message || e.error)) || e || '');
      if (/pin/i.test(m)) { this._kidUntil = 0; this._kidPin = ''; this._toast('Falsche PIN ✕'); } else this._toast('Aktion fehlgeschlagen' + (m ? ': ' + m : ''), 4200);
    }).finally(() => { this._kidBusy = null; if (this._sheet?.t === 'kid') this._renderSheet(); });
  }
  _kidActTxt() {
    const a = this._kidPend?.a, T = { sperren: 'das Sperren', entsperren: 'das Entsperren', bonus15: '+15 Min. Bonus', bonus30: '+30 Min. Bonus', bonus60: '+60 Min. Bonus', bonus_reset: 'das Zurücksetzen des Bonus', schule_frei: 'Heute schulfrei', schule_aus: 'Schule jetzt aus', schule_normal: 'Schulzeit wie geplant', tv_entsperren: 'das Entsperren des Fernsehers', tv_schutz_aus: 'das Ausschalten der Kindersicherung', tv_bestaetigen: 'die Bestätigung' };
    return T[a] || (this._kidPend?.tv ? 'den Fernseher' : 'Leonies Handy');
  }
  _kidPinOk(pin) {
    const p = this._kidPend || { i: this._sheet?.i || 0, a: null };
    if (p.tv) {
      this._kidPin = pin; this._kidUntil = Date.now() + 9e4; this._kidPend = null; this._sheet = { t: 'tv' }; this._renderSheet();
      clearTimeout(this._kidTm); this._kidTm = setTimeout(() => { this._kidPin = ''; if (this._sheet?.t === 'tv') this._renderSheet(); }, 9.1e4);
      this._tvRun(p.op, p.e); return;
    }
    this._kidPin = pin; this._kidUntil = Date.now() + 9e4; this._kidPend = null;
    this._sheet = { t: 'kid', i: p.i }; this._renderSheet();
    clearTimeout(this._kidTm); this._kidTm = setTimeout(() => { this._kidPin = ''; if (this._sheet?.t === 'kid') this._renderSheet(); }, 9.1e4);
    if (p.a) this._kidRun(p.i, p.a);
  }

  /* ───────────── v9: Alarm-Banner (Waschmaschine, offene Fenster) und Schnellaktionen für beliebige Geräte ───────────── */
  _alertsHome() {
    const A = [], c = this._c, wa = c.alerts && c.alerts.washer;
    if (wa && wa.state && this._s(wa.state)) {
      const st = this._val(wa.state), nm = wa.name || 'Waschmaschine', s = this._s(wa.state);
      if (st === 'finished') {
        const t = new Date(s.last_changed).getTime(), ag = isNaN(t) ? null : Math.max(0, Date.now() - t), can = wa.unload && this._s(wa.unload) && this._val(wa.unload) !== 'unavailable';
        A.push({ id: 'wash', cls: 'ok', icon: 'check', text: nm + ' fertig', sub: (ag != null ? 'seit ' + this._agoTxt(ag) : '') + (can ? ' · tippen = ausgeräumt' : ''), act: can ? 'quick' : 'nav', attrs: can ? `data-e="${esc(wa.unload)}"` : 'data-v="home"' });
      } else if (['running', 'starting', 'rinse', 'ending', 'paused', 'user_paused'].includes(st)) {
        const pct = wa.pct ? this._num(wa.pct) : null, left = wa.left && okv(this._val(wa.left)) && this._val(wa.left) !== '0' ? this._val(wa.left) + (this._unit(wa.left) ? ' ' + this._unit(wa.left) : '') : '';
        A.push({ id: 'wash', cls: st.includes('paus') ? 'warn' : 'info', icon: 'drop', text: nm + (st.includes('paus') ? ' pausiert' : ' läuft'), sub: left ? 'noch ' + left : (pct != null ? de(pct, 0) + ' %' : ''), pct, act: 'nav', attrs: 'data-v="home"' });
      }
    }
    const open = this._openRooms();
    if (open.length) {
      const w = this._wxNow(), h = new Date().getHours(), night = h >= 22 || h < 6, wet = /rain|pour|hail|snow/.test(w.cond || '') || (w.rain || 0) > 0, cold = w.temp != null && w.temp <= 3;
      if (night || wet || cold) A.unshift({ id: 'open', crit: true, cls: 'warn', icon: 'window', text: 'Fenster/Türen offen', sub: open.join(', ') + ' · ' + (wet ? 'es regnet' : cold ? 'Frost' : 'nachts'), act: 'nav', attrs: 'data-v="rooms"' });
    }
    A.push(...this._cleanAlerts());
    return A;
  }
  _banPick(AL) { const now = Date.now(), dis = this._banDis || {}; return (AL || this._alerts()).filter(a => a.crit && !(dis[a.id] && now - dis[a.id] < 36e5)); }
  _banner(AL) {
    const C = this._banPick(AL); if (!C.length) return '';
    const a = C[0];
    return `<div class="ban ${a.cls}" role="alert"><button class="bmain" data-act="${a.act}" ${a.attrs || ''}><span class="bni">${ic(a.icon, 22)}</span><span class="bnt"><b>${esc(a.text)}</b>${a.sub ? `<small>${esc(a.sub)}</small>` : ''}</span>${C.length > 1 ? `<em>+${C.length - 1}</em>` : ''}</button><button class="bnx" data-act="bandis" data-id="${esc(a.id)}" aria-label="Ausblenden">${ic('close', 16)}</button></div>`;
  }
  _qIcon(e) {
    const d = dom(e);
    return e.startsWith('builtin:') ? 'moon' : d === 'scene' ? 'sparkle' : d === 'light' ? 'bulb' : d === 'switch' ? 'plug' : d === 'cover' ? 'window' : d === 'input_boolean' ? 'cog' : 'play';
  }

