/* MARCA DE DOMÍNIO — a assinatura congelada.
 * Missão 26 · Fase 7Z.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ORIGEM: S12, e é um extrato dentro de uma anti-referência.          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * S12 é um infográfico de HUD de ficção científica para rejeitar inteiro —
 * ciano, moldura, telemetria decorativa — menos uma coisa: mostra N componentes,
 * cada um com **ícone próprio**, ligados por linha-guia ao objeto central que
 * eles compõem. É exatamente a estrutura do interior do Núcleo, e apontou a
 * peça que lá faltava.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O ÍCONE DE UM DOMÍNIO É A ASSINATURA DELE, PARADA.                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Isto não é vocabulário novo. Cada domínio já tem uma assinatura de movimento
 * (`DomainSignature`) que diz o que ele é: Ofício alinha, Saber ramifica, Corpo
 * pulsa, Mente converge, Vínculos liga, Disciplina sincroniza. A marca é o
 * estado final dessa assinatura, reduzido a 24×24.
 *
 * A vantagem não é poupar trabalho — é **coerência**. Quem vir a assinatura no
 * céu e a marca no Núcleo reconhece a mesma ideia nos dois sítios, e a segunda
 * ensina a primeira. Inventar seis ícones novos daria seis símbolos a decorar em
 * vez de seis formas já aprendidas.
 *
 * É também a gramática 15 outra vez, aplicada à identidade e não ao estado: a
 * forma distingue antes da cor. Estas seis distinguem-se em cinzento, e é por
 * isso que nenhuma depende do \`--dom\` para se ler.
 */

interface Props {
  id: string;
  /** Cor do domínio. Tinge o traço; a forma sozinha já identifica. */
  color?: string;
  size?: number;
  /** Quando dados, a marca renderiza-se como `<svg>` ANINHADO dentro de outro
   *  SVG — que é o mecanismo próprio do formato para isto. A alternativa,
   *  `<foreignObject>`, mistura HTML dentro de SVG e traz problemas de escala e
   *  de recorte que não vale a pena herdar por um ícone de 24px. */
  x?: number;
  y?: number;
}

/* Cada marca é o gesto reduzido ao mínimo que ainda o diz. Traço só — um ícone
 * preenchido a 24px vira mancha, e a biblioteca inteira do projeto é de luz
 * sobre preto, onde a mancha é o inimigo. */
const MARCAS: Record<string, JSX.Element> = {
  // ALINHAMENTO — o que estava disperso passa a paralelo e regular.
  oficio: (
    <>
      <path d="M4 7 h16" /><path d="M4 12 h16" /><path d="M4 17 h16" />
      <path d="M7 4.5 v15" opacity="0.45" />
    </>
  ),
  // RAMIFICAÇÃO — um tronco que se divide, e volta a dividir-se.
  saber: (
    <>
      <path d="M12 21 v-6" />
      <path d="M12 15 L6 9" /><path d="M12 15 L18 9" />
      <path d="M6 9 L3.5 5" opacity="0.6" /><path d="M6 9 L8.5 5" opacity="0.6" />
      <path d="M18 9 L15.5 5" opacity="0.6" /><path d="M18 9 L20.5 5" opacity="0.6" />
    </>
  ),
  // PULSO — anéis a expandir a partir de um centro.
  corpo: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="12" cy="12" r="6.5" opacity="0.6" />
      <circle cx="12" cy="12" r="10.5" opacity="0.3" />
    </>
  ),
  // CONVERGÊNCIA — o disperso a chegar a um foco.
  mente: (
    <>
      <path d="M3 3 L10 10" /><path d="M21 3 L14 10" />
      <path d="M3 21 L10 14" /><path d="M21 21 L14 14" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  // LIGAÇÃO — dois corpos e o que os une; a linha vem depois deles.
  vinculos: (
    <>
      <circle cx="6" cy="8" r="2.6" /><circle cx="18" cy="16" r="2.6" />
      <path d="M8.2 9.4 L15.8 14.6" />
    </>
  ),
  // SINCRONIZAÇÃO — o mesmo gesto repetido, todos à mesma altura.
  disciplina: (
    <>
      <path d="M4 8 v8" /><path d="M9.3 8 v8" /><path d="M14.7 8 v8" /><path d="M20 8 v8" />
      <path d="M2.5 12 h19" opacity="0.35" />
    </>
  ),
};

export default function DomainMark({ id, color, size = 24, x, y }: Props) {
  const m = MARCAS[id];
  if (!m) return null;
  return (
    <svg
      className="dm"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      {...(x !== undefined ? { x } : {})}
      {...(y !== undefined ? { y } : {})}
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {m}
    </svg>
  );
}
