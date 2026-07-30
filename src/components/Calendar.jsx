import { useState } from 'react';
import Collapse from '../design-system/Collapse.tsx';
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

  /* Missão 26 · Fase 6F — OS ESTADOS DA CÉLULA.
   *
   * O que existia: `today` e `past-ok`. Clicar num dia mudava o campo de data
   * do formulário e mais nada — não havia forma de ver qual estava escolhido,
   * e a célula era um `<div>` com `onClick`: invisível ao teclado e sem estado
   * para um leitor de ecrã.
   *
   * O que passa a existir, e nenhum depende só de cor:
   *   hoje        · ponto interno (luz)
   *   selecionado · contorno
   *   evento      · marca inferior
   *   prazo       · filete lateral; urgente muda a cor E a espessura
   *   passado ok  · filete em baixo
   *   fora do mês · sem célula, e fora da ordem de tabulação
   *
   * Hoje e selecionado são MARCAS DIFERENTES de propósito: podem coexistir no
   * mesmo dia, e se fossem a mesma linguagem seria impossível saber qual é.
   */
  const deadlines = (S.objectives || []).filter((o) => o.status !== 'done' && o.deadline);

  const cells = [];
  WD.forEach((w) => cells.push(<div className="cal-wd" key={'wd' + w}>{w}</div>));
  for (let i = 0; i < startDay; i++) {
    // Fora do mês: continua a ocupar a grelha (a 7×6 não se comprime) mas não
    // é um alvo nem entra na tabulação.
    cells.push(<div className="cal-cell empty" key={'e' + i} aria-hidden="true" />);
  }
  for (let d = 1; d <= ndays; d++) {
    const ds = calY + '-' + String(calM + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    const evs = S.events.filter((e) => e.date === ds);
    const dls = deadlines.filter((o) => o.deadline === ds);
    const urgent = dls.length > 0 && daysUntil(ds) <= 2;
    const isToday = ds === tT;
    const isSel = evDate === ds;
    const label = [
      new Date(ds).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' }),
      isToday ? 'hoje' : null,
      evs.length ? `${evs.length} ${evs.length === 1 ? 'evento' : 'eventos'}` : null,
      dls.length ? `${dls.length} ${dls.length === 1 ? 'prazo' : 'prazos'}${urgent ? ' urgente' : ''}` : null,
    ].filter(Boolean).join(', ');

    cells.push(
      <button
        type="button"
        className={`cal-cell${isToday ? ' today' : ''}${isSel ? ' sel' : ''}${ds < tT && okD.has(ds) ? ' past-ok' : ''}${dls.length ? ' has-dl' : ''}${urgent ? ' dl-urgent' : ''}`}
        key={ds}
        onClick={() => pickDay(ds)}
        aria-pressed={isSel}
        aria-label={label}
        title={[...evs.map((e) => e.title), ...dls.map((o) => '⚑ ' + o.title)].join(', ')}
      >
        <span className="cal-num">{d}</span>
        <span className="cal-dots">{evs.slice(0, 4).map((e, i) => <span className="cal-dot" key={i} style={{ background: (EVT[e.type] || EVT.outro).c }} />)}</span>
        {evs.length > 0 && <span className="cal-ev">{evs[0].title}</span>}
      </button>
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
        {/* Fase 4: a grelha do mês NÃO se comprime — é a função do painel, e
            uma grelha de 7×6 ilegível não serve para nada. Só o formulário de
            evento recolhe. */}
        <Collapse label="+ Novo evento" forceOpen={evTitle !== ''}>
          <div className="cal-add">
            <input type="date" id="ev-date" value={evDate} onChange={(e) => setEvDate(e.target.value)} />
            <input id="ev-title" placeholder="Prazo, exame, evento..." maxLength={60} value={evTitle} onChange={(e) => setEvTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} />
            <select id="ev-type" value={evType} onChange={(e) => setEvType(e.target.value)}>
              <option value="AUTO">Auto</option>
              {Object.entries(EVT).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
            </select>
            <button className="btn" onClick={add}>+ Add</button>
          </div>
        </Collapse>
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
