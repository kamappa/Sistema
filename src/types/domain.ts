// Tipos de domínio do Sistema (Missão 26 · Fase 1).
//
// Estes tipos DESCREVEM o `app_state` tal como ele existe hoje — não propõem um
// modelo novo. Foram lidos de `src/state/fresh.js`, `src/state/config.js` e
// `src/store/useStore.js`, e qualquer divergência entre este ficheiro e esses é
// um bug DESTE ficheiro. A lei do projeto aplica-se aqui: o Sistema nunca mente,
// e uma anotação de tipo que descreve um estado que não existe é uma mentira.
//
// Nada nesta fase depende destes tipos em runtime. Servem o LSP, os adaptadores
// e os componentes novos escritos em .ts/.tsx a partir da Fase 3.

/** Os 6 domínios do Operador (config.js:8-15). */
export type DomainId =
  | 'oficio'
  | 'saber'
  | 'corpo'
  | 'mente'
  | 'vinculos'
  | 'disciplina';

/** Letra de rank, do inicial ao topo (config.js:19-27). */
export type RankLetter = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

/** Prioridade de uma missão; BOSS é a de maior peso (config.js:141). */
export type Priority = 'P1' | 'P2' | 'P3' | 'BOSS';

/** Estado de uma missão no ciclo pend → doing → done (config.js:142). */
export type ObjectiveStatus = 'pend' | 'doing' | 'done';

/** Data em ISO curta, `YYYY-MM-DD` — o formato de `dates.js:fmt`. */
export type IsoDate = string;

export interface AttributeState {
  level: number;
  xp: number;
}

/** Hábito (pilar obrigatório ou extra). `lastGain` guarda o XP EXATO concedido,
 *  para a reversão do unlog ser exata — ver useStore.toggleHabit. */
export interface Habit {
  id: string;
  name: string;
  attr: DomainId;
  xp: number;
  /** Penalização diária; só os obrigatórios a têm. */
  pen?: number;
  streak: number;
  lastDone: IsoDate | null;
  lastGain: number;
}

export interface Objective {
  id: string;
  title: string;
  pri: Priority;
  area: DomainId;
  status: ObjectiveStatus;
  /** O campo chama-se `deadline`, não `due` — `due` é do SM-2 da Revisão Ativa
   *  e não existe num objetivo. Ver useStore.js:191. */
  deadline: IsoDate | null;
  tags: string[];
  created: IsoDate;
  /** `true` quando a prioridade/área vieram da triagem automática. */
  auto?: boolean;
  /** Id do arco sazonal, quando a missão nasceu de um arco aceite. */
  arc?: string;
  /** `true` quando a missão veio do Radar ou do Oráculo. */
  oracle?: boolean;
  /** Só existe enquanto `status === 'done'`; apagada ao regredir. */
  doneDate?: IsoDate;
}

/** Sombra erguida por uma missão concluída (useStore.js:221).
 *  `ref` aponta para o `Objective.id` que a originou — é por ele que a
 *  reversão a remove. */
export interface Shadow {
  id: string;
  ref: string;
  name: string;
  lvl: number;
  d: IsoDate;
}

export interface HistoryPoint {
  d: IsoDate;
  v: number;
}

/**
 * Uma linha do registo de ganhos — as 14 últimas coisas que aconteceram.
 *
 * ── CORRIGIDO (2026-07-31, Fase 7Z) ──
 * Este tipo dizia `{ d, t, x }` e **estava errado nos dois campos**. O único
 * sítio que escreve aqui é o `plog` do `state/engine.js`, e ele escreve
 * `text` e `gain`. Nem sequer era a forma antiga: essa é `t`/`v`, e o `x`
 * não existiu nunca em lado nenhum.
 *
 * Passou despercebido porque nenhum leitor o importava — os leitores são JS e
 * leem a forma verdadeira. Bastava alguém tipar um leitor contra isto para
 * escrever `e.t` e receber `undefined` sem um único aviso.
 *
 * Um tipo que descreve algo que o código não faz é uma mentira com a
 * autoridade de documentação. Encontrado ao ligar o `@ts-check` no motor.
 */
export interface LogEntry {
  d: IsoDate;
  /** O que aconteceu, em texto. */
  text: string;
  /** XP ganho — negativo numa perda. */
  gain: number;
  /**
   * O domínio a que o ganho pertence. **Opcional e aditivo**: as entradas
   * escritas antes da Fase 7Z não o têm e nunca o vão ter. A leitura diz isso
   * por extenso em vez de lhes inventar um dono.
   */
  attr?: DomainId;
}

/**
 * A forma que o registo tinha no Vanilla. Não se escreve mais — existe porque
 * o estado real do Daniel ainda tem entradas assim, e os leitores aceitam as
 * duas (`evidence-read.ts`, `reflectionRead.ts`). Apagar isto não apagava os
 * dados; só escondia que eles existem.
 */
export interface LegacyLogEntry {
  d: IsoDate;
  t: string;
  v: number;
}

export interface TrainingState {
  prog: Record<'push' | 'pull' | 'legs' | 'core' | 'kegel', number>;
  sessions: unknown[];
}

export interface SleepState {
  bedT: string;
  wakeT: string;
  logs: unknown[];
}

/**
 * O estado completo do Operador — o objeto guardado em `app_state` (JSONB, RLS)
 * e espelhado em localStorage. `v` é a versão do schema; o `normalize.js`
 * migra as anteriores e é idempotente no v4.
 */
export interface OperatorState {
  attrs: Record<DomainId, AttributeState>;
  oblig: Habit[];
  extras: Habit[];
  history: HistoryPoint[];
  totalXP: number;
  log: LogEntry[];
  lastDayCheck: IsoDate;
  seenAch: string[];
  debuffs: Record<string, unknown>;
  events: unknown[];
  notifOn: boolean;
  notified: Record<string, unknown>;
  worldArc: unknown | null;
  whisper: Record<string, unknown>;
  titleEv: Record<string, unknown>;
  /** Título Real → data de desbloqueio. A data é evidência: preserva-se. */
  titleUnlocked: Record<string, IsoDate>;
  recovery: unknown | null;
  weather: unknown | null;
  training: TrainingState;
  sleep: SleepState;
  objectives: Objective[];
  shadows: Shadow[];
  oracle: { reports: unknown[] };
  radarAccepted: Record<string, unknown>;
  recall: Record<string, unknown>;
  recallToday: unknown | null;
  customQ: unknown[];
  studyStreak: { count: number; lastDay: IsoDate | null };
  oracleChat: { d: IsoDate | null; count: number };
  /** Estrelas nascidas por evidência; a data de nascimento é histórica e nunca
   *  se reescreve, mesmo que a evidência regrida (conceito da Missão 16). */
  constellation?: {
    born: Record<string, IsoDate>;
    choices?: Record<string, string>;
  };
  v: number;
}

/** Estado da sincronização mostrado no rodapé. */
export type SyncState = 'ok' | 'saving' | 'err' | 'local';
