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
  tier?: string;
  status: ObjectiveStatus;
  due: IsoDate | null;
  tags: string[];
  created: IsoDate;
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

export interface LogEntry {
  d: IsoDate;
  t: string;
  x: number;
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
