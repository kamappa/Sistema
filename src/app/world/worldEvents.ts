/* WORLD ENGINE II — o catálogo, e o que dele é implementável hoje.
 * Missão 27 · Fase 1.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  PORQUE É QUE ESTE FICHEIRO TEM MENOS EVENTOS DO QUE O SPEC          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O SPEC da Missão 27 nomeia vinte e tal eventos — Starbirth, Supernova Rare,
 * Boss Gate, Mentor Signal, Eclipse Protocol, e dez compostos. Aqui estão
 * SETE.
 *
 * A diferença não é preguiça: é o critério de honestidade da própria missão.
 * "Um evento só se apresenta como facto quando possui prova", e prova
 * significa um dado datado que o Sistema já tem. Os que faltam precisam de
 * dados que ainda não existem:
 *
 *   Mentor Signal      — não há registo de contacto com mentores
 *   Boss Gate          — não há marcos de arco guardados (o mesmo buraco que
 *                        deixa `milestone` e `climax` inalcançáveis na M26)
 *   Eclipse Protocol   — não há calendário de eclipses nem configuração dele
 *   Supernova Rare     — não há definição de o que é raro o suficiente
 *   Exam Siege         — não há distinção entre um prazo e um exame
 *
 * Declará-los com um `trigger` que devolve sempre `null` seria pior do que não
 * os ter: dava a impressão de um motor completo com metade dos eventos mortos.
 * Ficam listados em `POR_IMPLEMENTAR`, com o que falta a cada um.
 *
 * Os sete que existem apoiam-se todos em dados que o estado já guarda: clima
 * do dia (`S.weather`), histórico datado (`S.history`), o relógio e o arco
 * sazonal. Nenhum inventa nada.
 */

import { seasonArcNow, rainyActive, heatActive } from '../../state/world.js';
import { today, diffDays } from '../../state/dates.js';
import { readAi } from '../ai/ai-read';
import type { WorldEventDef } from './worldModel';

const hhmm = (d: Date) => d.getHours() * 60 + d.getMinutes();

/** XP dos últimos N dias, do histórico datado. É a única medida de
 *  comportamento que o Sistema tem com data — e por isso a única que pode
 *  fundamentar um evento de comportamento. */
function xpUltimosDias(S: Record<string, any>, n: number): number {
  const h: any[] = Array.isArray(S?.history) ? S.history : [];
  return h.filter((x) => diffDays(x.d, today()) < n)
    .reduce((s, x) => s + Math.max(0, x.v || 0), 0);
}

export const WORLD_EVENTS: readonly WorldEventDef[] = [

  /* ── TEMPO ─────────────────────────────────────────────────────────── */
  {
    id: 'midnight-archive',
    name: 'Arquivo da Meia-Noite',
    layer: 'time',
    priority: 'ambient',
    trigger: (_ctx, now) => {
      const m = hhmm(now);
      if (m < 23 * 60 && m > 4 * 60) return null;
      return { source: 'relógio', fact: `são ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`, date: today() };
    },
    visual: { intensity: 0.6, flag: 'midnight' },
    copy: 'O mundo está quieto. O que ficar escrito agora fica bem escrito.',
    mobile: 'full',
    reducedMotion: 'still',
  },

  /* ── CLIMA ─────────────────────────────────────────────────────────── */
  {
    id: 'rain-sanctuary',
    name: 'Santuário de Chuva',
    layer: 'weather',
    priority: 'notable',
    /* `rainyActive` já existe desde a M12 e já dá bónus ao Saber. Isto não
       duplica esse efeito — dá-lhe nome, prova e presença. */
    trigger: ({ S }) => {
      if (!rainyActive(S)) return null;
      return { source: 'S.weather (Open-Meteo)', fact: `${S.weather.rain} mm de chuva previstos`, date: S.weather.d };
    },
    visual: { intensity: 0.85, flag: 'rain' },
    copy: 'Chove. Lá fora não se perde nada; aqui dentro ganha-se.',
    suggests: ['Estudo profundo', 'Rever apontamentos'],
    favours: ['saber', 'mente'],
    mobile: 'full',
    reducedMotion: 'still',
  },
  {
    id: 'solar-push',
    name: 'Impulso Solar',
    layer: 'weather',
    priority: 'notable',
    trigger: ({ S }) => {
      if (!heatActive(S)) return null;
      return { source: 'S.weather (Open-Meteo)', fact: `máxima de ${S.weather.tmax}°C`, date: S.weather.d };
    },
    visual: { intensity: 1, flag: 'heat' },
    copy: 'Calor a sério. O corpo cobra e o dia recompensa quem se antecipa.',
    /* Sugestões, nunca diagnóstico — o SPEC é explícito quanto a isto. */
    suggests: ['Treinar antes do calor', 'Trabalho profundo à hora mais quente'],
    favours: ['corpo', 'disciplina'],
    mobile: 'full',
    reducedMotion: 'still',
  },

  /* ── ESTAÇÃO ───────────────────────────────────────────────────────── */
  {
    id: 'season-turn',
    name: 'Viragem de Arco',
    layer: 'season',
    priority: 'major',
    /* Os primeiros três dias de um arco sazonal. A prova é o calendário e o
       mês do arco — não há nada a adivinhar. */
    trigger: (_ctx, now) => {
      const arco = seasonArcNow();
      const m = now.getMonth() + 1;
      const primeiroMes = arco.months[0];
      if (m !== primeiroMes || now.getDate() > 3) return null;
      return { source: 'SEASON_ARCS + calendário', fact: `${arco.name} começou este mês`, date: today() };
    },
    durationMin: 0,
    visual: { intensity: 1 },
    copy: 'O arco mudou. O que servia no anterior pode já não servir.',
    mobile: 'full',
    reducedMotion: 'still',
  },

  /* ── CALENDÁRIO ────────────────────────────────────────────────────── */
  {
    id: 'sunday-calm',
    name: 'Domingo',
    layer: 'calendar',
    priority: 'ambient',
    /* Lei da Missão 23, que já existe no céu. Aqui ganha prova e nome. */
    trigger: (_ctx, now) => {
      if (now.getDay() !== 0) return null;
      return { source: 'calendário', fact: 'é domingo', date: today() };
    },
    visual: { intensity: 0.7, flag: 'calm' },
    copy: 'Domingo. O mundo abranda de propósito.',
    mobile: 'full',
    reducedMotion: 'still',
  },
  {
    id: 'new-cycle',
    name: 'Novo Ciclo',
    layer: 'calendar',
    priority: 'major',
    trigger: (_ctx, now) => {
      if (now.getDate() !== 1) return null;
      return { source: 'calendário', fact: `primeiro dia de mês`, date: today() };
    },
    durationMin: 0,
    visual: { intensity: 1, flag: 'newcycle' },
    copy: 'Mês novo. O que ficou por fazer não desaparece — passa a ser visível.',
    mobile: 'full',
    reducedMotion: 'still',
  },

  /* ── COMPORTAMENTO ─────────────────────────────────────────────────── */
  {
    id: 'silence',
    name: 'Silêncio',
    layer: 'behaviour',
    priority: 'notable',
    /* Lei da Missão 23: sem progresso, o universo perde intensidade. A prova é
       o histórico datado, e é por isso que este evento pode existir enquanto
       Mentor Signal e Boss Gate não podem. */
    trigger: ({ S }) => {
      const dias = 5;
      const xp = xpUltimosDias(S, dias);
      if (xp > 0) return null;
      return { source: 'S.history', fact: `zero XP registado nos últimos ${dias} dias`, date: today() };
    },
    visual: { intensity: 0.45, flag: 'silence' },
    copy: 'Há cinco dias sem registo. O mundo não julga — só deixa de brilhar.',
    mobile: 'full',
    reducedMotion: 'still',
  },

  /* ── AI E AI GOVERNANCE · Missão 29 ────────────────────────────────
   * Os dois eventos da Missão 29 que têm prova hoje. Vivem AQUI, no mesmo
   * registo, e não num motor paralelo: dois motores de eventos no mesmo
   * produto seriam duas opiniões sobre o que é importante.
   *
   * A prova é o Radar, que já classifica itens em `ai` e `aigov` desde a
   * Missão 13 (`RAREA`). Os outros catorze eventos da M29 esperam o
   * inventário — ver `app/ai/aiModel.ts`.
   */
  {
    id: 'ai-radar',
    name: 'AI Radar',
    layer: 'special',
    priority: 'notable',
    cooldownH: 20,
    trigger: ({ radar }) => {
      if (!Array.isArray(radar)) return null;
      const hoje = today();
      const itens = radar.filter((i) => i && i.area === 'ai' && String(i.d || '').slice(0, 10) === hoje);
      if (!itens.length) return null;
      return { source: 'radar_items (area: ai)', fact: `${itens.length} ${itens.length === 1 ? 'sinal novo' : 'sinais novos'} de IA`, date: hoje };
    },
    visual: { intensity: 0.8, flag: 'ai' },
    copy: 'Há movimento em IA hoje. Ler não é estudar, mas é por onde começa.',
    favours: ['saber'],
    mobile: 'full',
    reducedMotion: 'still',
  },
  {
    id: 'governance-radar',
    name: 'Governance Radar',
    layer: 'special',
    /* MAIOR do que o AI Radar, e é deliberado: uma alteração regulatória tem
       prazo e consequência; uma notícia de modelo novo não tem. */
    priority: 'major',
    cooldownH: 20,
    trigger: ({ radar }) => {
      if (!Array.isArray(radar)) return null;
      const hoje = today();
      const itens = radar.filter((i) => i && i.area === 'aigov' && String(i.d || '').slice(0, 10) === hoje);
      if (!itens.length) return null;
      return { source: 'radar_items (area: aigov)', fact: `${itens.length} ${itens.length === 1 ? 'sinal novo' : 'sinais novos'} de governação de IA`, date: hoje };
    },
    visual: { intensity: 1, flag: 'aigov' },
    copy: 'Governação de IA mexeu-se. É o teu terreno — vale a pena olhar hoje.',
    favours: ['oficio'],
    mobile: 'full',
    reducedMotion: 'still',
  },
  {
    id: 'ai-risk-overdue',
    name: 'Risco de IA por rever',
    layer: 'behaviour',
    priority: 'notable',
    /* O ÚNICO evento que lê o inventário, e por isso o único que hoje não
       acende — o inventário ainda não existe. Está aqui, e não em
       POR_IMPLEMENTAR, porque a diferença é real: os outros catorze precisam
       de dados que ninguém sabe como recolher; este precisa de dados que o
       Daniel pode escrever hoje. A regra está pronta e à espera. */
    trigger: ({ S }) => {
      const inv = readAi(S);
      if (inv.absence) return null;
      const criticos = inv.personalDataUnassessed.length;
      const atrasados = inv.overdue.length;
      if (!criticos && !atrasados) return null;
      const partes = [];
      if (criticos) partes.push(`${criticos} a tocar dados pessoais sem avaliação`);
      if (atrasados) partes.push(`${atrasados} com revisão em atraso`);
      return { source: 'inventário de IA', fact: partes.join(' e '), date: today() };
    },
    visual: { intensity: 0.9, flag: 'airisk' },
    copy: 'O inventário de IA tem dívida. Não é urgente hoje; é o que fica por explicar amanhã.',
    favours: ['oficio', 'disciplina'],
    mobile: 'full',
    reducedMotion: 'still',
  },
];

/**
 * O que o SPEC nomeia e ainda não pode existir, com o que falta a cada um.
 *
 * Isto não é uma lista de tarefas — é a resposta à pergunta "porque é que o
 * motor não tem o evento X". Cada linha é um buraco de DADOS, não de código:
 * escrever o `trigger` é meia hora; ter o facto datado que ele lê é a missão.
 */
export const POR_IMPLEMENTAR: readonly { id: string; falta: string }[] = [
  { id: 'starbirth', falta: 'já existe no Universo como estrela; falta decidir se o mundo inteiro deve reagir a um nível, ou só o céu' },
  { id: 'supernova-rare', falta: 'não há definição de o que é raro — sem critério, "raro" é uma opinião' },
  { id: 'boss-gate', falta: 'não há marcos de arco guardados. É o mesmo buraco que deixa `milestone` e `climax` inalcançáveis no `ArcState` da M26' },
  { id: 'mentor-signal', falta: 'não há registo datado de contacto com mentores' },
  { id: 'oracle-prophecy', falta: 'as profecias existem no Oráculo; falta o gancho que as faz alterar o mundo' },
  { id: 'eclipse-protocol', falta: 'não há calendário astronómico nem configuração dele. O SPEC proíbe hardcodar datas eternas' },
  { id: 'exam-siege', falta: 'o domínio não distingue um exame de um prazo qualquer' },
  { id: 'shadow-audit', falta: 'não há definição de quando uma auditoria interna é devida' },
  { id: 'easter-light', falta: 'data móvel — exige o cálculo ou a configuração que o SPEC manda, e nenhum existe' },
  { id: 'return-protocol', falta: 'não há registo de ausência prolongada distinta de silêncio' },
  { id: 'deep-work-descent', falta: 'não há medição de sessões longas de foco' },
  { id: 'winter-archive', falta: 'depende de arquivo sazonal, que a M28 traz' },
];
