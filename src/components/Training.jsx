import { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { TLINES, PROG } from '../state/config.js';
import { consecTrained, weekSessions, trAdvice } from '../state/training.js';

// Treino (calistenia) — Missão 25 · Fase 8. Markup de legacy/index.html + o
// render de treino.js:62-91. Os inputs são estado controlado (React) em vez do
// truque trKeep do Vanilla — os valores persistem naturalmente entre re-renders.
// FX (toasts de evolução/teto, floatXP) deferido; a lógica de XP/passos é a do
// store (finishTraining).
const feelOpts = [['f', 'Fácil'], ['ok', 'OK'], ['d', 'Difícil']];

export default function Training({ S }) {
  const { finishTraining } = useStore();
  const [lines, setLines] = useState(() => Object.fromEntries(TLINES.map((L) => [L.id, { reps: '', feel: 'ok' }])));
  const [extra, setExtra] = useState(false);
  const [notes, setNotes] = useState('');
  // Missão 26 · Fase 4. Qual linha está aberta para registo. SÓ tem efeito em
  // ecrã estreito: o CSS ignora este estado acima de 900px, onde o painel fica
  // exatamente como estava. O problema medido é do mobile (o Treino ocupava
  // 1271px, 28% da zona Operações), não do desktop, que já cabe em 3,81 ecrãs.
  const [aberta, setAberta] = useState(null);
  const [verConselho, setVerConselho] = useState(false);

  const setLine = (id, k, v) => setLines((s) => ({ ...s, [id]: { ...s[id], [k]: v } }));
  // `kegel: { done: false }` continua a ser enviado porque `finishTraining`
  // espera o campo — mas nunca mais vem preenchido daqui. Manter a forma do
  // payload evita alterar a assinatura do domínio para tirar uma linha da UI.
  function finish() { finishTraining({ lines, kegel: { done: false }, extra, notes }); }
  const toggle = (id) => setAberta((a) => (a === id ? null : id));

  const consec = consecTrained(S);
  const hist = S.training.sessions.slice(-4).reverse();

  return (
    <div className="panel reveal" style={{ animationDelay: '.26s' }}>
      <div className="ptitle"><b>Treino</b> · Calistenia — novato → expert</div>
      <div id="training">
        <div className="tr-stats">
          <span className="wchip">Sessões: {S.training.sessions.length}</span>
          <span className="wchip">Esta semana: {weekSessions(S)}/3</span>
          <span className={`wchip ${consec >= 4 ? '' : 'green'}`}>{consec} dia(s) seguido(s)</span>
        </div>
        <button type="button" className="tr-advice" data-open={verConselho} onClick={() => setVerConselho((v) => !v)}>
          {trAdvice(S)}
        </button>
        <div className="tr-grid">
          {TLINES.map((L) => {
            const idx = S.training.prog[L.id], st = PROG[L.id][idx];
            // Uma linha conta como "por registar" enquanto não tiver reps. Ao
            // ter, fica aberta — o que já foi escrito nunca se esconde.
            const preenchida = String(lines[L.id].reps).trim() !== '';
            const open = aberta === L.id || preenchida;
            return (
              <div className="trl" data-open={open} style={{ borderLeft: `2px solid ${L.c}` }} key={L.id}>
                <div className="trl-h" onClick={() => toggle(L.id)} role="button" tabIndex={0}
                     onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(L.id); } }}>
                  <span style={{ color: L.c }}>{L.n}</span>
                  <span className="trl-step">Passo {idx + 1}/{PROG[L.id].length}</span>
                </div>
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
          {/* ── PAVIMENTO PÉLVICO SAIU DAQUI — Fase 7Z, decisão do Daniel ──
              Estava aqui como QUINTA LINHA DE CALISTENIA, com passos de
              progressão e XP próprios, ao lado de Empurrar/Puxar/Pernas/Core.
              E estava também, no mesmo subespaço, como rotina guiada em Corpo e
              Recuperação. O Operador via "Pavimento Pélvico" duas vezes, com
              dois modelos diferentes: um com XP e progressão automática, outro
              sem XP nenhum.

              A decisão formal: Kegel é um TIPO DE EXERCÍCIO dentro de Pavimento
              Pélvico. Não é módulo independente, não é sessão de calistenia, e
              não é fonte automática de XP enquanto a regra de domínio não
              existir.

              O QUE NÃO FOI TOCADO, e é deliberado: `S.training.prog.kegel` e o
              `lines.kegel` das sessões já registadas continuam no estado, tal
              como estão. São dados legítimos de treinos que aconteceram mesmo.
              Zero alterações a schema; o que saiu foi a entrada de dados nova,
              não o registo do que passou. */}
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
