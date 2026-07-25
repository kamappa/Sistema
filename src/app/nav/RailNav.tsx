/* B1 · Consola — navegação da Sala de Operações.
 *
 * Condição do Daniel: NÃO pode parecer sidebar SaaS, menu administrativo, lista
 * de botões nem dock de aplicações. Tem de parecer parte física do instrumento.
 *
 * Como isso se consegue, concretamente:
 *   - o Núcleo está à cabeça da consola como marca viva (rank real do store),
 *     não como logótipo;
 *   - as zonas são MARCAS GRAVADAS: um sulco vertical curto + o nome em mono
 *     pequeno. Não há caixa, não há fundo de botão, não há hover que acenda um
 *     retângulo;
 *   - o foco é luz: a marca ativa acende por dentro e o sulco enche;
 *   - existe UM filete, e só um: o que separa a consola do palco — dois
 *     sistemas diferentes. Entre zonas não há linhas.
 */

import type { Zone, ZoneId } from '../zones';
// A letra de rank vem do motor real (config.js:238-240). NÃO se reimplementa:
// duas fontes de verdade divergem, e um rank calculado à parte seria o Sistema
// a mentir sobre si próprio.
import { rankOf, overallLevel } from '../../state/config.js';

interface Props {
  zones: Zone[];
  active: ZoneId;
  onSelect: (id: ZoneId) => void;
  S: Record<string, unknown>;
}

export default function RailNav({ zones, active, onSelect, S }: Props) {
  const rank = readRank(S);

  function onKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    const i = zones.findIndex((z) => z.id === active);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      onSelect(zones[(i + 1) % zones.length].id);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onSelect(zones[(i - 1 + zones.length) % zones.length].id);
    }
  }

  return (
    <nav className="sys-rail" aria-label="Zonas do Sistema">
      {/* O Núcleo à cabeça: identidade, não logótipo. Mostra o rank REAL. */}
      <div className="sys-rail-core" aria-hidden="true">
        <span className="sys-rail-core-mark">{rank}</span>
      </div>

      <ul className="sys-rail-list" onKeyDown={onKeyDown}>
        {zones.map((z) => {
          const on = z.id === active;
          return (
            <li key={z.id}>
              <button
                type="button"
                className="sys-mark"
                data-on={on ? 'true' : 'false'}
                aria-current={on ? 'page' : undefined}
                tabIndex={on ? 0 : -1}
                onClick={() => onSelect(z.id)}
              >
                <span className="sys-mark-groove" aria-hidden="true" />
                <span className="sys-mark-name">{z.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Letra de rank pelo motor do projeto. Sem estado, fica em branco — não se
 *  inventa um rank (o Sistema nunca mente). */
function readRank(S: Record<string, unknown>): string {
  if (!S?.attrs) return '';
  try {
    return rankOf(overallLevel(S)).l as string;
  } catch {
    return '';
  }
}
