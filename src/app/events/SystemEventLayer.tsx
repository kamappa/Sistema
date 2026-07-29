/* A camada que anuncia os SYSTEM EVENTS.
 * Missão 26 · Fase 6A.
 *
 * ORIGEM VISUAL: R15 (`07-core-level-events/nucleo a explodir`) e a gramática 1
 * — *a energia converge para dentro*. Naquela referência os filamentos varrem
 * do ambiente PARA a esfera; a explosão para fora dura pouco e só no pico.
 *
 * EXTRAÍDO: a direção. O evento nasce onde o Operador tocou, e a energia
 * desloca-se para o Núcleo — que é a lei do projeto ("toda a energia relevante
 * converge para o Núcleo") com forma visual. Mais a gramática 9: o que confirma,
 * sobe.
 * REJEITADO: o bloom branco a 100%, o bosque fotográfico, a saturação, e as
 * partículas de celebração — que são o cliché de confetti e dizem o oposto da
 * convergência.
 *
 * ORIGINALIDADE: não há moldura de videojogo, nem "QUEST COMPLETE", nem
 * tipografia de anime. O anúncio é uma leitura de instrumento com um trilho
 * de domínio à esquerda — a mesma língua das linhas de missão e de hábito, que
 * é o que o faz pertencer ao Sistema em vez de parecer colado.
 *
 * O QUE ELE NÃO PODE FAZER, e cada uma foi um requisito explícito:
 *   - bloquear o Operador: não tem overlay, não rouba foco, não tem backdrop;
 *   - perder-se quando há dois eventos: existe fila, e o contador diz quantos;
 *   - aparecer atrás de outra coisa: vive acima da faixa do Oráculo e abaixo
 *     de nada;
 *   - anunciar duas vezes: a deduplicação é do `systemEvents.ts`;
 *   - depender de um temporizador para confirmar dados: o dado já está
 *     guardado quando isto aparece. O temporizador só decide quando desaparece.
 */

import { useEffect, useRef, useState } from 'react';
import {
  dismissSystemEvent,
  subscribeSystemEvents,
  type SystemEvent,
} from './systemEvents';
import { eventsAnimate, subscribeMotion } from '../motion/motionTier';
import './system-event.css';

/** Base + tempo de leitura. A mesma fórmula do toast do HUD, que estava certa:
 *  um anúncio longo precisa de mais tempo do que um curto. */
function holdFor(ev: SystemEvent): number {
  if (ev.holdMs) return ev.holdMs;
  const n = (ev.title + ev.subject).length;
  return Math.min(9000, 3600 + 55 * n);
}

export default function SystemEventLayer() {
  const [queue, setQueue] = useState<SystemEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);
  const [, force] = useState(0);

  useEffect(() => subscribeSystemEvents(setQueue), []);
  // Sem isto, um evento emitido com o separador escondido ficaria a contar e
  // desaparecia sem ninguém o ver.
  useEffect(() => subscribeMotion(() => force((n) => n + 1)), []);

  const current = queue[0];

  useEffect(() => {
    if (!current || paused) return;
    const t = window.setTimeout(dismissSystemEvent, holdFor(current));
    timer.current = t;
    return () => window.clearTimeout(t);
  }, [current, paused]);

  if (!current) return null;

  const animate = eventsAnimate();

  return (
    <div
      className="sys-ev-layer"
      /* `status` e não `alert`: um anúncio de progresso não interrompe um
         leitor de ecrã a meio de outra coisa. Um aviso é que interrompe. */
      role={current.kind === 'warning' ? 'alert' : 'status'}
      aria-live={current.kind === 'warning' ? 'assertive' : 'polite'}
    >
      <article
        key={current.dedupe}
        className="sys-ev"
        data-kind={current.kind}
        data-animate={animate ? 'true' : 'false'}
        style={current.color ? ({ '--ev-area': current.color } as React.CSSProperties) : undefined}
        /* Pausa ao passar o rato ou ao entrar com teclado: quem está a ler não
           pode ver o texto fugir. */
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <header className="sys-ev-head">
          <span className="sys-ev-kind">{current.title}</span>
          {queue.length > 1 && (
            <span className="sys-ev-more">+{queue.length - 1}</span>
          )}
        </header>

        <p className="sys-ev-subject">{current.subject}</p>

        {current.readings && current.readings.length > 0 && (
          <dl className="sys-ev-readings">
            {current.readings.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <button
          type="button"
          className="sys-ev-close"
          onClick={() => dismissSystemEvent()}
          aria-label={queue.length > 1 ? 'Dispensar e ver o próximo' : 'Dispensar'}
        >
          ✕
        </button>

        {/* A convergência (R15): um traço de energia que atravessa o anúncio na
            direção do Núcleo. Não é enfeite — é a única parte que diz PARA ONDE
            foi o que acabaste de fazer. Sem movimento permitido, não existe: a
            informação já está no texto e nas leituras. */}
        {animate && <span className="sys-ev-flow" aria-hidden="true" />}
      </article>
    </div>
  );
}
