/* O SISTEMA INVENTARIA-SE A SI PRÓPRIO.
 * Missão 29 · Fase 3b.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  PORQUE É QUE ISTO EXISTE                                            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Um inventário de IA que não se inventaria a si próprio seria a primeira coisa
 * a falhar numa auditoria. E o Sistema **usa IA** em cinco sítios que estão
 * escritos no seu próprio código — não é uma opinião, é leitura de ficheiro.
 *
 * Pedir ao Operador que escreva à mão aquilo que o produto já sabe de si é o
 * mesmo erro que a Missão 31 identificou noutro contexto: *nenhum profissional
 * deve trabalhar para alimentar a IA*. O que o Sistema consegue provar, propõe.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  SÃO PROPOSTAS, NÃO REGISTOS                                         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Nada disto entra no inventário sozinho. Aparece como sugestão, com a origem
 * à frente, e **é o Operador que regista** — porque um inventário que se
 * preenche a si mesmo não é um inventário: é uma lista que ninguém leu.
 *
 * E entram sem avaliação de risco, como qualquer outro registo. O Sistema sabe
 * o que faz; **não sabe se isso é aceitável** — isso é julgamento, e o
 * julgamento é de quem audita.
 *
 * A `origem` de cada um aponta para o ficheiro e a linha onde a prova está.
 */

import type { AiUse } from './aiModel';

export interface AiSelfUse extends Omit<AiUse, 'id' | 'addedAt' | 'active'> {
  /** Onde no código está a prova de que este uso existe. */
  origem: string;
}

export const USOS_DO_SISTEMA: readonly AiSelfUse[] = [
  {
    name: 'Oráculo · Conselho',
    purpose: 'responder a perguntas sobre decisões, dúvidas e rumo',
    provider: 'Anthropic, via Edge Function',
    data: ['app_state (atributos, streaks, missões, sono, recall)', 'últimos 2 relatórios'],
    /* O `resumoEstado` envia o estado do Operador. É dado pessoal por
       definição — é a vida dele. */
    personalData: true,
    /* Corre e o Operador lê depois. Não há aprovação prévia. */
    oversight: 'depois',
    risk: 'por-avaliar',
    origem: 'supabase/functions/oraculo/index.ts · mode=chat',
  },
  {
    name: 'Oráculo · Relatório semanal',
    purpose: 'ler a semana e escrever a interpretação dela',
    provider: 'Anthropic, via Edge Function',
    data: ['app_state', 'notas do vault (Sistema/Estudo)'],
    /* Lê as notas de estudo do vault. Mais dados pessoais do que o Conselho,
       não menos. */
    personalData: true,
    oversight: 'depois',
    risk: 'por-avaliar',
    origem: 'supabase/functions/oraculo/index.ts · mode=report + vaultContextDeep',
  },
  {
    name: 'Oráculo · Radar',
    purpose: 'procurar notícias de ciber, NIS2, RGPD, ISO 27001 e IA',
    provider: 'Anthropic, com pesquisa web',
    data: ['consultas de pesquisa', 'URLs públicos'],
    /* A pesquisa envia temas, não o estado. É a diferença que a Missão 31
       chama "questão sanitizada". */
    personalData: false,
    oversight: 'depois',
    risk: 'por-avaliar',
    origem: 'supabase/functions/oraculo/index.ts · mode=radar + web_search',
  },
  {
    name: 'Oráculo · Vigia de Estágios',
    purpose: 'encontrar estágios e eventos no Norte e remoto',
    provider: 'Anthropic, com pesquisa web',
    data: ['consultas de pesquisa', 'URLs públicos'],
    personalData: false,
    /* Cria missões P1 automaticamente a partir do que encontra — e é por isso
       que "quem verifica" importa mais aqui do que no Radar. */
    oversight: 'depois',
    risk: 'por-avaliar',
    origem: 'supabase/functions/oraculo/index.ts · 2ª pesquisa da corrida do radar',
  },
  {
    name: 'Oráculo · Sussurro',
    purpose: 'uma linha por dia, do estado e da estação',
    provider: 'Anthropic, via Edge Function',
    data: ['app_state (resumo)'],
    personalData: true,
    oversight: 'depois',
    risk: 'por-avaliar',
    origem: 'supabase/functions/oraculo/index.ts · mode=sussurro',
  },
  {
    name: 'Claude Code',
    purpose: 'escrever, rever e verificar o código do próprio Sistema',
    provider: 'Anthropic',
    data: ['código do repositório', 'documentação de missões'],
    /* O repositório não contém dados pessoais do Operador — o estado vive no
       Supabase e no localStorage, nunca em ficheiros versionados. */
    personalData: false,
    /* Nada entra sem revisão e sem commit aprovado. É o único da lista com
       aprovação ANTES do efeito. */
    oversight: 'antes',
    risk: 'por-avaliar',
    origem: 'CLAUDE.md · regras de ouro: propor antes de alterar',
  },
];

/** Quais destes ainda não estão no inventário, comparando por nome.
 *
 *  Por NOME e não por id: os ids são gerados no registo e um uso registado à
 *  mão com o mesmo nome deve contar como já inventariado — senão o Sistema
 *  propunha para sempre uma coisa que o Operador já tinha escrito. */
export function porRegistar(uses: readonly { name: string }[]): AiSelfUse[] {
  const jaLa = new Set(uses.map((u) => u.name.trim().toLowerCase()));
  return USOS_DO_SISTEMA.filter((u) => !jaLa.has(u.name.trim().toLowerCase()));
}
