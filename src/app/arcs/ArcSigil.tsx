/* SIGILO DO ARCO — procedural, um por estação.
 * Missão 26 · Fase 7.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  UM SÓ DESENHO, QUATRO ARCOS. O sigilo é gerado do motivo — a cor e  ║
 * ║  a direção do fluxo — e não desenhado à mão para cada estação. Um    ║
 * ║  arco novo ganha sigilo sem ninguém abrir este ficheiro.             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ORIGEM: R15 (a convergência) e a gramática 1 — a energia varre do ambiente
 * para dentro. O sigilo é um núcleo com raios que APONTAM para ele, não que
 * saem dele. No `out` (verão) os raios são longos e abertos; no `in` (outono,
 * inverno) recolhem; no `up` (primavera) inclinam-se para cima.
 *
 * REJEITADO: o emblema de videojogo, o brasão, o contorno grosso, qualquer
 * coisa que pareça um crachá. Isto é uma marca de luz, não um logótipo.
 *
 * `progress` (0–1) preenche o anel exterior: com o arco a decorrer, o sigilo
 * mostra quanto já passou. Sem valor real, não há anel — a mesma lei do rank.
 */

interface Props {
  /** Cor principal do motivo. */
  accent: string;
  accentSoft: string;
  flow: 'out' | 'in' | 'up' | 'down';
  /** 0–1, ou null quando o arco ainda não começou. */
  progress?: number | null;
  size?: number;
  /** 0–1: quanto do sigilo já se desenhou. A cerimónia usa isto. */
  form?: number;
}

const RAYS = 12;

export default function ArcSigil({ accent, accentSoft, flow, progress = null, size = 132, form = 1 }: Props) {
  const t = Math.max(0, Math.min(1, form));
  // O comprimento e a inclinação dos raios são função do fluxo — é o que
  // distingue o verão da primavera sem um desenho novo.
  const len = flow === 'out' ? 26 : flow === 'up' ? 22 : 15;
  const tilt = flow === 'up' ? -14 : flow === 'down' ? 14 : 0;
  const R = 2 * Math.PI * 44;

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className="arc-sigil"
      role="img"
      aria-label="Sigilo do arco"
      style={{ ['--as-accent' as string]: accent, ['--as-soft' as string]: accentSoft }}
    >
      <defs>
        <radialGradient id="as-core">
          <stop offset="0" stopColor={accentSoft} stopOpacity="0.9" />
          <stop offset="0.55" stopColor={accent} stopOpacity="0.35" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Núcleo: o destino da energia. Cresce com `form` durante a cerimónia. */}
      <circle cx="60" cy="60" r={10 + 12 * t} fill="url(#as-core)" />
      <circle cx="60" cy="60" r={7 * t} fill={accentSoft} opacity={0.85 * t} />

      {/* Raios que APONTAM para dentro (R15). O `t` revela-os por ordem, o que
          dá à cerimónia uma formação em vez de um aparecimento. */}
      <g stroke={accent} strokeWidth="1.4" strokeLinecap="round" fill="none">
        {Array.from({ length: RAYS }, (_, i) => {
          const a = (i / RAYS) * Math.PI * 2 + (tilt * Math.PI) / 180;
          const shown = Math.max(0, Math.min(1, t * RAYS - i));
          const outer = 26 + len;
          const r1 = 26 + len * (1 - shown);
          return (
            <line
              key={i}
              x1={60 + Math.cos(a) * outer}
              y1={60 + Math.sin(a) * outer}
              x2={60 + Math.cos(a) * r1}
              y2={60 + Math.sin(a) * r1}
              opacity={0.25 + 0.6 * shown}
            />
          );
        })}
      </g>

      {/* Anel de progresso — só existe com valor real. */}
      <circle cx="60" cy="60" r="44" fill="none" stroke={accent} strokeWidth="1" opacity={0.18 * t} />
      {progress != null && (
        <circle
          cx="60" cy="60" r="44" fill="none"
          stroke={accentSoft} strokeWidth="2" strokeLinecap="round"
          strokeDasharray={R}
          strokeDashoffset={R * (1 - progress * t)}
          transform="rotate(-90 60 60)"
          opacity="0.9"
        />
      )}
    </svg>
  );
}
