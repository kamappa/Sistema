import { useEffect } from 'react';
import { useStore } from './store/useStore.js';
import { today } from './state/dates.js';
import { CONSTELLATIONS, ATTRS, AM, TITLES_REAL } from './state/config.js';

// Missão 25 · Fase 2 — a ponte para o palco WebGL (o maior risco, resolvido
// cedo). O palco (src/stage/, ~2065 linhas) NÃO é reescrito: continua a ler o
// global `S` com guardas `typeof`. Aqui só montamos o canvas #dust e espelhamos
// o estado do store para `window.S` (o palco corre FORA do ciclo React, num rAF
// próprio — por isso a ponte é um global, não props). `window.today` é exposto
// para o cálculo de Recovery em state.js; o resto (Bus, seasonArcNow) degrada
// graciosamente até os respetivos sistemas migrarem.
let stageImported = false;

export default function Stage() {
  useEffect(() => {
    window.today = today;                       // state.js: recovery <= S.recovery.until
    // Constelações (Fase 16): o constellation.js clássico lê estes como globais
    // do Vanilla (typeof CONSTELLATIONS/ATTRS/AM/TITLES_REAL). São constantes
    // estáticas — pontam uma vez. Isto também dá vida ao world.core do palco:
    // state.js chama coreState() (lê CONSTELLATIONS) a cada updateWorld() — sem
    // esta ponte o Núcleo do mundo esteve sempre em 0.
    window.CONSTELLATIONS = CONSTELLATIONS;
    window.ATTRS = ATTRS;
    window.AM = AM;
    window.TITLES_REAL = TITLES_REAL;
    // save() global: o constellation.js persiste S.constellation.born/choices
    // (evidência datada) fora do ciclo React. Muta window.S em-lugar (mesmo
    // objeto do store) e chama save() — encaminhamos para o store real.
    window.save = () => useStore.getState().save();

    window.S = useStore.getState().S;           // ponte inicial
    // mantém window.S fresco e re-avalia o céu a cada mudança de estado — é o
    // equivalente ao renderConstellation() no fim de cada render() do Vanilla
    // (deteta nascimentos de estrelas por evidência nova). Guardado: só existe
    // depois de o painel montar e correr initConstellation().
    const unsub = useStore.subscribe((st) => {
      window.S = st.S;
      if (window.renderConstellation) window.renderConstellation();
    });

    if (!stageImported) {
      stageImported = true; // ES module é singleton, mas o StrictMode chama o efeito 2x
      import('./stage/main.js'); // top-level corre 1x: cria renderer, façade, loop
    }
    return () => { unsub(); };
  }, []);

  // Camada de fundo, na ordem do Vanilla (legacy/index.html:26-29): o palco
  // WebGL pinta o céu no #dust; a aurora (nebulosas CSS) brilha por cima, lendo
  // as variáveis --amb do Solar Engine; horizonte e grelha completam o ambiente.
  return (
    <>
      <canvas id="dust" aria-hidden="true" />
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="horizon" aria-hidden="true" />
      <div className="grid" aria-hidden="true" />
    </>
  );
}
