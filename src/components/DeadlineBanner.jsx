import { daysUntil } from '../state/dates.js';

// Faixa de prazos — Missão 25 · Fase 10. Porta renderDeadlineBanner
// (hud.js:111-121): eventos ≤7d + missões pendentes com prazo ≤2d (URGENTE).
export default function DeadlineBanner({ S }) {
  const evs = S.events.filter((e) => { const d = daysUntil(e.date); return d >= 0 && d <= 7; }).map((e) => ({ t: e.title, d: daysUntil(e.date), k: 'ev' }));
  const objs = (S.objectives || []).filter((o) => o.status !== 'done' && o.deadline && daysUntil(o.deadline) <= 2).map((o) => ({ t: o.title, d: daysUntil(o.deadline), k: 'obj' }));
  const all = [...objs, ...evs].sort((a, b) => a.d - b.d);
  if (!all.length) return null;
  const lbl = (x) => x.d < 0 ? ('atrasado ' + Math.abs(x.d) + 'd') : x.d === 0 ? 'hoje' : x.d === 1 ? 'amanhã' : x.d + 'd';
  const it = all.slice(0, 3).map((x) => (x.k === 'obj' ? '🎯 ' : '') + x.t + ' (' + lbl(x) + ')').join(' · ');
  return (
    <div className="deadline-banner" id="deadline-banner" style={{ display: 'flex' }}>
      <span className="db-ic">⚠️</span>
      <span>{objs.length > 0 && <b style={{ color: '#fca5a5' }}>URGENTE — </b>}{it}{all.length > 3 ? ' +' + (all.length - 3) : ''}</span>
    </div>
  );
}
