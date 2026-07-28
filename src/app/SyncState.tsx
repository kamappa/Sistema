/* Estado de sincronização — Missão 26 · Fase I.
 *
 * PORQUE EXISTE: o store mantém `sync` desde a Missão 25 — 'local' | 'saving' |
 * 'ok' | 'err' — e a shell React NUNCA o mostrou. Uma gravação podia falhar e o
 * Sistema ficava calado.
 *
 * Isso não é uma falha de estilo, é uma falha de verdade: a primeira lei diz
 * que nada exibido pode contradizer o estado guardado, e um ecrã que mostra
 * trabalho que não foi gravado está a fazer exatamente isso.
 *
 * GRAMÁTICA (origem R17, REFERENCE-MAP): a contração comunica "em curso" e a
 * passagem de difuso a discreto comunica "terminado". Aqui:
 *   saving → o ponto contrai, sem repouso, e não diz que acabou;
 *   ok     → assenta num ponto nítido e cala-se;
 *   err    → não se cala. É o único estado que fica a pedir atenção.
 *
 * O 'local' não é um erro nem um aviso: é um facto sobre onde os dados vivem.
 * Quem escolhe usar sem conta merece sabê-lo, não ser repreendido por isso.
 */

import { useStore } from '../store/useStore.js';
import './sync-state.css';

type Sync = 'local' | 'saving' | 'ok' | 'err';

const LABEL: Record<Sync, string> = {
  local: 'só neste dispositivo',
  saving: 'a guardar',
  ok: 'guardado',
  err: 'falhou ao guardar',
};

export default function SyncState() {
  const sync = useStore((s: { sync: Sync }) => s.sync) ?? 'local';

  // O 'ok' é o estado normal e não precisa de anunciar-se a toda a hora: o que
  // interessa saber é quando NÃO está guardado. Fica presente para leitores de
  // ecrã e invisível para quem vê.
  return (
    <span className="sys-sync" data-sync={sync} title={LABEL[sync]}>
      <span className="sys-sync-dot" aria-hidden="true" />
      <span className="sys-sync-label">{LABEL[sync]}</span>
    </span>
  );
}
