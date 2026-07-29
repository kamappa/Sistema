/* Registo de zonas da Sala de Operações — Missão 26 · Fase 2.
 *
 * DATA-DRIVEN de propósito. A associação painel→zona é uma decisão de
 * composição que vai mudar quando o Daniel vir a moldura a funcionar; mudá-la
 * tem de ser editar esta tabela, nunca mexer na estrutura dos componentes.
 *
 * Os 19 painéis entram tal como estão, sem uma única edição interna. Esta fase
 * é a MOLDURA, não o recheio.
 */

import type { ComponentType } from 'react';

import Greet from '../components/Greet.jsx';
import Hero from '../components/Hero.jsx';
import World from '../components/World.jsx';
import RadarNews from '../components/RadarNews.jsx';
import Attributes from '../components/Attributes.jsx';
import Radar from '../components/Radar.jsx';
import Constellations from '../components/Constellations.jsx';
import Titles from '../components/Titles.jsx';
import Achievements from '../components/Achievements.jsx';
import Diario from '../components/Diario.jsx';
import Objectives from '../components/Objectives.jsx';
import Shadows from '../components/Shadows.jsx';
import Recall from '../components/Recall.jsx';
import Training from '../components/Training.jsx';
import Sleep from '../components/Sleep.jsx';
import Calendar from '../components/Calendar.jsx';
import OracleReport from '../components/OracleReport.jsx';
import Conselho from '../components/Conselho.jsx';
import KnowledgeMap from '../components/KnowledgeMap.jsx';
import Debuffs from '../components/Debuffs.jsx';
import NextAction from './core/NextAction';
import CoreQueue from './core/CoreQueue';
import CoreHorizon from './core/CoreHorizon';

/* O `DeadlineBanner` saiu do registo na Fase 5 e o componente NÃO foi apagado.
 *
 * Porquê saiu: era uma faixa vermelha à largura toda, a coisa mais brilhante do
 * Núcleo, e não era acionável — anunciava "URGENTE" e deixava o Operador a
 * procurar onde resolver. A informação que ela dava está inteira noutros dois
 * sítios, e agora com verbo: as missões urgentes tornaram-se a Próxima Ação; os
 * eventos a ≤7 dias tornaram-se a secção "Horizonte" do CoreQueue.
 *
 * Porquê não foi apagado: continua a ser usado pelo HUD sem `?shell=`, que é o
 * que serve produção. Apagá-lo partia a frontend que está em `main`.
 */

export type ZoneId =
  | 'core'
  | 'radar'
  | 'operations'
  | 'universe'
  | 'oracle'
  | 'reflection';

/** Os painéis são .jsx sem tipos. A maioria recebe `S`; alguns (Conselho,
 *  OracleReport, Constellations) não recebem props e ignoram-na — em React uma
 *  função com menos parâmetros continua a ser um componente válido aqui. */
type PanelComponent = ComponentType<{ S: any }>;

/**
 * Densidade da zona — a decisão que a Fase 2 provou ser necessária.
 *
 * A B2 pura aplicava a mesma medida de leitura (68ch) a todas as zonas. No
 * Núcleo isso é elegante; em Operações estrangulava os painéis a 277px e
 * desperdiçava 797px de cada lado, com os hábitos a quebrar linha. A B2 não
 * tinha um problema de conceito — tinha uma medida única.
 *
 *   reading    — leitura e contemplação: medida editorial, respiração, uma
 *                coluna. Núcleo, Oráculo, Reflexão.
 *   instrument — leitura de instrumento: usa a largura disponível, permite
 *                colunas quando a informação o justifica, divisões
 *                arquitetónicas discretas. Radar, Operações, Universo.
 */
export type ZoneDensity = 'reading' | 'instrument';

/**
 * Grupo de painéis dentro de uma zona. É o que torna Operações um instrumento
 * em vez de uma página longa: os sete painéis passam a ter uma organização
 * funcional em vez de uma ordem arbitrária.
 *
 * `weight` governa a composição em zonas `instrument`:
 *   main — coluna principal, mais larga
 *   side — coluna de apoio
 *   full — atravessa a largura toda, por baixo das duas
 * Em zonas `reading` o peso é ignorado: tudo empilha na medida editorial.
 */
export interface ZoneGroup {
  id: string;
  /** Micro-label em mono. Ausente = grupo sem cabeçalho. */
  name?: string;
  weight: 'main' | 'side' | 'full';
  panels: PanelComponent[];
}

export interface Zone {
  id: ZoneId;
  /** Nome apresentado. Curto — vai em Rajdhani, reservado a identidade. */
  name: string;
  /** Uma linha que diz o que a zona É. Aparece ao entrar, não permanentemente. */
  purpose: string;
  density: ZoneDensity;
  /**
   * Razão entre as colunas, só em zonas `instrument`. Ausente = o padrão
   * (1.55fr / 1fr), que serve as zonas onde a coluna principal é a lista longa.
   *
   * Existe porque o Núcleo inverte a relação: ali a coluna de apoio é que
   * carrega a ação dominante, e o retrato do Operador não pode ser a coisa mais
   * larga do ecrã. É um DADO de composição — a alternativa era uma condição por
   * nome de zona no CSS, que é precisamente o que este registo evita.
   */
  columns?: string;
  groups: ZoneGroup[];
}

export const ZONES: Zone[] = [
  {
    id: 'core',
    name: 'Núcleo',
    purpose: 'O estado do Operador e a próxima ação.',
    // Missão 26 · Fase 5 — o Núcleo deixa de ser uma coluna de leitura.
    //
    // Como `reading`, os quatro painéis empilhavam-se numa faixa e a metade
    // direita do ecrã ficava sem função — item 1 do diagnóstico. A zona não é
    // prosa: é um instrumento com duas naturezas de informação, e a estrutura
    // tem de o dizer.
    //
    //   ESTADO (esquerda)  — quem é o Operador e em que mundo está. Lê-se.
    //   AÇÃO   (direita)   — o que fazer agora e o que espera. Executa-se.
    //
    // A razão de colunas está invertida face às outras zonas instrumentais: a
    // ação é mais larga do que o estado, porque é ela que domina.
    density: 'instrument',
    columns: 'minmax(0, 1fr) minmax(0, 1.25fr)',
    groups: [
      { id: 'estado', name: 'Estado', weight: 'main', panels: [Greet, Hero, World, CoreHorizon] },
      { id: 'accao', name: 'Ação', weight: 'side', panels: [NextAction, CoreQueue] },
    ],
  },
  {
    id: 'radar',
    name: 'Radar',
    purpose: 'Sinais, oportunidades e o mundo filtrado para ti.',
    density: 'instrument',
    groups: [{ id: 'sinais', weight: 'full', panels: [RadarNews] }],
  },
  {
    id: 'operations',
    name: 'Operações',
    purpose: 'Missões, hábitos, estudo, treino e sono.',
    density: 'instrument',
    // Organização FUNCIONAL, não a ordem em que os painéis foram migrados.
    // Calendário aqui por decisão do Daniel (2026-07-25).
    //
    // A atribuição de peso segue o APETITE DE LARGURA de cada painel, apurado
    // na medição: o Diário traz do HUD antigo a sua própria grelha `.cols` de
    // duas colunas e parte-se ao meio se ficar numa coluna estreita; as
    // Missões precisam de largura para título + chips + filtros numa linha;
    // Treino e Sono são formulários compactos e vivem bem estreitos.
    groups: [
      { id: 'prioridade', name: 'Prioridade', weight: 'main', panels: [Objectives, Shadows] },
      { id: 'rotina', name: 'Rotina e execução', weight: 'side', panels: [Diario, Training] },
      { id: 'revisao', name: 'Revisão e recuperação', weight: 'full', panels: [Recall, Sleep, Calendar] },
    ],
  },
  {
    id: 'universe',
    name: 'Universo',
    purpose: 'A evidência tornada céu.',
    density: 'instrument',
    groups: [
      { id: 'ceu', weight: 'full', panels: [Constellations] },
      { id: 'dominios', name: 'Domínios', weight: 'main', panels: [Attributes] },
      { id: 'equilibrio', name: 'Equilíbrio', weight: 'side', panels: [Radar] },
      { id: 'evidencia', name: 'Evidência', weight: 'full', panels: [Titles, Achievements] },
    ],
  },
  {
    id: 'oracle',
    name: 'Oráculo',
    purpose: 'Interpretação, orientação e decisões.',
    density: 'reading',
    // Mapa de Conhecimento aqui e não no Universo: tem expressão visual
    // cósmica, mas a função principal é interpretar e orientar.
    groups: [{ id: 'leitura', weight: 'main', panels: [OracleReport, Conselho, KnowledgeMap] }],
  },
  {
    id: 'reflection',
    name: 'Reflexão',
    purpose: 'Memória, debrief e o que o Sistema aprendeu contigo.',
    density: 'reading',
    groups: [{ id: 'estados', weight: 'main', panels: [Debuffs] }],
  },
];

export const DEFAULT_ZONE: ZoneId = 'core';

export function zoneById(id: ZoneId): Zone {
  const z = ZONES.find((x) => x.id === id);
  if (!z) throw new Error(`zona desconhecida: ${id}`);
  return z;
}
