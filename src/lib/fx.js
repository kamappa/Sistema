// @ts-check
/* ===== CAMADA VISUAL (FX) — porto para React (Missão 25 · Fase 17) =====
   Toast, XP flutuante, celebrações, contadores animados, ondas. Sem estado do
   Sistema — puramente visual. Porto de legacy/js/fx.js: as primitivas mantêm
   nome e semântica e continuam a viver em window.* (o motor/store chama-as
   guardadas por `if(window.x)`, tal como o Vanilla). O que NÃO entra aqui:
   os listeners do #toast (ficam no <Toast/> React), a topbar-glass e a boot
   sequence (dependem de DOM/flag que a casca React ainda não monta) e a
   presença/tilt (vive no motion.js). Importado 1× por main.jsx. */

import './motion.js'; // garante window.Motion antes de setNum correr

const rm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== TOAST =====
   Duração: base 5s + 60ms/carácter (teto 12s); eventos importantes ficam 15s
   ou até dispensar. Hover/toque pausa (listeners no <Toast/>); o ✕ dispensa. */
/** @type {number|undefined} */ let tmr;
let tRemain = 0, tLast = 0, tPaused = false;
function armToast() { clearTimeout(tmr); if (tPaused) return; tLast = Date.now(); tmr = setTimeout(hideToast, tRemain); }
function hideToast() { clearTimeout(tmr); tPaused = false; const el = document.getElementById('toast'); if (el) el.classList.remove('show'); }
function pauseToast() { if (tPaused) return; tPaused = true; clearTimeout(tmr); tRemain = Math.max(0, tRemain - (Date.now() - tLast)); }
function resumeToast() { if (!tPaused) return; tPaused = false; if (tRemain < 800) tRemain = 800; armToast(); }
/**
 * @param {string} t título
 * @param {string} [s] subtítulo
 * @param {string} [color] cor da borda; ignorada em aviso
 * @param {boolean} [penalty] pinta como perda
 * @param {boolean} [important] fica 15 s e não é comido pela fila
 */
function toast(t, s, color, penalty, important) {
  /* Verificava o CONTENTOR e escrevia nos três filhos sem os verificar. Os
     quatro vêm do mesmo componente e na prática aparecem juntos — mas "na
     prática" é uma suposição sobre markup que outra pessoa pode mudar, e o
     preço de estar errado é um TypeError dentro do `toast`, que é chamado
     pelo motor de XP. Um brinde a falhar não pode derrubar uma subida de
     nível. Verificar os quatro custa uma linha. */
  const el = document.getElementById('toast');
  const elT = document.getElementById('tt');
  const elS = document.getElementById('ts');
  const elK = document.getElementById('tk');
  if (!el || !elT || !elS || !elK) return;
  elT.textContent = t; elS.textContent = s || '';
  el.classList.toggle('pen', !!penalty);
  elK.textContent = penalty ? 'Aviso' : 'Sistema';
  if (color && !penalty && el instanceof HTMLElement) el.style.borderColor = color;
  el.classList.add('show');
  const n = ((t || '') + (s || '')).length;
  tRemain = (important || penalty) ? 15000 : Math.min(12000, 5000 + 60 * n);
  tPaused = false; armToast();
}

/** @param {string} txt @param {string} [color] @param {MouseEvent|PointerEvent} [ev] */
function floatXP(txt, color, ev) { try {
  /* `window.event` é o global legado: existe durante o despacho de QUALQUER
     evento, não só de rato. Um teclado ou um scroll não têm coordenadas, e é
     por isso que o centro do ecrã é o valor de recurso — não é defensiva
     decorativa, é o caso normal quando o ganho vem do teclado. */
  const bruto = ev || window.event;
  const e = bruto instanceof MouseEvent ? bruto : null;
  const x = e ? e.clientX : innerWidth / 2;
  const y = e ? e.clientY : 130;
  const s = document.createElement('div'); s.className = 'fxp'; s.textContent = txt;
  s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.color = color || '#a78bfa';
  document.body.appendChild(s); setTimeout(() => s.remove(), 960);
} catch (err) {} }

function cinePulse() { // 200ms de blur — reservado aos momentos altos (M3v2 fase 4)
  if (rm()) return;
  /* `offsetWidth` só existe em HTMLElement, e ler-lhe o valor é o truque que
     força o refluxo entre remover e voltar a pôr a classe — sem ele o browser
     junta as duas operações e a animação não recomeça. Num SVG a propriedade é
     `undefined`, o refluxo não acontece e a animação falha em silêncio: o
     `instanceof` transforma isso num caso tratado em vez de um mistério. */
  const w = document.querySelector('.wrap');
  if (!(w instanceof HTMLElement)) return;
  w.classList.remove('cine'); void w.offsetWidth; w.classList.add('cine');
}
/** @param {string} [color] @returns {void} */
function celebrate(color) { try {
  /* A cor resolve-se UMA vez. Antes, o flash usava `color || '#a78bfa'` e a
     poeira recebia o `color` cru: chamar `celebrate()` sem argumento dava um
     clarão violeta e um sopro de poeira noutra cor qualquer — a que o palco
     usa quando o hex não presta. Dois efeitos do mesmo momento com cores
     diferentes é o tipo de incoerência que ninguém reporta e toda a gente vê. */
  const cor = color || '#a78bfa';
  const f = document.createElement('div'); f.className = 'lvlflash';
  f.style.setProperty('--fc', cor + '55');
  document.body.appendChild(f); setTimeout(() => f.remove(), 950);
  if (window.dustBurst) window.dustBurst(cor);
  cinePulse();
} catch (err) {} }
/* momento cinematográfico genérico (F5 v3) — escurece, luz cresce, texto entra,
   dissolve; sem som. Devolve false com reduced-motion ou se já há um momento no
   ecrã (o chamador usa o toast como fallback). */
/** @param {string} kicker @param {string} title @param {string} [glow]
 *  @returns {boolean} false com reduced motion ou se já há um momento no ecrã */
function cineMoment(kicker, title, glow) {
  if (rm()) return false;
  if (document.querySelector('.cine-ov')) return false;
  const ov = document.createElement('div'); ov.className = 'cine-ov';
  if (glow) { ov.style.setProperty('--cc', glow); ov.style.setProperty('--ct', glow.replace(/[\d.]+\)$/, '.85)')); }
  const k = document.createElement('div'); k.className = 'ck'; k.textContent = kicker;
  const b = document.createElement('b'); b.textContent = title;
  ov.append(k, b); document.body.appendChild(ov);
  setTimeout(() => ov.remove(), 2650);
  return true;
}
/* A R I S E cinematográfico + pulse + dupla vaga.
 *
 * M26·F6C — CEDE O PALCO A QUEM TEM UMA CERIMÓNIA MELHOR.
 * Este overlay escurece o ecrã inteiro a 60% durante 2,65s. No Universo isso
 * cai exatamente por cima do momento que o Universo existe para mostrar: a
 * partícula a atravessar o campo, a estrela a nascer, a energia a convergir
 * para o Núcleo. Foi visto numa folha de contacto — dois dos doze frames da
 * sequência de evidência eram só a palavra ARISE por cima do escuro.
 *
 * A regra é a mesma da fila de eventos: UMA cerimónia de cada vez. Quando a
 * zona ativa encena a sua, esta cala-se. Não é perder o momento — é não o
 * anunciar duas vezes, e a versão local diz QUAL domínio recebeu o quê, o que
 * esta nunca soube dizer.
 *
 * A marca vem de quem sabe: o próprio Universo põe `data-sky-live` no <html>
 * enquanto está ativo e visível. */
function cineArise() {
  if (document.documentElement.dataset.skyLive === 'true') return;
  if (!cineMoment('Sistema', 'A R I S E', 'rgba(139,92,246,.22)')) return;
  celebrate('#a78bfa');
  poeiraDaqui(350, '#a78bfa');
}

/* ── A GUARDA ESTAVA A 350 ms DA CHAMADA ───────────────────────────────────
 * Isto era, em dois sítios:
 *
 *   if (window.dustBurst) setTimeout(() => window.dustBurst(cor), 350);
 *
 * O `if` corre AGORA e a chamada corre um terço de segundo depois. No meio
 * cabe o palco a desmontar, a página a navegar, o WebGL a perder o contexto —
 * e o `window.dustBurst` que existia deixa de existir. Um `if` só garante o
 * instante em que corre.
 *
 * E o `try/catch` do `rankCeremony` **não protege isto**: o callback do
 * `setTimeout` corre fora da pilha do `try`, numa volta seguinte do event
 * loop. O código parecia protegido e não estava. O `cineArise` nem try tinha.
 *
 * Capturar a referência antes do timer resolve os dois: se existia quando a
 * cerimónia começou, é essa função que corre — e se não existia, não se agenda
 * nada. */
/** @param {number} ms @param {string} cor */
function poeiraDaqui(ms, cor) {
  const soprar = window.dustBurst;
  if (!soprar) return;
  setTimeout(() => soprar(cor), ms);
}
/* M26·F6C — O TOAST SAIU DAQUI, e foi um erro meu que ele tenha durado um
 * commit. Ao ligar `kind: 'rank'` à fila de eventos, o rank passou a ser
 * anunciado por dois sistemas ao mesmo tempo: o SYSTEM EVENT com a transição
 * ("D → C", nível global, rank) e este toast com "⬆ Alcançaste o Rank D",
 * sobrepostos no mesmo canto. É exatamente a avaria que a fila foi criada para
 * resolver na Fase 6A, e eu reintroduzi-a.
 *
 * O que fica aqui é a REAÇÃO — o mundo a responder, o emblema a saltar, a
 * poeira. As PALAVRAS vêm da fila, que é o canal único de anúncio. */
/** @param {{ l: string, color: string, name?: string }} r */
function rankCeremony(r) { try {
  if (window.Bus) window.Bus.emit('rank:up', { rank: r.l, color: r.color }); // o mundo reage (M12·2B)
  celebrate(r.color);
  const rb = document.getElementById('rankbadge');
  if (rb instanceof HTMLElement) { rb.classList.remove('rankpop'); void rb.offsetWidth; rb.classList.add('rankpop'); }
  poeiraDaqui(350, r.color);
} catch (err) {} }

/* contador animado — desde a M12·3A corre numa mola (Motion), não em easing
   cúbico; retoma do valor visível; direto com reduced-motion/página oculta */
/** Molas vivas por id de elemento. O registo é por CHAVE e não por elemento,
 *  para sobreviver aos re-renders: o elemento novo nasce onde a mola ia.
 *  @type {Record<string, { val: number, fmt: (v: number) => string, sp?: any }>} */
const numAnim = {};
/** @param {string} id @param {number} val @param {(v: number) => string} [fmt] */
function setNum(id, val, fmt) {
  fmt = fmt || (v => String(Math.round(v)));
  const el = document.getElementById(id); if (!el) return;
  const prev = numAnim[id] ? numAnim[id].val : (parseFloat((el.textContent || '').replace(/[^\d.-]/g, '')) || 0);
  const a = numAnim[id] || (numAnim[id] = { val: prev, fmt });
  /* Reatribuir a cada chamada é DELIBERADO: a mola sobrevive aos re-renders e
     tem de formatar com a regra mais recente, não com a de quando nasceu. */
  a.fmt = fmt;
  if (Math.abs(val - prev) < 1 || document.hidden || !window.Motion || rm()) {
    el.textContent = fmt(val); a.val = val; if (a.sp) a.sp.snap(val); return;
  }
  if (!a.sp) {
    a.sp = new window.Motion.Spring(1, window.Motion.TOK.gentle, x => {
      a.val = x[0]; const e = document.getElementById(id); if (e) e.textContent = (a.fmt || fmt)(x[0]);
    });
    a.sp.snap(prev);
  }
  a.sp.set(val);
}

/* onda de conclusão (M12·3B) — uma luz atravessa o cartão uma vez (~700ms).
   Chamar DEPOIS do render (o innerHTML novo destruiria a onda a meio).
   O clip-path do cartão recorta-a; reduced-motion = nada. */
/** @param {Element|null} el @param {string} [color] */
function cardWave(el, color) {
  if (!el || rm()) return;
  if (!('animate' in el)) return;
  const w = document.createElement('div'); w.className = 'cwave';
  if (color) w.style.setProperty('--wc', color);
  el.appendChild(w);
  const a = w.animate(
    [{ transform: 'translateX(-110%)' }, { transform: 'translateX(110%)' }],
    { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' });
  a.onfinish = a.oncancel = () => w.remove();
}

/* mini-burst na ponta da barra de um atributo que ganhou XP (F3 v3) — espera
   pelo render para ler a largura nova; só se a barra estiver no viewport */
/** @param {string} attr */
function barBurst(attr) {
  setTimeout(() => { try {
    const f = document.querySelector('#attrs .afill[data-a="' + attr + '"]'); if (!f) return;
    const r = f.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.top > innerHeight) return;
    const c = (window.AM && window.AM[attr]) ? window.AM[attr].color : '#a78bfa';
    if (window.dustSpark) window.dustSpark(r.right, r.top + r.height / 2, c, 3 + Math.floor(Math.random() * 3));
  } catch (e) {} }, 180);
}

/* scanline única — varre um painel de cima a baixo quando chega conteúdo novo (F2 v3) */
/** @param {Element|null} el */
function panelScan(el) {
  if (!el || rm()) return;
  const p = el.closest('.panel') || el;
  if (p.querySelector(':scope>.scanline')) return;
  const s = document.createElement('div'); s.className = 'scanline'; p.appendChild(s);
  const a = s.animate(
    [{ transform: 'translateY(0)', opacity: 0 }, { opacity: .9, offset: .1 }, { opacity: .6, offset: .85 },
     { transform: 'translateY(' + Math.max(0, p.clientHeight - 2) + 'px)', opacity: 0 }],
    { duration: 1500, easing: 'cubic-bezier(.4,0,.2,1)' });
  a.onfinish = a.oncancel = () => s.remove();
}

/* máquina de escrever do Sistema — texto simples, saltável com clique */
/** @type {(() => void)[]} */
const typers = [];
function sysTypeFlush() { typers.splice(0).forEach(f => f()); }
/** @param {Element|null} el @param {number} [ms] */
function sysType(el, ms) {
  if (!el || !el.textContent || rm()) return;
  const txt = el.textContent; let i = 0, fast = false; typers.push(() => fast = true);
  el.textContent = ''; el.classList.add('typing');
  (function step() {
    if (fast || i >= txt.length) { el.textContent = txt; el.classList.remove('typing'); return; }
    el.textContent = txt.slice(0, ++i); setTimeout(step, ms || 20);
  })();
}

/* máquina de escrever preservando as tags (o Oráculo a escrever o relatório) —
   porto de legacy/js/fx.js. React-safe por degradação: se o React re-renderizar
   a meio, recria o texto completo dos nós (o closure continua a escrever em nós
   já destacados, inofensivo) — nunca fica um estado partido. Corre 1×/relatório
   (guarda de sessionStorage no chamador); saltável com clique. */
/** @param {Element[]|NodeListOf<Element>} els @param {number} [budget] */
function sysTypeHTML(els, budget) {
  if (rm()) return;
  /** @type {[Node, string][]} */
  const nodes = [];
  els.forEach((/** @type {Element} */ el) => (function walk(/** @type {Node} */ n) { [...n.childNodes].forEach((c) => {
    if (c.nodeType === 3 && (c.nodeValue || '').trim()) { nodes.push([c, c.nodeValue || '']); c.nodeValue = ''; }
    else if (c.nodeType === 1) walk(c); }); })(el));
  const total = nodes.reduce((s, x) => s + x[1].length, 0); if (!total) return;
  const ms = Math.max(5, Math.min(20, (budget || 2500) / total));
  let ni = 0, ci = 0, fast = false; typers.push(() => fast = true);
  document.addEventListener('click', sysTypeFlush, { once: true });
  (function step() {
    if (fast) { for (let j = ni; j < nodes.length; j++) nodes[j][0].nodeValue = nodes[j][1]; return; }
    const nt = nodes[ni]; nt[0].nodeValue = nt[1].slice(0, ++ci);
    if (ci >= nt[1].length) { ni++; ci = 0; }
    if (ni < nodes.length) setTimeout(step, ms);
  })();
}

/* NOTA React (Fase 17b): o reveal-ao-scroll (IntersectionObserver a pôr .io/.in)
   e o handler `animationend` que removia `.reveal` eram do modelo innerHTML do
   Vanilla — mutam a className, que o React possui e reescreve a cada render,
   entrando em conflito (painel preso a opacity:0). Ficam DE FORA: o CSS
   `.reveal{animation:rise … forwards}` já mantém o painel visível no fim, e no
   React todos os painéis animam uma vez no mount (o comportamento das fases
   1-16). O boot continua a reger o reveal inicial via `html.boot .reveal`. */

/* boot sequence (Fase 17b) — fundo (400ms) → partículas → saudação escrita →
   painéis em stagger. ~1.1s, saltável com clique, 1×/sessão (o head marcou
   html.boot). Corre no import do fx.js (antes do React montar, como o script
   clássico do Vanilla). typeGreet re-tenta até o #greet-h existir (o HUD React
   monta depois da resolução da sessão); a janela fecha aos 1150ms. */
(function () {
  const R = document.documentElement;
  if (!R.classList.contains('boot')) return;
  try { sessionStorage.setItem('sysboot', '1'); } catch (e) {}
  /** @type {number[]} */
  const timers = []; let live = true;
  const at = (/** @type {number} */ ms, /** @type {() => void} */ fn) => timers.push(setTimeout(fn, ms));
  function typeGreet() { const el = document.getElementById('greet-h');
    if (!el || !el.textContent) { if (live) at(120, typeGreet); return; } sysType(el, 20); }
  function finish() { if (!live) return; live = false; timers.forEach(clearTimeout);
    R.classList.add('boot-on', 'boot-greet'); R.classList.remove('boot');
    sysTypeFlush(); if (window.dustStart) window.dustStart(); }
  document.addEventListener('click', finish, { once: true });
  at(60, () => R.classList.add('boot-on'));
  at(420, () => { if (window.dustStart) window.dustStart(); });
  at(620, () => { R.classList.add('boot-greet'); typeGreet(); });
  at(1150, () => { live = false; R.classList.remove('boot'); });
})();

// expõe as primitivas como globais — o motor/store/componentes chamam-nas
// guardadas por `if(window.x)`, exatamente como no Vanilla ("divergência = bug")
Object.assign(window, {
  toast, hideToast, pauseToast, resumeToast, floatXP, cinePulse, celebrate,
  cineMoment, cineArise, rankCeremony, setNum, cardWave, panelScan, barBurst,
  sysType, sysTypeHTML, sysTypeFlush,
});

export { toast, floatXP, cineArise, cardWave, panelScan, setNum, rankCeremony, celebrate, pauseToast, resumeToast };
