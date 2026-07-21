import { SEASON_ARCS, WHISPERS, WH_SEASON } from './config.js';
import { fmt, today, yday, diffDays } from './dates.js';

// World Engine — o subconjunto que o motor de XP precisa (multiplicadores).
// Portado linha a linha de legacy/js/world.js:6-27. O resto (sinais vitais,
// recovery, sussurros, o painel) migra com o painel do World Engine.
export function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
export const seededPct = (s) => hashStr(s) % 100;

export function seasonArcNow() { const m = new Date().getMonth() + 1; return SEASON_ARCS.find((a) => a.months.includes(m)); }
// limites do arco sazonal atual (world.js:10-17).
export function seasonBounds(a) {
  const now = new Date(); let sy = now.getFullYear();
  if (a.id === 'winter' && (now.getMonth() + 1) <= 2) sy--;
  const sm = a.months[0], em = a.months[a.months.length - 1];
  const ey = (em < sm) ? sy + 1 : sy;
  return { start: sy + '-' + String(sm).padStart(2, '0') + '-01', end: ey + '-' + String(em).padStart(2, '0') + '-' + String(new Date(ey, em, 0).getDate()).padStart(2, '0') };
}
export function isoWeekKey() { const d = new Date(); const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()); t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7)); const w1 = new Date(t.getFullYear(), 0, 4); const wk = 1 + Math.round(((t - w1) / 864e5 - 3 + ((w1.getDay() + 6) % 7)) / 7); return t.getFullYear() + 'W' + wk; }
export function doubleXPActive() { const dw = new Date().getDay(); return (dw === 0 || dw === 6) && seededPct('dxp' + isoWeekKey()) < 20; }
export const rainyActive = (S) => S.weather && S.weather.d === today() && S.weather.rain >= 8;
export const heatActive = (S) => S.weather && S.weather.d === today() && S.weather.tmax >= 32;

// sussurro do dia (world.js:40) — determinístico por dia, do pool base + sazonal.
export const whisperToday = (S) => { const pool = WHISPERS.concat(WH_SEASON[seasonArcNow().id] || []); return pool[hashStr('wh' + today()) % pool.length]; };

// sinais vitais (world.js:48-60) — estimados dos dados reais.
export function vitals(S) {
  const last7 = S.history.filter((h) => diffDays(h.d, today()) < 7).reduce((s, h) => s + Math.max(0, h.v), 0);
  const momentum = Math.max(0, Math.min(100, Math.round(last7 / (7 * 45) * 100)));
  const sono = S.oblig.find((h) => h.id === 'o_sono');
  const sonoOk = sono && (sono.lastDone === today() || sono.lastDone === yday());
  const maxStk = Math.max(0, ...S.oblig.map((h) => h.streak), ...S.extras.map((h) => h.streak));
  let burn = 0;
  if (maxStk >= 14) burn += 25; if (maxStk >= 25) burn += 15;
  if (!sonoOk) burn += 30; if ((sono ? sono.streak : 0) === 0) burn += 10;
  if (last7 > 7 * 60) burn += 20;
  burn = Math.min(100, burn);
  return { momentum, burn, recovery: Math.max(0, 100 - burn) };
}

// xpMult(S, attr) — multiplicador de XP: bónus do arco sazonal ativo, Double XP
// de fim de semana, chuva a favor do Saber (world.js:23-27, S passado explícito).
export function xpMult(S, attr) {
  let m = 1; const a = seasonArcNow();
  if (S.worldArc && S.worldArc.status === 'active' && S.worldArc.id === a.id && a.bonus[attr]) m *= a.bonus[attr];
  if (doubleXPActive()) m *= 2;
  if (rainyActive(S) && attr === 'saber') m *= 1.15;
  return m;
}
