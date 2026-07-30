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

import { useEffect, useRef, useState } from 'react';
import type { Zone, ZoneId } from '../zones';
import { rankOf, overallLevel } from '../../state/config.js';
import { useStore } from '../../store/useStore.js';
import { readCore } from '../core/coreState';
import AscensionLadder from '../rank/AscensionLadder';
import '../core/core.css';

interface Props {
  zones: Zone[];
  active: ZoneId;
  onSelect: (id: ZoneId) => void;
  S: Record<string, unknown>;
}

export default function OrbitNav({ zones, active, onSelect, S }: Props) {
  const rank = readRank(S);
  const activeIndex = zones.findIndex((z) => z.id === active);
  const core = useCoreReading(S);
  const [ladder, setLadder] = useState(false);
  // O foco tem de VOLTAR ao Núcleo quando a escada fecha. Sem isto, quem
  // navega por teclado sai do overlay e reaparece no topo do documento —
  // medido: `document.activeElement` ficava no `<body>`.
  const coreBtn = useRef<HTMLButtonElement>(null);

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
      {/* O Núcleo deixa de ser uma letra parada. O `data-core` traz o estado e
          o `--core-charge` a sua intensidade, ambos derivados de dados reais.
          O title expõe a EVIDÊNCIA: o Sistema mostra provas, não sinais. */}
      <div
        className="sys-orbit-core"
        data-core={core.state}
        style={{ ['--core-charge' as string]: core.charge.toFixed(3) }}
        title={core.evidence}
      >
        {/* Missão 26 · Fase 6D — a letra de rank passa a PORTA.
            Era decoração: mostrava a letra e não levava a lado nenhum. Agora
            abre a Escada de Ascensão, que é o que a letra significa. Um
            `<button>` de verdade — o anel continua a ser desenhado pelo
            contentor, e o que ganha alvo e foco é o conteúdo. */}
        <button
          ref={coreBtn}
          type="button"
          className="sys-orbit-core-btn"
          onClick={() => setLadder(true)}
          aria-label={`Rank ${rank} — abrir a Escada de Ascensão`}
        >
          <span className="sys-orbit-core-mark" aria-hidden="true">{rank}</span>
        </button>
        {/* O estado do Núcleo é informação, não enfeite — quem usa leitor de
            ecrã tem direito à mesma leitura que quem vê o anel. */}
        <span className="sr-only">Núcleo: {core.evidence}</span>
      </div>

      {ladder && (
        <AscensionLadder
          S={S as Record<string, any>}
          onClose={() => { setLadder(false); coreBtn.current?.focus(); }}
        />
      )}

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

/* Leitura do Núcleo, com a única parte que precisa de memória: o salto de
 * nível. Um level up não está no estado — o estado só sabe o nível ATUAL. A
 * subida é a diferença entre duas leituras, e por isso guarda-se a anterior.
 *
 * O sinal é transitório de propósito: dura --sys-dur-slow e apaga-se. Um Núcleo
 * que ficasse eufórico para sempre deixava de comunicar seja o que for. */
function useCoreReading(S: Record<string, unknown> | null) {
  const ocBusy = useStore((s: { ocBusy: boolean }) => s.ocBusy);
  const report = useStore((s: { report: unknown }) => s.report);
  const [levelJumped, setLevelJumped] = useState(false);
  const [composing, setComposing] = useState(false);
  const prevLevel = useRef<number | null>(null);

  /* `listening`: o Operador está a escrever para o Oráculo.
   *
   * Feito por eventos de foco no documento, e não por uma flag no store nem por
   * uma alteração ao Conselho.jsx. Duas razões: o composer é um componente
   * legado que não precisa de saber que o Núcleo existe, e um estado puramente
   * de interface não tem de atravessar o estado de domínio.
   *
   * O preço é acoplar ao id `#oc-in`, que é estável (o hud.css já o usa). Fica
   * declarado aqui para quem o renomear saber o que parte. */
  useEffect(() => {
    const isComposer = (el: EventTarget | null) =>
      el instanceof Element && !!el.closest('#oc-in, [data-sys-composer]');
    const on = (e: FocusEvent) => { if (isComposer(e.target)) setComposing(true); };
    const off = (e: FocusEvent) => { if (isComposer(e.target)) setComposing(false); };
    document.addEventListener('focusin', on);
    document.addEventListener('focusout', off);
    return () => {
      document.removeEventListener('focusin', on);
      document.removeEventListener('focusout', off);
    };
  }, []);

  const level = S ? safeLevel(S) : null;

  useEffect(() => {
    if (level == null) return;
    const before = prevLevel.current;
    prevLevel.current = level;
    // Na primeira leitura não há salto — só há um valor. Confundir arranque
    // com subida seria celebrar o que não aconteceu.
    if (before == null || level <= before) return;
    setLevelJumped(true);
    const t = setTimeout(() => setLevelJumped(false), 620);
    return () => clearTimeout(t);
  }, [level]);

  return readCore({ S: S as Record<string, any> | null, ocBusy, report, levelJumped, composing });
}

function safeLevel(S: Record<string, unknown>): number | null {
  try {
    return overallLevel(S) as number;
  } catch {
    return null;
  }
}
