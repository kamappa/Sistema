/* SESSÃO GUIADA — o reprodutor.
 * Missão 26 · Fase 7.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  DOIS MODOS, e o guiado NÃO é obrigatório.                           ║
 * ║  GUIADO  — um exercício de cada vez, com demonstração, ritmo,        ║
 * ║            respiração e temporizador.                                ║
 * ║  LEITURA — a rotina inteira em texto, para quem já sabe.             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O que o cabeçalho persistente resolve: no treino antigo lia-se "Passo 1/8"
 * repetido em cada exercício e não havia progresso NENHUM da sessão. Aqui há
 * três contagens e cada uma diz coisa diferente — exercício, repetição, fase.
 *
 * O TEMPORIZADOR NÃO CONFIRMA DADOS. Conta o ritmo do exercício e mais nada.
 * Nada é gravado por ele passar; grava-se quando o Operador diz que fez.
 *
 * ACESSIBILIDADE, e nenhuma é opcional aqui:
 *   - pausa sempre disponível, e o tempo não corre em pausa;
 *   - reduced motion: a demonstração fica na posição da fase, sem trajeto;
 *   - a fase atual é anunciada por `aria-live` para quem não vê a figura;
 *   - sair não perde nada, porque nada foi escrito até se registar.
 */

import { useEffect, useRef, useState } from 'react';
import BodyDemo from './BodyDemo';
import { sourceById, type Routine } from './routines';

interface Props {
  routine: Routine;
  onDone: (routineId: string) => void;
  onClose: () => void;
}

export default function RoutinePlayer({ routine, onDone, onClose }: Props) {
  const [ex, setEx] = useState(0);
  const [rep, setRep] = useState(0);
  const [phase, setPhase] = useState(0);
  const [left, setLeft] = useState(routine.exercises[0].phases[0].secs);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const tick = useRef<number | null>(null);

  const exercise = routine.exercises[ex];
  const ph = exercise.phases[phase];
  const src = sourceById(exercise.sourceId);

  /* O relógio. Um `setInterval` de 1s, parado em pausa — o tempo não corre
     quando o Operador não está a executar. */
  useEffect(() => {
    if (!running || finished) return;
    tick.current = window.setInterval(() => setLeft((n) => n - 1), 1000);
    return () => { if (tick.current) window.clearInterval(tick.current); };
  }, [running, finished]);

  /* O avanço. Fase → repetição → exercício → fim. */
  useEffect(() => {
    if (left > 0 || !running || finished) return;
    const nextPhase = phase + 1;
    if (nextPhase < exercise.phases.length) {
      setPhase(nextPhase);
      setLeft(exercise.phases[nextPhase].secs);
      return;
    }
    const nextRep = rep + 1;
    if (nextRep < exercise.reps) {
      setRep(nextRep);
      setPhase(0);
      setLeft(exercise.phases[0].secs);
      return;
    }
    const nextEx = ex + 1;
    if (nextEx < routine.exercises.length) {
      setEx(nextEx);
      setRep(0);
      setPhase(0);
      setLeft(routine.exercises[nextEx].phases[0].secs);
      // Pausa entre exercícios: o Operador tem de ler o próximo antes de o
      // fazer. Continuar sozinho seria o guia a correr à frente de quem guia.
      setRunning(false);
      return;
    }
    setRunning(false);
    setFinished(true);
  }, [left, running, finished, phase, rep, ex, exercise, routine.exercises]);

  const skipExercise = () => {
    const nextEx = ex + 1;
    if (nextEx < routine.exercises.length) {
      setEx(nextEx); setRep(0); setPhase(0);
      setLeft(routine.exercises[nextEx].phases[0].secs);
      setRunning(false);
    } else {
      setRunning(false); setFinished(true);
    }
  };

  // Escape sai. Nada se perde: nada foi escrito.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (finished) {
    return (
      <div className="bp bp-done" role="dialog" aria-label={`${routine.name} — concluída`}>
        <h3 className="bp-h">Rotina percorrida</h3>
        <p className="bp-done-t">
          {routine.name} · {routine.exercises.length} exercícios
        </p>
        <p className="bp-done-n">
          O Sistema só regista o que confirmares. Se fizeste a rotina, regista — se
          interrompeste a meio, não registes, e o número continua verdadeiro.
        </p>
        <div className="bp-acts">
          <button className="cc-act-go" type="button" onClick={() => onDone(routine.id)}>
            Registar como feita
          </button>
          <button className="mini" type="button" onClick={onClose}>Sair sem registar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bp" role="dialog" aria-label={`${routine.name} — sessão guiada`}>
      {/* Cabeçalho persistente: três contagens, três significados. */}
      <header className="bp-head">
        <div className="bp-counts">
          <span><b>{ex + 1}</b> de {routine.exercises.length} exercícios</span>
          <span><b>{rep + 1}</b> de {exercise.reps} repetições</span>
          <span>{ph.label}</span>
        </div>
        <button className="bp-close" type="button" onClick={onClose} aria-label="Sair da sessão">✕</button>
      </header>

      <div className="bp-body">
        <BodyDemo
          figure={exercise.figure}
          amount={ph.amount}
          label={`${exercise.name} — ${ph.label}`}
          caption={ph.label}
        />

        <div className="bp-info">
          <h3 className="bp-h">{exercise.name}</h3>
          <p className="bp-goal">{exercise.goal}</p>

          {/* A fase, o tempo e a respiração. `aria-live` porque quem não vê a
              figura precisa de ouvir a mudança de fase. */}
          <div className="bp-phase" aria-live="polite">
            <span className="bp-phase-l">{ph.label}</span>
            <span className="bp-phase-t">{Math.max(0, left)}s</span>
            {ph.breath !== 'normal' && <span className="bp-breath">{ph.breath}</span>}
            {ph.breath === 'normal' && <span className="bp-breath">respira normalmente</span>}
          </div>

          <div className="bp-acts">
            <button className="cc-act-go" type="button" onClick={() => setRunning((r) => !r)}>
              {running ? 'Pausa' : rep === 0 && phase === 0 ? 'Começar' : 'Continuar'}
            </button>
            <button className="mini" type="button" onClick={skipExercise}>
              Saltar exercício
            </button>
          </div>
        </div>
      </div>

      <details className="bp-more">
        <summary>Como se faz, erro comum e quando parar</summary>
        <ol className="bp-how">
          {exercise.how.map((h, i) => <li key={i}>{h}</li>)}
        </ol>
        <p className="bp-mistake"><b>Erro comum:</b> {exercise.mistake}</p>
        <p className="bp-stop"><b>Para se:</b> {exercise.stop}</p>
        {src && (
          <p className="bp-src">
            Fonte: <a href={src.url} target="_blank" rel="noopener noreferrer">{src.org}</a> · revisto {src.reviewed}
          </p>
        )}
      </details>
    </div>
  );
}
