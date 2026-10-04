/* WAR ROOM — read model.
 * Missão 26 · Fase 6B, segunda passagem.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A CORREÇÃO MAIS IMPORTANTE DESTE FICHEIRO É UM RÓTULO.              ║
 * ║                                                                       ║
 * ║  A maqueta dizia, nos quatro blocos: "DADOS AINDA NÃO LIGADOS".      ║
 * ║  Isso implica que os dados EXISTEM e só falta a ligação. Para os     ║
 * ║  Projetos e os Riscos é verdade. Para os Agentes e a Money Machine   ║
 * ║  é FALSO — esses subsistemas não existem em lado nenhum: não há      ║
 * ║  registry de agentes, não há pipeline, não há nada por ligar.        ║
 * ║                                                                       ║
 * ║  Dizer "ainda não ligado" sobre uma coisa que não existe é uma       ║
 * ║  mentira por implicatura, e é exatamente a classe de erro que esta   ║
 * ║  missão anda a corrigir desde a Fase I.                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Passam a existir dois estados distintos e visíveis:
 *   `live`    — ligado a estado real, com a origem declarada;
 *   `absent`  — o subsistema NÃO EXISTE. Não é uma promessa por cumprir; é
 *               uma coisa que ainda não foi construída, e diz-se assim.
 *
 * Nenhum bloco inventa um número. Onde não há valor, há travessão.
 */

import { today, daysUntil } from '../../state/dates.js';
import { vitals, seasonArcNow } from '../../state/world.js';

export type BlockState = 'live' | 'absent';

export interface Field {
  label: string;
  value: string;
  /** De onde saiu. Sem isto seria um número sem prova. */
  from?: string;
  tone?: 'alert' | 'good';
}

export interface Block {
  id: string;
  name: string;
  state: BlockState;
  /** Só em `live`. */
  fields?: Field[];
  /** Só em `absent`: o que falta existir, e porquê ainda não existe. */
  missing?: string;
  /** Só em `absent`: a regra que impede improvisar. */
  rule?: string;
}

export function readWarRoom(S: Record<string, any> | null): Block[] {
  const hoje = today();

  /* ── OPERAÇÕES ── real, e é o que a War Room coordena hoje. */
  const objs = (S?.objectives ?? []) as any[];
  const open = objs.filter((o) => o.status !== 'done');
  const doing = open.filter((o) => o.status === 'doing');
  const overdue = open.filter((o) => o.deadline && daysUntil(o.deadline) < 0);
  const next = open
    .filter((o) => o.deadline && daysUntil(o.deadline) >= 0)
    .sort((a, b) => (a.deadline < b.deadline ? -1 : 1))[0];
  const oblig = (S?.oblig ?? []) as any[];
  const obligDone = oblig.filter((h) => h.lastDone === hoje).length;

  const operations: Block = {
    id: 'ops',
    name: 'Operações',
    state: 'live',
    fields: [
      { label: 'Em curso', value: String(doing.length), from: 'missões em status doing' },
      { label: 'Abertas', value: String(open.length), from: 'missões por concluir' },
      {
        label: 'Próxima entrega',
        value: next ? `${next.title.slice(0, 34)}${next.title.length > 34 ? '…' : ''}` : '—',
        from: next ? `prazo ${next.deadline}` : 'nenhuma missão aberta com prazo futuro',
      },
      {
        label: 'Pilares hoje',
        value: oblig.length ? `${obligDone} de ${oblig.length}` : '—',
        from: 'hábitos obrigatórios marcados hoje',
        tone: oblig.length > 0 && obligDone === oblig.length ? 'good' : undefined,
      },
    ],
  };

  /* ── SINAIS DE RISCO ──
   * DERIVADOS, e o nome do bloco diz isso. NÃO é um registo de riscos: o
   * domínio não tem um, e chamar-lhe "Riscos · abertos / aceites / em
   * escalada" seria inventar uma taxonomia de gestão de risco que ninguém
   * escreveu. O que existe são dois factos duros e um estimado. */
  let burn = 0;
  try { burn = vitals(S as any).burn ?? 0; } catch { burn = 0; }

  const risk: Block = {
    id: 'risk',
    name: 'Sinais de risco',
    state: 'live',
    fields: [
      {
        label: 'Prazos vencidos',
        value: String(overdue.length),
        from: overdue.length ? overdue.slice(0, 2).map((o) => o.title).join(' · ') : 'nenhum',
        tone: overdue.length > 0 ? 'alert' : undefined,
      },
      {
        label: 'Carga',
        value: burn + '%',
        from: 'streaks, sono e volume de XP dos últimos 7 dias',
        tone: burn >= 70 ? 'alert' : undefined,
      },
      {
        label: 'Recovery',
        value: S?.recovery && hoje <= S.recovery.until ? `ativo até ${S.recovery.until}` : '—',
        from: 'estado guardado',
      },
    ],
  };

  /* ── ARCO ── o que o mundo está a coordenar. */
  let arcField: Field;
  try {
    const a = seasonArcNow();
    const wa = S?.worldArc;
    arcField = a && wa && wa.id === a.id && wa.status === 'active'
      ? { label: 'Arco ativo', value: a.name, from: `até ${wa.end}` }
      : { label: 'Arco ativo', value: '—', from: a ? `${a.name} por decidir` : 'sem arco' };
  } catch {
    arcField = { label: 'Arco ativo', value: '—', from: 'sem arco' };
  }

  const world: Block = {
    id: 'world',
    name: 'Mundo',
    state: 'live',
    fields: [
      arcField,
      {
        label: 'Missões do arco',
        value: String(objs.filter((o) => o.arc).length),
        from: 'missões criadas pela aceitação de um arco',
      },
      {
        label: 'Sombras',
        value: String((S?.shadows ?? []).length),
        from: 'missões erguidas',
      },
    ],
  };

  /* ── OS QUE NÃO EXISTEM ──
   * Não são maquetas à espera de cabo. São subsistemas por construir, e a
   * Constituição tem uma regra específica sobre improvisar cada um deles. */
  const agents: Block = {
    id: 'agents',
    name: 'Agentes',
    state: 'absent',
    missing:
      'Não existe registry de agentes. Não há nada a ligar — há um subsistema por construir.',
    // Sem número de exemplo, nem entre aspas: um valor plausível no ecrã lê-se
    // de relance, e quem passa os olhos não distingue a citação do dado.
    rule:
      'A Constituição proíbe conceder permissões a agentes sem registry, e proíbe autoelevação de privilégios. Mostrar uma contagem de agentes ativos seria inventar o próprio registry.',
  };

  const money: Block = {
    id: 'money',
    name: 'Money Machine',
    state: 'absent',
    missing:
      'Não existe pipeline, não existem drafts, não existe fila de aprovação.',
    rule:
      'A Constituição exige consentimento explícito para ações externas críticas. Enquanto não houver o mecanismo de consentimento, não há o que mostrar.',
  };

  return [operations, risk, world, agents, money];
}
