/* A linha de leitura do Command Core — forma partilhada.
 * Missão 26 · Fase 5.
 *
 * ORIGEM: R26 — o trilho de leituras emparelhadas. Rótulo à esquerda, medida à
 * direita, separadas por espaço e um filete. Nunca por caixas.
 *
 * Vive em ficheiro próprio porque a fila (coluna da ação) e o horizonte (coluna
 * do estado) usam a MESMA linha. Duas cópias divergiriam à primeira correção, e
 * a coerência entre as duas colunas é metade do que faz isto ler-se como um
 * instrumento em vez de dois painéis encostados.
 */

export interface Row {
  key: string;
  label: string;
  /** A medida, alinhada à direita. Prazo, data, lista curta. */
  read?: string;
  /** Cor do domínio, no filete. Ausente = costura neutra. */
  color?: string;
  late?: boolean;
  /** Linha de contagem ("mais 3 missões abertas") — recua, não é um item. */
  quiet?: boolean;
}

export function Block({ name, rows }: { name: string; rows: Row[] }) {
  return (
    <div className="cc-block">
      <h3 className="cc-block-h">{name}</h3>
      <ul className="cc-rows">
        {rows.map((r) => (
          <li
            key={r.key}
            className="cc-row"
            data-late={r.late ? 'true' : undefined}
            data-quiet={r.quiet ? 'true' : undefined}
            style={r.color ? ({ '--cc-area': r.color } as React.CSSProperties) : undefined}
          >
            <span className="cc-row-t">{r.label}</span>
            {r.read && <span className="cc-row-r">{r.read}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
