/* CÂMARA MANUAL — o Operador pode interromper a viagem.
 * Missão 26 · Fase 6C, quinta passagem.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A NAVEGAÇÃO ERA SÓ POR CLIQUE. Dava para ir a sítios e não dava     ║
 * ║  para OLHAR — e um espaço onde não se pode olhar à volta é um menu   ║
 * ║  com paisagem.                                                        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * COMO ISTO CONVIVE COM A MÁQUINA DE ESTADOS, que é a parte difícil. O estado
 * continua a mandar na ESCALA — é ele que sabe se estamos no sistema, num
 * domínio ou no Núcleo. O que o gesto manual produz é um DESVIO por cima
 * disso: `--free-x/y/z`, que se soma à posição do estado.
 *
 * Duas consequências, e as duas são de propósito:
 *   · arrastar nunca troca de escala. Olhar à volta não é viajar;
 *   · a roda ACUMULA desvio em z, e quando o desvio passa um limiar COMPROMETE
 *     uma transição de estado e volta a zero. É assim que o zoom contínuo
 *     resolve em estados sem lutar com eles: o gesto é contínuo, o destino é
 *     discreto, e a passagem de um para o outro tem um sítio definido.
 *
 * O `pointerdown` só conta como arrasto acima de 6px. Sem esse limiar, cada
 * clique num domínio era também um micro-arrasto e o campo tremia à chegada.
 *
 * NADA DISTO É ANIMAÇÃO. É manipulação direta, por isso continua a funcionar
 * em `prefers-reduced-motion` — desligá-la ali seria tirar controlo a quem
 * pediu menos movimento, que é o contrário do que a preferência quer dizer.
 */

import { useEffect, useRef } from 'react';

/* ── OS LIMITES SÃO CALCULADOS, NÃO ESCOLHIDOS ──
 * O primeiro par era 260×150 e produziu um defeito real: com −150 em y, o
 * domínio do topo — que está a 175 do centro e tem 64 de altura de etiqueta —
 * ficava 76px acima do bordo, clipado pelo `overflow:hidden`, e deixava de se
 * poder tocar. Um gesto que torna uma coisa inalcançável não é olhar à volta,
 * é perder-se.
 *
 * A folga real no desktop é 72px em cima e em baixo (534 − 175 − 32 = 327,
 * contra um bordo a 255) e 73px à direita. No estreito é 45px em cima. Os
 * limites ficam abaixo disso, com margem.
 *
 * Continua a haver muito para onde olhar: 200px na horizontal é meio domínio. */
const LIMITS = {
  wide:   { x: 200, y: 60 },
  narrow: { x: 90,  y: 34 },
};
/** Além deste desvio em z, o gesto compromete uma mudança de escala. */
const COMMIT = 190;
/** Teto do desvio livre em z, para o desvio nunca chegar ao plano da câmara. */
const MAX_Z = 240;
/** Dois dedos só são um gesto se pousarem juntos: o segundo até isto depois do primeiro (ms).
 *  PROVISÓRIO (D7, Daniel, 2026-09-28) até ao teste no iPhone. */
const JUNTOS = 250;

export interface FreeCamAPI {
  /** Zera o desvio. Chamado pela cena a cada mudança de estado. */
  reset(): void;
  /** Verdadeiro se há desvio por desfazer. A cena usa isto para o Escape
   *  centrar primeiro e só recuar depois — sem uma saída, quem arrastasse
   *  para um canto não tinha forma de voltar ao centro sem mudar de estado. */
  deslocado(): boolean;
}

interface Opts {
  /** O gesto pediu para aprofundar (roda para dentro, pinça a abrir). */
  onDeeper(): void;
  /** O gesto pediu para recuar. */
  onBack(): void;
  /** Falso enquanto a zona não está ativa: sem isto, a roda da página inteira
   *  ficava capturada por uma cena que ninguém está a ver. */
  enabled: boolean;
  /** Enquadramento largo. Governa os limites do desvio. */
  wide: boolean;
}

export function useFreeCam(
  ref: React.RefObject<HTMLElement | null>,
  api: React.MutableRefObject<FreeCamAPI | null>,
  { onDeeper, onBack, enabled, wide }: Opts,
) {
  // Guardadas em ref e não em estado: isto escreve custom properties a cada
  // frame de gesto, e um `setState` por movimento re-renderizava a cena inteira
  // para deslocar o fundo alguns píxeis.
  const off = useRef({ x: 0, y: 0, z: 0 });
  const cb = useRef({ onDeeper, onBack });
  cb.current = { onDeeper, onBack };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const write = () => {
      el.style.setProperty('--free-x', off.current.x.toFixed(1) + 'px');
      el.style.setProperty('--free-y', off.current.y.toFixed(1) + 'px');
      el.style.setProperty('--free-z', off.current.z.toFixed(1) + 'px');
      // A cena marca-se como manipulada para o CSS poder tirar a transição:
      // com transição, cada frame de arrasto ficaria 1,4s atrás do dedo.
      el.dataset.free = off.current.x || off.current.y || off.current.z ? 'true' : 'false';
    };
    api.current = {
      reset() { off.current = { x: 0, y: 0, z: 0 }; write(); },
      deslocado: () => !!(off.current.x || off.current.y || off.current.z),
    };
    if (!enabled) return () => { api.current = null; };

    /* ── ARRASTAR ── */
    let dragging = false; let moved = false; let sx = 0; let sy = 0; let ox = 0; let oy = 0;
    const lim = wide ? LIMITS.wide : LIMITS.narrow;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      /* ── UM DEDO É DA PÁGINA (D6, Daniel, 2026-09-27) ──
       * No iPhone o céu ocupa dois terços do ecrã: se um dedo o arrastasse, deixava de se
       * poder rolar a página por cima dele. A mesma regra da roda: sem modificador, a
       * página; com modificador — aqui, o segundo dedo —, a cena. O arrasto de um ponteiro
       * fica para o rato e a caneta; no toque olha-se com dois dedos (em baixo). */
      if (e.pointerType === 'touch') return;
      dragging = true; moved = false;
      sx = e.clientX; sy = e.clientY;
      ox = off.current.x; oy = off.current.y;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - sx; const dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      if (!moved) { moved = true; el.setPointerCapture?.(e.pointerId); }
      off.current.x = clamp(ox + dx, lim.x);
      off.current.y = clamp(oy + dy, lim.y);
      write();
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        // Impede que o `click` do arrasto chegue ao botão do domínio por baixo.
        const kill = (ev: Event) => { ev.stopPropagation(); ev.preventDefault(); };
        el.addEventListener('click', kill, { capture: true, once: true });
        window.setTimeout(() => el.removeEventListener('click', kill, true), 0);
        el.releasePointerCapture?.(e.pointerId);
      }
    };

    /* ── RODA E PINÇA PARTILHAM A TRAVA ──
     * São o mesmo pedido — "aproxima-me" — feito com a roda ou com dois dedos.
     * Uma trava por cada dava-lhes regras diferentes para a mesma intenção. */
    let wheelLock = false;

    /* ── RODA ── */
    const wheel = (e: WheelEvent) => {
      /* ── A RODA SÓ ZOOMA COM MODIFICADOR, E ISTO NÃO É TIMIDEZ ──
       * A primeira montagem capturava a roda toda. A cena ocupa 558px de um
       * contentor com 2620px de conteúdo por baixo — a lista de domínios, o
       * radar, os títulos, as conquistas. Com a roda capturada, quem pusesse o
       * rato no céu ficava preso: não havia forma de chegar ao resto da zona
       * sem tirar o cursor de cima dela.
       *
       * Ctrl/⌘ + roda é a convenção de qualquer mapa embebido, e a razão é
       * exatamente esta. Sem modificador a página rola como deve; com
       * modificador, a cena aprofunda. O arrasto continua livre, porque
       * arrastar num céu nunca foi ambíguo. */
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      if (wheelLock) return;
      off.current.z = Math.max(-MAX_Z, Math.min(MAX_Z, off.current.z - e.deltaY * 0.6));
      write();
      if (off.current.z >= COMMIT) {
        wheelLock = true; off.current.z = 0; write(); cb.current.onDeeper();
        window.setTimeout(() => { wheelLock = false; }, 700);
      } else if (off.current.z <= -COMMIT) {
        wheelLock = true; off.current.z = 0; write(); cb.current.onBack();
        window.setTimeout(() => { wheelLock = false; }, 700);
      }
    };

    /* ── PINÇA ──
     * Dois dedos. O primeiro `touchmove` com dois pontos fixa a distância de
     * referência; a variação relativa alimenta o mesmo desvio em z da roda, e
     * por isso compromete pelos mesmos limiares. Um só caminho para "quero
     * aproximar-me", em vez de dois com comportamentos diferentes. */
    let pinch0 = 0;
    /* Dois dedos também OLHAM (D6): o ponto médio entre eles arrasta o céu, como o rato.
     * Pinça e arrasto são o mesmo gesto, como num mapa — a distância aprofunda, o ponto
     * médio desloca. */
    let mid0 = { x: 0, y: 0 }; let pan0 = { x: 0, y: 0 };

    /* ── QUE DEDOS FAZEM UM GESTO (D7, Daniel, 2026-09-28) ──
     * O iPhone mostrou o defeito: `e.touches` são TODOS os dedos do ecrã, e um polegar pousado
     * na borda — ao pegar no telemóvel — fazia do dedo que rola a página o segundo dedo de uma
     * pinça; e uma pinça na vista geral vai direta ao Núcleo. Duas regras, cada uma com o seu
     * caso:
     *   R1 — só contam os dedos que pousaram NO CÉU: o contacto na margem ou nas barras não
     *        conta, mesmo que pouse no mesmo instante;
     *   R2 — os dois pousam JUNTOS: o segundo até JUNTOS ms depois do primeiro; o dedo que já
     *        estava pousado no céu antes do gesto não conta.
     * Dos dedos do céu contam os dois mais recentes: com um polegar pousado, dois dedos novos
     * continuam a fazer o gesto (antes, três dedos no ecrã desligavam a pinça). Sem gesto não
     * há preventDefault, e o dedo que se mexe rola a página, como a D6 quer. */
    const inicio = new Map<number, number>();
    const registar = (e: TouchEvent) => { for (const t of Array.from(e.changedTouches)) inicio.set(t.identifier, e.timeStamp); };
    const esquecer = (e: TouchEvent) => { for (const t of Array.from(e.changedTouches)) inicio.delete(t.identifier); };
    const noCeu = (t: Touch) => t.target instanceof Node && el.contains(t.target);
    let par: [number, number] | null = null;
    const escolherPar = (lista: TouchList): [number, number] | null => {
      const ceu = Array.from(lista).filter((t) => noCeu(t) && inicio.has(t.identifier))
        .sort((a, b) => inicio.get(b.identifier)! - inicio.get(a.identifier)!);
      if (ceu.length < 2) return null;
      const [a, b] = ceu;
      if (Math.abs(inicio.get(a.identifier)! - inicio.get(b.identifier)!) > JUNTOS) return null;
      return [a.identifier, b.identifier];
    };
    const doPar = (lista: TouchList): [Touch, Touch] | null => {
      if (!par) return null;
      const a = Array.from(lista).find((t) => t.identifier === par![0]);
      const b = Array.from(lista).find((t) => t.identifier === par![1]);
      return a && b ? [a, b] : null;
    };
    const dist = ([a, b]: [Touch, Touch]) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const mid = ([a, b]: [Touch, Touch]) => ({ x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 });
    const tstart = (e: TouchEvent) => {
      par = escolherPar(e.touches);
      const dedos = doPar(e.touches);
      if (!dedos) { pinch0 = 0; return; }
      pinch0 = dist(dedos);
      mid0 = mid(dedos); pan0 = { x: off.current.x, y: off.current.y };
    };
    const tmove = (e: TouchEvent) => {
      const dedos = doPar(e.touches);
      if (!dedos || !pinch0) return;
      e.preventDefault();
      if (wheelLock) return;
      const d = dist(dedos);
      const c = mid(dedos);
      off.current.x = clamp(pan0.x + c.x - mid0.x, lim.x);
      off.current.y = clamp(pan0.y + c.y - mid0.y, lim.y);
      off.current.z = Math.max(-MAX_Z, Math.min(MAX_Z, (d / pinch0 - 1) * 420));
      write();
      // A MESMA TRAVA DA RODA, e faltava aqui. Sem ela, um afastamento contínuo
      // dos dedos comprometia uma transição, rebaseava e comprometia outra
      // logo a seguir — medido: um só gesto atravessava duas escalas. O lock é
      // partilhado de propósito: roda e pinça são o mesmo pedido feito com
      // membros diferentes, e não podem ter regras diferentes.
      if (off.current.z >= COMMIT) {
        wheelLock = true; pinch0 = d; mid0 = c; pan0 = { x: off.current.x, y: off.current.y };
        off.current.z = 0; write(); cb.current.onDeeper();
        window.setTimeout(() => { wheelLock = false; }, 700);
      } else if (off.current.z <= -COMMIT) {
        wheelLock = true; pinch0 = d; mid0 = c; pan0 = { x: off.current.x, y: off.current.y };
        off.current.z = 0; write(); cb.current.onBack();
        window.setTimeout(() => { wheelLock = false; }, 700);
      }
    };
    // Ao levantar um dos dedos do gesto, a profundidade volta (a pinça só compromete além do
    // limiar) e o desvio lateral fica, como fica o do rato — o Escape, ou o toque duplo, centra.
    // Um dedo de fora do gesto a levantar não o interrompe.
    const tend = (e: TouchEvent) => {
      if (par && doPar(e.touches)) return;
      par = null; pinch0 = 0; off.current.z = 0; write();
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    el.addEventListener('wheel', wheel, { passive: false });
    // O instante de cada dedo regista-se na janela, na captura: chega antes do `touchstart` da
    // cena e vê também os dedos de fora dela (é a R1, e não a falta deles, que os exclui).
    window.addEventListener('touchstart', registar, { capture: true, passive: true });
    window.addEventListener('touchend', esquecer, { capture: true, passive: true });
    window.addEventListener('touchcancel', esquecer, { capture: true, passive: true });
    el.addEventListener('touchstart', tstart, { passive: true });
    el.addEventListener('touchmove', tmove, { passive: false });
    el.addEventListener('touchend', tend);
    el.addEventListener('touchcancel', tend);
    write();

    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      el.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', registar, { capture: true });
      window.removeEventListener('touchend', esquecer, { capture: true });
      window.removeEventListener('touchcancel', esquecer, { capture: true });
      el.removeEventListener('touchstart', tstart);
      el.removeEventListener('touchmove', tmove);
      el.removeEventListener('touchend', tend);
      el.removeEventListener('touchcancel', tend);
      api.current = null;
    };
  }, [ref, api, enabled, wide]);
}
