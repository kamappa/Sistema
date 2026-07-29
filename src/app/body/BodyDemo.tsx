/* DEMONSTRAÇÕES — line art original, gerada de dados.
 * Missão 26 · Fase 7.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ZERO ASSETS EXTERNOS. Nenhum GIF, nenhum vídeo, nenhuma imagem de   ║
 * ║  terceiros. Quatro figuras em SVG, desenhadas aqui, animadas pelo    ║
 * ║  valor `amount` que vem das fases do exercício.                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * PORQUE SÃO ABSTRATAS. A regra da fase é clara — "não utilizar referências de
 * anime para demonstrar biomecânica" e "as demonstrações devem ser claras
 * antes de serem dramáticas". Uma silhueta sem rosto e sem género mostra a
 * direção, a amplitude e o ritmo, que é tudo o que um exercício precisa de
 * comunicar. Um desenho realista acrescentaria detalhe que distrai e, no caso
 * do pavimento pélvico, seria impróprio.
 *
 * O pavimento pélvico é representado por uma BACIA e uma REDE que eleva — um
 * diagrama, não um corpo. É a forma que as fontes clínicas usam, e é a única
 * que mostra "contrair e elevar" sem representar nada mais.
 *
 * REDUCED MOTION: a transição desaparece e a figura fica na posição da fase.
 * A informação é a POSIÇÃO, não o trajeto — quem não pode ver movimento
 * continua a ver a diferença entre contraído e relaxado.
 */

import type { Exercise } from './routines';

interface Props {
  figure: Exercise['figure'] | 'push' | 'pull' | 'legs' | 'core';
  /** 0 = repouso, 1 = fim do movimento. Vem da fase atual. */
  amount: number;
  /** Descrição textual equivalente — obrigatória, não opcional. Vai no
   *  `aria-label` do SVG, que é o que um leitor de ecrã anuncia. */
  label: string;
  /** A legenda VISÍVEL. Curta, porque o título do exercício já está ao lado:
   *  repetir "Encontrar o músculo" por baixo da figura dava dois títulos. */
  caption: string;
  size?: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function BodyDemo({ figure, amount, label, caption, size = 168 }: Props) {
  const t = Math.max(0, Math.min(1, amount));

  return (
    <figure className="bd" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={label}>
        <defs>
          <linearGradient id="bd-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        {figure === 'pelvis' && <Pelvis t={t} />}
        {figure === 'jaw' && <Jaw t={t} />}
        {figure === 'neck' && <Neck t={t} />}
        {figure === 'shoulder' && <Shoulder t={t} />}
        {figure === 'push' && <Push t={t} />}
        {figure === 'pull' && <Pull t={t} />}
        {figure === 'legs' && <Legs t={t} />}
        {figure === 'core' && <Core t={t} />}
      </svg>
      {/* O equivalente textual completo vive no `aria-label` do SVG. A legenda
          visível diz só a fase, para não duplicar o título que está ao lado. */}
      <figcaption className="bd-cap">{caption}</figcaption>
    </figure>
  );
}

/* ── Bacia e rede ──────────────────────────────────────────────────────
 * Diagrama: o arco exterior é a bacia; a curva interior é o pavimento. Ao
 * contrair, a curva sobe e encurta — que é exatamente o que "contrair e
 * elevar" quer dizer. As setas dizem a direção.
 */
function Pelvis({ t }: { t: number }) {
  const sag = lerp(96, 74, t);      // a rede sobe
  const width = lerp(30, 36, t);    // e recolhe para dentro
  return (
    <g fill="none" stroke="url(#bd-line)" strokeWidth="2" strokeLinecap="round">
      {/* bacia — estrutura fixa, para se ver o que se move contra o quê */}
      <path d="M28 46 C 28 78, 44 92, 60 96 C 76 92, 92 78, 92 46" opacity="0.4" />
      <line x1="24" y1="44" x2="96" y2="44" opacity="0.4" />
      {/* pavimento — o que se move */}
      <path
        className="bd-move"
        d={`M${60 - width} 62 Q 60 ${sag} ${60 + width} 62`}
        strokeWidth="2.6"
      />
      {/* direção da elevação */}
      <g className="bd-move" opacity={0.25 + t * 0.65}>
        <line x1="60" y1={sag - 4} x2="60" y2={sag - 16} />
        <path d={`M56 ${sag - 12} L60 ${sag - 18} L64 ${sag - 12}`} />
      </g>
    </g>
  );
}

/* ── Mandíbula ─────────────────────────────────────────────────────────
 * Perfil abstrato: uma curva para o crânio, um traço para a mandíbula que
 * roda em torno da articulação. Sem rosto, sem traços — o que importa é o
 * ângulo e o ponto de rotação.
 */
function Jaw({ t }: { t: number }) {
  const open = lerp(0, 17, t); // graus
  return (
    <g fill="none" stroke="url(#bd-line)" strokeWidth="2" strokeLinecap="round">
      <path d="M74 26 C 46 26, 34 46, 36 64 C 37 74, 44 78, 50 79" opacity="0.55" />
      {/* articulação — o pivô, marcado porque é onde o dedo pousa */}
      <circle cx="72" cy="62" r="3.2" opacity="0.9" />
      <g className="bd-move" style={{ transform: `rotate(${open}deg)`, transformOrigin: '72px 62px' }}>
        <path d="M72 62 L 52 80 C 58 86, 70 88, 78 84" strokeWidth="2.6" />
      </g>
      {/* língua no céu da boca: o ponto de partida de todos os exercícios */}
      <path d="M52 66 Q 60 63, 68 64" opacity={0.75} strokeWidth="1.6" />
    </g>
  );
}

/* ── Pescoço ───────────────────────────────────────────────────────────
 * Cabeça sobre uma coluna. Ao recolher o queixo a cabeça desloca-se para
 * trás — NÃO para baixo, que é o erro comum, e por isso o desenho move só em
 * X. A linha vertical fica como referência do alinhamento.
 */
function Neck({ t }: { t: number }) {
  const back = lerp(9, -2, t);
  return (
    <g fill="none" stroke="url(#bd-line)" strokeWidth="2" strokeLinecap="round">
      {/* eixo de referência: sem ele não se vê que a cabeça estava à frente */}
      <line x1="60" y1="18" x2="60" y2="104" opacity="0.22" strokeDasharray="3 5" />
      <g className="bd-move" style={{ transform: `translateX(${back}px)` }}>
        <circle cx="60" cy="40" r="17" strokeWidth="2.4" />
        <path d="M60 57 L 60 72" />
      </g>
      {/* tronco fixo */}
      <path d="M40 96 C 46 78, 74 78, 80 96" opacity="0.55" />
      <path d="M60 72 L 60 84" opacity="0.55" />
    </g>
  );
}

/* ── Calistenia ────────────────────────────────────────────────────────
 * Missão 26 · Fase 7, segunda passagem. Quatro silhuetas, uma por linha de
 * progressão. A MESMA gramática das outras: sem rosto, sem género, sem
 * detalhe anatómico. O que cada uma mostra é a direção do movimento, a
 * amplitude e o eixo que NÃO se deve mover — que é onde a técnica se perde.
 *
 * A linha tracejada é o alinhamento a manter. É a parte informativa do
 * desenho: quase todos os erros de calistenia são o corpo a deixar de ser uma
 * linha reta.
 */

/* Empurrar — o tronco desce e sobe; a anca não cai. */
function Push({ t }: { t: number }) {
  const down = lerp(0, 16, t);
  return (
    <g fill="none" stroke="url(#bd-line)" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="96" x2="102" y2="96" opacity="0.3" />
      <g className="bd-move" style={{ transform: `translateY(${down}px)` }}>
        {/* corpo em prancha: cabeça, tronco, pernas numa só linha */}
        <circle cx="34" cy="44" r="8" strokeWidth="2.2" />
        <line x1="42" y1="48" x2="92" y2="66" strokeWidth="2.6" />
        <line x1="92" y1="66" x2="104" y2="88" />
      </g>
      {/* braço: o pivô que produz o movimento */}
      <line className="bd-move" x1="40" y1={52 + down} x2="40" y2="94" strokeWidth="2.2" />
      {/* alinhamento a manter — o erro é a anca cair abaixo desta linha */}
      <line x1="30" y1="42" x2="106" y2="90" opacity="0.22" strokeDasharray="4 5" />
    </g>
  );
}

/* Puxar — o corpo sobe na direção da barra; os ombros descem primeiro. */
function Pull({ t }: { t: number }) {
  const up = lerp(0, -20, t);
  return (
    <g fill="none" stroke="url(#bd-line)" strokeWidth="2" strokeLinecap="round">
      {/* barra fixa: a referência contra a qual o corpo se move */}
      <line x1="24" y1="24" x2="96" y2="24" strokeWidth="2.6" opacity="0.6" />
      <g className="bd-move" style={{ transform: `translateY(${up}px)` }}>
        <line x1="46" y1="26" x2="46" y2="52" />
        <line x1="74" y1="26" x2="74" y2="52" />
        <circle cx="60" cy="58" r="9" strokeWidth="2.2" />
        <line x1="60" y1="67" x2="60" y2="96" strokeWidth="2.6" />
      </g>
      {/* direção: para cima é o sentido do esforço (gramática 9) */}
      <g className="bd-move" opacity={0.2 + t * 0.6}>
        <path d="M56 42 L60 34 L64 42" />
      </g>
    </g>
  );
}

/* Pernas — a anca desce para trás; o joelho não passa a linha do pé. */
function Legs({ t }: { t: number }) {
  const sit = lerp(0, 20, t);
  const back = lerp(0, 10, t);
  return (
    <g fill="none" stroke="url(#bd-line)" strokeWidth="2" strokeLinecap="round">
      <line x1="24" y1="102" x2="96" y2="102" opacity="0.3" />
      {/* limite do joelho: a referência que evita o erro mais comum */}
      <line x1="72" y1="102" x2="72" y2="58" opacity="0.22" strokeDasharray="4 5" />
      <g className="bd-move" style={{ transform: `translate(${-back}px, ${sit}px)` }}>
        <circle cx="60" cy="34" r="8" strokeWidth="2.2" />
        <line x1="60" y1="42" x2="60" y2="66" strokeWidth="2.6" />
      </g>
      {/* pernas: coxa e canela articulam com a descida */}
      <line className="bd-move" x1={60 - back} y1={66 + sit} x2="70" y2={78 + sit * 0.2} strokeWidth="2.4" />
      <line className="bd-move" x1="70" y1={78 + sit * 0.2} x2="70" y2="102" strokeWidth="2.4" />
    </g>
  );
}

/* Core — a lombar mantém-se colada; o que se move são as pernas. */
function Core({ t }: { t: number }) {
  const lift = lerp(0, -26, t);
  return (
    <g fill="none" stroke="url(#bd-line)" strokeWidth="2" strokeLinecap="round">
      <line x1="16" y1="86" x2="104" y2="86" opacity="0.3" />
      <circle cx="30" cy="76" r="8" strokeWidth="2.2" />
      {/* tronco colado ao chão: a referência que define o exercício */}
      <line x1="38" y1="80" x2="64" y2="84" strokeWidth="2.6" />
      <g className="bd-move" style={{ transform: `translateY(${lift}px)`, transformOrigin: '64px 84px' }}>
        <line x1="64" y1="84" x2="98" y2="84" strokeWidth="2.4" />
      </g>
      <line x1="16" y1="84" x2="66" y2="88" opacity="0.22" strokeDasharray="4 5" />
    </g>
  );
}

/* ── Omoplatas ─────────────────────────────────────────────────────────
 * Vista de trás: duas formas que convergem para a linha média. Os ombros não
 * sobem — e o desenho não os deixa subir, porque o movimento é só em X.
 */
function Shoulder({ t }: { t: number }) {
  const dx = lerp(0, 7, t);
  return (
    <g fill="none" stroke="url(#bd-line)" strokeWidth="2" strokeLinecap="round">
      <line x1="60" y1="24" x2="60" y2="98" opacity="0.28" strokeDasharray="3 5" />
      <g className="bd-move" style={{ transform: `translateX(${dx}px)` }}>
        <path d="M46 42 L 34 56 L 44 78 L 52 56 Z" strokeWidth="2.4" />
      </g>
      <g className="bd-move" style={{ transform: `translateX(${-dx}px)` }}>
        <path d="M74 42 L 86 56 L 76 78 L 68 56 Z" strokeWidth="2.4" />
      </g>
      <path d="M30 34 Q 60 26, 90 34" opacity="0.5" />
    </g>
  );
}
