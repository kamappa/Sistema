# Prompt de execução para Claude Code

Antes de desenvolver ou alterar o Oráculo:

1. Lê `CLAUDE.md`.
2. Lê `SYSTEM-ORACLE-CONSTITUTION.md`.
3. Lê toda a pasta `docs/oracle-governance/` pela ordem definida em
   `00_READ_ME_FIRST.md`.
4. Lê `SPEC-CLAUDE-CODE.md`.
5. Lê `SYSTEM-EVOLUTION-ROADMAP.md`.
6. Inspeciona o código real.
7. Não assumes que uma capacidade existe.
8. Não aumentas autonomia sem política.
9. Não adicionas agente sem registry.
10. Não executas ações externas sem aprovação.
11. Não crias memória silenciosa.
12. Não alteras produção sem gate.

Primeira resposta obrigatória:

- estado atual do Oráculo;
- capacidades existentes;
- lacunas;
- riscos;
- proposta de arquitetura;
- dados necessários;
- políticas afetadas;
- plano de implementação;
- critérios de aceitação;
- rollback;
- o que não será alterado.

A implementação deve seguir:

```text
propor
↓
aprovar
↓
implementar
↓
testar
↓
observar
↓
auditar
↓
documentar
```

Não transformar o Oráculo num chatbot genérico.

Não criar autonomia performativa.

A prioridade é utilidade real, verdade, eficiência, controlo e confiança.
