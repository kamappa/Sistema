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
/* Training e Sleep saíram do registo na Fase 7 e os componentes ficam: são
 * importados pelo `BodySpace`, que os monta dentro do subespaço, e continuam a
 * servir o HUD sem `?shell=`, que é o que está em produção. */
import Calendar from '../components/Calendar.jsx';
/* O `OracleReport` saiu do registo na Fase 6B e o componente fica — serve o
 * HUD sem `?shell=`, que é o que está em produção. */
import OracleReportLayered from './oracle/OracleReportLayered';
import Conselho from '../components/Conselho.jsx';
import KnowledgeMap from '../components/KnowledgeMap.jsx';
/* O `Debuffs` saiu do registo na Fase 8 e o componente NÃO foi apagado —
 * continua a servir o HUD sem `?shell=`, que é o que está em produção. A
 * Reflexão passou a ler os mesmos `S.debuffs` por outra apresentação. */
import NextAction from './core/NextAction';
import CoreQueue from './core/CoreQueue';
import CoreHorizon from './core/CoreHorizon';
import CoreOracle from './core/CoreOracle';
import { ReflectionNow, ReflectionPatterns, ReflectionMemory } from './reflection/Reflection';
import BodySpace from './body/BodySpace';
import Universe from './universe/Universe';

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
      // A coluna é um instrumento do SISTEMA; o `CoreOracle` é o único bloco
      // dela que fala como Oráculo, e está entre o visor e a fila de propósito
      // — interpreta o que está em cima antes de se mostrar o que espera.
      { id: 'accao', name: 'Ação', weight: 'side', panels: [NextAction, CoreOracle, CoreQueue] },
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
      { id: 'rotina', name: 'Rotina e execução', weight: 'side', panels: [Diario] },
      // Missão 26 · Fase 7 — Treino e Sono saem daqui e passam a viver dentro
      // do subespaço Corpo e Recuperação, com o pavimento pélvico e a
      // mobilidade da mandíbula e pescoço. Pertencem todos ao mesmo ciclo de
      // carga e recuperação, e estavam espalhados por uma zona onde competiam
      // com missões e calendário.
      //
      // A órbita continua com SEIS marcas: isto é um subespaço, não uma zona.
      { id: 'corpo', name: 'Corpo e recuperação', weight: 'side', panels: [BodySpace] },
      { id: 'revisao', name: 'Revisão e planeamento', weight: 'full', panels: [Recall, Calendar] },
    ],
  },
  {
    id: 'universe',
    name: 'Universo',
    purpose: 'A evidência tornada céu.',
    density: 'instrument',
    // Missão 26 · Fase 6C — a INVERSÃO. O campo celeste abre a zona; a lista
    // de seis barras desce para instrumento secundário. Nenhuma foi apagada:
    // o campo mostra a forma e as relações, a lista mostra os números, e uma
    // cosmologia sem números seria bonita e inútil.
    groups: [
      { id: 'campo', weight: 'full', panels: [Universe] },
      { id: 'ceu', weight: 'full', panels: [Constellations] },
      { id: 'dominios', name: 'Domínios · detalhe', weight: 'main', panels: [Attributes] },
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
    // Missão 26 · Fase 6B — o relatório passa à apresentação por camadas.
    // O `OracleReport` original fica: serve o HUD sem `?shell=`, que é o que
    // está em produção, e nenhum campo foi removido dele.
    groups: [{ id: 'leitura', weight: 'main', panels: [OracleReportLayered, Conselho, KnowledgeMap] }],
  },
  {
    id: 'reflection',
    name: 'Reflexão',
    purpose: 'Memória, debrief e o que o Sistema aprendeu contigo.',
    // Missão 26 · Fase 8 — a zona prometia memória, debrief e aprendizagem e
    // entregava quatro interruptores numa lista vazia. O diagnóstico do Daniel
    // foi mais fundo do que o visual: a FUNÇÃO não estava definida.
    //
    // Passa a Observatório Interior, em duas naturezas:
    //   OBSERVAÇÃO (esquerda) — o que os dados mostram agora e o que reparas
    //                           em ti. Lê-se e regista-se.
    //   MEMÓRIA    (direita)  — o que já aconteceu, o que assumiste, o que
    //                           ficou provado, e a leitura do Oráculo.
    //
    // O `Debuffs` original NÃO foi apagado: continua a servir o HUD sem
    // `?shell=`, que é o que está em produção.
    density: 'instrument',
    columns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
    groups: [
      { id: 'observacao', name: 'Observação', weight: 'main', panels: [ReflectionNow, ReflectionPatterns] },
      { id: 'memoria', name: 'Memória', weight: 'side', panels: [ReflectionMemory] },
    ],
  },
];

export const DEFAULT_ZONE: ZoneId = 'core';

export function zoneById(id: ZoneId): Zone {
  const z = ZONES.find((x) => x.id === id);
  if (!z) throw new Error(`zona desconhecida: ${id}`);
  return z;
}
