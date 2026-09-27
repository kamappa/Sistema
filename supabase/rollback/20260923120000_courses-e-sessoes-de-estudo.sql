-- Rollback de supabase/migrations/20260923120000_courses-e-sessoes-de-estudo.sql
--
-- ATENÇÃO: apaga TODAS as sessões de estudo e as cadeiras registadas. Não há volta
-- sem o dump feito antes. Correr só com um dump recente guardado fora do repositório.
--
-- Não toca em nada que existisse antes da migração (app_state, oracle_reports,
-- radar_items e o resto ficam como estavam). Testado: node testes/bd/bd.mjs
-- Este ficheiro NÃO vive em supabase/migrations/: a CLI aplicá-lo-ia a seguir à
-- migração e desfazia o trabalho no mesmo `db push`.

drop function if exists public.normalizar_sessoes();       -- dependem do tipo da tabela
drop function if exists public.terminar_sessao(uuid);
drop function if exists public.retomar_sessao(uuid);
drop function if exists public.pausar_sessao(uuid);
drop function if exists public.limite_sessao(timestamptz);
drop function if exists public.meia_noite_lisboa(timestamptz);
drop table if exists public.study_sessions;                -- leva o trigger, os índices e a política
drop function if exists public.study_sessions_tocar();
drop table if exists public.courses;
