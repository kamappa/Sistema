import { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { TITLES_REAL } from '../state/config.js';
import { reqMet, titleProg } from '../state/titles.js';

// Títulos Reais — Missão 25 · Fase 10. Porta renderTitles (hud.js:48-60): cada
// título abre para mostrar requisitos; marcar evidência (não automáticos) sobe a
// barra; 100% desbloqueia (👑). `titleOpenSet` do Vanilla é estado local.
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#04121f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

export default function Titles({ S }) {
  const { toggleReq } = useStore();
  const [open, setOpen] = useState(() => new Set());
  const toggleOpen = (id) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="panel reveal" style={{ animationDelay: '.33s' }}>
      <div className="ptitle"><b>Títulos Reais</b> · o sistema nunca mente</div>
      <div className="dhint">Os títulos de nível (no topo) são narrativa. Estes são <b style={{ color: 'var(--gold)' }}>credenciais</b>: só desbloqueiam com evidência real — certificados, relatórios, projetos. Clica num título para veres os requisitos e marca-os apenas quando tiveres a prova.</div>
      <div className="tit-grid" id="titles">
        {TITLES_REAL.map((t) => {
          const p = titleProg(S, t), un = p.pct === 100, isOpen = open.has(t.id);
          return (
            <div className={`tit ${un ? 'un' : ''} ${isOpen ? 'open' : ''}`} key={t.id} onClick={() => toggleOpen(t.id)}>
              <div className="tit-nm">{un ? '👑' : '🔒'} {t.name}</div>
              <div className="tit-gap">{un ? 'Desbloqueado — credencial real' : 'Gap: ' + (100 - p.pct) + '% · ' + p.met + '/' + p.tot + ' requisitos'}</div>
              <div className="tit-bar"><div className="tit-fill" style={{ width: p.pct + '%' }} /></div>
              <div className="tit-reqs">
                {t.reqs.map((r) => {
                  const on = reqMet(S, t, r);
                  return (
                    <div className={`req ${on ? 'on' : ''}`} key={r.id} onClick={(e) => { e.stopPropagation(); toggleReq(t.id, r.id); }}>
                      <div className="rchk">{on && <CheckIcon />}</div>
                      <div>{r.t}{r.auto && <span className="rauto"> · automático</span>}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
