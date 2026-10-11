  /* ───────────── v6: Wetterradar ───────────── */
  _rdrCfg() {
    const u = this._c.rdr || {};
    return Object.assign({
      wms: 'https://maps.dwd.de/geoserver/dwd/wms', radar: 'dwd:Niederschlagsradar', bolt: 'dwd:Blitzdichte', warn: 'dwd:Warnungen_Landkreise',
      base: { dark: ['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'], light: ['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}'] }, past: 120, future: 120, zoom: 8, factor: 1, strikeKm: 50, rings: [10, 25],
      mock: !!this._h?.config?.mock, embed: this._c.radarUrl || this._rdEmbed(), kw: { storm: 'binary_sensor.kachelmannwetter_gewitter_erwartet' },
    }, u);
  }
  _rdEmbed() {
    const c = this._h?.config || {}, la = (c.latitude ?? 51.7235).toFixed(3), lo = (c.longitude ?? 8.5633).toFixed(3);
    return `https://radar.wo-cloud.com/mobile/embedded?wrx=${la},${lo}&wrm=8&wry=${la},${lo}`;
  }
  _rdSrc() { if (!this._rdSrcPref) { try { this._rdSrcPref = localStorage.getItem('home-aurora-rdsrc'); } catch (e) { /* ok */ } } return this._rdSrcPref === 'own' ? 'own' : 'wo'; }
  _rdSetSrc(s) {
    this._rdSrcPref = s === 'own' ? 'own' : 'wo'; try { localStorage.setItem('home-aurora-rdsrc', this._rdSrcPref); } catch (e) { /* ok */ }
    this._rdr?.setSrc(this._rdSrcPref); this._main?.querySelectorAll('.rdc .h .rd-src').forEach(el => { el.outerHTML = rdSeg(this._rdSrcPref); });
  }
  _rdrWarns() {
    const out = [], A = this._c.alerts || {};
    [['now', A.now, false], ['pre', A.pre, true]].forEach(([k, e, pre]) => {
      const a = this._s(e)?.attributes; if (!a) return;
      const n = Math.min(12, +a.warning_count || 0);
      for (let i = 1; i <= n; i++) {
        const p = 'warning_' + i + '_', name = a[p + 'name']; if (!name) continue;
        out.push({ k, i, pre, name, level: +a[p + 'level'] || (pre ? 1 : 2), type: a[p + 'type'] || '', head: a[p + 'headline'] || '', desc: a[p + 'description'] || '', instr: a[p + 'instruction'] || '', start: a[p + 'start'], end: a[p + 'end'] });
      }
    });
    return out.sort((a, b) => (a.pre - b.pre) || b.level - a.level);
  }
  _rdrMount() {
    if (!this._built) return;
    const sh = this._sheet?.t === 'radar', slot = (sh ? this._sh : this._main).querySelector('.rdslot');
    if (!slot) { this._rdr?.pause(); return; }
    if (!this._rdr) this._rdr = new AuroraRadar(this);
    const r = this._rdr, moved = r.root.parentNode !== slot;
    if (moved) slot.appendChild(r.root);
    r.setMode(sh); r.resume(); if (moved) r.resize(); r.upd();
  }
  _radarCard(i, cls = 's6') {
    return `<div class="c ${cls} rdc" style="--i:${i}"><div class="h">${ic('radar', 14)}Regenradar<span class="r">${rdSeg(this._rdSrc())}<button class="rd-open" data-act="radar">${ic('expand', 14)}<span class="rd-ol">Vollbild</span></button></span></div><div class="rdslot" data-keep="1"></div></div>`;
  }
  _sRadar() { return `<div class="rdslot full" data-keep="1"></div>`; }
  _sWarn() {
    const s = this._sheet, w = this._rdrWarns().find(x => x.k === s.k && x.i === s.i) || null;
    const back = s.from === 'radar' ? 'radar' : 'close';
    if (!w) return `<div class="grab"></div><div class="sh"><div class="ico">${ic('alert', 24)}</div><div><h2>Wetterwarnung</h2><p>Keine aktive Warnung</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div><div class="empty">Diese Warnung ist nicht mehr aktiv.</div>`;
    const fmt = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); };
    const LV = ['', 'Wetterwarnung', 'Markante Wetterwarnung', 'Unwetterwarnung', 'Extreme Unwetterwarnung'];
    const others = this._rdrWarns().filter(x => x !== w);
    return `<div class="grab"></div><div class="sh"><div class="ico wl l${w.level}">${ic('alert', 24)}</div><div><h2>${esc(w.name)}</h2><p>${w.pre ? 'Vorabinformation' : LV[Math.min(4, w.level)]} · Stufe ${w.level}</p></div><button class="x" data-act="${back}">${ic(back === 'radar' ? 'radar' : 'close', 20)}</button></div>
      <div class="wbox l${w.level} ${w.pre ? 'pre' : ''}"><div class="wt"><span>${w.start ? 'von ' + esc(fmt(w.start)) : ''}</span><span>${w.end ? 'bis ' + esc(fmt(w.end)) : ''}</span></div>${w.head ? `<h3>${esc(w.head)}</h3>` : ''}
      ${w.desc ? `<p class="wd">${esc(w.desc)}</p>` : ''}${w.instr ? `<div class="wi"><b>Verhaltenshinweise</b><p>${esc(w.instr)}</p></div>` : ''}<small>Quelle: Deutscher Wetterdienst</small></div>
      ${others.length ? `<div class="wo">${others.map(o => `<button class="rd-w l${o.level} ${o.pre ? 'pre' : ''}" data-act="warn" data-k="${o.k}" data-i="${o.i}" data-from="${esc(s.from || '')}">${ic('alert', 14)}<span>${o.pre ? 'Vorab: ' : ''}${esc(o.name)}</span></button>`).join('')}</div>` : ''}`;
  }

