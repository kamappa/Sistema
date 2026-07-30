/* O NÚCLEO — feixe de filamentos.
 * Missão 26 · Fase 6C, segunda passagem.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ORIGEM: R14 (`07-core-level-events/aproximacao ao nucleo.mp4`),      ║
 * ║  aberta e vista frame a frame nesta passagem.                        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O QUE A REFERÊNCIA É: um centro de luz branco-violeta com centenas de
 * filamentos finos a irradiar, cada um terminado numa partícula brilhante. O
 * conjunto respira. Não há contorno em lado nenhum — o que define a forma é a
 * densidade de linhas, não uma borda.
 *
 * EXTRAÍDO:
 *   · o núcleo é MATÉRIA, não um círculo. A luz vem de dentro;
 *   · os filamentos são muitos e finos — a densidade é que faz a massa;
 *   · cada filamento acaba num ponto brilhante: é isso que o torna vivo em
 *     vez de um sunburst gráfico;
 *   · duas populações de comprimento, como nas estrelas do céu do Sistema.
 *
 * REJEITADO:
 *   · o bloom branco a 100% — o Sistema tem sempre texto por cima
 *     (gramática 4: o valor de referência é o CONTRASTE relativo, não o
 *     brilho absoluto);
 *   · a explosão constante. Ali é um plano isolado; aqui é uma presença, e
 *     uma presença que explode sem parar é um alarme.
 *
 * O QUE O TORNA VERDADEIRO: o número de filamentos e o raio vêm de
 * `coreMass`, que vem do nível global real. Um Sistema no princípio tem um
 * núcleo pequeno e esparso; não há um estado "bonito por defeito".
 */

interface Props {
  /** 0–1, derivado do nível global. */
  mass: number;
  /** Cor do rank. */
  color: string;
  /** 0–1: quanto o Núcleo está em foco. Governa detalhe e brilho. */
  focus: number;
  /** Um pulso de energia acabou de chegar — vindo de um domínio. */
  pulse?: string | null;
  size?: number;
}

const BASE = 26;

/* A COR DO NÚCLEO NÃO É A COR DO RANK.
 *
 * A primeira montagem passava `rank.color` para tudo. No rank S isso dá um
 * núcleo dourado — e um núcleo dourado com raios lê-se como um sol de clip
 * art, exatamente o "neon barato" que a direção visual proíbe. A referência
 * R14 é branco-violeta, e o violeta é a cor-mãe do Sistema.
 *
 * Resolução: a MATÉRIA é sempre branco-violeta; o rank aparece no halo
 * exterior e nas pontas, que é onde uma cor se lê como pertença sem tomar
 * conta da forma. O rank continua legível — está escrito por extenso na
 * leitura, que é onde um dado deve estar. */
const MATTER = '#c4b5fd';
const MATTER_DEEP = '#7c3aed';

export default function Nucleus({ mass, color, focus, pulse, size = 320 }: Props) {
  /* Duas populações, como nas estrelas: poucos filamentos francos, muitos
   * ténues. A primeira montagem tinha os ténues a 0.15 de opacidade efetiva —
   * invisíveis — e o resultado eram treze raios isolados: um asterisco, não
   * matéria. Aqui a população densa é que faz o corpo, e os francos são
   * pontuação. */
  const n = Math.round(90 + mass * 130);
  const core = BASE + mass * 22;

  const fil = Array.from({ length: n }, (_, i) => {
    // O desvio irregular impede o padrão de leque que um passo constante dá.
    const a = (i / n) * Math.PI * 2 + ((i * 2654435761) % 1000) / 1000 * 0.11;
    const strong = i % 9 === 0;
    const len = core + (strong ? 40 + (i % 5) * 12 : 14 + (i % 13) * 4) * (0.7 + focus * 0.6);
    const x1 = 160 + Math.cos(a) * core * 0.55;
    const y1 = 160 + Math.sin(a) * core * 0.55;
    const x2 = 160 + Math.cos(a) * len;
    const y2 = 160 + Math.sin(a) * len;
    return { a, x1, y1, x2, y2, strong, i };
  });

  return (
    <svg
      viewBox="0 0 320 320"
      width={size}
      height={size}
      className="nuc"
      data-pulse={pulse ? 'true' : 'false'}
      style={{ ['--nuc' as string]: color, ['--nuc-focus' as string]: focus.toFixed(3) }}
      role="img"
      aria-label={`Núcleo do Sistema, massa ${Math.round(mass * 100)}%`}
    >
      <defs>
        <radialGradient id="nuc-core">
          <stop offset="0" stopColor="#fff" stopOpacity={0.7 + focus * 0.3} />
          <stop offset="0.28" stopColor={MATTER} stopOpacity="0.8" />
          <stop offset="0.62" stopColor={MATTER_DEEP} stopOpacity="0.3" />
          <stop offset="1" stopColor={MATTER_DEEP} stopOpacity="0" />
        </radialGradient>
        {/* O halo. O rank aparece aqui, e SÓ na borda mais exterior.
            Ao meio, como estava, um rank dourado punha uma mancha castanha de
            350px à volta do Núcleo — vista num screenshot à escala de chegada.
            Uma cor de estado não pode sujar a matéria; pode assinar o limite
            dela. */}
        <radialGradient id="nuc-halo">
          <stop offset="0" stopColor={MATTER_DEEP} stopOpacity="0.36" />
          <stop offset="0.5" stopColor={MATTER_DEEP} stopOpacity="0.14" />
          <stop offset="0.82" stopColor={color} stopOpacity="0.07" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* O halo: o que faz a luz existir é a ausência de luz à volta dela
          (gramática 6). O halo é largo e ténue, nunca um anel. */}
      <circle cx="160" cy="160" r={core * 3.4} fill="url(#nuc-halo)" opacity={0.5 + focus * 0.5} />

      {/* Os filamentos. Finos e muitos — a densidade é que faz a massa, e é
          por isso que a opacidade dos ténues nunca desce ao ponto de os
          apagar: apagados, sobram só os francos e o resultado é um asterisco. */}
      <g className="nuc-fils" stroke={MATTER} fill="none" strokeLinecap="round">
        {fil.map((f) => (
          <line
            key={f.i}
            x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2}
            strokeWidth={f.strong ? 0.9 : 0.5}
            opacity={(f.strong ? 0.5 : 0.3) * (0.62 + focus * 0.38)}
          />
        ))}
      </g>

      {/* As pontas. É isto que separa um feixe vivo de um sunburst desenhado —
          na referência, cada filamento acaba num ponto de luz. */}
      <g className="nuc-tips" fill="#fff">
        {fil.filter((f) => f.strong).map((f) => (
          <circle key={'t' + f.i} cx={f.x2} cy={f.y2} r={0.7 + focus * 0.7} opacity={0.4 + focus * 0.45} />
        ))}
      </g>

      {/* O corpo. Sem contorno, sem borda: só matéria a apagar-se para fora. */}
      <circle cx="160" cy="160" r={core} fill="url(#nuc-core)" className="nuc-body" />

      {/* O pulso: um anel que CONVERGE de fora para dentro quando chega
          energia (R15, gramática 1 — a energia vem do ambiente para o centro).
          Existe só enquanto o pulso dura. */}
      {pulse && (
        <circle className="nuc-pulse" cx="160" cy="160" r="140" fill="none"
          stroke={pulse} strokeWidth="2" />
      )}
    </svg>
  );
}
