/* Oráculo · Ambient — presença discreta permanente.
 * Missão 26 · Fase 2.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  SÓ DADOS REAIS. Nenhuma contagem inventada, nenhum número de         ║
 * ║  demonstração. Se não houver nada, o Oráculo cala-se.                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O silêncio não é um estado vazio por falta de conteúdo — é o comportamento
 * que a Constituição exige: "silencioso antes de redundante", "ficar em
 * silêncio quando não existe valor". Uma barra que anuncia "0 sinais" todos os
 * dias é exatamente o chatbot barulhento que o 01_ORACLE_IDEOLOGY proíbe.
 *
 * NÃO é um cartão: faixa fina, material próprio (--sys-mat-oracle), sem borda
 * e sem sombra. É o que a distingue dos 19 painéis.
 */

import { useStore } from '../../store/useStore.js';
import { seasonArcNow } from '../../state/world.js';

interface Signal {
  key: string;
  text: string;
  tone?: 'alert';
}

export default function OracleAmbient({ onInvoke }: { onInvoke: () => void }) {
  const radar = useStore((s: { radar: unknown[] }) => s.radar);
  const report = useStore((s: { report: unknown }) => s.report);
  const S = useStore((s: { S: Record<string, any> | null }) => s.S);

  const signals = collectSignals({ radar, report, S });

  return (
    <button
      type="button"
      className="sys-oracle-ambient"
      onClick={onInvoke}
      aria-label="Abrir o Oráculo"
    >
      <span className="sys-oracle-mark" aria-hidden="true" />
      {signals.length === 0 ? (
        <span className="sys-oracle-silent">O Oráculo observa.</span>
      ) : (
        <span className="sys-oracle-line">
          {signals.map((s, i) => (
            <span key={s.key} data-tone={s.tone}>
              {i > 0 && <span className="sys-oracle-sep"> · </span>}
              {s.text}
            </span>
          ))}
        </span>
      )}
    </button>
  );
}

/** Cada sinal tem de nascer de um facto verificável no estado. */
function collectSignals({
  radar,
  report,
  S,
}: {
  radar: unknown[];
  report: unknown;
  S: Record<string, any> | null;
}): Signal[] {
  const out: Signal[] = [];

  if (Array.isArray(radar) && radar.length > 0) {
    out.push({
      key: 'radar',
      text: `${radar.length} ${radar.length === 1 ? 'sinal' : 'sinais'} no Radar`,
    });
  }

  if (report) {
    out.push({ key: 'report', text: 'relatório da semana disponível' });
  }

  if (S) {
    // Decisão real e pendente: um arco da estação proposto e ainda por responder.
    try {
      const arc = seasonArcNow();
      const pendingArc = arc && (!S.worldArc || S.worldArc.id !== arc.id || S.worldArc.status === 'proposed');
      if (pendingArc) out.push({ key: 'arc', text: '1 decisão pendente' });
    } catch {
      /* sem arco, sem sinal — melhor calar que adivinhar */
    }

    // Prazos vencidos: facto duro, lido das missões.
    // O campo é `deadline` — é o que o store escreve (useStore.js:191) e o que
    // Objectives/DeadlineBanner leem. `due` pertence ao SM-2 da Revisão Ativa e
    // NUNCA existe num objetivo: lê-lo aqui punha este sinal a zero para
    // sempre com dados reais, que é precisamente a mentira que a lei proíbe.
    const hoje = new Date().toISOString().slice(0, 10);
    const overdue = (S.objectives ?? []).filter(
      (o: { status: string; deadline?: string | null }) =>
        o.status !== 'done' && o.deadline && o.deadline < hoje
    ).length;
    if (overdue > 0) {
      out.push({
        key: 'overdue',
        text: `${overdue} ${overdue === 1 ? 'prazo vencido' : 'prazos vencidos'}`,
        tone: 'alert',
      });
    }
  }

  return out;
}
