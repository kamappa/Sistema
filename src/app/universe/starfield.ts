/* CAMPO DISTANTE — Missão 26 · Renaissance Visual · camada 2.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ISTO NÃO SÃO ESTRELAS DE EVIDÊNCIA, E A DISTINÇÃO É A LEI DO        ║
 * ║  PROJETO, NÃO UMA PREOCUPAÇÃO ESTÉTICA.                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O HUD do Universo afirma, e continuará a afirmar: "cada estrela é um nível
 * provado num domínio". Se o fundo passar a ter pontos que se leem como
 * estrelas, essa frase deixa de ser verdadeira — e "o Sistema nunca mente" é
 * a primeira lei, acima de qualquer ganho visual.
 *
 * O `universe-read` já tinha a doutrina certa escrita: *"Não há estrelas
 * decorativas. O fundo tem poeira, e a poeira não conta nada — é ambiente, e
 * está declarada como tal no componente."* Este campo é dessa categoria. O que
 * o mantém do lado certo da linha é geometria, não boa vontade:
 *
 *   · nunca passa de 1,3px APARENTES, contra os 2–5px de uma estrela de
 *     evidência (ver `PERSP` abaixo — o valor desenhado é outro);
 *   · NÃO tem halo. O `box-shadow` do `.us-star` é o que faz uma estrela
 *     existir contra o preto, e é exatamente o que aqui não há;
 *   · vive a −1800, atrás da poeira (−1400) e da nebulosa (−1000), portanto a
 *     perspetiva encolhe-o e o parallax afasta-o;
 *   · não reage a nada — não acende com o domínio, não cintila em resposta,
 *     não entra na sequência de formação.
 *
 * O HUD ganha uma linha a dizer o que este fundo é. Uma distinção que só
 * existe no código não protege ninguém.
 *
 * ── PORQUÊ GERADO, E NÃO ESCRITO À MÃO ──
 * São 206 pontos. Escritos à mão seriam 206 linhas impossíveis de reequilibrar.
 *
 * ── PORQUÊ DADOS, E NÃO `background-image` ──
 * Este módulo devolveu durante um tempo três strings de `background-image` com
 * 206 `radial-gradient` dentro. A afirmação de que *"o custo em runtime é o
 * mesmo de um gradiente estático"* estava errada, e o browser disse-o:
 *
 *   MEDIDO a 1920×1080 com DPR 2, dentro do Núcleo, tempo para produzir um
 *   frame — 4373ms com os 206 gradientes CSS; 457ms com três; 1002ms com os
 *   206 pontos desenhados uma vez para um `<canvas>`.
 *
 * Um `background-image` com 206 gradientes é RE-RASTERIZADO de cada vez que a
 * camada muda de escala de ecrã — e a viagem ao Núcleo muda-a. Um canvas é um
 * bitmap: desenha-se uma vez e a partir daí é uma cópia. Daí este módulo passar
 * a devolver os PONTOS, e quem os desenha ser o `FieldFar.tsx`.
 *
 * ── PORQUÊ HASH, E NÃO `Math.random()` ──
 * A mesma regra do resto da cena: o céu tem de ser o MESMO em cada visita. Um
 * fundo que se reordena a cada render é um protetor de ecrã, e a lei diz que
 * nada nasce do nada. A semente é fixa e o campo é sempre este.
 */

/** FNV-1a — o mesmo de `universe-read.ts`, pela mesma razão. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
const rnd = (s: string) => (hash(s) % 100000) / 100000;

/* ── A COMPENSAÇÃO DA PERSPETIVA, e é um erro meu apanhado no browser ──
 *
 * A primeira montagem pedia pontos de 0,9–1,35px e no ecrã não se via
 * praticamente nada. A conta explica-o: a camada vive a −1800 numa cena com
 * `perspective: 1100`, portanto é encolhida pelo fator 1100/(1100+1800) =
 * 0,379. Um ponto pedido a 0,9px chega ao ecrã com 0,34px — abaixo de um pixel
 * do dispositivo, ou seja, um cinzento quase invisível.
 *
 * É o mesmo fator que o CSS já usa para o `inset` das camadas profundas, e que
 * o SPEC regista na primeira passagem da Fase 6C ("a nebulosa acabava a meio
 * do céu porque a perspetiva encolhe uma camada a −1000px para 52%"). Eu
 * apliquei-o ao tamanho da CAIXA e esqueci-me de o aplicar ao tamanho do
 * CONTEÚDO.
 *
 * Os tamanhos abaixo são pedidos já multiplicados por `PERSP`, e os limites
 * continuam a ser expressos em pixels APARENTES — que é a unidade em que a
 * distinção face às estrelas de evidência tem de ser verdadeira, porque é a
 * única que alguém vê. */
/* ╔══════════════════════════════════════════════════════════════════════╗
 * ║  E DEIXOU DE SER PRECISA — A COMPENSAÇÃO PASSOU A 1, E ISTO NÃO É    ║
 * ║  UMA CONSTANTE MORTA QUE SE ESQUECEU DE APAGAR.                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O campo saiu do contexto 3D (ver o comentário do `.us-field-far` no
 * `UniverseScene.tsx`: 206 gradientes radiais a serem rasterizados à escala
 * que a viagem ao Núcleo multiplica). Sem `translateZ(-1800)` não há
 * perspetiva a encolher nada, logo o tamanho pedido **é** o tamanho no ecrã.
 *
 * Deixar o 2,636 aqui teria sido o pior desfecho possível desta correção: os
 * pontos passariam a 2,4–3,4px aparentes, ou seja, dentro da gama das estrelas
 * de EVIDÊNCIA (2–5px). O HUD continua a afirmar que cada estrela é um nível
 * provado, e o fundo passaria a desmenti-lo — a primeira lei do projeto caída
 * por um efeito secundário de uma correção de performance.
 *
 * A constante fica declarada, e não apagada, para o próximo que mexer na
 * profundidade desta camada saber que existe uma conta a refazer: se o campo
 * voltar a entrar no 3D, isto volta a ser (1100 + |z|) / 1100.
 */
const PERSP = 1;

/** Um ponto do campo. `x`/`y` em percentagem da caixa; `size` e `alpha` já em
 *  unidades APARENTES — ver `PERSP`. */
export interface FieldPoint {
  x: number;
  y: number;
  size: number;
  alpha: number;
  rgb: string;
}

export interface FieldLayer {
  points: readonly FieldPoint[];
  /** Quantos pontos tem — para se poder afirmar o número, em vez de o estimar. */
  count: number;
}

/**
 * Uma camada do campo. `n` pontos distribuídos por hash, com tamanho e
 * opacidade tirados da mesma semente.
 *
 * `maxApparent` é o tamanho máximo **no ecrã**, em pixels — não o valor que
 * entra no gradiente. A conversão é `PERSP`, e é essa a unidade em que a
 * distinção face às estrelas de evidência tem de ser verdadeira.
 *
 * Os pontos ficam a 2% das bordas para que a máscara da cena não corte meia
 * dúzia deles ao meio — um ponto cortado lê-se como artefacto.
 */
function layer(seed: string, n: number, maxApparent: number, maxAlpha: number): FieldLayer {
  const points: FieldPoint[] = [];
  const min = 0.4 * PERSP;
  const max = maxApparent * PERSP;
  for (let i = 0; i < n; i++) {
    const x = 2 + rnd(`${seed}x${i}`) * 96;
    const y = 2 + rnd(`${seed}y${i}`) * 96;
    // Distribuição enviesada para o pequeno: um céu com todos os pontos do
    // mesmo tamanho lê-se como uma textura, e uma textura não tem distância.
    const t = rnd(`${seed}s${i}`);
    const size = +(min + t * t * (max - min)).toFixed(2);
    // Os maiores são os mais brilhantes, como na realidade: o tamanho aparente
    // de um ponto de luz é a própria intensidade a transbordar.
    const alpha = +(maxAlpha * (0.35 + t * 0.65)).toFixed(3);
    // Tom: a maioria fria, algumas quentes. Um céu monocromático é um poster.
    const warm = rnd(`${seed}c${i}`) > 0.82;
    const rgb = warm ? '255 236 214' : rnd(`${seed}b${i}`) > 0.5 ? '226 232 255' : '244 244 255';
    points.push({ x: +x.toFixed(2), y: +y.toFixed(2), size, alpha, rgb });
  }
  return { points, count: n };
}

/**
 * As três camadas do campo distante, do mais fundo para o mais próximo.
 *
 * Três e não uma porque é a diferença de velocidade entre elas que produz
 * profundidade — uma camada só, por muitos pontos que tenha, é um autocolante
 * atrás da cena. Os períodos de deriva vivem no CSS e não são múltiplos uns
 * dos outros, pela mesma razão do resto do ambiente: o conjunto nunca se
 * repete numa sessão.
 */
/* As contagens e os alfas subiram depois da primeira observação no browser:
   150 pontos a 0,34–0,58 davam um céu que tecnicamente tinha fundo e à vista
   continuava vazio — o defeito que a camada 2 existe para corrigir, ainda lá.
   206 pontos, e os alfas a subir sem chegar ao leitoso: a direção visual pede
   "materiais escuros, luz seletiva e espaço negativo", por isso o alvo é um
   céu com profundidade, não um céu cheio. */
export const STARFIELD: readonly FieldLayer[] = [
  layer('sf-far', 92, 0.9, 0.46),
  layer('sf-mid', 70, 1.15, 0.62),
  layer('sf-near', 44, 1.3, 0.78),
];

/** Total de pontos do campo. Afirmável, não estimado. */
export const STARFIELD_COUNT = STARFIELD.reduce((n, l) => n + l.count, 0);
