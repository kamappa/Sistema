import { SEASON_ARCS } from './config.js';
import { today } from './dates.js';

// World Engine — o subconjunto que o motor de XP precisa (multiplicadores).
// Portado linha a linha de legacy/js/world.js:6-27. O resto (sinais vitais,
// recovery, sussurros, o painel) migra com o painel do World Engine.
export function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
export const seededPct = (s) => hashStr(s) % 100;

export function seasonArcNow() { const m = new Date().getMonth() + 1; return SEASON_ARCS.find((a) => a.months.includes(m)); }
export function isoWeekKey() { const d = new Date(); const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()); t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7)); const w1 = new Date(t.getFullYear(), 0, 4); const wk = 1 + Math.round(((t - w1) / 864e5 - 3 + ((w1.getDay() + 6) % 7)) / 7); return t.getFullYear() + 'W' + wk; }
export function doubleXPActive() { const dw = new Date().getDay(); return (dw === 0 || dw === 6) && seededPct('dxp' + isoWeekKey()) < 20; }
export const rainyActive = (S) => S.weather && S.weather.d === today() && S.weather.rain >= 8;

// xpMult(S, attr) — multiplicador de XP: bónus do arco sazonal ativo, Double XP
// de fim de semana, chuva a favor do Saber (world.js:23-27, S passado explícito).
export function xpMult(S, attr) {
  let m = 1; const a = seasonArcNow();
  if (S.worldArc && S.worldArc.status === 'active' && S.worldArc.id === a.id && a.bonus[attr]) m *= a.bonus[attr];
  if (doubleXPActive()) m *= 2;
  if (rainyActive(S) && attr === 'saber') m *= 1.15;
  return m;
}
