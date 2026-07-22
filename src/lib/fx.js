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
let tmr, tRemain = 0, tLast = 0, tPaused = false;
function armToast() { clearTimeout(tmr); if (tPaused) return; tLast = Date.now(); tmr = setTimeout(hideToast, tRemain); }
function hideToast() { clearTimeout(tmr); tPaused = false; const el = document.getElementById('toast'); if (el) el.classList.remove('show'); }
function pauseToast() { if (tPaused) return; tPaused = true; clearTimeout(tmr); tRemain = Math.max(0, tRemain - (Date.now() - tLast)); }
function resumeToast() { if (!tPaused) return; tPaused = false; if (tRemain < 800) tRemain = 800; armToast(); }
function toast(t, s, color, penalty, important) {
  const el = document.getElementById('toast'); if (!el) return;
  document.getElementById('tt').textContent = t; document.getElementById('ts').textContent = s || '';
  el.classList.toggle('pen', !!penalty);
  document.getElementById('tk').textContent = penalty ? 'Aviso' : 'Sistema';
  if (color && !penalty) el.style.borderColor = color;
  el.classList.add('show');
  const n = ((t || '') + (s || '')).length;
  tRemain = (important || penalty) ? 15000 : Math.min(12000, 5000 + 60 * n);
  tPaused = false; armToast();
}

function floatXP(txt, color, ev) { try {
  const e = ev || window.event; const x = e && e.clientX ? e.clientX : innerWidth / 2, y = e && e.clientY ? e.clientY : 130;
  const s = document.createElement('div'); s.className = 'fxp'; s.textContent = txt;
  s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.color = color || '#a78bfa';
  document.body.appendChild(s); setTimeout(() => s.remove(), 960);
} catch (err) {} }

function cinePulse() { // 200ms de blur — reservado aos momentos altos (M3v2 fase 4)
  if (rm()) return;
  const w = document.querySelector('.wrap'); if (!w) return;
  w.classList.remove('cine'); void w.offsetWidth; w.classList.add('cine');
}
function celebrate(color) { try {
  const f = document.createElement('div'); f.className = 'lvlflash';
  f.style.setProperty('--fc', (color || '#a78bfa') + '55');
  document.body.appendChild(f); setTimeout(() => f.remove(), 950);
  if (window.dustBurst) window.dustBurst(color);
  cinePulse();
} catch (err) {} }
/* momento cinematográfico genérico (F5 v3) — escurece, luz cresce, texto entra,
   dissolve; sem som. Devolve false com reduced-motion ou se já há um momento no
   ecrã (o chamador usa o toast como fallback). */
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
function cineArise() { // A R I S E cinematográfico + pulse + dupla vaga
  if (!cineMoment('Sistema', 'A R I S E', 'rgba(139,92,246,.22)')) return;
  celebrate('#a78bfa');
  if (window.dustBurst) setTimeout(() => window.dustBurst('#a78bfa'), 350);
}
function rankCeremony(r) { try {
  if (window.Bus) window.Bus.emit('rank:up', { rank: r.l, color: r.color }); // o mundo reage (M12·2B)
  toast('RANK UP', '⬆ Alcançaste o Rank ' + r.l, r.color, false, true);
  celebrate(r.color);
  const rb = document.getElementById('rankbadge');
  if (rb) { rb.classList.remove('rankpop'); void rb.offsetWidth; rb.classList.add('rankpop'); }
  if (window.dustBurst) setTimeout(() => window.dustBurst(r.color), 350);
} catch (err) {} }

/* contador animado — desde a M12·3A corre numa mola (Motion), não em easing
   cúbico; retoma do valor visível; direto com reduced-motion/página oculta */
const numAnim = {};
function setNum(id, val, fmt) {
  fmt = fmt || (v => String(Math.round(v)));
  const el = document.getElementById(id); if (!el) return;
  const prev = numAnim[id] ? numAnim[id].val : (parseFloat((el.textContent || '').replace(/[^\d.-]/g, '')) || 0);
  const a = numAnim[id] || (numAnim[id] = { val: prev });
  a.fmt = fmt;
  if (Math.abs(val - prev) < 1 || document.hidden || !window.Motion || rm()) {
    el.textContent = fmt(val); a.val = val; if (a.sp) a.sp.snap(val); return;
  }
  if (!a.sp) {
    a.sp = new window.Motion.Spring(1, window.Motion.TOK.gentle, x => {
      a.val = x[0]; const e = document.getElementById(id); if (e) e.textContent = a.fmt(x[0]);
    });
    a.sp.snap(prev);
  }
  a.sp.set(val);
}

/* onda de conclusão (M12·3B) — uma luz atravessa o cartão uma vez (~700ms).
   Chamar DEPOIS do render (o innerHTML novo destruiria a onda a meio).
   O clip-path do cartão recorta-a; reduced-motion = nada. */
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
const typers = [];
function sysTypeFlush() { typers.splice(0).forEach(f => f()); }
function sysType(el, ms) {
  if (!el || !el.textContent || rm()) return;
  const txt = el.textContent; let i = 0, fast = false; typers.push(() => fast = true);
  el.textContent = ''; el.classList.add('typing');
  (function step() {
    if (fast || i >= txt.length) { el.textContent = txt; el.classList.remove('typing'); return; }
    el.textContent = txt.slice(0, ++i); setTimeout(step, ms || 20);
  })();
}

/* reveal ao entrar no viewport — painéis abaixo da dobra erguem-se ao scroll.
   No Vanilla corria 1× no load; aqui é um instalador que o App chama após o
   HUD montar (idempotente: só apanha .reveal que ainda não subiram). */
function installReveal() {
  if (!('IntersectionObserver' in window) || rm()) return;
  const els = [...document.querySelectorAll('.reveal:not(.io):not(.in)')]
    .filter(el => el.getBoundingClientRect().top > innerHeight);
  if (!els.length) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => { el.classList.add('io'); io.observe(el); });
}

// liberta o transform após o rise (mesmo handler global do Vanilla)
document.addEventListener('animationend', e => {
  if (e.animationName === 'rise' && e.target.classList.contains('reveal'))
    e.target.classList.remove('reveal', 'io', 'in');
});

// expõe as primitivas como globais — o motor/store/componentes chamam-nas
// guardadas por `if(window.x)`, exatamente como no Vanilla ("divergência = bug")
Object.assign(window, {
  toast, hideToast, pauseToast, resumeToast, floatXP, cinePulse, celebrate,
  cineMoment, cineArise, rankCeremony, setNum, cardWave, panelScan, barBurst,
  sysType, sysTypeFlush, installReveal,
});

export { toast, floatXP, cineArise, cardWave, panelScan, setNum, rankCeremony, celebrate, installReveal, pauseToast, resumeToast };
