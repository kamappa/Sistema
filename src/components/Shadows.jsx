// Shadow Army — Missão 25 · Fase 6. Porta renderShadows de objetivos.js:99-108.
// Objetivos concluídos erguem-se como Sombras; raridade determinística por nível
// (3 Comum, 6 Rara, 10 Épica, 15 Lendária). Só leitura — nasce do cycleObj.
export default function Shadows({ S }) {
  const pow = S.shadows.reduce((s, x) => s + x.lvl, 0);
  return (
    <div className="panel reveal" style={{ animationDelay: '.28s' }}>
      <div className="ptitle"><b>Shadow Army</b> · objetivos concluídos erguem-se</div>
      <div id="shadows">
        <div className="tr-stats">
          <span className="wchip gold">Poder do exército: {pow}</span>
          <span className="wchip">Sombras: {S.shadows.length}</span>
        </div>
        <div className="shd-grid">
          {S.shadows.length ? S.shadows.slice().reverse().map((s) => {
            const r = s.lvl >= 15 ? ['len', 'Lendária'] : s.lvl >= 10 ? ['epi', 'Épica'] : s.lvl >= 6 ? ['rar', 'Rara'] : ['com', 'Comum'];
            return (
              <div className={`shd shd-${r[0]}`} key={s.id}>
                <div className="shd-n">🗡 {s.name}</div>
                <div className="shd-r">{r[1]} · Nv {s.lvl}</div>
                <div className="shd-l">Ergueu-se a {s.d.slice(8, 10)}/{s.d.slice(5, 7)}/{s.d.slice(0, 4)}</div>
              </div>
            );
          }) : <div className="up-empty">O exército aguarda. Conclui objetivos — e eles erguem-se para trabalhar por ti.</div>}
        </div>
      </div>
    </div>
  );
}
