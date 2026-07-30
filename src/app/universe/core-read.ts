/* O INTERIOR DO NÚCLEO — read model.
 * Missão 26 · Fase 6C, quarta passagem (escala 4).
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  CHEGAR AO NÚCLEO ERA DRAMÁTICO E NÃO HAVIA LÁ NADA PARA DESCOBRIR.  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * A viagem funcionava e a chegada não pagava. Um destino sem conteúdo é um
 * ecrã de fim de nível: vê-se uma vez e nunca mais se volta lá.
 *
 * O QUE HÁ MESMO PARA DESCOBRIR, e a resposta estava na aritmética do próprio
 * motor. `overallLevel` é literalmente a soma dos seis níveis menos cinco. O
 * Núcleo NÃO é uma metáfora de progresso — é a soma, e por isso pode ser
 * DECOMPOSTO. Entrar nele é ver de que é feito:
 *
 *   · SEIS VEIOS. Cada domínio entrega ao Núcleo exatamente o seu nível.
 *     "Saber deu-te 19 dos 64" é um facto verificável, não uma imagem.
 *     Isto responde à lei — toda a energia converge para o Núcleo — mostrando
 *     a conta em vez de a afirmar.
 *   · A BANDA DE RANK. Onde estás dentro da banda atual e quanto falta para a
 *     seguinte. Quando não há seguinte, diz-se isso; não se inventa uma barra.
 *   · O CRESCIMENTO. `S.history` é uma série datada de XP total. É a única
 *     prova de QUANDO o Núcleo cresceu, e é real.
 *   · AS SOMBRAS. Cada missão erguida deixa um corpo datado. São o exército.
 *
 * Nada aqui é derivado de nada novo. É tudo releitura de estado que já existe,
 * que é a única forma honesta de encher um destino.
 */

import { ATTRS, RANKS, rankOf, overallLevel, TITLES_REAL } from '../../state/config.js';

export interface Seam {
  id: string;
  name: string;
  color: string;
  /** Ângulo de entrada — o mesmo do território, para a continuidade espacial
   *  ser real: o veio vem de onde o domínio está. */
  angle: number;
  /** Níveis que este domínio entrega. */
  level: number;
  /** Fração da massa total. Governa a espessura. */
  share: number;
}

export interface Band {
  letter: string;
  color: string;
  /** Posição dentro da banda, 0–1. `null` quando a banda não tem topo. */
  within: number | null;
  next: { letter: string; color: string; falta: number } | null;
  /** Verdadeiro no último rank definido. Não há barra e diz-se porquê. */
  aberto: boolean;
}

export interface Growth {
  /** Pontos datados, do mais antigo ao mais recente. */
  pts: { d: string; v: number }[];
  ganho: number;
  desde: string | null;
}

export interface CoreRead {
  level: number;
  totalXP: number;
  seams: Seam[];
  /** Soma dos níveis, ANTES do −5. É o número que os veios somam, e tem de
   *  bater certo com o que se vê — por isso é exposto em vez de calculado
   *  outra vez na vista. */
  somaNiveis: number;
  band: Band;
  growth: Growth | null;
  shadows: { n: number; forte: { name: string; lvl: number; d: string } | null };
  titulos: { provados: number; total: number };
}

export function readCore(S: Record<string, any> | null): CoreRead | null {
  if (!S) return null;

  const level = overallLevel(S);
  const somaNiveis = ATTRS.reduce((n: number, a: any) => n + S.attrs[a.id].level, 0);

  const seams: Seam[] = ATTRS.map((a: any, i: number) => {
    const lv = S.attrs[a.id].level;
    return {
      id: a.id,
      name: a.name,
      color: a.color,
      angle: (i * 360) / ATTRS.length,
      level: lv,
      share: somaNiveis > 0 ? lv / somaNiveis : 0,
    };
  });

  /* ── A banda de rank ──
   * O último rank tem `max: 9999`, que é um sentinela e não um limite real.
   * Calcular "39 de 9975" ali daria uma barra a 0,4% e uma leitura falsa — o
   * Sistema estaria a dizer que quase não há progresso quando na verdade não
   * há mais banda definida. Diz-se isso por extenso. */
  const r = rankOf(level);
  const idx = RANKS.findIndex((x: any) => x.l === r.l);
  const aberto = idx === RANKS.length - 1;
  const nx = aberto ? null : RANKS[idx + 1];
  const band: Band = {
    letter: r.l,
    color: r.color,
    within: aberto ? null : Math.min(1, Math.max(0, (level - r.min) / (r.max - r.min + 1))),
    next: nx ? { letter: nx.l, color: nx.color, falta: Math.max(0, nx.min - level) } : null,
    aberto,
  };

  /* ── O crescimento ──
   * `S.history` traz `{ d, v }`. Duas defesas: pontos sem data ou sem valor
   * são descartados, e com menos de dois pontos não há série — uma linha de um
   * ponto só desenharia uma tendência que não existe. */
  const raw: any[] = Array.isArray(S.history) ? S.history : [];
  const pts = raw
    .filter((p) => p && typeof p.v === 'number' && typeof p.d === 'string')
    .slice(-30);
  const growth: Growth | null = pts.length >= 2
    ? { pts, ganho: pts[pts.length - 1].v - pts[0].v, desde: pts[0].d }
    : null;

  const sh: any[] = Array.isArray(S.shadows) ? S.shadows : [];
  const forte = sh.length
    ? sh.reduce((b, x) => (x.lvl > (b?.lvl ?? -1) ? x : b), null as any)
    : null;

  const unlocked = Object.keys(S.titleUnlocked ?? {});

  return {
    level,
    totalXP: Math.round(S.totalXP ?? 0),
    seams,
    somaNiveis,
    band,
    growth,
    shadows: { n: sh.length, forte: forte ? { name: forte.name, lvl: forte.lvl, d: forte.d } : null },
    titulos: { provados: unlocked.length, total: TITLES_REAL.length },
  };
}
