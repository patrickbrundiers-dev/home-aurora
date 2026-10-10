  /* ───────────── v15: Alexa-Timer (Sensoren „Nächster Timer") als Live-Countdown ───────────── */
  _timers() {
    const h = this._h, now = Date.now(), seen = new Set(), out = [];
    for (const k in h.states) {
      if (!k.startsWith('sensor.') || !/(nachster|naechster|next)_timer(_\d+)?$/.test(k)) continue;
      const s = h.states[k], t = new Date(s.state).getTime();
      if (isNaN(t) || t < now - 120e3 || t > now + 48 * 36e5) continue;
      const nm = String(s.attributes?.friendly_name || k).replace(/\s*(n[äa]e?chster|next)\s*timer\s*$/i, '').trim() || 'Alexa', key = nm + '|' + t;
      if (seen.has(key)) continue; seen.add(key); out.push({ e: k, name: nm, t });
    }
    return out.sort((a, b) => a.t - b.t);
  }
  _tmrFmt(ms) {
    const s = Math.ceil(ms / 1000);
    if (s <= 0) return 'abgelaufen';
    const hh = Math.floor(s / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60, p = n => String(n).padStart(2, '0');
    return hh ? `${hh}:${p(mm)}:${p(ss)}` : `${mm}:${p(ss)}`;
  }
  _tmrAlerts() {
    const now = Date.now();
    return this._timers().map(x => { const left = x.t - now; return { id: 'tmr' + x.e, crit: left <= 0, cls: left <= 0 ? 'warn' : 'info', icon: 'clock', text: 'Timer · ' + x.name, sub: this._tmrFmt(left), tmr: x.t, act: 'nav', attrs: 'data-v="home"' }; });
  }
  _tmrTick() {
    const root = this.shadowRoot; if (!root) return;
    const els = root.querySelectorAll('[data-tmr]'); if (!els.length) return;
    const now = Date.now();
    els.forEach(el => { const t = this._tmrFmt(+el.dataset.tmr - now); if (el._l !== t) { el._l = t; el.textContent = t; } });
    const ex = [...els].reduce((m, el) => Math.max(m, +el.dataset.tmr - now <= -120e3 ? 2 : +el.dataset.tmr - now <= 0 ? 1 : 0), 0);
    if (ex !== (this._tmrEx || 0)) { this._tmrEx = ex; this._sig = ''; this._tick(); }
  }

