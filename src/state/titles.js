import { TITLES_REAL } from './config.js';

// Títulos Reais · lógica de evidência — portada de hud.js:34-36 (S explícito).
// reqMet: requisito cumprido (manual via S.titleEv, ou automático = outro título
// desbloqueado). titleProg: progresso. isTitleUnlocked: todos os reqs cumpridos.
export function reqMet(S, t, r) { if (r.auto) return isTitleUnlocked(S, r.auto); return !!(S.titleEv[t.id] && S.titleEv[t.id][r.id]); }
export function titleProg(S, t) { const met = t.reqs.filter((r) => reqMet(S, t, r)).length; return { met, tot: t.reqs.length, pct: Math.round(met / t.reqs.length * 100) }; }
export function isTitleUnlocked(S, id) { const t = TITLES_REAL.find((x) => x.id === id); return !!t && t.reqs.every((r) => reqMet(S, t, r)); }
