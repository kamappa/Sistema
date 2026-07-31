/* A PONTE DE GLOBAIS, DECLARADA — Missão 26 · Fase 7Z.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  Porque é que isto existe                                            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O `CLAUDE.md` diz, sobre a migração da Missão 25:
 *
 *   "O palco WebGL não foi reescrito — foi copiado para `src/stage/` e
 *    alimentado por uma ponte de globais (`window.S`, `window.__store`),
 *    porque ele corre num rAF fora do ciclo React. Quem mexer nele tem de
 *    preservar essa ponte."
 *
 * Até aqui essa ponte existia só como chamadas espalhadas por dez ficheiros. A
 * instrução de preservar era verdadeira e **não verificável**: não havia sítio
 * nenhum onde ela estivesse escrita por inteiro, e nada impedia alguém de
 * renomear uma primitiva do palco e só descobrir em runtime, se descobrisse.
 *
 * Este ficheiro é o contrato. Não muda comportamento nenhum — nada aqui é
 * código, é só a forma da ponte dita em voz alta, para o `tsc` e para quem
 * vier a seguir.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  Duas coisas que só se veem por escrito                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * 1 · **As primitivas de FX são instaladas por `Object.assign(window, {...})`**
 *     no fim de `lib/fx.js` — não por `window.x = ...`. Procurar a origem de
 *     `window.rankCeremony` com uma pesquisa por `window.rankCeremony =` não
 *     encontra nada. É exatamente o tipo de invisibilidade que uma declaração
 *     resolve.
 *
 * 2 · **Tudo aqui é opcional (`?`), e isso é a política e não descuido.** O
 *     padrão do projeto, herdado do Vanilla e escrito no cabeçalho do `fx.js`,
 *     é chamar as primitivas guardadas por `if (window.x)`. O palco pode não
 *     ter montado, pode estar em `prefers-reduced-motion`, pode não existir de
 *     todo — e o Sistema tem de continuar a funcionar. Marcá-las como
 *     obrigatórias tornaria o tipo mais bonito e mentiria sobre o runtime.
 *
 * O que NÃO está aqui, de propósito: `sysEvent` e `sysCommit`. Esses vivem
 * declarados ao lado do instalador deles, em `app/events/systemEvents.ts`, que
 * é o sítio certo quando há um dono claro. A ponte do palco não tem dono — é
 * montada em `Stage.jsx`, implementada em `src/stage/` (que está fora do
 * `tsconfig`) e consumida em todo o lado. Por isso é que precisa de casa
 * própria.
 */

import type { StoreApi, UseBoundStore } from 'zustand';

declare global {
  interface Window {
    /* ── O PALCO WebGL · src/stage/ ─────────────────────────────────────
     * Fora do `include` do tsconfig de propósito: é a ilha de ES modules que
     * corre num rAF próprio. Estas assinaturas são a única descrição dela que
     * o resto do projeto consegue ver. */

    /** Arranca o campo de poeira. Não faz nada em reduced motion — a decisão é
     *  do palco e não de quem chama, para o teste de movimento viver num sítio
     *  só. `stage/main.js`. */
    dustStart?: () => void;
    /** Sopro de poeira na cor dada, subindo o ecrã. Hex com `#`. */
    dustBurst?: (hex: string) => void;
    /** Faísca localizada em coordenadas de viewport. `n` é o número de
     *  partículas e assume 4. Usado quando um ganho tem sítio no ecrã. */
    dustSpark?: (x: number, y: number, hex: string, n?: number) => void;
    /** Reaplica a luz ambiente do céu — hora, estação, clima. `stage/solar.js`
     *  chama-a sozinho de minuto a minuto; isto é para forçar. */
    ambientApply?: () => void;
    /** Redesenha as constelações do Vanilla. Existe em duas versões no
     *  `stage/constellation.js` (DOM e canvas), e ganha a última a montar. */
    renderConstellation?: () => void;

    /* ── PRIMITIVAS DE FX · src/lib/fx.js ───────────────────────────────
     * Instaladas por `Object.assign(window, {...})` no fim do módulo. */

    /** @param penalty pinta a barra de perda em vez de ganho
     *  @param important segura o toast mais tempo e não deixa a fila comê-lo */
    toast?: (t: string, s?: string, color?: string, penalty?: boolean, important?: boolean) => void;
    hideToast?: () => void;
    /** O toast pára de contar enquanto o cursor está em cima. */
    pauseToast?: () => void;
    resumeToast?: () => void;
    /** Número a subir e a desvanecer. `ev` posiciona-o onde o Operador clicou;
     *  sem ele, sai do centro. */
    floatXP?: (txt: string, color?: string, ev?: MouseEvent | PointerEvent) => void;
    cinePulse?: () => void;
    /** Celebração curta na cor de um domínio. Chamada pelo motor a subir de
     *  nível — guardada, porque o motor tem de correr sem palco. */
    celebrate?: (color: string) => void;
    /** Momento cinematográfico com antetítulo e título. */
    cineMoment?: (kicker: string, title: string, glow?: string) => void;
    /** O ARISE. Cala-se sozinho quando o céu do Universo está vivo — uma
     *  cerimónia de cada vez (ver `data-sky-live`). */
    cineArise?: () => void;
    /** Cerimónia de mudança de rank. NÃO mostra toast: o anúncio é do SYSTEM
     *  EVENT, e ter os dois dizia a mesma coisa duas vezes. */
    rankCeremony?: (r: { l: string; color: string; name?: string }) => void;
    /** Conta um número até ao valor, com formatação opcional. */
    setNum?: (id: string, val: number, fmt?: (v: number) => string) => void;
    cardWave?: (el: Element, color?: string) => void;
    /** Varrimento de luz num painel — usado quando um painel recebe dados. */
    panelScan?: (el: Element) => void;
    /** Rebentamento na barra de um atributo. */
    barBurst?: (attr: string) => void;
    /** Máquina de escrever sobre texto. `sysTypeFlush` termina tudo o que
     *  estiver a meio — existe para nenhuma informação ficar por mostrar. */
    sysType?: (el: Element, ms?: number) => void;
    sysTypeHTML?: (els: Element[] | NodeListOf<Element>, budget?: number) => void;
    sysTypeFlush?: () => void;

    /* ── BUS DE EVENTOS · src/lib/bus.js ────────────────────────────────
     * O código emite factos, o palco ouve. Um listener que rebente nunca
     * derruba o emissor — está dentro de um try no `emit`. */
    Bus?: {
      on: (ev: string, fn: (d?: unknown) => void) => void;
      off: (ev: string, fn: (d?: unknown) => void) => void;
      emit: (ev: string, d?: unknown) => void;
    };

    /** Motor de springs do Vanilla · `src/lib/motion.js`. Importado por efeito
     *  colateral, e tem de existir ANTES do `setNum` correr.
     *
     *  A API tem três membros e são os três que o resto do projeto usa —
     *  verificado: `window.Motion.Spring`, `.TOK` e `.fillBar`, e mais nada.
     *  O `fillBar` é acrescentado ao objeto DEPOIS do IIFE que o cria, o que o
     *  torna invisível a quem leia só o `return`. */
    Motion?: {
      /** Tokens de rigidez `k` e amortecimento `c`. `fill` é ligeiramente
       *  sub-amortecida de propósito: a barra passa um fio além do alvo e
       *  assenta, que é o que a faz parecer massa e não um `width`. */
      TOK: Record<'snappy' | 'gentle' | 'slow' | 'fill', { k: number; c: number }>;
      Spring: new (
        n: number,
        tok: { k: number; c: number },
        apply: (x: number[]) => void,
      ) => { x: number[]; snap: (v: number) => void; to?: (v: number) => void };
      /** Barra com física. O registo é por CHAVE e não por elemento, para
       *  sobreviver a re-renders: o elemento novo nasce onde a mola ia. */
      fillBar: (key: string, el: HTMLElement | null, pct: number) => void;
    };

    /* ── ESTADO E CONFIG, expostos em `Stage.jsx` ───────────────────────
     * O palco não importa módulos do React: lê daqui. `window.S` é
     * REESCRITO a cada alteração do store — quem o guardar numa variável fica
     * com um retrato velho, e é esse o erro que esta nota previne. */

    /** O estado do Operador, tal como o store o tem AGORA. */
    S?: Record<string, unknown>;
    /** O store inteiro, para quem precisar de subscrever em vez de ler. */
    __store?: UseBoundStore<StoreApi<Record<string, unknown>>>;
    /** Grava o estado. É um atalho para `useStore.getState().save()`. */
    save?: () => void;
    /** A data de hoje no formato do domínio. O palco compara-a com
     *  `S.recovery.until` e não pode ter a sua própria noção de "hoje". */
    today?: () => string;

    /** Constantes de domínio que o palco desenha. Tipadas como leitura: o
     *  palco lê-as, nunca as escreve. */
    readonly CONSTELLATIONS?: unknown;
    readonly ATTRS?: readonly string[];
    readonly AM?: Record<string, { name: string; color: string; [k: string]: unknown }>;
    readonly TITLES_REAL?: readonly { id: string; name: string; [k: string]: unknown }[];
  }
}

export {};
