/* O INTERIOR DO NÚCLEO — a escala 4.
 * Missão 26 · Fase 6C, quarta passagem.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O NÚCLEO É A SOMA DOS SEIS NÍVEIS. Entrar nele é ver a conta.       ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * SEIS VEIOS entram no corpo, cada um do ângulo do seu domínio — o mesmo
 * ângulo do território lá fora, para que a continuidade espacial seja real e
 * não sugerida: o veio de Saber vem de onde Saber está.
 *
 * A ESPESSURA É A CONTRIBUIÇÃO. Não é uma escala inventada: `overallLevel` é a
 * soma dos níveis menos cinco, por isso a fração de cada domínio é exatamente
 * o peso dele no Núcleo. Um veio grosso significa uma coisa verificável, e o
 * número está escrito ao lado dele.
 *
 * O ARCO DE RANK fecha à volta. Onde não há banda seguinte — o último rank tem
 * `max: 9999`, que é um sentinela — não se desenha arco nenhum e diz-se porquê
 * na leitura. Uma barra a 0,4% seria o Sistema a afirmar que quase não há
 * progresso quando o que não há é banda definida.
 *
 * ENTRAR É DESCOBRIR, e por isso os veios DESENHAM-SE em cascata em vez de
 * aparecerem feitos. Cada um leva ~700ms e o atraso é a ordem dos domínios; ao
 * fim de dois segundos está tudo, e a partir daí fica parado. É um arco, não
 * um ciclo — descobrir acontece uma vez.
 */

import type { CoreRead } from './core-read';

const V = 620;
const C = 310;
/* ── GEOMETRIA, e todos os três números foram medidos ──
 * R_IN  · onde o veio ACABA: à superfície do corpo, não no centro. Um veio que
 *         atravessa o núcleo até ao meio lê-se como teia; um que encosta lê-se
 *         como matéria a ser entregue. 88 é onde fica o bordo do brilho do
 *         corpo à escala de chegada.
 * R_OUT · onde o veio COMEÇA. Estava a 292 e o desenho renderizava a 802px
 *         dentro de um quadro de 558 — dois dos seis rótulos ficavam cortados
 *         pelo topo e pelo fundo.
 * R_LAB · o rótulo vive FORA do veio, num raio próprio. Estava a 62% do
 *         comprimento com um desvio de 20px, e o resultado era "DISCIPLINA"
 *         escrito por cima da linha vermelha. */
const R_IN = 88;
const R_OUT = 236;
const R_LAB = 272;

export default function CoreInterior({ core }: { core: CoreRead }) {
  /* A decomposição TEM de existir em texto. Os veios são a leitura de relance;
     sem isto, quem usa leitor de ecrã via "Núcleo, massa 100%" e a informação
     que esta vista existe para dar — quanto é que cada domínio contribuiu —
     não chegava a lado nenhum. Os números individuais não estão em mais sítio
     nenhum desta vista. */
  const descricao =
    `Composição do Núcleo: ${core.somaNiveis} níveis provados no total. ` +
    core.seams
      .map((s) => `${s.name}, ${s.level} ${s.level === 1 ? 'nível' : 'níveis'}, ${Math.round(s.share * 100)} por cento`)
      .join('. ') + '.';

  return (
    <svg className="ci" viewBox={`0 0 ${V} ${V}`} role="img" aria-label={descricao}>
      {/* ── O ARCO DE RANK ──
          Fecha à volta de tudo. Só existe quando há banda com topo. */}
      {!core.band.aberto && core.band.within !== null && (
        <>
          <circle className="ci-band-bg" cx={C} cy={C} r="296" />
          <circle
            className="ci-band"
            cx={C} cy={C} r="296"
            stroke={core.band.color}
            style={{
              // circunferência de r=296 ≈ 1860
              strokeDasharray: 1860,
              strokeDashoffset: 1860 * (1 - core.band.within),
            }}
          />
        </>
      )}

      {/* ── OS SEIS VEIOS ── */}
      {core.seams.map((s, i) => {
        const a = ((s.angle - 90) * Math.PI) / 180;
        const x1 = C + Math.cos(a) * R_OUT;
        const y1 = C + Math.sin(a) * R_OUT;
        const x2 = C + Math.cos(a) * R_IN;
        const y2 = C + Math.sin(a) * R_IN;
        // 2px no mínimo: um domínio a nível 1 tem de continuar visível, senão o
        // céu diz "não existes" a quem apenas começou.
        const w = 2 + s.share * 46;
        const len = R_OUT - R_IN;
        // O rótulo fica para lá da ponta exterior do veio, alinhado pelo lado
        // de onde o veio vem: à direita do centro alinha à esquerda, e vice-
        // versa. Assim o texto afasta-se sempre da linha em vez de a cruzar.
        const lx = C + Math.cos(a) * R_LAB;
        const ly = C + Math.sin(a) * R_LAB;
        const anchor = Math.abs(Math.cos(a)) < 0.25 ? 'middle' : (Math.cos(a) > 0 ? 'start' : 'end');
        // em cima e em baixo o par número/nome empilha-se; aos lados fica em
        // linha de base única para não roubar altura ao enquadramento
        const dy = Math.sin(a) < -0.5 ? -6 : Math.sin(a) > 0.5 ? 20 : 4;
        return (
          <g key={s.id} className="ci-seam" style={{ ['--i' as string]: i, ['--dom' as string]: s.color }}>
            <line
              className="ci-vein"
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={s.color}
              strokeWidth={w}
              strokeLinecap="round"
              style={{ ['--len' as string]: Math.round(len) }}
            />
            {/* A ponta onde o veio encosta ao corpo: é ali que a energia entra. */}
            <circle className="ci-tip" cx={x2} cy={y2} r={w * 0.55 + 2} fill={s.color} />
            <text className="ci-num" x={lx} y={ly + dy} textAnchor={anchor} fill={s.color}>
              {s.level}
            </text>
            <text className="ci-lab" x={lx} y={ly + dy + 22} textAnchor={anchor}>
              {s.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
