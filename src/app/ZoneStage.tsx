/* Palco de zonas — Missão 26 · Fase 2.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  TODAS AS ZONAS FICAM MONTADAS. A troca de zona é de VISIBILIDADE,   ║
 * ║  nunca de montagem.                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Condição explícita do Daniel, e a decisão técnica mais importante desta
 * tarefa. Desmontar ao mudar de zona custaria: remount, useEffect repetido,
 * pedidos de rede duplicados, perda de estado local (os filtros do Objectives,
 * os inputs do Training, o mês aberto no Calendar), perda de scroll interno e —
 * o pior — reinicialização do contexto WebGL das Constelações, que se prende ao
 * canvas e tem um guard de módulo justamente porque não sobrevive a isso.
 *
 * Porquê `visibility:hidden` e não `display:none`:
 *   `display:none` colapsa a caixa de layout, o canvas das Constelações passa a
 *   0×0 e ao voltar precisava de resize — exatamente o problema que se quer
 *   evitar. Com `visibility:hidden` a caixa mantém-se, o canvas mantém as
 *   dimensões e o contexto WebGL fica intacto.
 *
 * Acessibilidade: as zonas inativas levam `inert` (fora da ordem de tabulação e
 * fora da árvore de acessibilidade). Isto é diferente do conteúdo VISUALMENTE
 * recuado da B2, que permanece acessível — recuar não é esconder.
 */

import { useEffect, useRef } from 'react';
import { ZONES, type ZoneId } from './zones';

interface Props {
  active: ZoneId;
  S: Record<string, unknown>;
}

export default function ZoneStage({ active, S }: Props) {
  return (
    <div className="sys-stage" data-active={active}>
      {ZONES.map((z) => (
        <ZonePane key={z.id} zoneId={z.id} density={z.density} isActive={z.id === active}>
          {/* Os grupos vêm do registo. A composição é decidida por CSS a partir
              de data-density e data-weight — nunca por verificações do nome da
              zona espalhadas pelo JSX. */}
          {z.groups.map((g) => (
            <div key={g.id} className="sys-group" data-group={g.id} data-weight={g.weight}>
              {g.name && <h2 className="sys-group-name">{g.name}</h2>}
              {g.panels.map((Panel, i) => (
                <Panel key={i} S={S} />
              ))}
            </div>
          ))}
        </ZonePane>
      ))}
    </div>
  );
}

function ZonePane({
  zoneId,
  density,
  isActive,
  children,
}: {
  zoneId: ZoneId;
  density: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // `inert` ainda não está tipado de forma estável em todos os @types/react
  // desta versão; aplicado por atributo para não depender disso.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isActive) el.removeAttribute('inert');
    else el.setAttribute('inert', '');
  }, [isActive]);

  return (
    <section
      ref={ref}
      className="sys-zone"
      data-zone={zoneId}
      data-density={density}
      data-active={isActive ? 'true' : 'false'}
      aria-hidden={isActive ? undefined : true}
    >
      <div className="sys-zone-scroll">
        <div className="sys-zone-body">{children}</div>
      </div>
    </section>
  );
}
