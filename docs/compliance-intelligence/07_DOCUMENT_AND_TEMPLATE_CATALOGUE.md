# 07 · Catálogo de documentos e modelos

> **Este catálogo é uma lista de TIPOS documentais.** Nenhum documento real,
> nenhum modelo proprietário e nenhum conteúdo de cliente entra neste
> repositório. Ver `11_PRIVACY_SECURITY_AND_TENANCY.md`.

Cada tipo tem, no sistema real: template versionado, playbook de preenchimento,
gold cases, nível de risco, revisão mínima exigida e ligação às regras de
conhecimento aplicáveis.

---

## Privacidade e proteção de dados

**Inventário e mapeamento**
- registo de atividades de tratamento (RAT)
- inventário de tratamentos e fluxos de dados
- questionário de recolha para RAT
- mapa de dados

**Avaliação**
- screening de avaliação de impacto (AIPD)
- AIPD completa
- avaliação de interesse legítimo (LIA)
- avaliação de impacto de transferência (TIA)

**Relação com terceiros**
- registo de subcontratantes
- due diligence de fornecedores
- acordo de tratamento de dados
- cláusulas-tipo e medidas suplementares

**Operação**
- registo de consentimentos
- avisos de privacidade
- política de retenção e eliminação
- pedidos de acesso, apagamento, oposição e portabilidade
- registo de pedidos de titulares

**Incidentes**
- registo de violações
- avaliação do risco de uma violação
- pacote de notificação à autoridade de controlo

**Transversal**
- checklist de privacy by design
- plano de formação
- evidência de accountability

---

## ISO/IEC 27001 e gestão de risco

**Fundação**
- âmbito do SGSI
- contexto da organização
- partes interessadas
- matriz de responsabilidades

**Risco**
- metodologia de risco
- registo de riscos
- plano de tratamento
- declaração de aplicabilidade

**Operação**
- inventário de ativos
- políticas
- controlo de acessos e revisão de acessos
- avaliação de fornecedores
- registo de incidentes
- continuidade e recuperação

**Verificação**
- plano de auditoria
- checklist e agenda
- amostragem
- working papers
- relatório de auditoria interna
- não conformidades
- ações corretivas
- revisão pela gestão

**A peça central**
- matriz **requisito → controlo → evidência**
- calendário de recolha de evidências

A matriz e o calendário são, provavelmente, onde está o maior retorno de todo o
catálogo: é trabalho de cruzamento puro, alto volume, baixo julgamento, e o erro
mais comum — evidência expirada — é detetável por data.

---

## NIS2

- avaliação de aplicabilidade
- classificação da entidade
- mapa de serviços críticos
- registo de dependências
- responsabilidade da gestão
- política de gestão de risco
- plano de incidentes
- continuidade e crise
- segurança da cadeia de fornecimento
- gestão de vulnerabilidades
- avaliação da eficácia das medidas
- formação e higiene cibernética
- criptografia
- recursos humanos
- controlo de acesso
- inventário de ativos
- pacote de evidência
- aviso inicial, notificação e relatório final

**Bloqueio ativo:** os prazos de reporte e o regime nacional aplicável dependem
de V1 e V6 em `02_AUTHORITY_AND_SOURCE_GOVERNANCE.md`, ambos **NÃO
VERIFICADOS**. Nenhum documento NIS2 pode ser produzido com prazos antes de
essas verificações passarem.

---

## IA e governação

- inventário de sistemas de IA
- formulário de admissão de casos de uso
- classificação ao abrigo do regulamento aplicável
- avaliação de risco
- avaliação de impacto sobre proteção de dados associada
- avaliação de impacto sobre direitos fundamentais, quando aplicável
- plano de supervisão humana
- registo de decisões automatizadas
- transparência
- registo de fornecedores e modelos
- data governance
- testes e avaliações
- monitorização
- incidentes
- política de utilização aceitável
- literacia em IA
- registo de alterações de modelo
- avaliação de prompts e outputs
- política de retenção
- plano de saída de fornecedor

**Bloqueio ativo:** calendários de aplicação dependem de V2 e V3, **NÃO
VERIFICADOS**.

---

## Consultoria recorrente

- questionários de diagnóstico
- atas
- registo de decisões
- propostas
- relatórios mensais
- roadmap
- indicadores
- pacotes para direção
- comparação entre clientes, **apenas anonimizada e agregada**

A última linha é a que mais tenta e a que mais risco traz. Comparação entre
clientes só existe se for impossível reidentificar — e a decisão sobre o que é
"impossível" não é do sistema.

---

## Ordem de adoção sugerida

Não construir todos. Por ordem de retorno sobre risco:

| # | tipo | porquê primeiro |
|---|---|---|
| 1 | comparação documento vs template aprovado | risco baixo, valor imediato, fácil de avaliar |
| 2 | matriz requisito–controlo–evidência | volume alto, julgamento baixo |
| 3 | ata e lista de evidência pedida pós-reunião | resolve uma perda real e diária |
| 4 | RAT — gap analysis | é o documento com mais reutilização entre clientes |
| 5 | dossiê de evidência com validade | deteta o erro mais comum por data |
| 6 | screening de AIPD | alto valor, exige revisão jurídica sempre |

Incidentes, pareceres finais e comunicações a autoridades **ficam de fora** de
qualquer piloto.
