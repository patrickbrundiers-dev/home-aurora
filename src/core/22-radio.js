/* ───────────── pz34: Radio · Senderskala, Player-Auswahl, Sender verwalten · pz35: Reiter Hörspiele · pz37: Folgen-Fenster ───────────── */
  /* Sender und Hörspiele stehen je in einer HA-To-do-Liste (radio.list bzw. radio.hsp.list, je Eintrag einer; Beschreibung = JSON
     mit genre/cmd/url/emoji), damit Handy und Tablet dieselben sehen. Ist die Liste leer oder fehlt sie, gelten die aus der Konfiguration. */
  _rdC() { return this._c.radio || {}; }
  _rdKind() { if (this._rdTab == null) { try { this._rdTab = localStorage.getItem('home-aurora-rdtab') || 'rd'; } catch (e) { this._rdTab = 'rd'; } } return this._rdTab === 'hs' ? 'hs' : 'rd'; }
  _rdK(k = this._rdKind()) {
    const C = this._rdC(), H = { ...DEFAULTS.radio.hsp, ...(C.hsp || {}) };
    return k === 'hs' ? { k, list: H.list === undefined ? 'todo.horspiele' : H.list, items: H.items || [], noun: 'Hörspiel', nouns: 'Hörspiele', cmd: n => `spiele das neueste Album von ${n} auf Deezer` }
      : { k, list: C.list, items: C.stations || [], noun: 'Sender', nouns: 'Sender', cmd: n => 'spiele ' + n };
  }
  _rdCache(k = this._rdKind()) { return (this._rdItK = this._rdItK || {})[k]; }
  _rdListE(k) { const e = this._rdK(k).list, s = e && this._s(e); return s && okv(s.state) ? e : null; }
  async _loadRd(force, k = this._rdKind()) {
    const e = this._rdListE(k), B = this._rdBK = this._rdBK || {}; if (!e || B[k]) return;
    const s = this._s(e), key = s.last_updated || s.state, old = this._rdCache(k);
    if (!force && old && old.k === key) return;
    B[k] = true;
    try {
      const r = await this._h.callWS({ type: 'todo/item/list', entity_id: e });
      const list = (r?.items || []).filter(i => i && i.summary && i.status !== 'completed').map(i => {
        let d = null; try { d = i.description ? JSON.parse(i.description) : null; } catch (x) { d = null; }
        if (!d || typeof d !== 'object') d = { genre: i.description || '' };
        return { uid: i.uid, name: String(i.summary).trim(), genre: String(d.genre || ''), cmd: String(d.cmd || ''), url: String(d.url || ''), emoji: String(d.emoji || ''), dz: String(d.dz || '') };
      });
      this._rdItK[k] = { k: key, list };
    } catch (er) { this._rdItK[k] = { k: key, list: old?.list || [], err: true }; }
    B[k] = false;
    this._renderSoon();
  }
  _rdStations(k = this._rdKind()) {
    const L = this._rdListE(k) && this._rdCache(k)?.list;
    const src = L && L.length ? L : this._rdK(k).items.map(x => ({ name: x.name, genre: x.genre || '', cmd: x.cmd || (x.phrase ? 'spiele ' + x.phrase : ''), url: x.url || '', emoji: x.emoji || '', dz: x.dz || '' }));
    return src.filter(x => x && x.name).map((x, i) => ({ ...x, id: x.uid || 'c' + i, i }));
  }
  /* Senderfarbe aus dem Namen, damit jede Kachel ihre eigene behält */
  _rdCol(n) {
    const P = [['#1e3a8a', '#2563eb'], ['#86198f', '#db2777'], ['#9a3412', '#f59e0b'], ['#155e75', '#06b6d4'], ['#1e40af', '#60a5fa'], ['#334155', '#64748b'], ['#7f1d1d', '#ef4444'], ['#3f6212', '#84cc16'], ['#4c1d95', '#8b5cf6'], ['#065f46', '#10b981']];
    let h = 0; for (const c of String(n)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const p = P[h % P.length]; return `linear-gradient(135deg,${p[0]},${p[1]})`;
  }
  _rdShort(n) { const t = String(n).replace(/^radio\s+/i, '').trim(); return t.length > 16 ? t.split(/\s+/).map(w => w[0]).join('').slice(0, 4).toUpperCase() : t.toUpperCase(); }
  /* Player = die Lautsprecher aus music.speakers (+ „Überall“); offline bleiben sie sichtbar, aber grau */
  _rdPlayers() {
    return this._memo('rdp', () => {
      const M = this._c.music || {}, L = this._spk(), out = [];
      (M.speakers || L).forEach(x => { const live = L.find(s => s.name === (x.name || '')); out.push(live ? { ...live, on: true } : { name: x.name || '?', icon: x.icon || 'speaker', on: false, ents: [] }); });
      if (M.all && M.all.media) {
        const ents = [M.all.media].flat().filter(e => { const s = this._s(e); return s && s.state !== 'unavailable'; }), e = ents[0], s = e && this._s(e);
        out.push(s ? { name: M.all.name || 'Überall', icon: 'speaker', on: true, e, ents, st: s.state, pl: s.state === 'playing', ps: s.state === 'paused', title: s.attributes.media_title || '', artist: s.attributes.media_artist || '', vol: s.attributes.volume_level } : { name: M.all.name || 'Überall', icon: 'speaker', on: false, ents: [] });
      }
      return out;
    });
  }
  _rdPlayer() {
    const P = this._rdPlayers(), C = this._rdC();
    let want = this._rdSel;
    if (want == null) { try { want = localStorage.getItem('home-aurora-radiop'); } catch (e) { want = null; } }
    if (want == null && C.entity) want = P.find(p => (p.ents || []).includes(C.entity))?.name;
    if (want == null) want = C.player || 'Wohnzimmer';
    return P.find(p => p.name === want && p.on) || P.find(p => p.on) || null;
  }
  /* läuft gerade einer der Sender? Erst am Titel erkennen, sonst der zuletzt hier gestartete */
  _rdNow(P, S) {
    if (!P || !(P.pl || P.ps)) return null;
    const t = `${P.title} ${P.artist}`.toLowerCase(), norm = s => s.toLowerCase().replace(/[^a-z0-9äöü]/g, '');
    const hit = S.find(x => t.includes(x.name.toLowerCase())) || S.find(x => norm(x.name).length > 2 && norm(t).includes(norm(x.name)));
    return hit || S.find(x => x.name === this._rdLast?.[P.name]) || null;
  }
  _vRadio() {
    const K = this._rdK(); if (this._rdListE()) this._loadRd();
    const S = this._rdStations(), P = this._rdPlayer(), PL = this._rdPlayers(), cur = this._rdNow(P, S);
    const pl = !!P?.pl, vol = P && P.vol != null ? Math.round(P.vol * 100) : null, n = S.length;
    const pos = i => n > 1 ? 6 + i * 88 / (n - 1) : 50;
    const nums = [88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108].map(f => `<span>${f}</span>`).join('');
    const marks = S.map(x => `<button class="rxm${cur && cur.id === x.id ? ' on' : ''}" style="left:${pos(x.i)}%" data-act="rdplay" data-id="${esc(x.id)}">${esc(this._rdShort(x.name))}</button>`).join('');
    const tiles = S.map(x => `<button class="c rxs${cur && cur.id === x.id ? ' on' : ''}" data-act="rdplay" data-id="${esc(x.id)}" style="--i:${x.i}"><span class="rxb${this._rdShort(x.name).length > 10 ? ' lg' : ''}" style="background:${this._rdCol(x.name)};--n:${this._rdShort(x.name).length}">${esc(this._rdShort(x.name))}</span><span class="rxn">${esc(x.name)}</span></button>`).join('');
    const chip = p => `<button class="rxp${P && p.name === P.name ? ' on' : ''}${p.on ? '' : ' off'}${p.pl ? ' pl' : ''}" ${p.on ? `data-act="rdsel" data-n="${esc(p.name)}"` : 'disabled'}><i></i>${esc(p.name)}${p.on ? (p.pl ? '<small>spielt</small>' : '') : '<small>offline</small>'}</button>`;
    const title = cur ? cur.name : P?.title || (P ? 'Bereit' : 'Kein Player erreichbar');
    const sub = cur ? [cur.genre, P.title && P.title !== cur.name ? P.title : ''].filter(Boolean).join(' · ') || 'Internetradio' : P ? (P.title ? P.artist || '' : 'Tippe unten auf einen Sender') : 'Alle Lautsprecher sind offline';
    const qv = [['−5', -5], ['Leise', 20], ['Normal', 35], ['Laut', 60], ['+5', 5]];
    const players = `<div class="h">${ic('speaker', 14)} Abspielen auf</div><div class="rx-pls">${PL.map(chip).join('')}</div>`;
    const head = `<div class="vh rx-vh"><div><h1>Radio</h1><p>${P ? (pl ? 'Spielt auf ' : 'Abspielen auf ') + esc(P.name) : 'Kein Player erreichbar'} · ${n} ${K.k === 'hs' ? (n === 1 ? 'Hörspiel' : 'Hörspiele') : 'Sender'}</p></div>
        <div class="rx-top"><button class="qb" data-act="rdedit">${ic('pen', 14)}${K.nouns} bearbeiten</button><span class="rx-live${pl ? ' on' : ''}"><i></i>${pl ? 'ON AIR' : P ? (P.ps ? 'PAUSE' : 'BEREIT') : 'OFFLINE'}</span></div></div>
      <div class="rx-tabs"><button class="${K.k === 'rd' ? 'on' : ''}" data-act="rdtab" data-m="rd">${ic('radio', 16)}Radio</button><button class="${K.k === 'hs' ? 'on' : ''}" data-act="rdtab" data-m="hs">${ic('music', 16)}Hörspiele</button></div>`;
    if (K.k === 'hs') return head + this._vHsp(S, P, cur, players, vol);
    return head + `<div class="rx">
        <section class="c rx-dial"><div class="rx-scale"><div class="rx-nums">${nums}</div><div class="rx-tk"></div><div class="rx-tk2"></div><div class="rx-marks">${marks}</div>
          <div class="rx-needle${cur ? '' : ' idle'}" style="--p:${(cur ? pos(cur.i) : 1) / 100}"></div><span class="rx-fm">FM</span></div></section>
        <div class="rx-mid">
          <section class="c rx-now"><div class="rx-logo${cur && this._rdShort(cur.name).length > 7 ? ' lg' : ''}" style="${cur ? `background:${this._rdCol(cur.name)}` : ''}">${cur ? esc(this._rdShort(cur.name)) : ic('radio', 30)}</div>
            <div class="rx-tr"><div class="rx-k">${pl ? 'JETZT LÄUFT' : P?.ps ? 'PAUSIERT' : 'RADIO'}</div><div class="rx-t">${esc(title)}</div><div class="rx-a">${esc(sub)}</div></div>
            <span class="rx-eq${pl ? ' on' : ''}"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></section>
          <section class="c rx-ctl"><button class="rx-knob${pl ? ' on' : ''}" data-act="rdpower" aria-label="${pl ? 'Radio aus' : 'Radio an'}" ${P ? '' : 'disabled'}>${ic('power', 34)}</button>
            <div class="rx-vol"><div class="rx-vh2"><span>LAUTSTÄRKE</span><b>${vol != null ? vol + ' %' : '–'}</b></div>
              <input class="rx-bar" type="range" min="0" max="100" value="${vol ?? 0}" data-act="rdvol" aria-label="Lautstärke" ${vol != null ? '' : 'disabled'}>
              <div class="rx-vr"><span>0 %</span><span>50 %</span><span>100 %</span></div>
              <div class="rx-qv">${qv.map(q => `<button data-act="rdqv" data-v="${q[1]}" data-rel="${typeof q[0] === 'string' && /\d/.test(q[0]) ? 1 : 0}" ${vol != null ? '' : 'disabled'}>${q[0]}</button>`).join('')}</div></div></section>
        </div>
        ${players}
        <div class="h">${ic('radio', 14)} Schnellauswahl <span class="r">Tippen = sofort spielen</span></div>
        <div class="rx-st">${tiles}<button class="c rxs rxadd" data-act="rdedit" data-new="1"><span class="rxb">${ic('plus', 26)}</span><span class="rxn">Sender hinzufügen</span></button></div>
      </div>`;
  }
  /* Hörspiele: Leiste mit Zurück/Pause/Weiter und Lautstärke, darunter Kacheln mit Emoji-Cover */
  _vHsp(S, P, cur, players, vol) {
    const pl = !!P?.pl, f = P ? this._attr(P.e, 'supported_features') || 0 : 0, c = P ? this._mpCaps(P.e) : {}, on = P && (P.pl || P.ps);
    const b = (act, ico, l, x, main) => `<button class="mpb${main ? ' main' : ''}" data-act="${act}" aria-label="${l}" ${x ? '' : 'disabled'}>${ic(ico, 20)}</button>`;
    const cv = x => `<span class="rxc" style="background:${this._rdCol(x.name)}"><i>${esc(x.emoji || '🎧')}</i><b>${esc(x.name)}</b></span>`;
    const tiles = S.map(x => `<button class="c rxh${cur && cur.id === x.id ? ' on' : ''}" data-act="hsopen" data-id="${esc(x.id)}" style="--i:${x.i}">${cv(x)}<span class="rxn">${esc(x.name)}</span><span class="rxg">${esc(['Deezer', x.genre].filter(Boolean).join(' · '))}</span></button>`).join('');
    const title = cur ? cur.name : on ? P.title || 'Wiedergabe' : P ? 'Bereit' : 'Kein Player erreichbar';
    const sub = cur ? [P.title && P.title !== cur.name ? P.title : '', P.artist && P.artist !== cur.name ? P.artist : ''].filter(Boolean).join(' · ') || 'Hörspiel von Deezer' : on ? P.artist || '' : P ? 'Tippe unten auf ein Hörspiel' : 'Alle Lautsprecher sind offline';
    return `<div class="rx">
        <section class="c rx-hbar"><span class="rxc sm" style="${cur ? `background:${this._rdCol(cur.name)}` : ''}"><i>${cur ? esc(cur.emoji || '🎧') : '🎧'}</i></span>
          <div class="rx-tr"><div class="rx-k">${pl ? 'JETZT LÄUFT' : P?.ps ? 'PAUSIERT' : 'HÖRSPIELE'}</div><div class="rx-t">${esc(title)}</div><div class="rx-a">${esc(sub)}</div></div>
          <div class="rx-tp">${b('rdprev', 'prev', 'Zurück', on && f & 16)}${b('rdpower', pl ? 'pause' : 'play', pl ? 'Pause' : 'Abspielen', P && (pl ? c.pause || c.stop : true), 1)}${b('rdnext', 'next', 'Weiter', on && f & 32)}</div>
          <div class="rx-vol rx-hv"><div class="rx-vh2"><span>LAUTSTÄRKE</span><b>${vol != null ? vol + ' %' : '–'}</b></div>
            <input class="rx-bar" type="range" min="0" max="100" value="${vol ?? 0}" data-act="rdvol" aria-label="Lautstärke" ${vol != null ? '' : 'disabled'}></div></section>
        ${players}
        <div class="h">${ic('music', 14)} Hörspiele <span class="r">Tippen = Folge auswählen</span></div>
        <div class="rx-hs">${tiles}<button class="c rxh rxadd" data-act="rdedit" data-new="1"><span class="rxc">${ic('plus', 30)}</span><span class="rxn">Hörspiel hinzufügen</span></button></div>
      </div>`;
  }
  /* Alexa nimmt Sender nur als Sprachbefehl: über Alexa Devices (send_text_command) oder Alexa Media (play_media custom);
     andere Player bekommen die Stream-Adresse, wenn der Sender eine hat */
  _rdCall(P, st) {
    const reg = this._h.entities || {}, text = st.cmd || this._rdK().cmd(st.name);
    for (const e of P.ents || []) { const r = reg[e]; if (r?.platform === 'alexa_devices' && r.device_id) return ['alexa_devices', 'send_text_command', { device_id: r.device_id, text_command: text }]; }
    const am = (P.ents || []).find(e => reg[e]?.platform === 'alexa_media') || (!reg[P.e] ? P.e : null);
    if (am) return ['media_player', 'play_media', { entity_id: am, media: { media_content_type: 'custom', media_content_id: text } }];
    if (st.url) return ['media_player', 'play_media', { entity_id: P.e, media: { media_content_type: 'music', media_content_id: st.url } }];
    return null;
  }
  _rdPlay(id, over) {
    const st0 = this._rdStations().find(x => x.id === id), st = st0 && { ...st0, ...(over || {}) }, P = this._rdPlayer();
    if (!st) { this._toast(this._rdK().noun + ' nicht gefunden'); return; }
    if (!P) { this._toast('Kein Lautsprecher erreichbar'); return; }
    const c = this._rdCall(P, st);
    if (!c) { this._toast(`${P.name} kann ${st.name} nicht abspielen`, 3600); return; }
    (this._rdLast = this._rdLast || {})[P.name] = st.name;
    Promise.resolve(this._h.callService(...c)).then(() => this._toast(`${st.label || st.name} auf ${P.name}`), () => this._toast(this._rdK().noun + ' konnte nicht gestartet werden', 3600));
    this._sig = ''; this._render();
  }
  _rdPower() {
    const P = this._rdPlayer(); if (!P) return;
    if (P.pl) { const c = this._mpCaps(P.e); this._h.callService('media_player', c.pause ? 'media_pause' : 'media_stop', { entity_id: P.e }); return; }
    const S = this._rdStations(), st = this._rdNow({ ...P, pl: true }, S) || S.find(x => x.name === this._rdLast?.[P.name]);
    if (P.ps && this._mpCaps(P.e).play) { this._h.callService('media_player', 'media_play', { entity_id: P.e }); return; }
    if (st || S[0]) this._rdPlay((st || S[0]).id);
  }
  _rdVol(v) {
    const P = this._rdPlayer(); if (!P) return;
    this._h.callService('media_player', 'volume_set', { entity_id: P.e, volume_level: clamp(v, 0, 100) / 100 });
  }
  /* ── Fenster „Sender bearbeiten“: hinzufügen, ersetzen, löschen ── */
  _sRadio() {
    const K = this._rdK(), hs = K.k === 'hs', e = this._rdListE(), S = this._rdStations(), ed = this._rdEd || {}, x = ed.id && S.find(s => s.id === ed.id);
    if (e) this._loadRd();
    const head = `<div class="grab"></div><div class="sh"><div class="ico">${ic(hs ? 'music' : 'radio', 24)}</div><div><h2>${K.nouns} bearbeiten</h2><p>${S.length} ${hs ? (S.length === 1 ? 'Hörspiel' : 'Hörspiele') : 'Sender'} · gilt für alle Geräte</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!e) return head + `<div class="empty">Zum Bearbeiten braucht das Dashboard eine To-do-Liste für die ${K.nouns}. In der Karten-Konfiguration unter <b>${hs ? 'radio: hsp: list:' : 'radio: list:'}</b> eintragen (Standard <b>${hs ? 'todo.horspiele' : 'todo.radiosender'}</b>).</div>`;
    const badge = s => hs ? `<span class="rxc xs" style="background:${this._rdCol(s.name)}"><i>${esc(s.emoji || '🎧')}</i></span>` : `<span class="rxb sm" style="background:${this._rdCol(s.name)}">${esc(this._rdShort(s.name))}</span>`;
    const row = s => `<div class="rxe${x && x.id === s.id ? ' on' : ''}">${badge(s)}<div class="grow"><div class="t">${esc(s.name)}</div><div class="s">${esc([s.genre, s.cmd || K.cmd(s.name)].filter(Boolean).join(' · '))}</div></div>
      <button class="mpb" data-act="rdpick" data-id="${esc(s.id)}" aria-label="${esc(s.name)} ersetzen">${ic('pen', 16)}</button><button class="mpb${this._rdArm === s.id ? ' arm' : ''}" data-act="rddel" data-id="${esc(s.id)}" aria-label="${esc(s.name)} löschen">${ic(this._rdArm === s.id ? 'check' : 'trash', 16)}</button></div>`;
    return head + `<div class="lab2">${x ? (hs ? 'HÖRSPIEL' : 'SENDER') + ' ERSETZEN · ' + esc(x.name) : hs ? 'NEUES HÖRSPIEL' : 'NEUER SENDER'}</div>
      <div class="rxf"><input id="rdn" type="text" maxlength="40" placeholder="${hs ? 'Name, z. B. Die Schule der magischen Tiere' : 'Name, z. B. Radio Hochstift'}" value="${esc(x ? x.name : '')}" autocomplete="off" aria-label="Name">
        <input id="rdc" type="text" maxlength="120" placeholder="Alexa-Befehl (leer = „${hs ? 'spiele das neueste Album von ‹Name› auf Deezer' : 'spiele ‹Name›'}“)" value="${esc(x ? x.cmd : '')}" autocomplete="off" aria-label="Alexa-Befehl">
        <input id="rdg" type="text" maxlength="40" placeholder="${hs ? 'Untertitel, z. B. ab 4 (optional)' : 'Genre, z. B. Pop & Hits (optional)'}" value="${esc(x ? x.genre : '')}" autocomplete="off" aria-label="${hs ? 'Untertitel' : 'Genre'}">
        ${hs ? `<input id="rdj" type="text" maxlength="8" placeholder="Emoji fürs Bild, z. B. 🦄 (optional)" value="${esc(x ? x.emoji : '')}" autocomplete="off" aria-label="Emoji">
        <input id="rdz" type="text" maxlength="60" placeholder="Name bei Deezer für die Folgenliste (leer = Name)" value="${esc(x ? x.dz : '')}" autocomplete="off" aria-label="Name bei Deezer">` : ''}
        <div class="rxfb">${x ? `<button class="vbt" data-act="rdpick" data-id="">Abbrechen</button>` : ''}<button class="vbt big on" data-act="rdsave" ${this._rdBusy ? 'disabled' : ''}>${ic(x ? 'check' : 'plus', 15)}${x ? 'Ersetzen' : 'Hinzufügen'}</button></div></div>
      <div class="lab2">DEINE ${hs ? 'HÖRSPIELE' : 'SENDER'} · ${S.length}</div>${S.map(row).join('') || `<div class="empty sm">Noch keine ${K.nouns}</div>`}
      ${this._rdCache()?.err ? '<div class="card-note">Die Liste konnte gerade nicht geladen werden.</div>' : ''}`;
  }
  /* Liste noch leer: erst die Sender aus der Konfiguration übernehmen, damit Ersetzen/Löschen an der richtigen Stelle wirkt */
  /* UID des Eintrags; Sender aus der Konfiguration stehen nach dem Übernehmen an derselben Stelle in der Liste */
  _rdUid(s) { return s && (s.uid || this._rdCache()?.list?.[s.i]?.uid); }
  async _rdSeed(e) {
    if (!this._rdCache() || this._rdCache().err) await this._loadRd(true);
    const c = this._rdCache();
    if (!c || c.err) throw new Error('Liste nicht lesbar');
    if (c.list?.length) return;
    for (const s of this._rdStations()) await this._h.callService('todo', 'add_item', { entity_id: e, item: s.name, description: JSON.stringify({ genre: s.genre, cmd: s.cmd, url: s.url, emoji: s.emoji, dz: s.dz }) });
    await this._loadRd(true);
  }
  async _rdSave() {
    const e = this._rdListE(), R = this.shadowRoot, v = id => (R.getElementById(id)?.value || '').trim();
    const name = v('rdn'), cmd = v('rdc'), genre = v('rdg'), emoji = v('rdj'), dz = v('rdz');
    if (!e) return;
    if (!name) { this._toast('Bitte einen Namen eingeben'); R.getElementById('rdn')?.focus(); return; }
    const old = this._rdEd?.id && this._rdStations().find(s => s.id === this._rdEd.id);
    this._rdBusy = true; this._renderSheet();
    try {
      await this._rdSeed(e);
      const hs = this._rdKind() === 'hs', d = JSON.stringify({ genre, cmd, url: old?.url || '', emoji: hs ? emoji : '', dz: hs ? dz : '' });
      const uid = old && this._rdUid(old);
      if (uid) await this._h.callService('todo', 'update_item', { entity_id: e, item: uid, rename: name, description: d });
      else await this._h.callService('todo', 'add_item', { entity_id: e, item: name, description: d });
      this._toast(old ? `${old.name} ersetzt durch ${name}` : `${name} hinzugefügt`);
      this._rdEd = {};
    } catch (er) { this._toast('Speichern hat nicht geklappt', 3600); }
    this._rdBusy = false;
    await this._loadRd(true);
    this._sig = ''; this._render(); this._renderSheet();
  }
  async _rdDel(id) {
    const e = this._rdListE(), s = this._rdStations().find(x => x.id === id); if (!e || !s) return;
    if (this._rdArm !== id) { this._rdArm = id; this._renderSheet(); clearTimeout(this._rdAt); this._rdAt = setTimeout(() => { this._rdArm = null; if (this._sheet?.t === 'radio') this._renderSheet(); }, 3000); return; }
    this._rdArm = null;
    try {
      await this._rdSeed(e);
      const uid = this._rdUid(s);
      if (uid) await this._h.callService('todo', 'remove_item', { entity_id: e, item: uid });
      this._toast(`${s.name} gelöscht`);
    } catch (er) { this._toast('Löschen hat nicht geklappt', 3600); }
    if (this._rdEd?.id === id) this._rdEd = {};
    await this._loadRd(true);
    this._sig = ''; this._render(); this._renderSheet();
  }
  _rdAct(a, el) {
    switch (a) {
      case 'rdplay': this._rdPlay(el.dataset.id); break;
      case 'rdsel': this._rdSel = el.dataset.n; try { localStorage.setItem('home-aurora-radiop', el.dataset.n); } catch (er) { /* ok */ } this._sig = ''; this._render(); break;
      case 'rdpower': this._rdPower(); break;
      case 'rdtab': this._rdTab = el.dataset.m; try { localStorage.setItem('home-aurora-rdtab', el.dataset.m); } catch (er) { /* ok */ } this._sig = ''; this._render(); break;
      case 'rdprev': case 'rdnext': { const P = this._rdPlayer(); if (P) this._h.callService('media_player', a === 'rdnext' ? 'media_next_track' : 'media_previous_track', { entity_id: P.e }); break; }
      case 'rdqv': { const P = this._rdPlayer(), v = parseInt(el.dataset.v, 10); if (P && P.vol != null) this._rdVol(el.dataset.rel === '1' ? Math.round(P.vol * 100) + v : v); break; }
      case 'rdedit': this._rdEd = {}; this._rdArm = null; this._sheet = { t: 'radio' }; this._renderSheet(); this._loadRd(true); if (el.dataset.new) setTimeout(() => this.shadowRoot.getElementById('rdn')?.focus(), 80); break;
      case 'rdpick': this._rdEd = { id: el.dataset.id || null }; this._renderSheet(); if (el.dataset.id) { this._sh.scrollTop = 0; setTimeout(() => this.shadowRoot.getElementById('rdn')?.focus(), 60); } break;
      case 'rdsave': this._rdSave(); break;
      case 'rddel': this._rdDel(el.dataset.id); break;
      case 'hsopen': this._sheet = { t: 'hsf', id: el.dataset.id, n: this._rdStations('hs').find(s => s.id === el.dataset.id)?.name }; this._hsLim = 40; this._renderSheet(); break;
      case 'hsrnd': this._hsRnd(); break;
      case 'hsplay': this._hsPlay(el.dataset.a); break;
      case 'hsold': { const id = el.dataset.id; this._closeSheet(); this._rdPlay(id); break; }
      case 'hsmore': this._hsLim = (this._hsLim || 40) + 60; this._renderSheet(); break;
      case 'hsre': { const x = this._hsX(); if (x) this._hsLoad(x, true); break; }
    }
  }
  /* ── pz37: Folgen-Fenster · Folgen aus dem öffentlichen Deezer-Katalog (JSONP, ohne Anmeldung), Zufall ohne Wiederholung.
     Alexa bekommt den genauen Albumtitel („spiele das Album Folge 449 Das Rätsel um die Kornkreise von PAW Patrol auf Deezer“). ── */
  /* Die JSONP-Antwort läuft nur in einem abgeschotteten iframe (sandbox ohne allow-same-origin): fremdes Skript kommt
     nicht an hass oder das Dashboard heran; zurück kommen nur Daten per postMessage, die unten einzeln geprüft werden. */
  _dzJsonp(path) {
    return new Promise((res, rej) => {
      const f = document.createElement('iframe'), id = 'dz' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      const url = `https://api.deezer.com/${path}${path.includes('?') ? '&' : '?'}output=jsonp&callback=cb`.replace(/["'<>]/g, c => '%' + c.charCodeAt(0).toString(16)).replace(/&/g, '&amp;');
      const done = (v, er) => { clearTimeout(t); window.removeEventListener('message', on); f.remove(); if (er) rej(er); else res(v); };
      const on = ev => {
        if (ev.source !== f.contentWindow || !ev.data || ev.data.dz !== id) return;
        if (ev.data.e) done(null, new Error('nicht erreichbar')); else if (ev.data.d && ev.data.d.error) done(null, new Error('Deezer')); else done(ev.data.d);
      };
      const t = setTimeout(() => done(null, new Error('Zeitüberschreitung')), 9000);
      window.addEventListener('message', on);
      f.setAttribute('sandbox', 'allow-scripts'); f.setAttribute('aria-hidden', 'true'); f.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden';
      f.srcdoc = `<script>function cb(d){try{parent.postMessage({dz:'${id}',d:JSON.parse(JSON.stringify(d))},'*')}catch(e){parent.postMessage({dz:'${id}',e:1},'*')}}<\/script><script src="${url}" onerror="parent.postMessage({dz:'${id}',e:1},'*')"><\/script>`;
      document.body.appendChild(f);
    });
  }
  _hsX() { const H = this._sheet; if (H?.t !== 'hsf') return null; const S = this._rdStations('hs'); return S.find(s => s.id === H.id) || S.find(s => s.name === H.n) || null; }
  _hsKey(x) { return String(x.dz || x.name).trim().toLowerCase(); }
  _hsC(x) {
    const C = this._hsF = this._hsF || {}, k = this._hsKey(x);
    if (!C[k]) { try { const j = JSON.parse(localStorage.getItem('home-aurora-dz:' + k) || 'null'); if (j && j.list && Date.now() - j.t < 864e5) C[k] = j; } catch (e) { /* ok */ } }
    return C[k];
  }
  async _hsLoad(x, force) {
    const k = this._hsKey(x), q = String(x.dz || x.name).trim(), C = this._hsF = this._hsF || {}, old = this._hsC(x);
    if (old && (old.busy || (old.list && !force))) return;
    C[k] = { ...(old || {}), busy: true, err: '' }; if (this._hsX()) this._renderSheet();
    try {
      const norm = s => String(s).toLowerCase().replace(/[^a-z0-9äöüß]/g, '');
      const A = await this._dzJsonp('search/artist?q=' + encodeURIComponent(q) + '&limit=10'), arts = A?.data || [];
      const art = arts.find(a => norm(a.name) === norm(q)) || arts.find(a => norm(a.name).includes(norm(q)) || norm(q).includes(norm(a.name))) || arts[0];
      const aid = parseInt(art?.id, 10); if (!aid) throw new Error('nichts gefunden');
      const all = [], seen = new Set(); let next = `artist/${aid}/albums?limit=100`;
      for (let p = 0; next && p < 8; p++) {
        const r = await this._dzJsonp(next);
        if (!Array.isArray(r?.data)) throw new Error('unerwartete Antwort');
        r.data.forEach(a => { const t = String(a.title || '').trim(); if (t && !seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); { const img = String(a.cover_medium || a.cover || ''); all.push({ id: String(a.id), t, d: String(a.release_date || ''), img: /^https:\/\/[\w.-]+\.dzcdn\.net\//.test(img) ? img : '' }); } } });
        try { const u = r?.next ? new URL(r.next) : null; if (u) { u.searchParams.delete('output'); u.searchParams.delete('callback'); } next = u && u.hostname === 'api.deezer.com' ? u.pathname.slice(1) + u.search : ''; } catch (e) { next = ''; }
      }
      // Lieder und Filmmusik aussortieren, solange danach noch Folgen übrig bleiben
      const songs = /soundtrack|titelsong|songs?\b|lieder|karaoke|musik zum|music|remix|hits\b/i, eps = all.filter(a => !songs.test(a.t));
      const list = (eps.length ? eps : all).sort((a, b) => b.d.localeCompare(a.d)).slice(0, 600);
      C[k] = { t: Date.now(), art: String(art.name || q).slice(0, 80), list };
      try { localStorage.setItem('home-aurora-dz:' + k, JSON.stringify(C[k])); } catch (e) { /* voll: dann eben nur im Speicher */ }
    } catch (er) { C[k] = { ...(old || {}), busy: false, err: String(er?.message || er || 'Fehler') }; }
    if (this._hsX()) this._renderSheet();
  }
  /* zuletzt gehörte Folgen je Hörspiel (pro Gerät), damit der Zufall sie nicht gleich wiederholt */
  _hsRecent(k, add) {
    let R = {}; try { R = JSON.parse(localStorage.getItem('home-aurora-hsrecent') || '{}') || {}; } catch (e) { R = {}; }
    if (add) { R[k] = [add, ...(R[k] || []).filter(i => i !== add)].slice(0, 30); try { localStorage.setItem('home-aurora-hsrecent', JSON.stringify(R)); } catch (e) { /* ok */ } }
    return R[k] || [];
  }
  _hsCmd(a, art) {
    const t = a.t.replace(/\s*[([][^)\]]*[)\]]/g, '').replace(/[:–—|/]+|\s-\s/g, ' ').replace(/\s+/g, ' ').trim() || a.t;
    return `spiele das Album ${t}${art && !t.toLowerCase().includes(art.toLowerCase()) ? ' von ' + art : ''} auf Deezer`;
  }
  _hsPlay(aid) {
    const x = this._hsX(), c = x && this._hsC(x), a = c?.list?.find(i => i.id === aid); if (!a) return;
    this._hsRecent(this._hsKey(x), a.id);
    this._closeSheet();
    this._rdPlay(x.id, { cmd: this._hsCmd(a, c.art), label: a.t.replace(/\s*\([^)]*\)/g, '') });
  }
  _hsRnd() {
    const x = this._hsX(), c = x && this._hsC(x);
    if (!c?.list?.length) { this._closeSheet(); this._rdPlay(x?.id || this._sheet?.id); return; }
    const R = this._hsRecent(this._hsKey(x)), keep = Math.min(R.length, Math.floor(c.list.length / 2));
    const pool = c.list.filter(a => !R.slice(0, keep).includes(a.id)), P = pool.length ? pool : c.list;
    this._hsPlay(P[Math.floor(Math.random() * P.length)].id);
  }
  _sHsf() {
    const x = this._hsX(), P = this._rdPlayer();
    const close = `<button class="x" data-act="close">${ic('close', 20)}</button>`;
    if (!x) return `<div class="grab"></div><div class="sh"><div class="ico">${ic('music', 24)}</div><div><h2>Hörspiel</h2><p>nicht gefunden</p></div>${close}</div>`;
    const c = this._hsC(x); if (!c || (!c.list && !c.busy && !c.err)) this._hsLoad(x);
    const L = c?.list || [], R = this._hsRecent(this._hsKey(x)), lim = this._hsLim || 40, n = L.length;
    const yr = d => (d || '').slice(0, 4);
    const row = a => `<button class="hsr${R[0] === a.id ? ' on' : ''}" data-act="hsplay" data-a="${esc(a.id)}">${a.img ? `<img src="${esc(a.img)}" alt="" loading="lazy">` : `<span class="rxc xs" style="background:${this._rdCol(x.name)}"><i>${esc(x.emoji || '🎧')}</i></span>`}
      <span class="grow"><b>${esc(a.t)}</b><small>${esc([yr(a.d), R[0] === a.id ? 'zuletzt gehört' : R.includes(a.id) ? 'schon gehört' : ''].filter(Boolean).join(' · '))}</small></span>${ic('play', 16)}</button>`;
    const sub = c?.busy && !n ? 'Folgen werden bei Deezer gesucht …' : n ? `${n} ${n === 1 ? 'Folge' : 'Folgen'} bei Deezer · ${P ? 'spielt auf ' + esc(P.name) : 'kein Lautsprecher erreichbar'}` : 'Deezer';
    const body = n ? `<div class="hs-top"><button class="vbt big on" data-act="hsrnd" ${P ? '' : 'disabled'}>🎲 Zufällige Folge</button><button class="vbt big" data-act="hsplay" data-a="${esc(L[0].id)}" ${P ? '' : 'disabled'}>${ic('play', 15)}Neueste Folge</button></div>
        <div class="lab2">ALLE FOLGEN · NEUESTE ZUERST</div><div class="hs-list">${L.slice(0, lim).map(row).join('')}</div>
        ${n > lim ? `<button class="vbt hs-more" data-act="hsmore">Weitere ${Math.min(60, n - lim)} Folgen zeigen</button>` : ''}`
      : c?.busy || !c ? `<div class="empty sm">Folgen werden bei Deezer gesucht …</div>`
      : `<div class="card-note">Die Folgenliste von Deezer ist gerade nicht erreichbar. Du kannst das Hörspiel trotzdem starten, Alexa sucht dann selbst eine Folge aus.</div>
        <div class="hs-top"><button class="vbt big on" data-act="hsold" data-id="${esc(x.id)}" ${P ? '' : 'disabled'}>${ic('play', 15)}Trotzdem abspielen</button><button class="vbt big" data-act="hsre">Nochmal laden</button></div>`;
    return `<div class="grab"></div><div class="sh"><span class="rxc sm" style="background:${this._rdCol(x.name)}"><i>${esc(x.emoji || '🎧')}</i></span><div><h2>${esc(x.name)}</h2><p>${sub}</p></div>${close}</div>${body}`;
  }
