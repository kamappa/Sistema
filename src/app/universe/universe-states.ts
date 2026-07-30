/* UNIVERSO — máquina de estados de apresentação.
 * Missão 26 · Fase 6C, terceira passagem (VIDA).
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A EXPERIÊNCIA TEM UM ESTADO, E ELE TEM NOME.                        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * A passagem anterior governava a cena com três coisas soltas: `cam`, `sel` e
 * `pulse`. Funcionava, e ia deixar de funcionar à segunda condição nova — com
 * hover, foco, evento de progresso e regresso, três booleanos independentes dão
 * 2³ combinações das quais metade não faz sentido nenhum (estar em hover num
 * domínio enquanto se viaja para o Núcleo, por exemplo) e ninguém as proíbe.
 *
 * Aqui há um estado de cada vez, com nome, e as transições estão declaradas.
 * O que não está declarado não acontece.
 *
 * PORQUÊ ISTO IMPORTA PARA ALÉM DA ARRUMAÇÃO: a lei do projeto diz que nenhuma
 * animação é decorativa — que movimento comunica estado. Se o estado não
 * existir como coisa nomeada, o movimento não pode comunicá-lo; comunica o que
 * calhar da combinação de flags que estiver ativa.
 */

export type UniverseState =
  | 'OVERVIEW'        // repouso. O céu vive; nada pede atenção.
  | 'DOMAIN_HOVER'    // um domínio desperta sob o cursor, sem compromisso
  | 'DOMAIN_FOCUS'    // a câmara viajou até ao domínio
  | 'CORE_APPROACH'   // a viajar para o Núcleo
  | 'CORE_INSIDE'     // chegada
  | 'PROGRESS_EVENT'  // evidência real a atravessar o campo
  | 'RETURNING';      // a recuar; existe para o regresso não ser um corte

/** Escala de câmara implicada por cada estado. Um estado não é uma vista — mas
 *  cada estado sabe de que distância se vê. */
export type Scale = 'system' | 'domain' | 'core';

export interface UniverseCtx {
  state: UniverseState;
  /** Domínio em causa. `null` em OVERVIEW. */
  domain: string | null;
  /** Evento de progresso a decorrer, se houver. Sobrepõe-se sem trocar de
   *  escala: a evidência chega onde quer que o Operador esteja. */
  event: { domain: string; color: string; kind: string } | null;
}

/* ── TRANSIÇÕES ────────────────────────────────────────────────────────
 * Chave = estado atual; valor = para onde pode ir. Uma tabela e não uma
 * cascata de `if`, porque uma tabela pode ser LIDA — e um dia alguém vai
 * perguntar "daqui consigo ir para onde?" e a resposta tem de estar num sítio.
 */
const ALLOWED: Record<UniverseState, UniverseState[]> = {
  OVERVIEW:       ['DOMAIN_HOVER', 'DOMAIN_FOCUS', 'CORE_APPROACH', 'PROGRESS_EVENT'],
  DOMAIN_HOVER:   ['OVERVIEW', 'DOMAIN_HOVER', 'DOMAIN_FOCUS', 'CORE_APPROACH', 'PROGRESS_EVENT'],
  DOMAIN_FOCUS:   ['CORE_APPROACH', 'DOMAIN_FOCUS', 'RETURNING', 'PROGRESS_EVENT'],
  CORE_APPROACH:  ['CORE_INSIDE', 'RETURNING', 'PROGRESS_EVENT'],
  CORE_INSIDE:    ['RETURNING', 'CORE_APPROACH', 'PROGRESS_EVENT'],
  // Um evento de progresso devolve ao sítio de onde veio. Quem guarda esse
  // sítio é o `prev` do reducer, não este mapa — aqui só se diz que é legal.
  PROGRESS_EVENT: ['OVERVIEW', 'DOMAIN_HOVER', 'DOMAIN_FOCUS', 'CORE_INSIDE', 'CORE_APPROACH'],
  RETURNING:      ['OVERVIEW', 'DOMAIN_FOCUS', 'DOMAIN_HOVER', 'PROGRESS_EVENT'],
};

export function canGo(from: UniverseState, to: UniverseState): boolean {
  return ALLOWED[from].includes(to);
}

export function scaleOf(s: UniverseState, prev: UniverseState = 'OVERVIEW'): Scale {
  switch (s) {
    case 'DOMAIN_FOCUS': return 'domain';
    case 'CORE_APPROACH':
    case 'CORE_INSIDE': return 'core';
    // Um evento não muda a escala: a evidência chega ao sítio onde o Operador
    // está. Arrastá-lo para a vista geral para lhe mostrar a estrela seria o
    // Sistema a decidir por ele onde deve estar a olhar.
    case 'PROGRESS_EVENT': return scaleOf(prev);
    default: return 'system';
  }
}

/** O domínio "aceso" — o que a cena deve destacar. Separado de `ctx.domain`
 *  porque em PROGRESS_EVENT quem manda é o domínio do evento, não o da
 *  navegação: se estou a olhar para Saber e fecho uma missão de Corpo, quem
 *  acende é Corpo. */
export function litDomain(ctx: UniverseCtx): string | null {
  if (ctx.state === 'PROGRESS_EVENT' && ctx.event) return ctx.event.domain;
  return ctx.domain;
}

/** Verdadeiro quando o estado é de repouso — é o único em que o ambiente pode
 *  ser a coisa mais viva no ecrã. */
export const isIdle = (s: UniverseState) => s === 'OVERVIEW';
