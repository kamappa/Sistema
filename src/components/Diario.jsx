import { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { ATTRS, AM } from '../state/config.js';
import { today } from '../state/dates.js';

// Diário (hábitos) — Missão 25 · Fase 5, o primeiro painel INTERATIVO. Markup de
// legacy/index.html:140-147 + habHTML de engine.js:90-99. Clicar marca/desmarca
// via store.toggleHabit (motor de XP portado). FX (floatXP/cardWave/onda de
// conclusão) deferido para o fx.js. O ✕ apaga extras personalizados.
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#04121f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

function Hab({ h, list, oblig }) {
  const { toggleHabit, delHabit } = useStore();
  const done = h.lastDone === today();
  return (
    <div className={`hab ${done ? 'done' : ''} ${oblig ? 'oblig' : ''}`} data-hid={h.id} onClick={() => toggleHabit(list, h.id)}>
      <div className="chk"><CheckIcon /></div>
      <div className="hb">
        <div className="hn">{h.name}</div>
        <div className="hm">{AM[h.attr].name} · +{h.xp} XP{oblig && <> · <span className="pen">falha −{h.pen}</span></>}</div>
      </div>
      <div className={`stk ${h.streak > 0 ? '' : 'off'}`}>🔥 {h.streak}</div>
      {h.id.startsWith('c') && <span className="up-del" onClick={(e) => { e.stopPropagation(); delHabit(h.id); }}>✕</span>}
    </div>
  );
}

export default function Diario({ S }) {
  const { addHabit } = useStore();
  const [text, setText] = useState('');
  const [attr, setAttr] = useState(ATTRS[0].id);

  function add() {
    const r = addHabit(text, attr);
    if (!r.error) setText('');
  }

  return (
    <div className="cols">
      <div className="panel reveal" style={{ animationDelay: '.2s' }}>
        <div className="ptitle"><b>Diário</b> · Constância</div>
        <div className="dhint">Os <b>obrigatórios</b> (marca vermelha) têm de ser feitos todos os dias. Se o dia fechar sem eles, <b>perdes XP</b>. Os extras são bónus.</div>
        <div className="sec-lbl">⚔️ Obrigatórios</div>
        <div id="oblig">{S.oblig.map((h) => <Hab key={h.id} h={h} list="oblig" oblig />)}</div>
        <div className="sec-lbl">✦ Extras</div>
        <div id="extras">{S.extras.map((h) => <Hab key={h.id} h={h} list="extras" oblig={false} />)}</div>
        <div className="addq">
          <input id="nh-t" placeholder="Novo hábito diário (bónus)..." maxLength={60} value={text}
            onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} />
          <select id="nh-a" value={attr} onChange={(e) => setAttr(e.target.value)}>
            {ATTRS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <button className="btn" onClick={add}>+ Add</button>
        </div>
      </div>
    </div>
  );
}
