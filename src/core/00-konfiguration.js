/*! @@BANNER@@ */
(() => {
'use strict';
const WALL_UI = @@WALL_UI@@; // Wandtablet-/Ambient-Modus: nur in der Querformat-Version (Build setzt true)
if (customElements.get('@@TAG@@')) return;

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
  music: {
    all: { name: 'Überall', media: 'media_player.uberall', notify: 'notify.uberall_durchsagen' },
    speakers: [
      { name: 'Wohnzimmer', icon: 'sofa', media: ['media_player.wohnzimmer', 'media_player.wohnzimmer_wohnzimmer'], notify: 'notify.wohnzimmer_durchsagen' },
      { name: 'Küche', icon: 'cook', media: ['media_player.jenny_patrick', 'media_player.kuche_jenny_patrick'], notify: 'notify.jenny_patrick_durchsagen' },
      { name: 'Nele', icon: 'heart', media: ['media_player.kinderzimmer', 'media_player.nele_nele_alexa'], notify: 'notify.kinderzimmer_durchsagen' },
      { name: 'Leonie', icon: 'star', media: ['media_player.leonie_leonie_alexa'], notify: 'notify.badezimmer_durchsagen' },
      { name: 'Lisa', icon: 'sparkle', media: ['media_player.patricks_echo_dot'], notify: 'notify.patricks_echo_dot_durchsagen' },
    ],
    phrases: ['Essen ist fertig!', 'Bitte Zähne putzen.', 'Ab ins Bett, gute Nacht!', 'Wir fahren gleich los.'],
  },
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
    camera: 'camera.p2s_22e8bj610701482_kamera', light: 'light.p2s_22e8bj610701482_druckraumbeleuchtung', power: 'switch.wintergarten_3d_drucker_steckdose_1',
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
  // Wandtablet (Fully Kiosk über die Home-Assistant-Integration): Helligkeit und die Automation „Helligkeit nach Tageszeit“
  tablet: { name: 'Wandtablet', brightness: 'number.tab_a9_von_patrick_bildschirmhelligkeit', auto: 'automation.wandtablet_helligkeit_nach_tageszeit', battery: 'sensor.tab_a9_von_patrick_batterie', plugged: 'binary_sensor.tab_a9_von_patrick_eingesteckt' },
  rooms: [
    { id: 'wohnzimmer', name: 'Wohnzimmer', icon: 'sofa', temp: 'sensor.0x00158d008b860ecb_temperature', hum: 'sensor.0x00158d008b860ecb_humidity', climate: 'climate.wohnzimmer_esstisch', climate_more: ['climate.wohnzimmer_hinter_sofa', 'climate.wohnzimmer_wintergarten'], heat: { status: 'sensor.wohnzimmer_heizung_status', switch: 'switch.wohnzimmer_heizung_regelung_aktiv' }, window: ['binary_sensor.fenster_wohnzimmer'], lights: ['light.wohnzimmer_sofa', 'light.sofa_indirekt', 'light.bilderleiste', 'light.flur_vorne_1'], media: ['media_player.wohnzimmer_google_tv', ['media_player.wohnzimmer', 'media_player.wohnzimmer_wohnzimmer']] },
    { id: 'kueche', name: 'Küche', icon: 'cook', temp: 'sensor.kuche_temperatur_temperature', hum: 'sensor.kuche_temperatur_humidity', window: ['binary_sensor.balkontur_contact'], lights: ['light.kuche_kochfeld', 'light.lsc_smart_led_strip_rgbcctic_5m'], media: [['media_player.jenny_patrick', 'media_player.kuche_jenny_patrick']] },
    { id: 'schlafzimmer', name: 'Schlafzimmer', icon: 'bed', temp: 'sensor.schlafzimmer_temperatur_temperature', hum: 'sensor.schlafzimmer_temperatur_humidity', climate: 'climate.schlafzimmer_bt', window: ['binary_sensor.fenster_schlafzimmer'], lights: ['light.bett_patrick', 'light.schlafzimmer_patrick_nachtlicht'], media: ['media_player.fernseher_im_schlafzimmer', 'media_player.fernseher_im_schlafzimmer_2'] },
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

