# 11 · Privacidade, segurança e separação por cliente

## A regra que não se negoceia

> **Dados reais de clientes não entram no protótipo pessoal.**

O ambiente pessoal do Operador — com créditos pessoais, chave pessoal, máquina
pessoal — serve para prototipagem com **dados fictícios ou sanitizados**. Ponto.

Um sistema cuja proposta de valor é ajudar a cumprir obrigações de proteção de
dados não pode nascer a violá-las.

## Requisitos antes de qualquer informação real

- **Zero Data Retention** junto do fornecedor de modelo;
- **sem treino** sobre os dados enviados;
- fornecedores e modelos **numa lista aprovada**, não à escolha do agente;
- minimização — envia-se o mínimo, não o documento;
- pseudonimização e redação antes de sair do cofre;
- **segregação por cliente**, com chaves e orçamentos distintos;
- prevenção de fuga de dados na saída;
- logs **sem conteúdo sensível**;
- política de retenção e apagamento;
- autorização por utilizador e por cliente;
- trilho de auditoria;
- **kill switch**;
- aprovação humana para tudo o que sai;
- localização de dados quando o cliente ou o setor o exigir.

## Separação por cliente

```
Cliente A
├── conhecimento comum aprovado (partilhado, sem dados)
├── documentos próprios          (isolados)
├── templates aplicáveis
├── utilizadores autorizados
├── casos
├── evidências
├── decisões
└── histórico
```

**Nunca existe pesquisa transversal livre entre clientes.** Um agente a trabalhar
no cliente A não tem credenciais que cheguem ao cliente B — não é uma regra de
comportamento, é uma fronteira de permissão.

Comparação entre clientes existe apenas **anonimizada e agregada**, e a decisão
sobre se algo é suficientemente anónimo não é do sistema.

## Consulta externa

O agente extrai uma **questão sanitizada**. O documento não sai.

```
correto:   orientação atual sobre prazos de conservação em recrutamento
proibido:  analisa este processo do Cliente X com estes nomes e estes dados
```

## Onde vive cada coisa

| conteúdo | onde | porquê |
|---|---|---|
| documentos originais, versões, anexos, transcrições, drafts, relatórios | **cofre documental cifrado** | acesso por cliente, retenção, apagamento |
| estado do caso, tarefas, responsáveis, permissões, prazos, aprovações | **base de dados operacional** | consultável, com integridade |
| quem fez o quê, com que agente, com que versão, que erro, de onde retomou | **registo append-only** | não editável, auditável |
| tarefas por executar, retries, timeouts, bloqueios | **fila durável** | sobrevive a falhas |
| código, prompts aprovados, playbooks sanitizados, regras, schemas, testes | **Git privado e separado** | versionável, revisível |

## O que NUNCA entra em Git

- relatórios reais;
- documentos de clientes;
- transcrições;
- dados pessoais;
- modelos proprietários sem autorização escrita;
- normas ISO reproduzidas em extensão;
- segredos, chaves ou tokens.

**Razão técnica, e é definitiva:** remover conteúdo do histórico de Git é difícil
e **não elimina cópias já existentes** noutros clones, forks ou backups. Um
documento de cliente que entre num commit deve considerar-se divulgado.

Esta pasta — `docs/compliance-intelligence/` — vive no repositório do Sistema
porque **não contém nada disto**. Contém tipos, contratos e princípios.

## Sandbox por agente

Cada agente tem: sandbox, permissões mínimas, ferramentas permitidas por lista
fechada, pastas isoladas, credenciais próprias, orçamento próprio, logs, timeout,
kill switch, e proibição de enviar ou publicar sem aprovação.

Um runtime de agentes com acesso amplo à máquina **aumenta muito a superfície de
ataque**. Uma instalação pessoal com acesso irrestrito ao computador não é
ambiente para dados de terceiros — independentemente de quão bom seja o runtime.

## Antes de dados reais: uma avaliação de impacto

Antes de tratar informação real neste sistema, é necessária uma avaliação de
impacto sobre a proteção de dados própria — do **sistema**, não dos clientes.

Razão: tratamento em larga escala, com tecnologia nova, sobre documentação que
contém dados pessoais de terceiros, no contexto de uma relação em que a firma é
subcontratante dos seus clientes.

**Nota de verificação:** o critério legal exato que a desencadeia depende de V8
em `02_AUTHORITY_AND_SOURCE_GOVERNANCE.md`, **NÃO VERIFICADO**. A necessidade
prática não depende dessa verificação — a verificação é para citar corretamente.

## Relação contratual

A firma trata dados **por conta dos seus clientes**. Introduzir um sistema novo
nessa cadeia exige, no mínimo: instruções documentadas, garantias adequadas,
identificação dos subcontratantes ulteriores (incluindo o fornecedor de modelo),
e informação aos clientes.

Um fornecedor de IA que trate documentos de um cliente da firma **é um
subcontratante ulterior** e tem de aparecer como tal no registo.

## Modelo de ameaça — o que se assume que vai ser tentado

- injeção de instruções escondida dentro de um documento carregado;
- documento que tenta fazer o agente aceder a outro cliente;
- fonte falsa que imita um domínio oficial;
- exfiltração via pedido de pesquisa externa;
- envenenamento da aprendizagem por correções repetidas;
- credenciais dentro de um ficheiro de cliente;
- um agente a pedir mais permissões do que as que tem.

O primeiro é o mais provável e o mais subestimado: **conteúdo carregado é dados,
nunca instruções.** Um agente que encontre texto dirigido a si dentro de um
documento de cliente assinala-o e não o obedece.

## Kill switch

Um comando que pára tudo: agentes, filas, chamadas externas. Estado preservado,
nada perdido, nada em curso.

Não é para emergências dramáticas — é para o dia em que alguém repara em algo
estranho e precisa de tempo para perceber o quê.
