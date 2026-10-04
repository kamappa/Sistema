/* OS MARCOS — as estrelas que têm nome.
 * Missão 26 · Renaissance Visual · a fusão dos dois céus.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A ZONA UNIVERSO TINHA DOIS CÉUS a dizer a mesma coisa: a cena M26   ║
 * ║  (`UniverseScene`) e o painel legado das Constelações, que corria o   ║
 * ║  motor WebGL de `stage/constellation.js` das Missões 12/16/17.        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O painel antigo tinha uma coisa que a cena nova não tinha, e é a mais
 * importante das duas: as estrelas dele TÊM NOME. RGPD, NIS2, ISO 27001, Lead
 * Auditor, GRC, Cyber Foundations, AI Gov Practitioner. A cena nova sabia
 * contar níveis — "nível 7 de Saber" — e isso é uma quantidade, não uma
 * identidade. Ninguém olha para uma quantidade e reconhece o que provou.
 *
 * Este ficheiro traz esse conteúdo para dentro da cena, e deixa o motor antigo
 * sem função. O que muda em relação a `stage/constellation.js`:
 *
 *   · o estado entra por PARÂMETRO. O motor antigo lia `S`, `AM`,
 *     `TITLES_REAL` e `CONSTELLATIONS` como globais de `window`, dentro de
 *     `try/catch` que engoliam tudo — um erro de leitura devolvia "estrela
 *     apagada" e ninguém ficava a saber. Aqui um domínio que não exista é um
 *     domínio que não existe, e vê-se;
 *   · não há estados intermédios. O motor antigo tinha estrelas "adormecidas"
 *     e "descobertas" no modelo, ainda que não as desenhasse. Aqui só existe
 *     o que nasceu;
 *   · a PROVA vem junto. Cada marco carrega a frase que diz porque é que ele
 *     existe. Uma estrela chamada "ISO 27001" sem a razão ao lado é um crachá.
 *
 * ── O SILÊNCIO MANTÉM-SE ──
 * Decisão do Daniel na Missão 16, e não se reabre aqui: SILÊNCIO TOTAL sobre o
 * que falta. Nenhum marco por nascer é devolvido, nenhuma contagem do que
 * falta é calculada, nenhuma ligação é desenhada para uma ponta que não
 * existe. O céu não é um checklist com as caixas por marcar — cada nascimento
 * tem de poder ser uma surpresa.
 *
 * ── E A EVIDÊNCIA REGRIDE ──
 * Também da Missão 16: se a evidência deixar de ser verdadeira, o marco
 * RECOLHE. `evalReq` é avaliado AGORA, sempre — nunca contra o registo de
 * nascimento. O registo (`S.constellation.born`) guarda a data do primeiro
 * nascimento, que é um facto histórico e não se apaga; mas quem decide se a
 * estrela está no céu hoje é a evidência de hoje.
 */

import { AM, CONSTELLATIONS, TITLES_REAL } from '../../state/config.js';

export type MarcoKind = 'lvl' | 'title' | 'streak' | 'done';

export interface Marco {
  /** `oficio:iso`. Único no céu inteiro. */
  id: string;
  /** `iso`. Único dentro do domínio; é por este que as ligações se referem. */
  key: string;
  name: string;
  /** Coordenadas locais no território, −1 a 1. Vêm do desenho da constelação
   *  em `config.js` e não de um hash: a forma é desenhada, não sorteada. */
  x: number;
  y: number;
  kind: MarcoKind;
  /** A razão por extenso. "Nível 6 de Ofício", "Título Real: Lead Auditor". */
  proof: string;
  /** Data do primeiro nascimento, `YYYY-MM-DD`, quando é sabida.
   *  `null` quando o marco foi observado na migração inicial do registo: nessa
   *  altura a evidência já era verdadeira e a data verdadeira não existia.
   *  Inventar uma seria exatamente o que "nada nasce do nada" proíbe. */
  born: string | null;
}

export interface MarcoLink {
  a: string;
  b: string;
}

export interface MarcosRead {
  marcos: Marco[];
  /** Só ligações cujas DUAS pontas nasceram. Uma linha que sai de uma estrela
   *  e acaba no vazio é uma pista sobre o que falta, e o silêncio proíbe-a. */
  links: MarcoLink[];
}

/** O melhor streak entre hábitos obrigatórios e extras. */
function maxStreak(S: Record<string, any>): number {
  const hs = [...(S.oblig ?? []), ...(S.extras ?? [])];
  let n = 0;
  for (const h of hs) if (typeof h?.streak === 'number' && h.streak > n) n = h.streak;
  return n;
}

/** Missões concluídas de um domínio. */
function doneCount(S: Record<string, any>, attr: string): number {
  const os: any[] = Array.isArray(S.objectives) ? S.objectives : [];
  return os.filter((o) => o?.area === attr && o?.status === 'done').length;
}

/** A evidência é verdadeira AGORA? */
function evalReq(S: Record<string, any>, attr: string, req: any): boolean {
  if (!req) return false;
  if (req.lvl != null) return (S.attrs?.[attr]?.level ?? 0) >= req.lvl;
  if (req.title) return !!S.titleUnlocked?.[req.title];
  if (req.streak != null) return maxStreak(S) >= req.streak;
  if (req.done != null) return doneCount(S, attr) >= req.done;
  return false;
}

/** A prova por extenso — o que responde a "porque é que esta estrela existe". */
function proofText(attr: string, req: any): { kind: MarcoKind; proof: string } {
  const dom = AM[attr]?.name ?? attr;
  if (req.lvl != null) return { kind: 'lvl', proof: `Nível ${req.lvl} de ${dom}` };
  if (req.title) {
    const t = TITLES_REAL.find((x: any) => x.id === req.title);
    return { kind: 'title', proof: `Título Real: ${t?.name ?? req.title}` };
  }
  if (req.streak != null) return { kind: 'streak', proof: `Streak de ${req.streak} dias num hábito` };
  if (req.done != null) return { kind: 'done', proof: `${req.done} missões de ${dom} concluídas` };
  return { kind: 'lvl', proof: '—' };
}

/** A data do nascimento, quando é honesta.
 *  `o: 1` no registo marca "observada na migração": a evidência já era
 *  verdadeira antes de o céu existir e a data real perdeu-se. Devolve `null`,
 *  e quem mostra diz "anterior ao registo" em vez de mostrar um dia falso. */
function bornDate(S: Record<string, any>, id: string): string | null {
  const e = S.constellation?.born?.[id];
  if (!e || e.o === 1) return null;
  return typeof e.d === 'string' ? e.d : null;
}

export function readMarcos(S: Record<string, any> | null, attr: string): MarcosRead {
  const vazio: MarcosRead = { marcos: [], links: [] };
  if (!S) return vazio;
  const c = (CONSTELLATIONS as Record<string, any>)[attr];
  if (!c) return vazio;

  const nascidos = new Set<string>();
  const marcos: Marco[] = [];

  for (const s of c.stars) {
    if (!evalReq(S, attr, s.req)) continue;
    nascidos.add(s.id);
    const { kind, proof } = proofText(attr, s.req);
    marcos.push({
      id: attr + ':' + s.id,
      key: s.id,
      name: s.n,
      // O desenho vem em 0–1; o território fala em −1 a 1.
      x: (s.x - 0.5) * 2,
      y: (s.y - 0.5) * 2,
      kind,
      proof,
      born: bornDate(S, attr + ':' + s.id),
    });
  }

  const links: MarcoLink[] = [];
  for (const [a, b] of c.links ?? []) {
    if (nascidos.has(a) && nascidos.has(b)) links.push({ a, b });
  }

  return { marcos, links };
}

/* ── O PULSO ───────────────────────────────────────────────────────────
 * "Provas vivas de que ando a fazer coisas" — o pedido do Daniel, e a razão
 * de esta função existir.
 *
 * O Núcleo lia UMA coisa: o nível global. O nível global é um acumulado de
 * meses e não desce nunca; um Núcleo que só o lê fica exatamente igual num dia
 * de trabalho e numa semana parada. Isso não é um corpo vivo — é um troféu.
 *
 * O pulso é a segunda leitura, e é deliberadamente CURTA: sete dias. Mede
 * quantos dias distintos tiveram registo, não quanto XP se fez — a diferença
 * importa. Uma tarde de 400 XP e seis dias de silêncio é um pico, não um
 * ritmo, e o corpo tem de saber distinguir os dois. Trabalho constante
 * acelera-o; parar abranda-o. É a única leitura do Núcleo que pode DESCER, e
 * é por isso que ela diz a verdade sobre hoje.
 *
 * Sem registo datado devolve o piso e não zero: um Operador novo tem um Núcleo
 * calmo, não um Núcleo morto. */
export interface PulseRead {
  /** 0–1. Governa ritmo, fitas e comprimento das pontas. */
  valor: number;
  /** Dias distintos com registo nos últimos 7. */
  dias: number;
  /** XP somado na janela. Só para a leitura em texto. */
  xp: number;
}

const JANELA = 7;

export function readPulse(S: Record<string, any> | null): PulseRead {
  if (!S) return { valor: 0, dias: 0, xp: 0 };
  const raw: any[] = Array.isArray(S.log) ? S.log : [];

  // A janela em texto: as datas do registo são `YYYY-MM-DD` e comparam-se
  // lexicograficamente sem passar por `Date`, que traria fuso horário para uma
  // conta que não precisa dele.
  const lim = new Date();
  lim.setDate(lim.getDate() - (JANELA - 1));
  const desde = lim.toISOString().slice(0, 10);

  const dias = new Set<string>();
  let xp = 0;
  for (const e of raw) {
    const d = typeof e?.d === 'string' ? e.d : '';
    if (!d || d < desde) continue;
    dias.add(d);
    const g = typeof e.gain === 'number' ? e.gain : (typeof e.v === 'number' ? e.v : 0);
    xp += g;
  }

  /* O piso de 0,12 é presença, não progresso — a mesma decisão que separou
     `BASE` de `GROWTH` no corpo do Núcleo. Um corpo que chega a zero deixa de
     respirar, e um Sistema que mostra um cadáver a quem esteve uma semana sem
     abrir a app está a castigar em vez de informar. */
  const valor = Math.min(1, 0.12 + (dias.size / JANELA) * 0.88);
  return { valor, dias: dias.size, xp };
}
