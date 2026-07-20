import { ATTRS, RANKS, need, rankOf, titleOf, overallLevel, TITLES_REAL } from '../state/config.js';
import { AVATAR } from '../assets/avatar.js';

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

  const txp = Math.round(S.totalXP).toLocaleString('pt-PT');
  const qd = S.objectives.filter((o) => o.status === 'done').length;
  const bstk = Math.max(0, ...[...S.oblig, ...S.extras].map((h) => h.streak));

  const frac = ATTRS.reduce((s, a) => s + S.attrs[a.id].xp / need(S.attrs[a.id].level), 0) / ATTRS.length;
  const span = (r.max >= 9999 ? (lvl + 5) : r.max) - r.min + 1;
  const into = lvl - r.min;
  const rankFrac = Math.min(1, (into + frac) / span);
  const progLbl = 'Rank ' + r.l + (r.l !== 'S' ? ' → ' + RANKS[ri + 1].l : '');

  return (
    <div className="panel reveal">
      <div className="hero">
        <div className="avatar-ring">
          <svg width="104" height="104" viewBox="0 0 104 104">
            <circle cx="52" cy="52" r="46" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="5" />
            <circle id="oring" cx="52" cy="52" r="46" fill="none" stroke="url(#og)" strokeWidth="5" strokeLinecap="round"
              strokeDasharray="289" strokeDashoffset={289 * (1 - frac)}
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)' }} />
            <defs><linearGradient id="og" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#f0abfc" /></linearGradient></defs>
          </svg>
          <div className="avatar" id="avatar"><img src={AVATAR} alt="Daniel" /></div>
        </div>
        <div className="hid">
          <div className="nm">Daniel</div>
          <div className="ti" id="title">{title}</div>
          <div className="hmeta">
            <div className="st"><span className="n" id="lvl">{lvl}</span><span className="l">Nível</span></div>
            <div className="st"><span className="n" id="txp">{txp}</span><span className="l">XP total</span></div>
            <div className="st"><span className="n" id="bstk">{bstk}</span><span className="l">Melhor streak</span></div>
            <div className="st"><span className="n" id="qd">{qd}</span><span className="l">Missões</span></div>
          </div>
        </div>
        <div className="rankbox">
          <div className="rankbadge" id="rankbadge" style={{ borderColor: r.color, color: r.color, background: `radial-gradient(circle,${hexA(r.color, .14)},transparent 70%)` }}>
            <span id="rankl">{r.l}</span>
          </div>
          <div className="rl">Rank</div>
        </div>
      </div>
      <div className="oxp">
        <div className="oxp-head"><span id="rank-prog-lbl">{progLbl}</span><span id="oxp-txt">Nível {lvl}</span></div>
        <div className="oxp-bar"><div className="oxp-fill" id="oxp-fill" style={{ width: (rankFrac * 100) + '%' }} /></div>
      </div>
    </div>
  );
}
