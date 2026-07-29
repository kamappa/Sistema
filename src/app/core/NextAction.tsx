/* Próxima Ação — o visor do Command Core.
 * Missão 26 · Fase 5.
 *
 * ORIGEM VISUAL: R26 (trilho + visor). Naquela referência a informação está
 * dividida em duas naturezas: um trilho estreito de leituras técnicas e um
 * visor grande com o objeto de atenção. O que se lê e o que se observa não são
 * a mesma coisa e não têm a mesma medida.
 *
 * Aqui o visor é a ação. É o maior corpo de letra do ecrã — maior do que o
 * nome da zona — porque é a única coisa que responde à pergunta que o
 * Operador traz quando abre o Sistema.
 *
 * EXTRAÍDO da R26: a assimetria (visor >> trilho), o rótulo mono minúsculo
 * como identificação de instrumento, a leitura alinhada à direita.
 * REJEITADO da R26: os cantos em esquadria, a moldura dupla, a marca de água,
 * a densidade de UI de filme que não informa nada. O visor aqui não tem
 * moldura nenhuma — a hierarquia faz-se com luz e escala, que é a lei.
 *
 * O QUE ISTO SUBSTITUI: a faixa vermelha de prazos (`DeadlineBanner`). Era o
 * elemento mais brilhante do Núcleo, dizia que havia um problema e não dava
 * onde o resolver. A urgência passa a ser o MOTIVO desta ação, não uma banda
 * própria — a mesma informação, dita uma vez, no sítio onde é acionável.
 */

import { useStore } from '../../store/useStore.js';
/* O ficheiro do read model chama-se `next-action.ts` e não `nextAction.ts` de
 * propósito: o Windows resolve caminhos sem distinguir maiúsculas, e
 * `./nextAction` apanhava ESTE componente em vez do módulo. Apanhado em runtime
 * — "does not provide an export named 'default'" — e é o género de bug que só
 * aparece em máquinas com sistema de ficheiros insensível a maiúsculas. */
import { readNextAction, type NextActionReading } from './next-action';
import { AM } from '../../state/config.js';

export default function NextAction({ S }: { S: Record<string, any> }) {
  const report = useStore((s: { report: unknown }) => s.report);
  const radar = useStore((s: { radar: unknown[] }) => s.radar);
  const cycleObj = useStore((s: any) => s.cycleObj);
  const toggleHabit = useStore((s: any) => s.toggleHabit);
  const arcAccept = useStore((s: any) => s.arcAccept);

  const r: NextActionReading = readNextAction({ S, report, radar });
  const areaColor = r.area && AM[r.area] ? AM[r.area].color : undefined;

  const run = () => {
    if (!r.act) return;
    if (r.act.verb === 'start' || r.act.verb === 'complete') cycleObj(r.act.id);
    else if (r.act.verb === 'habit') toggleHabit('oblig', r.act.id);
    else if (r.act.verb === 'arc') arcAccept();
  };

  return (
    <section
      className="cc-act panel"
      data-kind={r.kind}
      data-tone={r.tone}
      style={areaColor ? ({ '--cc-area': areaColor } as React.CSSProperties) : undefined}
      aria-labelledby="cc-act-title"
    >
      <header className="cc-act-head">
        <span className="cc-act-label">Próxima ação</span>
        {r.when && <span className="cc-act-when">{r.when}</span>}
      </header>

      <h2 className="cc-act-title" id="cc-act-title">{r.title}</h2>

      {/* O motivo e a prova ficam juntos e por baixo: primeiro percebe-se O QUE
          é, depois PORQUE é esta. Ao contrário, o rótulo roubava a leitura. */}
      <p className="cc-act-why">
        <span className="cc-act-reason">{r.reason}</span>
        <span className="cc-act-ev">{r.evidence}</span>
      </p>

      <div className="cc-act-foot">
        {r.act && (
          <button className="cc-act-go" type="button" onClick={run}>
            {r.act.label}
          </button>
        )}
        {r.queue > 0 && (
          <span className="cc-act-queue">
            {r.queue} {r.queue === 1 ? 'à espera' : 'à espera'}
          </span>
        )}
      </div>
    </section>
  );
}
