  /* ───────────── pz47: Lichtsteuerung (Integration patrickbrundiers-dev/Lichtsteuerung) ───────────── */
  /* Je Raum legt die Integration sensor.lichtsteuerung_<raum>_status (Zustand + Attribute anwesend, dunkel, modus, manuell …),
     switch …_automatik, switch …_schlafmodus, button …_automatik_zurucksetzen und sensor …_leuchtdauer_heute an.
     Erkannt wird automatisch; der Aurora-Raum passt, wenn <raum> seiner id/seinem Namen entspricht oder damit beginnt
     (Bad → badezimmer). Abweichend: im Raum `ls: '<raum>'` eintragen. Hausweite Aktionen über die Dienste lichtsteuerung.* */
  _lsAll() {
    return this._memo('lsAll', () => {
      const S = this._h.states, out = [];
      for (const k in S) {
        const m = /^sensor\.lichtsteuerung_(.+)_status$/.exec(k); if (!m) continue;
        const g = m[1], x = p => (p in S ? p : null);
        out.push({ slug: g, st: k, auto: x(`switch.lichtsteuerung_${g}_automatik`), sleep: x(`switch.lichtsteuerung_${g}_schlafmodus`), reset: x(`button.lichtsteuerung_${g}_automatik_zurucksetzen`), dur: x(`sensor.lichtsteuerung_${g}_leuchtdauer_heute`), name: String(S[k].attributes?.friendly_name || g).replace(/^Lichtsteuerung\s+/i, '').replace(/\s+Status$/i, '') });
      }
      return out.sort((a, b) => a.name.localeCompare(b.name, 'de'));
    });
  }
  _lsSlug(t) { return String(t || '').toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
  _ls(r) {
    if (!r || r.ls === false) return null;
    const L = this._lsAll(); if (!L.length) return null;
    if (r.ls) return L.find(x => x.slug === r.ls) || null;
    const ids = [this._lsSlug(r.id), this._lsSlug(r.name)].filter(Boolean);
    return L.find(x => ids.includes(x.slug)) || L.find(x => ids.some(i => i.length >= 3 && (x.slug.startsWith(i) || i.startsWith(x.slug)))) || null;
  }
  _lsRoomOf(x) { return this._c.rooms.find(r => this._ls(r)?.slug === x.slug) || null; }
  _lsInfo(x) {
    const s = this._s(x.st), a = s?.attributes || {}, st = s?.state;
    const M = { deaktiviert: ['Automatik aus', '#94a3b8'], aus: ['Licht aus', '#94a3b8'], an: ['Licht an', '#fbbf24'], gedimmt: ['Gedimmt', '#f59e0b'], manuell: ['Von Hand bedient', '#a78bfa'], abwesend: ['Abwesend', '#60a5fa'], simulation: ['Anwesenheit simuliert', '#5eead4'] };
    const P = { tag: 'Tag', morgen: 'Morgen', abend: 'Abend', nacht: 'Nacht', schlaf: 'Schlaf', tv: 'TV' };
    const ph = v => (v ? P[v] || String(v).charAt(0).toUpperCase() + String(v).slice(1) : '');
    const dur = x.dur ? this._num(x.dur) : null;
    return { ok: !!s && okv(st), st, a, label: (M[st] || [okv(st) ? st : 'Nicht erreichbar'])[0], col: (M[st] || [0, '#94a3b8'])[1], modus: ph(a.modus), phase: ph(a.tagesphase), dur, autoOn: x.auto ? this._val(x.auto) === 'on' : st !== 'deaktiviert', sleepOn: x.sleep ? this._val(x.sleep) === 'on' : !!a.schlafmodus, manual: st === 'manuell' || !!a.manuell };
  }
  _lsDur(h) { if (h == null) return ''; const m = Math.round(h * 60); return m < 60 ? m + ' Min.' : de(h, 1) + ' h'; }
  /* Block im Raumfenster (und auf der Bad-Seite): Status, was die Automatik gerade sieht, Schalter */
  _lsCard(r, bare) {
    const x = this._ls(r); if (!x) return '';
    const I = this._lsInfo(x), a = I.a;
    const chips = [I.modus && ['clock', 'Modus <b>' + esc(I.modus) + '</b>'], [a.anwesend ? 'user' : 'door', a.anwesend ? '<b>anwesend</b>' : 'leer'], [a.dunkel ? 'moon' : 'sun', a.dunkel ? '<b>dunkel</b>' : 'hell'],
      a.tv && ['tv', '<b>TV läuft</b>'], I.sleepOn && ['bed', '<b>Schlafmodus</b>'], a.nachtpfad_aktiv && ['moon', '<b>Nachtlicht</b>'], a.ausschalt_timer_aktiv && ['clock', '<b>schaltet gleich aus</b>'], a.laenger_anwesend && ['user', 'länger da']].filter(Boolean)
      .map(c => `<span class="chip">${ic(c[0], 14)}${c[1]}</span>`).join('');
    const sub = [I.dur != null ? 'heute ' + this._lsDur(I.dur) + ' an' : '', a.letzte_aktion ? 'zuletzt: ' + esc(a.letzte_aktion) : ''].filter(Boolean).join(' · ');
    const btn = (on, act, e, icon, txt, extra = '') => e ? `<button class="qb ${on ? 'on' : ''}" data-act="${act}" data-e="${e}"${extra}>${ic(icon, 14)}${txt}</button>` : '';
    return `${bare ? '' : '<div class="lab2">LICHT-AUTOMATIK</div>'}<div class="lsx" style="--lsc:${I.col}">
      <div class="vr"><div class="ico">${ic('bulb', 19)}</div><div><div class="t">${esc(I.label)}</div><div class="s">${sub || 'Lichtsteuerung ' + esc(x.name)}</div></div><div class="m">${I.manual ? '✋' : I.autoOn ? 'Auto' : 'Aus'}<small>Lichtsteuerung</small></div></div>
      ${I.ok ? `<div class="chips">${chips}</div>` : ''}
      <div class="lsb">${btn(I.autoOn, 'toggle', x.auto, 'power', 'Automatik')}${btn(I.sleepOn, 'toggle', x.sleep, 'bed', 'Schlafmodus')}${I.manual ? btn(false, 'press', x.reset, 'refresh', 'Manuell beenden', ' data-msg="Automatik übernimmt wieder"') : ''}</div></div>`;
  }
  _lsHouseE() { const e = this._c.lightCtl?.house || 'input_select.hausmodus'; return this._s(e) ? e : null; }
  /* Block im Lichter-Fenster: hausweite Aktionen, Hausmodus, alle Räume der Lichtsteuerung */
  _lsHouse() {
    const L = this._lsAll(); if (!L.length) return '';
    const he = this._lsHouseE(), hm = he ? this._val(he) : null, anyMan = L.some(x => this._lsInfo(x).manual);
    const b = (m, icon, txt, cls = '') => `<button class="qb ${cls}" data-act="ls" data-m="${m}">${ic(icon, 14)}${txt}</button>`;
    const rows = L.map(x => {
      const I = this._lsInfo(x), r = this._lsRoomOf(x);
      return `<div class="vr ${r ? 'tap' : ''}" style="--lsc:${I.col}" ${r ? `data-act="room" data-room="${r.id}"` : ''}><div class="ico lsi">${ic(r?.icon || 'bulb', 19)}</div><div><div class="t">${esc(r?.name || x.name)}</div><div class="s">${esc(I.label)}${I.modus ? ' · ' + esc(I.modus) : ''}${I.a.anwesend ? ' · anwesend' : ''}${I.sleepOn ? ' · Schlafmodus' : ''}</div></div><div class="m">${I.dur != null ? this._lsDur(I.dur) : ''}<small>${I.manual ? 'von Hand' : I.autoOn ? 'Automatik' : 'Automatik aus'}</small></div></div>`;
    }).join('');
    return `<div class="lab2">LICHT-AUTOMATIK</div>
      ${he ? `<div class="seg wide lsm">${(this._attr(he, 'options') || []).map(o => `<button class="${o === hm ? 'on' : ''}" data-act="lsmode" data-e="${he}" data-m="${esc(o)}">${esc(String(o).trim())}</button>`).join('')}</div>` : ''}
      <div class="lsb">${b('night', 'moon', 'Gute Nacht')}${b('morning', 'sun', 'Guten Morgen')}${b('on', 'power', 'Automatik an')}${b('off', 'close', this._lsArm ? 'Sicher? Alle aus' : 'Automatik aus', this._lsArm ? 'on' : '')}${anyMan ? b('reset', 'refresh', 'Manuell überall beenden') : ''}</div>
      ${rows}`;
  }
  _lsAct(m) {
    const h = this._h;
    if (m === 'off' && !this._lsArm) { this._lsArm = true; this._renderSheet(); clearTimeout(this._lsAt); this._lsAt = setTimeout(() => { this._lsArm = false; if (this._sheet) this._renderSheet(); }, 3000); return; }
    this._lsArm = false; clearTimeout(this._lsAt);
    const A = { night: ['set_sleep_mode', { sleep: true }, 'Gute Nacht 🌙 · Schlafmodus in allen Räumen'], morning: ['set_sleep_mode', { sleep: false }, 'Guten Morgen ☀️ · Schlafmodus aus'], on: ['set_enabled', { enabled: true }, 'Licht-Automatik überall an'], off: ['set_enabled', { enabled: false }, 'Licht-Automatik überall aus'], reset: ['reset', {}, 'Automatik übernimmt wieder überall'] }[m];
    if (!A) return;
    h.callService('lichtsteuerung', A[0], A[1]); this._toast(A[2]); if (this._sheet) this._renderSheet();
  }
