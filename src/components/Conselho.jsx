import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore.js';

// Oráculo · Conselho — Missão 25 · Fase 15 (+ teatro/typewriter na Fase 17).
// Porta renderConselho/sendConselho (conselho.js). Chat com a Edge Function
// ?mode=chat (JWT). O teatro de pensamento (moldura respira + linha rotativa) e
// o typewriter da resposta (ocType) entram agora — ambiente, não engano: a
// resposta real chega quando chega. Botão "Aceitar como missão" quando a
// resposta traz "⚔ Ação (48h): …".
const ACTION_RE = /^⚔️?\s*A[çc][ãa]o\s*\(48h\)\s*:\s*(.+)$/mi;
const offeredMission = (reply) => { const m = reply.match(ACTION_RE); return (m && m[1].trim()) ? m[1].trim().slice(0, 140) : null; };
const OC_THEATER = ['A consultar memórias…', 'A analisar o teu estado…', 'A reunir o Conselho…', 'A pesar os trade-offs…'];
const rmOn = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// bolha da resposta do Oráculo com máquina de escrever (conselho.js:58-70):
// escreve de uma vez com reduced-motion, saltável com clique; só a resposta
// mais recente escreve (as antigas ficam estáticas). Scroll segue o texto.
function OrcBubble({ content, live, logRef }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!live || rmOn()) { el.textContent = content; return; }
    let i = 0, fast = false; const skip = () => { fast = true; };
    document.addEventListener('click', skip, { once: true });
    const ms = Math.max(6, Math.min(18, 2600 / Math.max(1, content.length)));
    el.textContent = '';
    (function step() {
      if (fast || i >= content.length) { el.textContent = content; if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; return; }
      el.textContent = content.slice(0, ++i);
      if (i % 12 === 0 && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
      setTimeout(step, ms);
    })();
    return () => document.removeEventListener('click', skip);
  }, [content, live]);
  return <div className="oc-msg oc-orc" ref={ref}>{content}</div>;
}

export default function Conselho() {
  const { user, ocMsgs, ocBusy, ocQuotaLeft, sendConselho, acceptConselhoMission } = useStore();
  const [text, setText] = useState('');
  const [accepted, setAccepted] = useState(() => new Set());
  const [thinkIdx, setThinkIdx] = useState(0);
  const panelRef = useRef(null);
  const logRef = useRef(null);
  const left = ocQuotaLeft();

  // o Oráculo a pensar (M12·3C) — a moldura ganha um brilho lento enquanto a
  // resposta não chega; a classe entra/sai com ocBusy (nunca fica presa).
  useEffect(() => {
    const p = panelRef.current; if (!p) return;
    p.classList.toggle('oc-thinking', ocBusy);
    if (!ocBusy) return;
    setThinkIdx(0);
    const iv = setInterval(() => setThinkIdx((i) => (i + 1) % OC_THEATER.length), 2200);
    return () => clearInterval(iv);
  }, [ocBusy]);

  // segue o fundo do log a cada mensagem nova / linha de pensamento
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [ocMsgs.length, ocBusy]);

  function send() { const t = text.trim(); if (!t) return; setText(''); sendConselho(t); }
  function accept(idx, mission) { acceptConselhoMission(mission); setAccepted((s) => new Set(s).add(idx)); }

  const lastOrc = ocMsgs.map((m) => m.cls).lastIndexOf('oc-orc');

  return (
    <div className="panel reveal" style={{ animationDelay: '.095s' }} ref={panelRef}>
      <div className="ptitle"><b>Oráculo · Conselho</b> · conselheiro estratégico <span className="oc-quota" id="oc-quota">{user ? (left > 0 ? left + '/12 hoje' : 'limite de hoje atingido') : ''}</span></div>
      <div id="oc-log" className="oc-log" ref={logRef}>
        {!user ? (
          <div className="up-empty">Entra com a tua conta para falares com o Oráculo.</div>
        ) : (!ocMsgs.length && !ocBusy) ? (
          <div className="up-empty">Pergunta ao Oráculo — decisões de carreira, dúvidas, rumo. Quando a decisão for importante, o Conselho reúne as 5 lentes. 12 mensagens por dia.</div>
        ) : ocMsgs.map((m, i) => {
          const mission = m.cls === 'oc-orc' ? offeredMission(m.content) : null;
          return (
            <div key={i}>
              {m.cls === 'oc-orc'
                ? <OrcBubble content={m.content} live={i === lastOrc} logRef={logRef} />
                : <div className={'oc-msg ' + m.cls}>{m.content}</div>}
              {mission && (accepted.has(i)
                ? <button className="mini warm oc-accept" disabled>✓ Missão aceite</button>
                : <button className="mini warm oc-accept" onClick={() => accept(i, mission)}>⚔️ Aceitar como missão</button>)}
            </div>
          );
        })}
        {ocBusy && (
          <div className="oc-think"><span className="dot"></span><span className="oc-think-t">{OC_THEATER[thinkIdx]}</span></div>
        )}
      </div>
      <div className="oc-row">
        <textarea id="oc-in" rows={2} maxLength={2000} placeholder="Pergunta ao Oráculo — decisões, dúvidas, rumo..." value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="btn" id="oc-send" disabled={!user || left <= 0 || ocBusy} onClick={send}>Enviar</button>
      </div>
    </div>
  );
}
