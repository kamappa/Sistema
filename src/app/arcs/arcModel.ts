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
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  CAPACIDADES — MISSÃO 26 · FASE 7Z, DECISÃO FORMAL DO DANIEL         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * `milestone`, `climax` e `archived` fazem parte do desenho aprovado e o
 * DOMÍNIO NÃO OS SABE PRODUZIR: não há onde guardar um marco atingido, um
 * clímax não tem condição definida, e não existe arquivo de arcos passados.
 *
 * Até aqui isto era um COMENTÁRIO a dizer que `arcState()` nunca os devolvia.
 * Um comentário não é uma garantia — bastava alguém escrever `return
 * 'milestone'` e o compilador deixava. Agora:
 *
 *   · os três SAÍRAM da união `ArcState`. Devolvê-los deixou de compilar;
 *   · vivem em `ArcGatedState`, um tipo que não é aceite em lado nenhum;
 *   · `ARC_CAPABILITIES` diz por extenso o que não existe, congelado.
 *
 * A regra que acompanha a decisão: sem capacidade, NÃO renderizar controlos,
 * NÃO mostrar placeholders, NÃO insinuar que está a ser ligado. Documentar que
 * o domínio ainda não existe — que é o que este bloco faz.
 *
 * NOTA HONESTA sobre `preview`: era membro de `ArcState` e nunca foi produzido
 * por `arcState()`. Não é um estado de ciclo de vida — é uma fase da interface,
 * e o `ArcPreview` já tinha o seu próprio tipo `Stage` para isso. Saiu da união
 * por não pertencer lá, não por estar bloqueado.
 *
 * NOTA HONESTA sobre `accepted`: está na lista de estados DISPONÍVEIS aprovada
 * pelo Daniel, e é verdade que é alcançável — mas quem o produz é a cerimónia
 * (`ArcPreview`, fase `forming`), não `arcState()`. O que fica guardado é
 * `status: 'active'`, e por isso, à segunda leitura, um arco aceite lê-se como
 * `active`. O estado existe no ciclo de vida; não existe no que é persistido.
 */

import { SEASON_ARCS } from '../../state/config.js';
import { seasonArcNow, seasonBounds } from '../../state/world.js';
import { today, diffDays } from '../../state/dates.js';

/** Os estados que o Sistema sabe produzir hoje. É a lista aprovada. */
export type ArcState =
  | 'proposed'   // o mundo mudou e espera resposta
  | 'accepted'   // aceite agora — transitório, produzido pela cerimónia
  | 'active'     // a decorrer
  | 'completed'  // o período acabou com o arco aceite
  | 'declined';  // ignorado

/** Os estados do desenho aprovado que o DOMÍNIO ainda não sabe produzir.
 *
 *  Este tipo existe para o desenho ficar registado e NÃO é aceite em lado
 *  nenhum: não é parte de `ArcState`, nenhuma função o devolve e nenhum
 *  componente o recebe. Se um dia o domínio ganhar marcos, o caminho é mover o
 *  membro daqui para `ArcState` — e nessa altura o compilador vai apontar
 *  todos os sítios que precisam de saber lidar com ele. */
export type ArcGatedState = 'milestone' | 'climax' | 'archived';

/* ── AS CAPACIDADES ────────────────────────────────────────────────────
 * Congeladas. Não são configuração — são um retrato do que o domínio sabe
 * fazer, e mudá-las em runtime seria fingir uma capacidade.
 *
 * Cada uma diz PORQUE não existe, porque "false" sozinho não distingue "ainda
 * não fizemos" de "não há onde guardar". */
export const ARC_CAPABILITIES = Object.freeze({
  /** Marcos atingidos dentro de um arco. `S.worldArc` guarda
   *  `{id, status, start, end}` — não há campo para marcos, nem regra que
   *  defina o que é atingir um. */
  milestones: false,
  /** Momento de clímax do arco. Nenhuma condição definida no domínio. */
  climax: false,
  /** Arquivo de arcos passados. `S.worldArc` guarda UM arco; aceitar o
   *  seguinte substitui o anterior. Não há histórico para arquivar. */
  archive: false,
} as const);

export type ArcCapability = keyof typeof ARC_CAPABILITIES;

/** Verdadeiro só quando o domínio sabe mesmo produzir aquilo.
 *  Chamar isto antes de renderizar um controlo é a forma de a regra "sem
 *  capacidade não há controlo" ser verificável em vez de acordada.
 *
 *  A leitura é feita pelo CONTRATO (`Record<ArcCapability, boolean>`) e não
 *  pelos literais. O TypeScript, ao ver que os três valores são `false`,
 *  estreitava o tipo e recusava a comparação como "sem sobreposição" — o que
 *  é verdade hoje e deixaria de compilar no dia em que uma passasse a `true`.
 *  Um guarda que só compila enquanto a resposta é sempre não é inútil. */
export function hasArcCapability(c: ArcCapability): boolean {
  const caps: Record<ArcCapability, boolean> = ARC_CAPABILITIES;
  return caps[c];
}

/** Mapa do estado bloqueado para a capacidade que o destrancaria. Serve a
 *  documentação e os testes; não serve para alcançar o estado. */
export const ARC_GATED_BY: Readonly<Record<ArcGatedState, ArcCapability>> = Object.freeze({
  milestone: 'milestones',
  climax: 'climax',
  archived: 'archive',
});

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
  /** ── A MATÉRIA DA ESTAÇÃO — Fase 7Z ──
   *
   *  Até aqui uma estação eram duas cores e uma direção. A biblioteca tem muito
   *  mais do que isso guardado, e nenhuma delas estava a ser usada: R20 mostra
   *  queda com parallax por desfoque, R22 floração em sequência, R28 luz
   *  partida em fragmentos, R29 duas populações de neve, R30 cristal.
   *
   *  `materia` é o NOME desse comportamento, não um componente. Continua a não
   *  existir `<BloomLayer/>`: a camada é uma só e lê este campo por
   *  `data-arc-materia`. Um arco novo ganha matéria declarando uma palavra. */
  materia: 'cintilacao' | 'queda' | 'assentamento' | 'abertura';
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
  // expansão, exposição, energia solar, horizonte, movimento para fora.
  // MATÉRIA de R28: uma fonte de luz vista através de água irregular parte-se
  // em centenas de fragmentos e continua a ler-se como coluna. Coerência sem
  // continuidade — que é o verão inteiro numa frase.
  summer: { gesture: 'expansão', accent: '#fb923c', accentSoft: '#fbbf24', flow: 'out', materia: 'cintilacao' },
  // colheita, consolidação, transformação de esforço em evidência.
  // CORES de S13, que é uma paleta com hex reais: #B3682D e #D1B27B. O âmbar
  // anterior era escolhido; estes são terrosos e vêm de uma fonte.
  // MATÉRIA de R20: queda com três profundidades distinguidas só pela nitidez.
  harvest: { gesture: 'colheita', accent: '#b3682d', accentSoft: '#d1b27b', flow: 'in', materia: 'queda' },
  // silêncio, foco, compressão, preparação.
  // CORES de S20: MIST #8EA1AE e FROSTYSILVER #BEB3AC. O #60a5fa anterior era o
  // azul-cliché que a direção proíbe; estes são dessaturados, que é o que S20
  // tem de diferente das paletas de primavera e verão — e o que os torna
  // utilizáveis sobre preto sem correção.
  winter: { gesture: 'compressão', accent: '#8ea1ae', accentSoft: '#beb3ac', flow: 'in', materia: 'assentamento' },
  // emergência, ramificação, crescimento, novos nós, movimento ascendente.
  // MATÉRIA de R22: a floração acontece em SEQUÊNCIA, de baixo para cima, e a
  // ordem é legível. Não aparece florido — floresce.
  bloom: { gesture: 'emergência', accent: '#4ade80', accentSoft: '#a3e635', flow: 'up', materia: 'abertura' },
};

/** Fallback honesto: um arco sem motivo declarado não fica sem tema — fica com
 *  a identidade do Sistema, que é violeta, e não com uma cor inventada. */
const NEUTRAL: ArcMotif = { gesture: 'presença', accent: '#a78bfa', accentSoft: '#d946ef', flow: 'in', materia: 'assentamento' };

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
    /* ── DEFEITO REAL, encontrado ao tipar o `world.js` (2026-07-31) ──
     * Isto era `seasonBounds(SEASON_ARCS.find(...))`, e o `find` devolve
     * `undefined` quando o id não existe. O `seasonBounds` faz `a.id === ...`
     * à primeira linha: um id desconhecido não dava um arco errado, dava
     * **TypeError e a zona inteira em branco**.
     *
     * E `arcId` vem de `S.worldArc.id`, que é estado PERSISTIDO. Bastava um
     * arco ser renomeado, ou um estado antigo sobreviver a uma migração, para
     * a aplicação deixar de abrir — sem nada no ecrã a dizer porquê.
     *
     * A resposta honesta a "não conheço este arco" não é rebentar nem inventar
     * uma data de fim: é dizer que não há arco a decorrer. `proposed` é o
     * mesmo que este ramo já devolve para todo o resto que não se confirma. */
    const arco = SEASON_ARCS.find((a: any) => a.id === arcId);
    if (!arco) return 'proposed';
    const b = seasonBounds(arco);
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
