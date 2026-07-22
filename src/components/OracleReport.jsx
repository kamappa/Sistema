import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore.js';

// Oráculo · relatório semanal — Missão 25 · Fase 14 (+ scanline na Fase 17).
// Porta renderOracleRep (radar.js:45-73). Lê window.report do store. O
// typewriter do relatório (sysTypeHTML) fica DELIBERADAMENTE de fora: reescreve
// nós de texto que o React possui (colidiria com re-renders); a scanline, sendo
// overlay puro, entra sem conflito — 1× por relatório.
export default function OracleReport() {
  const { user, report, acceptOracleMission } = useStore();
  const ref = useRef(null);
  useEffect(() => {
    if (!report) return;
    try {
      const k = 'orcSeen:' + (report.created_at || '');
      if (window.panelScan && !sessionStorage.getItem(k)) { sessionStorage.setItem(k, '1'); window.panelScan(ref.current); }
    } catch (e) {}
  }, [report]);

  let body;
  if (!user) body = <div className="up-empty">Entra com a tua conta para veres os relatórios.</div>;
  else if (!report) body = <div className="up-empty">O primeiro relatório chega no domingo à noite — o Oráculo lê a tua semana e escreve aqui.</div>;
  else {
    const r = report.report || {}; const dt = (report.created_at || '').slice(0, 10);
    body = (
      <>
        <div className="tr-stats"><span className="wchip gold">📜 Relatório de {dt.slice(8, 10)}/{dt.slice(5, 7)}</span></div>
        {r.resumo && <div className="orc-sec">{r.resumo}</div>}
        {r.treino && <div className="orc-sec"><b>🏋️ Treino:</b> {r.treino}</div>}
        {r.sono && <div className="orc-sec"><b>😴 Sono:</b> {r.sono}</div>}
        {r.estudo && <div className="orc-sec"><b>📚 Estudo (vault):</b> {r.estudo}</div>}
        {r.alerta && r.alerta !== 'null' && <div className="orc-sec" style={{ color: '#fca5a5' }}><b>⚠ Alerta:</b> {r.alerta}</div>}
        {(r.propostas || []).length > 0 && <div className="up-lbl">Propostas do Oráculo</div>}
        {(r.propostas || []).map((p, i) => (
          <div className="rd-item" key={'p' + i}><span style={{ flex: 'none' }}>🜂</span><div className="rd-b"><div className="rd-t">{p.t || ''}</div><div className="rd-s">{p.why || ''}</div></div></div>
        ))}
        {(r.missoes_propostas || []).length > 0 && <div className="up-lbl">Missões propostas</div>}
        {(r.missoes_propostas || []).map((m, i) => (
          <div className="rd-item" key={'m' + i}><span style={{ flex: 'none' }}>⚔️</span><div className="rd-b"><div className="rd-t">{m.t || ''}</div><div className="rd-s">{m.why || ''}</div></div><button className="mini" onClick={() => acceptOracleMission(i)}>＋ Aceitar</button></div>
        ))}
        {(r.recursos || []).filter((x) => x && x.url).length > 0 && <div className="up-lbl">Para complementar o estudo</div>}
        {(r.recursos || []).filter((x) => x && x.url).map((x, i) => (
          <div className="rd-item" key={'r' + i}><span style={{ flex: 'none' }}>📖</span><div className="rd-b"><a className="rd-t" href={x.url} target="_blank" rel="noopener">{x.titulo || x.url}</a><div className="rd-s">{x.porque || ''}</div><div className="rd-src">{x.fonte || ''}</div></div></div>
        ))}
        {r.efemeride && r.efemeride !== 'null' && <div className="orc-sec"><b>🕯 Efeméride:</b> {r.efemeride}</div>}
        {r.profecia && r.profecia !== 'null' && <div className="orc-sec orc-prof"><b>🔮 Profecia:</b> {r.profecia}</div>}
        {r.recompensa && <div className="orc-sec"><b>🎁 Recompensa sugerida:</b> {r.recompensa}</div>}
        {r.titulo && <div className="orc-sec"><b>🎖 Título da semana:</b> {r.titulo}</div>}
        {r.legado && <div className="orc-leg">👑 {r.legado}</div>}
      </>
    );
  }

  return (
    <div className="panel reveal" style={{ animationDelay: '.09s' }} ref={ref}>
      <div className="ptitle"><b>Oráculo</b> · relatório semanal</div>
      <div id="oracle-rep">{body}</div>
    </div>
  );
}
