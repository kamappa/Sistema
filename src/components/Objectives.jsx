import { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { ATTRS, AM, PRI, OSTL, TIER_LABEL, SEASON_ARCS } from '../state/config.js';
import { daysUntil } from '../state/dates.js';

// Missões (objetivos-mestra) — Missão 25 · Fase 6. Markup/lógica de
// objetivos.js:65-98 (renderObjectives). Filtros locais (objF), lista ordenada,
// linhas com estado clicável (cycleObj), chips de área/tier/arco/tags/prazo, add
// com triagem AUTO. FX (toast da triagem, floatXP, onda) deferido.
export default function Objectives({ S }) {
  const { addObjective, delObjective, cycleObj } = useStore();
  const [objF, setObjF] = useState({ est: 'all', area: 'all', sort: 'prazo', dif: 'all' });
  const [title, setTitle] = useState('');
  const [areaSel, setAreaSel] = useState('AUTO');
  const [priSel, setPriSel] = useState('AUTO');
  const [deadline, setDeadline] = useState('');
  const set = (k, v) => setObjF((f) => ({ ...f, [k]: v }));

  const curArc = (S.worldArc && S.worldArc.status === 'active') ? S.worldArc.id : null;
  const curArcLabel = curArc ? (SEASON_ARCS.find((a) => a.id === curArc) || {}).name.split(' ').slice(0, 2).join(' ') : null;

  const list = S.objectives.filter((o) => (objF.est === 'all' || o.status === objF.est) && (objF.area === 'all' || o.area === objF.area) && (objF.dif === 'all' || (o.tags && o.tags.includes(objF.dif))));
  list.sort((a, b) => {
    if (objF.sort === 'prazo') return (a.deadline || '9999') < (b.deadline || '9999') ? -1 : 1;
    if (objF.sort === 'pri') return a.pri < b.pri ? -1 : 1;
    return a.created < b.created ? -1 : 1;
  });

  function add() { const r = addObjective({ title, deadline, priSel, areaSel }); if (!r.error) { setTitle(''); setDeadline(''); } }

  const estLbl = { all: 'Estado: todos', pend: 'Pendentes', doing: 'Em curso', done: 'Feitos' };

  return (
    <div className="panel reveal" style={{ animationDelay: '.29s' }}>
      <div className="ptitle"><b>Missões</b> · Lista-mestra filtrável</div>
      <div id="objs">
        <div className="obj-filters">
          <select value={objF.est} onChange={(e) => set('est', e.target.value)}>{['all', 'pend', 'doing', 'done'].map((v) => <option key={v} value={v}>{estLbl[v]}</option>)}</select>
          <select value={objF.area} onChange={(e) => set('area', e.target.value)}><option value="all">Área: todas</option>{ATTRS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
          <select value={objF.sort} onChange={(e) => set('sort', e.target.value)}>{[['prazo', 'Ordenar: prazo'], ['pri', 'Ordenar: prioridade'], ['created', 'Ordenar: criação']].map((x) => <option key={x[0]} value={x[0]}>{x[1]}</option>)}</select>
          <select value={objF.dif} onChange={(e) => set('dif', e.target.value)}><option value="all">Dificuldade: todas</option>{['⚡ Rápida', '🔨 Média', '🏔 Épica'].map((v) => <option key={v} value={v}>{v}</option>)}</select>
        </div>
        <div>
          {list.length ? list.map((o) => {
            const p = PRI[o.pri]; let dl = null;
            if (o.deadline) { const d = daysUntil(o.deadline); const c = d <= 3 ? '#ef4444' : d <= 7 ? '#fb923c' : 'var(--mut)'; dl = <span className="up-x" style={{ color: c }}>{d < 0 ? 'atrasado' : d === 0 ? 'hoje' : d + 'd'}</span>; }
            return (
              <div className={`obj-row ${o.status}`} data-oid={o.id} key={o.id}>
                <span className="obj-st" onClick={() => cycleObj(o.id)} title="pendente → em curso → feito">{OSTL[o.status]}</span>
                <span className="obj-t">{o.title}</span>
                <span className="wchip" style={{ borderColor: AM[o.area].color, color: AM[o.area].color, padding: '2px 8px' }}>{AM[o.area].name}</span>
                <span className="wchip" style={{ borderColor: p.c, color: p.c, padding: '2px 8px' }}>{TIER_LABEL[o.pri]}</span>
                {(o.arc && o.arc === curArc) && <span className="wchip" style={{ padding: '1px 7px', fontSize: 9, borderColor: 'var(--line2)', color: 'var(--mut)' }}>{curArcLabel}</span>}
                {(o.tags || []).map((tg) => <span className="wchip" key={tg} style={{ padding: '1px 7px', fontSize: 9, borderColor: 'var(--line2)', color: 'var(--mut)' }}>{tg}</span>)}
                {dl}<span className="up-del" onClick={() => delObjective(o.id)}>✕</span>
              </div>
            );
          }) : <div className="up-empty">Sem missões neste filtro. Adiciona a primeira — Elite vale 150 XP e uma Sombra Nv 10.</div>}
        </div>
        <div className="addq">
          <input id="ob-t" placeholder="Novo objetivo..." maxLength={90} value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} />
          <select id="ob-a" value={areaSel} onChange={(e) => setAreaSel(e.target.value)}><option value="AUTO">Auto</option>{ATTRS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
          <select id="ob-p" value={priSel} onChange={(e) => setPriSel(e.target.value)}><option value="AUTO">Auto</option><option value="side">Side</option><option value="main">Main</option><option value="elite">Elite</option><option value="boss">Boss</option></select>
          <input type="date" id="ob-d" value={deadline} onChange={(e) => setDeadline(e.target.value)} /><button className="btn" onClick={add}>+ Add</button>
        </div>
      </div>
    </div>
  );
}
