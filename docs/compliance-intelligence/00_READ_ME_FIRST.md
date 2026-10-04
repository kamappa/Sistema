# 00 · LER PRIMEIRO

**Missão 31 — Compliance Intelligence Operating System**

**ESTADO: VISÃO REGISTADA — IMPLEMENTAÇÃO NÃO AUTORIZADA**

---

## O que esta pasta é

Uma **visão registada**. Não é um plano aprovado, não é uma especificação de
execução e não autoriza uma única linha de código.

Existe porque uma conversa com uma profissional sénior de privacidade e
segurança da informação — advogada, encarregada de proteção de dados de várias
organizações e auditora líder de sistemas de gestão de segurança da informação —
mostrou trabalho repetitivo real, com modelos e critérios reais por trás. Essa
conversa vale mais do que uma ideia: vale um problema observado.

Registar isto agora impede duas perdas. A primeira é o esquecimento — uma ideia
desta dimensão não sobrevive a três sessões de trabalho noutra coisa. A segunda
é pior: começar a construí-la de improviso, sem governação, com documentos
jurídicos reais de terceiros a passar por um protótipo pessoal.

## O que esta pasta NÃO é

- não é autorização para instalar dependências, criar agentes, ligar
  orquestradores ou consumir APIs;
- não é uma promessa de que o Sistema vai substituir advogados, DPOs ou
  auditores;
- não é um sítio para guardar documentos, modelos ou dados de clientes.

## Ordem de leitura

| # | ficheiro | responde a |
|---|---|---|
| 01 | `01_VISION_AND_VALUE_PROPOSITION.md` | porquê, e para quem |
| 02 | `02_AUTHORITY_AND_SOURCE_GOVERNANCE.md` | o que conta como fonte |
| 03 | `03_KNOWLEDGE_OBJECT_MODEL.md` | como o conhecimento é guardado |
| 04 | `04_AGENT_REGISTRY.md` | que agentes existem e o que podem fazer |
| 05 | `05_REGULATORY_UPDATE_PIPELINE.md` | como o conhecimento se mantém atual |
| 06 | `06_WORKFLOW_CATALOGUE.md` | como um caso corre do início ao fim |
| 07 | `07_DOCUMENT_AND_TEMPLATE_CATALOGUE.md` | que documentos são tratados |
| 08 | `08_HUMAN_APPROVAL_AND_LEGAL_SAFETY.md` | quem decide o quê |
| 09 | `09_MEMORY_AND_CONTROLLED_LEARNING.md` | como melhora sem se descontrolar |
| 10 | `10_EVALUATION_AND_AUDIT.md` | como se sabe se vale a pena |
| 11 | `11_PRIVACY_SECURITY_AND_TENANCY.md` | como não se torna o próprio risco |
| 12 | `12_ORCHESTRATION_ARCHITECTURE.md` | contratos independentes de runtime |
| 13 | `13_COST_AND_MODEL_ROUTING.md` | quanto custa e como se controla |
| 14 | `14_PILOT_PROPOSAL.md` | o que se demonstra primeiro |
| 15 | `15_PHASED_ROADMAP.md` | por que ordem |
| 16 | `16_ACCEPTANCE_GATES.md` | o que tem de existir antes de começar |

O documento de entrada, na raiz do repositório, é
`COMPLIANCE-INTELLIGENCE-MISSION.md`.

## Precedência

Esta pasta é **documentação de missão** — nível 9 na lista de precedência do
`CLAUDE.md`. Perde para segurança e legalidade, para o Daniel, para a
`SYSTEM-ORACLE-CONSTITUTION.md`, para o `CLAUDE.md`, para o
`SPEC-CLAUDE-CODE.md`, para o `SYSTEM-EVOLUTION-ROADMAP.md` e para
`docs/oracle-governance/`.

Isso não é uma formalidade. As regras invioláveis do Oráculo — não aumentar
autonomia sem política, não criar memória silenciosa, não conceder permissões a
agentes sem registry, não executar ações externas críticas sem consentimento,
não confundir tarefa delegada com tarefa concluída — **aplicam-se inteiras a
esta missão**, e esta missão é precisamente o tipo de trabalho onde a tentação
de as contornar é maior.

## A frase que governa a missão

> Nenhum profissional deve trabalhar para alimentar a IA. A IA deve aprender a
> partir do trabalho de revisão que os profissionais já teriam de fazer.

## O aviso mais importante deste documento

Vários factos regulatórios discutidos na conversa de origem estão registados
nestes ficheiros como **NÃO VERIFICADOS**. Datas de transposição, números de
diploma, versões de normas ISO e calendários de aplicação do AI Act aparecem
marcados como tal de propósito.

Não é falta de rigor — é a primeira aplicação da própria missão. Um sistema
cuja proposta de valor é *"nunca apresentamos uma conclusão sem saber a data, a
jurisdição, a versão e a fonte"* não pode nascer de um documento que afirma
datas de cabeça. Ver `02_AUTHORITY_AND_SOURCE_GOVERNANCE.md`.
