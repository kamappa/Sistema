/* Shell do Sistema — Órbita Instrumental (B2.1).
 * Missão 26 · Fase 3, consolidada 2026-07-25.
 *
 * Direção escolhida pelo Daniel depois do teste de stress da zona Operações:
 * a B2 define shell, Núcleo, cosmologia, atmosfera, navegação e presença do
 * Oráculo; os princípios arquitetónicos da B1 entram apenas na organização
 * interna das zonas densas, através da densidade declarada em `zones.ts`.
 *
 * As variações B1 (consola) e B2 (órbita pura) foram removidas depois de a
 * instrumental passar todos os gates. Ficam no histórico: `git log --oneline
 * -- src/app` a partir do commit da Fase 2.
 *
 * O que esta shell NÃO faz, de propósito: não edita os painéis, não escreve
 * estado, não toca no store de domínio. A zona ativa é estado local de preview
 * e não persiste em lado nenhum.
 */

import { useEffect, useState } from 'react';
import { ZONES, DEFAULT_ZONE, zoneById, type ZoneId } from './zones';
import ZoneStage from './ZoneStage';
import OrbitNav from './nav/OrbitNav';
import OraclePresence from './oracle/OraclePresence';
import Atmosphere from './atmosphere/Atmosphere';
import './shell.css';
import './nav/orbit.css';
import SyncState from './SyncState';
import SystemEventLayer from './events/SystemEventLayer';
import { installSystemEventBridge } from './events/systemEvents';
import { startMotionRegime } from './motion/motionTier';
import { activeArcTheme } from './arcs/arcModel';
import './instrumental.css';
import './core/command-core.css';
import './motion/motion-regime.css';
import './arcs/arc-layer.css';

interface Props {
  S: Record<string, unknown>;
}

export default function Shell({ S }: Props) {
  const [active, setActive] = useState<ZoneId>(DEFAULT_ZONE);
  const zone = zoneById(active);

  // O regime de movimento e a ponte de eventos instalam-se uma vez. Ambos são
  // idempotentes de propósito: o StrictMode do React 18 corre efeitos duas
  // vezes em desenvolvimento, e uma segunda instalação não pode duplicar
  // listeners nem anúncios.
  useEffect(() => {
    startMotionRegime();
    installSystemEventBridge();
  }, []);

  /* ARC LAYER (Fase 7). A shell lê o arco ativo por UM read model e passa-o ao
     CSS por custom property. Nenhum componente pergunta "isto é o Summer Arc?"
     — trocar de estação troca duas cores e uma direção, e mais nada. */
  const arc = activeArcTheme(S);

  return (
    <div
      className="sys-shell sys-instrumental"
      data-nav="orbit"
      data-arc={arc?.id}
      data-arc-flow={arc?.motif.flow}
      style={
        arc
          ? ({
              '--arc-accent': arc.motif.accent,
              '--arc-accent-soft': arc.motif.accentSoft,
              '--arc-presence': 1,
            } as React.CSSProperties)
          : undefined
      }
    >
      <Atmosphere />

      <OrbitNav zones={ZONES} active={active} onSelect={setActive} S={S} />

      <div className="sys-stage-wrap">
        <header className="sys-zone-head">
          <h1 className="sys-zone-name">{zone.name}</h1>
          <p className="sys-zone-purpose">{zone.purpose}</p>
        </header>
        <ZoneStage active={active} S={S} />
      </div>

      <OraclePresence />
      {/* O estado de gravacao vive na faixa de sistema: nunca foi mostrado na
          shell, e uma gravacao falhada em silencio contradiz o estado guardado. */}
      <div className="sys-sync-slot"><SyncState /></div>
      {/* Anúncios de eventos: um dominante de cada vez, os outros em fila. */}
      <SystemEventLayer />
    </div>
  );
}
