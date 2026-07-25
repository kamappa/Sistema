# Modelos de dados e contratos de eventos

## Entidades

- OracleSession;
- OracleMessage;
- Intent;
- Memory;
- Policy;
- Permission;
- Approval;
- Agent;
- AgentTask;
- Workflow;
- DecisionRecord;
- ActionLedgerEntry;
- Alert;
- Opportunity;
- Lead;
- Offer;
- Outreach;
- Delivery;
- Metric.

## Campos comuns

- id;
- version;
- created_at;
- updated_at;
- source;
- confidence;
- sensitivity;
- owner;
- state;
- correlation_id.

## Eventos

- `oracle.session.started`;
- `oracle.voice.transcribed`;
- `oracle.intent.detected`;
- `oracle.plan.created`;
- `approval.requested`;
- `approval.granted`;
- `approval.denied`;
- `agent.task.assigned`;
- `agent.task.completed`;
- `agent.task.failed`;
- `workflow.paused`;
- `money.lead.scored`;
- `money.outreach.prepared`;
- `oracle.alert.raised`;
- `oracle.memory.proposed`;
- `oracle.memory.confirmed`.

## Contrato

Todo evento deve ser:

- versionado;
- idempotente quando aplicável;
- validado;
- auditável;
- ligado a uma origem;
- ligado a um utilizador;
- ligado a uma política.
