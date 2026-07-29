import { useEffect } from 'react';
import { ACH } from '../state/config.js';
import { useStore } from '../store/useStore.js';

// primeira avaliação da sessão = baseline silencioso: marca como vistas as
// conquistas JÁ desbloqueadas sem celebrar (senão, carregar um estado antigo
// dispararia uma rajada de toasts). A partir daí, cada nova desbloqueia com
// cerimónia — porto de renderAchievements (hud.js:6-13).
let achBaseline = false;

// Conquistas — Missão 25 · Fase 10 (+ cerimónia na Fase 17). Read-only (a
// condição avalia-se de S); a cerimónia + S.seenAch entram aqui.
export default function Achievements({ S }) {
  const save = useStore((st) => st.save);
  useEffect(() => {
    let dirty = false;
    ACH.forEach((a) => {
      if (a.cond(S) && !S.seenAch.includes(a.id)) {
        S.seenAch.push(a.id); dirty = true;
        if (achBaseline) {
          // cineMoment continua a ser o momento alto (hud.js:11). O que muda
          // (M26·F6A) é o registo: em vez de um toast que se sobrescreve, o
          // desbloqueio entra na FILA de eventos e espera a sua vez, para que
          // duas conquistas na mesma ação sejam ambas anunciadas.
          window.cineMoment && window.cineMoment('Conquista desbloqueada', a.ico + ' ' + a.name, 'rgba(251,191,36,.2)');
          if (window.sysEvent) {
            window.sysEvent({
              dedupe: 'ach:' + a.id,
              kind: 'arc',
              title: 'Conquista desbloqueada',
              subject: a.name,
              color: '#fbbf24',
              holdMs: 8000,
            });
          }
        }
      }
    });
    achBaseline = true;
    if (dirty) save();
  });

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
