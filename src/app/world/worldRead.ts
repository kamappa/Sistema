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

/** Quanto tempo depois de ter sido visto um evento ainda conta como o MESMO
 *  episódio, em minutos.
 *
 *  15 = três vezes a cadência de resolução do `useWorld`. É folga deliberada:
 *  com um separador em segundo plano, um intervalo pode falhar uma ou duas
 *  voltas, e um evento contínuo não pode passar a "novo" só porque ninguém
 *  esteve a olhar. */
const CONTINUIDADE_MIN = 15;
import type { ActiveWorldEvent, WorldContext, WorldEventDef, WorldState } from './worldModel';

/** Aceita o contexto completo ou só o estado — a segunda forma existe porque a
 *  maior parte das regras não precisa de mais, e obrigar toda a gente a
 *  construir um objeto para chamar isto seria atrito sem benefício. */
export function readWorld(
  entrada: WorldContext | Record<string, any> | null,
  now: Date = new Date(),
): WorldState {
  return resolveWorld(WORLD_EVENTS, entrada, now);
}

/**
 * O resolvedor, com o catálogo como argumento.
 *
 * ── PORQUE É QUE ISTO É PÚBLICO ──
 * O `durationMin` está implementado e **nenhum evento do catálogo o usa** — todos
 * declaram `0`. Um caminho de código sem utilizador é um caminho por testar, e
 * um caminho por testar num motor de regras é onde o primeiro defeito vai
 * nascer.
 *
 * A alternativa era dar uma duração a um evento só para o exercitar, o que seria
 * mudar o produto para servir o teste. Esta função deixa o comportamento ser
 * verificado com um catálogo próprio, sem tocar no catálogo real.
 */
export function resolveWorld(
  eventos: readonly WorldEventDef[],
  entrada: WorldContext | Record<string, any> | null,
  now: Date = new Date(),
): WorldState {
  const ctx: WorldContext = !entrada
    ? { S: {} }
    : ('S' in entrada && typeof (entrada as WorldContext).S === 'object')
      ? (entrada as WorldContext)
      : { S: entrada as Record<string, any> };

  const ativos: ActiveWorldEvent[] = [];
  const rejected: { id: string; reason: string }[] = [];
  const cooldownIgnorado: string[] = [];
  const aSustentar: string[] = [];

  for (const def of eventos) {
    let prova = null;
    try {
      prova = def.trigger(ctx, now);
    } catch (e) {
      /* Uma regra que rebenta não pode derrubar o mundo inteiro — é a mesma
         disciplina do `Bus.emit`, onde um listener que falha não leva o
         emissor. Mas também não desaparece em silêncio: fica na lista, com a
         razão, porque uma regra avariada é informação. */
      rejected.push({ id: def.id, reason: 'a regra rebentou: ' + ((e as Error)?.message ?? String(e)) });
      continue;
    }
    if (!prova) {
      /* DURAÇÃO. A regra deixou de ser verdade — mas se o evento declarou uma
         janela e entrou dentro dela, fica de pé. Reapresenta a prova COM QUE
         ENTROU, e não uma nova: um facto que continua no ecrã tem de continuar
         a dizer de onde veio. */
      const antes = def.durationMin ? ctx.memory?.[def.id] : undefined;
      if (antes && antes.source && antes.fact && antes.date) {
        const min = (now.getTime() - Date.parse(antes.at)) / 60000;
        if (Number.isFinite(min) && min < def.durationMin!) {
          aSustentar.push(def.id);
          ativos.push({ def, evidence: { source: antes.source, fact: antes.fact, date: antes.date } });
          continue;
        }
      }
      rejected.push({ id: def.id, reason: 'sem prova neste instante' });
      continue;
    }
    /* A prova tem de ter as três partes. Uma prova incompleta é pior do que
       nenhuma: dá autoridade a um facto que não se consegue verificar. */
    if (!prova.source || !prova.fact || !prova.date) {
      rejected.push({ id: def.id, reason: 'prova incompleta — falta origem, facto ou data' });
      continue;
    }
    /* COOLDOWN. Um evento com prova pode mesmo assim não entrar, se já entrou há
       pouco. É a única razão pela qual algo com prova é recusado — e por isso a
       razão diz há quanto tempo, para não se confundir com falta de prova. */
    if (def.cooldownH) {
      const ultima = ctx.seen?.[def.id];
      if (!ultima) {
        cooldownIgnorado.push(def.id);
      } else {
        const min = (now.getTime() - Date.parse(ultima)) / 60000;
        /* CONTINUAR não é REPETIR. Um evento visto há menos de
           `CONTINUIDADE_MIN` é o mesmo episódio a decorrer — passa sem sequer
           consultar o cooldown. Sem esta linha, um estado verdadeiro o dia
           inteiro aparecia cinco minutos e escondia-se vinte horas. */
        if (Number.isFinite(min) && min >= CONTINUIDADE_MIN) {
          const horas = min / 60;
          if (horas < def.cooldownH) {
            rejected.push({ id: def.id, reason: `tem prova, mas saiu há ${horas.toFixed(1)} h e só pode voltar ao fim de ${def.cooldownH} h` });
            continue;
          }
        }
      }
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
    cooldownIgnorado,
    aSustentar,
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
