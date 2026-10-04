/* ESCADA DE ASCENSÃO — read model.
 * Missão 26 · Fase 6D.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  NÃO INVENTA REQUISITOS.                                             ║
 * ║                                                                       ║
 * ║  O domínio tem UM critério de rank, e é aritmético: o nível global    ║
 * ║  (`overallLevel`) cai dentro de [min, max] de um degrau de `RANKS`.   ║
 * ║  Não há requisitos de evidência, não há benefícios por rank, não há   ║
 * ║  histórico de promoções guardado.                                     ║
 * ║                                                                       ║
 * ║  A instrução era explícita: quando o critério não existe, apresentar  ║
 * ║  "critério ainda não definido" e tratar como informação pendente.     ║
 * ║  É o que este ficheiro faz — em vez de encher a escada com regras     ║
 * ║  bonitas que ninguém escreveu.                                        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O QUE EXISTE MESMO, e portanto o que a escada mostra:
 *   · o degrau atual e onde estás dentro dele;
 *   · quantos níveis faltam para o degrau seguinte;
 *   · o título por nível que cada degrau atravessa (tabela `TITLES`);
 *   · quais dos seis domínios estão a puxar para cima e quais estão a travar.
 *
 * O último ponto é a única coisa aqui que se aproxima de um "requisito", e é
 * derivada: `overallLevel` é a soma dos níveis menos cinco, por isso o domínio
 * mais baixo é literalmente o que mais barato sobe.
 */

import { RANKS, TITLES, ATTRS, need, overallLevel, rankOf } from '../../state/config.js';

export interface Step {
  letter: string;
  color: string;
  min: number;
  max: number;
  /** 'passado' | 'atual' | 'futuro' */
  state: 'past' | 'current' | 'future';
  /** Títulos por nível que este degrau atravessa. Vem da tabela `TITLES`. */
  titles: string[];
  /** Quantos níveis faltam para lá chegar. 0 se já lá estás ou já passaste. */
  levelsAway: number;
}

export interface DomainPull {
  id: string;
  name: string;
  color: string;
  level: number;
  /** Fração do nível atual já feita, 0–1. */
  frac: number;
  /** XP que falta para o próximo nível deste domínio. */
  xpLeft: number;
}

export interface LadderRead {
  level: number;
  current: { letter: string; color: string; min: number; max: number };
  next: { letter: string; color: string; min: number } | null;
  /** 0–1 dentro do degrau atual. */
  progress: number;
  levelsToNext: number;
  steps: Step[];
  /** Domínios ordenados pelo que fica mais barato subir primeiro. */
  pull: DomainPull[];
  /** O que o domínio NÃO define. Aparece no ecrã, não fica escondido aqui. */
  undefined_: string[];
}

export function readLadder(S: Record<string, any> | null): LadderRead | null {
  if (!S) return null;

  const level = overallLevel(S);
  const cur = rankOf(level);
  const ci = RANKS.findIndex((r: any) => r.l === cur.l);
  const nxt = ci >= 0 && ci < RANKS.length - 1 ? RANKS[ci + 1] : null;

  const titlesIn = (min: number, max: number) =>
    (TITLES as [number, string][])
      .filter(([lv]) => lv >= min && lv <= max)
      .map(([, name]) => name);

  const steps: Step[] = RANKS.map((r: any, i: number) => ({
    letter: r.l,
    color: r.color,
    min: r.min,
    max: r.max,
    state: i < ci ? 'past' : i === ci ? 'current' : 'future',
    titles: titlesIn(r.min, r.max >= 9999 ? Math.max(r.min, level) + 12 : r.max),
    levelsAway: i <= ci ? 0 : Math.max(0, r.min - level),
  }));

  // O degrau S não tem teto (`max: 9999`). Medir progresso contra 9999 daria
  // sempre 0% e seria uma barra que nunca se mexe — pior do que não a ter.
  const span = cur.max >= 9999 ? 0 : cur.max - cur.min + 1;
  const progress = span > 0 ? Math.min(1, (level - cur.min + 1) / span) : 1;

  const pull: DomainPull[] = ATTRS.map((a: any) => {
    const s = S.attrs[a.id];
    const nd = need(s.level);
    return {
      id: a.id,
      name: a.name,
      color: a.color,
      level: s.level,
      frac: nd > 0 ? s.xp / nd : 0,
      xpLeft: Math.max(0, nd - s.xp),
    };
  }).sort((a: DomainPull, b: DomainPull) => a.xpLeft - b.xpLeft);

  return {
    level,
    current: { letter: cur.l, color: cur.color, min: cur.min, max: cur.max },
    next: nxt ? { letter: nxt.l, color: nxt.color, min: nxt.min } : null,
    progress,
    levelsToNext: nxt ? Math.max(0, nxt.min - level) : 0,
    steps,
    pull,
    // Escrito por extenso porque é a parte honesta: o que a escada NÃO sabe.
    undefined_: [
      'requisitos de evidência por degrau',
      'benefícios ou desbloqueios associados a cada rank',
      'histórico datado de promoções',
    ],
  };
}

/** A interpretação do Oráculo sobre a escada. Curta, e derivada — como em todo
 *  o lado, o Sistema mostra os números e o Oráculo diz o que significam. */
export function readLadderOracle(l: LadderRead | null): { text: string; because: string } | null {
  if (!l) return null;
  if (!l.next) {
    return {
      text: 'Estás no último degrau que a tabela define. O rank deixa de ser o que mede o teu progresso — a partir daqui medem-no os títulos provados e o que fica registado.',
      because: `rank ${l.current.letter} é o último de RANKS`,
    };
  }
  const easiest = l.pull[0];
  return {
    text: `Faltam ${l.levelsToNext} ${l.levelsToNext === 1 ? 'nível' : 'níveis'} globais para ${l.next.letter}. O nível global é a soma dos seis domínios, por isso o caminho mais curto passa por ${easiest.name}: são ${easiest.xpLeft} XP para o próximo nível, menos do que qualquer outro.`,
    because: `overallLevel ${l.level}, próximo degrau em ${l.next.min}; menor xpLeft = ${easiest.id} (${easiest.xpLeft})`,
  };
}
