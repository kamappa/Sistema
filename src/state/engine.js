import { need, AM, rankOf, overallLevel } from './config.js';
import { today } from './dates.js';

// Motor de XP — o núcleo auditado ("o sistema nunca mente"), portado linha a
// linha de legacy/js/engine.js:27-44. A única mudança de forma: S é passado
// explícito (era global) e a camada de FX (toast/celebrate/barBurst na subida
// de nível) fica DEFERIDA para quando o fx.js migrar — a matemática do XP, dos
// níveis, do totalXP e do histórico é idêntica. O Bus continua a emitir
// 'xp:gain' para o palco reagir ao XP real (dívida da Fase 2 paga).

export function addXp(S, attr, amt, silent) {
  if (window.Bus) window.Bus.emit('xp:gain', { attr, amt }); // o mundo reage (M12·2B)
  // M26·F6C — o rank ANTES da mutação. O rank global nunca teve anúncio: a
  // fila declarava `kind: 'rank'` e ninguém o emitia, por isso o Sistema sabia
  // que o Daniel tinha mudado de rank e não lho dizia. O facto já era derivável
  // do estado; o que faltava era alguém compará-lo.
  const rankAntes = rankOf(overallLevel(S)).l;
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
  // M26·F6A — a subida de nível passa para a FILA DE EVENTOS, não para o toast.
  //
  // Medido: concluir uma missão que faz subir um domínio produzia DOIS anúncios
  // ao mesmo tempo, em dois sistemas diferentes, sobrepostos no mesmo canto do
  // ecrã — o SYSTEM EVENT da missão por baixo e o toast do nível por cima, os
  // dois ilegíveis. Um só canal de anúncio, uma só fila.
  //
  // A chave de deduplicação é o facto: atributo + nível atingido. Se o mesmo
  // nível voltar a ser atingido depois de uma reversão, o XP total já mudou e a
  // chave também — ver a nota em systemEvents.ts.
  if (!silent && ups.length && window.sysEvent) {
    ups.forEach((u) =>
      window.sysEvent({
        dedupe: 'level:' + u + ':' + S.attrs[u].level + ':' + Math.round(S.totalXP),
        kind: 'levelup',
        title: 'Nível aumentado',
        subject: AM[u].name + ' subiu para nível ' + S.attrs[u].level,
        color: AM[u].color,
        readings: [{ label: AM[u].name, value: 'Nv ' + S.attrs[u].level }],
      })
    );
    if (window.celebrate) window.celebrate(AM[ups[0]].color);
  }

  // ── MUDANÇA DE RANK ──
  // Depois dos level-ups, e é por isso que fica aqui em baixo: a fila ordena
  // causa antes de consequência (`ORDER` em systemEvents), mas a ordem de
  // EMISSÃO também tem de fazer sentido para quem lê o código.
  //
  // A descida também se anuncia, e como AVISO. Um Sistema que celebra a subida
  // e cala a descida está a escolher o que conta — e a primeira lei é que ele
  // nunca mente.
  if (!silent && window.sysEvent) {
    const rankDepois = rankOf(overallLevel(S));
    if (rankDepois.l !== rankAntes) {
      const subiu = overallLevel(S) > 0 && amt > 0;
      window.sysEvent({
        dedupe: 'rank:' + rankAntes + '>' + rankDepois.l + ':' + Math.round(S.totalXP),
        kind: subiu ? 'rank' : 'warning',
        title: subiu ? 'Rank alterado' : 'Rank perdido',
        subject: rankAntes + ' → ' + rankDepois.l,
        color: rankDepois.color,
        readings: [
          { label: 'Rank', value: rankDepois.l },
          { label: 'Nível global', value: String(overallLevel(S)) },
        ],
        holdMs: 9000,
      });
    }
  }

  if (amt > 0 && !silent && window.barBurst) window.barBurst(attr);
  return ups;
}

/* M26·F6C — o registo passa a saber A QUE DOMÍNIO pertence.
 *
 * PORQUÊ, e o custo está declarado. O Universo consegue dizer "Saber tem 19
 * estrelas" e não conseguia dizer "isto é o que está a alimentar Saber agora",
 * porque o registo guardava texto, ganho e data e mais nada. Sem domínio, a
 * evidência existia e não era atribuível.
 *
 * O QUE ISTO NÃO RESOLVE, e é importante não fingir que resolve: o registo
 * guarda 14 entradas. Não dá — nem passará a dar — para saber que evidência fez
 * a sétima estrela de Saber, porque os níveis vêm de XP acumulado ao longo de
 * meses e o registo é uma janela curta. O que passa a dar é o que está a
 * alimentar o NÍVEL EM CURSO, que é a única parte ainda em formação e a única
 * sobre a qual há decisão a tomar.
 *
 * O campo é OPCIONAL e aditivo: as entradas antigas ficam sem `attr` para
 * sempre, e a leitura diz isso por extenso em vez de as esconder ou de lhes
 * inventar um dono. */
export function plog(S, text, gain, attr) {
  const e = { text, gain, d: today() };
  if (attr) e.attr = attr;
  S.log.unshift(e); S.log = S.log.slice(0, 14);
}
export function unlog(S, text, d) { const i = S.log.findIndex((e) => e.text === text && (!d || e.d === d)); if (i > -1) S.log.splice(i, 1); }
