  /* ───────────── pz22: Einkaufsliste & Rezepte (HA-To-do-Listen) ───────────── */
  /* Die Einträge holt todo/item/list. Neu geladen wird nur, wenn sich die Listen-Entität ändert (Zahl offener Einträge),
     die Rezepte (mit Bildern recht groß) erst, wenn der Reiter Rezepte offen ist. */
  _shopC() { return this._c.shopping || {}; }
  _shopOk() { const e = this._shopC().list, s = e && this._s(e); return !!s && okv(s.state); }
  /* was die Liste kann (supported_features: 1 = anlegen, 2 = löschen, 4 = ändern); ohne Angabe alles */
  _shopCan(b) { const f = this._attr(this._shopC().list, 'supported_features'); return f == null || !!(f & b); }
  _rcpOk() { const e = this._shopC().recipes, s = e && this._s(e); return !!s && okv(s.state); }
  async _loadShop(force) {
    const e = this._shopC().list, s = e && this._s(e);
    if (!s || !okv(s.state) || this._shopB) return;
    const k = s.last_updated || s.state;
    if (!force && this._shop && this._shop.k === k) return;
    this._shopB = true;
    try {
      const r = await this._h.callWS({ type: 'todo/item/list', entity_id: e });
      this._shop = { k, items: (r?.items || []).filter(i => i && i.summary) };
    } catch (er) { this._shop = { k, items: this._shop?.items || [], err: true }; }
    this._shopB = false;
    this._renderSoon();
  }
  async _loadRcp(force) {
    const e = this._shopC().recipes, s = e && this._s(e);
    if (!s || !okv(s.state) || this._rcpB) return;
    const k = s.last_updated || s.state;
    if (!force && this._rcp && this._rcp.k === k) return;
    this._rcpB = true;
    let items = null;
    try { items = (await this._h.callWS({ type: 'todo/item/list', entity_id: e }))?.items || []; } catch (er) { items = null; }
    if (items) {
      (this._rcp?.urls || []).forEach(u => { try { URL.revokeObjectURL(u); } catch (x) { /* ok */ } });
      const list = [], urls = []; let plan = null;
      for (const it of items) {
        let d = null; try { d = it.description ? JSON.parse(it.description) : null; } catch (x) { d = null; }
        if (/^__.*wochenplan__$/.test(it.summary || '')) { plan = d; continue; }
        if (!it.summary || /^__/.test(it.summary)) continue;
        const img = d?.image ? this._imgUrl(d.image) : '';
        if (img.startsWith('blob:')) urls.push(img);
        list.push({ uid: it.uid, name: String(it.summary).trim(), cat: d?.category || '', serv: parseFloat(d?.servings) || 0, ing: Array.isArray(d?.ingredients) ? d.ingredients.filter(x => x && String(x.name || '').trim()) : [], steps: Array.isArray(d?.steps) ? d.steps.filter(x => String(x || '').trim()) : [], img, note: !d && it.description ? String(it.description) : '' });
      }
      list.sort((a, b) => a.name.localeCompare(b.name, 'de'));
      this._rcp = { k, list, plan, urls };
    } else this._rcp = { k, list: this._rcp?.list || [], plan: this._rcp?.plan || null, urls: this._rcp?.urls || [], err: true };
    this._rcpB = false;
    this._renderSoon();
  }
  /* Bilder liegen als data:-URL im Rezept: einmal in eine kurze blob:-URL umwandeln, damit nicht bei jedem Zeichnen 70 kB Text verglichen werden */
  _imgUrl(d) {
    const m = /^data:([^;,]+);base64,(.*)$/.exec(String(d));
    if (!m) return /^(https?:|\/)/.test(String(d)) ? String(d) : '';
    try { const b = atob(m[2]), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return URL.createObjectURL(new Blob([u], { type: m[1] })); } catch (x) { return ''; }
  }
  /* offene Einträge, gleiche zusammengefasst (zweimal „Öl“ → eine Zeile ×2) */
  _shopOpen() {
    const g = new Map();
    for (const i of this._shop?.items || []) {
      if (i.status === 'completed') continue;
      const k = String(i.summary).trim().toLowerCase();
      if (!g.has(k)) g.set(k, { name: String(i.summary).trim(), uids: [], due: i.due || '' });
      g.get(k).uids.push(i.uid);
    }
    return [...g.values()];
  }
  _shopDone() { return (this._shop?.items || []).filter(i => i.status === 'completed').sort((a, b) => String(b.completed || '').localeCompare(String(a.completed || ''))); }
  /* Einkaufsliste & Rezepte zeigen oder ausblenden; pro Gerät umschaltbar, Vorgabe per YAML einkauf: false */
  _shopOn() { return this._shsPref != null ? this._shsPref === '1' : this._c?.einkauf !== false; }
  _shopRow() {
    if (!this._shopOn()) return '';
    if (!this._shopOk()) return this._rcpOk() ? `<button class="xr" data-act="shop"><div class="ico">${ic('cook', 19)}</div><div><div class="t">Rezepte</div><div class="s">${parseInt(this._val(this._shopC().recipes), 10) || 0} Rezepte</div></div></button>` : '';
    this._loadShop();
    const n = parseInt(this._val(this._shopC().list), 10) || 0, O = this._shop ? this._shopOpen() : [];
    const sub = n ? `${n} offen${O.length ? ' · ' + O.slice(0, 3).map(o => esc(o.name)).join(', ') + (O.length > 3 ? ' …' : '') : ''}` : 'Nichts auf der Liste';
    return `<button class="xr" data-act="shop"><div class="ico" ${n ? 'style="background:rgba(52,211,153,.18);color:#6ee7b7"' : ''}>${ic('cart', 19)}</div><div><div class="t">Einkaufsliste</div><div class="s">${sub}</div></div></button>`;
  }
  /* Mengen beim Umrechnen auf andere Portionen: „250“, „1,5“, „½“, „1 ½“, „1/2“ */
  _amt(a, f) {
    a = String(a ?? '').trim();
    if (!a || f === 1) return a;
    const FR = { '½': .5, '¼': .25, '¾': .75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': .125 };
    let v = null, m;
    if ((m = /^(\d+)\s*\/\s*(\d+)$/.exec(a)) && +m[2]) v = m[1] / m[2];
    else if ((m = /^(\d+(?:[.,]\d+)?)?\s*([½¼¾⅓⅔⅛])?$/.exec(a)) && (m[1] || m[2])) v = (m[1] ? parseFloat(m[1].replace(',', '.')) : 0) + (m[2] ? FR[m[2]] : 0);
    if (v == null || isNaN(v)) return a;
    const x = v * f; if (x >= 10) return String(x >= 100 ? Math.round(x / 5) * 5 : Math.round(x));
    const w = Math.floor(x + 1e-6), r = x - w;
    const fr = [[0, ''], [.25, '¼'], [1 / 3, '⅓'], [.5, '½'], [2 / 3, '⅔'], [.75, '¾'], [1, '']].find(q => Math.abs(r - q[0]) < .04);
    if (fr) { const ww = w + (fr[0] === 1 ? 1 : 0); return ww && fr[1] ? `${ww} ${fr[1]}` : fr[1] || String(ww); }
    return de(x, 1).replace(/,0$/, '');
  }
  _ingTxt(g, f) { return [this._amt(g.amount, f), String(g.unit || '').trim(), String(g.name || '').trim()].filter(Boolean).join(' ').replace(/\s+/g, ' '); }
  _onList(name) { const n = String(name || '').trim().toLowerCase(); return !!n && this._shopOpen().some(o => o.name.toLowerCase().includes(n)); }
  _weekPlan() {
    const P = this._rcp?.plan; if (!P || !P.days || !P.weekStart) return null;
    const t = new Date(); t.setHours(0, 0, 0, 0); const mo = new Date(+t - ((t.getDay() + 6) % 7) * 864e5), z = x => String(x).padStart(2, '0');
    const key = `${mo.getFullYear()}-${z(mo.getMonth() + 1)}-${z(mo.getDate())}`;
    const days = P.weekStart === key ? P.days : null; if (!days) return null;
    const N = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'], L = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'], ti = (t.getDay() + 6) % 7;
    const out = N.map((d, i) => ({ i, l: L[i], r: (this._rcp.list || []).find(x => x.uid === days[d]) || null, today: i === ti }));
    return out.some(x => x.r) ? out : null;
  }
  _sShop() {
    const C = this._shopC(), ok = this._shopOk(), rOk = this._rcpOk(), cA = ok && this._shopCan(1), cD = this._shopCan(2), cU = this._shopCan(4);
    const head = p => `<div class="grab"></div><div class="sh"><div class="ico">${ic('cart', 24)}</div><div><h2>Einkaufsliste${rOk ? ' &amp; Rezepte' : ''}</h2><p>${p}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!ok && !rOk) return head('Nicht verfügbar') + `<div class="empty">Keine Einkaufsliste gefunden. In der Karten-Konfiguration unter <b>shopping: list:</b> eine To-do-Liste eintragen.</div>`;
    const tab = rOk && (this._shopTab === 'rcp' || !ok) ? 'rcp' : 'list';
    if (ok) this._loadShop(); if (tab === 'rcp') this._loadRcp();
    const n = ok ? parseInt(this._val(C.list), 10) || 0 : 0, R = this._rcp?.list || [];
    const tabs = ok && rOk ? `<div class="lstab"><button class="${tab === 'list' ? 'on' : ''}" data-act="shoptab" data-m="list">${ic('cart', 15)} Einkaufen${n ? ' · ' + n : ''}</button><button class="${tab === 'rcp' ? 'on' : ''}" data-act="shoptab" data-m="rcp">${ic('cook', 15)} Rezepte${this._rcp ? ' · ' + R.length : ''}</button></div>` : '';
    if (tab === 'rcp') return head(`${R.length || parseInt(this._val(C.recipes), 10) || 0} Rezepte`) + tabs + this._sRcp();
    const O = this._shopOpen(), D = this._shopDone(), qk = (C.quick || []).filter(q => !this._onList(q));
    const row = o => `<div class="todo${cU ? '' : ' ro'}"><button class="ck" data-act="shopdone" data-u="${esc(o.uids.join('|'))}" aria-label="${esc(o.name)} abhaken">${ic('check', 16)}</button><div class="t">${esc(o.name)}</div>${o.uids.length > 1 ? `<span class="shx">×${o.uids.length}</span>` : ''}</div>`;
    const done = D.slice(0, this._shopAll ? 60 : 6);
    return head(n ? `${n} ${n === 1 ? 'Eintrag' : 'Einträge'} offen` : 'Alles eingekauft') + tabs
      + (cA ? `<div class="addrow"><input id="shopq" type="text" maxlength="120" placeholder="Was fehlt? z. B. 2 Liter Milch" autocomplete="off" enterkeyhint="done" aria-label="Neuer Eintrag"><button data-act="shopadd" aria-label="Hinzufügen">${ic('plus', 20)}</button></div>` : '')
      + (cA && qk.length ? `<div class="annp shq">${qk.map(q => `<button data-act="shopq" data-v="${esc(q)}">${ic('plus', 12)} ${esc(q)}</button>`).join('')}</div>` : '')
      + `<div class="lab2">AUF DER LISTE · ${this._shop ? O.length : n}</div>`
      + (!this._shop ? '<div class="empty sm">Liste wird geladen …</div>' : O.length ? O.map(row).join('') : '<div class="empty">🛒 Nichts auf der Liste</div>')
      + (D.length ? `<div class="lab2 shdl"><span>ERLEDIGT · ${D.length}</span>${cD ? `<button class="vbt" data-act="shopclr">${ic('trash', 13)} ${this._shopArm ? 'Wirklich löschen?' : 'Erledigte löschen'}</button>` : ''}</div>
        ${done.map(i => `<div class="todo dn${cU ? '' : ' ro'}"><button class="ck on" data-act="shopundo" data-u="${esc(i.uid)}" aria-label="${esc(i.summary)} wieder auf die Liste">${ic('check', 16)}</button><div class="t">${esc(i.summary)}</div></div>`).join('')}
        ${D.length > done.length ? `<button class="vbt shmore" data-act="shopall">Alle ${D.length} erledigten zeigen</button>` : ''}` : '')
      + (this._shop?.err ? '<div class="card-note">Die Liste konnte gerade nicht geladen werden.</div>' : '');
  }
  _sRcp() {
    if (!this._rcp) return '<div class="empty sm">Rezepte werden geladen …</div>';
    const R = this._rcp.list, r = this._rcpSel && R.find(x => x.uid === this._rcpSel), cA = this._shopOk() && this._shopCan(1);
    if (r) {
      const sv = this._rcpServ || r.serv || 0, f = r.serv && sv ? sv / r.serv : 1;
      const ing = r.ing.map((g, i) => { const on = this._onList(g.name); return `<div class="ing${on ? ' on' : ''}"><span class="q">${esc([this._amt(g.amount, f), String(g.unit || '').trim()].filter(Boolean).join(' '))}</span><span class="n">${esc(String(g.name).trim())}</span>${cA ? `<button class="mpb" data-act="rcpone" data-i="${i}" aria-label="${esc(String(g.name).trim())} auf die Liste" ${on ? 'disabled' : ''}>${ic(on ? 'check' : 'plus', 16)}</button>` : ''}</div>`; }).join('');
      return `<button class="vbt rcback" data-act="rcpsel" data-u="">${ic('chevron', 13)} Alle Rezepte</button>
        <div class="rch"${r.img ? ` style="background-image:url('${esc(r.img)}')"` : ''}>${r.img ? '' : ic('cook', 40)}<div class="rct"><h3>${esc(r.name)}</h3><span>${[r.cat, r.ing.length ? r.ing.length + ' Zutaten' : '', r.steps.length ? r.steps.length + ' Schritte' : ''].filter(Boolean).map(esc).join(' · ')}</span></div></div>
        ${r.ing.length ? `<div class="lab2 shdl"><span>ZUTATEN</span>${r.serv ? `<span class="rsv"><button class="mpb" data-act="rcpserv" data-d="-1" aria-label="Weniger Portionen" ${sv <= 1 ? 'disabled' : ''}>${ic('minus', 15)}</button><b>${sv} ${sv === 1 ? 'Portion' : 'Portionen'}</b><button class="mpb" data-act="rcpserv" data-d="1" aria-label="Mehr Portionen">${ic('plus', 15)}</button></span>` : ''}</div>
          <div class="ings">${ing}</div>
          ${cA ? `<button class="pbtn rcall" data-act="rcpall">${ic('cart', 17)} Fehlende Zutaten auf die Einkaufsliste</button>` : ''}` : ''}
        ${r.steps.length ? `<div class="lab2">ZUBEREITUNG</div><ol class="stp">${r.steps.map(s => `<li>${esc(String(s).trim())}</li>`).join('')}</ol>` : ''}
        ${r.note ? `<div class="card-note">${esc(r.note)}</div>` : ''}`;
    }
    const W = this._weekPlan();
    const card = x => `<button class="rc" data-act="rcpsel" data-u="${esc(x.uid)}"><div class="ri"${x.img ? ` style="background-image:url('${esc(x.img)}')"` : ''}>${x.img ? '' : ic('cook', 26)}</div><div class="rn">${esc(x.name)}</div><div class="rs">${[x.cat, x.serv ? x.serv + ' Port.' : '', x.ing.length ? x.ing.length + ' Zutaten' : ''].filter(Boolean).map(esc).join(' · ')}</div></button>`;
    return (W ? `<div class="lab2">DIESE WOCHE</div><div class="rwk">${W.map(d => `<button class="${d.today ? 'on' : ''}${d.r ? '' : ' no'}" ${d.r ? `data-act="rcpsel" data-u="${esc(d.r.uid)}"` : 'disabled'}><b>${d.l}</b><span>${d.r ? esc(d.r.name) : '–'}</span></button>`).join('')}</div>` : '')
      + `<div class="lab2">REZEPTE · ${R.length}</div>` + (R.length ? `<div class="rcg">${R.map(card).join('')}</div>` : '<div class="empty">Noch keine Rezepte</div>')
      + (this._rcp.err ? '<div class="card-note">Die Rezepte konnten gerade nicht geladen werden.</div>' : '');
  }
  async _shopAdd(list) {
    const e = this._shopC().list, L = (Array.isArray(list) ? list : [list]).map(x => String(x || '').trim()).filter(Boolean);
    if (!e || !L.length) return 0;
    try {
      for (const it of L) await this._h.callService('todo', 'add_item', { entity_id: e, item: it });
      if (this._shop) this._shop.items.push(...L.map((s, i) => ({ uid: 'neu' + Date.now() + i, summary: s, status: 'needs_action' })));
      this._renderSheet();
      return L.length;
    } catch (er) { this._toast('Eintragen hat nicht geklappt', 3600); return 0; }
  }
  _shopInput() {
    const inp = this.shadowRoot.getElementById('shopq'), v = (inp?.value || '').trim();
    if (!v) { inp?.focus(); return; }
    if (inp) inp.value = '';
    this._shopAdd(v).then(n => { if (n) this._toast(`„${v}“ steht auf der Liste`); });
  }
  _shopSet(uids, status) {
    const e = this._shopC().list; if (!e) return;
    const U = String(uids || '').split('|').filter(Boolean);
    for (const u of U) {
      const it = this._shop?.items.find(i => i.uid === u);
      if (it) { it.status = status; it.completed = status === 'completed' ? new Date().toISOString() : undefined; }
      // gerade erst eingetragen: die echte UID kennt die Karte noch nicht, Home Assistant findet den Eintrag auch über den Text
      const item = /^neu\d/.test(u) ? it?.summary : u;
      if (item) this._h.callService('todo', 'update_item', { entity_id: e, item, status });
    }
    this._renderSheet();
  }
  _shopAct(a, el) {
    const R = this._rcp?.list || [], r = this._rcpSel && R.find(x => x.uid === this._rcpSel);
    const f = r && r.serv && this._rcpServ ? this._rcpServ / r.serv : 1;
    switch (a) {
      case 'shop': this._sheet = { t: 'shop' }; this._shopArm = false; this._renderSheet(); this._loadShop(true); break;
      case 'shoptab': this._shopTab = el.dataset.m; this._rcpSel = null; this._renderSheet(); break;
      case 'shopadd': this._shopInput(); break;
      case 'shopq': this._shopAdd(el.dataset.v).then(n => { if (n) this._toast(`„${el.dataset.v}“ steht auf der Liste`); }); break;
      case 'shopdone': this._shopSet(el.dataset.u, 'completed'); break;
      case 'shopundo': this._shopSet(el.dataset.u, 'needs_action'); break;
      case 'shopall': this._shopAll = !this._shopAll; this._renderSheet(); break;
      case 'shopclr':
        if (!this._shopArm) { this._shopArm = true; this._renderSheet(); clearTimeout(this._shopAt); this._shopAt = setTimeout(() => { this._shopArm = false; if (this._sheet?.t === 'shop') this._renderSheet(); }, 3000); break; }
        this._shopArm = false; clearTimeout(this._shopAt);
        this._h.callService('todo', 'remove_completed_items', { entity_id: this._shopC().list });
        if (this._shop) this._shop.items = this._shop.items.filter(i => i.status !== 'completed');
        this._renderSheet(); this._toast('Erledigte gelöscht'); break;
      case 'rcpsel': this._rcpSel = el.dataset.u || null; this._rcpServ = 0; this._shopTab = 'rcp'; this._renderSheet(); this._sh.scrollTop = 0; break;
      case 'rcpserv': if (r) { this._rcpServ = clamp((this._rcpServ || r.serv) + parseInt(el.dataset.d, 10), 1, 50); this._renderSheet(); } break;
      case 'rcpone': { const g = r?.ing[+el.dataset.i]; if (g) { const t = this._ingTxt(g, f); this._shopAdd(t).then(n => { if (n) this._toast(`„${t}“ steht auf der Liste`); }); } break; }
      case 'rcpall': {
        if (!r) break;
        const L = r.ing.filter(g => !this._onList(g.name)).map(g => this._ingTxt(g, f));
        if (!L.length) { this._toast('Alle Zutaten stehen schon auf der Liste'); break; }
        this._shopAdd(L).then(n => { if (n) this._toast(`${n} ${n === 1 ? 'Zutat' : 'Zutaten'} für ${r.name} auf der Liste`); });
        break;
      }
    }
  }
