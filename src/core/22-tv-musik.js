  /* ───────────── v11: Kindersicherung TV (Integration „kindersicherung“) ───────────── */
  /* ───────────── pz16: Musik & Alexa (Lautsprecher steuern, Durchsagen) ───────────── */
  _spk() {
    const M = this._c.music || {}, rank = { playing: 0, paused: 1, buffering: 1, idle: 2, on: 3, standby: 4, off: 5 };
    let list = M.speakers;
    if (!list) list = Object.keys(this._h.states).filter(k => k.startsWith('media_player.') && this._attr(k, 'device_class') === 'speaker').map(k => ({ name: this._name(k), media: [k] }));
    return list.map((x, i) => {
      const ents = (Array.isArray(x.media) ? x.media : [x.media]).filter(e => { const s = this._s(e); return s && s.state !== 'unavailable'; });
      if (!ents.length) return null;
      // Steuerung über das Gerät mit Play/Pause (Alexa Media), sonst über das erste verfügbare
      const score = e => (this._mpCaps(e).pp ? 0 : 20) + (rank[this._val(e)] ?? 9);
      const e = ents.slice().sort((a, b) => score(a) - score(b))[0];
      const live = ents.map(k => this._s(k)).sort((a, b) => (rank[a.state] ?? 9) - (rank[b.state] ?? 9))[0];
      const a = live.attributes || {}, st = live.state;
      return { i, name: x.name || this._name(e), icon: x.icon || 'speaker', e, ents, notify: x.notify && this._s(x.notify) ? x.notify : null, st, pl: st === 'playing', ps: st === 'paused', title: a.media_title || '', artist: a.media_artist || a.media_album_name || '', pic: a.entity_picture_local || a.entity_picture || '', vol: this._attr(e, 'volume_level') };
    }).filter(Boolean);
  }
  _spkNow(L) { return L.find(x => x.pl) || L.find(x => x.ps && x.title) || null; }
  _picUrl(p) { if (!p) return ''; return p.startsWith('/') && this._h.hassUrl ? this._h.hassUrl(p) : p; }
  _musicRow() {
    const L = this._spk(); if (!L.length) return '';
    const N = this._spkNow(L);
    const sub = N ? `${N.pl ? 'Spielt' : 'Pausiert'} · ${esc(N.title || 'Musik')}${N.artist ? ' – ' + esc(N.artist) : ''} · ${esc(N.name)}` : `${L.length} Lautsprecher · Durchsage senden`;
    return `<div class="xr mpr mus" data-act="music"><div class="ico" style="${N && N.pl ? 'background:rgba(94,234,212,.2);color:#5eead4' : ''}">${ic('music', 19)}</div><div class="grow"><div class="t">Musik &amp; Alexa</div><div class="s">${sub}</div></div>${N ? this._mpBtns(N.e, N.pl).replace(/<button class="mpb"[^>]*data-s="volume_(down|up)"[^>]*>.*?<\/button>/g, '') : ''}</div>`;
  }
  _musicTb() {
    const L = this._spk(); if (!L.length) return '';
    const N = this._spkNow(L);
    return `<button class="tb mus ${N && N.pl ? 'on' : ''}" data-act="music" aria-label="Musik und Durchsage">${ic(N && N.pl ? 'music' : 'announce', 15)}<span>${N && N.pl ? esc(N.title || N.name) : 'Musik &amp; Durchsage'}</span></button>`;
  }
  _sMusic() {
    const M = this._c.music || {}, L = this._spk(), all = M.all && this._s(M.all.notify) ? M.all : null;
    const T = [...(all ? [['all', all.name || 'Überall']] : []), ...L.filter(x => x.notify).map(x => [String(x.i), x.name])];
    if (!T.some(t => t[0] === this._annT)) this._annT = T[0]?.[0];
    const pl = L.filter(x => x.pl).length;
    const card = x => {
      const c = this._mpCaps(x.e), f = this._attr(x.e, 'supported_features') || 0, b = (s, ico, l, main) => `<button class="mpb${main ? ' main' : ''}" data-act="mp" data-e="${x.e}" data-s="${s}" aria-label="${l}">${ic(ico, 18)}</button>`;
      const pic = this._picUrl(x.pic), v = x.vol != null ? Math.round(x.vol * 100) : null;
      const pp = x.pl ? (c.pause ? b('media_pause', 'pause', 'Pause', 1) : c.stop ? b('media_stop', 'close', 'Stopp', 1) : '') : (c.play && (x.ps || x.title) ? b('media_play', 'play', 'Wiedergabe', 1) : '');
      const ctl = (f & 16 && (x.pl || x.ps) ? b('media_previous_track', 'prev', 'Zurück') : '') + pp + (f & 32 && (x.pl || x.ps) ? b('media_next_track', 'next', 'Weiter') : '');
      return `<div class="spk ${x.pl ? 'on' : ''}"><div class="art" ${pic ? `style="background-image:url('${esc(pic)}')"` : ''} data-act="more" data-e="${x.e}">${pic ? '' : ic(x.icon, 24)}</div>
        <div class="inf" data-act="more" data-e="${x.e}"><div class="n">${esc(x.name)}${x.pl ? '<span class="eq"><i></i><i></i><i></i></span>' : ''}</div><div class="s">${x.title ? esc(x.title) + (x.artist ? ' – ' + esc(x.artist) : '') : ({ idle: 'Bereit', off: 'Aus', standby: 'Standby', on: 'An', paused: 'Pausiert' })[x.st] || esc(x.st)}</div></div>
        <div class="ctl">${ctl}</div>
        ${v != null && c.vol ? `<div class="vol">${ic('speaker', 15)}<input type="range" min="0" max="100" value="${v}" style="--v:${v}%;--lc:94,234,212" data-act="vol" data-e="${x.e}" aria-label="Lautstärke ${esc(x.name)}"><span class="vp">${v} %</span></div>` : ''}</div>`;
    };
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('music', 24)}</div><div><h2>Musik &amp; Alexa</h2><p>${L.length} Lautsprecher · ${pl ? pl + ' spielt' + (pl > 1 ? 'en' : '') : 'gerade keine Musik'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      ${T.length ? `<div class="lab2">DURCHSAGE</div>
      <div class="annt">${T.map(t => `<button class="${t[0] === this._annT ? 'on' : ''}" data-act="annt" data-i="${t[0]}">${esc(t[1])}</button>`).join('')}</div>
      <div class="qnew"><input id="annq" type="text" maxlength="200" placeholder="Was soll Alexa sagen?" autocomplete="off" enterkeyhint="send"><button class="vbt big on" data-act="annsend">${ic('announce', 15)}Durchsagen</button></div>
      ${(M.phrases || []).length ? `<div class="annp">${M.phrases.map((p, i) => `<button data-act="annph" data-i="${i}">${esc(p)}</button>`).join('')}</div>` : ''}` : ''}
      <div class="lab2">LAUTSPRECHER · ${L.length}</div>${L.length ? L.map(card).join('') : '<div class="empty">Keine Lautsprecher gefunden</div>'}`;
  }
  async _annSend() {
    const M = this._c.music || {}, inp = this.shadowRoot.getElementById('annq'), msg = (inp?.value || '').trim();
    if (!msg) { this._toast('Bitte erst einen Text eingeben'); inp?.focus(); return; }
    const L = this._spk(), x = this._annT === 'all' ? M.all : L.find(s => String(s.i) === this._annT), ent = x?.notify;
    if (!ent) { this._toast('Kein Lautsprecher für die Durchsage gewählt'); return; }
    try {
      await this._h.callService('notify', 'send_message', { entity_id: ent, message: msg });
      if (inp) inp.value = '';
      this._toast(`Durchsage an ${x.name || 'Alexa'} gesendet`);
    } catch (er) { this._toast('Durchsage hat nicht geklappt', 3600); }
  }
  _tvs() {
    const E = this._h?.entities || {}, D = this._h?.devices || {}, S = this._h?.states || {}, g = {};
    for (const id in E) {
      const r = E[id]; if (!r || r.platform !== 'kindersicherung' || !S[id]) continue;
      const k = r.device_id || id, o = g[k] || (g[k] = { dev: k, e: {} }), dom = id.split('.')[0], fn = String(S[id].attributes?.friendly_name || '');
      const dn = D[k] && (D[k].name_by_user || D[k].name) || ''; if (dn) o.name = dn;
      const nm = (dn && fn.startsWith(dn) ? fn.slice(dn.length) : fn).trim().toLowerCase();
      if (dom === 'binary_sensor') o.e.locked = id;
      else if (dom === 'sensor') { if (/gesperrt bis/.test(nm)) o.e.until = id; else if (/fehlversuche/.test(nm)) o.e.attempts = id; else if (/falsche/.test(nm)) o.e.wrong = id; else if (/best[aä]tigungen/.test(nm)) o.e.confs = id; else if (/zeit/.test(nm)) o.e.timeouts = id; else if (/sperren$/.test(nm)) o.e.locks = id; }
      else if (dom === 'switch') { if (/kindersicherung aktiv|aktiv$/.test(nm)) o.e.enabled = id; else if (/best[aä]tigung/.test(nm)) o.e.confirm = id; }
      else if (dom === 'button') { if (/entsperren/.test(nm)) o.e.unlock = id; else if (/sperren/.test(nm)) o.e.lock = id; }
    }
    return Object.values(g).filter(o => o.e.locked || o.e.enabled).map(o => {
      const e = o.e, st = id => id && S[id], v = id => st(id)?.state, n = id => { const x = parseFloat(v(id)); return isNaN(x) ? null : x; };
      const la = st(e.locked)?.attributes || {}, name = o.name || String(la.friendly_name || 'Fernseher').replace(/\s+Gesperrt$/i, '');
      const locked = v(e.locked) === 'on', enabled = e.enabled ? v(e.enabled) === 'on' : true, waiting = !!st(e.confirm)?.attributes?.waiting;
      let until = okv(v(e.until)) ? new Date(v(e.until)) : (la.lock_until ? new Date(la.lock_until) : null); if (until && isNaN(until)) until = null;
      const att = la.attempts != null ? Number(la.attempts) : n(e.attempts), max = la.max_attempts != null ? Number(la.max_attempts) : null;
      const tone = !enabled ? 'warn' : locked ? 'hot' : waiting ? 'warn' : 'live';
      const h1 = !enabled ? 'Kindersicherung aus' : locked ? 'Gesperrt' : waiting ? 'Wartet auf Bestätigung' : 'Freigegeben';
      const parts = []; if (locked && until) parts.push('bis ' + hhmm(until) + ' Uhr'); if (att != null) parts.push(`Fehlversuche ${att}${max ? ' von ' + max : ''}`);
      const h2 = !enabled ? 'Der Fernseher ist nicht geschützt' : parts.join(' · ') || (locked ? 'Sperre aktiv' : 'Keine Sperre aktiv');
      return { id: o.dev, name, e, locked, enabled, waiting, until, att, max, tone, h1, h2, short: name.replace(/\s*TV$/i, ''), n: { confs: n(e.confs), wrong: n(e.wrong), locks: n(e.locks), timeouts: n(e.timeouts) } };
    }).sort((a, b) => a.name.localeCompare(b.name, 'de'));
  }
  _tvRows() {
    const T = this._tvs(); if (!T.length) return [];
    const bad = T.some(t => t.locked), warn = T.some(t => !t.enabled || t.waiting);
    const s = T.map(t => `${esc(t.short)} ${t.locked ? 'gesperrt' : !t.enabled ? 'Schutz aus' : t.waiting ? 'wartet' : 'frei'}`).join(' · ');
    return [`<button class="xr kid" data-act="tv"><div class="ico">${ic('shield', 19)}</div><div><div class="t">Kindersicherung TV</div><div class="s">${s}</div></div><span class="kdot ${bad ? 'lk' : warn ? 'off' : 'ok'}"></span></button>`];
  }
  _sTv() {
    const T = this._tvs(), busy = !!this._tvBusy, ok = Date.now() < (this._kidUntil || 0) && this._kidPin;
    const head = (p) => `<div class="grab"></div><div class="sh"><div class="ico">${ic('shield', 24)}</div><div><h2>Kindersicherung TV</h2><p>${p}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!T.length) return head('Nicht verfügbar') + `<div class="empty">Keine Fernseher gefunden. Ist die Integration „Kindersicherung“ eingerichtet?</div>`;
    const b = (a, e, cls, ico, txt, sub) => `<button class="kb ${cls || ''}" data-act="tvact" data-a="${a}" data-e="${e}" ${busy ? 'disabled' : ''}>${ic(ico, 22)}<b>${txt}</b>${sub ? `<small>${sub}</small>` : ''}</button>`;
    const body = T.map(t => {
      const tiles = [['confs', 'Bestätigungen', 'check'], ['wrong', 'Falsche Codes', 'close'], ['locks', 'Sperrungen', 'lock'], ['timeouts', 'Zeitüberschr.', 'clock']].filter(x => t.n[x[0]] != null).map(x => this._tile(Math.round(t.n[x[0]]), x[1], x[2])).join('');
      const btn = [];
      if (t.e.unlock && (t.locked || (t.att || 0) > 0)) btn.push(b('entsperren', t.e.unlock, 'good', 'unlock', 'Entsperren', 'Sperre aufheben · PIN'));
      if (t.e.lock && !t.locked) btn.push(b('sperren', t.e.lock, 'danger', 'lock', 'Jetzt sperren', 'sofort sperren'));
      if (t.waiting && t.e.confirm) btn.push(b('bestaetigen', t.e.confirm, 'good', 'check', 'Bestätigen', 'Fernsehen freigeben · PIN'));
      if (t.e.enabled) btn.push(t.enabled ? b('schutz_aus', t.e.enabled, '', 'shield', 'Schutz ausschalten', 'nur mit PIN') : b('schutz_an', t.e.enabled, 'good', 'shield', 'Schutz einschalten', 'Kindersicherung aktivieren'));
      return `<div class="lab2">${ic('tv' in ICONS ? 'tv' : 'shield', 13)} ${esc(t.name).toUpperCase()}</div>
        <div class="vst ${t.tone}"><div class="vsi">${ic(t.locked ? 'lock' : t.enabled ? 'unlock' : 'shield', 26)}</div><div class="vsx"><div class="vkick">STATUS</div><div class="vh1">${esc(t.h1)}</div><div class="vh2">${esc(t.h2)}</div></div></div>
        ${tiles ? `<div class="dg kdg tvdg">${tiles}</div>` : ''}
        <div class="kgrid k2">${btn.join('')}</div>`;
    }).join('');
    const sum = T.map(t => `${esc(t.short)}: ${t.locked ? 'gesperrt' : !t.enabled ? 'Schutz aus' : t.waiting ? 'wartet' : 'frei'}`).join(' · ');
    return head(sum) + `<div class="lab2" style="margin-top:2px">${ic(ok ? 'unlock' : 'lock', 13)} ${ok ? 'PIN akzeptiert' : 'Entsperren, Bestätigen und Ausschalten nur mit PIN'}</div>` + body + `<div class="card-note">Die Integration „Kindersicherung“ sperrt den Fernseher nach zu vielen falschen Codes automatisch. Entsperren, Bestätigen und das Ausschalten des Schutzes brauchen die PIN (Home Assistant prüft sie zusätzlich). Sperren und Einschalten gehen ohne PIN. Die PIN gilt danach 90 Sekunden.</div>`;
  }
  _tvAct(a, e) {
    if (!e || this._tvBusy) return;
    if (a === 'sperren') { this._h.callService('button', 'press', { entity_id: e }); this._toast('Fernseher gesperrt 🔒'); return; }
    if (a === 'schutz_an') { this._h.callService('switch', 'turn_on', { entity_id: e }); this._toast('Kindersicherung eingeschaltet 🛡️'); return; }
    if (Date.now() < (this._kidUntil || 0) && this._kidPin) return this._tvRun(a, e);
    this._kidPend = { tv: true, a: 'tv_' + a, op: a, e }; this._pin = ''; this._pinBad = 0; this._sheet = { t: 'pin', kid: true, tv: true }; this._renderSheet();
  }
  _tvRun(a, e) {
    const MSG = { entsperren: 'Fernseher entsperrt 🔓', schutz_aus: 'Kindersicherung ausgeschaltet', bestaetigen: 'Bestätigt ✓' };
    this._tvBusy = a; if (this._sheet?.t === 'tv') this._renderSheet();
    let p; try { p = this._h.callService('script', 'kindersicherung_aktion', { aktion: a, entity_id: e, pin: this._kidPin }); } catch (x) { p = Promise.reject(x); }
    Promise.resolve(p).then(() => this._toast(MSG[a] || 'Erledigt')).catch(x => {
      const m = String((x && (x.message || x.error)) || x || '');
      if (/pin/i.test(m)) { this._kidUntil = 0; this._kidPin = ''; this._toast('Falsche PIN ✕'); } else this._toast('Aktion fehlgeschlagen' + (m ? ': ' + m : ''), 4200);
    }).finally(() => { this._tvBusy = null; if (this._sheet?.t === 'tv') this._renderSheet(); });
  }

