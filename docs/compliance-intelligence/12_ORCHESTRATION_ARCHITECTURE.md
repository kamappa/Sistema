# 12 · Arquitetura de orquestração

## A decisão de não decidir ainda

**Não escolher runtime.** Nem Hermes, nem OpenClaw, nem n8n, nem outro.

Estes ambientes evoluem depressa e a lógica de negócio não pode ficar presa a
nenhum. A arquitetura define-se por **contratos**; o runtime é um motor
substituível que os cumpre.

Se um contrato só se consegue implementar num runtime específico, o contrato
está mal desenhado.

## Os oito contratos

### Agent contract
Identidade, missão, inputs, outputs, ferramentas, permissões, estados, condições
de paragem, orçamento, modelo, fallback. Ver `04_AGENT_REGISTRY.md`.

### Tool contract
Cada ferramenta declara: o que faz, que dados vê, que efeitos tem, se é
reversível, se exige aprovação, e que agentes a podem invocar. **Uma ferramenta
sem declaração de efeito não é instalável.**

### Memory contract
O que se guarda, em que nível (caso, cliente, global), por quanto tempo, com que
sanitização, e quem pode promover. Ver `09_MEMORY_AND_CONTROLLED_LEARNING.md`.

### Knowledge contract
Formato da regra, estados, versionamento, verificação, supersessão. Ver
`03_KNOWLEDGE_OBJECT_MODEL.md`.

### Audit contract
O que é registado, em que formato, imutável, por quanto tempo, e quem pode ler.

### Approval contract
Que outputs exigem humano, que escalão, que acontece enquanto espera, e o que
acontece se ninguém aprovar.

### Budget contract
Teto por execução, por caso, por dia, por cliente. O que acontece ao atingir:
pára, degrada para modelo mais barato, ou pede autorização.

### Identity contract
Quem é o utilizador, que clientes pode ver, que ações pode aprovar, e como isso
se propaga ao agente que corre em seu nome.

## Autosave: o trabalho não se perde

Funciona como um jogo com autosave. Cada etapa produz um **checkpoint imutável**.

```
Caso <ref>

v1  — documentos recebidos
v2  — classificação concluída
v3  — dados extraídos
v4  — lacunas identificadas
v5  — respostas do trabalhador adicionadas
v6  — análise preparada
v7  — revisão adversarial concluída
v8  — draft preparado
v9  — revisão humana
v10 — versão aprovada
```

Se falhar a eletricidade durante a v7:

```
Última etapa confirmada:  v6
Etapa interrompida:       revisão adversarial
Ação:                     retomar v7
```

Não se perde o trabalho até à v6. O próximo agente recebe sempre **o último
estado confirmado**, nunca um estado a meio.

## Idempotência

Cada execução tem chave própria:

```
case_id:           <ref>
task_id:           RAT-GAP-ANALYSIS
input_version:     4
knowledge_version: PLB-PRIVACY-018
idempotency_key:   <ref>:RAT-GAP-ANALYSIS:v4
```

Um agente reiniciado **não cria** duas AIPDs, dois emails ou duas versões
finais. Sem isto, uma falha de rede transforma-se em trabalho duplicado — e em
compliance, trabalho duplicado é um documento contraditório.

Note-se que a chave inclui a **versão do conhecimento**: se o playbook mudou, a
tarefa é genuinamente outra e deve voltar a correr.

## Resiliência

- filas duráveis;
- retries limitados, com recuo exponencial;
- timeouts por tarefa;
- tarefas bloqueadas visíveis, nunca silenciosas;
- backups independentes, cifrados, com **testes regulares de restauro**;
- cópias geograficamente separadas quando o risco o justificar;
- retenção definida por tipo;
- exportação completa de um caso, a pedido.

Um backup que nunca foi restaurado não é um backup — é uma esperança.

## A arquitetura mínima

```
Portal de trabalhadores e clientes
        ↓
Gestor de casos
        ↓
Orquestrador (Oracle Supervisor)
        ↓
Agentes especializados
        ↓
Cofre de conhecimento aprovado
        ↓
Cofre documental por cliente
        ↓
Fontes oficiais e Radar
        ↓
Drafts, achados e evidência
        ↓
Revisão e aprovação humana
        ↓
Entrega e histórico
```

Por baixo: armazenamento cifrado, base de dados, fila durável, checkpoints, logs
append-only, permissões, segregação por cliente, versionamento, backups, gateway
de modelos, redação e prevenção de fuga, observabilidade, orçamentos, kill switch.

## Matriz de avaliação de runtime, para quando for altura

Avaliar candidatos com o **mesmo conjunto de gold cases**, não com demonstrações:

| critério | pergunta |
|---|---|
| isolamento | um agente consegue sair da sua sandbox? |
| permissões | são declarativas e mínimas, ou tudo-ou-nada? |
| memória | é inspecionável, versionável, apagável? |
| multiagente | suporta produtor/revisor sem partilha de contexto? |
| workflows | suporta checkpoints e retoma? |
| auditoria | o log é imutável e completo? |
| secrets | como são geridos e rodados? |
| sandbox | ficheiros, rede e processos são limitáveis? |
| MCP | integra ferramentas com contrato declarado? |
| scheduling | corre tarefas periódicas com fiabilidade? |
| custo | por execução e em manutenção |
| manutenção | quem mantém, com que cadência, com que ruturas |
| integração | portal, cofre, base de dados |
| segurança | histórico de vulnerabilidades e resposta |
| portabilidade | **quanto custa sair** |

O último critério é o mais importante e o mais ignorado.

## Ligação ao Sistema

Se esta missão for autorizada, o **Oráculo** já é o Oracle Supervisor por
Constituição, e o **Radar** já é o órgão de vigilância do exterior. Não se cria
um segundo Oráculo nem um segundo Radar — especializa-se os que existem.

O que teria de ser construído de novo: gestor de casos, cofre documental,
separação por cliente, checkpoints, portal. Nada disso existe hoje, e nada disso
é pequeno.
