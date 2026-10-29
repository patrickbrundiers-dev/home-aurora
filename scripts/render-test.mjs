#!/usr/bin/env node
// Rendert beide Karten (Handy + Wide) headless in Chromium mit Beispiel-Zuständen und prüft,
// dass jede Ansicht und jedes Fenster ohne JavaScript-Fehler Inhalt zeigt.
// Aufruf: node scripts/render-test.mjs [--states datei.json] [--shots ordner] [--perf]
//   --states  Zustände (Objekt entity_id → state); Standard: test/fixture-states.json (erfundene Werte)
//   --shots   speichert je Ansicht einen Screenshot (PNG) in diesen Ordner
//   --perf    misst zusätzlich die Last im Leerlauf und pro Home-Assistant-Update
//   --only    nur eine Karte testen (aurora oder wide)
//   --autos   gespeicherte Automations-Konfigurationen (Objekt entity_id → config); Standard: test/fixture-automations.json
//   --chaos   zusätzlich mit kaputten Zuständen: jede zweite Entität fehlt / alle „nicht verfügbar“ / gar keine
// Chromium: Playwright muss installiert sein (npm i playwright); PW_CHROMIUM setzt optional den Browser-Pfad.
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const statesFile = arg('--states', join(root, 'test/fixture-states.json'));
const shots = arg('--shots', '');
const perf = process.argv.includes('--perf');
const states0 = JSON.parse(readFileSync(statesFile, 'utf8'));
const autosFile = arg('--autos', join(root, 'test/fixture-automations.json'));
const autos = existsSync(autosFile) ? JSON.parse(readFileSync(autosFile, 'utf8')) : {};
// --chaos: dieselben Prüfungen mit fehlenden bzw. nicht erreichbaren Geräten (z. B. umbenannt, Akku leer, Integration weg)
const VARIANTS = [['', states0]];
if (process.argv.includes('--chaos')) {
  const ks = Object.keys(states0);
  VARIANTS.push(['[jede 2. fehlt] ', Object.fromEntries(ks.filter((_, i) => i % 2).map((k) => [k, states0[k]]))]);
  VARIANTS.push(['[nicht verfügbar] ', Object.fromEntries(ks.map((k) => [k, { ...states0[k], state: 'unavailable', attributes: { friendly_name: states0[k].attributes?.friendly_name } }]))]);
  VARIANTS.push(['[unbekannt] ', Object.fromEntries(ks.map((k) => [k, { ...states0[k], state: 'unknown', attributes: {} }]))]);
}
// Text, der nie sichtbar sein darf (fehlende Werte, die durchrutschen)
const BAD = /\b(undefined|NaN|Invalid Date|null)\b|\[object /;
if (shots) mkdirSync(shots, { recursive: true });

const VIEWS = ['home', 'rooms', 'climate', 'bath', 'weather', 'printer', 'radio', 'clean'];
// room und heat brauchen einen Raum: es wird der erste Raum mit Thermostat genommen.
const SHEETS = ['lights', 'persons', 'quick', 'vent', 'cal', 'bat', 'doors', 'sys', 'waste', 'power', 'set', 'fuel', 'plants', 'kid', 'clean', 'tv', 'music', 'radio', 'shop', 'pzstat', 'radar', 'room', 'heat'];
const TARGETS = [
  { file: 'dist/home-aurora.js', tag: 'home-aurora', vp: { width: 412, height: 915 } },
  { file: 'dist/home-aurora-wide.js', tag: 'home-aurora-wide', vp: { width: 1280, height: 800 } },
];

// Läuft im Browser: baut ein hass-Objekt, das für die Karte wie Home Assistant aussieht.
function setup({ tag, states, hist, autos }) {
  const fc = (type) => {
    const out = [], now = Date.now(), step = type === 'daily' ? 864e5 : 36e5;
    for (let i = 0; i < (type === 'daily' ? 14 : 48); i++) out.push({ datetime: new Date(now + i * step).toISOString(), condition: ['sunny', 'partlycloudy', 'cloudy', 'rainy'][i % 4], temperature: 12 + 6 * Math.sin(i / 4), templow: 6, precipitation: i % 4 === 3 ? 1.2 : 0, precipitation_probability: (i * 13) % 100, wind_speed: 10 + (i % 5), wind_bearing: 220, humidity: 70, is_daytime: (i % 24) > 6 && (i % 24) < 20 });
    return out;
  };
  const hass = {
    states, entities: {}, devices: {}, areas: {}, user: { name: 'Test', is_admin: true }, language: 'de', locale: { language: 'de' },
    themes: { darkMode: true }, config: { latitude: 51.67, longitude: 8.35, time_zone: 'Europe/Berlin', unit_system: { temperature: '°C' } },
    hassUrl: (p) => p, calls: [],
    callService(d, s, data) { this.calls.push([d, s, data]); return Promise.resolve(); },
    // gespeicherte Automations-Konfiguration (config/automation/config/<id>) für die Heizplan-Erkennung
    callApi: async (method, path) => {
      // Kalender: je Kalender ein Termin heute, einer übermorgen und ein ganztägiger über zwei Tage (erfunden)
      if (path.startsWith('calendars/')) {
        const d = (n, h) => { const x = new Date(); x.setHours(h, 0, 0, 0); x.setDate(x.getDate() + n); return x; }, ymd = (x) => x.toLocaleDateString('sv-SE');
        return [{ summary: 'Termin', start: { dateTime: d(0, 18).toISOString() }, end: { dateTime: d(0, 19).toISOString() } }, { summary: 'Arzt', location: 'Praxis', start: { dateTime: d(2, 9).toISOString() }, end: { dateTime: d(2, 10).toISOString() } }, { summary: 'Urlaub', start: { date: ymd(d(1, 0)) }, end: { date: ymd(d(3, 0)) } }];
      }
      const m = /^config\/automation\/config\/(.+)$/.exec(path); if (!m) return []; const e = Object.keys(states).find((k) => k.startsWith('automation.') && states[k].attributes?.id === decodeURIComponent(m[1])); if (e && autos[e]) return autos[e]; throw new Error('not found'); },
    callWS: async (m) => {
      if (m.type === 'call_service' && m.service === 'get_forecasts') { const e = m.target.entity_id; return { response: { [e]: { forecast: fc(m.service_data.type) } } }; }
      // Verlauf: 24 h gleichmäßig verteilte Werte um den aktuellen Zustand (nur im Normaldurchlauf; die Chaos-Läufe testen „kein Verlauf“)
      if (m.type === 'history/history_during_period') {
        if (!hist) return {};
        const o = {}, now = Date.now() / 1000;
        for (const e of m.entity_ids || []) {
          const st = states[e]; if (!st) continue;
          const v = parseFloat(st.state);
          // Thermostate: abwechselnd heizen und warten, damit die Heizdauer etwas zu zählen hat
          const cl = e.startsWith('climate.') ? (i) => ({ a: { ...st.attributes, hvac_action: i % 6 < 2 ? 'heating' : 'idle' } }) : () => ({});
          o[e] = Array.from({ length: 48 }, (_, i) => ({ s: isNaN(v) ? st.state : String(Math.round((v + 1.5 * Math.sin(i / 7) + (i % 5) * 0.1) * 10) / 10), lu: now - (48 - i) * 1800, ...cl(i) }));
        }
        return o;
      }
      // To-do-Listen: erfundene Einkaufsliste und Rezepte (Rezept-JSON wie in der Rezeptbuch-Karte)
      if (m.type === 'todo/item/list') {
        if (m.entity_id === 'todo.horspiele') return { items: [
          { uid: 'h1', summary: 'Peppa Wutz', status: 'needs_action', description: JSON.stringify({ genre: 'ab 3', emoji: '🐷' }) }, { uid: 'h2', summary: 'Die Schule der magischen Tiere', status: 'needs_action', description: 'ab 6' },
        ] };
        if (m.entity_id === 'todo.radiosender') return { items: [
          { uid: 's1', summary: 'WDR 2', status: 'needs_action', description: JSON.stringify({ genre: 'Pop' }) }, { uid: 's2', summary: 'Radio Hochstift', status: 'needs_action', description: 'Lokalradio' },
          { uid: 's3', summary: 'Deutschlandfunk', status: 'needs_action', description: JSON.stringify({ genre: 'Nachrichten', cmd: 'spiele Deutschlandfunk' }) }, { uid: 's4', summary: 'Alt', status: 'completed' },
        ] };
        if (m.entity_id === 'todo.rezepte') return { items: [
          { uid: 'r1', summary: 'Pfannkuchen', status: 'needs_action', description: JSON.stringify({ schemaVersion: 2, servings: 4, category: 'Süßes', ingredients: [{ amount: '2', unit: '', name: 'Eier' }, { amount: '250', unit: 'ml', name: 'Milch' }, { amount: '½', unit: 'TL', name: 'Backpulver' }, { amount: '', unit: '', name: 'Salz' }], steps: ['Alles verrühren.', 'In der Pfanne ausbacken.'], image: null }) },
          { uid: 'r2', summary: 'Nudelauflauf', status: 'needs_action', description: JSON.stringify({ schemaVersion: 2, servings: 2, category: 'Hauptgericht', ingredients: [{ amount: '300', unit: 'g', name: 'Nudeln' }], steps: ['Kochen.'] }) },
          { uid: 'wp', summary: '__rezeptbuch_wochenplan__', status: 'needs_action', description: JSON.stringify({ schemaVersion: 2, weekStart: '2000-01-03', days: { montag: 'r1' } }) },
        ] };
        return { items: [
          { uid: 'a', summary: '1 l Milch', status: 'needs_action' }, { uid: 'b', summary: 'Brot', status: 'needs_action' }, { uid: 'c', summary: 'Öl', status: 'needs_action' }, { uid: 'd', summary: 'Öl', status: 'needs_action' },
          { uid: 'e', summary: 'Kaffee', status: 'completed', completed: '2026-01-01T10:00:00+00:00' },
        ] };
      }
      if (m.type === 'repairs/list_issues') return { issues: [] };
      if (m.type === 'schedule/list') return [];
      return {};
    },
  };
  const el = document.createElement(tag);
  el.setConfig({});
  document.body.appendChild(el);
  el.hass = hass;
  window.__el = el; window.__hass = hass;
}

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
let failed = 0;
const only = arg('--only', '');
for (const [vn, states] of VARIANTS) for (const t of TARGETS.filter((x) => !only || x.tag.endsWith(only))) {
  const page = await browser.newPage({ viewport: t.vp });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
  // Keine echten Netzwerkzugriffe (Radar-Kacheln, Wetterdienste): Tests sollen reproduzierbar sein.
  await page.route(/^https?:/, (r) => r.abort());
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#000"></body></html>');
  await page.addScriptTag({ content: readFileSync(join(root, t.file), 'utf8') });
  await page.evaluate(setup, { tag: t.tag, states, hist: !vn, autos });
  await page.waitForTimeout(800);

  const check = async (label, fn, a) => {
    const before = errors.length;
    const len = await page.evaluate(fn, a);
    await page.waitForTimeout(450);
    // erst nach dem Nachladen (Verlauf, Vorhersage) prüfen, ob irgendwo Platzhalter wie „NaN“ stehen
    const bad = await page.evaluate((re) => {
      const w = document.createTreeWalker(window.__el.shadowRoot, NodeFilter.SHOW_TEXT), rx = new RegExp(re);
      for (let n; (n = w.nextNode());) { if (n.parentElement?.closest('style,script')) continue; const m = n.data.match(rx); if (m) return `${m[0]} in „${n.data.trim().slice(0, 60)}“`; }
      return '';
    }, BAD.source);
    const ok = len > (vn ? 10 : 40) && errors.length === before && !bad;
    if (!ok) failed++;
    label = vn + label;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${t.tag} ${label}${ok ? '' : ` (Text: ${len} Zeichen${bad ? ', zeigt „' + bad + '“' : ''}${errors.length > before ? ', Fehler: ' + errors.slice(before).join(' | ') : ''})`}`);
    if (shots) await page.screenshot({ path: join(shots, `${t.tag}-${label.replace(/[^a-z0-9]+/gi, '-')}.png`) });
  };
  for (const v of VIEWS) {
    await check(`ansicht ${v}`, (v) => { const el = window.__el; el._closeSheet(); el._v = v; el._sig = ''; el._render(); return el.shadowRoot.querySelector('main').textContent.trim().length; }, v);
  }
  for (const s of SHEETS) {
    await page.evaluate((s) => { const el = window.__el; el._v = 'home'; el._sheet = { t: s, id: (el._c.rooms.find((r) => r.climate) || el._c.rooms[0])?.id }; el._render(); }, s);
    await check(`fenster ${s}`, () => window.__el.shadowRoot.querySelector('.sheet').textContent.trim().length);
  }
  // Heizung: jeder Raum mit Thermostat (gleiches Design für jede Heizungssteuerung)
  for (const id of await page.evaluate(() => window.__el._c.rooms.filter((r) => r.climate).map((r) => r.id))) {
    await page.evaluate((id) => { const el = window.__el; el._v = 'home'; el._sheet = { t: 'heat', id }; el._render(); }, id);
    await check(`fenster heizung ${id}`, () => window.__el.shadowRoot.querySelector('.sheet').textContent.trim().length);
  }
  // Kalender: Monat und Liste (Woche ist der Standard beim Öffnen)
  for (const m of ['month', 'list']) {
    await page.evaluate((m) => { const el = window.__el; el._v = 'home'; el._calMode = m; el._sheet = { t: 'cal' }; el._render(); }, m);
    await check(`fenster kalender ${m}`, () => window.__el.shadowRoot.querySelector('.sheet').textContent.trim().length);
  }
  await page.evaluate(() => { window.__el._calMode = 'week'; });
  // Radio: Reiter Hörspiele und sein Bearbeiten-Fenster
  await check('ansicht radio hoerspiele', () => { const el = window.__el; el._closeSheet(); el._v = 'radio'; el._rdTab = 'hs'; el._sig = ''; el._render(); return el.shadowRoot.querySelector('main').textContent.trim().length; });
  await page.evaluate(() => { const el = window.__el; el._sheet = { t: 'radio' }; el._render(); });
  await check('fenster hoerspiele', () => window.__el.shadowRoot.querySelector('.sheet').textContent.trim().length);
  // Hörspiele-Kategorien: ohne To-do-Liste gelten die Vorgaben aus der Konfiguration, dort gibt es mehrere Kategorien
  await page.evaluate(() => { const el = window.__el; el._hsSaved = el._c.radio?.hsp; el._c.radio = { ...(el._c.radio || {}), hsp: { list: '' } }; el._closeSheet(); el._v = 'radio'; el._rdTab = 'hs'; el._hsCat = ''; el._sig = ''; el._render(); });
  await check('hoerspiele kategorien', () => { const n = window.__el.shadowRoot.querySelectorAll('.rx-cats button').length; if (n < 5) throw new Error('Kategorie-Chips fehlen: ' + n); return window.__el.shadowRoot.querySelector('main').textContent.trim().length; });
  await page.evaluate(() => { const el = window.__el; el._hsCat = 'Krimi'; el._sig = ''; el._render(); });
  await check('hoerspiele krimi', () => { const n = window.__el.shadowRoot.querySelectorAll('.rxh[data-act="hsopen"]').length; if (n !== 2) throw new Error('Krimi-Filter zeigt ' + n + ' statt 2'); return window.__el.shadowRoot.querySelector('main').textContent.trim().length; });
  await page.evaluate(() => { const el = window.__el; el._c.radio = { ...(el._c.radio || {}), hsp: el._hsSaved }; el._hsCat = ''; el._closeSheet(); el._rdTab = 'rd'; el._v = 'home'; });
  // Deezer-Katalog fürs Folgen-Fenster: feste Antworten (das echte JSONP läuft in einem abgeschotteten iframe, das Playwright nicht abfängt)
  await page.evaluate(() => { const el = window.__el; try { localStorage.clear(); } catch (e) { /* ok */ } el._hsF = {};
    el._dzJsonp = async (path) => path.startsWith('search/artist') ? { data: [{ id: 1, name: 'PAW Patrol' }] }
      : { data: Array.from({ length: 50 }, (_, i) => ({ id: 100 + i, title: i === 3 ? 'PAW Patrol: The Movie (Original Soundtrack)' : `Folge ${455 - i}: Air Rescue - Die Rettung Nr. ${i} (Das Original-Hörspiel zur TV-Serie)`, release_date: `2026-0${1 + (i % 9)}-1${i % 10}`, cover_medium: '' })) }; el._sheet = { t: 'hsf', id: el._rdStations('hs')[1].id }; el._hsLim = 40; el._render(); });
  await page.waitForTimeout(600);
  await check('fenster folgen', () => { const sh = window.__el.shadowRoot.querySelector('.sheet'); if (sh.querySelectorAll('.hsr').length < 40 || /Soundtrack/.test(sh.textContent)) throw new Error('Folgenliste unvollständig: ' + sh.querySelectorAll('.hsr').length); return sh.textContent.trim().length; });
  await page.evaluate(() => { const el = window.__el, x = el._hsX(); el._hsF[el._hsKey(x)] = { err: 'nicht erreichbar' }; el._renderSheet(); });
  await check('fenster folgen offline', () => window.__el.shadowRoot.querySelector('.sheet').textContent.trim().length);
  await page.evaluate(() => { const el = window.__el; el._closeSheet(); el._rdTab = 'rd'; el._v = 'home'; });
  // Reiter Deezer: Favoriten, dann eine Suche mit festen Antworten
  await page.evaluate(() => { const el = window.__el; el._dzR = null; el._dzQ = ''; el._dzT = 'playlist'; el._v = 'radio'; el._rdTab = 'dz'; el._sig = ''; el._render();
    el._dzJsonp = async (path) => path.startsWith('search/playlist') ? { data: [{ id: 7, title: 'Chillout Lounge (Deluxe)', nb_tracks: 80, user: { name: 'Deezer Chill' }, picture_medium: 'https://e-cdns-images.dzcdn.net/images/cover/x/250x250.jpg' }, { id: 8, title: 'Sommerhits 2026', user: {} }, { id: 9 }] } : { data: [] }; });
  await check('ansicht radio deezer', () => window.__el.shadowRoot.querySelector('main').textContent.trim().length);
  await page.evaluate(() => window.__el._dzSearch('chill'));
  await check('deezer suche', () => { const n = window.__el.shadowRoot.querySelectorAll('.rxh[data-act="dzplay"]').length; if (n !== 4) throw new Error('Deezer zeigt ' + n + ' statt 4 Kacheln'); return window.__el.shadowRoot.querySelector('main').textContent.trim().length; });
  await page.evaluate(() => { const el = window.__el; el._dzT = 'artist'; return el._dzSearch('niemand'); });
  await check('deezer nichts gefunden', () => window.__el.shadowRoot.querySelector('main').textContent.trim().length);
  await page.evaluate(() => { const el = window.__el; el._dzJsonp = async () => { throw new Error('nicht erreichbar'); }; return el._dzSearch('chill'); });
  await check('deezer offline', () => window.__el.shadowRoot.querySelector('main').textContent.trim().length);
  await page.evaluate(() => { const el = window.__el; el._dzR = null; el._dzQ = ''; el._dzT = 'playlist'; el._rdTab = 'rd'; el._v = 'home'; });
  // Rezepte: Übersicht und ein geöffnetes Rezept (mit Portionen umgerechnet)
  await page.evaluate(() => { const el = window.__el; el._v = 'home'; el._shopTab = 'rcp'; el._rcpSel = null; el._sheet = { t: 'shop' }; el._render(); });
  await check('fenster rezepte', () => window.__el.shadowRoot.querySelector('.sheet').textContent.trim().length);
  await page.evaluate(() => { const el = window.__el; el._rcpSel = 'r1'; el._rcpServ = 6; el._renderSheet(); });
  await check('fenster rezept', () => window.__el.shadowRoot.querySelector('.sheet').textContent.trim().length);
  await page.evaluate(() => { const el = window.__el; el._shopTab = 'list'; el._rcpSel = null; el._rcpServ = 0; });
  if (t.tag.endsWith('wide')) {
    await check('bildschirmschoner', () => { const el = window.__el; el._closeSheet(); el._v = 'home'; el._render(); el._ambOn(); return el.shadowRoot.querySelector('.amb').textContent.trim().length; });
    await page.evaluate(() => window.__el._ambOff(true));
  }

  if (perf && !vn) {
    await page.evaluate(() => { const el = window.__el; el._closeSheet(); el._v = 'home'; el._sig = ''; el._render(); });
    await page.waitForTimeout(1000);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Performance.enable');
    const m = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
    const idle = async (label) => {
      const a = await m(); await page.waitForTimeout(5000); const b = await m();
      const ms = (k) => ((b[k] - a[k]) * 1000 / 5).toFixed(0);
      console.log(`perf ${t.tag} ${label}: Hauptthread ${ms('TaskDuration')} ms/s (Skript ${ms('ScriptDuration')}, Stil ${ms('RecalcStyleDuration')}, Layout ${ms('LayoutDuration')})`);
    };
    await idle('Leerlauf Startseite');
    if (t.tag.endsWith('wide')) { await page.evaluate(() => window.__el._ambOn()); await page.waitForTimeout(800); await idle('Leerlauf Bildschirmschoner'); await page.evaluate(() => window.__el._ambOff(true)); }
    // 300 HA-Updates eines unbeteiligten Sensors (wie HA: neues states-Objekt pro Änderung) → Kosten der Änderungsprüfung
    const tick = await page.evaluate(() => {
      const el = window.__el, h = window.__hass, ids = Object.keys(h.states);
      const other = ids.find((k) => k.startsWith('sensor.') && !el._watch.includes(k) && !k.includes('timer') && !el._isBat(k)) || ids[0];
      let st = h.states; const seq = [];
      for (let i = 0; i < 300; i++) { st = { ...st, [other]: { ...st[other], last_updated: new Date(Date.now() + i).toISOString() } }; seq.push({ ...h, states: st }); }
      const t0 = performance.now();
      for (const x of seq) el.hass = x;
      return ((performance.now() - t0) / 300).toFixed(3);
    });
    console.log(`perf ${t.tag} Änderungsprüfung pro HA-Update: ${tick} ms (${Object.keys(states0).length} Entitäten)`);
  }
  if (errors.length) console.log(`Fehler gesamt ${t.tag}: ${[...new Set(errors)].join(' | ')}`);
  await page.close();
}
await browser.close();
if (failed) { console.log(`${failed} Prüfung(en) fehlgeschlagen`); process.exit(1); }
console.log('alle Ansichten ok');
