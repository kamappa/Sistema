/* UNIVERSO — o read model do céu.
 * Missão 26 · Fase 6C, segunda passagem.
 *
 * O ficheiro chama-se universe-read (com hifen) e nao universeScene porque o
 * sistema de ficheiros do Windows nao distingue maiusculas: universeScene e
 * UniverseScene seriam o mesmo caminho, o TypeScript recusa a compilacao e o
 * Vite serve o modulo errado em silencio. Mesmo motivo de core/next-action.ts.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  CADA ESTRELA NASCE DE EVIDÊNCIA REAL, e a mesma evidência produz     ║
 * ║  SEMPRE a mesma estrela — mesma posição, mesmo tamanho, mesmo brilho. ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * A posição vem de um hash do `domínio + índice`, não de `Math.random()`. É a
 * diferença entre um céu e um protetor de ecrã: um céu que se reordena a cada
 * render não é um registo de nada, e a lei do projeto diz que nada nasce do
 * nada — uma estrela tem de ter origem, e a origem tem de se manter.
 *
 * O QUE VIRA ESTRELA, e porquê só isto:
 *   · cada NÍVEL de um domínio = uma estrela consolidada. É a unidade de
 *     progresso que o motor de XP reconhece, e é irreversível na prática;
 *   · o XP do nível em curso = uma estrela A NASCER, com o brilho a crescer
 *     com a fração. É a única que ainda pode recuar, e mostra-se como tal;
 *   · cada TÍTULO provado e cada CONQUISTA = um corpo na órbita externa.
 *
 * Não há estrelas decorativas. O fundo tem poeira, e a poeira não conta nada —
 * é ambiente, e está declarada como tal no componente.
 */

import { ATTRS, need, rankOf, overallLevel, TITLES_REAL, ACH } from '../../state/config.js';
import { readMarcos, readPulse, type Marco, type MarcoLink, type PulseRead } from './marcos-read';

/** FNV-1a. Determinístico e estável entre sessões. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
/** 0–1 a partir de uma semente textual. */
const rnd = (s: string) => (hash(s) % 100000) / 100000;

/* ── PROTOESTRELA ──────────────────────────────────────────────────────
 * O XP do nível em curso deixa de ser só um número por baixo de uma barra e
 * passa a ser matéria em formação. As fronteiras são as que o Daniel fechou:
 *
 *   dust        0%       poeira quase invisível — existe potencial, não corpo
 *   proto       1–40%    protoestrela difusa, sem forma definida
 *   coalescing  40–80%   corpo mais coeso, já com centro
 *   unstable    80–99%   quase formada, e a instabilidade lê-se no ritmo
 *   (100% → deixa de ser proto: é uma estrela consolidada)
 *
 * Isto não finge precisão científica. Finge menos do que uma barra: uma barra
 * a 32% e uma barra a 78% são a mesma imagem com comprimentos diferentes, e
 * estas quatro fases são estados visualmente distintos.
 */
export type ProtoStage = 'dust' | 'proto' | 'coalescing' | 'unstable';

export function protoStage(frac: number): ProtoStage {
  if (frac < 0.01) return 'dust';
  if (frac < 0.4) return 'proto';
  if (frac < 0.8) return 'coalescing';
  return 'unstable';
}

export interface Star {
  id: string;
  /** Coordenadas locais dentro do território do domínio, −1 a 1. */
  x: number;
  y: number;
  /** Profundidade: 0 = perto, 1 = fundo. Alimenta o parallax. */
  z: number;
  /** 0–1. Estrela consolidada = 1; a nascer = a fração do nível. */
  light: number;
  size: number;
  /** A que nível corresponde. É a prova: hover diz "nível 7 de Corpo". */
  level: number;
  /** A estrela do nível em curso — a única que ainda pode recuar. */
  forming: boolean;
  /** Fase de formação. Só a estrela em formação a tem.
   *  A barra de XP diz 19/60 e não diz nada ao olho; a matéria diz. */
  stage?: ProtoStage;
  /** Cintila? Determinístico, ~1 em 4.
   *  Num céu real quase nenhuma estrela cintila de forma percetível, e 76
   *  animações simultâneas custam 76 camadas de composição por nada. */
  tw: boolean;
}

export interface Territory {
  id: string;
  name: string;
  sub: string;
  color: string;
  /** Posição do território no céu, em graus a partir do topo. */
  angle: number;
  level: number;
  xp: number;
  xpNeed: number;
  frac: number;
  rankLetter: string;
  rankColor: string;
  stars: Star[];
  /** Quantas estrelas consolidadas. É o número que o domínio provou. */
  proven: number;
  /* ── OS MARCOS ──
   * As estrelas com NOME, vindas do desenho em `config.js`. São uma população
   * diferente das de cima, e a diferença é de natureza e não de tamanho:
   *   `stars`  = QUANTIDADE de prova. Uma por nível. Anónimas por definição —
   *              "nível 7" não é o nome de nada.
   *   `marcos` = IDENTIDADE da prova. ISO 27001, Lead Auditor, Forja. Cada um
   *              tem uma razão que se pode ler em voz alta.
   * Um céu só com as primeiras conta QUANTO; só com os segundos conta O QUÊ.
   * A cena mostra as duas populações e desenha-as de maneira diferente. */
  marcos: Marco[];
  links: MarcoLink[];
}

export interface Satellite {
  id: string;
  name: string;
  kind: 'title' | 'ach';
  on: boolean;
  angle: number;
}

export interface SceneRead {
  territories: Territory[];
  satellites: Satellite[];
  level: number;
  rank: { letter: string; color: string };
  /** Total de estrelas consolidadas em todo o céu. */
  totalStars: number;
  /** Quanta massa o Núcleo tem, 0–1. Governa o tamanho do feixe. */
  coreMass: number;
  /** O que aconteceu nos últimos sete dias. A única leitura do Núcleo que pode
   *  DESCER — ver o cabeçalho de `readPulse`. */
  pulse: PulseRead;
  /** Marcos nascidos em todo o céu. Fica ao lado de `totalStars` e não somado
   *  a ele: são duas contagens de coisas diferentes, e somá-las inventaria um
   *  número que não significa nada. */
  totalMarcos: number;
}

/** Teto de estrelas desenhadas por domínio. Acima disto o céu deixa de se ler
 *  e o custo de render cresce sem informação nova — o número real continua a
 *  aparecer na leitura, por isso nada se esconde. */
const MAX_STARS = 24;

export function readScene(S: Record<string, any> | null): SceneRead | null {
  if (!S) return null;

  const level = overallLevel(S);
  const rank = rankOf(level);

  const territories: Territory[] = ATTRS.map((a: any, i: number) => {
    const s = S.attrs[a.id];
    const nd = need(s.level);
    const frac = nd > 0 ? Math.min(1, s.xp / nd) : 0;
    const ar = rankOf(s.level);

    /* ── O NÍVEL 1 NÃO É UMA ESTRELA ──
     * Encontrado na auditoria à conta real, 2026-07-30, e é um defeito da
     * PRIMEIRA LEI. `fresh.js` cria os seis domínios a nível 1 com 0 XP: o
     * nível 1 é DADO, não conquistado. Com `Math.max(0, s.level)` o céu de uma
     * conta nova mostrava SEIS estrelas e o HUD dizia "ESTRELAS: 6" — seis
     * provas que ninguém deu.
     *
     * Contra a minha semente isto era invisível: 69 níveis contra 63 provados
     * não salta à vista. Numa conta nova, 6 contra 0 é a diferença entre
     * "provaste seis coisas" e "ainda não provaste nada", e a segunda é a
     * verdade.
     *
     * A primeira estrela nasce ao chegar ao nível 2. É o que "nada nasce do
     * nada" quer dizer: uma estrela tem de ter trigger, origem e evidência, e
     * o ponto de partida não tem nenhum dos três. */
    const count = Math.min(MAX_STARS, Math.max(0, s.level - 1));
    const stars: Star[] = [];
    for (let k = 0; k < count; k++) {
      const seed = a.id + ':' + k;
      // Distribuição em disco, não em quadrado: um território redondo lê-se
      // como campo; um quadrado lê-se como caixa, e a missão proíbe caixas.
      const ang = rnd(seed + ':a') * Math.PI * 2;
      const rad = Math.sqrt(rnd(seed + ':r')) * 0.92;
      stars.push({
        id: seed,
        x: Math.cos(ang) * rad,
        y: Math.sin(ang) * rad,
        z: rnd(seed + ':z'),
        light: 1,
        size: 1 + rnd(seed + ':s') * 1.6,
        level: k + 1,
        forming: false,
        tw: rnd(seed + ':t') < 0.26,
      });
    }
    /* A protoestrela existe SEMPRE, mesmo a 0 XP — e existir a zero é a parte
       importante. Um domínio sem progresso recente mostrava-se idêntico a um
       domínio a 39%, e a diferença entre "não comecei" e "estou a meio" é a
       informação mais acionável do céu. A zero é poeira: comunica potencial,
       não avaria. */
    {
      const seed = a.id + ':forming';
      const ang = rnd(seed + ':a') * Math.PI * 2;
      stars.push({
        id: seed,
        x: Math.cos(ang) * 0.96,
        y: Math.sin(ang) * 0.96,
        z: 0.15,
        light: frac,
        size: 1.2 + frac * 1.6,
        level: s.level + 1,
        forming: true,
        // A que está a nascer cintila SEMPRE: é a única instável, e o
        // movimento é o que diz isso sem uma legenda.
        tw: true,
        stage: protoStage(frac),
      });
    }

    const { marcos, links } = readMarcos(S, a.id);

    return {
      id: a.id,
      name: a.name,
      sub: a.sub,
      color: a.color,
      angle: (i * 360) / ATTRS.length,
      level: s.level,
      xp: s.xp,
      xpNeed: nd,
      frac,
      rankLetter: ar.l,
      rankColor: ar.color,
      stars,
      proven: count,
      marcos,
      links,
    };
  });

  const unlocked = Object.keys(S.titleUnlocked ?? {});
  const seen: string[] = S.seenAch ?? [];
  const all = [
    ...TITLES_REAL.map((t: any) => ({ kind: 'title' as const, id: t.id, name: t.name, on: unlocked.includes(t.id) })),
    ...ACH.map((a: any) => ({ kind: 'ach' as const, id: a.id, name: a.name, on: seen.includes(a.id) })),
  ];
  const satellites: Satellite[] = all.map((o, i) => ({
    ...o,
    id: o.kind + ':' + o.id,
    angle: (i * 360) / all.length,
  }));

  const totalStars = territories.reduce((n, t) => n + t.proven, 0);
  const totalMarcos = territories.reduce((n, t) => n + t.marcos.length, 0);

  return {
    territories,
    satellites,
    level,
    rank: { letter: rank.l, color: rank.color },
    totalStars,
    // O feixe do Núcleo cresce com o nível global, com saturação. Sem teto,
    // um nível alto enchia o ecrã e deixava de haver céu.
    coreMass: Math.min(1, level / 40),
    pulse: readPulse(S),
    totalMarcos,
  };
}
