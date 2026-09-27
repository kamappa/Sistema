-- 20260923120000_courses-e-sessoes-de-estudo.sql
--
-- Lote 1 (2026-09-23): Missão 34 Fase A — sessões de estudo medidas — e a tabela
-- `courses` do modelo da Missão 31, pedida pelo contrato do vault.
--
-- Só estrutura. Nenhum dado real vive neste ficheiro: o repositório é público. As
-- cadeiras entram por um seed gerado a partir do vault no momento de aplicar, fora do
-- repositório.
--
-- RLS ligada na mesma migração que cria cada tabela. Idempotente: aplicar duas vezes
-- não falha nem duplica nada. Testada em PostgreSQL local: node testes/bd/bd.mjs
-- Rollback: supabase/rollback/20260923120000_courses-e-sessoes-de-estudo.sql

-- ===================================================================== courses

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null constraint courses_nome check (char_length(name) between 1 and 120),
  short_name text constraint courses_nome_curto check (short_name is null or char_length(short_name) between 1 and 40),
  -- O NOME da pasta da cadeira no vault (ex.: Base-de-Dados), nunca o caminho: a pasta
  -- pode estar em IPCA/ ou em IPCA/_Arquivo/<semestre>/ (contrato do vault).
  vault_folder text not null constraint courses_vault_folder_nome check (vault_folder ~ '^[^/\\]+$' and char_length(vault_folder) <= 120),
  academic_year text not null constraint courses_ano_letivo_formato check (academic_year ~ '^[0-9]{4}-[0-9]{2}$'),
  semester text not null constraint courses_semestre_valido check (semester in ('S1', 'S2')),
  -- O peso da cadeira. Vazio nas arquivadas, de propósito: numa cadeira acabada não tem uso.
  ects numeric(4, 1) constraint courses_ects_positivo check (ects is null or ects > 0),
  -- Falso para as cadeiras feitas só por exame. Vazio = não se sabe (as arquivadas).
  has_classes boolean,
  -- A única marca de estado guardada (decisão de 2026-09-23). "A decorrer", "aulas
  -- terminadas", "em avaliação" e "concluída" calculam-se de classes_until e dos exames.
  active boolean not null default true,
  color text,
  classes_from date,
  classes_until date,
  created_at timestamptz not null default now(),
  constraint courses_pasta_unica unique (user_id, academic_year, semester, vault_folder),
  constraint courses_datas_aulas check (classes_from is null or classes_until is null or classes_until >= classes_from)
);

alter table public.courses enable row level security;
drop policy if exists courses_dono on public.courses;
create policy courses_dono on public.courses for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- ============================================================== study_sessions

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  course_id uuid references public.courses (id) on delete set null,
  topic_id uuid, -- tema do programa; a chave estrangeira entra com a Missão 31 (syllabus_topics)
  class_id text constraint sessao_class_id_formato check (class_id is null or class_id ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}(-[0-9]+)?$'),
  kind text not null constraint sessao_tipo_valido check (kind in ('aula', 'revisao', 'exercicios', 'recall', 'leitura', 'projeto')),
  source text not null constraint sessao_origem_valida check (source in ('cronometro', 'manual', 'recall_automatico')),
  state text not null constraint sessao_estado_valido check (state in ('ativa', 'terminada', 'por_confirmar', 'descartada')),
  -- A hora é a do servidor: o cronómetro começa com default now(), e pausar, retomar e
  -- terminar são funções (abaixo). Um telemóvel com o relógio errado não mede estudo.
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  -- Pausas: o início da pausa em curso e o total já acumulado. A Missão 34 pede o
  -- botão Pausar e o modelo dela não tinha onde o guardar (lacuna resolvida no lote).
  paused_at timestamptz,
  paused_seconds integer not null default 0 constraint sessao_pausa_positiva check (paused_seconds >= 0),
  -- Calculada, nunca escrita: o número no ecrã tem de se saber de onde veio.
  duration_min integer generated always as (
    case when ended_at is null then null
         else greatest(0, floor((extract(epoch from (ended_at - started_at)) - paused_seconds) / 60))::integer end
  ) stored,
  note text constraint sessao_nota_uma_linha check (note is null or (char_length(note) <= 140 and note !~ '[\r\n]')),
  -- Porque a fechou o Sistema e não o Daniel (só nas por_confirmar automáticas).
  closed_reason text constraint sessao_motivo_fecho check (closed_reason is null or closed_reason in ('limite_4h', 'meia_noite')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sessao_fim_depois_do_inicio check (ended_at is null or ended_at >= started_at),
  constraint sessao_estado_coerente check ((state = 'ativa') = (ended_at is null)),
  constraint sessao_pausa_so_ativa check (paused_at is null or state = 'ativa'),
  constraint sessao_manual_fechada check (source <> 'manual' or state <> 'ativa')
);

-- Uma sessão ativa de cada vez — garantido pela base, não pela interface.
create unique index if not exists study_sessions_uma_ativa on public.study_sessions (user_id) where state = 'ativa';
create index if not exists study_sessions_por_inicio on public.study_sessions (user_id, started_at desc);

alter table public.study_sessions enable row level security;
drop policy if exists study_sessions_dono on public.study_sessions;
create policy study_sessions_dono on public.study_sessions for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create or replace function public.study_sessions_tocar() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists study_sessions_tocar on public.study_sessions;
create trigger study_sessions_tocar before update on public.study_sessions
  for each row execute function public.study_sessions_tocar();

-- ========================================================= fecho automático

-- Quando uma sessão esquecida deixa de contar: 4 h depois de começar ou à
-- meia-noite de Lisboa, o que vier primeiro. Em tempo real (timestamptz): numa
-- mudança de hora, 4 h são 4 h de relógio verdadeiro.
create or replace function public.meia_noite_lisboa(inicio timestamptz) returns timestamptz
language sql stable set search_path = '' as $$
  select (date_trunc('day', inicio at time zone 'Europe/Lisbon') + interval '1 day') at time zone 'Europe/Lisbon'
$$;

create or replace function public.limite_sessao(inicio timestamptz) returns timestamptz
language sql stable set search_path = '' as $$
  select least(inicio + interval '4 hours', public.meia_noite_lisboa(inicio))
$$;

-- ============================================ pausar, retomar e terminar
-- Todas com a hora do servidor e só sobre sessões do próprio (SECURITY INVOKER: corre
-- com os direitos de quem chama, e a RLS aplica-se). Sem sessão elegível, não devolvem
-- nada — nunca um erro silencioso nem uma linha inventada.

create or replace function public.pausar_sessao(sessao uuid) returns setof public.study_sessions
language sql security invoker set search_path = '' as $$
  update public.study_sessions set paused_at = now()
  where id = sessao and user_id = (select auth.uid()) and state = 'ativa' and paused_at is null
  returning *
$$;

create or replace function public.retomar_sessao(sessao uuid) returns setof public.study_sessions
language sql security invoker set search_path = '' as $$
  update public.study_sessions
  set paused_seconds = paused_seconds + floor(extract(epoch from (now() - paused_at)))::integer,
      paused_at = null
  where id = sessao and user_id = (select auth.uid()) and state = 'ativa' and paused_at is not null
  returning *
$$;

-- Terminar antes do limite: terminada. Depois do limite (4 h ou meia-noite): fecha NO
-- limite, como por_confirmar — a regra anti-lixo vale por todos os caminhos, não só
-- pelo fecho automático. Uma pausa em curso conta como pausa até ao fim.
create or replace function public.terminar_sessao(sessao uuid) returns setof public.study_sessions
language plpgsql security invoker set search_path = '' as $$
declare
  s public.study_sessions;
  lim timestamptz;
  fim timestamptz;
  passou boolean;
begin
  select * into s from public.study_sessions
  where id = sessao and user_id = (select auth.uid()) and state = 'ativa'
  for update;
  if not found then return; end if;
  lim := public.limite_sessao(s.started_at);
  passou := now() >= lim;
  fim := least(now(), lim);
  update public.study_sessions set
    ended_at = fim,
    paused_seconds = s.paused_seconds
      + case when s.paused_at is not null and s.paused_at < fim
             then floor(extract(epoch from (fim - s.paused_at)))::integer else 0 end,
    paused_at = null,
    state = case when passou then 'por_confirmar' else 'terminada' end,
    closed_reason = case when not passou then null
                         when lim = public.meia_noite_lisboa(s.started_at) then 'meia_noite'
                         else 'limite_4h' end
  where id = s.id
  returning * into s;
  return next s;
end $$;

-- Fecha as sessões esquecidas do próprio utilizador cujo limite já passou — é o
-- terminar_sessao aplicado a cada uma, logo fecham no limite como por_confirmar: o
-- Daniel aceita, corrige ou descarta no dia seguinte. Chamada pelo cliente ao abrir a
-- app e enquanto ela está aberta — sem cron novo. Uma sessão esquecida durante a noite
-- fecha no limite, não na hora em que a app voltou a abrir.
create or replace function public.normalizar_sessoes() returns setof public.study_sessions
language plpgsql security invoker set search_path = '' as $$
declare
  s record;
begin
  for s in
    select id from public.study_sessions
    where user_id = (select auth.uid()) and state = 'ativa' and now() >= public.limite_sessao(started_at)
  loop
    return query select * from public.terminar_sessao(s.id);
  end loop;
end $$;

-- Só utilizadores autenticados. O Supabase dá EXECUTE a anon por omissão.
revoke all on function public.pausar_sessao(uuid) from public, anon;
grant execute on function public.pausar_sessao(uuid) to authenticated;
revoke all on function public.retomar_sessao(uuid) from public, anon;
grant execute on function public.retomar_sessao(uuid) to authenticated;
revoke all on function public.terminar_sessao(uuid) from public, anon;
grant execute on function public.terminar_sessao(uuid) to authenticated;
revoke all on function public.normalizar_sessoes() from public, anon;
grant execute on function public.normalizar_sessoes() to authenticated;
revoke all on function public.meia_noite_lisboa(timestamptz) from public, anon;
grant execute on function public.meia_noite_lisboa(timestamptz) to authenticated;
revoke all on function public.limite_sessao(timestamptz) from public, anon;
grant execute on function public.limite_sessao(timestamptz) to authenticated;
revoke all on function public.study_sessions_tocar() from public, anon, authenticated;
