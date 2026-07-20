import { useEffect } from 'react';
import { useStore } from './store/useStore.js';
import { today } from './state/dates.js';

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
    window.S = useStore.getState().S;           // ponte inicial
    const unsub = useStore.subscribe((st) => { window.S = st.S; }); // mantém fresco

    if (!stageImported) {
      stageImported = true; // ES module é singleton, mas o StrictMode chama o efeito 2x
      import('./stage/main.js'); // top-level corre 1x: cria renderer, façade, loop
    }
    return () => { unsub(); };
  }, []);

  return <canvas id="dust" aria-hidden="true" />;
}
