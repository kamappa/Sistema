# Autoridade documental e protocolo de atualização

## Estado dos blocos (2026-07-25)

Os três ficheiros `*-ORACLE-BLOCK.md` **já foram integrados** nos documentos
canónicos do projeto e passaram a ser apontadores históricos. Não são fontes de
autoridade e não devem ser editados como tal:

| Bloco | Integrado em |
| --- | --- |
| `CLAUDE-ORACLE-BLOCK.md` | `CLAUDE.md`, secção "Oracle Governance Authority" |
| `SPEC-ORACLE-BLOCK.md` | `SPEC-CLAUDE-CODE.md`, secção "Programa Oracle Intelligence & Governance" |
| `ROADMAP-ORACLE-BLOCK.md` | `SYSTEM-EVOLUTION-ROADMAP.md`, Camada V |

Preservam-se para não perder a intenção nem o histórico documental. Qualquer
alteração futura faz-se no documento canónico correspondente e no ficheiro
numerado especializado desta pasta.

A ordem de precedência do projeto está registada em `CLAUDE.md` §
"Fontes de verdade e precedência" e é a única.

## Função dos quatro ficheiros principais

### `SYSTEM-ORACLE-CONSTITUTION.md`

Define leis permanentes, identidade, limites e autoridade. Continua a ser um
documento vivo e autónomo — não foi integrado em nenhum canónico.

### `CLAUDE-ORACLE-BLOCK.md` (integrado)

Definia como o Claude Code deve trabalhar quando toca no Oráculo. Vive agora
em `CLAUDE.md`.

### `SPEC-ORACLE-BLOCK.md` (integrado)

Definia o programa técnico, missões, componentes e critérios de aceitação.
Vive agora em `SPEC-CLAUDE-CODE.md`.

### `ROADMAP-ORACLE-BLOCK.md` (integrado)

Definia a sequência de evolução ao longo dos anos. Vive agora na Camada V do
`SYSTEM-EVOLUTION-ROADMAP.md`.

## Função dos ficheiros numerados

Os ficheiros numerados desenvolvem cada domínio em detalhe.

Os quatro ficheiros principais não substituem os numerados.

Os numerados não podem contradizer a Constituição.

## Regra de atualização

Quando uma decisão mudar:

1. atualizar primeiro a Constituição se for uma lei;
2. atualizar o `SPEC-CLAUDE-CODE.md` se for um requisito;
3. atualizar o `SYSTEM-EVOLUTION-ROADMAP.md` se alterar ordem;
4. atualizar o `CLAUDE.md` se alterar processo;
5. atualizar o ficheiro numerado especializado;
6. mostrar diff;
7. criar commit próprio.

Os passos 2 a 4 apontavam originalmente para os blocos; depois da integração de
2026-07-25 apontam diretamente para os documentos canónicos.

## Prevenção de duplicação

Evitar copiar páginas inteiras entre ficheiros.

Os documentos principais resumem e impõem.

Os numerados explicam e operacionalizam.
