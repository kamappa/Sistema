# Migrações — convenção do Sistema

Criada no Lote 1 (2026-09-23), com a primeira migração do `main`. As 11 tabelas que já
existiam em produção nasceram no painel do Supabase e **não estão versionadas** — o
histórico anterior a esta pasta é assumidamente um vazio, não um zero. Contadas a
2026-09-24:

- em uso: `app_state`, `oracle_reports`, `radar_items`;
- de uma fase antiga, vazias, com RLS ligada e **sem nenhuma política** — nenhum papel
  da API lhes chega: `attributes`, `daily_habits`, `events`, `objectives`, `quests`,
  `training_log`, `users`, `xp_log`. Se um dia saírem, é por uma migração própria, com
  dump antes.

## Estado

| Migração | Aplicada | O que criou |
|---|---|---|
| `20260923120000_courses-e-sessoes-de-estudo` | 2026-09-24, `supabase db push` — a primeira entrada do histórico `supabase_migrations` | `courses` e `study_sessions` com RLS e a política de dono; 7 funções sem EXECUTE para o `anon`. O seed das 14 cadeiras foi gerado do vault, fora do repositório |

O detalhe de cada aplicação, com o que foi verificado, vive no SPEC, no lote que a
aplicou.

## Regras

1. **Uma migração é um ficheiro, imutável depois de aplicada.** Corrigir uma migração
   aplicada é escrever a seguinte, nunca editar a anterior.
2. **Nome:** `AAAAMMDDHHMMSS_nome-curto.sql` — o formato da CLI do Supabase, que usa os
   dígitos antes do primeiro `_` como versão (dois ficheiros do mesmo dia só com a data
   colidiam).
3. **Toda a migração tem rollback** em `supabase/rollback/`, com o mesmo nome — nunca
   dentro de `migrations/`, senão a CLI aplicava os dois seguidos no mesmo `db push`.
4. **RLS ligada e política escrita na mesma migração que cria a tabela.** Uma tabela
   sem RLS no Supabase é pública.
5. **Idempotente onde for barato** (`if not exists`, `drop policy if exists`,
   `create or replace`): uma migração que rebenta a meio deixa um esquema que ninguém
   descreveu.
6. **Nenhum dado real num ficheiro do repositório — que é público.** Seeds com dados do
   Daniel (cadeiras, horários…) geram-se no momento de aplicar, para fora do
   repositório, e mostram-se antes de correr.

## Testar

```bash
node testes/bd/bd.mjs
```

Cria um PostgreSQL local e descartável, aplica um calço mínimo do Supabase
(`testes/bd/calco-supabase.sql`: papéis da API, `auth.uid()`, privilégios por omissão),
a migração (duas vezes), os testes e o rollback, e apaga tudo no fim. Nunca toca na
base de produção.

## Aplicar

**Nenhuma migração é aplicada ao Supabase real sem o Daniel dizer, de cada vez.** Antes
da primeira: um dump guardado fora do repositório (e, até os backups automáticos da
Missão 31 existirem, um dump manual por semana). O ficheiro existir aqui não é o mesmo
que estar aplicado — cada aplicação entra na tabela do Estado, acima, e no SPEC.

Numa rede sem IPv6 o CLI não chega ao endereço direto da base (só tem IPv6): o workdir
precisa de `supabase/.temp/pooler-url` com a ligação do **Session pooler** (porta 5432),
sem password — o CLI entra com um papel de login temporário. `supabase link` não é o
remédio: pode escrever em produção.
