# Arquitetura de implementação

## Camadas

```text
User Interface Layer
├── Voice
├── Command Palette
├── Oracle UI
└── War Room

Oracle Intelligence Layer
├── Context Engine
├── Memory Engine
├── Planning Engine
├── Priority Engine
├── Decision Engine
├── Delegation Engine
└── Explanation Engine

Governance Layer
├── Policy Engine
├── Approval Engine
├── Permission Engine
├── Agent Registry
├── Risk Engine
└── Audit Engine

Execution Layer
├── Hermes
├── OpenClaw
├── n8n
├── Internal Services
└── External APIs

Truth Layer
├── Supabase
├── Event Log
├── State
├── Memory
└── Metrics
```

## Componentes necessários

### Oracle Gateway

Entrada única para:

- texto;
- voz;
- eventos;
- agentes;
- workflows.

### Context Engine

Constrói contexto mínimo.

### Intent Engine

Classifica:

- pergunta;
- comando;
- reflexão;
- autorização;
- delegação;
- alerta.

### Policy Engine

Decide:

- permitido;
- proibido;
- requer aprovação;
- requer mais contexto.

### Planning Engine

Decompõe tarefas.

### Delegation Engine

Escolhe agente.

### Approval Engine

Gere consentimento.

### Audit Engine

Guarda decisões e ações.

### Memory Engine

Gere tipos de memória e confiança.

### Attention Engine

Decide quando falar.

### Voice Engine

STT, TTS, wake word, barge-in e transcrição.

## Eventos

Usar arquitetura orientada a eventos.

Exemplos:

- `operator.voice.started`;
- `oracle.intent.detected`;
- `approval.requested`;
- `agent.task.assigned`;
- `agent.task.completed`;
- `workflow.failed`;
- `money.lead.scored`;
- `oracle.alert.raised`.

## Estados de tarefa

```text
draft
pending_approval
approved
queued
running
waiting
verifying
completed
failed
cancelled
rolled_back
```

## Requisitos técnicos

- idempotência;
- retries limitados;
- timeouts;
- logs;
- schemas;
- versionamento;
- filas;
- permissões;
- tracing;
- observabilidade;
- rollback.
