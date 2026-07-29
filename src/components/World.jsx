import { useStore } from '../store/useStore.js';
import { AM } from '../state/config.js';
import { today } from '../state/dates.js';
import { seasonArcNow, seasonBounds, vitals, whisperToday, xpMult, doubleXPActive, rainyActive, heatActive } from '../state/world.js';

// World Engine — Missão 25 · Fase 13. Porta renderWorld (world.js:83-132):
// arco sazonal (propor/ativo), eventos do dia (Double XP/Rainy/Heat/Recovery),
// sussurro do dia, sinais vitais e a sugestão de Recovery. FX (toasts) deferido.
export default function World({ S }) {
  // arcAccept/arcLater/arcIgnore saíram daqui na Fase 5 — a decisão do arco
  // vive agora no CoreQueue. Ver o comentário no ramo `proposing`.
  const { claimWhisper, startRecovery } = useStore();
  const a = seasonArcNow(), b = seasonBounds(a), v = vitals(S);
  const wa = S.worldArc;
  const proposing = !wa || wa.id !== a.id || (wa.status === 'later' && wa.snooze !== today());

  let head;
  if (wa && wa.id === a.id && wa.status === 'active') {
    const t = new Date(today()), s = new Date(b.start), e = new Date(b.end);
    const total = Math.round((e - s) / 864e5) + 1; const day = Math.max(1, Math.min(Math.round((t - s) / 864e5) + 1, total));
    head = (
      <>
        <div className="w-head">
          <div><div className="at">{a.name} — ativo</div><div className="as">{a.desc}</div></div>
          <div className="boss">👹 Boss final: {a.boss}</div>
        </div>
        <div className="arc-count">
          <div className="arc-count-head"><span>Dia {day} / {total}</span><span>{Math.max(0, total - day)} dias restantes</span></div>
          <div className="arc-count-bar"><div className="arc-count-fill" style={{ width: day / total * 100 + '%' }} /></div>
        </div>
        <div className="w-chips">{Object.entries(a.bonus).map(([k, m]) => <span className="wchip green" key={k}>{AM[k].name} ×{m}</span>)}</div>
      </>
    );
  } else if (proposing) {
    // Missão 26 · Fase 5 — A PROPOSTA SAIU DAQUI.
    //
    // Estava um título, uma descrição e três botões a flutuar à direita de uma
    // linha de texto. Lia-se como maqueta por acabar, e era o item 7 do
    // diagnóstico do Daniel ("o Summer Arc parece provisório").
    //
    // Uma decisão por tomar é matéria de Command Core — é literalmente a
    // prioridade 4 da Próxima Ação. Passou para a coluna da direita
    // (`CoreQueue`, secção "Decisão"), onde tem cabeçalho, evidência e as três
    // saídas. Aqui não fica nada: repetir seria dar dois sítios para a mesma
    // decisão, e dois sítios são dois estados possíveis para uma verdade só.
    //
    // O painel do mundo mantém o que é ESTADO — clima, eventos, sussurro,
    // sinais vitais. O que exige resposta mudou de coluna, não desapareceu.
    head = null;
  } else {
    head = <div className="w-head"><div className="as">Sem arco ativo. O mundo volta a sussurrar na próxima estação — ou aceita este nas definições do destino (recarrega amanhã).</div></div>;
  }

  const chips = [];
  if (doubleXPActive()) chips.push(<span className="wchip gold" key="dx">⚡ Double XP Weekend — hábitos ×2</span>);
  if (rainyActive(S)) chips.push(<span className="wchip blue" key="rain">🌧 Rainy Focus — Saber ×1.15 hoje</span>);
  if (heatActive(S)) chips.push(<span className="wchip" key="heat">🔥 Heat Wave — treina cedo e hidrata</span>);
  if (S.recovery && today() <= S.recovery.until) chips.push(<span className="wchip green" key="rec">🌙 Recovery ativo até {S.recovery.until.slice(8, 10)}/{S.recovery.until.slice(5, 7)} — sem penalizações</span>);
  if (new Date().getHours() >= 21 && S.sleep && S.sleep.bedT) chips.push(<span className="wchip" key="bed">🌙 Recolher às {S.sleep.bedT} — o Corpo constrói-se a dormir</span>);

  const w = whisperToday(S), done = !!S.whisper[today()];
  const vc = v.burn >= 70 ? '#ef4444' : v.burn >= 40 ? '#fb923c' : '#34d399';
  const showRecovery = v.burn >= 70 && !(S.recovery && today() <= S.recovery.until);

  return (
    <div className="panel arc reveal" id="world" style={{ animationDelay: '.05s', flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
      {head}
      {chips.length > 0 && <div className="w-chips">{chips}</div>}
      <div className={`whisper ${done ? 'done' : ''}`}>
        <span>🌬</span><span className="wt">{w.t}</span>
        <span className="wx">+{Math.round(w.xp * xpMult(S, w.attr))} {AM[w.attr].name}</span>
        {done ? <span className="wx" style={{ color: 'var(--em)' }}>✓ feito</span> : <button className="mini" onClick={() => claimWhisper()}>Feito</button>}
      </div>
      <div className="vitals">
        <div className="vit"><div className="vl"><span>Momentum</span><span>{v.momentum}%</span></div><div className="vb"><div className="vf" style={{ width: v.momentum + '%', background: '#c084fc' }} /></div></div>
        <div className="vit"><div className="vl"><span>Risco de burnout</span><span>{v.burn}%</span></div><div className="vb"><div className="vf" style={{ width: v.burn + '%', background: vc }} /></div></div>
        <div className="vit"><div className="vl"><span>Recuperação</span><span>{v.recovery}%</span></div><div className="vb"><div className="vf" style={{ width: v.recovery + '%', background: '#a78bfa' }} /></div></div>
      </div>
      <div className="vit-note">Estimativas calculadas a partir dos teus dados (streaks, sono, volume de XP dos últimos 7 dias) — não são diagnósticos.</div>
      {showRecovery && <div className="w-chips"><button className="mini warm" onClick={() => startRecovery()}>🌙 O mundo sugere: ativa Recovery (2 dias sem penalizações)</button></div>}
    </div>
  );
}
