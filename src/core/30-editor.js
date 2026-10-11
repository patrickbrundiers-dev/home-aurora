/* ───────────── Visueller Editor ───────────── */
const EDITOR_SCHEMA = [
  { name: 'theme', selector: { select: { mode: 'dropdown', options: [{ value: 'dark', label: 'Dunkel' }, { value: 'light', label: 'Hell' }, { value: 'auto', label: 'Automatisch (wie Home Assistant)' }] } } },
  { name: 'ambient_after', selector: { select: { mode: 'dropdown', options: [{ value: 0, label: 'Aus' }, { value: 2, label: 'Nach 2 Minuten' }, { value: 5, label: 'Nach 5 Minuten' }, { value: 10, label: 'Nach 10 Minuten' }, { value: 30, label: 'Nach 30 Minuten' }] } } },
  { name: 'putzplan', selector: { boolean: {} } },
  { name: 'putzplan_view', selector: { boolean: {} } },
  { name: 'einkauf', selector: { boolean: {} } },
  { name: 'weather', selector: { entity: { domain: 'weather' } } },
  { name: 'persons', selector: { entity: { domain: 'person', multiple: true } } },
  { name: 'radar', selector: { entity: { domain: 'camera' } } },
  { name: 'radarUrl', selector: { text: {} } },
  { name: 'calendarDays', selector: { number: { min: 3, max: 60, mode: 'box' } } },
  { name: 'batteryLow', selector: { number: { min: 5, max: 50, mode: 'box', unit_of_measurement: '%' } } },
];
const EDITOR_LABELS = { theme: 'Design', ambient_after: 'Wandtablet-Modus automatisch starten', weather: 'Wetter-Entität', persons: 'Personen', radar: 'Regenradar-Kamera', radarUrl: 'Eigene Radar-URL (optional, Live-Karte)', putzplan: 'Putzplan anzeigen', putzplan_view: 'Putzplan als eigene Ansicht öffnen (sonst als Fenster)', einkauf: 'Einkaufsliste & Rezepte anzeigen', calendarDays: 'Termine: Tage voraus', batteryLow: 'Batterie schwach ab' };
class HomeAuroraEditor extends HTMLElement {
  setConfig(c) { this._c = c || {}; this._draw(); }
  set hass(h) { this._h = h; if (this._f) this._f.hass = h; }
  _draw() {
    if (!this._f) {
      this._f = document.createElement('ha-form');
      this._f.computeLabel = s => EDITOR_LABELS[s.name] || s.name;
      this._f.addEventListener('value-changed', ev => {
        ev.stopPropagation();
        this._c = { ...this._c, ...ev.detail.value };
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true }));
      });
      const note = document.createElement('p');
      note.style.cssText = 'font-size:12px;opacity:.7;margin:12px 0 0';
      note.textContent = 'Räume, Kalender, Drucker, Stromgeräte und Schnellaktionen stellst du im YAML-Editor ein (siehe Kommentare in home-aurora.js).';
      this.appendChild(this._f); this.appendChild(note);
    }
    this._f.hass = this._h; this._f.schema = WALL_UI ? EDITOR_SCHEMA : EDITOR_SCHEMA.filter(s => s.name !== 'ambient_after'); this._f.data = { theme: 'dark', ambient_after: 0, putzplan: true, putzplan_view: true, einkauf: true, ...this._c };
  }
}
//@@WIDE_ONLY@@
customElements.define('@@TAG@@-editor', HomeAuroraEditor);

customElements.define('@@TAG@@', @@CLASS@@);
window.customCards = window.customCards || [];
window.customCards.push({ type: '@@TAG@@', name: '@@NAME@@', description: '@@DESCRIPTION@@', preview: false });
})();
