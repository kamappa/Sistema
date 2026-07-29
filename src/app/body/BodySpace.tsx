/* CORPO E RECUPERAÇÃO — o espaço.
 * Missão 26 · Fase 7.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  SUBESPAÇO, NÃO SÉTIMA ZONA. A órbita continua com seis marcas —     ║
 * ║  condição explícita do Daniel. Operações mostra um resumo e uma      ║
 * ║  entrada; o espaço abre por cima, sem desmontar nada.                ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O overlay é irmão do conteúdo da zona, não substituto: a zona fica montada,
 * o scroll fica onde estava e o contexto WebGL não é tocado. É a mesma regra
 * que governa a troca de zonas desde a Fase 2, aplicada um nível abaixo.
 *
 * O QUE REÚNE, e é a razão de existir: treino, sono, pavimento pélvico e
 * mandíbula/pescoço estavam espalhados por uma zona onde competiam com
 * missões e calendário. Pertencem todos ao mesmo ciclo — carga e recuperação —
 * e agora falam entre si através do estado de recuperação.
 */

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../store/useStore.js';
import { ROUTINES, routineSeconds, sourceById, type Routine } from './routines';
import { readRecovery } from './recoveryRead';
import RoutinePlayer from './RoutinePlayer';
import TrainingSession from './TrainingSession';
import Training from '../../components/Training.jsx';
import Sleep from '../../components/Sleep.jsx';
import { TLINES } from '../../state/config.js';
import './body.css';

const mins = (s: number) => Math.max(1, Math.round(s / 60));
/** Mantido em sincronia com `SETS` do TrainingSession — é só a frase de
 *  apresentação; o número que conta vive lá. */
const SETS_HINT = 3;
const MODE_KEY = 'sistema:treino-modo';

export default function BodySpace({ S }: { S: Record<string, any> }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState<Routine | null>(null);
  const [training, setTraining] = useState(false);
  const [mode, setModeState] = useState<'guided' | 'quick'>(() => {
    try { return localStorage.getItem(MODE_KEY) === 'quick' ? 'quick' : 'guided'; } catch { return 'guided'; }
  });
  const setMode = (m: 'guided' | 'quick') => {
    setModeState(m);
    try { localStorage.setItem(MODE_KEY, m); } catch { /* modo privado: fica só nesta sessão */ }
  };
  const logBodyRoutine = useStore((s: any) => s.logBodyRoutine);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const rec = readRecovery(S);

  // Foco entra ao abrir e VOLTA ao botão ao fechar — sem isto, quem navega por
  // teclado sai do overlay e reaparece no topo do documento.
  useEffect(() => {
    if (open) panelRef.current?.focus();
    else openerRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !playing) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, playing]);

  const doneToday = (id: string) => {
    const h = S.bodyRoutines?.[id] ?? [];
    return h[h.length - 1] === new Date().toISOString().slice(0, 10);
  };

  return (
    <section className="panel bs-entry" aria-label="Corpo e recuperação">
      <h2 className="rf-h">Corpo e recuperação</h2>

      {/* O resumo que fica em Operações: estado do dia e o que falta. */}
      <div className="bs-sum">
        <div className="bs-rec" data-level={rec.level}>
          <span className="bs-rec-l">Recuperação</span>
          <strong className="bs-rec-v">{rec.level === 'sem-dados' ? 'sem dados' : rec.level}</strong>
        </div>
        <p className="bs-rec-m">{rec.meaning}</p>
      </div>

      <ul className="bs-quick">
        {ROUTINES.map((r) => (
          <li key={r.id}>
            <span>{r.name}</span>
            <span className="bs-quick-r">{doneToday(r.id) ? 'feita hoje' : `${mins(routineSeconds(r))} min`}</span>
          </li>
        ))}
      </ul>

      <button ref={openerRef} className="cc-act-go" type="button" onClick={() => setOpen(true)}>
        Abrir Corpo e Recuperação
      </button>

      {/* PORTAL, e não um filho da zona.
          Medido: com o overlay dentro do palco, a órbita aparecia POR CIMA do
          cabeçalho — `.sys-stage-wrap` tem z-index próprio e cria um contexto
          de empilhamento de onde um filho não sai, por muito alto que seja o
          seu z-index. O portal põe o overlay como irmão do `<body>`, onde o
          `--sys-z-overlay` significa o que diz.
          A zona continua montada: o portal muda ONDE se pinta, não desmonta
          nada — scroll, estado dos painéis e contexto WebGL ficam intactos. */}
      {open && createPortal(
        /* `sys-instrumental` no overlay NÃO é decorativo — é obrigatório.
           Ao sair para o `<body>`, o portal saiu do contexto onde vivem todas
           as correções da shell: o contraste do `.vit-note` (Fase J), os alvos
           de toque dos `.mini`, as molduras removidas dos painéis. Medido: sem
           esta classe, a nota do Sono voltava a 2,25:1 a 10px, que era
           exatamente a falha que a Fase J tinha fechado.
           Uma regressão silenciosa, e o portal é que a causou. */
        <div className="bs-overlay sys-instrumental" role="dialog" aria-modal="true" aria-label="Corpo e recuperação">
          <div className="bs-panel" ref={panelRef} tabIndex={-1}>
            <header className="bs-head">
              <div>
                <h2 className="bs-title">Corpo e recuperação</h2>
                <p className="bs-lede">Carga e recuperação no mesmo sítio, porque são a mesma conta.</p>
              </div>
              <button className="bs-close" type="button" onClick={() => setOpen(false)} aria-label="Fechar">✕</button>
            </header>

            <div className="bs-scroll">
              {playing ? (
                <RoutinePlayer
                  routine={playing}
                  onClose={() => setPlaying(null)}
                  onDone={(id) => {
                    const r = ROUTINES.find((x) => x.id === id);
                    if (r) logBodyRoutine(r.id, r.name);
                    setPlaying(null);
                  }}
                />
              ) : (
                <>
                  {/* ── HOJE ── */}
                  <section className="bs-sec">
                    <h3 className="bs-h">Hoje</h3>
                    <div className="bs-rec-full" data-level={rec.level}>
                      <strong>{rec.level === 'sem-dados' ? 'sem dados' : rec.level}</strong>
                      <p>{rec.meaning}</p>
                    </div>
                    {rec.inputs.length > 0 && (
                      <dl className="rf-debrief bs-inputs">
                        {rec.inputs.map((i) => (
                          <div key={i.label}><dt>{i.label}</dt><dd>{i.value}</dd></div>
                        ))}
                      </dl>
                    )}
                    <p className="bs-sug">{rec.suggestion}</p>
                    <p className="bs-disclaimer">
                      Estimativa dos teus registos de sono e treino. Não é uma avaliação
                      clínica e não impede nada — a decisão de treinar é tua.
                    </p>
                  </section>

                  {/* ── ROTINAS GUIADAS ── */}
                  {ROUTINES.map((r) => (
                    <RoutineCard
                      key={r.id}
                      routine={r}
                      doneToday={doneToday(r.id)}
                      streakDates={S.bodyRoutines?.[r.id] ?? []}
                      onStart={() => setPlaying(r)}
                    />
                  ))}

                  {/* ── TREINO E SONO ──
                      Os painéis existentes entram inteiros. Não foram
                      redesenhados nesta passagem, e isso está dito no relatório
                      em vez de ficar escondido: o que esta fase entrega é o
                      ESPAÇO e as rotinas guiadas. */}
                  {/* ── TREINO ──
                      Dois modos, e o guiado NÃO é obrigatório. A preferência
                      fica em localStorage: é uma escolha de interface, não um
                      dado do Operador, e não tem nada que fazer no app_state
                      nem a viajar para a nuvem. */}
                  <section className="bs-sec">
                    <div className="bs-modes">
                      <h3 className="bs-h">Treino</h3>
                      <div className="bs-mode-sw" role="group" aria-label="Modo de treino">
                        <button type="button" data-on={mode === 'guided'} onClick={() => setMode('guided')}>Guiado</button>
                        <button type="button" data-on={mode === 'quick'} onClick={() => setMode('quick')}>Registo rápido</button>
                      </div>
                    </div>

                    {mode === 'guided' ? (
                      training ? (
                        <TrainingSession S={S} onClose={() => setTraining(false)} />
                      ) : (
                        <div className="bs-start">
                          <p className="bs-r-lede">
                            {TLINES.length} exercícios, {SETS_HINT} séries cada, com demonstração,
                            ritmo e descanso contado.
                          </p>
                          <p className="bs-claim">
                            Nada é gravado enquanto não concluíres o resumo. Sair a meio não
                            perde dados porque ainda não há dados para perder.
                          </p>
                          <button className="cc-act-go" type="button" onClick={() => setTraining(true)}>
                            Começar sessão
                          </button>
                        </div>
                      )
                    ) : (
                      /* O painel antigo, inteiro. Quem já sabe o que faz não
                         tem de ser guiado — e a lista compacta é mais rápida. */
                      <Training S={S} />
                    )}
                  </section>

                  <section className="bs-sec">
                    <h3 className="bs-h">Sono</h3>
                    <Sleep S={S} />
                  </section>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

function RoutineCard({
  routine,
  doneToday,
  streakDates,
  onStart,
}: {
  routine: Routine;
  doneToday: boolean;
  streakDates: string[];
  onStart: () => void;
}) {
  return (
    <section className="bs-sec bs-routine">
      <h3 className="bs-h">{routine.name}</h3>
      <p className="bs-r-lede">{routine.lede}</p>

      {/* O enquadramento honesto vem ANTES dos exercícios, não depois. Quem lê
          só o princípio tem de ficar com a expectativa certa. */}
      <p className="bs-claim">{routine.claim}</p>

      <div className="bs-r-meta">
        <span>{routine.exercises.length} exercícios</span>
        <span>~{mins(routineSeconds(routine))} min</span>
        {streakDates.length > 0 && <span>{streakDates.length} registos</span>}
        {doneToday && <span className="bs-done">feita hoje</span>}
      </div>

      <button className="cc-act-go" type="button" onClick={onStart}>
        {doneToday ? 'Repetir com guia' : 'Começar com guia'}
      </button>

      <details className="bs-r-list">
        <summary>Ver a rotina inteira em texto</summary>
        <ol>
          {routine.exercises.map((e) => (
            <li key={e.id}>
              <b>{e.name}</b> — {e.reps}× · {e.goal}
              <ul>{e.how.map((h, i) => <li key={i}>{h}</li>)}</ul>
            </li>
          ))}
        </ol>
      </details>

      <details className="bs-r-safe" open>
        <summary>Cuidados e quando parar</summary>
        <ul className="bs-cautions">
          {routine.cautions.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
        <p className="bs-red-h">Para e procura avaliação se tiveres:</p>
        <ul className="bs-red">
          {routine.redFlags.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      </details>

      <p className="bs-src">
        Fontes:{' '}
        {routine.sourceIds.map((id, i) => {
          const s = sourceById(id);
          if (!s) return null;
          return (
            <span key={id}>
              {i > 0 && ' · '}
              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.org}</a>
            </span>
          );
        })}
        {' · revisto '}
        {sourceById(routine.sourceIds[0])?.reviewed}
      </p>
    </section>
  );
}
