/* SIGILO DE CONQUISTA — paramétrico, gerado do id.
 * Missão 26 · Fase 6C.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  NADA É GERADO EM RUNTIME POR UM MODELO, e nada vem de fora. Cada    ║
 * ║  sigilo é SVG desenhado a partir de um hash determinístico do id da  ║
 * ║  conquista: o mesmo id dá sempre o mesmo sigilo, hoje e daqui a um   ║
 * ║  ano.                                                                ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O QUE NÃO FAÇO, e é uma omissão deliberada: classificar a conquista por
 * domínio. O `ACH` do domínio não guarda domínio nenhum — só id, ícone, nome,
 * mensagem e condição. Inferir "isto é Corpo" a partir do nome seria eu a
 * inventar uma taxonomia e a apresentá-la como se fosse dado. Quando o domínio
 * tiver esse campo, o motivo passa a vir dele; até lá, a variação vem do id.
 *
 * A FORMA diz o estado, não a raridade: bloqueado é o contorno da mesma forma,
 * a 30% — a conquista existe e vê-se o caminho. Desbloqueado ganha matéria.
 * Não há ícones diferentes para "raro" porque o domínio não guarda raridade.
 */

/** FNV-1a. Determinístico, estável entre sessões e independente de ordem. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

interface Props {
  id: string;
  unlocked: boolean;
  size?: number;
  /** Cor do preenchimento quando desbloqueado. Ausente = ouro do Sistema. */
  color?: string;
  title?: string;
}

export default function AchievementSigil({ id, unlocked, size = 40, color = '#fbbf24', title }: Props) {
  const h = hash(id);
  // Três eixos de variação, todos derivados do mesmo hash: número de pontas,
  // rotação e se o núcleo é cheio ou anelado. 5×8×2 = 80 combinações — chegam
  // para o conjunto de conquistas existente sem duas iguais por acidente.
  const points = 3 + (h % 5);          // 3 a 7 pontas
  const spin = (h >> 3) % 8;           // 8 rotações
  const ringed = ((h >> 6) & 1) === 1;
  const inner = 0.42 + (((h >> 7) % 5) * 0.06); // reentrância da estrela

  const R = 18;
  const cx = 24, cy = 24;
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 === 0 ? R : R * inner;
    const a = (-Math.PI / 2) + (i * Math.PI) / points + (spin * Math.PI) / (points * 8);
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(2)},${(cy + Math.sin(a) * rr).toFixed(2)}`);
  }

  return (
    <svg
      viewBox="0 0 48 48" width={size} height={size}
      className="ach-sigil" data-unlocked={unlocked ? 'true' : 'false'}
      role="img" aria-label={title ? `${title} — ${unlocked ? 'desbloqueada' : 'bloqueada'}` : undefined}
    >
      <polygon
        points={pts.join(' ')}
        fill={unlocked ? color : 'none'}
        fillOpacity={unlocked ? 0.18 : 0}
        stroke={unlocked ? color : 'currentColor'}
        strokeWidth={unlocked ? 1.6 : 1.1}
        strokeLinejoin="round"
        opacity={unlocked ? 1 : 0.34}
      />
      {ringed ? (
        <circle cx={cx} cy={cy} r="5" fill="none" stroke={unlocked ? color : 'currentColor'}
          strokeWidth="1.4" opacity={unlocked ? 0.9 : 0.3} />
      ) : (
        <circle cx={cx} cy={cy} r="3.4" fill={unlocked ? color : 'currentColor'}
          opacity={unlocked ? 0.95 : 0.28} />
      )}
    </svg>
  );
}
