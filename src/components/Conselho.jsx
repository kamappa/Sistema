import { useState } from 'react';
import { useStore } from '../store/useStore.js';

// Oráculo · Conselho — Missão 25 · Fase 15. Porta renderConselho/sendConselho
// (conselho.js). Chat com a Edge Function ?mode=chat (JWT). O teatro de
// pensamento e o typewriter (ocType) são fx — aqui a resposta entra direta. O
// botão "Aceitar como missão" aparece quando a resposta traz "⚔ Ação (48h): …".
const ACTION_RE = /^⚔️?\s*A[çc][ãa]o\s*\(48h\)\s*:\s*(.+)$/mi;
const offeredMission = (reply) => { const m = reply.match(ACTION_RE); return (m && m[1].trim()) ? m[1].trim().slice(0, 140) : null; };

export default function Conselho() {
  const { user, ocMsgs, ocBusy, ocQuotaLeft, sendConselho, acceptConselhoMission } = useStore();
  const [text, setText] = useState('');
  const [accepted, setAccepted] = useState(() => new Set());
  const left = ocQuotaLeft();

  function send() { const t = text.trim(); if (!t) return; setText(''); sendConselho(t); }
  function accept(idx, mission) { acceptConselhoMission(mission); setAccepted((s) => new Set(s).add(idx)); }

  return (
    <div className="panel reveal" style={{ animationDelay: '.095s' }}>
      <div className="ptitle"><b>Oráculo · Conselho</b> · conselheiro estratégico <span className="oc-quota" id="oc-quota">{user ? (left > 0 ? left + '/12 hoje' : 'limite de hoje atingido') : ''}</span></div>
      <div id="oc-log" className="oc-log">
        {!user ? (
          <div className="up-empty">Entra com a tua conta para falares com o Oráculo.</div>
        ) : (!ocMsgs.length && !ocBusy) ? (
          <div className="up-empty">Pergunta ao Oráculo — decisões de carreira, dúvidas, rumo. Quando a decisão for importante, o Conselho reúne as 5 lentes. 12 mensagens por dia.</div>
        ) : ocMsgs.map((m, i) => {
          const mission = m.cls === 'oc-orc' ? offeredMission(m.content) : null;
          return (
            <div key={i}>
              <div className={'oc-msg ' + m.cls}>{m.content}</div>
              {mission && (accepted.has(i)
                ? <button className="mini warm oc-accept" disabled>✓ Missão aceite</button>
                : <button className="mini warm oc-accept" onClick={() => accept(i, mission)}>⚔️ Aceitar como missão</button>)}
            </div>
          );
        })}
      </div>
      <div className="oc-row">
        <textarea id="oc-in" rows={2} maxLength={2000} placeholder="Pergunta ao Oráculo — decisões, dúvidas, rumo..." value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="btn" id="oc-send" disabled={!user || left <= 0 || ocBusy} onClick={send}>Enviar</button>
      </div>
    </div>
  );
}
