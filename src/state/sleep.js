import { fmt, today } from './dates.js';

// Sono · helpers puros — portados de legacy/js/sono.js (S explícito).
// calcHours: horas de sono (0.1h) de bed→wake, cruzando a meia-noite.
export function calcHours(bed, wake) {
  const [bh, bm] = bed.split(':').map(Number), [wh, wm] = wake.split(':').map(Number);
  let m = (wh * 60 + wm) - (bh * 60 + bm); if (m <= 0) m += 1440;
  return Math.round(m / 6) / 10;
}
// noites consecutivas no alvo (7,5–9,5h) a partir de hoje.
export function sleepStreak(S) {
  let c = 0; const d = new Date();
  for (; ;) { const L = S.sleep.logs.find((l) => l.d === fmt(d)); if (L && L.h >= 7.5 && L.h <= 9.5) { c++; d.setDate(d.getDate() - 1); } else break; }
  return c;
}
