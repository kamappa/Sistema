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

import { useState } from 'react';
import { ZONES, DEFAULT_ZONE, zoneById, type ZoneId } from './zones';
import ZoneStage from './ZoneStage';
import OrbitNav from './nav/OrbitNav';
import OraclePresence from './oracle/OraclePresence';
import Atmosphere from './atmosphere/Atmosphere';
import './shell.css';
import './nav/orbit.css';
import SyncState from './SyncState';
import './instrumental.css';
import './core/command-core.css';

interface Props {
  S: Record<string, unknown>;
}

export default function Shell({ S }: Props) {
  const [active, setActive] = useState<ZoneId>(DEFAULT_ZONE);
  const zone = zoneById(active);

  return (
    <div className="sys-shell sys-instrumental" data-nav="orbit">
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
    </div>
  );
}
