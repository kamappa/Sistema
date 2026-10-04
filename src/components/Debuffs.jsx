import { useStore } from '../store/useStore.js';
import { DEBUFFS } from '../state/config.js';

// Estados / debuffs — Missão 25 · Fase 10. Porta renderDebuffs (hud.js:23-29):
// clicar no cartão alterna o estado; o botão aplica o antídoto (+10 Disciplina,
// 1×/dia). O toast de "já usado" é fx (deferido).
export default function Debuffs({ S }) {
  const { toggleDebuff, applyAntidote } = useStore();
  return (
    <div className="panel reveal" style={{ animationDelay: '.3s' }}>
      <div className="ptitle"><b>Estados</b> · inimigos internos</div>
      <div className="dhint">Marca o que estás a sentir — não é castigo, é consciência. Aplica o antídoto e ganhas XP de Disciplina.</div>
      <div id="dbfs">
        {DEBUFFS.map((d) => {
          const act = !!S.debuffs[d.id];
          return (
            <div className={`dbf ${act ? 'act' : ''}`} key={d.id} onClick={() => toggleDebuff(d.id)}>
              <div className="dbf-top"><span>{act ? '🔴' : '⚪'}</span><span className="dbf-nm">{d.name}</span><span className="dbf-tag">{act ? 'ativo' : 'inativo'}</span></div>
              <div className="dbf-body">
                <div className="ef">Efeito: {d.ef}</div><div className="an3">Antídoto: {d.an}</div>
                <button className="antbtn" onClick={(e) => { e.stopPropagation(); applyAntidote(d.id); }}>✓ Apliquei o antídoto (+10 Disciplina)</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
