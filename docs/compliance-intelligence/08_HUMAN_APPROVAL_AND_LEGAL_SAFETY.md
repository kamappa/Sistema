# 08 · Aprovação humana e segurança jurídica

## O que o sistema nunca faz sozinho

Sem exceção, sem configuração que o permita, sem "modo avançado":

- notificar uma autoridade de controlo;
- comunicar com um cliente ou com um titular de dados;
- emitir um parecer final;
- classificar uma não conformidade como definitiva;
- declarar conformidade;
- assinar ou enviar um contrato;
- alterar um documento já aprovado;
- alterar linguagem protegida de um template;
- decidir recusar um pedido de titular;
- decidir que uma AIPD não é necessária;
- decidir que uma violação não é notificável.

As três últimas merecem destaque: são **decisões de não fazer**, e são as mais
perigosas para automatizar, porque o erro não produz nada visível. Um documento
errado descobre-se. Uma AIPD que nunca se fez descobre-se numa inspeção.

## Escalões de revisão

| risco | quem revê |
|---|---|
| baixo | o trabalhador que abriu o caso |
| médio | trabalhador + consultor sénior |
| alto / jurídico | consultor sénior, DPO ou advogada |
| comunicação a autoridade ou cliente | aprovação humana obrigatória, sempre |

## Aprovação por exceção, não por confirmação

**Este é o ponto que decide se o produto ajuda ou atrapalha.**

Se o profissional sénior tiver de aprovar cada correção, o sistema transforma
uma pessoa cara num revisor a tempo inteiro — e passa a custar mais do que
poupa. A regra:

> O profissional sénior trabalha **por exceção**.

Como se consegue, em `09_MEMORY_AND_CONTROLLED_LEARNING.md`: a correção resolve
o caso **imediatamente**, sem esperar por ninguém; só a promoção a regra global
é que sobe.

## Digest semanal em vez de notificações

```
ESTA SEMANA

47 correções aplicadas em casos
39 específicas de clientes — não sobem
 6 duplicados de regras que já existem
 2 podem melhorar o playbook global

1. Nova formulação para transferências internacionais
   Impacto: 3 templates · Evidência: 8 casos · Risco: médio
   [Aprovar]  [Rejeitar]  [Delegar]

2. Novo critério sugerido para screening de AIPD
   Impacto: elevado · Evidência: orientação oficial + 4 casos
   [Rever evidência]
```

Só sobem alterações **recorrentes**, com **impacto real**, **juridicamente
relevantes** ou **em conflito com o playbook atual**.

## O que um agente pode melhorar sem autorização

- encontrar informação mais depressa;
- organizar melhor;
- reduzir repetições;
- escolher o template correto;
- detetar campos vazios;
- formular melhores perguntas;
- aprender vocabulário e nomenclatura do cliente;
- reutilizar correções já aprovadas;
- melhorar routing e custo.

## O que nunca muda em silêncio

- interpretação legal;
- critérios de conformidade;
- classificação de risco;
- linguagem protegida;
- requisitos obrigatórios;
- qualquer decisão que se aplique a todos os clientes.

## Rastreabilidade de decisão

Cada decisão humana regista quem, quando, sobre que versão, com que evidência à
frente, e o que foi alterado face à proposta. Isto não é burocracia: é o que
permite a um profissional defender, meses depois, uma escolha que fez com base
no estado do conhecimento nesse dia.

## Responsabilidade

O sistema **prepara** e **organiza**. Não assume nem transfere responsabilidade
profissional. Qualquer material entregue a um terceiro sai sob a
responsabilidade do profissional que o aprovou.

Isto deve constar por escrito na proposta comercial e no contrato — não apenas
na documentação técnica.

## Transparência sobre uso de IA

Quando um resultado tenha sido preparado com assistência de IA, isso é
declarado. Contrato e proposta identificam onde existe assistência, que decisões
continuam humanas, que fornecedores participam, que dados podem ser tratados,
que ações o sistema nunca executa, e como o cliente pode pedir exportação ou
eliminação.

**Nota de verificação:** as obrigações concretas de transparência ao abrigo do
regulamento europeu de IA, e as respetivas datas de aplicação, dependem de V2 e
V3 em `02_AUTHORITY_AND_SOURCE_GOVERNANCE.md` — **NÃO VERIFICADOS**. A prática
de declarar assistência de IA não depende disso: é boa prática comercial
independentemente da data de aplicação.

## Ligação às regras invioláveis do Oráculo

Este documento é a aplicação, a um domínio novo, de proibições que já existem na
`SYSTEM-ORACLE-CONSTITUTION.md`:

- não aumentar autonomia sem política;
- não criar memória silenciosa;
- não conceder permissões a agentes sem registry;
- não permitir autoelevação de privilégios;
- não executar ações externas críticas sem consentimento;
- não esconder custo, erro ou incerteza;
- não declarar sucesso sem evidência;
- **não confundir tarefa delegada com tarefa concluída.**

A última é a que este domínio viola com mais facilidade: um caso com draft
preparado **não é** um caso resolvido, e a interface tem de o dizer.
