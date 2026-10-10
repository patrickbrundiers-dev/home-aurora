/* ───────────── Home Aurora Wide: Querformat für Tablet & Desktop ───────────── */
const CSSW = `
/* Gerüst: volle Breite, Startseite füllt genau den Bildschirm */
@media (min-width:861px){.app.wide .shell{grid-template-columns:84px minmax(0,1fr)}.app.wide main{max-width:none;padding:16px 20px 16px 4px}.app.wide .vh h1{font-size:28px}}

/* Startseite = Cockpit */
.cock{display:flex;flex-direction:column;gap:12px}
@media (min-width:1200px){.cock{height:var(--cockh,calc(100vh - var(--header-height,0px) - 32px));min-height:620px}}
@supports (height:100dvh){@media (min-width:1200px){.cock{height:var(--cockh,calc(100dvh - var(--header-height,0px) - 32px))}}}
.ctop{display:flex;align-items:center;gap:10px;min-height:40px;flex:none}
.ctop .alerts{margin:0;flex-wrap:nowrap;flex:none}.ctop .qa{margin:0;padding:2px 0;flex:1 1 0;min-width:0;flex-wrap:nowrap;overflow-x:auto;-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent);padding-right:24px}
.ctop .al,.ctop .qp{flex:none;white-space:nowrap}
.ctop .gap{flex:1}
.ctop .tb{flex:none;display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:rgba(var(--wh),.07);border:1px solid var(--line);font-size:13px;color:var(--tx2);white-space:nowrap}
.ctop .tb:hover{color:var(--tx);background:rgba(var(--wh),.12)}
.stg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;flex:none}
.app.wide .stg .st{grid-column:auto;display:grid;grid-template-columns:auto auto minmax(0,1fr);grid-template-areas:"ico num lab" "ico num sub";align-items:center;column-gap:14px;row-gap:1px;min-height:0;padding:12px 16px;border-radius:24px}
.app.wide .st .top{grid-area:ico}.app.wide .st .ico{width:44px;height:44px;border-radius:15px}
.app.wide .st>div:last-child{display:contents}
.app.wide .st .v{grid-area:num;font-size:40px;line-height:1;margin:0}.app.wide .st .v[style]{font-size:24px!important}
.app.wide .st .l{grid-area:lab;align-self:end;margin:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.app.wide .st .sub{grid-area:sub;align-self:start;margin:0;font-size:11.5px}
.cols{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:minmax(270px,.9fr) minmax(0,1.75fr) minmax(270px,.95fr);gap:14px}
.col{display:flex;flex-direction:column;gap:14px;min-width:0;min-height:0}
.col>.c{padding:16px 18px;border-radius:26px}
.col>.grow{flex:1 1 0;min-height:0}
.col>.fix{flex:none}
/* Hero */
.app.wide .hero{min-height:0;flex-direction:column;flex-wrap:nowrap;gap:12px;justify-content:space-between}
.app.wide .hero .hl{min-width:0;flex:1;gap:10px}
.app.wide .clock{font-size:clamp(64px,11vh,116px);line-height:.95}
.app.wide .date{margin-top:6px}.app.wide .sum{margin-top:12px;font-size:14.5px}
.app.wide .hero .pp{margin-top:12px!important}
.app.wide .hero .rings{margin:0 0 4px;justify-content:flex-start}.app.wide .hero .rl{min-width:0;flex:1}
/* Alltag */
.alt{display:grid;grid-template-columns:1fr;gap:8px}
.alt .xr{padding:7px 10px;gap:10px;min-width:0;margin:0}.alt .xr .ico{width:34px;height:34px;border-radius:11px}.alt .xr .t{font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.alt .xr .s{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.alt .xr>div:nth-child(2){min-width:0;flex:1}.alt .xr .sw{flex:none}
/* Räume */
.rooms{display:flex;flex-direction:column}
.rooms .h{margin-bottom:10px;flex:none}
.rooms .rg{flex:1;min-height:0;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:minmax(0,1fr);gap:10px;overflow:auto;scrollbar-width:none}
.rooms .rg::-webkit-scrollbar{display:none}
.rooms .rm{padding:11px 12px 12px;min-height:0;gap:4px;border-radius:22px;justify-content:space-between}.col>.rooms.grow{flex-grow:1.2}
.rooms .rm .rt{font-size:13.5px}
.rooms .rm .rw,.rooms .rm .rw .ring{width:40px;height:40px}.rooms .rm .rw .ri svg{width:17px;height:17px}
.rooms .rm .rv{font-size:25px;white-space:nowrap}.rooms .rm .rv .u{font-size:.5em}.rooms .rm .rmid{gap:8px;min-width:0}
.rooms .rm .rb{font-size:12px;gap:8px;flex-wrap:wrap}
.rooms .rm .spark,.rooms .rm .sk,.rooms .rm .qb{display:none}
.chartc{display:flex;flex-direction:column}.chartc .h{flex:none;margin-bottom:8px}
/* Wetter */
.app.wide .wxh{min-height:0;gap:10px}
.app.wide .wxh .wtemp{font-size:clamp(46px,7.5vh,68px)}
.app.wide .wxh .mini{margin-top:8px}
.col .c.cal{overflow:hidden}
.col .c.cal .vr,.col .c.cal .ev{margin-bottom:6px}
@media (min-width:1700px){
  .app.wide main{padding:22px 28px 22px 6px}.cock{height:var(--cockh,calc(100vh - var(--header-height,0px) - 44px));gap:16px}
  @supports (height:100dvh){.cock{height:var(--cockh,calc(100dvh - var(--header-height,0px) - 44px))}}
  .cols{gap:18px}.col{gap:18px}.stg{gap:16px}
  .rooms .rg{gap:14px}.rooms .rm{padding:16px 16px 14px}.rooms .rm .rw,.rooms .rm .rw .ring{width:52px;height:52px}.rooms .rm .rv{font-size:32px}.rooms .rm .rt{font-size:15px}.rooms .rm .rb{font-size:13px}
  .app.wide .sum{font-size:16px}.alt .xr .t{font-size:13.5px}
}
@media (max-height:899px),(max-width:1699px){.app.wide .hero .rings{display:none}.app.wide .hero{position:relative}.app.wide .hero .pp{position:absolute;top:3px;right:14px;margin:0!important;flex-wrap:nowrap;gap:6px;z-index:2}.app.wide .hero .pp .pc{padding:0;background:none;border:0;box-shadow:none;min-width:0;gap:0}.app.wide .hero .pp .pc>div:last-child{display:none}.app.wide .hero .pp .pc .av{width:28px;height:28px;font-size:12px;flex:none}}
.col.tight .hero .rings{display:none}.col.tight .hero{position:relative}.col.tight .hero .pp{position:absolute;top:3px;right:14px;margin:0!important;flex-wrap:nowrap;gap:6px;z-index:2}.col.tight .hero .pp .pc{padding:0;background:none;border:0;box-shadow:none;min-width:0;gap:0}.col.tight .hero .pp .pc>div:last-child{display:none}.col.tight .hero .pp .pc .av{width:28px;height:28px;font-size:12px;flex:none}
@media (min-height:940px){.rooms .rm .spark{display:block}}
@media (max-height:959px){.col [data-act=power] .okc{display:none}}
/* Niedrige Tablets (ca. 700–800 px Höhe, z. B. Vollbild-Browser): kompakter, damit nichts abgeschnitten wird */
@media (min-width:1200px) and (max-height:820px){
  .app.wide .clock{font-size:clamp(54px,9.5vh,84px)}
  .app.wide .date{margin-top:2px}.app.wide .sum{margin-top:6px;font-size:13.5px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .app.wide .hero .pp{margin-top:8px!important;flex:none}.app.wide .hero{gap:8px}.col>.c{padding:13px 15px}
  .app.wide .hero .hl{overflow:hidden}
  .alt{gap:5px}.alt .xr{padding:5px 10px}.alt .xr .ico{width:30px;height:30px}
  .rooms .rg{gap:8px}.rooms .rm{padding:8px 10px 9px;gap:2px}.rooms .rm .rb{flex-wrap:wrap;row-gap:1px;gap:6px;font-size:11.5px}
  .rooms .rm .rw,.rooms .rm .rw .ring{width:34px;height:34px}.rooms .rm .rv{font-size:22px}.rooms .rm .rt{font-size:12.5px}
}
.rooms .rm .rb{min-width:0}.rooms .rm{overflow:hidden}
.alt .xr .s{white-space:normal;overflow:visible;text-overflow:clip}
/* Tablet quer, schmaler: zwei Spalten, Seite scrollt */
@media (max-width:1199px){
  .cock{height:auto;min-height:0}.cols{flex:none}.col>.grow,.col>.fix{flex:none}.rooms .rg{grid-auto-rows:auto}.chartc{min-height:300px}
  .cols{grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);align-items:start}
  .col.c3{align-items:flex-start}
  .col.c3{grid-column:1 / -1;flex-direction:row;flex-wrap:wrap}.col.c3>.c{flex:1 1 280px}
  .rooms .rg{overflow:visible}
  .stg{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:860px){
  .cols{grid-template-columns:minmax(0,1fr)}
  .stg{grid-template-columns:repeat(2,minmax(0,1fr))}
  .rooms .rg{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`;

class HomeAuroraWide extends HomeAurora {
  _build() {
    super._build();
    this._app.classList.add('wide');
    const st = document.createElement('style'); st.textContent = CSSW; this.shadowRoot.appendChild(st);
  }
  getCardSize() { return 10; }
  /* Cockpit exakt auf die sichtbare Höhe ziehen (HA-Kopfzeile/Kiosk-Modus berücksichtigt): Abstand zur Fensterkante messen statt --header-height zu raten */
  _fitCock() {
    const el = this._main && this._main.querySelector('.cock'); if (!el) return;
    if (!this._fcR) { this._fcR = 1; addEventListener('resize', () => this._fitCock()); }
    const t = el.getBoundingClientRect().top, pb = parseFloat(getComputedStyle(this._main).paddingBottom) || 16, ih = window.innerHeight || document.documentElement.clientHeight;
    if (!(ih > 0) || t > ih) return;
    this.style.setProperty('--cockh', Math.max(620, Math.floor(ih - t - pb)) + 'px');
    this._fitCols(el);
    /* Inhalte, die später nachladen (Termine, Strom, Verlauf), ändern die Kartengrößen: dann neu verteilen */
    const refit = () => { const c = this._main && this._main.querySelector('.cock'); if (c && !this._fitting) this._fitCols(c); };
    if (!this._fro && typeof ResizeObserver === 'function') this._fro = new ResizeObserver(() => { cancelAnimationFrame(this._froF); this._froF = requestAnimationFrame(refit); });
    if (this._fro) for (const c of el.querySelectorAll('.col>.c')) this._fro.observe(c);
    clearTimeout(this._fitT); this._fitT = setTimeout(refit, 700);
  }
  /* Spalten füllen: optionale Zeilen (.fi, data-fp = Reihenfolge) nur einblenden, solange nichts abgeschnitten wird */
  _fitCols(el) {
    this._fitting = true;
    try { this._fitColsX(el); } finally { this._fitting = false; }
  }
  _fitColsX(el) {
    for (const col of el.querySelectorAll('.col')) {
      const fi = [...col.querySelectorAll('.fi')];
      if (!fi.length && !col.querySelector('.hero')) continue;
      const over = () => col.scrollHeight > col.clientHeight + 1 || [...col.children].some(c => c.scrollHeight > c.clientHeight + 1 || [...c.children].some(k => k.clientHeight && k.scrollHeight > k.clientHeight + 1 && getComputedStyle(k).overflowY === 'hidden'));
      const grp = new Map();
      fi.forEach((x, k) => { const g = x.dataset.fg || 'i' + k; if (!grp.has(g)) grp.set(g, { p: +x.dataset.fp || 9, k, el: [] }); grp.get(g).el.push(x); });
      const G = [...grp.values()].sort((a, b) => a.p - b.p || a.k - b.k);
      const fill = tight => {
        fi.forEach(x => x.classList.add('fh')); col.classList.toggle('tight', tight);
        if (over()) return -1;
        let n = 0;
        for (const g of G) {
          g.el.forEach(x => x.classList.remove('fh'));
          if (over()) { g.el.forEach(x => x.classList.add('fh')); break; }
          n++;
        }
        return n;
      };
      /* Hero mit Ringen und Personen bevorzugen; kompakt nur, wenn es sonst nicht passt oder dadurch deutlich mehr Zeilen Platz haben */
      const a = fill(false);
      if (col.querySelector('.hero') && (a < 0 || a < G.length)) { const t = fill(true); if (a >= 0 && t < a + 2) fill(false); }
      for (const m of col.querySelectorAll('.fm')) {
        const n = (+m.dataset.n || 0) + (m.closest('.c')?.querySelectorAll('.fi.fh:not(.ccd)').length || 0);
        m.textContent = n > 0 ? (m.dataset.full ? `+ ${n} weitere` : `+ ${n} weitere · `) : '';
      }
    }
  }
  setConfig(cfg) { super.setConfig({ ambient_night: { from: '23:00', to: '06:00', after: 1 }, ...(cfg || {}) }); }

  _vHome() {
    const { c, L, open, V, VD, w, fc, sentence, mini, xr, sunChip, bathState, bathBusy } = this._homeBits();
    const AL = this._alerts(), q = this._quick();
    const nv = VD.rooms.length ? VD.prio.length : V;
    const wxCard = `<div class="c wxh tap fix" style="--i:2;--wglow:${this._wxGlow(w.cond)}" data-act="nav" data-v="weather">
        <div class="wtop"><div><div class="wtemp big" data-count="${w.temp ?? 0}" data-d="1">${de(w.temp)}<small class="u">°C</small></div><div class="wcond">${COND[w.cond] || w.cond}</div></div>${wx(w.cond, 72)}</div>
        <div><div class="chips"><span class="chip">${ic('drop', 14)}<b>${de(w.hum, 0)}</b>%</span><span class="chip">${ic('wind', 14)}<b>${de(w.wind, 0)}</b> ${esc(w.windU)}</span>${w.rain ? `<span class="chip">${ic('rain', 14)}<b>${de(w.rain)}</b> ${esc(w.rainU)}</span>` : ''}${sunChip}</div>${mini ? `<div class="mini">${mini}</div>` : ''}</div></div>`;
    const pz0 = this._pzCard(6, 1, 7), alltag = [...xr.filter(x => !/Heizmodus/.test(x) && !(this._pzCard(6, 2) && /Tanken/.test(x))), this._plantRow(), this._sysRow()].filter(Boolean).slice(0, pz0 ? 3 : 5);
    const cal = this._calCard(7, 1, 8), pow = this._powerCard(8);
    const vh = typeof innerHeight === 'number' ? innerHeight : 800;
    return `<div class="cock">
      <div class="ctop">${AL.length ? `<div class="alerts">${AL.map(a => this._alertHtml(a)).join('')}</div>` : ''}${q || '<div class="gap"></div>'}
        <button class="tb" data-act="ambient">${ic('expand', 15)}Wandtablet</button></div>
      <div class="stg">
        ${this._stat(1, 'bulb', 'Lichter an', L, L ? 'hot' : '', L ? esc(this._lightsOn().slice(0, 2).map(e => this._name(e)).join(', ')) + (L > 2 ? ' …' : '') : 'Alles aus', 'lights')}
        ${this._stat(2, 'window', 'Fenster offen', open.length, open.length ? 'bad' : 'cool', this._winSub(open), 'doors')}
        ${this._stat(3, 'wind', 'Räume zu lüften', nv, nv ? 'hot' : 'cool', nv ? (VD.prio.slice(0, 2).map(r => esc(r.name)).join(', ') + (VD.prio.length > 2 ? ' …' : '')) : (VD.paused.length ? VD.paused.length + ' später empfohlen' : 'Luft ist gut'), 'vent')}
        ${this._stat(4, 'bath', 'Badezimmer', bathState, bathBusy ? 'bad' : 'cool', 'Status', 'nav', 'data-v="bath"')}
      </div>
      <div class="cols">
        <div class="col c1">
          <div class="c hero grow" style="--i:5"><div class="hl"><div><div class="hello">${this._greet()}</div><div class="clock big" id="clk">${this._clockStr()}</div>
            <div class="date">${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</div><div class="sum">${sentence}</div></div>
            ${this._rings()}<div class="pp">${this._persons()}</div></div></div>
          ${pz0}
          ${alltag.length ? `<div class="c fix" style="--i:6"><div class="alt">${alltag.join('')}</div></div>` : ''}
        </div>
        <div class="col c2">
          <div class="c rooms grow" style="--i:3"><div class="h">${ic('grid', 14)}Räume<span class="r">${c.rooms.length} Räume</span></div><div class="rg">${c.rooms.map((r, i) => this._roomTile(r, true, 4 + i)).join('')}</div></div>
          <div class="c chartc grow" style="--i:9"><div class="h">${ic('thermo', 14)}Temperaturen<span class="r">letzte 24 Stunden</span></div>${this._chart(this._tempSeries(false), { h: Math.round(Math.max(120, Math.min(340, vh * 0.255))), dec: 1 })}</div>
        </div>
        <div class="col c3">
          ${wxCard}
          ${cal ? cal.replace('<div class="c" ', '<div class="c cal grow" ') : ''}
          ${pow ? pow.replace('<div class="c ', '<div class="c fix ').replace('<div class="c" ', '<div class="c fix" ') : ''}
        </div>
      </div>
    </div>`;
  }
}

