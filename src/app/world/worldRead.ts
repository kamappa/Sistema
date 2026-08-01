/* WORLD ENGINE II — o resolvedor.
 * Missão 27 · Fase 1.
 *
 * Uma função, um resultado. Recebe o estado e o instante; devolve o que está a
 * acontecer no mundo, por que ordem, e com que prova.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O QUE ESTA FASE FAZ E NÃO FAZ                                       ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * FAZ: resolver regras por prioridade e camada, exigir prova, e registar o que
 * foi recusado e porquê.
 *
 * NÃO FAZ: desenhar. Nada nesta fase muda um pixel — de propósito. O motor tem
 * de estar certo antes de ter cara, e um motor que nasce já ligado ao ambiente
 * nunca mais se consegue testar sozinho.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A LISTA DE RECUSADOS                                                ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * `rejected` não é depuração — é a funcionalidade que torna o mundo auditável.
 * "Porque é que hoje não houve Santuário de Chuva?" passa a ter resposta:
 * *"a regra correu e devolveu nada: `S.weather` é de ontem"*. Sem isto, um
 * mundo que não reage é indistinguível de um mundo avariado.
 */

import { WORLD_EVENTS } from './worldEvents';
import { LAYER_ORDER, PRIORITY_RANK } from './worldModel';
import type { ActiveWorldEvent, WorldState } from './worldModel';

export function readWorld(S: Record<string, any> | null, now: Date = new Date()): WorldState {
  const ativos: ActiveWorldEvent[] = [];
  const rejected: { id: string; reason: string }[] = [];

  for (const def of WORLD_EVENTS) {
    let prova = null;
    try {
      prova = def.trigger(S ?? {}, now);
    } catch (e) {
      /* Uma regra que rebenta não pode derrubar o mundo inteiro — é a mesma
         disciplina do `Bus.emit`, onde um listener que falha não leva o
         emissor. Mas também não desaparece em silêncio: fica na lista, com a
         razão, porque uma regra avariada é informação. */
      rejected.push({ id: def.id, reason: 'a regra rebentou: ' + ((e as Error)?.message ?? String(e)) });
      continue;
    }
    if (!prova) { rejected.push({ id: def.id, reason: 'sem prova neste instante' }); continue; }
    /* A prova tem de ter as três partes. Uma prova incompleta é pior do que
       nenhuma: dá autoridade a um facto que não se consegue verificar. */
    if (!prova.source || !prova.fact || !prova.date) {
      rejected.push({ id: def.id, reason: 'prova incompleta — falta origem, facto ou data' });
      continue;
    }
    ativos.push({ def, evidence: prova });
  }

  /* Prioridade primeiro; com a mesma prioridade, a camada mais profunda ganha.
     A ordem das camadas é a ordem de composição: um evento especial sabe mais
     sobre o momento do que o relógio sabe. */
  ativos.sort((a, b) => {
    const p = PRIORITY_RANK[b.def.priority] - PRIORITY_RANK[a.def.priority];
    if (p !== 0) return p;
    return LAYER_ORDER.indexOf(b.def.layer) - LAYER_ORDER.indexOf(a.def.layer);
  });

  return {
    at: now.toISOString(),
    events: ativos,
    dominant: ativos[0] ?? null,
    rejected,
  };
}

/**
 * A explicação por extenso, para quem perguntar ao Oráculo o que se passa.
 *
 * Existe porque a Constituição exige que o Oráculo **explique por que razão uma
 * ação foi proposta** — e um mundo que muda sem saber dizer porquê não é
 * explicável, é só bonito.
 */
export function explainWorld(w: WorldState): string[] {
  if (!w.events.length) return ['O mundo está em repouso. Nenhuma regra tem prova neste instante.'];
  return w.events.map((e) => `${e.def.name} — ${e.evidence.fact} (${e.evidence.source}, ${e.evidence.date})`);
}
