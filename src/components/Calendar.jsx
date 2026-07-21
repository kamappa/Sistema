import { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { EVT } from '../state/config.js';
import { today, daysUntil } from '../state/dates.js';
import { MONTHS } from '../state/calendar.js';
import { exportICS } from '../lib/exports.js';

// Calendário & eventos — Missão 25 · Fase 11. Porta renderCalendar (hud.js:82-110):
// grelha do mês (navegável), selo em dias passados com XP, pontos por evento,
// próximos prazos, adicionar/remover. Export .ics (M20). calY/calM/inputs são
// estado local. Notificações browser (enableNotif) ficam para uma fase de PWA.
const WD = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function Calendar({ S }) {
  const { addEvent, delEvent } = useStore();
  const now = new Date();
  const [calY, setCalY] = useState(now.getFullYear());
  const [calM, setCalM] = useState(now.getMonth());
  const [evDate, setEvDate] = useState('');
  const [evTitle, setEvTitle] = useState('');
  const [evType, setEvType] = useState('AUTO');

  function navMonth(n) { let m = calM + n, y = calY; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } setCalM(m); setCalY(y); }
  function add() { const r = addEvent({ date: evDate, title: evTitle, type: evType }); if (!r.error) setEvTitle(''); }
  function pickDay(ds) { setEvDate(ds); }

  const startDay = (new Date(calY, calM, 1).getDay() + 6) % 7;
  const ndays = new Date(calY, calM + 1, 0).getDate();
  const tT = today();
  const okD = new Set((S.history || []).filter((h) => h.v > 0).map((h) => h.d));

  const cells = [];
  WD.forEach((w) => cells.push(<div className="cal-wd" key={'wd' + w}>{w}</div>));
  for (let i = 0; i < startDay; i++) cells.push(<div className="cal-cell empty" key={'e' + i} />);
  for (let d = 1; d <= ndays; d++) {
    const ds = calY + '-' + String(calM + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    const evs = S.events.filter((e) => e.date === ds);
    cells.push(
      <div className={`cal-cell ${ds === tT ? 'today' : ''}${ds < tT && okD.has(ds) ? ' past-ok' : ''}`} key={ds} onClick={() => pickDay(ds)} title={evs.map((e) => e.title).join(', ')}>
        <div className="cal-num">{d}</div>
        <div className="cal-dots">{evs.slice(0, 4).map((e, i) => <span className="cal-dot" key={i} style={{ background: (EVT[e.type] || EVT.outro).c }} />)}</div>
        {evs.length > 0 && <div className="cal-ev">{evs[0].title}</div>}
      </div>
    );
  }

  const up = S.events.filter((e) => daysUntil(e.date) >= 0).sort((a, b) => (a.date < b.date ? -1 : 1)).slice(0, 6);

  return (
    <div className="panel reveal" style={{ animationDelay: '.34s' }}>
      <div className="ptitle"><b>Calendário</b> · prazos & eventos <button className="notif-btn" onClick={() => exportICS(S)} style={{ marginLeft: 'auto' }}>📅 Exportar .ics</button></div>
      <div id="cal">
        <div className="cal-head">
          <button className="cal-nav" onClick={() => navMonth(-1)}>‹</button>
          <div className="cal-title">{MONTHS[calM]} {calY}</div>
          <button className="cal-nav" onClick={() => navMonth(1)}>›</button>
        </div>
        <div className="cal-grid">{cells}</div>
        <div className="cal-add">
          <input type="date" id="ev-date" value={evDate} onChange={(e) => setEvDate(e.target.value)} />
          <input id="ev-title" placeholder="Prazo, exame, evento..." maxLength={60} value={evTitle} onChange={(e) => setEvTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} />
          <select id="ev-type" value={evType} onChange={(e) => setEvType(e.target.value)}>
            <option value="AUTO">Auto</option>
            {Object.entries(EVT).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
          </select>
          <button className="btn" onClick={add}>+ Add</button>
        </div>
        <div className="up-lbl">📌 Próximos prazos</div>
        {up.length ? up.map((e) => {
          const t = EVT[e.type] || EVT.outro, dd = daysUntil(e.date);
          return (
            <div className="up-item" key={e.id}>
              <span className="up-dot" style={{ background: t.c }} />
              <span className="up-d">{e.date.slice(8, 10)}/{e.date.slice(5, 7)}</span>
              <span className="up-t">{e.title}</span>
              <span className="up-x" style={{ color: t.c }}>{dd === 0 ? 'hoje' : dd === 1 ? 'amanhã' : 'em ' + dd + 'd'}</span>
              <span className="up-del" onClick={() => delEvent(e.id)}>✕</span>
            </div>
          );
        }) : <div className="up-empty">Sem prazos próximos.</div>}
      </div>
    </div>
  );
}
