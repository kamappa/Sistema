/* A fila atrás da Próxima Ação — Command Core.
 * Missão 26 · Fase 5.
 *
 * O visor mostra UMA coisa. Esta é a coluna que impede que isso se torne uma
 * mentira por omissão: a decisão que o mundo deixou em aberto e o trabalho que
 * espera atrás.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  NÃO DUPLICA O VISOR. O item que está no visor sai desta lista —     ║
 * ║  ver `skipId`. Dizer a mesma coisa duas vezes na mesma coluna é o    ║
 * ║  erro que esta missão anda a corrigir desde a Fase E.                ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ORDEM: decisão primeiro, fila depois. Medido — com a fila em cima, os três
 * botões da decisão caíam 40px abaixo da dobra a 1440×900, e uma decisão que
 * exige scroll para se saber que existe é uma decisão escondida. A ordem passa
 * a ser a mesma da precedência da Próxima Ação: o que exige resposta vem antes
 * do que exige trabalho.
 *
 * O horizonte (eventos a ≤7 dias) NÃO está aqui — está na coluna do estado,
 * em `CoreHorizon`. Um exame que aí vem é calendário do mundo, não fila de
 * trabalho, e separá-los equilibrou as duas colunas: 895/649 passou a 724/680.
 *
 * ORIGEM VISUAL: R26 — o trilho de leituras emparelhadas, rótulo à esquerda e
 * medida à direita, separadas por espaço e não por caixas.
 */

import { useStore } from '../../store/useStore.js';
import { daysUntil, today } from '../../state/dates.js';
import { seasonArcNow } from '../../state/world.js';
import { AM } from '../../state/config.js';
import { readNextAction, whenLabel, arcPending } from './next-action';
import { Block, type Row } from './CoreRows';

/** Quantas linhas de trabalho cabem antes de a lista deixar de se ler de
 *  relance. O resto não desaparece: é contado na última linha. */
const MAX_ROWS = 4;

export default function CoreQueue({ S }: { S: Record<string, any> }) {
  const report = useStore((s: { report: unknown }) => s.report);
  const radar = useStore((s: { radar: unknown[] }) => s.radar);
  const arcAccept = useStore((s: any) => s.arcAccept);
  const arcLater = useStore((s: any) => s.arcLater);
  const arcIgnore = useStore((s: any) => s.arcIgnore);

  const cur = readNextAction({ S, report, radar });
  const skipId = cur.act?.id;
  const hoje = today();

  const open = (S.objectives ?? [])
    .filter((o: any) => o.status !== 'done' && o.id !== skipId)
    .sort((a: any, b: any) => {
      const da = a.deadline ? daysUntil(a.deadline) : Infinity;
      const db = b.deadline ? daysUntil(b.deadline) : Infinity;
      return da === db ? (a.id < b.id ? -1 : 1) : da - db;
    });

  const rows: Row[] = open.slice(0, MAX_ROWS).map((o: any) => ({
    key: o.id,
    label: o.title,
    read: o.deadline ? whenLabel(o.deadline) : 'sem prazo',
    color: o.area && AM[o.area] ? AM[o.area].color : undefined,
    late: !!o.deadline && daysUntil(o.deadline) < 0,
  }));

  // O que não coube conta-se. Uma lista truncada em silêncio esconde trabalho.
  const rest = open.length - rows.length;
  if (rest > 0) {
    rows.push({ key: 'rest', label: `mais ${rest} ${rest === 1 ? 'missão aberta' : 'missões abertas'}`, read: 'em Operações', quiet: true });
  }

  const pilares = (S.oblig ?? []).filter((h: any) => h.lastDone !== hoje && h.id !== skipId);
  if (pilares.length) {
    rows.push({
      key: 'oblig',
      label: `${pilares.length} ${pilares.length === 1 ? 'pilar' : 'pilares'} por fechar`,
      read: pilares.map((h: any) => h.name).join(' · '),
    });
  }

  const pending = arcPending(S);
  const arc = pending ? seasonArcNow() : null;

  if (!rows.length && !arc) return null;

  return (
    <section className="cc-queue panel" aria-label="O que espera">
      {arc && (
        <div className="cc-block cc-decision">
          <h3 className="cc-block-h">Decisão</h3>
          <p className="cc-dec-t">{arc.name}</p>
          {/* O boss do arco não entra aqui: não faz parte da decisão, e é
              matéria do Universo. O que decide é o que o arco muda. */}
          <p className="cc-dec-d">{arc.desc}</p>
          <div className="cc-dec-acts">
            {cur.kind !== 'decision' && (
              <button className="mini" type="button" onClick={() => arcAccept()}>
                Aceitar arco (+15 {AM.mente.name})
              </button>
            )}
            <button className="mini" type="button" onClick={() => arcLater()}>Mais tarde</button>
            <button className="mini" type="button" onClick={() => arcIgnore()}>Ignorar</button>
          </div>
        </div>
      )}

      {rows.length > 0 && <Block name="Em espera" rows={rows} />}
    </section>
  );
}
