/* ───────────── pz44: Reiter Deezer auf der Radioseite · Deezer-Katalog durchsuchen, Alexa spielt den Treffer ───────────── */
  /* Gesucht wird im öffentlichen Deezer-Katalog über _dzJsonp (abgeschottetes iframe, ohne Anmeldung). Abgespielt wird wie bei
     Sendern und Hörspielen per Sprachbefehl über _rdCall („spiele die Playlist … auf Deezer“); Deezer muss dafür in der Alexa-App
     verknüpft sein. Favoriten stehen in radio.dz.favorites (name, cmd, genre, emoji). */
  _dzTypes() { return [['playlist', 'Playlists'], ['artist', 'Künstler'], ['album', 'Alben'], ['track', 'Titel']]; }
  _dzType() {
    if (this._dzT == null) { try { this._dzT = localStorage.getItem('home-aurora-dztype') || 'playlist'; } catch (e) { this._dzT = 'playlist'; } }
    return this._dzTypes().some(t => t[0] === this._dzT) ? this._dzT : 'playlist';
  }
  _dzFavs() {
    const D = { ...DEFAULTS.radio.dz, ...(this._rdC().dz || {}) };
    return (D.favorites || []).filter(f => f && f.name).map((f, i) => ({ id: 'f' + i, name: String(f.name), sub: String(f.genre || 'Favorit'), emoji: String(f.emoji || ''), img: '', cmd: String(f.cmd || `spiele ${f.name} auf Deezer`) }));
  }
  _dzImg(u) { u = String(u || ''); return /^https:\/\/[\w.-]+\.dzcdn\.net\//.test(u) ? u : ''; }
  /* ein Treffer als Kachel, mit dem Satz, den Alexa versteht (Titel wie bei Hörspielen ohne Klammern und Satzzeichen) */
  _dzItem(type, a) {
    const t = String((type === 'artist' ? a?.name : a?.title) || '').trim(); if (!t) return null;
    const s = this._hsSay(t), art = String(a.artist?.name || '').trim();
    const cmd = type === 'playlist' ? `spiele die Playlist ${s} auf Deezer` : type === 'artist' ? `spiele ${s} auf Deezer`
      : `spiele ${type === 'album' ? 'das Album' : 'den Titel'} ${s}${this._hsVon(s, art)} auf Deezer`;
    const fans = parseInt(a.nb_fan, 10), tr = parseInt(a.nb_tracks, 10);
    const sub = type === 'playlist' ? [a.user?.name ? 'von ' + a.user.name : '', tr > 0 ? tr + ' Titel' : '']
      : type === 'artist' ? [fans > 0 ? fans.toLocaleString('de-DE') + ' Fans' : 'Künstler'] : [art];
    return { id: type + ':' + String(a.id || t), name: t.slice(0, 120), sub: sub.filter(Boolean).join(' · ').slice(0, 80), emoji: '', img: this._dzImg(a.picture_medium || a.cover_medium || a.album?.cover_medium), cmd };
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
  _dzPlay(id) {
    const x = [...this._dzFavs(), ...(this._dzR?.list || [])].find(i => i.id === id), P = this._rdPlayer();
    if (!x) return;
    if (!P) { this._toast('Kein Lautsprecher erreichbar'); return; }
    const c = this._rdCall(P, { name: x.name, cmd: x.cmd });
    if (!c) { this._toast(`${P.name} kann Deezer nicht abspielen`, 3600); return; }
    this._dzLast = x.id;
    Promise.resolve(this._h.callService(...c)).then(() => this._toast(`${x.name} auf ${P.name}`), () => this._toast('Deezer konnte nicht gestartet werden', 3600));
    this._sig = ''; this._render();
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
