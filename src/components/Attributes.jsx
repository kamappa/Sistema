import { ATTRS, need, rankOf } from '../state/config.js';

// Atributos — Missão 25 · Fase 4. Markup de legacy/index.html:124-127 + o render
// de engine.js:143-156 (a mesma linha-por-linha; classe dom-<id> traz a
// assinatura de domínio do hud.css). A mola das barras (Motion.fillBar) fica
// para quando o motion.js migrar — aqui a largura-alvo vai direta no style.
export default function Attributes({ S }) {
  return (
    <div className="panel reveal" style={{ animationDelay: '.1s' }}>
      <div className="ptitle"><b>Atributos</b> · 6 domínios</div>
      <div id="attrs">
        {ATTRS.map((a) => {
          const s = S.attrs[a.id], nd = need(s.level), pct = Math.round(s.xp / nd * 100), ar = rankOf(s.level);
          return (
            <div className={`attr dom-${a.id}`} key={a.id}>
              <div className="ah">
                <div className="an">
                  <span className="adot" style={{ background: a.color, boxShadow: `0 0 8px ${a.color}` }} />{a.name}
                  <span className="ar" style={{ color: ar.color, borderColor: ar.color }}>{ar.l}</span>
                </div>
                <div className="alv">Nv <b>{s.level}</b></div>
              </div>
              <div className="abar"><div className="afill" data-a={a.id} style={{ width: pct + '%', background: `linear-gradient(90deg,${a.color},${a.color}88 45%,${a.color} 75%,${a.color}cc)` }} /></div>
              <div className="axp">{s.xp} / {nd} XP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
