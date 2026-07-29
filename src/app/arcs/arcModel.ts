/* ARC ENGINE — read model de apresentação.
 * Missão 26 · Fase 7.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  UM SÓ SÍTIO LÊ O ARCO. Nenhum componente pergunta "isto é o Summer  ║
 * ║  Arc?"; perguntam ao arco o que ele é.                               ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Condição explícita do Daniel: *"não codifiques o Summer Arc diretamente em
 * vários componentes"*. Um `if (arc.id === 'summer')` espalhado por cinco
 * ficheiros significa que o Bloom Arc exige cinco alterações — e a lei do
 * projeto é que a progressão muda o mundo, não que se reconstrói a aplicação
 * de estação em estação.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ZERO ALTERAÇÕES A SCHEMAS OU A REGRAS DE DOMÍNIO.                   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Os dados são os que já existem: `SEASON_ARCS` (config.js), `seasonArcNow` e
 * `seasonBounds` (world.js), e `S.worldArc` — que guarda `{id, status, start,
 * end}` e nada mais. Isto NÃO inventa campos persistidos: tudo o que não está
 * guardado é derivado na leitura, e derivado da mesma forma em todo o lado.
 *
 * O QUE FICA POR FAZER, e fica dito: `milestone`, `climax` e `archived` são
 * estados do desenho aprovado que o domínio ainda não sabe produzir — não há
 * onde guardar um marco atingido. Aparecem no tipo porque a máquina de estados
 * é a aprovada, e `arcState()` nunca os devolve. Inventá-los aqui seria o
 * Sistema a mostrar um marco que ninguém atingiu.
 */

import { SEASON_ARCS } from '../../state/config.js';
import { seasonArcNow, seasonBounds } from '../../state/world.js';
import { today, diffDays } from '../../state/dates.js';

export type ArcState =
  | 'proposed'   // o mundo mudou e espera resposta
  | 'preview'    // a proposta está aberta em profundidade
  | 'accepted'   // aceite agora — o estado transitório da cerimónia
  | 'active'     // a decorrer
  | 'milestone'  // POR IMPLEMENTAR no domínio — ver cabeçalho
  | 'climax'     // POR IMPLEMENTAR no domínio
  | 'completed'  // o período acabou com o arco aceite
  | 'archived'   // POR IMPLEMENTAR no domínio
  | 'declined';  // ignorado

/** O motivo visual. É o que a Arc Layer usa para se pintar, e a única coisa
 *  que um arco novo precisa de declarar para existir visualmente. */
export interface ArcMotif {
  /** Palavra que descreve o movimento. Aparece na documentação, não no ecrã. */
  gesture: string;
  /** Cor secundária da camada sazonal. NUNCA a primária — a identidade do
   *  Sistema é violeta e não muda de estação. */
  accent: string;
  /** Segunda cor, para gradientes de atmosfera. */
  accentSoft: string;
  /** Direção da energia ambiente. `out` expande, `in` converge, `up` sobe. */
  flow: 'out' | 'in' | 'up' | 'down';
}

export interface ArcReading {
  id: string;
  name: string;
  /** Nome sem o emoji — para títulos, onde um emoji não é estrutura. */
  plainName: string;
  desc: string;
  boss: string;
  state: ArcState;
  motif: ArcMotif;
  /** Domínios que o arco favorece, com o multiplicador real. */
  bonus: { id: string; mult: number }[];
  /** Missões que a aceitação vai acrescentar. Vêm do domínio, não inventadas. */
  quests: { t: string; area: string; pri: string }[];
  start: string;
  end: string;
  /** Dia atual dentro do arco, 1-based. `null` se ainda não começou. */
  day: number | null;
  totalDays: number;
  daysLeft: number;
  /** 0–1. Só existe quando o arco está a decorrer. */
  progress: number | null;
}

/* ── Motivos ────────────────────────────────────────────────────────────
 * Um por arco, e é aqui que um arco novo ganha identidade visual — numa
 * tabela, não em componentes. O `gesture` é a palavra que governa a
 * assinatura de movimento; os componentes leem `flow` e as cores.
 *
 * As cores são SECUNDÁRIAS por lei: a camada sazonal pode mudar atmosfera,
 * acento e partículas, e não pode tocar em contraste, estrutura, semântica de
 * perigo nem legibilidade. Nenhuma destas é usada para texto.
 */
const MOTIFS: Record<string, ArcMotif> = {
  // expansão, exposição, energia solar, horizonte, movimento para fora
  summer: { gesture: 'expansão', accent: '#fb923c', accentSoft: '#fbbf24', flow: 'out' },
  // colheita, consolidação, transformação de esforço em evidência
  harvest: { gesture: 'colheita', accent: '#d97706', accentSoft: '#b45309', flow: 'in' },
  // silêncio, foco, compressão, preparação
  winter: { gesture: 'compressão', accent: '#60a5fa', accentSoft: '#93c5fd', flow: 'in' },
  // emergência, ramificação, crescimento, novos nós, movimento ascendente
  bloom: { gesture: 'emergência', accent: '#4ade80', accentSoft: '#a3e635', flow: 'up' },
};

/** Fallback honesto: um arco sem motivo declarado não fica sem tema — fica com
 *  a identidade do Sistema, que é violeta, e não com uma cor inventada. */
const NEUTRAL: ArcMotif = { gesture: 'presença', accent: '#a78bfa', accentSoft: '#d946ef', flow: 'in' };

export function arcMotif(id: string): ArcMotif {
  return MOTIFS[id] ?? NEUTRAL;
}

/** Estado do arco a partir do que está guardado. Uma função, um resultado. */
export function arcState(S: Record<string, any> | null, arcId: string): ArcState {
  if (!S) return 'proposed';
  const wa = S.worldArc;
  if (!wa || wa.id !== arcId) return 'proposed';
  if (wa.status === 'dismissed') return 'declined';
  // `later` com o adiamento de hoje ainda de pé continua a ser uma proposta —
  // só volta a aparecer amanhã. Mesma condição do World.jsx e do next-action.
  if (wa.status === 'later') return wa.snooze === today() ? 'declined' : 'proposed';
  if (wa.status === 'active') {
    const b = seasonBounds(SEASON_ARCS.find((a: any) => a.id === arcId));
    return today() > b.end ? 'completed' : 'active';
  }
  return 'proposed';
}

/** A leitura do arco da estação corrente. `null` quando não há arco — o que só
 *  acontece se a tabela de arcos tiver um buraco de meses. */
export function readArc(S: Record<string, any> | null): ArcReading | null {
  const a = seasonArcNow();
  if (!a) return null;

  const b = seasonBounds(a);
  const totalDays = Math.max(1, diffDays(b.start, b.end) + 1);
  const elapsed = diffDays(b.start, today()) + 1;
  const within = elapsed >= 1 && elapsed <= totalDays;
  const day = within ? elapsed : null;

  return {
    id: a.id,
    name: a.name,
    // O emoji é decoração herdada do HUD e não pode ser estrutura — quem lê
    // com leitor de ecrã ouve "sol" antes do nome do arco. Fica disponível em
    // `name` para onde já é esperado, e fora dos títulos.
    plainName: String(a.name).replace(/^[^\p{L}]+/u, '').trim(),
    desc: a.desc,
    boss: a.boss,
    state: arcState(S, a.id),
    motif: arcMotif(a.id),
    bonus: Object.entries(a.bonus ?? {}).map(([id, mult]) => ({ id, mult: mult as number })),
    quests: (a.quests ?? []) as { t: string; area: string; pri: string }[],
    start: b.start,
    end: b.end,
    day,
    totalDays,
    daysLeft: Math.max(0, totalDays - (day ?? 0)),
    progress: day === null ? null : Math.min(1, day / totalDays),
  };
}

/** A camada sazonal só se aplica quando o arco está MESMO a decorrer.
 *  Uma proposta por responder não pinta o mundo — se pintasse, aceitar deixaria
 *  de mudar alguma coisa, e a cerimónia de aceitação não teria consequência. */
export function activeArcTheme(S: Record<string, any> | null): ArcReading | null {
  const r = readArc(S);
  if (!r) return null;
  return r.state === 'active' || r.state === 'accepted' ? r : null;
}
