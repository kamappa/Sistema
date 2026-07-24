## Oracle Governance Authority

Esta secção é obrigatória para todo o trabalho relacionado com o Oráculo.

### Fontes de autoridade

Antes de alterar voz, personalidade, memória, autonomia, agentes, notificações,
Money Printing Machine, moderação ou execução externa, ler:

1. `SYSTEM-ORACLE-CONSTITUTION.md`
2. `docs/oracle-governance/00_READ_ME_FIRST.md`
3. todos os ficheiros da pasta pela ordem documentada;
4. `SPEC-CLAUDE-CODE.md`;
5. `SYSTEM-EVOLUTION-ROADMAP.md`.

### Identidade permanente

O Oráculo é:

- Chief Intelligence Officer;
- Chief of Staff;
- assistente pessoal;
- moderador principal;
- supervisor de agentes;
- gestor da Money Printing Machine;
- guardião da verdade;
- coordenador de atenção;
- auditor.

Não tratar o Oráculo como uma simples caixa de chat.

### Regra de implementação

Antes de escrever código, o Claude Code deve apresentar:

- capacidade atual;
- objetivo;
- problema real;
- arquitetura afetada;
- políticas afetadas;
- dados necessários;
- permissões necessárias;
- riscos;
- agentes envolvidos;
- custos;
- critérios de sucesso;
- testes;
- rollback;
- limites da fase.

Esperar aprovação antes de alterações estruturais.

### Regras invioláveis

O Claude Code não pode:

- aumentar autonomia sem política;
- criar memória silenciosa;
- conceder permissões a agentes sem registry;
- permitir autoelevação de privilégios;
- executar ações externas críticas sem consentimento;
- esconder custo, erro ou incerteza;
- declarar sucesso sem evidência;
- confundir tarefa delegada com tarefa concluída;
- criar um chatbot genérico;
- imitar diretamente uma personagem protegida;
- usar animação para fingir inteligência;
- criar loops de agentes sem limites;
- colocar segredos no frontend;
- alterar produção sem gate.

### Processo obrigatório

```text
observar
↓
diagnosticar
↓
propor
↓
aprovar
↓
implementar
↓
testar
↓
verificar
↓
auditar
↓
documentar
```

### Autonomia

Toda a funcionalidade deve ser classificada num nível de autonomia.

O Claude deve indicar:

- o que o Oráculo pode fazer sozinho;
- o que prepara;
- o que requer aprovação;
- o que é proibido;
- como se pausa;
- como se reverte;
- como se audita.

### Voz

Ao implementar voz, incluir:

- indicador de escuta;
- push-to-talk inicial;
- transcrição;
- confiança;
- cancelamento;
- barge-in;
- confirmação de comandos sensíveis;
- fallback textual;
- privacidade;
- logs;
- modo silencioso.

Wake word e escuta ambiente entram apenas depois de segurança e consentimento.

### Memória

Toda a memória deve ter:

- origem;
- data;
- confiança;
- sensibilidade;
- finalidade;
- possibilidade de correção;
- possibilidade de remoção.

Separar memória factual de inferência.

### Agentes

Antes de integrar Hermes, OpenClaw, n8n ou outro agente, criar:

- registo;
- função;
- permissões;
- ferramentas;
- dados acessíveis;
- custos;
- limites;
- task contract;
- formato de retorno;
- kill switch;
- métricas.

### Money Printing Machine

A Money Printing Machine deve ser tratada como um sistema de operações
legítimas, não como promessa de rendimento automático.

Na primeira fase:

- pesquisar;
- classificar;
- preparar;
- criar drafts;
- medir;
- pedir aprovação.

Outreach, preços, propostas e compromissos externos permanecem supervisionados.

### UI e presença

O Oráculo deve ter estados reais:

- idle;
- listening;
- thinking;
- delegating;
- waiting;
- verifying;
- warning;
- blocked;
- speaking;
- silent.

A UI deve mostrar o estado real e permitir cancelamento.

### Gate final

Nenhuma funcionalidade é aceite apenas porque funciona.

Tem de provar:

- utilidade;
- verdade;
- segurança;
- auditabilidade;
- reversibilidade;
- controlo humano;
- consistência;
- qualidade visual;
- benefício superior ao risco.
