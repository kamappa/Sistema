# 03 · Modelo de objeto de conhecimento

## Porque é que o conhecimento não pode ser prosa

Alimentar um agente com "o RGPD inteiro" em texto corrido produz um sistema que
soa informado e não consegue dizer **de onde veio** uma frase, **quando** foi
lida, **se ainda vale** e **a quem se aplica**.

O conhecimento tem de ser um objeto com estado.

## Regra de conhecimento

```yaml
id:              GDPR-ART30-ROPA
title:           Registos das atividades de tratamento
jurisdiction:    EU
authority:       regulation
source_id:       eurlex-32016R0679
legal_basis:     RGPD, artigo 30.º
effective_from:  2018-05-25
retrieved_at:    <data da última consulta à fonte>
version:         3
supersedes:      GDPR-ART30-ROPA@2
status:          CURRENT
confidence:      high
topics:
  - records-of-processing
  - controller
  - processor
applies_to:
  - controllers
  - processors
exceptions:
  - <condição em que não se aplica, com fonte>
review_owner:    <papel, não pessoa>
next_review:     <data>
verification:
  verified_by:   <humano | agente>
  verified_at:   <data>
  method:        consulta à fonte oficial
```

### Campos que existem por uma razão específica

- **`supersedes`** — a versão anterior não desaparece. Um documento produzido em
  março tem de continuar a poder explicar-se com a regra de março.
- **`exceptions`** — a maior parte dos erros graves em compliance não é aplicar
  mal a regra; é aplicá-la onde não se aplica. Uma exceção sem fonte não entra.
- **`confidence`** — separado de `status`. Uma regra pode estar `CURRENT` e ter
  confiança média porque a orientação é ambígua. Achatar as duas coisas num só
  campo esconde exatamente a informação que o revisor precisa.
- **`review_owner`** é um **papel**, nunca uma pessoa nomeada. Ver
  `11_PRIVACY_SECURITY_AND_TENANCY.md`.

## Estados

| estado | significado | o agente pode concluir? |
|---|---|---|
| `CURRENT` | verificado e dentro do prazo de revisão | sim |
| `REVIEW_DUE` | passou a data de revisão, sem sinal de alteração | sim, com aviso visível |
| `STALE` | há indício de que mudou e ainda não foi reconciliado | não, sem confirmação |
| `SUPERSEDED` | existe versão posterior | não, só para histórico |
| `CONFLICT` | duas fontes de autoridade divergem | não |
| `INSUFFICIENT` | a base não chega para a pergunta feita | não |
| `HUMAN_REQUIRED` | exige julgamento profissional por natureza | não |
| `QUARANTINED` | falhou autenticação de origem | não |

**`REVIEW_DUE` não bloqueia.** Bloquear tudo o que passou a data de revisão
transformaria o sistema em algo que pára sozinho e obriga alguém a desbloqueá-lo
— o oposto do objetivo. Avisa e continua.

## As três camadas

O conhecimento útil não é só a regra.

### Template — a estrutura

O documento vazio: secções, campos obrigatórios, campos opcionais, linguagem
protegida.

### Playbook — como preencher

As regras operacionais que um profissional aplica sem pensar e que um agente não
adivinha:

```
Não inferir período de conservação.
Não tratar fornecedor como subcontratante sem evidência contratual.
Assinalar sempre categorias especiais de dados.
Pedir confirmação explícita sobre transferências internacionais.
Não classificar uma medida como implementada sem evidência datada.
```

### Gold cases — exemplos julgados

Casos reais sanitizados, revistos por profissional:

- um exemplo correto;
- um exemplo incompleto, e porquê;
- um caso ambíguo, e como se resolveu;
- um erro frequente;
- uma exceção;
- uma correção sénior, com a razão.

Os gold cases são o que permite **avaliar** o sistema (`10_EVALUATION_AND_AUDIT.md`).
Sem eles não há como saber se uma alteração melhorou ou piorou.

## Template com governação

```yaml
template_id:      TPL-ROPA-004
name:             Registo de Atividades de Tratamento
version:          4.2
owner:            <papel>
status:           approved
effective_from:   <data>
jurisdiction:     [EU, PT]
allowed_workflows: [create, update, gap-analysis]
required_fields:  [...]
optional_fields:  [...]
protected_sections:
  - legal-disclaimer
  - approval-clause
fill_rules:       PLB-PRIVACY-018
not_applicable_when:
  - <condição>
required_review:  privacy-senior
linked_knowledge: [GDPR-ART30-ROPA, ...]
change_log:       [...]
```

**`protected_sections`** é o campo que torna o produto vendável a um escritório:
cláusulas de responsabilidade e de aprovação **não são tocadas por agente
nenhum**, em circunstância nenhuma, nem para "melhorar a redação".

## Como o conhecimento é usado

```
Template aprovado v4.2
  + dados extraídos do documento do cliente
  + documentação do cliente
  + regras do playbook
  + conhecimento CURRENT com fontes
      → draft
      → lacunas explícitas
      → redline
      → revisão humana
```

O agente **não memoriza livremente** o modelo. Recupera a versão aprovada,
aplica as regras e mostra a diferença.

## O que nunca entra no cofre de conhecimento

- documentos de clientes;
- dados pessoais;
- transcrições de reuniões;
- normas ISO reproduzidas em extensão;
- modelos proprietários sem autorização escrita;
- qualquer coisa que não tenha `source_id`.
