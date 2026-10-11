#!/usr/bin/env node
// Rendert beide Karten (Handy + Wide) headless in Chromium mit Beispiel-Zuständen und prüft,
// dass jede Ansicht und jedes Fenster ohne JavaScript-Fehler Inhalt zeigt.
// Aufruf: node scripts/render-test.mjs [--states datei.json] [--shots ordner] [--perf]
//   --states  Zustände (Objekt entity_id → state); Standard: test/fixture-states.json (erfundene Werte)
//   --shots   speichert je Ansicht einen Screenshot (PNG) in diesen Ordner
//   --perf    misst zusätzlich die Last im Leerlauf und pro Home-Assistant-Update
//   --only    nur eine Karte testen (aurora oder wide)
//   --autos   Automations-Konfigurationen (Objekt entity_id → config) für automation/config; Standard: test/fixture-automations.json
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

const VIEWS = ['home', 'rooms', 'climate', 'bath', 'weather', 'printer', 'clean'];
// room und heat brauchen einen Raum: es wird der erste Raum mit Thermostat genommen.
const SHEETS = ['lights', 'persons', 'quick', 'vent', 'cal', 'bat', 'doors', 'sys', 'waste', 'power', 'set', 'fuel', 'plants', 'kid', 'clean', 'tv', 'music', 'pzstat', 'room', 'heat'];
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
    callApi: async () => [],
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
      if (m.type === 'automation/config') return autos[m.entity_id] ? { config: autos[m.entity_id] } : Promise.reject(new Error('not found'));
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
