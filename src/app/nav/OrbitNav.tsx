/* B2 · Órbita — navegação da Sala de Operações.
 *
 * Sem barra. O Núcleo ao centro do campo; as zonas dispostas em órbita como
 * marcas ténues. A zona ativa avança e preenche; as outras recuam.
 *
 * Condição do Daniel sobre performance: a profundidade NÃO depende de blur
 * pesado. Recua-se por opacity, transform, escala, contraste e dessaturação —
 * todas propriedades que o compositor trata sem repintar. O blur existe como
 * acabamento e está sujeito a --sys-blur-enabled, que é 0 em mobile, em
 * reduced-motion e em tier baixo.
 *
 * Acessibilidade: recuar não é esconder. As marcas em órbita continuam todas
 * focáveis por teclado e legíveis por tecnologia assistiva, mesmo quando
 * visualmente distantes. Só as ZONAS inativas (no ZoneStage) ficam inertes.
 */

import type { Zone, ZoneId } from '../zones';
import { rankOf, overallLevel } from '../../state/config.js';

interface Props {
  zones: Zone[];
  active: ZoneId;
  onSelect: (id: ZoneId) => void;
  S: Record<string, unknown>;
}

export default function OrbitNav({ zones, active, onSelect, S }: Props) {
  const rank = readRank(S);
  const activeIndex = zones.findIndex((z) => z.id === active);

  function onKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      onSelect(zones[(activeIndex + 1) % zones.length].id);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      onSelect(zones[(activeIndex - 1 + zones.length) % zones.length].id);
    }
  }

  return (
    <nav className="sys-orbit" aria-label="Zonas do Sistema">
      <div className="sys-orbit-core" aria-hidden="true">
        <span className="sys-orbit-core-mark">{rank}</span>
      </div>

      <ul className="sys-orbit-ring" onKeyDown={onKeyDown}>
        {zones.map((z, i) => {
          const on = z.id === active;
          // Distância orbital: quantos passos está da zona ativa. Governa o
          // plano de profundidade — 1 (à frente) a 4 (horizonte).
          const raw = Math.abs(i - activeIndex);
          const dist = Math.min(raw, zones.length - raw);
          const plane = on ? 1 : Math.min(4, dist + 1);
          const angle = (i / zones.length) * 360;

          return (
            <li
              key={z.id}
              className="sys-orbit-slot"
              style={{ '--slot-angle': `${angle}deg` } as React.CSSProperties}
            >
              <button
                type="button"
                className="sys-orbit-mark"
                data-on={on ? 'true' : 'false'}
                data-plane={plane}
                aria-current={on ? 'page' : undefined}
                onClick={() => onSelect(z.id)}
              >
                {z.name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function readRank(S: Record<string, unknown>): string {
  if (!S?.attrs) return '';
  try {
    return rankOf(overallLevel(S)).l as string;
  } catch {
    return '';
  }
}
