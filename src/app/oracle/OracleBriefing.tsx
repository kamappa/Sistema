/* Oráculo · briefing de invocação — Missão 26 · Fase D.
 *
 * O PROBLEMA: invocar o Oráculo abria um painel com um campo de escrita vazio.
 * Isso é uma caixa de chat, e a Constituição proíbe-o por nome. Pior: punha o
 * trabalho todo do lado do Daniel — ele tinha de saber o que perguntar a uma
 * inteligência que já estava a ver o estado inteiro.
 *
 * O QUE MUDA: ao ser invocado, o Oráculo diz primeiro o que JÁ SABE. O campo de
 * escrita continua lá, mas por baixo, e deixa de ser a primeira coisa. É a
 * diferença entre "pergunta-me alguma coisa" e "isto é o que estou a ver".
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  SÓ FACTOS. Cada linha traz a evidência que a produziu. Nada aqui é  ║
 * ║  interpretação, conselho ou previsão — isso é trabalho do modelo, e  ║
 * ║  vem do Conselho, com custo e latência. Isto lê o estado local.      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Se não houver nada verdadeiro para dizer, o briefing não aparece. Um resumo
 * que se esforça por ter conteúdo todos os dias é o chatbot barulhento que o
 * 01_ORACLE_IDEOLOGY proíbe.
 */

import { useStore } from '../../store/useStore.js';
import { vitals } from '../../state/world.js';
import { seasonArcNow } from '../../state/world.js';

interface Item {
  key: string;
  /** o que é. Curto, factual. */
  head: string;
  /** de onde veio. Sem isto seria um sinal, não uma prova. */
  evidence: string;
  tone?: 'alert' | 'good';
}

export default function OracleBriefing() {
  const S = useStore((s: { S: Record<string, any> | null }) => s.S);
  const radar = useStore((s: { radar: unknown[] }) => s.radar);
  const report = useStore((s: { report: unknown }) => s.report);

  const items = read({ S, radar, report });
  if (!items.length) return null;

  return (
    <section className="sys-oracle-brief" aria-label="O que o Oráculo está a ver">
      <h3 className="sys-oracle-brief-h">O que estou a ver</h3>
      <ul className="sys-oracle-brief-list">
        {items.map((i) => (
          <li key={i.key} data-tone={i.tone}>
            <span className="ob-head">{i.head}</span>
            <span className="ob-ev">{i.evidence}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function read({
  S,
  radar,
  report,
}: {
  S: Record<string, any> | null;
  radar: unknown[];
  report: unknown;
}): Item[] {
  const out: Item[] = [];
  if (!S) return out;
  const hoje = new Date().toISOString().slice(0, 10);

  // 1. Corpo primeiro — a mesma precedência do Núcleo, pela mesma razão.
  try {
    const v = vitals(S);
    if (v.burn >= 60) {
      out.push({
        key: 'burn',
        head: `Risco de burnout a ${v.burn}%`,
        evidence: 'calculado das tuas streaks, sono e volume de XP dos últimos 7 dias',
        tone: 'alert',
      });
    }
  } catch { /* sem histórico não se afirma nada */ }

  // 2. O que está mesmo atrasado.
  const overdue = (S.objectives ?? []).filter(
    (o: any) => o.status !== 'done' && o.deadline && o.deadline < hoje
  );
  if (overdue.length) {
    out.push({
      key: 'overdue',
      head: `${overdue.length} ${overdue.length === 1 ? 'missão passou' : 'missões passaram'} do prazo`,
      evidence: overdue.slice(0, 2).map((o: any) => o.title).join(' · '),
      tone: 'alert',
    });
  }

  // 3. O que está em curso — o Oráculo tem de saber onde o trabalho já começou.
  const doing = (S.objectives ?? []).filter((o: any) => o.status === 'doing');
  if (doing.length) {
    out.push({
      key: 'doing',
      head: `${doing.length} em curso`,
      evidence: doing.slice(0, 2).map((o: any) => o.title).join(' · '),
    });
  }

  // 4. Obrigatórios por fechar hoje. Facto do dia, não julgamento.
  const porFazer = (S.oblig ?? []).filter((h: any) => h.lastDone !== hoje);
  if (porFazer.length) {
    out.push({
      key: 'oblig',
      head: `${porFazer.length} ${porFazer.length === 1 ? 'obrigatório' : 'obrigatórios'} por fechar hoje`,
      evidence: porFazer.map((h: any) => h.name).join(' · '),
    });
  }

  // 5. Decisão pendente do mundo.
  try {
    const arc = seasonArcNow();
    if (arc && (!S.worldArc || S.worldArc.id !== arc.id || S.worldArc.status === 'proposed')) {
      out.push({
        key: 'arc',
        head: 'Um arco da estação está por decidir',
        evidence: arc.name ?? 'arco sazonal',
      });
    }
  } catch { /* sem arco, sem linha */ }

  // 6. Material novo para ler.
  if (report) {
    out.push({ key: 'report', head: 'Relatório da semana disponível', evidence: 'escrito no domingo à noite', tone: 'good' });
  }
  if (Array.isArray(radar) && radar.length) {
    out.push({ key: 'radar', head: `${radar.length} ${radar.length === 1 ? 'sinal' : 'sinais'} no Radar`, evidence: 'últimos 7 dias' });
  }

  return out;
}
