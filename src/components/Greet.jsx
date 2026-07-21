import { hashStr } from '../state/world.js';
import { today } from '../state/dates.js';
import { QUOTES } from '../state/config.js';
import { memoriaDoDia } from '../state/memory.js';

// Saudação & citação do dia — Missão 25 · Fase 10. Porta renderGreet
// (hud.js:165-175). Determinística por período+dia. Read-only.
const G = {
  m: ['Bom dia — pronto para começar bem?', 'Bom dia. O dia é teu antes de ser de mais alguém.', 'Bom dia — primeiro um pilar, depois o mundo.'],
  t: ['Boa tarde — ritmo, não pressa.', 'Boa tarde. Metade do dia, foco inteiro.', 'Boa tarde — o que fica feito hoje não pesa amanhã.'],
  n: ['Boa noite — fecha o dia com intenção.', 'Boa noite. O descanso também é treino.', 'Boa noite — o Corpo constrói-se a dormir.'],
};

export default function Greet({ S }) {
  const hr = new Date().getHours();
  const per = (hr >= 5 && hr < 13) ? 'm' : (hr < 20) ? 't' : 'n';
  const h = G[per][hashStr(per + today()) % G[per].length];
  const q = QUOTES[hashStr('q' + today()) % QUOTES.length];
  // Living Memory (M15): 🕯 uma vela debaixo da citação, não um holofote.
  const mem = S ? memoriaDoDia(S) : null;
  return (
    <div className="greet reveal">
      <div className="greet-h" id="greet-h">{h}</div>
      <div className="greet-q" id="greet-q">“{q[0]}” — <b>{q[1]}</b></div>
      {mem && <div className="memoria" id="memoria-line">🕯 {mem}</div>}
    </div>
  );
}
