/* VAULT RESONANCE — o contrato do pulso.
 * Missão 28 · Fase 1. Extensão das Missões 8, 17 e 22.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O ACHADO QUE DEFINE ESTA FASE                                       ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * A visão da missão é: *"enquanto o Daniel toma notas no Obsidian, fragmentos
 * reais de conhecimento atravessam o Sistema e convergem para o Núcleo."*
 *
 * Ao ir ver o que o Sistema sabe do Vault, apareceu isto:
 *
 *   A Edge Function do Oráculo **já lê o vault e já calcula exatamente o que
 *   esta missão precisa** — `vaultChanges()` devolve os ficheiros alterados e
 *   os commits com data e mensagem. Depois **deita tudo fora**: transforma-os
 *   em prosa para o modelo ler, e o cliente recebe uma só string (`r.estudo`)
 *   dentro do relatório semanal.
 *
 * Ou seja: a prova existe, é datada, é por ficheiro, e morre no servidor.
 *
 * O que o cliente tem hoje é um parágrafo. Desenhar fragmentos a convergir a
 * partir de um parágrafo seria inventar origem, data e peso — exatamente a
 * fabricação que a lei "nada nasce do nada" proíbe. Um fragmento sem ficheiro
 * e sem data é uma partícula decorativa com nome bonito.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O QUE ESTA FASE FAZ                                                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Define o contrato do lado do cliente e o read model que o consome, para que
 * a mudança do lado do produtor seja **pequena e verificável** quando for
 * autorizada — e não uma reescrita.
 *
 * Hoje o read model devolve honestamente "sem dados", e diz porquê. Não
 * inventa pulsos a partir da prosa.
 *
 * O QUE FALTA, e é UMA alteração à Edge Function, que é produção e exige gate:
 * persistir `vaultChanges()` em vez de o descartar. Ver `vault-read.ts`.
 */

import type { DomainId } from '../../types/domain';

/** Um pulso: uma alteração real e datada numa nota do vault.
 *
 *  Todos os campos exceto `domain` são obrigatórios — um pulso sem ficheiro ou
 *  sem data não é um pulso, é uma animação. */
export interface VaultPulse {
  /** Caminho da nota dentro de `Sistema/Estudo/`. É a identidade e a origem. */
  path: string;
  /** Instante do commit, em ISO. É a prova de QUANDO. */
  at: string;
  /** Mensagem do commit. É a prova de O QUÊ, nas palavras de quem escreveu. */
  msg: string;
  /**
   * Domínio a que a nota pertence, quando se consegue saber.
   *
   * **Opcional de propósito.** Derivar o domínio do caminho é uma heurística, e
   * uma heurística que falha em silêncio dá a uma partícula um destino errado
   * no céu. Sem domínio, o pulso converge para o Núcleo sem passar por uma
   * constelação — o que é verdade, e não um erro.
   */
  domain?: DomainId;
}

/** O que o Núcleo recebe. */
export interface VaultResonance {
  /** Pulsos ordenados do mais recente para o mais antigo. */
  pulses: VaultPulse[];
  /** Quantas notas distintas — não commits. Dez commits na mesma nota são uma
   *  nota trabalhada, não dez conhecimentos. */
  notes: number;
  /** Instante do pulso mais recente, ou `null`. */
  latest: string | null;
  /**
   * Porque é que não há dados, quando não há. Uma string vazia significa que há.
   *
   * Existe porque "sem dados" e "avariado" parecem iguais no ecrã, e a lei diz
   * que o Sistema nunca mente — incluindo sobre si próprio.
   */
  absence: string;
}

/** Onde o estado guardaria os pulsos, quando existirem. Declarado aqui para
 *  haver um só nome; hoje nenhuma parte do Sistema escreve nesta chave. */
export const VAULT_PULSES_KEY = 'vaultPulses' as const;

/**
 * O que falta do lado do produtor, escrito com precisão para não se perder.
 *
 * NÃO É UMA TAREFA PARA FAZER AGORA: a Edge Function é produção e exige gate
 * explícito do Daniel. Fica aqui para que a decisão seja tomada com o custo à
 * frente, e não à procura dele.
 */
export const LACUNA_DO_PRODUTOR = {
  onde: 'supabase/functions/oraculo/index.ts',
  jaCalcula: 'vaultChanges(since) → { files: string[], commits: [{ d, msg }] }',
  descarta: 'converte em prosa para o modelo e devolve só `estudo` no relatório',
  precisa: 'persistir os pulsos — no `app_state` do próprio relatório ou numa tabela — com caminho, data e mensagem por commit',
  custo: 'uma alteração pequena, mas em produção: exige gate',
  porqueNaoAgora: 'alterar a Edge Function sem autorização violaria a regra de ouro do projeto e o gate de produção da Constituição',
} as const;
