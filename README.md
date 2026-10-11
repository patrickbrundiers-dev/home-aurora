# Home Aurora

Glas-Dashboard für Home Assistant (Räume, Klima, Bad, Wetter, Lichter, Kinder-Handy mit PIN).

- `dist/home-aurora.js` – Karte `custom:home-aurora` (Handy)
- `dist/home-aurora-wide.js` – Karte `custom:home-aurora-wide` (Tablet/Desktop, Querformat)

Installation über HACS (Benutzerdefiniertes Repository, Kategorie *Dashboard*). Die Ressourcen zeigen auf
`/hacsfiles/home-aurora/home-aurora.js` und `/hacsfiles/home-aurora/home-aurora-wide.js` (Typ *module*).

## Entwicklung

Beide Dateien in `dist/` werden aus einer Quelle erzeugt, nicht von Hand bearbeitet:

- `src/core/` – gemeinsamer Code für beide Karten (mit `@@PLATZHALTERN@@` für Name, Tag, `WALL_UI` usw.), nach Bereichen aufgeteilt (Konfiguration, Styles, Radar, Ansichten, Putzplan, Musik, Rendern, …). Der Build hängt die Dateien in Namensreihenfolge aneinander; die Klasse `HomeAurora` beginnt in `10-karte-grundlagen.js` und endet in `28-hintergrund-effekte.js`, die Dateien dazwischen enthalten ihre Methoden.
- `src/wide.js` – Zusatz nur für die Querformat-Version (Cockpit-CSS und `HomeAuroraWide`)

Nach jeder Änderung in `src/`:

```sh
node scripts/build.mjs          # schreibt dist/home-aurora.js und dist/home-aurora-wide.js
node scripts/build.mjs --check  # prüft, ob dist/ zum Quellcode passt
```

Banner, Versionen und Kartenbeschreibungen stehen in `scripts/build.mjs`.

Bei jedem Push prüft eine GitHub Action die Syntax beider Bundles und `node scripts/build.mjs --check`.

Außerdem rendert sie beide Karten headless in Chromium (`node scripts/render-test.mjs`) mit den bereinigten Beispielzuständen aus `test/fixture-states.json`: jede Ansicht und jedes Fenster muss Inhalt zeigen und darf keinen JavaScript-Fehler werfen und nirgends „NaN“, „undefined“ oder „Invalid Date“ anzeigen. Der Normaldurchlauf bekommt einen erfundenen 24-Stunden-Verlauf (Diagramme werden mitgetestet); mit `--chaos` (in CI an) läuft alles noch einmal ohne Verlauf mit fehlenden, nicht verfügbaren und unbekannten Geräten. Automations-Konfigurationen für die Heizplan-Erkennung kommen aus `test/fixture-automations.json`. Die Screenshots hängen am Lauf. Lokal geht das mit `npm i --no-save playwright && npx playwright install chromium` und denselben Befehl; `--states datei.json` nimmt echte Zustände, `--perf` misst zusätzlich die Last.
