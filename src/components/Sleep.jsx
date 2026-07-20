import { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { fmt, today, diffDays } from '../state/dates.js';
import { sleepStreak } from '../state/sleep.js';

// Sono (regulador) — Missão 25 · Fase 9. Markup/lógica de sono.js:27-48. Barras
// dos últimos 14 dias, stats, formulário (inputs controlados) e hora-alvo de
// recolher. FX (toasts) deferido.
export default function Sleep({ S }) {
  const { logSleep, setSleepT } = useStore();
  const [date, setDate] = useState(today());
  const [bed, setBed] = useState('');
  const [wake, setWake] = useState('');
  const [q, setQ] = useState('boa');

  const logs = S.sleep.logs;
  const lastL = logs[logs.length - 1];
  const l7 = logs.filter((l) => diffDays(l.d, today()) < 7);
  const avg = l7.length ? Math.round(l7.reduce((s, l) => s + l.h, 0) / l7.length * 10) / 10 : 0;

  const bars = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const L = logs.find((x) => x.d === fmt(d));
    const h = L ? L.h : 0;
    const col = !L ? 'rgba(255,255,255,.06)' : (h >= 7.5 && h <= 9.5) ? '#34d399' : (h < 6.5 ? '#ef4444' : '#fb923c');
    bars.push(<div className="slb" key={i} style={{ height: (L ? Math.min(100, h / 10 * 100) : 4) + '%', background: col }} title={`${fmt(d)}: ${L ? h + 'h' : '—'}`} />);
  }

  function reg() { const r = logSleep({ bed, wake, q, date }); if (!r.error) { setBed(''); setWake(''); } }

  return (
    <div className="panel reveal" style={{ animationDelay: '.27s' }}>
      <div className="ptitle"><b>Sono</b> · Regulador</div>
      <div id="sleep">
        <div className="tr-stats">
          <span className="wchip">{lastL ? ('Última: ' + lastL.h + 'h') : 'Sem registos'}</span>
          <span className="wchip">Média 7d: {avg || '—'}h</span>
          <span className="wchip green">Streak no alvo: {sleepStreak(S)}</span>
        </div>
        <div className="sl-bars">{bars}</div>
        <div className="addq" style={{ alignItems: 'center' }}>
          <label className="tr-x">Noite de <input type="date" id="sl-date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label className="tr-x">Deitar <input type="time" id="sl-bed" value={bed} onChange={(e) => setBed(e.target.value)} /></label>
          <label className="tr-x">Acordar <input type="time" id="sl-wake" value={wake} onChange={(e) => setWake(e.target.value)} /></label>
          <select id="sl-q" value={q} onChange={(e) => setQ(e.target.value)}>
            <option value="boa">Boa</option>
            <option value="media">Média</option>
            <option value="ma">Má</option>
          </select>
          <button className="btn" onClick={reg}>Registar noite</button>
        </div>
        <div className="vit-note">Alvo: 7,5–9h e consistência de horário (o cérebro premeia regularidade mais do que maratonas de fim de semana). Hora-alvo de recolher <input type="time" style={{ width: 'auto', padding: '3px 6px' }} value={S.sleep.bedT} onChange={(e) => setSleepT('bedT', e.target.value)} /> — o mundo lembra-te à noite. Noite no alvo marca o pilar do sono sozinha.</div>
      </div>
    </div>
  );
}
