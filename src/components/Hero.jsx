import { useLayoutEffect } from 'react';
import { ATTRS, RANKS, need, rankOf, titleOf, overallLevel, TITLES_REAL } from '../state/config.js';
import OperatorSigil from './OperatorSigil.jsx';

// cerimónia de rank-up detetada no render() do Vanilla (engine.js:110) — o
// último rank visto vive fora do componente (sobrevive a re-renders); só uma
// SUBIDA celebra (nunca despromoção). null no arranque = 1ª avaliação silenciosa.
let lastRankL = null;

// Herói — Missão 25 · Fase 3. Markup portado de legacy/index.html:59-88, valores
// do render() de engine.js:108-133. A LÓGICA dos números fica idêntica; o que
// muda é a cola (JSX + store em vez de innerHTML + global S). A camada de
// ANIMAÇÃO (setNum count-up, Motion.fillBar, cerimónia de rank-up) entra quando
// motion.js migrar — aqui os valores renderizam-se diretos (estado de repouso
// idêntico ao que o Daniel observa; a transição da barra/anel usa a mesma
// transition CSS do Vanilla no #oring).
const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };

export default function Hero({ S }) {
  const lvl = overallLevel(S);
  const r = rankOf(lvl);
  const ri = RANKS.indexOf(r);

  const realUn = Object.entries(S.titleUnlocked || {}).sort((a, b) => (a[1] < b[1] ? -1 : 1));
  const lastReal = realUn.length ? TITLES_REAL.find((t) => t.id === realUn[realUn.length - 1][0]) : null;
  const title = lastReal ? '👑 ' + lastReal.name : titleOf(lvl);

  const txpRaw = Math.round(S.totalXP);
  const txp = txpRaw.toLocaleString('pt-PT');
  const qd = S.objectives.filter((o) => o.status === 'done').length;
  const bstk = Math.max(0, ...[...S.oblig, ...S.extras].map((h) => h.streak));

  const frac = ATTRS.reduce((s, a) => s + S.attrs[a.id].xp / need(S.attrs[a.id].level), 0) / ATTRS.length;
  const span = (r.max >= 9999 ? (lvl + 5) : r.max) - r.min + 1;
  const into = lvl - r.min;
  const rankFrac = Math.min(1, (into + frac) / span);
  const progLbl = 'Rank ' + r.l + (r.l !== 'S' ? ' → ' + RANKS[ri + 1].l : '');

  // FX (Fase 17) — espelha o render() do Vanilla (engine.js:110-131): cerimónia
  // de rank-up + contadores em mola + barra de rank com física. Corre após o
  // commit (useLayoutEffect: sem flash entre o valor de React e o da mola). O
  // JSX mantém os valores diretos → 1º render e reduced-motion ficam corretos;
  // a partir daí a mola de setNum/fillBar (registo por id/chave) assume.
  useLayoutEffect(() => {
    if (lastRankL && r.l !== lastRankL &&
        RANKS.findIndex((x) => x.l === r.l) > RANKS.findIndex((x) => x.l === lastRankL)) {
      if (window.rankCeremony) window.rankCeremony(r);
    }
    lastRankL = r.l;
    if (window.setNum) {
      // Missão 26 · Fase 5 — a mola só assume quando HÁ valor. Com zero, o
      // setNum escrevia "0" por cima do travessão que o JSX rendeu, e quatro
      // zeros alinhados numa conta nova leem-se como ecrã a carregar, não como
      // "ainda não começaste". O travessão diz ausência; o zero diz medição.
      window.setNum('lvl', lvl);
      if (txpRaw > 0) window.setNum('txp', txpRaw, (v) => Math.round(v).toLocaleString('pt-PT'));
      if (qd > 0) window.setNum('qd', qd);
      if (bstk > 0) window.setNum('bstk', bstk);
    }
    // A barra `oxp` deixou de existir: a fração do rank passou para o anel do
    // manómetro, e mostrar o mesmo número duas vezes no mesmo cartão era ruído.
    // A chamada fica guardada pela existência do elemento — se alguém repuser a
    // barra, a mola volta a assumir sem mais nenhuma alteração.
    const bar = document.getElementById('oxp-fill');
    if (bar && window.Motion && window.Motion.fillBar) {
      window.Motion.fillBar('oxp', bar, rankFrac * 100);
    }
  });

  // Missão 26 · Fase 5 — cada leitura tem uma UNIDADE ou um contexto. "23" não
  // diz nada; "23 dias" diz. E um valor a zero mostra-se como travessão: a
  // ausência de registo e a medição de zero são coisas diferentes, e o Sistema
  // não pode fazer passar uma pela outra.
  const dash = (v) => (v > 0 ? null : '—');

  return (
    <div className="panel reveal">
      {/* ── Operador ───────────────────────────────────────────────────────
          Missão 26 · Fase 5. Deixa de ser um cartão de personagem — retrato
          grande, nome grande, quatro números soltos e um crachá no canto — e
          passa a um cabeçalho de identidade com um trilho de leituras por
          baixo. Anti-referência assumida: S16 (`01-shell/f7298…jpg`), a folha
          de estatísticas de RPG com barras azuis e moldura ornamentada. É
          exatamente o que a missão proíbe, e era o que este cartão estava a
          um passo de ser.
          ORIGEM do trilho: R26 — leituras emparelhadas, rótulo mono minúsculo,
          separadas por espaço e um filete, nunca por caixas. */}
      <div className="hero cc-operator">
        <div className="avatar-ring">
          <svg width="104" height="104" viewBox="0 0 104 104">
            <circle cx="52" cy="52" r="46" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="5" />
            <circle id="oring" cx="52" cy="52" r="46" fill="none" stroke="url(#og)" strokeWidth="5" strokeLinecap="round"
              strokeDasharray="289" strokeDashoffset={289 * (1 - frac)}
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)' }} />
            <defs><linearGradient id="og" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#f0abfc" /></linearGradient></defs>
          </svg>
          <div className="avatar" id="avatar"><OperatorSigil S={S} size={92} /></div>
        </div>
        <div className="hid">
          <div className="nm">Daniel</div>
          <div className="ti" id="title">{title}</div>
        </div>
        {/* Missão 26 · Fase E — o rank passa a manómetro (origem: R25).
            A letra ao centro diz QUAL; o anel à volta diz QUANTO falta para o
            próximo. Antes a letra não dizia nada e a fração vivia numa barra
            noutro sítio do cartão: dois pedaços da mesma frase, separados.
            O id `rankbadge` mantém-se — o fx.js e o palco WebGL leem-no. */}
        <div className="rankbox">
          <div className="rankgauge">
            <svg viewBox="0 0 92 92" aria-hidden="true">
              <circle className="rg-track" cx="46" cy="46" r="42" />
              <circle
                className="rg-fill" cx="46" cy="46" r="42"
                stroke={r.color}
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - rankFrac)}
              />
            </svg>
            <div className="rankbadge" id="rankbadge" style={{ borderColor: r.color, color: r.color, background: `radial-gradient(circle,${hexA(r.color, .14)},transparent 70%)` }}>
              <span id="rankl">{r.l}</span>
            </div>
          </div>
          {/* O anel diz quanto; só a palavra pode dizer PARA ONDE. */}
          <div className="rl" id="rank-prog-lbl">{progLbl}</div>
        </div>
      </div>

      <dl className="cc-readings">
        <div className="cc-read">
          <dt>Nível</dt>
          <dd><span className="cc-read-v" id="lvl">{lvl}</span></dd>
        </div>
        <div className="cc-read">
          <dt>XP acumulado</dt>
          <dd><span className="cc-read-v" id="txp">{dash(txpRaw) ?? txp}</span></dd>
        </div>
        <div className="cc-read">
          <dt>Melhor streak</dt>
          <dd>
            <span className="cc-read-v" id="bstk">{dash(bstk) ?? bstk}</span>
            {bstk > 0 && <span className="cc-read-u">{bstk === 1 ? 'dia' : 'dias'}</span>}
          </dd>
        </div>
        <div className="cc-read">
          <dt>Missões erguidas</dt>
          <dd><span className="cc-read-v" id="qd">{dash(qd) ?? qd}</span></dd>
        </div>
      </dl>
    </div>
  );
}
