  /* ───────────── Sheets ───────────── */
  _sBat() {
    const B = this._batteries();
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('battery', 24)}</div><div><h2>Batterien</h2><p>${B.low.length ? B.low.length + ' schwach · ' : ''}${B.all.length} Geräte</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      ${B.low.length ? `<div class="lab2">SCHWACH · ${B.low.length}</div>${B.low.map(b => this._batRow(b)).join('')}` : '<div class="empty">✨ Alle Batterien sind in Ordnung</div>'}
      ${B.all.length > B.low.length ? `<div class="lab2">OKAY · ${B.all.length - B.low.length}</div>${B.all.filter(b => b.v > this._c.batteryLow).map(b => this._batRow(b)).join('')}` : ''}`;
  }
  _sDoors() {
    const K = this._contacts(), closed = K.all.filter(k => !k.open), nw = K.all.filter(k => !k.door).length, nd = K.all.length - nw, ow = K.open.filter(k => !k.door).length, od = K.open.length - ow;
    const tile = k => `<div class="ct ${k.open ? 'open' : ''}" data-act="more" data-e="${k.e}"><div class="bub">${ic(k.door ? 'door' : 'window', k.open ? 22 : 19)}</div><div class="tx"><div class="n">${esc(k.n)}</div><div class="s">${k.open ? 'offen' + (k.since && this._rel(k.since) !== '–' ? ' · ' + this._rel(k.since).replace('vor ', 'seit ').replace('gerade eben', 'gerade eben') : '') : 'zu'}</div></div></div>`;
    const part = (n, w, d) => n ? `${w ? `<span><b>${w}</b> ${w === 1 ? 'Fenster' : 'Fenster'}</span>` : ''}${d ? `<span><b>${d}</b> ${d === 1 ? 'Tür' : 'Türen'}</span>` : ''}` : '';
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('window', 24)}</div><div><h2>Fenster &amp; Türen</h2><p>${K.open.length ? K.open.length + ' von ' + K.all.length + ' offen' : 'Alles geschlossen'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="sum2"><div class="sbig cs ${K.open.length ? '' : 'ok'}">${K.open.length ? `<div class="big">${K.open.length}</div><span>von ${K.all.length} offen</span>` : `<span class="okl">${ic('check', 22)}Alles geschlossen</span>`}</div>
        <div class="cbox">${K.open.length ? part(1, ow, od) || '' : part(1, nw, nd)}<small>${K.open.length ? 'jetzt offen' : 'Kontakte gesamt'}</small></div></div>
      ${K.open.length ? `<div class="lab2">OFFEN · ${K.open.length}</div><div class="lg">${K.open.map(tile).join('')}</div>` : ''}
      ${closed.length ? `<div class="lab2">GESCHLOSSEN · ${closed.length}</div><div class="lg ctg">${closed.map(tile).join('')}</div>` : ''}`;
  }
  _sLights() {
    const ls = this._lights(), on = ls.filter(e => this._val(e) === 'on'), off = ls.filter(e => this._val(e) !== 'on');
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('bulb', 24)}</div><div><h2>Lichter</h2><p>${on.length} von ${ls.length} eingeschaltet</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="sum2"><div class="sbig"><div class="big">${on.length}</div><span>von ${ls.length} Lichtern an</span></div><button class="alloff" data-act="alloff">${ic('power', 22)}${this._armed ? 'Sicher?' : 'Alle aus'}</button></div>
      <div class="lab2">EINGESCHALTET · ${on.length}</div>${on.length ? `<div class="lg">${on.map(e => this._lightTile(e)).join('')}</div>` : '<div class="empty">✨ Alle Lichter sind aus</div>'}
      <div class="lab2">AUSGESCHALTET · ${off.length}</div>${off.length ? `<div class="lg">${off.map(e => this._lightTile(e)).join('')}</div>` : '<div class="empty">💡 Alle Lichter sind an</div>'}`;
  }
  _roomVent(r) {
    const V = this._ventData(), x = V.rooms.find(q => this._roomByName(q.name)?.id === r.id);
    if (!x) return '';
    const live = x.laeuft || (x.lueften && !x.pausiert);
    return `<div class="vr tap" style="margin-top:8px" data-act="vroom" data-e="${x?.entity_id || ''}"><div class="ico" style="${live ? 'color:#7dd3fc;background:rgba(56,189,248,.18)' : ''}">${ic('wind', 19)}</div><div><div class="t">${x.laeuft ? 'Lüftet gerade' : live ? 'Jetzt lüften' : x.lueften ? 'Später lüften' : 'Lüften nicht nötig'}</div><div class="s">${esc(x.empfehlung || '')}</div></div><div class="m">${x.minuten ? x.minuten + ' Min.' : ''}<small>Smart Ventilation</small></div></div>`;
  }
  /* Medien-Fähigkeiten nach HA-supported_features (PAUSE=1, VOLUME_SET=4, STOP=4096, VOLUME_STEP=1024, PLAY=16384) */
  _mpCaps(e) {
    const f = this._attr(e, 'supported_features') || 0;
    return { pause: !!(f & 1), play: !!(f & 16384), stop: !!(f & 4096), vol: !!(f & (4 | 1024)), pp: !!(f & 1) && !!(f & 16384) };
  }
  _mpBtns(e, pl) {
    const c = this._mpCaps(e), b = (s, ico, l, main) => `<button class="mpb${main ? ' main' : ''}" data-act="mp" data-e="${e}" data-s="${s}" aria-label="${l}">${ic(ico, 18)}</button>`;
    let main = '';
    if (pl) main = c.pause ? b('media_pause', 'pause', 'Pause', 1) : c.stop ? b('media_stop', 'close', 'Stopp', 1) : '';
    else if (c.play) main = b('media_play', 'play', 'Wiedergabe', 1);
    return (c.vol ? b('volume_down', 'minus', 'Leiser') : '') + main + (c.vol ? b('volume_up', 'plus', 'Lauter') : '');
  }
  _sRoom(r) {
    const I = this._room(r), cl = I.cl, heat = I.act === 'heating', off = I.mode === 'off', auto = !off && I.dh?.auto;
    const rank = { playing: 0, paused: 1, buffering: 1, idle: 2, on: 3, standby: 4, off: 5 }, groups = new Map();
    (r.media || []).forEach((item, gi) => {
      for (const e of (Array.isArray(item) ? item : [item])) {
        const s = this._s(e); if (!s || s.state === 'unavailable') continue;
        const k = Array.isArray(item) ? 'g' + gi : 'n:' + (s.attributes.friendly_name || e);
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push(e);
      }
    });
    // pro Gerät den Eintrag mit dem größten Funktionsumfang (Play/Pause) nehmen, danach den aktivsten Zustand
    const score = e => (this._mpCaps(e).pp ? 0 : 20) + (rank[this._val(e)] ?? 9);
    const seenM = new Map([...groups].map(([k, l]) => [k, l.slice().sort((a, b) => score(a) - score(b))[0]]));
    const media = [...seenM.values()].map(e => {
      const s = this._s(e), st = s.state, t = s.attributes.media_title, live = ['playing', 'paused', 'idle', 'on', 'standby', 'buffering'].includes(st), pl = st === 'playing';
      return `<div class="xr mpr"><div class="ico" style="${pl ? 'background:rgba(94,234,212,.2);color:#5eead4' : ''}">${ic(/tv/.test(e) ? 'tv' : 'play', 19)}</div><div class="grow" data-act="more" data-e="${e}"><div class="t">${esc(s.attributes.friendly_name || e)}</div><div class="s">${esc(t || ({ playing: 'Spielt', paused: 'Pausiert', idle: 'Bereit', off: 'Aus', standby: 'Standby', on: 'An' })[st] || st)}</div></div>
        ${live ? this._mpBtns(e, pl) : ''}</div>`;
    }).join('');
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic(r.icon, 24)}</div><div><h2>${esc(r.name)}</h2><p>${I.temp != null ? de(I.temp) + ' °C' : ''}${I.hum != null ? ' · ' + de(I.hum, 0) + ' % Luftfeuchte' : ''}${I.open ? ' · Fenster offen' : ''}${I.stale != null ? ` · <span class="stl">Sensor seit ${this._agoTxt(I.stale)} ohne Meldung</span>` : ''}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      ${cl ? `<div class="sctl"><div class="htap" data-act="heat" data-room="${r.id}" role="button" aria-label="Heizung öffnen">${off ? `<div class="big" style="font-size:46px">Aus</div>` : `<div class="big">${de(I.target)}<small class="u">°</small></div>`}<div class="l">${off ? 'Heizung ist ausgeschaltet' : auto ? 'Automatik' + (I.dh.label ? ' · ' + esc(I.dh.label) : '') : heat ? 'Heizt auf Zieltemperatur' : 'Zieltemperatur'}<span class="hmore">Heizung ${ic('chevron', 12)}</span></div></div>
        <div style="display:flex;gap:10px;align-items:center">${off ? `<button class="qb on" data-act="hvac" data-e="${r.climate}">${ic('power', 16)}Einschalten</button>` : auto ? `<button class="rbn" style="color:#fb923c;background:rgba(251,146,60,.2)" data-act="hvac" data-e="${r.climate}">${ic('power', 20)}</button>` : `<button class="rbn" data-act="temp" data-e="${r.climate}" data-d="-0.5">${ic('minus', 22)}</button><button class="rbn" data-act="temp" data-e="${r.climate}" data-d="0.5">${ic('plus', 22)}</button><button class="rbn" style="color:#fb923c;background:rgba(251,146,60,.2)" data-act="hvac" data-e="${r.climate}">${ic('power', 20)}</button>`}</div></div>` : ''}
      ${this._humHint(r, I)}${this._trend(r, I.temp != null ? tempCol(I.temp) : '#fb923c')}
      ${this._roomVent(r)}
      ${I.lights.length ? `<div class="lab2">LICHTER · ${I.on.length}/${I.lights.length}</div><div class="lg">${I.lights.map(e => this._lightTile(e)).join('')}</div>` : ''}
      ${media ? `<div class="lab2">MEDIEN</div><div class="mcol">${media}</div>` : ''}`;
  }

