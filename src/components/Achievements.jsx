import { ACH } from '../state/config.js';

// Conquistas — Missão 25 · Fase 10. Porta renderAchievements (hud.js:6-13),
// read-only (a condição avalia-se de S). A cerimónia de desbloqueio (cineMoment/
// toast + S.seenAch) é fx e fica deferida para o fx.js.
export default function Achievements({ S }) {
  return (
    <div className="panel reveal" style={{ animationDelay: '.28s' }}>
      <div className="ptitle"><b>Conquistas</b> · desbloqueiam sozinhas</div>
      <div className="ach-grid" id="achs">
        {ACH.map((a) => {
          const on = a.cond(S);
          return (
            <div className={`ach ${on ? 'on' : ''}`} key={a.id}>
              <div className="ico">{on ? a.ico : '🔒'}</div>
              <div><div className="an2">{a.name}</div><div className="ad2">{on ? a.msg : 'Bloqueada'}</div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
