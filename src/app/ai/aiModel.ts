/* AI GOVERNANCE — o inventário.
 * Missão 29 · Fase 1.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  PORQUE É QUE A FASE 1 É O INVENTÁRIO E NÃO OS EVENTOS               ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O SPEC da missão nomeia dezoito eventos. Ao olhar para o que cada um precisa
 * como prova — *"release oficial, teste documentado, workflow versionado,
 * inventário, risk review, logs ativos, approval gate ou framework interno"* —
 * catorze deles apontam para a mesma coisa que não existe:
 *
 *   Model Inventory Update · AI Risk Review · Human-in-the-Loop Check ·
 *   Trust Seal · Red Flag Event · AI Council · Governance Signal ·
 *   Model Watch · Tool Discovery · Tool Mastery · Agent Lab Session ·
 *   Prompt Forge · Automation Chain Complete · AI Governance Breakthrough
 *
 * Todos precisam de saber **que IA é que o Daniel usa**. Sem isso, "Model
 * Inventory Update" é um evento sobre um inventário que não existe, e "AI Risk
 * Review" é uma revisão de risco sem objeto.
 *
 * Os dois que NÃO precisam do inventário — AI Radar e Governance Radar — já
 * têm prova hoje: o Radar já classifica itens em `ai` e `aigov` (`RAREA`).
 * Ficam para a Fase 2, ligados ao World Engine II da Missão 27 em vez de a um
 * registo paralelo.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ISTO NÃO É COMPLIANCE SECO, E O SPEC É EXPLÍCITO                    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * *"AI geral e AI Governance tornam-se áreas OPERACIONAIS do Sistema, não
 * feeds de notícias nem compliance seco."*
 *
 * O que torna isto operacional e não um formulário: o inventário é sobre a IA
 * que o Daniel **realmente usa** — este assistente incluído, o Oráculo
 * incluído. Um inventário de IA que não se inventaria a si próprio seria a
 * primeira coisa a falhar numa auditoria.
 *
 * E é o domínio de carreira dele: EU AI Act, ISO/IEC 42001, NIST AI RMF. Manter
 * o inventário É estudar, e o estudo tem prova datada. É a diferença entre ler
 * sobre governação e praticá-la sobre si mesmo.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O QUE ESTE FICHEIRO NÃO FAZ                                         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * **Não classifica risco por lei.** Os níveis abaixo são de trabalho interno e
 * não afirmam a classificação de nenhum regulamento — fazê-lo exigiria citar
 * fontes verificadas, e nenhuma foi verificada aqui (mesma disciplina da
 * Missão 31). Um sistema que dissesse "isto é alto risco ao abrigo do artigo X"
 * sem ter lido o artigo X estaria a inventar autoridade.
 */

import type { IsoDate } from '../../types/domain';

/** Nível de risco **de trabalho interno**. Ver a nota do cabeçalho: não é uma
 *  classificação regulatória e não deve ser apresentada como tal. */
export type AiRiskLevel = 'baixo' | 'medio' | 'alto' | 'por-avaliar';

/** Quanto controlo humano existe sobre o que a IA produz. É o campo mais
 *  importante do inventário: quase toda a governação de IA se reduz a "quem
 *  verifica, e antes ou depois de fazer efeito". */
export type HumanOversight =
  /** Um humano aprova antes de qualquer efeito. */
  | 'antes'
  /** Corre sozinha e um humano revê depois. */
  | 'depois'
  /** Ninguém verifica. Não é proibido — é o que tem de ser sabido. */
  | 'nenhum'
  | 'por-definir';

/** Uma utilização de IA. Um registo por USO, não por ferramenta: o mesmo modelo
 *  usado para escrever código e para ler documentos são dois riscos
 *  diferentes, e juntá-los esconde o pior dos dois. */
export interface AiUse {
  id: string;
  /** O que faz, em linguagem de quem usa. */
  name: string;
  /** Para quê. Sem finalidade não há como avaliar proporcionalidade. */
  purpose: string;
  /** Quem fornece o modelo ou o serviço. */
  provider: string;
  /** Que dados toca. Vazio significa "nenhum", não "não sei" — para "não sei"
   *  existe `por-definir` no `oversight` e `por-avaliar` no risco. */
  data: readonly string[];
  /** Toca dados pessoais? `null` é uma resposta legítima e distinta de `false`. */
  personalData: boolean | null;
  oversight: HumanOversight;
  risk: AiRiskLevel;
  /** Quando o risco foi avaliado. **Sem data, a avaliação não conta** — é a
   *  mesma regra da evidência em todo o Sistema. */
  riskAssessedAt?: IsoDate;
  /** Onde está a prova da avaliação: uma nota, um documento, um commit. */
  evidence?: string;
  /** Quando entrou no inventário. */
  addedAt: IsoDate;
  /** Ainda em uso? Um uso descontinuado não sai do inventário — passa a
   *  histórico, porque "já não usamos" é uma resposta de auditoria e apagá-lo
   *  destruiria a única prova de que alguma vez existiu. */
  active: boolean;
}

/** Onde o estado guardaria o inventário. Um só nome, declarado aqui. */
export const AI_USES_KEY = 'aiUses' as const;

/** De quanto em quanto tempo um risco deve ser revisto, por nível. Em dias.
 *
 *  Os números são de trabalho e discutíveis — o que não é discutível é que
 *  **exista** um prazo: uma avaliação de risco sem data de revisão é uma
 *  fotografia a fingir-se de vigilância. */
export const REVIEW_DAYS: Record<AiRiskLevel, number> = {
  alto: 90,
  medio: 180,
  baixo: 365,
  /* Por avaliar não tem prazo de REVISÃO — tem prazo de PRIMEIRA avaliação, e
     esse é curto de propósito: um uso que entra sem avaliação é uma dívida. */
  'por-avaliar': 30,
};

/** O que o inventário diz quando lhe perguntam. */
export interface AiInventory {
  uses: AiUse[];
  active: number;
  /** Usos sem avaliação de risco datada. É o número que interessa primeiro. */
  unassessed: AiUse[];
  /** Usos cuja revisão já passou do prazo, com quantos dias de atraso. */
  overdue: { use: AiUse; daysLate: number }[];
  /** Usos sem controlo humano definido — a lacuna mais séria, porque não se
   *  sabe sequer se alguém verifica. */
  oversightUnknown: AiUse[];
  /** Usos que tocam dados pessoais e não têm risco avaliado. É o cruzamento
   *  que produz a lista de prioridades real. */
  personalDataUnassessed: AiUse[];
  /** Vazio quando há inventário. Ver `readAi`. */
  absence: string;
}
