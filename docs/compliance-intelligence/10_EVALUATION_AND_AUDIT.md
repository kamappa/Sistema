# 10 · Avaliação e auditoria

## A pergunta certa

Não é *"quantos documentos a IA escreveu"*. É:

> Este workflow devolveu mais tempo do que consumiu, sem baixar a qualidade?

Um sistema que produz muito e obriga a rever tudo produz zero.

## Métricas

**Tempo**
- tempo até ao primeiro draft;
- tempo total por caso;
- tempo de revisão sénior;
- tempo gasto em seguimento.

**Qualidade**
- lacunas encontradas pelo sistema que o humano confirmou;
- lacunas que o sistema falhou (encontradas depois);
- percentagem de sugestões aceites sem edição;
- correções necessárias por caso;
- **afirmações sem fonte** — deve tender para zero;
- erros graves;
- documentos desatualizados detetados.

**Processo**
- número de escalamentos;
- casos que pararam com `INSUFFICIENT` — e se pararam bem;
- cumprimento de prazos;
- satisfação do trabalhador;
- qualidade avaliada pelo revisor sénior.

**Risco e custo**
- incidentes de privacidade;
- custo por caso;
- custo por caso aceite sem edição.

## A métrica que engana

**Percentagem de sugestões aceites** parece a boa métrica e não é — sobe quando o
agente propõe pouco e propõe o óbvio. Tem de ser lida sempre com:

- lacunas encontradas (recall), e
- afirmações sem fonte (precisão da fundamentação).

Um agente que aceita 95% mas encontra metade das lacunas é pior do que um que
aceita 70% e encontra tudo.

## A métrica que decide

```
tempo manual anterior  vs  tempo manual com agentes
```

Não tempo total. **Tempo humano.** Se o agente demora vinte minutos a correr mas
o humano gasta quarenta em vez de duzentos, ganhou-se.

## Gold cases

O conjunto de avaliação. Casos reais **sanitizados**, com resultado conhecido e
julgado por profissional:

- exemplos corretos;
- exemplos incompletos;
- casos ambíguos;
- erros frequentes;
- exceções;
- correções séniores com a razão.

**Sem gold cases não há avaliação, e sem avaliação não há missão.** Este é o
único artefacto que não se pode substituir por engenharia.

## Modo sombra

Antes de qualquer uso real: o sistema corre sobre 10 a 20 casos **já fechados** e
sanitizados, sem influenciar nada.

Compara-se:

- que lacunas encontrou;
- que lacunas falhou;
- quantas afirmações sem fundamento produziu;
- quanto tempo demorou;
- quanto trabalho de revisão exigiria;
- se respeitou os templates;
- se as fontes estavam corretas.

Esta fase produz os gold cases de que a fase seguinte precisa. É por isso que
vem primeiro e não pode ser saltada.

## Regressão

Qualquer alteração a playbook, template ou prompt corre contra os gold cases
antes de entrar. Se piorar algum, não entra. Não há exceção "esta é
obviamente melhor".

## Trilho de auditoria

Registo **append-only**, sem edição possível:

- quem fez o quê e quando;
- que agente participou;
- que versão de conhecimento usou;
- que fontes consultou;
- que output produziu;
- que erro ocorreu;
- de que checkpoint retomou;
- que humano aprovou o quê;
- que versão foi entregue.

Isto serve três coisas: reconstruir um caso, defender uma decisão passada, e
descobrir onde um erro entrou.

## Avaliação dos agentes, um a um

O **Adversarial Reviewer** avalia-se ao contrário dos outros: é medido por
**quantos problemas reais encontrou** e não por concordar. Um revisor adversarial
com taxa de deteção a cair está avariado, não calmo.

Injetar periodicamente casos com defeitos conhecidos — e verificar se ele os
apanha — é a única forma de saber que ainda funciona.

## Revisão periódica da própria missão

De três em três meses, com o sistema em uso:

- que workflows justificam continuar;
- que workflows se desligam;
- que agentes nunca foram usados;
- que conhecimento está `REVIEW_DUE` há demasiado tempo;
- que custo real por caso;
- que incidentes ocorreram.

Desligar um workflow que não compensa é resultado do processo a funcionar, não
falha do projeto.
