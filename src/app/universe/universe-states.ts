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
  | 'RANK_EVENT'      // o sistema inteiro mudou de escala
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
  OVERVIEW:       ['DOMAIN_HOVER', 'DOMAIN_FOCUS', 'CORE_APPROACH', 'PROGRESS_EVENT', 'RANK_EVENT'],
  DOMAIN_HOVER:   ['OVERVIEW', 'DOMAIN_HOVER', 'DOMAIN_FOCUS', 'CORE_APPROACH', 'PROGRESS_EVENT', 'RANK_EVENT'],
  DOMAIN_FOCUS:   ['CORE_APPROACH', 'DOMAIN_FOCUS', 'RETURNING', 'PROGRESS_EVENT', 'RANK_EVENT'],
  CORE_APPROACH:  ['CORE_INSIDE', 'RETURNING', 'PROGRESS_EVENT', 'RANK_EVENT'],
  CORE_INSIDE:    ['RETURNING', 'CORE_APPROACH', 'PROGRESS_EVENT', 'RANK_EVENT'],
  // Um evento de progresso devolve ao sítio de onde veio. Quem guarda esse
  // sítio é o `prev` do reducer, não este mapa — aqui só se diz que é legal.
  PROGRESS_EVENT: ['OVERVIEW', 'DOMAIN_HOVER', 'DOMAIN_FOCUS', 'CORE_INSIDE', 'CORE_APPROACH', 'RANK_EVENT'],
  // ── O RANK INTERROMPE TUDO E NÃO DEVOLVE A NADA ──
  // É a única transição do sistema que ignora onde o Operador estava, e é de
  // propósito: mudar de rank é o mundo inteiro mudar de escala, não uma coisa
  // que acontece dentro de um domínio. Sai-se sempre para a vista geral,
  // porque é de lá que se vê que ele ficou maior.
  RANK_EVENT:     ['OVERVIEW'],
  RETURNING:      ['OVERVIEW', 'DOMAIN_FOCUS', 'DOMAIN_HOVER', 'PROGRESS_EVENT', 'RANK_EVENT'],
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
    // O rank é a exceção, e a razão é a mesma pela outra ponta: aqui o que
    // mudou NÃO cabe no enquadramento onde ele está. A câmara recua para
    // mostrar o sistema inteiro — a mesma lógica do NASA Eyes, que se afasta
    // sozinho quando a trajetória deixa de caber.
    case 'RANK_EVENT': return 'system';
    default: return 'system';
  }
}

/** O domínio "aceso" — o que a cena deve destacar. Separado de `ctx.domain`
 *  porque em PROGRESS_EVENT quem manda é o domínio do evento, não o da
 *  navegação: se estou a olhar para Saber e fecho uma missão de Corpo, quem
 *  acende é Corpo. */
export function litDomain(ctx: UniverseCtx): string | null {
  if (ctx.state === 'PROGRESS_EVENT' && ctx.event) return ctx.event.domain;
  // Num evento de rank nenhum domínio se acende: o que mudou não foi de
  // ninguém em particular, foi de todos.
  if (ctx.state === 'RANK_EVENT') return null;
  return ctx.domain;
}

/** Verdadeiro quando o estado é de repouso — é o único em que o ambiente pode
 *  ser a coisa mais viva no ecrã. */
export const isIdle = (s: UniverseState) => s === 'OVERVIEW';
