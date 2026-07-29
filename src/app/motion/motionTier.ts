/* Regime de movimento em runtime — Missão 26 · Fase 6A.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  QUATRO NÍVEIS DE MOVIMENTO, e cada um tem uma pergunta diferente:   ║
 * ║                                                                       ║
 * ║  A · AMBIENT     — o mundo existe mesmo quando o Operador para.       ║
 * ║                    Contínuo, lento, UM dominante por zona.            ║
 * ║  B · RESPONSIVE  — o Sistema percebeu-te. Imediato, ≤180ms.           ║
 * ║  C · EVENT       — aconteceu alguma coisa com consequência.           ║
 * ║  D · TRANSITION  — a atenção mudou de sítio. ≤500ms, nunca bloqueia.  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Os tokens de duração e curva já existem (`motion.css`, Fase B, com o ID da
 * referência que originou cada curva). O que faltava era o REGIME: saber, em
 * runtime, se este momento pode ter movimento — e desligá-lo num sítio só, em
 * vez de cada componente descobrir sozinho.
 *
 * Três sinais, por ordem de força:
 *   1. `prefers-reduced-motion` — pedido explícito do utilizador. Ganha a tudo.
 *   2. poupança declarada — `saveData` da Network Information API, ou bateria
 *      em modo de poupança quando o browser o expõe.
 *   3. separador em segundo plano — não é uma preferência, é desperdício:
 *      animar o que ninguém está a ver gasta bateria e nada mais.
 *
 * O resultado escreve-se em `<html data-motion>` e o CSS segue sem saber
 * porquê. Um sítio para ler, um sítio para escrever.
 */

export type MotionRegime =
  | 'full'    // tudo permitido
  | 'calm'    // sem ambiente contínuo; responsive, event e transition ficam
  | 'still'   // sem movimento; só transições de estado
  | 'paused'; // separador escondido — congela, não desliga

let current: MotionRegime = 'full';
const listeners = new Set<(r: MotionRegime) => void>();

function prefersReduced(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function savingData(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return !!nav.connection?.saveData;
}

/** A Battery Status API está a ser removida de vários browsers e nunca esteve
 *  no Firefox. É por isso um sinal OPCIONAL: se existir, respeita-se; se não,
 *  não se finge que se sabe o nível de bateria. */
let batterySaving = false;
function watchBattery(): void {
  const nav = navigator as Navigator & { getBattery?: () => Promise<any> };
  if (typeof nav.getBattery !== 'function') return;
  nav
    .getBattery()
    .then((b: any) => {
      const read = () => {
        // Sem `charging` e abaixo de 20% assume-se poupança. Não é uma API de
        // "battery saver" — essa não existe na web — é a aproximação honesta
        // que se consegue, e está declarada como tal.
        batterySaving = !b.charging && typeof b.level === 'number' && b.level <= 0.2;
        recompute();
      };
      b.addEventListener?.('levelchange', read);
      b.addEventListener?.('chargingchange', read);
      read();
    })
    .catch(() => { /* sem API, sem sinal — melhor calar que adivinhar */ });
}

function compute(): MotionRegime {
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return 'paused';
  if (prefersReduced()) return 'still';
  if (savingData() || batterySaving) return 'calm';
  return 'full';
}

function recompute(): void {
  const next = compute();
  if (next === current) return;
  current = next;
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-motion', next);
  listeners.forEach((l) => l(next));
}

export function motionRegime(): MotionRegime {
  return current;
}

/** Um evento com consequência corre em `full` e em `calm`; em `still` colapsa
 *  para a transição de estado; em `paused` espera pelo regresso do separador. */
export function eventsAnimate(): boolean {
  return current === 'full' || current === 'calm';
}

export function subscribeMotion(cb: (r: MotionRegime) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

let started = false;
export function startMotionRegime(): void {
  if (started || typeof window === 'undefined') return;
  started = true;

  document.addEventListener('visibilitychange', recompute);
  if (typeof matchMedia === 'function') {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener?.('change', recompute);
  }
  const conn = (navigator as Navigator & { connection?: EventTarget }).connection;
  conn?.addEventListener?.('change', recompute);
  watchBattery();

  current = 'full'; // força a primeira escrita do atributo
  recompute();
  document.documentElement.setAttribute('data-motion', compute());
}
