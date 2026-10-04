import { ATTRS, AM, rankOf, overallLevel } from '../state/config.js';

/* Sigilo do Operador — Missão 26 · Fase E (segunda parte).
 *
 * Substitui o retrato de estilo anime herdado do Vanilla. A missão pede que a
 * identidade pareça "um registo vivo de um operador real", e um retrato fixo é
 * o oposto disso: é igual no dia em que começas e no dia em que chegas a Rank S.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  Não há aqui um único número decorativo. A forma é literalmente os   ║
 * ║  teus seis domínios: cada vértice é um nível real. A cor é o rank.   ║
 * ║  Se os dados mudarem, a cara muda.                                   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O `src/assets/avatar.js` NÃO foi apagado. Reverter é reimportar o AVATAR e
 * trocar este componente pelo <img> — uma linha em cada sítio.
 *
 * ORIGEM VISUAL: nenhuma referência. É geometria derivada de dados, e não havia
 * referência para isto na biblioteca — o que fica registado, porque uma decisão
 * sem origem declarada é uma decisão que ninguém pode contestar depois.
 */

const R = 46;      // raio do campo
const CX = 52;
const CY = 52;

export default function OperatorSigil({ S, size = 104 }) {
  const lvl = overallLevel(S);
  const rank = rankOf(lvl);

  // Cada domínio é um vértice. O raio de cada um é o seu nível, normalizado
  // pelo mais alto — a forma diz onde estás forte e onde estás em dívida.
  const levels = ATTRS.map((a) => (S.attrs?.[a.id]?.level ?? 1));
  const max = Math.max(...levels, 1);
  const pts = ATTRS.map((a, i) => {
    const ang = (Math.PI * 2 * i) / ATTRS.length - Math.PI / 2;
    // piso de 0.22 para um domínio a zero não colapsar o polígono num ponto:
    // um domínio por começar continua a EXISTIR, só não tem alcance
    const r = R * (0.22 + 0.78 * (levels[i] / max));
    return [CX + Math.cos(ang) * r, CY + Math.sin(ang) * r];
  });

  const poly = pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');

  // A maior streak entra só na leitura para leitor de ecrã. Visualmente ela já
  // vive no cartão ("MELHOR STREAK"), e um anel a repeti-la seria duplicação.
  const bestStreak = Math.max(0, ...[...(S.oblig ?? []), ...(S.extras ?? [])].map((h) => h.streak ?? 0));

  return (
    <div className="op-sigil" style={{ width: size, height: size }}>
      <svg viewBox="0 0 104 104" aria-hidden="true">
        {/* teia de referência: onde o polígono estaria se tudo fosse igual */}
        <polygon className="op-web" points={ATTRS.map((a, i) => {
          const ang = (Math.PI * 2 * i) / ATTRS.length - Math.PI / 2;
          return `${(CX + Math.cos(ang) * R * 0.7).toFixed(1)},${(CY + Math.sin(ang) * R * 0.7).toFixed(1)}`;
        }).join(' ')} />

        {/* a forma do Operador */}
        <polygon className="op-shape" points={poly} style={{ fill: rank.color }} />

        {/* um ponto por domínio, na cor do domínio — a única cor que não é do rank */}
        {pts.map((p, i) => (
          <circle key={ATTRS[i].id} className="op-node" cx={p[0]} cy={p[1]} r="2.1"
            style={{ fill: AM[ATTRS[i].id].color }} />
        ))}
      </svg>
      <span className="sr-only">
        Sigilo do Operador: {ATTRS.map((a, i) => `${a.name} nível ${levels[i]}`).join(', ')}.
        {bestStreak > 0 ? ` Maior streak: ${bestStreak} ${bestStreak === 1 ? 'dia' : 'dias'}.` : ' Sem streak ativa.'}
      </span>
    </div>
  );
}
