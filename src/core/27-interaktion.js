  /* ───────────── Interaktion ───────────── */
  _events(root) {
    root.addEventListener('click', ev => {
      if (Date.now() < (this._swallow || 0)) { ev.stopPropagation(); ev.preventDefault(); return; }
      if (this._skip) { this._skip = false; return; }
      if (ev.target === this._ov) return this._closeSheet();
      const el = ev.target.closest('[data-act]');
      if (!el || el.dataset.act === 'bright') return;
      this._act(el);
    });
    root.addEventListener('pointerdown', ev => {
      if (ev.target.closest('input')) { this._busy = true; return; }
      const el = ev.target.closest('[data-hold]');
      if (!el) return;
      clearTimeout(this._ht);
      this._ht = setTimeout(() => { this._skip = true; this._more(el.dataset.e); }, 520);
    });
    const cancel = () => clearTimeout(this._ht);
    root.addEventListener('pointerup', cancel); root.addEventListener('pointerleave', cancel); root.addEventListener('pointercancel', cancel);
    root.addEventListener('pointermove', ev => {
      const c = ev.target.closest && ev.target.closest('.c');
      if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (ev.clientX - r.left) + 'px'); c.style.setProperty('--my', (ev.clientY - r.top) + 'px'); }
      if (this._ht && Math.abs(ev.movementX) + Math.abs(ev.movementY) > 6) cancel();
    });
    root.addEventListener('input', ev => {
      if (ev.target.id === 'pzq') { const st = this._pzSt(); if (st) { st.q = ev.target.value; this._pzRefresh(); } return; }
      const el = ev.target.closest('input[data-act="bright"],input[data-act="vol"]');
      if (el) { el.style.setProperty('--v', el.value + '%'); if (el.dataset.act === 'vol' && el.nextElementSibling) el.nextElementSibling.textContent = el.value + ' %'; }
    });
    root.addEventListener('change', ev => {
      const el = ev.target.closest('input[data-act="bright"],input[data-act="vol"]');
      if (!el) return;
      if (el.dataset.act === 'vol') this._h.callService('media_player', 'volume_set', { entity_id: el.dataset.e, volume_level: parseInt(el.value, 10) / 100 });
      else this._h.callService('light', 'turn_on', { entity_id: el.dataset.e, brightness_pct: parseInt(el.value, 10) });
      this._busy = false;
      if (this._dirty) { this._dirty = false; this._sig = ''; this._tick(); }
    });
    root.addEventListener('pointerdown', ev => this._wxPtr(ev, 'd')); root.addEventListener('pointermove', ev => this._wxPtr(ev, 'm'));
    root.addEventListener('pointerup', ev => { this._wxPtr(ev, 'u'); });
    root.addEventListener('pointercancel', ev => this._wxPtr(ev, 'u'));
    root.addEventListener('pointerup', () => {
      if (this._busy) setTimeout(() => { this._busy = false; if (this._dirty) { this._dirty = false; this._sig = ''; this._tick(); } }, 250);
    });
    let sw = null;
    root.addEventListener('touchstart', ev => {
      const r = ev.target.closest && ev.target.closest('[data-sw]');
      if (!r || ev.touches.length !== 1 || ev.target.closest('button')) { sw = null; return; }
      sw = { r, x: ev.touches[0].clientX, y: ev.touches[0].clientY, dx: 0, on: false };
    }, { passive: true });
    root.addEventListener('touchmove', ev => {
      if (!sw) return;
      const t = ev.touches[0], dx = t.clientX - sw.x, dy = t.clientY - sw.y;
      if (!sw.on) { if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { sw = null; return; } if (dx > 14 && dx > Math.abs(dy) * 1.5) sw.on = true; else return; }
      sw.dx = Math.max(0, dx); sw.r.classList.add('swp'); sw.r.style.transform = `translateX(${Math.min(sw.dx, 160)}px)`; sw.r.style.setProperty('--sw', Math.min(1, sw.dx / 110));
    }, { passive: true });
    const swEnd = () => {
      if (!sw) return; const { r, dx, on } = sw; sw = null; if (!on) return;
      this._swallow = Date.now() + 350; r.classList.remove('swp'); r.style.transform = ''; r.style.removeProperty('--sw');
      if (dx > 110) this._pzDone(r.dataset.sw);
    };
    root.addEventListener('touchend', swEnd); root.addEventListener('touchcancel', swEnd);
    root.addEventListener('keydown', ev => {
      if (ev.key === 'Escape') this._closeSheet();
      else if (ev.key === 'Enter' && ev.target.id === 'annq') { ev.preventDefault(); this._annSend(); }
      else if (ev.key === 'Enter' && ev.target.id === 'shopq') { ev.preventDefault(); this._shopInput(); }
    });
    root.addEventListener('contextmenu', ev => { if (ev.target.closest && ev.target.closest('[data-hold]')) ev.preventDefault(); });
  }
  _more(e) { this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: e }, bubbles: true, composed: true })); }
  _act(el) {
    const a = el.dataset.act, e = el.dataset.e, h = this._h;
    switch (a) {
      case 'nav': this._v = el.dataset.v; this._enter = true; this._counted = false; this._closeSheet(); this._render(); this.scrollIntoView?.({ block: 'start' }); break;
      case 'room': this._sheet = { t: 'room', id: el.dataset.room }; this._renderSheet(); break;
      case 'lights': this._sheet = { t: 'lights' }; this._renderSheet(); break;
      case 'vent': this._sheet = { t: 'vent' }; this._renderSheet(); break;
      case 'vroom': this._sheet = e ? { t: 'vroom', e } : { t: 'vent' }; this._renderSheet(); break;
      case 'vx': this._vx = !this._vx; this._renderSheet(); break;
      case 'persons': this._sheet = { t: 'persons' }; this._renderSheet(); break;
      case 'prange': this._pwr = parseInt(el.dataset.n, 10) || 0; this._renderSheet(); break;
      case 'qedit': this._sheet = { t: 'quick' }; this._renderSheet(); break;
      case 'qmove': { const l = this._quickList().slice(), i = +el.dataset.i, j = i + +el.dataset.d; if (j >= 0 && j < l.length) { [l[i], l[j]] = [l[j], l[i]]; this._quickSave(l); this._sig = ''; this._renderSheet(); this._render(); } break; }
      case 'qfil': if (this._sheet) { this._sheet.qf = e; this._renderSheet(); } break;
      case 'bandis': (this._banDis = this._banDis || {})[el.dataset.id] = Date.now(); this._sig = ''; this._render(); break;
      case 'qdel': { const l = this._quickList().slice(); l.splice(+el.dataset.i, 1); this._quickSave(l); this._sig = ''; this._renderSheet(); this._render(); break; }
      case 'qadd': { const l = this._quickList().slice(); if (!l.some(x => x[0] === e)) l.push([e, e.startsWith('builtin:') ? 'Gute Nacht' : this._name(e), this._qIcon(e)]); this._quickSave(l); this._sig = ''; this._renderSheet(); this._render(); break; }
      case 'qreset': try { localStorage.removeItem('home-aurora-quick'); } catch (er) { /* ok */ } this._sig = ''; this._renderSheet(); this._render(); this._toast('Standard wiederhergestellt'); break;
      case 'qsave': this._sceneSave(); break;
      case 'fanpct': h.callService('fan', 'set_percentage', { entity_id: e, percentage: parseInt(el.dataset.p, 10) }); break;
      case 'preset': h.callService('fan', 'set_preset_mode', { entity_id: e, preset_mode: el.dataset.m }); break;
      case 'hum': { const hs = this._s(e); if (hs) h.callService('humidifier', 'set_humidity', { entity_id: e, humidity: clamp((hs.attributes.humidity || 50) + parseInt(el.dataset.d, 10), hs.attributes.min_humidity ?? 20, hs.attributes.max_humidity ?? 80) }); break; }
      case 'bat': this._sheet = { t: 'bat' }; this._renderSheet(); break;
      case 'doors': this._sheet = { t: 'doors' }; this._renderSheet(); break;
      case 'waste': this._sheet = { t: 'waste' }; this._renderSheet(); break;
      case 'fuel': this._sheet = { t: 'fuel' }; this._renderSheet(); break;
      case 'plants': this._sheet = { t: 'plants' }; this._renderSheet(); break;
      case 'heat': this._sheet = { t: 'heat', id: el.dataset.room }; this._renderSheet(); break;
      case 'settemp': h.callService('climate', 'set_temperature', { entity_id: e, temperature: parseFloat(el.dataset.v) }); break;
      case 'cpreset': h.callService('climate', 'set_preset_mode', { entity_id: e, preset_mode: el.dataset.m }); break;
      case 'chvac': h.callService('climate', 'set_hvac_mode', { entity_id: e, hvac_mode: el.dataset.m }); break;
      case 'dhmode': this._dhSet(this._c.rooms.find(r => r.id === el.dataset.room), el.dataset.m); break;
      case 'maps': { const u = `https://www.google.com/maps/dir/?api=1&destination=${el.dataset.lat},${el.dataset.lon}`; try { window.open(u, '_blank', 'noopener'); } catch (er) { /* ok */ } break; }
      case 'tbright': {
        const T = this._c.tablet, b = this._s(T.brightness); if (!b) break;
        const mx = parseFloat(b.attributes.max) || 255, cur = parseFloat(b.state) || 0;
        const v = el.dataset.v != null ? +el.dataset.v : clamp(Math.round(cur + mx * parseFloat(el.dataset.d) / 100), parseFloat(b.attributes.min) || 1, mx);
        h.callService('number', 'set_value', { entity_id: T.brightness, value: v }); break;
      }
      case 'tauto': h.callService('automation', el.dataset.m === 'on' ? 'turn_on' : 'turn_off', { entity_id: this._c.tablet.auto }); this._toast(el.dataset.m === 'on' ? 'Helligkeit wieder automatisch' : 'Helligkeit bleibt wie eingestellt'); break;
      case 'fuauto': this._fuPref = el.dataset.m; try { localStorage.setItem('home-aurora-fully', el.dataset.m); } catch (er) { /* ok */ } this._fuLast = null; this._fullyApply(true); this._renderSheet(); break;
      case 'fuelk': this._fuelK = el.dataset.k; this._renderSheet(); break;
      case 'sys': this._sheet = { t: 'sys' }; this._renderSheet(); this._loadSys(true); break;
      case 'power': this._sheet = { t: 'power' }; this._renderSheet(); this._loadPower(true); break;
      case 'sched': this._sheet = { t: 'sched' }; this._renderSheet(); break;
      case 'schedtab': this._schedTab = el.dataset.m; this._renderSheet(); break;
      case 'music': this._sheet = { t: 'music' }; this._renderSheet(); break;
      case 'shop': case 'shoptab': case 'shopadd': case 'shopq': case 'shopdone': case 'shopundo': case 'shopall': case 'shopclr': case 'rcpsel': case 'rcpserv': case 'rcpone': case 'rcpall': this._shopAct(a, el); break;
      case 'annt': this._annT = el.dataset.i; this._renderSheet(); break;
      case 'annph': { const p = (this._c.music?.phrases || [])[+el.dataset.i], inp = this.shadowRoot.getElementById('annq'); if (p && inp) { inp.value = p; inp.focus(); } break; }
      case 'annsend': this._annSend(); break;
      case 'settings': this._sheet = { t: 'set' }; this._renderSheet(); break;
      case 'quick': this._quickRun(e); break;
      case 'theme': this._themePref = el.dataset.m; try { localStorage.setItem('home-aurora-theme', el.dataset.m); } catch (er) { /* ok */ } this._render(); break;
      case 'pzshow': this._pzsPref = el.dataset.m; try { localStorage.setItem('home-aurora-pzshow', el.dataset.m); } catch (er) { /* ok */ } if (el.dataset.m === '0' && this._v === 'clean') this._v = 'home'; this._sig = ''; this._render(); this._renderSheet(); break;
      case 'shopshow': this._shsPref = el.dataset.m; try { localStorage.setItem('home-aurora-shopshow', el.dataset.m); } catch (er) { /* ok */ } this._sig = ''; this._render(); this._renderSheet(); break;
      case 'pzview': this._pzvPref = el.dataset.m; try { localStorage.setItem('home-aurora-pzview', el.dataset.m); } catch (er) { /* ok */ } if (el.dataset.m === '0' && this._v === 'clean') this._v = 'home'; this._sig = ''; this._render(); this._renderSheet(); break;
      case 'ambnight': this._nightPref = el.dataset.m; try { localStorage.setItem('home-aurora-ambnight', el.dataset.m); } catch (er) { /* ok */ } this._renderSheet(); break;
      case 'ambafter': this._ambPref = el.dataset.m; try { localStorage.setItem('home-aurora-amb', el.dataset.m); } catch (er) { /* ok */ } this._lastAct = Date.now(); this._renderSheet(); break;
      case 'ambient': this._closeSheet(); this._ambOn(); break;
      case 'radar': this._sheet = { t: 'radar' }; this._renderSheet(); break;
      case 'rdsrc': this._rdSetSrc(el.dataset.s); break;
      case 'lock': this._lockToggle(); break;
      case 'kid': this._sheet = { t: 'kid', i: parseInt(el.dataset.i, 10) || 0 }; this._renderSheet(); break;
      case 'pz': if (!this._pzOn()) break; if (!this._pzView()) { this._sheet = { t: 'clean' }; this._renderSheet(); break; } this._v = 'clean'; this._enter = true; this._counted = false; this._closeSheet(); this._render(); this.scrollIntoView?.({ block: 'start' }); break;
      case 'pzf': { const st = this._pzSt(); if (st) { st.f = e; st.q = ''; this._pzRefresh(); } break; }
      case 'pzdone': this._pzDone(e); break;
      case 'pzundo': this._pzUndo(e); this._tst.classList.remove('show'); break;
      case 'pzroom': if (this._pzSt()) { this._pzCol = this._pzCol || {}; this._pzCol[el.dataset.id] = el.dataset.c !== '1'; this._pzRefresh(); } break;
      case 'pzstat': this._sheet = { t: 'pzstat' }; this._renderSheet(); this._pzLoadStat(); break;
      case 'pzstatr': this._pzS = null; this._renderSheet(); this._pzLoadStat(true); break;
      case 'pzback': if (this._pzView()) this._closeSheet(); else { this._sheet = { t: 'clean' }; this._renderSheet(); } break;
      case 'pzstart': { const st = this._pzSt(); if (st) { st.cf = true; this._pzRefresh(); } break; }
      case 'pzcancel': { const st = this._pzSt(); if (st) { st.cf = false; this._pzRefresh(); } break; }
      case 'pzgo': this._pzStart(); break;
      case 'tv': this._sheet = { t: 'tv' }; this._renderSheet(); break;
      case 'tvact': this._tvAct(el.dataset.a, el.dataset.e); break;
      case 'kact': this._kidAct(parseInt(el.dataset.i, 10) || 0, el.dataset.a); break;
      case 'pk': this._pinKey(el.dataset.k); break;
      case 'pdel': this._pin = (this._pin || '').slice(0, -1); this._renderSheet(); break;
      case 'warn': this._sheet = { t: 'warn', k: el.dataset.k, i: +el.dataset.i, from: el.dataset.from ?? (this._sheet?.t === 'radar' ? 'radar' : '') }; this._renderSheet(); break;
      case 'mp': h.callService('media_player', el.dataset.s, { entity_id: e }); break;
      case 'calf': this._calOff.has(e) ? this._calOff.delete(e) : this._calOff.add(e); if (this._sheet && this._sheet.t === 'cal') this._renderSheet(); else this._render(); break;
      case 'cal': this._calMode = 'week'; this._calWk = 0; this._calMo = 0; this._calSel = null; this._sheet = { t: 'cal' }; this._renderSheet(); if (!this._cal) this._loadCal(); break;
      case 'calmode': this._calMode = ['list', 'month'].includes(el.dataset.m) ? el.dataset.m : 'week'; this._renderSheet(); break;
      case 'calwk': this._calWk = +el.dataset.n === 0 ? 0 : clamp((this._calWk || 0) + +el.dataset.n, 0, 8); this._renderSheet(); break;
      case 'calday': { const k = +el.dataset.d, d = new Date(k), t0 = new Date(); t0.setHours(0, 0, 0, 0); this._calSel = k; this._calMo = Math.max(0, Math.min(2, (d.getFullYear() - t0.getFullYear()) * 12 + d.getMonth() - t0.getMonth())); this._renderSheet(); break; }
      case 'calmo': { const n = +el.dataset.n, t0 = new Date(); t0.setHours(0, 0, 0, 0); this._calMo = n === 0 ? 0 : Math.max(0, Math.min(2, (this._calMo || 0) + n)); this._calSel = n === 0 ? +t0 : null; if (n !== 0) { const f = new Date(t0.getFullYear(), t0.getMonth() + this._calMo, 1); this._calSel = this._calMo === 0 ? +t0 : +f; } this._renderSheet(); break; }
      case 'trsel': this._trI = this._trI === +el.dataset.i ? null : +el.dataset.i; this._render(); break;
      case 'trspan': this._trSpan = +el.dataset.n; this._trI = null; this._render(); break;
      case 'wxspan': this._wxSpan = +el.dataset.n; this._wxSelT = null; this._render(); break;
      case 'wxmode': this._wxMode = el.dataset.m; this._enter = true; this._counted = false; this._render(); break;
      case 'pcmd': h.callService(el.dataset.d, el.dataset.s, { entity_id: e }); this._toast(el.dataset.msg || 'Gesendet'); break;
      case 'plant': {
        const pe = this._c.plant.entity, at = this._attr(pe, 'has_time') === false ? 'date' : 'datetime', n = new Date(), z = x => String(x).padStart(2, '0');
        const d = `${n.getFullYear()}-${z(n.getMonth() + 1)}-${z(n.getDate())}`;
        h.callService('input_datetime', 'set_datetime', at === 'date' ? { entity_id: pe, date: d } : { entity_id: pe, datetime: `${d} ${z(n.getHours())}:${z(n.getMinutes())}:${z(n.getSeconds())}` });
        this._toast('Gießen eingetragen 🌱'); break;
      }
      case 'press': h.callService('button', 'press', { entity_id: e }); this._toast(el.dataset.msg || 'Erledigt'); break;
      case 'close': this._closeSheet(); break;
      case 'toggle': h.callService(dom(e), 'toggle', { entity_id: e }); break;
      case 'more': this._more(e); break;
      case 'room-lights': {
        const I = this._room(this._c.rooms.find(r => r.id === el.dataset.room));
        h.callService('light', I.on.length ? 'turn_off' : 'turn_on', { entity_id: I.lights }); break;
      }
      case 'alloff':
        if (!this._armed) { this._armed = true; this._renderSheet(); clearTimeout(this._at); this._at = setTimeout(() => { this._armed = false; if (this._sheet) this._renderSheet(); }, 3000); }
        else { this._armed = false; clearTimeout(this._at); h.callService('light', 'turn_off', { entity_id: this._lightsOn() }); this._toast('Alle Lichter ausgeschaltet'); }
        break;
      case 'temp': {
        const R = this._dhRoom(e);
        // alle Thermostate des Raums gleich verschieben, damit ihr Abstand zueinander bleibt
        if (R) { for (const cl of this._dh(R).trv) { if (!okv(cl.state)) continue; const x = cl.attributes; h.callService('climate', 'set_temperature', { entity_id: cl.entity_id, temperature: clamp(Math.round(((x.temperature ?? 20) + parseFloat(el.dataset.d)) * 2) / 2, x.min_temp ?? 5, x.max_temp ?? 30) }); } break; }
        const cl = this._s(e); if (!cl) break;
        const cur = cl.attributes.temperature ?? cl.attributes.current_temperature ?? 20;
        const nt = clamp(Math.round((cur + parseFloat(el.dataset.d)) * 2) / 2, cl.attributes.min_temp ?? 5, cl.attributes.max_temp ?? 30);
        h.callService('climate', 'set_temperature', { entity_id: e, temperature: nt }); break;
      }
      case 'hvac': {
        const R = this._dhRoom(e);
        if (R) { this._dhSet(R, this._dh(R).mode === 'off' ? 'auto' : 'off'); break; }
        h.callService('climate', 'set_hvac_mode', { entity_id: e, hvac_mode: this._val(e) === 'off' ? 'heat' : 'off' }); break;
      }
    }
  }
  /* Raum mit Heizungssteuerung zum Thermostat e (nur der Hauptthermostat steht in data-e) */
  _dhRoom(e) { return this._c.rooms.find(r => r.heat && r.climate === e) || null; }
  /* auto: Regelung übernimmt · heat: Manuell (Regelung aus, Thermostate an) · off: Regelung und alle Thermostate aus */
  _dhSet(r, m) {
    const D = r && this._dh(r); if (!D) return;
    const h = this._h, ids = D.trv.map(s => s.entity_id);
    if (r.heat.switch && this._s(r.heat.switch)) h.callService('switch', m === 'auto' ? 'turn_on' : 'turn_off', { entity_id: r.heat.switch });
    if (ids.length && (m === 'off' || D.mode === 'off')) h.callService('climate', 'set_hvac_mode', { entity_id: ids, hvac_mode: m === 'off' ? 'off' : 'heat' });
    this._toast(m === 'auto' ? `${r.name}: Automatik an` : m === 'off' ? `${r.name}: Heizung aus` : `${r.name}: manuelle Steuerung`);
  }

