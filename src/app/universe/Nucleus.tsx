/* O NÚCLEO — matéria com camadas.
 * Missão 26 · Fase 6C, terceira passagem (VIDA).
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ORIGEM: R14 (`07-core-level-events/aproximacao ao nucleo.mp4`) para  ║
 * ║  a matéria. A rotação diferencial vem de uma imagem de galáxia        ║
 * ║  espiral violeta que o Daniel enviou no chat — NÃO está catalogada    ║
 * ║  e não tem número de referência.                                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * CORREÇÃO DE UMA ATRIBUIÇÃO FALSA MINHA. Escrevi aqui "R23" para a imagem da
 * galáxia. R23 é `03-universe · primavera`, um vídeo de 15s do catálogo, e não
 * tem nada a ver. Pôr um número de referência numa imagem que veio do chat é
 * inventar uma proveniência — exatamente o que a regra "nunca fingir que uma
 * referência foi vista" proíbe. A imagem existe e foi vista; o que não existe
 * é o número.
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
 *   COLLAPSE     um rank foi PERDIDO. O corpo colapsa e volta menor — é a
 *                única resposta do Núcleo que não termina onde começou, e é
 *                assim porque o facto também não. Ver a SUPERNOVA em
 *                `universe-states.ts`.
 */

export type CoreState = 'REST' | 'ATTUNEMENT' | 'ABSORBING' | 'RANK_UP' | 'COLLAPSE';

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

/* ── PRESENÇA E MASSA, que deixam de ser a mesma coisa ──────────────────
 * Missão 26 · Renaissance Visual · camada 1.
 *
 * `BASE` era 26 e `mass` acrescentava até 22. Com o nível global a 1 — que é o
 * estado real do Daniel, e o estado em que a maioria de quem abre isto está —
 * o corpo saía com raio 26,5 num viewBox de 320: um ponto. O veredicto foi
 * "de ponto invisível a coração de plasma", e estava certo.
 *
 * A correção NÃO é inflacionar a massa, que seria o Sistema a mentir sobre o
 * nível. É separar duas coisas que estavam soldadas:
 *
 *   PRESENÇA (`BASE`) — o corpo EXISTE. Não é um indicador de progresso; é o
 *     centro do mundo, e o centro do mundo não pode depender de já se ter
 *     provado alguma coisa. Um recém-chegado tem um Núcleo pequeno, não um
 *     Núcleo ausente.
 *   MASSA (`GROWTH`) — o que a evidência acrescenta. Continua a crescer, e
 *     agora cresce MAIS em termos absolutos do que antes: 34 contra 22.
 *
 * A leitura verdadeira do nível continua onde sempre esteve — o número no HUD,
 * as estrelas, o interior do Núcleo na escala 4. O raio nunca foi lido como
 * número por ninguém, e um corpo maior não afirma um nível que não existe. */
const BASE = 42;
const GROWTH = 34;
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
  const core = BASE + mass * GROWTH;
  /* O corpo em percentagem do lado, para as camadas CSS (plasma e limbo) se
     colarem ao raio real sem ter de saber o viewBox. */
  const bodyPct = ((core * 2) / 320) * 100;
  // Três conchas. A de dentro é densa e curta; a de fora é esparsa e longa —
  // é essa diferença de densidade com o raio que faz o corpo ter dentro.
  /* As opacidades desceram de 0,34/0,26/0,20 para 0,20/0,17/0,15 quando o corpo
     ganhou plasma e corona. Não é timidez: com o corpo a ser um ponto, os
     filamentos ERAM o Núcleo e tinham de carregar a leitura sozinhos. Agora há
     matéria por baixo, e às opacidades antigas o que se via era uma explosão
     de riscos por cima de uma superfície que ninguém chegava a ler — duas
     famílias de linhas radiais (conchas + raios) a somarem-se num sunburst,
     que é o cliché proibido por nome na direção visual.
     As conchas passam ao papel que sempre deveriam ter tido: matéria projetada
     PARA FORA do corpo, e não o desenho do corpo. */
  const shells = [
    { fil: shell(Math.round(46 + mass * 44), core, core + 26 + mass * 14, 1, focus), w: 0.42, o: 0.20 },
    { fil: shell(Math.round(34 + mass * 34), core * 1.1, core + 54 + mass * 26, 2, focus), w: 0.55, o: 0.17 },
    { fil: shell(Math.round(20 + mass * 22), core * 1.2, core + 96 + mass * 40, 3, focus), w: 0.75, o: 0.15 },
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
        ['--nuc-body-pct' as string]: bodyPct.toFixed(2) + '%',
      }}
      role="img"
      aria-label={`Núcleo do Sistema, massa ${Math.round(mass * 100)}%`}
    >
      {/* ── CORONA ── duas conchas de luz que respiram em CONTRA-FASE.
          É a camada que faz o corpo irradiar em vez de estar apenas aceso.
          Contra-fase e não em uníssono porque duas coisas a inchar ao mesmo
          tempo leem-se como uma coisa só a escalar — que é o defeito que o
          cabeçalho já identificava na montagem anterior. Em oposição, o que se
          vê é o campo a trocar de densidade: plasma, não um balão. */}
      <div className="nuc-corona nuc-corona-a" aria-hidden="true" />
      <div className="nuc-corona nuc-corona-b" aria-hidden="true" />

      {/* ── RAIOS ── a irradiação. Um cone repetido com máscara radial, a rodar
          muito devagar. É UM paint e um transform — não são N elementos — e é
          por isso que cabe no orçamento. Só em qualidade `full`. */}
      <div className="nuc-rays" aria-hidden="true" />

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

      {/* ── PLASMA ── a superfície, e vem DEPOIS do corpo.
          A ordem não é detalhe: na primeira montagem pus estas duas camadas
          antes do `nuc-body` e o corpo desenhou-se por cima delas — o plasma
          existia no DOM e não se via nem um pixel dele. É superfície, e uma
          superfície está à frente da matéria que cobre.

          Dois conjuntos de células que derivam em SENTIDOS OPOSTOS: onde se
          cruzam, a densidade muda, e é essa interferência — não um
          `@keyframes` de brilho — que faz a superfície parecer estar a ferver.
          Custo: dois elementos com `background` e `transform`. Sem `filter`:
          a proibição de blur em área grande mantém-se, e a suavidade vem dos
          próprios gradientes. */}
      <div className="nuc-plasma nuc-plasma-a" aria-hidden="true" />
      <div className="nuc-plasma nuc-plasma-b" aria-hidden="true" />

      {/* ── LIMBO ── o bordo quente. Numa estrela real o limite lê-se porque a
          linha de visão atravessa mais matéria à tangente do que ao centro.
          Sem isto o corpo é um gradiente que desvanece e não tem volume; com
          isto ganha superfície e passa a ter um "onde acaba". */}
      <div className="nuc-limb" aria-hidden="true" />

      {/* ── BLOOM ── camada 3.
          O halo de saturação: a luz que uma lente não consegue conter e que
          sangra para fora do corpo. É a única peça desta camada que usa
          `filter: blur`, e usa-o sobre 206×206 — a proibição do projeto é de
          blur em ÁREA GRANDE, não da propriedade, e o SPEC regista 11
          elementos com `filter` já em uso. Medido: sem custo distinguível.
          Mesmo assim só existe em `full`; `lite` fica com a corona, que faz
          quase o mesmo por gradiente. */}
      <div className="nuc-bloom" aria-hidden="true" />

      {/* ── STREAKS ── a assinatura anamórfica.
          É isto — e não o halo — que o olho lê como "muito brilhante para o
          sensor". Dois gradientes lineares cruzados, com o horizontal muito
          mais longo, como numa lente real. Custo: dois `background`, zero
          filter, e por isso vivem em todas as qualidades menos `off`.
          A horizontal é 2,4× a vertical: simétricas dariam uma cruz, e uma
          cruz é um brilho de ícone, não de lente. */}
      <div className="nuc-streak nuc-streak-h" aria-hidden="true" />
      <div className="nuc-streak nuc-streak-v" aria-hidden="true" />

      {/* O anel de absorção: CONVERGE de fora para dentro. A energia vem do
          mundo para o centro (R15, gramática 1) — nunca ao contrário, que é o
          gesto do confetti e diz exatamente o oposto. */}
      <svg className="nuc-l nuc-absorb" viewBox="0 0 320 320" aria-hidden="true">
        <circle cx="160" cy="160" r="140" fill="none" stroke={tint} strokeWidth="2" />
      </svg>
    </div>
  );
}
