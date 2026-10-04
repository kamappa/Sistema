/* TREINO — sessão guiada de calistenia.
 * Missão 26 · Fase 7, segunda passagem.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A LÓGICA DE PROGRESSÃO NÃO É TOCADA. Esta é uma casca de registo    ║
 * ║  que no fim chama `finishTraining` com exactamente a mesma forma que ║
 * ║  o painel antigo envia: `{ lines: { id: { reps, feel } }, kegel,     ║
 * ║  extra, notes }`. Passos, alvos e XP continuam a ser do domínio.     ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O QUE O DANIEL APONTOU, e o que cada coisa passou a ser:
 *
 *   "Passo 1/8 repete-se em vários exercícios, mas não existe um progresso
 *    global da sessão" → três contagens distintas: exercício X de Y, série
 *    X de Y, e o passo da progressão aparece UMA vez, no exercício aberto.
 *
 *   "o seletor OK não explica se representa dificuldade, execução, dor ou
 *    qualidade" → rótulos que dizem o que são. E o mapeamento para os três
 *    valores do domínio está escrito em baixo, à vista.
 *
 *   "melhor série é vago e obriga a introdução manual sem contexto" → o campo
 *    diz a unidade do exercício (repetições ou segundos) e mostra o alvo e o
 *    último resultado.
 *
 *   "não existem demonstração, temporizador, descanso, ritmo" → cada exercício
 *    tem silhueta animada, e o descanso entre séries tem relógio.
 *
 *   "cada exercício parece um formulário independente" → é um fluxo com
 *    cabeçalho persistente.
 *
 *   "Concluir treino surge sem ficar claro se todos os passos foram
 *    registados" → o resumo final mostra linha a linha o que vai ser gravado,
 *    e o que fica por registar diz-se por extenso.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  DOR NÃO PROMOVE. "dor/desconforto" e "demasiado difícil" mapeiam    ║
 * ║  para `d`, e o domínio já recusa avançar de passo com `feel === 'd'` ║
 * ║  (useStore:finishTraining). Não é uma regra nova — é usar a que      ║
 * ║  existe, com um rótulo que diz a verdade.                            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore.js';
import { TLINES, PROG as PROG_ } from '../../state/config.js';

/* O `config.js` não tem tipos e o TS infere `PROG` com chaves literais;
 * indexá-lo com o id da linha (que vem de `TLINES`, também sem tipos) dá erro
 * de índice. Um alias tipado resolve sem tocar no domínio nem inventar um
 * `.d.ts` para um ficheiro que a Missão 25 deixou deliberadamente em JS.
 *
 * `t` é obrigatório nas quatro linhas de calistenia e ausente no kegel — esta
 * sessão só percorre `TLINES`, por isso `t` existe sempre aqui. O `?? 0` nos
 * sítios de uso é a guarda que o torna verdade para o compilador também. */
const PROG = PROG_ as Record<string, { n: string; t?: number; cyc?: number }[]>;
import BodyDemo from './BodyDemo';

/* Os rótulos que substituem "Fácil / OK / Difícil".
 * `feel` é o valor que o domínio aceita; `advance` diz se aquele resultado
 * deixa a progressão subir — e é isso que torna o rótulo honesto. */
const RESULTS = [
  { id: 'easy', label: 'Demasiado fácil', help: 'Sobrou muito no fim', feel: 'f' as const },
  { id: 'ok', label: 'Adequado', help: 'Últimas repetições difíceis, técnica limpa', feel: 'ok' as const },
  { id: 'hard', label: 'Demasiado difícil', help: 'Técnica partiu-se antes do alvo', feel: 'd' as const },
  { id: 'stopped', label: 'Interrompido', help: 'Parei por outro motivo', feel: 'd' as const },
  { id: 'pain', label: 'Dor ou desconforto', help: 'Parei por dor — o passo não sobe', feel: 'd' as const },
];

/* Séries por exercício. O alvo do domínio é "3×N" (`trl-t` do painel antigo),
 * por isso três é o que o Sistema já dizia — não é um número novo. */
const SETS = 3;
const REST_SECS = 90;

type LineState = { reps: string; result: string; sets: string[] };

const SEC_EXERCISES = ['Dead hang (segundos)', 'Prancha (segundos)', 'Hollow hold (segundos)'];
const unitOf = (name: string) => (SEC_EXERCISES.some((s) => name.startsWith(s.split(' (')[0])) ? 'segundos' : 'repetições');

export default function TrainingSession({ S, onClose }: { S: Record<string, any>; onClose: () => void }) {
  const finishTraining = useStore((s: any) => s.finishTraining);

  const [i, setI] = useState(0);          // exercício atual
  const [set, setSet] = useState(0);      // série atual
  const [resting, setResting] = useState(false);
  const [rest, setRest] = useState(REST_SECS);
  const [phase, setPhase] = useState(0);  // 0 = posição inicial, 1 = fim do movimento
  const [done, setDone] = useState(false);
  const [notes, setNotes] = useState('');
  const [extra, setExtra] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const [lines, setLines] = useState<Record<string, LineState>>(() =>
    Object.fromEntries(TLINES.map((L: any) => [L.id, { reps: '', result: 'ok', sets: [] }]))
  );

  const L = TLINES[i] as any;
  const idx = S.training.prog[L.id];
  const st = PROG[L.id][idx];
  const unit = unitOf(st.n);
  const last = [...(S.training.sessions ?? [])].reverse().find((s: any) => s.lines?.[L.id]);

  /* O ritmo da demonstração. Um ciclo lento e contínuo — é a única animação
     ambiente desta superfície, e pára em reduced motion pelo `--sys-motion-scale`
     que a transição do BodyDemo multiplica. */
  useEffect(() => {
    const t = window.setInterval(() => setPhase((p) => (p === 0 ? 1 : 0)), 1800);
    return () => window.clearInterval(t);
  }, [i]);

  useEffect(() => {
    if (!resting) return;
    if (rest <= 0) { setResting(false); setRest(REST_SECS); return; }
    const t = window.setTimeout(() => setRest((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resting, rest]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const cur = lines[L.id];
  const setCur = (patch: Partial<LineState>) =>
    setLines((s) => ({ ...s, [L.id]: { ...s[L.id], ...patch } }));

  const logSet = () => {
    const v = cur.reps.trim();
    if (!v) return;
    setCur({ sets: [...cur.sets, v], reps: '' });
    if (set + 1 < SETS) { setSet(set + 1); setResting(true); setRest(REST_SECS); }
    else nextExercise([...cur.sets, v]);
  };

  const nextExercise = (sets?: string[]) => {
    // A "melhor série" que o domínio guarda é o MÁXIMO das séries feitas — é o
    // que o campo do painel antigo pedia, agora calculado em vez de perguntado.
    const all = sets ?? cur.sets;
    const best = all.length ? Math.max(...all.map((x) => parseInt(x, 10) || 0)) : 0;
    setLines((s) => ({ ...s, [L.id]: { ...s[L.id], reps: best ? String(best) : '', sets: all } }));
    setResting(false); setRest(REST_SECS); setSet(0);
    if (i + 1 < TLINES.length) setI(i + 1);
    else setDone(true);
  };

  const submit = () => {
    const payload: Record<string, { reps: string; feel: string }> = {};
    TLINES.forEach((x: any) => {
      const l = lines[x.id];
      const best = l.sets.length ? Math.max(...l.sets.map((v) => parseInt(v, 10) || 0)) : 0;
      if (best > 0) {
        const r = RESULTS.find((z) => z.id === l.result) ?? RESULTS[1];
        payload[x.id] = { reps: String(best), feel: r.feel };
      }
    });
    const painful = TLINES.filter((x: any) => lines[x.id].result === 'pain' && lines[x.id].sets.length)
      .map((x: any) => x.n);
    const note = [notes.trim(), painful.length ? 'Dor em: ' + painful.join(', ') : '']
      .filter(Boolean).join(' · ').slice(0, 90);
    const res = finishTraining({ lines: payload, kegel: { done: false }, extra, notes: note });
    if (res && res.error) { setSaveErr(res.error === 'sem-registo' ? 'sem-registo' : 'erro'); return; }
    onClose();
  };

  const loggedCount = TLINES.filter((x: any) => lines[x.id].sets.length > 0).length;

  /* ── RESUMO FINAL ── o que vai ser gravado, linha a linha. */
  if (done) {
    return (
      <div className="ts" role="dialog" aria-label="Resumo da sessão">
        <header className="bp-head">
          <div className="bp-counts"><span><b>Resumo</b> da sessão</span></div>
          <button className="bp-close" type="button" onClick={onClose} aria-label="Sair">✕</button>
        </header>

        <ul className="ts-sum">
          {TLINES.map((x: any) => {
            const l = lines[x.id];
            const best = l.sets.length ? Math.max(...l.sets.map((v) => parseInt(v, 10) || 0)) : 0;
            const r = RESULTS.find((z) => z.id === l.result);
            const step = PROG[x.id][S.training.prog[x.id]];
            const willAdvance = best >= (step.t ?? 0) && r?.feel !== 'd';
            return (
              <li key={x.id} data-empty={best ? undefined : 'true'}>
                <span className="ts-sum-n" style={{ color: x.c }}>{x.n}</span>
                <span className="ts-sum-v">
                  {best ? `${l.sets.join(' · ')} — melhor ${best}` : 'não registado'}
                </span>
                <span className="ts-sum-r">
                  {best ? r?.label : '—'}
                  {best > 0 && willAdvance && <b className="ts-adv"> sobe de passo</b>}
                </span>
              </li>
            );
          })}
        </ul>

        {loggedCount === 0 && (
          <p className="ts-warn">
            Nenhuma linha tem séries registadas. O Sistema não grava uma sessão vazia —
            volta atrás ou sai sem registar.
          </p>
        )}

        <label className="ts-field">
          <span>Notas (dores, variações)</span>
          <input maxLength={90} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        <label className="ts-check">
          <input type="checkbox" checked={extra} onChange={(e) => setExtra(e.target.checked)} />
          <span>Volume extra — senti facilidade e fiz mais</span>
        </label>

        {saveErr && (
          <p className="ts-warn" role="alert">
            {saveErr === 'sem-registo'
              ? 'O Sistema recusou: não há nenhuma linha com repetições.'
              : 'Não foi possível gravar. Nada foi alterado.'}
          </p>
        )}

        <div className="bp-acts">
          <button className="cc-act-go" type="button" onClick={submit} disabled={loggedCount === 0}>
            Concluir e registar
          </button>
          <button className="mini" type="button" onClick={() => { setDone(false); setI(0); setSet(0); }}>
            Voltar ao início
          </button>
          <button className="mini" type="button" onClick={onClose}>Sair sem registar</button>
        </div>
      </div>
    );
  }

  /* ── DESCANSO ── conta e não faz mais nada. Saltável. */
  if (resting) {
    return (
      <div className="ts ts-rest" role="dialog" aria-label="Descanso">
        <header className="bp-head">
          <div className="bp-counts">
            <span><b>{i + 1}</b> de {TLINES.length} exercícios</span>
            <span>Série <b>{set + 1}</b> de {SETS}</span>
          </div>
          <button className="bp-close" type="button" onClick={onClose} aria-label="Sair">✕</button>
        </header>
        <p className="ts-rest-l">Descanso</p>
        <p className="ts-rest-t" aria-live="polite">{rest}s</p>
        <p className="ts-rest-n">
          O descanso faz parte do exercício: é nele que a série seguinte fica possível
          com a mesma técnica.
        </p>
        <div className="bp-acts">
          <button className="cc-act-go" type="button" onClick={() => { setResting(false); setRest(REST_SECS); }}>
            Continuar já
          </button>
          <button className="mini" type="button" onClick={() => nextExercise()}>Terminar este exercício</button>
        </div>
      </div>
    );
  }

  /* ── EXERCÍCIO ── */
  return (
    <div className="ts" role="dialog" aria-label={`Treino — ${L.n}`}>
      <header className="bp-head">
        <div className="bp-counts">
          <span><b>{i + 1}</b> de {TLINES.length} exercícios</span>
          <span>Série <b>{set + 1}</b> de {SETS}</span>
          <span>Passo {idx + 1} de {PROG[L.id].length}</span>
        </div>
        <button className="bp-close" type="button" onClick={onClose} aria-label="Sair da sessão">✕</button>
      </header>

      <div className="bp-body">
        <BodyDemo figure={L.id} amount={phase} label={`${st.n} — demonstração`} caption={st.n} />

        <div className="bp-info">
          <p className="ts-line" style={{ color: L.c }}>{L.n}</p>
          <h3 className="bp-h">{st.n}</h3>

          <dl className="rf-debrief ts-targets">
            <div><dt>Alvo para evoluir</dt><dd>{SETS}×{st.t}</dd></div>
            <div><dt>Unidade</dt><dd>{unit}</dd></div>
            {last && <div><dt>Último registo</dt><dd>{last.lines[L.id].reps}</dd></div>}
          </dl>

          {cur.sets.length > 0 && (
            <p className="ts-sets">Séries feitas: <b>{cur.sets.join(' · ')}</b></p>
          )}

          <label className="ts-field">
            <span>Série {set + 1} — quantas {unit}?</span>
            <input
              type="number" min="0" max="500" inputMode="numeric"
              placeholder={String(st.t)}
              value={cur.reps}
              onChange={(e) => setCur({ reps: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') logSet(); }}
            />
          </label>

          <fieldset className="ts-results">
            <legend>Como correu</legend>
            {RESULTS.map((r) => (
              <label key={r.id} data-on={cur.result === r.id ? 'true' : 'false'}>
                <input
                  type="radio" name={`res-${L.id}`} value={r.id}
                  checked={cur.result === r.id}
                  onChange={() => setCur({ result: r.id })}
                />
                <span className="ts-res-l">{r.label}</span>
                <span className="ts-res-h">{r.help}</span>
              </label>
            ))}
          </fieldset>

          <div className="bp-acts">
            <button className="cc-act-go" type="button" onClick={logSet} disabled={!cur.reps.trim()}>
              Registar série
            </button>
            <button className="mini" type="button" onClick={() => nextExercise()}>
              {i + 1 < TLINES.length ? 'Próximo exercício' : 'Ir para o resumo'}
            </button>
          </div>
        </div>
      </div>

      <details className="bp-more">
        <summary>O que estes resultados fazem</summary>
        <ul className="ts-map">
          {RESULTS.map((r) => (
            <li key={r.id}>
              <b>{r.label}</b> — {r.feel === 'd'
                ? 'o passo NÃO sobe, mesmo que atinjas o alvo'
                : r.feel === 'f'
                  ? 'conta como fácil; o passo sobe se atingires o alvo'
                  : 'conta como adequado; o passo sobe se atingires o alvo'}
            </li>
          ))}
        </ul>
        <p className="bp-stop">
          Para se: dor aguda, dor articular, formigueiro, ou se a técnica se partir. Um
          passo repetido não é tempo perdido — é o que torna o seguinte possível.
        </p>
      </details>
    </div>
  );
}
