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
import DeadlineBanner from '../components/DeadlineBanner.jsx';
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

export interface Zone {
  id: ZoneId;
  /** Nome apresentado. Curto — vai em Rajdhani, reservado a identidade. */
  name: string;
  /** Uma linha que diz o que a zona É. Aparece ao entrar, não permanentemente. */
  purpose: string;
  panels: PanelComponent[];
}

export const ZONES: Zone[] = [
  {
    id: 'core',
    name: 'Núcleo',
    purpose: 'O estado do Operador e a próxima ação.',
    panels: [Greet, DeadlineBanner, Hero, World],
  },
  {
    id: 'radar',
    name: 'Radar',
    purpose: 'Sinais, oportunidades e o mundo filtrado para ti.',
    panels: [RadarNews],
  },
  {
    id: 'operations',
    name: 'Operações',
    purpose: 'Missões, hábitos, estudo, treino e sono.',
    // Calendário aqui por decisão do Daniel (2026-07-25). Pode mais tarde ter
    // uma vista resumida no Núcleo — sem sair daqui.
    panels: [Diario, Objectives, Shadows, Recall, Training, Sleep, Calendar],
  },
  {
    id: 'universe',
    name: 'Universo',
    purpose: 'A evidência tornada céu.',
    panels: [Attributes, Radar, Constellations, Titles, Achievements],
  },
  {
    id: 'oracle',
    name: 'Oráculo',
    purpose: 'Interpretação, orientação e decisões.',
    // Mapa de Conhecimento aqui e não no Universo: tem expressão visual
    // cósmica, mas a função principal é interpretar e orientar.
    panels: [OracleReport, Conselho, KnowledgeMap],
  },
  {
    id: 'reflection',
    name: 'Reflexão',
    purpose: 'Memória, debrief e o que o Sistema aprendeu contigo.',
    panels: [Debuffs],
  },
];

export const DEFAULT_ZONE: ZoneId = 'core';

export function zoneById(id: ZoneId): Zone {
  const z = ZONES.find((x) => x.id === id);
  if (!z) throw new Error(`zona desconhecida: ${id}`);
  return z;
}
