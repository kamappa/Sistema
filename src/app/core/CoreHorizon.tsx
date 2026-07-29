/* O horizonte — o que aí vem, na coluna do estado.
 * Missão 26 · Fase 5.
 *
 * De onde veio: era a segunda metade do `DeadlineBanner`, a faixa vermelha que
 * a Fase 5 removeu. Os eventos a ≤ 7 dias não se perderam — mudaram de sítio e
 * ganharam um cabeçalho que diz o que são. A faixa dizia "URGENTE ⚠" sobre um
 * exame que era daqui a três dias; isso não é urgência, é calendário.
 *
 * PORQUE FICA À ESQUERDA e não na fila: um exame ou uma entrega não são
 * trabalho que se despache com um botão — são factos do mundo que enquadram a
 * decisão. A coluna do estado é onde vive o que enquadra; a da ação é onde vive
 * o que se executa. A separação também equilibrou as colunas, que estavam a
 * 895 contra 649.
 *
 * A janela de 7 dias é herdada, não inventada (`hud.js:111-121`).
 */

import { daysUntil } from '../../state/dates.js';
import { whenLabel } from './next-action';
import { Block, type Row } from './CoreRows';

const WINDOW_DAYS = 7;

export default function CoreHorizon({ S }: { S: Record<string, any> }) {
  const rows: Row[] = (S.events ?? [])
    .map((e: any) => ({ e, d: daysUntil(e.date) }))
    .filter((x: any) => x.d >= 0 && x.d <= WINDOW_DAYS)
    .sort((a: any, b: any) => a.d - b.d)
    .slice(0, 3)
    .map((x: any) => ({
      key: x.e.id ?? x.e.title,
      label: x.e.title,
      read: whenLabel(x.e.date),
      late: x.d === 0,
    }));

  // Sem nada nos próximos sete dias, não há secção. Um cabeçalho "Horizonte"
  // sobre uma lista vazia diria que o Sistema está a olhar e não vê nada — e o
  // que se passa é que não há nada para ver.
  if (!rows.length) return null;

  return (
    <section className="cc-horizon panel" aria-label="O que aí vem">
      <Block name="Horizonte" rows={rows} />
    </section>
  );
}
