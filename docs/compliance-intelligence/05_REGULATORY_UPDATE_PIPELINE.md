# 05 · Pipeline de atualização regulatória

## O que é

O **Regulatory Delta Engine** — a peça que impede que tudo o resto envelheça em
silêncio. É também a peça mais demonstrável: mostra numa demonstração aquilo que
uma folha de cálculo nunca mostra.

## O fluxo

```
 1. Regulatory Radar encontra uma fonte oficial nova
 2. Source Curator autentica origem, data, versão e jurisdição
 3. Delta Agent identifica exatamente o que mudou
 4. Applicability Analyst determina quem pode ser afetado
 5. Impact Agent mapeia documentos, processos e controlos internos
 6. Draft Agent propõe alterações
 7. Evidence Agent associa citações a cada alteração
 8. Adversarial Reviewer procura erros e conclusões fracas
 9. Oráculo apresenta impacto, confiança e lacunas
10. o humano aprova, rejeita ou pede investigação
11. nova versão é publicada no cofre de conhecimento
12. a versão anterior permanece auditável
```

Os passos 1 a 8 correm sem ninguém. O passo 10 é o único que consome tempo
profissional — e consome-o sobre trabalho já preparado.

## O que o humano vê no passo 9

Não um resumo. Isto:

```
ALTERAÇÃO DETETADA

Fonte:        <emissor oficial>          Escalão 1
Publicada:    <data>                     Em vigor: <data>
Jurisdição:   <jurisdição>
Confiança:    alta

O QUE MUDOU
  <diferença estruturada, cláusula a cláusula>

IMPACTO INTERNO
  3 modelos potencialmente afetados
  2 RATs precisam de revisão
  1 AIPD precisa de reavaliação
  4 clientes com processos que tocam este tema

PROPOSTAS
  6 alterações, cada uma com origem, data e confiança
  2 assinaladas pelo revisor adversarial como fracas

AINDA EM FALTA
  1 facto que só o cliente pode confirmar
```

## Deteção não é interpretação

O Radar tem um trabalho estreito de propósito: **encontrar e classificar
relevância**. Não decide o que a alteração significa. A separação existe porque
um detetor que também interpreta tende a interpretar para justificar a deteção.

Critérios de relevância:

- toca um tópico presente no cofre de conhecimento;
- toca uma jurisdição em uso;
- toca um template ativo;
- toca um controlo com evidência registada;
- é emitido por fonte de escalão 1 ou 2.

O que não toca nada fica registado na mesma, com relevância baixa. Uma alteração
irrelevante hoje pode ser relevante quando entrar um cliente novo.

## Cadência

- **diário**: varrimento das fontes de escalão 1;
- **semanal**: digest de impacto para revisão humana;
- **mensal**: revisão de conhecimento `REVIEW_DUE`;
- **por evento**: quando um caso encontra `STALE` ou `CONFLICT`.

A cadência é económica e não técnica: varrer de hora a hora custa dinheiro e
não muda decisões. Ver `13_COST_AND_MODEL_ROUTING.md`.

## Cascata de recuperação

Quando um agente precisa de saber alguma coisa, a ordem é fixa:

```
1. conhecimento aprovado atual (CURRENT)
2. histórico e versões anteriores
3. documentação interna aprovada
4. fontes oficiais online (escalão 1 e 2)
5. comparação e verificação da atualização
6. fontes secundárias — APENAS para contexto e descoberta
7. pedido de informação ao operador
8. PARAGEM com "base insuficiente"
```

O passo 8 é uma conclusão legítima e não uma falha. Um agente que chega ao
passo 8 e devolve `INSUFFICIENT` funcionou corretamente.

**Nenhum agente pode preencher uma lacuna com plausibilidade.**

## Quando o conhecimento estagna a meio de um processo

O caso não morre nem inventa:

```
Agente encontra conhecimento STALE a meio do caso
  → checkpoint guardado
  → tenta histórico de versões (passo 2)
  → tenta fontes oficiais (passo 4)
  → se resolver: continua e regista que resolveu assim
  → se não resolver: caso passa a HUMAN_REQUIRED
  → o trabalho já feito NÃO se perde
```

Ver `12_ORCHESTRATION_ARCHITECTURE.md` para checkpoints e retoma.

## Falso positivo e falso negativo

Os dois erros não custam o mesmo.

- **Falso positivo** — o Radar assinala algo irrelevante. Custa atenção. Tolerável.
- **Falso negativo** — o Radar não vê uma alteração real. Custa um documento
  errado entregue a um cliente. **Não tolerável.**

Por isso o Radar erra deliberadamente para o lado do ruído, e o filtro faz-se a
seguir — onde é barato — e não na deteção.
