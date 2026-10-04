import { fmt, today, diffDays } from './dates.js';
import { TLINES, KLINE, PROG } from './config.js';

// Treino · helpers puros — portados de legacy/js/treino.js (S explícito).
export function consecTrained(S) { const set = new Set(S.training.sessions.map((s) => s.d)); let c = 0; const d = new Date(); while (set.has(fmt(d))) { c++; d.setDate(d.getDate() - 1); } return c; }
export function weekSessions(S) { return new Set(S.training.sessions.filter((s) => diffDays(s.d, today()) < 7).map((s) => s.d)).size; }
// dias distintos no passo atual com feel!=='d' (treino.js:8)
export function kegelDaysAtStep(S, idx) { return new Set(S.training.sessions.filter((s) => s.lines && s.lines.kegel && s.lines.kegel.step === idx && s.lines.kegel.feel !== 'd').map((s) => s.d)).size; }

// trAdvice (treino.js:53-61) — conselho derivado do histórico.
export function trAdvice(S) {
  const ss = S.training.sessions;
  if (!ss.length) return 'Primeira sessão: aquece 5 min (mobilidade + cardio leve). Técnica primeiro, ego depois. Ritmo alvo: 3 sessões/semana, dias alternados.';
  const consec = consecTrained(S);
  if (consec >= 4) return '⚠ ' + consec + ' dias seguidos. O corpo constrói-se no descanso — hoje é dia de pausa ou mobilidade leve. (Pavimento Pélvico é a exceção: esse é diário.)';
  for (const L of [...TLINES, KLINE]) {
    const rel = ss.filter((s) => s.lines[L.id]).slice(-2);
    if (rel.length === 2 && rel.every((s) => s.lines[L.id].feel === 'd')) return '💡 ' + L.n + ': duas sessões "difícil" seguidas — repete o passo atual até sair limpo, ou regride um passo. Não é derrota, é engenharia.';
  }
  return 'Ritmo alvo: 3 sessões/semana em dias alternados. Sobe de passo quando 3×alvo sair limpo e fácil.';
}
