-- Calço mínimo do Supabase para testar migrações num PostgreSQL local e descartável.
-- Reproduz só o que as migrações do Sistema usam: os papéis da API, o auth.uid()
-- lido do JWT (como o Supabase faz), auth.users para as chaves estrangeiras, e os
-- privilégios por omissão do esquema public (as tabelas ficam acessíveis à API e é a
-- RLS que decide). Nada disto corre em produção.

create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;

grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;

create schema auth;
grant usage on schema auth to anon, authenticated, service_role;
create table auth.users (id uuid primary key, email text);

-- Igual ao do Supabase: o sub vem de request.jwt.claim.sub ou de request.jwt.claims.
create or replace function auth.uid() returns uuid
language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

-- Dois utilizadores sintéticos e uma tabela que já existe em produção, para provar
-- que a migração e o rollback não lhe tocam.
insert into auth.users (id, email) values
  ('00000000-0000-4000-8000-00000000000a', 'a@exemplo.invalid'),
  ('00000000-0000-4000-8000-00000000000b', 'b@exemplo.invalid');
create table public.app_state (user_id uuid primary key, state jsonb not null, updated_at timestamptz);
insert into public.app_state values ('00000000-0000-4000-8000-00000000000a', '{"sintetico": true}', now());
