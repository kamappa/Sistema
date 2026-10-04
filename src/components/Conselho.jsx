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
/* A máquina de escrever da resposta do Oráculo.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A ANIMAÇÃO É ENFEITE; A RESPOSTA É INFORMAÇÃO. Uma informação NUNCA  ║
 * ║  pode ficar presa por causa do enfeite.                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * DOIS DEFEITOS APANHADOS NA AUDITORIA À CONTA REAL, 2026-07-30.
 *
 * 1 · A ESCRITA PARAVA DE VEZ COM A TAB EM SEGUNDO PLANO. Medido: com
 *     `document.visibilityState === 'hidden'`, o texto ficou em "O Oráculo " e
 *     não cresceu um único carácter em quatro segundos. O Chrome estrangula
 *     `setTimeout` em tabs ocultas — e aqui não é atraso, é parada. Quem
 *     mudasse de tab a meio de uma resposta voltava e encontrava uma frase
 *     cortada, sem forma de saber que faltava texto.
 *     Correção: assim que a tab fica oculta, escreve-se o texto INTEIRO. Quando
 *     ele voltar, a resposta está lá completa — que é o que ele quer.
 *
 * 2 · O `setTimeout` NÃO ERA CANCELADO no cleanup. Só o listener saía. Se
 *     `content` ou `live` mudassem a meio, ficavam duas máquinas de escrever a
 *     escrever no mesmo nó.
 *
 * E a resposta passou a ser ANUNCIADA: sem `aria-live`, o texto do Oráculo
 * aparecia sem nada avisar quem usa leitor de ecrã. `polite` e não `assertive`
 * — a resposta é para ler quando der, não para interromper. */
function OrcBubble({ content, live, logRef }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const tudo = () => { el.textContent = content; if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; };
    if (!live || rmOn() || document.hidden) { tudo(); return; }

    let i = 0, fast = false, timer = 0;
    const skip = () => { fast = true; };
    // A tab esconder-se conta como "mostra tudo já", pela razão do cabeçalho.
    const aoEsconder = () => { if (document.hidden) { fast = true; } };
    document.addEventListener('click', skip, { once: true });
    document.addEventListener('visibilitychange', aoEsconder);

    const ms = Math.max(6, Math.min(18, 2600 / Math.max(1, content.length)));
    el.textContent = '';
    (function step() {
      if (fast || i >= content.length) { tudo(); return; }
      el.textContent = content.slice(0, ++i);
      if (i % 12 === 0 && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
      timer = window.setTimeout(step, ms);
    })();

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('click', skip);
      document.removeEventListener('visibilitychange', aoEsconder);
      // Quem desmonta a meio deixa o texto completo, não um pedaço.
      el.textContent = content;
    };
  }, [content, live, logRef]);
  return <div className="oc-msg oc-orc" ref={ref}>{content}</div>;
}

export default function Conselho() {
  const { user, ocMsgs, ocBusy, ocQuotaLeft, sendConselho, cancelConselho, acceptConselhoMission } = useStore();
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

  /* ── ESCAPE CANCELA, E SÓ ENQUANTO ESPERA ─────────────────────────────
   * A auditoria de 2026-07-30 registou "não há cancelamento" como ausência.
   * Escape é a tecla de sair, e uma espera sem saída é a definição de estar
   * preso — com uma resposta longa deixa de ser defensável.
   *
   * O listener vive no PAINEL e não em `window`, e depende de `ocBusy`. É a
   * lição direta do defeito do Universo, apanhado no mesmo dia: um Escape
   * registado em `window` sem guarda consumia a tecla em todas as zonas.
   * Fora da espera, esta tecla não é nossa. */
  /* ── O FOCO NÃO PODE CAIR NO VAZIO ───────────────────────────────────
   * DEFEITO MEU, apanhado ao verificar o cancelamento e não ao escrevê-lo.
   *
   * Quem envia com o RATO deixa o foco no botão Enviar. Esse botão fica
   * `disabled` durante a espera — e um elemento desativado perde o foco, que
   * cai para o `<body>`. Medido: `document.activeElement` a `BODY`. A partir
   * daí o Escape não chega ao painel e o cancelamento por teclado não existe,
   * exactamente no caminho mais comum de todos.
   *
   * Só se mexe no foco quando ele JÁ SE PERDEU. Quem envia com Enter fica no
   * campo, e aí não se toca: a auditoria anterior verificou de propósito que
   * não há roubo de foco durante o THINKING, e escrever a pergunta seguinte
   * enquanto se espera é um comportamento a preservar. */
  useEffect(() => {
    if (!ocBusy) return;
    const el = panelRef.current;
    if (!el) return;
    const a = document.activeElement;
    const perdido = !a || a === document.body || a === document.documentElement || !el.contains(a);
    if (!perdido) return;
    const sair = el.querySelector('.oc-cancel');
    if (sair) sair.focus();
  }, [ocBusy]);

  useEffect(() => {
    if (!ocBusy) return;
    const el = panelRef.current;
    if (!el) return;
    const aoTeclar = (e) => {
      if (e.key !== 'Escape') return;
      if (!cancelConselho()) return;
      e.stopPropagation();
      // O foco volta ao campo: cancelar é para voltar a perguntar, e deixar o
      // foco no vazio obrigava a procurá-lo com o rato.
      const campo = el.querySelector('#oc-in');
      if (campo) campo.focus();
    };
    /* No DOCUMENTO e não no painel, e a razão é a mesma do defeito acima: o
       foco pode estar legitimamente fora do painel (a barra do Oráculo, a
       navegação) e a espera continua a ser a coisa que está a acontecer. O que
       torna isto seguro não é o alvo do listener — é o `if (!ocBusy) return`
       acima: fora da espera, este efeito nem chega a registar nada, e a tecla
       volta a ser de quem a quiser. É a lição do Universo, que registava
       Escape em `window` SEM guarda e a consumia em todas as zonas. */
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [ocBusy, cancelConselho]);
  function accept(idx, mission) { acceptConselhoMission(mission); setAccepted((s) => new Set(s).add(idx)); }

  const lastOrc = ocMsgs.map((m) => m.cls).lastIndexOf('oc-orc');

  return (
    <div className="panel reveal" style={{ animationDelay: '.095s' }} ref={panelRef}>
      <div className="ptitle"><b>Oráculo · Conselho</b> · conselheiro estratégico <span className="oc-quota" id="oc-quota">{user ? (left > 0 ? left + '/12 hoje' : 'limite de hoje atingido') : ''}</span></div>
      {/* M26·F7Z — a conversa passa a ser anunciada. Sem `aria-live`, a
          resposta do Oráculo aparecia sem nada avisar quem usa leitor de ecrã:
          verificado na conta real, a zona não tinha nenhuma live region.
          `polite` porque uma resposta é para ler quando der, não para
          interromper o que se está a fazer. */}
      <div id="oc-log" className="oc-log" ref={logRef} aria-live="polite" aria-atomic="false">
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
          <div className="oc-think">
            <span className="dot"></span>
            <span className="oc-think-t">{OC_THEATER[thinkIdx]}</span>
            {/* O botão vive DENTRO do estado de espera, e não na barra de
                envio: é a saída do sítio onde se está preso, e tem de estar
                onde os olhos já estão. Sai quando a espera sai — um botão de
                cancelar sempre visível diria que há sempre algo a decorrer. */}
            <button
              type="button"
              className="mini oc-cancel"
              onClick={() => {
                cancelConselho();
                /* O botão desaparece com a espera. Sem isto o foco morre com
                   ele — o mesmo defeito do Enviar, uma linha mais abaixo. */
                const campo = panelRef.current && panelRef.current.querySelector('#oc-in');
                if (campo) campo.focus();
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
      <div className="oc-row">
        {/* ── M26·F7Z — o campo passa a ter NOME e a dizer porque não dá ──
            Tinha só `placeholder`. Um placeholder não é um nome acessível: em
            vários leitores de ecrã não é anunciado como o nome do campo, e
            desaparece assim que se escreve a primeira letra — quem estiver a
            rever o que escreveu deixa de saber onde está.

            E o `aria-describedby` resolve o outro problema, que era mais
            estranho: sem sessão, o botão está corretamente `disabled` mas o
            CAMPO aceitava texto. Escrevia-se uma pergunta inteira num sítio de
            onde ela nunca ia sair, e a explicação estava noutro bloco da
            página. Agora está presa ao campo. */}
        <textarea
          id="oc-in" rows={2} maxLength={2000}
          aria-label="Pergunta ao Oráculo"
          aria-describedby={!user ? 'oc-in-why' : (left <= 0 ? 'oc-in-why' : undefined)}
          placeholder="Pergunta ao Oráculo — decisões, dúvidas, rumo..." value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="btn" id="oc-send" disabled={!user || left <= 0 || ocBusy} onClick={send}>Enviar</button>
        {(!user || left <= 0) && (
          <p id="oc-in-why" className="oc-why">
            {!user
              ? 'Sem sessão iniciada, o Oráculo não recebe perguntas. O que escreveres aqui não é enviado nem guardado.'
              : 'Chegaste ao limite de mensagens de hoje. O contador reinicia amanhã.'}
          </p>
        )}
      </div>
    </div>
  );
}
