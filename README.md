# Home Aurora

Glas-Dashboard für Home Assistant (Räume, Klima, Bad, Wetter, Radio, Lichter, Kinder-Handy mit PIN).

- `dist/home-aurora.js` – Karte `custom:home-aurora` (Handy)
- `dist/home-aurora-wide.js` – Karte `custom:home-aurora-wide` (Tablet/Desktop, Querformat)

Installation über HACS (Benutzerdefiniertes Repository, Kategorie *Dashboard*). Die Ressourcen zeigen auf
`/hacsfiles/home-aurora/home-aurora.js` und `/hacsfiles/home-aurora/home-aurora-wide.js` (Typ *module*).

## Hörspiele ab Kapitel 1

Alexa spielt bei Deezer (und Spotify) von einem Hörspiel-Album nur ein einzelnes Kapitel, oft ein mittleres, und danach eine Mischung; „vorheriger Titel“ springt nur an den Anfang dieses Kapitels. Deshalb holt das Folgen-Fenster die Kapitel der gewählten Folge aus dem öffentlichen Deezer-Katalog und übergibt sie dem HA-Skript `script.aurora_hoerspiel` (Einstellung `radio.hsp.script`). Das Skript startet Kapitel 1 per „spiele den Titel Kapitel 01 … von ‹Hörspiel› auf Deezer“ und kurz vor dem Ende jedes Kapitels das nächste. Es hört auf, sobald vor dem Kapitelende etwas anderes läuft oder am Echo etwas anderes gewünscht wird. Gibt es das Skript nicht, startet Alexa die Folge wie bisher als Album.

Das Skript (Einstellungen → Automationen & Szenen → Skripte → Neu → YAML), Skript-ID `aurora_hoerspiel`:

```yaml
alias: "Aurora: Hörspiel Kapitel für Kapitel"
mode: parallel
max: 10
max_exceeded: silent
fields:
  watch: {required: true, selector: {entity: {domain: media_player}}}   # Echo (Alexa Media)
  device_id: {selector: {text: {}}}                                      # Alexa Devices, leer = play_media
  tracks: {required: true, selector: {object: {}}}                       # [{t: Titel, c: Alexa-Befehl}]
sequence:
  - variables:
      cmds: "{{ tracks | map(attribute='c') | map('lower') | list }}"
      s0: "{{ (state_attr(watch, 'last_called_summary') or '') | lower }}"
  - repeat:
      for_each: "{{ tracks }}"
      sequence:
        - variables:
            want: "{{ repeat.item.t | lower | regex_replace('[^a-z0-9äöüß]', '') }}"
        - if: "{{ (state_attr(watch, 'media_title') or '') | lower | regex_replace('[^a-z0-9äöüß]', '') != want }}"
          then:
            - if: "{{ device_id | default('') != '' }}"
              then:
                - action: alexa_devices.send_text_command
                  data: {device_id: "{{ device_id }}", text_command: "{{ repeat.item.c }}"}
              else:
                - action: media_player.play_media
                  target: {entity_id: "{{ watch }}"}
                  data: {media: {media_content_type: custom, media_content_id: "{{ repeat.item.c }}"}}
            - wait_template: "{{ (state_attr(watch, 'media_title') or '') | lower | regex_replace('[^a-z0-9äöüß]', '') == want }}"
              timeout: {seconds: 40}
            - if: "{{ not wait.completed }}"
              then: [{stop: Alexa hat das Kapitel nicht gestartet}]
            - delay: {seconds: 3}
        - variables:   # Sekunden bis kurz vor Kapitelende
            rest: >-
              {% set p = state_attr(watch, 'media_position') | float(0) %}{% set u = state_attr(watch, 'media_position_updated_at') %}
              {% set el = p + ((now() - as_datetime(u | string)).total_seconds() if u and is_state(watch, 'playing') else 0) %}
              {{ [(state_attr(watch, 'media_duration') | float(0)) - el - 2, 5] | max | round(0) | int }}
        - wait_template: >-
            {% set s = (state_attr(watch, 'last_called_summary') or '') | lower %}
            {{ (state_attr(watch, 'media_title') or '') | lower | regex_replace('[^a-z0-9äöüß]', '') != want or (s != s0 and s not in cmds) }}
          timeout: {seconds: "{{ rest }}"}
        - if: "{% set s = (state_attr(watch, 'last_called_summary') or '') | lower %}{{ s != s0 and s not in cmds }}"
          then: [{stop: Am Echo wurde etwas anderes gewünscht}]
        - if: "{{ wait.completed and wait.remaining > 10 }}"
          then: [{stop: Vor Kapitelende wurde etwas anderes abgespielt}]
        - if: "{{ not wait.completed and not is_state(watch, 'playing') }}"
          then:   # pausiert: auf das Kapitelende warten
            - wait_template: >-
                {% set s = (state_attr(watch, 'last_called_summary') or '') | lower %}
                {{ (state_attr(watch, 'media_title') or '') | lower | regex_replace('[^a-z0-9äöüß]', '') != want or (s != s0 and s not in cmds) }}
              timeout: {hours: 3}
              continue_on_timeout: false
            - if: "{% set s = (state_attr(watch, 'last_called_summary') or '') | lower %}{{ s != s0 and s not in cmds }}"
              then: [{stop: Am Echo wurde etwas anderes gewünscht}]
```

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
