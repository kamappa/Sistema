/* REFLEXÃO — o Observatório Interior.
 * Missão 26 · Fase 8.
 *
 * Os blocos vivem todos neste ficheiro porque partilham o mesmo read model e
 * a mesma língua visual; separá-los em seis ficheiros daria seis importações
 * para ler a mesma leitura duas vezes.
 *
 * ORIGEM VISUAL: R26 (trilho de leituras + visor) para as leituras
 * emparelhadas, e a gramática 3 — presença é ciclo, evento é arco. Esta zona é
 * toda presença: nada aqui pisca, nada aqui celebra. O único movimento é o do
 * sigilo do Oráculo, que já é função de estado real.
 *
 * REJEITADO: a grelha de cartões das zonas operacionais (era a queixa do
 * Daniel — "a grelha e o material são praticamente iguais"), os interruptores
 * vermelhos e a palavra "inimigos".
 */

import { useStore } from '../../store/useStore.js';
import { readReflection, readReflectionOracle, type Reading } from './reflectionRead';
import OracleSigil from '../oracle/OracleSigil';
import './reflection.css';

/* ── Estado presente + debrief ──────────────────────────────────────── */
export function ReflectionNow({ S }: { S: Record<string, any> }) {
  const r = readReflection(S);
  if (!r) return null;

  return (
    <section className="rf-now panel" aria-label="Estado presente e debrief do dia">
      <h2 className="rf-h">Estado presente</h2>
      <dl className="rf-gauges">
        {r.present.map((p) => (
          <div key={p.key} className="rf-gauge" data-tone={p.tone}>
            <dt>{p.label}</dt>
            <dd>{p.value}</dd>
            {/* Os ingredientes à vista. É o que separa uma medição de uma
                opinião com ar de medição. */}
            {p.from && <p className="rf-from">{p.from}</p>}
          </div>
        ))}
      </dl>
      <p className="rf-note">{r.presentNote}</p>

      <h2 className="rf-h rf-h-sep">Debrief do dia</h2>
      {r.debriefEmpty ? (
        <p className="rf-empty">
          O dia ainda não deixou registo aqui. Isso não é um juízo — é só cedo, ou foi
          um dia que não se mede nestes números.
        </p>
      ) : null}
      {/* Trilho e não lista: seis linhas empilhadas custavam 200px e empurravam
          os Padrões — que é onde se AGE — para fora do primeiro ecrã. Em duas
          colunas cabem os seis sem esconder nenhum. */}
      <dl className="rf-debrief">
        {r.debrief.map((x) => (
          <div key={x.key} data-tone={x.tone}>
            <dt>{x.label}</dt>
            <dd>{x.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── Padrões internos ───────────────────────────────────────────────── */
export function ReflectionPatterns({ S }: { S: Record<string, any> }) {
  const toggleDebuff = useStore((s: any) => s.toggleDebuff);
  const applyAntidote = useStore((s: any) => s.applyAntidote);
  const r = readReflection(S);
  if (!r) return null;

  return (
    <section className="rf-patterns panel" aria-label="Padrões internos">
      <h2 className="rf-h">Padrões internos</h2>
      <p className="rf-lede">
        Marca o que reparaste em ti hoje. O Sistema não avalia isto — regista, para
        que um padrão que volta deixe de parecer acaso.
      </p>

      <ul className="rf-plist">
        {r.patterns.map((p) => (
          <li key={p.id} className="rf-p" data-noted={p.noted ? 'true' : 'false'}>
            <div className="rf-p-head">
              {/* Um checkbox real: era um `div` com onClick, invisível ao
                  teclado e sem estado para um leitor de ecrã. */}
              <label className="rf-p-mark">
                <input
                  type="checkbox"
                  checked={p.noted}
                  onChange={() => toggleDebuff(p.id)}
                />
                <span className="rf-p-name">{p.name}</span>
              </label>
              <span className="rf-p-read">
                {p.noted ? 'notado hoje' : 'não notado'}
              </span>
            </div>

            <p className="rf-p-ef">{p.effect}</p>

            {/* O TEMPO é o que transforma quatro interruptores num padrão. */}
            <div className="rf-p-time">
              <span>
                {p.daysSinceAction === null
                  ? 'ainda não agiste sobre isto'
                  : p.daysSinceAction === 0
                    ? 'agiste hoje'
                    : `última ação há ${p.daysSinceAction} ${p.daysSinceAction === 1 ? 'dia' : 'dias'}`}
              </span>
              {p.timesInLog > 0 && (
                <span title="O registo guarda as últimas 14 entradas — esta contagem não vai mais atrás.">
                  {p.timesInLog}× no registo recente
                </span>
              )}
            </div>

            {p.noted && (
              <div className="rf-p-act">
                <p className="rf-p-an">{p.antidote}</p>
                <button className="mini" type="button" onClick={() => applyAntidote(p.id)}>
                  Agi sobre isto (+10 Disciplina)
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Memória, compromissos, aprendizagens e o Oráculo ───────────────── */
export function ReflectionMemory({ S }: { S: Record<string, any> }) {
  const r = readReflection(S);
  if (!r) return null;
  const notes = readReflectionOracle(S, r);

  return (
    <section className="rf-mem panel" aria-label="Memória, compromissos e aprendizagens">
      {notes.length > 0 && (
        <div className="rf-oracle">
          <h2 className="rf-oracle-h">
            <OracleSigil signals={notes.length} alert={notes.some((n) => n.tone === 'alert')} />
            <span>Oráculo</span>
          </h2>
          {notes.map((n) => (
            <p key={n.key} className="rf-oracle-t" data-tone={n.tone} title={n.because}>
              {n.text}
            </p>
          ))}
        </div>
      )}

      {r.memory && (
        <>
          <h2 className="rf-h">Memória</h2>
          {/* A Living Memory (M15) existia e vivia numa linha debaixo de uma
              citação, no Núcleo. Este é o sítio dela. */}
          <p className="rf-memory">{r.memory}</p>
        </>
      )}

      {r.recent.length > 0 && (
        <>
          <h2 className="rf-h rf-h-sep">Registo recente</h2>
          <ul className="rf-log">
            {r.recent.map((e, i) => (
              <li key={i}>
                <span className="rf-log-t">{e.text}</span>
                <span className="rf-log-w">{e.when}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {r.commitments.length > 0 && (
        <>
          <h2 className="rf-h rf-h-sep">Decisões e compromissos</h2>
          <Rows rows={r.commitments} />
        </>
      )}

      {r.learnings.length > 0 && (
        <>
          <h2 className="rf-h rf-h-sep">Aprendizagens</h2>
          <Rows rows={r.learnings} />
        </>
      )}
    </section>
  );
}

function Rows({ rows }: { rows: Reading[] }) {
  return (
    <ul className="rf-rows">
      {rows.map((x) => (
        <li key={x.key} data-tone={x.tone}>
          <span className="rf-row-l">{x.label}</span>
          <span className="rf-row-v">{x.value}</span>
          {x.from && <span className="rf-row-f">{x.from}</span>}
        </li>
      ))}
    </ul>
  );
}
