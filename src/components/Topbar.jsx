import { useEffect, useLayoutEffect } from 'react';
import { useStore } from '../store/useStore.js';
import { ATTRS, RANKS, need, rankOf, overallLevel } from '../state/config.js';

// Topbar glass (F3 v3 → Missão 25 · Fase 17b). Espelho do essencial (rank +
// nível + barra de rank), sem estado próprio — aparece ao passar o herói,
// encolhe em scroll fundo. Markup de legacy/index.html:34-39; o scroll toggle
// e a fillBar são o porto do IIFE do fx.js + render() do engine.js:135-140.
export default function Topbar() {
  const S = useStore((st) => st.S);

  // scroll → .on ao passar o herói (>430), .mini em scroll fundo (>1100)
  useEffect(() => {
    const tb = document.getElementById('topbar'); if (!tb) return;
    let tick = false;
    const upd = () => { tick = false; tb.classList.toggle('on', scrollY > 430); tb.classList.toggle('mini', scrollY > 1100); };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(upd); } };
    addEventListener('scroll', onScroll, { passive: true });
    upd();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  const lvl = S ? overallLevel(S) : 1;
  const r = S ? rankOf(lvl) : RANKS[0];
  let rankFrac = 0;
  if (S) {
    const frac = ATTRS.reduce((s, a) => s + S.attrs[a.id].xp / need(S.attrs[a.id].level), 0) / ATTRS.length;
    const span = (r.max >= 9999 ? (lvl + 5) : r.max) - r.min + 1;
    rankFrac = Math.min(1, ((lvl - r.min) + frac) / span);
  }

  // barra de rank com física — espelha a do herói (engine.js:139)
  useLayoutEffect(() => {
    if (!S || !window.Motion || !window.Motion.fillBar) return;
    window.Motion.fillBar('tb', document.getElementById('tb-fill'), rankFrac * 100);
  });

  return (
    <div className="topbar" id="topbar">
      <span className="tb-sys">SISTEMA</span>
      <span className="tb-rank" id="tb-rank" style={{ color: r.color }}>{r.l}</span>
      <span className="tb-lvl">Nv <b id="tb-lvln">{lvl}</b></span>
      <div className="tb-bar"><div className="tb-fill" id="tb-fill" style={{ width: (rankFrac * 100) + '%' }} /></div>
    </div>
  );
}
