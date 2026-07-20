import { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { TLINES, KLINE, PROG } from '../state/config.js';
import { consecTrained, weekSessions, kegelDaysAtStep, trAdvice } from '../state/training.js';

// Treino (calistenia) — Missão 25 · Fase 8. Markup de legacy/index.html + o
// render de treino.js:62-91. Os inputs são estado controlado (React) em vez do
// truque trKeep do Vanilla — os valores persistem naturalmente entre re-renders.
// FX (toasts de evolução/teto, floatXP) deferido; a lógica de XP/passos é a do
// store (finishTraining).
const feelOpts = [['f', 'Fácil'], ['ok', 'OK'], ['d', 'Difícil']];

export default function Training({ S }) {
  const { finishTraining } = useStore();
  const [lines, setLines] = useState(() => Object.fromEntries(TLINES.map((L) => [L.id, { reps: '', feel: 'ok' }])));
  const [kegel, setKegel] = useState({ done: false, feel: 'ok' });
  const [extra, setExtra] = useState(false);
  const [notes, setNotes] = useState('');

  const setLine = (id, k, v) => setLines((s) => ({ ...s, [id]: { ...s[id], [k]: v } }));
  function finish() { finishTraining({ lines, kegel, extra, notes }); }

  const consec = consecTrained(S);
  const hist = S.training.sessions.slice(-4).reverse();
  const ki = S.training.prog.kegel, ks = PROG.kegel[ki];

  return (
    <div className="panel reveal" style={{ animationDelay: '.26s' }}>
      <div className="ptitle"><b>Treino</b> · Calistenia — novato → expert</div>
      <div id="training">
        <div className="tr-stats">
          <span className="wchip">Sessões: {S.training.sessions.length}</span>
          <span className="wchip">Esta semana: {weekSessions(S)}/3</span>
          <span className={`wchip ${consec >= 4 ? '' : 'green'}`}>{consec} dia(s) seguido(s)</span>
        </div>
        <div className="tr-advice">{trAdvice(S)}</div>
        <div className="tr-grid">
          {TLINES.map((L) => {
            const idx = S.training.prog[L.id], st = PROG[L.id][idx];
            return (
              <div className="trl" style={{ borderLeft: `2px solid ${L.c}` }} key={L.id}>
                <div className="trl-h"><span style={{ color: L.c }}>{L.n}</span><span className="trl-step">Passo {idx + 1}/{PROG[L.id].length}</span></div>
                <div className="trl-ex">{st.n}</div><div className="trl-t">Alvo para evoluir: 3×{st.t}</div>
                <div className="trl-in">
                  <input type="number" id={`tr-${L.id}-reps`} placeholder="melhor série" min="0" max="500" value={lines[L.id].reps} onChange={(e) => setLine(L.id, 'reps', e.target.value)} />
                  <select id={`tr-${L.id}-feel`} value={lines[L.id].feel} onChange={(e) => setLine(L.id, 'feel', e.target.value)}>
                    {feelOpts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
          <div className="trl" style={{ borderLeft: `2px solid ${KLINE.c}` }}>
            <div className="trl-h"><span style={{ color: KLINE.c }}>{KLINE.n}</span><span className="trl-step">Passo {ki + 1}/{PROG.kegel.length}</span></div>
            <div className="trl-ex">{ks.n} · {ks.cyc} ciclos</div>
            <div className="trl-t">10–15 min · rápidas = 1s/1s · Evolui com 3 dias no alvo ({Math.min(kegelDaysAtStep(S, ki), 3)}/3)</div>
            <div className="trl-in" style={{ alignItems: 'center' }}>
              <label className="tr-x"><input type="checkbox" id="tr-kegel-done" checked={kegel.done} onChange={(e) => setKegel((k) => ({ ...k, done: e.target.checked }))} /> Sessão feita</label>
              <select id="tr-kegel-feel" value={kegel.feel} onChange={(e) => setKegel((k) => ({ ...k, feel: e.target.value }))}>
                {feelOpts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="trl-t" style={{ marginTop: 6 }}>Respiração normal — se abdominais, glúteos ou coxas contraem, está errado. Diário vale mais que intenso.</div>
          </div>
        </div>
        <div className="addq" style={{ alignItems: 'center' }}>
          <label className="tr-x"><input type="checkbox" id="tr-extra" checked={extra} onChange={(e) => setExtra(e.target.checked)} /> Volume extra (senti facilidade)</label>
          <input id="tr-notes" placeholder="Notas (dores, variações...)" maxLength={90} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button className="btn" onClick={finish}>Concluir treino</button>
        </div>
        {hist.length > 0 && (
          <>
            <div className="up-lbl" style={{ marginTop: 12 }}>Últimas sessões</div>
            <div className="log">
              {hist.map((s, i) => (
                <div className="li" key={i}>
                  <span>{s.d.slice(8, 10)}/{s.d.slice(5, 7)} · {Object.keys(s.lines).length} linhas{s.adv ? ' · ↑' + s.adv : ''}{s.extra ? ' · extra' : ''}</span>
                  <span className="g">+{s.xp} XP</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
