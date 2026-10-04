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
  /* ── O PULSO ── 0–1, dos últimos sete dias. Ver `readPulse`.
   * É a leitura que faltava, e a falta dela era a queixa: um Núcleo que só
   * conhece o nível global fica IDÊNTICO numa semana de trabalho e numa semana
   * parada, porque o nível global nunca desce. Isto governa o ritmo da
   * respiração, a velocidade e o brilho das fitas, e o comprimento das pontas
   * — nunca o TAMANHO do corpo. O corpo é massa provada e não pode encolher
   * por se ter faltado três dias; o que abranda é a atividade, e é isso que o
   * movimento diz. */
  pulse?: number;
  /** As inscrições. Texto real do estado — rank, nível global, domínios — e os
   *  traços do anel, um por domínio, com o comprimento dado pelo nível dele.
   *  Ausente em vista geral: a esta distância seria ruído ilegível. */
  sigil?: { texto: string; ticks: { v: number; color: string }[] } | null;
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
/* ── E VOLTA A CRESCER, e a razão é a mesma da primeira vez ──
 * Missão 26 · Renaissance Visual · a passagem dos dois céus.
 *
 * 42/34 vinham da correção anterior, feita quando o corpo era um ponto de raio
 * 26. Resolveu o "ponto invisível" e parou aí. O veredicto seguinte do Daniel
 * — "o núcleo podia ser maior e mais vivo" — é sobre o que sobrou: um corpo
 * que se lê, mas que ainda não é o centro do mundo num plano de 620px.
 *
 * A distinção mantém-se intacta e é ela que autoriza o aumento: PRESENÇA não é
 * PROGRESSO. Subir `BASE` não afirma nível nenhum — afirma que o centro do
 * mundo existe. `GROWTH` é que é a evidência, e sobe menos em proporção do que
 * a presença, de propósito: o corpo de quem acabou de chegar aproxima-se do
 * corpo de quem já provou muito, e é assim que deve ser. O que separa os dois
 * é o céu à volta, que é onde a prova está. */
const BASE = 58;
const GROWTH = 42;
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

/* ── AS QUATRO PONTAS ──────────────────────────────────────────────────
 * ORIGEM: imagem enviada pelo Daniel no chat — um corpo de luz azul com uma
 * estrela de quatro pontas ao centro e fitas de energia em órbita. NÃO está
 * catalogada e NÃO tem número de referência; dar-lhe um seria inventar
 * proveniência, que é o erro já cometido e corrigido no cabeçalho deste
 * ficheiro. Rejeitado dela: o ciano, que não é a paleta do Sistema.
 *
 * A silhueta é o que muda a leitura. Um bloom radial é uma BOLA DE LUZ e lê-se
 * como um ícone aceso; um corpo com eixo lê-se como uma ENTIDADE. A diferença
 * está toda no perfil: os lados são côncavos, e por isso as pontas afinam
 * depressa junto ao corpo e alongam-se muito no fim.
 *
 * O eixo vertical é mais longo do que o horizontal — 1,7× — pela mesma razão
 * que já está escrita para as streaks: uma cruz simétrica é o brilho desenhado
 * de um ícone, e o que existe na natureza tem um eixo dominante. */
function spikePath(lv: number, lh: number, w: number): string {
  return [
    `M160,${(160 - lv).toFixed(1)}`,
    `Q${(160 + w).toFixed(1)},${(160 - w).toFixed(1)} ${(160 + lh).toFixed(1)},160`,
    `Q${(160 + w).toFixed(1)},${(160 + w).toFixed(1)} 160,${(160 + lv).toFixed(1)}`,
    `Q${(160 - w).toFixed(1)},${(160 + w).toFixed(1)} ${(160 - lh).toFixed(1)},160`,
    `Q${(160 - w).toFixed(1)},${(160 - w).toFixed(1)} 160,${(160 - lv).toFixed(1)}`,
    'Z',
  ].join(' ');
}

export default function Nucleus({
  mass, color, focus, state, attune, fromAngle = 0, size = 340,
  pulse = 0.3, sigil = null,
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

  /* As pontas. O comprimento responde ao PULSO e ao FOCO, nunca à massa: o
     corpo já diz a massa, e um segundo canal a dizer o mesmo facto não é
     redundância inofensiva — é uma leitura a fingir que são dois. */
  /* 2,5×/1,45× dava um eixo vertical tão longo que a ponta de baixo chegava ao
     território da Mente e passava por cima do rótulo dele. A anisotropia
     mantém-se — continua a ser 1,25× e não uma cruz simétrica, pela razão já
     escrita — mas dentro do enquadramento: um corpo que invade os vizinhos
     deixa de ser o centro da composição e passa a ser um obstáculo nela. */
  const spikeV = core * (2.05 + pulse * 0.95 + focus * 1.0);
  const spikeH = core * (1.64 + pulse * 0.6 + focus * 0.7);
  const spikeW = core * 0.3;

  /* ── AS FITAS ──
   * Da mesma imagem: bandas de luz que ENVOLVEM o corpo em vez de saírem
   * dele. É o que separa um corpo que está no espaço de um corpo colado a um
   * fundo, e faz uma coisa que nenhuma camada anterior fazia — passar À FRENTE
   * e ATRÁS. O truque da profundidade não é 3D: é o gradiente do traço a
   * apagar-se de um lado, que é o que se vê quando uma fita passa por trás.
   *
   * Três, com raios e inclinações que não são múltiplos: em proporções
   * simples o olho apanha o padrão e aquilo passa a ser um logótipo a rodar. */
  const ribbons = [
    { rx: core * 2.30, ry: core * 0.92, rot: -17, w: 1.7 },
    { rx: core * 1.74, ry: core * 1.36, rot: 54, w: 1.25 },
    { rx: core * 2.72, ry: core * 0.62, rot: 28, w: 1.0 },
  ];

  /* O anel das inscrições. `r` fica fora do corpo e dentro das pontas: por
     dentro seria uma tatuagem no plasma, por fora perdia a ligação a ele. */
  const sigR = core * 1.62;

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
        ['--nuc-pulse' as string]: pulse.toFixed(3),
        /* O ritmo da respiração EM SEGUNDOS, e é aqui que o pulso se vê sem
           se estar à espera dele: 13s parado, 5,2s a todo o gás. Um corpo que
           respira devagar está em repouso; um que respira depressa está a
           trabalhar. Ninguém precisa de aprender isto. */
        ['--nuc-rate' as string]: (13 - pulse * 7.8).toFixed(2) + 's',
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

      {/* ── FITAS ── e vêm ANTES do corpo de propósito.
          O corpo desenha-se por cima delas, e é isso que faz metade de cada
          fita desaparecer atrás dele. Sem essa oclusão as três seriam anéis
          desenhados à volta de um disco — o mesmo que um logótipo de átomo. É
          a oclusão que as põe em ÓRBITA, e a órbita é o que se pediu.
          A segunda metade da leitura é o gradiente do traço: cada fita entra
          transparente, acende ao meio e apaga-se — a luz de uma banda vista de
          lado, e não uma linha com fim. */}
      <svg className="nuc-l nuc-ribbons" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          {ribbons.map((_, k) => (
            <linearGradient key={k} id={`nuc-g-rb${k}`} x1="0" y1="0" x2="1" y2="0.35">
              <stop offset="0" stopColor={MATTER} stopOpacity="0" />
              <stop offset="0.26" stopColor={MATTER} stopOpacity="0.44" />
              <stop offset="0.52" stopColor="#fff" stopOpacity="0.82" />
              <stop offset="0.74" stopColor={tint} stopOpacity="0.4" />
              <stop offset="1" stopColor={tint} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {ribbons.map((rb, k) => (
          <g key={k} className={`nuc-rb nuc-rb-${k}`}>
            <ellipse
              cx="160" cy="160" rx={rb.rx} ry={rb.ry}
              fill="none"
              stroke={`url(#nuc-g-rb${k})`}
              strokeWidth={rb.w * (1 + focus * 0.5)}
              strokeLinecap="round"
              transform={`rotate(${rb.rot} 160 160)`}
              opacity={0.3 + pulse * 0.34 + focus * 0.3}
            />
          </g>
        ))}
      </svg>

      {/* ── AS INSCRIÇÕES ── ORIGEM: segunda imagem do chat, a silhueta com o
          círculo de glifos por trás. NÃO catalogada, sem número de referência.
          Rejeitado dela: a densidade. Naquela imagem o anel é um muro de
          símbolos, e um muro de símbolos ilegíveis é decoração — proibida por
          lei do projeto ("nenhuma animação é decorativa", e um anel que não se
          pode ler não comunica estado nenhum).

          Aqui o anel diz o ESTADO, por extenso: rank, nível global, e os seis
          domínios com o nível de cada um. Quem se aproximar o suficiente
          consegue lê-lo, e o que lá está é verdade verificável contra o HUD.
          Os traços por baixo são a mesma informação em forma: um por domínio,
          o comprimento é o nível.

          Só existe com `sigil` — ou seja, quando a câmara já se aproximou.
          Em vista geral seriam 200 caracteres de 3px, que é ruído. */}
      {sigil && (
        <svg className="nuc-l nuc-sigil" viewBox="0 0 320 320" aria-hidden="true">
          <defs>
            <path
              id="nuc-sig-path"
              fill="none"
              d={`M160,${160 - sigR} A${sigR},${sigR} 0 1,1 ${(160 - 0.01).toFixed(2)},${160 - sigR} Z`}
            />
          </defs>
          {/* Os traços: um por domínio, o nível é o comprimento. */}
          <g className="nuc-sig-ticks">
            {sigil.ticks.map((t, k) => {
              const a = ((k / sigil.ticks.length) * 360 - 90) * (Math.PI / 180);
              const r0 = sigR * 0.8;
              const r1 = r0 + 6 + t.v * 20;
              return (
                <line
                  key={k}
                  x1={160 + Math.cos(a) * r0} y1={160 + Math.sin(a) * r0}
                  x2={160 + Math.cos(a) * r1} y2={160 + Math.sin(a) * r1}
                  stroke={t.color} strokeWidth="1.4" strokeLinecap="round"
                  opacity="0.55"
                />
              );
            })}
          </g>
          <circle cx="160" cy="160" r={sigR} fill="none" stroke={MATTER} strokeWidth="0.4" opacity="0.2" />
          <text className="nuc-sig-t" fill={MATTER}>
            <textPath href="#nuc-sig-path" startOffset="0">{sigil.texto}</textPath>
          </text>
        </svg>
      )}

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
        {/* ── O PERFIL DA LUZ, e é aqui que "maior" quase correu mal ──
            Com o corpo a 42 os stops de 0,28 e 0,62 davam uma esfera com
            gradação. A 58 a mesma curva pintou uma MANCHA BRANCA de 250px:
            crescer o raio multiplica a área saturada, e uma superfície toda
            saturada não tem estrutura nenhuma para se ver. Era literalmente o
            defeito de que o Daniel se queixou na captura dele.

            A correção não é encolher o corpo — é concentrar a luz. O branco
            acaba a 0,12 em vez de 0,28, e o violeta ocupa o resto. O que se
            ganha é o que uma estrela real tem: um ponto incandescente pequeno
            dentro de um corpo que ainda se lê como corpo. As pontas e as fitas
            é que carregam o TAMANHO; o brilho não tem de o fazer também. */}
        <defs>
          <radialGradient id="nuc-g-core">
            <stop offset="0" stopColor="#fff" stopOpacity={0.82 + focus * 0.18} />
            <stop offset="0.12" stopColor="#fff" stopOpacity={0.5 + focus * 0.25} />
            <stop offset="0.34" stopColor={MATTER} stopOpacity="0.52" />
            <stop offset="0.66" stopColor={MATTER_DEEP} stopOpacity="0.26" />
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

      {/* ── AS QUATRO PONTAS ── depois do bloom e antes das streaks, e a ordem
          é a leitura: o bloom é a luz que sangra (macia, por baixo), as pontas
          são a GEOMETRIA do corpo (nítidas, por cima dele), e as streaks são o
          artefacto da lente (largas, por cima de tudo). Trocar qualquer par
          punha um desfoque à frente de uma aresta, e uma aresta desfocada
          deixa de ser aresta.
          Duas cópias: a de baixo larga e fraca faz o halo da ponta; a de cima
          estreita e branca faz o gume. Uma só dá um triângulo chapado. */}
      <svg className="nuc-l nuc-spikes" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          <radialGradient id="nuc-g-spike">
            <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="0.22" stopColor={MATTER} stopOpacity="0.6" />
            <stop offset="0.62" stopColor={MATTER_DEEP} stopOpacity="0.22" />
            <stop offset="1" stopColor={MATTER_DEEP} stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={spikePath(spikeV, spikeH, spikeW)} fill="url(#nuc-g-spike)"
          opacity={0.5 + focus * 0.5} />
        <path d={spikePath(spikeV * 0.97, spikeH * 0.9, spikeW * 0.34)} fill="url(#nuc-g-spike)"
          opacity={0.72 + focus * 0.28} />
      </svg>

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
