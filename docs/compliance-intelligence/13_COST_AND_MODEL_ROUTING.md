# 13 · Custo e routing de modelos

## Correção factual, primeiro

A conversa de origem analisou os custos como se a conta fosse **OpenRouter**,
com uma taxa de compra de 5,5%. **Não é.** A conta observada é a **Consola da
Anthropic**, em créditos pay-as-you-go directos. Não há taxa de compra de
intermediário, e os cálculos que dela dependiam não se aplicam.

Estado da conta no momento do registo desta missão:

```
Créditos da organização:   -US$ 0,28   (saldo em dívida)
Gasto no mês:               US$ 5,28
Acesso à API:               SUSPENSO até adicionar fundos
Cache de prompt:            não ativado
```

Isto explica, e fecha, o gate que ficou em aberto na Missão 26: o INSIGHT do
Oráculo está bloqueado porque **o saldo está negativo**, não por defeito de
código. Adicionar fundos retoma o acesso.

## Preços — a verificar, não a assumir

Os preços por milhão de tokens **não** são registados aqui como facto. Mudam, e
um documento que os fixe passa a mentir sozinho.

**V9 — NÃO VERIFICADO:** tabela de preços por modelo. Consultar a página oficial
de preços no momento de dimensionar, e registar a data da consulta.

O que **é** durável, e por isso fica escrito, é a **estratégia**.

## A regra de routing

**Nunca usar o modelo mais caro para tudo.** O custo de um sistema de agentes é
dominado por leitura de volume, e leitura de volume é a tarefa mais barata que
existe.

| camada | trabalho | porquê este escalão |
|---|---|---|
| **rápido/barato** | ler páginas, extrair datas e entidades, deduplicar, classificar relevância, triagem | volume alto, julgamento baixo, erro barato de corrigir |
| **intermédio** | analisar impacto, preencher templates, comparar documentos, produzir drafts, workflows normais | o grosso do trabalho útil |
| **mais capaz** | conflitos entre fontes, casos ambíguos, revisão adversarial, controlo de qualidade final | poucos tokens, alto valor por token |

O **Adversarial Reviewer** é onde vale a pena gastar. É o agente cujo erro passa
despercebido — os outros erram de forma visível.

## Mecanismos de poupança a considerar

- **cache de prompt** — playbooks e templates repetem-se em todas as execuções;
  é exatamente o caso de uso. Está por ativar na conta observada;
- **processamento em lote** para trabalho não urgente (varrimentos noturnos do
  Radar);
- **truncar antes de enviar** — extrair a secção relevante em vez de mandar o
  documento inteiro. Poupa dinheiro e é também um requisito de minimização;
- **parar cedo** — um agente que devolve `INSUFFICIENT` ao segundo passo custa
  menos do que um que produz um draft inútil.

## Cenários

Sem preços verificados não se escrevem números de execuções. O que se pode dizer
com honestidade:

### US$ 5 — o que existe hoje
Suficiente para **experimentação e desenvolvimento**: testar prompts, correr
alguns casos, validar formatos. Não suporta operação contínua.

### US$ 20 — protótipo pessoal credível
Deve chegar para um piloto convincente com **dados fictícios**:
varrimentos diários do Radar, um resumo regulatório semanal, dezenas de
classificações, alguns documentos analisados, comparação de versões, alguns
casos revistos pelo modelo mais capaz, e reserva para erros e repetições.

Não chega para operação comercial com muitos clientes e agentes sempre ativos.

### US$ 50 — piloto interno com uso real
Vários workflows ativos, modo sombra sobre casos históricos, avaliação regular.
Ainda um ambiente de desenvolvimento.

### Piloto empresarial
Já não é uma questão de créditos pessoais. Exige conta da organização,
orçamentos por cliente, Zero Data Retention contratado, e os custos deixam de ser
dominados por tokens.

## O que os cenários acima NÃO incluem

Os números de tokens são a parte pequena e a que se costuma citar. Faltam:

- pesquisa web;
- embeddings e indexação;
- armazenamento do cofre documental;
- observabilidade e logs;
- repetições e falhas;
- infraestrutura (base de dados, filas, portal);
- **tempo humano de configuração e revisão** — a maior despesa do primeiro ano,
  e a que nenhuma tabela de preços mostra.

## Controlo de orçamento

- teto por execução, por caso, por dia e **por cliente**;
- ao atingir: pára, ou degrada para modelo mais barato, ou pede autorização —
  configurável, mas nunca "continua em silêncio";
- custo por caso é uma métrica de avaliação (`10_EVALUATION_AND_AUDIT.md`);
- o Oráculo **nunca esconde custo** — é regra inviolável da Constituição.

## Recomendação imediata

Repor saldo é o passo mais barato com maior desbloqueio: fecha o último gate da
Missão 26 e permite medir custo real por caso antes de dimensionar seja o que
for.

Antes de gastar mais do que isso, **ativar a cache de prompt** — o padrão de uso
desta missão (playbook grande e estável + documento pequeno e variável) é o
melhor caso possível para ela.
