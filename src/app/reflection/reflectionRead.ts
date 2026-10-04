/* REFLEXÃO — read model do Observatório Interior.
 * Missão 26 · Fase 8.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A zona prometia "memória, debrief e o que o Sistema aprendeu        ║
 * ║  contigo" e entregava quatro interruptores. O diagnóstico do Daniel  ║
 * ║  foi mais fundo do que o visual: A FUNÇÃO DA REFLEXÃO NÃO ESTAVA     ║
 * ║  DEFINIDA.                                                           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Sete leituras, e nenhuma inventa dados:
 *   estado presente · debrief do dia · padrões internos · memória recente ·
 *   decisões e compromissos · aprendizagens · interpretação do Oráculo
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A REFLEXÃO OBSERVA, NÃO JULGA.                                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * "Inimigos internos" saiu, e não por delicadeza: um padrão humano não é um
 * inimigo, e chamar-lhe isso ensina a escondê-lo em vez de o notar. O que se
 * pede a esta zona é reparar — e ninguém repara em nada num sítio onde vai ser
 * repreendido.
 *
 * BURNOUT NÃO É UM DIAGNÓSTICO. O número existe, é calculado dos dados do
 * Daniel e não vai ser escondido — mas aparece com os ingredientes à vista e
 * com a ressalva como linha de leitura, não como nota de rodapé. Um número de
 * saúde sem origem declarada é uma opinião com ar de medição.
 *
 * LIMITE HONESTO E DECLARADO: `S.log` guarda 14 entradas. Tudo o que esta
 * leitura diz sobre frequência é "nas últimas 14 entradas", nunca "sempre" —
 * o domínio não guarda mais, e fingir uma série longa seria inventar história.
 */

import { DEBUFFS, TITLES_REAL } from '../../state/config.js';
import { today, diffDays } from '../../state/dates.js';
import { vitals, seasonArcNow } from '../../state/world.js';
import { memoriaDoDia } from '../../state/memory.js';

export interface Reading {
  key: string;
  label: string;
  value: string;
  /** De onde saiu o número. Sem isto seria um sinal, não uma prova. */
  from?: string;
  tone?: 'alert' | 'good';
}

export interface PatternRead {
  id: string;
  name: string;
  /** O que o Operador nota quando isto acontece. */
  effect: string;
  /** O que costuma ajudar. */
  antidote: string;
  /** Marcado hoje? */
  noted: boolean;
  /** Dias desde a última vez que agiu sobre isto. `null` = nunca registado. */
  daysSinceAction: number | null;
  /** Vezes que aparece nas últimas 14 entradas do registo. */
  timesInLog: number;
}

export interface ReflectionRead {
  present: Reading[];
  presentNote: string;
  debrief: Reading[];
  debriefEmpty: boolean;
  patterns: PatternRead[];
  memory: string | null;
  recent: { text: string; when: string; gain: number }[];
  commitments: Reading[];
  learnings: Reading[];
}

/* `diffDays(a, b)` devolve b − a. Para uma data passada e `b = hoje`, isso já é
 * o número de dias decorridos — POSITIVO. A primeira versão negava o resultado
 * (copiado do `daysUntil`, onde o sinal é o contrário) e todas as datas do
 * registo apareciam como "hoje". Só se apanhou por olhar para o screenshot: as
 * seis linhas diziam "hoje" e o teste não tinha como saber que estava errado. */
const ago = (d: string): number => Math.max(0, diffDays(d, today()));
const days = (n: number) => (n === 0 ? 'hoje' : n === 1 ? 'ontem' : `há ${n} dias`);

export function readReflection(S: Record<string, any> | null): ReflectionRead | null {
  if (!S) return null;
  const hoje = today();

  /* ── 1 · ESTADO PRESENTE ──────────────────────────────────────────
   * Os mesmos três números do World Engine — de propósito. Dois nomes para o
   * mesmo valor seriam duas verdades. O que muda é o tratamento: aqui cada um
   * traz o que o alimenta. */
  let v = { momentum: 0, burn: 0, recovery: 0 };
  try {
    v = vitals(S);
  } catch { /* sem histórico não se afirma nada */ }

  const present: Reading[] = [
    {
      key: 'momentum',
      label: 'Momentum',
      value: v.momentum + '%',
      from: 'XP dos últimos 7 dias',
      tone: v.momentum >= 60 ? 'good' : undefined,
    },
    {
      key: 'burn',
      label: 'Carga',
      value: v.burn + '%',
      from: 'streaks, sono e volume de XP dos últimos 7 dias',
      tone: v.burn >= 70 ? 'alert' : undefined,
    },
    { key: 'recovery', label: 'Recuperação', value: v.recovery + '%', from: 'sono registado' },
  ];

  const presentNote =
    'Estimativas dos teus próprios registos. São uma leitura do que fizeste, não uma avaliação de saúde.';

  /* ── 2 · DEBRIEF DO DIA ───────────────────────────────────────────
   * Só o que aconteceu HOJE, e cada linha lida de onde o facto vive. */
  const obligDone = (S.oblig ?? []).filter((h: any) => h.lastDone === hoje).length;
  const obligTotal = (S.oblig ?? []).length;
  const extrasDone = (S.extras ?? []).filter((h: any) => h.lastDone === hoje).length;
  const missionsToday = (S.objectives ?? []).filter((o: any) => o.doneDate === hoje).length;
  const trainedToday = ((S.training?.sessions ?? []) as any[]).some((s) => s.d === hoje);
  const sleptToday = ((S.sleep?.logs ?? []) as any[]).some((l) => l.d === hoje);
  const studiedToday = S.studyStreak?.lastDay === hoje;
  const xpToday = (S.log ?? [])
    .filter((e: any) => e.d === hoje)
    .reduce((s: number, e: any) => s + (e.gain || 0), 0);

  const debrief: Reading[] = [
    { key: 'pilares', label: 'Pilares', value: `${obligDone} de ${obligTotal}`, tone: obligTotal > 0 && obligDone === obligTotal ? 'good' : undefined },
    { key: 'missoes', label: 'Missões fechadas', value: String(missionsToday) },
    { key: 'xp', label: 'XP do dia', value: xpToday > 0 ? '+' + xpToday : '—' },
    { key: 'corpo', label: 'Treino', value: trainedToday ? 'registado' : '—' },
    { key: 'sono', label: 'Sono', value: sleptToday ? 'registado' : '—' },
    { key: 'estudo', label: 'Revisão', value: studiedToday ? 'feita' : '—' },
  ];

  const debriefEmpty =
    obligDone === 0 && extrasDone === 0 && missionsToday === 0 && !trainedToday && !sleptToday && !studiedToday;

  /* ── 3 · PADRÕES INTERNOS ─────────────────────────────────────────
   * O interruptor binário continua a ser o que o domínio guarda — não se
   * inventa uma escala de 1 a 5 que ninguém registou. O que se acrescenta é
   * TEMPO: quando foi a última vez que agiste sobre isto, e quantas vezes
   * aparece no registo recente. Um padrão sem tempo não é um padrão. */
  const logCount = (name: string) =>
    (S.log ?? []).filter((e: any) => typeof e.text === 'string' && e.text.includes(name)).length;

  const patterns: PatternRead[] = DEBUFFS.map((d: any) => {
    const last = S.antidote?.[d.id];
    return {
      id: d.id,
      name: d.name,
      effect: d.ef,
      antidote: d.an,
      noted: !!S.debuffs?.[d.id],
      daysSinceAction: last ? ago(last) : null,
      timesInLog: logCount(d.name),
    };
  });

  /* ── 4 · MEMÓRIA RECENTE ──────────────────────────────────────────
   * A Living Memory (M15) já existia e só aparecia numa linha debaixo da
   * citação, no Núcleo. Este é o sítio dela. */
  const memory = memoriaDoDia(S);

  // Uma entrada sem texto não é renderável, e uma linha vazia com uma data ao
  // lado lê-se como dado perdido. Filtra-se em vez de se desenhar o vazio.
  const recent = (S.log ?? [])
    .filter((e: any) => typeof e.text === 'string' && e.text.trim().length > 0)
    .slice(0, 6)
    .map((e: any) => ({ text: e.text.trim(), when: e.d ? days(ago(e.d)) : '', gain: e.gain || 0 }));

  /* ── 5 · DECISÕES E COMPROMISSOS ──────────────────────────────────
   * O que está em aberto e o que foi assumido. Nada aqui é decorativo: cada
   * linha corresponde a um estado guardado. */
  const commitments: Reading[] = [];
  try {
    const arc = seasonArcNow();
    const wa = S.worldArc;
    if (arc && wa && wa.id === arc.id && wa.status === 'active') {
      commitments.push({ key: 'arc', label: 'Arco assumido', value: arc.name, from: `até ${wa.end}` });
    } else if (arc) {
      commitments.push({ key: 'arc', label: 'Arco por decidir', value: arc.name, tone: 'alert' });
    }
  } catch { /* sem arco, sem linha */ }

  if (S.recovery && hoje <= S.recovery.until) {
    commitments.push({ key: 'rec', label: 'Recovery ativo', value: `até ${S.recovery.until}`, from: 'sem penalizações', tone: 'good' });
  }
  if (S.whisper?.[hoje]) {
    commitments.push({ key: 'whisper', label: 'Sussurro do dia', value: 'cumprido', tone: 'good' });
  }

  /* ── 6 · APRENDIZAGENS ────────────────────────────────────────────
   * O que o Sistema tem como PROVADO, com data. Não é o que estudaste — é o
   * que ficou registado com evidência. */
  const learnings: Reading[] = [];
  const streak = S.studyStreak?.count ?? 0;
  if (streak > 0) {
    learnings.push({ key: 'study', label: 'Streak de estudo', value: `${streak} ${streak === 1 ? 'dia' : 'dias'}`, tone: 'good' });
  }
  const answered = Object.keys(S.recall ?? {}).length;
  if (answered > 0) {
    learnings.push({ key: 'recall', label: 'Perguntas em revisão', value: String(answered), from: 'agenda SM-2' });
  }
  const titles = Object.entries(S.titleUnlocked ?? {});
  titles
    .sort((a: any, b: any) => (a[1] < b[1] ? 1 : -1))
    .slice(0, 2)
    .forEach(([id, d]: any) => {
      const t = TITLES_REAL.find((x: any) => x.id === id);
      learnings.push({ key: 'title-' + id, label: 'Título provado', value: t ? t.name : String(id), from: days(ago(d)) });
    });
  const shadows = (S.shadows ?? []).length;
  if (shadows > 0) {
    learnings.push({ key: 'shadows', label: 'Sombras erguidas', value: String(shadows), from: 'missões concluídas' });
  }

  return { present, presentNote, debrief, debriefEmpty, patterns, memory, recent, commitments, learnings };
}

/* ── 7 · A INTERPRETAÇÃO DO ORÁCULO ─────────────────────────────────
 * Curta, como no Command Core, e com a mesma fronteira: o Sistema mostra os
 * números, o Oráculo diz o que eles significam JUNTOS. Só relações que se
 * podem provar a partir de duas leituras que já estão no ecrã.
 */
export function readReflectionOracle(S: Record<string, any> | null, r: ReflectionRead | null) {
  if (!S || !r) return [] as { key: string; text: string; because: string; tone?: 'alert' }[];
  const out: { key: string; text: string; because: string; tone?: 'alert' }[] = [];

  const burn = Number(r.present.find((p) => p.key === 'burn')?.value.replace('%', '') ?? 0);
  const mom = Number(r.present.find((p) => p.key === 'momentum')?.value.replace('%', '') ?? 0);
  const rec = Number(r.present.find((p) => p.key === 'recovery')?.value.replace('%', '') ?? 0);
  const notados = r.patterns.filter((p) => p.noted);

  if (burn >= 70 && mom >= 70) {
    out.push({
      key: 'burn-mom',
      text: 'Estás a produzir muito e a recuperar pouco ao mesmo tempo. Não é um problema de vontade — é aritmética: o que entra tem de sair em algum lado.',
      because: `carga ${burn}% e momentum ${mom}% em simultâneo`,
      tone: 'alert',
    });
  } else if (rec < 40 && burn >= 50) {
    out.push({
      key: 'rec-low',
      text: 'A recuperação está abaixo da carga. O sono é a única coisa desta lista que não se recupera depois.',
      because: `recuperação ${rec}% contra carga ${burn}%`,
    });
  }

  if (notados.length && out.length < 2) {
    const p = notados[0];
    out.push({
      key: 'pattern',
      text:
        p.daysSinceAction === null
          ? `Notaste ${p.name.toLowerCase()} e ainda não agiste sobre isso. Notar já é metade — a outra metade tem um botão aqui ao lado.`
          : `${p.name} outra vez, ${p.daysSinceAction === 0 ? 'e já agiste hoje' : `e a última vez que agiste foi ${days(p.daysSinceAction)}`}. Um padrão que volta não é fraqueza; é informação sobre o que o teu ritmo te está a pedir.`,
      because: `debuffs.${p.id} = true; último antídoto: ${p.daysSinceAction === null ? 'nunca' : p.daysSinceAction + 'd'}`,
    });
  }

  if (!out.length && r.debriefEmpty) {
    out.push({
      key: 'empty-day',
      text: 'O dia ainda não deixou registo. Não é um juízo — é só cedo, ou foi um dia que não se mede aqui.',
      because: 'nenhum pilar, missão, treino, sono ou revisão com data de hoje',
    });
  }

  return out.slice(0, 2);
}
