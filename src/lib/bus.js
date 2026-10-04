// Bus de eventos — portado verbatim de legacy/js/bus.js (Missão 12 · 2B).
// Pub/sub mínimo: o código emite factos (xp:gain, rank:up, ...) e o palco WebGL
// ouve. Importado por efeito colateral no main.jsx ANTES do palco montar, para
// que o react.js do palco encontre window.Bus e ligue os pulsos ao XP real.
// Um listener que rebente nunca derruba o emissor.
window.Bus = (function () {
  const m = {};
  return {
    on(ev, fn) { (m[ev] = m[ev] || []).push(fn); },
    off(ev, fn) { m[ev] = (m[ev] || []).filter((f) => f !== fn); },
    emit(ev, d) { (m[ev] || []).forEach((f) => { try { f(d); } catch (e) {} }); },
  };
})();
