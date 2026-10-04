import { ATTRS, OBLIG, EXTRAS } from './config.js';
import { today } from './dates.js';

// fresh() — estado inicial de um Sistema novo. Portado linha a linha de
// legacy/js/engine.js:10-17 (contrato da Missão 25: lógica intocada).
export function fresh() {
  const attrs = {};
  ATTRS.forEach((a) => { attrs[a.id] = { level: 1, xp: 0 }; });
  return {
    attrs,
    oblig: OBLIG.map((h) => ({ ...h, streak: 0, lastDone: null, lastGain: 0 })),
    extras: EXTRAS.map((h) => ({ ...h, streak: 0, lastDone: null, lastGain: 0 })),
    history: [{ d: today(), v: 0 }], totalXP: 0, log: [], lastDayCheck: today(), seenAch: [], debuffs: {}, events: [], notifOn: false, notified: {},
    worldArc: null, whisper: {}, titleEv: {}, titleUnlocked: {}, recovery: null, weather: null,
    training: { prog: { push: 0, pull: 0, legs: 0, core: 0, kegel: 0 }, sessions: [] }, sleep: { bedT: '23:30', wakeT: '07:30', logs: [] }, objectives: [], shadows: [], oracle: { reports: [] }, radarAccepted: {}, recall: {}, recallToday: null, customQ: [], studyStreak: { count: 0, lastDay: null }, oracleChat: { d: null, count: 0 }, v: 3,
  };
}
