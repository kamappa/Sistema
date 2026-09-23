// Testes das migrações num PostgreSQL LOCAL e descartável (nunca a base de produção).
//
//   node testes/bd/bd.mjs
//
// Cria um cluster temporário, aplica o calço do Supabase (calco-supabase.sql), a
// migração, os testes e o rollback — e apaga tudo no fim. Precisa dos binários do
// PostgreSQL (initdb, pg_ctl, psql); por omissão procura-os em
// C:/Program Files/PostgreSQL/18/bin, ou em PG_BIN.
//
// Valores esperados literais, derivados à mão. Horas em Europe/Lisbon.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '..', '..');
const MIGRACAO = path.join(raiz, 'supabase/migrations/20260923120000_courses-e-sessoes-de-estudo.sql');
const ROLLBACK = path.join(raiz, 'supabase/rollback/20260923120000_courses-e-sessoes-de-estudo.sql');
const A = '00000000-0000-4000-8000-00000000000a';
const B = '00000000-0000-4000-8000-00000000000b';

const PG_BIN = process.env.PG_BIN || ['C:/Program Files/PostgreSQL/18/bin', '/usr/lib/postgresql/18/bin', '/usr/local/bin']
  .find((d) => fs.existsSync(path.join(d, process.platform === 'win32' ? 'initdb.exe' : 'initdb')));
if (!PG_BIN) { console.error('binários do PostgreSQL não encontrados — definir PG_BIN'); process.exit(2); }
const bin = (n) => path.join(PG_BIN, process.platform === 'win32' ? n + '.exe' : n);

const porta = await new Promise((r) => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => r(p)); }); });
const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'sistema-bd-'));
const dados = path.join(pasta, 'dados');

const correr = (exe, args) => spawnSync(bin(exe), args, { encoding: 'utf8', timeout: 120000, env: { ...process.env, PGCLIENTENCODING: 'UTF8' } });
// O SQL vai por ficheiro UTF-8 e não por argumento: no Windows os argumentos chegam
// ao psql na página de código ANSI, e um "é" vira um byte inválido para o servidor.
let nConsulta = 0;
function psql(sql) {
  const f = path.join(pasta, `consulta-${++nConsulta}.sql`);
  fs.writeFileSync(f, sql, 'utf8');
  const r = correr('psql', ['-h', '127.0.0.1', '-p', String(porta), '-U', 'postgres', '-d', 'postgres', '-X', '-q', '-At', '-v', 'ON_ERROR_STOP=1', '-f', f]);
  return { ok: r.status === 0, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}
const psqlFicheiro = (f) => {
  const r = correr('psql', ['-h', '127.0.0.1', '-p', String(porta), '-U', 'postgres', '-d', 'postgres', '-X', '-q', '-v', 'ON_ERROR_STOP=1', '-f', f]);
  return { ok: r.status === 0, err: (r.stderr || '').trim() };
};
/** Corre `sql` como o papel da API `authenticated`, com o JWT do utilizador `uid`. */
const como = (uid, sql, papel = 'authenticated') => psql(
  `begin; set local role ${papel}; set local "request.jwt.claim.sub" to '${uid ?? ''}'; ${sql}; commit;`);

const resultados = [];
const verificar = (nome, cond, detalhe = '') => resultados.push({ nome, ok: !!cond, detalhe });

try {
  let r = correr('initdb', ['-D', dados, '-U', 'postgres', '-A', 'trust', '-E', 'UTF8', '--no-locale']);
  if (r.status !== 0) throw new Error('initdb: ' + r.stderr);
  // stdio 'ignore': no Windows o servidor herda os canais do pg_ctl e um spawnSync com
  // 'pipe' esperava o timeout inteiro (120 s) antes de seguir — medido a 2026-09-24.
  r = spawnSync(bin('pg_ctl'), ['-D', dados, '-o', `-p ${porta} -h 127.0.0.1`, '-l', path.join(pasta, 'log.txt'), '-w', 'start'], { stdio: 'ignore', timeout: 120000 });
  if (r.status !== 0) throw new Error('pg_ctl start: ' + fs.readFileSync(path.join(pasta, 'log.txt'), 'utf8'));
  const calco = psqlFicheiro(path.join(aqui, 'calco-supabase.sql'));
  if (!calco.ok) throw new Error('calço: ' + calco.err);

  // ── A migração aplica-se, e aplica-se duas vezes (idempotente).
  const m1 = psqlFicheiro(MIGRACAO);
  verificar('migração: aplica-se', m1.ok, m1.err);
  const m2 = psqlFicheiro(MIGRACAO);
  verificar('migração: é idempotente (segunda aplicação sem erro)', m2.ok, m2.err);

  // ── RLS ligada nas duas tabelas novas, com política.
  r = psql(`select string_agg(c.relname || ':' || c.relrowsecurity || ':' || (select count(*) from pg_policies p where p.schemaname='public' and p.tablename=c.relname), ',' order by c.relname)
            from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname in ('courses','study_sessions')`);
  verificar('rls: ligada e com política em courses e study_sessions', r.out === 'courses:true:1,study_sessions:true:1', r.out || r.err);

  // ── courses
  r = como(A, `insert into public.courses (name, vault_folder, academic_year, semester, ects, has_classes) values ('Cadeira Sintética', 'Cadeira-Sintetica', '2026-27', 'S1', 6, true)`);
  verificar('courses: o utilizador cria uma cadeira sua (user_id por omissão = auth.uid())', r.ok, r.err);
  r = como(A, `insert into public.courses (name, vault_folder, academic_year, semester) values ('Repetida', 'Cadeira-Sintetica', '2026-27', 'S1')`);
  verificar('courses: a mesma pasta no mesmo semestre é recusada', !r.ok && /courses_pasta_unica/.test(r.err), r.err);
  r = como(A, `insert into public.courses (name, vault_folder, academic_year, semester, active) values ('Arquivada', 'Etica-Sintetica', '2025-26', 'S2', false)`);
  verificar('courses: arquivada sem ECTS e sem has_classes é aceite (vazio é honesto)', r.ok, r.err);
  r = como(A, `insert into public.courses (name, vault_folder, academic_year, semester) values ('Ano mal escrito', 'X', '26-27', 'S1')`);
  verificar('courses: ano letivo tem de ser AAAA-AA', !r.ok && /courses_ano_letivo_formato/.test(r.err), r.err);
  r = como(A, `insert into public.courses (name, vault_folder, academic_year, semester) values ('Pasta com barra', 'IPCA/X', '2026-27', 'S1')`);
  verificar('courses: vault_folder é um nome de pasta, não um caminho', !r.ok && /courses_vault_folder_nome/.test(r.err), r.err);
  r = como(B, `select count(*) from public.courses`);
  verificar('courses: B não vê as cadeiras de A', r.ok && r.out.split('\n').includes('0'), r.out || r.err);
  r = como(null, `select count(*) from public.courses`, 'anon');
  verificar('courses: anon não vê nada', r.ok && r.out.split('\n').includes('0'), r.out || r.err);

  // ── study_sessions: duração, coerência, uma ativa de cada vez
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at, ended_at, paused_seconds)
               values ('revisao', 'manual', 'terminada', '2026-09-01 10:00 Europe/Lisbon', '2026-09-01 11:30 Europe/Lisbon', 600)
               returning duration_min`);
  verificar('sessões: duração = fim − início − pausas (90 min − 10 min = 80)', r.ok && r.out.split('\n').includes('80'), r.out || r.err);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at, ended_at) values ('revisao','cronometro','ativa', now(), now())`);
  verificar('sessões: ativa com fim é recusada', !r.ok && /sessao_estado_coerente/.test(r.err), r.err);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at) values ('revisao','cronometro','terminada', now())`);
  verificar('sessões: terminada sem fim é recusada', !r.ok && /sessao_estado_coerente/.test(r.err), r.err);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at, ended_at) values ('revisao','manual','terminada', now(), now() - interval '1 hour')`);
  verificar('sessões: fim antes do início é recusado', !r.ok && /sessao_fim_depois_do_inicio/.test(r.err), r.err);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at) values ('revisao','manual','ativa', now())`);
  verificar('sessões: uma sessão manual nunca fica ativa', !r.ok && /sessao_manual_fechada/.test(r.err), r.err);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at, ended_at, note) values ('revisao','manual','terminada', now() - interval '1 hour', now(), E'duas\\nlinhas')`);
  verificar('sessões: a nota é uma linha', !r.ok && /sessao_nota_uma_linha/.test(r.err), r.err);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at) values ('dormir','cronometro','ativa', now())`);
  verificar('sessões: tipo fora da lista é recusado', !r.ok && /sessao_tipo_valido/.test(r.err), r.err);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at) values ('leitura','cronometro','ativa', now() + interval '1 hour')`);
  verificar('sessões: A inicia uma sessão', r.ok, r.err);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at) values ('leitura','cronometro','ativa', now())`);
  verificar('sessões: só pode haver uma ativa de cada vez', !r.ok && /study_sessions_uma_ativa/.test(r.err), r.err);
  r = como(B, `insert into public.study_sessions (kind, source, state, started_at) values ('leitura','cronometro','ativa', now() - interval '5 hours')`);
  verificar('sessões: B tem a sua própria sessão ativa', r.ok, r.err);
  r = como(B, `select count(*) from public.study_sessions`);
  verificar('sessões: B só vê a sua', r.ok && r.out.split('\n').includes('1'), r.out || r.err);
  r = como(B, `update public.study_sessions set note = 'intruso' where user_id = '${A}' returning id`);
  verificar('sessões: B não altera sessões de A', r.ok && !r.out.split('\n').some((l) => /^[0-9a-f-]{36}$/.test(l)), r.out || r.err);

  // ── limite_sessao: 4 h ou meia-noite de Lisboa, o que vier primeiro (com mudanças de hora)
  const limite = (ini) => psql(`select to_char(public.limite_sessao('${ini}'::timestamptz) at time zone 'UTC', 'YYYY-MM-DD HH24:MI')`).out;
  verificar('limite: 23:30 de 24/10/2026 fecha à meia-noite (23:00 UTC, ainda hora de verão)', limite('2026-10-24 23:30 Europe/Lisbon') === '2026-10-24 23:00', limite('2026-10-24 23:30 Europe/Lisbon'));
  verificar('limite: 00:30 de 25/10/2026 fecha às 4 h reais (03:30 UTC), apesar da hora repetida', limite('2026-10-25 00:30 Europe/Lisbon') === '2026-10-25 03:30', limite('2026-10-25 00:30 Europe/Lisbon'));
  verificar('limite: 23:00 de 27/03/2027 fecha à meia-noite (00:00 UTC)', limite('2027-03-27 23:00 Europe/Lisbon') === '2027-03-28 00:00', limite('2027-03-27 23:00 Europe/Lisbon'));
  verificar('limite: 00:30 de 28/03/2027 fecha às 4 h reais (04:30 UTC), apesar da hora saltada', limite('2027-03-28 00:30 Europe/Lisbon') === '2027-03-28 04:30', limite('2027-03-28 00:30 Europe/Lisbon'));
  verificar('limite: 10:00 de um dia normal fecha às 14:00', limite('2026-09-23 10:00 Europe/Lisbon') === '2026-09-23 13:00', limite('2026-09-23 10:00 Europe/Lisbon'));

  // ── normalizar_sessoes: fecha as esquecidas como por_confirmar, só as do próprio.
  // Início relativo à meia-noite de Lisboa, para o resultado não depender da hora a que o teste corre.
  const ontem = (hhmm) => `((date_trunc('day', now() at time zone 'Europe/Lisbon') - interval '1 day' + interval '${hhmm}') at time zone 'Europe/Lisbon')`;
  r = psql(`delete from public.study_sessions`);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at) values ('revisao','cronometro','ativa', ${ontem('00:10')})`);
  r = como(A, `select state || '|' || closed_reason || '|' || duration_min from public.normalizar_sessoes()`);
  verificar('normalizar: esquecida desde ontem 00:10 fecha às 4 h (240 min, por_confirmar)', r.ok && r.out.split('\n').includes('por_confirmar|limite_4h|240'), r.out || r.err);
  r = psql(`delete from public.study_sessions`);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at) values ('revisao','cronometro','ativa', ${ontem('22:30')})`);
  r = como(A, `select state || '|' || closed_reason || '|' || duration_min from public.normalizar_sessoes()`);
  verificar('normalizar: esquecida desde ontem 22:30 fecha à meia-noite (90 min)', r.ok && r.out.split('\n').includes('por_confirmar|meia_noite|90'), r.out || r.err);
  r = psql(`delete from public.study_sessions`);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at, paused_at) values ('revisao','cronometro','ativa', ${ontem('00:10')}, ${ontem('03:10')})`);
  r = como(A, `select state || '|' || paused_seconds || '|' || duration_min from public.normalizar_sessoes()`);
  verificar('normalizar: pausada no limite — a pausa até ao limite não conta (180 min)', r.ok && r.out.split('\n').includes('por_confirmar|3600|180'), r.out || r.err);
  r = psql(`delete from public.study_sessions`);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at) values ('revisao','cronometro','ativa', now() + interval '1 hour')`);
  r = como(A, `select count(*) from public.normalizar_sessoes()`);
  const r2 = psql(`select state from public.study_sessions`);
  verificar('normalizar: não toca numa sessão cujo limite ainda não chegou', r.ok && r.out.split('\n').includes('0') && r2.out === 'ativa', (r.out || r.err) + ' / ' + r2.out);
  r = psql(`delete from public.study_sessions`);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at) values ('revisao','cronometro','ativa', ${ontem('00:10')})`);
  r = como(B, `select count(*) from public.normalizar_sessoes()`);
  const r3 = psql(`select state from public.study_sessions`);
  verificar('normalizar: B não fecha a sessão de A', r.ok && r3.out === 'ativa', (r.out || r.err) + ' / ' + r3.out);
  r = como(null, `select count(*) from public.normalizar_sessoes()`, 'anon');
  verificar('normalizar: anon não a pode chamar', !r.ok && /permission denied/.test(r.err), r.err);

  // ── iniciar / pausar / retomar / terminar: a hora é a do servidor, nunca a do telemóvel
  r = psql(`delete from public.study_sessions`);
  r = como(A, `insert into public.study_sessions (kind, source, state) values ('revisao','cronometro','ativa')
               returning abs(extract(epoch from (started_at - now()))) < 5`);
  verificar('iniciar: started_at por omissão é a hora do servidor', r.ok && r.out.split('\n').includes('t'), r.out || r.err);
  const idAtiva = psql(`select id from public.study_sessions where state = 'ativa'`).out;
  r = como(A, `select (paused_at is not null) from public.pausar_sessao('${idAtiva}')`);
  verificar('pausar: marca o início da pausa', r.ok && r.out.split('\n').includes('t'), r.out || r.err);
  r = como(A, `select count(*) from public.pausar_sessao('${idAtiva}')`);
  verificar('pausar: pausar outra vez não reinicia a pausa', r.ok && r.out.split('\n').includes('0'), r.out || r.err);
  r = psql(`update public.study_sessions set paused_at = now() - interval '10 minutes' where id = '${idAtiva}'`);
  r = como(A, `select paused_seconds between 598 and 602 from public.retomar_sessao('${idAtiva}')`);
  verificar('retomar: soma os 10 min de pausa (600 s)', r.ok && r.out.split('\n').includes('t'), r.out || r.err);
  r = psql(`update public.study_sessions set started_at = now() - interval '30 minutes', paused_seconds = 0, paused_at = now() - interval '5 minutes' where id = '${idAtiva}'`);
  // O now() do PostgreSQL não se pode fixar: entre as 00:00 e as 00:30 de Lisboa esta
  // janela de 30 min atravessa a meia-noite, e o certo é fechar NA meia-noite (medido a
  // 2026-09-24, 00:15). Nos dois casos a expectativa é literal, não recalculada.
  const cruzaMeiaNoite = psql(`select public.limite_sessao(now() - interval '30 minutes') <= now()`).out === 't';
  r = como(A, `select state || '|' || duration_min || '|' || coalesce(closed_reason, '') || '|' || (ended_at = public.meia_noite_lisboa(started_at)) from public.terminar_sessao('${idAtiva}')`);
  // (um booleano concatenado com || passa a texto como true/false, não t/f)
  if (!cruzaMeiaNoite) verificar('terminar: pausada há 5 min de 30 — conta 25 min, terminada', r.ok && r.out.split('\n').includes('terminada|25||false'), r.out || r.err);
  else verificar('terminar: 30 min a atravessar a meia-noite — fecha NA meia-noite, por confirmar', r.ok && r.out.split('\n').some((l) => /^por_confirmar\|\d+\|meia_noite\|true$/.test(l)), r.out || r.err);
  r = como(A, `insert into public.study_sessions (kind, source, state, started_at) values ('revisao','cronometro','ativa', ${ontem('00:10')}) returning id`);
  const idVelha = r.out.split('\n').find((l) => /^[0-9a-f-]{36}$/.test(l));
  r = como(A, `select state || '|' || closed_reason || '|' || duration_min from public.terminar_sessao('${idVelha}')`);
  verificar('terminar: depois do limite fecha NO limite, como por_confirmar (240 min)', r.ok && r.out.split('\n').includes('por_confirmar|limite_4h|240'), r.out || r.err);
  r = como(A, `insert into public.study_sessions (kind, source, state) values ('leitura','cronometro','ativa') returning id`);
  const idDeA = r.out.split('\n').find((l) => /^[0-9a-f-]{36}$/.test(l));
  r = como(B, `select count(*) from public.terminar_sessao('${idDeA}')`);
  const r4 = psql(`select state from public.study_sessions where id = '${idDeA}'`);
  verificar('terminar: B não termina a sessão de A', r.ok && r.out.split('\n').includes('0') && r4.out === 'ativa', (r.out || r.err) + ' / ' + r4.out);
  for (const fn of ['pausar_sessao', 'retomar_sessao', 'terminar_sessao']) {
    r = como(null, `select count(*) from public.${fn}('${idDeA}')`, 'anon');
    verificar(`${fn}: anon não a pode chamar`, !r.ok && /permission denied/.test(r.err), r.err);
  }

  // ── apagar uma cadeira não apaga o histórico de sessões
  r = psql(`delete from public.study_sessions`);
  r = como(A, `with c as (select id from public.courses where vault_folder = 'Cadeira-Sintetica')
               insert into public.study_sessions (course_id, kind, source, state, started_at, ended_at)
               select id, 'aula', 'manual', 'terminada', now() - interval '2 hours', now() - interval '1 hour' from c`);
  r = como(A, `delete from public.courses where vault_folder = 'Cadeira-Sintetica'`);
  r = psql(`select count(*) || '|' || count(course_id) from public.study_sessions`);
  verificar('courses: apagar uma cadeira mantém as sessões, sem cadeira', r.out === '1|0', r.out || r.err);

  // ── updated_at mexe quando a sessão muda
  r = como(A, `update public.study_sessions set note = 'revista', updated_at = '2000-01-01' returning (updated_at > now() - interval '1 minute')`);
  verificar('sessões: updated_at é a hora real da alteração', r.ok && r.out.split('\n').includes('t'), r.out || r.err);

  // ── rollback: tudo o que a migração criou desaparece, o resto fica. Primeiro, prova
  // de que existia — sem isto o teste do rollback passaria em vazio.
  r = psql(`select (to_regclass('public.courses') is not null)::int + (to_regclass('public.study_sessions') is not null)::int + (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('normalizar_sessoes','limite_sessao','meia_noite_lisboa','study_sessions_tocar','pausar_sessao','retomar_sessao','terminar_sessao'))`);
  verificar('rollback: antes dele, as 2 tabelas e as 7 funções existem', r.out === '9', r.out || r.err);
  const rb = psqlFicheiro(ROLLBACK);
  verificar('rollback: aplica-se', rb.ok, rb.err);
  r = psql(`select coalesce(to_regclass('public.courses')::text,'-') || '|' || coalesce(to_regclass('public.study_sessions')::text,'-') || '|' ||
            (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('normalizar_sessoes','limite_sessao','meia_noite_lisboa','study_sessions_tocar','pausar_sessao','retomar_sessao','terminar_sessao'))`);
  verificar('rollback: tabelas e funções da migração desaparecem', r.out === '-|-|0', r.out || r.err);
  r = psql(`select count(*) from public.app_state`);
  verificar('rollback: não toca no que já existia (app_state intacta)', r.out === '1', r.out || r.err);
} catch (e) {
  resultados.push({ nome: 'arranque do teste', ok: false, detalhe: String(e) });
} finally {
  spawnSync(bin('pg_ctl'), ['-D', dados, '-m', 'fast', '-w', 'stop'], { stdio: 'ignore', timeout: 60000 });
  try { fs.rmSync(pasta, { recursive: true, force: true }); } catch { /* o Windows pode segurar ficheiros um instante */ }
}

const falhas = resultados.filter((x) => !x.ok);
// Numa falha mostra a linha do ERROR, não a primeira (que costuma ser um NOTICE inofensivo).
const linhaUtil = (d) => { const ls = String(d).split('\n'); return (ls.find((l) => /ERROR/.test(l)) || ls[0]).slice(0, 220); };
for (const x of resultados) console.log(`${x.ok ? '  ok ' : '  FALHA'} ${x.nome}${x.ok ? '' : '  → ' + linhaUtil(x.detalhe)}`);
console.log(`\n${resultados.length - falhas.length}/${resultados.length} verificações`);
process.exit(falhas.length ? 1 : 0);
