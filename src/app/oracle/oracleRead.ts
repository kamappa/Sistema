/* A voz do Oráculo no Command Core — read model.
 * Missão 26 · Fase 6B.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A FRONTEIRA, decidida pelo Daniel a 2026-07-29:                     ║
 * ║                                                                       ║
 * ║  SISTEMA  → estado factual, contagens, prazos, telemetria, a          ║
 * ║             Próxima Ação em si, progresso.                            ║
 * ║  ORÁCULO  → interpretação, prioridade EXPLICADA, risco,               ║
 * ║             recomendação, decisão sugerida.                           ║
 * ║                                                                       ║
 * ║  O Oráculo NÃO repete um facto que o Sistema já mostra ao lado.      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Consequência prática, e é a regra que este ficheiro tem de resistir a
 * quebrar: "1 prazo vencido" é do Sistema e já está no visor. O Oráculo só
 * pode dizer o que aquele facto SIGNIFICA para a ordem de trabalho de hoje —
 * e tem de o poder provar.
 *
 * Cada fala traz o `because`: a condição verificável que a produziu. Sem ele
 * seria opinião, e a Constituição não permite ao Oráculo afirmar sem prova.
 *
 * CURTO POR LEI. No Command Core o Oráculo diz no máximo duas coisas, de uma
 * ou duas linhas. A análise extensa pertence à zona Oráculo — misturar as duas
 * transforma um instrumento numa parede de texto, que é o defeito que a Fase 6
 * anda a corrigir do outro lado.
 *
 * NADA AQUI CHAMA UM MODELO. É leitura local, determinística e gratuita. O que
 * custa dinheiro e latência é o Conselho, e continua a ser um sítio próprio.
 */

import { vitals } from '../../state/world.js';
import { daysUntil, today } from '../../state/dates.js';
import type { NextActionReading } from '../core/next-action';

export type NoteKind = 'priority' | 'risk' | 'advice' | 'decision';

export interface OracleNote {
  key: string;
  kind: NoteKind;
  /** A interpretação. Uma frase, duas no máximo. */
  text: string;
  /** A condição verificável que a produziu. Aparece no title, não no corpo —
   *  o corpo é para ler, isto é para auditar. */
  because: string;
  tone?: 'alert';
}

/** Quantas falas cabem antes de isto deixar de ser uma voz e passar a ser uma
 *  lista. Duas: uma sobre a ordem, uma sobre o corpo ou a decisão. */
const MAX_NOTES = 2;

export function readOracleNotes(input: {
  S: Record<string, any> | null;
  action: NextActionReading;
}): OracleNote[] {
  const { S, action } = input;
  if (!S) return [];

  const out: OracleNote[] = [];
  const hoje = today();

  // ── 1 · O RISCO vem primeiro, e vem do corpo ────────────────────────
  // Mesma precedência do Núcleo (coreState.ts) e pela mesma razão: nenhuma
  // notícia do Sistema é mais importante do que o Operador parar.
  let burn = 0;
  try {
    burn = vitals(S).burn ?? 0;
  } catch {
    burn = 0;
  }

  if (burn >= 70) {
    out.push({
      key: 'burn-high',
      kind: 'risk',
      text:
        action.kind === 'oblig'
          ? 'Fecha este pilar e para por hoje. Acumular mais uma sessão em cima deste risco não compra nada — o histórico dos últimos sete dias já está no limite.'
          : 'Fecha esta e para por hoje. O que vier a seguir vai custar-te mais do que rende.',
      because: `vitals().burn = ${burn}% (≥70)`,
      tone: 'alert',
    });
  } else if (burn >= 55) {
    out.push({
      key: 'burn-mid',
      kind: 'risk',
      text: 'Estás a subir em carga. Se hoje escolheres uma só coisa, escolhe esta e deixa o resto para amanhã.',
      because: `vitals().burn = ${burn}% (55–69)`,
    });
  }

  // ── 2 · A PRIORIDADE EXPLICADA ──────────────────────────────────────
  // O Sistema mostra QUAL. Isto diz PORQUE aquela e não outra — que é a
  // pergunta que fica no ar quando se vê uma lista ordenada sem critério à
  // vista.
  const open = (S.objectives ?? []).filter((o: any) => o.status !== 'done');
  const overdue = open.filter((o: any) => o.deadline && daysUntil(o.deadline) < 0);
  const soon = open.filter(
    (o: any) => o.deadline && daysUntil(o.deadline) >= 0 && daysUntil(o.deadline) <= 2
  );

  if (action.kind === 'overdue') {
    const others = open.length - 1;
    out.push({
      key: 'why-overdue',
      kind: 'priority',
      text:
        overdue.length === 1
          ? others > 0
            // "missões" por extenso, e não só o número: o visor mostra "6 à
            // espera" (missões + pilares + decisão) e um "3" nu ao lado lia-se
            // como contradição em vez de recorte.
            ? `Está à frente por ser o único prazo já passado. ${others === 1 ? 'A outra missão espera' : `As outras ${others} missões esperam`} sem custo — esta já está a custar.`
            : 'Está à frente por ser o único prazo já passado.'
          : `${overdue.length} passaram do prazo. Esta vem primeiro por ser a mais antiga a falhar — resolver da mais velha para a mais nova impede que a fila cresça por trás.`,
      because: `${overdue.length} missão(ões) com deadline < ${hoje}`,
    });
  } else if (action.kind === 'urgent') {
    out.push({
      key: 'why-urgent',
      kind: 'priority',
      text:
        soon.length > 1
          ? `Fecham ${soon.length} prazos em dois dias e este é o primeiro. Se só um for feito hoje, que seja este.`
          : 'Ainda não falhou nada. Fechá-la hoje é o que impede que amanhã haja um atraso a explicar.',
      because: `${soon.length} missão(ões) com prazo ≤2 dias`,
    });
  } else if (action.kind === 'doing') {
    out.push({
      key: 'why-doing',
      kind: 'priority',
      text: 'Nada está atrasado. Isto vem primeiro porque já foi começado — trabalho a meio é o mais barato de retomar e o mais caro de deixar arrefecer.',
      because: 'sem prazos vencidos ou a ≤2 dias; existe missão em status doing',
    });
  } else if (action.kind === 'oblig') {
    out.push({
      key: 'why-oblig',
      kind: 'priority',
      text: 'As missões podem esperar; um pilar não se recupera amanhã. O dia fecha-se com este antes de se abrir mais alguma coisa.',
      because: 'sem missões vencidas, urgentes ou em curso; há pilar por fechar hoje',
    });
  } else if (action.kind === 'idle' && open.length > 0) {
    out.push({
      key: 'why-idle',
      kind: 'advice',
      text: `Não há nada a arder. É a altura de mexer no que tem prazo longo — ${open.length === 1 ? 'a missão aberta' : 'as missões abertas'} só ficam urgentes por falta de dias.`,
      because: `${open.length} missão(ões) abertas, nenhuma com prazo ≤2 dias`,
    });
  }

  // ── 3 · A DECISÃO SUGERIDA ──────────────────────────────────────────
  // Só entra se houver espaço. Uma decisão sazonal nunca é mais urgente do que
  // o corpo ou do que a ordem de trabalho do dia.
  if (out.length < MAX_NOTES && action.kind === 'decision') {
    out.push({
      key: 'arc',
      kind: 'decision',
      text: 'Aceitar não te obriga a nada de novo: acrescenta missões do arco à fila e podes fechá-las ao teu ritmo. Adiar mantém o mundo parado até à próxima estação.',
      because: 'arcPending() = true; arcAccept() acrescenta missões e não remove nenhuma',
    });
  }

  return out.slice(0, MAX_NOTES);
}
