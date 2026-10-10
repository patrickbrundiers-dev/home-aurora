/* ───────────── Helfer ───────────── */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const NF = {}; // Zahlenformate je Nachkommastellen, einmal erzeugt (toLocaleString legt bei jedem Aufruf ein neues an)
const de = (v, d = 1) => (v == null || isNaN(v)) ? '–' : (NF[d] || (NF[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(Number(v));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const tempHue = t => 215 - clamp((t - 14) / 14, 0, 1) * 190;
const tempCol = (t, l = 62) => `hsl(${tempHue(t)} 92% ${l}%)`;
const okv = v => v !== undefined && v !== null && v !== 'unavailable' && v !== 'unknown';
const dom = e => e.split('.')[0];
const HM = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' });
const hhmm = d => { if (!d) return '–'; const t = new Date(d); return isNaN(t) ? 'Invalid Date' : HM.format(t); };
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

