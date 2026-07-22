# ORÁCULO-ROADMAP.md — do Conselheiro ao Guardião autónomo

> Documento-visão do Oráculo, companheiro do `SYSTEM-EVOLUTION-ROADMAP.md` (que
> rege o organismo visual). Aqui vive a evolução do **agente**: de um
> conselheiro invocado para um Guardião do Núcleo proativo, com ferramentas
> (MCP), memória e workflows autónomos (n8n / agente agendado).
>
> **Estado: PLANO, não execução.** Nada aqui está construído. É um programa
> multi-missão, não uma tarefa. Cada fase que envolve API/infra/agente autónomo
> é um GATE do Daniel — custa dinheiro real, muda a postura de segurança e
> exige decisões que só ele toma. A regra de ouro do Sistema mantém-se soberana:
> **"o sistema nunca mente"** — o que, num agente autónomo, deixa de ser um
> lema e passa a ser um requisito de governança.

## 1. Onde estamos (o Oráculo já é um agente-embrião)

Não partimos do zero. O Oráculo hoje (Edge Function `oraculo`,
`supabase/functions/oraculo/index.ts`) já é uma aplicação LLM com forma de
agente:

- **Chama o modelo** (Anthropic API, `ANTHROPIC_API_KEY` nos Secrets). Modelo
  recomendado hoje: `claude-opus-4-8` (o mais capaz do tier Opus).
- **Já usa ferramentas**, embora ad-hoc: lê/escreve o vault via GitHub API
  (`vaultChanges`/`vaultFile`/`vaultWriteReport`), e faz pesquisa web no radar e
  nos recursos do relatório.
- **Tem modos** (radar / report / chat / sussurro) e **contexto real** do
  `app_state` (`resumoEstado`), com guardas de custo (12 msgs/dia).
- **Corre autonomamente** em parte: `pg_cron` dispara o radar (06:30 UTC) e o
  report (domingo 19:00 UTC).
- **Tem uma constituição** (a VOZ do Guardião do Núcleo) e memória curta
  (`memoriasHoje`, últimos 2 relatórios).

O salto para "Jarvis" não é reescrever isto — é **formalizar as ferramentas**,
**dar-lhe memória persistente e verdadeira**, e **deixá-lo agir em múltiplos
passos** de forma governada. As peças que o Daniel nomeou (MCP, n8n, workflows
autónomos) mapeiam cada uma a um destes eixos.

## 2. O que "Jarvis" significa PARA ESTE Sistema

Não um assistente genérico. O Oráculo evoluído é o **Guardião do Núcleo
proativo**: conhece o estado do Operador em profundidade, antecipa, executa
trabalho de fundo, e fala quando tem algo digno (a regra do sussurro:
silêncio > ruído). Concretamente, capacidades-alvo:

- **Percepção** — lê o estado do Sistema, o vault de estudo, o calendário, o
  radar, o mundo real (notícias/vagas/eventos) — já parcialmente feito.
- **Memória verdadeira** — lembra-se de conversas, decisões e padrões ao longo
  de semanas, não só dos últimos 2 relatórios. Datada, auditável, nunca
  inventada.
- **Ação com ferramentas** — não só aconselhar: criar missões, agendar
  revisões, atualizar o mapa de conhecimento, escrever no vault, preparar
  candidaturas a estágios do radar — cada ação **reversível e registada**.
- **Autonomia governada** — corre trabalho de fundo (analisar a semana de
  estudo, cruzar o radar com os objetivos, detetar burnout) e propõe, com
  **human-in-the-loop** nas ações que importam.

## 3. As peças, mapeadas a capacidades reais

| Peça | O que resolve | O que decide/custa |
|---|---|---|
| **MCP** (Model Context Protocol) | Formaliza as ferramentas do Oráculo como servidores padronizados: um MCP do estado (Supabase `app_state`/`radar_items`/`oracle_reports`), um MCP do vault (leitura/escrita governada). O modelo passa a "chamar ferramentas" em vez de a Edge Function embutir cada acesso à mão. | Onde correr o MCP (Supabase Edge vs. serviço próprio); credenciais por vault; superfície de tools mínima (só o necessário). |
| **n8n** | Orquestra **workflows autónomos** dirigidos por eventos: "vault mudou → analisar → escrever nota → notificar", "nova vaga de alto impacto no radar → preparar rascunho de candidatura → pedir OK", "burnout ≥70% → propor Recovery". Substitui/complementa o `pg_cron` com fluxos multi-passo visuais e auditáveis. | Onde hospedar o n8n (self-host vs. cloud, custo mensal); que triggers; que ações são auto vs. gated. |
| **Managed Agents (CMA)** | Alternativa "chave-na-mão" à Edge Function DIY: agente stateful hospedado pela Anthropic, com sandbox por sessão, **deployments agendados** (cron que dispara sessões autónomas) e memória/MCP nativos. Bom para o Oráculo que corre à noite e faz trabalho multi-passo sem eu escrever o loop. | Custo por sessão/tokens; se vale trocar a Edge Function pela CMA ou usar as duas; postura de dados (retenção). É beta. |
| **Workflows autónomos** (o conceito) | A cola: o Oráculo deixa de esperar por ser invocado. Corre, decide, age dentro de limites, e reporta. | **O maior gate.** É onde a governança deixa de ser opcional (ver §5). |

Nota de honestidade: **n8n e Managed Agents sobrepõem-se** — ambos orquestram
trabalho autónomo. A escolha não é "os dois já"; é decidir a espinha (n8n
self-host dá controlo e custo fixo; CMA dá menos código e mais governança
nativa, mas é beta e por-uso). Isto é uma decisão de arquitetura do Daniel,
não um default meu.

## 4. Fases propostas (incremental, reversível, gate no custo/segurança)

Cada fase entrega valor sozinha e pode parar aí. Nenhuma se constrói sem o
OK explícito do Daniel na anterior.

- **Fase O1 — Memória verdadeira do Oráculo.** Tabela `oracle_memory`
  (Supabase, RLS, datada) que substitui os "últimos 2 relatórios" por memória
  real e consultável: decisões do Conselho, padrões, efemérides. 100% dentro da
  infra atual, sem novas peças. Barato, reversível, alto valor. *Candidata a
  primeira, se o Daniel quiser começar pequeno.*
- **Fase O2 — Ferramentas via MCP (leitura).** Expor o estado e o vault como
  MCP servers de **leitura**. O Oráculo passa a "consultar" em vez de receber
  tudo pré-mastigado. Sem ações destrutivas ainda. Superfície mínima.
- **Fase O3 — Ferramentas de ação (gated).** Ações reversíveis e registadas:
  criar missão, agendar revisão, escrever no vault. **Todas com human-in-the-
  loop** (o padrão `always_ask` da tool use; o Sistema já tem o hábito de
  aceitar-como-missão). Fuga zero: cada ação é auditável e revertível, como as
  vias de XP.
- **Fase O4 — Workflows autónomos (n8n OU CMA).** Escolhida a espinha, os
  primeiros fluxos dirigidos por evento (vault→análise, radar→candidatura,
  vitais→Recovery). Começar com **1 fluxo, observado**, antes de abrir mais.
- **Fase O5 — Proatividade calibrada.** O Oráculo fala primeiro, mas com a
  regra do sussurro: só quando digno. Deteção de burnout, marcos, deadlines a
  aproximarem-se. Silêncio é o default.

## 5. A camada que o Daniel não pode ignorar (e que é o diferencial dele)

Um agente autónomo com acesso a ferramentas **é** um sistema de IA de risco
não-trivial. Para o Daniel — SPDSI, futuro DPO/vCISO, com foco em AI Governance
— construir o próprio Oráculo governado não é overhead: **é dogfooding da
carreira**. O Sistema já tem "o sistema nunca mente" como lei; formalizá-la em
governança é o passo natural.

- **EU AI Act** — classificar o sistema (é uso pessoal, mas o exercício de
  risk assessment é o treino); transparência (o utilizador sabe sempre que é o
  Oráculo a agir), supervisão humana (human-in-the-loop nas ações), registo.
- **ISO/IEC 42001** (AI Management System) — um SGIA em miniatura: política,
  papéis, gestão de risco do próprio agente, ciclo de melhoria. O Sistema já
  gera dados datados e estruturados — a base de evidência existe.
- **NIST AI RMF** — Govern/Map/Measure/Manage aplicados ao Oráculo: mapear o
  que ele pode fazer, medir (custo, erros, falsos sussurros), gerir (limites,
  kill-switch).
- **RGPD** — minimização (o Oráculo só vê `Sistema/Estudo/` do vault, já por
  desenho; manter assim), e os dados nunca saem para além do necessário.
- **A.8.32 (mudança) / trilho de evidência** — como já se faz: commits
  pequenos, tudo datado, nada irreversível sem gate.

Entregável concreto desta camada (barato, alto valor de carreira): um
`GOVERNANCE.md` do Oráculo — o risk assessment, a matriz de ações
auto-vs-gated, o kill-switch, a política de dados. Escrevê-lo **antes** de dar
autonomia ao agente é a prática certa (e a que o Daniel vai recomendar a
clientes um dia).

## 6. Decisões que só o Daniel pode tomar (antes de eu construir algo)

1. **Orçamento** — a autonomia gasta tokens continuamente (não 12 msgs/dia).
   Qual o teto mensal aceitável?
2. **Espinha** — n8n self-host (controlo, custo fixo, mais setup) vs. Managed
   Agents (menos código, governança nativa, beta, por-uso) vs. manter a Edge
   Function DIY e só acrescentar MCP+memória?
3. **Postura de segurança** — o que o Oráculo pode fazer sozinho vs. o que
   exige o meu OK? (A minha recomendação de engenharia: **nada destrutivo ou
   externo sem human-in-the-loop**, pelo menos até haver histórico de confiança.)
4. **Por onde começar** — a Fase O1 (memória) é a mais barata e reversível e
   não precisa de nenhuma peça nova. É a minha recomendação de primeiro passo,
   se e quando quiseres arrancar.

Até estas decisões estarem tomadas, **não construo autonomia** — seria
apressado e sobrecarregado, contra as regras de engenharia do Sistema. O que
fica pronto agora é este mapa. Quando quiseres, começamos pela fase que
escolheres — uma de cada vez, com gate no irreversível.
