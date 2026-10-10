#!/usr/bin/env node
// Erzeugt dist/home-aurora.js (Handy) und dist/home-aurora-wide.js (Querformat) aus src/.
// src/core.js ist der gemeinsame Code mit @@PLATZHALTERN@@, src/wide.js der Zusatz nur für Wide.
// Aufruf: node scripts/build.mjs          → schreibt beide Dateien nach dist/
//         node scripts/build.mjs --check  → prüft nur, ob dist/ aktuell ist (Exit 1 bei Abweichung)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const TARGETS = [
  {
    file: 'dist/home-aurora.js',
    wide: false,
    vars: {
      BANNER: 'Home Aurora v5.0 — lokale Custom Card für Home Assistant (keine Cloud, keine externen Abhängigkeiten)',
      TAG: 'home-aurora',
      CLASS: 'HomeAurora',
      NAME: 'Home Aurora',
      DESCRIPTION: 'Modernes Glas-Dashboard für das ganze Zuhause (Räume, Klima, Bad, Wetter, Lichter)',
    },
  },
  {
    file: 'dist/home-aurora-wide.js',
    wide: true,
    vars: {
      BANNER: 'Home Aurora Wide v5.3 (Querformat) · basiert auf Home Aurora v5.0 — lokale Custom Card für Home Assistant (keine Cloud, keine externen Abhängigkeiten)',
      TAG: 'home-aurora-wide',
      CLASS: 'HomeAuroraWide',
      NAME: 'Home Aurora Wide',
      DESCRIPTION: 'Home Aurora im Querformat für Tablet und Desktop (Cockpit ohne Scrollen)',
    },
  },
];

const core = read('src/core.js');
const wideExt = read('src/wide.js');
const WIDE_MARK = '//@@WIDE_ONLY@@\n';
if (core.split(WIDE_MARK).length !== 2) throw new Error(`src/core.js: ${WIDE_MARK.trim()} muss genau einmal vorkommen`);

function render({ wide, vars }) {
  let out = core.replace(WIDE_MARK, () => (wide ? wideExt : ''));
  out = out.replace(/@@([A-Z_]+)@@/g, (m, k) => {
    if (k === 'WALL_UI') return String(wide);
    if (!(k in vars)) throw new Error(`Unbekannter Platzhalter ${m}`);
    return vars[k];
  });
  return out;
}

const check = process.argv.includes('--check');
let stale = 0;
for (const t of TARGETS) {
  const out = render(t);
  if (check) {
    let cur = '';
    try { cur = read(t.file); } catch {}
    if (cur !== out) { stale++; console.error(`veraltet: ${t.file} (node scripts/build.mjs ausführen)`); }
    else console.log(`ok: ${t.file}`);
  } else {
    writeFileSync(join(root, t.file), out);
    console.log(`geschrieben: ${t.file} (${Buffer.byteLength(out)} Bytes)`);
  }
}
process.exit(stale ? 1 : 0);
