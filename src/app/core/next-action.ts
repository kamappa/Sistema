/* Próxima Ação — read model do Command Core.
 * Missão 26 · Fase 5.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ISTO É UMA LEITURA, NÃO UMA REGRA DE DOMÍNIO.                       ║
 * ║  Não decide prioridades novas, não escreve estado, não inventa       ║
 * ║  urgência. Lê o que já existe (missões, obrigatórios, arco) e diz    ║
 * ║  qual é a coisa que está à frente das outras — com a evidência que   ║
 * ║  a pôs lá.                                                           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * PORQUE EXISTE. O Núcleo tinha uma faixa vermelha de prazos, um cartão de
 * operador e um painel do mundo, e nenhum deles respondia à única pergunta que
 * um Command Core tem de responder: *o que faço agora*. A faixa de prazos era
 * a coisa mais brilhante do ecrã e não era acionável — anunciava um problema e
 * deixava o Operador a procurar onde o resolver.
 *
 * PRECEDÊNCIA (decisão de produto fechada pelo Daniel, 2026-07-29):
 *   1. missão urgente ou vencida
 *   2. missão em curso
 *   3. obrigatório de hoje ainda não concluído
 *   4. decisão pendente
 *   5. briefing, quando não há ação executável superior
 *   6. neutro: "Nada crítico agora"
 *
 * DESEMPATE dentro da mesma prioridade, por esta ordem:
 *   prazo mais próximo → já iniciada → mais antiga → id.
 * O último critério existe para o resultado ser DETERMINÍSTICO: sem ele, duas
 * missões criadas no mesmo dia trocariam de lugar entre renders, e o Sistema
 * passaria a apontar para sítios diferentes com o mesmo estado.
 *
 * O limiar de "urgente" (≤ 2 dias) NÃO é novo: é o mesmo que o
 * `DeadlineBanner` já usava desde a Missão 25 (hud.js:111-121). Esta leitura
 * herda-o em vez de inventar um seu — se um dia mudar, muda num sítio.
 */

import { daysUntil, today } from '../../state/dates.js';
import { seasonArcNow } from '../../state/world.js';

export type ActionKind =
  | 'overdue'   // passou do prazo
  | 'urgent'    // prazo a ≤ 2 dias
  | 'doing'     // trabalho já começado
  | 'oblig'     // pilar do dia por fechar
  | 'decision'  // o mundo espera resposta
  | 'briefing'  // não há ação executável; há matéria para ler
  | 'idle';     // nada crítico

/** O que a UI pode mandar executar. Nunca uma ação inventada: cada uma
 *  corresponde a uma ação que já existe no store. */
export type ActVerb = 'start' | 'complete' | 'habit' | 'arc';

export interface ActionAct {
  verb: ActVerb;
  label: string;
  /** id do objetivo ou do hábito. Ausente em `arc`. */
  id?: string;
}

export interface NextActionReading {
  kind: ActionKind;
  /** Micro-label que diz PORQUE esta está à frente. Não é um título. */
  reason: string;
  title: string;
  /** A prova. Sem isto seria um sinal, e o Sistema mostra provas. */
  evidence: string;
  /** Leitura de prazo, quando existe. Já formatada em pt-PT. */
  when?: string;
  tone: 'alert' | 'active' | 'calm';
  /** Quantas outras coisas esperam atrás desta. 0 = é a única. */
  queue: number;
  act?: ActionAct;
  /** Domínio (para a cor do trilho). */
  area?: string;
}

interface Obj {
  id: string;
  title: string;
  area?: string;
  status: string;
  deadline?: string | null;
  created?: string;
}

interface Habit {
  id: string;
  name: string;
  attr?: string;
  lastDone?: string | null;
}

/** Mesmo limiar do DeadlineBanner. Herdado, não inventado. */
const URGENT_DAYS = 2;

/** "hoje", "amanhã", "atrasado 2 dias" — a leitura que um humano usa. */
export function whenLabel(deadline: string): string {
  const d = daysUntil(deadline);
  if (d < 0) return `atrasado ${Math.abs(d)} ${Math.abs(d) === 1 ? 'dia' : 'dias'}`;
  if (d === 0) return 'hoje';
  if (d === 1) return 'amanhã';
  return `daqui a ${d} dias`;
}

/** Ordenação determinística dentro da mesma prioridade.
 *  prazo mais próximo → já iniciada → mais antiga → id. */
function rank(a: Obj, b: Obj): number {
  const da = a.deadline ? daysUntil(a.deadline) : Infinity;
  const db = b.deadline ? daysUntil(b.deadline) : Infinity;
  if (da !== db) return da - db;
  const sa = a.status === 'doing' ? 0 : 1;
  const sb = b.status === 'doing' ? 0 : 1;
  if (sa !== sb) return sa - sb;
  const ca = a.created ?? '';
  const cb = b.created ?? '';
  if (ca !== cb) return ca < cb ? -1 : 1;
  return a.id < b.id ? -1 : 1;
}

export function readNextAction(input: {
  S: Record<string, any> | null;
  report?: unknown;
  radar?: unknown[];
}): NextActionReading {
  const { S, report, radar } = input;

  if (!S) {
    return {
      kind: 'idle',
      reason: 'Sem sessão',
      title: 'O mundo ainda não começou',
      evidence: 'Entra para o Sistema ler o teu estado.',
      tone: 'calm',
      queue: 0,
    };
  }

  const hoje = today();
  const objs: Obj[] = (S.objectives ?? []).filter((o: Obj) => o.status !== 'done');

  // Tudo o que espera, para o contador da fila. Conta-se uma vez, no fim.
  const oblig: Habit[] = (S.oblig ?? []).filter((h: Habit) => h.lastDone !== hoje);
  const decisionPending = arcPending(S);

  // ── 1 · vencida ou urgente ───────────────────────────────────────────
  const pressing = objs
    .filter((o) => o.deadline && daysUntil(o.deadline) <= URGENT_DAYS)
    .sort(rank);

  if (pressing.length) {
    const o = pressing[0];
    const late = daysUntil(o.deadline as string) < 0;
    return {
      kind: late ? 'overdue' : 'urgent',
      reason: late ? 'Passou do prazo' : 'Prazo a fechar',
      title: o.title,
      evidence: o.status === 'doing' ? 'já começada' : 'ainda por começar',
      when: whenLabel(o.deadline as string),
      tone: 'alert',
      queue: waiting(objs, o.id) + oblig.length + (decisionPending ? 1 : 0),
      act: verbFor(o),
      area: o.area,
    };
  }

  // ── 2 · em curso ─────────────────────────────────────────────────────
  const doing = objs.filter((o) => o.status === 'doing').sort(rank);
  if (doing.length) {
    const o = doing[0];
    return {
      kind: 'doing',
      reason: 'Já começaste',
      title: o.title,
      evidence: o.created ? `aberta há ${Math.max(0, -daysUntil(o.created))} dias` : 'em curso',
      when: o.deadline ? whenLabel(o.deadline) : undefined,
      tone: 'active',
      queue: waiting(objs, o.id) + oblig.length + (decisionPending ? 1 : 0),
      act: verbFor(o),
      area: o.area,
    };
  }

  // ── 3 · obrigatório de hoje ──────────────────────────────────────────
  if (oblig.length) {
    const h = oblig[0];
    return {
      kind: 'oblig',
      reason: 'Pilar por fechar',
      title: h.name,
      // "pilar" e não "obrigatório": é a palavra que o resto do Sistema usa
      // (o toast diz "Pilar confirmado"). Duas palavras para a mesma coisa
      // obrigam a traduzir de cabeça entre a ação e a fila que está por baixo.
      evidence:
        oblig.length === 1
          ? 'é o último pilar de hoje'
          : `${oblig.length} pilares por fechar hoje`,
      when: 'hoje',
      tone: 'active',
      queue: objs.length + (oblig.length - 1) + (decisionPending ? 1 : 0),
      act: { verb: 'habit', label: 'Marcar feito', id: h.id },
      area: h.attr,
    };
  }

  // ── 4 · decisão pendente ─────────────────────────────────────────────
  // `arcPending` já garantiu que existe arco; o TypeScript não sabe disso
  // porque `seasonArcNow` devolve `undefined` quando o mês não cai em nenhum.
  // A guarda repete-se em vez de se calar com `!` — se um dia a tabela de
  // arcos tiver um buraco, isto não rebenta, apenas não propõe nada.
  const arc = decisionPending ? seasonArcNow() : undefined;
  if (arc) {
    return {
      kind: 'decision',
      reason: 'O mundo espera resposta',
      title: `${arc.name} disponível`,
      evidence: arc.desc,
      tone: 'active',
      queue: objs.length,
      act: { verb: 'arc', label: 'Aceitar arco' },
    };
  }

  // ── 5 · briefing ─────────────────────────────────────────────────────
  if (report) {
    return {
      kind: 'briefing',
      reason: 'Há matéria para ler',
      title: 'Relatório da semana disponível',
      evidence: 'escrito no domingo à noite',
      tone: 'calm',
      queue: objs.length,
    };
  }
  if (Array.isArray(radar) && radar.length) {
    return {
      kind: 'briefing',
      reason: 'Há matéria para ler',
      title: `${radar.length} ${radar.length === 1 ? 'sinal' : 'sinais'} no Radar`,
      evidence: 'últimos 7 dias',
      tone: 'calm',
      queue: objs.length,
    };
  }

  // ── 6 · neutro ───────────────────────────────────────────────────────
  // Não se inventa uma missão para o ecrã ter o que mostrar. Se não há nada
  // crítico, dizer isso É a informação — e é uma boa notícia.
  return {
    kind: 'idle',
    reason: 'Nada crítico agora',
    title: objs.length
      ? 'Sem prazos a apertar'
      : 'O quadro está limpo',
    evidence: objs.length
      ? `${objs.length} ${objs.length === 1 ? 'missão aberta' : 'missões abertas'}, nenhuma com prazo próximo`
      : 'nenhuma missão aberta, todos os pilares fechados',
    tone: 'calm',
    queue: objs.length,
  };
}

/** Quantas missões abertas ficam atrás desta. */
function waiting(objs: Obj[], selfId: string): number {
  return objs.filter((o) => o.id !== selfId).length;
}

/** `cycleObj` avança pend → doing → done. O verbo é o passo seguinte real —
 *  nunca um botão que promete uma coisa e faz outra. */
function verbFor(o: Obj): ActionAct {
  return o.status === 'doing'
    ? { verb: 'complete', label: 'Concluir', id: o.id }
    : { verb: 'start', label: 'Começar', id: o.id };
}

/** O arco da estação está por decidir? Mesma condição do World.jsx — se as duas
 *  divergirem, uma delas mente. */
export function arcPending(S: Record<string, any>): boolean {
  try {
    const a = seasonArcNow();
    if (!a) return false;
    const wa = S.worldArc;
    return !wa || wa.id !== a.id || (wa.status === 'later' && wa.snooze !== today());
  } catch {
    return false;
  }
}
