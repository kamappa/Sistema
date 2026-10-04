# 04 · Registry de agentes

## A regra que estrutura tudo

> **O agente que produz nunca é o único agente que valida.**

E a regra que a Constituição do Oráculo já impõe: nenhum agente existe sem
entrada neste registry. Um agente sem registry é uma permissão sem política.

## Ficha obrigatória

Nenhum agente é implementado sem isto preenchido:

```yaml
agent_id:
mission:                # uma frase; se precisar de duas, são dois agentes
inputs:
outputs:
allowed_sources:        # escalões permitidos
forbidden_sources:
tools:                  # lista fechada
permissions:            # leitura/escrita, por âmbito e por cliente
forbidden_actions:
states:
stop_conditions:        # quando PARA em vez de continuar
approval_required:      # que output exige humano
logs:
test_cases:             # gold cases que tem de passar
budget:                 # teto por execução e por dia
model_recommended:
fallback:               # o que faz quando falha
```

## Proibições comuns a todos

Nenhum agente pode, em circunstância nenhuma:

- enviar email, mensagem ou notificação a alguém fora do sistema;
- comunicar com autoridades de controlo;
- comunicar com clientes;
- alterar um documento aprovado;
- alterar linguagem protegida de um template;
- alterar regras de conhecimento;
- conceder permissões a si próprio ou a outro agente;
- aceder a dados de um cliente diferente daquele do caso;
- publicar, exportar ou fazer upload para fora do ambiente;
- preencher uma lacuna com uma resposta plausível.

A última é a mais importante e a mais fácil de violar sem se notar.

## Os catorze agentes

### Regulatory Radar
**Missão:** detetar legislação, orientação e jurisprudência nova nas fontes
registadas.
**Não faz:** interpretar. Só deteta e classifica relevância.
**Para quando:** a fonte não responde ou o conteúdo não autentica.
**Modelo:** o mais barato — é leitura e triagem de volume.

### Source Curator
**Missão:** autenticar proveniência, autoridade, jurisdição, data e versão.
**É o porteiro do cofre.** Nada entra sem passar por aqui.
**Para quando:** o hash não bate, falta data de vigor, ou o emissor não confirma.
**Aprovação:** promover uma fonte a escalão 1 exige humano.

### Delta Agent
**Missão:** dizer exatamente **o que mudou** entre a versão anterior e a nova.
**Output:** diferença estruturada, não resumo. Um resumo perde a cláusula.

### Applicability Analyst
**Missão:** determinar a quem e a que processos a alteração se aplica.
**Para quando:** a aplicabilidade depende de um facto que o sistema não tem.
**Nunca:** presume que se aplica "provavelmente".

### RAT Agent
**Missão:** criar, completar e atualizar registos de atividades de tratamento.
**Nunca:** infere finalidade, base legal ou prazo de conservação.
**Output típico:** campos extraídos + lacunas + perguntas + redline.

### DPIA Agent
**Missão:** screening de necessidade de AIPD e preparação para revisão.
**Nunca:** conclui que uma AIPD não é necessária. Isso é decisão humana.
**Aprovação:** obrigatória, sempre.

### Contract and Processor Agent
**Missão:** rever contratos de tratamento, cláusulas de subcontratantes,
cláusulas-tipo e transferências.
**Output:** divergências face ao template aprovado, com citação de cláusula.
**Nunca:** declara uma transferência conforme.

### Data Subject Rights Agent
**Missão:** organizar pedidos de exercício de direitos — prazos, sistemas a
consultar, responsáveis, respostas recebidas.
**Nunca:** decide recusar um pedido, nem responde ao titular.

### Breach Agent
**Missão:** recolher factos, cronologia, dados envolvidos, volume, medidas.
**Nunca:** classifica o risco final, decide notificar ou redige a comunicação
final à autoridade.
**Razão:** é o workflow com maior pressão de tempo e maior custo de erro — é
exatamente onde a automação tenta cortar caminho.

### ISO Auditor Agent
**Missão:** mapear requisito → controlo → evidência; detetar evidência expirada,
em falta ou de versão errada.
**Nunca:** classifica uma não conformidade final.
**Só produz:** achados **candidatos**, separados em observação, oportunidade de
melhoria, possível não conformidade e informação insuficiente.

### NIS2 Agent
**Missão:** aplicabilidade, classificação de entidade, serviços críticos,
dependências, medidas, incidentes, evidência.
**Nota:** depende de conhecimento de transposição nacional — ver V1 em
`02_AUTHORITY_AND_SOURCE_GOVERNANCE.md`. **Este agente não pode operar enquanto
V1 estiver NÃO VERIFICADO.**

### AI Governance Agent
**Missão:** inventariar utilizações de IA, recolher contexto, propor
classificação preliminar, ligar a DPIA/FRIA quando aplicável.
**Nunca:** classifica definitivamente um sistema num nível de risco regulatório.

### Evidence Agent
**Missão:** ligar cada conclusão à respetiva fonte, versão e data.
**É o agente que torna o produto auditável.** Uma conclusão que ele não consegue
ancorar é assinalada como não ancorada — e não desaparece silenciosamente.

### Adversarial Reviewer
**Missão:** procurar erros, omissões, contradições, fontes fracas, campos
inventados, versões antigas, termos inconsistentes, conclusões demasiado
confiantes.
**Regra:** nunca é o mesmo agente que produziu, nunca partilha contexto de
raciocínio com ele, e **é avaliado por quantos problemas reais encontra**, não
por concordar.
**Modelo:** o mais capaz que o orçamento permitir — é aqui que vale a pena.

### Oracle Supervisor
**Missão:** escolher o agente, verificar a atualidade do conhecimento antes de
começar, observar o workflow, detetar bloqueios, exigir evidência, controlar
custos, pedir aprovação, manter histórico e **explicar por que razão uma ação
foi proposta**.
**Não faz o trabalho.** Coordena, bloqueia e encaminha.

Este papel não é novo: é o que a `SYSTEM-ORACLE-CONSTITUTION.md` já atribui ao
Oráculo. Esta missão dá-lhe um domínio, não uma promoção.

## Permissões mínimas

O agente que analisa um RAT **não precisa** de permissão para enviar email,
editar o repositório, ou consultar casos de outros clientes — e por isso não a
tem.

Cada agente tem sandbox própria, pastas isoladas, credenciais próprias,
orçamento próprio, logs, timeout e kill switch.

## O que falta decidir

- quantos agentes correm em paralelo por caso, e com que teto de custo;
- se o Adversarial Reviewer vê o rascunho ou só o output final;
- como se mede a qualidade de um agente ao longo do tempo
  (`10_EVALUATION_AND_AUDIT.md`);
- que agentes ficam de fora do piloto — provavelmente todos menos quatro.
