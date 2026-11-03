/* ───────────── pz44: Reiter Deezer auf der Radioseite · Deezer-Katalog durchsuchen, Alexa spielt den Treffer ───────────── */
  /* Gesucht wird im öffentlichen Deezer-Katalog über _dzJsonp (abgeschottetes iframe, ohne Anmeldung). pz49: Abgespielt wird über
     die Deezer-Suche von Alexa Media (play_media DEEZER, „das Album … von …“); den Sprachbefehl als Text („spiele … auf Deezer“)
     verstand Alexa oft nicht und blieb stumm. Echos ohne Alexa Media, oder wenn nach 15 s nichts Neues läuft, bekommen den
     Sprachbefehl über _rdCall. Deezer muss in der Alexa-App verknüpft sein. Favoriten: radio.dz.favorites (name, cmd, genre, emoji). */
  _dzTypes() { return [['playlist', 'Playlists'], ['artist', 'Künstler'], ['album', 'Alben'], ['track', 'Titel']]; }
  _dzType() {
    if (this._dzT == null) { try { this._dzT = localStorage.getItem('home-aurora-dztype') || 'playlist'; } catch (e) { this._dzT = 'playlist'; } }
    return this._dzTypes().some(t => t[0] === this._dzT) ? this._dzT : 'playlist';
  }
  _dzFavs() {
    const D = { ...DEFAULTS.radio.dz, ...(this._rdC().dz || {}) };
    return (D.favorites || []).filter(f => f && f.name).map((f, i) => { const cmd = String(f.cmd || `spiele ${f.name} auf Deezer`); return { id: 'f' + i, name: String(f.name), sub: String(f.genre || 'Favorit'), emoji: String(f.emoji || ''), img: '', cmd, q: String(f.q || this._dzQOf(cmd)) }; });
  }
  /* Suchsatz für Alexa Media aus einem Sprachbefehl: „spiele meinen Flow auf Deezer“ → „meinen Flow“ */
  _dzQOf(cmd) { return String(cmd).replace(/^\s*spiel[e]?\s+/i, '').replace(/\s+(auf|von|bei)\s+deezer\s*$/i, '').trim(); }
  /* wie _hsSay, dazu Emojis und Sonderzeichen weg („Weihnachtssongs 2026 🎄“ → „Weihnachtssongs 2026“) */
  _dzSay(t) { return this._hsSay(String(t || '').replace(/&/g, ' und ')).replace(/[^\p{L}\p{N}\s'-]+/gu, ' ').replace(/\s+/g, ' ').trim() || this._hsSay(t); }
  _dzImg(u) { u = String(u || ''); return /^https:\/\/[\w.-]+\.dzcdn\.net\//.test(u) ? u : ''; }
  /* ein Treffer als Kachel, mit dem Satz, den Alexa versteht (Titel wie bei Hörspielen ohne Klammern und Satzzeichen) */
  _dzItem(type, a) {
    const t = String((type === 'artist' ? a?.name : a?.title) || '').trim(); if (!t) return null;
    const s = this._dzSay(t), art = this._dzSay(a.artist?.name || '');
    const q = type === 'playlist' ? `die Playlist ${s}` : type === 'artist' ? s : `${type === 'album' ? 'das Album' : 'den Titel'} ${s}${this._hsVon(s, art)}`;
    const cmd = `spiele ${q} auf Deezer`;
    const fans = parseInt(a.nb_fan, 10), tr = parseInt(a.nb_tracks, 10);
    const sub = type === 'playlist' ? [a.user?.name ? 'von ' + a.user.name : '', tr > 0 ? tr + ' Titel' : '']
      : type === 'artist' ? [fans > 0 ? fans.toLocaleString('de-DE') + ' Fans' : 'Künstler'] : [art];
    return { id: type + ':' + String(a.id || t), name: t.slice(0, 120), sub: sub.filter(Boolean).join(' · ').slice(0, 80), emoji: '', img: this._dzImg(a.picture_medium || a.cover_medium || a.album?.cover_medium), cmd, q, type, aid: /^\d+$/.test(String(a.id)) ? String(a.id) : '', art: String(a.artist?.name || '') };
  }
  async _dzSearch(q0) {
    const inp = this.shadowRoot.getElementById('dzq'), q = String(q0 ?? inp?.value ?? this._dzQ ?? '').trim().slice(0, 100);
    if (!q) { inp?.focus(); return; }
    const type = this._dzType(), n = this._dzN = (this._dzN || 0) + 1, old = this._dzR;
    this._dzQ = q;
    this._dzR = { q, type, busy: true, list: old && old.q === q && old.type === type ? old.list : [] };
    this._sig = ''; this._render();
    let R;
    try {
      const r = await this._dzJsonp(`search/${type}?q=${encodeURIComponent(q)}&limit=30`);
      if (!Array.isArray(r?.data)) throw new Error('unerwartete Antwort');
      R = { q, type, list: r.data.map(a => this._dzItem(type, a)).filter(Boolean) };
    } catch (er) { R = { q, type, list: [], err: String(er?.message || er || 'Fehler') }; }
    if (n !== this._dzN) return;
    this._dzR = R; this._sig = ''; this._render();
  }
  _dzPlay(id, plain) {
    const x0 = [...this._dzFavs(), ...(this._dzR?.list || [])].find(i => i.id === id), P = this._rdPlayer();
    if (!x0) return;
    const x = plain ? { ...x0, chained: true } : x0;
    if (!P) { this._toast('Kein Lautsprecher erreichbar'); return; }
    const reg = this._h.entities || {}, am = (P.ents || []).find(e => reg[e]?.platform === 'alexa_media') || (!reg[P.e] ? P.e : null);
    const c = this._rdCall(P, { name: x.name, cmd: x.cmd });
    if (!am && !c) { this._toast(`${P.name} kann Deezer nicht abspielen`, 3600); return; }
    this._dzLast = x.id;
    if (x.type === 'album' && x.aid && !x.chained) { this._dzAlbum(P, x); return; }
    const fail = () => this._toast('Deezer konnte nicht gestartet werden', 3600);
    if (am && x.q) {
      const before = this._attr(am, 'media_title') || '';
      Promise.resolve(this._h.callService('media_player', 'play_media', { entity_id: am, media: { media_content_type: 'DEEZER', media_content_id: x.q } })).then(() => {
        this._toast(`${x.name} auf ${P.name}`);
        // läuft nach 15 s nichts Neues, versucht es Alexa noch einmal per Sprachbefehl
        setTimeout(() => { const s = this._h.states[am]; if (c && s && !(s.state === 'playing' && (s.attributes?.media_title || '') !== before)) Promise.resolve(this._h.callService(...c)).catch(() => { /* ok */ }); }, 15000);
      }, () => (c ? Promise.resolve(this._h.callService(...c)).then(() => this._toast(`${x.name} auf ${P.name}`), fail) : fail()));
    } else Promise.resolve(this._h.callService(...c)).then(() => this._toast(`${x.name} auf ${P.name}`), fail);
    this._sig = ''; this._render();
  }
  /* pz49: Hörspiel-Alben („Weihnachtsmann & Co. KG Folge 1“) findet Alexa unter dem Albumnamen oft nicht, einzelne Titel aber schon.
     Deshalb wie bei den Hörspielen: Titel des Albums von Deezer holen und über radio.hsp.script ab Titel 1 nacheinander spielen.
     Ohne Skript, ohne Titel oder wenn Titel 1 nicht anläuft: Album über die Alexa-Media-Suche wie bisher. */
  async _dzAlbum(P, x) {
    const sc = { ...DEFAULTS.radio.hsp, ...(this._rdC().hsp || {}) }.script, again = () => this._dzPlay(x.id, true);
    let T = [];
    if (sc && this._h.states[sc]) {
      try { const r = await this._dzJsonp(`album/${x.aid}/tracks?limit=100`); T = (r?.data || []).map(i => String(i.title || '').trim()).filter(Boolean).slice(0, 80); } catch (e) { T = []; }
    }
    if (T.length && this._hsChain(P, { name: x.name }, sc, T, x.art, { label: x.name }, again)) return;
    again();
  }
  _dzAct(a, el) {
    switch (a) {
      case 'dzplay': this._dzPlay(el.dataset.id); break;
      case 'dzsearch': this._dzSearch(); break;
      case 'dztype':
        this._dzT = el.dataset.m; try { localStorage.setItem('home-aurora-dztype', el.dataset.m); } catch (er) { /* ok */ }
        if (this._dzQ) this._dzSearch(this._dzQ); else { this._sig = ''; this._render(); }
        break;
    }
  }
  _vDz(P, players, vol) {
    const pl = !!P?.pl, f = P ? this._attr(P.e, 'supported_features') || 0 : 0, c = P ? this._mpCaps(P.e) : {}, on = P && (P.pl || P.ps);
    const b = (act, ico, l, x, main) => `<button class="mpb${main ? ' main' : ''}" data-act="${act}" aria-label="${l}" ${x ? '' : 'disabled'}>${ic(ico, 20)}</button>`;
    const R = this._dzR, type = this._dzType(), F = this._dzFavs();
    const cover = x => x.img ? `<span class="rxc dzc"><img src="${esc(x.img)}" alt="" loading="lazy"></span>` : `<span class="rxc" style="background:${this._rdCol(x.name)}"><i>${esc(x.emoji || '🎵')}</i><b>${esc(x.name)}</b></span>`;
    const tile = x => `<button class="c rxh${this._dzLast === x.id ? ' on' : ''}" data-act="dzplay" data-id="${esc(x.id)}">${cover(x)}<span class="rxn">${esc(x.name)}</span><span class="rxg">${esc(x.sub || 'Deezer')}</span></button>`;
    const title = on ? P.title || 'Wiedergabe' : P ? 'Bereit' : 'Kein Player erreichbar';
    const sub = on ? P.artist || '' : P ? 'Suche unten oder tippe auf einen Favoriten' : 'Alle Lautsprecher sind offline';
    const types = `<div class="rx-tabs rx-cats">${this._dzTypes().map(t => `<button class="${type === t[0] ? 'on' : ''}" data-act="dztype" data-m="${t[0]}">${t[1]}</button>`).join('')}</div>`;
    const res = !R ? `<div class="empty sm">Suche nach Künstlern, Alben, Playlists oder Titeln. Tippen = auf ${P ? esc(P.name) : 'dem Lautsprecher'} abspielen.</div>`
      : R.busy && !R.list.length ? `<div class="empty sm">Suche bei Deezer …</div>`
      : R.err ? `<div class="card-note">Die Deezer-Suche ist gerade nicht erreichbar. Versuch es gleich noch einmal.</div>`
      : !R.list.length ? `<div class="empty sm">Bei Deezer nichts zu „${esc(R.q)}“ gefunden</div>`
      : `<div class="rx-hs">${R.list.map(tile).join('')}</div>`;
    const hits = R && !R.err && R.list.length ? `<span class="r">${R.list.length} Treffer für „${esc(R.q)}“</span>` : '';
    return `<div class="rx">
        <section class="c rx-hbar"><span class="rxc sm" style="background:linear-gradient(135deg,#a238ff,#ef5466)"><i>🎵</i></span>
          <div class="rx-tr"><div class="rx-k">${pl ? 'JETZT LÄUFT' : P?.ps ? 'PAUSIERT' : 'DEEZER'}</div><div class="rx-t">${esc(title)}</div><div class="rx-a">${esc(sub)}</div></div>
          <div class="rx-tp">${b('rdprev', 'prev', 'Zurück', on && f & 16)}${b('rdpower', pl ? 'pause' : 'play', pl ? 'Pause' : 'Abspielen', P && (pl ? c.pause || c.stop : P.ps && c.play), 1)}${b('rdnext', 'next', 'Weiter', on && f & 32)}</div>
          <div class="rx-vol rx-hv"><div class="rx-vh2"><span>LAUTSTÄRKE</span><b>${vol != null ? vol + ' %' : '–'}</b></div>
            <input class="rx-bar" type="range" min="0" max="100" value="${vol ?? 0}" data-act="rdvol" aria-label="Lautstärke" ${vol != null ? '' : 'disabled'}></div></section>
        ${players}
        ${F.length ? `<div class="h">${ic('heart', 14)} Favoriten <span class="r">Tippen = sofort spielen</span></div><div class="rx-hs">${F.map(tile).join('')}</div>` : ''}
        <div class="h">${ic('search', 14)} Deezer durchsuchen ${hits}</div>
        <div class="addrow"><input id="dzq" type="search" maxlength="100" placeholder="Künstler, Album, Playlist oder Titel" value="${esc(this._dzQ || '')}" autocomplete="off" enterkeyhint="search" aria-label="Deezer durchsuchen"><button data-act="dzsearch" aria-label="Suchen">${ic('search', 20)}</button></div>
        ${types}${res}
      </div>`;
  }
