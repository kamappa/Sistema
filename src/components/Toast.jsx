import { useEffect, useRef } from 'react';
import { pauseToast, resumeToast } from '../lib/fx.js';

// Toast — Missão 25 · Fase 17. Markup portado de legacy/index.html:30. A
// manipulação (mostrar/duração/dispensar) vive em lib/fx.js via window.toast /
// window.hideToast (chamadas guardadas pelo motor/store, como no Vanilla). Aqui
// só montamos o DOM #toast (position:fixed pelo css/hud.css) e ligamos os
// listeners de pausa em hover/toque que no Vanilla eram um IIFE no fim do fx.js.
export default function Toast() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.addEventListener('mouseenter', pauseToast);
    el.addEventListener('mouseleave', resumeToast);
    el.addEventListener('touchstart', pauseToast, { passive: true });
    el.addEventListener('touchend', resumeToast, { passive: true });
    return () => {
      el.removeEventListener('mouseenter', pauseToast);
      el.removeEventListener('mouseleave', resumeToast);
      el.removeEventListener('touchstart', pauseToast);
      el.removeEventListener('touchend', resumeToast);
    };
  }, []);
  return (
    <div className="toast" id="toast" ref={ref}>
      <span className="t-x" onClick={() => window.hideToast && window.hideToast()} title="Dispensar">✕</span>
      <div className="k" id="tk">Sistema</div>
      <div className="t" id="tt"></div>
      <div className="s" id="ts"></div>
    </div>
  );
}
