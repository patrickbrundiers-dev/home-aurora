/*! Home Aurora Wide v5.3 (Querformat) · basiert auf Home Aurora v5.0 — lokale Custom Card für Home Assistant (keine Cloud, keine externen Abhängigkeiten) */
(() => {
'use strict';
const WALL_UI = true; // Wandtablet-/Ambient-Modus: nur in der Querformat-Version (Build setzt true)
if (customElements.get('home-aurora-wide')) return;

/* ───────────── Konfiguration (alles per Karten-YAML überschreibbar) ───────────── */
let WH = '255,255,255', FG = '#fff';
const DEFAULTS = {
  persons: ['person.home_sweet_home', 'person.jenny', 'person.leonie'],
  weather: 'weather.forecast_home',
  weatherCompact: 'weather.lippstadt_boekenfoer',
  trend: 'sensor.kachelmannwetter_14_tage_trend',
  outdoor: { temp: 'sensor.hp2550a_pro_v1_9_3_outdoor_temperature', hum: 'sensor.hp2550a_pro_v1_9_3_humidity', wind: 'sensor.hp2550a_pro_v1_9_3_wind_speed', rain: 'sensor.hp2550a_pro_v1_9_3_rain_rate' },
  sun: 'sun.sun',
  radar: 'camera.precipitation',
  stats: { open: 'sensor.offene_turen_fenster_zahler', vent: 'sensor.luften_ubersicht_raume_mit_luftungsbedarf', ventRoom: 'sensor.luften_ubersicht_dringendster_raum', bath: 'sensor.badezimmer' },
  extras: { waste: 'sensor.abfallkalender', fuel: 'sensor.tankstelle_gunstigster_preis', fuelName: 'sensor.tankstelle_gunstigste', kids: 'input_boolean.kindersicherung_tv', winter: 'binary_sensor.wintermodus' },
  stationWeather: 'weather.kachelmannwetter',
  station: {
    name: 'Wetterstation Zuhause',
    temp: 'sensor.hp2550a_pro_v1_9_3_outdoor_temperature', hum: 'sensor.hp2550a_pro_v1_9_3_humidity', feels: 'sensor.hp2550a_pro_v1_9_3_feels_like_temperature', dew: 'sensor.hp2550a_pro_v1_9_3_dewpoint', windchill: 'sensor.hp2550a_pro_v1_9_3_windchill',
    humidex: 'sensor.draussen_humidex', humidexL: 'sensor.draussen_humidex_gefuhlt', heat: 'sensor.draussen_hitzeindex', simmer: 'sensor.draussen_sommer_simmer_index', simmerL: 'sensor.draussen_sommer_simmer_gefuhlt', thom: 'sensor.draussen_thoms_discomfort_gefuhlt',
    dewL: 'sensor.draussen_taupunkt_gefuhlt', frost: 'sensor.draussen_frostpunkt', frostRisk: 'sensor.draussen_frostgefahr', absHum: 'sensor.draussen_absolute_luftfeuchtigkeit', enthalpy: 'sensor.draussen_enthalpie_feuchter_luft',
    press: 'sensor.hp2550a_pro_v1_9_3_relative_pressure', vpd: 'sensor.hp2550a_pro_v1_9_3_vapour_pressure_deficit',
    speed: 'sensor.hp2550a_pro_v1_9_3_wind_speed', gust: 'sensor.hp2550a_pro_v1_9_3_wind_gust', maxGust: 'sensor.hp2550a_pro_v1_9_3_max_daily_gust', dir: 'sensor.hp2550a_pro_v1_9_3_wind_direction', dir10: 'sensor.hp2550a_pro_v1_9_3_wind_direction_10m_avg',
    rainRate: 'sensor.hp2550a_pro_v1_9_3_rain_rate', rainEvent: 'sensor.hp2550a_pro_v1_9_3_event_rain', rainHour: 'sensor.hp2550a_pro_v1_9_3_hourly_rain', dayRain: 'sensor.hp2550a_pro_v1_9_3_daily_rain', rainWeek: 'sensor.hp2550a_pro_v1_9_3_weekly_rain', rainMonth: 'sensor.hp2550a_pro_v1_9_3_monthly_rain', rainYear: 'sensor.hp2550a_pro_v1_9_3_yearly_rain',
    uv: 'sensor.hp2550a_pro_v1_9_3_uv_index', solar: 'sensor.hp2550a_pro_v1_9_3_solar_radiation', lux: 'sensor.hp2550a_pro_v1_9_3_solar_lux',
    strikes: 'sensor.hp2550a_pro_v1_9_3_lightning_strikes', lastStrike: 'sensor.hp2550a_pro_v1_9_3_last_lightning_strike', strikeDist: 'sensor.hp2550a_pro_v1_9_3_lightning_strike_distance',
    innen: { exclude: ['bad'], extra: [['Flur', 'sensor.flur_vorne_temperature', 'sensor.flur_vorne_humidity']] },
    indoor: [['sensor.hp2550a_pro_v1_9_3_indoor_temperature', 'sensor.hp2550a_pro_v1_9_3_indoor_humidity', 'sensor.hp2550a_pro_v1_9_3_indoor_dewpoint'], ['sensor.hp2550a_pro_v1_9_3_temperature_2', 'sensor.hp2550a_pro_v1_9_3_humidity_2', 'sensor.hp2550a_pro_v1_9_3_dewpoint_2']],
    batteryPct: ['sensor.hp2550a_pro_v1_9_3_wh57_battery'], batteryBin: ['binary_sensor.hp2550a_pro_v1_9_3_wh65_battery', 'binary_sensor.hp2550a_pro_v1_9_3_wh25_battery', 'binary_sensor.hp2550a_pro_v1_9_3_battery_2'],
  },
  kidScript: 'script.kinderhandy_aktion',
  kidphones: [{ name: 'Leonie', title: 'Leonies Handy', lock: 'switch.redmi', b15: 'button.redmi_15min', b30: 'button.redmi_30min', b60: 'button.redmi_60min', reset: 'button.redmi_reset_bonus', ring: 'button.redmi_ring', used: 'sensor.redmi_daily_screen_time', bonus: 'sensor.redmi_active_bonus', next: 'sensor.redmi_next_restriction', limit: 'sensor.redmi_daily_limit', bed: 'binary_sensor.redmi_bedtime_active', school: 'binary_sensor.redmi_school_time_active', reached: 'binary_sensor.redmi_daily_limit_reached', schoolFree: 'input_boolean.leonie_schule_heute_frei', schoolWin: 'input_text.leonie_schulzeit_original_heute' }],
  unlock: { entity: 'input_boolean.tablet_entsperrt', pin: 'input_text.tablet_pin', code: '' },
  alerts: { now: 'sensor.stadt_delbruck_aktuelle_warnstufe', pre: 'sensor.stadt_delbruck_vorwarnstufe', washer: { name: 'Waschmaschine', state: 'sensor.waschmaschine_zustand', pct: 'sensor.waschmaschine_fortschritt', left: 'sensor.waschmaschine_verbleibende_zeit', unload: 'button.badezimmer_waschmaschine_als_entladen_markieren' } },
  calendars: [
    ['calendar.dienstplan_jenny_dienstplan', 'Dienstplan', '#f472b6'], ['calendar.familie', 'Familie', '#5eead4'], ['calendar.huck0992_googlemail_com', 'Patrick', '#818cf8'],
    ['calendar.patrick_brundiers_gmail_com', 'Patrick privat', '#38bdf8'], ['calendar.geburtstage_2', 'Geburtstage', '#fbbf24'], ['calendar.landkreis_paderborn_mymuell_app', 'Müll', '#a3a3a3'], ['calendar.feiertage_in_deutschland', 'Feiertage', '#fb923c'],
  ],
  calendarDays: 14,
  theme: 'dark', ambient_after: 0, radarUrl: '',
  quick: [['builtin:goodnight', 'Gute Nacht', 'moon'], ['scene.wohnzimmer_wohnzimmer_tv_schauen', 'TV schauen', 'tv'], ['scene.wohnzimmer_gemutlich', 'Gemütlich', 'sofa'], ['scene.wohnzimmer_normal', 'Normal', 'bulb'], ['scene.wohnzimmer_essenszeit', 'Essenszeit', 'cook'], ['script.essen', 'Essen', 'cook']],
  wasteNames: { biomuell: ['Biotonne', '#a3e635'], papier: ['Papiertonne', '#60a5fa'], gelbe_tonne: ['Gelbe Tonne', '#facc15'], restmuell: ['Restmüll', '#94a3b8'], schadstoffe: ['Schadstoffmobil', '#fb923c'] },
  critical: ['light', 'climate', 'lock', 'cover', 'alarm_control_panel', 'vacuum', 'fan'],
  ignore: ['music_assistant', 'p2s_'],
  power: {
    priceEntity: 'input_number.strompreis',
    price: null,
    pv: { now: 'sensor.power_production_now', today: 'sensor.energy_production_today', tomorrow: 'sensor.energy_production_tomorrow', remaining: 'sensor.energy_production_today_remaining' },
    devices: [
      ['sensor.lichterkette_wintergarten_leistung', 'sensor.lichterkette_wintergarten_energie_gesamt', '3D-Drucker', 'printer'],
      ['sensor.kuche_kuhlschrank_leistung', 'sensor.kuche_kuhlschrank_energie_gesamt', 'Kühlschrank', 'plug'],
      ['sensor.lsc_power_plug_eu_incl_power_meter_leistung', 'sensor.lsc_power_plug_eu_incl_power_meter_energie_gesamt', 'Kühlschrank Wintergarten', 'plug'],
      ['sensor.lsc_power_plug_eu_incl_power_meter_2_leistung', 'sensor.lsc_power_plug_eu_incl_power_meter_2_energie_gesamt', 'Spülmaschine', 'plug'],
      ['sensor.lsc_power_plug_eu_incl_power_meter_3_leistung', 'sensor.lsc_power_plug_eu_incl_power_meter_3_energie_gesamt', 'Trockner', 'plug'],
      ['sensor.badezimmer_waschmaschine_leistung', 'sensor.badezimmer_waschmaschine_energie_gesamt', 'Waschmaschine', 'plug'],
      ['sensor.kuche_kuche_kochfeld_leistung', 'sensor.kuche_kuche_kochfeld_energie', 'Küche Kochfeld', 'cook'],
      ['sensor.wohnzimmer_sofa_indirekt_leistung', 'sensor.wohnzimmer_sofa_indirekt_energie', 'Sofa indirekt', 'bulb'],
      ['sensor.wohnzimmer_wohnzimmer_sofa_sofa_licht_leistung', 'sensor.wohnzimmer_wohnzimmer_sofa_sofa_licht_energie', 'Sofa Ecke Licht', 'bulb'],
      ['sensor.flur_vorne_flur_vorne_kleines_licht_leistung', 'sensor.flur_vorne_flur_vorne_kleines_licht_energie', 'Flur vorne Licht', 'bulb'],
      ['sensor.steckdose_flur_hinten_power', 'sensor.steckdose_flur_hinten_energy', 'Steckdose Flur hinten', 'plug'],
    ],
  },
  plant: { entity: 'input_datetime.zuletzt_gegossen', name: 'Pflanzen', days: 7 },
  printer: {
    name: 'Bambu Lab P2S', prefix: 'sensor.p2s_22e8bj610701482_',
    camera: 'camera.p2s_22e8bj610701482_kamera', light: 'light.p2s_22e8bj610701482_druckraumbeleuchtung', power: 'switch.lichterkette_wintergarten_steckdose_1',
    online: 'binary_sensor.p2s_22e8bj610701482_online', door: 'binary_sensor.p2s_22e8bj610701482_gehausetur', error: 'binary_sensor.p2s_22e8bj610701482_druckfehler', hms: 'binary_sensor.p2s_22e8bj610701482_hms_fehler',
    energyJob: 'sensor.3d_druck_energie_aktueller_job', energyTotal: 'sensor.3d_druck_energie_gesamt', energyYear: 'sensor.3d_drucker_strom_jahr', cost: 'sensor.3d_druck_kosten_aktueller_druck', filamentCost: 'sensor.3d_druck_filamentkosten_aktueller_job',
    powerW: 'sensor.lichterkette_wintergarten_leistung', volt: 'sensor.lichterkette_wintergarten_spannung',
  },
  batteryLow: 20,
  bath: {
    room: 'bad',
    stats: [
      ['sensor.bad_duschen_heute', 'Duschen heute', ''], ['sensor.bad_duschminuten_heute', 'Minuten heute', 'min'],
      ['sensor.bad_duschen_woche', 'Diese Woche', ''], ['sensor.bad_duschminuten_woche', 'Minuten Woche', 'min'],
      ['sensor.bad_duschen_monat', 'Dieser Monat', ''], ['sensor.bad_duschminuten_monat', 'Minuten Monat', 'min'],
      ['sensor.bad_dusche_durchschnitt_heute', 'Ø Dauer heute', 'min'], ['sensor.bad_duschen_gesamt', 'Gesamt', ''],
    ],
  },
  rooms: [
    { id: 'wohnzimmer', name: 'Wohnzimmer', icon: 'sofa', temp: 'sensor.0x00158d008b860ecb_temperature', hum: 'sensor.0x00158d008b860ecb_humidity', climate: 'climate.wohnzimmer_bt', window: ['binary_sensor.fenster_wohnzimmer'], lights: ['light.wohnzimmer_sofa', 'light.sofa_indirekt', 'light.bilderleiste', 'light.flur_vorne_1'], media: ['media_player.wohnzimmer_google_tv', ['media_player.wohnzimmer', 'media_player.wohnzimmer_wohnzimmer']] },
    { id: 'kueche', name: 'Küche', icon: 'cook', temp: 'sensor.kuche_temperatur_temperature', hum: 'sensor.kuche_temperatur_humidity', window: ['binary_sensor.balkontur_contact'], lights: ['light.kuche_kochfeld', 'light.lsc_smart_led_strip_rgbcctic_5m'], media: [['media_player.jenny_patrick', 'media_player.kuche_jenny_patrick']] },
    { id: 'schlafzimmer', name: 'Schlafzimmer', icon: 'bed', temp: 'sensor.schlafzimmer_temperatur_temperature', hum: 'sensor.schlafzimmer_temperatur_humidity', climate: 'climate.schlafzimmer_bt', window: ['binary_sensor.fenster_schlafzimmer'], lights: ['light.bett_patrick', 'light.schlafzimmer_patrick_nachtlicht', 'light.jenny_nachtlicht', 'light.schlafzimmer'], media: ['media_player.fernseher_im_schlafzimmer', 'media_player.fernseher_im_schlafzimmer_2'] },
    { id: 'leonie', name: 'Leonie', icon: 'star', temp: 'sensor.leonie_temp_temperature', hum: 'sensor.leonie_temp_humidity', climate: 'climate.leonie_bt', window: ['binary_sensor.leonie_leonie_fenster'], lights: ['light.leonie_bett_licht'], media: ['media_player.leonie_leonie_alexa'] },
    { id: 'nele', name: 'Nele', icon: 'heart', temp: 'sensor.nele_temperatur_temperature', hum: 'sensor.nele_temperatur_humidity', climate: 'climate.kleines_kinderzimmer_2', window: ['binary_sensor.lisa_fenster_contact'], media: [['media_player.kinderzimmer', 'media_player.nele_nele_alexa']] },
    { id: 'lisa', name: 'Lisa', icon: 'sparkle', temp: 'sensor.lisa_temperatur_temperature_2', hum: 'sensor.lisa_temperatur_humidity_2', climate: 'climate.grosse_kinderzimmer_bt', window: ['binary_sensor.fenster_grosses_kinderzimmer'], media: ['media_player.patricks_echo_dot'] },
    { id: 'bad', name: 'Bad', icon: 'bath', temp: 'sensor.0x00158d008b862b8b_temperature', hum: 'sensor.badezimmer_luftfeuchtigkeit', climate: 'climate.grosses_bat_bt', window: ['binary_sensor.fenster_bad_gr'], lights: ['light.badezimmer_licht_schalter_1', 'light.flur_vorne_2'] },
    { id: 'flur', name: 'Flur', icon: 'door', lights: ['light.flur_vorne_flur_vorne_kleines_licht', 'light.steckdose_flur_hinten'] },
  ],
};

const ENUM = {
  very_comfortable: 'Sehr angenehm', comfortable: 'Angenehm', dry: 'Trocken', ok_but_humid: 'Okay, aber feucht', somewhat_uncomfortable: 'Etwas unangenehm', quite_uncomfortable: 'Ziemlich unangenehm', extremely_uncomfortable: 'Sehr unangenehm', severely_high: 'Extrem hoch',
  noticable_discomfort: 'Spürbares Unbehagen', evident_discomfort: 'Deutliches Unbehagen', great_discomfort: 'Großes Unbehagen', dangerous_discomfort: 'Gefährlich', heat_stroke: 'Hitzschlaggefahr',
  no_risk: 'Kein Risiko', unlikely: 'Unwahrscheinlich', probable: 'Wahrscheinlich', high: 'Hoch',
  cool: 'Kühl', slightly_cool: 'Leicht kühl', slightly_warm: 'Leicht warm', increased_discomfort: 'Erhöhtes Unbehagen', caution_heat_stress: 'Vorsicht, Hitzestress', danger_heat_stress: 'Gefahr, Hitzestress', extreme_danger: 'Extreme Gefahr',
  no_discomfort: 'Kein Unbehagen', less_than_half: 'Weniger als die Hälfte', more_than_half: 'Mehr als die Hälfte', most: 'Die meisten', everyone: 'Alle', dangerous: 'Gefährlich',
};
const TABS = [['home', 'Zuhause', 'home'], ['rooms', 'Räume', 'grid'], ['climate', 'Klima', 'thermo'], ['bath', 'Bad', 'bath'], ['weather', 'Wetter', 'cloudsun'], ['printer', 'Drucker', 'printer']];

/* ───────────── Icons (eigene Strich-Icons, 24er Raster) ───────────── */
const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  bath: '<path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M7 21l-1 1M17 21l1 1"/>',
  cloudsun: '<circle cx="8" cy="8" r="3"/><path d="M8 2v1M2 8h1M3.7 3.7l.7.7M12.3 3.7l-.7.7"/><path d="M8 20h9a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.6 1.5A3.4 3.4 0 0 0 8 20z"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  window: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18M4 12h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  wind: '<path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"/>',
  rain: '<path d="M7 15a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.6 1.5A3.4 3.4 0 0 1 17 15z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  door: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"/><path d="M4 21h16"/><circle cx="14.5" cy="12.5" r=".8" fill="currentColor"/>',
  flame: '<path d="M12 22c4 0 7-2.7 7-7 0-3-2-5-3.5-7-.3 2-1.5 3-2.5 3 0-3-1.5-6-4-8 0 4-4 6-4 12 0 4.3 3 7 7 7z"/>',
  power: '<path d="M12 3v9"/><path d="M6.3 6.3a8 8 0 1 0 11.4 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  news: '<path d="M4 5h13v14H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v8a2 2 0 0 1-2 2"/><path d="M7.500 9h6M7.500 12.500h6M7.500 16h4"/>',
  recycle: '<path d="M20 12a8 8 0 0 0-13.500-5.800L4 8.500"/><path d="M4 4v4.500h4.500"/><path d="M4 12a8 8 0 0 0 13.500 5.800L20 15.500"/><path d="M20 20v-4.500h-4.500"/>',
  truck: '<path d="M2 16.500V7h11v9.500"/><path d="M13 10h4l3.500 3.500v3H13"/><circle cx="6.500" cy="17.500" r="1.800"/><circle cx="16.500" cy="17.500" r="1.800"/>',
  flower: '<circle cx="12" cy="12" r="2.200"/><path d="M12 9.800c-2-1.500-2-5 0-6.300 2 1.300 2 4.800 0 6.300zM14.200 12c1.500-2 5-2 6.300 0-1.300 2-4.800 2-6.300 0zM12 14.200c2 1.500 2 5 0 6.300-2-1.300-2-4.800 0-6.300zM9.800 12c-1.500 2-5 2-6.300 0 1.300-2 4.800-2 6.300 0z"/>',
  fuel: '<path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V9l-3-3"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/>',
  sofa: '<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"/><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"/>',
  cook: '<path d="M6 13h12v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M8 13a4 4 0 1 1 1.5-7.7 3.5 3.5 0 0 1 5 0A4 4 0 1 1 16 13"/>',
  bed: '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.5"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  heart: '<path d="M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.300 12 20 12 20z"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.200-1.800z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  play: '<path d="M7 4v16l13-8z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  arrowdown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  arrowup: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.500v.1"/>',
  check: '<path d="M5 12.500l4.500 4.500L19 7"/>',
  snow: '<path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5L4.9 17.5"/><path d="M9.5 3.8L12 6l2.5-2.2M9.5 20.2L12 18l2.5 2.2"/>',
  radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6"/>',
  gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-5"/>',
  spool: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
  dots: '<circle cx="5.500" cy="12" r="1.600" fill="currentColor"/><circle cx="12" cy="12" r="1.600" fill="currentColor"/><circle cx="18.500" cy="12" r="1.600" fill="currentColor"/>',
  cal: '<rect x="3.500" y="5" width="17" height="15.500" rx="3"/><path d="M3.500 10h17M8 3v4M16 3v4"/>',
  cart: '<path d="M3 4h2.500l2 11h10.500l2-8H6.500"/><circle cx="9.500" cy="19.500" r="1.400"/><circle cx="16.500" cy="19.500" r="1.400"/>',
  leaf: '<path d="M5 19c0-8 4-13 15-14 0 10-5 15-13 15"/><path d="M5 19c3-5 6-8 10-10"/>',
  printer: '<path d="M7 9V3.500h10V9"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v6.500H7z"/>',
  battery: '<rect x="2.500" y="7" width="17" height="10" rx="2.500"/><path d="M22 10.500v3"/><path d="M6 10.500v3M9.500 10.500v3" />',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.500" cy="6" r="1" fill="currentColor"/><circle cx="4.500" cy="12" r="1" fill="currentColor"/><circle cx="4.500" cy="18" r="1" fill="currentColor"/>',
  broom: '<path d="M19 3l-7.2 8.8"/><path d="M8.4 10l5.6 5.6c-1.1 3-3.9 5.4-9.4 5.4 1.2-2.9.9-5.6 3.8-11z"/>',
  mop: '<path d="M15 3l-3.500 10"/><path d="M6.500 13.500h10l1.500 7H5z"/><path d="M9.500 17v3.500M13 17v3.500"/>',
  robovac: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3.500V6"/>',
  vacuum: '<path d="M15 3l-3 11"/><path d="M4.500 20l2.500-6h9.500l2.500 6z"/>',
  washer: '<rect x="4" y="3" width="16" height="18" rx="2.500"/><circle cx="12" cy="13" r="4.500"/><path d="M7.500 6.500h2M13 6.500h3.500"/>',
  counter: '<path d="M3 12h18v3H3z"/><path d="M5 15v5M19 15v5"/><path d="M9 12V8h5v4"/><path d="M14 9h1.500a1.200 1.200 0 0 1 0 2.400H14"/>',
  sponge: '<rect x="3.500" y="8" width="17" height="9" rx="2.500"/><path d="M8 12.500h.01M12 11.500h.01M16 12.500h.01M10 14.500h.01M14 14.500h.01"/><path d="M8 5.500h.01M12 4h.01M15 5.500h.01"/>',
  dishwasher: '<rect x="4" y="3" width="16" height="18" rx="2.500"/><path d="M4 8h16M7.500 5.500h.01"/><path d="M8 12.500h8M8 16h8"/>',
  filter: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 5v14M12 5v14M16 5v14"/>',
  shower: '<path d="M4 21V7a3 3 0 0 1 3-3h7v2"/><path d="M9 11a5 5 0 0 1 10 0z"/><path d="M11 14.500V16M14 14.500V16M17 14.500V16M12.500 18v1.500M15.500 18v1.500"/>',
  fridge: '<rect x="6" y="2.500" width="12" height="19" rx="2.500"/><path d="M6 10h12M9.500 6v2M9.500 13v3"/>',
  spray: '<path d="M8.500 11.500h7V21h-7z"/><path d="M10 11.500V8h5.500l2-1.500"/><path d="M19 9h2M18.500 11.500l2 .8"/>',
  toilet: '<rect x="7" y="3" width="10" height="5" rx="1.500"/><path d="M5 11h14c0 4-2 6.500-5 7.200V21h-4v-2.800C7 17.500 5 15 5 11z"/>',
  faucet: '<path d="M4 9h8a4 4 0 0 1 4 4v1"/><path d="M8 9V5M5.500 5h5"/><path d="M16 17c-1 1.300-1.500 2-1.500 2.800a1.500 1.500 0 0 0 3 0C17.500 19 17 18.300 16 17z"/>',
  coffee: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 8h14"/><path d="M9 14h6v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/>',
  stove: '<rect x="4" y="3" width="16" height="18" rx="2.500"/><path d="M4 8h16"/><path d="M8 5.500h.01M12 5.500h.01M16 5.500h.01"/><rect x="7" y="11" width="10" height="7" rx="1.500"/>',
  hood: '<path d="M9.500 3h5l1 5h-7z"/><path d="M4 8h16l-2.500 7h-11z"/><path d="M9 19v2M12 19v2M15 19v2"/>',
  rug: '<rect x="4" y="7" width="16" height="10" rx="1.500"/><rect x="7" y="10" width="10" height="4" rx="1"/><path d="M4 9.500H2M4 14.500H2M20 9.500h2M20 14.500h2"/>',
  kettle: '<path d="M5 21h11l1-10a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4z"/><path d="M5.500 10L3 7"/><path d="M17 10h1.500a2 2 0 0 1 0 5H16.500"/><path d="M11 4v3"/>',
  cupboard: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18M9.500 11v2M14.500 11v2"/>',
  mirror: '<ellipse cx="12" cy="10.500" rx="6" ry="7.500"/><path d="M9 8l2-1.500"/><path d="M12 18v3.500M9 21.500h6"/>',
  drain: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 7v10M7 12h10"/>',
  curtains: '<path d="M2.500 4h19"/><path d="M4 4c0 5 .5 11-.5 16h6C8 15 9 8 9 4"/><path d="M20 4c0 5-.5 11 .5 16h-6C16 15 15 8 15 4"/>',
  wall: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 9.700h18M3 14.300h18M9 5v4.700M15 9.700v4.600M9 14.300V19"/>',
  radiator: '<rect x="3.500" y="6" width="3.500" height="12" rx="1.500"/><rect x="8" y="6" width="3.500" height="12" rx="1.500"/><rect x="12.500" y="6" width="3.500" height="12" rx="1.500"/><rect x="17" y="6" width="3.500" height="12" rx="1.500"/><path d="M6 18v2.500M18 18v2.500"/>',
  wardrobe: '<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M12 3v16M9.500 10v2M14.500 10v2M7 19v2M17 19v2"/>',
  lswitch: '<rect x="6" y="3" width="12" height="18" rx="2.500"/><rect x="9.500" y="7" width="5" height="10" rx="1.200"/><path d="M12 9.500V12"/>',
  shoe: '<path d="M9 4c2 0 3 2 3 4.500S10.500 11 9 11 6 9 6 7.500 7 4 9 4z"/><path d="M8 14h4c.5 2.500-.5 6-2 6s-2.500-3.500-2-6z"/><path d="M16 9c1.500 0 2.200 1.500 2.200 3.200S17.300 15 16 15s-2-1.500-2-2.800S14.500 9 16 9z"/>',
  teddy: '<circle cx="12" cy="13" r="6"/><circle cx="7" cy="6.500" r="2.200"/><circle cx="17" cy="6.500" r="2.200"/><circle cx="12" cy="14.500" r="2"/><path d="M10 11h.01M14 11h.01"/>',
  brick: '<rect x="3" y="9" width="18" height="10" rx="1.500"/><path d="M6.500 9V6.500h3V9M14.500 9V6.500h3V9"/>',
  backpack: '<path d="M6.500 9a5.500 5.500 0 0 1 11 0v10a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2z"/><rect x="9" y="13" width="6" height="5" rx="1"/><path d="M10 4V3h4v1"/>',
  table: '<rect x="3" y="7" width="18" height="3" rx="1"/><path d="M5.500 10v10M18.500 10v10M5.500 14h13"/>',
  microwave: '<rect x="3" y="5" width="18" height="14" rx="2.500"/><rect x="6" y="8" width="8" height="8" rx="1.200"/><path d="M17.500 9h.01M17.500 12h.01M17.500 15h.01"/>',
  toaster: '<rect x="3.500" y="10" width="17" height="9" rx="3"/><path d="M7 10V6.500h4V10M13 10V6.500h4V10"/><path d="M17 14.500h1.500"/>',
  waterfilter: '<path d="M12 3c-3.500 4.500-6 7.500-6 10.500a6 6 0 0 0 12 0C18 10.500 15.500 7.500 12 3z"/><path d="M9.500 13.500l2 2 3.500-4"/>',
  handwash: '<path d="M12 3c-2 2.500-3.500 4.300-3.500 6.200a3.500 3.500 0 0 0 7 0C15.500 7.300 14 5.500 12 3z"/><path d="M3.500 16h4l3 1.500h4a1.500 1.500 0 0 1 0 3H9.500L7.500 20h-4z"/>',
  cloth: '<path d="M5 5l14-1 1 9-14 2z"/><path d="M5 5l-1 5M7 17.500l-.5 3M12 16.500v3M17 15.700v3"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.6"/><path d="M10.8 18.4h2.4"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.6 2H4.4z"/><path d="M10 21a2.2 2.2 0 0 0 4 0"/>',
  unlock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 7.6-1.7"/>',
  backspace: '<path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"/><path d="M16 9.5l-5 5M11 9.5l5 5"/>',
  lock: '<rect x="4.500" y="10.500" width="15" height="10" rx="2.500"/><path d="M8 10.500V8a4 4 0 0 1 8 0v2.500"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M18.700 5.300l-2.100 2.100M7.400 16.600l-2.100 2.100"/>',
  contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.500 2"/>',
  wrench: '<path d="M14.500 6.500a4 4 0 0 0 5 5L21 13l-8 8a2.100 2.100 0 0 1-3-3l8-8z" transform="translate(-1 -1)"/><path d="M8 8 5 5"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.500-4M4 13a8 8 0 0 0 14.500 4"/><path d="M5.500 3v4h4M18.500 21v-4h-4"/>',
  plug: '<path d="M9 3v5M15 3v5M6.500 8h11v3a5.500 5.500 0 0 1-11 0z"/><path d="M12 16.500V21"/>',
};
const ic = (n, s = 22, sw = 1.7) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;

/* ───────────── Helfer ───────────── */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const de = (v, d = 1) => (v == null || isNaN(v)) ? '–' : Number(v).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const tempHue = t => 215 - clamp((t - 14) / 14, 0, 1) * 190;
const tempCol = (t, l = 62) => `hsl(${tempHue(t)} 92% ${l}%)`;
const okv = v => v !== undefined && v !== null && v !== 'unavailable' && v !== 'unknown';
const dom = e => e.split('.')[0];
const hhmm = d => d ? new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '–';
const COND = {
  sunny: 'Sonnig', 'clear-night': 'Klare Nacht', partlycloudy: 'Teils bewölkt', cloudy: 'Bewölkt', rainy: 'Regen', pouring: 'Starkregen',
  lightning: 'Gewitter', 'lightning-rainy': 'Gewitter & Regen', snowy: 'Schnee', 'snowy-rainy': 'Schneeregen', fog: 'Nebel', hail: 'Hagel',
  windy: 'Windig', 'windy-variant': 'Windig & wolkig', exceptional: 'Außergewöhnlich',
};
const arc = (cx, cy, r, a0, a1) => {
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};
const smooth = pts => {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

/* ───────────── Animierte Wetter-Icons ───────────── */
const CLOUD = 'M20 50a11 11 0 0 1-1.5-21.9A15 15 0 0 1 47.600 26 12.500 12.500 0 0 1 46 50z';
const wx = (cond, size = 64) => {
  const defs = '<defs><linearGradient id="wg-s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#f59e0b"/></linearGradient><linearGradient id="wg-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".97"/><stop offset="1" stop-color="#aebbd8" stop-opacity=".92"/></linearGradient><linearGradient id="wg-d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cbd5e1"/><stop offset="1" stop-color="#64748b"/></linearGradient><linearGradient id="wg-m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0e7ff"/><stop offset="1" stop-color="#a5b4fc"/></linearGradient></defs>';
  const rays = [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="-1.600" y="-19" width="3.200" height="6.500" rx="1.600" fill="#fbbf24" transform="rotate(${a})"/>`).join('');
  const sun = (x, y, r, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><g class="spin">${rays}</g><circle r="${r}" fill="url(#wg-s)"/></g>`;
  const cloud = (t = '', f = 'wg-c') => `<path class="drift" transform="${t}" d="${CLOUD}" fill="url(#${f})"/>`;
  const drops = n => [0, 1, 2].slice(0, n).map(i => `<path class="drop" style="animation-delay:${i * .35}s" d="M${24 + i * 9} 52l-2 6" stroke="#7dd3fc" stroke-width="3" stroke-linecap="round"/>`).join('');
  const flakes = [0, 1, 2].map(i => `<circle class="drop" style="animation-delay:${i * .5}s" cx="${24 + i * 9}" cy="55" r="2" fill="#fff"/>`).join('');
  let g;
  switch (cond) {
    case 'sunny': g = sun(32, 32, 11, 1.2); break;
    case 'clear-night': g = '<path d="M40 12a19 19 0 1 0 12 33A15 15 0 0 1 40 12z" fill="url(#wg-m)"/><circle class="tw" cx="14" cy="16" r="1.600" fill="#fff"/><circle class="tw" style="animation-delay:.8s" cx="22" cy="8" r="1.200" fill="#fff"/><circle class="tw" style="animation-delay:1.500s" cx="54" cy="14" r="1.300" fill="#fff"/>'; break;
    case 'partlycloudy': g = sun(24, 24, 9, 1) + cloud('translate(4 3)'); break;
    case 'rainy': g = cloud('translate(0 -4)') + drops(3); break;
    case 'pouring': g = cloud('translate(0 -4)', 'wg-d') + drops(3); break;
    case 'lightning': g = cloud('translate(0 -4)', 'wg-d') + '<path class="flash" d="M34 38 26 52h7l-3 10 11-15h-7z" fill="#fde047"/>'; break;
    case 'lightning-rainy': g = cloud('translate(0 -4)', 'wg-d') + '<path class="flash" d="M34 38 26 52h7l-3 10 11-15h-7z" fill="#fde047"/>' + drops(1); break;
    case 'snowy': case 'snowy-rainy': case 'hail': g = cloud('translate(0 -4)') + flakes; break;
    case 'fog': g = cloud('translate(0 -8)') + '<path d="M12 48h40M18 55h34" stroke="#cbd5e1" stroke-width="3.500" stroke-linecap="round" class="drift"/>'; break;
    case 'windy': case 'windy-variant': g = '<path class="drift" d="M10 26h30a7 7 0 1 0-7-7M10 36h40a7 7 0 1 1-7 7M10 46h20" fill="none" stroke="#cbd5e1" stroke-width="3.500" stroke-linecap="round"/>'; break;
    default: g = cloud('translate(0 0)') + cloud('translate(-8 8) scale(.8)', 'wg-d');
  }
  return `<svg class="wx" width="${size}" height="${size}" viewBox="0 0 64 64">${defs}${g}</svg>`;
};

/* ───────────── Stylesheet ───────────── */
const CSS = `
:host{display:block;--wh:255,255,255;--bg0:#060a16;--tx:#f4f7ff;--tx2:rgba(244,247,255,.64);--tx3:rgba(244,247,255,.38);--line:rgba(var(--wh),.1);
  --acc:#5eead4;--acc2:#818cf8;--warm:#fbbf24;--bad:#fb7185;--ok:#34d399;--r:28px;
  --b1:rgba(99,102,241,.55);--b2:rgba(20,184,166,.45);--b3:rgba(236,72,153,.28);--b4:rgba(56,189,248,.35);
  font-family:ui-sans-serif,"SF Pro Display","Inter","Segoe UI",Roboto,system-ui,sans-serif;color:var(--tx);min-height:calc(100vh - var(--header-height,0px));
  -webkit-font-smoothing:antialiased;text-align:left}
*{box-sizing:border-box;margin:0;padding:0}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.app{position:relative;min-height:inherit;background:var(--bg0);overflow:hidden;isolation:isolate}
.app[data-tod=day]{--bg0:#0a1428;--b1:rgba(59,130,246,.55);--b2:rgba(45,212,191,.5);--b3:rgba(251,191,36,.3);--b4:rgba(56,189,248,.45)}
.app[data-tod=dusk]{--bg0:#120a24;--b1:rgba(168,85,247,.5);--b2:rgba(244,114,182,.4);--b3:rgba(251,146,60,.38);--b4:rgba(99,102,241,.45)}
/* Hintergrund */
.bg{position:absolute;inset:0;z-index:-1;overflow:hidden;pointer-events:none}
.blob{position:absolute;border-radius:50%;filter:blur(90px);will-change:transform;transition:background 2s}
.b1{width:55vmax;height:55vmax;left:-12vmax;top:-18vmax;background:radial-gradient(circle,var(--b1),transparent 65%);animation:d1 38s ease-in-out infinite alternate}
.b2{width:48vmax;height:48vmax;right:-14vmax;top:8vmax;background:radial-gradient(circle,var(--b2),transparent 65%);animation:d2 46s ease-in-out infinite alternate}
.b3{width:42vmax;height:42vmax;left:20vmax;bottom:-22vmax;background:radial-gradient(circle,var(--b3),transparent 65%);animation:d3 52s ease-in-out infinite alternate}
.b4{width:32vmax;height:32vmax;right:10vmax;bottom:-10vmax;background:radial-gradient(circle,var(--b4),transparent 65%);animation:d1 60s ease-in-out infinite alternate-reverse}
@keyframes d1{to{transform:translate(8vmax,6vmax) scale(1.15)}}@keyframes d2{to{transform:translate(-9vmax,10vmax) scale(.9)}}@keyframes d3{to{transform:translate(7vmax,-8vmax) scale(1.2)}}
.grain{position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
canvas.fx{position:absolute;inset:0;width:100%;height:100%}
/* Layout */
.shell{display:grid;grid-template-columns:92px minmax(0,1fr);min-height:inherit}
nav{position:sticky;top:0;align-self:start;height:calc(100vh - var(--header-height,0px));display:flex;flex-direction:column;align-items:center;gap:8px;padding:22px 0}
.logo{width:46px;height:46px;border-radius:16px;margin-bottom:14px;background:conic-gradient(from 210deg,#5eead4,#818cf8,#f472b6,#fbbf24,#5eead4);filter:saturate(1.1);box-shadow:0 0 28px rgba(129,140,248,.55);position:relative;animation:spinslow 18s linear infinite}
.logo::after{content:"";position:absolute;inset:3px;border-radius:13px;background:#0b1226}
.logo::before{content:"";position:absolute;inset:11px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#5eead4 55%,#818cf8);z-index:2}
@keyframes spinslow{to{filter:hue-rotate(360deg) saturate(1.1)}}
.nb{position:relative;width:56px;height:56px;border-radius:19px;display:grid;place-items:center;color:var(--tx3);transition:all .3s cubic-bezier(.2,.8,.2,1)}
.nb:hover{color:var(--tx);background:rgba(var(--wh),.06)}
.nb.on{color:#fff;background:linear-gradient(145deg,rgba(94,234,212,.25),rgba(129,140,248,.25));box-shadow:inset 0 0 0 1px rgba(var(--wh),.14),0 8px 24px -8px rgba(94,234,212,.5)}
.nb .lab{position:absolute;left:66px;padding:5px 10px;border-radius:10px;background:#0b1226;border:1px solid var(--line);font-size:12px;opacity:0;pointer-events:none;transform:translateX(-4px);transition:.2s;white-space:nowrap;z-index:5}
.nb:hover .lab{opacity:1;transform:none}
.nb .bd{position:absolute;top:6px;right:6px;min-width:18px;height:18px;border-radius:9px;background:var(--warm);color:#1a1202;font-size:11px;font-weight:700;display:grid;place-items:center;padding:0 5px;box-shadow:0 0 12px rgba(251,191,36,.7)}
.sp{flex:1}
main{padding:26px 28px 40px 8px;max-width:1380px;width:100%}
.bento{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:16px}
.s3{grid-column:span 3}.s4{grid-column:span 4}.s5{grid-column:span 5}.s6{grid-column:span 6}.s7{grid-column:span 7}.s8{grid-column:span 8}.s12{grid-column:span 12}
/* Karten */
.c{position:relative;border-radius:var(--r);padding:20px;overflow:hidden;background:linear-gradient(150deg,rgba(var(--wh),.1),rgba(var(--wh),.035));border:1px solid var(--line);
  backdrop-filter:blur(26px) saturate(150%);-webkit-backdrop-filter:blur(26px) saturate(150%);box-shadow:0 24px 50px -24px rgba(0,0,0,.7),inset 0 1px 0 rgba(var(--wh),.1)}
.c::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .35s;background:radial-gradient(360px circle at var(--mx,50%) var(--my,0%),rgba(var(--wh),.13),transparent 60%)}
.c:hover::before{opacity:1}
.tap{cursor:pointer;transition:transform .3s cubic-bezier(.2,.8,.2,1),border-color .3s,box-shadow .3s}
.tap:hover{transform:translateY(-3px);border-color:rgba(var(--wh),.22)}.tap:active{transform:scale(.985)}
.enter .c{animation:rise .7s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*50ms)}
@keyframes rise{from{opacity:0;transform:translateY(22px) scale(.98)}to{opacity:1;transform:none}}
.h{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3);margin-bottom:14px}
.h .i{opacity:.8}.h .r{margin-left:auto;letter-spacing:0;text-transform:none;font-weight:500;font-size:12px;color:var(--tx2)}
.big{font-weight:200;line-height:1;letter-spacing:-.03em}
small.u{font-size:.4em;font-weight:300;color:var(--tx2);letter-spacing:0;margin-left:3px}
/* Hero */
.hero{min-height:250px;display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(120% 140% at 0% 0%,rgba(94,234,212,.18),transparent 55%),radial-gradient(90% 120% at 100% 100%,rgba(129,140,248,.2),transparent 55%),linear-gradient(150deg,rgba(var(--wh),.09),rgba(var(--wh),.03))}
.hello{font-size:15px;color:var(--tx2);font-weight:500}
.clock{font-size:clamp(64px,9vw,112px)}
.clock span{opacity:.55;animation:blink 2s steps(2) infinite}@keyframes blink{50%{opacity:.1}}
.date{font-size:16px;color:var(--tx2);margin-top:6px}
.sum{margin-top:18px;font-size:15px;line-height:1.55;color:var(--tx);max-width:46ch}.sum b{font-weight:600;color:var(--acc)}.sum b.w{color:var(--warm)}.sum b.r{color:var(--bad)}
.pp{display:flex;gap:10px;flex-wrap:wrap}
.pc{display:flex;align-items:center;gap:10px;padding:6px 14px 6px 6px;border-radius:999px;background:rgba(var(--wh),.07);border:1px solid var(--line);font-size:13px}
.av{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:13px;background:linear-gradient(135deg,#5eead4,#818cf8);color:#08122a;position:relative;background-size:cover;background-position:center}
.av::after{content:"";position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;border-radius:50%;background:var(--ok);border:2px solid #0b1226}
.pc.away .av::after{background:#64748b}.pc small{color:var(--tx3);display:block;font-size:11px}
/* Wetter-Hero */
.wxh{display:flex;flex-direction:column;justify-content:space-between;min-height:250px;background:radial-gradient(100% 90% at 80% 0%,var(--wglow,rgba(56,189,248,.3)),transparent 60%),linear-gradient(150deg,rgba(var(--wh),.09),rgba(var(--wh),.03))}
.wx{display:block;overflow:visible}.spin{animation:spin 24s linear infinite;transform-origin:0 0}@keyframes spin{to{transform:rotate(360deg)}}
.drift{animation:drift 7s ease-in-out infinite alternate}@keyframes drift{to{transform:translateX(3px)}}
.drop{animation:fall 1.1s linear infinite}@keyframes fall{0%{transform:translateY(-3px);opacity:0}30%{opacity:1}100%{transform:translateY(9px);opacity:0}}
.tw{animation:tw 3s ease-in-out infinite}@keyframes tw{50%{opacity:.15}}.flash{animation:fl 3s infinite}@keyframes fl{0%,88%,100%{opacity:1}90%{opacity:.1}93%{opacity:1}96%{opacity:.2}}
.wtop{display:flex;justify-content:space-between;align-items:flex-start}
.wtemp{font-size:76px}.wcond{font-size:15px;color:var(--tx2);margin-top:6px}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;background:rgba(var(--wh),.07);border:1px solid var(--line);font-size:12.5px;color:var(--tx2)}
.chip b{color:var(--tx);font-weight:600}.chip .i{opacity:.8}
.mini{display:flex;gap:6px;margin-top:14px}
.mini div{flex:1;text-align:center;font-size:12px;color:var(--tx2);padding:8px 2px;border-radius:14px;background:rgba(var(--wh),.05)}
.mini .wx{margin:2px auto}.mini b{display:block;color:var(--tx);font-size:13px;font-weight:600}
/* Stat */
.st{display:flex;flex-direction:column;gap:12px;min-height:150px;justify-content:space-between}
.st .top{display:flex;align-items:center;justify-content:space-between}
.st .ico{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:rgba(var(--wh),.08);color:var(--tx2);transition:.3s}
.st.hot .ico{background:rgba(251,191,36,.2);color:var(--warm);box-shadow:0 0 24px rgba(251,191,36,.4)}
.st.cool .ico{background:rgba(94,234,212,.18);color:var(--acc)}
.st.bad .ico{background:rgba(251,113,133,.2);color:var(--bad);box-shadow:0 0 24px rgba(251,113,133,.4)}
.st .v{font-size:46px}.st .l{font-size:13px;color:var(--tx2)}.st .sub{font-size:12px;color:var(--tx3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* Räume */
.rg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.rg.big{grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.rm{padding:16px;display:flex;flex-direction:column;gap:12px;min-height:150px;transition:transform .3s cubic-bezier(.2,.8,.2,1),border-color .3s,box-shadow .5s,background .5s}
.rm.lit{border-color:rgba(var(--glow,251,191,36),.5);background:radial-gradient(130% 110% at 0% 0%,rgba(var(--glow,251,191,36),.26),transparent 62%),linear-gradient(150deg,rgba(var(--wh),.08),rgba(var(--wh),.03));box-shadow:0 20px 50px -22px rgba(var(--glow,251,191,36),.55),inset 0 1px 0 rgba(var(--wh),.1)}
.rt{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600}.rt .i{color:var(--tx2)}
.rt .wbd{margin-left:auto;color:#fb923c;display:grid;place-items:center;animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{50%{opacity:.35}}
.rmid{display:flex;align-items:center;gap:12px}
.ring{width:62px;height:62px;flex:none}.ring text{font-size:0}
.rv{font-size:34px}
.rb{display:flex;gap:10px;flex-wrap:wrap;font-size:12px;color:var(--tx2);margin-top:auto}.rb span{display:inline-flex;align-items:center;gap:4px}.rb .i{opacity:.8}
.rb .on{color:var(--warm)}.rb .heat{color:#fb923c}
.spark{width:100%;height:46px;display:block}
.sk{height:46px;border-radius:10px;background:linear-gradient(90deg,rgba(var(--wh),.04),rgba(var(--wh),.09),rgba(var(--wh),.04));background-size:200% 100%;animation:shim 1.4s infinite}@keyframes shim{to{background-position:-200% 0}}
/* Sonne */
.sunarc{width:100%;display:block}
.srow{display:flex;justify-content:space-between;font-size:12.5px;color:var(--tx2);margin-top:2px}.srow b{color:var(--tx);font-weight:600}
/* Extras */
.ex{display:flex;flex-direction:column;gap:6px}
.xr{display:flex;align-items:center;gap:12px;padding:12px;border-radius:18px;background:rgba(var(--wh),.05);border:1px solid transparent;transition:.25s;text-align:left;width:100%}
.xr:hover{background:rgba(var(--wh),.09)}.xr .ico{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:rgba(var(--wh),.08);color:var(--tx2);flex:none}
.xr .t{font-size:13.5px;font-weight:600}.xr .s{font-size:12px;color:var(--tx3);margin-top:1px}
.sw{margin-left:auto;width:44px;height:26px;border-radius:13px;background:rgba(var(--wh),.14);position:relative;transition:.3s;flex:none}
.sw::after{content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:.3s;box-shadow:0 2px 6px rgba(0,0,0,.4)}
.sw.on{background:linear-gradient(90deg,#5eead4,#818cf8)}.sw.on::after{left:21px}
/* Klima-Dial */
.dials{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.dial{display:flex;flex-direction:column;align-items:center;gap:6px;padding-bottom:16px}
.dial.heat{box-shadow:0 24px 60px -24px rgba(251,146,60,.55),inset 0 1px 0 rgba(var(--wh),.1);border-color:rgba(251,146,60,.35)}
.dn{align-self:stretch;display:flex;align-items:center;gap:8px;font-weight:600;font-size:14px}.dn .pw{margin-left:auto;width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:rgba(var(--wh),.08);color:var(--tx2);transition:.25s}
.dn .pw.on{background:rgba(251,146,60,.22);color:#fb923c}
.dsvg{width:100%;max-width:220px;overflow:visible}
.dctr{position:relative;width:100%;max-width:220px;margin-top:-6px}
.dctr .mid{position:absolute;left:0;right:0;top:50%;transform:translateY(-52%);text-align:center}
.dctr .cur{font-size:50px}.dctr .tg{font-size:12px;color:var(--tx2);margin-top:4px}
.dctr .tg b{color:var(--tx);font-weight:600}
.dst{font-size:12px;color:var(--tx3);display:flex;align-items:center;gap:6px;margin-top:-4px}.dst.heat{color:#fb923c}
.dbt{display:flex;gap:14px;margin-top:6px}
.rbn{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;background:rgba(var(--wh),.08);border:1px solid var(--line);transition:.25s}
.rbn:hover{background:rgba(var(--wh),.15)}.rbn:active{transform:scale(.92)}
/* Chart */
.chart{width:100%;display:block}.chart text{fill:rgba(244,247,255,.42);font-size:11px;font-family:inherit}
.leg{display:flex;flex-wrap:wrap;gap:8px 14px;margin-top:12px;font-size:12px;color:var(--tx2)}.leg i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px}
/* Bad */
.bstat{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.bs{padding:14px;border-radius:20px;background:rgba(var(--wh),.05);border:1px solid var(--line)}.bs .v{font-size:32px}.bs .l{font-size:12px;color:var(--tx2);margin-top:6px}
.bstatus{min-height:220px;display:flex;flex-direction:column;justify-content:space-between}
.bstatus .v{font-size:56px;font-weight:200;letter-spacing:-.03em;line-height:1.05}
.pulse{width:14px;height:14px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 rgba(52,211,153,.6);animation:ping 2s infinite}
.pulse.busy{background:var(--bad);box-shadow:0 0 0 0 rgba(251,113,133,.6)}@keyframes ping{70%{box-shadow:0 0 0 14px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
.pulse.busy{animation-name:ping2}@keyframes ping2{70%{box-shadow:0 0 0 14px rgba(251,113,133,0)}100%{box-shadow:0 0 0 0 rgba(251,113,133,0)}}
/* Vorhersage */
.fc{display:grid;grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:10px}
.fd{padding:14px 8px;border-radius:20px;background:rgba(var(--wh),.05);text-align:center;font-size:12.5px;color:var(--tx2);display:flex;flex-direction:column;align-items:center;gap:6px}
.fd b{color:var(--tx);font-size:14px;font-weight:600}.fd .lo{color:var(--tx3)}
.fd .bar{width:6px;height:56px;border-radius:3px;background:rgba(var(--wh),.1);position:relative;margin:2px 0}
.fd .bar i{position:absolute;left:0;right:0;border-radius:3px;background:linear-gradient(180deg,#fb923c,#38bdf8)}
.hr{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}.hr::-webkit-scrollbar{display:none}
.hh{flex:none;width:64px;padding:12px 4px;border-radius:18px;background:rgba(var(--wh),.05);text-align:center;font-size:12px;color:var(--tx2);display:flex;flex-direction:column;align-items:center;gap:4px}.hh b{color:var(--tx);font-size:14px}
.radar{width:100%;border-radius:20px;display:block;background:rgba(var(--wh),.04);min-height:120px;object-fit:cover}
/* Sheet */
.ov{position:fixed;inset:0;z-index:50;display:none;align-items:flex-end;justify-content:center;background:rgba(3,6,16,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.ov.show{display:flex;animation:fade .25s both}@keyframes fade{from{opacity:0}}
.sheet{width:min(720px,100%);max-height:88vh;overflow:auto;border-radius:34px 34px 0 0;padding:22px 22px 30px;background:linear-gradient(160deg,rgba(24,32,64,.96),rgba(10,16,36,.97));border:1px solid var(--line);border-bottom:0;box-shadow:0 -30px 80px -20px rgba(0,0,0,.8);animation:up .45s cubic-bezier(.2,.9,.2,1) both;scrollbar-width:none}
.sheet::-webkit-scrollbar{display:none}@keyframes up{from{transform:translateY(60px);opacity:0}}
.grab{width:42px;height:4px;border-radius:2px;background:rgba(var(--wh),.2);margin:-8px auto 16px}
.sh{display:flex;align-items:center;gap:14px;margin-bottom:18px}
.sh .ico{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;background:rgba(var(--wh),.08)}.sh h2{font-size:22px;font-weight:600}.sh p{font-size:13px;color:var(--tx2);margin-top:2px}
.x{margin-left:auto;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:rgba(var(--wh),.08)}.x:hover{background:rgba(var(--wh),.15)}
.sum2{display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:6px}
.sbig{padding:16px 18px;border-radius:22px;background:linear-gradient(150deg,rgba(251,191,36,.24),rgba(var(--wh),.04));border:1px solid var(--line);display:flex;align-items:baseline;gap:10px}.sbig .big{font-size:48px}.sbig span{font-size:14px;color:var(--tx2)}
.alloff{padding:0 20px;border-radius:22px;background:rgba(251,113,133,.14);border:1px solid rgba(251,113,133,.4);color:#fecdd3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:12px;font-weight:500;transition:.25s}.alloff:hover{background:rgba(251,113,133,.25)}
.lab2{font-size:11px;font-weight:600;letter-spacing:.16em;color:var(--tx3);margin:20px 4px 10px}
.lg{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.lt{position:relative;padding:14px;border-radius:22px;background:rgba(var(--wh),.04);border:1px solid rgba(var(--wh),.08);display:flex;flex-direction:column;gap:3px;min-height:92px;cursor:pointer;transition:all .3s;user-select:none;-webkit-user-select:none}
.lt:active{transform:scale(.97)}
.lt.on{min-height:122px;background:linear-gradient(150deg,rgba(var(--lc),.3),rgba(var(--wh),.05) 78%);border-color:rgba(var(--lc),.5);box-shadow:0 10px 30px -12px rgba(var(--lc),.55)}
.lt .bub{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:rgba(var(--wh),.07);color:rgba(244,247,255,.55);margin-bottom:6px;transition:.3s}
.lt.on .bub{background:rgba(var(--lc),.3);color:rgb(var(--lc));box-shadow:0 0 26px rgba(var(--lc),.65)}
.lt .n{font-size:14px;font-weight:500;color:var(--tx2)}.lt.on .n{color:var(--tx)}.lt .s{font-size:12px;color:var(--tx3)}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;margin-top:10px;outline:none;cursor:pointer;background:linear-gradient(90deg,rgb(var(--lc)) var(--v),rgba(var(--wh),.16) var(--v))}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.5)}
input[type=range]::-moz-range-thumb{width:18px;height:18px;border:0;border-radius:50%;background:#fff}
.sctl{display:flex;align-items:center;justify-content:space-between;padding:16px;border-radius:24px;background:rgba(var(--wh),.05);border:1px solid var(--line);margin-bottom:6px}
.sctl .big{font-size:44px}.sctl .l{font-size:12px;color:var(--tx2);margin-top:4px}
.toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:60;padding:10px 16px;border-radius:14px;background:#0b1226;border:1px solid var(--line);font-size:13px;opacity:0;pointer-events:none;transition:.3s}.toast.show{opacity:1}
.empty{padding:22px;text-align:center;color:var(--tx3);font-size:14px;border-radius:20px;border:1px dashed var(--line)}
/* Touch & Mobil */
button,.tap,.lt,.vc,.vr,.xr{-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.rm,.st,.lt,.xr,.vc{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
@media (hover:none){.tap:hover{transform:none;border-color:var(--line)}.c:hover::before{opacity:0}.nb:hover{background:none;color:var(--tx3)}.nb.on:hover{color:#fff}}
@supports (height:100dvh){:host{min-height:var(--hmin,calc(100dvh - var(--header-height,0px)))}nav{height:var(--hmin,calc(100dvh - var(--header-height,0px)))}.sheet{max-height:88dvh}}
@media (max-width:860px){
  .shell{grid-template-columns:minmax(0,1fr)}main{min-width:0}
  nav{position:fixed;z-index:20;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));top:auto;height:auto;flex-direction:row;justify-content:space-between;gap:2px;padding:6px;border-radius:26px;background:rgba(14,20,44,.86);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid var(--line);box-shadow:0 18px 40px -10px rgba(0,0,0,.7)}
  .logo,.sp{display:none}
  .nb{flex:1;min-width:0;width:auto;height:54px;border-radius:19px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
  .nb .i{width:22px;height:22px}
  .nb .lab{position:static;opacity:1;transform:none;background:none;border:0;padding:0;font-size:10px;font-weight:500;letter-spacing:.01em;pointer-events:none;color:inherit;max-width:100%;overflow:hidden;text-overflow:ellipsis}
  .nb .bd{top:3px;right:50%;margin-right:-22px;min-width:16px;height:16px;font-size:10px}
  main{padding:14px 14px calc(104px + env(safe-area-inset-bottom,0px))}
  .bento{gap:12px}.s3{grid-column:span 6}.s4,.s5,.s6,.s7,.s8,.s12{grid-column:span 12}
  .rg{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.rg.big{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .bstat{grid-template-columns:repeat(2,minmax(0,1fr))}
  .clock{font-size:76px}.wtemp{font-size:64px}.hero,.wxh{min-height:0;gap:20px}
  .c{padding:16px;border-radius:24px;backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%)}
  .rm{padding:14px;min-height:0;gap:10px}.rv{font-size:30px}.rw,.ring{width:54px;height:54px}.rw{width:54px;height:54px}
  .st{min-height:132px}.st .v{font-size:40px}
  .blob{filter:blur(60px)}.b4,.grain{display:none}
  .ov{align-items:flex-end;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
  .sheet{width:100%;border-radius:30px 30px 0 0;max-height:92dvh;max-height:92vh;padding:18px 16px calc(28px + env(safe-area-inset-bottom,0px));overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
  @supports (height:100dvh){.sheet{max-height:92dvh}}
  .grab{width:46px;height:5px;margin:-6px auto 14px}
  .sh h2{font-size:20px}.x{width:44px;height:44px}
  .qb{min-height:42px;padding:9px 14px;font-size:13px}.vbt{min-height:42px;padding:10px 14px;font-size:13px}
  .dn .pw{width:42px;height:42px}.rbn{width:56px;height:56px}
  .lt{min-height:88px}.lt.on{min-height:116px}
  input[type=range]{height:8px;margin-top:14px}
  input[type=range]::-webkit-slider-thumb{width:28px;height:28px}input[type=range]::-moz-range-thumb{width:28px;height:28px}
  .toast{bottom:calc(96px + env(safe-area-inset-bottom,0px));max-width:calc(100vw - 32px);text-align:center}
  .sum2{grid-template-columns:1fr auto}.alloff{min-width:96px}
  .vh h1{font-size:26px}
  .sky{min-height:280px}.sky .wtemp{font-size:84px}
  .hl{min-width:0}
}
@media (max-width:380px){
  main{padding-left:12px;padding-right:12px}.clock{font-size:66px}.rgsvg{width:132px;height:132px}.rl{min-width:0;font-size:12.5px}.s3{grid-column:span 12}.st{min-height:0}
  .nb .lab{font-size:9.500px}
}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
`;

const CSS3 = `
/* v5: Ring-Legende nicht mehr abschneiden */
.rings > div:first-child{flex:none}
.rl span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@media (max-width:860px){.rings{gap:14px;min-width:0}.rl{flex:1;min-width:0;font-size:12.5px}.rl b{padding-left:6px;flex:none}}
@media (max-width:480px){.rgsvg{width:124px;height:124px}.rings{gap:10px}}
/* v5: Schnellaktionen */
.qa{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -14px 14px;padding:2px 14px}.qa::-webkit-scrollbar{display:none}
.qp{flex:none;display:inline-flex;align-items:center;gap:8px;padding:10px 15px;border-radius:999px;background:rgba(var(--wh),.07);border:1px solid var(--line);color:var(--tx);font-size:13.5px;font-weight:500;white-space:nowrap;transition:transform .15s,background .2s}
.qp:active{transform:scale(.94);background:rgba(var(--wh),.14)}.qp .i{color:var(--acc)}
.qp:first-child{background:linear-gradient(135deg,rgba(129,140,248,.28),rgba(94,234,212,.2))}
@media (min-width:861px){.qa{margin:0 0 16px;padding:2px 0;flex-wrap:wrap;overflow:visible}}
/* v5: Strom */
.pwr{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:2px 0 12px}.pwk{font-size:12.5px;color:var(--tx2);text-align:right}.pwk b{color:var(--tx);font-weight:600;font-size:15px}
.dot{width:9px;height:9px;border-radius:50%;margin-left:auto;flex:none;box-shadow:0 0 10px currentColor}
/* v5: Heizungsplan / Radar */
.schedhost{display:block;margin-top:6px;border-radius:18px;overflow:hidden}.schedhost climate-scheduler-card{display:block}
.radarf{width:100%;height:min(62vh,460px);border:0;border-radius:18px;display:block;background:rgba(var(--wh),.05)}
.seg button{white-space:nowrap}.seg.sm{padding:3px}.seg.sm button{padding:5px 11px;font-size:12px}
.seg.wide{display:flex;width:100%}.seg.wide button{flex:1;justify-content:center}
.h .r .seg{margin:-4px -4px -4px 0}
/* v5: Ambient */
.amb{position:fixed;inset:0;z-index:80;display:none;background:radial-gradient(120% 100% at 50% 0%,#101a3a,#03050d 70%);color:#f4f7ff;overflow:hidden;cursor:pointer;--wh:255,255,255;--tx:#f4f7ff;--tx2:rgba(244,247,255,.66);--tx3:rgba(244,247,255,.4);--line:rgba(255,255,255,.12)}
.amb.show{display:grid;place-items:center;animation:fade .6s both}
.ambin{display:flex;flex-direction:column;align-items:center;gap:18px;padding:24px;text-align:center;transition:transform 4s ease-in-out;max-width:100%}
.ambc{font-size:min(26vw,220px);font-weight:200;line-height:1;letter-spacing:-.03em}.ambc span{opacity:.5;animation:blink 2s steps(2) infinite}@keyframes blink{50%{opacity:.15}}
.ambd{font-size:clamp(16px,3vw,26px);color:var(--tx2)}
.ambr{display:flex;gap:clamp(18px,5vw,56px);flex-wrap:wrap;justify-content:center;margin-top:8px}
.ambw{display:flex;align-items:center;gap:14px}.ambw .wx{width:64px;height:64px}
.ambt{font-size:clamp(34px,7vw,64px);font-weight:300;line-height:1}.ambt small{font-size:.45em;opacity:.6;margin-left:2px}.ambs{font-size:14px;color:var(--tx2);text-align:left}
.ambl{display:flex;flex-direction:column;gap:8px;align-items:center;margin-top:6px}
.ambn{display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:rgba(255,255,255,.07);font-size:clamp(14px,2vw,18px)}.ambn.warn{color:#fbbf24}
.ambp{justify-content:center;margin-top:6px}.ambh{font-size:12px;color:var(--tx3);margin-top:10px}
/* v5: Heller Modus */
.app{color:var(--tx)}
.app.light .al.warn{color:#92400e;background:rgba(251,191,36,.22)}.app.light .al.bad{color:#9f1239;background:rgba(251,113,133,.18)}.app.light .al.info{color:#075985;background:rgba(56,189,248,.18)}.app.light .al.ok{color:#065f46}
.app.light .tag.ok,.app.light .okc span{color:#047857}.app.light .tag.warn{color:#b45309}.app.light .tag.bad{color:#be123c}.app.light .tag.live,.app.light .dp{color:#0369a1}
.app.light .alloff{color:#be123c}.app.light .seg button.on{color:var(--tx)}.app.light .nb.on:hover{color:var(--tx)}
.app.light .xr .ico,.app.light .vr .ico{background:rgba(15,23,42,.06)}
.app.light .sw{background:rgba(15,23,42,.18)}.app.light .sw.on{background:var(--acc)}
.app.light{--bg0:#e9eef8;--tx:#0f172a;--tx2:rgba(15,23,42,.68);--tx3:rgba(15,23,42,.45);--line:rgba(15,23,42,.1);--wh:15,23,42;--acc:#0d9488;--acc2:#4f46e5;--warm:#d97706;--bad:#e11d48;--ok:#059669;--b1:rgba(99,102,241,.22);--b2:rgba(20,184,166,.2);--b3:rgba(236,72,153,.12);--b4:rgba(56,189,248,.2)}
.app.light[data-tod=day]{--bg0:#e6f0fb}.app.light[data-tod=dusk]{--bg0:#efe9f8}.app.light[data-tod=night]{--bg0:#e7ebf5}
.app.light .grain{opacity:.03}
.app.light .c{background:linear-gradient(150deg,rgba(255,255,255,.86),rgba(255,255,255,.58));box-shadow:0 14px 34px -22px rgba(30,41,90,.45),inset 0 1px 0 rgba(255,255,255,.9);border-color:rgba(15,23,42,.07)}
.app.light .c.hero{background:radial-gradient(120% 140% at 0% 0%,rgba(94,234,212,.28),transparent 55%),radial-gradient(90% 120% at 100% 100%,rgba(129,140,248,.26),transparent 55%),linear-gradient(150deg,rgba(255,255,255,.9),rgba(255,255,255,.62))}
.app.light .c.wxh{background:radial-gradient(100% 90% at 80% 0%,var(--wglow,rgba(56,189,248,.3)),transparent 60%),linear-gradient(150deg,rgba(255,255,255,.9),rgba(255,255,255,.62))}
.app.light .c.sky{--tx:#f4f7ff;--tx2:rgba(244,247,255,.74);--tx3:rgba(244,247,255,.5);--wh:255,255,255;--line:rgba(255,255,255,.18);color:#f4f7ff;box-shadow:0 14px 34px -18px rgba(15,23,42,.5)}
.app.light .nb.on{color:var(--tx);background:linear-gradient(145deg,rgba(13,148,136,.2),rgba(79,70,229,.18));box-shadow:inset 0 0 0 1px rgba(15,23,42,.08),0 8px 24px -8px rgba(13,148,136,.35)}
.app.light .nb .lab,.app.light .toast{background:#fff;color:var(--tx);box-shadow:0 8px 24px -10px rgba(15,23,42,.35)}
.app.light .logo::after{background:#fff}.app.light .av::after{border-color:#fff}
.app.light .ov{background:rgba(30,41,59,.38)}
.app.light .sheet{background:linear-gradient(160deg,#ffffff,#eef2fb);box-shadow:0 -30px 80px -20px rgba(15,23,42,.35)}
.app.light .alerts .al,.app.light .qp{background:rgba(255,255,255,.75)}
.app.light .qp:first-child{background:linear-gradient(135deg,rgba(129,140,248,.25),rgba(94,234,212,.3))}
.app.light .mpb.main,.app.light .sw.on{color:var(--tx)}
@media (max-width:860px){.app.light nav{background:rgba(255,255,255,.88);box-shadow:0 18px 40px -14px rgba(15,23,42,.35)}}
@media (min-width:861px){.nb.gear{margin-top:0}}
@media (max-width:860px){.nb.gear{display:none}}

/* v5.2.4 Fenster-&-Türen-Sheet im Lichter-Stil */
.sbig.cs{background:linear-gradient(150deg,rgba(251,146,60,.28),rgba(var(--wh),.04))}.sbig.cs.ok{background:linear-gradient(150deg,rgba(52,211,153,.24),rgba(var(--wh),.04));align-items:center}
.sbig .okl{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:600;color:#6ee7b7}
.cbox{padding:0 18px;border-radius:22px;background:rgba(var(--wh),.045);border:1px solid var(--line);display:flex;flex-direction:column;justify-content:center;gap:3px;font-size:13px;color:var(--tx2);min-width:104px}.cbox b{color:var(--tx);font-weight:600;font-size:15px}.cbox span{white-space:nowrap}.cbox small{font-size:11px;color:var(--tx3);margin-top:2px}
.ct{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:20px;background:rgba(var(--wh),.04);border:1px solid rgba(var(--wh),.08);cursor:pointer;min-width:0;transition:all .25s}
.ct .bub{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;flex:none;background:rgba(var(--wh),.07);color:var(--tx3)}
.ct .tx{min-width:0;flex:1}.ct .n{font-size:14px;font-weight:500;color:var(--tx2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ct .s{font-size:12px;color:var(--tx3);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ct.open{flex-direction:column;align-items:flex-start;gap:4px;padding:14px;min-height:118px;background:linear-gradient(150deg,rgba(251,146,60,.3),rgba(var(--wh),.05) 78%);border-color:rgba(251,146,60,.5);box-shadow:0 10px 30px -12px rgba(251,146,60,.55)}
.ct.open .bub{width:44px;height:44px;margin-bottom:6px;background:rgba(251,146,60,.3);color:#fb923c;box-shadow:0 0 26px rgba(251,146,60,.6)}
.ct.open .tx{width:100%;margin-top:auto}.ct.open .n{color:var(--tx);white-space:normal}.ct.open .s{color:#fdba74;font-weight:500}
.ct:not(.open){gap:10px;padding:10px 12px}.ct:not(.open) .bub{width:34px;height:34px}.ct:not(.open) .n{white-space:normal;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.25;font-size:13.5px;text-overflow:clip}
.app.light .ct.open .bub,.app.light .ct.open .s{color:#c2410c}.app.light .sbig .okl{color:#047857}
@media (max-width:520px){.cbox{min-width:92px;padding:0 14px}}

/* v5.2.3 Ring und Icon deckungsgleich */
.rw .ring{width:100%;height:100%}.rw .ri svg{display:block}
@media (max-width:520px){.rm .rw{width:54px;height:54px}}

/* v5.2.2 kompakte Kennzahlen am Handy */
@media (max-width:520px){
  .st.s3{grid-column:span 6;display:grid;grid-template-columns:auto 1fr;grid-template-areas:"ico num" "lab lab" "sub sub";align-items:center;gap:0 10px;min-height:0;padding:14px 14px 12px}
  .st .top{grid-area:ico}.st .ico{width:36px;height:36px;border-radius:12px}.st .ico svg{width:19px;height:19px}
  .st>div:last-child{display:contents}
  .st .v{grid-area:num;justify-self:end;font-size:32px;line-height:1}.st .v[style]{font-size:21px!important}
  .st .l{grid-area:lab;margin-top:10px;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .st .sub{grid-area:sub;margin-top:1px;font-size:11.5px}
  .st.hot .ico,.st.bad .ico{box-shadow:0 0 16px rgba(251,191,36,.3)}.st.bad .ico{box-shadow:0 0 16px rgba(251,113,133,.3)}
}
/* v5.2 */
.vr.qr .s{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sh .ico{flex:none}.sh>div:nth-child(3),.sh>div:nth-child(2){min-width:0}.vkick{font-size:10.5px;font-weight:700;letter-spacing:.16em;color:var(--tx3);margin-bottom:3px}.vst.hot .vkick{color:#7dd3fc}.vst.live .vkick{color:#6ee7b7}.vst.warn .vkick{color:#fcd34d}.vst.ok .vkick{color:#6ee7b7}
.sh .bk{margin-left:0;flex:none;width:38px;height:38px}.sh .bk svg{transform:rotate(180deg)}
.sh .vtag{margin-left:auto;flex:none}.sh .vtag+.x{margin-left:0}
.vst{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:24px;border:1px solid var(--line);background:rgba(var(--wh),.05)}
.vst .vsi{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;flex:none;background:rgba(var(--wh),.08)}
.vst .vh1{font-size:17px;font-weight:600;line-height:1.25}.vh2{font-size:12.5px;color:var(--tx2);margin-top:3px;line-height:1.35}
.vst.hot{background:linear-gradient(150deg,rgba(56,189,248,.26),rgba(var(--wh),.04));border-color:rgba(56,189,248,.35)}.vst.hot .vsi{background:rgba(56,189,248,.22);color:#7dd3fc}
.vst.live{background:linear-gradient(150deg,rgba(52,211,153,.22),rgba(var(--wh),.04));border-color:rgba(52,211,153,.35)}.vst.live .vsi{background:rgba(52,211,153,.22);color:#6ee7b7}
.vst.warn{background:linear-gradient(150deg,rgba(251,191,36,.18),rgba(var(--wh),.04));border-color:rgba(251,191,36,.3)}.vst.warn .vsi{background:rgba(251,191,36,.2);color:#fcd34d}
.vst.ok .vsi{background:rgba(52,211,153,.16);color:#6ee7b7}
.vact{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.vact:empty{display:none}
.vbt.big{display:inline-flex;align-items:center;gap:7px;padding:10px 14px;font-size:13px;min-height:42px}.vbt.on{background:rgba(56,189,248,.2);border-color:rgba(56,189,248,.45);color:#7dd3fc}.vbt[disabled]{opacity:.3;pointer-events:none}
.vts3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
.vt{padding:13px 14px;border-radius:20px;background:rgba(var(--wh),.05);border:1px solid var(--line);min-width:0}.vt.tap{cursor:pointer}
.vtl{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:600;letter-spacing:.14em;color:var(--tx3)}
.vtv{font-size:26px;font-weight:300;margin-top:6px;white-space:nowrap}.vtv small{font-size:12px;color:var(--tx2);margin-left:3px}
.vts{font-size:11.5px;color:var(--tx2);margin-top:6px;display:flex;flex-direction:column;gap:5px;align-items:flex-start}
.wbar{position:relative;width:100%;height:5px;border-radius:3px;background:rgba(var(--wh),.14)}.wbar i{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,#34d399,#fbbf24 60%,#fb7185)}.wbar u{position:absolute;top:-2px;bottom:-2px;width:1px;background:rgba(var(--wh),.5)}
.vnote{display:flex;gap:12px;margin-top:12px;padding:14px 16px;border-radius:20px;background:rgba(var(--wh),.045);border:1px solid var(--line);font-size:13px;line-height:1.45}.vnote>svg{flex:none;margin-top:2px;color:var(--tx2)}.vnote span{color:var(--tx2);font-size:12.5px}
.vrbox{display:block}.vrhd{display:flex;align-items:center;gap:12px;font-size:12px;color:var(--tx2);margin-bottom:8px}.vleg{display:inline-flex;align-items:center;gap:6px}.vleg i{width:10px;height:10px;border-radius:50%;display:inline-block}.vago{margin-left:auto;color:var(--tx3)}
.vrs{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px;font-size:13px}.vrs small{color:var(--tx3)}.vrt{font-size:12px;color:var(--tx3)}.vrs .tag{margin-left:6px}
.vrplot{position:relative;height:104px}.vrch{width:100%;height:100%;display:block;overflow:visible}
.vrdot{position:absolute;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#38bdf8;box-shadow:0 0 0 4px rgba(56,189,248,.25)}
.vrx{display:flex;justify-content:space-between;font-size:11px;color:var(--tx3);margin-top:6px}
.vchips{display:flex;flex-wrap:wrap;gap:8px}.vchip{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;background:rgba(var(--wh),.07);border:1px solid var(--line);font-size:12.5px;color:var(--tx2)}.vchip b{color:var(--tx);font-weight:600}.vchip.btn{cursor:pointer}.vchip.good{color:#6ee7b7;background:rgba(52,211,153,.14)}.vchip.bad{color:#fda4af;background:rgba(251,113,133,.15)}
.vchip .chev svg{transition:transform .2s}.vchip .chev.up svg{transform:rotate(-90deg)}.vchip .chev svg{transform:rotate(90deg)}.vchip .chev.up svg{transform:rotate(-90deg)}
.vstat{margin-top:10px}.vr .m small{display:block;color:var(--tx3);font-size:11px}
.tr.dense{gap:2px}.tr.dense i{max-width:none;border-radius:4px 4px 2px 2px}.tr.dense div{font-size:9.5px}
.av.big2{width:52px;height:52px;font-size:20px;flex:none}
.pc.tap{cursor:pointer}
.qbtns{margin-left:auto;display:flex;gap:6px;flex:none}.qbtns .vbt{min-width:36px;padding:8px}
.qnew{display:flex;gap:8px;flex-wrap:wrap}.qnew input{flex:1;min-width:150px;padding:11px 14px;border-radius:14px;border:1px solid var(--line);background:rgba(var(--wh),.06);color:var(--tx);font:inherit;font-size:14px;outline:none}.qnew input:focus{border-color:rgba(56,189,248,.6)}
.adev{padding:12px;border-radius:20px;background:rgba(var(--wh),.045);border:1px solid rgba(var(--wh),.07);margin-bottom:8px}.adev.off{opacity:.6}
.ahd{display:flex;align-items:center;gap:12px}.ahd>div:nth-child(2){min-width:0;flex:1}.ahd .ico{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:rgba(var(--wh),.07);color:var(--tx2);flex:none}.ahd .t{font-weight:600;font-size:14px}.ahd .s{font-size:12px;color:var(--tx3);margin-top:2px}
.actl{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
@media (max-width:520px){.vts3{grid-template-columns:1fr 1fr}.vtv{font-size:24px}}
.app.light .vst.hot .vsi{color:#0369a1}.app.light .vst.live .vsi,.app.light .vst.ok .vsi{color:#047857}.app.light .vst.warn .vsi{color:#b45309}.app.light .vbt.on{color:#0369a1}.app.light .vchip.good{color:#047857}.app.light .vchip.bad{color:#be123c}
.wl{display:flex;flex-direction:column;gap:10px}
.wc{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:22px;background:linear-gradient(135deg,rgba(var(--c),.16),rgba(var(--wh),.035));border:1px solid rgba(var(--c),.3);box-shadow:0 10px 30px -16px rgba(var(--c),.6);min-width:0}
.wc.nx{border-color:rgba(var(--c),.62);box-shadow:0 12px 36px -12px rgba(var(--c),.85)}
.wc .bub{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;flex:none;background:rgba(var(--c),.2);color:rgb(var(--c))}
.wc .tx{flex:1;min-width:0}.wc .n{font-size:17px;font-weight:600;color:var(--tx);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wc .s{font-size:13px;color:var(--tx2);margin-top:2px}
.wc .bd{font-size:12px;font-weight:600;padding:5px 11px;border-radius:99px;background:rgba(var(--c),.22);color:rgb(var(--c));flex:none;white-space:nowrap}
.sbig.wh{background:linear-gradient(150deg,rgba(var(--c),.32),rgba(var(--wh),.04))}.sbig.wh .big.sm{font-size:32px;line-height:1.1}
.app.light .wc .bd,.app.light .wc .bub{color:var(--tx)}.app.light .wc{background:linear-gradient(135deg,rgba(var(--c),.2),rgba(255,255,255,.5))}
`;
/* ───────────── v6: Wetterradar – eigene Karte, DWD-Radar, Blitze, Wind, Warnungen ───────────── */
const RD_TS = 256, RD_R = 20037508.342789244;
const rdX = (lon, z) => (lon + 180) / 360 * RD_TS * 2 ** z;
const rdY = (lat, z) => { const s = Math.sin(lat * Math.PI / 180); return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * RD_TS * 2 ** z; };
const rdLon = (x, z) => x / (RD_TS * 2 ** z) * 360 - 180;
const rdLat = (y, z) => { const n = Math.PI - 2 * Math.PI * y / (RD_TS * 2 ** z); return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))); };
const rdMx = (x, z) => (x / (RD_TS * 2 ** z) - 0.5) * 2 * RD_R;
const rdMy = (y, z) => (0.5 - y / (RD_TS * 2 ** z)) * 2 * RD_R;
const rdKm = (a, b) => { const r = Math.PI / 180, dl = (b.lat - a.lat) * r, dn = (b.lon - a.lon) * r, h = Math.sin(dl / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dn / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); };
const RD_TYPES = {
  rain: { n: 'Regen', i: 'drop', f: 'none' },
  snow: { n: 'Schnee', i: 'snow', f: 'grayscale(1) brightness(1.55) contrast(1.2)' },
  sleet: { n: 'Schneeregen', i: 'snow', f: 'hue-rotate(95deg) saturate(1.15)' },
  freezing: { n: 'Gefrierender Regen', i: 'drop', f: 'hue-rotate(170deg) saturate(1.6)' },
};
const RD_CARD = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
const RD_HTML = () => `<div class="rd-map"><div class="rd-world"><div class="rd-base"></div><div class="rd-fr"></div><div class="rd-bl"></div><div class="rd-wn"></div><div class="rd-rf"></div><div class="rd-ov"></div></div></div>
<canvas class="rd-wind"></canvas><div class="rd-fx"></div><div class="rd-vig"></div>
<div class="rd-top"><div class="rd-l"><div class="rd-k">REGENRADAR</div><div class="rd-live"><i></i><span>live</span></div><div class="rd-warns"></div></div>
<div class="rd-r"><div class="rd-say"></div><div class="rd-sub"></div><div class="rd-leg"><span>leicht</span><i></i><span>stark</span></div><div class="rd-type"></div></div></div>
<div class="rd-ctl"><button class="rd-cb z" data-rd="in" aria-label="Vergrößern">${ic('plus', 18)}</button><button class="rd-cb z" data-rd="out" aria-label="Verkleinern">${ic('minus', 18)}</button><button class="rd-cb z" data-rd="home" aria-label="Zu meinem Standort">${ic('radar', 18)}</button><button class="rd-cb ex" data-act="radar" aria-label="Vollbild">${ic('expand', 18)}</button></div>
<button class="rd-cb rdx" data-act="close" aria-label="Schließen">${ic('close', 18)}</button>
<div class="rd-pills"><div class="rd-wp"></div><div class="rd-bp"></div></div>
<div class="rd-tl"><button class="rd-play" data-rd="play" aria-label="Wiedergabe">${ic('pause', 18)}</button><div class="rd-dw"><div class="rd-dots"></div><div class="rd-lb"></div></div><div class="rd-clk"><b>--:--</b><span>RADAR</span></div></div>
<div class="rd-att">Karte © Esri · Radar, Warnungen, Blitzdichte © DWD · Einschläge Blitzortung.org · Kachelmann</div><div class="rd-err" hidden>Karte nicht erreichbar – Netzwerk prüfen</div>`;

class AuroraRadar {
  constructor(host) {
    this.h = host; this.cfg = host._rdrCfg(); this.full = false; this.alive = true; this.paused = true;
    const hc = host._h?.config || {};
    this.home = { lat: hc.latitude ?? 51.7235, lon: hc.longitude ?? 8.5633 };
    this.z = this.cfg.zoom; this.cx = rdX(this.home.lon, this.z); this.cy = rdY(this.home.lat, this.z);
    this.W = 0; this.H = 0; this.tiles = new Map(); this.tOk = 0; this.tErr = 0; this.fr = []; this.cur = []; this.old = []; this.ok = []; this.fi = 0; this.nowIdx = 0;
    this.play = !matchMedia('(prefers-reduced-motion: reduce)').matches; this.rates = []; this.say = null; this.gen = 0; this.sig = {}; this.kw = null; this.fxk = '';
    const r = this.root = document.createElement('div'); r.className = 'rdm'; r.innerHTML = RD_HTML();
    this.q = s => r.querySelector(s);
    this.world = this.q('.rd-world'); this.baseEl = this.q('.rd-base'); this.frEl = this.q('.rd-fr'); this.blEl = this.q('.rd-bl'); this.wnEl = this.q('.rd-wn'); this.rfEl = this.q('.rd-rf'); this.ovEl = this.q('.rd-ov'); this.map = this.q('.rd-map');
    this.cv = this.q('.rd-wind'); this.ctx = this.cv.getContext('2d'); this.P = [];
    this.bindEvents();
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(r);
    this.setMode(false);
  }
  /* ── Steuerung ── */
  setMode(full) {
    this.full = !!full; this.root.classList.toggle('full', this.full);
    if (this.full) this.map.removeAttribute('data-act'); else this.map.setAttribute('data-act', 'radar');
  }
  resume() { if (!this.paused) return; this.paused = false; this.resize(); this.refresh(); this.t5 = setInterval(() => this.refresh(), 3e5); this.tp = setInterval(() => this.stepPlay(), 480); this.raf(); }
  pause() { if (this.paused) return; this.paused = true; clearInterval(this.t5); clearInterval(this.tp); cancelAnimationFrame(this._raf); }
  destroy() { this.alive = false; this.pause(); this.ro.disconnect(); this.root.remove(); }
  bindEvents() {
    const m = this.map, pt = new Map(); let drag = null, pd = 0;
    m.addEventListener('pointerdown', e => {
      if (!this.full) return;
      pt.set(e.pointerId, e); m.setPointerCapture?.(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, cx: this.cx, cy: this.cy }; if (pt.size === 2) { const [a, b] = [...pt.values()]; pd = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); }
    });
    m.addEventListener('pointermove', e => {
      if (!pt.has(e.pointerId)) return; pt.set(e.pointerId, e);
      if (pt.size === 2) { const [a, b] = [...pt.values()], d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); if (pd && d / pd > 1.35) { this.zoom(1); pd = d; drag = null; } else if (pd && d / pd < 0.74) { this.zoom(-1); pd = d; drag = null; } return; }
      if (!drag) return; this.cx = drag.cx - (e.clientX - drag.x); this.cy = drag.cy - (e.clientY - drag.y); this.view(); this.later();
    });
    const up = e => { pt.delete(e.pointerId); if (pt.size < 2) pd = 0; if (!pt.size) drag = null; else { const o = [...pt.values()][0]; drag = { x: o.clientX, y: o.clientY, cx: this.cx, cy: this.cy }; } };
    m.addEventListener('pointerup', up); m.addEventListener('pointercancel', up);
    m.addEventListener('wheel', e => { if (!this.full) return; e.preventDefault(); const t = Date.now(); if (t - (this._wh || 0) < 220) return; this._wh = t; this.zoom(e.deltaY < 0 ? 1 : -1); }, { passive: false });
    m.addEventListener('dblclick', () => { if (this.full) this.zoom(1); });
    this.root.addEventListener('click', e => {
      const b = e.target.closest('[data-rd]'); if (!b) return; const k = b.dataset.rd;
      if (k === 'in') this.zoom(1); else if (k === 'out') this.zoom(-1); else if (k === 'home') this.center();
      else if (k === 'play') { this.play = !this.play; this.setPlayIcon(); }
    });
    const dw = this.q('.rd-dots'); let sc = false;
    const pick = e => { const r = dw.getBoundingClientRect(), n = this.fr.length; if (!n) return; this.play = false; this.setPlayIcon(); this.show(Math.max(0, Math.min(n - 1, Math.round((e.clientX - r.left) / r.width * (n - 1))))); };
    dw.addEventListener('pointerdown', e => { sc = true; dw.setPointerCapture?.(e.pointerId); pick(e); });
    dw.addEventListener('pointermove', e => { if (sc) pick(e); });
    dw.addEventListener('pointerup', () => { sc = false; });
  }
  setPlayIcon() { const b = this.q('.rd-play'); b.innerHTML = ic(this.play ? 'pause' : 'play', 18); }
  zoom(d) { const z = Math.max(5, Math.min(11, this.z + d)); if (z === this.z) return; const f = 2 ** (z - this.z); this.cx *= f; this.cy *= f; this.z = z; this.clearTiles(); this.dropFrames(); this.view(); this.markers(); this.later(0); }
  center() { this.z = this.cfg.zoom; this.cx = rdX(this.home.lon, this.z); this.cy = rdY(this.home.lat, this.z); this.clearTiles(); this.dropFrames(); this.view(); this.markers(); this.later(0); }
  later(ms = 450) { clearTimeout(this._lt); this._lt = setTimeout(() => this.loadOverlays(), ms); }
  resize() {
    const W = this.root.clientWidth, H = this.root.clientHeight; if (!W || !H) return;
    const ch = W !== this.W || H !== this.H; this.W = W; this.H = H;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); this.cv.width = W * dpr; this.cv.height = H * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); this.initP();
    this.view(); this.markers(); if (ch && !this.paused) this.later(250);
  }
  /* ── Karte ── */
  view() { this.world.style.transform = `translate3d(${(this.W / 2 - this.cx).toFixed(1)}px,${(this.H / 2 - this.cy).toFixed(1)}px,0)`; this.placeTiles(); }
  baseStyle() { return this.h._app?.classList.contains('light') ? 'light' : 'dark'; }
  clearTiles() { this.tiles.forEach(i => i.remove()); this.tiles.clear(); }
  layers(st) {
    const b = this.cfg.base; if (typeof b === 'string') return [[b, this.baseEl]];
    const L = b[st] || b.dark || []; return L.map((u, i) => [u, i ? this.rfEl : this.baseEl]);
  }
  placeTiles() {
    const st = this.baseStyle(); if (st !== this.bs) { this.bs = st; this.clearTiles(); }
    const z = this.z, n = 2 ** z, W = this.W, H = this.H; if (!W) return;
    const x0 = Math.floor((this.cx - W / 2) / RD_TS) - 1, x1 = Math.floor((this.cx + W / 2) / RD_TS) + 1, y0 = Math.max(0, Math.floor((this.cy - H / 2) / RD_TS) - 1), y1 = Math.min(n - 1, Math.floor((this.cy + H / 2) / RD_TS) + 1);
    const keep = new Set(), LY = this.layers(st);
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) LY.forEach(([tpl, host], li) => {
      if (this.cfg.mock && li) return;
      const k = li + '/' + z + '/' + x + '/' + y; keep.add(k); if (this.tiles.has(k)) return;
      const im = new Image(); im.className = 'rd-t'; im.alt = ''; im.draggable = false; im.decoding = 'async'; im.referrerPolicy = 'no-referrer';
      im.style.left = x * RD_TS + 'px'; im.style.top = y * RD_TS + 'px';
      if (!li) { im.onload = () => { this.tOk++; this.q('.rd-err').hidden = true; }; im.onerror = () => { this.tErr++; if (!this.tOk && this.tErr > 5) this.q('.rd-err').hidden = false; }; }
      const xm = ((x % n) + n) % n;
      im.src = this.cfg.mock ? this.mockTile(z, xm, y) : tpl.replace('{s}', 'abcd'[(xm + y) % 4]).replace('{st}', st).replace('{z}', z).replace('{x}', xm).replace('{y}', y);
      host.appendChild(im); this.tiles.set(k, im);
    });
    this.tiles.forEach((im, k) => { if (!keep.has(k)) { im.remove(); this.tiles.delete(k); } });
  }
  mockTile(z, x, y) {
    this._mt = this._mt || new Map(); const k = this.bs + z + '/' + x + '/' + y; if (this._mt.has(k)) return this._mt.get(k);
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), light = this.bs === 'light';
    g.fillStyle = light ? '#e4eaf2' : '#141b2b'; g.fillRect(0, 0, 256, 256);
    let s = (x * 73856093 ^ y * 19349663 ^ z * 83492791) >>> 0; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    g.strokeStyle = light ? 'rgba(15,23,42,.10)' : 'rgba(255,255,255,.07)'; g.lineWidth = 1;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(rnd() * 256, 0); g.bezierCurveTo(rnd() * 256, 80, rnd() * 256, 160, rnd() * 256, 256); g.stroke(); }
    g.fillStyle = light ? 'rgba(15,23,42,.06)' : 'rgba(255,255,255,.04)'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(rnd() * 256, rnd() * 256, 20 + rnd() * 50, 0, 7); g.fill(); }
    g.strokeStyle = light ? 'rgba(15,23,42,.08)' : 'rgba(255,255,255,.05)'; g.strokeRect(0, 0, 256, 256);
    const u = c.toDataURL(); this._mt.set(k, u); return u;
  }
  /* ── Zeitachse (DWD) ── */
  iso(t) { return new Date(t).toISOString(); }
  async capsTimes() {
    const L = this.cfg.radar, nm = L.split(':').pop(), url = this.cfg.wms.replace(/\/wms$/, '') + '/' + nm + '/wms?service=WMS&version=1.3.0&request=GetCapabilities';
    const r = await fetch(url); if (!r.ok) throw new Error('caps'); const x = new DOMParser().parseFromString(await r.text(), 'text/xml');
    const d = [...x.getElementsByTagName('Dimension')].find(e => (e.getAttribute('name') || '').toLowerCase() === 'time'); if (!d) throw new Error('dim');
    const per = p => { const m = /P(?:T)?(?:(\d+)H)?(?:(\d+)M)?/.exec(p || ''); return m ? ((+m[1] || 0) * 60 + (+m[2] || 0)) * 6e4 || 3e5 : 3e5; };
    const out = new Set(), now = Date.now(), lo = now - this.cfg.past * 6e4 - 3e5, hi = now + this.cfg.future * 6e4 + 3e5;
    for (const tok of d.textContent.split(',')) {
      const p = tok.trim().split('/'); if (p.length >= 2) { const a = Date.parse(p[0]), b = Date.parse(p[1]), s = per(p[2]); if (!isFinite(a) || !isFinite(b)) continue; for (let t = Math.max(a, b - 5 * 864e5), n = 0; t <= b && n < 4000; t += s, n++) if (t >= lo && t <= hi) out.add(t); }
      else { const t = Date.parse(p[0]); if (isFinite(t) && t >= lo && t <= hi) out.add(t); }
    }
    return [...out].sort((a, b) => a - b);
  }
  async buildFrames() {
    let times = []; const cfg = this.cfg, now = Date.now();
    if (!cfg.mock) { try { times = await this.capsTimes(); } catch (e) { times = []; } }
    if (times.length < 8) { times = []; const Lt = Math.floor((now - 7 * 6e4) / 3e5) * 3e5; for (let t = Lt - cfg.past * 6e4; t <= Lt + cfg.future * 6e4; t += 3e5) times.push(t); }
    this.fr = times; let ni = 0; times.forEach((t, i) => { if (t <= now) ni = i; }); this.nowIdx = ni; if (this.fi >= times.length || !this._fiSet) { this.fi = ni; this._fiSet = true; }
    this.drawTl();
  }
  drawTl() {
    const n = this.fr.length, now = Date.now();
    this.q('.rd-dots').innerHTML = this.fr.map((t, i) => `<i class="${t > now ? 'f' : ''}" data-i="${i}"></i>`).join('');
    const at = ms => { let b = 0, bd = 1e18; this.fr.forEach((t, i) => { const d = Math.abs(t - (now + ms)); if (d < bd) { bd = d; b = i; } }); return b / Math.max(1, n - 1) * 100; };
    this.q('.rd-lb').innerHTML = [['−2 h', -12e5 * 6], ['−1 h', -36e5], ['jetzt', 0], ['+1 h', 36e5]].filter(x => this.fr.length > 10).map(x => { const l = at(x[1]); return `<span style="left:${l.toFixed(1)}%${l > 90 ? ';transform:translateX(-100%)' : ''}">${x[0]}</span>`; }).join('');
    this.dotsEl = [...this.q('.rd-dots').children];
  }
  /* ── Overlays (Radar-Frames, Blitzdichte, Warnungen) ── */
  box() { const bw = this.W * 1.5, bh = this.H * 1.5, z = this.z, l = this.cx - bw / 2, t = this.cy - bh / 2, s = Math.min(1, 1100 / Math.max(bw, bh)); return { l, t, bw, bh, w: Math.round(bw * s), h: Math.round(bh * s), bbox: [rdMx(l, z), rdMy(t + bh, z), rdMx(l + bw, z), rdMy(t, z)].map(v => v.toFixed(1)).join(',') }; }
  wmsUrl(layer, b, time) { return `${this.cfg.wms}?service=WMS&version=1.3.0&request=GetMap&layers=${encodeURIComponent(layer)}&styles=&format=image/png&transparent=true&crs=EPSG:3857&bbox=${b.bbox}&width=${b.w}&height=${b.h}${time ? '&time=' + encodeURIComponent(this.iso(time)) : ''}`; }
  place(im, b) { im.style.left = b.l.toFixed(1) + 'px'; im.style.top = b.t.toFixed(1) + 'px'; im.style.width = b.bw.toFixed(1) + 'px'; im.style.height = b.bh.toFixed(1) + 'px'; }
  dropFrames() { this.gen++; [...this.cur, ...this.old].forEach(i => i && i.remove()); this.cur = []; this.old = []; this.ok = []; this.blEl.innerHTML = ''; this.wnEl.innerHTML = ''; }
  mockFrame(t, b) {
    const c = document.createElement('canvas'); c.width = Math.round(b.w / 2); c.height = Math.round(b.h / 2); const g = c.getContext('2d'), z = this.z, now = Date.now();
    const blobs = [[this.home.lon - 0.9, this.home.lat + 0.35, 0.45, 1], [this.home.lon - 0.2, this.home.lat + 0.1, 0.22, 0.8], [this.home.lon - 1.4, this.home.lat - 0.2, 0.3, 0.6], [this.home.lon + 1.0, this.home.lat + 0.5, 0.35, 0.9]];
    const dt = (t - now) / 36e5; blobs.forEach(([lo, la, rr, it]) => {
      const lon = lo + (dt + 1.0) * 0.55, lat = la, px = (rdX(lon, z) - b.l) / b.bw * c.width, py = (rdY(lat, z) - b.t) / b.bh * c.height, pr = rr * (RD_TS * 2 ** z / 360) / b.bw * c.width;
      const gr = g.createRadialGradient(px, py, 0, px, py, pr); gr.addColorStop(0, 'rgba(217,70,239,' + (.9 * it) + ')'); gr.addColorStop(.25, 'rgba(239,68,68,' + (.85 * it) + ')'); gr.addColorStop(.45, 'rgba(250,204,21,.8)'); gr.addColorStop(.7, 'rgba(34,197,94,.65)'); gr.addColorStop(1, 'rgba(59,130,246,0)'); g.fillStyle = gr; g.beginPath(); g.arc(px, py, pr, 0, 7); g.fill();
    }); return c.toDataURL();
  }
  loadOverlays() {
    if (this.paused || !this.W || !this.fr.length) return;
    const b = this.box(), myGen = ++this.gen; this.old.forEach(i => i && i.remove()); this.old = this.cur; this.cur = []; this.ok = [];
    const order = this.fr.map((t, i) => i).sort((a, c) => Math.abs(a - this.fi) - Math.abs(c - this.fi)); let q = 0, run = 0, done = 0;
    const finish = () => { if (myGen === this.gen) { this.old.forEach(i => i && i.remove()); this.old = []; } };
    const pump = () => {
      while (run < 6 && q < order.length) {
        const i = order[q++]; run++;
        const im = new Image(); im.className = 'rd-f'; im.alt = ''; im.draggable = false; im.decoding = 'async'; this.place(im, b); this.cur[i] = im; this.frEl.appendChild(im);
        const end = ok => { run--; done++; if (myGen !== this.gen) return; this.ok[i] = ok; if (!ok) im.remove(); if (i === this.fi) this.show(this.fi); if (ok && i === this.fi) finish(); if (done >= order.length) finish(); this.dotState(); pump(); };
        im.onload = () => end(true); im.onerror = () => end(false);
        im.src = this.cfg.mock ? this.mockFrame(this.fr[i], b) : this.wmsUrl(this.cfg.radar, b, this.fr[i]);
      }
    };
    pump();
    const bl = new Image(); bl.alt = ''; this.place(bl, b); bl.onerror = () => bl.remove(); bl.src = this.cfg.mock ? this.mockBolt(b) : this.wmsUrl(this.cfg.bolt, b); this.blEl.innerHTML = ''; this.blEl.appendChild(bl);
    this.warnLayer(b);
  }
  mockBolt(b) { const c = document.createElement('canvas'); c.width = 200; c.height = 160; const g = c.getContext('2d'); g.fillStyle = 'rgba(34,211,238,.9)'; for (let i = 0; i < 22; i++) { g.beginPath(); g.arc(120 + Math.random() * 50, 70 + Math.random() * 50, 1.6, 0, 7); g.fill(); } return c.toDataURL(); }
  warnLayer(b) {
    b = b || this.box(); const has = this.h._rdrWarns().length; this.wnEl.innerHTML = '';
    if (!has || this.cfg.mock) return; const im = new Image(); im.alt = ''; this.place(im, b); im.onerror = () => im.remove(); im.src = this.wmsUrl(this.cfg.warn, b); this.wnEl.appendChild(im);
  }
  /* ── Frames abspielen ── */
  show(i) {
    this.fi = i; const set = [this.cur, this.old];
    [...this.cur, ...this.old].forEach(im => im && im.classList.remove('on'));
    const pick = (this.cur[i] && this.ok[i]) ? this.cur[i] : this.old[i]; if (pick) pick.classList.add('on');
    const t = this.fr[i]; if (t) { const c = this.q('.rd-clk'); c.firstChild.textContent = new Date(t).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); c.lastChild.textContent = t > Date.now() ? 'PROGNOSE' : 'RADAR'; c.classList.toggle('fc', t > Date.now()); }
    this.dotState();
  }
  dotState() { (this.dotsEl || []).forEach((d, i) => { d.classList.toggle('on', i === this.fi); d.classList.toggle('na', this.ok.length > 0 && this.ok[i] === false); }); }
  stepPlay() {
    if (!this.play || this.paused || !this.fr.length) return;
    let n = this.fi + 1; if (n >= this.fr.length) n = 0; let g = 0; while (this.ok[n] === false && g++ < this.fr.length) n = (n + 1) % this.fr.length; this.show(n);
  }
  /* ── Daten (Regen-Wert am Standort, Kachelmann, …) ── */
  async refresh() {
    if (this.paused) return; await this.buildFrames(); this.show(Math.min(this.fi, this.fr.length - 1)); this.loadOverlays();
    this.fetchRates(); this.fetchKw();
  }
  async fetchRates() {
    const cfg = this.cfg, now = Date.now(), n = this.fr.length; if (!n) return;
    const idx = []; for (let i = this.nowIdx; i < n && this.fr[i] <= now + cfg.future * 6e4 + 3e5; i++) idx.push(i);
    if (cfg.mock) { const T0 = now + (cfg.mockEta ?? 35) * 6e4; this.rates = idx.map(i => 2.2 * Math.exp(-(((this.fr[i] - T0) / 6e4 / 12) ** 2))); this.rateT = idx.map(i => this.fr[i]); this.upd(true); return; }
    const m = 3000, mx = this.home.lon / 180 * RD_R, my = Math.log(Math.tan((90 + this.home.lat) * Math.PI / 360)) / Math.PI * RD_R, bb = [mx - m, my - m, mx + m, my + m].map(v => v.toFixed(1)).join(','), L = encodeURIComponent(cfg.radar);
    const one = async i => {
      try {
        const r = await fetch(`${cfg.wms}?service=WMS&version=1.3.0&request=GetFeatureInfo&layers=${L}&query_layers=${L}&styles=&crs=EPSG:3857&bbox=${bb}&width=5&height=5&i=2&j=2&info_format=application/json&feature_count=1&time=${encodeURIComponent(this.iso(this.fr[i]))}`);
        if (!r.ok) return null; const j = await r.json(), f = j.features?.[0]; if (!f) return 0;
        const v = Object.values(f.properties || {}).find(x => typeof x === 'number' && isFinite(x)); if (v == null) return 0; const q = v * cfg.factor; return q < 0 || q > 500 ? 0 : q;
      } catch (e) { return null; }
    };
    const res = await Promise.all(idx.map(one)); this.rates = res; this.rateT = idx.map(i => this.fr[i]); this.upd(true);
  }
  async fetchKw() {
    const e = this.h._c.stationWeather; if (!e || !this.h._s(e) || (this.kw && Date.now() - this.kw.t < 9e5)) return;
    try { const r = await this.h._h.callWS({ type: 'call_service', domain: 'weather', service: 'get_forecasts', service_data: { type: 'hourly' }, target: { entity_id: e }, return_response: true }); this.kw = { t: Date.now(), list: r?.response?.[e]?.forecast || [] }; } catch (er) { this.kw = { t: Date.now(), list: [] }; }
    this.upd(true);
  }
  /* ── Auswertung ── */
  ptype() {
    const h = this.h, w = h._wxNow(), t = w.temp, rh = w.hum ?? 80; let cond = w.cond;
    const wr = h._rdrWarns().map(x => (x.name + ' ' + x.head + ' ' + x.type).toLowerCase()).join(' ');
    if (this.eta != null && this.kw?.list) { const e = this.kw.list.find(x => Date.parse(x.datetime) + 36e5 > Date.now() && (x.precipitation || 0) >= 0.1); if (e && (e.condition === 'snowy' || e.condition === 'snowy-rainy')) cond = e.condition; }
    if (t != null && t <= 3 && /gefrierend|glatteis|eisregen/.test(wr)) return 'freezing';
    if (cond === 'snowy') return 'snow'; if (cond === 'snowy-rainy') return 'sleet';
    if (t == null) return 'rain';
    const tw = t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) + Math.atan(t + rh) - Math.atan(rh - 1.676331) + 0.00391838 * rh ** 1.5 * Math.atan(0.023101 * rh) - 4.686035;
    return tw <= 0 && t <= 2 ? 'snow' : tw <= 1.2 && t <= 3.5 ? 'sleet' : 'rain';
  }
  sayInfo() {
    const h = this.h, now = Date.now(), c = h._c, st = c.station; let cur = null, eta = null, src = '';
    const sr = h._num(st.rainRate); const rt = this.rates || [];
    if (rt.length && rt.some(x => x != null)) {
      src = 'DWD-Radar'; cur = rt[0] != null ? rt[0] : null;
      for (let i = 1; i < rt.length; i++) if (rt[i] != null && rt[i] >= 0.1) { eta = Math.max(5, Math.round((this.rateT[i] - now) / 6e4)); break; }
    } else if (this.kw?.list?.length) {
      src = 'Kachelmann'; const e = this.kw.list.find(x => Date.parse(x.datetime) + 36e5 > now && Date.parse(x.datetime) < now + 36e5 * 3 && (x.precipitation || 0) >= 0.1);
      if (e) { const m = Math.round((Date.parse(e.datetime) - now) / 6e4); if (m <= 0) cur = e.precipitation; else eta = Math.max(5, m); }
    }
    if (sr != null && sr >= 0.1) { cur = sr; src = 'Wetterstation'; }
    this.eta = eta; const ty = this.ptype(), T = RD_TYPES[ty], verb = T.n;
    const f5 = m => m < 60 ? Math.max(5, Math.round(m / 5) * 5) : Math.round(m / 5) * 5;
    if (cur != null && cur >= 0.1) return { tone: 'now', ty, txt: `${de(cur, cur < 10 ? 1 : 0)} mm/h gerade hier`, sub: `${verb}${src ? ' · ' + src : ''}`, rain: true };
    if (eta != null) return { tone: 'soon', ty, txt: `in ~${f5(eta)} min ${verb} erwartet`, sub: src ? 'nächste Stunde · ' + src : 'nächste Stunde', rain: false };
    return { tone: 'dry', ty, txt: 'trocken', sub: src === 'Kachelmann' ? 'nächste 3 Stunden' : 'nächste Stunde', rain: false };
  }
  windInfo() {
    const h = this.h, st = h._c.station, kw = h._s(h._c.stationWeather)?.attributes || {};
    const f = u => /m\/s/.test(u || '') ? 3.6 : /mph/.test(u || '') ? 1.609344 : /kn/.test(u || '') ? 1.852 : 1;
    const g = e => { const v = h._num(e); return v == null ? null : v * f(h._attr(e, 'unit_of_measurement')); };
    let spd = g(st.speed), gust = g(st.gust), mx = g(st.maxGust), dir = h._num(st.dir);
    const kf = f(kw.wind_speed_unit); if (spd == null && kw.wind_speed != null) spd = kw.wind_speed * kf; if (gust == null && kw.wind_gust_speed != null) gust = kw.wind_gust_speed * kf; if (dir == null && kw.wind_bearing != null) dir = +kw.wind_bearing;
    if (mx == null) mx = g('sensor.kachelmannwetter_windboen_maximum_heute');
    if (gust == null) gust = spd; return { spd, gust, mx, dir };
  }
  strikes() {
    const h = this.h, S = h._h.states, out = [];
    for (const id in S) {
      if (!id.startsWith('geo_location.')) continue; const a = S[id].attributes || {};
      if (!/blitzortung/i.test(a.source || '') && !/lightning_strike/.test(id)) continue;
      const lat = +a.latitude, lon = +a.longitude; if (!isFinite(lat) || !isFinite(lon)) continue;
      const d = rdKm(this.home, { lat, lon }); if (d > this.cfg.strikeKm) continue;
      const t = Date.parse(a.publication_date || S[id].last_changed); out.push({ id, lat, lon, d, t: isFinite(t) ? t : Date.now() });
    }
    return out.sort((a, b) => a.d - b.d);
  }
  boltInfo() {
    const h = this.h, st = h._c.station, S = this.strikes();
    if (S.length) return { n: S.length, d: S[0].d, S, src: 'bo' };
    const ls = h._val(st.lastStrike), sd = h._num(st.strikeDist);
    if (okv(ls) && Date.now() - Date.parse(ls) < 120 * 6e4 && Date.now() >= Date.parse(ls) - 6e4) return { n: Math.max(1, Math.round(h._num(st.strikes) || 1)), d: sd, S: [], src: 'st' };
    return { n: 0, S: [], storm: h._val(this.cfg.kw.storm) === 'on' };
  }
  /* ── Darstellung ── */
  upd(force) {
    if (!this.alive) return; const h = this.h, q = this.q, say = this.sayInfo(), wi = this.windInfo(), bi = this.boltInfo(), W = h._rdrWarns(), T = RD_TYPES[say.ty];
    this.say = say; this.wi = wi; if (this.W && this.baseStyle() !== this.bs) this.placeTiles();
    const set = (k, el, html) => { if (this.sig[k] !== html) { this.sig[k] = html; el.innerHTML = html; } };
    const sy = q('.rd-say'); sy.className = 'rd-say t-' + say.tone; set('say', sy, esc(say.txt));
    set('sub', q('.rd-sub'), esc(say.sub));
    const showT = say.tone !== 'dry'; set('type', q('.rd-type'), showT ? `<span>${ic(T.i, 13)}${esc(T.n)}</span>` : '');
    this.frEl.style.filter = T.f === 'none' ? '' : T.f; q('.rd-leg i').style.filter = T.f === 'none' ? '' : T.f;
    const fxk = say.rain ? (say.ty === 'rain' || say.ty === 'freezing' ? 'rain' : 'snow') : ''; if (fxk !== this.fxk) { this.fxk = fxk; const fx = q('.rd-fx'); fx.className = 'rd-fx' + (fxk ? ' on ' + fxk : ''); fx.innerHTML = fxk ? Array.from({ length: fxk === 'rain' ? 26 : 22 }, (_, i) => `<i style="left:${(i * 97 % 100)}%;animation-delay:-${(i * 0.37 % 3).toFixed(2)}s;animation-duration:${(fxk === 'rain' ? 0.7 + (i % 5) * 0.12 : 4 + (i % 6) * 0.7).toFixed(2)}s"></i>`).join('') : ''; }
    const live = q('.rd-live'), age = this.fr.length ? Date.now() - this.fr[this.nowIdx] : 0, stale = age > 25 * 6e4 && !this.cfg.mock; live.classList.toggle('st', stale); set('live', live.lastChild, stale ? 'Daten alt' : 'live');
    set('warns', q('.rd-warns'), W.slice(0, this.full ? 99 : 2).map(w => `<button class="rd-w l${w.level} ${w.pre ? 'pre' : ''} ${w.level >= 3 && !w.pre ? 'rdp' : ''}" data-act="warn" data-k="${w.k}" data-i="${w.i}">${ic('alert', 14)}<span>${w.pre ? 'Vorab: ' : ''}${esc(w.name)}${w.end ? ' · bis ' + this.fmtEnd(w.end) : ''}</span></button>`).join('') + (!this.full && W.length > 2 ? `<button class="rd-w more" data-act="radar"><span>+${W.length - 2} weitere</span></button>` : ''));
    if (W.length !== this._wn) { this._wn = W.length; this.warnLayer(); }
    const wd = wi.dir, wc = this.wcol(Math.max(wi.spd || 0, (wi.gust || 0) * 0.7));
    set('wp', q('.rd-wp'), wi.spd == null && wi.gust == null ? '' : `<div class="rd-wc" style="--wc:${wc}"><span class="rd-cp"><em>N</em><svg viewBox="0 0 24 24" style="transform:rotate(${wd != null ? Math.round(wd + 180) : 0}deg)"><path d="M12 3l6 17-6-4-6 4z" fill="currentColor"/></svg></span><div><b>${de(wi.gust ?? wi.spd, 1)} <small>km/h Böen</small></b><s>Wind ${de(wi.spd ?? 0, 1)}${wd != null ? ' · aus ' + RD_CARD[Math.round(wd / 45) % 8] : ''}${wi.mx != null ? ' · max heute ' + de(wi.mx, 1) : ''}</s></div></div>`);
    let bp = ''; if (bi.n) bp = `<div class="rd-bc">${ic('bolt', 16)}<b>${bi.n}</b> ${bi.n === 1 ? 'Blitz' : 'Blitze'}${bi.d != null ? ' · nächster ' + de(bi.d, 0) + ' km' : ''}</div>`; else if (bi.storm) bp = `<div class="rd-bc soft">${ic('bolt', 16)}Gewitter erwartet</div>`;
    set('bp', q('.rd-bp'), bp); this.bolts = bi.S; this.markers(); this.windSetup();
  }
  fmtEnd(iso) { const d = new Date(iso); if (isNaN(d)) return ''; const same = d.toDateString() === new Date().toDateString(); return (same ? '' : d.toLocaleDateString('de-DE', { weekday: 'short' }) + ' ') + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); }
  wcol(v) { return v < 15 ? '#67e8f9' : v < 30 ? '#86efac' : v < 45 ? '#fde047' : v < 60 ? '#fb923c' : '#f87171'; }
  markers() {
    const z = this.z, hx = rdX(this.home.lon, z), hy = rdY(this.home.lat, z), mpp = 156543.03392 * Math.cos(this.home.lat * Math.PI / 180) / 2 ** z, now = Date.now();
    const rings = this.bolts?.length || this.sig.bp ? this.cfg.rings.map(k => `<i class="rd-ring" style="left:${hx}px;top:${hy}px;width:${(2000 * k / mpp).toFixed(1)}px;height:${(2000 * k / mpp).toFixed(1)}px"></i>`).join('') : '';
    const bs = (this.bolts || []).map(s => { const a = (now - s.t) / 6e4, c = a < 3 ? 'n' : a < 60 ? 'o' : 'x'; return `<i class="rd-s ${c}" style="left:${rdX(s.lon, z).toFixed(1)}px;top:${rdY(s.lat, z).toFixed(1)}px" title="${de(s.d, 0)} km · ${this.h._ago(new Date(s.t).toISOString())}">${ic('bolt', 20)}</i>`; }).join('');
    const html = `${rings}${bs}<i class="rd-home" style="left:${hx}px;top:${hy}px"></i>`; if (this.sig.mk !== html) { this.sig.mk = html; this.ovEl.innerHTML = html; }
  }
  /* ── Windschlieren ── */
  initP() { const n = Math.round(Math.max(18, Math.min(90, this.W * this.H / 7000))); this.P = Array.from({ length: n }, () => this.np(true)); }
  np(r) { return { x: Math.random() * this.W, y: Math.random() * this.H, a: r ? Math.random() * 60 : 0, l: 40 + Math.random() * 60 }; }
  windSetup() { const w = this.wi || {}; this.wv = Math.max(w.spd || 0, (w.gust || 0) * 0.6); this.wdir = w.dir; this.wcl = this.wcol(Math.max(w.spd || 0, (w.gust || 0) * 0.7)); if (this.wv < 1.5 || this.wdir == null) this.ctx.clearRect(0, 0, this.W, this.H); }
  raf() {
    cancelAnimationFrame(this._raf); if (this.paused || !this.alive) return;
    const tick = ts => {
      if (this.paused || !this.alive) return; if (!this.root.isConnected) return this.pause();
      if (ts - (this._lf || 0) > 33) { this._lf = ts; this.drawWind(); }
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }
  drawWind() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const g = this.ctx, W = this.W, H = this.H; if (!W || this.wv == null || this.wv < 1.5 || this.wdir == null) return;
    const rad = (this.wdir + 180) * Math.PI / 180, v = 0.5 + Math.min(this.wv, 70) * 0.055, vx = Math.sin(rad) * v, vy = -Math.cos(rad) * v, len = 2 + Math.min(this.wv, 60) * 0.28;
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; g.strokeStyle = this.wcl; g.lineWidth = 1.5; g.lineCap = 'round';
    for (const p of this.P) {
      p.a++; p.x += vx; p.y += vy; if (p.a > p.l || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) { Object.assign(p, this.np(false)); continue; }
      g.globalAlpha = Math.sin(Math.PI * p.a / p.l) * 0.7; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - vx * len, p.y - vy * len); g.stroke();
    } g.globalAlpha = 1;
  }
}

const CSS4 = `
.rdc .h .r{margin-left:auto}.rd-open{display:inline-flex;gap:6px;align-items:center;border:0;border-radius:999px;padding:6px 12px;background:rgba(var(--wh),.08);color:var(--tx);font:inherit;font-size:12px;font-weight:600;cursor:pointer}.rd-open:hover{background:rgba(var(--wh),.14)}
.rdslot{position:relative;height:clamp(390px,62vw,480px);border-radius:20px;overflow:hidden;background:#0b1020;isolation:isolate}
.rdslot.full{height:100vh;height:100dvh;border-radius:0}
.ov.rdfull{align-items:stretch;background:#000;backdrop-filter:none;-webkit-backdrop-filter:none}
.ov.rdfull .sheet{width:100%;max-width:none;max-height:none;height:100vh;height:100dvh;padding:0;border:0;border-radius:0;overflow:hidden;box-shadow:none;background:#0b1020;animation:fade .25s both}
.rdm{position:absolute;inset:0;overflow:hidden;color:#fff;font-family:inherit;-webkit-user-select:none;user-select:none}
.rd-map{position:absolute;inset:0;cursor:pointer;touch-action:auto}.rdm.full .rd-map{cursor:grab;touch-action:none}.rdm.full .rd-map:active{cursor:grabbing}
.rd-world{position:absolute;left:0;top:0;width:0;height:0;will-change:transform}
.rd-base,.rd-fr,.rd-bl,.rd-wn,.rd-rf,.rd-ov{position:absolute;left:0;top:0}.rd-rf{opacity:.9}
.rd-t{position:absolute;width:256px;height:256px;max-width:none;pointer-events:none;-webkit-user-drag:none}
.rd-f,.rd-bl img,.rd-wn img{position:absolute;max-width:none;pointer-events:none}.rd-f{opacity:0;transition:opacity .18s}.rd-f.on{opacity:.85}.rd-bl img{opacity:.8}.rd-wn img{opacity:.5}
.rd-ov>i{position:absolute;display:block;transform:translate(-50%,-50%);pointer-events:none}
.rd-home{width:14px;height:14px;border-radius:50%;background:#fff;border:4.5px solid var(--acc,#5eead4);width:18px;height:18px;box-shadow:0 0 0 7px rgba(94,234,212,.2),0 0 20px rgba(94,234,212,.75);animation:rdpulse 2.6s infinite}@keyframes rdpulse{50%{box-shadow:0 0 0 12px rgba(94,234,212,.06),0 0 24px rgba(94,234,212,.9)}}
.rd-ring{border:1.5px dashed rgba(250,204,21,.55);border-radius:50%}
.rd-s{color:#fde047;filter:drop-shadow(0 0 6px rgba(250,204,21,.9))}.rd-s.n{animation:rdflash 1.1s ease-in-out infinite}.rd-s.o{color:#fbbf24;opacity:.85}.rd-s.x{color:#94a3b8;opacity:.55;filter:none}@keyframes rdflash{50%{transform:translate(-50%,-50%) scale(1.35);filter:drop-shadow(0 0 14px #fff)}}
.rd-s .i{display:block;fill:currentColor}
.rd-wind{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.rd-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(130% 100% at 50% 45%,transparent 62%,rgba(5,8,20,.4)),linear-gradient(rgba(5,8,20,.45),transparent 22%,transparent 72%,rgba(5,8,20,.55))}
.rd-fx{position:absolute;inset:0;pointer-events:none;overflow:hidden;opacity:0;transition:opacity .6s;container-type:size}.rd-fx.on{opacity:1}
.rd-fx i{position:absolute;top:-24px;display:block}
.rd-fx.rain i{width:1.5px;height:16px;background:linear-gradient(transparent,rgba(147,197,253,.75));animation:rdfall linear infinite}@keyframes rdfall{to{transform:translateY(112cqh)}}
.rd-fx.snow i{width:5px;height:5px;border-radius:50%;background:#fff;opacity:.85;animation:rdsnow linear infinite}@keyframes rdsnow{0%{transform:translate(0,0)}50%{transform:translate(14px,56cqh)}100%{transform:translate(-6px,112cqh)}}
.rd-top{position:absolute;left:10px;right:10px;top:10px;display:flex;justify-content:space-between;gap:10px;pointer-events:none}
.rdm.full .rd-say{font-size:26px}.rdm.full .rd-top{top:calc(10px + env(safe-area-inset-top,0px));left:62px;right:12px}
.rd-top button{pointer-events:auto}
.rd-l{display:flex;flex-direction:column;gap:6px;align-items:flex-start;min-width:0;flex:0 0 auto;max-width:62%}.rd-r{display:flex;flex-direction:column;gap:6px;align-items:flex-end;text-align:right;min-width:0;flex:1 1 0}
.rd-k{font-size:10.5px;font-weight:700;letter-spacing:.16em;color:#cbd5e1;text-shadow:0 1px 6px rgba(0,0,0,.6)}.rdm:not(.full) .rd-k{display:none}
.rd-live{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#e2e8f0;padding:4px 10px;border-radius:999px;background:rgba(8,12,28,.66);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.rd-live i{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:rdblink 1.6s infinite}.rd-live.st i{background:#f59e0b;box-shadow:0 0 8px #f59e0b;animation:none}@keyframes rdblink{50%{opacity:.35}}
.rd-say{font-weight:800;font-size:22px;line-height:1.1;letter-spacing:-.01em;max-width:100%;text-wrap:balance;text-shadow:0 2px 14px rgba(0,0,0,.75)}
.rd-say.t-dry{color:#7dd3fc}.rd-say.t-soon{color:#fcd34d}.rd-say.t-now{color:#60a5fa}
.rd-sub{font-size:12px;color:#e2e8f0;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.rd-leg{display:flex;align-items:center;gap:6px;font-size:9.5px;color:#cbd5e1;text-shadow:0 1px 4px rgba(0,0,0,.7)}.rd-leg i{width:72px;height:6px;border-radius:3px;background:linear-gradient(90deg,#60a5fa,#22c55e,#facc15,#ef4444,#d946ef)}
.rd-type:empty{display:none}.rd-type span{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;padding:4px 10px;border-radius:999px;background:rgba(8,12,28,.7);border:1px solid rgba(255,255,255,.12)}
.rd-warns{display:flex;flex-direction:column;gap:6px;align-items:flex-start;max-width:100%}.rd-warns:empty{display:none}
.rd-w{display:inline-flex;align-items:center;gap:6px;border:1.5px solid transparent;border-radius:18px;padding:5px 11px;font:inherit;font-size:12px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.35);cursor:pointer;max-width:100%;text-align:left}.rd-w span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rd-w.more{background:rgba(10,16,32,.78);color:#e2e8f0;border-color:rgba(255,255,255,.18)}
.rd-w.l1{background:#fde047;color:#3b2f00}.rd-w.l2{background:#fb923c;color:#3a1a00}.rd-w.l3{background:#ef4444;color:#fff}.rd-w.l4{background:#a21caf;color:#fff}
.rd-w.pre{background:rgba(8,12,28,.75);border-style:dashed}.rd-w.pre.l1{color:#fde047;border-color:#fde047}.rd-w.pre.l2{color:#fb923c;border-color:#fb923c}.rd-w.pre.l3{color:#f87171;border-color:#f87171}.rd-w.pre.l4{color:#e879f9;border-color:#e879f9}
.rd-w.rdp{animation:rdwp 1.8s infinite}@keyframes rdwp{0%{box-shadow:0 0 0 0 rgba(239,68,68,.65)}70%{box-shadow:0 0 0 10px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}
.rd-ctl{position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:8px}
.rd-cb{width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(8,12,28,.72);color:#fff;display:grid;place-items:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);cursor:pointer;padding:0}.rd-cb:hover{background:rgba(30,41,80,.85)}
.rdm:not(.full) .rd-cb.z,.rdm:not(.full) .rd-cb.rdx,.rdm.full .rd-cb.ex{display:none}
.rdm.full .rd-cb.rdx{position:absolute;left:12px;top:calc(10px + env(safe-area-inset-top,0px));z-index:6;width:48px;height:48px;pointer-events:auto;filter:none;animation:none}
.rd-pills{position:absolute;left:10px;right:10px;bottom:76px;display:flex;flex-wrap:wrap;gap:6px 8px;align-items:flex-end;justify-content:space-between;pointer-events:none}.rdm.full .rd-pills{bottom:calc(80px + env(safe-area-inset-bottom,0px))}.rd-bp{margin-left:auto}
.rd-wc,.rd-bc{display:flex;align-items:center;gap:10px;padding:6px 12px 6px 8px;border-radius:16px;background:rgba(10,16,32,.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);font-size:12px}
.rd-wc b{font-size:15px;color:var(--wc)}.rd-wc small{font-size:11px;font-weight:500;color:#cbd5e1}.rd-wc s{display:block;text-decoration:none;color:#cbd5e1;font-size:11px;margin-top:1px}
.rd-cp{position:relative;width:36px;height:36px;border-radius:50%;border:1.5px solid var(--wc);display:grid;place-items:center;color:var(--wc);flex:none}.rd-cp svg{width:20px;height:20px;transition:transform .6s}.rd-cp em{position:absolute;top:-1px;font-style:normal;font-size:7px;font-weight:700;color:#cbd5e1;transform:translateY(-50%);background:rgba(8,12,28,.9);padding:0 2px}
.rd-bc{padding:7px 12px;font-weight:600;color:#fde047;border-color:rgba(250,204,21,.4)}.rd-bc b{font-size:14px}.rd-bc.soft{color:#fcd34d;font-weight:500;border-style:dashed}.rd-bc .i{fill:currentColor}
.rd-tl{position:absolute;left:10px;right:10px;bottom:20px;height:48px;display:flex;align-items:center;gap:10px;padding:0 14px 0 6px;border-radius:18px;background:rgba(8,12,28,.74);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1)}.rdm.full .rd-tl{bottom:calc(22px + env(safe-area-inset-bottom,0px));left:12px;right:12px}
.rd-play{width:36px;height:36px;border-radius:50%;border:1.5px solid var(--acc,#5eead4);background:rgba(94,234,212,.14);color:var(--acc,#5eead4);display:grid;place-items:center;cursor:pointer;flex:none;padding:0}
.rd-dw{position:relative;flex:1;min-width:0;height:100%}.rd-dots{display:flex;gap:2px;align-items:center;height:30px;padding-top:2px;touch-action:none;cursor:pointer}
.rd-dots i{flex:1;min-width:2px;height:8px;border-radius:3px;background:rgba(148,163,184,.45);transition:height .12s,background .12s}.rd-dots i.f{background:rgba(167,139,250,.5)}.rd-dots i.on{height:14px;background:var(--acc,#5eead4);box-shadow:0 0 10px var(--acc,#5eead4)}.rd-dots i.na{opacity:.25}
.rd-lb{position:absolute;left:0;right:0;bottom:3px;height:11px;font-size:9.5px;color:#94a3b8;pointer-events:none}.rd-lb span{position:absolute;transform:translateX(-50%);white-space:nowrap}
.rd-clk{display:flex;flex-direction:column;align-items:flex-end;line-height:1.05;flex:none}.rd-clk b{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums}.rd-clk span{font-size:9.5px;letter-spacing:.12em;color:#94a3b8;margin-top:2px}.rd-clk.fc span{color:#fcd34d}
.rd-att{position:absolute;left:10px;right:10px;bottom:4px;font-size:8px;color:rgba(203,213,225,.7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}.rdm.full .rd-att{bottom:calc(6px + env(safe-area-inset-bottom,0px))}
.rd-err{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:8px 14px;border-radius:12px;background:rgba(8,12,28,.85);font-size:12px;color:#fca5a5}
.ico.wl.l1{background:#fde047;color:#3b2f00}.ico.wl.l2{background:#fb923c;color:#3a1a00}.ico.wl.l3{background:#ef4444;color:#fff}.ico.wl.l4{background:#a21caf;color:#fff}
.wbox{display:flex;flex-direction:column;gap:12px;border-radius:22px;padding:16px;border:1.5px solid var(--line);background:rgba(var(--wh),.05)}.wbox.l1{border-color:#fde047}.wbox.l2{border-color:#fb923c}.wbox.l3{border-color:#ef4444}.wbox.l4{border-color:#c026d3}.wbox.pre{border-style:dashed}
.wbox h3{margin:0;font-size:16px}.wt{display:flex;justify-content:space-between;gap:10px;font-size:12px;color:var(--tx2);font-variant-numeric:tabular-nums}
.wd{margin:0;white-space:pre-line;font-size:14px;line-height:1.55;color:var(--tx)}.wi{border-radius:16px;padding:12px 14px;background:rgba(var(--wh),.06)}.wi b{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--tx2);margin-bottom:4px}.wi p{margin:0;white-space:pre-line;font-size:14px;line-height:1.55}.wbox small{color:var(--tx3);font-size:11px}
.wo{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
@media (max-width:640px){.rd-say{font-size:19px}.rdm.full .rd-say{font-size:22px}}
.nb.lk.on{color:var(--acc,#5eead4)}
.pinw{display:flex;flex-direction:column;align-items:center;gap:22px;padding:8px 0 4px}
.pdots{display:flex;gap:16px;height:18px}.pdots i{width:14px;height:14px;border-radius:50%;border:2px solid rgba(var(--wh),.45);transition:background .12s,transform .12s}.pdots i.on{background:var(--acc,#5eead4);border-color:var(--acc,#5eead4);transform:scale(1.1)}
.pdots.bad i{border-color:#f87171;animation:pkshake .45s}@keyframes pkshake{20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
.pad{display:grid;grid-template-columns:repeat(3,76px);gap:12px}
.pk{height:64px;border-radius:22px;border:1px solid var(--line);background:rgba(var(--wh),.07);color:var(--tx);font:inherit;font-size:24px;font-weight:600;display:grid;place-items:center;cursor:pointer;padding:0}.pk:active{background:rgba(var(--wh),.18);transform:scale(.96)}.pk.del{font-size:0;color:var(--tx2)}
.fseg{margin:0 0 12px;width:100%}.fseg button{flex:1;justify-content:center}
.fl{display:flex;flex-direction:column;gap:8px}.fr{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:18px;background:rgba(var(--wh),.05);border:1px solid var(--line)}
.fr .rk{flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:700;background:rgba(var(--wh),.09);color:var(--tx2)}
.fr .tx{flex:1;min-width:0}.fr .n{font-size:15px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fr .s{font-size:12.5px;color:var(--tx2);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fr .pr{flex:none;text-align:right;display:flex;flex-direction:column;align-items:flex-end}.fr .pr b{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}.fr .pr b small{font-size:12px;font-weight:500;color:var(--tx2)}.fr .pr sup{font-size:.6em;margin-left:1px;vertical-align:.45em;line-height:0}.fr .pr span{font-size:11.5px;color:var(--tx2);font-variant-numeric:tabular-nums}
.fr.bst{border-color:rgba(94,234,212,.5);background:rgba(94,234,212,.1)}.fr.bst .rk{background:#5eead4;color:#06201c}.fr.bst .pr span{color:#5eead4;font-weight:600}.fr.cl{opacity:.5}
.pwat{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:20px;background:rgba(var(--wh),.05);border:1px solid var(--line);margin-bottom:6px}.pwat .bub{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;flex:none;background:rgba(96,165,250,.18);color:#60a5fa}.pwat.due{border-color:rgba(251,191,36,.5)}.pwat.due .bub{background:rgba(251,191,36,.2);color:#fbbf24}.pwat .tx{flex:1;min-width:0}.pwat .n{font-weight:600;font-size:15px}.pwat .s{font-size:12.5px;color:var(--tx2);margin-top:2px}
.pgb{flex:none;display:inline-flex;align-items:center;gap:6px;height:40px;padding:0 16px;border-radius:14px;border:0;background:#5eead4;color:#06201c;font:inherit;font-weight:700;font-size:14px;cursor:pointer}.pgb:active{transform:scale(.96)}
.pll{display:flex;flex-direction:column;gap:8px;align-items:stretch}.plc{display:flex;align-items:center;gap:13px;padding:13px 14px;border-radius:20px;background:linear-gradient(135deg,rgba(var(--c),.13),rgba(var(--wh),.035));border:1px solid rgba(var(--c),.3);min-width:0;cursor:pointer}.plc.dry{border-color:rgba(var(--c),.6)}
.plc .bub{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;flex:none;background:rgba(var(--c),.2);color:rgb(var(--c))}.plc .tx{flex:1;min-width:0}.plc .n{font-size:15.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.plc .pm{display:flex;align-items:center;gap:10px;margin-top:7px}.plc .pm .pc2{flex:1;width:auto;height:8px}.plc .pm b{font-size:14px;font-variant-numeric:tabular-nums;min-width:42px;text-align:right}
.pchs{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.pch{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--tx2);padding:3px 9px;border-radius:99px;background:rgba(var(--wh),.07);font-variant-numeric:tabular-nums}.pch.w{color:#fbbf24}
.plc .bd{flex:none;min-width:58px;text-align:center;align-self:flex-start;font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:99px;background:rgba(251,191,36,.2);color:#fbbf24}.plc .bd.ok{background:rgba(52,211,153,.16);color:#34d399}
.xr.tapx{cursor:pointer}
.spool.act{border-color:rgba(94,234,212,.7);box-shadow:0 0 0 1px rgba(94,234,212,.35) inset}
.htap{cursor:pointer;-webkit-tap-highlight-color:transparent}.htap:active{opacity:.7}.hmore{display:inline-flex;align-items:center;gap:3px;margin-left:10px;padding:2px 9px;border-radius:99px;background:rgba(251,146,60,.16);color:#fb923c;font-size:11.5px;font-weight:600}
.hhero{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:center;padding:14px;border-radius:24px;background:rgba(var(--wh),.05);border:1px solid var(--line);margin-bottom:12px}.hhero.heat{border-color:rgba(251,146,60,.5);box-shadow:0 0 30px -10px rgba(251,146,60,.5)}
.hdial{position:relative;max-width:230px;width:100%;margin:0 auto}.hdial svg{display:block;width:100%;overflow:visible}.hdial .mid{position:absolute;left:0;right:0;top:28%;text-align:center}.hdial .mid .l{font-size:11.5px;color:var(--tx2);letter-spacing:.08em;text-transform:uppercase}.hdial .mid .big{font-size:46px}.hdial .mid .tg{font-size:13px;color:var(--tx2);margin-top:2px}.hdial .mid .hhum{display:flex;justify-content:center;align-items:center;gap:4px;font-size:12px;color:#38bdf8;margin-top:4px;font-variant-numeric:tabular-nums}.hdial .mid .hhum svg{flex:none;width:12px;height:12px}
.hside{display:flex;flex-direction:column;gap:14px;min-width:0}.hctl{display:flex;align-items:center;justify-content:space-between;gap:10px}.hset{text-align:center}.hset b{display:block;font-size:34px;font-weight:300;font-variant-numeric:tabular-nums}.hset span{font-size:11.5px;color:var(--tx2)}.hctl .rbn:disabled{opacity:.35}
.hseg{width:100%}.hseg button{flex:1;justify-content:center}
.hq{display:grid;grid-template-columns:repeat(auto-fit,minmax(44px,1fr));gap:6px}.hq button,.hpre button{border:1px solid var(--line);background:rgba(var(--wh),.06);color:var(--tx);font:inherit;border-radius:14px;cursor:pointer;transition:.2s}.hq button{height:44px;padding:0;font-size:15px;font-weight:600;font-variant-numeric:tabular-nums}
.hq button.on,.hpre button.on{background:rgba(251,146,60,.2);border-color:rgba(251,146,60,.6);color:#fb923c}.hq button:active,.hpre button:active{transform:scale(.95)}
.hpre{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.hpre button{display:flex;flex-direction:column;align-items:center;gap:2px;padding:9px 6px}.hpre b{font-size:13.5px;font-weight:600}.hpre span{font-size:12px;color:var(--tx2);font-variant-numeric:tabular-nums}.hpre button.on span{color:#fb923c}
.trend{padding:14px 14px 12px}.trend.tb{padding:0}.trow{display:flex;align-items:stretch;gap:10px}.tmid{flex:1;min-width:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.tsvg{display:block;width:100%;height:120px;overflow:visible}
.tcol{flex:none;width:58px;display:flex;flex-direction:column;justify-content:space-between;font-size:13px;font-weight:600;font-variant-numeric:tabular-nums;padding:2px 0}.tcol span{display:inline-flex;align-items:center;gap:3px;white-space:nowrap}.tcol.r{text-align:right;align-items:flex-end}.tcol:not(.r) span:nth-child(2){padding-left:17px}.tcol.r span:nth-child(2){padding-right:0}
.tax{display:flex;justify-content:space-between;font-size:11.5px;color:var(--tx3);padding:6px 68px 0;font-variant-numeric:tabular-nums}.tavg{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 22px;margin-top:10px;font-size:13px;font-weight:600}.tavg span{display:inline-flex;align-items:center;gap:5px}
.sl{display:flex;flex-direction:column;gap:10px}.sch{padding:12px 14px 12px;border-radius:20px;background:rgba(var(--wh),.05);border:1px solid var(--line)}.sch.on{border-color:rgba(251,146,60,.55);background:linear-gradient(135deg,rgba(251,146,60,.12),rgba(var(--wh),.035))}
.sht{display:flex;align-items:center;gap:12px;cursor:pointer}.sht .ico{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;flex:none;background:rgba(var(--wh),.08);color:var(--tx2)}.sch.on .ico{background:rgba(251,146,60,.2);color:#fb923c}.sht .tx{flex:1;min-width:0}.sht .n{font-size:15px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sht .s{font-size:12.5px;color:var(--tx2);margin-top:2px}
.sht .bd{flex:none;font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:99px;background:rgba(251,146,60,.2);color:#fb923c}.sht .bd.off{background:rgba(var(--wh),.08);color:var(--tx2)}
.swk{margin-top:12px;display:flex;flex-direction:column;gap:4px}.swr,.swa{display:grid;grid-template-columns:22px 1fr;gap:8px;align-items:center}.swr>span{font-size:11px;color:var(--tx3)}.swr.td>span{color:var(--tx);font-weight:700}
.swt{position:relative;height:9px;border-radius:5px;background:rgba(var(--wh),.07);overflow:hidden}.swt i{position:absolute;top:0;bottom:0;border-radius:4px;background:#fb923c;opacity:.85}.swr.td .swt{background:rgba(var(--wh),.11)}.swt b{position:absolute;top:-1px;bottom:-1px;width:2px;background:#fff;border-radius:1px;box-shadow:0 0 6px rgba(255,255,255,.8)}
.swa>div{display:flex;justify-content:space-between;font-size:10px;color:var(--tx3);font-style:normal}.swa em{font-style:normal;width:0;display:flex;justify-content:center;overflow:visible}.swa em:first-child{justify-content:flex-start}.swa em:last-child{justify-content:flex-end}
.dg.dg3{grid-template-columns:repeat(3,minmax(0,1fr))}.dg3 .dt{padding:12px 10px;grid-column:auto!important}.dg3 .dt .v{font-size:21px}.hbtns{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
@media (max-width:560px){.hhero{grid-template-columns:1fr}}
@media (min-width:900px){.fl{gap:6px}.fr{padding:7px 14px}.fseg{margin-bottom:6px}}
@media (prefers-reduced-motion:reduce){.rd-fx i,.rd-home,.rd-w.rdp,.rd-s.n{animation:none}}
.rb .hw{color:#fbbf24}.rb .hw2{color:#fb7185}.rb .stl,.stl{color:#fbbf24;display:inline-flex;align-items:center;gap:4px}.rm.stale .rw,.rm.stale .rv{opacity:.45}.rm.stale .rb .stl{opacity:1}
.hwarn{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:12px 14px;margin:0 0 14px;border-radius:18px;border:1px solid rgba(251,191,36,.45);background:rgba(251,191,36,.12);color:#fde68a;cursor:pointer}.hwarn.l2{border-color:rgba(251,113,133,.5);background:rgba(251,113,133,.13);color:#fecdd3}.hwarn svg{flex:none}.hwarn div{display:flex;flex-direction:column;gap:2px;min-width:0}.hwarn b{font-size:14px;font-weight:600}.hwarn span{font-size:12.5px;opacity:.85}
.card-note.stn{display:flex;align-items:center;gap:6px;color:#fbbf24}.chip.stc{color:#fbbf24;border-color:rgba(251,191,36,.45)}
.camstale:empty{display:none}.camstale{position:absolute;left:12px;bottom:12px;display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:12px;font-size:12px;font-weight:600;background:rgba(0,0,0,.6);color:#fbbf24}
.al{position:relative;overflow:hidden}.alb{position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(var(--wh),.12)}.alb u{display:block;height:100%;background:currentColor;opacity:.75;text-decoration:none;border-radius:0 3px 3px 0;transition:width .6s}
.fr .pr b .ft{display:inline-flex;align-items:center;font-style:normal;font-size:11.5px;font-weight:600;margin-right:8px;vertical-align:2px}.fr .pr b .ft svg{width:12px;height:12px}.fr .ft.up{color:#fb7185}.fr .ft.dn{color:#34d399}.fr.go{cursor:pointer}.fr .mp{flex:none;color:var(--tx3);display:grid;place-items:center}
.xr.kid{position:relative}.kdot{margin-left:auto;flex:none;width:10px;height:10px;border-radius:50%;background:#94a3b8}.kdot.ok{background:#34d399;box-shadow:0 0 10px rgba(52,211,153,.7)}.kdot.lk{background:#fb7185;box-shadow:0 0 10px rgba(251,113,133,.6)}.kdot.off{background:#f59e0b}
.kgrid{display:grid;gap:10px;margin:10px 0 4px}.kgrid.k1{grid-template-columns:1fr}.kgrid.k3{grid-template-columns:repeat(3,minmax(0,1fr))}.kgrid.k2{grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}.kgrid:empty{display:none}
.kb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:74px;padding:12px 10px;border-radius:20px;border:1px solid var(--line);background:rgba(var(--wh),.07);color:var(--tx);font:inherit;text-align:center;cursor:pointer;transition:.2s}
.kb b{font-size:15px;font-weight:650}.kb small{font-size:11.5px;color:var(--tx3);font-weight:500}.kb:active{transform:scale(.97)}.kb[disabled]{opacity:.45;pointer-events:none}
.kgrid.k1 .kb{flex-direction:row;gap:12px;min-height:64px;justify-content:center}.kgrid.k1 .kb small{display:none}
.ksc{display:flex;align-items:center;gap:12px;margin:8px 0 2px;padding:12px 14px;border-radius:18px;border:1px solid var(--line);background:rgba(var(--wh),.06)}.ksc b{display:block;font-size:15px;font-weight:650}.ksc span{display:block;font-size:12.5px;color:var(--tx3);margin-top:1px}.ksi{width:40px;height:40px;border-radius:14px;display:grid;place-items:center;flex:none;background:rgba(var(--wh),.08)}.ksc.live .ksi{background:rgba(52,211,153,.18);color:#6ee7b7}.ksc.hot .ksi{background:rgba(251,113,133,.18);color:#fda4af}.ksc.warn .ksi{background:rgba(251,191,36,.18);color:#fbbf24}.app.light .ksc.live .ksi{color:#047857}.app.light .ksc.hot .ksi{color:#be123c}.app.light .ksc.warn .ksi{color:#b45309}
.calc .h .r{display:inline-flex;align-items:center;gap:2px}.ccd{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--tx3);margin:10px 0 2px;display:flex;gap:8px;align-items:baseline}.ccd:first-of-type{margin-top:2px}.ccd b{color:var(--tx);letter-spacing:0;text-transform:none;font-size:13.5px;font-weight:650}
.cc2{display:flex;align-items:center;gap:10px;padding:7px 2px;min-width:0}.cc2 i{width:8px;height:8px;border-radius:50%;background:var(--ec,#818cf8);flex:none;box-shadow:0 0 8px var(--ec,#818cf8)}.cc2 .t{flex:1;min-width:0;font-size:14px;font-weight:550;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cc2 .w{font-size:12.5px;color:var(--tx3);white-space:nowrap;font-variant-numeric:tabular-nums}.ccm{margin-top:4px;font-size:12px;color:var(--tx3)}
.cal2tabs{display:flex;gap:4px;padding:3px;border-radius:15px;background:rgba(var(--wh),.06);margin-bottom:12px}.cal2tabs button{flex:1;min-height:38px;display:flex;align-items:center;justify-content:center;gap:6px;border-radius:12px;border:0;background:none;color:var(--tx3);font:inherit;font-size:13.5px;font-weight:600}.cal2tabs button.on{background:rgba(var(--wh),.13);color:var(--tx)}
.cmh{display:flex;align-items:center;gap:8px;margin-bottom:8px}.cmh b{flex:1;font-size:17px;font-weight:650;text-transform:capitalize}.cmh button{min-width:42px;min-height:42px;border-radius:13px;border:1px solid var(--line);background:rgba(var(--wh),.05);color:var(--tx);font:inherit;display:grid;place-items:center}.cmh button[disabled]{opacity:.3;pointer-events:none}.cmh .cmt{font-size:12.5px;padding:0 14px;font-weight:600}
.cmg{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}.cmw{font-size:10.5px;letter-spacing:.1em;color:var(--tx3);text-align:center;padding:4px 0;text-transform:uppercase}
.cmd{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:4px;min-height:54px;padding:7px 2px 5px;border-radius:14px;border:1px solid transparent;background:rgba(var(--wh),.04);color:var(--tx);font:inherit;font-size:14.5px;font-weight:550;font-variant-numeric:tabular-nums}.cmd .dots{display:flex;gap:3px;min-height:6px}.cmd .dots i{width:6px;height:6px;border-radius:50%;background:var(--ec)}.cmd.out{opacity:.35}.cmd.today{border-color:rgba(var(--wh),.4)}.cmd.today .n{color:var(--acc)}.cmd.sel{background:rgba(var(--wh),.17);border-color:rgba(var(--wh),.32)}
.cmsel{margin:16px 2px 8px;font-size:13px;color:var(--tx3)}.cmsel b{color:var(--tx);font-size:15px;font-weight:650}
.dg.tvdg{grid-template-columns:repeat(2,minmax(0,1fr))}@media (min-width:560px){.dg.tvdg{grid-template-columns:repeat(4,minmax(0,1fr))}}
.kb.danger{background:rgba(251,113,133,.16);border-color:rgba(251,113,133,.4);color:#fda4af}.kb.good{background:rgba(52,211,153,.16);border-color:rgba(52,211,153,.4);color:#6ee7b7}
.app.light .kb.danger{color:#be123c}.app.light .kb.good{color:#047857}
.dg.kdg{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px}.dg.kdg .dt{min-width:0;grid-column:auto!important;padding:12px 12px}.dg.kdg .dt .v{font-size:19px;overflow-wrap:anywhere}.dg.kdg .dt.kfull{grid-column:1/-1!important}
.ban{display:flex;align-items:stretch;margin:0 0 12px;border-radius:18px;border:1px solid var(--line);overflow:hidden;animation:banin .4s ease both}
.ban .bmain{flex:1;min-width:0;display:flex;align-items:center;gap:12px;padding:12px 14px;text-align:left;color:inherit}.ban .bni{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:13px;background:rgba(255,255,255,.12)}
.ban .bnt{min-width:0;display:flex;flex-direction:column;gap:2px}.ban .bnt b{font-size:15px;font-weight:600}.ban .bnt small{font-size:12.5px;opacity:.85;overflow-wrap:anywhere}.ban em{margin-left:auto;flex:none;font-style:normal;font-size:12px;font-weight:600;padding:3px 9px;border-radius:999px;background:rgba(255,255,255,.14)}
.ban .bnx{flex:none;width:46px;display:grid;place-items:center;color:inherit;opacity:.7;border-left:1px solid rgba(255,255,255,.12)}
.ban.warn{background:rgba(251,191,36,.18);border-color:rgba(251,191,36,.5);color:#fde68a}.ban.bad{background:rgba(251,113,133,.2);border-color:rgba(251,113,133,.55);color:#fecdd3}.ban.bad .bni{animation:banp 1.8s ease-in-out infinite}
.app.light .ban.warn{color:#92400e;background:rgba(251,191,36,.26)}.app.light .ban.bad{color:#9f1239;background:rgba(251,113,133,.22)}
@keyframes banin{from{opacity:0;transform:translateY(-8px)}}@keyframes banp{50%{box-shadow:0 0 0 7px rgba(251,113,133,.0),0 0 18px rgba(251,113,133,.55)}}
.al.crit{box-shadow:0 0 0 1px rgba(251,191,36,.25),0 0 14px rgba(251,191,36,.18)}.al.bad.crit{box-shadow:0 0 0 1px rgba(251,113,133,.3),0 0 14px rgba(251,113,133,.25)}
.qp.on{background:rgba(94,234,212,.2);border-color:rgba(94,234,212,.5)}.qp.qe{padding:10px 12px;opacity:.75;border-style:dashed}.qp.qe:first-child{background:rgba(var(--wh),.07)}
.qfl{display:flex;gap:6px;flex-wrap:wrap;margin:2px 0 10px}.qfc{padding:7px 13px;border-radius:999px;font-size:12.5px;font-weight:500;background:rgba(var(--wh),.07);border:1px solid var(--line);color:var(--tx)}.qfc.on{background:rgba(94,234,212,.2);border-color:rgba(94,234,212,.5)}
.pzc .pzbar,.pzbar{height:4px;border-radius:4px;background:rgba(var(--wh),.1);overflow:hidden;margin:0 0 6px}.pzbar i{display:block;height:100%;border-radius:4px;background:#34d399}
.pzr{display:flex;align-items:center;gap:11px;padding:8px 0;border-top:1px solid var(--line);position:relative;touch-action:pan-y}.pzr:first-of-type{border-top:0}
.pzr>div:nth-child(2){flex:1;min-width:0}.pzr .t{font-size:14px;font-weight:600;line-height:1.25}.pzr .s{font-size:12px;color:var(--tx3);line-height:1.3;margin-top:1px}
.pzr .ico,.pzfresh .ico{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;flex:none;background:rgba(var(--wh),.07)}
.pzr.o .ico{color:#fda4af;background:rgba(251,113,133,.16)}.pzr.d .ico{color:#fcd34d;background:rgba(251,191,36,.16)}.pzfresh .ico.ok{color:#6ee7b7;background:rgba(52,211,153,.18)}
.pzb2{flex:none;width:40px;height:40px;border-radius:50%;border:1px solid rgba(52,211,153,.4);background:rgba(52,211,153,.14);color:#34d399;display:grid;place-items:center;cursor:pointer}
.pzr.swp{background-image:linear-gradient(90deg,rgba(52,211,153,calc(var(--sw,0)*.4)),transparent 70%);transition:none}.pzr:not(.swp){transition:transform .2s}
.pzmore{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;margin-top:6px;padding:9px 0 3px;border:0;border-top:1px solid var(--line);background:none;color:var(--tx2);font:inherit;font-size:12.5px;font-weight:500;cursor:pointer}
.pzfresh{display:flex;align-items:center;gap:12px;text-align:left;width:100%;color:inherit;font:inherit;padding:14px 16px}.pzfresh>div:nth-child(2){flex:1;min-width:0}.pzfresh .t{font-size:14.5px;font-weight:600}.pzfresh .s{font-size:12.5px;color:var(--tx3);margin-top:2px}.pzfresh .pzv,.pzmore .pzv{display:grid;place-items:center;color:var(--tx3)}
.app.light .pzr.o .ico{color:#be123c}.app.light .pzr.d .ico{color:#b45309}.app.light .pzb2{color:#047857}
.pzpage{max-width:1100px}.pzg{display:block}.app.wide .pzpage .pzl{column-width:430px;column-gap:20px}.app.wide .pzpage .pzg{break-inside:avoid}
.app.wide .cock .pzc{padding-top:10px;padding-bottom:6px}.app.wide .cock .pzc .pzbar{margin:0 0 2px}.app.wide .cock .pzc .h{margin-bottom:4px}.app.wide .cock .pzc .pzr{padding:4px 0}.app.wide .cock .pzc .pzr .ico{width:32px;height:32px}.app.wide .cock .pzc .pzb2{width:36px;height:36px}.app.wide .cock .pzc .pzmore{margin-top:3px;padding:7px 0 2px}.app.wide .pzpage .pzh{break-after:avoid}
.toast.tap.show{pointer-events:auto;cursor:pointer;border-color:rgba(52,211,153,.5)}
.pzq{display:block;width:100%;box-sizing:border-box;margin:0 0 4px;padding:11px 14px;border-radius:14px;border:1px solid var(--line);background:rgba(var(--wh),.05);color:var(--tx);font:inherit;font-size:14px;outline:none}.pzq:focus{border-color:rgba(56,189,248,.55)}.pzq::placeholder{color:var(--tx3)}
.pzh{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;background:none;border:0;color:inherit;font:inherit;text-align:left;padding:6px 4px;margin:16px 0 6px;cursor:pointer;min-height:36px}
.pzh .pzn{font-size:11px;font-weight:600;letter-spacing:.16em;color:var(--tx3);min-width:0}.pzh .pzs{font-size:11px;font-weight:600;color:#fbbf24;white-space:nowrap}
.pzh .pzp{flex:1;min-width:24px;max-width:110px;height:4px;border-radius:4px;background:rgba(var(--wh),.1);overflow:hidden;margin-left:auto}.pzh .pzp i{display:block;height:100%;border-radius:4px;background:#34d399}
.pzh .pzc{font-size:11px;color:var(--tx3);font-variant-numeric:tabular-nums;margin-left:auto}.pzh .pzp+.pzc{margin-left:0}
.pzh .pzv{display:grid;place-items:center;color:var(--tx3);transition:transform .2s;transform:rotate(90deg)}.pzh.c .pzv{transform:rotate(0)}
.vr.pz[data-sw]{touch-action:pan-y;position:relative}.vr.pz.swp{background-image:linear-gradient(90deg,rgba(52,211,153,calc(var(--sw,0)*.4)),transparent 70%);transition:none}.vr.pz:not(.swp){transition:transform .2s}
.pzgo{margin-top:12px;width:100%;min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:16px;background:rgba(56,189,248,.18);border:1px solid rgba(56,189,248,.45);color:#7dd3fc;font-weight:600;font-size:14px}.app.light .pzgo{color:#0369a1}
.pzcf{margin-top:12px;padding:14px 16px;border-radius:20px;border:1px solid rgba(56,189,248,.35);background:rgba(56,189,248,.08)}.pzct{font-weight:600;font-size:15px}.pzcs{font-size:12.5px;color:var(--tx2);margin-top:5px;line-height:1.4}
.pzcb{display:flex;gap:8px;margin-top:12px}.pzcb .vbt{flex:1;min-height:44px;margin:0;display:inline-flex;align-items:center;justify-content:center}.pzcb .pzgo{margin-top:0}
.vr.pz .ico{background:rgba(var(--wh),.07)}.vr.pz.o .ico{color:#fda4af;background:rgba(251,113,133,.16)}.vr.pz.d .ico{color:#fcd34d;background:rgba(251,191,36,.16)}.vr.pz.k .ico{color:#6ee7b7;background:rgba(52,211,153,.14)}
.vr.pz.o{border-color:rgba(251,113,133,.3)}.vr.pz .vbt{flex:none;white-space:nowrap}.vr.pz .pzb{background:rgba(52,211,153,.16);border-color:rgba(52,211,153,.4);color:#6ee7b7}
.app.light .vr.pz.o .ico{color:#be123c}.app.light .vr.pz.d .ico{color:#b45309}.app.light .vr.pz.k .ico{color:#047857}.app.light .vr.pz .pzb{color:#047857}
.vr.pz{padding:11px 12px;gap:11px;margin-bottom:7px}.vr.pz .t{white-space:normal;overflow:visible;text-overflow:clip;line-height:1.25}.vr.pz .s{line-height:1.3}
.vr.pz .vbt{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:42px}.vr.pz .pzb{padding:0 14px}.vr.pz .pzu{padding:0 12px;color:var(--tx2)}
@media (max-width:860px){.vr.pz .pzb{width:44px;height:44px;min-height:0;padding:0;border-radius:50%}.vr.pz .pzb span{display:none}.vr.pz .pzb svg{width:20px;height:20px}.vr.pz .pzu{padding:0 12px;font-size:12px}}
.pzstb{display:inline-flex;align-items:center;gap:6px;margin-left:auto}.pzstb svg{opacity:.8}
.pzsb{display:flex;align-items:flex-end;gap:8px;height:128px;margin:10px 0 2px;padding:0 2px}.pzsb .c1{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:4px}.pzsb .c1 i{display:block;width:100%;max-width:40px;border-radius:9px 9px 4px 4px;background:rgba(var(--wh),.16)}.pzsb .c1.t i{background:#34d399}.pzsb .c1 b{font-size:12px;font-weight:650;font-variant-numeric:tabular-nums;min-height:15px}.pzsb .c1 span{font-size:11px;color:var(--tx3)}.pzsb .c1.t span{color:var(--tx);font-weight:600}
.qfc.pzsc{cursor:default}.qfc.pzsc b{margin-left:4px;color:#34d399;font-variant-numeric:tabular-nums}
.pzsr{display:flex;align-items:center;gap:10px;padding:8px 4px;border-bottom:1px solid var(--line)}.pzsr:last-of-type{border-bottom:0}.pzsr .pzt{font-size:12.5px;color:var(--tx3);font-variant-numeric:tabular-nums;min-width:44px}.pzsr .ico{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;background:rgba(var(--wh),.07);flex:none}.pzsr .t{font-size:14px;font-weight:550;line-height:1.25}.pzsr .s{font-size:12px;color:var(--tx3)}.pzsr>div:last-child{min-width:0}.pzsn{font-size:12.5px;color:var(--tx3);padding:6px 4px}
.wxwrap{overflow-x:auto;margin:6px -2px 0;padding:0 2px 2px;scrollbar-width:none}.wxwrap::-webkit-scrollbar{display:none}
.wxc{position:relative;touch-action:pan-y;-webkit-user-select:none;user-select:none}.wxc svg.wxs{position:absolute;left:0;overflow:visible;display:block}
.wxs text{fill:var(--tx3);font-size:10.5px;font-variant-numeric:tabular-nums}.wxs text.mm{fill:#7dd3fc;opacity:.85}.wxs .gl{stroke:rgba(var(--wh),.09);stroke-width:1}.wxs .dl{stroke:rgba(var(--wh),.22);stroke-width:1}.wxs .wxn{fill:rgba(3,5,22,.42)}.wxs .wxr{fill:#38bdf8;opacity:.72}
.wxs .tp{fill:none;stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 2px 6px rgba(251,146,60,.35))}.wxs .wxp{fill:none;stroke:rgba(var(--wh),.55);stroke-width:1.5;stroke-dasharray:2 4;stroke-linecap:round}.wxs .wxcl{stroke:rgba(var(--wh),.7);stroke-width:1.2}.wxs .wxcd{fill:#fff;stroke:#fb7185;stroke-width:3}
.wxd{position:absolute;top:0;height:22px;display:flex;align-items:center;justify-content:center;gap:5px;font-size:12.5px;font-weight:650;white-space:nowrap;overflow:hidden;color:var(--tx)}.wxd small{font-size:10.5px;font-weight:500;color:var(--tx3)}
.wxi{position:absolute;top:22px;width:34px;margin-left:-17px;height:30px;display:grid;place-items:center;pointer-events:none}.wxi .wx *{animation:none!important}
.wxw{position:absolute;width:34px;margin-left:-17px;text-align:center;font-size:10px;line-height:1;color:var(--tx3);font-variant-numeric:tabular-nums;pointer-events:none}.wxw svg{display:block;margin:0 auto 3px}
.wxt{position:absolute;z-index:4;box-sizing:border-box;padding:10px 12px;border-radius:14px;background:rgba(10,15,40,.92);border:1px solid rgba(255,255,255,.16);color:#e9efff;box-shadow:0 10px 30px rgba(0,0,0,.4);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:flex;flex-wrap:wrap;gap:4px 8px;pointer-events:none;font-size:12px}
.wxtl{flex:1;min-width:0}.wxth{flex:0 0 100%;font-size:11.5px;color:#fff;margin-bottom:1px;white-space:nowrap}.wxth b{display:block}.wxtl>b{display:inline}.wxtr{display:flex;align-items:center;gap:6px;line-height:1.55}.wxtr b{margin-left:auto;font-weight:650;font-variant-numeric:tabular-nums}
.wxdt{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.75);flex:none}.wxdt.t{background:#fb7185}.wxdt.r{background:#38bdf8}
.wxti{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10.5px;color:#b8c4e6;text-align:center;max-width:66px}
.wxt.nar{padding:8px 10px;font-size:11px}.wxt.nar .wxti{display:none}.wxt.nar .wxtr{line-height:1.45}
.trdot{width:9px;height:9px;border-radius:50%;flex:none;background:#fff}.trdot.h{background:#fb7185}.trdot.l{background:#60a5fa}.trdot.r{background:#38bdf8}.trdot.r2{background:#7dd3fc}.trdot.s{background:#facc15}
.trlg{display:inline-block;width:16px;height:3px;border-radius:2px;vertical-align:middle;margin:0 5px 2px 0}.trlg.h{background:#fb7185}.trlg.l{background:#60a5fa;margin-left:8px}
.trw{position:relative;touch-action:pan-y;-webkit-user-select:none;user-select:none}.trw svg.wxs{position:absolute;left:0;overflow:visible;display:block}
.wxs .trb.h{fill:rgba(251,113,133,.2)}.wxs .trb.l{fill:rgba(96,165,250,.22)}.wxs .trl{fill:none;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}.wxs .trl.h{stroke:#fb7185}.wxs .trl.l{stroke:#60a5fa}
.wxs .trp rect{fill:rgba(10,15,40,.62)}.wxs .trp text{font-size:10.5px;font-weight:700;font-variant-numeric:tabular-nums}.wxs .trs{fill:#facc15}.wxs .trhit{fill:transparent;cursor:pointer}
.wxt .wxtr{white-space:nowrap}.wxdt.b{background:#60a5fa}.wxdt.s{background:#facc15}.wxtr small{font-weight:500;color:#9fb0d8}
.grs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:6px}.gr{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center}
.gr svg{width:100%;max-width:150px;height:auto;display:block}.gr .gv{position:absolute;left:0;right:0;top:0;aspect-ratio:1;max-width:150px;margin:0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:6px}
.gr .gv b{font-size:30px;font-weight:300;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1}.gr .gv small{font-size:12px;color:var(--tx2);margin-top:3px}
.gr .gl2{font-size:13px;font-weight:600;margin-top:2px}.gr .gs{font-size:11.5px;color:var(--tx2);margin-top:2px}
.hlr{display:flex;gap:18px;margin-top:10px;font-size:14px}.hlr span{display:inline-flex;align-items:center;gap:6px}.hlr b{font-weight:600;color:#fff}.hlr i{font-style:normal;font-size:12px;opacity:.7}
.bchs{display:flex;flex-wrap:wrap;gap:8px}.bch{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border-radius:12px;background:rgba(var(--wh),.06);font-size:13px}.bch i{width:8px;height:8px;border-radius:50%}.bch b{font-weight:600}
@media (max-width:860px){.grs{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:16px}.gr .gv b{font-size:26px}}
.ins{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-top:14px}.inc{display:grid;grid-template-columns:1fr auto;align-items:baseline;column-gap:8px;padding:8px 12px;border-radius:14px;background:rgba(var(--wh),.05);min-width:0}.inc .n{grid-column:1/-1;font-size:12px;color:var(--tx2);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-bottom:2px}.inc .n svg{display:none}.inc b{font-size:17px;font-weight:600;font-variant-numeric:tabular-nums}.inc .hm{font-size:12px;color:var(--tx2);text-align:right}
.r7h{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--tx2);margin:14px 0 6px}.r7{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;align-items:end}.r7>div{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;height:70px}.r7 b{font-size:10.5px;font-weight:600;color:#bae6fd;min-height:12px;font-variant-numeric:tabular-nums}.r7 i{width:100%;max-width:26px;border-radius:5px;background:linear-gradient(180deg,#38bdf8,#818cf8);display:block}.r7 span{font-size:10.5px;color:var(--tx2)}
.hb{margin-top:4px}.hbt{position:relative;height:10px;border-radius:6px;background:linear-gradient(90deg,#60a5fa 0%,#34d399 25%,#fde047 50%,#fb923c 75%,#fb7185 90%,#c084fc 100%);opacity:.9}.hbt i{position:absolute;top:-4px;width:6px;height:18px;margin-left:-3px;border-radius:3px;background:#fff;box-shadow:0 0 8px rgba(0,0,0,.5)}.hbl{display:flex;justify-content:space-between;font-size:10.5px;color:var(--tx2);margin-top:5px}
@media (max-width:860px){.heatg{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
`;
const CSS2 = `

/* Lüften */
.vsum{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px}
.vk{padding:16px 18px;border-radius:22px;background:rgba(var(--wh),.05);border:1px solid var(--line)}
.vk .big{font-size:40px}.vk .l{font-size:12px;color:var(--tx2);margin-top:6px}
.vk.hot{background:linear-gradient(150deg,rgba(56,189,248,.28),rgba(var(--wh),.04))}
.vc{position:relative;display:flex;gap:16px;align-items:flex-start;padding:16px;border-radius:26px;margin-bottom:12px;background:linear-gradient(150deg,rgba(var(--rc),.28),rgba(var(--wh),.04) 72%);border:1px solid rgba(var(--rc),.5);box-shadow:0 16px 36px -18px rgba(var(--rc),.7);transition:transform .25s}
.vc.tap{cursor:pointer}.vc.tap:hover{transform:translateY(-2px)}
.vm{position:relative;width:78px;height:78px;flex:none}.vm svg{position:absolute;inset:0;overflow:visible}
.vm .n{position:absolute;inset:0;display:grid;place-items:center;text-align:center;line-height:1}.vm .n b{font-size:26px;font-weight:300;display:block}.vm .n span{font-size:10px;color:var(--tx2)}
.vb{min-width:0;flex:1}.vb h3{font-size:17px;font-weight:600;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.vb p{font-size:13.5px;color:var(--tx);margin-top:4px}.vb p.why{color:var(--tx2);font-size:12.5px;margin-top:2px}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.tag{font-size:11.5px;padding:4px 10px;border-radius:999px;background:rgba(var(--wh),.08);color:var(--tx2);display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
.tag.ok{color:#6ee7b7;background:rgba(52,211,153,.15)}.tag.warn{color:#fcd34d;background:rgba(251,191,36,.16)}.tag.bad{color:#fda4af;background:rgba(251,113,133,.17)}.tag.live{color:#7dd3fc;background:rgba(56,189,248,.17)}
.tag.live::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;animation:pulse 1.4s ease-in-out infinite}
.vbs{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.vbt{padding:8px 12px;border-radius:14px;background:rgba(var(--wh),.09);border:1px solid rgba(var(--wh),.12);font-size:12px;color:var(--tx);transition:.2s}.vbt:hover{background:rgba(var(--wh),.17)}
.vbar{height:5px;border-radius:3px;background:rgba(var(--wh),.14);overflow:hidden;margin-top:10px}.vbar i{display:block;height:100%;border-radius:3px;background:rgb(var(--rc))}
.vr{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:20px;background:rgba(var(--wh),.045);border:1px solid rgba(var(--wh),.07);margin-bottom:8px}
.vr.tap{cursor:pointer}.vr .ico{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:rgba(var(--wh),.07);color:var(--tx2);flex:none}
.vr .t{font-weight:600;font-size:14px}.vr .s{font-size:12px;color:var(--tx3);margin-top:2px}.vr .m{margin-left:auto;text-align:right;font-size:13px;color:var(--tx2);white-space:nowrap;padding-left:8px}.vr .m small{display:block;font-size:11px;color:var(--tx3);margin-top:2px}
.okc{display:flex;flex-wrap:wrap;gap:8px}.okc span{padding:8px 13px;border-radius:999px;background:rgba(52,211,153,.12);color:#6ee7b7;font-size:13px;display:inline-flex;gap:6px;align-items:center}
.tr{display:flex;align-items:flex-end;gap:8px;height:130px;padding:6px 4px 0}
.tr div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:5px;height:100%;font-size:11px;color:var(--tx3)}
.tr i{display:block;width:100%;max-width:36px;min-height:4px;border-radius:10px 10px 4px 4px;background:linear-gradient(180deg,rgba(94,234,212,.95),rgba(129,140,248,.5))}
.tr .today i{box-shadow:0 0 20px rgba(94,234,212,.6)}.tr .today{color:var(--tx)}.tr b{font-weight:600;color:var(--tx2);font-size:11px}
/* Wetter */
.sky{position:relative;min-height:320px;color:#fff;border:1px solid rgba(var(--wh),.2);display:flex;flex-direction:column;backdrop-filter:none}
.sky .skyin{position:relative;z-index:2;display:flex;flex-direction:column;justify-content:space-between;gap:26px;flex:1}
.cl{position:absolute;border-radius:50%;background:rgba(var(--wh),.17);filter:blur(30px);animation:cdrift 42s ease-in-out infinite alternate;pointer-events:none}
.cl.c1{width:320px;height:110px;left:-50px;top:18px}.cl.c2{width:400px;height:130px;right:-70px;top:90px;animation-duration:58s;opacity:.8}.cl.c3{width:280px;height:90px;left:32%;bottom:-14px;animation-duration:50s}
@keyframes cdrift{to{transform:translateX(80px)}}
.sunglow{position:absolute;right:-70px;top:-90px;width:360px;height:360px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(255,228,150,.85),rgba(255,200,90,.28) 45%,transparent 70%);animation:glow 9s ease-in-out infinite}
@keyframes glow{50%{transform:scale(1.12);opacity:.8}}
.sky .wtemp{font-size:clamp(84px,12vw,128px);text-shadow:0 6px 40px rgba(0,0,0,.25)}
.sky .wcond{color:rgba(var(--wh),.88);font-size:17px}.sky .hl2{font-size:14px;color:rgba(var(--wh),.75);margin-top:4px}
.sky .chip{background:rgba(var(--wh),.16);border-color:rgba(var(--wh),.22);color:rgba(var(--wh),.88)}.sky .chip b{color:#fff}
.mg{position:relative;height:250px;min-width:760px}.mgw{overflow-x:auto;scrollbar-width:none}.mgw::-webkit-scrollbar{display:none}
.mg .ab{position:absolute;transform:translateX(-50%);text-align:center;font-size:12px;color:var(--tx2);line-height:1}
.mg .tl{font-size:13px;font-weight:600;color:var(--tx);transform:translate(-50%,-100%)}
.mg .rb2{position:absolute;bottom:34px;width:14px;transform:translateX(-50%);border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,#7dd3fc,rgba(56,189,248,.35))}
.mg>svg{position:absolute;left:0;top:76px;width:100%;height:100px;overflow:visible}
.dr{display:grid;grid-template-columns:50px 34px 44px 28px 1fr 30px;align-items:center;gap:8px;padding:10px 0;border-top:1px solid rgba(var(--wh),.07);font-size:14px}
.dr.f{border-top:0}.dd{font-weight:600}.dp{font-size:11.5px;color:#7dd3fc;display:flex;align-items:center;gap:2px}.dlo{color:var(--tx3);text-align:right}.dhi{font-weight:600}
.dbar{position:relative;height:6px;border-radius:3px;background:rgba(var(--wh),.1)}.dbar i{position:absolute;top:0;bottom:0;border-radius:3px}
.dg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media (max-width:860px){.dg{grid-template-columns:1fr 1fr}}
.dt{padding:14px;border-radius:20px;background:rgba(var(--wh),.05);border:1px solid var(--line)}.dt .v{font-size:24px;font-weight:300;white-space:nowrap}.dt .l{font-size:12px;color:var(--tx2);margin-top:4px;display:flex;align-items:center;gap:5px}
.cmp{display:flex;align-items:center;gap:18px;flex-wrap:wrap;justify-content:center}.cmp .t{font-size:13px;color:var(--tx2);line-height:1.6}.cmp .t b{display:block;font-size:24px;font-weight:300;color:var(--tx)}
.moon{display:flex;align-items:center;gap:14px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(var(--wh),.08);font-size:13px;color:var(--tx2)}.moon b{display:block;color:var(--tx);font-size:14px}
.hero{flex-direction:row;flex-wrap:wrap;gap:24px;align-items:stretch}
.hl{flex:1;min-width:250px;display:flex;flex-direction:column;justify-content:space-between}
.rings{display:flex;align-items:center;gap:20px;margin-right:6px}
.rgsvg{width:176px;height:176px;flex:none;overflow:visible}
.rl{display:flex;flex-direction:column;gap:12px;font-size:13px;color:var(--tx2);min-width:150px}
.rl div{display:flex;align-items:center;gap:9px}.rl i{width:9px;height:9px;border-radius:50%;flex:none;box-shadow:0 0 10px currentColor}.rl b{color:var(--tx);margin-left:auto;padding-left:14px;font-weight:600}
.sunarc{max-width:300px;margin:0 auto}
.dials{grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr))}
.lg{grid-template-columns:repeat(auto-fill,minmax(min(100%,160px),1fr))}
.chw{position:relative;padding:8px 10px 24px 38px}
.plot{position:relative;height:100%}.plot svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.yl{position:absolute;left:-36px;width:30px;text-align:right;transform:translateY(-50%);font-size:11px;color:var(--tx3)}
.xl{position:absolute;bottom:-22px;transform:translateX(-50%);font-size:11px;color:var(--tx3)}
.cd{position:absolute;width:9px;height:9px;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 12px currentColor}
@media (max-width:860px){.rings{width:100%;justify-content:space-between;margin:0}.rgsvg{width:150px;height:150px}}
.rw{position:relative;width:62px;height:62px;flex:none}.rw .ring{position:absolute;inset:0}.rw .ri{position:absolute;inset:0;display:grid;place-items:center;color:var(--tx2)}
.rw.nr{border-radius:50%;background:rgba(var(--wh),.07)}
.qb{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:14px;background:rgba(var(--wh),.07);border:1px solid var(--line);font-size:12px;color:var(--tx2);transition:.25s}
.qb:hover{background:rgba(var(--wh),.14);color:var(--tx)}.qb.on{background:rgba(251,191,36,.18);color:var(--warm);border-color:rgba(251,191,36,.4)}
.mrow{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px}
.vh{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.vh h1{font-size:30px;font-weight:300;letter-spacing:-.02em}.vh p{font-size:14px;color:var(--tx2);margin-top:4px}
.col{display:flex;flex-direction:column;gap:16px}
.gwrap{position:relative;width:200px;max-width:100%}.gwrap .gv{position:absolute;left:0;right:0;bottom:2px;text-align:center}.gwrap .gv .big{font-size:44px}
.twocol{display:flex;gap:20px;align-items:center;flex-wrap:wrap;justify-content:space-around}
/* Hinweise */
.alerts{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.al{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;min-height:42px;border-radius:16px;font-size:13px;font-weight:500;border:1px solid var(--line);background:rgba(var(--wh),.07);color:var(--tx);text-align:left;cursor:pointer;transition:.2s}
.al:active{transform:scale(.97)}
.al.warn{background:rgba(251,191,36,.16);border-color:rgba(251,191,36,.45);color:#fde68a}
.al.bad{background:rgba(251,113,133,.16);border-color:rgba(251,113,133,.5);color:#fecdd3}
.al.info{background:rgba(56,189,248,.14);border-color:rgba(56,189,248,.4);color:#bae6fd}
.al.ok{background:rgba(52,211,153,.12);border-color:rgba(52,211,153,.35);color:#a7f3d0}
.al small{opacity:.75;font-size:11.5px;font-weight:400}
/* Termine */
.dh{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3);margin:16px 2px 8px;display:flex;gap:8px;align-items:baseline}
.dh:first-child{margin-top:0}.dh b{color:var(--tx);letter-spacing:0;text-transform:none;font-size:13.5px;font-weight:600}
.ev{display:flex;gap:12px;align-items:stretch;padding:10px 12px;border-radius:16px;background:rgba(var(--wh),.045);margin-bottom:6px}
.ev i{width:4px;border-radius:2px;background:var(--ec,#818cf8);flex:none;box-shadow:0 0 12px var(--ec,#818cf8)}
.ev .t{font-size:14px;font-weight:500;overflow-wrap:anywhere}.ev .s{font-size:12px;color:var(--tx3);margin-top:2px}
.ev .tm{margin-left:auto;font-size:12.5px;color:var(--tx2);white-space:nowrap;text-align:right;align-self:center;padding-left:8px}
.calf{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.calf button{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border-radius:999px;border:1px solid var(--line);background:rgba(var(--wh),.04);font-size:12px;color:var(--tx3);min-height:34px}
.calf button.on{color:var(--tx);background:rgba(var(--wh),.1)}.calf button i{width:8px;height:8px;border-radius:50%;background:var(--ec)}
/* Listen */
.todo{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:16px;background:rgba(var(--wh),.045);margin-bottom:6px;min-height:48px}
.todo .ck{width:28px;height:28px;border-radius:50%;border:2px solid rgba(var(--wh),.28);display:grid;place-items:center;flex:none;transition:.2s;color:transparent}
.todo .ck:hover{border-color:var(--acc);color:var(--acc)}.todo .t{font-size:14.5px;overflow-wrap:anywhere}
.todo.ro .ck{display:none}.todo.ro::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--acc2);flex:none;margin:0 4px}
.addrow{display:flex;gap:8px;margin-bottom:12px}
.addrow input{flex:1;min-width:0;height:46px;border-radius:15px;border:1px solid var(--line);background:rgba(var(--wh),.06);color:var(--tx);font:inherit;font-size:15px;padding:0 14px;outline:none;transition:.2s}
.addrow input:focus{border-color:rgba(94,234,212,.6);background:rgba(var(--wh),.1)}.addrow input::placeholder{color:var(--tx3)}
.addrow button{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(94,234,212,.3),rgba(129,140,248,.3));border:1px solid rgba(var(--wh),.16);flex:none}
.lstab{display:flex;gap:6px;margin-bottom:12px}
.lstab button{flex:1;min-height:40px;border-radius:14px;background:rgba(var(--wh),.05);border:1px solid var(--line);font-size:13px;color:var(--tx2)}
.lstab button.on{background:rgba(var(--wh),.13);color:var(--tx);border-color:rgba(var(--wh),.24)}
/* Pflanze / Drucker / Batterie */
.pl{display:flex;align-items:center;gap:16px}
.pl .rw{width:84px;height:84px}.pl .rw .ring{width:84px;height:84px}
.pl .big{font-size:40px}.pl .l{font-size:12.5px;color:var(--tx2);margin-top:4px}
.pbtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:10px 16px;border-radius:15px;background:linear-gradient(135deg,rgba(52,211,153,.28),rgba(56,189,248,.24));border:1px solid rgba(52,211,153,.4);font-size:13.5px;font-weight:500;margin-top:14px;width:100%}
.pbtn:active{transform:scale(.98)}
.pn{display:flex;align-items:center;gap:14px}
.pn .big{font-size:42px}.pn .l{font-size:12.5px;color:var(--tx2);margin-top:4px}
.pnimg{width:100%;border-radius:18px;margin-top:12px;display:block;max-height:200px;object-fit:cover}
.bt{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:16px;background:rgba(var(--wh),.045);margin-bottom:6px;min-height:50px}
.bt .t{font-size:13.5px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
.bt .pc2{width:70px;height:7px;border-radius:4px;background:rgba(var(--wh),.12);overflow:hidden;flex:none}.bt .pc2 i{display:block;height:100%;border-radius:4px}
.bt b{font-size:13px;width:44px;text-align:right;font-weight:600;flex:none}
.bt.low b{color:var(--bad)}.bt.mid b{color:var(--warm)}
.cnt{display:flex;gap:8px;flex-wrap:wrap}
.card-note{font-size:12px;color:var(--tx3);margin-top:12px}
.vr>div:nth-child(2){min-width:0;flex:1}.vr .t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vr .m{flex:none}
/* Segment, Drucker, Station */
.ex.two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}@media (max-width:860px){.ex.two{grid-template-columns:1fr}}
.pc2{height:7px;border-radius:4px;background:rgba(var(--wh),.12);overflow:hidden;width:70px;flex:none}.pc2 i{display:block;height:100%;border-radius:4px}
.seg{display:inline-flex;gap:4px;padding:4px;border-radius:18px;background:rgba(var(--wh),.06);border:1px solid var(--line)}
.seg button{display:inline-flex;align-items:center;gap:7px;min-height:40px;padding:0 16px;border-radius:14px;font-size:13.5px;color:var(--tx2);transition:.25s}
.seg button.on{background:linear-gradient(135deg,rgba(94,234,212,.28),rgba(129,140,248,.28));color:#fff;box-shadow:inset 0 0 0 1px rgba(var(--wh),.16)}
.prh{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:20px;padding:16px}
.prcam{position:relative;border-radius:22px;overflow:hidden;min-height:220px;background:linear-gradient(150deg,rgba(var(--wh),.07),rgba(var(--wh),.02));display:grid;place-items:center}
.prcam img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.prnone{display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--tx3);font-size:13px}
.prpill{position:absolute;left:12px;top:12px;font-size:12px;padding:6px 12px;backdrop-filter:blur(10px)}
.prinfo{display:flex;flex-direction:column;justify-content:center;min-width:0;padding:6px 6px 6px 0}
.prtitle{font-size:22px;font-weight:600;line-height:1.2;overflow-wrap:anywhere}
.pbar{height:10px;border-radius:5px;background:rgba(var(--wh),.12);overflow:hidden;margin:16px 0 14px}
.pbar i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#38bdf8,#818cf8,#f472b6);box-shadow:0 0 16px rgba(129,140,248,.7);transition:width 1s}
.prs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.prs div{min-width:0}.prs b{display:block;font-size:15px;font-weight:600;white-space:nowrap}.prs span{font-size:11.5px;color:var(--tx3)}
.prctl{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.ggs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.gg{position:relative;text-align:center}.gg svg{width:100%;max-width:150px;display:block;margin:0 auto}
.gg .gt{position:absolute;left:0;right:0;top:34%;}.gg .gt .big{font-size:30px}
.gl{font-size:13px;color:var(--tx2);margin-top:-6px}.gl span{display:block;font-size:11.5px;color:var(--tx3);margin-top:2px}
.fan{display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:13px;color:var(--tx2)}.fan span{width:120px;flex:none}.fan .pc2{flex:1;width:auto}.fan b{width:46px;text-align:right;color:var(--tx);font-weight:600;font-size:13px}
.spools{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.spool{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;padding:14px 6px;border-radius:20px;background:rgba(var(--wh),.04);border:1px solid var(--line)}
.sp-c{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:rgba(var(--wh),.08);color:rgba(0,0,0,.35);transition:.4s}
.spool b{font-size:13.5px;font-weight:600}.spool span{font-size:11.5px;color:var(--tx3)}
.uvr{position:relative;max-width:220px;margin:0 auto 10px}.uvr svg{width:100%;display:block}.uvv{position:absolute;left:0;right:0;bottom:0;text-align:center}.uvv .big{font-size:40px;line-height:1}.uvv span{font-size:12px;color:var(--tx2)}
.rrt{display:flex;gap:28px;flex-wrap:wrap;margin-bottom:14px}
.rrow{display:flex;align-items:center;gap:12px;margin-bottom:10px;font-size:13px;color:var(--tx2)}.rrow span{width:58px;flex:none}.rrow b{width:68px;text-align:right;color:var(--tx);font-weight:600}
.dg .dt .l{line-height:1.25}
@media (max-width:860px){.prh{grid-template-columns:1fr}.prcam{min-height:200px}.prs{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:12px}.ggs{gap:4px}.gg .gt .big{font-size:26px}.spools{grid-template-columns:repeat(2,minmax(0,1fr))}.seg{width:100%}.seg button{flex:1;justify-content:center}.fan span{width:104px}.rrt{gap:20px}.vh .seg{margin-top:4px}}
.mcol{display:flex;flex-direction:column;gap:8px}
.mpr{cursor:default;gap:10px;padding:10px 12px}.mpr .grow{flex:1;min-width:0;cursor:pointer}.mpr .t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mpb{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:rgba(var(--wh),.08);border:1px solid var(--line);flex:none;transition:.2s}
.mpb:active{transform:scale(.92)}.mpb.main{background:linear-gradient(135deg,rgba(94,234,212,.28),rgba(129,140,248,.28));border-color:rgba(var(--wh),.2)}
@media (max-width:860px){.mpb{width:44px;height:44px}.mpr{flex-wrap:wrap}.mpr .grow{flex:1 1 calc(100% - 60px)}.ev{padding:10px}.dg .dt:last-child:nth-child(odd){grid-column:span 2}.alerts{gap:6px}.al{flex:none}.alerts{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin-inline:-14px;padding-inline:14px}.alerts::-webkit-scrollbar{display:none}.h .r{text-align:right}}
`;

class HomeAurora extends HTMLElement {
  constructor() {
    super();
    this._v = 'home'; this._sheet = null; this._hist = {}; this._fc = null; this._need = new Set();
    this._enter = true; this._counted = false; this._sig = ''; this._fx = { kind: '', p: [] };
    this._cal = null; this._calOff = new Set(); this._wxMode = 'fc'; this._pw = null; this._sys = null; this._amb = false; this._rweb = false; this._lastAct = Date.now(); this._lastRender = 0;
    this.attachShadow({ mode: 'open' });
  }

  /* ───────────── Lebenszyklus ───────────── */
  setConfig(cfg) {
    const c = cfg || {};
    this._c = Object.assign({}, DEFAULTS, c, { outdoor: { ...DEFAULTS.outdoor, ...(c.outdoor || {}) }, stats: { ...DEFAULTS.stats, ...(c.stats || {}) }, extras: { ...DEFAULTS.extras, ...(c.extras || {}) }, bath: { ...DEFAULTS.bath, ...(c.bath || {}) }, station: { ...DEFAULTS.station, ...(c.station || {}) }, alerts: { ...DEFAULTS.alerts, ...(c.alerts || {}) }, plant: { ...DEFAULTS.plant, ...(c.plant || {}) }, printer: { ...DEFAULTS.printer, ...(c.printer || {}) }, power: { ...DEFAULTS.power, ...(c.power || {}) }, wasteNames: { ...DEFAULTS.wasteNames, ...(c.wasteNames || {}) } });
    try { this._themePref = localStorage.getItem('home-aurora-theme'); this._ambPref = localStorage.getItem('home-aurora-amb'); this._nightPref = localStorage.getItem('home-aurora-ambnight'); this._fuPref = localStorage.getItem('home-aurora-fully'); } catch (e) { /* kein Speicher */ }
    const w = new Set();
    const walk = o => { if (typeof o === 'string') { if (/^[a-z_]+\.[a-z0-9_]+$/.test(o)) w.add(o); } else if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') Object.values(o).forEach(walk); };
    walk(this._c);
    this._pid = this._c.printer.prefix.replace(/^sensor\./, '');
    this._watch = [...w];
    this._build();
  }
  set hass(h) { this._h = h; if (this._built) this._tick(); }
  get hass() { return this._h; }
  getCardSize() { return 12; }
  static getStubConfig() { return {}; }
  static getConfigElement() { return document.createElement('home-aurora-wide-editor'); }
  connectedCallback() {
    this._clk = setInterval(() => this._clockTick(), 1000); this._fxStart();
    this._actFn = () => { this._lastAct = Date.now(); };
    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(t => window.addEventListener(t, this._actFn, { passive: true }));
  }
  disconnectedCallback() {
    clearInterval(this._clk); clearTimeout(this._camT); this._camBound = false; this._fxStop();
    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(t => window.removeEventListener(t, this._actFn));
    this._ambOff(); this._rdr?.destroy(); this._rdr = null;
  }

  _build() {
    this.shadowRoot.innerHTML = `<style>${CSS}${CSS2}${CSS3}${CSS4}</style>
      <div class="app" data-tod="night">
        <div class="bg"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="blob b4"></div><canvas class="fx"></canvas><div class="grain"></div></div>
        <div class="shell"><nav></nav><main></main></div>
        <div class="ov"><div class="sheet"></div></div><div class="amb"></div><div class="toast"></div>
      </div>`;
    const r = this.shadowRoot;
    this._app = r.querySelector('.app'); this._nav = r.querySelector('nav'); this._main = r.querySelector('main');
    this._ov = r.querySelector('.ov'); this._sh = r.querySelector('.sheet'); this._cv = r.querySelector('canvas.fx'); this._tst = r.querySelector('.toast'); this._amb_el = r.querySelector('.amb');
    this._amb_el.addEventListener('pointerdown', ev => { this._swallow = Date.now() + 800; ev.preventDefault(); this._ambOff(true); });
    this._applyTheme();
    this._built = true;
    this._events(r);
    if (this._h) { this._sig = ''; this._tick(); }
    if (this.isConnected) this._fxStart();
  }

  _tick() {
    const h = this._h; let sig = this._isLight() + '|';
    for (const e of this._watch) sig += (h.states[e]?.last_updated || '-') + '|';
    for (const k in h.states) if (k.startsWith('light.') || (k.startsWith('sensor.') && k.includes('timer')) || this._isBat(k) || this._isContact(k) || k.includes(this._pid) || h.states[k].attributes?.putzplan_task) sig += h.states[k].last_updated;
    const va = h.states[this._c.stats.vent]?.attributes?.raeume; if (va) for (const r of va) if (r.entity_id) sig += (h.states[r.entity_id]?.last_updated || '-');
    if (sig === this._sig) return;
    if (this._rweb && this._v === 'weather' && Date.now() - this._lastRender < 3e5) return;
    this._sig = sig;
    if (this._busy) { this._dirty = true; return; }
    const gap = Date.now() - this._lastRender;
    if (gap < 1200) { if (!this._rt) this._rt = setTimeout(() => { this._rt = 0; if (!this._busy) this._render(); else this._dirty = true; }, 1200 - gap); return; }
    cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => this._render());
  }

  /* ───────────── Daten-Helfer ───────────── */
  _s(e) { return this._h.states[e]; }
  _val(e) { const s = e && this._h.states[e]; return s ? s.state : undefined; }
  _num(e) { const v = parseFloat(this._val(e)); return isNaN(v) ? null : v; }
  _attr(e, a) { return this._h.states[e]?.attributes?.[a]; }
  _name(e) { return this._attr(e, 'friendly_name') || e; }
  _unit(e) { return this._attr(e, 'unit_of_measurement') || ''; }
  _lights() { return Object.keys(this._h.states).filter(k => k.startsWith('light.') && this._h.states[k].state !== 'unavailable').sort((a, b) => this._name(a).localeCompare(this._name(b), 'de')); }
  _lightsOn() { return this._lights().filter(e => this._val(e) === 'on'); }
  _glow(on) {
    const cs = on.map(e => this._attr(e, 'rgb_color')).filter(Boolean);
    if (!cs.length) return '251,191,36';
    return [0, 1, 2].map(i => Math.round(cs.reduce((a, c) => a + c[i], 0) / cs.length)).join(',');
  }
  _room(r) {
    const cl = r.climate ? this._s(r.climate) : null;
    const lights = (r.lights || []).filter(e => this._s(e) && this._val(e) !== 'unavailable');
    const on = lights.filter(e => this._val(e) === 'on');
    const win = (r.window || []).filter(e => this._s(e));
    return {
      temp: r.temp ? this._num(r.temp) : null, hum: r.hum ? this._num(r.hum) : null, cl, lights, on, win,
      open: win.some(e => this._val(e) === 'on'), stale: r.temp ? this._stale(r.temp) : null, target: cl?.attributes?.temperature, act: cl?.attributes?.hvac_action, mode: cl?.state, glow: this._glow(on),
    };
  }
  _openRooms() { return this._c.rooms.filter(r => this._room(r).open).map(r => r.name); }
  _openSince() { let t = null; for (const r of this._c.rooms) for (const e of (r.window || [])) { const s = this._s(e); if (s && s.state === 'on') { const x = new Date(s.last_changed).getTime(); if (!isNaN(x) && (t == null || x < t)) t = x; } } return t; }
  _since(t) {
    if (t == null) return '';
    const m = Math.max(0, Math.round((Date.now() - t) / 6e4));
    if (m < 2) return 'gerade geöffnet';
    if (m < 60) return `seit ${m} Min.`;
    if (m < 1440) { const h = Math.floor(m / 60), r = m % 60; return `seit ${h} Std.${r >= 5 ? ' ' + r + ' Min.' : ''}`; }
    const d = Math.floor(m / 1440); return `seit ${d} ${d === 1 ? 'Tag' : 'Tagen'}`;
  }
  _winSub(open) { if (!open.length) return 'Alles zu'; const sn = this._since(this._openSince()); return (sn ? sn + ' · ' : '') + esc(open.join(', ')); }
  _devBat() {
    const out = [];
    for (const b of this._batteries().all) {
      const pf = this._h.entities?.[b.e]?.platform;
      if (pf !== 'mobile_app' && pf !== 'fully_kiosk') continue;
      const base = b.e.replace(/_battery(_level)?$/, ''), bin = 'binary_sensor.' + base.slice(base.indexOf('.') + 1);
      const st = this._val(base + '_battery_state');
      out.push({ ...b, n: String(b.n).replace(/\s*battery( level)?\s*$/i, '').trim(), charging: st === 'charging' || st === 'full' || this._val(bin + '_is_charging') === 'on' || this._val(bin + '_plugged_in') === 'on' });
    }
    return out;
  }
  _wxNow() {
    const c = this._c, w = this._s(c.weather);
    const o = c.outdoor;
    return {
      cond: w?.state || 'cloudy',
      temp: this._num(o.temp) ?? w?.attributes?.temperature ?? null,
      hum: this._num(o.hum) ?? w?.attributes?.humidity ?? null,
      wind: this._num(o.wind) ?? w?.attributes?.wind_speed ?? null, windU: (o.wind && this._unit(o.wind)) || w?.attributes?.wind_speed_unit || 'km/h',
      rain: this._num(o.rain), rainU: (o.rain && this._unit(o.rain)) || 'mm/h',
      press: w?.attributes?.pressure ?? null,
    };
  }
  _wxGlow(c) {
    return ({ sunny: 'rgba(251,191,36,.38)', 'clear-night': 'rgba(129,140,248,.38)', rainy: 'rgba(56,189,248,.32)', pouring: 'rgba(59,130,246,.38)', lightning: 'rgba(250,204,21,.28)', 'lightning-rainy': 'rgba(250,204,21,.28)', snowy: 'rgba(186,230,253,.3)', partlycloudy: 'rgba(125,211,252,.32)', fog: 'rgba(203,213,225,.25)' })[c] || 'rgba(148,163,184,.3)';
  }

  /* ───────────── Verlauf & Vorhersage ───────────── */
  _resample(raw, t0, t1, n) {
    if (!raw.length) return [];
    raw.sort((a, b) => a[0] - b[0]);
    const out = []; let j = 0, last = raw[0][1];
    for (let i = 0; i < n; i++) {
      const t = t0 + (t1 - t0) * i / (n - 1);
      while (j < raw.length && raw[j][0] <= t) { last = raw[j][1]; j++; }
      out.push([t, last]);
    }
    return out;
  }
  async _loadHist() {
    if (this._hl) return;
    const need = [...this._need].filter(e => !this._hist[e] || Date.now() - this._hist[e].t > 6e5);
    this._need.clear();
    if (!need.length) return;
    this._hl = true;
    const end = Date.now(), start = end - 24 * 3600e3;
    try {
      const res = await this._h.callWS({ type: 'history/history_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(), entity_ids: need, minimal_response: true, no_attributes: true, significant_changes_only: false });
      for (const e of need) {
        const raw = (res[e] || []).map(x => [x.lu != null ? x.lu * 1000 : (x.last_updated ? new Date(x.last_updated).getTime() : start), parseFloat(x.s !== undefined ? x.s : x.state)]).filter(p => !isNaN(p[1]));
        this._hist[e] = { t: Date.now(), pts: this._resample(raw, start, end, 72) };
      }
    } catch (err) { for (const e of need) this._hist[e] = { t: Date.now(), pts: [] }; }
    this._hl = false;
    this._renderSoon();
  }
  async _loadFc() {
    if (this._fcb || (this._fc && Date.now() - this._fc.t < 9e5)) return;
    this._fcb = true;
    const w = this._c.weather;
    const get = async type => {
      try { const r = await this._h.callWS({ type: 'call_service', domain: 'weather', service: 'get_forecasts', service_data: { type }, target: { entity_id: w }, return_response: true }); return r?.response?.[w]?.forecast || []; } catch (e) { return []; }
    };
    const [daily, hourly] = await Promise.all([get('daily'), get('hourly')]);
    this._fc = { t: Date.now(), daily: daily.length ? daily : (this._attr(w, 'forecast') || []), hourly };
    this._fcb = false;
    this._renderSoon();
  }

  /* ───────────── Bausteine ───────────── */
  _ring(t) {
    if (t == null) return '';
    const f = clamp((t - 10) / 20, 0, 1), C = 2 * Math.PI * 26, col = tempCol(t);
    return `<svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="rgba(${WH},.09)" stroke-width="5"/><circle cx="32" cy="32" r="26" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(C * f).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 32 32)" style="filter:drop-shadow(0 0 5px ${col})"/></svg>`;
  }
  _spark(e) {
    const d = this._hist[e];
    if (!d) { this._need.add(e); return '<div class="sk"></div>'; }
    if (d.pts.length < 2) return '<div class="sk" style="animation:none;opacity:.5"></div>';
    const vs = d.pts.map(p => p[1]), mn = Math.min(...vs), mx = Math.max(...vs), rg = Math.max(mx - mn, 1);
    const pts = d.pts.map((p, i) => [i / (d.pts.length - 1) * 200, 40 - (p[1] - mn) / rg * 32]);
    const path = smooth(pts), col = tempCol(vs[vs.length - 1]);
    return `<svg class="spark" viewBox="0 0 200 46" preserveAspectRatio="none"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".35"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><path d="${path}L200 46L0 46z" fill="url(#sg)"/><path d="${path}" fill="none" stroke="${col}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round"/></svg>`;
  }
  _chart(series, opt = {}) {
    const H = opt.h || 200;
    series.forEach(s => { if (!this._hist[s.e]) this._need.add(s.e); });
    const data = series.map(s => ({ ...s, pts: this._hist[s.e]?.pts || [] }));
    if (data.some(s => !this._hist[s.e])) return `<div class="sk" style="height:${H}px"></div>`;
    const all = data.flatMap(s => s.pts.map(p => p[1]));
    if (!all.length) return '<div class="empty">Noch keine Verlaufsdaten</div>';
    let mn = Math.min(...all), mx = Math.max(...all);
    if (mx - mn < 2) { mn -= 1; mx += 1; }
    const pad = (mx - mn) * .1; mn -= pad; mx += pad;
    const first = data.find(s => s.pts.length) || data[0];
    const t0 = first.pts[0][0], t1 = first.pts[first.pts.length - 1][0];
    const X = t => (t - t0) / (t1 - t0) * 100, Y = v => (1 - (v - mn) / (mx - mn)) * 100;
    let svg = '', lab = '';
    for (let i = 0; i < 4; i++) { const v = mn + (mx - mn) * i / 3, y = Y(v); svg += `<line x1="0" x2="100" y1="${y}" y2="${y}" stroke="rgba(${WH},.07)" vector-effect="non-scaling-stroke"/>`; lab += `<span class="yl" style="top:${y}%">${de(v, opt.dec ?? 0)}</span>`; }
    const tk = new Date(t0); tk.setMinutes(0, 0, 0);
    for (let t = tk.getTime() + 3600e3; t < t1; t += 3600e3) { const hh = new Date(t).getHours(); if (hh % 6 === 0) { svg += `<line x1="${X(t)}" x2="${X(t)}" y1="0" y2="100" stroke="rgba(${WH},.045)" vector-effect="non-scaling-stroke"/>`; lab += `<span class="xl" style="left:${X(t)}%">${String(hh).padStart(2, '0')}:00</span>`; } }
    data.forEach(s => {
      if (s.pts.length < 2) return;
      const pts = s.pts.map(p => [X(p[0]), Y(p[1])]), last = pts[pts.length - 1];
      svg += `<path d="${smooth(pts)}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="filter:drop-shadow(0 0 4px ${s.color})"/>`;
      lab += `<span class="cd" style="left:${last[0]}%;top:${last[1]}%;background:${s.color};color:${s.color}"></span>`;
    });
    const leg = series.length > 1 ? `<div class="leg">${series.map(s => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>` : '';
    return `<div class="chw" style="height:${H}px"><div class="plot"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${svg}</svg>${lab}</div></div>${leg}`;
  }
  _rings() {
    const c = this._c, L = this._lights(), on = this._lightsOn().length;
    const wr = c.rooms.filter(r => (r.window || []).some(e => this._s(e))), closed = wr.filter(r => !this._room(r).open).length;
    const cr = c.rooms.filter(r => r.climate && this._s(r.climate)), heat = cr.filter(r => this._room(r).act === 'heating').length;
    const temps = c.rooms.map(r => this._room(r).temp).filter(t => t != null), avg = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null;
    const R = [[72, on / Math.max(L.length, 1), '#fbbf24', 'Lichter an', `${on}/${L.length}`], [56, closed / Math.max(wr.length, 1), '#34d399', 'Fenster zu', `${closed}/${wr.length}`], [40, heat / Math.max(cr.length, 1), '#fb923c', 'Heizung aktiv', `${heat}/${cr.length}`]];
    const svg = R.map(r => `<circle cx="88" cy="88" r="${r[0]}" fill="none" stroke="rgba(${WH},.08)" stroke-width="9"/>${r[1] > 0 ? `<path d="${arc(88, 88, r[0], -90, -90 + Math.min(r[1], .9999) * 360)}" fill="none" stroke="${r[2]}" stroke-width="9" stroke-linecap="round" style="filter:drop-shadow(0 0 6px ${r[2]})"/>` : ''}`).join('');
    return `<div class="rings"><div style="position:relative"><svg class="rgsvg" viewBox="0 0 176 176">${svg}</svg>
      <div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center"><div><div class="big" style="font-size:26px">${de(avg)}<small class="u">°</small></div><div style="font-size:10.5px;color:var(--tx3);margin-top:2px">Ø innen</div></div></div></div>
      <div class="rl">${R.map(r => `<div style="color:${r[2]}"><i style="background:${r[2]}"></i><span style="color:var(--tx2)">${r[3]}</span><b>${r[4]}</b></div>`).join('')}</div></div>`;
  }
  _sunArc() {
    const s = this._s(this._c.sun);
    if (!s) return '';
    const a = s.attributes, up = s.state === 'above_horizon', now = Date.now();
    const nr = new Date(a.next_rising).getTime(), ns = new Date(a.next_setting).getTime();
    if (isNaN(nr) || isNaN(ns)) return '';
    let f = .5;
    if (up) { const st = nr - 864e5; f = clamp((now - st) / (ns - st), 0, 1); } else { const st = ns - 864e5; f = clamp((now - st) / (nr - st), 0, 1); }
    const ang = 180 + 180 * f, cx = 100, cy = 92, r = 80;
    const px = cx + r * Math.cos(ang * Math.PI / 180), py = cy + r * Math.sin(ang * Math.PI / 180);
    const col = up ? '#fbbf24' : '#a5b4fc';
    return `<svg class="sunarc" viewBox="0 0 200 104"><defs><linearGradient id="sa" x1="0" x2="1"><stop offset="0" stop-color="${col}" stop-opacity=".1"/><stop offset="1" stop-color="${col}"/></linearGradient></defs>
      <path d="${arc(cx, cy, r, 180, 360)}" fill="none" stroke="rgba(${WH},.1)" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>
      <path d="${arc(cx, cy, r, 180, Math.max(180.5, ang))}" fill="none" stroke="url(#sa)" stroke-width="4" stroke-linecap="round"/>
      <line x1="8" x2="192" y1="${cy}" y2="${cy}" stroke="rgba(${WH},.12)"/>
      <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="14" fill="${col}" opacity=".18"/><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="7" fill="${col}" style="filter:drop-shadow(0 0 8px ${col})"/></svg>
      <div class="srow"><span>${ic('sun', 14)} Aufgang <b>${hhmm(nr)}</b></span><span>Untergang <b>${hhmm(ns)}</b> ${ic('moon', 14)}</span></div>`;
  }
  _lightTile(e) {
    const s = this._s(e); if (!s) return '';
    const on = s.state === 'on', at = s.attributes, lc = at.rgb_color ? at.rgb_color.join(',') : '251,191,36';
    const dim = (at.supported_color_modes || []).some(m => m !== 'onoff');
    const pct = at.brightness != null ? Math.round(at.brightness / 2.55) : null;
    return `<div class="lt ${on ? 'on' : ''}" style="--lc:${lc}" data-act="toggle" data-e="${e}" data-hold>
      <div class="bub">${ic('bulb', 22)}</div><div class="n">${esc(at.friendly_name || e)}</div><div class="s">${on ? (pct != null ? pct + ' %' : 'An') : 'Aus'}</div>
      ${on && dim ? `<input type="range" min="1" max="100" value="${pct ?? 100}" style="--v:${pct ?? 100}%" data-act="bright" data-e="${e}">` : ''}</div>`;
  }
  _roomTile(r, big, i) {
    const I = this._room(r);
    const flame = I.act === 'heating';
    const hl = this._humLevel(I);
    return `<div class="c tap rm ${I.on.length ? 'lit' : ''} ${I.stale != null ? 'stale' : ''}" style="--glow:${I.glow};--i:${i}" data-act="room" data-room="${r.id}">
      <div class="rt"><span>${esc(r.name)}</span>${I.open ? `<span class="wbd" title="Fenster offen">${ic('window', 18)}</span>` : ''}</div>
      <div class="rmid"><div class="rw ${I.temp == null ? 'nr' : ''}">${this._ring(I.temp)}<span class="ri">${ic(r.icon, 22)}</span></div>
        <div class="rv big">${I.temp != null ? de(I.temp) + '<small class="u">°</small>' : I.on.length + '<small class="u">an</small>'}</div></div>
      ${big && r.temp ? this._spark(r.temp) : ''}
      <div class="rb">${I.stale != null ? `<span class="stl" title="Sensor ohne Meldung">${ic('clock', 14)}${this._agoTxt(I.stale)}</span>` : ''}${I.hum != null ? `<span class="${hl ? 'hw hw' + hl : ''}">${ic('drop', 14)}${de(I.hum, 0)}%</span>` : ''}${I.lights.length ? `<span class="${I.on.length ? 'on' : ''}">${ic('bulb', 14)}${I.on.length}/${I.lights.length}</span>` : ''}${flame ? `<span class="heat">${ic('flame', 14)}heizt</span>` : (I.target != null && I.mode !== 'off' ? `<span>${ic('thermo', 14)}${de(I.target)}°</span>` : '')}</div>
      ${big && I.lights.length ? `<div><button class="qb ${I.on.length ? 'on' : ''}" data-act="room-lights" data-room="${r.id}">${ic('bulb', 14)}${I.on.length ? 'Alle aus' : 'Alle an'}</button></div>` : ''}
    </div>`;
  }
  _stat(i, icon, label, value, cls, sub, act, extra = '') {
    const num = typeof value === 'number';
    return `<div class="c st s3 ${act ? 'tap' : ''} ${cls}" style="--i:${i}" ${act ? `data-act="${act}" ${extra}` : ''}>
      <div class="top"><div class="ico">${ic(icon, 22)}</div></div>
      <div><div class="v big" ${num ? `data-count="${value}" data-d="0"` : 'style="font-size:30px;font-weight:300"'}>${num ? value : esc(value)}</div><div class="l">${label}</div><div class="sub">${sub || '&nbsp;'}</div></div></div>`;
  }
  _persons() {
    return this._c.persons.filter(e => this._s(e)).map(e => {
      const s = this._s(e), home = s.state === 'home', nm = s.attributes.friendly_name || e, pic = s.attributes.entity_picture;
      return `<div class="pc tap ${home ? '' : 'away'}" data-act="persons"><div class="av" ${pic ? `style="background-image:url('${esc(pic)}')"` : ''}>${pic ? '' : esc(nm[0] || '?')}</div><div>${esc(nm)}<small>${home ? 'Zuhause' : (s.state === 'not_home' ? 'Unterwegs' : esc(s.state))}</small></div></div>`;
    }).join('');
  }
  _greet() { const h = new Date().getHours(); return h < 5 ? 'Gute Nacht' : h < 11 ? 'Guten Morgen' : h < 17 ? 'Guten Tag' : h < 22 ? 'Guten Abend' : 'Gute Nacht'; }
  _clockStr() { const d = new Date(); return String(d.getHours()).padStart(2, '0') + '<span>:</span>' + String(d.getMinutes()).padStart(2, '0'); }

  /* ───────────── Ansicht: Zuhause ───────────── */
  _homeBits() {
    const c = this._c, L = this._lightsOn().length, open = this._openRooms(), V = this._num(c.stats.vent) || 0, vr = (this._val(c.stats.ventRoom) || '').trim(); const VD = this._ventData();
    const w = this._wxNow(), fc = this._fc?.daily || [];
    const sentence = `${L ? `<b class="w">${L} ${L === 1 ? 'Licht brennt' : 'Lichter brennen'}</b>` : 'Alle Lichter sind <b>aus</b>'}, ${open.length ? `<b class="r">${open.length === 1 ? 'ein Fenster' : open.length + ' Fenster'} offen</b> (${esc(open.join(', '))}${this._since(this._openSince()) ? ', ' + this._since(this._openSince()) : ''})` : 'alle Fenster sind <b>geschlossen</b>'}${V > 0 && vr && vr !== 'unknown' ? `. Im Raum <b>${esc(vr)}</b> sollte gelüftet werden.` : '.'}`;
    const mini = fc.slice(0, 5).map((d, i) => `<div>${i === 0 ? 'Heute' : new Date(d.datetime).toLocaleDateString('de-DE', { weekday: 'short' })}${wx(d.condition, 30)}<b>${de(d.temperature, 0)}°</b></div>`).join('');
    const ex = c.extras;
    const xr = [];
    if (this._s(ex.waste)) { const WL = this._waste(); xr.push(`<button class="xr" data-act="waste"><div class="ico">${ic('trash', 19)}</div><div><div class="t">Müllabfuhr</div><div class="s">${WL && WL.length ? WL.slice(0, 2).map(x => this._dayTxt(x) + ' ' + esc(x.name)).join(' · ') : esc(this._val(ex.waste))}</div></div></button>`); }
    if (this._s(ex.fuel)) xr.push(`<button class="xr" data-act="fuel"><div class="ico">${ic('fuel', 19)}</div><div><div class="t">Tanken · günstigster Preis</div><div class="s">${esc(this._val(ex.fuel))} ${esc(this._unit(ex.fuel))}${this._s(ex.fuelName) && okv(this._val(ex.fuelName)) ? ' · ' + esc(this._val(ex.fuelName)) : ''}</div></div></button>`);
    const tvR = this._tvRows(); if (tvR.length) xr.push(...tvR); else if (this._s(ex.kids)) xr.push(`<button class="xr" data-act="toggle" data-e="${ex.kids}"><div class="ico">${ic('shield', 19)}</div><div><div class="t">Kindersicherung TV</div><div class="s">${this._val(ex.kids) === 'on' ? 'Aktiv' : 'Aus'}</div></div><span class="sw ${this._val(ex.kids) === 'on' ? 'on' : ''}"></span></button>`);
    xr.splice(Math.min(xr.length, 1), 0, ...this._cleanRows());
    xr.push(...this._kidRows());
    if (this._s(ex.winter)) xr.push(`<button class="xr" data-act="more" data-e="${ex.winter}"><div class="ico">${ic(this._val(ex.winter) === 'on' ? 'thermo' : 'sun', 19)}</div><div><div class="t">Heizmodus</div><div class="s">${this._val(ex.winter) === 'on' ? 'Wintermodus aktiv' : 'Sommerbetrieb'}</div></div></button>`);
    const sa = this._s(c.sun)?.attributes, sUp = this._val(c.sun) === 'above_horizon';
    const sunChip = sa ? `<span class="chip">${ic(sUp ? 'moon' : 'sun', 14)}<b>${hhmm(sUp ? sa.next_setting : sa.next_rising)}</b></span>` : '';
    const bathState = this._val(c.stats.bath) || '–';
    const bathBusy = bathState !== 'Frei' && bathState !== '–';
    return { c, L, open, V, vr, VD, w, fc, sentence, mini, ex, xr, sunChip, bathState, bathBusy };
  }
  _vHome() {
    const { c, L, open, V, vr, VD, w, fc, sentence, mini, ex, xr, sunChip, bathState, bathBusy } = this._homeBits();
    const AL = this._alerts();
    const BP = this._banPick(AL)[0], CH = AL.filter(a => a !== BP);
    return `${this._banner(AL)}${CH.length ? `<div class="alerts">${CH.map(a => this._alertHtml(a)).join('')}</div>` : ''}${this._quick()}<div class="bento">
      <div class="c hero s8" style="--i:0"><div class="hl"><div><div class="hello">${this._greet()}</div><div class="clock big" id="clk">${this._clockStr()}</div>
        <div class="date">${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</div><div class="sum">${sentence}</div></div>
        <div class="pp" style="margin-top:20px">${this._persons()}</div></div>${this._rings()}</div>
      <div class="c wxh s4 tap" style="--i:1;--wglow:${this._wxGlow(w.cond)}" data-act="nav" data-v="weather">
        <div class="wtop"><div><div class="wtemp big" data-count="${w.temp ?? 0}" data-d="1">${de(w.temp)}<small class="u">°C</small></div><div class="wcond">${COND[w.cond] || w.cond}</div></div>${wx(w.cond, 88)}</div>
        <div><div class="chips"><span class="chip">${ic('drop', 14)}<b>${de(w.hum, 0)}</b>%</span><span class="chip">${ic('wind', 14)}<b>${de(w.wind, 0)}</b> ${esc(w.windU)}</span>${w.rain ? `<span class="chip">${ic('rain', 14)}<b>${de(w.rain)}</b> ${esc(w.rainU)}</span>` : ''}${sunChip}</div>${mini ? `<div class="mini">${mini}</div>` : ''}</div></div>
      ${this._stat(2, 'bulb', 'Lichter an', L, L ? 'hot' : '', L ? esc(this._lightsOn().slice(0, 2).map(e => this._name(e)).join(', ')) + (L > 2 ? ' …' : '') : 'Alles aus', 'lights')}
      ${this._stat(3, 'window', 'Fenster offen', open.length, open.length ? 'bad' : 'cool', this._winSub(open), 'doors')}
      ${(() => { const nv = VD.rooms.length ? VD.prio.length : V; return this._stat(4, 'wind', 'Räume zu lüften', nv, nv ? 'hot' : 'cool', nv ? (VD.prio.slice(0, 2).map(r => esc(r.name)).join(', ') + (VD.prio.length > 2 ? ' …' : '')) : (VD.paused.length ? VD.paused.length + ' später empfohlen' : 'Luft ist gut'), 'vent'); })()}
      ${this._stat(5, 'bath', 'Badezimmer', bathState, bathBusy ? 'bad' : 'cool', 'Status', 'nav', 'data-v="bath"')}
      <div class="s8 col">${this._pzCard(5, 5)}<div><div class="h">${ic('grid', 14)}Räume<span class="r">${this._c.rooms.length} Räume</span></div><div class="rg">${c.rooms.map((r, i) => this._roomTile(r, false, 6 + i)).join('')}</div></div>
        <div class="c" style="--i:10"><div class="h">${ic('thermo', 14)}Temperaturen<span class="r">letzte 24 Stunden</span></div>${this._chart(this._tempSeries(false), { h: 190, dec: 1 })}</div>
        <div class="c" style="--i:11"><div class="h">${ic('star', 14)}Alltag</div><div class="ex two">${xr.join('')}${this._plantRow()}${this._sysRow()}${this._ambRow()}${this._setRow()}</div></div></div>
      <div class="s4 col">${this._calCard(8)}${this._powerCard(9) || `<div class="c" style="--i:9"><div class="h">${ic('sun', 14)}Sonne</div>${this._sunArc()}</div>`}</div>
    </div>`;
  }

  /* ───────────── Ansicht: Räume ───────────── */
  _vRooms() {
    const c = this._c, L = this._lightsOn().length;
    return `<div class="vh"><div><h1>Räume</h1><p>${L ? L + ' Lichter an' : 'Alle Lichter aus'} · ${this._openRooms().length ? this._openRooms().length + ' Fenster offen' : 'alle Fenster zu'}</p></div><button class="qb ${L ? 'on' : ''}" data-act="lights">${ic('bulb', 14)}Alle Lichter</button></div>
      <div class="rg big">${c.rooms.map((r, i) => this._roomTile(r, true, i)).join('')}</div>
      ${this._batCard(21, 's12') ? `<div class="bento" style="margin-top:16px">${this._batCard(21, 's12')}</div>` : ''}`;
  }

  /* ───────────── Ansicht: Klima ───────────── */
  _dial(r, i) {
    const I = this._room(r), cl = I.cl; if (!cl) return '';
    const cur = cl.attributes.current_temperature ?? I.temp, tg = cl.attributes.temperature, heat = I.act === 'heating', off = I.mode === 'off';
    const fc = clamp(((cur ?? 10) - 10) / 20, 0, 1), ft = clamp(((tg ?? 10) - 10) / 20, 0, 1), a1 = 135 + 270 * fc, at = 135 + 270 * ft;
    const col = cur != null ? tempCol(cur) : '#94a3b8';
    const tx = 100 + 84 * Math.cos(at * Math.PI / 180), ty = 100 + 84 * Math.sin(at * Math.PI / 180);
    return `<div class="c dial ${heat ? 'heat' : ''}" style="--i:${i}">
      <div class="dn">${ic(r.icon, 18)}<span>${esc(r.name)}</span><button class="pw ${off ? '' : 'on'}" data-act="hvac" data-e="${r.climate}">${ic('power', 17)}</button></div>
      <div class="dctr"><svg class="dsvg" viewBox="0 0 200 170"><path d="${arc(100, 100, 84, 135, 405)}" fill="none" stroke="rgba(${WH},.09)" stroke-width="12" stroke-linecap="round"/>
        ${cur != null ? `<path d="${arc(100, 100, 84, 135, Math.max(135.5, a1))}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${col});opacity:${off ? .35 : 1}"/>` : ''}
        ${tg != null && !off ? `<circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="9" fill="${FG}" style="filter:drop-shadow(0 0 8px rgba(${WH},.8))"/><circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="3.500" fill="${col}"/>` : ''}</svg>
        <div class="mid htap" data-act="heat" data-room="${r.id}"><div class="cur big">${de(cur)}<small class="u">°</small></div><div class="tg">${off ? 'Heizung aus' : 'Ziel <b>' + de(tg) + '°</b>'}</div></div></div>
      <div class="dst ${heat ? 'heat' : ''}">${heat ? ic('flame', 14) + 'Heizt gerade' : (off ? 'Aus' : 'Bereit')}</div>
      <div class="dbt"><button class="rbn" data-act="temp" data-e="${r.climate}" data-d="-0.5">${ic('minus', 22)}</button><button class="rbn" data-act="temp" data-e="${r.climate}" data-d="0.5">${ic('plus', 22)}</button></div></div>`;
  }
  _tempSeries(out = true) {
    const c = this._c, pal = ['#fb923c', '#a78bfa', '#f472b6', '#34d399', '#38bdf8', '#facc15', '#94a3b8'];
    const series = c.rooms.filter(r => r.temp).map((r, i) => ({ e: r.temp, name: r.name, color: pal[i % pal.length] }));
    if (out && c.outdoor.temp) series.push({ e: c.outdoor.temp, name: 'Draußen', color: '#e2e8f0' });
    return series;
  }
  _vClimate() {
    const c = this._c, rooms = c.rooms.filter(r => r.climate && this._s(r.climate)), w = this._wxNow();
    const heating = rooms.filter(r => this._room(r).act === 'heating').length;
    const series = this._tempSeries();
    return `<div class="vh"><div><h1>Klima</h1><p>${heating ? heating + (heating === 1 ? ' Heizung läuft' : ' Heizungen laufen') : 'Keine Heizung aktiv'} · draußen ${de(w.temp)} °C</p></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="qb" data-act="vent">${ic('wind', 14)}Lüften</button><button class="qb" data-act="sched">${ic('clock', 14)}Heizungsplan</button>${this._s(c.extras.winter) ? `<span class="chip">${ic(this._val(c.extras.winter) === 'on' ? 'thermo' : 'sun', 14)}<b>${this._val(c.extras.winter) === 'on' ? 'Wintermodus' : 'Sommerbetrieb'}</b></span>` : ''}</div></div>
      <div class="dials">${rooms.map((r, i) => this._dial(r, i)).join('')}</div>
      ${this._airCard(6)}
      <div class="c" style="margin-top:16px;--i:7"><div class="h">${ic('thermo', 14)}Temperaturverlauf<span class="r">letzte 24 Stunden</span></div>${this._chart(series, { dec: 0, h: 260 })}</div>`;
  }

  /* ───────────── Ansicht: Bad ───────────── */
  _vBath() {
    const c = this._c, b = c.bath, room = c.rooms.find(r => r.id === b.room) || c.rooms[0], I = this._room(room);
    const st = this._val(c.stats.bath) || '–', busy = st !== 'Frei' && st !== '–';
    const hum = I.hum, hf = clamp((hum ?? 0) / 100, 0, 1), hcol = hum > 65 ? '#fb7185' : hum > 55 ? '#fbbf24' : '#38bdf8';
    const tiles = b.stats.filter(s => this._s(s[0])).map(s => `<div class="bs"><div class="v big">${de(this._num(s[0]), s[0].includes('durchschnitt') ? 1 : 0)}<small class="u">${s[2]}</small></div><div class="l">${s[1]}</div></div>`).join('');
    return `<div class="vh"><div><h1>Badezimmer</h1><p>${busy ? 'Gerade in Benutzung' : 'Frei'} · ${I.open ? 'Fenster offen' : 'Fenster zu'}</p></div></div>
      <div class="bento">
        <div class="c bstatus s5" style="--i:0"><div class="h">${ic('bath', 14)}Status</div><div><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><span class="pulse ${busy ? 'busy' : ''}"></span><span style="color:var(--tx2);font-size:13px">${busy ? 'Belegt' : 'Verfügbar'}</span></div><div class="v">${esc(st)}</div></div>
          <div class="chips"><span class="chip">${ic('window', 14)}Fenster <b>${I.open ? 'offen' : 'zu'}</b></span>${I.lights.length ? `<span class="chip">${ic('bulb', 14)}Licht <b>${I.on.length ? 'an' : 'aus'}</b></span>` : ''}${I.act === 'heating' ? `<span class="chip">${ic('flame', 14)}<b>heizt</b></span>` : ''}</div></div>
        <div class="c s7" style="--i:1"><div class="h">${ic('drop', 14)}Raumklima</div><div class="twocol">
          <div class="gwrap"><svg viewBox="0 0 200 110" style="width:100%;overflow:visible"><path d="${arc(100, 100, 84, 180, 360)}" fill="none" stroke="rgba(${WH},.09)" stroke-width="14" stroke-linecap="round"/><path d="${arc(100, 100, 84, 180, Math.max(180.5, 180 + 180 * hf))}" fill="none" stroke="${hcol}" stroke-width="14" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${hcol})"/></svg><div class="gv"><div class="big" data-count="${hum ?? 0}" data-d="0">${de(hum, 0)}</div><div style="font-size:12px;color:var(--tx2)">Luftfeuchte %</div></div></div>
          <div style="text-align:center"><div class="big" style="font-size:64px;color:${I.temp != null ? tempCol(I.temp) : 'inherit'}" data-count="${I.temp ?? 0}" data-d="1">${de(I.temp)}</div><div style="font-size:12px;color:var(--tx2);margin-top:6px">Temperatur °C</div></div></div></div>
        <div class="c s12" style="--i:2"><div class="h">${ic('drop', 14)}Duschstatistik</div><div class="bstat">${tiles}</div></div>
        <div class="c s12" style="--i:3"><div class="h">${ic('thermo', 14)}Temperatur &amp; Luftfeuchte<span class="r">24 h</span></div>${this._trend({ id: 'bath', temp: room.temp, hum: room.hum }, '#fb923c', { bare: true })}</div>
        ${I.lights.length ? `<div class="c s12" style="--i:5"><div class="h">${ic('bulb', 14)}Licht</div><div class="lg">${I.lights.map(e => this._lightTile(e)).join('')}</div></div>` : ''}
      </div>`;
  }

  /* ───────────── Ansicht: Wetter ───────────── */
  _sky(cond, night) {
    const m = { sunny: night ? ['#0b1230', '#1b2a5e'] : ['#1d5fb4', '#58b0ea'], 'clear-night': ['#090d24', '#1c2760'], partlycloudy: night ? ['#0e1634', '#2a3a6e'] : ['#2b6cb8', '#7bb6e6'], cloudy: ['#34425e', '#66789a'], rainy: ['#1f2a40', '#3c4f6e'], pouring: ['#161e30', '#2e3d58'], lightning: ['#171630', '#3b2f63'], 'lightning-rainy': ['#171630', '#3b2f63'], snowy: ['#4b5d7e', '#9db2cf'], 'snowy-rainy': ['#44566f', '#8ea3bd'], fog: ['#4b5668', '#8793a6'], hail: ['#34425e', '#7d8fae'], windy: ['#2c4a73', '#6aa0cf'], 'windy-variant': ['#2c4a73', '#6aa0cf'], exceptional: ['#3a2f4a', '#7a5f8a'] };
    const c = m[cond] || m.cloudy;
    return `linear-gradient(160deg,${c[0]} 0%,${c[1]} 100%)`;
  }
  _feels(t, h, w) {
    if (t == null) return null;
    const sf = this._num(this._c.station.feels); if (sf != null) return sf;
    const a = this._attr(this._c.weather, 'apparent_temperature'); if (a != null) return a;
    if (h == null) return t;
    const e = h / 100 * 6.105 * Math.exp(17.27 * t / (237.7 + t));
    return t + 0.33 * e - 0.70 * ((w || 0) / 3.6) - 4;
  }
  _dew(t, h) { const sd = this._num(this._c.station.dew); if (sd != null) return sd; if (t == null || h == null) return null; const g = Math.log(h / 100) + 17.62 * t / (243.12 + t); return 243.12 * g / (17.62 - g); }
  _moonSvg(p, size = 56) {
    const r = 24, c = 28, f = p > .5 ? 1 - p : p, k = Math.cos(2 * Math.PI * f), rx = Math.abs(k) * r;
    const lit = f < .25 ? `M${c} ${c - r}A${r} ${r} 0 0 1 ${c} ${c + r}A${rx.toFixed(2)} ${r} 0 0 0 ${c} ${c - r}z` : `M${c} ${c - r}A${r} ${r} 0 0 1 ${c} ${c + r}A${rx.toFixed(2)} ${r} 0 0 1 ${c} ${c - r}z`;
    return `<svg width="${size}" height="${size}" viewBox="0 0 56 56" style="flex:none"><defs><radialGradient id="mg" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#c7d2fe"/></radialGradient></defs><circle cx="28" cy="28" r="24" fill="rgba(${WH},.07)" stroke="rgba(${WH},.14)"/><g transform="${p > .5 ? 'translate(56 0) scale(-1 1)' : ''}"><path d="${lit}" fill="url(#mg)" style="filter:drop-shadow(0 0 8px rgba(199,210,254,.6))"/></g></svg>`;
  }
  _moon() {
    const age = (((Date.now() - Date.UTC(2000, 0, 6, 18, 14)) / 864e5) % 29.530588853 + 29.530588853) % 29.530588853, p = age / 29.530588853;
    const name = p < .03 || p > .97 ? 'Neumond' : p < .22 ? 'Zunehmende Sichel' : p < .28 ? 'Erstes Viertel' : p < .47 ? 'Zunehmender Mond' : p < .53 ? 'Vollmond' : p < .72 ? 'Abnehmender Mond' : p < .78 ? 'Letztes Viertel' : 'Abnehmende Sichel';
    return { p, name, ill: (1 - Math.cos(2 * Math.PI * p)) / 2 };
  }
  _compass(w) {
    const b = this._num(this._c.station.dir) ?? this._attr(this._c.weather, 'wind_bearing'), sp = w.wind;
    const dirs = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'], from = b != null ? dirs[Math.round(b / 45) % 8] : null;
    const word = sp == null ? '' : sp < 2 ? 'Windstill' : sp < 12 ? 'Leichte Brise' : sp < 29 ? 'Mäßiger Wind' : sp < 50 ? 'Frischer Wind' : sp < 75 ? 'Starker Wind' : 'Sturm';
    const ticks = Array.from({ length: 24 }, (_, i) => `<line x1="65" y1="8" x2="65" y2="${i % 6 === 0 ? 15 : 12}" stroke="rgba(${WH},${i % 6 === 0 ? .5 : .2})" stroke-width="1.5" transform="rotate(${i * 15} 65 65)"/>`).join('');
    const arrow = b != null ? `<g transform="rotate(${(b + 180) % 360} 65 65)"><path d="M65 20 L74 58 L65 52 L56 58z" fill="#5eead4" style="filter:drop-shadow(0 0 6px rgba(94,234,212,.8))"/><path d="M65 110 L65 60" stroke="rgba(94,234,212,.35)" stroke-width="2" stroke-linecap="round"/></g>` : '';
    const gust = this._num(this._c.station.maxGust) ?? this._attr(this._c.weather, 'wind_gust_speed');
    return `<div class="cmp"><svg width="130" height="130" viewBox="0 0 130 130"><circle cx="65" cy="65" r="56" fill="rgba(${WH},.04)" stroke="rgba(${WH},.12)"/>${ticks}
      <text x="65" y="28" text-anchor="middle" fill="rgba(${WH},.7)" font-size="10" font-weight="600">N</text><text x="106" y="69" text-anchor="middle" fill="rgba(${WH},.45)" font-size="10">O</text><text x="65" y="112" text-anchor="middle" fill="rgba(${WH},.45)" font-size="10">S</text><text x="24" y="69" text-anchor="middle" fill="rgba(${WH},.45)" font-size="10">W</text>${arrow}</svg>
      <div class="t"><b>${de(sp, 0)} <small class="u" style="font-size:13px">${esc(w.windU)}</small></b>${word}${from ? '<br>aus ' + from : ''}${gust != null ? '<br>Max. Böe heute ' + de(gust, 0) + ' ' + esc(w.windU) : ''}</div></div>`;
  }
  _meteo() {
    const hr = (this._fc?.hourly || []).slice(0, 24);
    if (hr.length < 4) return '<div class="sk" style="height:200px"></div>';
    const N = hr.length, T = hr.map(d => d.temperature), mn = Math.min(...T), mx = Math.max(...T), rg = Math.max(mx - mn, 2);
    const X = i => (i + .5) / N * 100, Y = t => (1 - (t - mn) / rg) * 66 + 14;
    const pts = hr.map((d, i) => [X(i), Y(d.temperature)]), path = smooth(pts);
    const col = tempCol((mn + mx) / 2);
    let html = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="mga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".38"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><path d="${path}L${X(N - 1)} 100L${X(0)} 100z" fill="url(#mga)"/><path d="${path}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round" vector-effect="non-scaling-stroke" style="filter:drop-shadow(0 0 6px ${col})"/></svg>`;
    hr.forEach((d, i) => {
      const hh = new Date(d.datetime).getHours(), prob = d.precipitation_probability != null ? d.precipitation_probability : Math.min(100, (d.precipitation || 0) * 50);
      if (i % 2 === 0) html += `<span class="ab" style="left:${X(i)}%;top:0">${wx(d.condition, 30)}</span>`;
      if (i % 3 === 0) html += `<span class="ab tl" style="left:${X(i)}%;top:${76 + Y(d.temperature) - 12}px">${de(d.temperature, 0)}°</span>`;
      if (prob >= 5) html += `<i class="rb2" style="left:${X(i)}%;height:${Math.max(4, prob * .36)}px"></i>`;
      if (prob >= 25 && i % 2 === 0) html += `<span class="ab" style="left:${X(i)}%;bottom:${34 + prob * .36 + 6}px;color:#7dd3fc;font-size:11px">${Math.round(prob)}%</span>`;
      if (i % 2 === 0) html += `<span class="ab" style="left:${X(i)}%;bottom:6px">${String(hh).padStart(2, '0')}</span>`;
    });
    return `<div class="mgw"><div class="mg">${html}</div></div>`;
  }
  _vWeather() {
    if (this._wxMode === 'station') return this._vStation();
    const c = this._c, w = this._wxNow(), fc = this._fc?.daily || [], night = this._app?.dataset.tod === 'night';
    const wa = this._s(c.weather)?.attributes || {};
    const st = c.station, feels = this._feels(w.temp, w.hum, w.wind), dew = this._num(st.dew) ?? wa.dew_point ?? this._dew(w.temp, w.hum), d0 = fc[0];
    const uv = this._num(st.uv) ?? wa.uv_index ?? null, sol = this._num(st.solar), dayRain = this._num(st.dayRain), gm = this._num(st.maxGust), strikes = this._num(st.strikes), lastStrike = this._val(st.lastStrike), sDist = this._num(st.strikeDist);
    const WA = this._alerts().filter(a => ['warn', 'pre', 'bolt'].includes(a.id));
    const cloudy = ['partlycloudy', 'cloudy', 'rainy', 'pouring', 'lightning', 'lightning-rainy', 'snowy', 'snowy-rainy', 'fog', 'hail'].includes(w.cond);
    const clouds = (cloudy ? '<i class="cl c1"></i><i class="cl c2"></i><i class="cl c3"></i>' : '') + (w.cond === 'sunny' && !night ? '<i class="sunglow"></i>' : '');
    const lows = fc.map(d => d.templow ?? d.temperature - 5), gmn = Math.min(...lows, 99), gmx = Math.max(...fc.map(d => d.temperature), -99), g = Math.max(gmx - gmn, 1);
    const days = fc.slice(0, 7).map((d, i) => {
      const lo = d.templow ?? d.temperature - 5, l = (lo - gmn) / g * 100, wd = Math.max((d.temperature - lo) / g * 100, 8);
      return `<div class="dr ${i === 0 ? 'f' : ''}"><span class="dd">${i === 0 ? 'Heute' : new Date(d.datetime).toLocaleDateString('de-DE', { weekday: 'short' })}</span>${wx(d.condition, 30)}<span class="dp">${d.precipitation_probability != null && d.precipitation_probability >= 10 ? ic('drop', 11) + d.precipitation_probability + '%' : ''}</span><span class="dlo">${de(lo, 0)}°</span><div class="dbar"><i style="left:${l.toFixed(0)}%;width:${wd.toFixed(0)}%;background:linear-gradient(90deg,${tempCol(lo)},${tempCol(d.temperature)})"></i></div><span class="dhi">${de(d.temperature, 0)}°</span></div>`;
    }).join('');
    const sun = this._s(c.sun)?.attributes || {}, up = this._val(c.sun) === 'above_horizon';
    const nr = new Date(sun.next_rising).getTime(), ns = new Date(sun.next_setting).getTime(), left = Math.max(0, (up ? ns : nr) - Date.now()), lh = Math.floor(left / 36e5), lm = Math.floor(left % 36e5 / 6e4);
    const mo = this._moon();
    const rad = this._s(c.radar), pic = rad?.attributes?.entity_picture;
    const tile = (v, l, icon) => `<div class="dt"><div class="v">${v}</div><div class="l">${ic(icon, 13)}${l}</div></div>`;
    return `<div class="vh"><div><h1>Wetter</h1><p>${COND[w.cond] || w.cond}${feels != null ? ' · gefühlt ' + de(feels, 0) + '°' : ''}</p></div>${this._seg()}</div>
      ${WA.length ? `<div class="alerts">${WA.map(a => this._alertHtml(a)).join('')}</div>` : ''}<div class="bento">
        <div class="c sky s8" style="--i:0;background:${this._sky(w.cond, night)}">${clouds}<div class="skyin">
          <div class="wtop"><div><div class="hello" style="color:rgba(255,255,255,.75)">Jetzt bei dir</div><div class="wtemp big" data-count="${w.temp ?? 0}" data-d="1">${de(w.temp)}<small class="u" style="color:rgba(255,255,255,.8)">°</small></div><div class="wcond">${COND[w.cond] || w.cond}${feels != null ? ' · gefühlt ' + de(feels, 0) + '°' : ''}</div>${d0 ? `<div class="hl2">Höchstwert ${de(d0.temperature, 0)}° · Tiefstwert ${de(d0.templow ?? d0.temperature - 5, 0)}°</div>` : ''}</div>${wx(w.cond, 150)}</div>
          <div class="chips"><span class="chip">${ic('drop', 14)}Luftfeuchte <b>${de(w.hum, 0)} %</b></span><span class="chip">${ic('wind', 14)}Wind <b>${de(w.wind, 0)} ${esc(w.windU)}</b></span><span class="chip">${ic('rain', 14)}Regen <b>${de(w.rain ?? 0)} ${esc(w.rainU)}</b></span>${w.press ? `<span class="chip">${ic('radar', 14)}<b>${de(w.press, 0)} hPa</b></span>` : ''}</div></div></div>
        <div class="c s4" style="--i:1"><div class="h">${ic('sun', 14)}Sonne &amp; Mond</div>${this._sunArc()}
          <div class="srow" style="margin-top:8px"><span>${up ? 'Noch <b>' + lh + ' h ' + lm + ' min</b> Tageslicht' : 'Sonne in <b>' + lh + ' h ' + lm + ' min</b>'}</span></div>
          <div class="moon">${this._moonSvg(mo.p)}<div><b>${mo.name}</b>${Math.round(mo.ill * 100)} % beleuchtet</div></div></div>
        <div class="c s12 wxcard" style="--i:5">${this._wxCard() || `<div class="h">${ic('thermo', 14)}Die nächsten 24 Stunden<span class="r">Temperatur &amp; Regenwahrscheinlichkeit</span></div>${this._meteo()}`}</div>
        <div class="c s12 trcard" style="--i:6">${this._trCard() || `<div class="h">${ic('cloudsun', 14)}Die nächsten Tage</div>${days || '<div class="sk" style="height:200px"></div>'}`}</div>
        ${this._radarCard(7, 's12')}
      </div>`;
  }

  /* ───────────── Lüften (Smart Ventilation) ───────────── */
  _roomByName(n) {
    n = (n || '').trim().toLowerCase();
    return this._c.rooms.find(r => r.name.toLowerCase() === n || (r.id === 'bad' && /bad/.test(n)));
  }
  _ventData() {
    const s = this._s(this._c.stats.vent), a = s?.attributes || {};
    const rooms = (a.raeume || []).map(r => {
      const sen = r.entity_id ? this._s(r.entity_id) : null, at = sen?.attributes || {}, k = at.karte || {};
      return { ...r, name: (r.raum || '').trim(), k, ent: k.entitaeten || at.entitaeten || {}, best: at.bester_zeitpunkt || k.bester_zeitpunkt, rest: at.rest_minuten ?? k.rest_minuten, why: k.entscheidungsgrund || '' };
    });
    const live = r => r.laeuft || (r.lueften && !r.pausiert);
    const prio = rooms.filter(live).sort((x, y) => (y.laeuft - x.laeuft) || (y.dringlichkeit - x.dringlichkeit));
    const paused = rooms.filter(r => !live(r) && r.lueften).sort((x, y) => y.dringlichkeit - x.dringlichkeit);
    const ok = rooms.filter(r => !live(r) && !r.lueften);
    
    return { rooms, prio, paused, ok, sum: a.summe || {}, trend: a.trend_tage || [] };
  }
  _sVent() {
    const V = this._ventData(), su = V.sum, RC = { niedrig: '45,212,191', beobachten: '251,191,36', hoch: '251,113,133' };
    const risk = r => ({ niedrig: ['ok', 'Schimmelrisiko niedrig'], beobachten: ['warn', 'Schimmel beobachten'], hoch: ['bad', 'Schimmelrisiko hoch'] })[r] || ['', ''];
    const card = r => {
      const cfg = this._roomByName(r.name), col = RC[r.schimmelrisiko] || RC.niedrig, k = r.k;
      const open = (cfg && this._room(cfg).open) || k.fenster_offen > 0, C = 2 * Math.PI * 34;
      const frac = r.laeuft ? clamp((k.fortschritt || 0) / 100, 0, 1) : clamp((r.minuten || 0) / 20, 0, 1);
      const num = r.laeuft ? (r.rest ?? k.rest_minuten ?? 0) : r.minuten, lab = r.laeuft ? 'Min. rest' : 'Minuten';
      const rk = risk(r.schimmelrisiko), snooze = r.ent.snooze && this._s(r.ent.snooze), skip = r.ent.skip && this._s(r.ent.skip);
      return `<div class="vc ${r.entity_id ? 'tap' : ''}" style="--rc:${col}" ${r.entity_id ? `data-act="vroom" data-e="${r.entity_id}"` : ''}>
        <div class="vm"><svg viewBox="0 0 78 78"><circle cx="39" cy="39" r="34" fill="none" stroke="rgba(${WH},.12)" stroke-width="6"/><circle cx="39" cy="39" r="34" fill="none" stroke="rgb(${col})" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(C * frac).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 39 39)" style="filter:drop-shadow(0 0 6px rgb(${col}))"/></svg><div class="n"><div><b>${num}</b><span>${lab}</span></div></div></div>
        <div class="vb"><h3>${esc(r.name)}${r.laeuft ? '<span class="tag live">lüftet gerade</span>' : ''}</h3>
          <p>${esc(r.empfehlung || '')}</p>${r.why && r.why !== r.empfehlung ? `<p class="why">${esc(r.why)}</p>` : ''}
          <div class="tags">${rk[0] ? `<span class="tag ${rk[0]}">${rk[1]}</span>` : ''}${open && !r.laeuft ? `<span class="tag live">Fenster offen</span>` : ''}${k.innen_t != null ? `<span class="tag">innen ${de(k.innen_t)}° · ${de(k.innen_rh, 0)} %</span><span class="tag">außen ${de(k.aussen_t)}°</span>` : ''}${r.heute_kwh_netto ? `<span class="tag">${de(r.heute_kwh_netto, 2)} kWh heute</span>` : ''}</div>
          ${!r.laeuft && (snooze || skip) ? `<div class="vbs">${snooze ? `<button class="vbt" data-act="press" data-e="${r.ent.snooze}" data-msg="Erinnerung für ${esc(r.name)} 30 Min. ausgesetzt">${ic('play', 11)} 30 Min. später</button>` : ''}${skip ? `<button class="vbt" data-act="press" data-e="${r.ent.skip}" data-msg="${esc(r.name)}: heute nicht mehr erinnern">Heute nicht mehr</button>` : ''}</div>` : ''}
          ${r.laeuft ? `<div class="vbar"><i style="width:${(frac * 100).toFixed(0)}%"></i></div>` : ''}</div></div>`;
    };
    const row = r => {
      const cfg = this._roomByName(r.name);
      return `<div class="vr ${r.entity_id ? 'tap' : ''}" ${r.entity_id ? `data-act="vroom" data-e="${r.entity_id}"` : ''}><div class="ico">${ic(cfg?.icon || 'wind', 19)}</div><div><div class="t">${esc(r.name)}</div><div class="s">${ic('alert', 11)} ${esc(r.pausiert)}</div></div><div class="m">${r.minuten} Min.<small>${r.best ? 'Beste Zeit: ' + esc(r.best) : esc(r.empfehlung || '')}</small></div></div>`;
    };
    const mx = Math.max(...V.trend.map(t => t.anzahl), 1);
    const bars = V.trend.map((t, i) => `<div class="${i === V.trend.length - 1 ? 'today' : ''}"><b>${t.anzahl ? t.anzahl + '×' : ''}</b><i style="height:${Math.max(4, t.anzahl / mx * 78)}px"></i>${i === V.trend.length - 1 ? 'Heute' : new Date(t.datum).toLocaleDateString('de-DE', { weekday: 'short' })}</div>`).join('');
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('wind', 24)}</div><div><h2>Lüften</h2><p>${V.prio.length} jetzt · ${V.paused.length} später · ${V.ok.length} in Ordnung</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="vsum"><div class="vk hot"><div class="big">${V.prio.length}</div><div class="l">${V.prio.length === 1 ? 'Raum' : 'Räume'} jetzt zu lüften</div></div><div class="vk"><div class="big">${de(su.heute_eur_netto ?? 0, 2)}<small class="u">€</small></div><div class="l">Wärmeverlust heute · ${de(su.heute_kwh_netto ?? 0, 2)} kWh</div></div></div>
      <div class="lab2">PRIORITÄT · ${V.prio.length}</div>${V.prio.length ? V.prio.map(card).join('') : '<div class="empty">✨ Gerade muss nirgends gelüftet werden</div>'}
      ${V.paused.length ? `<div class="lab2">SPÄTER EMPFOHLEN · ${V.paused.length}</div>${V.paused.map(row).join('')}` : ''}
      ${V.ok.length ? `<div class="lab2">ALLES GUT · ${V.ok.length}</div><div class="okc">${V.ok.map(r => `<span ${r.entity_id ? `class="tap" data-act="vroom" data-e="${r.entity_id}"` : ''}>${ic('check', 14)}${esc(r.name)}</span>`).join('')}</div>` : ''}
      ${V.trend.length ? `<div class="lab2">LETZTE 7 TAGE</div><div class="sctl" style="display:block;margin-bottom:0"><div class="tr">${bars}</div></div>` : ''}`;
  }

  /* ───────────── Batterien, Kontakte, Hinweise ───────────── */
  _isBat(k) { const s = this._h.states[k]; return !!s && k.startsWith('sensor.') && s.attributes.device_class === 'battery'; }
  _isContact(k) {
    if (!k.startsWith('binary_sensor.')) return false;
    const dc = this._h.states[k]?.attributes?.device_class;
    return (dc === 'window' || dc === 'door' || dc === 'opening') && !/_status$|_window_open$|p2s_|klodeckel|^binary_sensor\.fenster_und_turen$/.test(k);
  }
  _clean(n) { return String(n || '').replace(/\s*(contact|kontakt|battery|batterie)\s*$/i, '').trim(); }
  _batteries() {
    const out = [];
    for (const k in this._h.states) if (this._isBat(k)) { const v = parseFloat(this._h.states[k].state); if (!isNaN(v)) out.push({ e: k, v, n: this._clean(this._name(k)) }); }
    out.sort((a, b) => a.v - b.v || a.n.localeCompare(b.n, 'de'));
    return { all: out, low: out.filter(b => b.v <= this._c.batteryLow) };
  }
  _contacts() {
    const all = [];
    for (const k in this._h.states) if (this._isContact(k) && this._val(k) !== 'unavailable') { const n = this._clean(this._name(k)); all.push({ e: k, n, open: this._val(k) === 'on', door: /fenster|window/i.test(n) ? false : /t(ü|ue)r|door/i.test(n) ? true : this._attr(k, 'device_class') === 'door', since: this._s(k)?.last_changed }); }
    all.sort((a, b) => (b.open - a.open) || a.n.localeCompare(b.n, 'de'));
    return { all, open: all.filter(x => x.open) };
  }
  _rel(ts) {
    const m = Math.round((Date.now() - new Date(ts).getTime()) / 6e4);
    if (isNaN(m)) return '–';
    return m < 2 ? 'gerade eben' : m < 60 ? `vor ${m} Min.` : m < 1440 ? `vor ${Math.round(m / 60)} Std.` : `vor ${Math.round(m / 1440)} ${Math.round(m / 1440) === 1 ? 'Tag' : 'Tagen'}`;
  }
  _plant() {
    const p = this._c.plant, s = this._s(p.entity);
    if (!s || !okv(s.state)) return null;
    const d = new Date(String(s.state).replace(' ', 'T'));
    if (isNaN(d)) return null;
    const days = Math.max(0, Math.floor((Date.now() - d) / 864e5));
    return { days, due: days >= p.days, last: d, a: s.attributes };
  }
  _printerInfo() {
    const s = this._s(this._c.printer.prefix + 'druckstatus');
    if (!s) return null;
    const st = s.state, offline = !okv(st) || st === 'offline';
    return { st, offline, running: st === 'running' || st === 'pause', pct: this._num(this._c.printer.prefix + 'druckfortschritt'), end: this._val(this._c.printer.prefix + 'endzeit') };
  }
  _alerts() {
    const c = this._c, A = [], wn = this._num(c.alerts.now) || 0, wp = this._num(c.alerts.pre) || 0;
    const LV = ['', 'Wetterwarnung', 'Markante Wetterwarnung', 'Unwetterwarnung', 'Extreme Unwetterwarnung'];
    if (wn > 0) A.push({ id: 'warn', crit: wn >= 3, cls: wn >= 3 ? 'bad' : 'warn', icon: 'alert', text: LV[Math.min(wn, 4)], sub: 'Stufe ' + wn, act: 'nav', attrs: 'data-v="weather"' });
    else if (wp > 0) A.push({ id: 'pre', cls: 'info', icon: 'alert', text: 'Vorabinformation Wetter', sub: 'Stufe ' + wp, act: 'nav', attrs: 'data-v="weather"' });
    const st = c.station, ls = this._val(st.lastStrike);
    if (okv(ls) && Date.now() - new Date(ls).getTime() < 90 * 6e4 && Date.now() >= new Date(ls).getTime() - 6e4) {
      const dist = this._num(st.strikeDist);
      A.push({ id: 'bolt', crit: true, cls: 'warn', icon: 'bolt', text: 'Blitze' + (dist != null ? ' in ' + de(dist, 0) + ' km' : ' in der Nähe'), sub: this._rel(ls), act: 'nav', attrs: 'data-v="weather"' });
    }
    const WL = this._waste();
    if (WL && WL.length && WL[0].days <= 1) { const nx = WL.filter(x => x.days === WL[0].days); A.push({ id: 'waste', cls: 'info', icon: 'trash', text: (WL[0].days === 0 ? 'Heute' : 'Morgen') + ': ' + nx.map(x => x.name).join(' + '), sub: '', act: 'waste', attrs: '' }); }
    const B = this._batteries(), DB = this._devBat(), dset = new Set(DB.map(d => d.e)), dis = DB.filter(d => d.v <= c.batteryLow && !d.charging);
    const gl = B.low.filter(b => !dset.has(b.e));
    if (gl.length) A.push({ id: 'bat', cls: gl[0].v <= 10 ? 'bad' : 'warn', icon: 'battery', text: `${gl.length} ${gl.length === 1 ? 'Batterie' : 'Batterien'} schwach`, sub: `${gl[0].n} ${de(gl[0].v, 0)} %`, act: 'bat' });
    if (dis.length) A.unshift({ id: 'devbat', crit: dis[0].v <= 10, cls: dis[0].v <= 10 ? 'bad' : 'warn', icon: 'battery', text: dis.length === 1 ? `Tablet-Akku ${de(dis[0].v, 0)} %` : `${dis.length} Geräte-Akkus schwach`, sub: dis[0].n, act: 'bat' });
    const pr = this._printerInfo();
    if (pr && !pr.offline && pr.running) A.push({ id: 'prn', cls: pr.st === 'pause' ? 'warn' : 'info', icon: 'printer', text: pr.st === 'pause' ? 'Druck pausiert' : `Druck läuft ${de(pr.pct, 0)} %`, sub: pr.end && okv(pr.end) ? 'fertig ' + hhmm(pr.end) : '', pct: pr.pct, act: 'nav', attrs: 'data-v="printer"' });
    else if (pr && !pr.offline && pr.st === 'failed') A.push({ id: 'prn', cls: 'bad', icon: 'printer', text: 'Druck fehlgeschlagen', sub: '', act: 'nav', attrs: 'data-v="printer"' });
    else if (pr && !pr.offline && pr.st === 'finish') { const ag = this._age(this._c.printer.prefix + 'druckstatus'); if (ag != null && ag < 3 * 36e5) A.push({ id: 'prn', cls: 'ok', icon: 'check', text: 'Druck fertig', sub: 'vor ' + this._agoTxt(ag), act: 'nav', attrs: 'data-v="printer"' }); }
    if (pr && !pr.offline && !(pr.st === 'failed') && (this._val(c.printer.error) === 'on' || this._val(c.printer.hms) === 'on')) A.push({ id: 'prerr', crit: true, cls: 'bad', icon: 'alert', text: 'Druckerfehler gemeldet', sub: '', act: 'nav', attrs: 'data-v="printer"' });
    A.push(...this._alertsHome());
    A.unshift(...this._tmrAlerts());
    return A;
  }
  _alertHtml(a) { return `<button class="al ${a.cls}${a.crit ? ' crit' : ''}" data-act="${a.act}" ${a.attrs || ''}>${ic(a.icon, 16)}<span>${esc(a.text)}${a.sub ? ` <small${a.tmr ? ` data-tmr="${a.tmr}"` : ''}>${esc(a.sub)}</small>` : ''}</span>${a.pct != null && !isNaN(a.pct) ? `<i class="alb"><u style="width:${clamp(a.pct, 0, 100)}%"></u></i>` : ''}</button>`; }

  /* ───────────── Termine ───────────── */
  async _loadCal() {
    if (this._calB || (this._cal && Date.now() - this._cal.t < 6e5)) return;
    this._calB = true;
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const y0 = t0.getFullYear(), mo0 = t0.getMonth(), m0 = new Date(y0, mo0, 1 - ((new Date(y0, mo0, 1).getDay() + 6) % 7)), m2 = new Date(y0, mo0 + 3, 8);
    const t1 = new Date(Math.max(+t0 + this._c.calendarDays * 864e5, +m2)), evs = [];
    const old = this._cal?.evs || []; let fails = 0;
    await Promise.all(this._c.calendars.map(async c => {
      if (!this._s(c[0]) || this._s(c[0]).state === 'unavailable') { fails++; evs.push(...old.filter(x => x.cal === c[0])); return; }
      try {
        const r = await this._h.callApi('GET', `calendars/${c[0]}?start=${encodeURIComponent(m0.toISOString())}&end=${encodeURIComponent(t1.toISOString())}`);
        for (const ev of r || []) {
          const allDay = !!(ev.start && ev.start.date), s = new Date(allDay ? ev.start.date + 'T00:00:00' : ev.start.dateTime);
          if (isNaN(s)) continue;
          let e = new Date(allDay ? (ev.end?.date || ev.start.date) + 'T00:00:00' : (ev.end?.dateTime || ev.start.dateTime));
          if (isNaN(e) || e <= s) e = new Date(+s + (allDay ? 864e5 : 36e5));
          evs.push({ cal: c[0], col: c[2], calName: c[1], title: ev.summary || '(ohne Titel)', loc: ev.location || '', allDay, s, e });
        }
      } catch (err) { fails++; evs.push(...old.filter(x => x.cal === c[0])); /* Kalender nicht erreichbar */ }
    }));
    this._cal = { t: fails ? Date.now() - 6e5 + 25e3 : Date.now(), evs };
    this._calB = false;
    if (fails) { clearTimeout(this._calRt); this._calRt = setTimeout(() => this._loadCal(), 26e3); }
    this._renderSoon();
  }
  _calList() {
    const now = new Date(), t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const horizon = +t0 + this._c.calendarDays * 864e5, list = [], cnt = {};
    for (const ev of this._cal.evs) {
      cnt[ev.cal] = (cnt[ev.cal] || 0) + 1;
      if (this._calOff.has(ev.cal)) continue;
      if (ev.allDay) { for (const d = new Date(Math.max(+ev.s, +t0)); d < ev.e && +d < horizon; d.setDate(d.getDate() + 1)) list.push({ ...ev, dk: +d, day: new Date(d) }); }
      else if (ev.e >= now && +ev.s < horizon) { const d = new Date(ev.s); d.setHours(0, 0, 0, 0); list.push({ ...ev, dk: Math.max(+d, +t0), day: new Date(Math.max(+d, +t0)) }); }
    }
    list.sort((a, b) => a.dk - b.dk || (b.allDay - a.allDay) || a.s - b.s);
    return { list, cnt, t0 };
  }
  _calGroups(list, t0) {
    let html = '', last = null;
    for (const ev of list) {
      if (ev.dk !== last) {
        last = ev.dk;
        const diff = Math.round((ev.dk - +t0) / 864e5);
        html += `<div class="dh"><b>${diff === 0 ? 'Heute' : diff === 1 ? 'Morgen' : ev.day.toLocaleDateString('de-DE', { weekday: 'long' })}</b>${ev.day.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}</div>`;
      }
      const tm = ev.allDay ? 'Ganztägig' : `${hhmm(ev.s)}<br><span style="color:var(--tx3)">${hhmm(ev.e)}</span>`;
      html += `<div class="ev" style="--ec:${ev.col}"><i></i><div style="min-width:0"><div class="t">${esc(ev.title)}</div><div class="s">${esc(ev.calName)}${ev.loc ? ' · ' + esc(ev.loc) : ''}</div></div><div class="tm">${tm}</div></div>`;
    }
    return html;
  }
  _calMap() {
    const M = new Map(); if (!this._cal) return M;
    for (const ev of this._cal.evs) {
      if (this._calOff.has(ev.cal)) continue;
      const d = new Date(ev.s); d.setHours(0, 0, 0, 0);
      const end = ev.allDay ? +ev.e : (ev.e > ev.s ? +ev.e - 1 : +ev.s);
      for (let n = 0; n < 70 && (ev.allDay ? +d < end : +d <= end); n++, d.setDate(d.getDate() + 1)) { const k = +d; if (!M.has(k)) M.set(k, []); M.get(k).push(ev); }
    }
    for (const a of M.values()) a.sort((x, y) => (y.allDay - x.allDay) || x.s - y.s);
    return M;
  }
  _calCard(i, n) {
    if (!this._c.calendars.some(c => this._s(c[0]))) return '';
    const open = `data-act="cal"`;
    if (!this._cal) return `<div class="c" style="--i:${i}"><div class="h">${ic('cal', 14)}Termine</div><div class="sk" style="height:140px"></div></div>`;
    const { list, t0 } = this._calList(), W = this._waste(), skipW = !!(W && W.length);
    const L = list.filter(ev => !(skipW && /müll|muell|abfall/i.test(ev.cal + ' ' + ev.calName))), lim = n || 4, shown = L.slice(0, lim), more = L.length - shown.length;
    let body = '', last = null;
    for (const ev of shown) {
      if (ev.dk !== last) {
        last = ev.dk; const diff = Math.round((ev.dk - +t0) / 864e5);
        body += `<div class="ccd"><b>${diff === 0 ? 'Heute' : diff === 1 ? 'Morgen' : ev.day.toLocaleDateString('de-DE', { weekday: 'long' })}</b>${ev.day.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })}</div>`;
      }
      body += `<div class="cc2" style="--ec:${ev.col}"><i></i><div class="t">${esc(ev.title)}</div><div class="w">${ev.allDay ? esc(ev.calName) : hhmm(ev.s)}</div></div>`;
    }
    if (!shown.length) body = `<div class="empty">🗓️ Keine Termine in den nächsten ${this._c.calendarDays} Tagen</div>`;
    return `<div class="c calc tap" style="--i:${i}" ${open}><div class="h">${ic('cal', 14)}Termine<span class="r">Kalender${ic('chevron', 13)}</span></div>${body}${more > 0 ? `<div class="ccm">+ ${more} weitere</div>` : ''}</div>`;
  }
  _sCal() {
    const head = `<div class="grab"></div><div class="sh"><div class="ico">${ic('cal', 24)}</div><div><h2>Kalender</h2><p>${this._calMode === 'list' ? `nächste ${this._c.calendarDays} Tage` : 'Monatsansicht'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!this._cal) return head + '<div class="sk" style="height:220px"></div>';
    const mode = this._calMode === 'list' ? 'list' : 'month';
    const tabs = `<div class="cal2tabs"><button class="${mode === 'month' ? 'on' : ''}" data-act="calmode" data-m="month">${ic('cal', 14)}Monat</button><button class="${mode === 'list' ? 'on' : ''}" data-act="calmode" data-m="list">${ic('list', 14)}Liste</button></div>`;
    const { list, cnt, t0 } = this._calList();
    const chips = this._c.calendars.filter(c => cnt[c[0]]).map(c => `<button class="${this._calOff.has(c[0]) ? '' : 'on'}" style="--ec:${c[2]}" data-act="calf" data-e="${c[0]}"><i></i>${esc(c[1])}</button>`).join('');
    const chipsH = chips ? `<div class="calf">${chips}</div>` : '';
    if (mode === 'list') return head + tabs + chipsH + (list.length ? this._calGroups(list, t0) : `<div class="empty">🗓️ Keine Termine</div>`);
    const mo = Math.max(0, Math.min(2, this._calMo || 0)), first = new Date(t0.getFullYear(), t0.getMonth() + mo, 1);
    const lead = (first.getDay() + 6) % 7, nd = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate(), weeks = Math.ceil((lead + nd) / 7);
    const M = this._calMap(), sel = this._calSel != null ? this._calSel : +t0;
    let cells = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => `<div class="cmw">${d}</div>`).join('');
    for (let k = 0; k < weeks * 7; k++) {
      const d = new Date(first.getFullYear(), first.getMonth(), 1 - lead + k), key = +d, evs = M.get(key) || [], cols = [...new Set(evs.map(e => e.col))].slice(0, 3);
      cells += `<button class="cmd${d.getMonth() !== first.getMonth() ? ' out' : ''}${key === +t0 ? ' today' : ''}${key === sel ? ' sel' : ''}" data-act="calday" data-d="${key}" aria-label="${d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}"><span class="n">${d.getDate()}</span><span class="dots">${cols.map(c => `<i style="--ec:${c}"></i>`).join('')}</span></button>`;
    }
    const sd = new Date(sel), sev = M.get(sel) || [], diff = Math.round((sel - +t0) / 864e5);
    const rows = sev.map(ev => `<div class="ev" style="--ec:${ev.col}"><i></i><div style="min-width:0"><div class="t">${esc(ev.title)}</div><div class="s">${esc(ev.calName)}${ev.loc ? ' · ' + esc(ev.loc) : ''}</div></div><div class="tm">${ev.allDay ? 'Ganztägig' : `${hhmm(ev.s)}<br><span style="color:var(--tx3)">${hhmm(ev.e)}</span>`}</div></div>`).join('');
    const nav = `<div class="cmh"><button data-act="calmo" data-n="-1" ${mo === 0 ? 'disabled' : ''} aria-label="Vorheriger Monat">${ic('chevron', 18).replace('<svg', '<svg style="transform:rotate(180deg)"')}</button><b>${first.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</b><button class="cmt" data-act="calmo" data-n="0">Heute</button><button data-act="calmo" data-n="1" ${mo === 2 ? 'disabled' : ''} aria-label="Nächster Monat">${ic('chevron', 18)}</button></div>`;
    return head + tabs + nav + `<div class="cmg">${cells}</div><div class="cmsel"><b>${diff === 0 ? 'Heute' : diff === 1 ? 'Morgen' : sd.toLocaleDateString('de-DE', { weekday: 'long' })}</b> · ${sd.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })}</div>${rows || `<div class="empty">Keine Termine</div>`}${chipsH ? `<div style="margin-top:14px">${chipsH}</div>` : ''}`;
  }

  /* ───────────── Pflanze, Batterien, Fenster ───────────── */
  _plantRow() {
    const P = this._plant(), L = this._plantsData(); if (!P && !L.length) return '';
    const dry = L.filter(x => x.dry).length, due = P && P.due, bad = dry > 0 || due;
    const sub = L.length ? (dry ? `<b style="color:#fbbf24">${dry} ${dry === 1 ? 'Pflanze braucht' : 'Pflanzen brauchen'} Wasser</b>` : 'Alle Pflanzen versorgt') + (P ? ' · gegossen ' + (P.days === 0 ? 'heute' : 'vor ' + P.days + (P.days === 1 ? ' Tag' : ' Tagen')) : '') : (P.days === 0 ? 'Heute gegossen' : 'zuletzt vor ' + P.days + (P.days === 1 ? ' Tag' : ' Tagen'));
    return `<div class="xr tapx" data-act="plants"><div class="ico" style="${bad ? 'background:rgba(251,191,36,.2);color:#fbbf24' : 'background:rgba(52,211,153,.14);color:#34d399'}">${ic('leaf', 19)}</div><div><div class="t">${esc(this._c.plant.name)}${!L.length && due ? ' · gießen' : ''}</div><div class="s">${sub}</div></div>${P ? `<button class="mpb main" style="margin-left:auto" data-act="plant" aria-label="Gegossen">${ic('drop', 18)}</button>` : ''}</div>`;
  }
  _batRow(b) {
    const cls = b.v <= 10 ? 'low' : b.v <= this._c.batteryLow ? 'mid' : '', col = b.v <= 10 ? '#fb7185' : b.v <= this._c.batteryLow ? '#fbbf24' : '#34d399';
    return `<div class="bt ${cls}" data-act="more" data-e="${b.e}" style="cursor:pointer"><div class="t">${esc(b.n)}</div><div class="pc2"><i style="width:${clamp(b.v, 2, 100)}%;background:${col}"></i></div><b>${de(b.v, 0)} %</b></div>`;
  }
  _batCard(i, cls = 's4') {
    const B = this._batteries(); if (!B.all.length) return '';
    const rows = (B.low.length ? B.low : B.all).slice(0, 4);
    return `<div class="c ${cls} tap" style="--i:${i}" data-act="bat"><div class="h">${ic('battery', 14)}Batterien<span class="r">${B.low.length ? B.low.length + ' schwach' : 'Alle okay'}</span></div>${rows.map(b => this._batRow(b)).join('')}<div class="card-note">${B.all.length} Geräte · tippen für alle</div></div>`;
  }
  _doorCard(i, cls = 's4') {
    const K = this._contacts(); if (!K.all.length) return '';
    const rows = K.open.slice(0, 5).map(k => `<div class="vr"><div class="ico" style="color:#fb923c">${ic(k.door ? 'door' : 'window', 19)}</div><div><div class="t">${esc(k.n)}</div></div><div class="m" style="color:#fb923c">offen</div></div>`).join('');
    return `<div class="c ${cls} tap" style="--i:${i}" data-act="doors"><div class="h">${ic('window', 14)}Fenster &amp; Türen<span class="r">${K.open.length ? K.open.length + ' offen' : 'Alles zu'}</span></div>${rows || `<div class="okc"><span>${ic('check', 14)}Alles geschlossen</span></div>`}<div class="card-note">${K.all.length} Kontakte · tippen für alle</div></div>`;
  }

  /* ───────────── Drucker (Bambu Lab) ───────────── */
  _pe(s) { return this._c.printer.prefix + s; }
  _pv(s) { const v = this._val(this._pe(s)); return okv(v) && v !== '' ? v : null; }
  _pn(s) { return this._num(this._pe(s)); }
  _hm(h) { if (h == null) return '–'; const m = Math.round(h * 60); return m >= 60 ? Math.floor(m / 60) + ' Std ' + String(m % 60).padStart(2, '0') + ' Min' : m + ' Min'; }
  _gauge(l, cur, tgt, mx, col) {
    const f = clamp((cur ?? 0) / mx, 0, 1), at = 135 + 270 * clamp((tgt ?? 0) / mx, 0, 1), tx = 60 + 46 * Math.cos(at * Math.PI / 180), ty = 60 + 46 * Math.sin(at * Math.PI / 180);
    return `<div class="gg"><svg viewBox="0 0 120 120"><path d="${arc(60, 60, 46, 135, 405)}" fill="none" stroke="rgba(${WH},.09)" stroke-width="9" stroke-linecap="round"/>${cur != null && f > .01 ? `<path d="${arc(60, 60, 46, 135, Math.max(135.5, 135 + 270 * f))}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" style="filter:drop-shadow(0 0 6px ${col})"/>` : ''}${tgt ? `<circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="5.500" fill="${FG}" style="filter:drop-shadow(0 0 5px rgba(${WH},.8))"/>` : ''}</svg><div class="gt"><div class="big">${cur != null ? de(cur, 0) : '–'}<small class="u">°</small></div></div><div class="gl">${l}${tgt ? '<span>Ziel ' + de(tgt, 0) + '°</span>' : ''}</div></div>`;
  }
  _tile(v, l, icon) { return `<div class="dt"><div class="v">${v}</div><div class="l">${ic(icon, 13)}${l}</div></div>`; }
  /* ───────────── Drucker: mehrere AMS + Live-Kamera ───────────── */
  _amsList() {
    const S = this._h.states, out = [];
    for (const k in S) {
      const m = /^sensor\.(.+)_slot_1$/.exec(k); if (!m || !S[`sensor.${m[1]}_slot_2`] || S[k].attributes?.empty === undefined && S[k].attributes?.filament_id === undefined && S[k].attributes?.type === undefined && !/ams/i.test(k)) continue;
      const b = m[1], f = (dom, ...n) => { for (const x of n) if (S[`${dom}.${b}_${x}`]) return `${dom}.${b}_${x}`; return `${dom}.${b}_${n[0]}`; };
      const num = /ams_?(\d+)$/i.exec(b);
      out.push({ b, num: num ? +num[1] : null, slot: n => `sensor.${b}_slot_${n}`, hum: f('sensor', 'luftfeuchtigkeit', 'humidity'), temp: f('sensor', 'temperatur', 'temperature'), dry: f('binary_sensor', 'trocknen', 'trocknen_2', 'drying'), on: S[`binary_sensor.${b}_aktiv`]?.state === 'on', alive: S[k].state !== 'unavailable' });
    }
    if (out.some(x => x.num == null) && !out.some(x => x.num === 1)) { const z = out.find(x => x.num == null); if (z) z.num = 1; }
    out.sort((a, b) => (a.num ?? 99) - (b.num ?? 99) || a.b.localeCompare(b.b));
    out.forEach((x, i) => { x.name = out.length > 1 ? 'AMS ' + (x.num ?? i + 1) : 'AMS'; });
    return out;
  }
  _camSrc(cam) {
    const a = cam.attributes || {}, ep = a.entity_picture; if (!this._camBound) this._camInit();
    if (this._c.printer.stream && a.access_token && !this._h.config?.mock) return `/api/camera_proxy_stream/${this._c.printer.camera}?token=${a.access_token}`;
    return this._camLast || ep || null;
  }
  /* Live-Bild: nächstes Einzelbild erst laden, wenn das vorige angekommen ist (so schnell, wie die Kamera liefert) */
  _camInit() {
    this._camBound = true;
    const step = async () => {
      if (!this._camBound) return;
      const cam = this._s(this._c.printer.camera), ep = cam?.attributes?.entity_picture, im = this._main?.querySelector('.camimg');
      if (this._v !== 'printer' || document.hidden || !im || !ep || ep[0] !== '/' || this._c.printer.stream) { this._camT = setTimeout(step, 1000); return; }
      try {
        const ac = new AbortController(), to = setTimeout(() => ac.abort(), 8000);
        let r; try { r = await fetch(ep + (ep.includes('?') ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store', signal: ac.signal }); } finally { clearTimeout(to); }
        if (!r.ok) throw 0;
        const u = URL.createObjectURL(await r.blob()), old = this._camLast; this._camLast = u; this._camAt = Date.now(); this._camFail = 0;
        { const bd = this._main.querySelector('.camstale'); if (bd) bd.innerHTML = this._camBadge(); }
        const el = this._main.querySelector('.camimg'); if (el) el.src = u;
        if (old) setTimeout(() => URL.revokeObjectURL(old), 3000);
        this._camT = setTimeout(step, 150);
      } catch (e) { this._camFail = (this._camFail || 0) + 1; const bd = this._main?.querySelector('.camstale'); if (bd) bd.innerHTML = this._camBadge(); this._camT = setTimeout(step, 2500); }
    };
    this._camT = setTimeout(step, 50);
  }
  _vPrinter() {
    const p = this._c.printer, P = this._printerInfo(), offline = !P || P.offline;
    const L = { running: 'Druckt', pause: 'Pausiert', finish: 'Fertig', failed: 'Fehlgeschlagen', idle: 'Bereit', prepare: 'Bereitet vor', slicing: 'Wird berechnet', init: 'Startet' };
    const SP = { silent: 'Leise', standard: 'Standard', sport: 'Sport', ludicrous: 'Rennmodus' };
    const pw = this._s(p.power) ? this._val(p.power) : null, lt = this._s(p.light) && this._val(p.light) !== 'unavailable' ? p.light : null;
    const cam = this._s(p.camera), pic = !offline && cam && cam.state !== 'unavailable' ? this._camSrc(cam) : null;
    const job = this._pv('name_der_aufgabe') || this._pv('gcode_dateiname'), stage = this._pv('aktueller_arbeitsschritt');
    const pct = P?.pct, lay = this._pn('aktuelle_schicht'), lays = this._pn('gesamtzahl_der_schichten'), rem = this._pn('verbleibende_zeit');
    const cls = !P || offline ? '' : P.st === 'running' ? 'live' : P.st === 'failed' ? 'bad' : P.st === 'pause' ? 'warn' : 'ok';
    const label = offline ? 'Offline' : (L[P.st] || P.st);
    const cost = this._num(p.cost), eJ = this._num(p.energyJob), eT = this._num(p.energyTotal), eY = this._num(p.energyYear), pW = this._num(p.powerW), vV = this._num(p.volt), fC = this._num(p.filamentCost);
    const hasErr = this._val(p.error) === 'on' || this._val(p.hms) === 'on';
    const toggles = `${pw != null && pw !== 'unavailable' ? `<button class="qb ${pw === 'on' ? 'on' : ''}" data-act="toggle" data-e="${p.power}">${ic('power', 14)}${pw === 'on' ? 'Steckdose an' : (offline ? 'Drucker einschalten' : 'Steckdose aus')}</button>` : ''}${lt ? `<button class="qb ${this._val(lt) === 'on' ? 'on' : ''}" data-act="toggle" data-e="${lt}">${ic('bulb', 14)}Druckraumlicht</button>` : ''}`;
    const hero = `<div class="c s8 prh" style="--i:0"><div class="prcam">${pic ? `<img class="camimg" src="${esc(pic)}" alt="Kamera">` : `<div class="prnone">${ic('printer', 54)}<span>${offline ? 'Drucker offline' : 'Keine Kamera'}</span></div>`}<span class="tag ${cls} prpill">${label}</span><span class="camstale">${pic ? this._camBadge() : ''}</span></div>
      <div class="prinfo"><div class="h" style="margin-bottom:8px">${ic('printer', 14)}${esc(p.name)}${hasErr ? '<span class="r" style="color:var(--bad)">Fehler gemeldet</span>' : ''}</div>
        ${offline ? `<div class="prtitle">Gerade nicht erreichbar</div><div class="hello">${pw === 'off' ? 'Die Steckdose ist ausgeschaltet.' : 'Keine Verbindung zum Drucker.'}</div>` : `<div class="prtitle">${esc(job || 'Kein aktiver Auftrag')}</div><div class="hello">${esc(stage ? stage.replace(/_/g, ' ') : (L[P.st] || ''))}</div>
          <div class="pbar"><i style="width:${clamp(pct ?? 0, 0, 100)}%"></i></div>
          <div class="prs"><div><b>${pct != null ? de(pct, 0) + ' %' : '–'}</b><span>Fortschritt</span></div><div><b>${lay != null ? de(lay, 0) + (lays != null ? ' / ' + de(lays, 0) : '') : '–'}</b><span>Schicht</span></div><div><b>${this._hm(rem)}</b><span>Rest</span></div><div><b>${P.end && okv(P.end) ? hhmm(P.end) : '–'}</b><span>Fertig um</span></div></div>`}
        <div class="prctl">${toggles}</div></div></div>`;
    const power = `<div class="c s4" style="--i:1"><div class="h">${ic('bolt', 14)}Strom &amp; Kosten</div><div class="dg" style="grid-template-columns:1fr 1fr">${this._tile(pW != null ? de(pW, 0) + '<small class="u">W</small>' : '–', 'Leistung', 'bolt')}${this._tile(vV != null ? de(vV, 0) + '<small class="u">V</small>' : '–', 'Spannung', 'plug')}${this._tile(eJ != null ? de(eJ, 2) + '<small class="u">kWh</small>' : '–', 'Aktueller Job', 'bolt')}${this._tile(cost != null ? de(cost, 2) + '<small class="u">€</small>' : '–', 'Kosten Druck', 'fuel')}${this._tile(eT != null ? de(eT, 0) + '<small class="u">kWh</small>' : '–', 'Gesamt', 'gauge')}${this._tile(eY != null ? de(eY, 0) + '<small class="u">kWh</small>' : '–', 'Dieses Jahr', 'cal')}</div>${fC ? `<div class="card-note">Filament: ${de(fC, 2)} €</div>` : ''}</div>`;
    const temps = `<div class="c s7" style="--i:2"><div class="h">${ic('thermo', 14)}Temperaturen</div><div class="ggs">${this._gauge('Düse', this._pn('temperatur_der_duse'), this._pn('zieltemperatur_der_duse'), 300, '#fb923c')}${this._gauge('Druckbett', this._pn('druckbetttemperatur'), this._pn('zieltemperatur_vom_druckbett'), 120, '#f472b6')}${this._gauge('Druckraum', this._pn('temperatur_im_druckraum'), null, 60, '#38bdf8')}</div></div>`;
    const fans = [['Bauteillüfter', 'bauteillufterdrehzahl'], ['Druckraumlüfter', 'druckraumlufterdrehzahl'], ['Druckkopflüfter', 'druckkopflufterdrehzahl'], ['Hotendlüfter', 'hotendlufterdrehzahl']].map(f => { const v = this._pn(f[1]); return `<div class="fan"><span>${f[0]}</span><div class="pc2"><i style="width:${clamp(v ?? 0, 0, 100)}%;background:#5eead4"></i></div><b>${v != null ? de(v, 0) + ' %' : '–'}</b></div>`; }).join('');
    const sp = this._pv('geschwindigkeitsprofil'), wifi = this._pn('wi_fi_signalqualitat');
    const fanc = `<div class="c s5" style="--i:3"><div class="h">${ic('wind', 14)}Lüfter &amp; Tempo</div>${fans}<div class="tags" style="margin-top:14px"><span class="tag">${ic('gauge', 12)}${esc(SP[sp] || sp || '–')}</span><span class="tag">WLAN ${wifi != null ? de(wifi, 0) + ' dBm' : '–'}</span>${this._val(p.door) === 'on' ? '<span class="tag warn">Gehäusetür offen</span>' : ''}</div></div>`;
    const AL = this._amsList();
    const amsCard = (A, cls, i) => {
      const slots = [1, 2, 3, 4].map(n => {
        const e = A.slot(n), s = this._s(e), a = s?.attributes || {}, ok = s && okv(s.state) && s.state !== 'empty' && a.empty !== true;
        const col = a.color ? '#' + String(a.color).replace('#', '').slice(0, 6) : null, rm = a.remain ?? a.remaining;
        return `<div class="spool ${a.active ? 'act' : ''}"><div class="sp-c" style="${ok && col ? `background:${col};box-shadow:0 0 22px ${col}66` : ''}">${ic('spool', 34)}</div><b>${ok ? esc(a.type || a.name || s.state) : (offline && !A.alive ? '–' : 'Leer')}</b><span>${ok && rm != null && rm >= 0 ? de(rm, 0) + ' %' : 'Slot ' + n}</span></div>`;
      }).join('');
      const ah = this._num(A.hum), at = this._num(A.temp), dry = this._val(A.dry) === 'on';
      return `<div class="c ${cls}" style="--i:${4 + i}"><div class="h">${ic('spool', 14)}${esc(A.name)}<span class="r">${dry ? 'Trocknet' : (A.on ? 'Aktiv' : '')}</span></div><div class="spools">${slots}</div><div class="tags" style="margin-top:14px"><span class="tag">${ic('drop', 12)}${ah != null ? de(ah, 0) + ' %' : '–'}</span><span class="tag">${ic('thermo', 12)}${at != null ? de(at, 1) + ' °C' : '–'}</span></div></div>`;
    };
    const many = AL.length > 1;
    const ams = AL.map((A, i) => amsCard(A, many ? 's6' : 's8', i)).join('');
    const wt = this._pn('gewicht_des_drucks'), ln = this._pn('drucklange'), tot = this._pn('gesamtnutzung'), nz = this._pv('dusentyp'), nzs = this._pn('dusengrosse');
    const facts = `<div class="c ${many ? 's12' : 's4'}" style="--i:6"><div class="h">${ic('list', 14)}Druckdaten</div><div class="dg" style="grid-template-columns:${many ? 'repeat(auto-fit,minmax(150px,1fr))' : '1fr 1fr'}">${this._tile(wt != null ? de(wt, 0) + '<small class="u">g</small>' : '–', 'Gewicht', 'gauge')}${this._tile(ln != null ? de(ln, 1) + '<small class="u">m</small>' : '–', 'Länge', 'list')}${this._tile(tot != null ? de(tot, 0) + '<small class="u">h</small>' : '–', 'Betriebszeit', 'cal')}${this._tile(nz ? esc(nz) + (nzs != null ? ' ' + de(nzs, 1) : '') : '–', 'Düse', 'printer')}</div></div>`;
    return `<div class="vh"><div><h1>Drucker</h1><p>${offline ? 'Offline' : label}${P && P.running && P.end && okv(P.end) ? ' · fertig um ' + hhmm(P.end) : ''}</p></div></div><div class="bento">${hero}${power}${temps}${fanc}${ams}${facts}</div>`;
  }

  /* ───────────── Wetterstation (Ecowitt) ───────────── */
  _sv(k) { return this._num(this._c.station[k]); }
  _enum(k) { const e = this._c.station[k], v = this._val(e); return !okv(v) || v === 'outside_calculable_range' ? '' : (ENUM[v] || String(v).replace(/_/g, ' ')); }
  _seg() { return `<div class="seg"><button class="${this._wxMode === 'fc' ? 'on' : ''}" data-act="wxmode" data-m="fc">${ic('cloudsun', 16)}Vorhersage</button><button class="${this._wxMode === 'station' ? 'on' : ''}" data-act="wxmode" data-m="station">${ic('radar', 16)}Wetterstation</button></div>`; }
  async _loadRain7() {
    const e = this._c.station.dayRain;
    if (!e || this._rb || (this._rn7t && Date.now() - this._rn7t < 6e5)) return;
    this._rb = true;
    const t0 = new Date(); t0.setHours(0, 0, 0, 0); t0.setDate(t0.getDate() - 6);
    try {
      const r = await this._h.callWS({ type: 'recorder/statistics_during_period', start_time: t0.toISOString(), statistic_ids: [e], period: 'day', types: ['change'] });
      const m = {}; for (const x of (r?.[e] || [])) m[new Date(x.start).toDateString()] = (m[new Date(x.start).toDateString()] || 0) + (x.change || 0);
      this._rn7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(+t0 + i * 864e5); return { d, v: m[d.toDateString()] || 0 }; });
    } catch (err) { this._rn7 = null; }
    this._rn7t = Date.now(); this._rb = false; this._renderSoon();
  }
  _gring(f, col, val, unit, label, sub) {
    const a1 = 135 + 270 * clamp(f, 0.015, 1);
    return `<div class="gr"><svg viewBox="0 0 120 120"><path d="${arc(60, 60, 48, 135, 405)}" fill="none" stroke="rgba(${WH},.09)" stroke-width="9" stroke-linecap="round"/>${f != null ? `<path d="${arc(60, 60, 48, 135, a1)}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" style="filter:drop-shadow(0 0 6px ${col})"/>` : ''}</svg><div class="gv"><b>${val}</b><small>${unit}</small></div><div class="gl2">${label}</div><div class="gs">${sub || '&nbsp;'}</div></div>`;
  }
  _vStation() {
    const c = this._c, st = c.station, w = this._wxNow(), night = this._app?.dataset.tod === 'night';
    const t = this._sv('temp') ?? w.temp, hum = this._sv('hum') ?? w.hum, feels = this._sv('feels'), dew = this._sv('dew');
    const cond = this._val(c.stationWeather) && okv(this._val(c.stationWeather)) ? this._val(c.stationWeather) : w.cond;
    this._need.add(st.temp); this._need.add(st.hum); this._need.add(st.press);
    const hpts = (this._hist[st.temp]?.pts || []).filter(p => !isNaN(p[1])), ht = hpts.map(p => p[1]);
    const mn = ht.length ? Math.min(...ht) : null, mx = ht.length ? Math.max(...ht) : null;
    const tOf = v => { const p = hpts.find(q => q[1] === v); return p ? hhmm(p[0]) : ''; };
    const hp = this._hist[st.press]?.pts?.map(p => p[1]) || [], dP = hp.length > 4 ? hp[hp.length - 1] - hp[0] : null;
    const upd = this._s(st.temp)?.last_updated, comf = this._enum('humidexL') || this._enum('dewL');
    const spd = this._sv('speed') ?? w.wind, uv = this._sv('uv'), sol = this._sv('solar'), lux = this._sv('lux');
    const uvL = uv == null ? '' : uv < 3 ? 'Niedrig' : uv < 6 ? 'Mäßig' : uv < 8 ? 'Hoch' : uv < 11 ? 'Sehr hoch' : 'Extrem';
    const uvC = uv == null ? '#94a3b8' : uv < 3 ? '#34d399' : uv < 6 ? '#fbbf24' : uv < 8 ? '#fb923c' : uv < 11 ? '#fb7185' : '#c084fc';
    const T = (v, d, u) => v == null ? '–' : de(v, d) + (u ? '<small class="u">' + u + '</small>' : '');
    const dirs = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'], bear = this._sv('dir'), dTxt0 = bear != null ? dirs[Math.round(bear / 45) % 8] + ' · ' + de(bear, 0) + '°' : '';
    const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
    const inR = c.rooms.filter(r => r.temp && !st.innen.exclude.includes(r.id)).map(r => [r.temp, r.hum, null, r.name]).concat(st.innen.extra.map(x => [x[1], x[2], null, x[0]])).filter(r => this._s(r[0]) && okv(this._val(r[0])));
    const inT = avg(inR.map(r => this._num(r[0])).filter(v => v != null)), inH = avg(inR.map(r => this._num(r[1])).filter(v => v != null));
    this._loadRain7();
    const r7 = this._rn7 && this._rn7.length ? this._rn7 : null;
    const spread = t != null && dew != null ? t - dew : null, fr = this._sv('frost');
    const warn = t != null && (t <= 2 || (fr != null && fr < 0 && t < 4)) ? ['Frostgefahr', '#93c5fd'] : spread != null && spread <= 1.5 && hum >= 95 ? ['Nebel möglich', '#cbd5e1'] : null;
    const batLow = st.batteryBin.some(e => this._val(e) === 'on');
    const hero = `<div class="c sky s5" style="--i:0;background:${this._sky(cond, night)}"><div class="skyin">
        <div class="wtop"><div><div class="hello" style="color:rgba(255,255,255,.75)">${esc(st.name)}</div><div class="wtemp big" data-count="${t ?? 0}" data-d="1">${de(t)}<small class="u" style="color:rgba(255,255,255,.8)">°</small></div><div class="wcond">${feels != null ? 'Gefühlt ' + de(feels, 1) + '°' : (COND[cond] || cond)}${comf ? ' · ' + esc(comf) : ''}</div></div>${wx(cond, 110)}</div>
        ${mn != null ? `<div class="hlr"><span style="color:#93c5fd">${ic('thermo', 14)}Tief <b>${de(mn, 1)}°</b><i>${tOf(mn)}</i></span><span style="color:#fda4af">${ic('thermo', 14)}Hoch <b>${de(mx, 1)}°</b><i>${tOf(mx)}</i></span></div>` : ''}
        <div class="chips">${dew != null ? `<span class="chip">${ic('thermo', 14)}Taupunkt <b>${de(dew, 1)}°</b></span>` : ''}${upd && this._rel(upd) !== '–' ? (this._stale(st.temp, 60) != null ? `<span class="chip stc">${ic('clock', 14)}Keine Daten seit <b>${this._agoTxt(this._stale(st.temp, 60))}</b></span>` : `<span class="chip">Aktualisiert <b>${this._rel(upd)}</b></span>`) : ''}${warn ? `<span class="chip" style="color:${warn[1]}">${ic('thermo', 14)}<b>${warn[0]}</b></span>` : ''}${batLow ? `<span class="chip stc">${ic('battery', 14)}<b>Batterie schwach</b></span>` : ''}</div></div></div>`;
    const rings = `<div class="c s7" style="--i:1"><div class="h">${ic('gauge', 14)}Jetzt<span class="r">Außen · Innen</span></div><div class="grs">
        ${this._gring(t == null ? 0 : clamp((t + 10) / 50, 0, 1), t == null ? '#94a3b8' : tempCol(t), de(t, 1), '°C', 'Außen', feels != null ? 'Gefühlt ' + de(feels, 1) + '°' : '')}
        ${this._gring(hum == null ? 0 : hum / 100, '#38bdf8', de(hum, 0), '%', 'Luftfeuchte', dew != null ? 'Taupunkt ' + de(dew, 1) + '°' : '')}
        ${this._gring(spd == null ? 0 : clamp(spd / 60, 0, 1), '#5eead4', de(spd, 1), 'km/h', 'Wind', dTxt0)}
        ${this._gring(inT == null ? 0 : clamp((inT - 5) / 30, 0, 1), inT == null ? '#94a3b8' : tempCol(inT), de(inT, 1), '°C', inR.length > 1 ? 'Innen Ø' : 'Innen', inH != null ? 'ohne Bad · ' + de(inH, 0) + ' %' : 'ohne Bad')}</div>
        ${inR.length ? `<div class="ins">${inR.map(r => `<div class="inc"><span class="n">${ic('home', 14)}${esc(r[3] || this._name(r[0]).replace(/^HP2550A_Pro_V[\d.]+\s*/i, '') || 'Innen')}</span><b>${de(this._num(r[0]), 1)}°</b><span class="hm">${this._num(r[1]) != null ? de(this._num(r[1]), 0) + ' %' : ''}</span></div>`).join('')}</div>` : ''}</div>`;
    const sunc = `<div class="c s4" style="--i:2"><div class="h">${ic('sun', 14)}Sonne &amp; Licht<span class="r" style="color:${uvC}">UV ${uv != null ? de(uv, 0) : '–'} · ${uvL || '–'}</span></div>${this._sunArc()}
        <div class="dg" style="grid-template-columns:1fr 1fr;margin-top:10px">${this._tile(T(sol, 0, 'W/m²'), 'Strahlung', 'sun')}${this._tile(lux == null ? '–' : lux >= 1000 ? de(lux / 1000, 1) + '<small class="u">klx</small>' : de(lux, 0) + '<small class="u">lx</small>', 'Helligkeit', 'bulb')}</div></div>`;
    const rr = [['Stunde', 'rainHour'], ['Heute', 'dayRain'], ['Woche', 'rainWeek'], ['Monat', 'rainMonth'], ['Jahr', 'rainYear']].map(r => [r[0], this._sv(r[1])]), rmax = Math.max(...rr.map(r => r[1] ?? 0), 1);
    const rate = this._sv('rainRate') || 0;
    const rain = `<div class="c s4" style="--i:3"><div class="h">${ic('rain', 14)}Regen<span class="r">${rate > 0 ? 'Es regnet' : 'Trocken'}</span></div>
        <div class="rrt"><div><div class="big" style="font-size:40px">${T(rate, 1)}</div><div class="l" style="font-size:12px;color:var(--tx2);margin-top:4px">mm/h · Rate</div></div><div><div class="big" style="font-size:40px">${T(this._sv('rainEvent') ?? 0, 1)}</div><div class="l" style="font-size:12px;color:var(--tx2);margin-top:4px">mm · Ereignis</div></div></div>
        ${rr.map(r => `<div class="rrow"><span>${r[0]}</span><div class="pc2" style="width:auto;flex:1"><i style="width:${clamp((r[1] ?? 0) / rmax * 100, r[1] ? 3 : 0, 100)}%;background:linear-gradient(90deg,#38bdf8,#818cf8)"></i></div><b>${r[1] != null ? de(r[1], r[0] === 'Jahr' ? 0 : 1) + ' mm' : '–'}</b></div>`).join('')}${r7 ? `<div class="r7h">Letzte 7 Tage</div><div class="r7">${r7.map(d => `<div><b>${d.v >= 0.05 ? de(d.v, 1) : ''}</b><i style="height:${Math.max(d.v >= 0.05 ? 4 : 2, d.v / Math.max(...r7.map(x => x.v), 1) * 38).toFixed(0)}px"></i><span>${d.d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '')}</span></div>`).join('')}</div>` : ''}</div>`;
    const dT = dP == null ? '' : Math.abs(dP) < 1 ? 'Stabil' : dP > 0 ? 'Steigend' : 'Fallend';
    const d3 = hp.length > 12 ? hp[hp.length - 1] - hp[hp.length - 10] : null;
    const pTxt = d3 == null ? '' : d3 <= -3 ? 'Druck fällt schnell – Sturm oder Unwetter möglich' : d3 <= -1 ? 'Druck fällt – Wetter wird unbeständiger' : d3 >= 3 ? 'Druck steigt schnell – rasche Besserung' : d3 >= 1 ? 'Druck steigt – Wetter beruhigt sich' : 'Druck stabil – kaum Änderung';
    const press = `<div class="c s4" style="--i:4"><div class="h">${ic('radar', 14)}Luftdruck<span class="r">${dT ? dT + ' · ' + (dP > 0 ? '+' : '') + de(dP, 1) + ' hPa' : ''}</span></div><div class="big" style="font-size:40px;margin-bottom:6px">${T(this._sv('press'), 1, 'hPa')}</div>${this._chart([{ e: st.press, name: 'Luftdruck', color: '#a78bfa' }], { h: 140, dec: 0 })}${pTxt ? `<div class="card-note" style="margin-top:8px">${pTxt} <small>(3 h: ${d3 > 0 ? '+' : ''}${de(d3, 1)} hPa)</small></div>` : ''}</div>`;
    const mgS = this._s(st.maxGust), gT = mgS && (this._sv('maxGust') || 0) > 0 && new Date(mgS.last_changed).toDateString() === new Date().toDateString() ? ' · ' + hhmm(mgS.last_changed) : '';
    const wind = `<div class="c s4" style="--i:6"><div class="h">${ic('wind', 14)}Wind</div>${this._compass({ ...w, wind: spd })}<div class="dg" style="margin-top:12px;grid-template-columns:1fr 1fr">${this._tile(T(this._sv('gust'), 0, 'km/h'), 'Böe jetzt', 'wind')}${this._tile(T(this._sv('maxGust'), 0, 'km/h'), (gT ? 'Max. Böe' + gT : 'Stärkste heute'), 'wind')}</div></div>`;
    const ls = this._val(st.lastStrike), dist = this._sv('strikeDist'), recent = okv(ls) && Date.now() - new Date(ls).getTime() < 90 * 6e4;
    const bolt = `<div class="c s4" style="--i:7"><div class="h">${ic('bolt', 14)}Blitze<span class="r" style="${recent ? 'color:var(--warm)' : ''}">${recent ? 'Aktiv in der Nähe' : 'Ruhig'}</span></div><div class="dg" style="grid-template-columns:1fr 1fr">${this._tile(T(this._sv('strikes'), 0), 'Heute', 'bolt')}${this._tile(T(dist, 0, 'km'), 'Entfernung', 'radar')}</div>${okv(ls) ? `<div class="card-note" style="margin-top:8px">Letzter Blitz: ${this._rel(ls)}</div>` : ''}</div>`;
    const hx = this._sv('humidex'), hxF = hx == null ? null : clamp((hx - 10) / 40, 0, 1);
    const hband = hxF == null ? '' : `<div class="hb"><div class="hbt"><i style="left:${(hxF * 100).toFixed(1)}%"></i></div><div class="hbl"><span>Kühl</span><span>Angenehm</span><span>Schwül</span><span>Hitze</span><span>Gefahr</span></div></div>`;
    const heat = `<div class="c s4" style="--i:8"><div class="h">${ic('flame', 14)}Hitze &amp; Komfort<span class="r">${esc(this._enum('humidexL') || '')}</span></div>${hband}<div class="dg heatg" style="margin-top:12px">${this._tile(T(feels, 1, '°'), 'Gefühlt', 'thermo')}${this._tile(T(this._sv('humidex'), 1, '°'), 'Humidex', 'sun')}${this._tile(T(this._sv('heat'), 1, '°'), 'Hitzeindex', 'flame')}</div></div>`;
    const bat = st.batteryPct.filter(e => this._s(e) && okv(this._val(e))).map(e => `<span class="bch"><i style="background:${this._num(e) < 25 ? '#fb7185' : '#34d399'}"></i>${esc(this._clean(this._name(e)).replace(/^HP2550A_Pro_V[\d.]+\s*/i, ''))} <b>${de(this._num(e), 0)} %</b></span>`);
    const bin = st.batteryBin.filter(e => this._s(e) && okv(this._val(e))).map(e => `<span class="bch"><i style="background:${this._val(e) === 'on' ? '#fb7185' : '#34d399'}"></i>${esc(this._name(e).replace(/^HP2550A_Pro_V[\d.]+\s*/i, ''))} <b>${this._val(e) === 'on' ? 'schwach' : 'OK'}</b></span>`);
    const sens = `<div class="c s4" style="--i:9"><div class="h">${ic('battery', 14)}Sensor-Batterien</div><div class="bchs">${bat.concat(bin).join('') || '<div class="empty">Keine Daten</div>'}</div></div>`;
    return `<div class="vh"><div><h1>Wetter</h1><p>${esc(st.name)}${upd && this._rel(upd) !== '–' ? ' · ' + this._rel(upd) : ''}</p></div>${this._seg()}</div>
      <div class="bento">${hero}${rings}${sunc}${rain}${press}
        <div class="c s8" style="--i:5"><div class="h">${ic('thermo', 14)}Temperatur &amp; Luftfeuchte<span class="r">24 h</span></div>${this._trend({ id: 'stn', temp: st.temp, hum: st.hum }, '#fb923c', { bare: true, h: 170 })}</div>
        ${wind}${heat}${bolt}${sens}</div>`;
  }

  /* ───────────── Sheets ───────────── */
  _sBat() {
    const B = this._batteries();
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('battery', 24)}</div><div><h2>Batterien</h2><p>${B.low.length ? B.low.length + ' schwach · ' : ''}${B.all.length} Geräte</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      ${B.low.length ? `<div class="lab2">SCHWACH · ${B.low.length}</div>${B.low.map(b => this._batRow(b)).join('')}` : '<div class="empty">✨ Alle Batterien sind in Ordnung</div>'}
      ${B.all.length > B.low.length ? `<div class="lab2">OKAY · ${B.all.length - B.low.length}</div>${B.all.filter(b => b.v > this._c.batteryLow).map(b => this._batRow(b)).join('')}` : ''}`;
  }
  _sDoors() {
    const K = this._contacts(), closed = K.all.filter(k => !k.open), nw = K.all.filter(k => !k.door).length, nd = K.all.length - nw, ow = K.open.filter(k => !k.door).length, od = K.open.length - ow;
    const tile = k => `<div class="ct ${k.open ? 'open' : ''}" data-act="more" data-e="${k.e}"><div class="bub">${ic(k.door ? 'door' : 'window', k.open ? 22 : 19)}</div><div class="tx"><div class="n">${esc(k.n)}</div><div class="s">${k.open ? 'offen' + (k.since && this._rel(k.since) !== '–' ? ' · ' + this._rel(k.since).replace('vor ', 'seit ').replace('gerade eben', 'gerade eben') : '') : 'zu'}</div></div></div>`;
    const part = (n, w, d) => n ? `${w ? `<span><b>${w}</b> ${w === 1 ? 'Fenster' : 'Fenster'}</span>` : ''}${d ? `<span><b>${d}</b> ${d === 1 ? 'Tür' : 'Türen'}</span>` : ''}` : '';
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('window', 24)}</div><div><h2>Fenster &amp; Türen</h2><p>${K.open.length ? K.open.length + ' von ' + K.all.length + ' offen' : 'Alles geschlossen'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="sum2"><div class="sbig cs ${K.open.length ? '' : 'ok'}">${K.open.length ? `<div class="big">${K.open.length}</div><span>von ${K.all.length} offen</span>` : `<span class="okl">${ic('check', 22)}Alles geschlossen</span>`}</div>
        <div class="cbox">${K.open.length ? part(1, ow, od) || '' : part(1, nw, nd)}<small>${K.open.length ? 'jetzt offen' : 'Kontakte gesamt'}</small></div></div>
      ${K.open.length ? `<div class="lab2">OFFEN · ${K.open.length}</div><div class="lg">${K.open.map(tile).join('')}</div>` : ''}
      ${closed.length ? `<div class="lab2">GESCHLOSSEN · ${closed.length}</div><div class="lg ctg">${closed.map(tile).join('')}</div>` : ''}`;
  }
  _sLights() {
    const ls = this._lights(), on = ls.filter(e => this._val(e) === 'on'), off = ls.filter(e => this._val(e) !== 'on');
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('bulb', 24)}</div><div><h2>Lichter</h2><p>${on.length} von ${ls.length} eingeschaltet</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="sum2"><div class="sbig"><div class="big">${on.length}</div><span>von ${ls.length} Lichtern an</span></div><button class="alloff" data-act="alloff">${ic('power', 22)}${this._armed ? 'Sicher?' : 'Alle aus'}</button></div>
      <div class="lab2">EINGESCHALTET · ${on.length}</div>${on.length ? `<div class="lg">${on.map(e => this._lightTile(e)).join('')}</div>` : '<div class="empty">✨ Alle Lichter sind aus</div>'}
      <div class="lab2">AUSGESCHALTET · ${off.length}</div>${off.length ? `<div class="lg">${off.map(e => this._lightTile(e)).join('')}</div>` : '<div class="empty">💡 Alle Lichter sind an</div>'}`;
  }
  _roomVent(r) {
    const V = this._ventData(), x = V.rooms.find(q => this._roomByName(q.name)?.id === r.id);
    if (!x) return '';
    const live = x.laeuft || (x.lueften && !x.pausiert);
    return `<div class="vr tap" style="margin-top:8px" data-act="vroom" data-e="${x?.entity_id || ''}"><div class="ico" style="${live ? 'color:#7dd3fc;background:rgba(56,189,248,.18)' : ''}">${ic('wind', 19)}</div><div><div class="t">${x.laeuft ? 'Lüftet gerade' : live ? 'Jetzt lüften' : x.lueften ? 'Später lüften' : 'Lüften nicht nötig'}</div><div class="s">${esc(x.empfehlung || '')}</div></div><div class="m">${x.minuten ? x.minuten + ' Min.' : ''}<small>Smart Ventilation</small></div></div>`;
  }
  /* Medien-Fähigkeiten nach HA-supported_features (PAUSE=1, VOLUME_SET=4, STOP=4096, VOLUME_STEP=1024, PLAY=16384) */
  _mpCaps(e) {
    const f = this._attr(e, 'supported_features') || 0;
    return { pause: !!(f & 1), play: !!(f & 16384), stop: !!(f & 4096), vol: !!(f & (4 | 1024)), pp: !!(f & 1) && !!(f & 16384) };
  }
  _mpBtns(e, pl) {
    const c = this._mpCaps(e), b = (s, ico, l, main) => `<button class="mpb${main ? ' main' : ''}" data-act="mp" data-e="${e}" data-s="${s}" aria-label="${l}">${ic(ico, 18)}</button>`;
    let main = '';
    if (pl) main = c.pause ? b('media_pause', 'pause', 'Pause', 1) : c.stop ? b('media_stop', 'close', 'Stopp', 1) : '';
    else if (c.play) main = b('media_play', 'play', 'Wiedergabe', 1);
    return (c.vol ? b('volume_down', 'minus', 'Leiser') : '') + main + (c.vol ? b('volume_up', 'plus', 'Lauter') : '');
  }
  _sRoom(r) {
    const I = this._room(r), cl = I.cl, heat = I.act === 'heating', off = I.mode === 'off';
    const rank = { playing: 0, paused: 1, buffering: 1, idle: 2, on: 3, standby: 4, off: 5 }, groups = new Map();
    (r.media || []).forEach((item, gi) => {
      for (const e of (Array.isArray(item) ? item : [item])) {
        const s = this._s(e); if (!s || s.state === 'unavailable') continue;
        const k = Array.isArray(item) ? 'g' + gi : 'n:' + (s.attributes.friendly_name || e);
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push(e);
      }
    });
    // pro Gerät den Eintrag mit dem größten Funktionsumfang (Play/Pause) nehmen, danach den aktivsten Zustand
    const score = e => (this._mpCaps(e).pp ? 0 : 20) + (rank[this._val(e)] ?? 9);
    const seenM = new Map([...groups].map(([k, l]) => [k, l.slice().sort((a, b) => score(a) - score(b))[0]]));
    const media = [...seenM.values()].map(e => {
      const s = this._s(e), st = s.state, t = s.attributes.media_title, live = ['playing', 'paused', 'idle', 'on', 'standby', 'buffering'].includes(st), pl = st === 'playing';
      return `<div class="xr mpr"><div class="ico" style="${pl ? 'background:rgba(94,234,212,.2);color:#5eead4' : ''}">${ic(/tv/.test(e) ? 'tv' : 'play', 19)}</div><div class="grow" data-act="more" data-e="${e}"><div class="t">${esc(s.attributes.friendly_name || e)}</div><div class="s">${esc(t || ({ playing: 'Spielt', paused: 'Pausiert', idle: 'Bereit', off: 'Aus', standby: 'Standby', on: 'An' })[st] || st)}</div></div>
        ${live ? this._mpBtns(e, pl) : ''}</div>`;
    }).join('');
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic(r.icon, 24)}</div><div><h2>${esc(r.name)}</h2><p>${I.temp != null ? de(I.temp) + ' °C' : ''}${I.hum != null ? ' · ' + de(I.hum, 0) + ' % Luftfeuchte' : ''}${I.open ? ' · Fenster offen' : ''}${I.stale != null ? ` · <span class="stl">Sensor seit ${this._agoTxt(I.stale)} ohne Meldung</span>` : ''}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      ${cl ? `<div class="sctl"><div class="htap" data-act="heat" data-room="${r.id}" role="button" aria-label="Heizung öffnen">${off ? `<div class="big" style="font-size:46px">Aus</div>` : `<div class="big">${de(I.target)}<small class="u">°</small></div>`}<div class="l">${off ? 'Heizung ist ausgeschaltet' : heat ? 'Heizt auf Zieltemperatur' : 'Zieltemperatur'}<span class="hmore">Heizung ${ic('chevron', 12)}</span></div></div>
        <div style="display:flex;gap:10px;align-items:center">${off ? `<button class="qb on" data-act="hvac" data-e="${r.climate}">${ic('power', 16)}Einschalten</button>` : `<button class="rbn" data-act="temp" data-e="${r.climate}" data-d="-0.5">${ic('minus', 22)}</button><button class="rbn" data-act="temp" data-e="${r.climate}" data-d="0.5">${ic('plus', 22)}</button><button class="rbn" style="color:#fb923c;background:rgba(251,146,60,.2)" data-act="hvac" data-e="${r.climate}">${ic('power', 20)}</button>`}</div></div>` : ''}
      ${this._humHint(r, I)}${this._trend(r, I.temp != null ? tempCol(I.temp) : '#fb923c')}
      ${this._roomVent(r)}
      ${I.lights.length ? `<div class="lab2">LICHTER · ${I.on.length}/${I.lights.length}</div><div class="lg">${I.lights.map(e => this._lightTile(e)).join('')}</div>` : ''}
      ${media ? `<div class="lab2">MEDIEN</div><div class="mcol">${media}</div>` : ''}`;
  }

  /* ───────────── v5: Theme ───────────── */
  _isLight() {
    const p = this._themePref || this._c?.theme || 'dark';
    if (p === 'light') return true;
    if (p === 'auto') return this._h?.themes?.darkMode === false;
    return false;
  }
  _applyTheme() {
    const l = this._isLight(); this._light = l;
    WH = l ? '15,23,42' : '255,255,255'; FG = l ? '#334155' : '#fff';
    if (this._app) this._app.classList.toggle('light', l);
  }

  /* ───────────── v5: Müll ───────────── */
  _waste() {
    const s = this._s(this._c.extras.waste); if (!s) return null;
    const N = this._c.wasteNames, t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const list = [];
    for (const k in N) {
      const v = s.attributes[k]; if (!v) continue;
      const d = new Date(String(v).slice(0, 10) + 'T00:00:00'); if (isNaN(d)) continue;
      const days = Math.round((d - t0) / 864e5);
      if (days >= 0) list.push({ k, name: N[k][0], col: N[k][1], d, days });
    }
    return list.sort((a, b) => a.days - b.days);
  }
  _sWaste() {
    const WL = this._waste() || [], ico = { papier: 'news', gelbe_tonne: 'recycle', biomuell: 'flower', restmuell: 'trash', schadstoffe: 'truck' };
    const rgb = hex => { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return '148,163,184'; const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(','); };
    const rel = x => x.days === 0 ? 'Heute' : x.days === 1 ? 'Morgen' : `in ${x.days} Tagen`;
    const dt = x => x.d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
    const head = `<div class="grab"></div><div class="sh"><div class="ico">${ic('trash', 24)}</div><div><h2>Abfallkalender</h2><p>${WL.length ? 'Nächste Abholung: ' + (WL[0].days === 0 ? 'heute' : WL[0].days === 1 ? 'morgen' : 'in ' + WL[0].days + ' Tagen') : 'Keine Termine bekannt'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!WL.length) return head + `<div class="empty">🗑️ Keine kommenden Abholtermine gefunden${this._s(this._c.extras.waste) ? '' : ' (Sensor ' + esc(this._c.extras.waste) + ' fehlt)'}</div>`;
    const nx = WL.filter(x => x.days === WL[0].days), tip = WL[0].days === 1 ? 'Tonne heute Abend rausstellen.' : WL[0].days === 0 ? 'Heute ist Abholung – Tonne sollte draußen stehen.' : '';
    const hero = WL[0].days <= 1 ? `<div class="big sm">${WL[0].days === 0 ? 'Heute' : 'Morgen'}</div><span>${esc(nx.map(x => x.name).join(' + '))}</span>` : `<div class="big">${WL[0].days}</div><span>Tage bis ${esc(nx.map(x => x.name).join(' + '))}</span>`;
    const card = x => `<div class="wc ${x.days === WL[0].days ? 'nx' : ''}" style="--c:${rgb(x.col)}"><div class="bub">${ic(ico[x.k] || 'trash', 24)}</div><div class="tx"><div class="n">${esc(x.name)}</div><div class="s">${dt(x)}${x.days <= 1 ? '' : ' · ' + rel(x)}</div></div>${x.days <= 1 ? `<div class="bd">${x.days === 0 ? 'Heute' : 'Morgen'}</div>` : ''}</div>`;
    return head + `<div class="sum2"><div class="sbig wh" style="--c:${rgb(WL[0].col)}">${hero}</div><div class="cbox"><b>${dt(WL[0])}</b><small>nächster Termin</small></div></div>
      ${tip ? `<div class="card-note" style="margin-top:4px">${tip}</div>` : ''}
      <div class="lab2">ALLE TERMINE · ${WL.length}</div><div class="wl">${WL.map(card).join('')}</div>`;
  }
  _dayName(d) { const t0 = new Date(); t0.setHours(0, 0, 0, 0); const x = new Date(d); x.setHours(0, 0, 0, 0); const n = Math.round((x - t0) / 864e5); return n <= 0 ? 'Heute' : n === 1 ? 'Morgen' : x.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' }); }
  _dayTxt(x) { return x.days === 0 ? 'Heute' : x.days === 1 ? 'Morgen' : x.d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' }); }

  /* ───────────── v5: Schnellaktionen ───────────── */
  _quick() {
    const q = this._quickList().filter(x => x[0].startsWith('builtin:') || this._s(x[0])), TG = /^(light|switch|input_boolean|fan)\./;
    return `<div class="qa">${q.map(x => `<button class="qp${TG.test(x[0]) && this._val(x[0]) === 'on' ? ' on' : ''}" data-act="quick" data-e="${esc(x[0])}">${ic(x[2] || 'sparkle', 16)}<span>${esc(x[1])}</span></button>`).join('')}<button class="qp qe" data-act="qedit" aria-label="Schnellaktionen anpinnen oder bearbeiten">${ic(q.length ? 'plus' : 'sparkle', 16)}${q.length ? '' : '<span>Schnellaktionen anpinnen</span>'}</button></div>`;
  }
  _quickRun(e) {
    const h = this._h;
    if (e === 'builtin:goodnight') {
      const on = this._lightsOn().filter(l => l !== this._c.printer.light), open = this._openRooms();
      if (on.length) h.callService('light', 'turn_off', { entity_id: on });
      this._toast(`Gute Nacht 🌙 · ${on.length ? on.length + (on.length === 1 ? ' Licht aus' : ' Lichter aus') : 'alle Lichter aus'}${open.length ? ' · Fenster offen: ' + open.join(', ') : ' · alle Fenster zu'}`, open.length ? 5200 : 3200);
      return;
    }
    const d = dom(e), nm = this._name(e);
    if (d === 'button' || d === 'input_button') h.callService(d, 'press', { entity_id: e });
    else if (['light', 'switch', 'input_boolean', 'fan', 'humidifier'].includes(d)) { const on = this._val(e) === 'on'; h.callService(d, on ? 'turn_off' : 'turn_on', { entity_id: e }); this._toast(nm + (on ? ' aus' : ' an')); return; }
    else if (d === 'cover') h.callService('cover', 'toggle', { entity_id: e });
    else if (d === 'automation') h.callService('automation', 'trigger', { entity_id: e });
    else h.callService(d, 'turn_on', { entity_id: e });
    this._toast(nm + ' ausgeführt');
  }

  /* ───────────── v5: Systemstatus ───────────── */
  async _loadSys(force) {
    if (this._sysB || (!force && this._sys && Date.now() - this._sys.t < 3e5)) return;
    this._sysB = true;
    let issues = [];
    try { const r = await this._h.callWS({ type: 'repairs/list_issues' }); issues = (r?.issues || []).filter(i => !i.ignored); } catch (e) { issues = []; }
    this._sys = { t: Date.now(), issues };
    this._sysB = false;
    this._renderSoon();
  }
  _sysData() {
    const h = this._h, crit = new Set(this._c.critical), ig = this._c.ignore || [], ups = [], cr = [], other = {}, plat = {};
    for (const k in h.states) {
      if (ig.some(x => k.includes(x))) continue;
      const s = h.states[k], d = dom(k);
      if (d === 'update') { if (s.state === 'on') ups.push({ e: k, n: this._name(k).replace(/\s*(Update|update)$/, ''), cur: s.attributes.installed_version, lat: s.attributes.latest_version }); continue; }
      if (s.state !== 'unavailable') continue;
      const pl = h.entities?.[k]?.platform || '–'; plat[pl] = (plat[pl] || 0) + 1;
      if (crit.has(d)) cr.push(k); else other[d] = (other[d] || 0) + 1;
    }
    cr.sort((a, b) => this._name(a).localeCompare(this._name(b), 'de'));
    const iss = this._sys?.issues || [], nOther = Object.values(other).reduce((a, b) => a + b, 0);
    const bad = iss.some(i => i.severity === 'critical' || i.severity === 'error');
    const lvl = bad ? 'bad' : (ups.length || iss.length || cr.length) ? 'warn' : 'ok';
    return { ups, cr, other, nOther, iss, lvl, plat };
  }
  _sysRow() {
    const D = this._sysData(), parts = [];
    if (D.cr.length) parts.push(`${D.cr.length} Gerät${D.cr.length === 1 ? '' : 'e'} offline`);
    if (D.iss.length) parts.push(`${D.iss.length} Reparatur${D.iss.length === 1 ? '' : 'en'}`);
    if (D.ups.length) parts.push(`${D.ups.length} Update${D.ups.length === 1 ? '' : 's'}`);
    const tail = D.nOther ? ` · ${D.nOther} weitere inaktiv` : '';
    const col = D.lvl === 'bad' ? '#fb7185' : D.lvl === 'warn' ? '#fbbf24' : '#34d399';
    return `<button class="xr" data-act="sys"><div class="ico" style="color:${col};background:${col}22">${ic(D.lvl === 'ok' ? 'check' : 'wrench', 19)}</div><div><div class="t">System</div><div class="s">${esc((parts.length ? parts.join(' · ') : 'Alles in Ordnung') + tail)}</div></div><span class="dot" style="background:${col};color:${col}"></span></button>`;
  }
  _sSys() {
    const D = this._sysData();
    const row = (ico, t, s, e, m, col) => `<div class="vr ${e ? 'tap' : ''}" ${e ? `data-act="more" data-e="${esc(e)}"` : ''}><div class="ico" style="${col ? `color:${col};background:${col}22` : ''}">${ic(ico, 19)}</div><div><div class="t">${esc(t)}</div>${s ? `<div class="s">${esc(s)}</div>` : ''}</div>${m ? `<div class="m">${esc(m)}</div>` : ''}</div>`;
    const prettyIssue = i => String(i.translation_key || i.issue_id || '').replace(/[_\-]+/g, ' ');
    const oth = Object.entries(D.other).sort((a, b) => b[1] - a[1]);
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('wrench', 24)}</div><div><h2>Systemstatus</h2><p>${D.lvl === 'ok' ? 'Alles Wichtige in Ordnung' : 'Es gibt Hinweise'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="lab2">UPDATES · ${D.ups.length}</div>${D.ups.length ? D.ups.map(u => row('refresh', u.n, u.cur && u.lat ? `${u.cur} → ${u.lat}` : '', u.e, 'verfügbar', '#38bdf8')).join('') : '<div class="empty">✨ Alles ist aktuell</div>'}
      <div class="lab2">REPARATUREN · ${D.iss.length}</div>${D.iss.length ? D.iss.map(i => row('alert', (i.domain || 'System') + ' · ' + prettyIssue(i), i.severity ? 'Schwere: ' + i.severity : '', '', '', i.severity === 'warning' ? '#fbbf24' : '#fb7185')).join('') + '<div class="card-note">Details unter Einstellungen › System › Reparaturen</div>' : `<div class="empty">${this._sys ? '✨ Keine offenen Reparaturen' : 'Wird geladen …'}</div>`}
      <div class="lab2">NICHT VERFÜGBAR · WICHTIG · ${D.cr.length}</div>${D.cr.length ? D.cr.map(e => row(dom(e) === 'light' ? 'bulb' : dom(e) === 'climate' ? 'thermo' : 'plug', this._name(e), e, e, 'offline', '#fb7185')).join('') : '<div class="empty">✨ Alle wichtigen Geräte sind erreichbar</div>'}
      ${Object.keys(D.plat).length ? `<div class="lab2">OFFLINE NACH INTEGRATION</div><div class="calf" style="flex-wrap:wrap">${Object.entries(D.plat).sort((a, b) => b[1] - a[1]).map(o => `<button class="on" style="--ec:#fb923c;cursor:default"><i></i>${esc(o[0])} · ${o[1]}</button>`).join('')}</div><div class="card-note">So siehst du, welche Integration die meisten toten Entitäten verursacht – zum Aufräumen unter Einstellungen › Geräte & Dienste.</div>` : ''}
      ${oth.length ? `<div class="lab2">WEITERE NICHT VERFÜGBAR · ${D.nOther}</div><div class="calf" style="flex-wrap:wrap">${oth.map(o => `<button class="on" style="--ec:#94a3b8;cursor:default"><i></i>${esc(o[0])} · ${o[1]}</button>`).join('')}</div>` : ''}`;
  }

  /* ───────────── v5: Strom ───────────── */
  async _loadPower(force) {
    if (this._pwb || (!force && this._pw && Date.now() - this._pw.t < 3e5)) return;
    const ids = this._c.power.devices.map(d => d[1]).filter(e => e && this._s(e));
    if (!ids.length) return;
    this._pwb = true;
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    let today = null;
    try {
      const r = await this._h.callWS({ type: 'recorder/statistics_during_period', start_time: t0.toISOString(), statistic_ids: ids, period: 'hour', types: ['change'] });
      today = {}; for (const id of ids) today[id] = (r?.[id] || []).reduce((a, x) => a + (x.change || 0), 0);
    } catch (e) { today = null; }
    this._pw = { t: Date.now(), today: today || {}, ok: !!today };
    this._pwb = false;
    this._renderSoon();
  }
  _powerData() {
    const c = this._c.power, devs = [];
    for (const d of c.devices) {
      if (!this._s(d[0]) && !this._s(d[1])) continue;
      let w = this._num(d[0]); if (w != null && /^kw$/i.test(this._unit(d[0]))) w *= 1000;
      devs.push({ rate: d[0], en: d[1], n: d[2], icon: d[3] || 'plug', w: w ?? 0, kwh: this._pw?.ok ? (this._pw.today[d[1]] ?? null) : null });
    }
    devs.sort((a, b) => b.w - a.w || a.n.localeCompare(b.n, 'de'));
    const total = devs.reduce((a, d) => a + d.w, 0), kwh = this._pw?.ok ? devs.reduce((a, d) => a + (d.kwh || 0), 0) : null;
    const pv = c.pv || {}, pvn = k => (pv[k] && this._s(pv[k])) ? this._num(pv[k]) : null;
    return { devs, total, kwh, pv: { now: pvn('now'), today: pvn('today'), tomorrow: pvn('tomorrow'), remaining: pvn('remaining') } };
  }
  _powerCard(i) {
    const P = this._powerData(); if (!P.devs.length) return '';
    const act = P.devs.filter(d => d.w >= 1).slice(0, 4), mx = Math.max(...act.map(d => d.w), 1);
    const col = P.total > 800 ? '#fb923c' : P.total > 300 ? '#fbbf24' : '#34d399';
    const rows = act.length ? act.map(d => `<div class="bt"><div class="t">${esc(d.n)}</div><div class="pc2"><i style="width:${clamp(d.w / mx * 100, 4, 100)}%;background:${col}"></i></div><b>${de(d.w, 0)} W</b></div>`).join('') : `<div class="okc"><span>${ic('check', 14)}Alle Geräte im Standby</span></div>`;
    return `<div class="c tap" style="--i:${i}" data-act="power"><div class="h">${ic('bolt', 14)}Strom<span class="r">${P.devs.length} Geräte</span></div>
      <div class="pwr"><div class="big" style="font-size:44px;color:${col}">${de(P.total, 0)}<small class="u"> W</small></div><div class="pwk">${P.kwh != null ? `<b>${de(P.kwh, 1)}</b> kWh heute` : 'jetzt gemessen'}</div></div>${rows}
      ${P.pv.today != null ? `<div class="card-note">☀️ Solar-Prognose heute ${de(P.pv.today, 1)} kWh</div>` : '<div class="card-note">tippen für alle Geräte</div>'}</div>`;
  }
  _sPower() {
    const P = this._powerData(), pr = this._price(), rg = this._pwr || 0;
    const pal = ['#fbbf24', '#fb923c', '#38bdf8', '#a78bfa', '#34d399'];
    const top = P.devs.filter(d => d.w >= 1).slice(0, 4);
    const series = (top.length ? top : P.devs.slice(0, 3)).filter(d => this._s(d.rate)).map((d, i) => ({ e: d.rate, name: d.n, color: pal[i % pal.length] }));
    const mx = Math.max(...P.devs.map(d => d.w), 1);
    const cost = pr && P.kwh != null ? de(P.kwh * pr, 2) + ' €' : null;
    const row = d => `<div class="vr tap" data-act="more" data-e="${esc(d.rate)}"><div class="ico" style="${d.w >= 1 ? 'color:#fbbf24;background:rgba(251,191,36,.16)' : ''}">${ic(d.icon, 19)}</div><div><div class="t">${esc(d.n)}</div><div class="pc2" style="margin-top:6px"><i style="width:${d.w >= 1 ? clamp(d.w / mx * 100, 3, 100) : 0}%;background:#fbbf24"></i></div>${d.kwh != null ? `<div class="s">${de(d.kwh, 2)} kWh heute</div>` : ''}</div><div class="m">${de(d.w, 0)} W</div></div>`;
    const pvRow = P.pv.today != null || P.pv.now != null ? `<div class="lab2">SOLAR-PROGNOSE</div><div class="dg">${P.pv.now != null ? `<div class="dt"><div class="v">${de(P.pv.now, 0)}<small class="u">W</small></div><div class="l">${ic('sun', 13)}Jetzt</div></div>` : ''}${P.pv.today != null ? `<div class="dt"><div class="v">${de(P.pv.today, 1)}<small class="u">kWh</small></div><div class="l">${ic('sun', 13)}Heute</div></div>` : ''}${P.pv.remaining != null ? `<div class="dt"><div class="v">${de(P.pv.remaining, 1)}<small class="u">kWh</small></div><div class="l">${ic('sun', 13)}Noch heute</div></div>` : ''}${P.pv.tomorrow != null ? `<div class="dt"><div class="v">${de(P.pv.tomorrow, 1)}<small class="u">kWh</small></div><div class="l">${ic('sun', 13)}Morgen</div></div>` : ''}</div>` : '';
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('bolt', 24)}</div><div><h2>Strom</h2><p>${P.devs.length} gemessene Geräte</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="dg"><div class="dt"><div class="v">${de(P.total, 0)}<small class="u">W</small></div><div class="l">${ic('bolt', 13)}Jetzt</div></div><div class="dt"><div class="v">${P.kwh != null ? de(P.kwh, 1) : '–'}<small class="u">kWh</small></div><div class="l">${ic('clock', 13)}Heute</div></div>${cost ? `<div class="dt"><div class="v">${cost}</div><div class="l">${ic('bolt', 13)}Kosten heute</div></div>` : ''}</div>
      <div class="seg wide" style="margin-top:12px">${[[0, 'Heute'], [7, '7 Tage'], [30, '30 Tage']].map(x => `<button class="${rg === x[0] ? 'on' : ''}" data-act="prange" data-n="${x[0]}">${x[1]}</button>`).join('')}</div>
      ${rg ? this._powerRange(rg) : `${series.length ? `<div class="lab2">VERLAUF · 24 STUNDEN</div>${this._chart(series, { h: 190, dec: 0 })}` : ''}
      <div class="lab2">GERÄTE</div>${P.devs.map(row).join('')}${pvRow}`}`;
  }

  /* ───────────── v5: Heizungsplan (climate-scheduler-card einbetten) ───────────── */
  _sSched() {
    const D = this._schedD, ids = Object.keys(this._h.states).filter(k => k.startsWith('schedule.'));
    if (!D || Date.now() - D.t > 3e5) this._loadSchedules();
    const meta = new Map((D?.list || []).map(x => [`schedule.${x.id}`, x])), on = ids.filter(k => this._val(k) === 'on').length;
    const DAYS = [['monday', 'Mo'], ['tuesday', 'Di'], ['wednesday', 'Mi'], ['thursday', 'Do'], ['friday', 'Fr'], ['saturday', 'Sa'], ['sunday', 'So']];
    const mins = t => { const m = /^(\d+):(\d+)/.exec(t || ''); return m ? (+m[1]) * 60 + (+m[2]) : 0; };
    const nowD = new Date(), todayIdx = (nowD.getDay() + 6) % 7, nowPct = (nowD.getHours() * 60 + nowD.getMinutes()) / 14.4;
    const fmt = iso => { const d = new Date(iso); if (isNaN(d)) return ''; const same = d.toDateString() === nowD.toDateString(); return (same ? '' : d.toLocaleDateString('de-DE', { weekday: 'short' }) + ' ') + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); };
    const card = k => {
      const s = this._s(k), a = s.attributes || {}, m = meta.get(k), act = s.state === 'on', ne = a.next_event ? fmt(a.next_event) : '';
      const week = m ? `<div class="swk">${DAYS.map(([d, l], di) => `<div class="swr ${di === todayIdx ? 'td' : ''}"><span>${l}</span><div class="swt">${(m[d] || []).map(b => { const f = mins(b.from), t = Math.min(mins(b.to) || 1440, 1440); return `<i style="left:${(f / 14.4).toFixed(2)}%;width:${Math.max((t - f) / 14.4, .6).toFixed(2)}%"></i>`; }).join('')}${di === todayIdx ? `<b style="left:${nowPct.toFixed(2)}%"></b>` : ''}</div></div>`).join('')}<div class="swa"><span></span><div><em>0</em><em>6</em><em>12</em><em>18</em><em>24</em></div></div></div>` : '';
      return `<div class="sch ${act ? 'on' : ''}"><div class="sht" data-act="more" data-e="${k}"><div class="ico">${ic('clock', 19)}</div><div class="tx"><div class="n">${esc(m?.name || a.friendly_name || this._name(k))}</div><div class="s">${ne ? (act ? 'Aktiv bis ' : 'Nächster Start ') + ne : (act ? 'Gerade aktiv' : 'Kein Termin geplant')}</div></div><div class="bd ${act ? '' : 'off'}">${act ? 'Aktiv' : 'Pause'}</div></div>${week}</div>`;
    };
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('clock', 24)}</div><div><h2>Heizungsplan</h2><p>${ids.length ? ids.length + ' Zeitpläne · ' + on + ' gerade aktiv' : 'Keine Zeitpläne gefunden'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      ${ids.length ? `<div class="sl">${ids.sort((a, b) => (this._val(b) === 'on') - (this._val(a) === 'on') || this._name(a).localeCompare(this._name(b), 'de')).map(card).join('')}</div>` : `<div class="empty">🗓️ Es gibt noch keine Zeitpläne.<br><small>Lege unter Einstellungen → Geräte &amp; Dienste → Helfer einen „Zeitplan“ an.</small></div>`}`;
  }
  async _loadSchedules() {
    if (this._scB) return; this._scB = true;
    let list = []; try { list = await this._h.callWS({ type: 'schedule/list' }); } catch (e) { list = []; }
    this._schedD = { t: Date.now(), list: Array.isArray(list) ? list : [] }; this._scB = false;
    if (this._sheet && this._sheet.t === 'sched') this._renderSheet();
  }
  _mountSched() {}

  /* ───────────── v5: Regenradar ───────────── */
  _radarUrl() {
    if (this._c.radarUrl) return this._c.radarUrl;
    const lat = this._h?.config?.latitude ?? 51.77, lon = this._h?.config?.longitude ?? 8.57;
    return `https://embed.windy.com/embed2.html?lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&detailLat=${lat.toFixed(2)}&detailLon=${lon.toFixed(2)}&zoom=7&level=surface&overlay=radar&product=radar&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
  }
  /* ───────────── v5: Einstellungen ───────────── */
  _setRow() { return `<button class="xr" data-act="settings"><div class="ico">${ic('cog', 19)}</div><div><div class="t">Darstellung &amp; Modi</div><div class="s">${{ dark: 'Dunkel', light: 'Hell', auto: 'Automatisch' }[this._themePref || this._c.theme] || 'Dunkel'}${WALL_UI && this._ambMin() ? ' · Ambient nach ' + this._ambMin() + ' Min.' : ''}</div></div></button>`; }
  _ambRow() { if (!WALL_UI) return ''; return `<button class="xr" data-act="ambient"><div class="ico">${ic('expand', 19)}</div><div><div class="t">Wandtablet-Modus</div><div class="s">Uhr &amp; Überblick, tippen zum Beenden</div></div></button>`; }
  _sSet() {
    const th = this._themePref || this._c.theme || 'dark', am = String(this._ambMin());
    const seg = (act, cur, items) => `<div class="seg wide">${items.map(x => `<button class="${cur === x[0] ? 'on' : ''}" data-act="${act}" data-m="${x[0]}">${x[1]}</button>`).join('')}</div>`;
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('cog', 24)}</div><div><h2>Darstellung &amp; Modi</h2><p>Home Aurora v5.2 · Build pz13</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="lab2">DESIGN</div>${seg('theme', th, [['dark', 'Dunkel'], ['light', 'Hell'], ['auto', 'Automatisch']])}
      <div class="card-note">„Automatisch“ folgt dem Dunkel-/Hellmodus deines Home-Assistant-Profils. Die Auswahl gilt nur für dieses Gerät.</div>
      ${WALL_UI ? `      <div class="lab2">WANDTABLET-MODUS</div>
      <button class="xr" style="width:100%" data-act="ambient"><div class="ico">${ic('expand', 19)}</div><div><div class="t">Jetzt starten</div><div class="s">Große Uhr, Wetter, nächster Termin · Bildschirm bleibt an</div></div></button>
      <div class="card-note" style="margin-top:12px">Automatisch starten nach Inaktivität</div>${seg('ambafter', am, [['0', 'Aus'], ['2', '2 Min'], ['5', '5 Min'], ['10', '10 Min'], ['30', '30 Min']])}
      <div class="card-note" style="margin-top:12px">Nachts automatisch${this._nightCfg() ? ` (${this._nightCfg().from}–${this._nightCfg().to} Uhr, nach ${this._nightCfg().after} Min)` : ''}</div>${seg('ambnight', this._nightCfg() ? '1' : '0', [['1', 'An'], ['0', 'Aus']])}
      ` : ''}
      ${this._fullySet()}
      <div class="lab2">SCHNELLAKTIONEN</div>
      <button class="xr" style="width:100%" data-act="qedit"><div class="ico">${ic('sparkle', 19)}</div><div><div class="t">Schnellaktionen bearbeiten</div><div class="s">Szenen &amp; Skripte hinzufügen, sortieren, neue Szene speichern</div></div></button>
      <div class="lab2">SCHNELLZUGRIFF</div>
      <div class="ex two"><button class="xr" data-act="sys"><div class="ico">${ic('wrench', 19)}</div><div><div class="t">Systemstatus</div></div></button><button class="xr" data-act="power"><div class="ico">${ic('bolt', 19)}</div><div><div class="t">Strom</div></div></button><button class="xr" data-act="sched"><div class="ico">${ic('clock', 19)}</div><div><div class="t">Heizungsplan</div></div></button><button class="xr" data-act="bat"><div class="ico">${ic('battery', 19)}</div><div><div class="t">Batterien</div></div></button><button class="xr" data-act="persons"><div class="ico">${ic('user', 19)}</div><div><div class="t">Wer ist da?</div></div></button><button class="xr" data-act="vent"><div class="ico">${ic('wind', 19)}</div><div><div class="t">Lüften</div></div></button></div>`;
  }

  /* ───────────── v5: Ambient / Wandtablet ───────────── */
  _ambMin() { const v = this._ambPref != null ? parseInt(this._ambPref, 10) : NaN; return isNaN(v) ? (parseInt(this._c?.ambient_after, 10) || 0) : v; }
  _nightCfg() {
    const p = this._nightPref, c = this._c?.ambient_night;
    if (p === '0') return null;
    if (p === '1') return { from: '23:00', to: '06:00', after: 1, ...(c || {}) };
    return c ? { from: '23:00', to: '06:00', after: 1, ...c } : null;
  }
  _inNight() {
    const n = this._nightCfg(); if (!n) return null;
    const hm = s => { const [h, m] = String(s).split(':').map(Number); return (h || 0) * 60 + (m || 0); }, d = new Date(), t = d.getHours() * 60 + d.getMinutes(), a = hm(n.from), b = hm(n.to);
    return (a <= b ? (t >= a && t < b) : (t >= a || t < b)) ? n : null;
  }
  _ambOn() {
    if (!WALL_UI) return;
    if (this._amb || !this._amb_el) return;
    this._amb = true; this._ambClk = ''; this._amb_el.classList.add('show'); this._ambRender(true); this._fullyApply();
    try { navigator.wakeLock?.request('screen').then(l => { this._wl = l; }).catch(() => {}); } catch (e) { /* optional */ }
  }
  _ambOff(home) {
    if (!this._amb) return;
    this._amb = false; this._ambBy = null; this._lastAct = Date.now(); this._amb_el?.classList.remove('show'); this._fullyApply();
    if (home && this._built) { this._swallow = Date.now() + 800; this._v = 'home'; this._closeSheet(); this._enter = true; this._counted = false; this._sig = ''; this._render(); }
    try { this._wl?.release(); } catch (e) { /* optional */ } this._wl = null;
  }
  _ambRender(first) {
    if (!this._amb || !this._amb_el || !this._h) return;
    const w = this._wxNow(), lights = this._lightsOn().length, open = this._openRooms();
    const temps = this._c.rooms.map(r => this._room(r).temp).filter(t => t != null), avg = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null;
    let nxt = '';
    const WL = this._waste(), wasteTx = /tonne|müll|abfall|gelber sack|gelbe sack|restmüll|biomüll|sperrmüll|papier|altpapier/i;
    if (this._cal) { const { list } = this._calList(), skipW = !!(WL && WL[0] && WL[0].days <= 1), n = list.find(x => x.e > new Date() && !(skipW && wasteTx.test(x.title || ''))); if (n) nxt = `<div class="ambn">${ic('cal', 18)}<span>${n.allDay ? this._dayName(n.s) : n.s.toLocaleString('de-DE', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} · ${esc(n.title)}</span></div>`; }
    const wn = WL && WL[0] && WL[0].days <= 1 ? `<div class="ambn">${ic('trash', 18)}<span>${this._dayTxt(WL[0])} · ${esc(WL[0].name)}</span></div>` : '';
    const pe = this._persons();
    if (first || !this._ambDrift || Date.now() - this._ambDrift > 6e4) { this._ambDrift = Date.now(); this._ambDx = Math.round((Math.random() - .5) * 60); this._ambDy = Math.round((Math.random() - .5) * 50); }
    this._morph(this._amb_el, `<div class="ambin" style="transform:translate(${this._ambDx}px,${this._ambDy}px)"><div class="ambc big">${this._clockStr()}</div>
      <div class="ambd">${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      <div class="ambr"><div class="ambw">${wx(w.cond, 64)}<div><div class="ambt big">${de(w.temp)}<small>°C</small></div><div class="ambs">${COND[w.cond] || w.cond}</div></div></div>
      ${avg != null ? `<div class="ambw"><div class="ico">${ic('home', 34)}</div><div><div class="ambt big">${de(avg)}<small>°C</small></div><div class="ambs">innen Ø</div></div></div>` : ''}</div>
      <div class="ambl">${nxt}${wn}${open.length ? `<div class="ambn warn">${ic('window', 18)}<span>${open.length} Fenster offen</span></div>` : ''}${lights ? `<div class="ambn">${ic('bulb', 18)}<span>${lights} ${lights === 1 ? 'Licht' : 'Lichter'} an</span></div>` : ''}</div>
      <div class="pp ambp">${pe}</div><div class="ambh">Tippen zum Beenden</div></div>`);
  }

  /* ───────────── v5.2: Lüften – Raumkarte ───────────── */
  _ago(iso) {
    const t = new Date(iso).getTime(); if (isNaN(t)) return '';
    const m = Math.max(0, Math.round((Date.now() - t) / 6e4));
    return m < 2 ? 'gerade eben' : m < 60 ? `vor ${m} Min.` : m < 1440 ? `vor ${Math.round(m / 60)} Std.` : `vor ${Math.round(m / 1440)} Tg.`;
  }
  _mmss(s) { s = Math.round(s || 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  _vrChart(v) {
    const pts = (v?.punkte || []).filter(p => p[1] != null && p[2] != null);
    if (pts.length < 2) return '<div class="empty">Noch keine Lüftung aufgezeichnet</div>';
    const T = Math.max(...pts.map(p => p[0]), 1), W = 300, H = 104, pl = 4, pr = 8, pt = 8, pb = 6;
    const rng = i => { let a = Math.min(...pts.map(p => p[i])), b = Math.max(...pts.map(p => p[i])); if (b - a < .6) { a -= .3; b += .3; } const pad = (b - a) * .15; return [a - pad, b + pad]; };
    const [a1, b1] = rng(1), [a2, b2] = rng(2);
    const X = s => pl + s / T * (W - pl - pr), Y1 = v1 => pt + (1 - (v1 - a1) / (b1 - a1)) * (H - pt - pb), Y2 = v2 => pt + (1 - (v2 - a2) / (b2 - a2)) * (H - pt - pb);
    const segs = [];
    let cur = [];
    for (const p of (v.punkte || [])) { if (p[1] == null || p[2] == null) { if (cur.length) segs.push(cur); cur = []; } else cur.push(p); }
    if (cur.length) segs.push(cur);
    const line = (seg, i, Y) => seg.map((p, k) => (k ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[i]).toFixed(1)).join('');
    const area = segs.filter(s => s.length > 1).map(s => line(s, 1, Y1) + `L${X(s[s.length - 1][0]).toFixed(1)} ${H - pb}L${X(s[0][0]).toFixed(1)} ${H - pb}z`).join('');
    const last = pts[pts.length - 1];
    return `<svg class="vrch" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="vag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38bdf8" stop-opacity=".45"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#vag)"/>${segs.map(s => `<path d="${line(s, 1, Y1)}" fill="none" stroke="#38bdf8" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`).join('')}
      ${segs.map(s => `<path d="${line(s, 2, Y2)}" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>`).join('')}</svg>
      <span class="vrdot" style="left:${(X(last[0]) / W * 100).toFixed(1)}%;top:${(Y1(last[1]) / H * 100).toFixed(1)}%"></span>`;
  }
  _sVRoom(e) {
    const s = this._s(e);
    if (!s) return `<div class="grab"></div><div class="sh"><button class="x bk" data-act="vent">${ic('chevron', 20)}</button><div><h2>Lüften</h2></div><button class="x" data-act="close">${ic('close', 20)}</button></div><div class="empty">Raum nicht gefunden</div>`;
    const at = s.attributes || {}, k = at.karte || {}, ent = k.entitaeten || at.entitaeten || {}, nm = k.name || this._name(e).replace(/ Empfehlung$/, '');
    const cfg = this._roomByName(nm), run = !!k.laeuft, pause = k.pausiert || '', want = k.lueften !== false && (k.minuten > 0) && !pause && !run;
    const win = k.fenster_status || [], nOpen = win.filter(w => w.offen).length;
    const tone = run ? 'live' : pause ? 'warn' : want ? 'hot' : 'ok';
    const chip = run ? 'Lüftet gerade' : pause ? 'Pausiert' : want ? 'Jetzt lüften' : 'Alles gut';
    const icon = run ? 'wind' : pause ? 'pause' : want ? 'wind' : 'check';
    const head = pause || k.status || s.state;
    let sub = pause && k.minuten ? `Später: ${k.modus || 'Lüften'} · ca. ${k.minuten} Min.${k.grund ? ' · wegen ' + k.grund : ''}` : (k.entscheidungsgrund || ''); if (sub === head) sub = '';
    const risk = { niedrig: ['ok', 'Niedrig'], beobachten: ['warn', 'Beobachten'], hoch: ['bad', 'Hoch'] }[k.schimmel] || ['', '–'];
    const sn = ent.snooze && this._s(ent.snooze), sk = ent.skip && this._s(ent.skip), pm = ent.party_mode && this._s(ent.party_mode);
    const tile = (lab, ico, big, small, ee) => `<div class="vt ${ee ? 'tap' : ''}" ${ee ? `data-act="more" data-e="${esc(ee)}"` : ''}><div class="vtl">${ic(ico, 14)}${lab}</div><div class="vtv">${big}</div><div class="vts">${small}</div></div>`;
    const wallPct = k.wand_rh != null ? clamp(k.wand_rh, 0, 100) : null;
    const V = k.verlauf || at.verlauf || {}, vp = (V.punkte || []).filter(p => p[1] != null && p[2] != null);
    let vsum = '';
    if (vp.length > 1) {
      const a0 = vp[0][1], a1 = vp[vp.length - 1][1], t0 = vp[0][2], t1 = vp[vp.length - 1][2], dp = a0 ? (a1 - a0) / a0 * 100 : 0;
      vsum = `<div class="vrs"><div><b>${de(a0, 1)}</b> → <b>${de(a1, 1)}</b> <small>g/m³</small> <span class="tag ${dp <= -1 ? 'ok' : dp >= 1 ? 'bad' : ''}">${dp > 0 ? '+' : ''}${de(dp, 0)} %</span></div><div class="vrt">Temp. ${de(t0, 0)} → ${de(t1, 1)} °C</div></div>`;
    }
    const last = vp.length ? this._mmss(vp[vp.length - 1][0]) + ' min' : '';
    const T = k.trend_tage || at.trend_tage || [], mx = Math.max(...T.map(t => t.anzahl), 1);
    const bars = T.map((t, i) => `<div class="${i === T.length - 1 ? 'today' : ''}"><b>${t.anzahl ? t.anzahl + '×' : ''}</b><i style="height:${Math.max(4, t.anzahl / mx * 78)}px"></i>${i === T.length - 1 ? 'Heute' : new Date(t.datum).toLocaleDateString('de-DE', { weekday: 'short' })}</div>`).join('');
    const st = k.statistik || at.statistik || {}, stRow = (lab, o) => o ? `<div class="vr"><div><div class="t">${lab}</div><div class="s">${o.count}× gelüftet · Ø ${de(o.avg_minutes, 0)} Min.${o.count ? ' · ' + o.ok + ' ausreichend' : ''}</div></div><div class="m">${de(o.kwh, 2)} kWh<small>${de(o.cost, 2)} €</small></div></div>` : '';
    const wins = (k.lueftungsfenster || []).slice(0, 3).map(w => `<div class="vr"><div class="ico">${ic('clock', 19)}</div><div><div class="t">${hhmm(w.start)} – ${hhmm(w.end)}</div><div class="s">${w.hours} Std. · Wind ${de(w.wind, 0)} m/s${w.rain_probability ? ' · Regen ' + w.rain_probability + ' %' : ''}</div></div><div class="m">−${de(w.gain, 1)} g/m³<small>Entfeuchtung</small></div></div>`).join('');
    const flags = [[k.urlaub, 'Urlaubsmodus', 'sun'], [k.entfeuchter, 'Entfeuchter läuft', 'drop'], [k.rollo_empfehlung, 'Rollo schließen', 'window'], [k.nach_dusche, 'Nach dem Duschen', 'bath'], [k.kuehlt_aus, 'Kühlt aus', 'thermo'], [k.regen_bald, 'Regen bald', 'rain']].filter(f => f[0]).map(f => `<span class="vchip">${ic(f[2], 14)}${f[1]}</span>`).join('');
    const co2 = k.co2 != null ? tile('CO₂', 'gauge', `${de(k.co2, 0)}<small>ppm</small>`, k.co2 > 1200 ? 'Hoch' : k.co2 > 800 ? 'Erhöht' : 'Gut', ent.co2) : '';
    return `<div class="grab"></div><div class="sh"><button class="x bk" data-act="vent" aria-label="Zurück">${ic('chevron', 20)}</button><div class="ico">${ic(cfg?.icon || 'wind', 24)}</div><div><h2>${esc(nm)}</h2><p style="white-space:nowrap">${k.saison === 'winter' ? '❄ Winter' : k.saison ? '☀ Sommer' : ''}${k.fenster_anzahl != null ? ' · ' + k.fenster_anzahl + ' Fenster' : ''}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="vst ${tone}"><div class="vsi">${ic(icon, 26)}</div><div class="vsx"><div class="vkick">${chip.toUpperCase()}</div><div class="vh1">${esc(head)}</div>${sub ? `<div class="vh2">${esc(sub)}</div>` : ''}</div></div>
      ${run ? `<div class="vbar" style="margin:10px 2px 0"><i style="width:${clamp(k.fortschritt || 0, 0, 100)}%"></i></div><div class="vh2" style="margin:6px 4px 0">${this._mmss(k.dauer_s)} gelüftet${k.rest_minuten != null ? ' · noch ' + de(k.rest_minuten, 0) + ' Min.' : ''}</div>` : ''}
      <div class="vact">${pm ? `<button class="vbt big ${k.party_modus ? 'on' : ''}" data-act="press" data-e="${ent.party_mode}" data-msg="${k.party_modus ? 'Party-Modus aktualisiert' : 'Party-Modus gestartet'}">${ic('sparkle', 15)}${k.party_modus ? 'Party-Modus aktiv' + (k.party_bis ? ' · bis ' + hhmm(k.party_bis) : '') : 'Party-Modus starten'}</button>` : ''}${!run && sn ? `<button class="vbt big" data-act="press" data-e="${ent.snooze}" data-msg="Erinnerung 30 Min. ausgesetzt">${ic('clock', 15)}30 Min. später</button>` : ''}${!run && sk ? `<button class="vbt big" data-act="press" data-e="${ent.skip}" data-msg="Heute nicht mehr erinnern">${ic('close', 15)}Heute nicht mehr</button>` : ''}</div>
      <div class="vts3">${tile('INNEN', 'home', `${de(k.innen_t)}<small>°C</small>`, `${de(k.innen_ah)} g/m³ · ${de(k.innen_rh, 0)} %`, ent.innen)}${tile('AUSSEN', 'cloudsun', `${de(k.aussen_t)}<small>°C</small>`, `${de(k.aussen_ah)} g/m³`, ent.aussen)}${tile('WAND', 'drop', `${wallPct != null ? de(wallPct, 0) : '–'}<small>%</small>`, `${wallPct != null ? `<div class="wbar"><i style="width:${wallPct}%"></i><u style="left:60%"></u><u style="left:70%"></u></div>` : ''}<span class="tag ${risk[0]}">${risk[1]}</span>`, ent.wand)}${co2}</div>
      ${k.schimmel_grund || k.wand_taupunkt_abstand != null ? `<div class="vnote">${ic('shield', 16)}<div><b>Schimmel: ${risk[1]}</b>${k.schimmel_grund ? ' – ' + esc(k.schimmel_grund) : ''}${k.schimmel_massnahme ? `<br><span>${esc(k.schimmel_massnahme)}</span>` : ''}${k.wand_taupunkt_abstand != null ? `<br><span>Abstand zum Taupunkt an der Wand: ${de(k.wand_taupunkt_abstand, 1)} K</span>` : ''}</div></div>` : ''}
      <div class="lab2">LETZTE LÜFTUNG</div>
      <div class="sctl vrbox"><div class="vrhd"><span class="vleg"><i style="background:#38bdf8"></i>Feuchte</span><span class="vleg"><i style="background:#fbbf24"></i>Temp.</span><span class="vago">${V.ende ? this._ago(V.ende) : ''}${last ? ' · ' + last : ''}</span></div>${vsum}<div class="vrplot">${this._vrChart(V)}</div>${vp.length > 1 ? `<div class="vrx"><span>0:00</span><span>${last}</span></div>` : ''}</div>
      ${T.length ? `<div class="lab2">LETZTE 7 TAGE</div><div class="sctl" style="display:block"><div class="tr">${bars}</div></div>` : ''}
      ${win.length ? `<div class="lab2">FENSTER</div>${win.map(w => `<div class="vr"><div class="ico" style="${w.offen ? 'color:#fb923c;background:rgba(251,146,60,.16)' : 'color:#34d399;background:rgba(52,211,153,.12)'}">${ic('window', 19)}</div><div><div class="t">${esc(w.name)}</div></div><div class="m" style="${w.offen ? 'color:#fb923c' : 'color:#34d399'}">${w.offen ? 'offen' : 'geschlossen'}</div></div>`).join('')}` : ''}
      <div class="lab2">ÜBERBLICK</div>
      <div class="vchips">${k.bester_zeitpunkt || at.bester_zeitpunkt ? `<span class="vchip">${ic('clock', 14)}${esc(k.bester_zeitpunkt || at.bester_zeitpunkt)}</span>` : ''}<button class="vchip btn" data-act="vx">${ic('cal', 14)}${k.heute_anzahl || 0}× heute · ${de(k.heute_min || 0, 0)} Min.<span class="chev ${this._vx ? 'up' : ''}">${ic('chevron', 12)}</span></button><span class="vchip">${ic('flame', 14)}${de(k.heute_kwh || 0, 2)} kWh · ${de(k.heute_eur || 0, 2)} €</span>${flags}</div>
      ${this._vx ? `<div class="vstat">${stRow('Diese Woche', st.woche)}${stRow('Dieser Monat', st.monat)}${stRow('Gesamt', st.gesamt)}</div>` : ''}
      ${wins ? `<div class="lab2">BESTE LÜFTUNGSZEITEN</div>${wins}` : ''}
      ${cfg ? `<button class="qb" style="margin-top:14px" data-act="room" data-room="${cfg.id}">${ic(cfg.icon || 'grid', 14)}${esc(cfg.name)} öffnen</button>` : ''}`;
  }

  /* ───────────── v5.2: Wer ist da ───────────── */
  _homeLL() {
    const z = this._s('zone.home')?.attributes || {}, c = this._h?.config || {};
    const la = z.latitude ?? c.latitude, lo = z.longitude ?? c.longitude;
    return la != null && lo != null ? [la, lo] : null;
  }
  _pInfo(e) {
    const s = this._s(e); if (!s) return null;
    const a = s.attributes || {}, home = s.state === 'home', ll = this._homeLL();
    let dist = null;
    if (!home && a.latitude != null && a.longitude != null && ll) {
      const R = 6371, r = x => x * Math.PI / 180, dLa = r(a.latitude - ll[0]), dLo = r(a.longitude - ll[1]);
      const q = Math.sin(dLa / 2) ** 2 + Math.cos(r(ll[0])) * Math.cos(r(a.latitude)) * Math.sin(dLo / 2) ** 2;
      dist = 2 * R * Math.asin(Math.sqrt(q));
    }
    this._pt = this._pt || {};
    const tr = this._pt[e] = this._pt[e] || [];
    if (dist != null) { const l = tr[tr.length - 1]; if (!l || Date.now() - l.t > 6e4) { tr.push({ t: Date.now(), d: dist }); if (tr.length > 12) tr.shift(); } } else tr.length = 0;
    let dir = '', eta = null;
    if (dist != null && tr.length > 1) {
      const old = tr.find(x => Date.now() - x.t >= 180e3) || tr[0], dt = (Date.now() - old.t) / 36e5, dd = dist - old.d;
      if (dt > 0.02 && Math.abs(dd) > .15) {
        dir = dd < 0 ? 'näher' : 'weiter';
        if (dd < 0) { const sp = -dd / dt; if (sp > 3) eta = Math.min(180, Math.round(dist / sp * 60)); }
      } else if (dt > 0.02) dir = 'steht';
    }
    let bat = null;
    const src = a.source, dev = this._h.entities?.[src]?.device_id;
    if (dev) for (const k in this._h.entities) { const en = this._h.entities[k]; if (en.device_id === dev && this._attr(k, 'device_class') === 'battery') { const v = this._num(k); if (v != null) { bat = v; break; } } }
    if (bat == null && this._attr(src, 'battery_level') != null) bat = this._attr(src, 'battery_level');
    return { e, s, a, home, dist, dir, eta, bat, since: s.last_changed, zone: home ? 'Zuhause' : s.state === 'not_home' ? 'Unterwegs' : s.state };
  }
  _pSub(p) {
    if (p.home) return 'Zuhause';
    const d = p.dist != null ? (p.dist < 1 ? Math.round(p.dist * 1000) + ' m' : de(p.dist, 1) + ' km') : '';
    const t = p.eta ? ` · ≈${p.eta} Min.` : p.dir === 'näher' ? ' · kommt näher' : '';
    return (p.zone === 'Unterwegs' ? 'Unterwegs' : esc(p.zone)) + (d ? ' · ' + d : '') + t;
  }
  _sPersons() {
    const P = this._c.persons.map(e => this._pInfo(e)).filter(Boolean);
    const row = p => `<div class="vr tap" data-act="more" data-e="${p.e}"><div class="av big2" ${p.a.entity_picture ? `style="background-image:url('${esc(p.a.entity_picture)}')"` : ''}>${p.a.entity_picture ? '' : esc((p.a.friendly_name || '?')[0])}</div>
      <div><div class="t">${esc(p.a.friendly_name || p.e)}</div><div class="s">${p.home ? 'Zuhause' : esc(p.zone)}${p.since ? ' · seit ' + new Date(p.since).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
      <div class="vchips" style="margin-top:6px">${p.dist != null ? `<span class="vchip">${ic('radar', 13)}${p.dist < 1 ? Math.round(p.dist * 1000) + ' m' : de(p.dist, 1) + ' km'} entfernt</span>` : ''}${p.dir === 'näher' ? `<span class="vchip good">${ic('chevron', 13)}kommt näher${p.eta ? ' · ≈' + p.eta + ' Min.' : ''}</span>` : p.dir === 'weiter' ? `<span class="vchip">${ic('chevron', 13)}entfernt sich</span>` : ''}${p.bat != null ? `<span class="vchip ${p.bat <= 15 ? 'bad' : ''}">${ic('battery', 13)}${de(p.bat, 0)} %</span>` : ''}${p.a.gps_accuracy != null && !p.home ? `<span class="vchip">GPS ±${de(p.a.gps_accuracy, 0)} m</span>` : ''}</div></div></div>`;
    const home = P.filter(p => p.home).length;
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('user', 24)}</div><div><h2>Wer ist da?</h2><p>${home} von ${P.length} zuhause</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>${P.map(row).join('')}<div class="card-note">Entfernung und Richtung berechnet die Karte aus den GPS-Daten der Personen. Die Ankunftszeit ist nur eine grobe Schätzung.</div>`;
  }

  /* ───────────── v5.2: Energie über Zeit ───────────── */
  _price() { const e = this._c.power.priceEntity, v = e && this._num(e); return v != null ? v : (this._c.power.price || null); }
  async _loadPR(force) {
    if (this._prb || (!force && this._pr && Date.now() - this._pr.t < 6e5)) return;
    const ids = this._c.power.devices.map(d => d[1]).filter(e => e && this._s(e));
    if (!ids.length) return;
    this._prb = true;
    const t0 = new Date(); t0.setHours(0, 0, 0, 0); t0.setDate(t0.getDate() - 59);
    let days = null;
    try {
      const r = await this._h.callWS({ type: 'recorder/statistics_during_period', start_time: t0.toISOString(), statistic_ids: ids, period: 'day', types: ['change'] });
      days = {}; const per = {};
      for (const id of ids) for (const x of (r?.[id] || [])) { const d = new Date(x.start), key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); days[key] = (days[key] || 0) + (x.change || 0); (per[id] = per[id] || {})[key] = (x.change || 0); }
      this._pr = { t: Date.now(), days, per, ok: true };
    } catch (e) { this._pr = { t: Date.now(), days: {}, per: {}, ok: false }; }
    this._prb = false;
    if (this._sheet?.t === 'power') this._renderSheet();
  }
  _prSeries(n) {
    const out = [], t = new Date(); t.setHours(0, 0, 0, 0);
    for (let i = n - 1; i >= 0; i--) { const d = new Date(+t - i * 864e5), key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); out.push({ d, key, v: this._pr?.days?.[key] ?? 0 }); }
    return out;
  }
  _powerRange(n) {
    if (!this._pr) { this._loadPR(); return '<div class="sk" style="height:200px"></div>'; }
    if (!this._pr.ok) return '<div class="empty">Statistik nicht verfügbar</div>';
    const cur = this._prSeries(n), prevT = new Date(); prevT.setHours(0, 0, 0, 0);
    let prev = 0; for (let i = n; i < 2 * n; i++) { const d = new Date(+prevT - i * 864e5), key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); prev += this._pr.days[key] || 0; }
    const sum = cur.reduce((a, x) => a + x.v, 0), mx = Math.max(...cur.map(x => x.v), .01), pr = this._price();
    const dd = prev > 0 ? (sum - prev) / prev * 100 : null;
    const bars = cur.map((x, i) => `<div class="${i === cur.length - 1 ? 'today' : ''}"><b>${n <= 7 ? de(x.v, 1) : ''}</b><i style="height:${Math.max(3, x.v / mx * 90)}px"></i>${n <= 7 ? (i === cur.length - 1 ? 'Heute' : x.d.toLocaleDateString('de-DE', { weekday: 'short' })) : (i % 5 === 0 || i === cur.length - 1 ? x.d.getDate() + '.' : '')}</div>`).join('');
    const per = this._c.power.devices.filter(d => this._pr.per[d[1]]).map(d => ({ n: d[2], icon: d[3] || 'plug', v: cur.reduce((a, x) => a + (this._pr.per[d[1]][x.key] || 0), 0) })).filter(x => x.v > 0.005).sort((a, b) => b.v - a.v);
    const pm = Math.max(...per.map(x => x.v), .01);
    return `<div class="dg" style="margin-top:12px"><div class="dt"><div class="v">${de(sum, 1)}<small class="u">kWh</small></div><div class="l">${ic('bolt', 13)}${n} Tage</div></div><div class="dt"><div class="v">${de(sum / n, 2)}<small class="u">kWh</small></div><div class="l">${ic('clock', 13)}Ø pro Tag</div></div>${pr ? `<div class="dt"><div class="v">${de(sum * pr, 2)}<small class="u">€</small></div><div class="l">${ic('bolt', 13)}bei ${de(pr, 2)} €/kWh</div></div>` : ''}${dd != null ? `<div class="dt"><div class="v" style="color:${dd > 5 ? 'var(--bad)' : dd < -5 ? 'var(--ok)' : 'inherit'}">${dd > 0 ? '+' : ''}${de(dd, 0)}<small class="u">%</small></div><div class="l">${ic('chevron', 13)}zur Vorperiode</div></div>` : ''}</div>
      <div class="sctl" style="display:block;margin-top:10px"><div class="tr ${n > 7 ? 'dense' : ''}">${bars}</div></div>
      <div class="lab2">VERBRAUCH NACH GERÄT</div>${per.length ? per.map(x => `<div class="bt"><div class="t">${esc(x.n)}</div><div class="pc2"><i style="width:${x.v / pm * 100}%;background:#fbbf24"></i></div><b style="width:auto;min-width:62px">${de(x.v, 1)} kWh</b></div>`).join('') : '<div class="empty">Keine Verbrauchsdaten</div>'}`;
  }

  /* ───────────── v5.2: Schnellaktionen bearbeiten ───────────── */
  _quickList() {
    try { const j = JSON.parse(localStorage.getItem('home-aurora-quick') || 'null'); if (Array.isArray(j)) return j; } catch (e) { /* Standard */ }
    return this._c.quick || [];
  }
  _quickSave(list) { try { localStorage.setItem('home-aurora-quick', JSON.stringify(list)); } catch (e) { this._toast('Speichern auf diesem Gerät nicht möglich'); } }
  _sQuick() {
    const list = this._quickList(), has = new Set(list.map(x => x[0]));
    const F = [['sc', 'Szenen & Skripte', /^(scene|script)\./], ['light', 'Lichter', /^light\./], ['switch', 'Schalter', /^(switch|input_boolean)\./], ['cover', 'Rollläden', /^cover\./], ['btn', 'Buttons', /^(button|input_button)\./]], qf = this._sheet.qf || 'sc', fx = (F.find(f => f[0] === qf) || F[0])[2];
    const cand = Object.keys(this._h.states).filter(k => fx.test(k) && !has.has(k) && this._h.states[k].state !== 'unavailable').sort((a, b) => this._name(a).localeCompare(this._name(b), 'de'));
    const fchips = `<div class="qfl">${F.map(f => `<button class="qfc ${f[0] === qf ? 'on' : ''}" data-act="qfil" data-e="${f[0]}">${f[1]}</button>`).join('')}</div>`;
    const row = (x, i) => `<div class="vr qr"><div class="ico">${ic(x[2] || 'sparkle', 19)}</div><div><div class="t">${esc(x[1])}</div><div class="s">${x[0].startsWith('builtin:') ? 'Eingebaut' : esc(x[0])}${!x[0].startsWith('builtin:') && !this._s(x[0]) ? ' · nicht gefunden' : ''}</div></div><div class="qbtns"><button class="vbt" data-act="qmove" data-i="${i}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="Nach oben">▲</button><button class="vbt" data-act="qmove" data-i="${i}" data-d="1" ${i === list.length - 1 ? 'disabled' : ''} aria-label="Nach unten">▼</button><button class="vbt" data-act="qdel" data-i="${i}" aria-label="Entfernen">${ic('close', 12)}</button></div></div>`;
    const add = k => `<div class="vr tap" data-act="qadd" data-e="${esc(k)}"><div class="ico">${ic(this._qIcon(k), 19)}</div><div><div class="t">${esc(this._name(k))}</div><div class="s">${k.startsWith('scene.') ? 'Szene' : k.startsWith('script.') ? 'Skript' : esc(k)}</div></div><div class="m">${ic('plus', 16)}</div></div>`;
    return `<div class="grab"></div><div class="sh"><button class="x bk" data-act="settings" aria-label="Zurück">${ic('chevron', 20)}</button><div class="ico">${ic('sparkle', 24)}</div><div><h2>Schnellaktionen</h2><p>Leiste oben auf der Startseite · gilt nur für dieses Gerät</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="lab2">IN DER LEISTE · ${list.length}</div>${list.length ? list.map(row).join('') : '<div class="empty">Noch keine Schnellaktionen</div>'}
      ${!has.has('builtin:goodnight') ? `<div class="vr tap" data-act="qadd" data-e="builtin:goodnight"><div class="ico">${ic('moon', 19)}</div><div><div class="t">Gute Nacht</div><div class="s">Lichter aus, offene Fenster melden</div></div><div class="m">${ic('plus', 16)}</div></div>` : ''}
      <div class="lab2">ANPINNEN · ${cand.length}</div>${fchips}${cand.length ? cand.map(add).join('') : '<div class="empty">Alles aus dieser Auswahl ist schon in der Leiste</div>'}
      <div class="lab2">NEUE SZENE AUS DEN AKTUELLEN LICHTERN</div>
      <div class="qnew"><input id="qname" type="text" maxlength="40" placeholder="z. B. Kino-Abend" autocomplete="off"><button class="vbt big on" data-act="qsave">${ic('check', 15)}Speichern</button></div>
      <div class="card-note">Merkt sich alle Lichter, die gerade an sind (Helligkeit &amp; Farbe), und legt sie in Home Assistant als Szene an. Braucht Administrator-Rechte.</div>
      <button class="qb" style="margin-top:12px" data-act="qreset">Standard wiederherstellen</button>`;
  }
  async _sceneSave() {
    const inp = this.shadowRoot.getElementById('qname'), name = (inp?.value || '').trim();
    if (!name) { this._toast('Bitte einen Namen eingeben'); return; }
    const on = this._lightsOn(); if (!on.length) { this._toast('Schalte erst die gewünschten Lichter ein'); return; }
    const ents = {};
    for (const e of on) {
      const a = this._attr(e, 'rgb_color') && this._attr(e, 'color_mode') !== 'color_temp' ? { rgb_color: this._attr(e, 'rgb_color') } : (this._attr(e, 'color_temp_kelvin') ? { color_temp_kelvin: this._attr(e, 'color_temp_kelvin') } : {});
      ents[e] = { state: 'on', ...(this._attr(e, 'brightness') ? { brightness: this._attr(e, 'brightness') } : {}), ...a };
    }
    const id = String(Date.now());
    try {
      await this._h.callApi('POST', 'config/scene/config/' + id, { id, name, entities: ents });
      await this._h.callService('scene', 'reload', {});
      const slug = 'scene.' + name.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      const list = this._quickList(); list.push([slug, name, 'sparkle']); this._quickSave(list);
      this._toast(`Szene „${name}“ gespeichert`); this._sig = ''; this._renderSheet(); this._render();
    } catch (er) { this._toast('Szene konnte nicht gespeichert werden (Administrator-Rechte nötig)', 4200); }
  }

  /* ───────────── v5.2: Luftgeräte (Entfeuchter, Luftreiniger …) ───────────── */
  _airGroups() {
    const ig = this._c.airIgnore || [], keys = this._c.air || Object.keys(this._h.states).filter(k => /^(fan|humidifier)\./.test(k));
    const g = {};
    for (const k of keys) { if (ig.some(x => k.includes(x))) continue; const id = k.split('.')[1]; (g[id] = g[id] || { id, ents: [] }).ents.push(k); }
    return Object.values(g).map(x => {
      const fan = x.ents.find(e => e.startsWith('fan.')), hum = x.ents.find(e => e.startsWith('humidifier.')), main = fan || hum;
      const off = x.ents.every(e => this._val(e) === 'unavailable' || this._val(e) === undefined);
      const rel = Object.keys(this._h.states).filter(k => k.startsWith('sensor.' + x.id + '_') && okv(this._val(k))).slice(0, 4);
      return { ...x, fan, hum, main, off, on: !off && x.ents.some(e => this._val(e) === 'on'), rel, name: this._name(main) };
    }).sort((a, b) => a.off - b.off || a.name.localeCompare(b.name, 'de'));
  }
  _airCard(i) {
    const G = this._airGroups(); if (!G.length) return '';
    const dev = g => {
      const a = g.fan ? this._s(g.fan)?.attributes || {} : {}, ha = g.hum ? this._s(g.hum)?.attributes || {} : {}, pct = a.percentage;
      const modes = (a.preset_modes || []).filter(Boolean);
      const sens = g.rel.map(k => `<span class="vchip">${esc(this._name(k).replace(g.name, '').trim() || this._name(k))} <b>${esc(this._val(k))}${this._unit(k) ? ' ' + esc(this._unit(k)) : ''}</b></span>`).join('');
      return `<div class="adev ${g.off ? 'off' : ''}"><div class="ahd"><div class="ico" style="${g.on ? 'color:#38bdf8;background:rgba(56,189,248,.16)' : ''}">${ic(g.hum && !g.fan ? 'drop' : 'wind', 19)}</div><div><div class="t">${esc(g.name)}</div><div class="s">${g.off ? 'Nicht erreichbar' : g.on ? 'An' : 'Aus'}${g.on && pct != null ? ' · ' + pct + ' %' : ''}${g.on && ha.humidity != null ? ' · Ziel ' + ha.humidity + ' %' : ''}</div></div>${g.off ? '<span class="tag bad">offline</span>' : `<button class="sw ${g.on ? 'on' : ''}" data-act="toggle" data-e="${g.main}" aria-label="Ein/Aus"></button>`}</div>
        ${!g.off && g.on ? `<div class="actl">${g.fan && a.percentage != null ? [33, 66, 100].map(p => `<button class="vbt ${pct != null && Math.abs(pct - p) < 17 ? 'on' : ''}" data-act="fanpct" data-e="${g.fan}" data-p="${p}">${p === 33 ? 'Leise' : p === 66 ? 'Mittel' : 'Stark'}</button>`).join('') : ''}${modes.map(m => `<button class="vbt ${a.preset_mode === m ? 'on' : ''}" data-act="preset" data-e="${g.fan}" data-m="${esc(m)}">${esc(m)}</button>`).join('')}${g.hum && ha.humidity != null ? `<button class="vbt" data-act="hum" data-e="${g.hum}" data-d="-5" aria-label="Weniger">${ic('minus', 12)}</button><span class="vh2" style="align-self:center">Ziel ${ha.humidity} %</span><button class="vbt" data-act="hum" data-e="${g.hum}" data-d="5" aria-label="Mehr">${ic('plus', 12)}</button>` : ''}</div>` : ''}
        ${sens ? `<div class="vchips" style="margin-top:8px">${sens}</div>` : ''}</div>`;
    };
    return `<div class="c" style="margin-top:16px;--i:${i}"><div class="h">${ic('wind', 14)}Luft &amp; Geräte<span class="r">${G.filter(g => g.on).length} an · ${G.length} Geräte</span></div>${G.map(dev).join('')}</div>`;
  }

  /* ───────────── v6: Wetterradar ───────────── */
  _rdrCfg() {
    const u = this._c.rdr || {};
    return Object.assign({
      wms: 'https://maps.dwd.de/geoserver/dwd/wms', radar: 'dwd:Niederschlagsradar', bolt: 'dwd:Blitzdichte', warn: 'dwd:Warnungen_Landkreise',
      base: { dark: ['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'], light: ['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}'] }, past: 120, future: 60, zoom: 8, factor: 1, strikeKm: 50, rings: [10, 25],
      mock: !!this._h?.config?.mock, kw: { storm: 'binary_sensor.kachelmannwetter_gewitter_erwartet' },
    }, u);
  }
  _rdrWarns() {
    const out = [], A = this._c.alerts || {};
    [['now', A.now, false], ['pre', A.pre, true]].forEach(([k, e, pre]) => {
      const a = this._s(e)?.attributes; if (!a) return;
      const n = Math.min(12, +a.warning_count || 0);
      for (let i = 1; i <= n; i++) {
        const p = 'warning_' + i + '_', name = a[p + 'name']; if (!name) continue;
        out.push({ k, i, pre, name, level: +a[p + 'level'] || (pre ? 1 : 2), type: a[p + 'type'] || '', head: a[p + 'headline'] || '', desc: a[p + 'description'] || '', instr: a[p + 'instruction'] || '', start: a[p + 'start'], end: a[p + 'end'] });
      }
    });
    return out.sort((a, b) => (a.pre - b.pre) || b.level - a.level);
  }
  _rdrMount() {
    if (!this._built) return;
    const sh = this._sheet?.t === 'radar', slot = (sh ? this._sh : this._main).querySelector('.rdslot');
    if (!slot) { this._rdr?.pause(); return; }
    if (!this._rdr) this._rdr = new AuroraRadar(this);
    const r = this._rdr, moved = r.root.parentNode !== slot;
    if (moved) slot.appendChild(r.root);
    r.setMode(sh); r.resume(); if (moved) r.resize(); r.upd();
  }
  _radarCard(i, cls = 's6') {
    return `<div class="c ${cls} rdc" style="--i:${i}"><div class="h">${ic('radar', 14)}Regenradar<span class="r"><button class="rd-open" data-act="radar">${ic('expand', 14)}Vollbild</button></span></div><div class="rdslot" data-keep="1"></div></div>`;
  }
  _sRadar() { return `<div class="rdslot full" data-keep="1"></div>`; }
  _sWarn() {
    const s = this._sheet, w = this._rdrWarns().find(x => x.k === s.k && x.i === s.i) || null;
    const back = s.from === 'radar' ? 'radar' : 'close';
    if (!w) return `<div class="grab"></div><div class="sh"><div class="ico">${ic('alert', 24)}</div><div><h2>Wetterwarnung</h2><p>Keine aktive Warnung</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div><div class="empty">Diese Warnung ist nicht mehr aktiv.</div>`;
    const fmt = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); };
    const LV = ['', 'Wetterwarnung', 'Markante Wetterwarnung', 'Unwetterwarnung', 'Extreme Unwetterwarnung'];
    const others = this._rdrWarns().filter(x => x !== w);
    return `<div class="grab"></div><div class="sh"><div class="ico wl l${w.level}">${ic('alert', 24)}</div><div><h2>${esc(w.name)}</h2><p>${w.pre ? 'Vorabinformation' : LV[Math.min(4, w.level)]} · Stufe ${w.level}</p></div><button class="x" data-act="${back}">${ic(back === 'radar' ? 'radar' : 'close', 20)}</button></div>
      <div class="wbox l${w.level} ${w.pre ? 'pre' : ''}"><div class="wt"><span>${w.start ? 'von ' + esc(fmt(w.start)) : ''}</span><span>${w.end ? 'bis ' + esc(fmt(w.end)) : ''}</span></div>${w.head ? `<h3>${esc(w.head)}</h3>` : ''}
      ${w.desc ? `<p class="wd">${esc(w.desc)}</p>` : ''}${w.instr ? `<div class="wi"><b>Verhaltenshinweise</b><p>${esc(w.instr)}</p></div>` : ''}<small>Quelle: Deutscher Wetterdienst</small></div>
      ${others.length ? `<div class="wo">${others.map(o => `<button class="rd-w l${o.level} ${o.pre ? 'pre' : ''}" data-act="warn" data-k="${o.k}" data-i="${o.i}" data-from="${esc(s.from || '')}">${ic('alert', 14)}<span>${o.pre ? 'Vorab: ' : ''}${esc(o.name)}</span></button>`).join('')}</div>` : ''}`;
  }

  /* ───────────── v6.1: Tablet-Sperre (Kiosk Mode + PIN) ───────────── */
  _lockOn() { const e = this._c.unlock?.entity; return !!(WALL_UI && e && this._s(e)); }
  _lockBtn() {
    if (!this._lockOn()) return '';
    const open = this._val(this._c.unlock.entity) === 'on';
    return `<button class="nb lk ${open ? 'on' : ''}" data-act="lock">${ic(open ? 'unlock' : 'lock', 24)}<span class="lab">${open ? 'Sperren' : 'Entsperren'}</span></button>`;
  }
  _unlockPin() { const u = this._c.unlock || {}, s = this._val(u.pin); return okv(s) && String(s).length ? String(s) : String(u.code || ''); }
  _lockToggle() {
    const e = this._c.unlock.entity;
    if (this._val(e) === 'on') { this._h.callService('input_boolean', 'turn_off', { entity_id: e }); this._toast('Gesperrt 🔒'); return; }
    this._pin = ''; this._pinBad = 0; this._sheet = { t: 'pin' }; this._renderSheet();
  }
  _pinKey(k) {
    if (Date.now() < (this._pinWait || 0)) return;
    const need = this._unlockPin(); if (!need) return;
    this._pin = ((this._pin || '') + k).slice(0, need.length); this._pinBad = 0;
    if (this._pin.length < need.length) return this._renderSheet();
    if (this._pin === need) {
      if (this._sheet?.kid) { const pn = this._pin; this._pinFails = 0; this._pin = ''; this._kidPinOk(pn); return; }
      this._h.callService('input_boolean', 'turn_on', { entity_id: this._c.unlock.entity }); this._pinFails = 0; this._pin = ''; this._closeSheet(); this._toast('Entsperrt 🔓'); return;
    }
    this._pinFails = (this._pinFails || 0) + 1; this._pinBad = Date.now(); this._pin = '';
    if (this._pinFails >= 5) { this._pinWait = Date.now() + 30000; this._pinFails = 0; }
    this._renderSheet();
  }
  _sPin() {
    const need = this._unlockPin(), n = need.length || 4, p = this._pin || '', bad = Date.now() - (this._pinBad || 0) < 700, wait = Date.now() < (this._pinWait || 0);
    const dots = Array.from({ length: n }, (_, i) => `<i class="${i < p.length ? 'on' : ''}"></i>`).join('');
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<button class="pk" data-act="pk" data-k="${k}">${k}</button>`).join('') + `<span></span><button class="pk" data-act="pk" data-k="0">0</button><button class="pk del" data-act="pdel" aria-label="Löschen">${ic('backspace', 24)}</button>`;
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('lock', 24)}</div><div><h2>${this._sheet.kid ? 'Eltern-PIN' : 'Tablet entsperren'}</h2><p>${!need ? 'PIN nicht verfügbar' : wait ? 'Zu viele Versuche – kurz warten' : bad ? 'Falsche PIN' : this._sheet.kid ? 'PIN eingeben für ' + esc(this._kidActTxt()) : 'PIN eingeben für Seitenleiste &amp; Einstellungen'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="pinw"><div class="pdots ${bad ? 'bad' : ''}">${dots}</div><div class="pad">${keys}</div></div>`;
  }

  /* ───────────── Tanken: Übersicht der günstigsten Tankstellen (Tankerkönig) ───────────── */
  _fuelData(kind) {
    const S = this._h.states, st = {}, hl = this._h.config?.latitude, hn = this._h.config?.longitude;
    const km = (a, b, c, d) => { if ([a, b, c, d].some(v => v == null || isNaN(v))) return null; const R = Math.PI / 180, x = (d - b) * R * Math.cos((a + c) / 2 * R), y = (c - a) * R; return Math.sqrt(x * x + y * y) * 6371; };
    for (const k in S) {
      const s = S[k], a = s.attributes || {};
      if (!k.startsWith('sensor.') || !a.fuel_type || !a.station_name) continue;
      const id = k.replace(/_(super_e10|super|diesel|e10|e5)$/, '');
      const o = st[id] || (st[id] = { e: {}, id, brand: a.brand || a.station_name, name: String(a.friendly_name || a.station_name).replace(/\s+(Super E10|Super E5|Super|Diesel|E10|E5)$/i, ''), street: [a.street, a.house_number].filter(Boolean).join(' '), city: a.city, lat: a.latitude, lon: a.longitude, p: {}, t: 0 });
      const v = parseFloat(s.state);
      if (v > 0 && v < 10) { o.p[String(a.fuel_type).toLowerCase()] = v; o.e[String(a.fuel_type).toLowerCase()] = k; o.t = Math.max(o.t, new Date(s.last_updated).getTime() || 0); }
    }
    for (const k in S) {
      if (!k.startsWith('binary_sensor.') || !/_status$/.test(k)) continue;
      const o = st[k.replace(/_status$/, '')]; if (o) o.open = S[k].state === 'on';
    }
    const all = Object.values(st).filter(o => o.p[kind] != null).map(o => Object.assign(o, { price: o.p[kind], km: km(hl, hn, o.lat, o.lon) }));
    all.sort((a, b) => ((b.open !== false) - (a.open !== false)) || a.price - b.price || (a.km ?? 1e9) - (b.km ?? 1e9));
    return { all, total: Object.keys(st).length };
  }
  _sFuel() {
    const K = ['e10', 'e5', 'diesel'], KL = { e10: 'Super E10', e5: 'Super E5', diesel: 'Diesel' };
    const kind = K.includes(this._fuelK) ? this._fuelK : 'e10', D = this._fuelData(kind), L = D.all.slice(0, 8), best = L[0];
    const fp = v => { const s = de(v, 3); return `${s.slice(0, -1)}<sup>${s.slice(-1)}</sup>`; };
    const seg = `<div class="seg fseg">${K.map(k => `<button class="${k === kind ? 'on' : ''}" data-act="fuelk" data-k="${k}">${KL[k]}</button>`).join('')}</div>`;
    const upd = D.all.reduce((m, o) => Math.max(m, o.t), 0);
    const head = `<div class="grab"></div><div class="sh"><div class="ico">${ic('fuel', 24)}</div><div><h2>Tankpreise</h2><p>${best ? esc(KL[kind]) + ' · ' + L.length + ' günstigste von ' + D.all.length + (upd ? ' · ' + this._rel(upd) : '') : 'Keine Preise verfügbar'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>${seg}`;
    if (!best) return head + `<div class="empty">⛽ Keine Tankstellen mit ${esc(KL[kind])}-Preis gefunden. Ist die Tankerkönig-Integration eingerichtet?</div>`;
    L.forEach(o => { if (o.e[kind]) this._need.add(o.e[kind]); });
    const maps = !window.fully;
    const trendOf = o => { const pts = this._hist[o.e[kind]]?.pts?.filter(p => !isNaN(p[1])) || []; if (pts.length < 2) return ''; const dd = (pts[pts.length - 1][1] - pts[0][1]) * 100; return Math.abs(dd) < .05 ? '' : `<em class="ft ${dd > 0 ? 'up' : 'dn'}" title="Änderung in 24 h">${ic(dd > 0 ? 'arrowup' : 'arrowdown', 12)}${de(Math.abs(dd), 1)}</em>`; };
    const row = (o, i) => { const closed = o.open === false, d = (o.price - best.price) * 100, go = maps && o.lat != null && o.lon != null;
      return `<div class="fr ${closed ? 'cl' : ''} ${i === 0 && !closed ? 'bst' : ''} ${go ? 'go' : ''}" ${go ? `data-act="maps" data-lat="${o.lat}" data-lon="${o.lon}"` : ''}><div class="rk">${i + 1}</div><div class="tx"><div class="n">${esc(o.name)}</div><div class="s">${esc([o.city, o.km != null ? de(o.km, 1) + ' km' : '', closed ? 'geschlossen' : ''].filter(Boolean).join(' · '))}</div></div><div class="pr"><b>${trendOf(o)}${fp(o.price)}<small> €</small></b><span>${i === 0 || d < 0.05 ? 'günstigster' : '+' + de(d, 1) + ' ct'}</span></div>${go ? `<div class="mp">${ic('chevron', 16)}</div>` : ''}</div>`; };
    return head + `<div class="lab2">TOP ${L.length} · ${esc(KL[kind]).toUpperCase()}</div><div class="fl">${L.map(row).join('')}</div><div class="card-note">Pfeil: Preisänderung in den letzten 24 h (ct)${maps ? ' · Tippen öffnet die Route in Karten' : ''}</div>`;
  }

  /* ───────────── Pflanzen: Übersicht aller Pflanzensensoren ───────────── */
  _plantsData() {
    const S = this._h.states, out = [], cfg = this._c.plants;
    const ids = Array.isArray(cfg) && cfg.length ? cfg.map(x => typeof x === 'string' ? { moist: x } : x) : Object.keys(S).filter(k => /^sensor\..+_soil_moisture$/.test(k)).map(k => ({ moist: k }));
    for (const p of ids) {
      const base = p.moist.replace(/_soil_moisture$/, ''), pick = (v, sfx, dom = 'sensor') => v || (S[`${dom}.${base.replace(/^sensor\./, '')}_${sfx}`] ? `${dom}.${base.replace(/^sensor\./, '')}_${sfx}` : null);
      const ms = S[p.moist]; if (!ms) continue;
      const t = pick(p.temp, 'temperature'), h = pick(p.hum, 'humidity'), b = pick(p.bat, 'battery'), dr = pick(p.dry, 'dry', 'binary_sensor'), wn = pick(null, 'soil_warning', 'number');
      const mv = parseFloat(ms.state), warn = wn ? parseFloat(S[wn]?.state) : 20, num = e => { const v = e && S[e] ? parseFloat(S[e].state) : NaN; return isNaN(v) ? null : v; };
      const name = p.name || String(ms.attributes.friendly_name || base).replace(/\s+(Feuchtigkeit|Bodenfeuchte|Soil moisture|Moisture)$/i, '');
      out.push({ e: p.moist, name, moist: isNaN(mv) ? null : mv, warn: isNaN(warn) ? 20 : warn, temp: num(t), hum: num(h), bat: num(b), dry: dr && S[dr] ? S[dr].state === 'on' : (!isNaN(mv) && mv < (isNaN(warn) ? 20 : warn)), t: new Date(ms.last_updated).getTime() || 0 });
    }
    return out.sort((a, b) => (b.dry - a.dry) || a.name.localeCompare(b.name, 'de'));
  }
  _sPlants() {
    const L = this._plantsData(), P = this._plant(), dry = L.filter(x => x.dry).length;
    const head = `<div class="grab"></div><div class="sh"><div class="ico">${ic('leaf', 24)}</div><div><h2>Pflanzen</h2><p>${L.length ? (dry ? dry + ' von ' + L.length + ' brauchen Wasser' : 'Alle ' + L.length + ' Pflanzen versorgt') : 'Keine Pflanzensensoren gefunden'}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    const wat = P ? `<div class="pwat ${P.due ? 'due' : ''}"><div class="bub">${ic('drop', 22)}</div><div class="tx"><div class="n">${P.days === 0 ? 'Heute gegossen' : 'Zuletzt gegossen vor ' + P.days + (P.days === 1 ? ' Tag' : ' Tagen')}</div><div class="s">${P.last.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}${P.due ? ' · Intervall ' + this._c.plant.days + ' Tage erreicht' : ''}</div></div><button class="pgb" data-act="plant">${ic('drop', 16)}Gegossen</button></div>` : '';
    const chip = (ico, v, u, warn) => v == null ? '' : `<span class="pch ${warn ? 'w' : ''}">${ic(ico, 14)}${de(v, v % 1 ? 1 : 0)}${u}</span>`;
    const card = x => { const col = x.dry ? '251,191,36' : '52,211,153', pc = x.moist == null ? 0 : clamp(x.moist, 2, 100);
      return `<div class="plc ${x.dry ? 'dry' : ''}" style="--c:${col}" data-act="more" data-e="${esc(x.e)}"><div class="bub">${ic('leaf', 22)}</div><div class="tx"><div class="n">${esc(x.name)}</div><div class="pm"><div class="pc2"><i style="width:${pc}%;background:rgb(${col})"></i></div><b>${x.moist == null ? '–' : de(x.moist, 0) + ' %'}</b></div><div class="pchs">${chip('thermo', x.temp, ' °C')}${chip('drop', x.hum, ' %')}${chip('battery', x.bat, ' %', x.bat != null && x.bat < 20)}</div></div><div class="bd ${x.dry ? '' : 'ok'}">${x.dry ? 'Gießen' : 'OK'}</div></div>`; };
    return head + wat + (L.length ? `<div class="lab2">PFLANZEN · ${L.length}</div><div class="pll">${L.map(card).join('')}</div>` : `<div class="empty">🌱 Keine Pflanzensensoren (…_soil_moisture) gefunden.</div>`);
  }

  /* ───────────── Heizung je Raum ───────────── */
  /* Temperatur- & Luftfeuchtetrend (24 h) in einem Diagramm, Achsen links/rechts mit Min/Max */
  _trend(r, col, opt = {}) {
    const T = r.temp, H = r.hum; if (!T && !H) return '';
    [T, H].forEach(x => { if (x && !this._hist[x]) this._need.add(x); });
    if ((T && !this._hist[T]) || (H && !this._hist[H])) return `${opt.bare ? '' : '<div class="lab2">TREND · 24 H</div>'}<div class="sk" style="height:${opt.h || 150}px"></div>`;
    const pt = x => (x && this._hist[x]?.pts || []).filter(p => !isNaN(p[1]));
    const tp = pt(T), hp = pt(H); if (!tp.length && !hp.length) return opt.bare ? '<div class="empty">Noch keine Verlaufsdaten</div>' : '';
    const t0 = Math.min(...[tp[0]?.[0], hp[0]?.[0]].filter(v => v != null)), t1 = Math.max(...[tp.at(-1)?.[0], hp.at(-1)?.[0]].filter(v => v != null)), W = 600, Hh = 120;
    const st = a => { const v = a.map(p => p[1]), lo = Math.min(...v), hi = Math.max(...v), av = v.reduce((s, x) => s + x, 0) / v.length; return { lo, hi, av }; };
    const path = (a, S) => { const rg = Math.max(S.hi - S.lo, 1), pd = rg * .08, mn = S.lo - pd, mx = S.hi + pd; return a.map((p, i) => `${i ? 'L' : 'M'}${((p[0] - t0) / Math.max(t1 - t0, 1) * W).toFixed(1)} ${(Hh - (p[1] - mn) / (mx - mn) * Hh).toFixed(1)}`).join(''); };
    const TS = tp.length ? st(tp) : null, HS = hp.length ? st(hp) : null, tl = tp.length ? path(tp, TS) : '', hl = hp.length ? path(hp, HS) : '';
    const hh = x => new Date(x).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const side = (S, d, u, c, ico, right) => S ? `<div class="tcol ${right ? 'r' : ''}" style="color:${c}"><span>${ic(ico, 14)}${de(S.hi, d)}${u}</span><span>${de(S.lo, d)}${u}</span></div>` : '<div class="tcol"></div>';
    const gid = 'tg' + (r.id || '').replace(/\W/g, '');
    const svg = `<svg viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none" class="tsvg" ${opt.h ? `style="height:${opt.h}px"` : ''}><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".32"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
      ${tl ? `<path d="${tl}L${W} ${Hh}L0 ${Hh}Z" fill="url(#${gid})"/><path d="${tl}" fill="none" stroke="${col}" stroke-width="2.600" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="filter:drop-shadow(0 0 4px ${col})"/>` : ''}
      ${hl ? `<path d="${hl}" fill="none" stroke="#38bdf8" stroke-width="2.200" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` : ''}</svg>`;
    const avg = `<div class="tavg">${TS ? `<span style="color:${col}">${ic('thermo', 13)}Ø ${de(TS.av, 1)} °C</span>` : ''}${HS ? `<span style="color:#38bdf8">${ic('drop', 13)}Ø ${de(HS.av, 0)} %</span>` : ''}</div>`;
    return `${opt.bare ? '' : '<div class="lab2">TEMPERATUR &amp; LUFTFEUCHTE · 24 H</div>'}<div class="${opt.bare ? 'trend tb' : 'sctl trend'}" style="display:block"><div class="trow">${side(TS, 1, '°', col, 'thermo', false)}<div class="tmid">${svg}</div>${side(HS, 0, '%', '#38bdf8', 'drop', true)}</div><div class="tax"><span>${hh(t0)}</span><span>${hh((t0 + t1) / 2)}</span><span>${hh(t1)}</span></div>${avg}</div>`;
  }
  _sHeat() {
    const r = this._c.rooms.find(x => x.id === this._sheet.id); if (!r || !r.climate) return `<div class="grab"></div><div class="empty">Kein Thermostat für diesen Raum.</div>`;
    const I = this._room(r), cl = I.cl, at = cl?.attributes || {}, e = r.climate, off = I.mode === 'off', heat = I.act === 'heating';
    if (!cl) return `<div class="grab"></div><div class="sh"><div class="ico">${ic('thermo', 24)}</div><div><h2>Heizung · ${esc(r.name)}</h2><p>Thermostat nicht verfügbar</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    const cur = at.current_temperature ?? I.temp, tg = at.temperature, mn = at.min_temp ?? 5, mx = at.max_temp ?? 30, hum = at.current_humidity ?? I.hum;
    const PL = { none: 'Manuell', eco: 'Eco', comfort: 'Komfort', sleep: 'Schlafen', boost: 'Boost', away: 'Abwesend', home: 'Zuhause', activity: 'Aktiv' };
    let pt = {}; try { pt = typeof at.bt_preset_heat_temperatures === 'string' ? JSON.parse(at.bt_preset_heat_temperatures) : (at.bt_preset_heat_temperatures || {}); } catch (x) { pt = {}; }
    const presets = (at.preset_modes || []).filter(m => m !== 'none');
    const status = off ? 'Heizung aus' : I.open || at.window_open ? 'Fenster offen – Heizung pausiert' : heat ? 'Heizt gerade' : 'Bereit – Wunschtemperatur erreicht';
    const col = cur != null ? tempCol(cur) : '#fb923c', fc = clamp(((cur ?? 10) - 10) / 20, 0, 1), ft = clamp(((tg ?? 10) - 10) / 20, 0, 1), a1 = 135 + 270 * fc, a2 = 135 + 270 * ft;
    const tx = 100 + 84 * Math.cos(a2 * Math.PI / 180), ty = 100 + 84 * Math.sin(a2 * Math.PI / 180);
    const dial = `<div class="hdial"><svg viewBox="0 0 200 170"><path d="${arc(100, 100, 84, 135, 405)}" fill="none" stroke="rgba(${WH},.09)" stroke-width="12" stroke-linecap="round"/>${cur != null ? `<path d="${arc(100, 100, 84, 135, Math.max(135.5, a1))}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${col});opacity:${off ? .35 : 1}"/>` : ''}${tg != null && !off ? `<circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="9" fill="${FG}"/><circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="3.500" fill="${col}"/>` : ''}</svg>
      <div class="mid"><div class="l">Aktuell</div><div class="cur big">${de(cur)}<small class="u">°</small></div><div class="tg">${off ? 'Heizung aus' : 'Ziel <b>' + de(tg) + '°</b>'}</div>${hum != null ? `<div class="hhum">${ic('drop', 12)}${de(hum, 0)} %</div>` : ''}</div></div>`;
    const ctl = `<div class="hctl"><button class="rbn" data-act="temp" data-e="${e}" data-d="-0.5" ${off ? 'disabled' : ''}>${ic('minus', 22)}</button><div class="hset"><b>${off ? '–' : de(tg)}</b><span>Wunsch °C</span></div><button class="rbn" data-act="temp" data-e="${e}" data-d="0.5" ${off ? 'disabled' : ''}>${ic('plus', 22)}</button></div>`;
    const modes = (at.hvac_modes || ['heat', 'off']).filter(m => ['heat', 'off', 'auto', 'heat_cool'].includes(m)), ML = { heat: 'Heizen', off: 'Aus', auto: 'Auto', heat_cool: 'Auto' };
    const seg = `<div class="seg hseg">${modes.map(m => `<button class="${I.mode === m ? 'on' : ''}" data-act="chvac" data-e="${e}" data-m="${m}">${ML[m]}</button>`).join('')}</div>`;
    const pre = presets.length ? `<div class="lab2">VOREINSTELLUNGEN</div><div class="hpre">${presets.map(m => `<button class="${at.preset_mode === m ? 'on' : ''}" data-act="cpreset" data-e="${e}" data-m="${m}"><b>${esc(PL[m] || m)}</b>${pt[m] != null ? `<span>${de(pt[m], 1)}°</span>` : ''}</button>`).join('')}</div>` : '';
    const lc = at.last_change ? new Date(at.last_change).getTime() : new Date(cl.last_changed).getTime(), vm = at.next_valve_maintenance ? new Date(at.next_valve_maintenance) : null;
    const tiles = `<div class="dg">${this._tile(I.open || at.window_open ? 'Offen' : 'Zu', 'Fenster', 'window')}${this._tile(this._rel(lc).replace('vor ', ''), 'Letzte Änderung', 'clock')}${vm && !isNaN(vm) ? this._tile(vm.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }), 'Ventilwartung', 'wrench') : ''}</div>`;
    const errs = (typeof at.errors === 'string' && at.errors !== '[]' && at.errors.length > 2 ? `<div class="card-note" style="color:#fb7185">Thermostat meldet: ${esc(at.errors)}</div>` : '') + (r.temp ? this._staleNote(r.temp) : '');
    [r.temp, r.hum].forEach(x => { if (x && !this._hist[x]) this._need.add(x); });
    const trend = this._trend(r, col);
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic(r.icon, 24)}</div><div><h2>Heizung · ${esc(r.name)}</h2><p>${esc(status)}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="hhero ${heat ? 'heat' : ''}">${dial}<div class="hside">${ctl}${seg}</div></div>
      ${pre}${errs}
      <div class="lab2">STATUS</div>${tiles}
      ${trend}
      <div class="hbtns"><button class="qb" data-act="sched">${ic('clock', 14)}Heizungsplan</button><button class="qb" data-act="room" data-room="${r.id}">${ic(r.icon, 14)}Zurück zum Raum</button></div>`;
  }

  /* ───────────── v7: Alter von Messwerten, Feuchte-Hinweis, Fully-Helligkeit ───────────── */
  _age(e) { const s = e && this._s(e); if (!s) return null; const t = new Date(s.last_reported || s.last_updated || s.last_changed).getTime(); return isNaN(t) ? null : Math.max(0, Date.now() - t); }
  _stale(e, min) { const a = this._age(e); return a != null && a > (min || this._c.stale_min || 240) * 6e4 ? a : null; }
  _agoTxt(ms) { const m = Math.round(ms / 6e4); return m < 60 ? m + ' Min.' : m < 2880 ? Math.round(m / 60) + ' Std.' : Math.round(m / 1440) + ' Tg.'; }
  _humLevel(I) { const w = this._c.hum_warn || 65; return I.hum == null || I.open || I.hum < w ? 0 : I.hum >= w + 10 ? 2 : 1; }
  _humHint(r, I) {
    const lv = this._humLevel(I); if (!lv) return '';
    return `<button class="hwarn l${lv}" data-act="vent">${ic('wind', 20)}<div><b>Luftfeuchte ${lv === 2 ? 'sehr ' : ''}hoch · ${de(I.hum, 0)} %</b><span>Fenster ist zu – Stoßlüften empfohlen</span></div></button>`;
  }
  _staleNote(e) { const a = this._stale(e); return a != null ? `<div class="card-note stn">${ic('clock', 14)}Raumsensor hat seit ${this._agoTxt(a)} nichts gemeldet – Werte evtl. veraltet</div>` : ''; }
  _camBadge() {
    const f = this._camFail || 0, a = this._camAt ? Date.now() - this._camAt : null;
    return f >= 2 || (a != null && a > 15e3) ? `${ic('clock', 13)}Kamerabild veraltet${a != null && a > 6e4 ? ' · vor ' + this._agoTxt(a) : ''}` : '';
  }
  /* Fully Kiosk: Helligkeit nach Tageszeit (nur Tablet-Version, nur wenn die Fully-JavaScript-Schnittstelle da ist) */
  _fullyOk() { return WALL_UI && typeof window.fully?.setScreenBrightness === 'function'; }
  _fullyApply(force) {
    if (!this._fullyOk()) return;
    const on = this._fuPref === '1', L = { day: 200, dusk: 120, night: 35, ...(this._c.fully_brightness || {}) };
    if (!on) { this._fuLast = null; return; }
    let v = L[this._app?.dataset.tod] ?? L.day;
    if (this._amb) v = Math.min(v, this._ambBy === 'night' ? 20 : 90);
    v = Math.max(1, Math.min(255, Math.round(v)));
    if (!force && this._fuLast === v) return;
    this._fuLast = v;
    try { window.fully.setScreenBrightness(v); } catch (e) { /* optional */ }
  }
  _fullySet() {
    if (!this._fullyOk()) return '';
    const on = this._fuPref === '1', seg = `<div class="seg wide">${[['1', 'Automatisch'], ['0', 'Aus']].map(x => `<button class="${(on ? '1' : '0') === x[0] ? 'on' : ''}" data-act="fuauto" data-m="${x[0]}">${x[1]}</button>`).join('')}</div>`;
    return `<div class="lab2">TABLET-HELLIGKEIT (FULLY)</div>${seg}<div class="card-note">Standard: Aus – die Helligkeit regelt eine Home-Assistant-Automation. „Automatisch“ dimmt stattdessen direkt über das Dashboard: tags hell, abends gedimmt, nachts dunkel.</div>`;
  }

  /* ───────────── v8: Kinder-Handy (Google Family Link) mit PIN ───────────── */
  _kids() { return (this._c.kidphones || []).filter(k => k && this._s(k.lock)); }
  _kidInfo(k) {
    const sw = this._s(k.lock), a = (sw && sw.attributes) || {}, off = !sw || sw.state === 'unavailable' || sw.state === 'unknown';
    const code = Number(a.lock_override_code), nv = e => { const v = e && parseFloat(this._val(e)); return isNaN(v) ? null : v; };
    const manual = !!a.locked || code === 1 || code === 7, freed = !manual && code === 4;
    let usable = !off && (sw.state === 'on' || freed);
    const bonus = a.bonus_minutes != null ? Number(a.bonus_minutes) : (nv(k.bonus) || 0);
    const used = nv(k.used), lim = this._s(k.limit)?.attributes || {};
    const limit = lim.enabled ? Number(lim.configured_minutes) || null : null;
    let reason = '', wait = false;
    const op = this._kidOpt;
    if (op && op.e === k.lock && Date.now() - op.t < 30000 && op.sig === JSON.stringify([sw?.state, a.lock_override_code, a.bonus_minutes, a.locked])) { wait = true; if (op.a === 'sperren') usable = false; if (op.a === 'entsperren') usable = true; }
    if (off) reason = 'Keine Verbindung zu Family Link';
    else if (wait) reason = op.a === 'sperren' ? 'Sperre wird übertragen …' : op.a === 'entsperren' ? 'Freigabe wird übertragen …' : 'Bonus wird übertragen …';
    else if (freed) reason = 'Manuell entsperrt (Sperre aufgehoben)';
    else if (usable) reason = bonus > 0 ? `inkl. ${Math.round(bonus)} Min. Bonus` : 'Keine Sperre aktiv';
    else if (manual) reason = 'Manuell gesperrt';
    else if (a.daily_limit_reached || this._val(k.reached) === 'on') reason = 'Tageslimit erreicht';
    else if (a.bedtime_active || this._val(k.bed) === 'on') reason = 'Schlafenszeit';
    else if (a.school_time_active || this._val(k.school) === 'on') reason = 'Schulzeit';
    else reason = 'Gesperrt';
    return { sw, a, off, usable, manual, bonus, used, limit, reason, wait, tone: off ? 'warn' : usable ? 'live' : 'hot' };
  }
  _kidNext(k) {
    const a = this._s(k.next)?.attributes || {}, hm = s => { const d = new Date(s); return isNaN(d) ? '' : d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); };
    const day = s => { const d = new Date(s); if (isNaN(d)) return ''; const t0 = new Date(); t0.setHours(0, 0, 0, 0); const n = Math.round((new Date(d).setHours(0, 0, 0, 0) - t0.getTime()) / 864e5); return n === 0 ? 'heute' : n === 1 ? 'morgen' : d.toLocaleDateString('de-DE', { weekday: 'short' }); };
    if (a.bedtime_active && a.bedtime_end) return 'Schlafenszeit bis ' + hm(a.bedtime_end);
    if (a.schooltime_active && a.next_scheduled_end) return 'Schulzeit bis ' + hm(a.next_scheduled_end);
    if (a.next_scheduled_start) { const t = a.next_scheduled_type === 'bedtime' ? 'Schlafenszeit' : a.next_scheduled_type === 'school_time' ? 'Schulzeit' : 'Sperre'; return `${t} ${day(a.next_scheduled_start)} ${hm(a.next_scheduled_start)}`; }
    return '';
  }
  _kidSchool(k) {
    const a = this._s(k.school)?.attributes || {}, now = new Date(), pad = n => String(n).padStart(2, '0');
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`, hm = n => `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const cur = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const win = String(k.schoolWin && this._val(k.schoolWin) || ''), o = win.startsWith(today) ? win.split('|') : null;
    const flag = !!k.schoolFree && this._val(k.schoolFree) === 'on';
    const has = !!(k.schoolFree && k.schoolWin && this._s(k.schoolFree) && this._s(k.schoolWin));
    let s0 = a.schooltime_start && String(a.schooltime_start).startsWith(today) ? String(a.schooltime_start).slice(11, 16) : '', e0 = s0 && a.schooltime_end ? String(a.schooltime_end).slice(11, 16) : '';
    const os = o && o.length === 3 ? o[1] : '', oe = o && o.length === 3 ? o[2] : '';
    const ws = os || s0, we = oe || e0, mod = !!o;
    let st = 'none', title = 'Heute keine Schulzeit', sub = 'Wochenende, Ferien oder kein Plan für heute', ico = 'sun', tone = 'dim';
    if (mod && flag) { st = 'free'; title = 'Heute schulfrei'; sub = ws ? `Geplant war ${ws}–${we} Uhr · aufgehoben` : 'Schulzeit aufgehoben'; ico = 'sun'; tone = 'live'; }
    else if (mod) { st = 'ended'; title = 'Schule vorzeitig beendet'; sub = ws ? `Geplant war ${ws}–${we} Uhr` : ''; ico = 'check'; tone = 'live'; }
    else if (ws && cur < ws) { st = 'soon'; title = `Schule ab ${ws} Uhr`; sub = `bis ${we} Uhr`; ico = 'backpack'; tone = 'warn'; }
    else if (ws && cur < we) { st = 'run'; title = 'Schulzeit läuft'; sub = `${ws}–${we} Uhr`; ico = 'backpack'; tone = 'hot'; }
    else if (ws) { st = 'done'; title = 'Schule vorbei'; sub = `${ws}–${we} Uhr`; ico = 'check'; tone = 'dim'; }
    return { has, st, title, sub, ico, tone, mod, ws, we };
  }
  _kidRows() {
    return this._kids().map((k, i) => {
      const I = this._kidInfo(k), SC = this._kidSchool(k), u = (I.used != null ? ` · ${Math.round(I.used)} Min. heute` : '') + (SC.has && SC.st === 'free' ? ' · schulfrei' : '');
      return `<button class="xr kid" data-act="kid" data-i="${i}"><div class="ico">${ic('phone', 19)}</div><div><div class="t">${esc(k.title || (k.name + 's Handy'))}</div><div class="s">${I.usable ? 'Nutzbar' : esc(I.reason)}${I.usable && I.bonus > 0 ? ' · Bonus' : ''}${u}</div></div><span class="kdot ${I.off ? 'off' : I.usable ? 'ok' : 'lk'}"></span></button>`;
    });
  }
  _sKid() {
    const i = this._sheet.i || 0, k = this._kids()[i];
    if (!k) return `<div class="grab"></div><div class="sh"><div class="ico">${ic('phone', 24)}</div><div><h2>Handy</h2><p>Nicht verfügbar</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div><div class="empty">Das Gerät wurde in Home Assistant nicht gefunden. Ist die Family-Link-Integration geladen?</div>`;
    const I = this._kidInfo(k), ttl = k.title || (k.name + 's Handy'), nxt = this._kidNext(k), busy = !!this._kidBusy, SC = this._kidSchool(k), ok = Date.now() < (this._kidUntil || 0) && this._kidPin;
    const tiles = `<div class="dg kdg">${this._tile(I.used != null ? Math.round(I.used) + ' Min.' : '–', 'Heute genutzt', 'clock')}${this._tile(I.bonus > 0 ? Math.round(I.bonus) + ' Min.' : 'Kein', 'Bonuszeit', 'plus')}${this._tile(I.limit ? I.limit + ' Min.' : 'Kein Limit', 'Tageslimit', 'gauge')}${this._tile(nxt ? esc(nxt) : '–', 'Nächste Sperre', 'bed').replace('class="dt"', 'class="dt kfull"')}</div>`;
    const b = (a, cls, ico, txt, sub) => `<button class="kb ${cls || ''}" data-act="kact" data-i="${i}" data-a="${a}" ${busy ? 'disabled' : ''}>${ic(ico, 22)}<b>${txt}</b>${sub ? `<small>${sub}</small>` : ''}</button>`;
    return `<div class="grab"></div><div class="sh"><div class="ico">${ic('phone', 24)}</div><div><h2>${esc(ttl)}</h2><p>${I.off ? 'Keine Verbindung' : I.usable ? 'Nutzbar' : esc(I.reason)}${nxt && !I.off ? ' · ' + esc(nxt) : ''}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>
      <div class="vst ${I.tone}"><div class="vsi">${ic(I.usable ? 'unlock' : 'lock', 26)}</div><div class="vsx"><div class="vkick">STATUS</div><div class="vh1">${I.off ? 'Offline' : I.usable ? 'Handy nutzbar' : 'Handy gesperrt'}</div><div class="vh2">${esc(I.reason)}</div></div></div>
      ${tiles}
      <div class="lab2">${ic(ok ? 'unlock' : 'lock', 13)} STEUERUNG · ${ok ? 'PIN akzeptiert' : 'nur mit PIN'}</div>
      <div class="kgrid k1">${I.usable ? b('sperren', 'danger', 'lock', 'Handy sperren', 'sofort, bis du es freigibst') : b('entsperren', 'good', 'unlock', 'Handy entsperren', 'hebt die Sperre auf')}</div>
      ${SC.has ? `<div class="lab2">${ic('backpack', 13)} SCHULZEIT HEUTE</div><div class="ksc ${SC.tone}"><div class="ksi">${ic(SC.ico, 22)}</div><div><b>${esc(SC.title)}</b><span>${esc(SC.sub)}</span></div></div><div class="kgrid k2">${SC.mod ? b('schule_normal', '', 'refresh', 'Wie geplant', 'Schulzeit wiederherstellen') : ''}${!SC.mod && (SC.st === 'soon' || SC.st === 'run') ? b('schule_frei', '', 'sun', 'Heute schulfrei', 'nur heute, Plan bleibt') : ''}${!SC.mod && SC.st === 'run' ? b('schule_aus', '', 'check', 'Schule jetzt aus', 'Schulzeit sofort beenden') : ''}</div>` : ''}
      <div class="lab2">${ic('plus', 13)} BONUSZEIT GEBEN</div>
      <div class="kgrid k3">${b('bonus15', '', 'plus', '+15', 'Minuten')}${b('bonus30', '', 'plus', '+30', 'Minuten')}${b('bonus60', '', 'plus', '+60', 'Minuten')}</div>
      <div class="kgrid k2">${I.bonus > 0 ? b('bonus_reset', '', 'refresh', 'Bonus zurücksetzen', Math.round(I.bonus) + ' Min. aktiv') : ''}<button class="kb" data-act="kact" data-i="${i}" data-a="ring">${ic('bell', 22)}<b>Handy klingeln</b><small>zum Wiederfinden · ohne PIN</small></button></div>
      <div class="card-note">Sperren, Bonuszeit und Schulzeit funktionieren nur mit PIN. Schulzeit ändert nur den heutigen Tag, der Wochenplan bleibt. An Ferien und Feiertagen setzt Home Assistant die Schulzeit automatisch auf frei. Ein Skript in Home Assistant prüft die PIN zusätzlich. Die PIN gilt danach 90 Sekunden. Ein aktiver Bonus hebt Schlafenszeit, Schulzeit und Tageslimit auf, aber nicht eine manuelle Sperre.</div>`;
  }
  _kidAct(i, a) {
    const k = this._kids()[i]; if (!k || this._kidBusy) return;
    if (a === 'ring') { this._h.callService('button', 'press', { entity_id: k.ring }); this._toast('Handy klingelt 🔔'); return; }
    if (Date.now() < (this._kidUntil || 0) && this._kidPin) return this._kidRun(i, a);
    this._kidPend = { i, a }; this._pin = ''; this._pinBad = 0; this._sheet = { t: 'pin', kid: true, i }; this._renderSheet();
  }
  _kidRun(i, a) {
    const MSG = { sperren: 'Handy gesperrt 🔒', entsperren: 'Handy entsperrt 🔓', bonus15: '+15 Min. Bonus gegeben', bonus30: '+30 Min. Bonus gegeben', bonus60: '+60 Min. Bonus gegeben', bonus_reset: 'Bonus zurückgesetzt', schule_frei: 'Heute schulfrei ☀️', schule_aus: 'Schule beendet ✓', schule_normal: 'Schulzeit wie geplant' };
    const sv = String(this._c.kidScript || 'script.kinderhandy_aktion').replace(/^script\./, '');
    this._kidBusy = a; if (this._sheet?.t === 'kid') this._renderSheet();
    let p; try { p = this._h.callService('script', sv, { aktion: a, pin: this._kidPin }); } catch (e) { p = Promise.reject(e); }
    const k0 = this._kids()[i], sw0 = k0 && this._s(k0.lock), a0 = (sw0 && sw0.attributes) || {};
    Promise.resolve(p).then(() => { if (k0) this._kidOpt = { e: k0.lock, a, t: Date.now(), sig: JSON.stringify([sw0?.state, a0.lock_override_code, a0.bonus_minutes, a0.locked]) }; this._toast(MSG[a] || 'Erledigt'); }).catch(e => {
      const m = String((e && (e.message || e.error)) || e || '');
      if (/pin/i.test(m)) { this._kidUntil = 0; this._kidPin = ''; this._toast('Falsche PIN ✕'); } else this._toast('Aktion fehlgeschlagen' + (m ? ': ' + m : ''), 4200);
    }).finally(() => { this._kidBusy = null; if (this._sheet?.t === 'kid') this._renderSheet(); });
  }
  _kidActTxt() {
    const a = this._kidPend?.a, T = { sperren: 'das Sperren', entsperren: 'das Entsperren', bonus15: '+15 Min. Bonus', bonus30: '+30 Min. Bonus', bonus60: '+60 Min. Bonus', bonus_reset: 'das Zurücksetzen des Bonus', schule_frei: 'Heute schulfrei', schule_aus: 'Schule jetzt aus', schule_normal: 'Schulzeit wie geplant', tv_entsperren: 'das Entsperren des Fernsehers', tv_schutz_aus: 'das Ausschalten der Kindersicherung', tv_bestaetigen: 'die Bestätigung' };
    return T[a] || (this._kidPend?.tv ? 'den Fernseher' : 'Leonies Handy');
  }
  _kidPinOk(pin) {
    const p = this._kidPend || { i: this._sheet?.i || 0, a: null };
    if (p.tv) {
      this._kidPin = pin; this._kidUntil = Date.now() + 9e4; this._kidPend = null; this._sheet = { t: 'tv' }; this._renderSheet();
      clearTimeout(this._kidTm); this._kidTm = setTimeout(() => { this._kidPin = ''; if (this._sheet?.t === 'tv') this._renderSheet(); }, 9.1e4);
      this._tvRun(p.op, p.e); return;
    }
    this._kidPin = pin; this._kidUntil = Date.now() + 9e4; this._kidPend = null;
    this._sheet = { t: 'kid', i: p.i }; this._renderSheet();
    clearTimeout(this._kidTm); this._kidTm = setTimeout(() => { this._kidPin = ''; if (this._sheet?.t === 'kid') this._renderSheet(); }, 9.1e4);
    if (p.a) this._kidRun(p.i, p.a);
  }

  /* ───────────── v9: Alarm-Banner (Waschmaschine, offene Fenster) und Schnellaktionen für beliebige Geräte ───────────── */
  _alertsHome() {
    const A = [], c = this._c, wa = c.alerts && c.alerts.washer;
    if (wa && wa.state && this._s(wa.state)) {
      const st = this._val(wa.state), nm = wa.name || 'Waschmaschine', s = this._s(wa.state);
      if (st === 'finished') {
        const t = new Date(s.last_changed).getTime(), ag = isNaN(t) ? null : Math.max(0, Date.now() - t), can = wa.unload && this._s(wa.unload) && this._val(wa.unload) !== 'unavailable';
        A.push({ id: 'wash', cls: 'ok', icon: 'check', text: nm + ' fertig', sub: (ag != null ? 'seit ' + this._agoTxt(ag) : '') + (can ? ' · tippen = ausgeräumt' : ''), act: can ? 'quick' : 'nav', attrs: can ? `data-e="${esc(wa.unload)}"` : 'data-v="home"' });
      } else if (['running', 'starting', 'rinse', 'ending', 'paused', 'user_paused'].includes(st)) {
        const pct = wa.pct ? this._num(wa.pct) : null, left = wa.left && okv(this._val(wa.left)) && this._val(wa.left) !== '0' ? this._val(wa.left) + (this._unit(wa.left) ? ' ' + this._unit(wa.left) : '') : '';
        A.push({ id: 'wash', cls: st.includes('paus') ? 'warn' : 'info', icon: 'drop', text: nm + (st.includes('paus') ? ' pausiert' : ' läuft'), sub: left ? 'noch ' + left : (pct != null ? de(pct, 0) + ' %' : ''), pct, act: 'nav', attrs: 'data-v="home"' });
      }
    }
    const open = this._openRooms();
    if (open.length) {
      const w = this._wxNow(), h = new Date().getHours(), night = h >= 22 || h < 6, wet = /rain|pour|hail|snow/.test(w.cond || '') || (w.rain || 0) > 0, cold = w.temp != null && w.temp <= 3;
      if (night || wet || cold) A.unshift({ id: 'open', crit: true, cls: 'warn', icon: 'window', text: 'Fenster/Türen offen', sub: open.join(', ') + ' · ' + (wet ? 'es regnet' : cold ? 'Frost' : 'nachts'), act: 'nav', attrs: 'data-v="rooms"' });
    }
    A.push(...this._cleanAlerts());
    return A;
  }
  _banPick(AL) { const now = Date.now(), dis = this._banDis || {}; return (AL || this._alerts()).filter(a => a.crit && !(dis[a.id] && now - dis[a.id] < 36e5)); }
  _banner(AL) {
    const C = this._banPick(AL); if (!C.length) return '';
    const a = C[0];
    return `<div class="ban ${a.cls}" role="alert"><button class="bmain" data-act="${a.act}" ${a.attrs || ''}><span class="bni">${ic(a.icon, 22)}</span><span class="bnt"><b>${esc(a.text)}</b>${a.sub ? `<small>${esc(a.sub)}</small>` : ''}</span>${C.length > 1 ? `<em>+${C.length - 1}</em>` : ''}</button><button class="bnx" data-act="bandis" data-id="${esc(a.id)}" aria-label="Ausblenden">${ic('close', 16)}</button></div>`;
  }
  _qIcon(e) {
    const d = dom(e);
    return e.startsWith('builtin:') ? 'moon' : d === 'scene' ? 'sparkle' : d === 'light' ? 'bulb' : d === 'switch' ? 'plug' : d === 'cover' ? 'window' : d === 'input_boolean' ? 'cog' : 'play';
  }

  /* ───────────── v10: Putzplan (Integration „putzplan“) ───────────── */
  _pzTasks() {
    const st = this._h.states, out = [];
    for (const e in st) {
      const s = st[e], a = s.attributes || {};
      if (!a.putzplan_task || !e.startsWith('sensor.')) continue;
      const n = x => (x == null || x === '' || isNaN(Number(x))) ? null : Number(x);
      let t = { e, name: a.task_name || a.friendly_name || e, room: a.room || 'Allgemein', st: s.state, iv: n(a.interval_days), since: n(a.days_since_done), until: n(a.days_until_due), over: n(a.days_overdue) || 0, today: !!a.done_today, mdi: String(a.icon || '').replace(/^mdi:/, ''), lu: s.last_updated };
      /* sofort anzeigen, bevor Home Assistant antwortet; verschwindet, sobald der echte Zustand da ist (oder nach 8 s) */
      const o = this._pzO && this._pzO[e];
      if (o) {
        if (o.lu !== s.last_updated || Date.now() - o.t > 8000) delete this._pzO[e];
        else if (o.k === 'done') t = Object.assign(t, { today: true, st: 'ok', over: 0, since: 0, until: t.iv });
        else if (o.k === 'undo' && o.prev) t = Object.assign(t, o.prev, { today: false });
      }
      out.push(t);
    }
    return out;
  }
  _pzRank(t) { return t.st === 'overdue' ? 0 : t.st === 'due_soon' ? 1 : t.st === 'unknown' ? 2 : t.st === 'ok' ? 3 : 4; }
  _pzSum() {
    const T = this._pzTasks(), over = T.filter(t => t.st === 'overdue'), soon = T.filter(t => t.st === 'due_soon');
    return { T, over, soon, never: T.filter(t => t.st === 'unknown').length };
  }
  _pzIv(iv) {
    if (!iv) return '';
    const M = { 1: 'täglich', 2: 'alle 2 Tage', 7: 'wöchentlich', 14: 'alle 2 Wochen', 21: 'alle 3 Wochen', 28: 'alle 4 Wochen', 30: 'monatlich', 31: 'monatlich', 60: 'alle 2 Monate', 90: 'vierteljährlich', 91: 'vierteljährlich', 92: 'vierteljährlich', 180: 'halbjährlich', 182: 'halbjährlich', 183: 'halbjährlich', 365: 'jährlich', 366: 'jährlich' };
    return M[iv] || (iv % 7 === 0 && iv <= 56 ? `alle ${iv / 7} Wochen` : `alle ${iv} Tage`);
  }
  _pzIcon(t) {
    const M = { 'mop': 'mop', 'window-closed-variant': 'window', 'window-frame': 'window', 'window-open-variant': 'window', 'robot-vacuum': 'robovac', 'vacuum': 'vacuum', 'washing-machine': 'washer', 'countertop': 'counter', 'sponge': 'sponge', 'bed-empty': 'bed', 'bed': 'bed', 'bed-double-outline': 'bed', 'bed-double': 'bed', 'dishwasher': 'dishwasher', 'air-filter': 'filter', 'shower': 'shower', 'shower-head': 'shower', 'fridge-outline': 'fridge', 'fridge': 'fridge', 'door': 'door', 'door-sliding': 'door', 'spray-bottle': 'spray', 'spray': 'spray', 'toilet': 'toilet', 'faucet': 'faucet', 'sink': 'faucet', 'coffee-maker': 'coffee', 'stove': 'stove', 'hand-wash-outline': 'handwash', 'hand-wash': 'handwash', 'range-hood': 'hood', 'rug': 'rug', 'trash-can-outline': 'trash', 'trash-can': 'trash', 'kettle': 'kettle', 'cupboard-outline': 'cupboard', 'cupboard': 'cupboard', 'snowflake': 'snow', 'mirror': 'mirror', 'pipe': 'drain', 'curtains': 'curtains', 'wall': 'wall', 'sofa': 'sofa', 'radiator': 'radiator', 'wardrobe-outline': 'wardrobe', 'light-switch': 'lswitch', 'shoe-print': 'shoe', 'teddy-bear': 'teddy', 'toy-brick-outline': 'brick', 'bag-personal-outline': 'backpack', 'table-furniture': 'table', 'microwave': 'microwave', 'toaster': 'toaster', 'water-check': 'waterfilter', 'broom': 'broom' };
    const n = t.name.toLowerCase();
    if (/ölen|schmieren/.test(n)) return 'wrench';
    if (/dichtung|gummi/.test(n)) return 'sponge';
    if (M[t.mdi] && ICONS[M[t.mdi]]) return M[t.mdi];
    const R = [
      [/fenster|glas|rahmen/, 'window'], [/schwamm/, 'sponge'], [/lappen|tücher|handtuch|bademat/, 'cloth'], [/toilette/, 'toilet'],
      [/dusch/, 'shower'], [/wanne|bad(?!ezimmer)/, 'bath'], [/abfluss|siphon/, 'drain'], [/spiegel/, 'mirror'], [/perlator|armatur|spüle|waschbecken|wasserhahn/, 'faucet'],
      [/gefrier|kühl|eis/, 'fridge'], [/herd|kochfeld|backofen|ofen/, 'stove'], [/dunst|fett/, 'hood'], [/mikrowelle/, 'microwave'], [/toaster/, 'toaster'],
      [/kaffee/, 'coffee'], [/wasserkocher/, 'kettle'], [/spülmaschine/, 'dishwasher'], [/waschmaschine|wäsche|hygienewasch/, 'washer'], [/wasserfilter|kartusche/, 'waterfilter'],
      [/filter|flusen/, 'filter'], [/staubsauger|saugen|absaugen/, 'vacuum'], [/wischen|boden|flur|eingang/, 'mop'], [/bett|matratze|kissen|decke/, 'bed'],
      [/teppich/, 'rug'], [/gardine|vorhang/, 'curtains'], [/heizkörper/, 'radiator'], [/kleiderschrank/, 'wardrobe'], [/schrank/, 'cupboard'],
      [/klinke|lichtschalter/, 'lswitch'], [/tür|balkontür/, 'door'], [/kuscheltier/, 'teddy'], [/spielzeug/, 'brick'], [/schulranzen|ranzen/, 'backpack'],
      [/möbel|tisch/, 'table'], [/polster|sofa/, 'sofa'], [/müll|eimer/, 'trash'], [/fugen|silikon|wand/, 'wall'], [/spray|desinfekt/, 'spray']
    ];
    for (const [re, k] of R) if (re.test(n) && ICONS[k]) return k;
    return 'broom';
  }
  _pzSub(t) {
    const iv = this._pzIv(t.iv), tail = iv ? ' · ' + iv : '', d = (n, one, many) => `${n} ${n === 1 ? one : many}`;
    if (t.today) return 'Heute erledigt' + tail;
    if (t.st === 'overdue') return `Überfällig seit ${d(t.over, 'Tag', 'Tagen')}` + tail;
    if (t.st === 'due_soon') return (t.until === 0 ? 'Heute fällig' : t.until === 1 ? 'Morgen fällig' : `In ${t.until} Tagen fällig`) + tail;
    if (t.st === 'ok') return (t.until != null ? `In ${d(t.until, 'Tag', 'Tagen')} fällig` : 'Erledigt') + tail;
    if (t.st === 'as_needed') return 'Bei Bedarf' + (t.since != null ? ` · zuletzt vor ${d(t.since, 'Tag', 'Tagen')}` : '');
    return iv ? iv.charAt(0).toUpperCase() + iv.slice(1) : 'Ohne Intervall';
  }
  _pzIso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  /* verteilt alle Aufgaben ohne Startdatum so auf die nächsten Wochen, dass pro Tag nur wenige dran sind */
  _pzPlan() {
    const U = this._pzTasks().filter(t => t.st === 'unknown' && t.iv).sort((a, b) => a.iv - b.iv || a.name.localeCompare(b.name, 'de'));
    const H = 120, load = new Array(H).fill(0), now = new Date(), res = [];
    for (const t of U) {
      const span = Math.min(t.iv, 42); let best = 0, bl = 1e9;
      for (let o = 0; o < span; o++) {
        let l = 0; for (let d = o; d < H; d += t.iv) l = Math.max(l, load[d]);
        l += o === 0 ? 0.4 : 0;
        if (l < bl) { bl = l; best = o; }
      }
      for (let d = best; d < H; d += t.iv) load[d]++;
      const last = new Date(now.getFullYear(), now.getMonth(), now.getDate() - t.iv + best);
      res.push({ e: t.e, o: best, last: this._pzIso(last) });
    }
    return res;
  }
  async _pzStart() {
    const P = this._pzPlan(), g = {};
    for (const p of P) (g[p.last] = g[p.last] || []).push(p.e);
    const st = this._pzSt(); if (st) { st.cf = false; st.f = 'today'; }
    try { await Promise.all(Object.keys(g).map(d => this._h.callService('putzplan', 'update_task', { entity_id: g[d], last_done: d }))); } catch (err) { this._toast('Start fehlgeschlagen'); return; }
    const t0 = P.filter(p => p.o === 0).length;
    this._toast(`Plan gestartet · heute ${t0} ${t0 === 1 ? 'Aufgabe' : 'Aufgaben'}`, 3500); this._pzRefresh();
  }
  _cleanRows() {
    const S = this._pzSum(); if (!S.T.length || WALL_UI || this._pzCard(0, 5)) return [];
    return [`<button class="xr kid" data-act="pz"><div class="ico">${ic('broom', 19)}</div><div><div class="t">Putzplan</div><div class="s">Alles sauber</div></div><span class="kdot ok"></span></button>`];
  }
  /* Karte „Heute putzen“ für die Startseite (n = max. Zeilen) */
  _pzCard(i, n) {
    const S = this._pzSum(); if (!S.T.length) return '';
    const sched = S.T.filter(t => t.st !== 'as_needed'), U = S.T.filter(t => t.st === 'unknown');
    if (U.length && U.length === sched.length) return `<button class="c pzc pzfresh tap" style="--i:${i}" data-act="pz"><div class="ico">${ic('broom', 20)}</div><div><div class="t">Putzplan · noch nicht gestartet</div><div class="s">${U.length} Aufgaben – jetzt auf die Wochen verteilen</div></div><span class="pzv">${ic('chevron', 16)}</span></button>`;
    const due = S.T.filter(t => !t.today && (t.st === 'overdue' || (t.st === 'due_soon' && t.until === 0))).sort((a, b) => b.over - a.over || a.room.localeCompare(b.room, 'de') || a.name.localeCompare(b.name, 'de'));
    const done = S.T.filter(t => t.today).length, tot = due.length + done;
    if (!tot) return '';
    if (!due.length) return `<button class="c pzc pzfresh tap" style="--i:${i}" data-act="pz"><div class="ico ok">${ic('check', 20)}</div><div><div class="t">Heute alles geputzt</div><div class="s">${done} ${done === 1 ? 'Aufgabe' : 'Aufgaben'} erledigt</div></div><span class="pzv">${ic('chevron', 16)}</span></button>`;
    const rows = due.slice(0, n).map(t => `<div class="pzr ${t.st === 'overdue' ? 'o' : 'd'}" data-sw="${esc(t.e)}"><div class="ico">${ic(this._pzIcon(t), 18)}</div><div><div class="t">${esc(t.name)}</div><div class="s">${esc(t.st === 'overdue' ? 'Überfällig seit ' + t.over + (t.over === 1 ? ' Tag' : ' Tagen') + ' · ' + t.room : t.room + (t.iv ? ' · ' + this._pzIv(t.iv) : ''))}</div></div><button class="pzb2" data-act="pzdone" data-e="${esc(t.e)}" aria-label="Erledigt">${ic('check', 18)}</button></div>`).join('');
    const more = due.length - rows.split('class="pzr ').length + 1;
    return `<div class="c pzc fix" style="--i:${i}"><div class="h">${ic('broom', 14)}Heute putzen<span class="r">${done} von ${tot} erledigt</span></div><div class="pzbar"><i style="width:${Math.round(100 * done / tot)}%"></i></div>${rows}<button class="pzmore" data-act="pz">${more > 0 ? '+ ' + more + ' weitere · ' : ''}Putzplan öffnen<span class="pzv">${ic('chevron', 14)}</span></button></div>`;
  }
  _cleanAlerts() { return []; }
  _pzSt() { return this._sheet && this._sheet.t === 'clean' ? this._sheet : this._v === 'clean' ? (this._pzp = this._pzp || {}) : null; }
  _pzRefresh() {
    const pq = this.shadowRoot.getElementById('pzq'), foc = pq && this.shadowRoot.activeElement === pq, pos = pq ? pq.selectionStart : 0;
    if (this._sheet && this._sheet.t === 'clean') this._renderSheet(); else { this._sig = ''; this._render(); }
    if (foc) { const p2 = this.shadowRoot.getElementById('pzq'); if (p2) { p2.focus(); try { p2.setSelectionRange(pos, pos); } catch (x) { } } }
  }
  _sClean() {
    const S = this._pzSum(), T = S.T;
    const head = `<div class="grab"></div><div class="sh"><div class="ico">${ic('broom', 24)}</div><div><h2>Putzplan</h2><p>${T.length} Aufgaben${S.over.length ? ' · ' + S.over.length + ' überfällig' : ''}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!T.length) return head + '<div class="empty">Keine Putzplan-Aufgaben gefunden. Ist die Integration „Putzplan“ geladen?</div>';
    return head + this._cleanBody(this._sheet);
  }
  _vClean() {
    const S = this._pzSum(), T = S.T;
    const h = `<div class="vh"><div><h1>Putzplan</h1><p>${T.length} Aufgaben${S.over.length ? ' · ' + S.over.length + ' überfällig' : ''}</p></div></div>`;
    if (!T.length) return h + '<div class="empty">Keine Putzplan-Aufgaben gefunden. Ist die Integration „Putzplan“ geladen?</div>';
    return h + `<div class="pzpage">${this._cleanBody(this._pzSt())}</div>`;
  }
  _cleanBody(st) {
    const S = this._pzSum(), T = S.T, f = st.f || 'today', q = (st.q || '').trim().toLowerCase();
    const sched = T.filter(t => t.st !== 'as_needed'), U = T.filter(t => t.st === 'unknown'), fresh = U.length > 0 && U.length === sched.length;
    const plan = U.length ? this._pzPlan() : [], p0 = plan.filter(p => p.o === 0).length, p7 = plan.filter(p => p.o < 7).length;
    const tone = fresh ? 'hot' : S.over.length ? 'hot' : S.soon.length ? 'warn' : 'live';
    const h1 = fresh ? 'Noch nicht gestartet' : S.over.length ? S.over.length + ' überfällig' : S.soon.length ? S.soon.length + ' bald fällig' : U.length ? 'Nichts fällig' : 'Alles sauber';
    const h2 = fresh ? `${U.length} Aufgaben ohne Startdatum` : `${S.soon.length && S.over.length ? S.soon.length + ' weitere bald fällig · ' : ''}${U.length ? U.length + ' ohne Startdatum · ' : ''}${T.length} Aufgaben`;
    const status = `<div class="vst ${tone}"><div class="vsi">${ic(fresh ? 'play' : S.over.length ? 'alert' : 'check', 26)}</div><div class="vsx"><div class="vkick">STATUS</div><div class="vh1">${h1}</div><div class="vh2">${h2}</div></div></div>`;
    let go = '';
    if (U.length) {
      go = st.cf
        ? `<div class="pzcf"><div class="pzct">Aufgaben verteilen?</div><div class="pzcs">${U.length} Aufgaben ohne Startdatum werden auf die nächsten Wochen verteilt: heute ${p0}, in den nächsten 7 Tagen ${p7}. Pro Aufgabe lässt sich das später mit „Rückgängig“ zurücknehmen.</div><div class="pzcb"><button class="vbt pzgo" data-act="pzgo">Jetzt starten</button><button class="vbt" data-act="pzcancel">Abbrechen</button></div></div>`
        : `<button class="vbt pzgo pzgo1" data-act="pzstart">${ic('play', 16)}<span>${fresh ? 'Plan starten' : U.length + ' Aufgaben ohne Startdatum verteilen'}</span></button>`;
    }
    const isToday = t => t.today || t.st === 'overdue' || (t.st === 'due_soon' && t.until === 0);
    const nToday = T.filter(t => !t.today && isToday(t)).length;
    const chips = `<div class="qfl" style="margin-top:12px">${[['today', 'Heute'], ['due', 'Fällig'], ['all', 'Alle']].map(x => `<button class="qfc ${x[0] === f && !q ? 'on' : ''}" data-act="pzf" data-e="${x[0]}"${x[0] === 'today' ? ' aria-label="Heute: überfällig, heute fällig und erledigt"' : ''}>${x[1]}${x[0] === 'today' && nToday ? `<b style="margin-left:6px;font-weight:700;font-variant-numeric:tabular-nums">${nToday}</b>` : ''}</button>`).join('')}<button class="qfc pzstb" data-act="pzstat" aria-label="Letzte 7 Tage">${ic('list', 13)} 7 Tage</button></div><input id="pzq" class="pzq" type="search" placeholder="Aufgabe oder Raum suchen …" value="${esc(st.q || '')}" autocomplete="off" enterkeyhint="search">`;
    const view = q ? 'all' : f;
    const list = q ? T.filter(t => (t.name + ' ' + t.room).toLowerCase().includes(q)) : view === 'due' ? T.filter(t => !t.today && (t.st === 'overdue' || t.st === 'due_soon')) : view === 'today' ? T.filter(isToday) : T;
    const rooms = {}; for (const t of list) (rooms[t.room] = rooms[t.room] || []).push(t);
    const key = r => Math.min(...rooms[r].map(t => this._pzRank(t)));
    const order = Object.keys(rooms).sort((a, b) => key(a) - key(b) || a.localeCompare(b, 'de'));
    this._pzCol = this._pzCol || {};
    const row = t => {
      const cls = t.today ? 'k' : t.st === 'overdue' ? 'o' : t.st === 'due_soon' ? 'd' : t.st === 'ok' ? 'k' : '';
      return `<div class="vr pz ${cls}"${t.today ? '' : ` data-sw="${esc(t.e)}"`}><div class="ico">${ic(this._pzIcon(t), 19)}</div><div><div class="t">${esc(t.name)}</div><div class="s">${esc(this._pzSub(t))}</div></div>${t.today ? `<button class="vbt pzu" data-act="pzundo" data-e="${esc(t.e)}" aria-label="Rückgängig">${ic('refresh', 15)}<span>Rückgängig</span></button>` : `<button class="vbt pzb" data-act="pzdone" data-e="${esc(t.e)}" aria-label="Erledigt">${ic('check', 18)}<span>Erledigt</span></button>`}</div>`;
    };
    const sortR = a => a.sort((x, y) => this._pzRank(x) - this._pzRank(y) || y.over - x.over || (x.until ?? 1e9) - (y.until ?? 1e9) || x.name.localeCompare(y.name, 'de'));
    const group = r => {
      const all = T.filter(t => t.room === r), cur = all.filter(t => t.today || t.st === 'ok' || t.st === 'as_needed').length, k = view + ':' + r;
      const worst = key(r), def = q ? false : view === 'all' ? worst > 1 : false, col = k in this._pzCol ? this._pzCol[k] : def;
      const kid = /^kinderzimmer/i.test(r), star = kid ? all.filter(t => t.since != null && t.since <= 6).length : 0;
      const info = view === 'all' || q ? `<span class="pzp"><i style="width:${Math.round(100 * cur / all.length)}%"></i></span><span class="pzc">${cur}/${all.length}</span>` : `<span class="pzc">${rooms[r].length}</span>`;
      return `<div class="pzg"><button class="pzh${col ? ' c' : ''}" data-act="pzroom" data-id="${esc(k)}" data-c="${col ? 1 : 0}"><span class="pzn">${esc(r.toUpperCase())}</span>${kid ? `<span class="pzs" title="in den letzten 7 Tagen erledigt">★ ${star} diese Woche</span>` : ''}${info}<span class="pzv">${ic('chevron', 14)}</span></button>${col ? '' : sortR(rooms[r]).map(row).join('')}</div>`;
    };
    const body = order.length ? order.map(group).join('') : q ? `<div class="empty">Keine Aufgabe zu „${esc(st.q)}“ gefunden.</div>` : view === 'today' ? `<div class="empty">Heute ist nichts dran. ✨</div>` : `<div class="empty">Nichts fällig. Unter „Alle" siehst du alle ${T.length} Aufgaben.</div>`;
    const doneS = view === 'today' && list.length ? `<div class="lab2">HEUTE · ${nToday} OFFEN · ${list.filter(t => t.today).length} ERLEDIGT</div>` : '';
    return status + go + chips + doneS + `<div class="pzl">${body}</div>` + `<div class="card-note">„Erledigt" setzt das Datum auf heute, nach rechts wischen geht auch. Intervalle und Aufgaben änderst du in der Putzplan-Integration.</div>`;
  }
  _pzOpt(e, k, prev) {
    this._pzO = this._pzO || {};
    this._pzO[e] = { k, t: Date.now(), lu: this._h.states[e]?.last_updated, prev };
    this._pzRefresh();
  }
  _pzCall(e, svc, ok) {
    let p; try { p = this._h.callService('putzplan', svc, { entity_id: e }); } catch (x) { p = Promise.reject(x); }
    Promise.resolve(p).catch(() => { if (this._pzO) delete this._pzO[e]; this._pzRefresh(); this._toast('Speichern fehlgeschlagen – bitte nochmal'); });
  }
  _pzDone(e) {
    const t0 = this._pzTasks().find(t => t.e === e), prev = t0 ? { st: t0.st, over: t0.over, since: t0.since, until: t0.until } : null;
    (this._pzPrev = this._pzPrev || {})[e] = prev;
    this._pzOpt(e, 'done', prev);
    this._pzCall(e, 'mark_done');
    this._toast((this._name(e).replace(/^Putzplan\s+/, '')) + ' erledigt ✓ · Rückgängig', 4500, { act: 'pzundo', e });
  }
  _pzUndo(e) {
    const prev = this._pzPrev && this._pzPrev[e];
    this._pzOpt(e, 'undo', prev);
    this._pzCall(e, 'undo_done');
    this._toast('Rückgängig gemacht');
  }

  /* ───────────── v11: Kindersicherung TV (Integration „kindersicherung“) ───────────── */
  _tvs() {
    const E = this._h?.entities || {}, D = this._h?.devices || {}, S = this._h?.states || {}, g = {};
    for (const id in E) {
      const r = E[id]; if (!r || r.platform !== 'kindersicherung' || !S[id]) continue;
      const k = r.device_id || id, o = g[k] || (g[k] = { dev: k, e: {} }), dom = id.split('.')[0], fn = String(S[id].attributes?.friendly_name || '');
      const dn = D[k] && (D[k].name_by_user || D[k].name) || ''; if (dn) o.name = dn;
      const nm = (dn && fn.startsWith(dn) ? fn.slice(dn.length) : fn).trim().toLowerCase();
      if (dom === 'binary_sensor') o.e.locked = id;
      else if (dom === 'sensor') { if (/gesperrt bis/.test(nm)) o.e.until = id; else if (/fehlversuche/.test(nm)) o.e.attempts = id; else if (/falsche/.test(nm)) o.e.wrong = id; else if (/best[aä]tigungen/.test(nm)) o.e.confs = id; else if (/zeit/.test(nm)) o.e.timeouts = id; else if (/sperren$/.test(nm)) o.e.locks = id; }
      else if (dom === 'switch') { if (/kindersicherung aktiv|aktiv$/.test(nm)) o.e.enabled = id; else if (/best[aä]tigung/.test(nm)) o.e.confirm = id; }
      else if (dom === 'button') { if (/entsperren/.test(nm)) o.e.unlock = id; else if (/sperren/.test(nm)) o.e.lock = id; }
    }
    return Object.values(g).filter(o => o.e.locked || o.e.enabled).map(o => {
      const e = o.e, st = id => id && S[id], v = id => st(id)?.state, n = id => { const x = parseFloat(v(id)); return isNaN(x) ? null : x; };
      const la = st(e.locked)?.attributes || {}, name = o.name || String(la.friendly_name || 'Fernseher').replace(/\s+Gesperrt$/i, '');
      const locked = v(e.locked) === 'on', enabled = e.enabled ? v(e.enabled) === 'on' : true, waiting = !!st(e.confirm)?.attributes?.waiting;
      let until = okv(v(e.until)) ? new Date(v(e.until)) : (la.lock_until ? new Date(la.lock_until) : null); if (until && isNaN(until)) until = null;
      const att = la.attempts != null ? Number(la.attempts) : n(e.attempts), max = la.max_attempts != null ? Number(la.max_attempts) : null;
      const tone = !enabled ? 'warn' : locked ? 'hot' : waiting ? 'warn' : 'live';
      const h1 = !enabled ? 'Kindersicherung aus' : locked ? 'Gesperrt' : waiting ? 'Wartet auf Bestätigung' : 'Freigegeben';
      const parts = []; if (locked && until) parts.push('bis ' + hhmm(until) + ' Uhr'); if (att != null) parts.push(`Fehlversuche ${att}${max ? ' von ' + max : ''}`);
      const h2 = !enabled ? 'Der Fernseher ist nicht geschützt' : parts.join(' · ') || (locked ? 'Sperre aktiv' : 'Keine Sperre aktiv');
      return { id: o.dev, name, e, locked, enabled, waiting, until, att, max, tone, h1, h2, short: name.replace(/\s*TV$/i, ''), n: { confs: n(e.confs), wrong: n(e.wrong), locks: n(e.locks), timeouts: n(e.timeouts) } };
    }).sort((a, b) => a.name.localeCompare(b.name, 'de'));
  }
  _tvRows() {
    const T = this._tvs(); if (!T.length) return [];
    const bad = T.some(t => t.locked), warn = T.some(t => !t.enabled || t.waiting);
    const s = T.map(t => `${esc(t.short)} ${t.locked ? 'gesperrt' : !t.enabled ? 'Schutz aus' : t.waiting ? 'wartet' : 'frei'}`).join(' · ');
    return [`<button class="xr kid" data-act="tv"><div class="ico">${ic('shield', 19)}</div><div><div class="t">Kindersicherung TV</div><div class="s">${s}</div></div><span class="kdot ${bad ? 'lk' : warn ? 'off' : 'ok'}"></span></button>`];
  }
  _sTv() {
    const T = this._tvs(), busy = !!this._tvBusy, ok = Date.now() < (this._kidUntil || 0) && this._kidPin;
    const head = (p) => `<div class="grab"></div><div class="sh"><div class="ico">${ic('shield', 24)}</div><div><h2>Kindersicherung TV</h2><p>${p}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!T.length) return head('Nicht verfügbar') + `<div class="empty">Keine Fernseher gefunden. Ist die Integration „Kindersicherung“ eingerichtet?</div>`;
    const b = (a, e, cls, ico, txt, sub) => `<button class="kb ${cls || ''}" data-act="tvact" data-a="${a}" data-e="${e}" ${busy ? 'disabled' : ''}>${ic(ico, 22)}<b>${txt}</b>${sub ? `<small>${sub}</small>` : ''}</button>`;
    const body = T.map(t => {
      const tiles = [['confs', 'Bestätigungen', 'check'], ['wrong', 'Falsche Codes', 'close'], ['locks', 'Sperrungen', 'lock'], ['timeouts', 'Zeitüberschr.', 'clock']].filter(x => t.n[x[0]] != null).map(x => this._tile(Math.round(t.n[x[0]]), x[1], x[2])).join('');
      const btn = [];
      if (t.e.unlock && (t.locked || (t.att || 0) > 0)) btn.push(b('entsperren', t.e.unlock, 'good', 'unlock', 'Entsperren', 'Sperre aufheben · PIN'));
      if (t.e.lock && !t.locked) btn.push(b('sperren', t.e.lock, 'danger', 'lock', 'Jetzt sperren', 'sofort sperren'));
      if (t.waiting && t.e.confirm) btn.push(b('bestaetigen', t.e.confirm, 'good', 'check', 'Bestätigen', 'Fernsehen freigeben · PIN'));
      if (t.e.enabled) btn.push(t.enabled ? b('schutz_aus', t.e.enabled, '', 'shield', 'Schutz ausschalten', 'nur mit PIN') : b('schutz_an', t.e.enabled, 'good', 'shield', 'Schutz einschalten', 'Kindersicherung aktivieren'));
      return `<div class="lab2">${ic('tv' in ICONS ? 'tv' : 'shield', 13)} ${esc(t.name).toUpperCase()}</div>
        <div class="vst ${t.tone}"><div class="vsi">${ic(t.locked ? 'lock' : t.enabled ? 'unlock' : 'shield', 26)}</div><div class="vsx"><div class="vkick">STATUS</div><div class="vh1">${esc(t.h1)}</div><div class="vh2">${esc(t.h2)}</div></div></div>
        ${tiles ? `<div class="dg kdg tvdg">${tiles}</div>` : ''}
        <div class="kgrid k2">${btn.join('')}</div>`;
    }).join('');
    const sum = T.map(t => `${esc(t.short)}: ${t.locked ? 'gesperrt' : !t.enabled ? 'Schutz aus' : t.waiting ? 'wartet' : 'frei'}`).join(' · ');
    return head(sum) + `<div class="lab2" style="margin-top:2px">${ic(ok ? 'unlock' : 'lock', 13)} ${ok ? 'PIN akzeptiert' : 'Entsperren, Bestätigen und Ausschalten nur mit PIN'}</div>` + body + `<div class="card-note">Die Integration „Kindersicherung“ sperrt den Fernseher nach zu vielen falschen Codes automatisch. Entsperren, Bestätigen und das Ausschalten des Schutzes brauchen die PIN (Home Assistant prüft sie zusätzlich). Sperren und Einschalten gehen ohne PIN. Die PIN gilt danach 90 Sekunden.</div>`;
  }
  _tvAct(a, e) {
    if (!e || this._tvBusy) return;
    if (a === 'sperren') { this._h.callService('button', 'press', { entity_id: e }); this._toast('Fernseher gesperrt 🔒'); return; }
    if (a === 'schutz_an') { this._h.callService('switch', 'turn_on', { entity_id: e }); this._toast('Kindersicherung eingeschaltet 🛡️'); return; }
    if (Date.now() < (this._kidUntil || 0) && this._kidPin) return this._tvRun(a, e);
    this._kidPend = { tv: true, a: 'tv_' + a, op: a, e }; this._pin = ''; this._pinBad = 0; this._sheet = { t: 'pin', kid: true, tv: true }; this._renderSheet();
  }
  _tvRun(a, e) {
    const MSG = { entsperren: 'Fernseher entsperrt 🔓', schutz_aus: 'Kindersicherung ausgeschaltet', bestaetigen: 'Bestätigt ✓' };
    this._tvBusy = a; if (this._sheet?.t === 'tv') this._renderSheet();
    let p; try { p = this._h.callService('script', 'kindersicherung_aktion', { aktion: a, entity_id: e, pin: this._kidPin }); } catch (x) { p = Promise.reject(x); }
    Promise.resolve(p).then(() => this._toast(MSG[a] || 'Erledigt')).catch(x => {
      const m = String((x && (x.message || x.error)) || x || '');
      if (/pin/i.test(m)) { this._kidUntil = 0; this._kidPin = ''; this._toast('Falsche PIN ✕'); } else this._toast('Aktion fehlgeschlagen' + (m ? ': ' + m : ''), 4200);
    }).finally(() => { this._tvBusy = null; if (this._sheet?.t === 'tv') this._renderSheet(); });
  }

  /* ───────────── v12: Putzplan-Statistik · letzte 7 Tage (aus dem Verlauf von Home Assistant) ───────────── */
  _pzDayKey(ms) { const d = new Date(ms); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  async _pzLoadStat(force) {
    const c = this._pzS;
    if (!force && c && c.ok && Date.now() - c.t < 6e4) return;
    if (this._pzSBusy) return; this._pzSBusy = true;
    const T = this._pzTasks(), info = {}; T.forEach(t => { info[t.e] = t; });
    const d0 = new Date(); d0.setHours(0, 0, 0, 0); d0.setDate(d0.getDate() - 6);
    const from = d0.getTime(), st = from - 2 * 864e5;
    try {
      const res = await this._h.callWS({ type: 'history/history_during_period', start_time: new Date(st).toISOString(), end_time: new Date().toISOString(), entity_ids: T.map(t => t.e), include_start_time_state: true, significant_changes_only: false, minimal_response: false, no_attributes: false });
      const evs = [];
      for (const e in res) {
        let prevLd, at = {}, mine = [];
        for (const x of res[e] || []) {
          if (x.a) at = x.a; else if (x.attributes) at = x.attributes;
          const ts = x.lu != null ? x.lu * 1000 : (x.last_updated ? new Date(x.last_updated).getTime() : st), ld = at.last_done || null;
          if (prevLd !== undefined && ld && ld !== prevLd) {
            if (ld === this._pzDayKey(ts)) mine.push({ e, ts, ld });
            else if (prevLd && ld < prevLd) { const i = mine.map(m => m.ld).lastIndexOf(prevLd); if (i >= 0) mine.splice(i, 1); }
          }
          prevLd = ld;
        }
        const t = info[e];
        for (const m of mine) if (m.ts >= from) evs.push({ e, ts: m.ts, name: t ? t.name : (at.task_name || e), room: t ? t.room : (at.room || 'Allgemein'), t });
      }
      evs.sort((a, b) => b.ts - a.ts);
      this._pzS = { ok: true, t: Date.now(), evs, from };
    } catch (err) { this._pzS = { ok: false, t: Date.now(), evs: [], from }; }
    this._pzSBusy = false;
    if (this._sheet && this._sheet.t === 'pzstat') this._renderSheet();
  }
  _sPzStat() {
    const S = this._pzS, back = !WALL_UI ? `<button class="vbt" data-act="pzback" style="margin-top:14px;width:100%">${ic('chevron', 15)}<span>Zurück zum Putzplan</span></button>` : '';
    const head = p => `<div class="grab"></div><div class="sh"><div class="ico">${ic('broom', 24)}</div><div><h2>Putzplan · letzte 7 Tage</h2><p>${p}</p></div><button class="x" data-act="close">${ic('close', 20)}</button></div>`;
    if (!S) return head('Lade Verlauf …') + `<div class="empty">Verlauf wird geladen …</div>`;
    if (!S.ok) return head('Nicht verfügbar') + `<div class="empty">Der Verlauf konnte nicht geladen werden.</div><button class="vbt" data-act="pzstatr" style="width:100%">${ic('refresh', 15)}<span>Nochmal versuchen</span></button>` + back;
    const days = [], today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) { const d = new Date(today); d.setDate(d.getDate() - i); days.push({ d, k: this._pzDayKey(d.getTime()), ev: [] }); }
    const by = {}; days.forEach(x => { by[x.k] = x; });
    for (const ev of S.evs) { const x = by[this._pzDayKey(ev.ts)]; if (x) x.ev.push(ev); }
    const tot = S.evs.length, mx = Math.max(1, ...days.map(x => x.ev.length)), wd = d => d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
    const bars = days.slice().reverse().map((x, i) => `<div class="c1${x.k === days[0].k ? ' t' : ''}"><b>${x.ev.length || ''}</b><i style="height:${x.ev.length ? Math.max(6, Math.round(88 * x.ev.length / mx)) : 3}px"></i><span>${x.k === days[0].k ? 'Heute' : wd(x.d)}</span></div>`).join('');
    const rooms = {}; S.evs.forEach(ev => { rooms[ev.room] = (rooms[ev.room] || 0) + 1; });
    const rl = Object.keys(rooms).sort((a, b) => rooms[b] - rooms[a] || a.localeCompare(b, 'de'));
    const chips = rl.length ? `<div class="lab2" style="margin-top:14px">NACH RAUM</div><div class="qfl">${rl.map(r => `<span class="qfc pzsc">${esc(r)} <b>${rooms[r]}</b></span>`).join('')}</div>` : '';
    const lbl = (x, i) => (i === 0 ? 'HEUTE' : i === 1 ? 'GESTERN' : x.d.toLocaleDateString('de-DE', { weekday: 'long' }).toUpperCase()) + ' · ' + x.d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }).toUpperCase() + ' · ' + x.ev.length + ' erledigt';
    const list = days.map((x, i) => `<div class="lab2" style="margin-top:14px">${lbl(x, i)}</div>` + (x.ev.length ? x.ev.map(ev => `<div class="pzsr"><span class="pzt">${hhmm(ev.ts)}</span><div class="ico">${ic(ev.t ? this._pzIcon(ev.t) : 'broom', 17)}</div><div><div class="t">${esc(ev.name)}</div><div class="s">${esc(ev.room)}</div></div></div>`).join('') : `<div class="pzsn">nichts erledigt</div>`)).join('');
    const avg = (tot / 7).toFixed(1).replace('.', ',');
    return head(tot ? `${tot} ${tot === 1 ? 'Aufgabe' : 'Aufgaben'} erledigt · Ø ${avg} pro Tag` : 'Noch nichts erledigt') + `<div class="pzsb">${bars}</div>` + chips + list + `<div class="card-note">Die Zeiten kommen aus dem Verlauf von Home Assistant. Erledigungen vor dem Start des Putzplans sind nicht enthalten.</div>` + back;
  }

  /* ───────────── v13: Kompakt-Vorhersage (stündlich) im Stil der Kachelmann-Kompaktvorhersage ───────────── */
  _wxEnt() { const e = this._c.weatherCompact; return e && this._s(e) ? e : this._c.weather; }
  async _loadFcX(force) {
    const w = this._wxEnt();
    if (this._wxb || (!force && this._wxF && this._wxF.e === w && Date.now() - this._wxF.t < 9e5)) return;
    this._wxb = true;
    let hourly = [];
    try { const r = await this._h.callWS({ type: 'call_service', domain: 'weather', service: 'get_forecasts', service_data: { type: 'hourly' }, target: { entity_id: w }, return_response: true }); hourly = r?.response?.[w]?.forecast || []; } catch (e) { hourly = []; }
    this._wxF = { t: Date.now(), e: w, hourly };
    this._wxb = false;
    if (this._v === 'weather') this._renderSoon();
  }
  _wxBear(b) {
    if (b == null || b === '') return null;
    const n = parseFloat(b); if (!isNaN(n)) return n;
    const M = { N: 0, NNO: 22.5, NO: 45, ONO: 67.5, O: 90, OSO: 112.5, SO: 135, SSO: 157.5, S: 180, SSW: 202.5, SW: 225, WSW: 247.5, W: 270, WNW: 292.5, NW: 315, NNW: 337.5, NNE: 22.5, NE: 45, ENE: 67.5, E: 90, ESE: 112.5, SE: 135, SSE: 157.5 };
    return M[String(b).trim().toUpperCase()] ?? null;
  }
  /* Sonnenauf-/untergang (Näherung nach „Sunrise equation“), day = lokales Datum 00:00 */
  _wxSun(day) {
    const cf = this._h.config || {}, lat = cf.latitude ?? 51.7, lon = cf.longitude ?? 8.4, R = Math.PI / 180;
    const J = Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), 12) / 864e5 + 2440587.5;
    const n = Math.round(J - 2451545.0 + 0.0008), Js = n - lon / 360;
    const M = (357.5291 + 0.98560028 * Js) % 360, Mr = M * R;
    const C = 1.9148 * Math.sin(Mr) + 0.02 * Math.sin(2 * Mr) + 0.0003 * Math.sin(3 * Mr);
    const lam = (M + C + 180 + 102.9372) % 360, lr = lam * R;
    const Jt = 2451545.0 + Js + 0.0053 * Math.sin(Mr) - 0.0069 * Math.sin(2 * lr);
    const dec = Math.asin(Math.sin(lr) * Math.sin(23.44 * R));
    const cw = (Math.sin(-0.833 * R) - Math.sin(lat * R) * Math.sin(dec)) / (Math.cos(lat * R) * Math.cos(dec));
    const w0 = Math.acos(Math.max(-1, Math.min(1, cw))) / R;
    return { rise: (Jt - w0 / 360 - 2440587.5) * 864e5, set: (Jt + w0 / 360 - 2440587.5) * 864e5 };
  }
  _wxGeo() {
    const F = this._wxF; if (!F || F.hourly.length < 6) return null;
    const now = Date.now(), all = F.hourly.filter(d => new Date(d.datetime).getTime() >= now - 36e5 && d.temperature != null);
    const bw = (this._main && this._main.getBoundingClientRect().width) || 0;
    const W = Math.max(290, Math.min(1180, Math.floor((bw || 390) - 62)));
    const span = this._wxSpan || (W < 600 ? 48 : 72);
    const hr = all.slice(0, span).map(d => ({ ...d, ts: new Date(d.datetime).getTime() }));
    if (hr.length < 6) return null;
    return { W, span, hr, N: hr.length };
  }
  _wxChart(G) {
    const { W, hr, N } = G, wide = W > 640, HT = wide ? 220 : 180, L = 32, Rr = 30, pw = W - L - Rr, px = pw / N, T0 = hr[0].ts, T1 = hr[N - 1].ts;
    const X = t => L + (t - T0) / 36e5 * px + px / 2, pt = 8, ph = HT - pt - 3;
    const wu = this._attr(this._wxEnt(), 'wind_speed_unit') || 'km/h', kw = /m\/s/.test(wu) ? 3.6 : /mph/.test(wu) ? 1.609 : 1;
    const T = hr.map(d => d.temperature), D = hr.map(d => d.dew_point != null ? d.dew_point : d.temperature), P = hr.map(d => d.precipitation || 0);
    const lo = Math.min(...T, ...D), hi = Math.max(...T, ...D), steps = [2, 4, 5, 8, 10, 20];
    const step = steps.find(s => Math.ceil(hi / s) - Math.floor(lo / s) <= 5) || 20;
    let y0 = Math.floor(lo / step) * step, y1 = Math.ceil(hi / step) * step; if (y1 - y0 < step * 2) y1 = y0 + step * 2;
    const nl = Math.round((y1 - y0) / step) + 1, Y = v => pt + (1 - (v - y0) / (y1 - y0)) * ph;
    const pm = Math.max(...P), q = [0.25, 0.5, 1, 2, 5, 10, 20].find(v => v * (nl - 1) >= Math.max(pm, 0.01)) || 20, rm = q * (nl - 1);
    const fmt = v => (Math.round(v * 100) / 100).toString().replace('.', ',');
    let g = '';
    /* Nacht */
    const d0 = new Date(T0); d0.setHours(0, 0, 0, 0); const sun = [];
    for (let k = -1; k <= Math.ceil(N / 24) + 1; k++) sun.push(this._wxSun(new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + k)));
    for (let k = 0; k < sun.length - 1; k++) { const a = Math.max(sun[k].set, T0 - 18e5), b = Math.min(sun[k + 1].rise, T1 + 18e5); if (b > a) { const xa = Math.max(L, X(a)), xb = Math.min(L + pw, X(b)); if (xb > xa) g += `<rect class="wxn" x="${xa.toFixed(1)}" y="0" width="${(xb - xa).toFixed(1)}" height="${HT}"/>`; } }
    /* Gitter + Achsen */
    for (let k = 0; k < nl; k++) {
      const v = y0 + k * step, yy = Y(v).toFixed(1);
      g += `<line class="gl" x1="${L}" x2="${L + pw}" y1="${yy}" y2="${yy}"/><text x="${L - 6}" y="${yy}" text-anchor="end" dy=".35em">${v}°</text><text x="${L + pw + 6}" y="${yy}" dy=".35em" class="mm">${fmt(k * q)}</text>`;
    }
    /* Tageswechsel + Tageslabels */
    const days = []; const mids = [];
    for (let k = 0; k <= Math.ceil(N / 24) + 1; k++) { const m = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + k).getTime(); mids.push(m); if (m > T0 && m < T1) g += `<line class="dl" x1="${X(m).toFixed(1)}" x2="${X(m).toFixed(1)}" y1="0" y2="${HT}"/>`; }
    const todayK = new Date(); todayK.setHours(0, 0, 0, 0);
    for (let k = 0; k < mids.length - 1; k++) {
      const a = Math.max(mids[k], T0), b = Math.min(mids[k + 1], T1 + 36e5); if (b <= a) continue;
      const xa = Math.max(L, X(a) - (a === T0 ? px / 2 : 0)), xb = Math.min(L + pw, X(b) - px / 2); if (xb - xa < 22) continue;
      const dd = new Date(mids[k]);
      days.push(`<div class="wxd" style="left:${xa.toFixed(1)}px;width:${(xb - xa).toFixed(1)}px${a === T0 && xb - xa < 110 ? ';justify-content:flex-start;padding-left:6px;box-sizing:border-box' : ''}">${mids[k] === todayK.getTime() ? 'Heute' : dd.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '')}${xb - xa > 80 ? `<small>${dd.getDate()}.${dd.getMonth() + 1}.</small>` : ''}</div>`);
    }
    /* Regen */
    const bwid = Math.max(1.6, px * 0.78);
    P.forEach((v, i) => { if (v > 0.001) { const h = Math.max(1.5, Math.min(1, v / rm) * ph); g += `<rect class="wxr" x="${(X(hr[i].ts) - bwid / 2).toFixed(1)}" y="${(pt + ph - h).toFixed(1)}" width="${bwid.toFixed(1)}" height="${h.toFixed(1)}" rx="1.4"/>`; } });
    /* Kurven */
    const pts = hr.map((d, i) => [X(d.ts), Y(T[i])]), dpts = hr.map((d, i) => [X(d.ts), Y(D[i])]);
    g += `<defs><linearGradient id="wxg" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${Y(y1).toFixed(1)}" y2="${Y(y0).toFixed(1)}"><stop offset="0" stop-color="#fb923c"/><stop offset=".5" stop-color="#fbbf24"/><stop offset="1" stop-color="#60a5fa"/></linearGradient></defs>`;
    g += `<path class="wxp" d="${smooth(dpts)}"/><path class="tp" stroke="url(#wxg)" d="${smooth(pts)}"/>`;
    g += `<line class="wxcl" x1="0" x2="0" y1="0" y2="${HT}" style="display:none"/><circle class="wxcd" r="5" cx="0" cy="0" style="display:none"/>`;
    /* Symbole + Wind */
    const pick = min => [1, 2, 3, 6, 12, 24].find(s => s * px >= min) || 24;
    const top = 54, wt = top + HT + 6, tot = wt + 38;
    const si = pick(wide ? 34 : 28), sw = pick(wide ? 30 : 26), isz = wide ? 28 : 24;
    const onGrid = (d, s) => s === 24 ? new Date(d.ts).getHours() === 12 : new Date(d.ts).getHours() % s === 0;
    let ic1 = '', wnd = '';
    hr.forEach(d => {
      if (onGrid(d, si)) ic1 += `<div class="wxi" style="left:${X(d.ts).toFixed(1)}px">${wx(d.condition, isz)}</div>`;
      if (onGrid(d, sw)) {
        const b = this._wxBear(d.wind_bearing), v = d.wind_speed != null ? d.wind_speed * kw : null; if (b == null || v == null) return;
        const col = v >= 50 ? '#fb7185' : v >= 30 ? '#fbbf24' : 'currentColor';
        wnd += `<div class="wxw" style="top:${wt}px;left:${X(d.ts).toFixed(1)}px;color:${col}"><svg width="16" height="16" viewBox="0 0 16 16" style="transform:rotate(${Math.round(b + 180)}deg)"><path d="M8 1.5 12.6 9H9.3v5.5H6.7V9H3.4z" fill="currentColor"/></svg>${Math.round(v)}</div>`;
      }
    });
    this._wxG = { G, L, px, N, hr, T0, X, Y, HT, top, W, pw, kw, wu, T, D, P };
    return `<div class="wxc" data-w="${W}" style="width:${W}px;height:${tot}px">${days.join('')}${ic1}<svg class="wxs" width="${W}" height="${HT}" viewBox="0 0 ${W} ${HT}" style="top:${top}px">${g}</svg>${wnd}<div class="wxt" style="display:none"></div></div>`;
  }
  _wxTip(i) {
    const Q = this._wxG, d = Q.hr[i], x = Q.X(d.ts), v = Q.kw, f = (a, u, n = 0) => a == null ? '–' : de(a * (u || 1), n);
    const dt = new Date(d.ts);
    return { x, y: Q.Y(Q.T[i]), html: `<div class="wxth"><b>${dt.toLocaleDateString('de-DE', Q.W < 600 ? { weekday: 'short', day: 'numeric', month: 'numeric' } : { weekday: 'long', day: 'numeric', month: 'long' })}, ${hhmm(d.ts)} Uhr</b></div><div class="wxtl">
      <div class="wxtr"><i class="wxdt t"></i>Temperatur<b>${de(d.temperature, 1)} °C</b></div>
      ${d.dew_point != null ? `<div class="wxtr"><i class="wxdt"></i>Taupunkt<b>${de(d.dew_point, 1)} °C</b></div>` : ''}
      ${d.wind_gust_speed != null ? `<div class="wxtr"><i class="wxdt"></i>Windböen<b>${Math.round(d.wind_gust_speed * v)} ${esc(Q.wu === 'm/s' ? 'km/h' : Q.wu)}</b></div>` : ''}
      ${d.wind_speed != null ? `<div class="wxtr"><i class="wxdt"></i>Mittelwind<b>${Math.round(d.wind_speed * v)} ${esc(Q.wu === 'm/s' ? 'km/h' : Q.wu)}</b></div>` : ''}
      <div class="wxtr"><i class="wxdt r"></i>Niederschlag<b>${de(d.precipitation || 0, 1)} mm</b></div></div><div class="wxti">${wx(d.condition, 38)}<span>${COND[d.condition] || ''}</span></div>` };
  }
  _wxCur(c, i) {
    const Q = this._wxG; if (!Q || !c) return;
    const t = this._wxTip(i), s = c.querySelector('svg.wxs'), ln = s.querySelector('.wxcl'), dot = s.querySelector('.wxcd'), tip = c.querySelector('.wxt');
    ln.setAttribute('x1', t.x); ln.setAttribute('x2', t.x); ln.style.display = ''; dot.setAttribute('cx', t.x); dot.setAttribute('cy', t.y); dot.style.display = '';
    tip.innerHTML = t.html; tip.style.display = '';
    const nar = Q.W < 600, tw = nar ? 168 : 252, left = t.x > Q.W * 0.52 ? Math.max(0, t.x - 12 - tw) : Math.min(Q.W - tw, t.x + 12);
    tip.classList.toggle('nar', nar);
    tip.style.left = left + 'px'; tip.style.top = (Q.top + (nar ? 2 : 6)) + 'px'; tip.style.width = tw + 'px';
  }
  _wxPtr(ev, ty) {
    if (ty === 'u') { this._wxDrag = false; return; }
    const c = ev.target && ev.target.closest ? ev.target.closest('.wxc') : null, Q = this._wxG;
    if (!c || !Q) return;
    if (ty === 'd') { this._wxDrag = true; this._busy = true; } else if (!this._wxDrag && ev.pointerType !== 'mouse') return;
    const x = ev.clientX - c.getBoundingClientRect().left, i = Math.max(0, Math.min(Q.N - 1, Math.round((x - Q.L - Q.px / 2) / Q.px)));
    this._wxSelT = Q.hr[i].ts; this._wxCur(c, i);
  }
  _wxCard() {
    const G = this._wxGeo(); if (!G) return this._wxF && !this._wxF.hourly.length && this._wxF.t ? '' : null;
    const src = this._attr(this._wxEnt(), 'friendly_name') || '', n = G.hr.length;
    const chips = [[48, '48 h'], [72, '3 Tage'], [120, '5 Tage'], [216, '9 Tage']].map(x => `<button class="qfc ${x[0] === G.span ? 'on' : ''}" data-act="wxspan" data-n="${x[0]}">${x[1]}</button>`).join('');
    const ch = this._wxChart(G);
    return `<div class="h">${ic('cloudsun', 14)}Vorhersage kompakt<span class="r">${esc(src)}</span></div><div class="qfl wxsp">${chips}</div><div class="wxwrap">${ch}</div><div class="card-note" style="margin-top:6px">Tippen oder wischen für Details · Temperatur (Linie), Taupunkt (gestrichelt), Regen (Balken, mm), Wind (Pfeile in km/h) · Nacht dunkel hinterlegt</div>`;
  }
  _wxRestore() {
    const Q = this._wxG, c = this.shadowRoot && this.shadowRoot.querySelector('.wxc'); if (!Q || !c || !this._wxSelT) return;
    const i = Q.hr.findIndex(d => d.ts === this._wxSelT); if (i >= 0) this._wxCur(c, i);
  }
  /* ───────────── v14: 14-Tage-Trend (Kachelmann) – gleiche Bauweise wie die Kompakt-Vorhersage ───────────── */
  _trDays() {
    const e = this._c.trend, a = e && this._s(e) ? this._s(e).attributes : null, d = a && Array.isArray(a.days) ? a.days : null;
    if (!d || d.length < 3) return null;
    const CW = { clear: 'sunny', scattered: 'partlycloudy', broken: 'cloudy', overcast: 'cloudy' };
    return d.slice(0, 14).map(x => {
      const dt = new Date(x.date + 'T12:00:00');
      let cond = x.condition;
      if (!cond) cond = (x.precipitation_type && (x.precipitation || 0) >= 1) ? 'rainy' : (CW[x.cloud_word] || 'cloudy');
      return { ...x, dt, cond, hi: x.temp_max, lo: x.temp_min, hh: x.temp_max_high ?? x.temp_max, hl: x.temp_max_low ?? x.temp_max, lh: x.temp_min_high ?? x.temp_min, ll: x.temp_min_low ?? x.temp_min };
    });
  }
  _trGeo() {
    const D0 = this._trDays(); if (!D0) return null;
    const bw = (this._main && this._main.getBoundingClientRect().width) || 0, W = Math.max(290, Math.min(1180, Math.floor((bw || 390) - 62)));
    const span = this._trSpan || (W < 600 ? 10 : 14), D = D0.slice(0, span);
    return { W, span, D, n: D.length };
  }
  _trChart(G) {
    const { W, D, n } = G, wide = W > 640, HT = wide ? 220 : 170, L = 32, Rr = 30, pw = W - L - Rr, colW = pw / n, X = i => L + colW * (i + 0.5), pt = 8, ph = HT - pt - 3, top = 54;
    const vals = D.flatMap(d => [d.hh, d.hl, d.lh, d.ll, d.hi, d.lo]).filter(v => v != null), lo = Math.min(...vals), hi = Math.max(...vals), steps = [2, 4, 5, 8, 10, 20];
    const step = steps.find(s => Math.ceil(hi / s) - Math.floor(lo / s) <= 5) || 20;
    let y0 = Math.floor(lo / step) * step, y1 = Math.ceil(hi / step) * step; if (y1 - y0 < step * 2) y1 = y0 + step * 2;
    const nl = Math.round((y1 - y0) / step) + 1, Y = v => pt + (1 - (v - y0) / (y1 - y0)) * ph;
    const pm = Math.max(...D.map(d => d.precipitation || 0)), q = [0.25, 0.5, 1, 2, 5, 10, 20, 50].find(v => v * (nl - 1) >= Math.max(pm, 0.01)) || 50, rm = q * (nl - 1);
    const fmt = v => (Math.round(v * 100) / 100).toString().replace('.', ',');
    let g = '';
    /* Wochenende dunkel hinterlegt (wie die Nacht in der Kompakt-Vorhersage) */
    D.forEach((d, i) => { if (d.is_weekend) g += `<rect class="wxn" x="${(L + colW * i).toFixed(1)}" y="0" width="${colW.toFixed(1)}" height="${HT}"/>`; });
    /* Gitter + Achsen */
    for (let k = 0; k < nl; k++) {
      const v = y0 + k * step, yy = Y(v).toFixed(1);
      g += `<line class="gl" x1="${L}" x2="${L + pw}" y1="${yy}" y2="${yy}"/><text x="${L - 6}" y="${yy}" text-anchor="end" dy=".35em">${v}°</text><text x="${L + pw + 6}" y="${yy}" dy=".35em" class="mm">${fmt(k * q)}</text>`;
    }
    /* Wochenwechsel */
    D.forEach((d, i) => { if (i > 0 && d.dt.getDay() === 1) g += `<line class="dl" x1="${(L + colW * i).toFixed(1)}" x2="${(L + colW * i).toFixed(1)}" y1="0" y2="${HT}"/>`; });
    /* Regen */
    const bwid = Math.max(4, Math.min(colW * 0.4, 34));
    D.forEach((d, i) => { const p = d.precipitation || 0; if (p > 0.04) { const h = Math.max(1.5, Math.min(1, p / rm) * ph), pr = (d.precipitation_probability_1mm ?? 100) / 100; g += `<rect class="wxr" style="opacity:${(0.45 + 0.4 * pr).toFixed(2)}" x="${(X(i) - bwid / 2).toFixed(1)}" y="${(pt + ph - h).toFixed(1)}" width="${bwid.toFixed(1)}" height="${h.toFixed(1)}" rx="2"/>`; } });
    /* Bandbreite + Linien */
    const band = (up, lw) => { const u = D.map((d, i) => [X(i), Y(d[up])]), l = D.map((d, i) => [X(i), Y(d[lw])]).reverse(); return `${smooth(u)}L${l[0][0].toFixed(1)} ${l[0][1].toFixed(1)}${smooth(l).replace(/^M[^C]*/, '')}Z`; };
    if (D.every(d => d.hh != null && d.hl != null)) g += `<path class="trb h" d="${band('hh', 'hl')}"/>`;
    if (D.every(d => d.lh != null && d.ll != null)) g += `<path class="trb l" d="${band('lh', 'll')}"/>`;
    const line = k => { const run = D.map((d, i) => d[k] != null ? [X(i), Y(d[k])] : null).filter(Boolean); return run.length > 1 ? smooth(run) : ''; };
    g += `<path class="trl h" d="${line('hi')}"/><path class="trl l" d="${line('lo')}"/>`;
    const lab = (x, y, t, c) => `<g class="trp"><rect x="${(x - 11).toFixed(1)}" y="${(y - 8).toFixed(1)}" width="22" height="15" rx="7"/><text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="middle" fill="${c}" dy="0">${Math.round(t)}°</text></g>`;
    D.forEach((d, i) => { if (colW < 24 && i % 2) return; if (d.hi != null) g += lab(X(i), Y(d.hi) - 12, d.hi, '#fda4af'); if (d.lo != null) g += lab(X(i), Y(d.lo) + 14, d.lo, '#93c5fd'); });
    /* Auswahl-Cursor */
    const sel = this._trI != null && this._trI < n ? this._trI : null;
    if (sel != null) { const d = D[sel], yv = d.hi ?? (d.hl != null && d.hh != null ? (d.hl + d.hh) / 2 : y0); g += `<line class="wxcl" x1="${X(sel).toFixed(1)}" x2="${X(sel).toFixed(1)}" y1="0" y2="${HT}"/><circle class="wxcd" r="5" cx="${X(sel).toFixed(1)}" cy="${Y(yv).toFixed(1)}"/>`; }
    /* Sonnenanteil (Streifen unter dem Diagramm) */
    D.forEach((d, i) => { const s = Math.max(0, Math.min(100, d.sun_hours_relative ?? 0)) / 100; g += `<rect class="trs" style="opacity:${(0.2 + s * 0.8).toFixed(2)}" x="${(L + colW * i + 2).toFixed(1)}" y="${HT + 8}" width="${(colW - 4).toFixed(1)}" height="14" rx="5"/>`; });
    D.forEach((d, i) => { g += `<rect class="trhit" data-act="trsel" data-i="${i}" x="${(L + colW * i).toFixed(1)}" y="0" width="${colW.toFixed(1)}" height="${HT + 26}"/>`; });
    /* Tageslabels + Symbole (wie in der Kompakt-Vorhersage) */
    const isz = wide ? 28 : 22, tk = new Date(); tk.setHours(0, 0, 0, 0);
    const days = D.map((d, i) => { const dn = d.dt.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', ''); return `<div class="wxd" style="left:${(L + colW * i).toFixed(1)}px;width:${colW.toFixed(1)}px">${dn}${colW > 62 ? `<small>${d.dt.getDate()}.${d.dt.getMonth() + 1}.</small>` : ''}</div>`; }).join('');
    const icons = D.map((d, i) => `<div class="wxi" style="left:${X(i).toFixed(1)}px">${wx(d.cond, isz)}</div>`).join('');
    const nar = W < 600;
    let tip = '';
    if (sel != null) {
      const d = D[sel], f = (v, k = 0) => v == null ? '–' : de(v, k), rg = (a, b, k = 0) => nar || a == null || b == null ? '' : ` <small>(${de(a, k)}–${de(b, k)})</small>`;
      const tw = nar ? 168 : 280, x = X(sel), left = x > W * 0.52 ? Math.max(0, x - 12 - tw) : Math.min(W - tw, x + 12);
      const mid = (a, b) => a != null && b != null ? (a + b) / 2 : null;
      tip = `<div class="wxt${nar ? ' nar' : ''}" style="left:${left.toFixed(0)}px;top:${top + (nar ? 2 : 6)}px;width:${tw}px"><div class="wxth"><b>${d.dt.toLocaleDateString('de-DE', nar ? { weekday: 'short', day: 'numeric', month: 'numeric' } : { weekday: 'long', day: 'numeric', month: 'long' })}</b></div>
        <div class="wxtl"><div class="wxtr"><i class="wxdt t"></i>Höchstwert<b>${f(d.hi ?? mid(d.hl, d.hh))} °C${rg(d.hl, d.hh)}</b></div>
        <div class="wxtr"><i class="wxdt b"></i>Tiefstwert<b>${f(d.lo ?? mid(d.ll, d.lh))} °C${rg(d.ll, d.lh)}</b></div>
        <div class="wxtr"><i class="wxdt r"></i>Niederschlag<b>${f(d.precipitation, 1)} mm${rg(d.precipitation_low, d.precipitation_high, 1)}</b></div>
        <div class="wxtr"><i class="wxdt"></i>Regen ≥ 1 mm<b>${f(d.precipitation_probability_1mm)} %</b></div>
        <div class="wxtr"><i class="wxdt s"></i>Sonne<b>${f(d.sun_hours, 1)} h${d.sun_hours_relative != null ? ` <small>(${f(d.sun_hours_relative)} %)</small>` : ''}</b></div></div><div class="wxti">${wx(d.cond, 38)}<span>${COND[d.cond] || ''}</span></div></div>`;
    }
    return `<div class="trw" data-w="${W}" style="width:${W}px;height:${top + HT + 30}px">${days}${icons}<svg class="wxs" width="${W}" height="${HT + 26}" viewBox="0 0 ${W} ${HT + 26}" style="top:${top}px">${g}</svg>${tip}</div>`;
  }
  _trCard() {
    const G = this._trGeo(); if (!G) return null;
    const chips = [[7, '7 Tage'], [10, '10 Tage'], [14, '14 Tage']].map(x => `<button class="qfc ${x[0] === G.span ? 'on' : ''}" data-act="trspan" data-n="${x[0]}">${x[1]}</button>`).join('');
    return `<div class="h">${ic('cloudsun', 14)}14-Tage-Trend<span class="r">Kachelmann</span></div><div class="qfl wxsp">${chips}</div><div class="wxwrap">${this._trChart(G)}</div><div class="card-note" style="margin-top:6px">Tippen für Details · Höchst- (rot) und Tiefstwert (blau) mit Bandbreite der Prognose, Regen (Balken, mm), Sonnenanteil (gelb) · Wochenende dunkel hinterlegt</div>`;
  }
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

  /* ───────────── Rendern ───────────── */
  _navHtml() {
    return `<div class="logo"></div>${(WALL_UI ? [...TABS, ['clean', 'Putzplan', 'broom']] : TABS).map(t => `<button class="nb ${this._v === t[0] ? 'on' : ''}" data-act="nav" data-v="${t[0]}">${ic(t[2], 24)}<span class="lab">${t[1]}</span></button>`).join('')}
      <div class="sp"></div>${this._lockBtn()}<button class="nb gear" data-act="settings">${ic('cog', 24)}<span class="lab">Einstellungen</span></button>`;
  }
  _render() {
    if (!this._h || !this._built) return;
    this._lastRender = Date.now(); this._applyTheme();
    this._need = new Set();
    const views = { clean: () => this._vClean(), home: () => this._vHome(), rooms: () => this._vRooms(), climate: () => this._vClimate(), bath: () => this._vBath(), weather: () => this._vWeather(), printer: () => this._vPrinter() };
    this._main.className = this._enter ? 'enter' : '';
    this._morph(this._main, (views[this._v] || views.home)());
    this._morph(this._nav, this._navHtml());
    if (this._sheet) this._renderSheet();
    this._rdrMount();
    this._todSet();
    this._fxKind();
    this._fitHost(); requestAnimationFrame(() => this._fitHost());
    if (this._fitCock) { this._fitCock(); requestAnimationFrame(() => this._fitCock()); }
    if (this._need.size) this._loadHist();
    if (this._v === 'home' || this._v === 'weather') this._loadFc();
    if (this._v === 'weather') { this._loadFcX(); this._wxRestore(); }
    if (this._v === 'home') { this._loadCal(); this._loadSys(); this._loadPower(); }
    this._ambRender();
    if (this._enter && !this._counted) {
      this._counted = true;
      this._countUp();
      clearTimeout(this._et); this._et = setTimeout(() => { this._enter = false; }, 1000);
    }
  }
  /* Aktualisiert das DOM an Ort und Stelle (statt innerHTML zu ersetzen): laufende Animationen
     (Wetter-Icons, Wolken, Regen) starten dadurch bei Datenänderungen nicht jedes Mal neu. */
  _morph(el, html) {
    const t = document.createElement('template'); t.innerHTML = html;
    this._mc(el, t.content);
  }
  _mc(a, b) {
    const ac = a.childNodes, bc = b.childNodes;
    for (let i = 0; i < bc.length; i++) {
      const n = bc[i], o = ac[i];
      if (!o) { a.appendChild(n.cloneNode(true)); continue; }
      if (o.nodeType !== n.nodeType || o.nodeName !== n.nodeName) { a.replaceChild(n.cloneNode(true), o); continue; }
      if (n.nodeType !== 1) { if (o.nodeValue !== n.nodeValue && !(a._cu > performance.now())) o.nodeValue = n.nodeValue; continue; }
      for (const at of [...o.attributes]) if (!n.hasAttribute(at.name)) o.removeAttribute(at.name);
      for (const at of n.attributes) if (o.getAttribute(at.name) !== at.value) o.setAttribute(at.name, at.value);
      if (o.nodeName === 'INPUT' && o.type !== 'file') { const v = n.getAttribute('value'); if (v != null && o.value !== v && this.shadowRoot.activeElement !== o) o.value = v; }
      if (o.hasAttribute('data-keep')) continue;
      this._mc(o, n);
    }
    while (ac.length > bc.length) a.removeChild(a.lastChild);
  }
  _renderSoon() { clearTimeout(this._rs); this._rs = setTimeout(() => this._render(), 140); }
  _renderSheet() {
    const st = this._sh.scrollTop;
    if (this._sheet.t === 'sched' && this._schedEl && this._sh.contains(this._schedEl)) { this._schedEl.hass = this._h; this._ov.classList.add('show'); return; }
    const r = this._sheet.t === 'room' ? this._c.rooms.find(x => x.id === this._sheet.id) : null;
    const T = { vroom: () => this._sVRoom(this._sheet.e), persons: () => this._sPersons(), quick: () => this._sQuick(), vent: () => this._sVent(), cal: () => this._sCal(), bat: () => this._sBat(), doors: () => this._sDoors(), sys: () => this._sSys(), waste: () => this._sWaste(), power: () => this._sPower(), sched: () => this._sSched(), set: () => this._sSet(), warn: () => this._sWarn(), radar: () => this._sRadar(), pin: () => this._sPin(), fuel: () => this._sFuel(), plants: () => this._sPlants(), heat: () => this._sHeat(), kid: () => this._sKid(), clean: () => this._sClean(), tv: () => this._sTv(), pzstat: () => this._sPzStat() };
    const qn = this.shadowRoot.getElementById('qname'), qv = qn ? qn.value : null, qf = qn && this.shadowRoot.activeElement === qn;
    const pq = this.shadowRoot.getElementById('pzq'), pqf = pq && this.shadowRoot.activeElement === pq, pqs = pq ? pq.selectionStart : 0;
    const html = r ? this._sRoom(r) : (T[this._sheet.t] || (() => this._sLights()))(), key = this._sheet.t + ':' + (this._sheet.id || this._sheet.e || '');
    if (this._shKey === key && this._sh.firstChild) this._morph(this._sh, html); else this._sh.innerHTML = html;
    this._shKey = key;
    if (pqf) { const p2 = this.shadowRoot.getElementById('pzq'); if (p2) { p2.focus(); try { p2.setSelectionRange(pqs, pqs); } catch (x) { } } }
    if (qv != null) { const n2 = this.shadowRoot.getElementById('qname'); if (n2) { n2.value = qv; if (qf) n2.focus(); } }
    if (this._sheet.t === 'sched') this._mountSched();
    this._sh.scrollTop = st;
    this._ov.classList.toggle('rdfull', this._sheet.t === 'radar'); this._ov.classList.add('show');
    this._rdrMount();
    if (this._need.size) this._loadHist();
  }
  _closeSheet() { this._sheet = null; this._shKey = null; this._schedEl = null; this._armed = false; this._ov.classList.remove('show', 'rdfull'); this._rdrMount(); }
  _todSet() {
    const s = this._s(this._c.sun), el = s?.attributes?.elevation;
    let t;
    if (el != null) t = el > 8 ? 'day' : el > -6 ? 'dusk' : 'night';
    else { const h = new Date().getHours(); t = h >= 8 && h < 18 ? 'day' : (h >= 6 && h < 8) || (h >= 18 && h < 21) ? 'dusk' : 'night'; }
    this._app.dataset.tod = t;
    this._fullyApply();
  }
  _clockTick() {
    const nt = WALL_UI ? this._inNight() : null, vis = document.visibilityState === 'visible' && this.getClientRects().length > 0;
    if (this._amb) { if (this._ambBy === 'night' && !nt) this._ambOff(); else { const s = this._clockStr(); if (this._ambClk !== s) { this._ambClk = s; this._ambRender(); } } }
    else if (nt && vis && Date.now() - this._lastAct > nt.after * 6e4) { this._ambOn(); this._ambBy = 'night'; }
    else if (WALL_UI && this._ambMin() > 0 && Date.now() - this._lastAct > this._ambMin() * 6e4 && vis) { this._ambOn(); this._ambBy = 'day'; }
    this._tmrTick();
    const el = this.shadowRoot?.getElementById('clk');
    if (!el) return;
    const s = this._clockStr();
    if (el._last !== s) { el._last = s; el.innerHTML = s; }
  }
  _countUp() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this._main.querySelectorAll('[data-count]').forEach(el => {
      const to = parseFloat(el.dataset.count), d = parseInt(el.dataset.d || '0', 10), node = el.firstChild;
      if (isNaN(to) || !node || node.nodeType !== 3) return;
      const t0 = performance.now(); el._cu = t0 + 850;
      const step = t => {
        const p = clamp((t - t0) / 800, 0, 1), e = 1 - Math.pow(1 - p, 3);
        node.nodeValue = de(to * e, d);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  /* Hintergrund/Navigation bis zur echten Fensterunterkante ziehen (HA-Kopfzeile ist im Kiosk-Modus weg, --header-height bleibt aber gesetzt) */
  _fitHost() {
    if (!this._fhR) { this._fhR = 1; addEventListener('resize', () => this._fitHost()); }
    const t = this.getBoundingClientRect().top, ih = window.innerHeight || document.documentElement.clientHeight;
    if (!(ih > 0) || t < 0 || t > ih / 2) return;
    this.style.setProperty('--hmin', Math.floor(ih - t) + 'px');
  }
  _toast(msg, ms = 2200, a) {
    this._tst.textContent = msg; this._tst.classList.add('show');
    if (a) { this._tst.dataset.act = a.act; this._tst.dataset.e = a.e; this._tst.classList.add('tap'); } else { delete this._tst.dataset.act; delete this._tst.dataset.e; this._tst.classList.remove('tap'); }
    clearTimeout(this._tt); this._tt = setTimeout(() => this._tst.classList.remove('show'), ms);
  }

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
      const el = ev.target.closest('input[data-act="bright"]');
      if (el) el.style.setProperty('--v', el.value + '%');
    });
    root.addEventListener('change', ev => {
      const el = ev.target.closest('input[data-act="bright"]');
      if (!el) return;
      this._h.callService('light', 'turn_on', { entity_id: el.dataset.e, brightness_pct: parseInt(el.value, 10) });
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
      case 'maps': { const u = `https://www.google.com/maps/dir/?api=1&destination=${el.dataset.lat},${el.dataset.lon}`; try { window.open(u, '_blank', 'noopener'); } catch (er) { /* ok */ } break; }
      case 'fuauto': this._fuPref = el.dataset.m; try { localStorage.setItem('home-aurora-fully', el.dataset.m); } catch (er) { /* ok */ } this._fuLast = null; this._fullyApply(true); this._renderSheet(); break;
      case 'fuelk': this._fuelK = el.dataset.k; this._renderSheet(); break;
      case 'sys': this._sheet = { t: 'sys' }; this._renderSheet(); this._loadSys(true); break;
      case 'power': this._sheet = { t: 'power' }; this._renderSheet(); this._loadPower(true); break;
      case 'sched': this._sheet = { t: 'sched' }; this._renderSheet(); break;
      case 'settings': this._sheet = { t: 'set' }; this._renderSheet(); break;
      case 'quick': this._quickRun(e); break;
      case 'theme': this._themePref = el.dataset.m; try { localStorage.setItem('home-aurora-theme', el.dataset.m); } catch (er) { /* ok */ } this._render(); break;
      case 'ambnight': this._nightPref = el.dataset.m; try { localStorage.setItem('home-aurora-ambnight', el.dataset.m); } catch (er) { /* ok */ } this._renderSheet(); break;
      case 'ambafter': this._ambPref = el.dataset.m; try { localStorage.setItem('home-aurora-amb', el.dataset.m); } catch (er) { /* ok */ } this._lastAct = Date.now(); this._renderSheet(); break;
      case 'ambient': this._closeSheet(); this._ambOn(); break;
      case 'radar': this._sheet = { t: 'radar' }; this._renderSheet(); break;
      case 'lock': this._lockToggle(); break;
      case 'kid': this._sheet = { t: 'kid', i: parseInt(el.dataset.i, 10) || 0 }; this._renderSheet(); break;
      case 'pz': if (WALL_UI) { this._v = 'clean'; this._enter = true; this._counted = false; this._closeSheet(); this._render(); } else { this._sheet = { t: 'clean' }; this._renderSheet(); } break;
      case 'pzf': { const st = this._pzSt(); if (st) { st.f = e; st.q = ''; this._pzRefresh(); } break; }
      case 'pzdone': this._pzDone(e); break;
      case 'pzundo': this._pzUndo(e); this._tst.classList.remove('show'); break;
      case 'pzroom': if (this._pzSt()) { this._pzCol = this._pzCol || {}; this._pzCol[el.dataset.id] = el.dataset.c !== '1'; this._pzRefresh(); } break;
      case 'pzstat': this._sheet = { t: 'pzstat' }; this._renderSheet(); this._pzLoadStat(); break;
      case 'pzstatr': this._pzS = null; this._renderSheet(); this._pzLoadStat(true); break;
      case 'pzback': if (WALL_UI) this._closeSheet(); else { this._sheet = { t: 'clean' }; this._renderSheet(); } break;
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
      case 'cal': this._calMode = 'month'; this._calMo = 0; this._calSel = null; this._sheet = { t: 'cal' }; this._renderSheet(); if (!this._cal) this._loadCal(); break;
      case 'calmode': this._calMode = el.dataset.m === 'list' ? 'list' : 'month'; this._renderSheet(); break;
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
        const cl = this._s(e); if (!cl) break;
        const cur = cl.attributes.temperature ?? cl.attributes.current_temperature ?? 20;
        const nt = clamp(Math.round((cur + parseFloat(el.dataset.d)) * 2) / 2, cl.attributes.min_temp ?? 5, cl.attributes.max_temp ?? 30);
        h.callService('climate', 'set_temperature', { entity_id: e, temperature: nt }); break;
      }
      case 'hvac': h.callService('climate', 'set_hvac_mode', { entity_id: e, hvac_mode: this._val(e) === 'off' ? 'heat' : 'off' }); break;
    }
  }

  /* ───────────── Hintergrund-Effekte (Regen, Schnee, Sterne, Glühpunkte) ───────────── */
  _fxKind() {
    const c = this._val(this._c.weather), night = this._app.dataset.tod === 'night';
    let k = /rainy|pouring/.test(c || '') ? 'rain' : /snowy|hail/.test(c || '') ? 'snow' : (night || c === 'clear-night') ? 'stars' : 'motes';
    if (this._light && k !== 'rain') k = 'none';
    if (k !== this._fx.kind) { this._fx = { kind: k, p: [] }; }
  }
  _fxStart() {
    if (this._fxRaf || !this._cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = this._cv, ctx = cv.getContext('2d');
    const loop = () => {
      this._fxRaf = requestAnimationFrame(loop);
      const dpr = Math.min(2, window.devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight;
      if (!W || !H) return;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); this._fx.p = []; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const f = this._fx, vh = Math.min(H, 1400);
      if (!f.p.length) {
        const n = { rain: 130, snow: 80, stars: 70, motes: 26 }[f.kind] || 0;
        f.p = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * vh, v: .5 + Math.random(), r: Math.random(), a: Math.random() * 6.28 }));
      }
      for (const p of f.p) {
        if (f.kind === 'rain') { p.y += 9 * p.v; p.x -= 1.6 * p.v; if (p.y > vh) { p.y = -20; p.x = Math.random() * W; } ctx.strokeStyle = `rgba(147,197,253,${.12 + .2 * p.r})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 3, p.y + 14 * p.v); ctx.stroke(); }
        else if (f.kind === 'snow') { p.y += .7 * p.v; p.a += .01; p.x += Math.sin(p.a) * .5; if (p.y > vh) { p.y = -6; p.x = Math.random() * W; } ctx.fillStyle = `rgba(255,255,255,${.25 + .4 * p.r})`; ctx.beginPath(); ctx.arc(p.x, p.y, 1 + 2 * p.r, 0, 6.28); ctx.fill(); }
        else if (f.kind === 'stars') { p.a += .02 * p.v; ctx.fillStyle = `rgba(255,255,255,${.1 + .5 * Math.abs(Math.sin(p.a))})`; ctx.beginPath(); ctx.arc(p.x, p.y * .6, .6 + 1.2 * p.r, 0, 6.28); ctx.fill(); }
        else { p.y -= .12 * p.v; p.x += Math.sin(p.a += .004) * .15; if (p.y < -10) { p.y = vh + 10; p.x = Math.random() * W; } const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7 + 9 * p.r); g.addColorStop(0, `rgba(180,230,255,${.22 + .2 * p.r})`); g.addColorStop(1, 'rgba(180,230,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, 6.28); ctx.fill(); }
      }
    };
    loop();
  }
  _fxStop() { cancelAnimationFrame(this._fxRaf); this._fxRaf = 0; }
}


/* ───────────── Visueller Editor ───────────── */
const EDITOR_SCHEMA = [
  { name: 'theme', selector: { select: { mode: 'dropdown', options: [{ value: 'dark', label: 'Dunkel' }, { value: 'light', label: 'Hell' }, { value: 'auto', label: 'Automatisch (wie Home Assistant)' }] } } },
  { name: 'ambient_after', selector: { select: { mode: 'dropdown', options: [{ value: 0, label: 'Aus' }, { value: 2, label: 'Nach 2 Minuten' }, { value: 5, label: 'Nach 5 Minuten' }, { value: 10, label: 'Nach 10 Minuten' }, { value: 30, label: 'Nach 30 Minuten' }] } } },
  { name: 'weather', selector: { entity: { domain: 'weather' } } },
  { name: 'persons', selector: { entity: { domain: 'person', multiple: true } } },
  { name: 'radar', selector: { entity: { domain: 'camera' } } },
  { name: 'radarUrl', selector: { text: {} } },
  { name: 'calendarDays', selector: { number: { min: 3, max: 60, mode: 'box' } } },
  { name: 'batteryLow', selector: { number: { min: 5, max: 50, mode: 'box', unit_of_measurement: '%' } } },
];
const EDITOR_LABELS = { theme: 'Design', ambient_after: 'Wandtablet-Modus automatisch starten', weather: 'Wetter-Entität', persons: 'Personen', radar: 'Regenradar-Kamera', radarUrl: 'Eigene Radar-URL (optional, Live-Karte)', calendarDays: 'Termine: Tage voraus', batteryLow: 'Batterie schwach ab' };
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
    this._f.hass = this._h; this._f.schema = WALL_UI ? EDITOR_SCHEMA : EDITOR_SCHEMA.filter(s => s.name !== 'ambient_after'); this._f.data = { theme: 'dark', ambient_after: 0, ...this._c };
  }
}
/* ───────────── Home Aurora Wide: Querformat für Tablet & Desktop ───────────── */
const CSSW = `
/* Gerüst: volle Breite, Startseite füllt genau den Bildschirm */
@media (min-width:861px){.app.wide .shell{grid-template-columns:84px minmax(0,1fr)}.app.wide main{max-width:none;padding:16px 20px 16px 4px}.app.wide .vh h1{font-size:28px}}

/* Startseite = Cockpit */
.cock{display:flex;flex-direction:column;gap:12px}
@media (min-width:1200px){.cock{height:var(--cockh,calc(100vh - var(--header-height,0px) - 32px));min-height:620px}}
@supports (height:100dvh){@media (min-width:1200px){.cock{height:var(--cockh,calc(100dvh - var(--header-height,0px) - 32px))}}}
.ctop{display:flex;align-items:center;gap:10px;min-height:40px;flex:none}
.ctop .alerts{margin:0;flex-wrap:nowrap;flex:none}.ctop .qa{margin:0;padding:2px 0;flex:1 1 0;min-width:0;flex-wrap:nowrap;overflow-x:auto}
.ctop .al,.ctop .qp{flex:none;white-space:nowrap}
.ctop .gap{flex:1}
.ctop .tb{flex:none;display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:rgba(var(--wh),.07);border:1px solid var(--line);font-size:13px;color:var(--tx2);white-space:nowrap}
.ctop .tb:hover{color:var(--tx);background:rgba(var(--wh),.12)}
.stg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;flex:none}
.app.wide .stg .st{grid-column:auto;display:grid;grid-template-columns:auto auto minmax(0,1fr);grid-template-areas:"ico num lab" "ico num sub";align-items:center;column-gap:14px;row-gap:1px;min-height:0;padding:12px 16px;border-radius:24px}
.app.wide .st .top{grid-area:ico}.app.wide .st .ico{width:44px;height:44px;border-radius:15px}
.app.wide .st>div:last-child{display:contents}
.app.wide .st .v{grid-area:num;font-size:40px;line-height:1;margin:0}.app.wide .st .v[style]{font-size:24px!important}
.app.wide .st .l{grid-area:lab;align-self:end;margin:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.app.wide .st .sub{grid-area:sub;align-self:start;margin:0;font-size:11.5px}
.cols{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:minmax(270px,.9fr) minmax(0,1.75fr) minmax(270px,.95fr);gap:14px}
.col{display:flex;flex-direction:column;gap:14px;min-width:0;min-height:0}
.col>.c{padding:16px 18px;border-radius:26px}
.col>.grow{flex:1 1 0;min-height:0}
.col>.fix{flex:none}
/* Hero */
.app.wide .hero{min-height:0;flex-direction:column;flex-wrap:nowrap;gap:12px;justify-content:space-between}
.app.wide .hero .hl{min-width:0;flex:1;gap:10px}
.app.wide .clock{font-size:clamp(64px,11vh,116px);line-height:.95}
.app.wide .date{margin-top:6px}.app.wide .sum{margin-top:12px;font-size:14.5px}
.app.wide .hero .pp{margin-top:12px!important}
.app.wide .hero .rings{margin:0 0 4px;justify-content:flex-start}.app.wide .hero .rl{min-width:0;flex:1}
/* Alltag */
.alt{display:grid;grid-template-columns:1fr;gap:8px}
.alt .xr{padding:7px 10px;gap:10px;min-width:0;margin:0}.alt .xr .ico{width:34px;height:34px;border-radius:11px}.alt .xr .t{font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.alt .xr .s{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.alt .xr>div:nth-child(2){min-width:0;flex:1}.alt .xr .sw{flex:none}
/* Räume */
.rooms{display:flex;flex-direction:column}
.rooms .h{margin-bottom:10px;flex:none}
.rooms .rg{flex:1;min-height:0;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:minmax(0,1fr);gap:10px;overflow:auto;scrollbar-width:none}
.rooms .rg::-webkit-scrollbar{display:none}
.rooms .rm{padding:11px 12px 12px;min-height:0;gap:4px;border-radius:22px;justify-content:space-between}.col>.rooms.grow{flex-grow:1.2}
.rooms .rm .rt{font-size:13.5px}
.rooms .rm .rw,.rooms .rm .rw .ring{width:40px;height:40px}.rooms .rm .rw .ri svg{width:17px;height:17px}
.rooms .rm .rv{font-size:25px;white-space:nowrap}.rooms .rm .rv .u{font-size:.5em}.rooms .rm .rmid{gap:8px;min-width:0}
.rooms .rm .rb{font-size:12px;gap:8px;flex-wrap:wrap}
.rooms .rm .spark,.rooms .rm .sk,.rooms .rm .qb{display:none}
.chartc{display:flex;flex-direction:column}.chartc .h{flex:none;margin-bottom:8px}
/* Wetter */
.app.wide .wxh{min-height:0;gap:10px}
.app.wide .wxh .wtemp{font-size:clamp(46px,7.5vh,68px)}
.app.wide .wxh .mini{margin-top:8px}
.col .c.cal{overflow:hidden}
.col .c.cal .vr,.col .c.cal .ev{margin-bottom:6px}
@media (min-width:1700px){
  .app.wide main{padding:22px 28px 22px 6px}.cock{height:var(--cockh,calc(100vh - var(--header-height,0px) - 44px));gap:16px}
  @supports (height:100dvh){.cock{height:var(--cockh,calc(100dvh - var(--header-height,0px) - 44px))}}
  .cols{gap:18px}.col{gap:18px}.stg{gap:16px}
  .rooms .rg{gap:14px}.rooms .rm{padding:16px 16px 14px}.rooms .rm .rw,.rooms .rm .rw .ring{width:52px;height:52px}.rooms .rm .rv{font-size:32px}.rooms .rm .rt{font-size:15px}.rooms .rm .rb{font-size:13px}
  .app.wide .sum{font-size:16px}.alt .xr .t{font-size:13.5px}
}
@media (max-height:899px),(max-width:1699px){.app.wide .hero .rings{display:none}.app.wide .hero{position:relative}.app.wide .hero .pp{position:absolute;top:3px;right:14px;margin:0!important;flex-wrap:nowrap;gap:6px;z-index:2}.app.wide .hero .pp .pc{padding:0;background:none;border:0;box-shadow:none;min-width:0;gap:0}.app.wide .hero .pp .pc>div:last-child{display:none}.app.wide .hero .pp .pc .av{width:28px;height:28px;font-size:12px;flex:none}}
@media (min-height:940px){.rooms .rm .spark{display:block}}
@media (max-height:959px){.col [data-act=power] .bt,.col [data-act=power] .card-note,.col [data-act=power] .okc{display:none}.col [data-act=power] .pwr{margin:0}}
/* Niedrige Tablets (ca. 700–800 px Höhe, z. B. Vollbild-Browser): kompakter, damit nichts abgeschnitten wird */
@media (min-width:1200px) and (max-height:820px){
  .app.wide .clock{font-size:clamp(54px,9.5vh,84px)}
  .app.wide .date{margin-top:2px}.app.wide .sum{margin-top:6px;font-size:13.5px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .app.wide .hero .pp{margin-top:8px!important;flex:none}.app.wide .hero{gap:8px}.col>.c{padding:13px 15px}
  .app.wide .hero .hl{overflow:hidden}
  .alt{gap:5px}.alt .xr{padding:5px 10px}.alt .xr .ico{width:30px;height:30px}
  .rooms .rg{gap:8px}.rooms .rm{padding:8px 10px 9px;gap:2px}.rooms .rm .rb{flex-wrap:nowrap;white-space:nowrap;overflow:hidden;gap:6px;font-size:11.5px}
  .rooms .rm .rw,.rooms .rm .rw .ring{width:34px;height:34px}.rooms .rm .rv{font-size:22px}.rooms .rm .rt{font-size:12.5px}
}
.rooms .rm .rb{min-width:0}.rooms .rm{overflow:hidden}
/* Tablet quer, schmaler: zwei Spalten, Seite scrollt */
@media (max-width:1199px){
  .cock{height:auto;min-height:0}.cols{flex:none}.col>.grow,.col>.fix{flex:none}.rooms .rg{grid-auto-rows:auto}.chartc{min-height:300px}
  .cols{grid-template-columns:minmax(0,1fr) minmax(0,1.5fr)}
  .col.c3{grid-column:1 / -1;flex-direction:row;flex-wrap:wrap}.col.c3>.c{flex:1 1 280px}
  .rooms .rg{overflow:visible}
  .stg{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:860px){
  .cols{grid-template-columns:minmax(0,1fr)}
  .stg{grid-template-columns:repeat(2,minmax(0,1fr))}
  .rooms .rg{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`;

class HomeAuroraWide extends HomeAurora {
  _build() {
    super._build();
    this._app.classList.add('wide');
    const st = document.createElement('style'); st.textContent = CSSW; this.shadowRoot.appendChild(st);
  }
  getCardSize() { return 10; }
  /* Cockpit exakt auf die sichtbare Höhe ziehen (HA-Kopfzeile/Kiosk-Modus berücksichtigt): Abstand zur Fensterkante messen statt --header-height zu raten */
  _fitCock() {
    const el = this._main && this._main.querySelector('.cock'); if (!el) return;
    if (!this._fcR) { this._fcR = 1; addEventListener('resize', () => this._fitCock()); }
    const t = el.getBoundingClientRect().top, pb = parseFloat(getComputedStyle(this._main).paddingBottom) || 16, ih = window.innerHeight || document.documentElement.clientHeight;
    if (!(ih > 0) || t > ih) return;
    this.style.setProperty('--cockh', Math.max(620, Math.floor(ih - t - pb)) + 'px');
  }
  setConfig(cfg) { super.setConfig({ ambient_night: { from: '23:00', to: '06:00', after: 1 }, ...(cfg || {}) }); }

  _vHome() {
    const { c, L, open, V, VD, w, fc, sentence, mini, xr, sunChip, bathState, bathBusy } = this._homeBits();
    const AL = this._alerts(), q = this._quick();
    const nv = VD.rooms.length ? VD.prio.length : V;
    const wxCard = `<div class="c wxh tap fix" style="--i:2;--wglow:${this._wxGlow(w.cond)}" data-act="nav" data-v="weather">
        <div class="wtop"><div><div class="wtemp big" data-count="${w.temp ?? 0}" data-d="1">${de(w.temp)}<small class="u">°C</small></div><div class="wcond">${COND[w.cond] || w.cond}</div></div>${wx(w.cond, 72)}</div>
        <div><div class="chips"><span class="chip">${ic('drop', 14)}<b>${de(w.hum, 0)}</b>%</span><span class="chip">${ic('wind', 14)}<b>${de(w.wind, 0)}</b> ${esc(w.windU)}</span>${w.rain ? `<span class="chip">${ic('rain', 14)}<b>${de(w.rain)}</b> ${esc(w.rainU)}</span>` : ''}${sunChip}</div>${mini ? `<div class="mini">${mini}</div>` : ''}</div></div>`;
    const pz0 = this._pzCard(6, 2), alltag = [...xr.filter(x => !/Heizmodus/.test(x) && !(this._pzCard(6, 2) && /Tanken/.test(x))), this._plantRow(), this._sysRow()].filter(Boolean).slice(0, pz0 ? 3 : 5);
    const cal = this._calCard(7, 3), pow = this._powerCard(8);
    const vh = typeof innerHeight === 'number' ? innerHeight : 800;
    return `<div class="cock">
      <div class="ctop">${AL.length ? `<div class="alerts">${AL.map(a => this._alertHtml(a)).join('')}</div>` : ''}${q || '<div class="gap"></div>'}
        <button class="tb" data-act="ambient">${ic('expand', 15)}Wandtablet</button></div>
      <div class="stg">
        ${this._stat(1, 'bulb', 'Lichter an', L, L ? 'hot' : '', L ? esc(this._lightsOn().slice(0, 2).map(e => this._name(e)).join(', ')) + (L > 2 ? ' …' : '') : 'Alles aus', 'lights')}
        ${this._stat(2, 'window', 'Fenster offen', open.length, open.length ? 'bad' : 'cool', this._winSub(open), 'doors')}
        ${this._stat(3, 'wind', 'Räume zu lüften', nv, nv ? 'hot' : 'cool', nv ? (VD.prio.slice(0, 2).map(r => esc(r.name)).join(', ') + (VD.prio.length > 2 ? ' …' : '')) : (VD.paused.length ? VD.paused.length + ' später empfohlen' : 'Luft ist gut'), 'vent')}
        ${this._stat(4, 'bath', 'Badezimmer', bathState, bathBusy ? 'bad' : 'cool', 'Status', 'nav', 'data-v="bath"')}
      </div>
      <div class="cols">
        <div class="col c1">
          <div class="c hero grow" style="--i:5"><div class="hl"><div><div class="hello">${this._greet()}</div><div class="clock big" id="clk">${this._clockStr()}</div>
            <div class="date">${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</div><div class="sum">${sentence}</div></div>
            ${this._rings()}<div class="pp">${this._persons()}</div></div></div>
          ${pz0}
          ${alltag.length ? `<div class="c fix" style="--i:6"><div class="alt">${alltag.join('')}</div></div>` : ''}
        </div>
        <div class="col c2">
          <div class="c rooms grow" style="--i:3"><div class="h">${ic('grid', 14)}Räume<span class="r">${c.rooms.length} Räume</span></div><div class="rg">${c.rooms.map((r, i) => this._roomTile(r, true, 4 + i)).join('')}</div></div>
          <div class="c chartc grow" style="--i:9"><div class="h">${ic('thermo', 14)}Temperaturen<span class="r">letzte 24 Stunden</span></div>${this._chart(this._tempSeries(false), { h: Math.round(Math.max(120, Math.min(340, vh * 0.255))), dec: 1 })}</div>
        </div>
        <div class="col c3">
          ${wxCard}
          ${cal ? cal.replace('<div class="c" ', '<div class="c cal grow" ') : ''}
          ${pow ? pow.replace('<div class="c ', '<div class="c fix ').replace('<div class="c" ', '<div class="c fix" ') : ''}
        </div>
      </div>
    </div>`;
  }
}

customElements.define('home-aurora-wide-editor', HomeAuroraEditor);

customElements.define('home-aurora-wide', HomeAuroraWide);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'home-aurora-wide', name: 'Home Aurora Wide', description: 'Home Aurora im Querformat für Tablet und Desktop (Cockpit ohne Scrollen)', preview: false });
})();
