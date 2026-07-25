/* Shell da Sala de Operações — Missão 26 · Fase 2.
 *
 * Hospeda a navegação (B1 consola / B2 órbita), o palco de zonas e a presença
 * do Oráculo. A variação é fixa durante a sessão e vem do ?shell=.
 *
 * O que esta shell NÃO faz, de propósito nesta fase: não edita os painéis, não
 * escreve estado, não toca no store de domínio. A zona ativa é estado local de
 * preview — não persiste em lado nenhum.
 */

import { useState } from 'react';
import { ZONES, DEFAULT_ZONE, zoneById, type ZoneId } from './zones';
import type { ShellVariant } from './useShellVariant';
import ZoneStage from './ZoneStage';
import RailNav from './nav/RailNav';
import OrbitNav from './nav/OrbitNav';
import OraclePresence from './oracle/OraclePresence';
import Atmosphere from './atmosphere/Atmosphere';
import './shell.css';
import './b1.css';
import './b2.css';
import './instrumental.css';

interface Props {
  variant: ShellVariant;
  S: Record<string, unknown>;
}

export default function Shell({ variant, S }: Props) {
  const [active, setActive] = useState<ZoneId>(DEFAULT_ZONE);
  const zone = zoneById(active);
  // A instrumental (B2.1) usa a navegação orbital da B2 — a identidade é dela.
  // O que muda é a composição interna das zonas, decidida por densidade.
  const Nav = variant === 'b1' ? RailNav : OrbitNav;

  return (
    <div
      className={`sys-shell sys-${variant}`}
      data-variant={variant}
      // A navegação é um sistema à parte da composição: B2 e B2.1 partilham a
      // órbita (é ela a identidade), e só a composição interna difere.
      data-nav={variant === 'b1' ? 'rail' : 'orbit'}
    >
      <Atmosphere />

      <Nav zones={ZONES} active={active} onSelect={setActive} S={S} />

      <div className="sys-stage-wrap">
        <header className="sys-zone-head">
          <h1 className="sys-zone-name">{zone.name}</h1>
          <p className="sys-zone-purpose">{zone.purpose}</p>
        </header>
        <ZoneStage active={active} S={S} />
      </div>

      <OraclePresence />
    </div>
  );
}
