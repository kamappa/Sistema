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
import OracleSigil from './OracleSigil';

interface Signal {
  key: string;
  text: string;
  tone?: 'alert';
}

export default function OracleAmbient({ onInvoke }: { onInvoke: () => void }) {
  const radar = useStore((s: { radar: unknown[] }) => s.radar);
  const report = useStore((s: { report: unknown }) => s.report);
  const S = useStore((s: { S: Record<string, any> | null }) => s.S);
  const fetchErr = useStore((s: { fetchErr: string | null }) => s.fetchErr);
  // Missão 26 · 6B — o Oráculo passa a MOSTRAR que está a pensar. Antes, pedir
  // um conselho deixava a faixa exactamente igual: a única prova de que algo
  // estava a acontecer vivia dentro do painel aberto, e quem o fechasse ficava
  // sem saber se tinha perguntado.
  const busy = useStore((s: { ocBusy: boolean }) => s.ocBusy);

  const signals = collectSignals({ radar, report, S });

  // Uma falha de rede ganha a tudo o resto: os outros sinais podem estar
  // desactualizados e o Operador tem de saber isso ANTES de confiar neles.
  if (fetchErr) {
    return (
      <button type="button" className="sys-oracle-ambient" onClick={onInvoke}
        aria-label="Abrir o Oráculo" data-tone="alert">
        <OracleSigil signals={0} alert />
        <span className="sys-oracle-line">
          <span data-tone="alert">Sem ligação ao Radar — o que vês pode estar desatualizado.</span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="sys-oracle-ambient"
      onClick={onInvoke}
      aria-label="Abrir o Oráculo"
    >
      {/* O sigilo substitui o ponto estático: a amplitude da onda É a contagem
          de sinais. Um ponto que nunca muda não é presença, é um marcador. */}
      <OracleSigil
        signals={signals.length}
        alert={signals.some((s) => s.tone === 'alert')}
        busy={busy}
      />
      {busy ? (
        // O texto acompanha a forma. Sem ele, quem usa leitor de ecrã via a
        // contagem de sinais e não sabia que havia um pedido em curso.
        <span className="sys-oracle-silent" aria-live="polite">A pensar.</span>
      ) : signals.length === 0 ? (
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
