import { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { RECALL_THEMES, AM } from '../state/config.js';
import { today } from '../state/dates.js';
import { xpMult } from '../state/world.js';
import { findQuestion, addDays } from '../state/recall.js';

// Revisão Ativa — Missão 25 · Fase 7. Porta renderRecall/recallQuestionHTML/
// recallSummaryHTML de recall.js:106-149 + o formulário de pergunta própria.
// `revealed` é estado local (era global no Vanilla). FX (floatXP/toast) deferido.
export default function Recall({ S }) {
  const { answerRecall, addCustomQuestion } = useStore();
  const [revealed, setRevealed] = useState(false);

  function grade(id, g) { answerRecall(id, g); setRevealed(false); }

  let body;
  if (!S.recallToday || !S.recallToday.ids || !S.recallToday.ids.length) {
    body = <div className="dhint">Sem perguntas para rever hoje — já estudaste tudo o que havia disponível. 🎉</div>;
  } else {
    const set = S.recallToday.ids.map((id) => findQuestion(S, id)).filter(Boolean);
    const results = S.recallToday.results || {};
    const pending = set.filter((q) => !(q.id in results));
    if (!pending.length) {
      const acertos = set.filter((q) => results[q.id] === 'ok').length;
      const totalGain = set.reduce((s, q) => s + Math.round((8 + (results[q.id] === 'ok' ? 4 : 0)) * xpMult(S, 'saber')), 0);
      const amanha = set.filter((q) => { const r = S.recall[q.id]; return r && r.due === addDays(today(), 1); }).length;
      body = (
        <div className="rc-summary">
          <div className="rc-sum-h">📖 Revisão concluída</div>
          <div className="rc-sum-row"><span>Acertos</span><b>{acertos} / {set.length}</b></div>
          <div className="rc-sum-row"><span>XP de Saber ganho</span><b style={{ color: AM.saber.color }}>+{totalGain} XP</b></div>
          <div className="rc-sum-row"><span>Voltam amanhã</span><b>{amanha}</b></div>
          <div className="rc-sum-row"><span>Streak de estudo</span><b>🔥 {S.studyStreak.count} dia{S.studyStreak.count === 1 ? '' : 's'}</b></div>
        </div>
      );
    } else {
      const q = pending[0]; const idx = set.length - pending.length; const total = set.length;
      const th = RECALL_THEMES[q.tema] || { label: q.tema, color: 'var(--sky)' };
      const difLabel = q.dif ? (q.dif[0].toUpperCase() + q.dif.slice(1)) : '—';
      body = (
        <>
          <div className="rc-meta">
            <span className="wchip" style={{ borderColor: th.color, color: th.color }}>{th.label}</span>
            <span className="wchip">{difLabel}</span>
            <span className="rc-prog">{idx + 1} / {total}</span>
            {S.studyStreak.count > 0 && <span className="stk">🔥 {S.studyStreak.count}</span>}
          </div>
          <div className="rc-q">{q.q}</div>
          {revealed ? (
            <>
              <div className="rc-a">{q.a}</div>
              <div className="rc-ref">{q.ref}</div>
              <div className="rc-grades">
                <button className="rc-btn fail" onClick={() => grade(q.id, 'fail')}>✕ Falhei</button>
                <button className="rc-btn meh" onClick={() => grade(q.id, 'meh')}>≈ Mais ou menos</button>
                <button className="rc-btn ok" onClick={() => grade(q.id, 'ok')}>✓ Acertei</button>
              </div>
            </>
          ) : <button className="btn" onClick={() => setRevealed(true)}>Revelar resposta</button>}
        </>
      );
    }
  }

  return (
    <div className="panel reveal" style={{ animationDelay: '.23s' }}>
      <div className="ptitle"><b>Revisão do Dia</b> · Active Recall</div>
      <div className="dhint">Repetição espaçada: vencidas primeiro, distribuídas por tema. Revela a resposta antes de te avaliares — a honestidade da auto-avaliação é o que torna isto útil.</div>
      <div id="recall">{body}</div>
      <CustomForm addCustomQuestion={addCustomQuestion} />
    </div>
  );
}

function CustomForm({ addCustomQuestion }) {
  const [tema, setTema] = useState(Object.keys(RECALL_THEMES)[0]);
  const [dif, setDif] = useState('base');
  const [ref, setRef] = useState('');
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  function add() { const r = addCustomQuestion({ tema, dif, ref, q, a }); if (!r.error) { setRef(''); setQ(''); setA(''); } }
  return (
    <details className="addq-recall">
      <summary>+ Adicionar pergunta minha</summary>
      <div className="addq">
        <div className="addq-row">
          <select id="cq-tema" value={tema} onChange={(e) => setTema(e.target.value)}>
            {Object.entries(RECALL_THEMES).map(([id, t]) => <option key={id} value={id}>{t.label}</option>)}
          </select>
          <select id="cq-dif" value={dif} onChange={(e) => setDif(e.target.value)}>
            <option value="base">Base</option>
            <option value="media">Média</option>
            <option value="avancada">Avançada</option>
          </select>
          <input id="cq-ref" placeholder="Referência (ex.: RGPD, art. 6.º)" maxLength={120} value={ref} onChange={(e) => setRef(e.target.value)} />
        </div>
        <textarea id="cq-q" placeholder="Pergunta..." rows={2} maxLength={800} value={q} onChange={(e) => setQ(e.target.value)} />
        <textarea id="cq-a" placeholder="Resposta..." rows={3} maxLength={1500} value={a} onChange={(e) => setA(e.target.value)} />
        <button className="btn" onClick={add}>+ Adicionar ao banco</button>
      </div>
    </details>
  );
}
