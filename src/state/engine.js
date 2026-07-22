import { need, AM } from './config.js';
import { today } from './dates.js';

// Motor de XP — o núcleo auditado ("o sistema nunca mente"), portado linha a
// linha de legacy/js/engine.js:27-44. A única mudança de forma: S é passado
// explícito (era global) e a camada de FX (toast/celebrate/barBurst na subida
// de nível) fica DEFERIDA para quando o fx.js migrar — a matemática do XP, dos
// níveis, do totalXP e do histórico é idêntica. O Bus continua a emitir
// 'xp:gain' para o palco reagir ao XP real (dívida da Fase 2 paga).

export function addXp(S, attr, amt, silent) {
  if (window.Bus) window.Bus.emit('xp:gain', { attr, amt }); // o mundo reage (M12·2B)
  const a = S.attrs[attr]; a.xp += amt; const ups = [];
  if (amt >= 0) { while (a.xp >= need(a.level)) { a.xp -= need(a.level); a.level++; ups.push(attr); } }
  else { while (a.xp < 0) { if (a.level <= 1) { a.xp = 0; break; } a.level--; a.xp += need(a.level); } }
  S.totalXP = Math.max(0, S.totalXP + amt);
  // história (agrega por dia)
  const t = today(); const last = S.history[S.history.length - 1];
  if (last && last.d === t) last.v += amt; else S.history.push({ d: t, v: amt });
  // FX (Fase 17) — restaura legacy/js/engine.js:36-37: subida de nível toasta e
  // celebra; XP positivo dá mini-burst na ponta da barra. Seam único: cobre
  // TODOS os level-ups (hábitos, missões, treino, sono, recall, sussurro…),
  // exatamente como o Vanilla. Guardado por window.* (o palco/fx podem não
  // existir com reduced-motion ou fora do browser).
  if (!silent && ups.length && window.toast) {
    ups.forEach((u) => window.toast('Nível aumentado', AM[u].name + ' subiu para nível ' + S.attrs[u].level, AM[u].color));
    if (window.celebrate) window.celebrate(AM[ups[0]].color);
  }
  if (amt > 0 && !silent && window.barBurst) window.barBurst(attr);
  return ups;
}

export function plog(S, text, gain) { S.log.unshift({ text, gain, d: today() }); S.log = S.log.slice(0, 14); }
export function unlog(S, text, d) { const i = S.log.findIndex((e) => e.text === text && (!d || e.d === d)); if (i > -1) S.log.splice(i, 1); }
