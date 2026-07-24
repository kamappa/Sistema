# Voz e interface ambiente

## Objetivo

A voz deve tornar o Oráculo natural e acessível, não apenas adicionar speech-to-text.

## Capacidades

### Wake word ou push-to-talk

Modos possíveis:

- botão de voz;
- tecla global;
- wake word local;
- escuta apenas em modo autorizado.

O estado de escuta deve ser sempre visível.

### Conversação contínua

O Oráculo mantém contexto durante uma sessão.

Deve permitir:

- interrupção;
- correção;
- continuação;
- perguntas de seguimento;
- mudança de assunto;
- confirmação rápida.

### Barge-in

O Daniel pode interromper a resposta de voz.

### Respostas graduais

O Oráculo pode responder em duas camadas:

1. resposta curta por voz;
2. detalhe visual no Sistema.

Exemplo:

> “Existem três bloqueios. O mais urgente é o prazo de amanhã. Abri o detalhe.”

### Comandos de voz

- abrir módulos;
- criar tarefas;
- registar ideias;
- iniciar foco;
- pedir resumo;
- delegar;
- aprovar;
- rejeitar;
- pausar agentes;
- entrar em War Room;
- iniciar debrief;
- criar lembrete;
- consultar estado.

### Brain dump

O Oráculo transforma fala longa em:

- notas;
- tarefas;
- decisões;
- perguntas;
- ideias;
- riscos;
- próximos passos.

Nada deve ser persistido como definitivo sem revisão quando a classificação for
incerta.

### Diário por voz

Fluxo:

```text
fala
↓
transcrição
↓
resumo
↓
extração
↓
confirmação
↓
memória e tarefas
```

### Briefing e debriefing

Briefing:

- agenda;
- prioridades;
- riscos;
- oportunidades;
- energia;
- Money Machine;
- agentes.

Debrief:

- o que aconteceu;
- o que ficou pendente;
- decisões;
- aprendizagem;
- preparação do dia seguinte.

### Modo escuta privada

A escuta deve ser:

- opt-in;
- local sempre que possível;
- claramente indicada;
- limitada por sessão;
- pausável;
- auditável.

## Voz do Oráculo

A voz deve transmitir:

- calma;
- precisão;
- presença;
- controlo;
- confiança sem arrogância.

## Falhas

Se a transcrição estiver incerta:

> “Ouvi ‘enviar proposta ao cliente’. Confirmas?”

Nunca executar comandos sensíveis com baixa confiança.
