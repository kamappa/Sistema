## Programa Oracle Intelligence & Governance

### Estatuto

Programa estratégico de longo prazo.

Não é uma única missão e não deve ser executado num big-bang rewrite.

Fonte de autoridade:

- `SYSTEM-ORACLE-CONSTITUTION.md`
- `docs/oracle-governance/00_READ_ME_FIRST.md`

### Visão

Transformar o Oráculo numa camada de inteligência e governação capaz de:

- compreender o estado global do Sistema;
- conversar por texto e voz;
- funcionar como assistente pessoal;
- coordenar Hermes, OpenClaw e n8n;
- gerir a Money Printing Machine;
- moderar automações;
- proteger atenção;
- pedir aprovação;
- explicar decisões;
- aprender com resultados;
- aumentar autonomia de forma gradual.

### Arquitetura conceptual

```text
Daniel
↓
Oracle Interface
↓
Oracle Intelligence Layer
↓
Governance Layer
↓
Execution Layer
↓
Truth and Audit Layer
```

### Sistemas obrigatórios

#### Oracle Gateway

Entrada unificada para:

- texto;
- voz;
- eventos;
- agentes;
- workflows.

#### Context Engine

Constrói contexto mínimo e relevante.

#### Memory Engine

Gere memória factual, episódica, semântica, operacional e de política.

#### Intent Engine

Distingue pergunta, comando, reflexão, aprovação, rejeição, delegação e alerta.

#### Priority Engine

Avalia impacto, urgência, risco, energia, dependências e alinhamento.

#### Planning Engine

Decompõe objetivos em passos.

#### Policy Engine

Decide permitido, proibido ou sujeito a aprovação.

#### Approval Engine

Cria pedidos de aprovação informados.

#### Agent Registry

Mantém papéis, permissões, custos, métricas e kill switches.

#### Delegation Engine

Escolhe agente com base em competência, custo, risco e privacidade.

#### Attention Engine

Decide quando, como e se o Oráculo deve interromper.

#### Audit Engine

Guarda Decision Records e Action Ledger.

#### Voice Engine

Gere STT, TTS, push-to-talk, barge-in, confiança e sessões.

### Fases

#### Missão O-00 — Constituição e baseline

- consolidar documentos;
- mapear capacidade atual;
- identificar dados e endpoints;
- definir riscos;
- não adicionar autonomia.

#### Missão O-01 — Oracle Core

- gateway textual;
- contexto;
- intent;
- respostas estruturadas;
- explicabilidade;
- estados reais.

#### Missão O-02 — Memory Foundation

- modelos;
- origem;
- confiança;
- correção;
- remoção;
- retenção;
- memória proposta antes de persistência sensível.

#### Missão O-03 — Voice v1

- push-to-talk;
- transcrição;
- TTS;
- comandos internos;
- confirmação;
- fallback textual;
- logs.

#### Missão O-04 — Personal Assistant

- briefing;
- debrief;
- brain dump;
- diário;
- tarefas;
- agenda;
- foco;
- lembretes;
- acompanhamento.

#### Missão O-05 — Governance Core

- policy engine;
- approval engine;
- permission model;
- risk engine;
- kill switch;
- action ledger.

#### Missão O-06 — Agent Registry

- Hermes;
- OpenClaw;
- n8n;
- task contracts;
- reputação;
- custos;
- timeout;
- rollback.

#### Missão O-07 — Proactive Oracle

- attention engine;
- padrões;
- notificações;
- escalada;
- Silent Mode;
- Recovery Mode.

#### Missão O-08 — Money Machine v1

- Opportunity Radar;
- Lead Engine;
- Research Engine;
- scoring;
- drafts;
- aprovação humana.

#### Missão O-09 — Money Machine v2

- CRM;
- follow-ups;
- Offer Engine;
- Delivery Engine;
- métricas;
- aprendizagem.

#### Missão O-10 — Ambient Oracle

- wake word;
- sessões contínuas;
- dispositivos;
- presença ambiente;
- políticas adicionais.

#### Missão O-11 — Advanced Autonomy

- autonomia por domínio;
- orçamentos;
- simulação;
- auto-recovery;
- reputação;
- supervisão.

### Modelos obrigatórios

Toda a ação deve ter:

- ID;
- intenção;
- utilizador;
- agente;
- política;
- risco;
- aprovação;
- estado;
- custo;
- timestamps;
- output;
- erro;
- rollback.

Estados:

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

### Critérios de aceitação

#### Verdade

- não inventa;
- distingue confiança;
- confirma persistência;
- explica origem.

#### Voz

- escuta visível;
- cancelamento;
- transcrição;
- confirmação;
- privacidade.

#### Memória

- auditável;
- corrigível;
- removível;
- finalidade clara.

#### Autonomia

- política;
- aprovação;
- limites;
- kill switch;
- rollback.

#### Agentes

- registry;
- contrato;
- retorno estruturado;
- métricas;
- sem autoelevação.

#### Money Machine

- legítima;
- sem spam;
- entrega possível;
- custos visíveis;
- aprovação.

#### UI

- não parece chatbot genérico;
- mostra estados reais;
- permite interromper;
- integra-se no Sistema.

### Não objetivos iniciais

- autonomia total;
- wake word always-on;
- envio automático em massa;
- pagamentos automáticos;
- alteração automática de objetivos;
- memória ilimitada;
- substituição humana em decisões críticas.

### Gate de produção

Nenhuma fase entra em produção sem:

- testes;
- logs;
- policy check;
- rollback;
- permissões mínimas;
- observabilidade;
- aprovação do Daniel.
