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
import BootSequence from './motion/BootSequence';
import { installSystemEventBridge } from './events/systemEvents';
import { startMotionRegime } from './motion/motionTier';
import { activeArcTheme } from './arcs/arcModel';
import { useWorld } from './world/useWorld';
import { hashStr } from '../state/world';
import './instrumental.css';
import './core/command-core.css';
import './motion/motion-regime.css';
import './motion/transitions.css';
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

  /* WORLD ENGINE II (M27·F2). O arco é a estação; o evento é o momento. Um
     momento não reescreve uma estação — modula-a. Por isso `--arc-accent` fica
     intocado e o mundo contribui variáveis próprias, que compõem por cima.
     Ver `world/useWorld.ts` para as duas regras que limitam o estrago. */
  const { vars: worldVars, flag: worldFlag } = useWorld(S);

  return (
    <div
      className="sys-shell sys-instrumental"
      data-nav="orbit"
      data-arc={arc?.id}
      data-arc-flow={arc?.motif.flow}
      data-arc-materia={arc?.motif.materia}
      data-world={worldFlag}
      style={{
        ...(arc
          ? {
              '--arc-accent': arc.motif.accent,
              '--arc-accent-soft': arc.motif.accentSoft,
              '--arc-presence': 1,
            }
          : {}),
        ...worldVars,
      } as React.CSSProperties}
    >
      <Atmosphere />

      {/* ── A MATÉRIA DA ESTAÇÃO — Fase 7Z ──
          Uma partícula é matéria da estação, e é a MESMA camada para as quatro: o que
          muda é o `data-arc-materia`, que o CSS lê. Continua a não existir
          `<BloomLayer/>` nem um `if (arc.id === ...)` em componente nenhum — a
          disciplina desta camada desde a Fase 7 é essa, e não se quebra por
          causa de partículas.

          Vinte e quatro, e o número foi MEDIDO e não escolhido: com doze, o
          diff de pixéis com e sem a camada dava 0.06% do ecrã no inverno — a
          matéria existia no DOM e não se via. Vinte e quatro chega para a
          população difusa que R29 pede sem passar a ruído. O custo por frame
          continua indistinguível de zero (8.3 ms contra 8.4 ms sem ela).

          `data-ambient` está na camada E em cada partícula, e não é descuido: o
          `motion-regime.css` desliga o ambiente no modo `calm` com um seletor que
          NÃO desce (`[data-ambient]`, `::before`, `::after`). A animação vive nas
          partículas, não no contentor — sem a marca em cada uma, o modo de
          poupança de bateria deixava a matéria a correr. Medido: com a marca só
          no contentor, `calm` dava `animationPlayState: running`.

          A dispersão vem do `hashStr`, que é o gerador determinístico do
          projeto — a mesma estação dá sempre a mesma disposição, e um mundo que
          se reordena a cada render não é um mundo. O CSS recebe números puros
          (`--x`, `--y`, `--r`) porque `calc` não tem módulo nem aleatório: a
          aritmética que precisa de resto faz-se aqui, uma vez. */}
      {arc && (
        <div className="arc-materia" data-ambient aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => {
            const h = hashStr('materia:' + arc.id + ':' + i);
            return (
              <span
                key={i}
                data-ambient
                style={{
                  '--i': i,
                  '--x': 4 + (h % 92),
                  '--y': (h >>> 7) % 100,
                  '--r': ((h >>> 15) % 100) / 100,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}

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
      {/* A entrada. Uma vez por sessão, nunca bloqueia, e o conteúdo real já
          está montado por baixo desde o primeiro frame. */}
      <BootSequence />
    </div>
  );
}
