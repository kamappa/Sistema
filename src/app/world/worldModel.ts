/* WORLD ENGINE II — o contrato de um evento do mundo.
 * Missão 27 · Fase 1. Extensão das Missões 12 e 23, não reconstrução.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A REGRA QUE JUSTIFICA ESTE FICHEIRO EXISTIR                         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O SPEC da missão diz, e é a frase inteira do desenho:
 *
 *   "Eventos compostos resultam de REGRAS, não de `if` espalhados."
 *
 * Hoje o mundo já reage — chuva dá bónus ao Saber, calor muda a atmosfera, o
 * domingo acalma o céu. Mas cada uma dessas reações vive no seu sítio, escrita
 * à mão, e não há forma de perguntar ao Sistema "o que está a acontecer agora
 * e porquê". Um evento composto — Winter Rain Sanctuary, Summer Solar Push —
 * seria, com a arquitetura atual, um `if` dentro de outro `if`.
 *
 * Este ficheiro não muda nada do que se vê. Declara a FORMA de um evento para
 * que a fase seguinte possa resolvê-los por prioridade em vez de por ordem de
 * escrita.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O CRITÉRIO DE HONESTIDADE, QUE É LEI E NÃO PREFERÊNCIA              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Do SPEC: "um evento só se apresenta como facto quando possui prova."
 *
 * Por isso `evidence` é obrigatório e não opcional. Um evento que não consegue
 * dizer de onde veio não entra na lista — não é filtrado depois, não nasce. É
 * a mesma lei que rege as estrelas do Universo desde a Missão 16: nada nasce
 * do nada.
 */

import type { DomainId } from '../../types/domain';

/* ── AS CAMADAS, POR ORDEM DE COMPOSIÇÃO ────────────────────────────────
 * `Time → Weather → Season → Calendar → Behaviour → Special Event`
 * Cada camada só pode ler as anteriores. Um evento especial pode depender do
 * comportamento; o tempo não pode depender de um evento — se pudesse, teríamos
 * um ciclo e a resolução deixaria de ser determinística. */
export type WorldLayer =
  | 'time'
  | 'weather'
  | 'season'
  | 'calendar'
  | 'behaviour'
  | 'special';

export const LAYER_ORDER: readonly WorldLayer[] = [
  'time', 'weather', 'season', 'calendar', 'behaviour', 'special',
] as const;

/** Um evento nunca se apresenta sem isto. Ver o cabeçalho. */
export interface WorldEvidence {
  /** De onde veio o facto — `S.weather`, `S.history`, o relógio, o calendário. */
  source: string;
  /** O que o facto diz, em texto que um humano lê sem contexto. */
  fact: string;
  /** A data a que o facto se refere. Sem data não é prova, é impressão. */
  date: string;
}

/** O que um evento pode mudar no ambiente. Deliberadamente pequeno: cada campo
 *  novo é uma promessa de que alguma coisa o vai ler. */
export interface WorldVisual {
  /** Acento do ambiente, em hex. Compõe com `--arc-accent` da camada de arcos. */
  accent?: string;
  /** Matéria ambiente, quando o evento traz a sua. Mesma gramática do arco. */
  materia?: 'cintilacao' | 'queda' | 'assentamento' | 'abertura';
  /** Escala de intensidade do ambiente, 0–1. 1 é o normal do arco, não o máximo. */
  intensity?: number;
  /** Marca no `<html>` para o CSS ler sem perguntar a ninguém. */
  flag?: string;
}

export type EventPriority = 'ambient' | 'notable' | 'major' | 'critical';

/** A ordem em que um evento vence outro. Crítico ganha sempre; ambiente nunca
 *  interrompe nada. É a mesma regra da fila de SYSTEM EVENTS da Fase 6A, e é
 *  deliberado que seja a mesma: dois sistemas de prioridade diferentes no mesmo
 *  produto seriam duas opiniões sobre o que é importante. */
export const PRIORITY_RANK: Record<EventPriority, number> = {
  ambient: 0, notable: 1, major: 2, critical: 3,
};

/**
 * O que uma regra pode ler.
 *
 * ── PORQUE É QUE ISTO SUBSTITUIU `S` UMA HORA DEPOIS DE ESCREVER `S` ──
 *
 * A primeira assinatura era `trigger(S, now)`. Bateu na primeira parede real:
 * os eventos de AI Radar e Governance Radar da Missão 29 precisam dos itens do
 * **Radar**, que vivem no store (`radar`) e **não** no estado do Operador.
 *
 * A alternativa era passar o radar por uma segunda via, ou copiá-lo para `S`.
 * As duas seriam piores: a primeira dá regras que leem de sítios diferentes
 * conforme quem as escreveu, a segunda mistura dados de servidor com o estado
 * guardado.
 *
 * Trocar a assinatura com sete eventos custa minutos. Com vinte, custa uma
 * tarde e um risco. É por isso que se troca agora.
 */
export interface WorldContext {
  /** O estado do Operador. */
  S: Record<string, any>;
  /** Itens do Radar, quando há sessão. Vazio não é o mesmo que ausente — uma
   *  regra que precise da distinção tem de a testar explicitamente. */
  radar?: readonly Record<string, any>[];
  /** Última vez que cada evento foi dado como ativo, em ISO. É o que torna o
   *  `cooldownH` real em vez de decorativo. */
  seen?: Readonly<Record<string, string>>;
  /** A memória completa — data **e prova**. É o que o `durationMin` precisa
   *  para reapresentar um evento cuja regra já não é verdade. */
  memory?: Readonly<Record<string, { at: string; source: string; fact: string; date: string }>>;
}

export interface WorldEventDef {
  id: string;
  /** Nome por extenso. Aparece ao Operador; escreve-se para ser lido, não para
   *  ser decorativo. */
  name: string;
  layer: WorldLayer;
  priority: EventPriority;

  /**
   * A REGRA. Recebe o estado e o instante, devolve a prova — ou `null`.
   *
   * Devolver `null` é a resposta normal: a maior parte dos eventos não está a
   * acontecer na maior parte do tempo. Devolver prova é o que o faz existir.
   *
   * Tem de ser PURA e determinística: o mesmo estado no mesmo instante dá
   * sempre o mesmo resultado. Sem isto não há forma de explicar, no dia
   * seguinte, porque é que o mundo estava como estava.
   */
  trigger: (ctx: WorldContext, now: Date) => WorldEvidence | null;

  /** Quanto tempo fica de pé depois de disparar, em minutos. `0` ou ausente =
   *  enquanto a regra continuar verdadeira, que é o caso normal do ambiente.
   *
   *  **É respeitado pelo resolvedor** desde que lhe cheguem as ocorrências em
   *  `WorldContext.memory`. Um evento dentro da janela continua ativo mesmo
   *  quando a regra já devolve `null`, e reapresenta **a prova com que
   *  entrou** — um facto que fica de pé sem origem seria um facto sem prova, e
   *  isso a missão proíbe. */
  durationMin?: number;
  /** Quanto tempo tem de passar até poder **VOLTAR**, em horas — depois de ter
   *  saído. Protege o Operador de ver a mesma cerimónia três vezes num dia.
   *
   *  ── NÃO É "quanto tempo fica escondido depois de aparecer" ──
   *  A primeira implementação lia assim, e estava errada de uma forma que só se
   *  via a correr: o resolvedor corre de 5 em 5 minutos, e um evento verdadeiro
   *  o dia inteiro aparecia, era gravado, e **desaparecia na resolução
   *  seguinte** — porque a memória dizia que já tinha entrado há 5 minutos.
   *  Um estado verdadeiro passava a piscar uma vez por dia.
   *
   *  Um evento que continua verdadeiro está a CONTINUAR, não a repetir-se. O
   *  cooldown só se aplica a quem sai e tenta voltar.
   *
   *  **É respeitado pelo resolvedor** desde que lhe cheguem as últimas
   *  ocorrências em `WorldContext.seen`. Sem esse mapa, um evento com cooldown
   *  passa sempre — e o resolvedor **diz isso** em `cooldownIgnorado`, em vez
   *  de dar a entender que a proteção está a funcionar. */
  cooldownH?: number;

  visual?: WorldVisual;
  /** O que o Sistema diz quando isto está a acontecer. Uma frase. */
  copy?: string;
  /** Ações sugeridas — nunca impostas, nunca apresentadas como diagnóstico.
   *  O SPEC é explícito: "o motor não apresenta conselhos de saúde como
   *  diagnóstico". */
  suggests?: readonly string[];
  /** Domínios que o evento favorece, se favorecer algum. */
  favours?: readonly DomainId[];

  /** Em ecrã pequeno o evento continua a existir mas pode não se encenar. */
  mobile?: 'full' | 'reduced' | 'silent';
  /** Com `prefers-reduced-motion`. `still` mantém a informação e tira o
   *  movimento; `off` retira o evento — só para eventos cujo significado ESTÁ
   *  no movimento, pela mesma regra da matéria sazonal da Missão 26. */
  reducedMotion?: 'still' | 'off';
}

/** Um evento resolvido: a definição mais a prova que o fez existir. */
export interface ActiveWorldEvent {
  def: WorldEventDef;
  evidence: WorldEvidence;
}

/** O estado do mundo num instante. É o que a Fase 2 vai desenhar. */
export interface WorldState {
  /** Instante da resolução, para o resultado ser explicável depois. */
  at: string;
  /** Todos os eventos com prova, ordenados: prioridade primeiro, camada depois. */
  events: ActiveWorldEvent[];
  /** O dominante — o primeiro da lista, ou `null` se não houver nenhum. */
  dominant: ActiveWorldEvent | null;
  /** Eventos que a regra recusou, com a razão. Existe para o mundo ser
   *  auditável: "porque é que não houve Rain Sanctuary hoje?" tem resposta. */
  rejected: { id: string; reason: string }[];
  /** Eventos que declaram `cooldownH` e cujo cooldown não pôde ser aplicado,
   *  por não ter chegado o mapa de ocorrências. Existe para a proteção não
   *  parecer ativa quando não está. */
  cooldownIgnorado: string[];
  /** Eventos ativos por `durationMin` e já não por prova nova — a regra deixou
   *  de ser verdade mas a janela ainda não fechou. Declarado porque "está a
   *  acontecer" e "aconteceu há pouco" não são a mesma coisa. */
  aSustentar: string[];
}
