/* RECUPERAÇÃO — o estado diário que liga sono e treino.
 * Missão 26 · Fase 7.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  NÃO FINGE PRECISÃO CLÍNICA. Quatro estados, e cada um diz que dados ║
 * ║  usou. Sem dados, o estado é "sem dados" — nunca "pronto" por        ║
 * ║  omissão, que seria a mentira mais fácil de contar aqui.             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O QUE ISTO NÃO FAZ: bloquear. A recomendação aparece antes do treino e o
 * Operador continua a decidir. Um sistema que impede alguém de treinar com
 * base em três números estimados está a dar uma ordem clínica que não tem
 * como sustentar.
 *
 * Sono e treino deixam de ser dois módulos distantes: as duas leituras entram
 * na mesma conta, que é a razão pela qual esta zona existe.
 */

import { today, diffDays } from '../../state/dates.js';
import { consecTrained, weekSessions } from '../../state/training.js';
import { sleepStreak } from '../../state/sleep.js';

export type RecoveryLevel = 'pronto' | 'moderado' | 'recuperar' | 'sem-dados';

export interface RecoveryRead {
  level: RecoveryLevel;
  /** O que este estado quer dizer, em linguagem de operação. */
  meaning: string;
  /** Os dados que produziram o estado. Um por linha, verificáveis. */
  inputs: { label: string; value: string }[];
  /** Sugestão. Nunca uma ordem. */
  suggestion: string;
  /** Noites com sono registado nos últimos 7 dias — o denominador da confiança. */
  nightsLogged: number;
}

export function readRecovery(S: Record<string, any> | null): RecoveryRead {
  const empty: RecoveryRead = {
    level: 'sem-dados',
    meaning: 'O Sistema ainda não tem sono nem treino registados para ler.',
    inputs: [],
    suggestion: 'Regista uma noite de sono e uma sessão. A partir daí isto passa a dizer alguma coisa.',
    nightsLogged: 0,
  };
  if (!S) return empty;

  const logs = (S.sleep?.logs ?? []) as { d: string; h: number }[];
  const last7 = logs.filter((l) => diffDays(l.d, today()) < 7 && diffDays(l.d, today()) >= 0);
  const nightsLogged = last7.length;

  let consec = 0;
  let week = 0;
  try {
    consec = consecTrained(S);
    week = weekSessions(S);
  } catch { /* sem histórico de treino, ficam a zero */ }

  // Sem noites registadas não há conta possível. Dizer "pronto" aqui seria
  // inventar — e a lei é que nada visualiza estado sem evidência real.
  if (nightsLogged === 0) {
    return {
      ...empty,
      meaning: 'Sem sono registado nos últimos 7 dias, não há base para estimar recuperação.',
      inputs: [
        { label: 'Noites registadas (7d)', value: '0' },
        { label: 'Dias seguidos de treino', value: String(consec) },
      ],
      suggestion:
        consec >= 4
          ? 'Quatro ou mais dias seguidos de treino sem sono registado: hoje, mobilidade em vez de carga é a escolha conservadora.'
          : 'Regista o sono de ontem — é o dado que falta para isto ser útil.',
    };
  }

  const avg = last7.reduce((s, l) => s + (l.h || 0), 0) / nightsLogged;
  const avgR = Math.round(avg * 10) / 10;
  let sStreak = 0;
  try {
    sStreak = sleepStreak(S);
  } catch { /* ignora */ }

  const inputs = [
    { label: 'Média de sono (7d)', value: avgR + 'h' },
    { label: 'Noites registadas', value: `${nightsLogged} de 7` },
    { label: 'Noites no alvo, seguidas', value: String(sStreak) },
    { label: 'Dias seguidos de treino', value: String(consec) },
    { label: 'Sessões esta semana', value: String(week) },
  ];

  /* A regra é conservadora de propósito: em dúvida, desce um degrau.
   * O custo de sugerir descanso a quem estava pronto é uma sessão adiada; o
   * custo de sugerir carga a quem não recuperou é uma lesão. Não são
   * simétricos, e a regra reflete isso. */
  if (consec >= 4 || avgR < 6) {
    return {
      level: 'recuperar',
      meaning: 'Os dados apontam para carga acumulada sem recuperação equivalente.',
      inputs,
      suggestion:
        consec >= 4
          ? `${consec} dias seguidos de treino. Mobilidade, caminhada ou descanso rendem mais hoje do que outra sessão de carga.`
          : `Média de ${avgR}h de sono nos últimos ${nightsLogged} registos. Uma sessão mais curta é a escolha conservadora.`,
      nightsLogged,
    };
  }

  if (avgR < 7 || consec === 3 || nightsLogged < 3) {
    return {
      level: 'moderado',
      meaning: 'Dá para treinar. Não é o dia para bater recordes.',
      inputs,
      suggestion:
        nightsLogged < 3
          ? `Só ${nightsLogged} ${nightsLogged === 1 ? 'noite registada' : 'noites registadas'} nos últimos 7 dias — a leitura existe mas é fraca.`
          : 'Mantém o volume habitual e para uma repetição antes da falha.',
      nightsLogged,
    };
  }

  return {
    level: 'pronto',
    meaning: 'Sono e carga estão em equilíbrio nos dados dos últimos 7 dias.',
    inputs,
    suggestion: 'Bom dia para a sessão completa.',
    nightsLogged,
  };
}
