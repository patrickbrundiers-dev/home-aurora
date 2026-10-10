# Home Aurora

Glas-Dashboard für Home Assistant (Räume, Klima, Bad, Wetter, Lichter, Kinder-Handy mit PIN).

- `dist/home-aurora.js` – Karte `custom:home-aurora` (Handy)
- `dist/home-aurora-wide.js` – Karte `custom:home-aurora-wide` (Tablet/Desktop, Querformat)

Installation über HACS (Benutzerdefiniertes Repository, Kategorie *Dashboard*). Die Ressourcen zeigen auf
`/hacsfiles/home-aurora/home-aurora.js` und `/hacsfiles/home-aurora/home-aurora-wide.js` (Typ *module*).

## Entwicklung

Beide Dateien in `dist/` werden aus einer Quelle erzeugt, nicht von Hand bearbeitet:

- `src/core.js` – gemeinsamer Code für beide Karten (mit `@@PLATZHALTERN@@` für Name, Tag, `WALL_UI` usw.)
- `src/wide.js` – Zusatz nur für die Querformat-Version (Cockpit-CSS und `HomeAuroraWide`)

Nach jeder Änderung in `src/`:

```sh
node scripts/build.mjs          # schreibt dist/home-aurora.js und dist/home-aurora-wide.js
node scripts/build.mjs --check  # prüft, ob dist/ zum Quellcode passt
```

Banner, Versionen und Kartenbeschreibungen stehen in `scripts/build.mjs`.
