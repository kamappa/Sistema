# 09 · Memória e aprendizagem controlada

## O problema que este documento resolve

A objeção mais séria a toda esta missão é:

> Isto não acaba por dar mais trabalho à pessoa que é suposto ajudar?

Se cada correção precisar de aprovação sénior, sim. O desenho abaixo existe para
que a resposta seja não.

## A frase que governa

> **Nenhum profissional deve trabalhar para alimentar a IA. A IA deve aprender a
> partir do trabalho de revisão que os profissionais já teriam de fazer.**

Ninguém preenche formulários de feedback. Ninguém classifica respostas. Ninguém
"treina o modelo". O sinal de aprendizagem é a **diferença entre o que o agente
propôs e o que ficou aprovado** — informação que já existe, de graça, porque a
revisão ia acontecer de qualquer maneira.

## A correção resolve o caso imediatamente

```
Agente produz draft
  → trabalhador corrige durante a revisão normal
  → CASO ATUAL FICA CORRIGIDO E SEGUE
  → sistema regista apenas a diferença
```

Em segundo plano, sem bloquear ninguém:

```
Diferença registada
  → dados pessoais removidos
  → comparada com correções anteriores
  → duplicados agrupados
  → impacto classificado
  → testes gerados
```

**A maioria das correções nunca chega ao profissional sénior.**

## Três níveis de aprendizagem

### Nível 1 — aprendizagem do caso

Válida só naquele documento.

> "Neste RAT, o departamento chama-se People Operations."

Sem aprovação adicional. Sem propagação.

### Nível 2 — aprendizagem do cliente

Válida para aquele cliente: nomenclatura, responsáveis, sistemas, fornecedores,
estilo documental, processos confirmados.

Aprovada pelo consultor responsável pelo cliente. **Nunca sai do cliente.**

Corrigir a organização de um RAT porque um cliente prefere assim **não muda**
todos os RATs da firma.

### Nível 3 — aprendizagem global

Altera modelos ou playbooks da organização: uma regra nova para AIPDs, uma
alteração de template oficial, uma interpretação jurídica, uma orientação nova
de uma autoridade.

**Só este nível exige governação forte**, e só este entra no digest.

## Quem aprova o quê

| tipo de alteração | quem trata |
|---|---|
| formatação, ortografia, organização | automático ou trabalhador |
| preferência específica de um cliente | fica nesse cliente |
| melhoria de instrução operacional | consultor responsável ou sénior |
| alteração de template | responsável pelo template |
| nova interpretação jurídica | profissional designado |
| nova legislação ou orientação oficial | responsável regulatório, com evidência |
| alto impacto em vários clientes | profissional sénior |

## O pipeline de promoção

```
Correção
  → candidata a aprendizagem
  → sanitização (remoção de dados pessoais e identificadores)
  → comparação com regras atuais
  → geração de caso de teste
  → validação contra casos antigos (regressão)
  → revisão, se o nível a exigir
  → aprovação
  → nova versão do playbook
```

Até ser aprovada, a candidata fica em **quarentena** e não influencia nenhum
caso.

O passo de **regressão** é o que impede o erro mais provável: uma correção certa
para um cliente que, aplicada a todos, passa a errada. A candidata corre contra
os gold cases; se piorar algum, não sobe.

## O que se guarda de cada versão de playbook

- versão;
- quem aprovou;
- data;
- casos que a originaram, sanitizados;
- casos de teste associados;
- casos afetados;
- **rollback**;
- histórico completo.

## O que a memória NUNCA contém

- dados pessoais;
- nomes de titulares, colaboradores ou contactos;
- conteúdo confidencial de clientes;
- transcrições em bruto;
- correções que identifiquem um cliente concreto num playbook global.

Uma lição aprendida num cliente que só faz sentido com o nome desse cliente **não
é uma lição** — é um detalhe operacional, e fica no nível 2.

## Os três períodos, com honestidade

**Arranque.** Dá mais trabalho: organizar templates, definir regras, escolher
casos históricos, corrigir os primeiros resultados, decidir o que exige
aprovação. É **configuração**, não operação.

**Aprendizagem assistida.** O sistema reutiliza correções aprovadas, estruturas,
perguntas, linguagem e mapeamentos. O tempo de revisão começa a cair.

**Operação madura.** A equipa recebe documentos já estruturados, comparados, com
lacunas identificadas, com fontes, com perguntas preparadas, com redline e com
controlo de qualidade inicial feito.

Dizer isto à cabeça é mais honesto — e mais convincente — do que prometer ganho
imediato.

## A regra de sobrevivência de um workflow

Um workflow só permanece ativo se cumprir métricas. Se preparar um RAT demorava
quatro horas e passa a exigir três horas e meia mais manutenção, **o workflow é
desligado**, não melhorado indefinidamente.

Os números vivem em `10_EVALUATION_AND_AUDIT.md`.

## O que os agentes nunca podem fazer com memória

- alterar regras jurídicas silenciosamente;
- transformar uma correção num precedente universal;
- inventar obrigações;
- apresentar comentário como lei;
- guardar aprendizagem sem origem, data e autor da aprovação.

O agente **não "aprende" alterando o seu comportamento em segredo**. Recebe uma
nova versão aprovada do playbook — que tem número, data e rollback.
