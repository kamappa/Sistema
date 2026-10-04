/* ASSINATURA DE DOMÍNIO — o que cada domínio faz quando desperta.
 * Missão 26 · Fase 6C, terceira passagem.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  "Os domínios parecem etiquetas sobre o fundo." Parecem, porque      ║
 * ║  todos reagiam da mesma maneira: acender.                            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Seis domínios que se distinguem só pela cor e pelo nome são seis etiquetas.
 * Um domínio tem identidade quando SE COMPORTA como aquilo que é — e o
 * comportamento diz-se em movimento, não em legenda:
 *
 *   OFÍCIO      linhas dispersas ALINHAM-SE numa estrutura precisa
 *   SABER       um ponto RAMIFICA-SE e as ramificações ligam-se
 *   CORPO       um PULSO expande-se, como impacto ou batimento
 *   MENTE       ondas desordenadas CONVERGEM num foco
 *   VÍNCULOS    pontos isolados APROXIMAM-SE e estabelecem ligação
 *   DISCIPLINA  partículas instáveis entram em RITMO
 *
 * Isto não é ornamento por domínio. É a mesma informação que o nome dá, dita
 * numa segunda linguagem — e uma pessoa que use o Sistema todos os dias passa
 * a reconhecer o domínio pelo gesto antes de ler a palavra.
 *
 * O componente só existe enquanto o domínio está aceso: seis assinaturas a
 * correr ao mesmo tempo seriam seis ruídos, e a regra é um movimento dominante
 * de cada vez. Cada uma corre UMA vez e assenta — despertar é um arco, não um
 * ciclo (gramática 3).
 *
 * DETERMINISMO: as posições vêm de aritmética sobre o índice, nunca de
 * `Math.random()`. A mesma assinatura tem sempre a mesma forma; se mudasse a
 * cada hover, deixava de ser a assinatura DAQUELE domínio.
 *
 * REDUCED MOTION: o CSS suprime o movimento e deixa o estado final desenhado.
 * A forma é informação — a estrutura de Ofício e a ramificação de Saber
 * continuam a distinguir-se paradas.
 */

const V = 240;   // viewBox; o centro é (120, 120)
const C = 120;

interface Props {
  id: string;
  color: string;
  /** O nível do domínio densifica a assinatura: um domínio maduro tem mais
   *  matéria a responder. É o único parâmetro que vem de dados reais. */
  level: number;
}

export default function DomainSignature({ id, color, level }: Props) {
  const n = Math.min(14, 6 + Math.floor(level / 3));
  const body = SIGS[id] ? SIGS[id](n) : null;
  if (!body) return null;
  return (
    <svg
      className="us-sig"
      data-sig={id}
      viewBox={`0 0 ${V} ${V}`}
      style={{ ['--dom' as string]: color }}
      aria-hidden="true"
    >
      {body}
    </svg>
  );
}

/** Espalha `n` pontos por um anel, com desvio determinístico. */
const ring = (n: number, r: number, jitter = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const j = jitter ? (((i * 2654435761) % 1000) / 1000 - 0.5) * jitter : 0;
    return { i, a, x: C + Math.cos(a) * (r + j), y: C + Math.sin(a) * (r + j) };
  });

const SIGS: Record<string, (n: number) => JSX.Element> = {
  /* OFÍCIO — ALINHAMENTO.
     Segmentos com ângulos ao acaso rodam até ficarem tangentes ao anel. O que
     era disperso passa a ser estrutura, e é isso que uma carreira é. */
  oficio: (n) => (
    <g className="sig-g" stroke="var(--dom)" fill="none" strokeLinecap="round">
      {ring(n, 62, 10).map((p) => {
        const off = (((p.i * 7919) % 1000) / 1000 - 0.5) * 90;
        return (
          <line
            key={p.i}
            className="sig-seg"
            x1={p.x - 9} y1={p.y} x2={p.x + 9} y2={p.y}
            strokeWidth="1.5"
            style={{
              ['--from' as string]: off.toFixed(1) + 'deg',
              ['--to' as string]: ((p.a * 180) / Math.PI + 90).toFixed(1) + 'deg',
              ['--o' as string]: `${p.x}px ${p.y}px`,
              ['--i' as string]: p.i,
            }}
          />
        );
      })}
      <circle className="sig-frame" cx={C} cy={C} r="62" strokeWidth="0.8" opacity="0.5" />
    </g>
  ),

  /* SABER — RAMIFICAÇÃO.
     Do centro saem troncos; de cada tronco saem dois ramos, mais tarde. É o
     desenho de conhecimento a gerar conhecimento. */
  saber: (n) => (
    <g className="sig-g" stroke="var(--dom)" fill="none" strokeLinecap="round">
      {ring(Math.max(4, Math.round(n / 2)), 46).map((p) => (
        <g key={p.i}>
          <line className="sig-branch" x1={C} y1={C} x2={p.x} y2={p.y} strokeWidth="1.3"
                style={{ ['--i' as string]: p.i }} />
          {[-0.42, 0.42].map((d, k) => (
            <line
              key={k}
              className="sig-twig"
              x1={p.x} y1={p.y}
              x2={C + Math.cos(p.a + d) * 78} y2={C + Math.sin(p.a + d) * 78}
              strokeWidth="0.9"
              style={{ ['--i' as string]: p.i * 2 + k }}
            />
          ))}
        </g>
      ))}
    </g>
  ),

  /* CORPO — PULSO.
     Três anéis que expandem em série a partir do centro, como um batimento.
     Nada de partículas: um corpo responde com impulso, não com brilho. */
  corpo: () => (
    <g className="sig-g" stroke="var(--dom)" fill="none">
      {[0, 1, 2].map((i) => (
        <circle key={i} className="sig-pulse" cx={C} cy={C} r="30" strokeWidth={2 - i * 0.5}
                style={{ ['--i' as string]: i }} />
      ))}
    </g>
  ),

  /* MENTE — CONVERGÊNCIA.
     Traços dispersos e desalinhados deslocam-se para o centro e param lá. O
     oposto exato do pulso de Corpo, e é de propósito: são os dois domínios que
     mais facilmente se confundiriam. */
  mente: (n) => (
    <g className="sig-g" stroke="var(--dom)" fill="none" strokeLinecap="round">
      {ring(n, 84, 22).map((p) => (
        <line
          key={p.i}
          className="sig-conv"
          x1={p.x} y1={p.y}
          x2={C + Math.cos(p.a) * 22} y2={C + Math.sin(p.a) * 22}
          strokeWidth="1"
          style={{ ['--i' as string]: p.i }}
        />
      ))}
      <circle className="sig-focus" cx={C} cy={C} r="5" fill="var(--dom)" stroke="none" />
    </g>
  ),

  /* VÍNCULOS — LIGAÇÃO.
     Pontos isolados aproximam-se e só DEPOIS aparece a linha entre eles. A
     ordem importa: a ligação é consequência da aproximação, não o contrário. */
  vinculos: (n) => {
    const pts = ring(Math.max(5, Math.round(n * 0.7)), 66, 16);
    return (
      <g className="sig-g">
        <g stroke="var(--dom)" fill="none" strokeWidth="0.8">
          {pts.map((p, k) => {
            const q = pts[(k + 1) % pts.length];
            return (
              <line key={'l' + p.i} className="sig-link" x1={p.x} y1={p.y} x2={q.x} y2={q.y}
                    style={{ ['--i' as string]: p.i }} />
            );
          })}
        </g>
        <g fill="var(--dom)">
          {pts.map((p) => (
            <circle key={'p' + p.i} className="sig-node" cx={p.x} cy={p.y} r="2.6"
                    style={{ ['--i' as string]: p.i,
                             ['--fx' as string]: ((p.x - C) * 0.5).toFixed(1) + 'px',
                             ['--fy' as string]: ((p.y - C) * 0.5).toFixed(1) + 'px' }} />
          ))}
        </g>
      </g>
    );
  },

  /* DISCIPLINA — SINCRONIZAÇÃO.
     Barras com fases desencontradas convergem para o mesmo ritmo e para a
     mesma altura. Disciplina não é intensidade; é o mesmo gesto repetido. */
  disciplina: (n) => (
    <g className="sig-g" stroke="var(--dom)" fill="none" strokeLinecap="round">
      {ring(Math.max(8, n), 70).map((p) => (
        <line
          key={p.i}
          className="sig-tick"
          x1={C + Math.cos(p.a) * 56} y1={C + Math.sin(p.a) * 56}
          x2={C + Math.cos(p.a) * 78} y2={C + Math.sin(p.a) * 78}
          strokeWidth="1.4"
          style={{
            ['--i' as string]: p.i,
            // A fase inicial é desencontrada de propósito; o alinhamento é a
            // história que a assinatura conta.
            ['--phase' as string]: (((p.i * 7919) % 1000) / 1000).toFixed(3) + 's',
          }}
        />
      ))}
    </g>
  ),
};
