/* O NÚCLEO — matéria com camadas.
 * Missão 26 · Fase 6C, terceira passagem (VIDA).
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ORIGEM: R14 (`07-core-level-events/aproximacao ao nucleo.mp4`) para  ║
 * ║  a matéria; R23 (galáxia violeta, terceira passagem) para a ideia de  ║
 * ║  que a rotação de um corpo real NÃO é uniforme.                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O VEREDICTO QUE ISTO RESPONDE: "o Núcleo parece uma estrela normal". Estava
 * certo. A montagem anterior era um só feixe a respirar — bonito, e inerte:
 * uma forma que pulsa é um ícone com uma animação, não um corpo.
 *
 * O QUE FAZ UM CORPO PARECER UM CORPO:
 *
 *   1. CAMADAS QUE NÃO SE MOVEM JUNTAS. Numa galáxia o interior roda mais
 *      depressa do que o exterior — é isso que faz os braços curvarem-se. Três
 *      conchas de filamentos, a velocidades e sentidos diferentes, dão a mesma
 *      leitura: o olho não consegue prever a forma seguinte, e o que não é
 *      previsível lê-se como matéria em vez de gráfico.
 *   2. MATÉRIA A CAIR. Partículas em órbita, mais depressa perto.
 *   3. EJEÇÕES OCASIONAIS. Raras e curtas. É o que separa "vivo" de "a fazer
 *      espetáculo": um corpo que ejeta sem parar é um alarme.
 *   4. UMA SUPERFÍCIE QUE RESPIRA, e não uma forma que escala.
 *
 * ARQUITETURA, e a razão dela é medida: cada camada é um `<svg>` PRÓPRIO,
 * posicionado por cima dos outros, e quem roda é o elemento. Animar um `<g>`
 * dentro de um SVG obriga o motor a repintar o desenho inteiro a cada frame —
 * na passagem anterior isso pôs a chegada a 50ms. Um elemento inteiro com
 * `transform` é promovível e composto, e três rotações passam a custar o que
 * custaria uma.
 *
 * ESTADOS — e cada um tem de significar alguma coisa que já aconteceu:
 *   REST         repouso
 *   ATTUNEMENT   um domínio está em foco: o Núcleo afina-se pela cor dele
 *   ABSORBING    energia a chegar de evidência real
 *   RANK_UP      contração e expansão; o corpo ficou maior para sempre
 */

export type CoreState = 'REST' | 'ATTUNEMENT' | 'ABSORBING' | 'RANK_UP';

interface Props {
  /** 0–1, derivado do nível global real. */
  mass: number;
  /** Cor do rank. Assina o limite; não pinta a matéria. */
  color: string;
  /** 0–1: quanto o Núcleo está em foco. Governa detalhe e brilho. */
  focus: number;
  state: CoreState;
  /** Cor do domínio em causa, em ATTUNEMENT ou ABSORBING. */
  attune?: string | null;
  /** Ângulo (graus) de onde vem a energia ou o foco. O corpo orienta-se. */
  fromAngle?: number;
  size?: number;
}

const BASE = 26;
const MATTER = '#c4b5fd';
const MATTER_DEEP = '#7c3aed';

/** Uma concha de filamentos. `seed` desloca a distribuição para as três não
 *  serem a mesma imagem rodada — isso via-se, e via-se como truque. */
function shell(n: number, r0: number, r1: number, seed: number, focus: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((i + seed * 0.37) / n) * Math.PI * 2 + ((i * 2654435761 + seed * 7919) % 1000) / 1000 * 0.13;
    const strong = (i + seed) % 9 === 0;
    const len = r0 + (r1 - r0) * (0.35 + ((i * 31 + seed * 17) % 100) / 100 * 0.65) * (0.75 + focus * 0.45);
    return {
      i,
      x1: 160 + Math.cos(a) * r0 * 0.62,
      y1: 160 + Math.sin(a) * r0 * 0.62,
      x2: 160 + Math.cos(a) * len,
      y2: 160 + Math.sin(a) * len,
      strong,
    };
  });
}

export default function Nucleus({
  mass, color, focus, state, attune, fromAngle = 0, size = 340,
}: Props) {
  const core = BASE + mass * 22;
  // Três conchas. A de dentro é densa e curta; a de fora é esparsa e longa —
  // é essa diferença de densidade com o raio que faz o corpo ter dentro.
  const shells = [
    { fil: shell(Math.round(46 + mass * 44), core, core + 26 + mass * 14, 1, focus), w: 0.42, o: 0.34 },
    { fil: shell(Math.round(34 + mass * 34), core * 1.1, core + 54 + mass * 26, 2, focus), w: 0.55, o: 0.26 },
    { fil: shell(Math.round(20 + mass * 22), core * 1.2, core + 96 + mass * 40, 3, focus), w: 0.75, o: 0.2 },
  ];

  // Matéria em órbita. Poucas e desiguais: um anel regular de pontos é um
  // spinner de loading, e um spinner diz "espera", não "existo".
  const orbit = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + ((i * 2654435761) % 1000) / 1000 * 0.4;
    const r = core * (1.7 + ((i * 37) % 100) / 100 * 1.5);
    return { i, x: 160 + Math.cos(a) * r, y: 160 + Math.sin(a) * r, s: 0.7 + ((i * 53) % 100) / 100 * 1.1 };
  });

  const tint = attune || MATTER;

  return (
    <div
      className="nuc"
      data-state={state}
      style={{
        width: size, height: size,
        ['--nuc' as string]: color,
        ['--nuc-tint' as string]: tint,
        ['--nuc-from' as string]: fromAngle + 'deg',
        ['--nuc-focus' as string]: focus.toFixed(3),
      }}
      role="img"
      aria-label={`Núcleo do Sistema, massa ${Math.round(mass * 100)}%`}
    >
      {/* O halo. Estático e largo: é o que faz a luz existir contra o vazio
          (gramática 6), e uma coisa que define o vazio não pode piscar. */}
      <svg className="nuc-l nuc-halo" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          <radialGradient id="nuc-g-halo">
            <stop offset="0" stopColor={MATTER_DEEP} stopOpacity="0.36" />
            <stop offset="0.5" stopColor={MATTER_DEEP} stopOpacity="0.14" />
            {/* O rank só assina o limite. Ao meio punha uma mancha castanha. */}
            <stop offset="0.82" stopColor={color} stopOpacity="0.07" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r={core * 3.4} fill="url(#nuc-g-halo)" opacity={0.5 + focus * 0.5} />
      </svg>

      {/* AFINAÇÃO: quando um domínio está em foco, uma parte da superfície
          orienta-se para ele. Não é o Núcleo a mudar de cor — é uma zona dele
          a responder, que é o que um corpo faz quando algo o puxa. */}
      <svg className="nuc-l nuc-attune" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          {/* 0,26 e um raio curto. A 0,5 e com raio 0,55 isto pintava metade
              do Núcleo da cor do domínio, e o corpo passava a ler-se como um
              balão cor-de-rosa em vez de matéria a responder a uma atração.
              A afinação tem de ser uma ZONA da superfície, não uma demão. */}
          <radialGradient id="nuc-g-attune" cx="0.5" cy="0.18" r="0.4">
            <stop offset="0" stopColor={tint} stopOpacity="0.26" />
            <stop offset="1" stopColor={tint} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r={core * 1.9} fill="url(#nuc-g-attune)" />
      </svg>

      {/* As três conchas. Cada uma é um elemento próprio e roda sozinha. */}
      {shells.map((sh, k) => (
        <svg key={k} className={`nuc-l nuc-shell nuc-shell-${k}`} viewBox="0 0 320 320" aria-hidden="true">
          <g stroke={MATTER} fill="none" strokeLinecap="round">
            {sh.fil.map((f) => (
              <line key={f.i} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2}
                strokeWidth={f.strong ? sh.w * 1.9 : sh.w}
                opacity={(f.strong ? sh.o * 2 : sh.o) * (0.62 + focus * 0.38)} />
            ))}
          </g>
          {/* As pontas, só na concha exterior: é lá que se leem. Na referência
              cada filamento acaba num ponto de luz, e é isso que separa um
              feixe vivo de um sunburst desenhado. */}
          {k === 2 && (
            <g fill="#fff">
              {sh.fil.filter((f) => f.strong).map((f) => (
                <circle key={'t' + f.i} cx={f.x2} cy={f.y2} r={0.7 + focus * 0.7} opacity={0.4 + focus * 0.4} />
              ))}
            </g>
          )}
        </svg>
      ))}

      {/* Matéria em órbita. */}
      <svg className="nuc-l nuc-orbit" viewBox="0 0 320 320" aria-hidden="true">
        <g fill={MATTER}>
          {orbit.map((p) => (
            <circle key={p.i} cx={p.x} cy={p.y} r={p.s} opacity={0.3 + focus * 0.5} />
          ))}
        </g>
      </svg>

      {/* Ejeções. Três, com atrasos longos e desiguais, para nunca coincidirem
          e para nunca se apanhar o ciclo. */}
      <svg className="nuc-l nuc-ejecta" viewBox="0 0 320 320" aria-hidden="true">
        <g stroke={MATTER} strokeLinecap="round" fill="none">
          <line className="nuc-ej nuc-ej-0" x1="160" y1="160" x2="160" y2="60" strokeWidth="1.4" />
          <line className="nuc-ej nuc-ej-1" x1="160" y1="160" x2="248" y2="212" strokeWidth="1.1" />
          <line className="nuc-ej nuc-ej-2" x1="160" y1="160" x2="76" y2="196" strokeWidth="1.2" />
        </g>
      </svg>

      {/* O corpo. Sem contorno, sem borda: matéria a apagar-se para fora. */}
      <svg className="nuc-l nuc-body" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          <radialGradient id="nuc-g-core">
            <stop offset="0" stopColor="#fff" stopOpacity={0.7 + focus * 0.3} />
            <stop offset="0.28" stopColor={MATTER} stopOpacity="0.8" />
            <stop offset="0.62" stopColor={MATTER_DEEP} stopOpacity="0.3" />
            <stop offset="1" stopColor={MATTER_DEEP} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r={core} fill="url(#nuc-g-core)" />
      </svg>

      {/* O anel de absorção: CONVERGE de fora para dentro. A energia vem do
          mundo para o centro (R15, gramática 1) — nunca ao contrário, que é o
          gesto do confetti e diz exatamente o oposto. */}
      <svg className="nuc-l nuc-absorb" viewBox="0 0 320 320" aria-hidden="true">
        <circle cx="160" cy="160" r="140" fill="none" stroke={tint} strokeWidth="2" />
      </svg>
    </div>
  );
}
