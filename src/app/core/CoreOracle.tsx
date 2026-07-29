/* O bloco do Oráculo no Command Core — Missão 26 · Fase 6B.
 *
 * Slot próprio no registo de zonas, e não um pedaço do visor, porque a fronteira
 * Sistema/Oráculo é o ponto: o visor afirma factos, isto interpreta-os. Se
 * vivessem no mesmo bloco, a atribuição seria uma etiqueta em vez de uma
 * separação real.
 *
 * Fica ENTRE o visor e a fila: interpreta o que está em cima, antes de se
 * mostrar o que espera. Ler a interpretação depois da fila obrigaria a subir os
 * olhos outra vez.
 */

import { useStore } from '../../store/useStore.js';
import { readNextAction } from './next-action';
import { readOracleNotes } from '../oracle/oracleRead';
import OracleNotes from '../oracle/OracleNote';

export default function CoreOracle({ S }: { S: Record<string, any> }) {
  const report = useStore((s: { report: unknown }) => s.report);
  const radar = useStore((s: { radar: unknown[] }) => s.radar);

  // `readNextAction` é puro e barato — chamá-lo aqui e no visor dá exatamente o
  // mesmo resultado por construção (é determinístico). A alternativa seria
  // passar o objeto por prop através do registo de zonas, o que obrigaria a
  // fazer do registo um transportador de estado. Não vale a troca.
  const action = readNextAction({ S, report, radar });
  const notes = readOracleNotes({ S, action });

  return <OracleNotes notes={notes} />;
}
