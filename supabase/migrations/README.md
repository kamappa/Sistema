# Migrações — convenção do Sistema

Criada no Lote 1 (2026-09-23), com a primeira migração do `main`. As três tabelas que
já existiam em produção (`app_state`, `oracle_reports`, `radar_items`) nasceram no
painel do Supabase e **não estão versionadas** — o histórico anterior a esta pasta é
assumidamente um vazio, não um zero.

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
que estar aplicado — o estado de cada uma regista-se no SPEC, no lote que a aplicou.
