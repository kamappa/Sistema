/* CAMPO DISTANTE — o mesmo céu, noutra primitiva.
 * Missão 26 · Renaissance Visual.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O QUE ESTE FICHEIRO EXISTE PARA CORRIGIR                            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O relato do Daniel foi que dentro do Núcleo o céu aparecia "aos quadrados",
 * com bandas retangulares e preto. Isso é o compositor do Chrome a não acabar
 * de rasterizar a tempo, e o trabalho que ele não acabava era este: 206
 * `radial-gradient` num `background-image`, re-rasterizados de cada vez que a
 * camada muda de escala em espaço de ecrã — e a viagem ao Núcleo desloca a
 * câmara +780 em z, o que a muda.
 *
 * MEDIDO a 1920×1080 com DPR 2, dentro do Núcleo, tempo para produzir um frame:
 *
 *   206 gradientes CSS ......... 4373 ms
 *   3 gradientes CSS ............ 457 ms   ← prova que era a CONTAGEM
 *   206 pontos num `<canvas>` ... 1002 ms  ← e que não é preciso perder nenhum
 *
 * Um canvas é um bitmap. Desenha-se uma vez; a partir daí compor é copiar.
 *
 * ── O QUE NÃO MUDA, E É O QUE PROTEGE A PRIMEIRA LEI ──
 * Os pontos são os mesmos, nas mesmas posições, com os mesmos tamanhos
 * APARENTES. A distinção face às estrelas de evidência continua a ser
 * geometria — nunca passam de 1,3px, não têm halo, não reagem a nada — e está
 * declarada no cabeçalho do `starfield.ts`. Trocar a primitiva de desenho não
 * pode tornar o fundo mais parecido com evidência, e não torna.
 *
 * ── O TIER GRÁFICO DEIXOU DE SER CSS ──
 * Antes, `lite` e `off` escondiam o `.us-sf-0` com um `display: none`. Com um
 * canvas não há elemento para esconder, por isso a decisão passa para o
 * desenho: a camada mais funda simplesmente não é pintada. O comportamento
 * observável é o mesmo — 114 pontos em vez de 206.
 */

import { useEffect, useRef } from 'react';
import { STARFIELD } from './starfield';

/** Onde o gradiente de cada ponto chega a transparente, em fração do raio.
 *  É o `transparent 62%` que os `radial-gradient` tinham — mantido ao número
 *  para o campo continuar a ler-se igual. */
const QUEDA = 0.62;

function pintar(cv: HTMLCanvasElement, w: number, h: number, dpr: number, tier: string) {
  /* A camada mais funda cai fora do tier `full` — era o antigo
     `html[data-sys-quality='lite'] .us-sf-0 { display: none }`. */
  const camadas = tier === 'full' ? STARFIELD : STARFIELD.slice(1);

  cv.width = Math.max(1, Math.round(w * dpr));
  cv.height = Math.max(1, Math.round(h * dpr));
  const g = cv.getContext('2d');
  if (!g) return;
  g.clearRect(0, 0, cv.width, cv.height);

  for (const camada of camadas) {
    for (const p of camada.points) {
      const x = (p.x / 100) * cv.width;
      const y = (p.y / 100) * cv.height;
      /* Meio pixel de dispositivo é o mínimo: abaixo disso o ponto não é um
         ponto ténue, é nada — e o campo existe precisamente para o céu não
         estar vazio. */
      const r = Math.max(0.5, p.size * dpr);
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(${p.rgb.split(' ').join(',')},${p.alpha})`);
      grad.addColorStop(QUEDA, `rgba(${p.rgb.split(' ').join(',')},0)`);
      grad.addColorStop(1, `rgba(${p.rgb.split(' ').join(',')},0)`);
      g.fillStyle = grad;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
  }
}

export default function FieldFar() {
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const host = cv.parentElement;
    if (!host) return;

    /* Um bitmap tem de ser redesenhado quando a caixa muda — mas NÃO a cada
       píxel de uma janela a ser arrastada. O rAF colapsa a rajada num desenho
       por frame, e o desenho só acontece se a dimensão mudou mesmo: sem essa
       guarda, o `ResizeObserver` disparado pelo próprio `canvas.width`
       realimentava-se. */
    let raf = 0;
    let lw = 0; let lh = 0; let ltier = '';
    const desenhar = () => {
      raf = 0;
      const r = host.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const tier = document.documentElement.dataset.sysQuality || 'full';
      const w = Math.round(r.width); const h = Math.round(r.height);
      if (!w || !h) return;
      if (w === lw && h === lh && tier === ltier) return;
      lw = w; lh = h; ltier = tier;
      pintar(cv, w, h, dpr, tier);
    };
    const agendar = () => { if (!raf) raf = requestAnimationFrame(desenhar); };

    desenhar();
    const ro = new ResizeObserver(agendar);
    ro.observe(host);
    /* O tier é decidido pelo `Atmosphere` e escrito na raiz. Sem isto, mudar de
       janela estreita para larga trocava a qualidade de tudo menos deste
       campo. */
    const mo = new MutationObserver(agendar);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-sys-quality'] });

    return () => { if (raf) cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); };
  }, []);

  return <canvas ref={cvRef} className="us-sf-cv" aria-hidden="true" />;
}
