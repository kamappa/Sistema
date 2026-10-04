# 01 · Visão e proposta de valor

## O problema observado

Uma profissional sénior de privacidade e segurança da informação mostrou os
modelos e processos com que trabalha. O que apareceu não foi falta de
competência nem falta de método — foi **trabalho repetitivo de alta
responsabilidade**:

- registos de atividades de tratamento que envelhecem em silêncio;
- avaliações de impacto que repetem 70% da estrutura entre clientes;
- matrizes de risco e declarações de aplicabilidade que exigem cruzar
  requisito, controlo e evidência à mão;
- reuniões de auditoria onde o que se perde não é a conversa, é a **evidência
  prometida** e o compromisso com prazo;
- legislação e orientação nova que obriga a reler documentos que já estavam
  fechados, para descobrir quais é que mudaram de estado.

Nada disto é trabalho pouco qualificado. É trabalho qualificado gasto em
mecânica.

## O que este sistema faz

Reduz o trabalho monótono, organiza evidência, mantém conhecimento versionado e
prepara decisões — **e entrega ao profissional apenas aquilo que exige
julgamento profissional.**

## O que este sistema NÃO faz

Não substitui advogados, DPOs, auditores nem consultores. Não emite pareceres.
Não decide conformidade. Não comunica com autoridades. Não fala com clientes.

Esta distinção não é modéstia comercial — é o que torna o produto defensável.
Um sistema que se apresenta como *"agentes autónomos que fazem auditorias"* é,
ao mesmo tempo, menos credível e mais perigoso do que um que se apresenta como
*"infraestrutura que prepara o trabalho e preserva a responsabilidade"*.

## A frase para apresentar

> O sistema não tenta substituir a sua decisão. Mantém os modelos atualizados,
> prepara o trabalho repetitivo, mostra exatamente de onde veio cada conclusão e
> entrega-lhe apenas aquilo que precisa de julgamento profissional.

## A correção de linguagem que a missão exige

A formulação inicial era *"agentes que aprendem sozinhos e nunca ficam
desatualizados"*. Está errada, e o erro é de segurança e não de estilo.

Um agente jurídico que altera as próprias regras em silêncio é uma
responsabilidade civil com interface bonita. E "nunca desatualizado" é uma
promessa que nenhum sistema pode cumprir.

A formulação correta:

> Agentes especializados que operam sobre conhecimento versionado, verificam a
> atualidade das fontes, **param quando a base é insuficiente** e melhoram
> através de um processo governado de aprendizagem, testes e aprovação humana.

A garantia que se pode dar não é "estamos sempre atualizados". É:

> Nenhum agente apresenta uma conclusão sem conseguir demonstrar a **data**, a
> **jurisdição**, a **versão** e as **fontes** em que se baseou — e diz quando
> não sabe.

## O que distingue isto de um chatbot de RGPD

Um chatbot responde. Este sistema mantém um **estado**:

```
Nova orientação oficial
  → fonte autenticada
  → diferença analisada
  → impacto mapeado
  → documentos internos potencialmente afetados identificados
  → proposta de alteração com citações
  → clientes e processos afetados listados
  → revisão humana
  → nova versão em vigor
  → versão anterior continua auditável
```

O produto do chatbot é texto. O produto deste sistema é **um caso com
história**.

## Os três produtos

Se a missão for algum dia autorizada, começa por três coisas concretas e não
por uma plataforma.

### 1 · Audit Session Companion

- **antes** da reunião: dossier, lacunas anteriores, perguntas recomendadas,
  compromissos vencidos;
- **durante**: captura estruturada de afirmação, evidência apresentada,
  evidência prometida, compromisso e prazo;
- **depois**: ata, lista de evidência pedida, matriz critério–resposta–
  evidência, achados candidatos, rascunho de seguimento.

### 2 · Controlled Template Engine

Trabalha sobre os modelos aprovados da organização, com linguagem protegida que
nunca é alterada sem autorização. Produz **redline**, nunca substituição
silenciosa.

### 3 · Regulatory Delta Engine

Mantém playbooks e modelos atuais: fonte nova → o que mudou → impacto →
documentos afetados → proposta → aprovação.

Ligam-se assim:

```
Delta Engine mantém o conhecimento atual
        ↓
Template Engine produz trabalho consistente
        ↓
Session Companion recolhe evidência real
        ↓
Revisor humano valida
        ↓
Correções melhoram o playbook
```

## O maior risco do projeto, dito à cabeça

**Que dê mais trabalho do que aquele que poupa.**

Se cada correção precisar de aprovação sénior, o sistema transforma um
profissional caro num revisor a tempo inteiro. A resposta está em
`09_MEMORY_AND_CONTROLLED_LEARNING.md`: aprendizagem em três níveis, e o
profissional sénior trabalha **por exceção, não por confirmação**.

## Onde isto se liga ao Sistema

Não é um produto separado que por acaso vive no mesmo repositório.

- o **Radar** já existe e já é o órgão que vigia o mundo exterior — o Regulatory
  Radar é uma especialização dele, não um segundo radar;
- o **Oráculo** já é, por Constituição, *Chief Intelligence Officer, Chief of
  Staff, supervisor de agentes, guardião da verdade e auditor* — o papel de
  Oracle Supervisor não é novo, é este;
- a **Missão 29 (AI Lab e AI Governance)** trata da governação de IA como
  matéria de estudo e progressão do Operador. Esta missão trata de governação de
  IA como **operação profissional para terceiros**. São complementares e não se
  substituem;
- a trajetória de carreira do Operador — auditoria ISO 27001, NIS2, RGPD, AI
  Governance, estágio em GRC — é exatamente o domínio desta missão. Construí-la
  é estudá-la.
