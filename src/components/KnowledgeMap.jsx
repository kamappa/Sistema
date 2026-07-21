import { RECALL_THEMES } from '../state/config.js';
import { questionPool } from '../state/recall.js';

// Mapa de Conhecimento — Missão 25 · Fase 12. Porta renderMapa (conselho.js:
// 128-154): agrega S.recall por tema (taxa de acerto, volume, 2 piores ease).
// Tema só aparece com ≥5 perguntas vistas — antes disso "dados insuficientes".
// 100% cliente, derivação pura do estado. Read-only.
export default function KnowledgeMap({ S }) {
  const themes = {};
  questionPool(S).forEach((q) => {
    const r = S.recall[q.id]; if (!r || !r.seen) return;
    const th = themes[q.tema] = themes[q.tema] || { n: 0, seen: 0, correct: 0, qs: [] };
    th.n++; th.seen += r.seen; th.correct += r.correct; th.qs.push({ q, r });
  });
  const ids = Object.keys(themes);

  return (
    <div className="panel reveal" style={{ animationDelay: '.11s' }}>
      <div className="ptitle"><b>Mapa de Conhecimento</b> · dados reais do recall</div>
      <div className="dhint">Taxa de acerto e volume por tema, calculados das tuas revisões — sem estimativas. As duas perguntas com pior <i>ease</i> são os teus pontos fracos atuais.</div>
      <div id="kmap">
        {!ids.length ? (
          <div className="up-empty">Ainda sem dados de revisão. Responde ao lote diário e o mapa desenha-se sozinho.</div>
        ) : ids.sort((a, b) => themes[b].n - themes[a].n).map((id) => {
          const t = themes[id]; const meta = RECALL_THEMES[id] || { label: id, color: 'var(--sky)' };
          if (t.n < 5) {
            return (
              <div className="km-row km-insuf" key={id}>
                <div className="km-head">
                  <span className="wchip" style={{ borderColor: meta.color, color: meta.color }}>{meta.label}</span>
                  <span className="km-note">dados insuficientes ({t.n}/5 perguntas vistas) — continua a responder</span>
                </div>
              </div>
            );
          }
          const pct = Math.round(t.correct / t.seen * 100);
          const worst = t.qs.sort((a, b) => a.r.ease - b.r.ease).slice(0, 2);
          return (
            <div className="km-row" key={id}>
              <div className="km-head">
                <span className="wchip" style={{ borderColor: meta.color, color: meta.color }}>{meta.label}</span>
                <b className="km-pct" style={{ color: pct >= 75 ? 'var(--em)' : pct >= 50 ? 'var(--orange)' : 'var(--red)' }}>{pct}%</b>
                <span className="km-note">{t.n} perguntas · {t.seen} respostas</span>
              </div>
              <div className="km-bar"><div style={{ width: pct + '%', background: meta.color }} /></div>
              {worst.map((w) => (
                <div className="km-weak" key={w.q.id}>▾ {w.q.q.slice(0, 90)}{w.q.q.length > 90 ? '…' : ''} <span className="km-ease">{w.q.id} · ease {w.r.ease.toFixed(2)}</span></div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
